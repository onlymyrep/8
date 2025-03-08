document.addEventListener("DOMContentLoaded", () => {


 
  const backgroundMusic = document.getElementById("background-music");
  backgroundMusic.play().catch(() => {
    console.log("Автовоспроизведение музыки заблокировано. Нажмите на страницу, чтобы включить музыку.");
  });

  // Воспроизведение музыки после первого клика пользователя
  document.addEventListener("click", () => {
    backgroundMusic.play();
  }, { once: true });

  




  const gameBoardElement = document.getElementById("game-board");
  const messageElement = document.getElementById("message");
  const restartButton = document.getElementById("restart-button");

  const emojis = ["🌹", "🌷", "🌸", "🌺", "🌻", "🌼", "💐", "🥀"];
  let player1Emoji, player2Emoji;
  let currentPlayer;
  let gameBoard = Array(9).fill("");
  const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  // Инициализация игры
  function initializeGame() {
    // Выбираем два случайных эмодзи для игроков
    [player1Emoji, player2Emoji] = getRandomEmojis();
    currentPlayer = player1Emoji;
    gameBoard = Array(9).fill("");
    messageElement.textContent = "";
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
    for (let i = 0; i < 9; i++) {
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

    // Вибрация
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }

    // Анимация падения символа
    animateText();

    if (checkWin()) {
      messageElement.textContent = `Победил ${currentPlayer}!`;
      playWinSound();
      endGame();
    } else if (gameBoard.every(cell => cell !== "")) {
      messageElement.textContent = "Ничья!";
      endGame();
    } else {
      currentPlayer = currentPlayer === player1Emoji ? player2Emoji : player1Emoji;
    }
  }

  // Проверка победы
  function checkWin() {
    return winningConditions.some(condition => {
      return condition.every(index => {
        return gameBoard[index] === currentPlayer;
      });
    });
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

  // Анимация падения символов
  function animateText() {
    const text = "Поздравляю с 8 Марта!";
    const randomIndex = Math.floor(Math.random() * text.length);
    const fallingChar = text[randomIndex];

    const fallingElement = document.createElement("div");
    fallingElement.textContent = fallingChar;
    fallingElement.classList.add("falling-char");
    document.body.appendChild(fallingElement);

    // Удаление элемента после завершения анимации
    fallingElement.addEventListener("animationend", () => {
      fallingElement.remove();
    });
  }

  // Перезапуск игры
  restartButton.addEventListener("click", initializeGame);

  // Инициализация игры при загрузке
  initializeGame();
});
