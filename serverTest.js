const express = require('express')
const app = express()

app.use(express.static('dist')).listen(8080)

console.log('server open: http://localhost:8080')
