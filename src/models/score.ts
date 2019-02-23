import { Section } from './section';
import { TimeSignature } from './time-signature';

export class Score {
    public sections: Section[] = [];
    public name: string;
    public tonality: 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B' = 'C';
    public timeSignature: TimeSignature = new TimeSignature();


    public isLastSection(section: Section): boolean {
        return this.sections.indexOf(section) === this.sections.length - 1;
    }
}

