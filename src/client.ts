import { backgroundImage_dark } from "./client/view/themes"

let canv = document.createElement('canvas')
canv.style.height = '10000'
canv.style.width = '10000'
document.body.appendChild(canv)
document.body.style.backgroundImage = backgroundImage_dark

let ctx = canv.getContext('2d')
if (ctx) {
    ctx.fillStyle = "rgb(200,0,0)"
    ctx.fillRect(10, 10, 5500, 5000)
    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.fillRect(30, 30, 55, 50);
}

function testConnection() {
    const url = 'https://cryptowatcher.azurewebsites.net/top1s/count'
    fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: new Headers({
            'passwd': localStorage.getItem('passwd') ?? '',
            'Content-Type': 'application/json'
        })
    })
        .then(x => console.log(x.status))
}

declare global {
    interface Window {
        testConnection: any
    }
}

window.testConnection = testConnection