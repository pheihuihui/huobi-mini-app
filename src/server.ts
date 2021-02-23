import { initGlobalStatus } from './server/global';
import { cron_checkSocket, cron_every_10sec, cron_every_hour } from './server/schedules';
import express from 'express'
import proxy from 'node-global-proxy';
import { localProxy } from './shared/constants';
import { openNodeWebSocket } from './server/socket_node';

const app = express()

// proxy.setConfig(localProxy)
// proxy.start()

initGlobalStatus()
    .then(() => {
        openNodeWebSocket()
        cron_every_10sec.start()
        cron_checkSocket.start()
        const port = process.env.PORT || 3000
        app.listen(port)
    })
