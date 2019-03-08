import test from 'ava';
import { Score } from '../../src/models/score';
import { Section } from '../../src/models/section';
import { Note } from '../../src/models/note';
import CursorService from '../../src/services/cursor';

test('moveRight', t => {
    const score = new Score();
    score.sections = [new Section(1), new Section(2)];
    score.sections[0].notes = [new Note(1,1), new Note(2, 1), new Note(3, 1), new Note(4, 1)];
    score.sections[1].notes = [new Note(5,2), new Note(6, 2), new Note(7, 2), new Note(8, 2)];

    const cursor = new CursorService(score);
    t.deepEqual(score.sections[0].notes[1], cursor.moveRight())
    t.pass();
});