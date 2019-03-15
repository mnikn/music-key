import * as mousetrap from 'mousetrap';

export default class Mousetrap extends mousetrap {
    public static shortcut(keys: string | string[], callback: (e: ExtendedKeyboardEvent, combo: string) => any, action?: string): Mousetrap {
        mousetrap.bind(keys, callback, action);
        return Mousetrap;
    }

    public shortcut(keys: string | string[], callback: (e: ExtendedKeyboardEvent, combo: string) => any, action?: string): Mousetrap {
        return Mousetrap.shortcut.call(this, keys, callback, action);
    }
}
