import { backgroundImage_dark } from "./style/themes"
import { createRestRequestFromBrowser } from "./utilities/client/request"

let canv = document.createElement('canvas')
canv.style.height = '100'
canv.style.width = '100'
document.body.appendChild(canv)
document.body.style.backgroundImage = backgroundImage_dark

declare global {
    interface Window {
        createRestRequestFromBrowser: any
        num1: number
        num2: number
    }
}

window.createRestRequestFromBrowser = createRestRequestFromBrowser

let ctx = canv.getContext('2d')
if (ctx) {
    ctx.fillStyle = "rgb(200,0,0)"
    ctx.fillRect(10, 10, 55, 50)
    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.fillRect(30, 30, 55, 50);
}
