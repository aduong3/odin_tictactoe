function Gameboard() {
  //Create a 3x3 board for our tic-tac-toe game
  const row = 3;
  const column = 3;
  const board = [];
  for (let i = 0; i < row; i++) {
    board[i] = [];
    for (let j = 0; j < column; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeMarker = (row, column, marker) => {
    //console.log(board[row][column].getValue());
    while (board[row][column].getValue() === "") {

      board[row][column].setValue(marker);

    }
    //console.log(board[row][column].getValue());
  };

  const printBoard = () => {
    const boardWithValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithValues);
  };

  const resetBoard = () => {
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < column; j++) {
        board[i][j].resetValue();
      }
    }
    ScreenController().updateScreen();
  };

  return { getBoard, placeMarker, printBoard, resetBoard };
}

function Cell() {
  let value = "";

  const setValue = (marker) => {
    value = marker;
  };

  const getValue = () => value;
  const resetValue = () => (value = "");


  return { setValue, getValue };
}

function turnCounter() {
  let turn = 0;

  const getTurn = () => turn;
  const increaseTurn = () => turn++;

  return { getTurn, increaseTurn };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  let board = Gameboard();
  let turnCount = turnCounter();

  const players = [
    {
      name: playerOneName,
      marker: "X",
    },
    {
      name: playerTwoName,
      marker: "O",
    },
  ];
  let activePlayer = players[0];
  let gameOver = false;

  const checkStatus = () => {
    const checkBoard = board.getBoard();
    const marker = getActivePlayer().marker;

    let firstDiagCount = 0;
    let secondDiagCount = 0;
    //console.log(checkBoard[0][0].getValue());
    //console.log(turnCount.getTurn());
    for (let i = 0; i < 3; i++) {
      if (
        //rows
        checkBoard[i][0].getValue() == marker &&
        checkBoard[i][0].getValue() == checkBoard[i][1].getValue() &&
        checkBoard[i][0].getValue() == checkBoard[i][2].getValue()
      ) {
        //console.log('winner');
        return "win";
      }
      if (
        //columns
        checkBoard[0][i].getValue() == marker &&
        checkBoard[0][i].getValue() == checkBoard[1][i].getValue() &&
        checkBoard[0][i].getValue() == checkBoard[2][i].getValue()
      ) {
        return "win";
      }
      if (checkBoard[i][i].getValue() == marker) {
        //diagonals [0][0],[1][1],[2][2] || [0][2] [1][1] [2][0]; [i][i] || [i][2-i]
        firstDiagCount++;
      }
      if (checkBoard[i][2 - i].getValue() == marker) {
        secondDiagCount++;
      }

      if (firstDiagCount == 3 || secondDiagCount == 3) return "win";
    }
    if (turnCount.getTurn() === 9) {
      return "tie";
    }
    return null;
  };

  const isGameOver = () => {
    const status = checkStatus();
    const playerTurnDiv = document.querySelector('.playerTurn');
    //console.log(status);
    if (!gameOver) {
      if (status === "win") {
        playerTurnDiv.textContent = `${getActivePlayer().name} has won!`;
        console.log(`${getActivePlayer().name} has won!`);
        gameOver = true;
      } else if (status === "tie") {
        playerTurnDiv.textContent = 'Tie Game!'
        console.log("Tie Game!");
        gameOver = true;
      }
    }
    return gameOver;
  };

  const reset = () => {
    board = Gameboard();
    turnCount = turnCounter();
    activePlayer = players[0];
    gameOver = false;
    console.log("Game reset!");
    printNewRound();
  };

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    turnCount.increaseTurn();
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
  };

  const checkWinner = () => {
    for (let i = 0; i < 3; i++) {
      if (
        board.getBoard()[i][0].getValue() != "" &&
        board.getBoard()[i][0].getValue() ==
          board.getBoard()[i][1].getValue() &&
        board.getBoard()[i][0].getValue() == board.getBoard()[i][2].getValue()
      ) {
        //check rows
        //winner = (board[i][0] === 'X' ? players[0].name : players[1].name);
        return true;
      } else if (
        board.getBoard()[0][i].getValue() != "" &&
        board.getBoard()[0][i].getValue() ==
          board.getBoard()[1][i].getValue() &&
        board.getBoard()[0][i].getValue() == board.getBoard()[2][i].getValue()
      ) {
        //check columns
        return true;
      }
    }
    //check diagonals [0][0] [1][1] [2][2], [0][2] [1][1] [2][0]
    if (
      board.getBoard()[0][0].getValue() != "" &&
      board.getBoard()[0][0].getValue() == board.getBoard()[1][1].getValue() &&
      board.getBoard()[0][0].getValue() == board.getBoard()[2][2].getValue()
    ) {
      return true;
    } else if (
      board.getBoard()[0][2].getValue() != "" &&
      board.getBoard()[0][2].getValue() == board.getBoard()[1][1].getValue() &&
      board.getBoard()[0][2].getValue() == board.getBoard()[2][0].getValue()
    ) {
      return true;
    }
  };

  const playRound = (row, column) => {


    if (gameOver) {
      console.log("The game is over. Please reset to play again.");
      return;
    }
    if (board.getBoard()[row][column].getValue() == "") {
      board.placeMarker(row, column, getActivePlayer().marker);
      printNewRound();

      if (!isGameOver()) {
        switchPlayerTurn();
      }
    } else {
      console.log("Invalid move! Pick another cell!");
    }

  };

  printNewRound();

  return {
    playRound,
    reset,
    getActivePlayer,
    getBoard: board.getBoard,
    isGameOver,
    players,
  };
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".playerTurn");
  const boardDiv = document.querySelector(".board");

  const playerOne = document.querySelector('.playerOne');
  const playerTwo = document.querySelector('.playerTwo');



  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerOne.textContent = `${game.players[0].name} (${game.players[0].marker})`;
    playerTwo.textContent = `${game.players[1].name} (${game.players[1].marker})`;

      //console.log(game.isGameOver());
      if(document.querySelector('.resetButton')) document.querySelector('.resetButton').remove();
      if(!game.isGameOver()) {
      playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
      } else {
        if(!document.querySelector('.resetButton')){
        const resetDiv = document.querySelector('.resetDiv');
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Game';
        resetButton.classList.add('resetButton');
        resetButton.addEventListener('click', () => {
        ScreenController();
      });
    
        resetDiv.appendChild(resetButton);
    } 
      }

    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = i;
        cellButton.dataset.column = j;

        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });

  };


  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }



  boardDiv.addEventListener("click", clickHandlerBoard);
  updateScreen();




}

ScreenController();
