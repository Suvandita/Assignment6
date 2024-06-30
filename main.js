const _question = document.querySelector(".question");
const _choices = document.querySelectorAll(".choice");
const _choices_radio = document.querySelectorAll("input[name='choice']");
const _correctScore = document.querySelector(".correctScore");
const _nextBtn = document.querySelector(".main__next");
const _askedCount = document.querySelector(".askedCount");
const _timer = document.querySelector(".main__timer");

let correctAnswer = "", correctScore = 0, askedCount = 1, totalQuestion = 10, timerInterval;

function eventListeners() {
    _nextBtn.addEventListener('click', checkAnswer);
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

    displayQuestion(data.results[askedCount-1]);
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
    }

    _askedCount.textContent = askedCount;
    _correctScore.textContent = correctScore;

    startTimer(30);
    
}



function checkAnswer() {
    clearInterval(timerInterval);

    let selectedChoice = document.querySelector('input[name="choice"]:checked');
    if (selectedChoice) {
        let selectedAnswer = selectedChoice.nextElementSibling.textContent;
        if (selectedAnswer === correctAnswer) {
            correctScore++;
        }
        askedCount++;
    }
    else{
        askedCount++;
    }
    
    if (askedCount <= totalQuestion) {
        loadQuestion();
    } else {
        document.querySelector(".main__container").style.display='none';
        document.querySelector(".main__result").style.display='block';
        document.querySelector(".totalScore").textContent=correctScore;
        _correctScore.textContent=0;
        _timer.textContent='00:00';
        _nextBtn.textContent='Reload';
        _nextBtn.addEventListener('click',()=>{
            window.location.reload();
        })


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
