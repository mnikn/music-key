import * as _ from 'lodash';

import Section from './section';
import TimeSignature from './time-signature';
import Note from './note';

export default class Score {
    public sections: Section[] = [];
    public name: string;
    public tonality: 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B' = 'C';
    public timeSignature: TimeSignature = new TimeSignature();

    get notes(): Note[] {
        return _.flatten(this.sections.map(s => s.notes));
    }

    public isLastSection(section: Section): boolean {
        return this.sections.indexOf(section) === this.sections.length - 1;
    }
}

