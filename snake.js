// Canvas
var game;
var gameContext;

// Bools
var gameOver = false;

// Sizes
var blockSize = 45;
var gameSize = 15;
var X = blockSize * 5;
var Y = blockSize * 5;

// Food
var fX;
var fY;

// Snake
var body = [];
var moveX = 0;
var moveY = 0;
var lastX = 0;
var lastY = 0;

// Window loads
window.onload = function () {
    startGame()
}

// Starting game
function startGame()
{
    game = document.getElementById("game");
    gameContext = game.getContext("2d");

    game.height = gameSize * blockSize;
    game.width = gameSize * blockSize;
    game.style = "border:5px solid #000000;"

    document.addEventListener("keydown", (e) => {
        if (e.code == "ArrowUp" && moveY != 1 && lastY != 1)
        {
            if (lastY != 1)
            {
                moveX = 0;
                moveY = -1;
            }
        } 
        else if (e.code == "ArrowDown" && moveY != -1 && lastY != -1)
        {
            moveX = 0;
            moveY = 1;
        }
        else if (e.code == "ArrowRight" && moveX != -1 && lastX != -1)
        {
            moveX = 1;
            moveY = 0;
        }
        else if (e.code == "ArrowLeft" && moveX != 1 && lastX != 1)
        {
            moveX = -1;
            moveY = 0;
        }
    })

    makeFood();
    setInterval(updateGame, 100);
}

// Updating game
function updateGame()
{
    gameContext.strokeStyle = "black";
    gameContext.lineWidth = 1;

    if (gameOver) { return; }
    
    //gameContext.fillStyle = "green";
    var light = true;
    for (let r = 0; r < gameSize * blockSize; r = r + blockSize)
    {
        console.log("r = " + r)
        for (let c = 0; c < gameSize * blockSize; c = c + blockSize)
        {
            console.log("c = " + c)
            if (light)
            {
                gameContext.fillStyle = "#aad751" // Light square
            }
            else
            {
                gameContext.fillStyle = "#a2d149" // Dark square
            }
            gameContext.fillRect(r, c, blockSize, blockSize)
            light = !light
        }
    }

    gameContext.fillStyle = "#e7471d"; // Red apple
    gameContext.fillRect(fX, fY, blockSize, blockSize);
    //gameContext.strokeRect(fX, fY, blockSize, blockSize);

    if (X == fX && Y == fY)
    {
        body.push([fX, fY]);
        makeFood();
    }

    for (let i = body.length - 1; i > 0; i--)
    {
        body[i] = body[i - 1];
    }

    if (body.length) {
        body[0] = [X, Y];
    }

    gameContext.fillStyle = "#1e49a1"; // Darker blue head
    X += moveX * blockSize;
    Y += moveY * blockSize;
    lastX = moveX
    lastY = moveY
    gameContext.fillRect(X, Y, blockSize, blockSize);
    //gameContext.strokeRect(X, Y, blockSize, blockSize);

    gameContext.fillStyle = "#426fe3" // Lighter blue body
    for (let i = 0; i < body.length; i++)
    {
        gameContext.fillRect(body[i][0], body[i][1], blockSize, blockSize);
        //gameContext.strokeRect(body[i][0], body[i][1], blockSize, blockSize);
    }

    if (X < 0 || X > (gameSize * blockSize) - 1 || Y < 0 || Y > (gameSize * blockSize) - 1)
    {
        gameOver = true;
        alert("Game Over - Hit Edge");
    }

    for (let i = 0; i < body.length; i++) {
        if (X == body[i][0] && Y == body[i][1]) {
             
            // Snake eats own body
            gameOver = true;
            alert("Game Over - Hit Yourself");
        }
    }
}

// Making food
function makeFood()
{
    var inSnake = true;
    while (inSnake)
    {
        inSnake = false;
        fX = Math.floor(Math.random() * gameSize) * blockSize;
        fY = Math.floor(Math.random() * gameSize) * blockSize;
        for (let i = 0; i < body.length; i++)
        {
            if (fX == body[i][0] && fY == body[i][1])
            {
                inSnake = true;
                break;
            }
        }
    }
}