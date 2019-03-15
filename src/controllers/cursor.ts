import CursorView from "src/views/cursor";
import CursorService from "src/services/cursor";
import Note from "src/models/note";
import Score from "src/models/score";
import Section from "src/models/section";
import Mousetrap from "src/utils/mousetrap";
import Controller from "src/core/controller";

export default class Cursor extends Controller<CursorView> {
    private cursorService: CursorService;

    constructor(parentElement: Element, public score: Score) {
        super(parentElement);
        this.cursorService = new CursorService(score);
        this.cursorService.register(CursorService.ACTION_MOVE, (note: Note) => {
            this.view.moveTo(note);
        });

        Mousetrap
            .shortcut('up', () => {
                this.moveUp();
            }).shortcut('down', () => {
                this.moveDown();
            }).shortcut('left', () => {
                this.moveLeft();
            }).shortcut('right', () => {
                this.moveRight();
            })
    }

    public createView(parentElement: Element): CursorView {
        return new CursorView(parentElement);
    }

    public destory() {
        this.view.destory();
    }

    public getSelectingNote(): Note {
        return this.cursorService.getSelectingNote();
    }

    public getSelectingSection(): Section {
        return this.cursorService.getSelectingSection();
    }

    public setSelectingNote(note: Note) {
        this.cursorService.setSelectingNote(note);
        this.view.moveTo(this.cursorService.getSelectingNote());
    }

    public moveLeft() {
        this.cursorService.moveLeft();
    }

    public moveRight() {
        this.cursorService.moveRight();
    }

    public moveUp() {
        this.cursorService.moveUp();
    }

    public moveDown() {
        this.cursorService.moveDown();
    }

    public moveTo(note: Note) {
        this.cursorService.moveTo(note);
    }

}