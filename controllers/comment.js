const db = require('../models')
const fs = require('fs')
const { Validator } = require('node-input-validator');
const Comment = db.Comment
const Post = db.Post
const User = db.User

const findByPK = async (id,res,include = []) => {
  const data = await Comment.findByPk(id, { include })
  if(data){
    return data
  }
  return res.status(404).json({
    message: 'Not Found'
  })
}

module.exports = {
  inputValidate: async (req,res,next) => {
    const v = new Validator(req.body, Comment.inputSchema);
    const matched = await v.check();
    if (matched) {
      next()
    }else{
      console.log(v.errors);
      return res.status(400).json({
        message: 'Bad request.'+ v.errors
      })
    }
  },
  index: async (req, res, next) => {
    const post_id = req.params.id
    const {
      page,
      size,
      q
    } = req.query

    var where = {
      post_id
    }

    if (q) {
      where = {
        ...where,
        ...{
          comment: {
            [Op.like]: `%${q}%`
          }
        }
      }
    }
    const {
      limit,
      offset
    } = db.getPagination(page, size)
    try {
      const lists = await Comment.findAndCountAll({
        include: User,
        where,
        limit,
        offset
        // order: [
        //   ['id', 'desc']
        // ]
      })
      return res.json(db.getPagingData(lists, page, limit))
    } catch (e) {
      e.message = 'Cannot get data from database.'
      next(e)
    }
  },
  store: async (req, res, next) => {
    var data = req.body
    data.user_id = req.user.id
    try {
      const newData = await db.sequelize.transaction((t) => {
        return Comment.create(data, {
          transaction: t
        })
      })
      return res.status(201).json(newData)
    } catch (e) {
      e.message = 'Cannot store data from database.'
      next(e)
    }
  },
  update: async (req, res, next) => {
    const id = req.params.id
    const data = req.body
    const oldData = await findByPK(id,res,[Post])
    if (['admin'].includes(req.user.role) || req.user.id === oldData.user_id || req.user.id === oldData.Post.user_id) {
      const where = {
        id
      }
      try {
        await db.sequelize.transaction(async (t) => {
          return Comment.update(
            data, {
              where
            }, {
              transaction: t
            }
          )
        })
        return res.json(data)
      } catch (e) {
        e.message = 'Cannot update data from database.'
        next(e)
      }
    }else{
      return res.status(403).json({
        message: 'Forbidden.'
      })
    }
  },
  destroy: async (req, res, next) => {
    const id = req.params.id
    const oldData = await findByPK(id,res,[Post])
    if (['admin'].includes(req.user.role) || req.user.id === oldData.user_id || req.user.id === oldData.Post.user_id) {
      try {
        await oldData.destroy()
        return res.status(204).send()
      } catch (e) {
        e.message = 'Cannot remove data from database.'
        next(e)
      }
    }else{
      return res.status(403).json({
        message: 'Forbidden.'
      })
    }
  }
}
