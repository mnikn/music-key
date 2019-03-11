import * as d3 from 'd3';
import * as _ from 'lodash';

import Cursor from '../controllers/cursor';
import { Score } from 'src/models/score';
import { Section } from 'src/models/section';
import { Note } from 'src/models/note';
import { Mousetrap } from 'src/utils/mousetrap';
import { Position } from 'src/utils/position';
import { SectionLayouter } from './section-layouter';
import ContextMenu from 'src/controllers/context-menu';
import generateId from 'src/utils/id-generator';
import Toolbar from './toolbar';
import '../../static/css/style.css';

export class ScoreEditor {
    public rootElement: d3.Selection<HTMLElement, {}, HTMLElement, any>;
    public element: d3.Selection<SVGSVGElement, {}, HTMLElement, any>;
    public cursor: Cursor;
    private toolbar: Toolbar;
    private contextMenu: ContextMenu;
    private sectionLayouter: SectionLayouter = new SectionLayouter(this);

    constructor(parentElement: HTMLElement, public score: Score = new Score()) {
        this.toolbar = new Toolbar(parentElement);
        this.rootElement = d3.select(parentElement);
        this.element = d3.select(parentElement)
            .append('svg')
            .attr('id', 'score-content')
            .style('height', '800px')
            .style('width', '100%');
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

        Mousetrap
            .shortcut('up', () => {
                this.cursor.moveUp();
            }).shortcut('down', () => {
                this.cursor.moveDown();
            }).shortcut('left', () => {
                this.cursor.moveLeft();
            }).shortcut('right', () => {
                this.cursor.moveRight();
            }).shortcut('backspace', () => {
                this.removeSelectingNote();
            });

        window.addEventListener('keydown', this.handleKeydown.bind(this));
        window.addEventListener('resize', () => {
            this.render();
            this.cursor.moveTo(this.cursor.getSelectingNote());
        });

        this.contextMenu = new ContextMenu(this);
        this.refresh();
    }

    public refresh() {

        const score = this.score;
        const sections = score.sections;
        sections.push(new Section(generateId()));
        sections[0].notes.push(new Note(generateId(), sections[0].id));
        this.element.selectAll('*').remove();

        this.cursor = new Cursor(this.element.node(), score);

        this.element
            .append('text')
            .text(`${score.name}`)
            .style('font-size', '32px')
            .style('font-weight', 'bold')
            .attr('x', '43%')
            .attr('y', '50px');

        this.element
            .append('text')
            .text(`1 = ${score.tonality}`)
            .style('font-size', '16px')
            .attr('x', '20px')
            .attr('y', '100px');


        this.element
            .append('text')
            .text(`${score.timeSignature.beatPerSections}/${score.timeSignature.notePerBeat}`)
            .style('font-size', '16px')
            .attr('x', '80px')
            .attr('y', '100px');
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

    public render() {
        const sections = this.score.sections;
        this.element.selectAll('.score-section').remove();

        const cursor = this.cursor;

        const xStep = this.element.node().clientWidth / 5 - 10;
        const seciontElement = this.element
            .selectAll('.score-section')
            .data(sections.map((section, column) => {
                const x = (column % 5) * xStep;
                const y = Math.floor(column / 5) * 100 + 200;
                return { id: section.id, pos: new Position(x, y) };
            }))
            .enter().append('svg')
            .attr('id', (data) => `score-section-${data.id}`)
            .attr('class', 'score-section')
            .attr('x', data => data.pos.x)
            .attr('y', data => data.pos.y)
            .attr('width', xStep)
            .attr('height', '32')
            .data(sections);

        // render note
        seciontElement
            .selectAll('score-note')
            .data(section => section.notes)
            .enter().append('text')
            .text(note => note.key)
            .attr('id', note => `score-note-${note.id}`)
            .attr('data-id', note => note.id)
            .attr('class', `score-note`)
            .style('font-size', `16px`)
            .style('cursor', 'pointer')
            .on('click', function (note) {
                cursor.moveTo(note);
            });

        // render bar line
        seciontElement
            .append('text')
            .text('|')
            .attr('class', 'section-bar-line')
            .attr('x', '99%')
            .attr('y', function () {
                return '50%';
            })
            .style('font-size', `16px`);

        this.sectionLayouter.relayout(seciontElement);
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

        this.render();
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
        this.render();
    }
}