import * as d3 from 'd3';
import * as _ from 'lodash';

import { Cursor } from './cursor';
import { Score } from 'src/models/score';
import { Section } from 'src/models/section';
import { Note } from 'src/models/note';
import { Mousetrap } from 'src/utils/mousetrap';
import { Position } from 'src/utils/position';
import { SectionLayouter } from './section-layouter';

export class ScoreEditor {
    public element: d3.Selection<SVGSVGElement, {}, HTMLElement, any>;
    private cursor: Cursor;
    private sectionLayouter: SectionLayouter = new SectionLayouter(this);
    private nextNoteId: number = 1;

    constructor(parentElement: HTMLElement, public score: Score = new Score()) {
        this.element = d3.select(parentElement)
            .append('svg')
            .attr('id', 'score-content')
            .style('height', '800px')
            .style('width', '1200px');

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
                // this.removeSelectingNote();
            });

        window.addEventListener('keydown', this.handleKeydown.bind(this));

        this.refresh();
    }

    public refresh() {
        this.nextNoteId = 1;

        const score = this.score;
        const sections = score.sections;
        sections.push(new Section(this.score.sections.length + 1));
        sections[0].notes.push(new Note(this.nextNoteId++));
        this.element.selectAll('*').remove();

        this.cursor = new Cursor(this);
        this.cursor.currentSection = sections[0];


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
        if (key.match(noteReg)) {
            const selectingSection = this.cursor.currentSection;
            const selectingNote = this.cursor.currentNote;
            selectingNote.key = key;
            if (selectingSection.isLastNote(selectingNote)) {
                if (selectingSection.notes.length !== this.score.timeSignature.beatPerSections) {
                    const newNote = new Note(this.nextNoteId++);
                    selectingSection.notes.push(newNote);
                } else if (this.score.isLastSection(selectingSection)) {
                    const newSection = new Section(this.score.sections.length + 1);
                    newSection.notes.push(new Note(this.nextNoteId++));
                    this.score.sections.push(newSection);
                }
            }

            this.render();
            this.cursor.moveRight();

            // this.insertNote()
            // if (event.ctrlKey) {
            //   this.insertNote(newNote);
            //   // this.replaceNote(newNote);
            // } else {
            //   this.replaceNote(newNote);
            // }
        }
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
            .attr('class', `score-note`)
            .style('font-size', `16px`)
            .style('cursor', 'pointer')
            .on('click', function (note) {
                cursor.moveTo(note);
            })
            .on('dblclick', function (note: any) {
                // const { left, top } = this.getBoundingClientRect();
                // self.noteMenu.show(new Position(left, top), note);
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
}