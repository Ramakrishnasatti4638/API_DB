const questions = [
  {
    question: "Which planet in our Solar System has the most moons?",
    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    answer: 1,   // Saturn (95 confirmed moons as of 2023)
  },
  {
    question: "What is the chemical symbol for Gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    answer: 2,   // Au (from Latin 'Aurum')
  },
  {
    question: "Who wrote the play 'Romeo and Juliet'?",
    options: ["Charles Dickens", "Jane Austen", "Homer", "William Shakespeare"],
    answer: 3,
  },
];

// ─── State ────────────────────────────────────────────────────────────────────
let currentIndex = 0;
let score = 0;
let selectedOption = null;
let userAnswers = [];   // { chosen: idx, correct: idx }

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const startScreen    = document.getElementById('start-screen');
const questionScreen = document.getElementById('question-screen');
const resultScreen   = document.getElementById('result-screen');

const progressBar     = document.getElementById('progress-bar');
const questionCounter = document.getElementById('question-counter');
const scoreDisplay    = document.getElementById('score-display');
const questionText    = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn         = document.getElementById('next-btn');

const resultEmoji    = document.getElementById('result-emoji');
const resultTitle    = document.getElementById('result-title');
const resultSubtitle = document.getElementById('result-subtitle');
const finalScore     = document.getElementById('final-score');
const answersReview  = document.getElementById('answers-review');

// ─── Screen helpers ───────────────────────────────────────────────────────────
function showScreen(screen) {
  [startScreen, questionScreen, resultScreen].forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
}

// ─── Quiz flow ────────────────────────────────────────────────────────────────
function startQuiz() {
  currentIndex = 0;
  score = 0;
  selectedOption = null;
  userAnswers = [];
  showScreen(questionScreen);
  renderQuestion();
}

function renderQuestion() {
  const q = questions[currentIndex];
  selectedOption = null;
  nextBtn.disabled = true;

  // Progress
  const pct = (currentIndex / questions.length) * 100;
  progressBar.style.width = pct + '%';

  questionCounter.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  scoreDisplay.textContent = `Score: ${score}`;
  questionText.textContent = q.question;

  // Build options
  optionsContainer.innerHTML = '';
  const labels = ['A', 'B', 'C', 'D'];

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', 'false');
    btn.innerHTML = `<span class="opt-label">${labels[i]}</span><span>${opt}</span>`;

    btn.addEventListener('click', () => selectOption(i));
    optionsContainer.appendChild(btn);
  });
}

function selectOption(index) {
  if (selectedOption !== null) return;   // already answered
  selectedOption = index;

  const opts = optionsContainer.querySelectorAll('.option');
  const correct = questions[currentIndex].answer;

  opts.forEach((opt, i) => {
    opt.classList.add('disabled');
    if (i === correct) {
      opt.classList.add('correct');
    } else if (i === index && index !== correct) {
      opt.classList.add('wrong');
    } else {
      opt.classList.add('selected');
    }
    opt.setAttribute('aria-checked', i === index ? 'true' : 'false');
  });

  if (index === correct) score++;

  userAnswers.push({ chosen: index, correct });
  nextBtn.disabled = false;

  // Auto-update score badge
  scoreDisplay.textContent = `Score: ${score}`;
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < questions.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

// ─── Results ──────────────────────────────────────────────────────────────────
function showResults() {
  // Fill progress to 100%
  progressBar.style.width = '100%';
  showScreen(resultScreen);

  finalScore.textContent = score;

  const pct = score / questions.length;
  if (pct === 1) {
    resultEmoji.textContent = '🏆';
    resultTitle.textContent = 'Perfect Score!';
    resultSubtitle.textContent = 'Outstanding — you got every question right!';
    resultTitle.style.color = '#fbbf24';
  } else if (pct >= 0.67) {
    resultEmoji.textContent = '🎉';
    resultTitle.textContent = 'Great Job!';
    resultSubtitle.textContent = 'You got most of them — well done!';
    resultTitle.style.color = '#22c55e';
  } else if (pct >= 0.34) {
    resultEmoji.textContent = '🤔';
    resultTitle.textContent = 'Not Bad!';
    resultSubtitle.textContent = 'Halfway there — keep practising!';
    resultTitle.style.color = '#f59e0b';
  } else {
    resultEmoji.textContent = '💪';
    resultTitle.textContent = 'Keep Trying!';
    resultSubtitle.textContent = "Don't give up — try again to improve your score!";
    resultTitle.style.color = '#ef4444';
  }

  // Answer review
  answersReview.innerHTML = '';
  questions.forEach((q, i) => {
    const ua = userAnswers[i];
    const isRight = ua.chosen === ua.correct;
    const div = document.createElement('div');
    div.className = 'review-item';
    div.innerHTML = `
      <div class="review-q">Q${i + 1}: ${q.question}</div>
      <div class="review-answer ${isRight ? 'right' : 'wrong'}">
        <span class="icon">${isRight ? '✅' : '❌'}</span>
        <span>
          ${isRight
            ? `Correct! — <strong>${q.options[ua.correct]}</strong>`
            : `You chose <strong>${q.options[ua.chosen]}</strong> · Correct: <strong>${q.options[ua.correct]}</strong>`
          }
        </span>
      </div>`;
    answersReview.appendChild(div);
  });
}

// ─── Event listeners ──────────────────────────────────────────────────────────
document.getElementById('start-btn').addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
document.getElementById('restart-btn').addEventListener('click', startQuiz);
