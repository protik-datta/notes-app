const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const noteRoutes = require('./src/routes/note.routes')
const authRoutes = require('./src/routes/auth.routes')

app.use('/api/auth', authRoutes)
app.use('/api/notes', noteRoutes)

module.exports = app
