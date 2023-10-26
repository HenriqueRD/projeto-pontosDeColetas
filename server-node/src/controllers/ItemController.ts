import bd from '../database/connection'
import { Request, Response } from 'express'

export default class ItemController {

  async list(req: Request, res: Response) {

    const itens = await bd('item').select('*')

    const data = itens.map(x => {
      return {
        id: x.id,
        title: x.title,
        imageUrl: `http://localhost:3333/uploads/${x.imageUrl}`
      }
    })
    res.json(data)
  }
}