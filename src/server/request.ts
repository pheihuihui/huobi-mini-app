import { urlPrefix } from '../shared/constants'
import { parenthesesFilled } from '../shared/helper'
import { TRequestMap, TReqParas, requestInfoMap, TReqMethod, TApiType, TResponseMap, TRequestName } from '../shared/meta'
import nfetch, { Response } from 'node-fetch'
import { getCommonReqFieldsData, to64_node } from './helper_node'
import { TReqBase } from '../shared/meta_request'
import { huobi_read_secret, huobi_trade_secret } from './credentials'
import { TPromiseRespV1, TPromiseRespV2, TRespV1, TRespV2 } from '../shared/meta_response'
import { globals } from './global'

export async function retrieveHuobiResponse<K extends keyof TResponseMap>(reqName: K, paras: TReqParas<K>) {
    let resp = await createRestRequestFromNode(reqName, paras)
    let json = await resp.json()
    type T_v2 = `/v2/${string}`
    type TResp<T> = T extends T_v2 ? TRespV2<T> : TRespV1<T>
    return json as TResp<TResponseMap[K]>
}

async function createRestRequestFromNode<K extends keyof TRequestMap>(reqName: K, paras: TReqParas<K>) {
    let reqInfo = requestInfoMap[reqName]
    let url = (reqInfo.method == 'GET' && paras.json) ?
        buildUrlFromAllFields_GET(reqName, paras.json as TReqBase, paras.path) :
        buildUrlFromOnlyCommonFields(reqInfo.method, reqName, paras.path)
    let info: { url: string, init?: { method: string, body?: string } } = (paras.json) ?
        { url: urlPrefix + url, init: { method: reqInfo.method, body: JSON.stringify(paras.json) } } :
        { url: urlPrefix + url, init: { method: reqInfo.method } }
    let req: Promise<Response> = !(info.init && info.init.method == 'POST') ?
        nfetch(info.url, { method: 'GET', timeout: 0 }) :
        (info.init.body) ?
            nfetch(info.url, { method: 'POST', body: info.init.body, headers: { 'Content-Type': 'application/json' } }) :
            nfetch(info.url, { method: 'POST' })
    return req
}

function buildUrlFromOnlyCommonFields(method: TReqMethod, reqName: string, pathParas?: string) {
    let reqname = reqName
    if (pathParas) reqname = parenthesesFilled(reqName, pathParas)
    let tmp: TApiType = method == 'GET' ? 'read' : 'trade'
    let obj = getCommonReqFieldsData(tmp) as Record<string, boolean | number | string>
    let keys = Object.keys(obj).sort()
    let part1 = keys.map(x => `${x}=${obj[x].toString()}`).join('&')
    let part2 = ""
    if (method == 'GET') part2 = 'GET\napi.huobi.pro\n' + reqname + '\n' + part1
    if (method == 'POST') part2 = 'POST\napi.huobi.pro\n' + reqname + '\n' + part1
    let scrtk = method == 'GET' ? globals.secrets.huobi_read_secret : globals.secrets.huobi_trade_secret
    let part3 = to64_node(part2, scrtk)
    return `${reqname}?${part1}&Signature=${part3}`
}

function buildUrlFromAllFields_GET(reqName: string, jsonParas: Record<string, boolean | number | string>, pathParas?: string) {
    let reqname = reqName
    if (pathParas) {
        reqname = parenthesesFilled(reqName, pathParas)
    }
    let obj = { ...getCommonReqFieldsData('read'), ...jsonParas } as Record<string, boolean | number | string>
    let keys = Object.keys(obj).sort()
    let part1 = keys.map(x => `${x}=${obj[x].toString()}`).join('&')
    let part2 = 'GET\napi.huobi.pro\n' + reqname + '\n' + part1
    let part3 = to64_node(part2, globals.secrets.huobi_trade_secret)
    return `${reqname}?${part1}&Signature=${part3}`
}

