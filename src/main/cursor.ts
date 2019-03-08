import * as d3 from 'd3';
import * as _ from 'lodash';

import { Note } from 'src/models/note';
import { Section } from 'src/models/section';
import { Score } from 'src/models/score';
import CursorService from '../services/cursor';

export class Cursor {
    private cursorService: CursorService;
    private element: d3.Selection<SVGElement, {}, HTMLElement, any>;

    constructor(public score: Score, private parentElement: SVGElement) {
        this.cursorService = new CursorService(score);
        this.element = d3.select(parentElement).append('path')
            .attr('d', 'M0 10 c0 3.3 2.7 6 6 6 s6-2.7 6-6 S6 0,6 0 S0 6.7 0 10z')
            .attr('transform', `matrix(0.93 0 0 0.93 ${0} ${236})`)
            .attr('fill', 'red')
            .style('cursor', 'pointer');
    }
    
    public getSelectingNote(): Note {
        return this.cursorService.getSelectingNote();
    }

    public getSelectingSection(): Section {
        return this.cursorService.getSelectingSection();
    }

    public setSelectingNote(note: Note) {
        this.cursorService.setSelectingNote(note);
        this.doMoveTo(this.cursorService.getSelectingNote());
    } 

    public moveLeft() {
        const currentNote = this.cursorService.moveLeft();
        this.doMoveTo(currentNote);
    }

    public moveRight() {
        const currentNote = this.cursorService.moveRight();
        this.doMoveTo(currentNote);
    }

    public moveUp() {
        const currentNote = this.cursorService.moveUp();
        this.doMoveTo(currentNote);
    }

    public moveDown() {
        const currentNote = this.cursorService.moveDown();
        this.doMoveTo(currentNote);
    }

    public moveTo(note: Note) {
        const currentNote = this.cursorService.moveTo(note);
        this.doMoveTo(currentNote);
    }

    // public moveTo(note: Note) {
    //     if (!note) return;
    //     note = this.cursorService.moveTo(note);

    //     const sectionElement = document.querySelector(`#score-section-${note.sectionId}`);
    //     const noteElement = <HTMLElement>d3.select(this.parentElement).select(`#score-note-${note.id}`).node();
    //     const seciontX = parseFloat(sectionElement.getAttribute('x'));
    //     const sectionY = parseFloat(sectionElement.getAttribute('y'));
    //     const seciontWidth = parseFloat(sectionElement.getAttribute('width'));
    //     const seciontHeight = parseFloat(sectionElement.getAttribute('height'));

    //     const noteX = seciontX + seciontWidth * this.rationToFloat(noteElement.getAttribute('x'));
    //     const noteY = seciontHeight * this.rationToFloat(noteElement.getAttribute('y')) + sectionY + 20;

    //     this.element.attr('transform', `matrix(0.93 0 0 0.93 ${noteX} ${noteY})`);
    // }

    private doMoveTo(note: Note) {
        if (!note) return;

        const sectionElement = document.querySelector(`#score-section-${note.sectionId}`);
        const noteElement = <HTMLElement>d3.select(this.parentElement).select(`#score-note-${note.id}`).node();
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