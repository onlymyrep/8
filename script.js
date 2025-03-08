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
  let restartCount = 0; // Счётчик нажатий на кнопку "Начать заново"

  // 50 тем в стиле Material Design
  const themes = [
    { background: "#FFEBEE", color: "#D32F2F", button: "#FFCDD2", cell: "#FFEBEE" },
    { background: "#F3E5F5", color: "#7B1FA2", button: "#E1BEE7", cell: "#F3E5F5" },
    { background: "#E8EAF6", color: "#303F9F", button: "#C5CAE9", cell: "#E8EAF6" },
    { background: "#E3F2FD", color: "#1976D2", button: "#BBDEFB", cell: "#E3F2FD" },
    { background: "#E0F7FA", color: "#0097A7", button: "#B2EBF2", cell: "#E0F7FA" },
    { background: "#E8F5E9", color: "#388E3C", button: "#C8E6C9", cell: "#E8F5E9" },
    { background: "#FFFDE7", color: "#FBC02D", button: "#FFF9C4", cell: "#FFFDE7" },
    { background: "#FFF3E0", color: "#E64A19", button: "#FFCCBC", cell: "#FFF3E0" },
    { background: "#FBE9E7", color: "#D84315", button: "#FFAB91", cell: "#FBE9E7" },
    { background: "#EFEBE9", color: "#6D4C41", button: "#D7CCC8", cell: "#EFEBE9" },
    { background: "#ECEFF1", color: "#455A64", button: "#CFD8DC", cell: "#ECEFF1" },
    { background: "#F5F5F5", color: "#616161", button: "#E0E0E0", cell: "#F5F5F5" },
    { background: "#FFCCBC", color: "#BF360C", button: "#FF8A65", cell: "#FFCCBC" },
    { background: "#D1C4E9", color: "#512DA8", button: "#B39DDB", cell: "#D1C4E9" },
    { background: "#C5CAE9", color: "#303F9F", button: "#9FA8DA", cell: "#C5CAE9" },
    { background: "#BBDEFB", color: "#1976D2", button: "#90CAF9", cell: "#BBDEFB" },
    { background: "#B2EBF2", color: "#0097A7", button: "#80DEEA", cell: "#B2EBF2" },
    { background: "#C8E6C9", color: "#388E3C", button: "#A5D6A7", cell: "#C8E6C9" },
    { background: "#FFF9C4", color: "#FBC02D", button: "#FFF59D", cell: "#FFF9C4" },
    { background: "#FFCCBC", color: "#E64A19", button: "#FFAB91", cell: "#FFCCBC" },
    { background: "#FFAB91", color: "#D84315", button: "#FF8A65", cell: "#FFAB91" },
    { background: "#D7CCC8", color: "#6D4C41", button: "#BCAAA4", cell: "#D7CCC8" },
    { background: "#CFD8DC", color: "#455A64", button: "#B0BEC5", cell: "#CFD8DC" },
    { background: "#E0E0E0", color: "#616161", button: "#BDBDBD", cell: "#E0E0E0" },
    { background: "#FF8A65", color: "#BF360C", button: "#FF7043", cell: "#FF8A65" },
    { background: "#B39DDB", color: "#512DA8", button: "#9575CD", cell: "#B39DDB" },
    { background: "#9FA8DA", color: "#303F9F", button: "#7986CB", cell: "#9FA8DA" },
    { background: "#90CAF9", color: "#1976D2", button: "#64B5F6", cell: "#90CAF9" },
    { background: "#80DEEA", color: "#0097A7", button: "#4DD0E1", cell: "#80DEEA" },
    { background: "#A5D6A7", color: "#388E3C", button: "#81C784", cell: "#A5D6A7" },
    { background: "#FFF59D", color: "#FBC02D", button: "#FFF176", cell: "#FFF59D" },
    { background: "#FFAB91", color: "#E64A19", button: "#FF8A65", cell: "#FFAB91" },
    { background: "#FF8A65", color: "#D84315", button: "#FF7043", cell: "#FF8A65" },
    { background: "#BCAAA4", color: "#6D4C41", button: "#A1887F", cell: "#BCAAA4" },
    { background: "#B0BEC5", color: "#455A64", button: "#90A4AE", cell: "#B0BEC5" },
    { background: "#BDBDBD", color: "#616161", button: "#9E9E9E", cell: "#BDBDBD" },
    { background: "#FF7043", color: "#BF360C", button: "#FF5722", cell: "#FF7043" },
    { background: "#9575CD", color: "#512DA8", button: "#7E57C2", cell: "#9575CD" },
    { background: "#7986CB", color: "#303F9F", button: "#5C6BC0", cell: "#7986CB" },
    { background: "#64B5F6", color: "#1976D2", button: "#42A5F5", cell: "#64B5F6" },
    { background: "#4DD0E1", color: "#0097A7", button: "#26C6DA", cell: "#4DD0E1" },
    { background: "#81C784", color: "#388E3C", button: "#66BB6A", cell: "#81C784" },
    { background: "#FFF176", color: "#FBC02D", button: "#FFEE58", cell: "#FFF176" },
    { background: "#FF8A65", color: "#E64A19", button: "#FF7043", cell: "#FF8A65" },
    { background: "#FF7043", color: "#D84315", button: "#FF5722", cell: "#FF7043" },
    { background: "#A1887F", color: "#6D4C41", button: "#8D6E63", cell: "#A1887F" },
    { background: "#90A4AE", color: "#455A64", button: "#78909C", cell: "#90A4AE" },
    { background: "#9E9E9E", color: "#616161", button: "#757575", cell: "#9E9E9E" },
    { background: "#FF5722", color: "#BF360C", button: "#F4511E", cell: "#FF5722" }
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

    // Анимация падающего символа
    animateText();

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

  // Анимация падающих символов
  function animateText() {
    const text = congratulationTextElement.textContent;
    if (text.length === 0) return;

    const textArray = Array.from(text);
    const randomIndex = Math.floor(Math.random() * textArray.length);
    const fallingChar = textArray[randomIndex];

    // Удаляем символ из строки
    textArray.splice(randomIndex, 1);
    congratulationTextElement.textContent = textArray.join("");

    // Создаем элемент для падающего символа
    const fallingElement = document.createElement("div");
    fallingElement.textContent = fallingChar;
    fallingElement.classList.add("falling-char");

    // Позиционируем элемент на месте удаленного символа
    const textRect = congratulationTextElement.getBoundingClientRect();
    const charWidth = 15; // Примерная ширина символа
    fallingElement.style.left = `${textRect.left + randomIndex * charWidth}px`;
    fallingElement.style.top = `${textRect.top}px`;

    document.body.appendChild(fallingElement);

    // Удаление элемента после завершения анимации
    fallingElement.addEventListener("animationend", () => {
      fallingElement.remove();
    });
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
    document.querySelectorAll(".cell").forEach(cell => {
      cell.style.background = randomTheme.cell;
    });
    document.querySelectorAll(".controls button").forEach(button => {
      button.style.background = randomTheme.button;
    });
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
