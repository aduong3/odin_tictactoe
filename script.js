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

  return { getBoard, placeMarker, printBoard };
};

function Cell() {
  let value = "";

  const setValue = (marker) => {
    value = marker;
  };

  const getValue = () => value;

  return { setValue, getValue };
};

function turnCounter() {
  let turn = 1;

  const getTurn = () => turn;
  const increaseTurn = () => turn++;

  return {getTurn, increaseTurn};
};

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();
  const turnCount = turnCounter();

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
    if(turnCount.getTurn() === 9){
      return 'tie';
    }
    return null;
  };

  const isGameOver = () => {
    const status = checkStatus();
    //console.log(status);
    if(status === 'win'){
      console.log(`${getActivePlayer().name} has won!`);
      gameOver = true;
    } else if(status === 'tie'){
      console.log('Tie Game!');
      gameOver = true;
    }
    return gameOver;
  };

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    turnCount.increaseTurn();
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
  };

  const playRound = (row, column) => {
      if(gameOver){
        console.log("The game is over. Please reset to play again.");
        return;
      }
      if(board.getBoard()[row][column].getValue() == ''){
      board.placeMarker(row, column, getActivePlayer().marker);
      printNewRound();

      if(!isGameOver()){
        switchPlayerTurn();
      }
      } else{
        console.log("Invalid move! Pick another cell!");
      }
  };

  printNewRound();

  return {
    playRound,
  };
}

const game = GameController();
