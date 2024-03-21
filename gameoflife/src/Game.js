import React from 'react';
import './Game.css';

const CELL_SIZE = 15;
const WIDTH = 300;
const HEIGHT = 300; 
const COLORS = {
            0: 'White',
            1: 'White',
            2: 'Yellow',
            3: 'Yellow',
            4: 'Purple',
            5: 'Purple',
            6: 'Red',
            7: 'Red',
            8: 'DarkRed',
            9: 'DarkRed'
        }

class Cells extends React.Component {
    state = {
        occurrences: 0,
    }

    render() {
        const { x, y, color } = this.props;
        if(color === 0){
            if(this.state.occurrences >= 8){
                this.setState({occurrences: 8});
            }else{
                this.setState({occurrences: this.state.occurrences+1});
            }
        }
        console.log(this.state.occurrences)
        return(
            <div className='Cell' style={{
                left: `${CELL_SIZE * x + 1}px`,
                top: `${CELL_SIZE * y + 1}px`,
                width: `${CELL_SIZE - 1}px`,
                height: `${CELL_SIZE - 1}px`,
                backgroundColor: COLORS[this.state.occurrences],
            }}/>
        );
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this.rowsInput = React.createRef();
        this.colsInput = React.createRef();
        this.board = this.makeEmptyBoard();
    }
    

    state = {
        cells: [],
        interval: 100,
        isRunning: false, 
        aliveCells:0, 
        heat: false,
        rows: HEIGHT / CELL_SIZE,
        cols: WIDTH / CELL_SIZE,
        error: false,
    }

    autoRunGame = () => {
        this.setState({ isRunning: true });
        this.runIteration();
    }

    runGame = () => {
        this.setState({ isRunning: true });
        this.runIteration();
        this.stopGame();
    }

    stopGame = () => {
        this.setState({ isRunning: false });  
        if (this.timeoutHandler) {
            window.clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;    
        } 
    }

    runIteration() {
        let newBoard = this.makeEmptyBoard();
        let aliveCellsCount = 0;

        for (let y = 0; y < this.state.rows; y++) {
            for (let x = 0; x < this.state.cols; x++) {
                let neighbors = this.calculateNeighbors(this.board, x, y);
                if (this.board[y][x]) {
                    if (neighbors === 2 || neighbors === 3) {
                        newBoard[y][x] = true;
                        aliveCellsCount++;
                    } else {
                        newBoard[y][x] = false;
                    }
                } else {
                    if (!this.board[y][x] && neighbors === 3) {
                        newBoard[y][x] = true;
                        aliveCellsCount++;
                    }
                }
            }
        }
        this.board = newBoard;
        this.setState({ cells: this.makeCells() });
        this.setState({ aliveCells: aliveCellsCount });

        this.timeoutHandler = window.setTimeout(() => {
            this.runIteration();
        }, this.state.interval);
    }

    calculateNeighbors(board, x, y) {
        let neighbors = 0;
        const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            let y1 = y + dir[0];
            let x1 = x + dir[1];

            if (x1 >= 0 && x1 < this.state.cols && y1 >= 0 && y1 < this.state.rows && board[y1][x1]) {
                neighbors++;
            }
        }

        return neighbors;
    }

    makeEmptyBoard() {
        let board = [];
        for (let y = 0; y < this.state.rows; y++) {
            board[y] = [];
            for (let x = 0; x < this.state.cols; x++) {
                board[y][x] = false;
            }
        }
        return board;
    }

    makeCells() {
        let cells = [];
        for (let y = 0; y < this.state.rows; y++) {
            for (let x = 0; x < this.state.cols; x++) {
                if (this.board[y][x]) {
                    let color = 0;
                    cells.push({ x, y, color});
                }
            }
        }
        return cells;
    }

    getElementOffset() {
        const rect = this.boardRef.getBoundingClientRect();
        const doc = document.documentElement;
        return {
            x: (rect.left + window.scrollX) - doc.clientLeft,
            y: (rect.top + window.scrollY) - doc.clientTop,
        };
    }

    handleClick = (event) => {
        const elemOffset = this.getElementOffset();
        const offsetX = event.clientX - elemOffset.x;
        const offsetY = event.clientY - elemOffset.y;
        const x = Math.floor(offsetX / CELL_SIZE);
        const y = Math.floor(offsetY / CELL_SIZE);

        if (x >= 0 && x <= this.state.cols && y >= 0 && y <= this.state.rows) {
            this.board[y][x] = !this.board[y][x];
        }
        this.setState({cells: this.makeCells()});
    }

    handleRandom = () => {
        let count = 0;
        for (let y = 0; y < this.state.rows; y++) {
            for (let x = 0; x < this.state.cols; x++) {
                // I set the rate 20% to make animation more visible
                this.board[y][x] = (Math.random() < 0.2);
                if(this.board[y][x] === true){count++;}
            }
        }

        this.setState({ cells: this.makeCells() });
        this.setState({ aliveCells: count });

    }

    handleClear = () => {
        this.board = this.makeEmptyBoard();
        this.setState({ cells: this.makeCells() });
        this.setState({ aliveCells: 0});
    }

    handleSizeChange = () => {
        const newRows = parseInt(this.rowsInput.current.value);
        const newCols = parseInt(this.colsInput.current.value);
        if (newRows >= 3 && newRows <= 40 && newCols >= 3 && newCols <= 40) {
            this.setState({
                rows: newRows,
                cols: newCols,
                showError: false, 
            }); 
        } else {
            this.setState({ showError: true }); 
        }
    };

    handleHeatColor = () => {
        // Update the cells with the new colors
        this.setState({ heat: true });
    }

    stopHeat = () => {
        this.setState({ heat: false });
    }
    

    render() {
        const { cells, rows, cols, showError } = this.state;
        const width = cols * CELL_SIZE;
        const height = rows * CELL_SIZE;
        
        return (
            <div>
                <h1>Alive cells: {this.state.aliveCells}</h1>
                
                <div className='inputField'>
                    <label>
                        Rows: 
                        <input 
                            type="number" 
                            defaultValue={rows} 
                            ref={this.rowsInput}
                        />
                    </label>
                    <label>
                        Cols: 
                        <input 
                            type="number" 
                            defaultValue={cols} 
                            ref={this.colsInput}
                        />
                    </label>
                    <button onClick={this.handleSizeChange}>Submit</button>
                </div>

                {showError && <div className="error-message">Please enter a number between 3 and 40.</div>}

                <div className='Board' 
                    style={{ 
                    width: `${width}px`, 
                    height: `${height}px`,
                    backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
                    }}
                    onClick={this.handleClick}
                    ref={(n) => { this.boardRef = n;}}>
                {cells.map(cell => (
                    <Cells
                        x = {cell.x} 
                        y = {cell.y} 
                        key = {`${cell.x}, ${cell.y}`}
                    />         
                        
                    ))}
                </div>


                <div className="buttonContainer">     
                    {this.state.isRunning ? (
                        <button className="button" onClick={this.stopGame}>
                        Stop
                        </button>
                    ) : (
                        <button className="button" onClick={this.runGame}>
                        Run
                        </button>
                    )}
                    <button className="button" onClick={this.handleClear}>Reset</button>
                    <button className="button" onClick={this.handleRandom}>Random</button>

                    {/* Extra bonus --> Autoplay */}
                    {this.state.isRunning ? (
                        <button className="button" onClick={this.stopGame}>
                            Pause
                        </button>
                    ) : (
                        <button className="button" onClick={this.autoRunGame}>
                            AutoPlay
                        </button>
                    )}

                        {/* heat map */}
                    {this.state.heat ? (
                        <button className="button" onClick={this.stopHeat}>
                            stopHeat
                        </button>
                    ) : (
                        <button className="button" onClick={this.handleHeatColor}>
                            Heatmap
                        </button>
                    )}

                </div>  
            </div>
        );
    }
}

export default Game;