const express = require('express')
const { postController } = require('../controllers')

const passport = require('../config/passport')
const upload = require('../config/multer')
const { checkBody, checkParamId } = require('../middlewares')

const router = express.Router()

const path = '/posts'

router.get(`${path}/`, postController.index)
router.get(`${path}/:id`, passport.authenticate('bearer', {session: false}), checkParamId, postController.show)
router.post(`${path}/`,passport.authenticate('bearer', {session: false}), upload.single('post_img'), checkBody, postController.inputValidate, postController.store)
router.put(`${path}/:id`,passport.authenticate('bearer', {session: false}), upload.single('post_img'), checkParamId, checkBody, postController.inputValidate, postController.update)
router.delete(`${path}/:id`, passport.authenticate('bearer', {session: false}), checkParamId, postController.destroy)

module.exports = router
