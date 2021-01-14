import * as ncrypto from 'crypto'
export function to64_node(key: string, secret: string) {
    let hash = ncrypto.createHmac('sha256', Buffer.from(secret, 'utf8'))
        .update(key)
        .digest('base64')
    return hash
}