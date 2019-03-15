import * as _ from 'lodash';
import * as d3 from 'd3';

import { Position } from 'src/utils/position';
import Messager from 'src/utils/messager';
import View from 'src/core/view';

export default class ContextMenuView extends View {
    private buttons: any[] = [];
    private _changeNoteEvents = new Messager();
    public element: d3.Selection<HTMLElement, {}, HTMLElement, any>;

    constructor(parentElement: Element) {
        super(parentElement);
        this.close();
    }

    public beforeInitView(): void {
        this.buttons = [{
            id: 'changeNote',
            title: 'change note to',
            type: 'group',
            items: _.range(0, 8).map(num => {
                return {
                    key: num,
                    title: num
                };
            })
        }, {
            title: 'connectTo...'
        }];
    }

    public initView(parentElement: Element): Element {
        let self = this;
        let element = d3.select(parentElement).append('div')
            .attr('id', 'context-menu')
            .attr('class', 'btn-group-vertical dropright show')
            .style('position', 'absolute')
            .style('z-index', '100');
        this.buttons.forEach(btn => {
            if (btn.type === 'group') {
                let groupElement = element.append('div')
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
                    .on('click', function () {
                        let data: any = d3.select(this).data()[0];
                        self._changeNoteEvents.notify('changeNote', data.key);
                        self.close();
                    });
            } else {
                element.append('button')
                    .attr('id', btn.id)
                    .attr('class', 'btn btn-secondary')
                    .attr('type', 'button')
                    .attr('role', 'button')
                    .text(btn.title);
            }
        });
        return element.node();
    }

    public registerChangeNoteClick(callback: (key: string) => void) {
        this._changeNoteEvents.register('changeNote', callback);
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
}