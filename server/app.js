const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const noteRoutes = require('./src/routes/note.routes')

app.use('/api/notes',noteRoutes)

module.exports = app
