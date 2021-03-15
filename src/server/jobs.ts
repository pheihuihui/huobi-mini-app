import { retrieveHuobiResponse } from "./request";

export async function testDelay() {
    let start = Date.now()
    let serverTs = 0
    let end = 0
    await retrieveHuobiResponse('/v1/common/currencys', {})
    end = Date.now()
    return {
        server_start: start,
        server_end: end
    }
}