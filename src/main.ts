import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
(window as any).ipcRenderer = require('electron').ipcRenderer;
// const WebSocket = require('ws');
// (window as any).WebSocket = WebSocket;
const ws = new WebSocket('ws://localhost:8080/Inspector');
ws.onopen = (e)=>{
    console.log(e);
}
(window as any).ws = ws;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
