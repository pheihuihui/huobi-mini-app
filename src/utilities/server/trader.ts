import { retrieveHuobiResponse } from "./request";

export function allIn(symbol: string) {
    retrieveHuobiResponse('/v1/order/orders/place', {})
}