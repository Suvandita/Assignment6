const _question = document.querySelector(".question");
const _choices = document.querySelectorAll(".choice");
const _choices_radio = document.querySelectorAll("input[name='choice']");
const _correctScore = document.querySelector(".correctScore");
const _nextBtn = document.querySelector(".main__next");
const _prevBtn = document.querySelector(".main__prev");
const _askedCount = document.querySelector(".askedCount");
const _timer = document.querySelector(".main__timer");
const _choice_select = document.querySelectorAll(".choices__choice");

let correctAnswer = "", correctScore = 0, askedCount = 1, totalQuestion = 10, timerInterval;
let objarray = [];

function eventListeners() {
    _nextBtn.addEventListener('click', checkAnswer);
    _prevBtn.addEventListener('click', previousQuestion);
}

function previousQuestion() {
    clearInterval(timerInterval);
    if (askedCount > 1) {
        askedCount--;

        displayQuestion(objarray[askedCount - 1]);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    _askedCount.textContent = 1;
    _correctScore.textContent = 0;
    loadQuestion();
    eventListeners();
});

async function loadQuestion() {
    const APIUrl = 'https://opentdb.com/api.php?amount=10&category=32&difficulty=easy&type=multiple';
    const result = await fetch(APIUrl);
    const data = await result.json();
    objarray = data.results;
    displayQuestion(objarray[askedCount - 1]);
}

function displayQuestion(data) {
    correctAnswer = data.correct_answer;
    let incorrectAnswers = data.incorrect_answers;
    let choicesList = [...incorrectAnswers];
    choicesList.splice(Math.floor(Math.random() * (incorrectAnswers.length + 1)), 0, correctAnswer);

    _question.innerHTML = `${data.question}`;

    for (let i = 0; i < choicesList.length; i++) {
        _choices[i].innerHTML = `${choicesList[i]}`;
        _choices_radio[i].checked = false;
        _choices_radio[i].parentElement.style.backgroundColor = ''; 
    }

    let selectedChoice = objarray[askedCount - 1].selectedAnswer;
    if (selectedChoice) {
        for (let i = 0; i < choicesList.length; i++) {
            if (_choices[i].textContent === selectedChoice) {
                _choices_radio[i].checked = true;
            }
        }
    }

    _askedCount.textContent = askedCount;
    _correctScore.textContent = correctScore;
    if(askedCount>1){
        _prevBtn.style.display='block';
    }
    else{
        _prevBtn.style.display='none';
    }

    startTimer(30);
}

function checkAnswer() {
    clearInterval(timerInterval);

    let selectedChoice = document.querySelector('input[name="choice"]:checked');
    if (selectedChoice) {
        let previousAnswer = objarray[askedCount - 1].selectedAnswer;
        let selectedAnswer = selectedChoice.nextElementSibling.textContent;
        objarray[askedCount - 1].selectedAnswer = selectedAnswer;

        if (previousAnswer !== selectedAnswer) {
            if (previousAnswer === correctAnswer) {
                correctScore--;
            }
            if (selectedAnswer === correctAnswer) {
                correctScore++;
            }
        }
    }

    askedCount++;

    if (askedCount <= totalQuestion) {
        displayQuestion(objarray[askedCount - 1]);
    } else {
        document.querySelector(".main__container").style.display = 'none';
        document.querySelector(".main__result").style.display = 'block';
        document.querySelector(".totalScore").textContent = correctScore;
        _correctScore.textContent = 0;
        _prevBtn.style.display='none';
        _timer.textContent = '00:00';
        _nextBtn.textContent = 'Reload';
        _nextBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }
}

function startTimer(time) {
    _timer.textContent = formatTime(time);
    timerInterval = setInterval(() => {
        time--;
        _timer.textContent = formatTime(time);
        if (time <= 0) {
            clearInterval(timerInterval);
            checkAnswer();
        }
    }, 1000);
}

function formatTime(seconds) {
    return `00:${seconds < 10 ? '0' : ''}${seconds}`;
}
