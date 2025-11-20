const express = require('express')
const router = express.Router()

const Controller = require('../controllers/controller')

router.get('/:userId', Controller.userProfile)

router.get('/history/:userId', Controller.userHistory)

router.post('/:userId/edit', Controller.editUserProfile)

module.exports = router