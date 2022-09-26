import express from 'express'
import mongoose, { Schema } from 'mongoose'
import config from 'config'

const MessageSchema = mongoose.Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    text: String,
    created_at: { type: Date, default: Date.now },
    modified_at: { type: Date, default: Date.now }
})

const Message = mongoose.model('Message', MessageSchema)

const router = express.Router()
const DB_URL = config.get('mongodb.url')

mongoose.connect(DB_URL)
router.get('/', (req, res) => {
    Message.find((err, messages) => {
        if (err) res.status(500).send(err)
        res.json(messages)
    })
})

router.get('/:name', (req, res) => {
    Message.find({ name: req.params.name }, (err, messages) => {
        res.send(messages)
    })
})

router.post('/', async (req, res) => {
    const id = new mongoose.Types.ObjectId()
    const message = new Message(Object.assign({
        _id: id
    }, req.body))

    try {
        await message.save()
        console.log(`Saving message ${message.name} + ${message.text}`)
        req.app.get('socketio').emit('chat', req.body)
        res.sendStatus(200)
    }
    catch (error) {
        res.sendStatus(500);
        return console.log('error', error)
    }
    finally {
        console.log('Message Posted')
    }
})

export default router