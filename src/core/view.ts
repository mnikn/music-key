import * as d3 from 'd3';

export default abstract class View {
    private _element: Element;

    constructor() {
    }

    public get element(): d3.Selection<Element, any, any, any> {
        if (!this._element) {
            throw 'The view has not been initialized, you must initialize view first!';
        }
        return d3.select(this._element);
    }

    public get rawHtmlElement(): Element {
        if (!this._element) {
            throw 'The view has not been initialized, you must initialize view first!';
        }
        return this._element;
    }

    protected initView(element: Element): void {
        this._element = element;
    }
 
    public destory(): void {
        this.element.selectAll('*').remove();
    }
}