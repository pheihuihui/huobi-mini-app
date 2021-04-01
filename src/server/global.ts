import proxy from 'node-global-proxy'
import nWebSocket from 'ws'
import { localProxy } from '../shared/constants'
import { CUSTOMCONNSTR_cosmosstring, huobi_read_access, huobi_read_secret, huobi_trade_access, huobi_trade_secret } from './credentials'
import { retrieveSecret } from './helper_node'
import { readOneItem } from './mongo_client'
import { retrieveHuobiResponse } from './request'
import { retrieveHoldings } from './jobs'

type TGlobalServerStatus = {
    socket: nWebSocket | null
    state: 'locked' | 'free'
    accountID: string
    holdings: Record<string, number>
    currencys: Array<string>
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
    state: 'free',
    accountID: '',
    holdings: {},
    currencys: [],
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
        proxy.setConfig(localProxy)
        proxy.start()
    }
    await retrieveAccountID()
    await retrieveHoldings()
}

async function retrieveAccountID() {
    let resp = await retrieveHuobiResponse('/v1/account/accounts', {})
    if (resp.status == 'ok') {
        resp.data.forEach(x => {
            if (x.type == 'spot') {
                globals.accountID = Number(x.id).toString()
            }
        })
    }
}
