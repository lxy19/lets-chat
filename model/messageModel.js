const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    text: String,
    created_at: { type: Date, default: Date.now },
    modified_at: { type: Date, default: Date.now }
})

const messageModel = mongoose.model('Message', MessageSchema)

exports.findAll = (req, res) => {
    messageModel.find((err, messages) => {
        if (err) res.status(500).send(err)
        res.json(messages)
    })
}

exports.findByName = (req, res) => {
    messageModel.find({ name: req.params.name }, (err, messages) => {
        res.send(messages)
    })
}

exports.create = async (req, res) => {
    const id = new mongoose.Types.ObjectId()
    const message = new messageModel(Object.assign({
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
}
