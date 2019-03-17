import * as d3 from 'd3';

import Note from 'src/models/note';

export default class SectionLayouter {
    constructor() {
    }

    public relayout(section: d3.Selection<SVGSVGElement, any, any, any>) {
        // let perNote = this.editor.score.timeSignature.notePerBeat;
        section
            .selectAll('.score-note')
            .attr('x', (data: Note, i) => {
                // let section = this.editor.score.sections.find(s => s.id === data.sectionId);
                // let offset = 100 / (perNote / section.notes.length);
                return `${i * 25 + 5}%`;
            })
            .attr('y', '0');
    }
}