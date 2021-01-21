import { backgroundImage_dark } from "./view/themes"
import { to64_browser } from "./utilities/client/helper_browser"
import { createRestRequestFromBrowser } from "./utilities/client/request"
import { render } from "react-dom"
import { group } from "./view/ButtonGroup"

let canv = document.createElement('canvas')
canv.style.height = '100'
canv.style.width = '100'
document.body.appendChild(canv)
document.body.style.backgroundImage = backgroundImage_dark

let ele = document.createElement('div')
render(group, ele)
document.body.appendChild(ele)

declare global {
    interface Window {
        createRestRequestFromBrowser: any
        to64: any
    }
}

window.createRestRequestFromBrowser = createRestRequestFromBrowser
window.to64 = to64_browser

let ctx = canv.getContext('2d')
if (ctx) {
    ctx.fillStyle = "rgb(200,0,0)"
    ctx.fillRect(10, 10, 55, 50)
    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.fillRect(30, 30, 55, 50);
}
