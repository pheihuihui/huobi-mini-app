import { initGlobalStatus } from './server/global'
import express from 'express'
import { middles } from './server/middle'
import cors from 'cors'
import bodyParser from 'body-parser'
import { handlers } from './server/handlers'

const app = express()

app.use(cors())
app.use(middles.authentication)
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send('hello')
})

for (const hander of handlers) {
    if (hander.type == 'GET') {
        app.get(hander.name, hander.handler)
    }
    if (hander.type == 'POST') {
        app.post(hander.name, hander.handler)
    }
}

initGlobalStatus()
    .then(() => {
        const port = process.env.PORT || 3000
        app.listen(port)
    })
