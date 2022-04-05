const express = require('express')
const { commentController } = require('../controllers')

const passport = require('../config/passport')
const router = express.Router()
const { checkBody, checkParamId } = require('../middlewares')

const path = '/comments'

router.get(`${path}/:id`, passport.authenticate('bearer', {session: false}), checkParamId, commentController.index)
router.post(`${path}/`, passport.authenticate('bearer', {session: false}), checkBody, commentController.inputValidate, commentController.store)
router.put(`${path}/:id`, passport.authenticate('bearer', {session: false}), checkParamId, checkBody, commentController.inputValidate, commentController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer', {session: false}), checkParamId, commentController.destroy)

module.exports = router
