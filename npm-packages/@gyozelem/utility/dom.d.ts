interface IModifier {
    top?: number | string;
    left?: number | string;
}

export interface RelativeDistances {
    top: number;
    bottom: number;
    left: number;
    right: number;
    moreSpace: {
        top?: number;
        left?: number;
        right?: number;
        bottom?: number;
    }
}

export function anchorElem(anchor: HTMLElement, target: HTMLElement, modifier?: IModifier): void;
export function isElementInViewport(el: HTMLElement): boolean;
export function elementRelativeDistanceVsViewport(el: HTMLElement): RelativeDistances;