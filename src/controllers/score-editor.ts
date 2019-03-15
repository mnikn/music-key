import * as d3 from 'd3';
import * as _ from 'lodash';

import Cursor from '../controllers/cursor';
import { Score } from 'src/models/score';
import { Section } from 'src/models/section';
import { Note } from 'src/models/note';
import { Mousetrap } from 'src/utils/mousetrap';
import ContextMenu from 'src/controllers/context-menu';
import generateId from 'src/utils/id-generator';
import Toolbar from './toolbar';
import '../../static/css/style.css';
import view from 'src/views/editor';
import Controller from 'src/core/controller';
import EditorView from 'src/views/editor';

export class ScoreEditor extends Controller<view> {
    public rootElement: d3.Selection<HTMLElement, {}, HTMLElement, any>;
    public element: d3.Selection<SVGSVGElement, {}, HTMLElement, any>;
    public cursor: Cursor;
    private toolbar: Toolbar;
    private contextMenu: ContextMenu;
    private score: Score;

    constructor(parentElement: HTMLElement, score?: Score) {
        super(parentElement, score);
        document.oncontextmenu = (event) => {
            let clickElement: any = event.target;
            if (clickElement.getAttribute('class') === 'score-note') {
                let clickNote = this.score.notes.find(note => note.id === parseInt(clickElement.getAttribute('data-id')));
                this.cursor.moveTo(clickNote)
            }
            this.contextMenu.show({ x: event.x, y: event.y });
            return false;
        };
        document.onclick = (event: any) => {
            let isContextMenuClick = false;
            _.forEach(event.path, element => {
                if (element.id === this.contextMenu.view.element.node().id) {
                    isContextMenuClick = true;
                }
            });

            if (!isContextMenuClick) {
                this.contextMenu.close();
            }
            return true;
        }

        Mousetrap.shortcut('backspace', () => {
            this.removeSelectingNote();
        });

        window.addEventListener('keydown', this.handleKeydown.bind(this));
        window.addEventListener('resize', () => {
            this.view.render(this.score);
            this.cursor.moveTo(this.cursor.getSelectingNote());
        });

        this.contextMenu = new ContextMenu(parentElement);

        this.cursor = new Cursor(this.view.element.node(), score);

        this.contextMenu.registerChangeNoteEvent((note) => {
            this.replaceSelectingNote(note);
        })
        this.view.registerClickNoteEvent(note => {
            this.cursor.moveTo(note);
        });
    }

    public beforeCreateView(parentElement: Element, score: Score) {
        this.toolbar = new Toolbar(parentElement);
        this.score = score;
        if (!score || score.sections.length === 0) {
            score = score ? this.score : new Score();
            const sections = this.score.sections;
            sections.push(new Section(generateId()));
            sections[0].notes.push(new Note(generateId(), sections[0].id));
        }
    }

    public createView(parentElement: Element): view {
        const view = new EditorView(parentElement);
        view.refresh(this.score);
        return view;
    }

    public destory() {
        if (this.view) {
            this.view.destory();
        }
        if (this.cursor) {
            this.cursor.destory();
        }
    }

    public handleKeydown(event) {
        const key = event.key;
        const noteReg = /([0-7]|\s|-)/;
        if (!key.match(noteReg)) {
            return;
        }
        let newNote = new Note();
        newNote.key = key;
        this.replaceSelectingNote(newNote);
        this.cursor.moveRight();
    }


    public replaceSelectingNote(note: Note) {
        const selectingSection = this.cursor.getSelectingSection();
        const selectingNote = this.cursor.getSelectingNote();
        selectingNote.key = note.key;
        if (selectingSection.isLastNote(selectingNote)) {
            if (selectingSection.notes.length !== this.score.timeSignature.beatPerSections) {
                const newNote = new Note(generateId(), selectingSection.id);
                selectingSection.notes.push(newNote);
            } else if (this.score.isLastSection(selectingSection)) {
                const newSection = new Section(this.score.sections.length + 1);
                newSection.notes.push(new Note(generateId(), newSection.id));
                this.score.sections.push(newSection);
            }
        }

        this.view.render(this.score);
    }

    private removeSelectingNote() {
        if (!this.cursor.getSelectingNote()) return;

        let needRemoveNote = _.cloneDeep(this.cursor.getSelectingNote());
        let selectingSection = this.cursor.getSelectingSection();
        selectingSection.notes = selectingSection.notes.filter(note => note.id !== needRemoveNote.id);
        if (selectingSection.notes.length === 0) {
            let i = _.indexOf(this.score.sections, selectingSection);
            this.score.sections = _.remove(this.score.sections, section => section.id !== selectingSection.id);
            selectingSection = this.score.sections[i - 1] ? this.score.sections[i - 1] : new Section(generateId());
        }
        this.cursor.moveTo(_.last(selectingSection.notes));
        this.view.render(this.score);
    }
}