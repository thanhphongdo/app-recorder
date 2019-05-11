module.exports = function () {
    class RecordData {
        constructor(event, command) {
            this.target = utils.cssPath(event.target);
            this.targets = [utils.cssPath(event.target), utils.xPath(event.target), utils.xPath(event.target, true)];
            this.command = command;
            this.comment = '';
            this.event = event;
            this.id = `${(new Date()).getTime()}_${Math.ceil(Math.random() * 10000)}`;
            ipcRenderer.send('sendRecordingData', this.toString());
        }

        toString() {
            let self = this;
            return JSON.stringify({
                id: this.id,
                target: this.target,
                targets: this.targets,
                command: this.command,
                comment: this.comment,
                value: this.value,
                source: 'browser'
            });
        }
    }

    class EventHandle {
        constructor() {
            this.currentElement = null;
            this.prevElement = null;
            this.recordDatas = [];
        }

        eventCallback(event) {
            let recordedFlagData = new Date().getTime();
            if (event.target.setAttribute && event.target.getAttribute && !event.target.getAttribute(recordedFlagKey)) {
                event.target.setAttribute(recordedFlagKey, recordedFlagData);
            } else {
                recordedFlagData = event.target.getAttribute(recordedFlagKey);
            }
            let focusElement = document.querySelector(':focus');
            if (focusElement && focusElement.getAttribute(recordedFlagKey) == recordedFlagData) {
                console.log('onfocus');
            } else {
                console.log('blur');
                if (this.currentElement && this.currentElement.event.target && this.currentElement.event.target.tagName == 'INPUT' && this.currentElement.event.target.type == 'text') {
                    this.currentElement.command = 'input';
                    this.currentElement.value = this.currentElement.event.target.value;
                    ipcRenderer.send('sendRecordingData', this.currentElement.toString());
                    console.log('=========================');
                    console.log(this.currentElement.toString());
                    console.log('=========================');
                }
            }
            switch (event.type) {
                case 'click':
                    this.prevElement = this.currentElement;
                    this.currentElement = new RecordData(event, 'click');
                    this.recordDatas.push(this.currentElement);
                    console.log(this.currentElement.toString());
                    break;
                default:
                    console.log('other');
                    break;
            }
        }
    }

    const recordedFlagKey = 'recorded_flag';
    ipcRenderer.on('async-message-reply', (event, arg) => {
        const message = `Message reply:${arg}`;
    });
    let listEvent = ['onclick', 'onfocus', 'onkeyup'];
    let eventHandle = new EventHandle();
    for (let key in document) {
        if (key.search('on') === 0 && listEvent.indexOf(key) >= 0) {
            document.addEventListener(key.slice(2), (event) => {
                eventHandle.eventCallback(event);
            });
        }
    }
};
