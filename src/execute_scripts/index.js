module.exports = function () {
    console.log(utils);
    class RecordData {
        constructor(event, command) {
            this.target = event.target;
            this.targets = [];
            this.command = command;
            this.comment = '';
            this.event = event;
            this.id = (new Date()).getTime() + '_' + Math.ceil(Math.random() * 10000);
        }

        toString() {
            var self = this;
            return JSON.stringify({
                id: this.id,
                targets: this.targets,
                command: this.command,
                comment: this.comment
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
    var listEvent = ['onclick', 'onfocus', 'onkeyup'];
    var eventHandle = new EventHandle();
    for (var key in document) {
        if (key.search('on') === 0 && listEvent.indexOf(key) >= 0) {
            document.addEventListener(key.slice(2), function (event) {
                eventHandle.eventCallback(event);

            })
        }
    }
};
