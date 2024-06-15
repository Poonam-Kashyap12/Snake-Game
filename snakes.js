function init() {
    console.log("Init");
    canvas = document.getElementById("mycanvas");
    pen = canvas.getContext('2d');
    W = canvas.width;
    H = canvas.height;
    game_over = false;

    food = getRandomFood();
    score = 5;

    snake = {
        init_length: 5,
        color: "aqua",
        cells: [],
        direction: "right",
        createSnake: function() {
            this.cells = [];
            for (var i = this.init_length - 1; i >= 0; i--) {
                this.cells.push({ x: i, y: 0 });
            }
        },

        drawSnake: function() {
            for (var i = 0; i < this.cells.length; i++) {
                pen.fillStyle = this.color;
                pen.strokeStyle = "black";
                pen.lineWidth = 5;
                pen.strokeRect(this.cells[i].x * 10, this.cells[i].y * 10, 10, 10);
                pen.fillRect(this.cells[i].x * 10, this.cells[i].y * 10, 10, 10);
            }
        },

        updateSnake: function() {
            var headX = this.cells[0].x;
            var headY = this.cells[0].y;

            var nextX, nextY;

            if (headX == food.x && headY == food.y) {
                food = getRandomFood();
                score++;
            } else {
                // pop last cell if food not eaten
                this.cells.pop();
            }

            if (this.direction === "right") {
                nextX = headX + 1;
                nextY = headY;
            } else if (this.direction === "left") {
                nextX = headX - 1;
                nextY = headY;
            } else if (this.direction === "up") {
                nextX = headX;
                nextY = headY - 1;
            } else if (this.direction === "down") {
                nextX = headX;
                nextY = headY + 1;
            }

            // Insert the new cell at the head
            this.cells.unshift({ x: nextX, y: nextY });

            // Find out the last coordinate (Boundaries)
            var last_x = Math.round(W / 10);
            var last_y = Math.round(H / 10);

            // Check for collision with wall
            if (this.cells[0].y < 0 || this.cells[0].x < 0 || this.cells[0].x > last_x || this.cells[0].y > last_y) {
                game_over = true;
                alert("Game Over! You hit the wall.");
                document.getElementById('restartButton').style.display = 'block';
                return;
            }

            // Check for collision with itself
            for (var i = 1; i < this.cells.length; i++) {
                if (this.cells[0].x === this.cells[i].x && this.cells[0].y === this.cells[i].y) {
                    game_over = true;
                    alert("Game Over! You ran into yourself.");
                    document.getElementById('restartButton').style.display = 'block';
                    return;
                }
            }
        }
    };

    snake.createSnake();

    // Add event Listener to our game
    // Listen to our keyboards
    function keyPressed(e) {
        console.log("You pressed a key");
        console.log(e);
        // Add direction constraints to prevent reversing directly
        if (e.key === "ArrowRight" && snake.direction !== "left") {
            snake.direction = "right";
        }
        if (e.key === "ArrowLeft" && snake.direction !== "right") {
            snake.direction = "left";
        }
        if (e.key === "ArrowUp" && snake.direction !== "down") {
            snake.direction = "up";
        }
        if (e.key === "ArrowDown" && snake.direction !== "up") {
            snake.direction = "down";
        }
    }

    document.addEventListener('keydown', keyPressed);
}

function draw() {
    pen.clearRect(0, 0, W, H);
    snake.drawSnake();

    // Let us draw the food
    pen.fillStyle = food.color;
    pen.fillRect(food.x * 10, food.y * 10, 10, 10);

    pen.fillStyle = "white";
    pen.font = "14px Roboto";
    pen.fillText("Score : " + score, 10, 10);
}

function update() {
    console.log("Update");
    snake.updateSnake();
}

function gameLoop() {
    draw();
    update();

    if (game_over) {
        clearInterval(f);
    }
}

function getRandomFood() {
    var foodX = Math.floor(Math.random() * (W / 10));
    var foodY = Math.floor(Math.random() * (H / 10));

    var foodColors = ["red", "green", "orange", "coral", "orchid"];
    var i = Math.floor(Math.random() * foodColors.length);

    var food = {
        x: foodX,
        y: foodY,
        color: foodColors[i]
    };

    return food;
}

function restartGame() {
    document.getElementById('restartButton').style.display = 'none';
    init();
    f = setInterval(gameLoop, 100);
}

init();
// Call gameLoop after t sec
var f = setInterval(gameLoop, 100);
