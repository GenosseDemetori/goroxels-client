import _ from './assets'

import Socket from './Socket';
import globals from './globals';
import ChunkManager from './ChunkManager';
import Renderer from './Renderer';
import camera from './camera';
import player from './player';
import ToolManager from './ToolManager'
import {
    isDarkColor,
    insanelyLongMobileBrowserCheck
} from './utils'
import {
    palette
} from './config'

const isMobile = insanelyLongMobileBrowserCheck();

let elements = {
    mainCanvas: document.getElementById('board'),
    palette: document.getElementById('palette'),
    online: document.getElementById('onlineCounter'),
    coords: document.getElementById('coords')
}

window.onresize = () => {
    elements.mainCanvas.width = window.innerWidth;
    elements.mainCanvas.height = window.innerHeight;

    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.oImageSmoothingEnabled = false;

    renderer.needRender = true;
}

palette.forEach((color, id) => {
    const el = document.createElement('div');
    el.style.backgroundColor = `rgb(${color.join(',')})`;
    el.classList = ['paletteColor ' + (isDarkColor(...color) ? 'dark' : 'light')];

    el.onclick = () => {
        player.color = id;
    }

    elements.palette.appendChild(el);
})

const ctx = elements.mainCanvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const socket = new Socket(1488);
globals.socket = socket;

const chunkManager = new ChunkManager();
globals.chunkManager = chunkManager;

const renderer = window.renderer = new Renderer(ctx);
globals.renderer = renderer;

/* const eventManager = */new ToolManager(document.getElementById('board'));

const renderLoop = () => {
    requestAnimationFrame(() => {
        renderer.requestRender();
        renderLoop();
    })
}
renderLoop();

window.onresize();

socket.once('opened', () => {
    renderer.needRender = true;
});

socket.on('online', count => {
    elements.online.innerText = count;
});