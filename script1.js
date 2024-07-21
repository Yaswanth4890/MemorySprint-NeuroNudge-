// script.js

const buttons = ['button-1', 'button-2', 'button-3', 'button-4'];
const maxLevels = {
    easy: 5,
    medium: 15,
    hard: 30
};
const credits = {
    easy: 25,
    medium: 100,
    hard: 250
};
let gameSequence = [];
let playerSequence = [];
let level = 0;
let difficulty = 'easy';
let playing = false;
let currentCredits = 0;

const statusDisplay = document.getElementById('status');
const newGameButton = document.getElementById('new-game');
const restartButton = document.getElementById('restart');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');
const popupClose = document.getElementById('popup-close');
const creditsDisplay = document.getElementById('credits-display');

// Function to start the game based on difficulty
function startGame(difficultyLevel) {
    difficulty = difficultyLevel;
    level = 0;
    gameSequence = [];
    playerSequence = [];
    statusDisplay.textContent = 'Watch the sequence';
    playing = true;
    document.querySelector('.menu').classList.add('hidden');
    document.querySelector('.game-container').classList.remove('hidden');
    restartButton.classList.add('hidden'); // Hide restart button
    nextSequence();
}

// Function to proceed to the next sequence
function nextSequence() {
    if (level >= maxLevels[difficulty]) {
        statusDisplay.textContent = `You completed ${difficulty} mode!`;
        showPopup(`You earned ${credits[difficulty]} credits!`);
        unlockNextLevel();
        return;
    }

    playerSequence = [];
    level++;
    statusDisplay.textContent = `Level ${level}`;
    const randomButton = buttons[Math.floor(Math.random() * buttons.length)];
    gameSequence.push(randomButton);
    flashSequence();
}

// Function to flash each button in the sequence
function flashSequence() {
    let index = 0;
    const interval = setInterval(() => {
        if (index < gameSequence.length) {
            const button = gameSequence[index];
            flashButton(button);
            index++;
        } else {
            clearInterval(interval);
            enableButtons();
        }
    }, 1000);
}

// Function to flash a single button
function flashButton(button) {
    const btnElement = document.getElementById(button);
    btnElement.classList.add('active');
    setTimeout(() => {
        btnElement.classList.remove('active');
    }, 500);
}

// Function to handle button clicks from the player
function handleButtonClick(event) {
    if (!playing) return;
    const button = event.target.id;
    playerSequence.push(button);
    flashButton(button);
    checkSequence();
}

// Function to check if the player's sequence matches the game sequence
function checkSequence() {
    const index = playerSequence.length - 1;
    if (playerSequence[index] !== gameSequence[index]) {
        statusDisplay.textContent = 'Game Over! Press Restart to Try Again';
        showPopup('Game Over! Restart the game.');
        playing = false;
        disableButtons();
        restartButton.classList.remove('hidden'); // Show restart button
        return;
    }
    if (playerSequence.length === gameSequence.length) {
        disableButtons();
        currentCredits += 5;
        updateCreditsDisplay();
        showPopup(`You earned 5 credits!`);
        setTimeout(nextSequence, 1000);
    }
}

// Function to enable all buttons for interaction
function enableButtons() {
    buttons.forEach(button => {
        document.getElementById(button).addEventListener('click', handleButtonClick);
    });
}

// Function to disable all buttons for interaction
function disableButtons() {
    buttons.forEach(button => {
        document.getElementById(button).removeEventListener('click', handleButtonClick);
    });
}

// Function to unlock the next level button if all levels are completed
function unlockNextLevel() {
    if (difficulty === 'easy') {
        document.getElementById('medium').classList.remove('locked');
    } else if (difficulty === 'medium') {
        document.getElementById('hard').classList.remove('locked');
    }
    newGameButton.classList.remove('hidden');
}

// Function to show the popup with a message
function showPopup(message) {
    popupMessage.textContent = message;
    popup.classList.remove('hidden');
    setTimeout(() => {
        popup.classList.add('hidden');
    }, 1000); // Hide popup after 1 second
}

// Function to update the credits display
function updateCreditsDisplay() {
    creditsDisplay.textContent = `Credits: ${currentCredits}`;
}

// Function to restart the game
function restartGame() {
    statusDisplay.textContent = 'Watch the sequence';
    gameSequence = [];
    playerSequence = [];
    level = 0;
    currentCredits = 0;
    updateCreditsDisplay();
    restartButton.classList.add('hidden');
    startGame(difficulty); // Restart game with the current difficulty
}

// Event listener to close the popup
popupClose.addEventListener('click', () => {
    popup.classList.add('hidden');
    if (playing) {
        startGame(difficulty); // Resume the game if it's still in progress
    }
});

// Event listeners for difficulty level buttons
document.getElementById('easy').addEventListener('click', () => startGame('easy'));
document.getElementById('medium').addEventListener('click', () => {
    if (!document.getElementById('medium').classList.contains('locked')) {
        startGame('medium');
    }
});
document.getElementById('hard').addEventListener('click', () => {
    if (!document.getElementById('hard').classList.contains('locked')) {
        startGame('hard');
    }
});

// Event listener for new game button
newGameButton.addEventListener('click', () => {
    document.querySelector('.menu').classList.remove('hidden');
    document.querySelector('.game-container').classList.add('hidden');
});

// Event listener for restart button
restartButton.addEventListener('click', restartGame);
