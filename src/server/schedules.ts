import ncron from 'node-cron'
import { globals } from './global'
import { buy, retrieveAllSymbols_stair, retriveNewCurrencys, sortAllTickers, transfer2btc } from './jobs'
import { insertNewItem } from './mongo_client'

function __sortAllTickers() {
    sortAllTickers()
        .then(x => {
            let vals = Object.values(x)
            vals.flatMap(x => x).forEach(x => {
                if (x) {
                    if (x.close > x.open) {
                        insertNewItem('bigRise', {
                            symbol: x.symbol,
                            rate: (x.close - x.open) / x.open,
                            fluctuation: {}
                        })
                    }
                    if (x.close < x.open) {
                        insertNewItem('bigFall', {
                            symbol: x.symbol,
                            rate: (x.close - x.open) / x.open,
                            fluctuation: {}
                        })
                    }
                }
            })
        })
}

function __buyNewCoin() {
    retriveNewCurrencys()
        .then(x => {
            if (x) {
                let curs = Object.keys(x)
                let cur = curs[0]
                let sbs = x[cur]
                let sb_usdt = sbs.filter(x => x.split('--')[1] == 'usdt')
                let sb_btc = sbs.filter(x => x.split('--')[1] == 'btc')
                if (sb_usdt.length == 1) {
                    buy(cur)
                } else if (sb_btc.length == 1) {
                    transfer2btc()
                        .then(() => {
                            buy(cur, { quoteCoin: 'btc' })
                        })
                }
            }
        })
}

function __retrieveAllSymbols_stair() {
    retrieveAllSymbols_stair()
        .then(x => {
            globals.allSymbols = x
        })
}

const cron_every_10sec = ncron.schedule('*/10 * * * * *', () => {
    __sortAllTickers()
}, { scheduled: false })

const cron_every_hour = ncron.schedule('0 0 * * * *', async () => {
    __buyNewCoin()
    __retrieveAllSymbols_stair()
}, { scheduled: false })

const cron_every_day = ncron.schedule('0 0 0 * * *', () => {

}, { scheduled: false })


export function startCrons() {
    // cron_every_10sec.start()
    cron_every_hour.start()
}