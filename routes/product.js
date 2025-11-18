const express = require('express')
const router = express.Router()

const Controller = require('../controllers/controller')

router.get('/', Controller.getProducts)

router.get('/add', Controller.addProductForm)
router.post('/add', Controller.addProduct)

router.get('/edit/:productId', Controller.editProductForm)
router.post('/edit/:productId', Controller.editProduct)

router.get('/delete/:productId', Controller.deleteProduct)



module.exports = router