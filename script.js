const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");
const resHardBtn = document.querySelector('.reset-hard');
const resEasyBtn = document.querySelector('.reset-easy');
const resImpBtn = document.querySelector('.reset-impossible');

let leftLevel = .5; 
let rightLevel = .1; 

//create left com paddle
const left = {
    x : 5,
    y : cvs.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "WHITE",
    score : 0
}

//create right com paddle
const right = {
    x : cvs.width - 15,
    y : cvs.height/2 - 100/2,
    width : 10,
    height : 100,
    color : "WHITE",
    score : 0
}

//Create the ball
const ball =  {
    x : cvs.width/2,
    y : cvs.height/2,
    radius : 10,
    speed : 10,
    velocityX : 5,
    velocityY : 5,
    color : "RED"

}


//draw rect function
function drawRect(x,y,w,h,color){
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
}

// create the net
const net = {
    x : cvs.width/2,
    y : 0,
    width : 2,
    height : 10,
    color : "WHITE"
}

//draw the net
function drawNet(){
    for( let i = 0; i <= cvs.height; i += 15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

//draw circle
function drawCircle(x,y,r,color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();
}


//draw text
function drawText(text,x,y,color){
    ctx.fillStyle = color;
    ctx.font = "45px fantasy"
    ctx.fillText(text, x, y);
}

function render(){
    //clear canvas
    drawRect(0,0,cvs.width, cvs.height, "BLACK");

    //draw the net
    drawNet();

    //draw score
    drawText(left.score, cvs.width/4, cvs.height/5, "LIGHTGREEN");
    drawText(right.score, 3*cvs.width/4, cvs.height/5, "LUGHTGREEN");   

    //draw the user and com paddle
    drawRect(left.x, left.y, left.width, left.height, left.color);
    drawRect(right.x, right.y, right.width, right.height, right.color);

    //draw the ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// collision detection
function collision(b,p){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

//reset ball
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;
    
    ball.speed = 7;
    ball.velocityX = -ball.velocityX;
    ball.velocityy = 1;
}

//update game
function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    //simple AI to control com paddle
    
    left.y += (ball.y - (left.y + left.height/2)) * leftLevel;

    right.y += (ball.y - (right.y + right.height/2)) * rightLevel;

    if(ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < cvs.width/2) ? left : right;
    if(collision(ball,player)){
       // where the ball hit the player
       
       let collidePoint = ball.y - (player.y + player.height);
       
       //normalization
        collidePoint = collidePoint/(player.height/2);

        //calculate angle in radians
        let angleRad = collidePoint * Math.PI/4;

        //direction of the ball when hit
        let direction = (ball.x < cvs.width/2) ? 1 : -1;

        //change vel x and y
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = direction * ball.speed * Math.sin(angleRad);

        // everytime the ball hits a paddle, we increase it's speed
        ball.speed += 0.5;
    }

    //update score
    if(ball.x - ball.radius < 0){
        //com score
        right.score++;
        resetBall();
    } else if(ball.x + ball.radius > cvs.width){
        //player scored
        left.score++;
        resetBall();
    }

} 

// game init
function game(){
    update();
    render();
}

//loop
const framePerSecond = 50;
setInterval(game, 1000/framePerSecond);