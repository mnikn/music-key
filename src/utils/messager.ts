export default class Messager {
    private _queue: Map<string, ((...args) => void)[]> = new Map<string, ((...args) => void)[]>();

    public register(event: string, callback: (...args) => void): Messager {
        if (!this._queue.has(event)) {
            this._queue.set(event, []);
        }
        this._queue.set(event, [...this._queue.get(event), callback]);
        return this;
    }

    public notify(event: string, ...args): Messager {
        if (!this._queue.has(event)) return;

        this._queue.get(event).forEach(function (callback) {
            callback.apply(this, args);
        });
        return this;
    }
}