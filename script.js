const targetTimeEl = document.getElementById('target-time');
const currentTimeEl = document.getElementById('current-time');
const toggleBtn = document.getElementById('toggle-btn');
const resetBtn = document.getElementById('reset-btn');
const resultArea = document.getElementById('result-area');
const resultTimeEl = document.getElementById('result-time');
const resultDiffEl = document.getElementById('result-diff');
const evaluationEl = document.getElementById('evaluation');

const TARGETS = [3, 5, 10];
const HIDE_AFTER_SEC = 1.5;

let currentTarget = 0;
let startTime = 0;
let animationFrameId = null;
let isRunning = false;
let isFinished = false;

function initGame() {
  currentTarget = TARGETS[Math.floor(Math.random() * TARGETS.length)];
  targetTimeEl.textContent = currentTarget;
  currentTimeEl.textContent = '0.00';
  
  isRunning = false;
  isFinished = false;
  
  toggleBtn.textContent = 'Start';
  toggleBtn.className = 'btn primary';
  toggleBtn.disabled = false;
  
  resultArea.classList.add('hidden');
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

function updateTime() {
  if (!isRunning) return;
  
  const elapsed = (Date.now() - startTime) / 1000;
  
  if (elapsed <= HIDE_AFTER_SEC) {
    currentTimeEl.textContent = elapsed.toFixed(2);
  } else {
    currentTimeEl.textContent = '--.--';
  }
  
  animationFrameId = requestAnimationFrame(updateTime);
}

function startGame() {
  isRunning = true;
  startTime = Date.now();
  
  toggleBtn.textContent = 'Stop';
  toggleBtn.classList.add('stop');
  
  animationFrameId = requestAnimationFrame(updateTime);
}

function stopGame() {
  isRunning = false;
  isFinished = true;
  cancelAnimationFrame(animationFrameId);
  
  const elapsed = (Date.now() - startTime) / 1000;
  const diff = elapsed - currentTarget;
  
  currentTimeEl.textContent = elapsed.toFixed(2);
  
  resultTimeEl.textContent = `${elapsed.toFixed(2)}秒`;
  resultDiffEl.textContent = `${diff > 0 ? '+' : ''}${diff.toFixed(2)}秒`;
  
  evaluateResult(diff);
  
  resultArea.classList.remove('hidden');
  toggleBtn.disabled = true;
}

function evaluateResult(diff) {
  const absDiff = Math.abs(diff);
  let evalText = '';
  let evalClass = '';

  if (absDiff <= 0.05) {
    evalText = 'Perfect';
    evalClass = 'eval-perfect';
  } else if (absDiff <= 0.20) {
    evalText = 'Great';
    evalClass = 'eval-great';
  } else if (absDiff <= 0.50) {
    evalText = 'Good';
    evalClass = 'eval-good';
  } else if (absDiff <= 1.00) {
    evalText = 'OK';
    evalClass = 'eval-ok';
  } else {
    evalText = 'Miss';
    evalClass = 'eval-miss';
  }

  evaluationEl.textContent = evalText;
  evaluationEl.className = `evaluation ${evalClass}`;
}

toggleBtn.addEventListener('click', () => {
  if (isFinished) return;
  
  if (isRunning) {
    stopGame();
  } else {
    startGame();
  }
});

resetBtn.addEventListener('click', initGame);

// Initialize on load
initGame();
