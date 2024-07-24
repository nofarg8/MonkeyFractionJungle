const gameState = {
    currentScreen: 'start',
    score: 0,
    level: 1,
    attempts: 0,
    currentProblem: {},
    monkeyStyle: { frame: 'orange', accessory: '', type: '🐵' },
    showBanana: false
};

const frameColors = ['red', 'purple', 'green', 'blue', 'orange'];
const accessories = ['⌚', '🎩', '🎀', '👓', '🎭', ''];
const monkeyTypes = ['🙈', '🙉', '🙊', '🐵'];

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.style.display = 'none');
    document.getElementById(screenId).style.display = 'block';
    gameState.currentScreen = screenId.replace('-screen', '');
}

function generateProblem() {
    const leftDenominators = Array.from({length: 19}, (_, i) => i + 2);
    const rightDenominators = Array.from({length: 10}, (_, i) => i + 1);
    const d1 = leftDenominators[Math.floor(Math.random() * leftDenominators.length)];
    const d2 = rightDenominators[Math.floor(Math.random() * rightDenominators.length)];
    const n1 = Math.floor(Math.random() * (d1 - 1)) + 1;
    const n2 = Math.floor(Math.random() * d2) + 1;
    const lcm = calculateLCM(d1, d2);
    return { fraction1: { numerator: n1, denominator: d1 }, fraction2: { numerator: n2, denominator: d2 }, lcm };
}

function calculateLCM(a, b) {
    const gcd = (x, y) => !y ? x : gcd(y, x % y);
    return (a * b) / gcd(a, b);
}

function renderFraction(fraction, elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = `
        <div>${fraction.numerator}</div>
        <div class="fraction-line"></div>
        <div>${fraction.denominator}</div>
    `;
}

function renderMonkey() {
    const monkeyElement = document.getElementById('monkey');
    monkeyElement.innerHTML = `
        <div style="background-color: ${gameState.monkeyStyle.frame}; border-radius: 50%; padding: 10px; position: relative;">
            ${gameState.monkeyStyle.accessory}
            ${gameState.monkeyStyle.type}
            ${gameState.showBanana ? '<div class="banana">🍌</div>' : ''}
        </div>
    `;
}

function startGame() {
    gameState.score = 0;
    gameState.level = 1;
    gameState.attempts = 0;
    updateScore();
    updateLevel();
    newProblem();
    showScreen('game-screen');
}

function newProblem() {
    gameState.currentProblem = generateProblem();
    renderFraction(gameState.currentProblem.fraction1, 'fraction1');
    renderFraction(gameState.currentProblem.fraction2, 'fraction2');
    renderMonkey();
    document.getElementById('answer-input').value = '';
    document.getElementById('message').textContent = '';
    updateProgressBar();
}

function playApplauseSound() {
    const audio = document.getElementById('applause-sound');
    audio.play().catch(error => console.error('Error playing sound:', error));
}

function checkAnswer() {
    const userAnswer = parseInt(document.getElementById('answer-input').value);
    if (userAnswer === gameState.currentProblem.lcm) {
        gameState.score++;
        gameState.level++;
        updateScore();
        updateLevel();
        document.getElementById('message').textContent = 'נכון מאוד! הקוף שלך קיבל בננה';
        gameState.monkeyStyle.type = '🐵'; // Happy monkey
        gameState.showBanana = true;
        renderMonkey();
        playApplauseSound();
        setTimeout(() => {
            gameState.monkeyStyle.type = '🐵'; // Normal monkey
            gameState.showBanana = false;
            newProblem();
        }, 2000);
    } else {
        gameState.attempts++;
        if (gameState.attempts < 2) {
            document.getElementById('message').textContent = 'לא נכון. נסו שוב!';
            gameState.monkeyStyle.type = '🙊'; // Curious monkey
        } else {
            const { fraction1, fraction2, lcm } = gameState.currentProblem;
            document.getElementById('message').textContent = `לא נכון. המכנה המשותף הקטן ביותר הוא ${lcm}. ננסה שאלה חדשה!`;
            gameState.monkeyStyle.type = '🙈'; // Sad monkey
            setTimeout(() => {
                gameState.attempts = 0;
                gameState.monkeyStyle.type = '🐵'; // Normal monkey
                newProblem();
            }, 4000);
        }
        renderMonkey();
    }
    updateProgressBar();
}

function updateScore() {
    document.getElementById('score-value').textContent = gameState.score;
}

function updateLevel() {
    document.getElementById('level').textContent = `שלב ${gameState.level}`;
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${(gameState.attempts / 2) * 100}%`;
}

function initializeCustomizeScreen() {
    const frameColorsContainer = document.getElementById('frame-colors');
    const accessoriesContainer = document.getElementById('accessories');
    const monkeyTypesContainer = document.getElementById('monkey-types');

    frameColors.forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option';
        colorOption.style.backgroundColor = color;
        colorOption.onclick = () => {
            gameState.monkeyStyle.frame = color;
            updateCustomizePreview();
        };
        frameColorsContainer.appendChild(colorOption);
    });

    accessories.forEach(accessory => {
        const accessoryOption = document.createElement('div');
        accessoryOption.className = 'accessory-option';
        accessoryOption.textContent = accessory;
        accessoryOption.onclick = () => {
            gameState.monkeyStyle.accessory = accessory;
            updateCustomizePreview();
        };
        accessoriesContainer.appendChild(accessoryOption);
    });

    monkeyTypes.forEach(type => {
        const typeOption = document.createElement('div');
        typeOption.className = 'type-option';
        typeOption.textContent = type;
        typeOption.onclick = () => {
            gameState.monkeyStyle.type = type;
            updateCustomizePreview();
        };
        monkeyTypesContainer.appendChild(typeOption);
    });

    updateCustomizePreview();
}

function updateCustomizePreview() {
    const previewElement = document.getElementById('monkey-preview');
    previewElement.innerHTML = `
        <div style="background-color: ${gameState.monkeyStyle.frame}; border-radius: 50%; padding: 20px; display: inline-block;">
            ${gameState.monkeyStyle.accessory}
            ${gameState.monkeyStyle.type}
        </div>
    `;

    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.toggle('selected', option.style.backgroundColor === gameState.monkeyStyle.frame);
    });

    document.querySelectorAll('.accessory-option').forEach(option => {
        option.classList.toggle('selected', option.textContent === gameState.monkeyStyle.accessory);
    });

    document.querySelectorAll('.type-option').forEach(option => {
        option.classList.toggle('selected', option.textContent === gameState.monkeyStyle.type);
    });
}

// Event Listeners
document.getElementById('start-game-button').addEventListener('click', startGame);
document.getElementById('customize-button').addEventListener('click', () => showScreen('customize-screen'));
document.getElementById('instructions-button').addEventListener('click', () => showScreen('instructions-screen'));
document.getElementById('back-to-start').addEventListener('click', () => showScreen('start-screen'));
document.getElementById('back-to-start-2').addEventListener('click', () => showScreen('start-screen'));
document.getElementById('back-to-start-3').addEventListener('click', () => showScreen('start-screen'));
document.getElementById('check-answer').addEventListener('click', checkAnswer);
document.getElementById('start-game-from-customize').addEventListener('click', startGame);

// Initialize the game
initializeCustomizeScreen();
showScreen('start-screen');
