import View from "./view";

export default abstract class Controller<V extends View> {
    private _view: V;
    private _parentElement: Element;

    constructor(parentElement: Element, ...args) {
        this._parentElement = parentElement;
        this.beforeCreateView.apply(this, arguments);
        this._view = this.createView.apply(this, [parentElement].concat(args));
    }

    protected beforeCreateView(...args): void {

    }

    protected abstract createView(parentElement: Element, ...args): V;

    protected get parentElement(): Element {
        return this._parentElement;
    }

    public get view(): V {
        return this._view;
    }

    public destory(): void {
        this.view.destory();
    }
}
