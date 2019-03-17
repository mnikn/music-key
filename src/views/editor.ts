import * as d3 from 'd3';

import SectionLayouter from 'src/views/section-layouter';
import Score from 'src/models/score';
import Position from 'src/utils/position';
import View from 'src/core/view';
import Messager from 'src/utils/messager';
import Note from 'src/models/note';

export default class EditorView extends View {
    public static ACTION_CLICK_NOTE = 'click_note';
    private sectionLayouter: SectionLayouter = new SectionLayouter();
    private noteEvents: Messager = new Messager();

    constructor(parentElement: Element, score: Score) {
        super();
        const element = d3.select(parentElement)
            .append('svg')
            .attr('id', 'score-content')
            .style('height', '800px')
            .style('width', '100%');
        element
            .append('text')
            .text(`${score.name}`)
            .style('font-size', '32px')
            .style('font-weight', 'bold')
            .attr('x', '43%')
            .attr('y', '50px');
        element
            .append('text')
            .text(`1 = ${score.tonality}`)
            .style('font-size', '16px')
            .attr('x', '20px')
            .attr('y', '100px');
        element
            .append('text')
            .text(`${score.timeSignature.beatPerSections}/${score.timeSignature.notePerBeat}`)
            .style('font-size', '16px')
            .attr('x', '80px')
            .attr('y', '100px');
        this.initView(element.node());
    }

    public render(score: Score): void {
        let self = this;
        const sections = score.sections;
        this.element.selectAll('.score-section').remove();

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
                self.noteEvents.notify(EditorView.ACTION_CLICK_NOTE, note);
                // cursor.moveTo(note);
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

    public registerClickNoteEvent(callback: (note: Note) => void): void {
        this.noteEvents.register(EditorView.ACTION_CLICK_NOTE, callback);
    }
}