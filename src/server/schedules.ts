import ncron from 'node-cron'
import { globals } from './global'
import { buyNewCoin, reconnectSocket, retrieveAllSymbols, retrieveAllSymbols_stair, retriveNewCurrencys, sortAllTickers } from './jobs'
import { insertNewItem } from './mongo_client'
import { retrieveHuobiResponse } from './request'
import { n_hbsocket, openNodeWebSocket } from './socket_node'

export const cron_every_10sec = ncron.schedule('*/10 * * * * *', () => {

    ///////////////
    sortAllTickers()
        .then(x => {
            let vals = Object.values(x)
            vals.flatMap(x => x).forEach(x => {
                if (x) {
                    insertNewItem('bigRise', {
                        symbol: x.symbol,
                        rate: (x.close - x.open) / x.open,
                        fluctuation: {}
                    })
                }
            })
        })
    ///////////////

}, { scheduled: false })

export const cron_every_hour = ncron.schedule('0 0 * * * *', async () => {

    ///////////////
    reconnectSocket()
    ///////////////


    ///////////////
    retriveNewCurrencys()
        .then(x => {
            if (x?.AddedCurrencys) {
                let coin = x.AddedCurrencys[0]
                buyNewCoin(coin)
            }
        })
    ///////////////


    ///////////////
    retrieveAllSymbols_stair()
        .then(x => {
            globals.allSymbols = x
        })
    ///////////////

}, { scheduled: false })

export const cron_every_day = ncron.schedule('0 0 0 * * *', () => {
    ///////////////
    retrieveAllSymbols()
        .then(x => insertNewItem('symbolBoard', x))
    ///////////////


}, { scheduled: false })
