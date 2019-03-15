import Note from "src/models/note";
import ContextMenuView from 'src/views/context-menu';
import Position from "src/utils/position";
import Controller from "src/core/controller";
import Messager from "src/utils/messager";

export default class ContextMenu extends Controller<ContextMenuView> {
    public static ACTION_CHANGE_NOTE = 'change_note';
    private _changeNoteEvents: Messager = new Messager();
    constructor(parentElement: Element) {
        super(parentElement);
        this.view.registerChangeNoteClick((key) => {

            let newNote = new Note();
            newNote.key = key;
            // this.editor.replaceSelectingNote(newNote);
            this._changeNoteEvents.notify(ContextMenu.ACTION_CHANGE_NOTE, newNote);
            // let newNote = new Note();
            // newNote.key = key;
            // this.editor.replaceSelectingNote(newNote);
        });
    }

    public createView(parentElement: Element): ContextMenuView {
        return new ContextMenuView(parentElement);
    }

    public registerChangeNoteEvent(event: (note: Note) => void): void {
        this._changeNoteEvents.register(ContextMenu.ACTION_CHANGE_NOTE, event);
    }

    public show(pos: Position) {
        this.view.show(pos);
    }

    public close() {
        this.view.close();
    }
}