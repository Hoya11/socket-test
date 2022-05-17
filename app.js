const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const nunjucks = require('nunjucks')


const app = express()
app.set('port', 8005);
app.set('view engine', 'html');

nunjucks.configure('views', {
    express: app,
    watch: true,
});

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.listen(port, () => {
    console.log("서버켜짐")
})