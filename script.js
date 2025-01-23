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
      board[row][column].addMarker(marker);
    }
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

  const addMarker = (marker) => {
    value = marker;
  };

  const getValue = () => value;
  const resetValue = () => (value = "");

  return { addMarker, getValue, resetValue };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

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

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
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
    board.placeMarker(row, column, getActivePlayer().marker);
    if (!checkWinner()) {
      switchPlayerTurn();
    } else {
      console.log(`${getActivePlayer().name} has won!`);
    }

    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    resetBoard: board.resetBoard,
    checkWinner,
  };
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector(".playerTurn");
  const boardDiv = document.querySelector(".board");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    board.forEach((row, i) => {
      row.forEach((cell, index) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = i;
        cellButton.dataset.column = index;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });

    if (game.checkWinner()) {
      if(!document.querySelector('.resetButton')){
      const resetDiv = document.querySelector(".reset");
      const resetButton = document.createElement("button");
      resetButton.classList.add("resetButton");
      resetButton.textContent = "Reset Game";
      resetButton.addEventListener("click", game.resetBoard);
      resetDiv.appendChild(resetButton);
      }
    } else if (!game.checkWinner() && document.querySelector(".resetButton")) {
      document.querySelector(".resetButton").remove();
    }
  };

  function clickHandlerBoard(e) {
    if (!game.checkWinner()) {
      const selectedRow = e.target.dataset.row;
      const selectedColumn = e.target.dataset.column;
      game.playRound(selectedRow, selectedColumn);
    }
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();

  return {updateScreen};
}

ScreenController();
