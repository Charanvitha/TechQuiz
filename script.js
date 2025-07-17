const quizData = [
  {
    question: "1. What does 'HTML' stand for?",
    options: [
      "Hyper Text Markdown Language",
      "Hyper Text Markup Language",
      "Hyper Transfer Markup Language",
      "Hyper Type Markup Language"
    ],
    correct: 1
  },
  {
    question: "2. Which programming language is known as the language of the web?",
    options: ["Python", "Java", "JavaScript", "Ruby"],
    correct: 2
  },
  {
    question: "3. What is the primary purpose of CSS in web development?",
    options: [
      "To define the structure of a webpage",
      "To add interactivity to a webpage",
      "To style and layout a webpage",
      "To connect a webpage to a database"
    ],
    correct: 2
  }
];

let currentQuestion = 0;
let score = 0;
let userAnswers = Array(quizData.length).fill(null);
let timer;
let timeLeft = 60;

// DOM references
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const startBtn = document.getElementById('start-btn');
const quizForm = document.getElementById('quiz-form');
const questionCont = document.querySelector('.question-cont');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const submitBtn = document.getElementById('submit-btn');
const timerDisplay = document.getElementById('timer');
const result = document.getElementById('result');
const progress = document.getElementById('progress');

startBtn.addEventListener('click', () => {
  startScreen.style.display = 'none';
  quizScreen.style.display = 'block';
  loadQuestion();
  startTimer();
});

function startTimer() {
  timerDisplay.textContent = `Time: ${timeLeft}`;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}`;
    updateProgressBar();

    if (timeLeft <= 0) {
      clearInterval(timer);
      submitQuiz();
    }
  }, 1000);
}

function updateProgressBar() {
  let percent = ((60 - timeLeft) / 60) * 100;
  progress.style.width = percent + '%';
}

function loadQuestion() {
  const questionData = quizData[currentQuestion];
  questionCont.innerHTML = `
    <label class="question">${questionData.question}</label>
    <ul class="options">
      ${questionData.options.map((option, i) => `
        <li>
          <label>
            <input type="radio" name="q" value="${i}" ${userAnswers[currentQuestion] === i ? 'checked' : ''}>
            ${option}
          </label>
        </li>
      `).join('')}
    </ul>
  `;

  prevBtn.style.display = currentQuestion === 0 ? 'none' : 'inline-block';
  nextBtn.style.display = currentQuestion === quizData.length - 1 ? 'none' : 'inline-block';
  submitBtn.style.display = currentQuestion === quizData.length - 1 ? 'inline-block' : 'none';
}

nextBtn.addEventListener('click', () => {
  saveAnswer();
  if (currentQuestion < quizData.length - 1) {
    currentQuestion++;
    loadQuestion();
  }
});

prevBtn.addEventListener('click', () => {
  saveAnswer();
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
});

quizForm.addEventListener('submit', (e) => {
  e.preventDefault();
  saveAnswer();
  submitQuiz();
});

function saveAnswer() {
  const selected = document.querySelector('input[name="q"]:checked');
  if (selected) {
    userAnswers[currentQuestion] = parseInt(selected.value);
  }
}

function submitQuiz() {
  clearInterval(timer);
  let correctCount = 0;
  questionCont.innerHTML = '';

  quizData.forEach((q, i) => {
    const userAns = userAnswers[i];
    const isCorrect = userAns === q.correct;

    const optionsHTML = q.options.map((opt, idx) => {
      let className = '';
      if (idx === q.correct) className = 'correct';
      else if (idx === userAns) className = 'wrong';
      return `<li class="${className}">${opt}</li>`;
    }).join('');

    questionCont.innerHTML += `
      <div class="review-mode">
        <label class="question">${q.question}</label>
        <ul class="options">${optionsHTML}</ul>
      </div>
    `;

    if (isCorrect) correctCount++;
  });

  result.textContent = `You scored ${correctCount} out of ${quizData.length}`;
  quizForm.style.display = 'none';
}