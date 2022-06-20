
export class Draggable {
    cX = 0;
    cY = 0;
    x = 0;
    y = 0;
    shiftX = 0;
    shiftY = 0;
    panel;
    header;
    maxWidth;
    maxHeight;
    scrollerElem = document.scrollingElement || document.documentElement;

    constructor(targetElem, targetHeader) {
        // e1.style.position = 'fixed';
        this.panel = targetElem;
        this.header = targetHeader || targetElem;
        ['onMouseDown', 'onMouseUp', 'onMouseMove'].forEach(e => this[e] = this[e].bind(this));
        this.header.onmousedown = this.onMouseDown;
    }

    move(x, y) {
        this.panel.style.left = x+'px';
        this.panel.style.top = y+'px';
    }

    onMouseMove (e) {
        this.x = e.clientX - this.shiftX;
        this.y = e.clientY - this.shiftY;
        this.cX = this.x >  this.maxWidth ? this.maxWidth : this.x < 0 ? 0 : this.x;
        this.cY = this.y >  this.maxHeight ? this.maxHeight : this.y < 0 ? 0 : this.y;
        this.move(this.cX, this.cY);
    }

    packPosition(el) {
        if (!el) return;
        if (el.style.top) el.style.top = parseInt(el.style.top) - this.scrollerElem.scrollTop + 'px';
        if (el.style.left) el.style.left = parseInt(el.style.left) - this.scrollerElem.scrollLeft + 'px';
    }

    unpackPosition(el) {
        if (!el) return;
        if (el.style.top) el.style.top = parseInt(el.style.top) + this.scrollerElem.scrollTop + 'px';
        if (el.style.left) el.style.left = parseInt(el.style.left) + this.scrollerElem.scrollLeft + 'px';
    }

    onMouseUp () {
        this.unpackPosition(this.panel);
        this.remove(true);
        this.panel.dataset.move = 'false';
    }

    onMouseDown(e) {
        if (this.panel.dataset.move === 'true') return;
        this.packPosition(this.panel);
        this.maxWidth = Math.max(document.body.offsetWidth, document.documentElement.offsetWidth) - this.panel.offsetWidth;
        this.maxHeight =  Math.max(document.body.offsetHeight, document.documentElement.offsetHeight) - this.panel.offsetHeight;
        this.panel.dataset.move = 'true';
        document.addEventListener('mousemove', this.onMouseMove);
        document.addEventListener('mouseup', this.onMouseUp);
        this.shiftX = e.clientX - this.panel.offsetLeft;
        this.shiftY = e.clientY - this.panel.offsetTop;
    }

    remove(withoutMouseDown) {
        document.removeEventListener('mousemove', this.onMouseMove);
        document.removeEventListener('mouseup', this.onMouseUp);
        if (!withoutMouseDown) { this.header.onmousedown = null; }
    }
}
