import { Selection } from 'd3';

import { ScoreEditor } from './score-editor';

export class SectionLayouter {
    constructor(private editor: ScoreEditor) {
    }

    public relayout(section: Selection<SVGSVGElement, any, SVGSVGElement, {}>) {
        section
            .selectAll('.score-note')
            .attr('x', (data, i) => {
                return `${i * 25 + 5}%`;
            })
            .attr('y', '50%');
    }
}