module.exports = function () {
    console.log('---Main Execute---');
    console.log(ipcRenderer);
    const recordedFlagKey = 'recorded_flag';
    ipcRenderer.on('async-message-reply', (event, arg) => {
        const message = `Message reply:${arg}`;
        console.log(message);
    });
    var listEvent = ['onclick', 'onfocus', 'onkeyup'];
    for (var key in document) {
        if (key.search('on') === 0 && listEvent.indexOf(key) >= 0) {
            document.addEventListener(key.slice(2), function (event) {
                console.log(event);
                var recordedFlagData = new Date().getTime();
                if (event.target.setAttribute && event.target.getAttribute && !event.target.getAttribute(recordedFlagKey)) {
                    event.target.setAttribute(recordedFlagKey, recordedFlagData);
                } else {
                    recordedFlagData = event.target.getAttribute(recordedFlagKey);
                }
                var focusElement = document.querySelector(':focus');
                if (focusElement && focusElement.getAttribute(recordedFlagKey) == recordedFlagData) {
                    console.log('onfocus');
                }
                console.log('-----------');
            })
        }
    }
};
