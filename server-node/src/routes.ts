import express from 'express'
import multer from 'multer'
import mulyrtConfig from './config/multer'
import PointController from './controllers/PointController'
import ItemController from './controllers/ItemController'

export const routes = express.Router()
const upload = multer(mulyrtConfig)

const pointController = new PointController()
const itemController = new ItemController()

routes.get('/itens/', itemController.list)

routes.get('/points/', pointController.list)
routes.get('/points/:id', pointController.find)
routes.post('/points/', upload.single('image'), pointController.create)