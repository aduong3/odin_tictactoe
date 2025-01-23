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

  return { getBoard, placeMarker, printBoard };
}

function Cell() {
  let value = "";

  const addMarker = (marker) => {
    value = marker;
  };

  const getValue = () => value;

  return { addMarker, getValue };
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
      }
      //   } else if (
      //     board[0][i] != "" &&
      //     board[0][i] == board[1][i] &&
      //     board[0][i] == board[2][i]
      //   ) {
      //     //check columns
      //     return true;
      //   }
      // }
      // //check diagonals [0][0] [1][1] [2][2], [0][2] [1][1] [2][0]
      // if (
      //   board[0][0] == marker &&
      //   board[0][0] == board[1][1] &&
      //   board[0][0] == board[2][2]
      // ) {
      //   return true;
      // } else if (
      //   board[0][2] == marker &&
      //   board[0][2] == board[1][1] &&
      //   board[0][2] == board[2][0]
      // ) {
      //   return true;
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
  };

  function clickHandlerBoard(e) {
    if (!game.checkWinner()) {
      const selectedRow = e.target.dataset.row;
      const selectedColumn = e.target.dataset.column;
      game.playRound(selectedRow, selectedColumn);
      updateScreen();
    }
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();
}

ScreenController();
