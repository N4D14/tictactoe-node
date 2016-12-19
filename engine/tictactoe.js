
// A class to represent the Tic Tac Toe board
// and logic for making the best next move
class Board {
  constructor(squares, nextPlayer) {
    this.squares = squares;
    this.nextPlayer = nextPlayer;
  }

  // Get the player from the previous turn
  prevPlayer() {
    return this.nextPlayer == "X" ? "O" : "X";
  }

  // List the remaining empty squares
  empty() {
    var emptySquares = []
    for (let i=0; i<this.squares.length; i++) {
      if (!this.squares[i]) emptySquares.push(i);
    }
    return emptySquares;
  }

  // Utility to provide winning square sequences
  winningSeq(i,j,k) {
    return (
      this.squares[i] && 
      this.squares[i] === this.squares[j] && 
      this.squares[i] === this.squares[k]
    );
  }

  // Determine if this board state has a winner
  winner() {
    // Check columms and rows
    var cols = [0,1,2];
    var rows = [0,3,6];
    for (let i=0; i<3; i++){
      var k = cols[i]
      if (this.winningSeq(k,k+3,k+6)) {
        return this.prevPlayer();
      }
      var j = rows[i]
      if (this.winningSeq(j,j+1,j+2)) {
        return this.prevPlayer();
      }      
    }
    // Check diagonals
    if (this.winningSeq(0,4,8)){
      return this.prevPlayer();
    }
    if (this.winningSeq(2,4,6)){
      return this.prevPlayer();
    }
    return null;
  }

  // The game is over if there is a winner 
  // or a draw (all squares filled)
  gameOver() {
    var w = this.winner();
    if (w || this.empty().length == 0){
      return true;
    }
    return false;
  }

  // Collect all possible boards after the next move
  nextBoards() {
    var result = [];
    if (this.gameOver()) {
      return result;
    }

    this.empty().forEach((i) => {
      var nextSquares = this.squares.slice();
      nextSquares[i] = this.nextPlayer;
      result.push(new Board(nextSquares, this.prevPlayer()));
    });

    return result;
  }

  // If this is the end of the game 
  // return a score, otherwise calculate
  // the minimax scores for the next moves
  calculateScore(depth, player) {
    var score = 0;
    if (this.gameOver()){
      const w = this.winner();
      if (w) {
        score = (w == player) ? 10-depth : depth-10;
      }
    } else  {
      const boards = this.nextBoards();
      var scores = [];
      boards.forEach((b) => {
        scores.push(b.calculateScore(depth+1, player));
      })
      if (this.nextPlayer == player){
        score = Math.max(...scores);
      } else {
        score = Math.min(...scores);
      }
    }
    return score;
  }

  // Made the best possible move for this board
  // and reset this board to the result
  makeMove() {
    var bMax = null;
    var bestBoard = null;
    const boards = this.nextBoards();
    boards.forEach((b) => {
      var score = b.calculateScore(1, this.nextPlayer);
      if (bMax === null || score > bMax){
        bMax = score;
        bestBoard = b;
      }
    })
    this.squares = bestBoard.squares.slice();
    this.nextPlayer = bestBoard.nextPlayer;
  }
}

module.exports = Board;