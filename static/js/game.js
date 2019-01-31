document.addEventListener('DOMContentLoaded', (() => {

    // sets variable for canvas on doc
    let canvas = document.getElementById('myCanvas');
    // sets the rendering of the canvas to be 2d
    let ctx = canvas.getContext('2d'); // learn more https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext

    // prints a red square on the canvas
    // ctx.beginPath();
    // ctx.rect(30, 40, 60, 60); // coords (x,y) of corner, width, height
    // ctx.fillStyle = '#ff0000'; // stores color to be used by fill method
    // ctx.fill();
    // ctx.closePath();

    // // prints a green circle
    // ctx.beginPath();
    // ctx.arc(240, 160, 20, 0, Math.PI*2, false); // coords (x,y) of arc center, radius, start of angle, end of angle, direction (true = clockwise, false = counter)
    // ctx.fillStyle = 'green'; // can use rgba function, color keyword, hexadecimal, and other color methods
    // ctx.fill();
    // ctx.closePath();

    // // prints blue outline of rectangle
    // ctx.beginPath();
    // ctx.rect(160, 40, 120, 40);
    // ctx.strokeStyle = 'rgba(0, 70, 150, 1)'; // rgba(red, green, blue, opacity)
    // ctx.stroke(); // different functions can be used other than fill, stroke makes an outline of the object
    // ctx.closePath();

    // sets default starting position for ball and stores position variables
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    // alters position of ball by changing the position
    let dx = 2;
    let dy = -2;
    // defines radius of the ball
    let ballRadius = 10;
    let rColor = '#0095dd';

    let paddleHeight = 10;
    let paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;

    let rightPressed = false;
    let leftPressed = false;

    let brickRowCount = 3;
    let brickColumnCount = 5;
    let brickWidth = 75;
    let brickHeight = 20;
    let brickPadding = 10;
    let brickOffsetTop = 30;
    let brickOffsetLeft = 30;

    let bricks = []
    for(let c = 0; c < brickColumnCount; c++){
        bricks[c] = [];
        for(let r = 0; r < brickRowCount; r++){
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    let score = 0;

    let lives = 3;

    // defines a function to draw the ball
    const drawBall = ((color = '#0095dd') => {
        // console.log('drawing');
        ctx.beginPath()
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2, false)
        ctx.fillStyle = color;
        ctx.fill()
        ctx.closePath()
    });

    // defines a function to draw the paddle
    const drawPaddle = (() => {
        ctx.beginPath()
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
        ctx.fillStyle = '#0095dd';
        ctx.fill()
        ctx.closePath()
    });

    // draws the field of bricks
    const drawBricks = (() => {
        bricks.forEach(column => {
            let c = bricks.indexOf(column);
            column.forEach(brick => {
                if(brick.status == 1){
                    let r = column.indexOf(brick);
                    let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                    brick.x = brickX;
                    brick.y = brickY;
                    ctx.beginPath()
                    ctx.rect(brickX, brickY, brickWidth, brickHeight)
                    ctx.fillStyle = '#0095dd';
                    ctx.fill()
                    ctx.closePath()
                }
            })
        })
    });

    // adjust the position of items on the canvas
    const draw = (() => {
        // clears entire canvas with each frame
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        drawBricks()

        drawBall(rColor)

        drawPaddle()

        drawScore()

        drawLives()

        collisionDetection()

        // sets collision for the borders of canvas and sets ball to random color when it collides
        if(x + dx > canvas.width - ballRadius || x + dx < ballRadius){
            dx = -dx;
            rColor = randomColor();
        }
        if(y + dy < ballRadius){
            dy = -dy;
            rColor = randomColor();
        }
        else if(y + dy > canvas.height - ballRadius){
            if(x > paddleX && x < paddleX + paddleWidth){
                dy = -dy;
            }
            else {
                lives--;
                if(!lives){
                    alert('Game Over!')
                    document.location.reload()
                }
                else{
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                }
            }
        }
        // collision as ternary statements, no color change
        // x + dx > canvas.width - ballRadius || x + dx < ballRadius ? dx = -dx : dx = dx;
        // y + dy > canvas.height - ballRadius || y + dy < ballRadius ? dy = -dy : dy = dy;

        // checks if left or right is pressed
        rightPressed && paddleX < canvas.width - paddleWidth ? paddleX += 5 : paddleX = paddleX;
        leftPressed && paddleX > 0 ? paddleX -= 5 : paddleX = paddleX;
        
        x += dx;
        y += dy;

        requestAnimationFrame(draw)
    });

    const randomColor = (() => {
        let color = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
        return color;
    });

    const keyDownHandler = ((e) => {
        e.key == 'Right' || e.key == 'ArrowRight' ? rightPressed = true : rightPressed = false;
        e.key == 'Left' || e.key == 'ArrowLeft' ? leftPressed = true : leftPressed = false;
    });

    const keyUpHandler = ((e) => {
        e.key == 'Right' || e.key == 'ArrowRight' ? rightPressed = true : rightPressed = false;
        e.key == 'Left' || e.key == 'ArrowLeft' ? leftPressed = true : leftPressed = false;
    });

    const mouseMoveHandler = ((e) => {
        // sets relative horizontal position depending on mouse location
        let relativeX = e.clientX - canvas.offsetLeft;
        paddleX = relativeX > 0 && relativeX < canvas.width ? relativeX - paddleWidth / 2 : paddleX;
    });

    // checks if the coordinates of the ball would be touching the brick
    const collisionDetection = (() => {
        for(let c = 0; c < brickColumnCount; c++){
            for(let r = 0; r < brickRowCount; r++){
                let b = bricks[c][r];
                if(b.status == 1){
                    if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if(score == brickRowCount * brickColumnCount){
                            alert('Congratulations, you\'ve won something!')
                            document.location.reload()
                            clearInterval(interval)
                        }
                    }
                }
            }
        }
    });

    const drawScore = (() => {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#0095dd';
        ctx.fillText(`Score: ${score}`, 8, 20)
    });

    const drawLives = (() => {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#0095dd';
        ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20)
    });

    document.addEventListener('keydown', keyDownHandler, false)
    document.addEventListener('keyup', keyUpHandler, false)
    document.addEventListener('mousemove', mouseMoveHandler, false)

    // sets drawBall to run every 10 ms infinitely
    draw()

    drawBricks()
    
}))