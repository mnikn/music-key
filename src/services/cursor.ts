import * as _ from 'lodash';

import { Note } from "src/models/note";
import { Section } from "src/models/section";
import { Score } from "src/models/score";

export default class CursorService {
    private selectingNote: Note;
    private selectingSection: Section;

    constructor(public score: Score) {
        this.selectingSection = this.score.sections[0];
        this.selectingNote = this.score.sections[0].notes[0];
    }

    public getSelectingNote(): Note {
        return this.selectingNote;
    }

    public getSelectingSection(): Section {
        return this.selectingSection;
    }

    public setSelectingNote(note: Note) {
        this.selectingNote = note;
        if (note.sectionId) {
            const section = this.score.sections.find(s => s.id === note.sectionId);
            this.selectingSection = section;
        }
    }
    
    public moveLeft(): Note {
        if (!this.selectingSection || !this.selectingNote) return;

        const sectionNotes = this.selectingSection.notes;
        const currentNoteIndex = sectionNotes.indexOf(this.selectingNote);
        const currentSectionIndex = this.score.sections.indexOf(this.selectingSection);

        if (currentNoteIndex > 0) {
            this.selectingNote = sectionNotes[currentNoteIndex - 1];
        } else if (currentSectionIndex > 0) {
            this.selectingSection = this.score.sections[currentSectionIndex - 1];
            this.selectingNote = _.last(this.selectingSection.notes);
        }
        return this.selectingNote;
    }

    public moveRight(): Note {
        if (!this.selectingSection || !this.selectingNote) return;

        const sectionNotes = this.selectingSection.notes;
        const currentNoteIndex = sectionNotes.indexOf(this.selectingNote);
        const currentSectionIndex = this.score.sections.indexOf(this.selectingSection);

        if (currentNoteIndex < sectionNotes.length - 1) {
            this.selectingNote = sectionNotes[currentNoteIndex + 1];
        } else if (currentSectionIndex < this.score.sections.length - 1) {
            this.selectingSection = this.score.sections[currentSectionIndex + 1];
            this.selectingNote = this.selectingSection.notes[0];
        }

        return this.selectingNote;
    }

    public moveUp(): Note {
        if (!this.selectingSection || !this.selectingNote) return;

        const currentSectionIndex = this.score.sections.indexOf(this.selectingSection);

        if (currentSectionIndex >= 5) {
            this.selectingSection = this.score.sections[currentSectionIndex - 5];
            this.selectingNote = this.selectingSection.notes[0];
        }

        return this.selectingNote;
    }

    public moveDown(): Note {
        if (!this.selectingSection || !this.selectingNote) return;

        const currentSectionIndex = this.score.sections.indexOf(this.selectingSection);

        if (currentSectionIndex + 5 < this.score.sections.length) {
            this.selectingSection = this.score.sections[currentSectionIndex + 5];
            this.selectingNote = this.selectingSection.notes[0];
        }

        return this.selectingNote;
    }

    public moveTo(note: Note): Note {
        const currentSection = this.score.sections.find(section => _.includes(section.notes, note));
        this.selectingNote = note;
        this.selectingSection = currentSection;
        return this.selectingNote;
    }
}