import * as ncrypto from 'crypto'
import { huobi_read_access, huobi_trade_access } from './credentials'
import { getCurrentDateTimeString } from '../shared/helper'
import { TApiType } from '../shared/meta'
import { TCommonReqFields } from '../shared/meta_request'
import { DefaultAzureCredential } from '@azure/identity'
import { SecretClient } from '@azure/keyvault-secrets'
export function to64_node(key: string, secret: string) {
    let hash = ncrypto.createHmac('sha256', Buffer.from(secret, 'utf-8'))
        .update(key)
        .digest('base64')
    return hash
}

export function getCommonReqFieldsData(type: TApiType): TCommonReqFields {
    return {
        AccessKeyId: type == 'read' ? huobi_read_access : huobi_trade_access,
        SignatureMethod: 'HmacSHA256',
        SignatureVersion: 2,
        Timestamp: getCurrentDateTimeString()
    }
}

export async function retrieveSecret(secretname: string) {
    const keyVaultName = process.env.KEY_VAULT_NAME
    const KVUri = "https://" + keyVaultName + ".vault.azure.net"
    const credential = new DefaultAzureCredential()
    const client = new SecretClient(KVUri, credential)
    return await client.getSecret(secretname)
}
