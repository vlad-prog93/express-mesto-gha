const router = require('express').Router()
const express = require('express')
const {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar
} = require('../controllers/users')

//get
router.get('/', getUsers)
router.get('/:userId', getUser)
//post
router.post('/', express.json(), createUser)
//patch
router.patch('/me', express.json(), updateUserInfo)
router.patch('/me/avatar', express.json(), updateUserAvatar)


module.exports = router