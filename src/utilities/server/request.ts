import { urlPrefix } from '../shared/constants'
import { parenthesesFilled } from '../shared/helper'
import { IRequestNameMap, TReqParas, requestInfoMap, TReqMethod, TApiType } from '../shared/meta'
import nfetch, { Response } from 'node-fetch'
import { getCommonReqFieldsData, to64_node } from './helper_node'
import { TReqBase } from '../shared/meta_request'
import { huobi_read_secret, huobi_trade_secret } from './credentials'

export async function createNewRestRequestFromNode<K extends keyof IRequestNameMap>(reqName: K, paras: TReqParas<K>) {
    let reqInfo = requestInfoMap[reqName]
    let url = ''
    if (reqInfo.method == 'GET' && paras.json) {
        url = await buildUrlFromAllFields_GET(reqName, paras.json as TReqBase, paras.path)
    } else {
        url = await buildUrlFromOnlyCommonFields(reqInfo.method, reqName, paras.path)
    }
    let info: { url: string, init?: { method: string, body?: string } }
    if (paras.json) {
        info = { url: urlPrefix + url, init: { method: reqInfo.method, body: JSON.stringify(paras.json) } }
    } else {
        info = { url: urlPrefix + url, init: { method: reqInfo.method } }
    }

    let req: Promise<Response>
    if (info.init && info.init.method == 'POST') {
        if (info.init.body) {
            req = nfetch(info.url, { method: 'POST', body: info.init.body, headers: { 'Content-Type': 'application/json' } })
        } else {
            req = nfetch(info.url, { method: 'POST' })
        }
    } else {
        req = nfetch(info.url, { method: 'GET' })
    }
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
    let scrtk = method == 'GET' ? huobi_read_secret : huobi_trade_secret
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
    let part3 = to64_node(part2, huobi_trade_secret)
    return `${reqname}?${part1}&Signature=${part3}`
}
