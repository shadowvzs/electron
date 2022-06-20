const style = `
    .notify-container {
        position: fixed;
        top: 0;
        right: 0;
        margin: 0 4px;
        min-width: 200px;
        max-width: 400px;
        height: auto;
        overflow-y: auto;
        overflow-x: hidden;
        z-index: 9999;
        width: 300px;
    }

    .notify-container .notify {
        position: relative;
        color: #fff;
        border: 1px solid rgba(0, 0, 0, 0.3);
        border-radius: 4px;
        padding: 15px;
        padding-right: 20px;
        width: auto;
        max-width: 400px;
        height: auto;
        opacity: 1;
        margin: 3px 0 3px 3px;
        transform: translateX(100%);
        font-family: arial;
        font-size: 14px;
        transition: transform 0.72s;
        box-shadow: 0px 0 2px 2px rgba(0, 0, 0, 0.2);
    }

    .notify-container .notify.warning {
        border-color: rgba(255, 255, 0, 0.9);
        background-color: rgba(255, 255, 0, 0.5);
    }

    .notify-container .notify.notice {
        border-color: rgba(0, 0, 200, 0.9);
        background-color: rgba(0, 0, 200, 0.5);
    }

    .notify-container .notify.success {
        border-color: rgba(100, 100, 255, 0.9);
        background-color: rgba(100, 100, 255, 0.5);
    }

    .notify-container .notify.error {
        border-color: rgba(255, 50, 50, 0.9);
        background-color: rgba(255, 50, 50, 0.5);
    }

    .notify-container .notify.normal {
        border-color: rgba(0, 0, 0, 0.9);
        background-color: rgba(0, 0, 0, 0.5);
    }

    .notify-container .notify.slidein { transform: translateX(0%); }
    .notify-container .notify.fade-out { 
        opacity: 0;
        transition: opacity 500ms ease-in-out;
    }

    .notify-container .notify .close-notify {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: inline-block;
        margin: auto;
        right: 10px;
        font-family: arial;
        font-size: 30px;
        color: red;
        opacity: 0.3;
        cursor: pointer;
        text-shadow: 1px 0 1px #000, -1px 0 1px #000, 0 -1px 1px #000, 0 1px 1px #000;
    }

    .notify-container .notify .close-notify:hover { opacity: 0.7 }
`;

export class Notify {

    static instance;
    static init(config) { this.instance = new Notify(config); return this.instance; }
    static send(type, message) { (this.instance || this.init()).send(type, message); }

    $notifyContainer;
    $styleContainer;
    map = new WeakMap();
    NOTIFY_DURATION = 3000;
    LETTER_DURATION_RATIO = 100;
    NOTIFY_CONTAINER_CLASS = 'notify-container';
    CLOSE_CLASS = 'close-notify';
    TRANSITION_CLASS = 'slidein';
 
    constructor(config = {}) {
        const $parent = config.container 
            ? (
                typeof config.container === 'string' 
                    ? document.querySelector<HTMLElement>(config.container)
                    : config.container
            )
            : document.body;
        this.$notifyContainer = document.createElement('div');
        this.$notifyContainer.className = this.NOTIFY_CONTAINER_CLASS;
        $parent.appendChild(this.$notifyContainer);

        this.$styleContainer = document.head.querySelector<HTMLStyleElement>('style[data-id="notify-container"]');
        if (!this.$styleContainer) {
            this.$styleContainer = document.createElement('style');
            this.$styleContainer.type = 'text/css';
            const cssStyle = style + (config.cssStyle || '')
            this.$styleContainer.appendChild(document.createTextNode(cssStyle));
            document.head.appendChild(this.$styleContainer);
        }
    }



    newMessageElement = ({ closeClass, message, onTransitionEnd, type }) => {
        const $msg = document.createElement('div');
        $msg.classList.add('notify', type);
        $msg.ontransitionend = onTransitionEnd;
        $msg.innerHTML = `<span>${message}</span>`;
        
        const $close = document.createElement('div');
        $close.classList.add(closeClass);
        $close.innerHTML = '✗';
        $close.onclick = () => $msg.classList.remove(this.TRANSITION_CLASS);
        $msg.appendChild($close);
        return $msg;
    };

    send = (type, message) => {
        const $newMsg = this.newMessageElement({ type, message, onTransitionEnd: this.onTransitionEnd, closeClass: this.CLOSE_CLASS});
        const duration = this.NOTIFY_DURATION + this.LETTER_DURATION_RATIO * message.length;
        const timer = setTimeout(
            () => this.map.get($newMsg) && $newMsg.classList.remove(this.TRANSITION_CLASS),
            duration
        );
        this.map.set($newMsg, timer);
        this.$notifyContainer.appendChild($newMsg);
        setTimeout( () => $newMsg.classList.add(this.TRANSITION_CLASS), 100);
    };

    onTransitionEnd = (event) => {
        const $target = event.target;
        if ($target.classList.contains(this.TRANSITION_CLASS)) return;
        $target.removeEventListener("transitionend", this.onTransitionEnd);
        this.removeNotify($target);
        this.map.delete($target);
    }

    removeNotify(elem) {
        clearTimeout(this.map.get(elem));
        elem.remove();
    }

    destroy = () => {
        this.$notifyContainer.remove();
        this.$styleContainer.remove();
    }
}
