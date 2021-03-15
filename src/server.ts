import { initGlobalStatus } from './server/global';
import { cron_checkSocket, cron_every_10sec, cron_every_day, cron_every_hour, retrieveAllSymbols } from './server/schedules';
import express from 'express'
import proxy from 'node-global-proxy';
import { localProxy } from './shared/constants';
import { openNodeWebSocket } from './server/socket_node';
import { m_authentication, m_log } from './server/middle';
import { query_board, query_delay, query_topIncreaseCount, query_topIncreases } from './server/handlers';
import cors from 'cors'

const app = express()

app.use(cors())
app.use(m_authentication)

app.get('/', function (req, res) {
    res.send('hello')
})

app.get('/top1s', query_topIncreases)
app.get('/top1s/count', query_topIncreaseCount)
app.get('/board', query_board)
app.get('/test/delay', query_delay)

initGlobalStatus()
    .then(() => {
        openNodeWebSocket()
        cron_every_10sec.start()
        cron_checkSocket.start()
        cron_every_day.start()
        retrieveAllSymbols()
        const port = process.env.PORT || 3000
        app.listen(port)
    })
