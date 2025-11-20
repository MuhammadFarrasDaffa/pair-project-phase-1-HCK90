const express = require('express')
const router = express.Router()

const Controller = require('../controllers/controller')

const routerProduct = require('./product')
const routerCategory = require('./category')
const routerProfile = require('./profile')
const routerCart = require('./cart')

router.get('/', Controller.home)

router.get('/login', Controller.loginForm)
router.post('/login', Controller.login)

router.get('/register', Controller.registerForm)
router.post('/register', Controller.register)

router.get('/logout', Controller.logout)

router.use(function (req, res, next){
    if(!req.session.user){
        res.redirect(`/login?error=Please login first!`)
    }else{
        next()
    }
})

router.use('/products', routerProduct)

router.use('/profile', routerProfile)

router.use(routerCart)

// router.use('/categories', routerCategory)

module.exports = router