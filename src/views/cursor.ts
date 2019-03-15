import * as d3 from 'd3';
import * as _ from 'lodash';

import { Note } from 'src/models/note';
import View from 'src/core/view';

export default class CursorView extends View {
    constructor(private parentElement: Element) {
        super(parentElement);
    }

    public initView(parentElement: Element): Element {
        return d3.select(parentElement).append('path')
            .attr('d', 'M0 10 c0 3.3 2.7 6 6 6 s6-2.7 6-6 S6 0,6 0 S0 6.7 0 10z')
            .attr('transform', `matrix(0.93 0 0 0.93 ${0} ${236})`)
            .attr('fill', 'red')
            .style('cursor', 'pointer')
            .node() as Element;
    }

    public moveTo(note: Note) {
        if (!note) return;

        const sectionElement = document.querySelector(`#score-section-${note.sectionId}`);
        const noteElement = d3.select(this.parentElement).select(`#score-note-${note.id}`).node() as Element;
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