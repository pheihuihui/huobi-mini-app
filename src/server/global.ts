import proxy from 'node-global-proxy'
import nWebSocket from 'ws'
import { localProxy } from '../shared/constants'
import { CUSTOMCONNSTR_cosmosstring, huobi_read_access, huobi_read_secret, huobi_trade_access, huobi_trade_secret } from './credentials'
import { retrieveSecret } from './helper_node'
import { readOneItem } from './mongo_client'
import { retrieveHuobiResponse } from './request'
import { retrieveHoldings } from './jobs'
import { TResp_market_tickers } from '../shared/meta_response'
import { TSymbolsStair } from '../shared/helper'

type TGlobalServerStatus = {
    socket: nWebSocket | null
    state: 'locked' | 'free' | '_'
    accountID: string
    holdings: Record<string, number>
    currencys: Array<string>
    lastTickers: TResp_market_tickers
    allSymbols: TSymbolsStair
    secrets: {
        huobi_read_access: string
        huobi_read_secret: string
        huobi_trade_access: string
        huobi_trade_secret: string
        cosmosConnStr: string
    }
}

export const globals: TGlobalServerStatus = {
    socket: null,
    state: '_',
    accountID: '',
    holdings: {},
    currencys: [],
    lastTickers: [],
    allSymbols: {},
    secrets: {
        huobi_read_access: '',
        huobi_read_secret: '',
        huobi_trade_access: '',
        huobi_trade_secret: '',
        cosmosConnStr: ''
    }
}

export async function initGlobalStatus() {
    if (process.env.ENV_NAME && process.env.ENV_NAME == 'CLOUD') {
        globals.secrets.cosmosConnStr = await retrieveSecret('cosmosConnStr')
        globals.secrets.huobi_read_access = await retrieveSecret('huobi-read-access')
        globals.secrets.huobi_read_secret = await retrieveSecret('huobi-read-secret')
        globals.secrets.huobi_trade_access = await retrieveSecret('huobi-trade-access')
        globals.secrets.huobi_trade_secret = await retrieveSecret('huobi-trade-secret')
    } else {
        globals.secrets = {
            huobi_read_access: huobi_read_access,
            huobi_read_secret: huobi_read_secret,
            huobi_trade_access: huobi_trade_access,
            huobi_trade_secret: huobi_trade_secret,
            cosmosConnStr: CUSTOMCONNSTR_cosmosstring
        }
        startProxy()
    }
    await retrieveAccountID()
    await retrieveHoldings()
    let tickers = await retrieveHuobiResponse('/market/tickers', {})
    globals.lastTickers = tickers.data
}

function startProxy() {
    proxy.setConfig(localProxy)
    proxy.start()
}

async function retrieveAccountID() {
    let resp = await retrieveHuobiResponse('/v1/account/accounts', {})
    if (resp.status == 'ok') {
        let filtered = resp.data.filter(x => x.state == 'working' && x.type == 'spot')
        if (filtered.length == 1) {
            let tmp = filtered[0]
            globals.accountID = Number(tmp.id).toString()
            globals.state = 'free'
        }
    }
}
