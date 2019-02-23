import { Note } from './note';

export class Section {
    public notes: Note[] = [];
    constructor(public id?: number) { }


    public isLastNote(note: Note) {
        return this.notes.indexOf(note) === this.notes.length - 1;
    }
}