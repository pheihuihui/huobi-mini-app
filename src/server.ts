import * as http from 'http'
import proxy from 'node-global-proxy';
import { globals, initGlobalStatus } from './utilities/server/global';
import { cron_every_hour, cron_every_minute } from './utilities/server/schedules';
import { localProxy } from './utilities/shared/constants';

let app = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Hello World!\n')
});

// proxy.setConfig(localProxy)
// proxy.start()

initGlobalStatus()
    .then(() => {
        console.log('//////////////////////////////////////')
        console.log(globals.accountID)
        console.log(globals.holdings)
        console.log(globals.currencys)
        console.log('//////////////////////////////////////')
        cron_every_minute.stop()
        cron_every_hour.start()
        const port = process.env.PORT || 3000
        app.listen(port)
    })
