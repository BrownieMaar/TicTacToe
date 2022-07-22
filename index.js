/// DO NOT MODIFY THIS
const tiles = Array.from(document.querySelectorAll(".tile"));
const playerDisplay = document.querySelector(".display-player");
const resetButton = document.querySelector("#reset");
const optionsButton = document.querySelector("#options");
const announcer = document.querySelector(".announcer");

tiles.forEach((tile, index) => {
  tile.addEventListener("click", () => userAction(tile, index));
});

resetButton.addEventListener("click", resetBoard);
optionsButton.addEventListener("click", showHideOptions);

/// START CODE AFTER THIS

let currentPlayer = 0;
let boardArray = getEmptyBoard();
let isGameOver = false;
let isAiPlaying = false;
let isUnbeatablePlaying = false;
let isAiVsAiModeOn = false;

function showHideOptions() {
  const options = document.getElementById("optionsSection");
  if (!checkEmptyBoard() && !isGameOver) {
    announcer.innerHTML = "You can't modify the options during the game.";
  } else {
    if (options.classList.contains("hide")) {
      options.classList.remove("hide");
    } else {
      options.classList.add("hide");
    }
  }
}

function getMenuOption(mode) {
  if (mode === "ai") {
    if (isAiPlaying) {
      isAiPlaying = false;
    } else {
      isAiPlaying = true;
    }
    if (boardArray.toString() !== ".,.,.,.,.,.,.,.,.") announcer.innerHTML = "press reset to start the game!";
  }

  if (isAiPlaying) {
    document.getElementById("isUnbeatable").classList.remove("hide");
  } else {
    document.getElementById("isUnbeatable").classList.add("hide");
  }

  if (mode === "ui") {
    if (isUnbeatablePlaying) {
      isUnbeatablePlaying = false;
    } else {
      isUnbeatablePlaying = true;
    }    
    if (boardArray.toString() !== ".,.,.,.,.,.,.,.,.") announcer.innerHTML = "press reset to start the game!";
  }

  if (mode === "aiAi") {
    isAiVsAiModeOn = !isAiVsAiModeOn;
    if (isAiVsAiModeOn) aiVersusAiMode();
  }
}

function getRandomAiMove() {
  let aiMove = [];

  while (true) {
    aiMove[0] = Math.floor(Math.random() * 3);
    aiMove[1] = Math.floor(Math.random() * 3);
    if (boardArray[aiMove[0]][aiMove[1]] === ".") {
      break;
    } else {
      continue;
    }
  }
  return aiMove;
}

function getUnbeatableAiMove() {
  let aiMove = [];
  if (boardArray[1][1] === ".") {
    aiMove = [1, 1];
  } else if (boardArray.toString() === ".,.,.,.,X,.,.,.,.") {
    aiMove = [0, 0];
  } else if (boardArray.toString() === "O,.,.,.,X,.,.,.,X") {
    aiMove = [2, 0];
  } else {
    if (checkWinningChance("O") === false) {
      aiMove = checkWinningChance("X");
    } else {
      aiMove = checkWinningChance("O");
    }
    if (aiMove === false) {
      if (
        boardArray[0][1] === "X" &&
        boardArray[1][0] === "X" &&
        boardArray[0][0] === "."
      ) {
        aiMove = [0, 0];
      }
      if (
        boardArray[0][1] === "X" &&
        boardArray[1][2] === "X" &&
        boardArray[0][2] === "."
      ) {
        aiMove = [0, 2];
      }
      if (
        boardArray[1][2] === "X" &&
        boardArray[2][1] === "X" &&
        boardArray[2][2] === "."
      ) {
        aiMove = [2, 2];
      }
      if (
        boardArray[2][1] === "X" &&
        boardArray[1][0] === "X" &&
        boardArray[2][0] === "."
      ) {
        aiMove = [2, 0];
      }

      if (
        boardArray[0][0] === "X" &&
        boardArray[2][2] === "X" &&
        checkWinningChance("O") === false
      ) {
        while (true) {
          aiMove = getRandomAiMove();
          if (
            (aiMove[0] === 2 && aiMove[1] === 0) ||
            (aiMove[0] === 0 && aiMove[1] === 2)
          ) {
            continue;
          } else {
            break;
          }
        }
      }

      if (
        boardArray[2][0] === "X" &&
        boardArray[0][2] === "X" &&
        checkWinningChance("O") === false
      ) {
        while (true) {
          aiMove = getRandomAiMove();
          if (
            (aiMove[0] === 2 && aiMove[1] === 2) ||
            (aiMove[0] === 0 && aiMove[1] === 0)
          ) {
            continue;
          } else {
            break;
          }
        }
      }

      if (aiMove === false) {
        aiMove = getRandomAiMove();
      }
    }
  }
  return aiMove;
}

function getEmptyBoard() {
  let board = [
    [".", ".", "."],
    [".", ".", "."],
    [".", ".", "."],
  ];
  for (let tile of tiles) {
    tile.innerHTML = "";
  }
  return board;
}

function checkEmptyBoard() {
  if (boardArray.toString() === ".,.,.,.,.,.,.,.,.") {
    return true;
  } else {
    return false;
  }
}

function resetBoard() {
  boardArray = getEmptyBoard();
  isGameOver = false;
  currentPlayer = 0;
  playerDisplay.innerHTML = "X";
  playerDisplay.classList.replace("playerO", "playerX");
  askPlayerToMove();
}

function askPlayerToMove() {
  announcer.innerHTML = "Please select a tile!";
  announcer.classList.remove("hide");
}

function userAction(tile, index) {
  let rowIndex = get2Dfrom1D(index)[0];
  let colIndex = get2Dfrom1D(index)[1];
  console.log(boardArray);

  if (!isGameOver) {
    askPlayerToMove();
  }

  if (tile.innerHTML === "" && !isGameOver) {
    if (currentPlayer) {
      tile.innerHTML = "O";
      boardArray[rowIndex][colIndex] = "O";
    } else {
      tile.innerHTML = "X";
      boardArray[rowIndex][colIndex] = "X";
    }
    if (getWinningPlayer("X") === 0) {
      isGameOver = true;
      announcer.innerHTML = `Player <span class="display-player playerX">X</span> won the game!`;
    } else if (getWinningPlayer("O") === 1) {
      isGameOver = true;
      announcer.innerHTML = `Player <span class="display-player playerO">O</span> won the game!`;
    }
    if (isBoardFull() && !isGameOver) {
      announcer.innerHTML = `It's a tie!`;
      isGameOver = true;
    }
    changePlayer();
    if (isAiPlaying && !isGameOver && !isBoardFull()) {
      let aiMove;
      if (isUnbeatablePlaying) {
        aiMove = getUnbeatableAiMove();
      } else {
        aiMove = getRandomAiMove();
      }
      rowIndex = aiMove[0];
      colIndex = aiMove[1];
      tiles[rowIndex * 3 + colIndex].innerHTML = "O";
      boardArray[rowIndex][colIndex] = "O";
      if (getWinningPlayer("O") === 1) {
        isGameOver = true;
        announcer.innerHTML = `Player <span class="display-player playerO">O</span> won the game!`;
      }

      changePlayer();
    }
  }

  if (
    !checkEmptyBoard() &&
    !document.getElementById("optionsSection").classList.contains("hide")
  ) {
    document.getElementById("optionsSection").classList.add("hide");
  }
}

function changePlayer() {
  if (currentPlayer === 0) {
    currentPlayer = 1;
    playerDisplay.classList.replace("playerX", "playerO");
    playerDisplay.innerHTML = "O";
  } else {
    currentPlayer = 0;
    playerDisplay.classList.replace("playerO", "playerX");
    playerDisplay.innerHTML = "X";
  }
}

function isBoardFull() {
  for (currentArray of boardArray) {
    if (currentArray.includes(".")) {
      return false;
    }
  }
  return true;
}

// Returns the input index (which has a range from 0 to 8)
// as a list of list, a 3x3 grid (with X and Y indexes ranging
// from 0 to 2). The return variable is an array, the 1st element
// being the X, the 2nd element being the Y coordinate.

function get2Dfrom1D(index) {
  const returnArray = [];
  switch (index) {
    case 0:
      returnArray[0] = 0;
      returnArray[1] = 0;
      break;
    case 1:
      returnArray[0] = 0;
      returnArray[1] = 1;
      break;
    case 2:
      returnArray[0] = 0;
      returnArray[1] = 2;
      break;
    case 3:
      returnArray[0] = 1;
      returnArray[1] = 0;
      break;
    case 4:
      returnArray[0] = 1;
      returnArray[1] = 1;
      break;
    case 5:
      returnArray[0] = 1;
      returnArray[1] = 2;
      break;
    case 6:
      returnArray[0] = 2;
      returnArray[1] = 0;
      break;
    case 7:
      returnArray[0] = 2;
      returnArray[1] = 1;
      break;
    case 8:
      returnArray[0] = 2;
      returnArray[1] = 2;
      break;
  }
  return returnArray;
}

function checkWinningChance(currentSymbol) {
  let boardlength = 8;
  for (let i = 0; i <= boardlength; i++) {
    let indexRow = get2Dfrom1D(i)[0];
    let indexCol = get2Dfrom1D(i)[1];
    if (boardArray[indexRow][indexCol] === ".") {
      boardArray[indexRow][indexCol] = currentSymbol;
      if (getWinningPlayer("O") === 1 || getWinningPlayer("X") === 1) {
        boardArray[indexRow][indexCol] = ".";
        return [indexRow, indexCol];
      } else {
        boardArray[indexRow][indexCol] = ".";
      }
    }
  }
  return false;
}

function getWinningPlayer(whatWeAreLookingFor) {
  // Horizontal winning conditions
  if (
    boardArray[0][0] === whatWeAreLookingFor &&
    boardArray[0][1] === whatWeAreLookingFor &&
    boardArray[0][2] === whatWeAreLookingFor
  ) {
    return currentPlayer;
  }
  if (
    boardArray[1][0] === whatWeAreLookingFor &&
    boardArray[1][1] === whatWeAreLookingFor &&
    boardArray[1][2] === whatWeAreLookingFor
  ) {
    return currentPlayer;
  }
  if (
    boardArray[2][0] === whatWeAreLookingFor &&
    boardArray[2][1] === whatWeAreLookingFor &&
    boardArray[2][2] === whatWeAreLookingFor
  ) {
    return currentPlayer;
  }
  // Vertical winning conditions
  if (
    boardArray[0][0] === whatWeAreLookingFor &&
    boardArray[1][0] === whatWeAreLookingFor &&
    boardArray[2][0] === whatWeAreLookingFor
  ) {
    return currentPlayer;
  }
  if (
    boardArray[0][1] === whatWeAreLookingFor &&
    boardArray[1][1] === whatWeAreLookingFor &&
    boardArray[2][1] === whatWeAreLookingFor
  ) {
    return currentPlayer;
  }
  if (
    boardArray[0][2] === whatWeAreLookingFor &&
    boardArray[1][2] === whatWeAreLookingFor &&
    boardArray[2][2] === whatWeAreLookingFor
  ) {
    return currentPlayer;
  }
  // Diagonal winning conditions
  if (
    boardArray[0][0] === whatWeAreLookingFor &&
    boardArray[1][1] === whatWeAreLookingFor &&
    boardArray[2][2] === whatWeAreLookingFor
  ) {
    return currentPlayer;
  }
  if (
    boardArray[2][0] === whatWeAreLookingFor &&
    boardArray[1][1] === whatWeAreLookingFor &&
    boardArray[0][2] === whatWeAreLookingFor
  ) {
    return currentPlayer;
  }
}

function aiVersusAiMode() {
  boardArray = getEmptyBoard();
  let symbol = "O";
  announcer.innerHTML = "lOok, they're playing!"
  const interVall = setInterval(() => {
    if (!isBoardFull() && ![0,1].includes(getWinningPlayer(symbol))) {
      if (symbol === "X") {
        symbol = "O";
      } else {
        symbol = "X";
      }
      let currentMove = getRandomAiMove();
      boardArray[currentMove[0]][currentMove[1]] = symbol;
      tiles[currentMove[0] * 3 + currentMove[1]].innerHTML = symbol;
      changePlayer();
    } else {
      clearInterval(interVall);
      isGameOver = true;
      if (isBoardFull()  && ![0,1].includes(getWinningPlayer(symbol))) {
        announcer.innerHTML = `It's a tie!`;
      } else {
        announcer.innerHTML = `Player <span class="display-player playerX">${symbol}</span> won the game!`;
      }
      document.getElementById("aiAgainstAI").checked = false;
      isAiVsAiModeOn = !isAiVsAiModeOn;
    }
  }, 1000);
}



askPlayerToMove();
