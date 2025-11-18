const express = require('express')
const app = express()
const port = 3000

const session = require('express-session')

const router = require('./routes/index')

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))

app.use(session({
    secret: 'farras-farhan',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: true
    }
}))

app.use(router)

app.listen(port, () => {
    console.log(`Running on http://localhost:${port}`);
})