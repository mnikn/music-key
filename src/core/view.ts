import * as d3 from 'd3';

export default abstract class View {
    private _element: Element;

    constructor(parentElement: Element) {
        this.beforeInitView.apply(this, arguments);
        this._element = this.initView(parentElement);
    }

    public beforeInitView(...args) {

    }

    public abstract initView(parentElement: Element, ...args): Element;

    public get element(): d3.Selection<Element, any, any, any> {
        return d3.select(this._element);
    }

    public get rawHtmlElement(): Element {
        return this._element;
    }

    public destory(): void {
        this.element.selectAll('*').remove();
    }
}