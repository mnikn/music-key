import * as d3 from 'd3';

export default class Toolbar {
    public element: d3.Selection<HTMLElement, undefined, null, undefined>;
    private buttons: any[] = ['settings'];
    constructor(parentElement: HTMLElement) {

        this.element = d3.create('div')
            .attr('class', 'btn-toolbar')
            .attr('role', 'toolbar')
            .style('width', '100%')
            .style('background', 'rgb(106, 117, 126)');
        
        this.element.append('div')
            .attr('class', 'btn-group')
            .attr('role', 'group')
            .attr('aria-label', 'example');

        this.element.selectAll('.btn btn-secondary')
            .data(this.buttons)
            .enter().append('button')
            .attr('class', 'btn btn-secondary btn-md')
            .attr('type', 'button')
            .text(data => data)
        parentElement.append(this.element.node());
    }
}