import { initGlobalStatus } from './server/global';
import { cron_every_hour, cron_every_minute } from './server/schedules';
import express from 'express'
import proxy from 'node-global-proxy';
import { localProxy } from './shared/constants';

const app = express()

initGlobalStatus()
    .then(() => {
        // cron_every_minute.start()
        // cron_every_hour.start()
        console.log('hi')
        const port = process.env.PORT || 3000
        app.listen(port)
    })
