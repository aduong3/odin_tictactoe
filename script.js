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
    while (board[row][column].getValue() === '') {
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

  const playRound = (row, column) => {
    board.placeMarker(row, column, getActivePlayer().marker);

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
  };
}

const game = GameController();
