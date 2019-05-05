module.exports = function () {
    console.log('---Main Execute---');
    console.log(ipcRenderer);
    ipcRenderer.on('async-message-reply', (event, arg) => {
        const message = `Message reply:${arg}`;
        console.log(message);
    });
};
