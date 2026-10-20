function readQuestion(questionElement) {
    const readText = (tagName) => {
        const value = questionElement.querySelector(tagName)?.textContent?.trim();
        if (!value) {
            throw new Error(`Le champ « ${tagName} » est absent d’une question du fichier XML.`);
        }
        return value;
    };

    const question = {
        id: Number(readText('id')),
        theme: readText('theme'),
        text: readText('contenu'),
        answers: [1, 2, 3, 4].map((number) => readText(`r${number}`)),
        correctAnswer: Number(readText('bonne_reponse')),
        points: Number(readText('point'))
    };

    return question;
}

async function loadQuestions() {
    const response = await fetch('data/bdd.xml');

    const xmlText = await response.text();
    const xmlDocument = new DOMParser().parseFromString(xmlText, 'application/xml');

    return Array.from(xmlDocument.querySelectorAll('question'), readQuestion);
}

function showStatus(element, message, isError = false) {
    element.textContent = message;
    element.classList.toggle('error-message', isError);
}

async function renderQuestionList() {
    const status = document.getElementById('questions-status');
    const list = document.getElementById('questions-list');

    try {
        const questions = await loadQuestions();
        list.replaceChildren();

        if (questions.length === 0) {
            showStatus(status, 'Aucune question n’est disponible.');
            return;
        }

        questions.forEach((question) => {
            const row = document.createElement('tr');
            const idCell = document.createElement('td');
            const themeCell = document.createElement('td');
            const questionCell = document.createElement('td');
            const answerCell = document.createElement('td');
            const pointsCell = document.createElement('td');
            const detailCell = document.createElement('td');
            const detailLink = document.createElement('a');

            idCell.textContent = String(question.id);
            themeCell.textContent = question.theme;
            questionCell.textContent = question.text;
            answerCell.textContent = question.answers[question.correctAnswer - 1];
            pointsCell.textContent = String(question.points);
            detailLink.href = `detail.html?id=${encodeURIComponent(question.id)}`;
            detailLink.textContent = 'Voir le détail';
            detailCell.append(detailLink);
            row.append(idCell, themeCell, questionCell, answerCell, pointsCell, detailCell);
            list.append(row);
        });

        showStatus(status, `${questions.length} question${questions.length > 1 ? 's' : ''} chargée${questions.length > 1 ? 's' : ''}.`);
    } catch (error) {
        showStatus(status, `Erreur : ${error.message} Ouvre le projet avec un serveur web local pour charger le XML.`, true);
    }
}

async function renderQuestionDetail() {
    const status = document.getElementById('question-status');
    const detail = document.getElementById('question-detail');
    const rawId = new URLSearchParams(window.location.search).get('id');

    if (!rawId) {
        showStatus(status, 'Aucun identifiant de question n’a été fourni.', true);
        return;
    }

    try {
        const questions = await loadQuestions();
        const question = questions.find((item) => item.id === Number(rawId));

        if (!question) {
            showStatus(status, `Aucune question ne correspond à l’identifiant ${rawId}.`, true);
            return;
        }

        document.getElementById('question-title').textContent = `Question ${question.id} : ${question.text}`;
        document.getElementById('question-theme').textContent = `Thème : ${question.theme}`;
        const answers = document.getElementById('question-answers');
        question.answers.forEach((answer, index) => {
            const item = document.createElement('li');
            item.textContent = answer;
            if (index + 1 === question.correctAnswer) {
                item.classList.add('correct-answer');
                item.append(' — Bonne réponse');
            }
            answers.append(item);
        });
        document.getElementById('question-points').textContent = `Cette question vaut ${question.points} point${question.points === 1 ? '' : 's'}.`;
        detail.hidden = false;
        showStatus(status, '');
    } catch (error) {
        showStatus(status, `Erreur : ${error.message} Ouvre le projet avec un serveur web local pour charger le XML.`, true);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'apprendre') {
        renderQuestionList();
    } else if (document.body.dataset.page === 'detail') {
        renderQuestionDetail();
    }
});