const express = require('express')
const mongoose = require('mongoose')
const config = require('config')
const messageModel = require('../model/messageModel.js')

const router = express.Router()
const DB_URL = config.get('mongodb.url')

mongoose.connect(DB_URL)

router.get('/', messageModel.findAll)

router.get('/:name', messageModel.findByName)

router.post('/', messageModel.create)
module.exports = router