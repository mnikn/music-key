import View from "./view";

export default abstract class Controller<V extends View> {
    private _view: V;

    constructor() {
    }

    public get view(): V {
        if (!this._view) {
            throw 'The view has not been initialized, you must initialize view first!';
        }
        return this._view;
    }

    public set view(view: V) {
        this._view = view;
    }

    public destory(): void {
        this.view.destory();
    }
}
