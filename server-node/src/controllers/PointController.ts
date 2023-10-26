import connection from '../database/connection'
import { Request, Response, response } from 'express'

export default class PointController {

  async create(req: Request, res: Response) {
    
    const data = {
      image: req.file?.filename,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      city: req.body.city,
      uf: req.body.uf,
      longitude: req.body.longitude,
      latitude: req.body.latitude,
    }

    const db = await connection.transaction()

    const id =  await db('point').insert(data)

    const itemsData = req.body.itens.split(',').map((x:String)  => Number(x.trim()))
    const itens = itemsData.map((item_id:Number) => {
      return {
        point_id: id[0],
        item_id
      }
    })
  
    await db('point_item').insert(itens)

    db.commit()

    res.json({
      id: id[0],
      ...data,
    })
  }

  async find(req: Request, res: Response) {

    const data = await connection('point').where('id', req.params.id).first()

    if (!data) {
      return response.status(400).json({message: "error not find point"})
    }

    const itens = await connection('item').select('title').innerJoin('point_item', 'item.id', '=', 'point_item.item_id').where('point_id', req.params.id)
    
    res.json({
      ...data,
      image: `http://localhost:3333/uploads/${data.image}`,
      itens
    })
  }

  async list(req: Request, res: Response) {

    const itens = (String(req.query.itens)).split(',').map(x => Number(x.trim()))

    const data = await connection('point').select('point.*').innerJoin('point_item', 'point.id', '=', 'point_item.point_id').where('uf', String(req.query.uf)).where('city', String(req.query.city)).whereIn('point_item.item_id', itens).distinct()
    
    res.json(data)
  }
}