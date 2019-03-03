import * as d3 from 'd3';
import { ScoreEditor } from './score-editor';
import { Position } from 'src/utils/position';
import { Note } from 'src/models/note';

export default class ContextMenu {

    public element: d3.Selection<HTMLElement, {}, HTMLElement, any>;
    private buttons: any[] = [];
    constructor(private editor: ScoreEditor) {
        let self = this;
        this.element = editor.rootElement.append('div')
            .attr('id', 'context-menu')
            .attr('class', 'btn-group-vertical dropright show')
            .style('position', 'absolute')
            .style('z-index', '100');
        
        this.buttons =  [{
            id: 'changeNote',
            title: 'change note to',
            type: 'group',
            items: [{
                title: '0',
                action: () => {
                    let newNote = new Note();
                    newNote.key = '0';
                    this.changeNote(newNote);
                }
            }, {
                title: '1',
                action: () => {
                    let newNote = new Note();
                    newNote.key = '1';
                    this.changeNote(newNote);
                }
            }]
        }, {
            title: 'connectTo...'
        }];

        this.buttons.forEach(btn => {
            if (btn.type === 'group') {
                let groupElement = this.element.append('div')
                    .attr('class', 'btn-group')
                    .attr('role', 'group');
                groupElement.append('button')
                    .attr('id', btn.id)
                    .attr('class', 'btn btn-secondary dropdown-toggle')
                    .attr('type', 'button')
                    .attr('data-toggle', 'dropdown')
                    .attr('aria-haspopup', 'true')
                    .attr('aria-expanded', 'false')
                    .text(btn.title);
                groupElement.append('div')
                    .attr('class', 'dropdown-menu')
                    .attr('aria-labelledby', btn.id)
                    .selectAll('button')
                    .data(btn.items)
                    .enter().append('button')
                    .attr('class', 'btn btn-secondary dropdown-item')
                    .text((data: any) => data.title)
                    .on('click', function() {
                        let data: any = d3.select(this).data()[0];
                        data.action.call(self);
                    });
            } else {
                this.element.append('button')
                    .attr('id', btn.id)
                    .attr('class', 'btn btn-secondary')
                    .attr('type', 'button')
                    .attr('role', 'button')
                    .text(btn.title);
            }
        });

        this.close();
    }

    public show(pos: Position) {
        this.element
            .style('left', `${pos.x + 10}px`)
            .style('top', `${pos.y + 20}px`)
            .style('visibility', 'visible');
    }

    public close() {
        this.element.style('visibility', 'hidden');
    }

    private changeNote(note: Note) {
        this.editor.replaceSelectingNote(note);
        this.close();
    }
}