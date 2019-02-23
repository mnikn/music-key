import * as d3 from 'd3';
import * as _ from 'lodash';

import { ScoreEditor } from './score-editor';
import { Note } from 'src/models/note';
import { Section } from 'src/models/section';
import { Score } from 'src/models/score';

export class Cursor {
    public score: Score;
    public currentNote: Note;
    public currentSection: Section;
    private element: d3.Selection<SVGElement, {}, HTMLElement, any>;

    constructor(private editor: ScoreEditor) {
        this.score = this.editor.score;
        this.currentSection = this.editor.score.sections[0];
        this.currentNote = this.editor.score.sections[0].notes[0];

        this.element = this.editor.element.append('path')
            .attr('d', 'M0 10 c0 3.3 2.7 6 6 6 s6-2.7 6-6 S6 0,6 0 S0 6.7 0 10z')
            .attr('transform', `matrix(0.93 0 0 0.93 ${0} ${236})`)
            .attr('fill', 'red')
            .style('cursor', 'pointer');
    }

    public moveLeft() {
        if (!this.currentSection || !this.currentNote) return;

        const sectionNotes = this.currentSection.notes;
        const currentNoteIndex = sectionNotes.indexOf(this.currentNote);
        const currentSectionIndex = this.score.sections.indexOf(this.currentSection);

        if (currentNoteIndex > 0) {
            this.currentNote = sectionNotes[currentNoteIndex - 1];
        } else if (currentSectionIndex > 0) {
            this.currentSection = this.score.sections[currentSectionIndex - 1];
            this.currentNote = _.last(this.currentSection.notes);
        }

        this.doMove();
    }

    public moveRight() {
        if (!this.currentSection || !this.currentNote) return;

        const sectionNotes = this.currentSection.notes;
        const currentNoteIndex = sectionNotes.indexOf(this.currentNote);
        const currentSectionIndex = this.score.sections.indexOf(this.currentSection);

        if (currentNoteIndex < sectionNotes.length - 1) {
            this.currentNote = sectionNotes[currentNoteIndex + 1];
        } else if (currentSectionIndex < this.score.sections.length - 1) {
            this.currentSection = this.score.sections[currentSectionIndex + 1];
            this.currentNote = this.currentSection.notes[0];
        }

        this.doMove();
    }

    public moveUp() {
        if (!this.currentSection || !this.currentNote) return;

        const currentSectionIndex = this.score.sections.indexOf(this.currentSection);

        if (currentSectionIndex >= 5) {
            this.currentSection = this.score.sections[currentSectionIndex - 5];
            this.currentNote = this.currentSection.notes[0];
        }

        this.doMove();
    }

    public moveDown() {
        if (!this.currentSection || !this.currentNote) return;

        const currentSectionIndex = this.score.sections.indexOf(this.currentSection);

        if (currentSectionIndex + 5 < this.score.sections.length) {
            this.currentSection = this.score.sections[currentSectionIndex + 5];
            this.currentNote = this.currentSection.notes[0];
        }

        this.doMove();
    }

    public moveTo(note: Note) {
        const currentSection = this.score.sections.find(section => _.includes(section.notes, note));
        this.currentNote = note;
        this.currentSection = currentSection;
        this.doMove();
    }

    private doMove() {
        const currentNote = this.currentNote;
        const currentSection = this.currentSection;
        if (!currentNote) return;

        const sectionElement = document.querySelector(`#score-section-${currentSection.id}`);
        const noteElement = <HTMLElement>this.editor.element.select(`#score-note-${currentNote.id}`).node();
        const seciontX = parseFloat(sectionElement.getAttribute('x'));
        const sectionY = parseFloat(sectionElement.getAttribute('y'));
        const seciontWidth = parseFloat(sectionElement.getAttribute('width'));
        const seciontHeight = parseFloat(sectionElement.getAttribute('height'));

        const noteX = seciontX + seciontWidth * this.rationToFloat(noteElement.getAttribute('x'));
        const noteY = seciontHeight * this.rationToFloat(noteElement.getAttribute('y')) + sectionY + 20;

        this.element.attr('transform', `matrix(0.93 0 0 0.93 ${noteX} ${noteY})`);
    }

    private rationToFloat(ration: string): number {
        return parseFloat(ration.length === 3 ? '0.' + ration.substr(0, 2) : '0.0' + ration[0]);
    }
}