import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  let className;

  if (props.isWinner) {
    className = "square square--winner";
  } else {
    className = "square";
  }

  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board(props) {
  const rows = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];

  return (
    <div>
      {
        rows.map((row, i) => {
          return (
            <div className="board-row" key={i}>
              {
                row.map((idSquare) => {
                  return (
                    <Square
                      key={idSquare}
                      isWinner={props.winnerLine && props.winnerLine.includes(idSquare)}
                      value={props.squares[idSquare]}
                      onClick={() => props.onClick(idSquare)}
                    />
                  );
                })
              }
            </div>
          );
        })
      }
    </div>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      isAsc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const { winner } = calculateWinner(squares);

    if (winner || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleSort() {
    this.setState({
      isAsc: !this.state.isAsc,
    });
  }

  render() {
    const history = this.state.history;
    const sortedHistory = this.state.isAsc ? history.slice() : history.slice().reverse();
    const current = history[this.state.stepNumber];
    const { winnerLine, winner } = calculateWinner(current.squares);

    const moves = sortedHistory.map((step, i, arr) => {
      const move = this.state.isAsc ? i : arr.length - 1 - i;
      const desc = move ? `Перейти к ходу #${move}` : `К началу игры`;
      const rows = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
      let button;

      if (move === this.state.stepNumber) {
        button = <button className="button" onClick={() => this.jumpTo(move)}><b>{desc}</b></button>;
      } else {
        button = <button className="button" onClick={() => this.jumpTo(move)}>{desc}</button>;
      }

      return (
        <li className="turn" key={move}>
          {button}
          <table className="table">
            <tbody>
            {
              rows.map((row, i) => {
                return (
                  <tr className="table__row" key={i}>
                    {
                      row.map(cell => {
                        return (
                          <td className="table__cell" key={cell}>{step.squares[cell]}</td>
                        );
                      })
                    }
                  </tr>
                );
              })
            }
            </tbody>
          </table>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Выиграл: ' + winner;
    } else if (this.state.stepNumber === 9 && !winner) {
      status = 'Ничья';
    } else {
      status = 'Следующий ход: ' + (this.state.xIsNext ? 'X': 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winnerLine={winnerLine}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="game-info__top-line">
            <div>{status}</div>
            <button className="sort-button" onClick={() => this.handleSort()}>{this.state.isAsc ? "∨" : "∧"}</button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winnerLine: lines[i], winner: squares[a] };
    }
  }
  return { winnerLine: null, winner: null };
}