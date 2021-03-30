import ncron from 'node-cron'
import { globals } from './global'
import { reconnectSocket, retrieveAllSymbols, retriveNewCurrencys } from './jobs'
import { insertNewItem } from './mongo_client'
import { observer } from './observer'
import { retrieveHuobiResponse } from './request'
import { n_hbsocket, openNodeWebSocket } from './socket_node'

export const cron_every_10sec = ncron.schedule('*/10 * * * * *', () => {

}, { scheduled: false })

export const cron_every_hour = ncron.schedule('0 0 * * * *', () => {
    ///
    reconnectSocket()

    ///
    retriveNewCurrencys()

}, { scheduled: false })

export const cron_every_day = ncron.schedule('0 0 0 * * *', () => {
    ///
    retrieveAllSymbols()
        .then(x => insertNewItem('symbolBoard', x))


}, { scheduled: false })
