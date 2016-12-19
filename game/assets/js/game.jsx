import { sample } from 'underscore';
import React from 'react';
import 'whatwg-fetch';

// Function to render a square on the tic tac toe board
function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

// Render main board
class Board extends React.Component {
  // Render a single square and pass click function
  renderSquare(i) {
    return <Square
      key={`square-${i}`} 
      value={this.props.squares[i]} 
      onClick={() => this.props.onClick(i)}
    />;
  }

  // Render a single row
  renderRow(i) {
    let rowSquares = [];
    for(let j = i; j < i+3; j++) {
      rowSquares.push(this.renderSquare(j));
    }
    return rowSquares;
  }

  // Render the rows in a loop
  renderRows() {
    let boardRows = [];
    for (let i=0; i<9; i += 3) {
      boardRows.push(
        <div key={`board-row-${i}`} 
          className="board-row">
          {this.renderRow(i)}
        </div>
      );
    }
    return boardRows;
  }

  // Render the board
  render() {
    return (
      <div>
        {this.renderRows()}
      </div>
    );
  } 
}

// Main game class contatins state of board and turn
export class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true
    };
  }

  // Render the game and pass state and click function
  render() {
    const winner = this.determineWinner(this.state.squares);

    let status;
    if (winner) {
      status = (winner != 'Draw') ? `Winner is ${winner}` : 'Draw! Game Over.';
    } else {
      const next = this.nextPlayer();
      status = `Next player: ${next}`;      
    }
    return (
      <div className="game">
        <div className="game-board">
          <h1 className='Header'>Tic Tac Toe</h1>
          <div className="status">{status}</div>
          <Board 
            squares={this.state.squares}
            onClick={(i) => this.handleClick(i)}
          />
          <button className="reset-button" onClick={() => this.reset()}>
            Reset
          </button>
        </div>
      </div>
    );
  }

  // Handle user click on squaress
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (squares[i]) return;
    if (!this.state.xIsNext) return;
    if (this.determineWinner(squares)) return;

    squares[i] = this.nextPlayer();
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext
    });
  }

  // Get the next player string
  nextPlayer() {
    return this.state.xIsNext ? 'X' : 'O';
  }

  // Reset the board (at any time)
  reset() {
    this.setState({
      squares: Array(9).fill(null),
      xIsNext: true      
    })
  }

  // Following a board update play the computer's turn if necessary
  componentDidUpdate(prevProps, prevState) {
    if (!this.determineWinner(this.state.squares) && !this.state.xIsNext) {
      fetch('/api/engine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nextPlayer: this.nextPlayer(),
          squares: this.state.squares,
        })
      }).then(function(response) {
        return response.json();
      }).then((board) => {this.setState({
          squares: board.squares,
          xIsNext: board.nextPlayer === 'X' ? true : false
        })
      }).catch(function(ex) {
        console.log('parsing failed', ex);
      });
    }
  }

  winningSeq(i,j,k,squares) {
    return (
      squares[i] && 
      squares[i] === squares[j] && 
      squares[i] === squares[k]      
    );
  }

  // Determine if the current game state has provided a winner or a draw
  determineWinner(squares) {
    // Check columms and rows
    var cols = [0,1,2];
    var rows = [0,3,6];
    for (let i=0; i<3; i++){
      var k = cols[i]
      if (this.winningSeq(k,k+3,k+6,squares)) {
        return squares[k];
      }
      var j = rows[i]
      if (this.winningSeq(j,j+1,j+2,squares)) {
        return squares[j];
      }      
    }
    // Check diagonals
    if (this.winningSeq(0,4,8,squares)){
      return squares[0];
    }
    if (this.winningSeq(2,4,6,squares)){
      return squares[2];
    }
    // Check for a Draw
    let full = true;
    squares.forEach((v) => {
      if (!v) full = false;
    });
    if (full) return 'Draw';
    // No win or draw
    return null;
  }
}
