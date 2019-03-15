import View from "./view";

export default abstract class Controller<V extends View> {
    private _view: V;

    constructor(parentElement: Element, ...args) {
        this.beforeCreateView.apply(this, arguments);
        this._view = this.createView(parentElement);
    }

    public beforeCreateView(...args): void {

    }

    public abstract createView(parentElement: Element): V;

    public get view(): V {
        return this._view;
    }

    public destory(): void {
        this.view.destory();
    }
}
