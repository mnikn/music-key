import { Selection } from 'd3';

import { ScoreEditor } from './score-editor';
import { Note } from 'src/models/note';

export class SectionLayouter {
    constructor(private editor: ScoreEditor) {
    }

    public relayout(section: Selection<SVGSVGElement, any, SVGSVGElement, {}>) {
        // let perNote = this.editor.score.timeSignature.notePerBeat;
        section
            .selectAll('.score-note')
            .attr('x', (data: Note, i) => {
                // let section = this.editor.score.sections.find(s => s.id === data.sectionId);
                // let offset = 100 / (perNote / section.notes.length);
                return `${i * 25 + 5}%`;
            })
            .attr('y', '50%');
    }
}