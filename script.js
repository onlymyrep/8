document.addEventListener("DOMContentLoaded", () => {
  const gameBoardElement = document.getElementById("game-board");
  const messageElement = document.getElementById("message");
  const restartButton = document.getElementById("restart-button");

  const emojis = ["🌹", "🌷", "🌸", "🌺", "🌻", "🌼", "💐", "🥀"];
  let currentPlayer = emojis[Math.floor(Math.random() * emojis.length)];
  let gameBoard = Array(9).fill("");
  const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

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

  function handleCellClick(event) {
    const cell = event.target;
    const index = cell.dataset.index;
    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;

    if (navigator.vibrate) {
      navigator.vibrate(100);
    }

    if (checkWin()) {
      messageElement.textContent = `Победил ${currentPlayer}!`;
      playWinSound();
      endGame();
    } else if (gameBoard.every(cell => cell !== "")) {
      messageElement.textContent = "Ничья!";
      endGame();
    } else {
      switchPlayer();
    }
  }

  function checkWin() {
    return winningConditions.some(condition => {
      return condition.every(index => {
        return gameBoard[index] === currentPlayer;
      });
    });
  }

  function endGame() {
    document.querySelectorAll(".cell").forEach(cell => {
      cell.removeEventListener("click", handleCellClick);
    });
  }

  function switchPlayer() {
    currentPlayer = emojis[Math.floor(Math.random() * emojis.length)];
  }

  function playWinSound() {
    const winSound = new Audio('win.mp3');
    winSound.play();
  }

  restartButton.addEventListener("click", () => {
    gameBoard = Array(9).fill("");
    currentPlayer = emojis[Math.floor(Math.random() * emojis.length)];
    messageElement.textContent = "";
    initializeBoard();
  });

  initializeBoard();
});
