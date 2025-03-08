document.addEventListener("DOMContentLoaded", () => {
  const backgroundMusic = document.getElementById("background-music");
  const musicToggle = document.getElementById("music-toggle");
  const themeToggle = document.getElementById("theme-toggle");
  const gameBoardElement = document.getElementById("game-board");
  const messageElement = document.getElementById("message");
  const restartButton = document.getElementById("restart-button");
  const congratulationTextElement = document.getElementById("congratulation-text");

  let currentLevel = 1; // 1: Легкий (3x3), 2: Средний (4x4), 3: Сложный (5x5)
  let isMusicOn = false; // Музыка по умолчанию выключена
  let isDarkTheme = false;
  let restartCount = 0; // Счётчик нажатий на кнопку "Начать заново"

  const themes = [
    { background: "linear-gradient(135deg, #ff9a9e, #fad0c4, #fbc2eb, #a6c1ee)", color: "#333" },
    { background: "linear-gradient(135deg, #2c3e50, #34495e, #4a69bd, #6a89cc)", color: "#fff" },
    { background: "linear-gradient(135deg, #ff6f61, #ffcc99, #ffb6b9, #a8e6cf)", color: "#333" },
    { background: "linear-gradient(135deg, #6b5b95, #88b04b, #f7cac9, #92a8d1)", color: "#fff" },
    { background: "linear-gradient(135deg, #ff6b6b, #ffcc99, #ff6b6b, #4ecdc4)", color: "#333" },
    { background: "linear-gradient(135deg, #45b7d8, #4ecdc4, #d4f1f4, #f0f8ff)", color: "#333" },
    { background: "linear-gradient(135deg, #ff9a9e, #fad0c4, #fbc2eb, #a6c1ee)", color: "#333" },
    { background: "linear-gradient(135deg, #2c3e50, #34495e, #4a69bd, #6a89cc)", color: "#fff" },
    { background: "linear-gradient(135deg, #ff6f61, #ffcc99, #ffb6b9, #a8e6cf)", color: "#333" },
    { background: "linear-gradient(135deg, #6b5b95, #88b04b, #f7cac9, #92a8d1)", color: "#fff" }
  ];

  const emojis = ["🌹", "🌷", "🌸", "🌺", "🌻", "🌼", "💐", "🥀"];
  let player1Emoji, player2Emoji;
  let currentPlayer;
  let gameBoard;
  const winningConditions = {
    1: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]], // 3x3
    2: [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15], [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15], [0, 5, 10, 15], [3, 6, 9, 12]], // 4x4
    3: [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24], [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24], [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]] // 5x5
  };

  // Инициализация игры
  function initializeGame() {
    [player1Emoji, player2Emoji] = getRandomEmojis();
    currentPlayer = player1Emoji;
    gameBoard = Array(currentLevel === 1 ? 9 : currentLevel === 2 ? 16 : 25).fill("");
    messageElement.textContent = "";
    congratulationTextElement.textContent = "Поздравляю с 8 Марта! 🌸";
    initializeBoard();
  }

  // Получить два случайных эмодзи
  function getRandomEmojis() {
    const shuffledEmojis = emojis.sort(() => 0.5 - Math.random());
    return [shuffledEmojis[0], shuffledEmojis[1]];
  }

  // Инициализация игрового поля
  function initializeBoard() {
    gameBoardElement.innerHTML = "";
    const size = currentLevel === 1 ? 3 : currentLevel === 2 ? 4 : 5;
    gameBoardElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    gameBoardElement.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = i;
      cell.addEventListener("click", handleCellClick, { once: true });
      gameBoardElement.appendChild(cell);
    }
  }

  // Обработка клика по ячейке
  function handleCellClick(event) {
    const cell = event.target;
    const index = cell.dataset.index;
    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWin()) {
      messageElement.textContent = `Победил ${currentPlayer}!`;
      playWinSound();
      createFireworks();
      if (currentLevel < 3) {
        currentLevel++;
        setTimeout(() => initializeGame(), 3000);
      } else {
        endGame();
      }
    } else if (gameBoard.every(cell => cell !== "")) {
      messageElement.textContent = "Ничья!";
      endGame();
    } else {
      currentPlayer = currentPlayer === player1Emoji ? player2Emoji : player1Emoji;
      if (currentPlayer === player2Emoji && currentLevel === 3) {
        setTimeout(() => makeAIMove(), 500); // ИИ ходит с задержкой
      }
    }
  }

  // Проверка победы
  function checkWin() {
    return winningConditions[currentLevel].some(condition => {
      return condition.every(index => {
        return gameBoard[index] === currentPlayer;
      });
    });
  }

  // Ход ИИ (алгоритм минимакс)
  function makeAIMove() {
    let bestMove = findBestMove();
    gameBoard[bestMove] = player2Emoji;
    document.querySelector(`.cell[data-index="${bestMove}"]`).textContent = player2Emoji;
    handleCellClick({ target: document.querySelector(`.cell[data-index="${bestMove}"]`) });
  }

  function findBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i] === "") {
        gameBoard[i] = player2Emoji;
        let score = minimax(gameBoard, 0, false);
        gameBoard[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  function minimax(board, depth, isMaximizing) {
    if (checkWin()) {
      return isMaximizing ? -10 : 10;
    } else if (board.every(cell => cell !== "")) {
      return 0;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = player2Emoji;
          let score = minimax(board, depth + 1, false);
          board[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = player1Emoji;
          let score = minimax(board, depth + 1, true);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  // Завершение игры
  function endGame() {
    document.querySelectorAll(".cell").forEach(cell => {
      cell.removeEventListener("click", handleCellClick);
    });
  }

  // Воспроизведение звука победы
  function playWinSound() {
    const winSound = new Audio('win.mp3');
    winSound.play();
  }

  // Анимация фейерверка
  function createFireworks() {
    for (let i = 0; i < 50; i++) {
      const firework = document.createElement("div");
      firework.classList.add("firework");
      firework.style.left = `${Math.random() * 100}vw`;
      firework.style.top = `${Math.random() * 100}vh`;
      firework.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      document.body.appendChild(firework);
      setTimeout(() => firework.remove(), 1000);
    }
  }

  // Переключение музыки
  musicToggle.addEventListener("click", () => {
    isMusicOn = !isMusicOn;
    musicToggle.textContent = isMusicOn ? "🔊" : "🔇";
    if (isMusicOn) {
      backgroundMusic.play();
    } else {
      backgroundMusic.pause();
    }
  });

  // Переключение темы
  themeToggle.addEventListener("click", () => {
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    document.body.style.background = randomTheme.background;
    document.body.style.color = randomTheme.color;
  });

  // Перезапуск игры
  restartButton.addEventListener("click", () => {
    if (restartCount === 0) {
      initializeGame(); // Перезапуск текущего уровня
      restartCount++;
    } else {
      currentLevel = 1; // Начать с первого уровня
      restartCount = 0;
      initializeGame();
    }
  });

  // Инициализация игры при загрузке
  initializeGame();
});
