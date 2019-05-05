'use strict';

import { app, protocol, BrowserWindow } from 'electron';
import {
    createProtocol,
    installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true } }]);

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    let script = require('./execute_scripts/index.js');
    script = `
            var ipcRenderer = require('electron').ipcRenderer;
            (${script.toString()})();`;
    script = script.replace('__webpack_require__', 'require');

    if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
        let url = process.env.WEBPACK_DEV_SERVER_URL as string;
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
        console.log(url);
        // if (!process.env.IS_TEST) win.webContents.openDevTools()
        win.webContents.openDevTools();
        win.maximize();
        win.webContents.on('did-finish-load', () => {
            // console.log(test.toString());
            (win as any).webContents.executeJavaScript(script);
        });
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        win.loadURL('app://./index.html');
        win.maximize();
        win.webContents.openDevTools();
        win.webContents.on('did-finish-load', () => {
            // console.log(test.toString());
            (win as any).webContents.executeJavaScript(script);
        });
    }

    win.on('closed', () => {
        win = null;
    });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
        try {
            await installVueDevtools();
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString());
        }
    }
    createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit();
            }
        });
    } else {
        process.on('SIGTERM', () => {
            app.quit();
        });
    }
}
