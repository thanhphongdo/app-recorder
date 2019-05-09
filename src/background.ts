'use strict';

import {
    app, protocol, BrowserWindow, ipcRenderer
} from 'electron';
import {
    createProtocol,
    installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib';

const isDevelopment = process.env.NODE_ENV !== 'production';
// const electron = require("electron");
const ipc = require('electron').ipcMain;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null;
let recorderWindow: BrowserWindow | null;
let recorderEditorWindow: BrowserWindow | null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true } }]);

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.maximize();
    recorderEditorWindow = new BrowserWindow({
        x: 0,
        y: 0,
        // movable: false,
        // resizable: false,
        autoHideMenuBar: true,
        // frame: true,
        webPreferences: {
            nodeIntegration: true
        },
        parent: mainWindow as BrowserWindow,
        modal: true,
        show: false,
        focusable: true,
        acceptFirstMouse: true
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        let url = process.env.WEBPACK_DEV_SERVER_URL as string;
        mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
        mainWindow.webContents.openDevTools({
            mode: 'bottom'
        });
    } else {
        createProtocol('app');
        mainWindow.loadURL('app://./index.html');
        mainWindow.webContents.openDevTools({
            mode: 'bottom'
        });
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    // recorderEditorWindow.show();
    // recorderEditorWindow.setBounds({
    //   width: mainWindow.getBounds().width * 0.2,
    //   height: mainWindow.getBounds().height,
    //   x: mainWindow.getBounds().x,
    //   y: mainWindow.getBounds().y
    // });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        try {
            await installVueDevtools();
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString());
        }
    }
    createWindow();
    ipc.on('startRecording', (event: any, url: string) => {
        console.log('---startRecording---');

        if (recorderWindow) {
            (recorderWindow as BrowserWindow).loadURL(url);
            recorderWindow.show();
            return;
        }

        recorderWindow = new BrowserWindow({
            webPreferences: {
                nodeIntegration: true
            },
            parent: mainWindow as BrowserWindow,
            frame: true,
            show: false
            // focusable: true,
            // acceptFirstMouse: true,
            // resizable: false,
            // movable: false,
            // titleBarStyle: "hidden",

        });
        recorderWindow.on('closed', () => {
            recorderWindow = null;
        });
        recorderWindow.webContents.openDevTools({
            mode: 'bottom'
        });
        // recorderWindow.setBounds({
        //   width: (mainWindow as BrowserWindow).getBounds().width * 0.8 - 1,
        //   height: (mainWindow as BrowserWindow).getBounds().height,
        //   x: (mainWindow as BrowserWindow).getBounds().width * 0.2 + 1,
        //   y: (mainWindow as BrowserWindow).getBounds().y
        // });


        let utils = require('./execute_scripts/utils.js');
        let script = require('./execute_scripts/index.js');
        script = `
            var ipcRenderer = require('electron').ipcRenderer;
            window.utils = (${utils.toString()})();
            (${script.toString()})();`;
        script = script.replace('__webpack_require__', 'require');

        recorderWindow.webContents.on('did-finish-load', () => {
            (recorderWindow as any).webContents.executeJavaScript(script);
        });
        (recorderWindow as BrowserWindow).loadURL(url);
        recorderWindow.show();
    });

    ipc.on('sendRecordingData', (event: any, data: string) => {
        console.log(data);
        (mainWindow as BrowserWindow).webContents.executeJavaScript(`processData(${data})`);
    });
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
