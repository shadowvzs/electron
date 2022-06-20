export type MouseEventCallback = (event: MouseEvent) => void;

export declare class Draggable {   
    constructor(targetElem: HTMLElement, targetHeader?: HTMLElement);
    public remove(withoutMouseDown?: boolean): void 
}
