import { ScoreEditor } from "src/main/score-editor";
import { Note } from "src/models/note";
import ContextMenuView from 'src/views/context-menu';
import { Position } from "src/utils/position";

export default class ContextMenu {

    public view: ContextMenuView;
    constructor(private editor: ScoreEditor) {
        this.view = new ContextMenuView(editor.rootElement.node());
        this.view.registerChangeNoteClick((key) => {
            let newNote = new Note();
            newNote.key = key;
            this.editor.replaceSelectingNote(newNote);
        });
    }

    public show(pos: Position) {
        this.view.show(pos);
    }

    public close() {
        this.view.close();
    }
}