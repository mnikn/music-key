import { ScoreEditor, Score } from 'src/api';

function init() {
    let score = new Score();
    score.name = 'Test';

    let container = document.querySelector('#score-editor');
    let editor = new ScoreEditor(container, score);
    window.onhashchange = function () {
        // because the editor will register the global keyEvent, thus we need to destory it once exit editor 
        editor.destory();
    };
}

init();