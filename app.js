const express = require('express')
const port = 8005
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.listen(port, () => {
    console.log("서버켜짐")
})