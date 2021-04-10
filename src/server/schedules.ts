import ncron from 'node-cron'
import { globals } from './global'
import { buyNewCoin, reconnectSocket, retrieveAllSymbols, retriveNewCurrencys } from './jobs'
import { insertNewItem } from './mongo_client'
import { retrieveHuobiResponse } from './request'
import { n_hbsocket, openNodeWebSocket } from './socket_node'

export const cron_every_10sec = ncron.schedule('*/10 * * * * *', () => {

}, { scheduled: false })

export const cron_every_hour = ncron.schedule('0 0 * * * *', async () => {
    //
    reconnectSocket()

    //
    let curs = await retriveNewCurrencys()
    if (curs?.AddedCurrencys) {
        let coin = curs.AddedCurrencys[0]
        buyNewCoin(coin)
    }

}, { scheduled: false })

export const cron_every_day = ncron.schedule('0 0 0 * * *', () => {
    //
    retrieveAllSymbols()
        .then(x => insertNewItem('symbolBoard', x))


}, { scheduled: false })
