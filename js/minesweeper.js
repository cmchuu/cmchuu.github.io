// Game
var gameT;
var game;

// Images
var bombImage = "<img src=\"images/bomb.png\">";
var flagImage = "<img src=\"images/flag.png\">";
var wrongBombImage = "<img src=\"images/wrong-bomb.png\">";

// Sizes
var blockSize = 32;
var gameSize = 15;
var totalBombs = 38;

// States
var winner = false;
var hitBomb = false;

// Colours (stolen from some other place)
var colours = [
    "",
    "#0000FA",
    "#4B802D",
    "#DB1300",
    "#202081",
    "#690400",
    "#457A7A",
    "#1B1B1B",
    "#7A7A7A",
];

// Cell constructor
class Cell {
    constructor(row, column) {
        this.row = row;
        this.column = column;
        this.bomb = false;
        this.revealed = false;
        this.flagged = false;
    }

    getAdj() {
        var adj = [];
        var lastRow = game.length - 1;
        var lastColumn = game[0].length - 1;
        if (this.row > 0 && this.column > 0) adj.push(game[this.row - 1][this.column - 1]);
        if (this.row > 0) adj.push(game[this.row - 1][this.column]);
        if (this.row > 0 && this.column < lastColumn) adj.push(game[this.row - 1][this.column + 1]);
        if (this.column < lastColumn) adj.push(game[this.row][this.column + 1]);
        if (this.row < lastRow && this.column < lastColumn) adj.push(game[this.row + 1][this.column + 1]);
        if (this.row < lastRow) adj.push(game[this.row + 1][this.column]);
        if (this.row < lastRow && this.column > 0) adj.push(game[this.row + 1][this.column - 1]);
        if (this.column > 0) adj.push(game[this.row][this.column - 1]);
        return adj;
    }

    getBombs() {
        var cells = this.getAdj();
        var bombs = cells.reduce((acc, cell) => {
            return acc + (cell.bomb ? 1 : 0)
        }, 0);
        this.bombs = bombs;
    }

    flag() {
        if (!this.revealed)
        {
            this.flagged = !this.flagged;
            return this.flagged;
        }
    }

    reveal() {
        if ((this.revealed && !hitBomb) || this.flagged) return;
        this.revealed = true;
        if (this.bomb) return true;
        if (this.bombs == 0)
        {
            var cells = this.getAdj();
            cells.forEach((cell) => {
                if (!cell.revealed) cell.reveal();
            });
        }

        return false;
    }
}

window.onload = function() {
    gameT = document.getElementById("minesweeperTable");
    createEvents();
    startGame();
}

function createEvents() {
    gameT.addEventListener("click", (e) => {
        if (winner || hitBomb) return;
        var clickedElement = e.target.tagName.toLowerCase() === "img" ? e.target.parentElement : e.target;
        
        if (clickedElement.classList.contains("cell"))
        {
            var row = parseInt(clickedElement.dataset.row);
            var column = parseInt(clickedElement.dataset.column);
            var cell = game[row][column];

            if (e.ctrlKey && !cell.revealed && totalBombs > 0)
            {
                totalBombs += cell.flag() ? -1 : 1;
            }
            else
            {
                hitBomb = cell.reveal();
                if (hitBomb)
                {
                    endGame();
                }
            }

            winner = checkWin();
            createVisual();
        }
    })

    document.getElementById("restartBtn").onclick = () => {
        startGame()
    }
}

function startGame() {
    totalBombs = 38;

    // States
    winner = false;
    hitBomb = false;

    buildTable();
    game = buildArrays();
    buildCells();
    createVisual();
}

function endGame() {
    game.forEach((rowArr) => {
        rowArr.forEach((cell) => {
            cell.reveal();
        });
    })
}

function checkWin() {
    for (var row = 0; row < game.length; row++)
    {
        for (var column = 0; column < game[0].length; column++)
        {
            var cell = game[row][column];
            if (!cell.revealed && !cell.bomb) return false;
        }
    }

    return true;
}

function buildTable() {
    gameT.innerHTML = `<tr>${"<td class=\"cell\"></td>".repeat(gameSize)}</tr>`.repeat(gameSize);
    gameT.style.width = "420px";
    var cells = Array.from(document.querySelectorAll("td"));
    cells.forEach(function(cell, index) {
        cell.setAttribute("data-row", Math.floor(index / gameSize));
        cell.setAttribute("data-column", index % gameSize);
    });
}

function buildArrays() {
    var arr = Array(gameSize).fill(null);
    arr = arr.map(() => {
        return new Array(gameSize).fill(null);
    });
    return arr;
}

function buildCells() {
    game.forEach((array, rowIndex) => {
        array.forEach((slot, columnIndex) => {
            game[rowIndex][columnIndex] = new Cell(rowIndex, columnIndex);
        });
    });

    curTotalBombs = totalBombs;
    while (curTotalBombs != 0)
    {
        var row = Math.floor(Math.random() * gameSize);
        var column = Math.floor(Math.random() * gameSize);
        var cell = game[row][column];
        if (!cell.bomb)
        {
            cell.bomb = true;
            curTotalBombs -= 1;
        }
    }

    game.forEach((array) => {
        array.forEach((cell) => {
            cell.getBombs();
        });
    })
    
    var starter = false;

    game.forEach((array) => {
        array.forEach((cell) => {
            if (!starter && !cell.bombs && !cell.bomb)
            {
                cell.reveal();
                starter = true;
            }
        });
    });
}

function createVisual() {
    document.getElementById("bomb-counter").innerHTML = "Bombs Left: " + totalBombs.toString();
    var tdList = Array.from(document.querySelectorAll("[data-row]"));

    tdList.forEach((td) => {
        var rowIndex = parseInt(td.getAttribute("data-row"));
        var columnIndex = parseInt(td.getAttribute("data-column"));
        var cell = game[rowIndex][columnIndex];

        if (cell.flagged)
        {
            td.innerHTML = flagImage;
        }
        else if (cell.revealed)
        {
            if (cell.bomb)
            {
                td.innerHTML = bombImage;
            }
            else if (cell.bombs)
            {
                td.className = "revealed";
                td.style.color = colours[cell.bombs];
                td.textContent = cell.bombs;
            }
            else
            {
                td.className = "revealed";
            }
        }
        else
        {
            td.innerHTML = "";
        }
    });

    if (hitBomb)
    {
        game.forEach((array) => {
            array.forEach((cell) => {
                if (!cell.bomb && cell.flagged)
                {
                    var td = document.querySelector(`[data-row="${cell.row}"][data-column="${cell.column}"]`);
                    td.innerHTML = wrongBombImage;
                }
            })
        })

        setTimeout(() => {
            alert("Game Over - Hit bomb");
        }, 100);
    }
    else if (winner)
    {
        setTimeout(() => {
            alert("You win!");
        }, 100);
    }
}