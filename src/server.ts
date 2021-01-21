import * as http from 'http'
import { initGlobalStatus } from './utilities/server/global';
import { cron_every_hour } from './utilities/server/schedules';

let app = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Hello World!\n')
});

initGlobalStatus()
cron_every_hour.start()
const port = process.env.PORT || 3000
app.listen(port)
