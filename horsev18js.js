/*

Author: Matthew Geng

 */

// /page variables
var numHomeClicks = 1; // number of clicks in home page

var footerHeight; // height of footer in pixels

var creditsPage = document.getElementById("creditsPage");

var titleHeight; //height of horse jump title

var images; // images in instructions

// circle variables
var canvasCircle = document.getElementById("canvasCircle"); // canvas element for the cool circle affects

var ctxCircle = canvasCircle.getContext('2d'); // canvasCircle context

var globalIdCircle; // stores id of request animation frame for circle

var circleArray = []; // stores circle objects

var isStop = false; // check if velocity of circles are stopped or not

var mouse = {x: undefined, y: undefined}; // necessary code

var maxRadius = 30; // max radius of circles

var colorArray = ['#225378', '#1695A3', '#ACF0F2', '#F3FFE2', '#EB7F00']; // color scheme

// game variables
var canvasGame = document.getElementById("canvasGame"); // canvas element for the cool circle affects

var ctxGame = canvasGame.getContext('2d'); // canvasCircle context

var globalIdGame; // stores id of request animation frame for game

var backgroundOrder = 1; // order of background images

var onMobile = false; // state if user is on or not on mobile

var platformAmount = 10; // max amount of platforms generated

var isFall = 0; // terminating inputs for ending game

var isPlatformMoved = false; // state of platform movement

var isPaused = false; // state of pause

var isGameStarted = false; // state of if game is started

var score = 0; // players score

var greatestPlatformY = 560; // greatest platform y is height of canvas

var platformArray = []; // stores platform objects

var controller; // left right inputs

var position = randomIntegerFromRange(419, 560 - 20); // initial platform positions

var horse; // move-able horse object

var background; // background object

var gravity = 0.2; // gravity value

var MOVE_FRICTION = 0.91; // y friction value

var STOP_FRICTION = 0.85; // y friction value

var TERMINAL_VELOCITY_LEFT = -8; // max left velocity

var TERMINAL_VELOCITY_RIGHT = 8; // max left velocity

// animation cross-browser-compatibility
window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(f){return setTimeout(f, 1000/60)}; // simulate calling code 60

// cancel animation cross-browser-compatibility
window.cancelAnimationFrame = window.cancelAnimationFrame
    || window.mozCancelAnimationFrame
    || function(requestID){clearTimeout(requestID)}; //fall back

// makes canvas resize to fit footer heights
footerHeight = document.getElementById("footer").offsetHeight;

// detect if on mobile code from stack overflow
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    onMobile = true;
}

// make game canvas
canvasGame.width = 400;
canvasGame.height = 560;

// make home screen canvas fit to client screen
canvasCircle.width = window.innerWidth;
canvasCircle.height = window.innerHeight - footerHeight;

// credits page size
creditsPage.style.height = window.innerHeight - footerHeight + "px";

// circle explode on click
window.addEventListener('click',
    function(){
        for (var j = 0; j < circleArray.length; j++) {
            circleArray[j].explode();
        } // for
        numHomeClicks++;

    });

// image singleton which holds all images
var imageRepository = new function() {

    //images
    this.startBackground = new Image();
    this.horseRight = new Image();
    this.skyGradientBackground = new Image();
    this.cloudBackground = new Image();
    this.thirdSky = new Image();
    this.spaceGradient = new Image();
    this.space = new Image();

    // set start background src
    this.startBackground.src = "images/goodfield.png";

    // set horse src
    this.horseRight.src = "images/horseright.png";

    // gradient sky background src
    this.skyGradientBackground.src = "images/skyblue.png";

    this.cloudBackground.src = "images/skyfilled.png";

    this.thirdSky.src = "images/thirdsky.png";

    this.spaceGradient.src = "images/spacegradient.png";

    this.space.src = "images/space.png";
};

// changes visibility of div id
function changeDisplay(divId, displayType) {

    var element = document.getElementById(divId);

    // if element exists, it is considered true

    if (element) {
        switch (displayType){
            case "block":
                element.style.display = (element.style.display === "none")? "block" : "none";
                break;
            case "inline-block":
                element.style.display = (element.style.display === "none")? "inline-block" : "none";
                break;
            case "flex":
                element.style.display = (element.style.display === "none")? "flex" : "none";
                break;

            case "inline":
                element.style.display = (element.style.display === "none")? "inline" : "none";
                break;
            default:

        } // switch

    } // if

} // changeVisibility

// gets random integer
function randomIntegerFromRange(min,max) {

    return Math.floor(Math.random()*(max - min + 1)+ min);

} // randomIntegerFromRange

// stop start button of circle velocities
function stopClick(){

    var stopText = document.getElementById("stop");

    if (isStop) {

        // restarts velocities
        for (var j = 0; j < circleArray.length; j++) {
            circleArray[j].start();
        } // for

        stopText.innerHTML = "Stop"; // changes text

        // velocity of circles allowed to moved
        isStop = false;

    } else {

        // stops velocities
        for (var i = 0; i < circleArray.length; i++) {
            circleArray[i].stop();
        } // for

        stopText.innerHTML = "Start"; // changes text

        // velocity of circles stopped
        isStop = true;

    } // else

} // stopClick

// instructions on click
function instructions(){

    // stops circle animation
    animateCircle(false);

    // clear drawings
    ctxCircle.clearRect(0, 0, innerWidth, innerHeight);

    // hides stop button
    changeDisplay("box", "inline-block");
    changeDisplay("stop", "inline-block");


    // hides instruction button
    changeDisplay("instructions", "block");

    // change visibility of home and start text at instructions
    document.getElementById("instructionsHome").style.display = "block";
    document.getElementById("instructionsStart").style.display = "block";

    // adjust title
    document.getElementById("title").style.paddingTop = "0";
    document.getElementById("instructionsPage").style.display = "block";

    //hides begin button
    changeDisplay("begin", "block");

} // instructions


// Begins game
function begin(){

    // set game to started
    isGameStarted = true;

    // if on mobile adjust settings
    if (isGameStarted && onMobile) {
        document.getElementById("title").style.fontSize = "1rem";
        document.getElementById("buttonRight").style.display = "block";
        document.getElementById("buttonLeft").style.display = "block";

    } // if

    // stops circle animation
    animateCircle(false);

    // clear circles at home
    circleArray.splice(0, circleArray.length);

    resetGameVariables();

    // initializes game
    initGame();

    // starts game animation
    animateGame(true);

    // clear circle drawings
    ctxCircle.clearRect(0, 0, innerWidth, innerHeight);

    // adjust settings
    document.getElementById("box").style.display = "none";
    document.getElementById("stop").style.display = "none";

    // adjust settings
    document.getElementById("titleText").style.fontSize = "3rem";
    document.getElementById("title").style.paddingTop = "0vh";

    // change visibility of instructions area
    document.getElementById("instructionsHome").style.display = "none";
    document.getElementById("instructionsStart").style.display = "none";
    document.getElementById("instructionsPage").style.display = "none";

    // change visibility of original buttons
    document.getElementById("instructions").style.display = "none";
    document.getElementById("begin").style.display = "none";

    // change game canvas visibility
    document.getElementById("game-container").hidden = false;

} // begin

// mouse move listener for circle enlargement effect
window.addEventListener('mousemove',
    function(event){
        mouse.x = event.pageX;

        mouse.y = event.pageY;
    });

// set title height
titleHeight = document.getElementById("title").offsetHeight;

// resize listener to adjust canvas dimensions
window.addEventListener('resize',
    function(){

        titleHeight = document.getElementById("title").offsetHeight; // gets title height

        // adjust circle canvas dimensions
        canvasCircle.width = window.innerWidth;
        canvasCircle.height = window.innerHeight - footerHeight;

        // adjust credits dimensions
        creditsPage.height = innerHeight - footerHeight;
        creditsPage.width = innerWidth;

        // get list of images in instructions
        images = document.getElementsByClassName("d-block img-fluid");

        for (var i = 0; i < images.length; i++){
            // responsive design
            images[i].style.height = (window.innerHeight - footerHeight - titleHeight) + "px";
        } // for

        initCircle(); // re-initialize circles to stop circles on border glitch
    });

// Circle constructor
function Circle(x, y, dx, dy, radius){

    var oldDx; // x velocity when stop velocity button is clicked
    var oldDy; // y velocity when stop velocity button is clicked
    this.x = x; // x position of circle
    this.y = y; // y position of circle
    this.dx = dx; // x velocity of circle
    this.dy = dy; // y velocity of circle
    this.radius = radius; // radius of circle
    this.minRadius = radius; // minimum radius of circle
    this.color = colorArray[randomIntegerFromRange(0,colorArray.length)]; // color of circle randomized color array
    this.isExplode = false; // exploding state

    // drawing circle
    this.draw = function(){
        ctxCircle.beginPath();
        ctxCircle.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctxCircle.fillStyle = this.color;
        ctxCircle.fill();

    }; // draw

    // updating position of circle
    this.update = function() {

        // edge collision detection
        // left right collision detection
        if (this.x+this.radius > innerWidth || this.x-this.radius < 0){
            this.dx = -this.dx;
        } // if

        // bottom top collision detection
        if (this.y+this.radius > innerHeight - footerHeight || this.y-this.radius < 0){
            this.dy = -this.dy;
        } // if

        // update x position from velocity
        this.x += this.dx;

        // update y position from velocity
        this.y += this.dy;

        // stores velocities when stop button is not clicked
        if (!isStop) {
            oldDx = this.dx;
            oldDy = this.dy;
        } // if

        // mouse interactivity
        if (mouse.x - this.x < 75 && mouse.x - this.x > -75 &&
            mouse.y - this.y < 75 && mouse.y - this.y > -75){

            // circle enlargement effect
            if (this.radius < maxRadius){
                this.radius += 2;
            } // if

        } else if (this.radius > this.minRadius && !this.isExplode){ // circles out of range

            this.radius -= 1;

        } // else if

        // calls draw
        this.draw();

    }; // update

    // stops velocity of circles on stop button click
    this.stop = function() {
        this.dx = 0;
        this.dy = 0;
        maxRadius = 10;

    }; // stop

    // resets velocity of circles on start button click
    this.start = function(){
        this.dx = oldDx;
        this.dy = oldDy;
        maxRadius = 30;

    }; // start

    this.explode = function(){

        // explode response on first or second click
        if(numHomeClicks % 2 === 0 && this.isExplode && !isStop){

            this.dx = (Math.random() - 0.5) * 2;
            this.dy = (Math.random() - 0.5) * 2;
            this.isExplode = false;

        } else if (mouse.x - this.x < 75 && mouse.x - this.x > -75 &&
            mouse.y - this.y < 75 && mouse.y - this.y > -75 && numHomeClicks % 2 !== 0 && !isStop) { // broad phase detection, explode area

            // narrow phase detection
            // left side
            if (mouse.x - this.x < 75 && mouse.x - this.x > 25) {
                this.dx = -4;
                this.isExplode = true;

            } // if

            // right side
            if (mouse.x - this.x > -75 && mouse.x - this.x < -25) {

                this.dx = 4;
                this.isExplode = true;

            } // if

            // top side
            if (mouse.y - this.y < 75 && mouse.y - this.y > 25) {

                this.dy = -4;
                this.isExplode = true;

            } // if

            // bottom side
            if (mouse.y - this.y > -75 && mouse.y - this.y < -25) {

                this.dy = 4;
                this.isExplode = true;

            } // if

        } // else if

    }; // explode

} // Circle

// mobile right movement
function buttonRightMobile() {
    document.getElementById("buttonRight").addEventListener("touchstart", function (event) {

        controller.right = true;
    });

    document.getElementById("buttonRight").addEventListener("touchend", function (event) {

        controller.right = false;
    });

} // buttonRightMobile

// mobile left movement
function buttonLeftMobile() {

    document.getElementById("buttonLeft").addEventListener("touchstart", function (event) {

        controller.left = true;
    });

    document.getElementById("buttonLeft").addEventListener("touchend", function (event) {

        controller.left = false;
    });

} // buttonLeftMobile

// controller object
    controller = {

        left: false, // left initial value
        right: false, // right initial value
        up: true, // constant jump value


        // arrow key listener
        keyListener: function (event) {

            // key state assigned value depending on key down
            var keyState = (event.type == "keydown");

            // if game paused no movement
            if (isPaused) {
                keyState = false;
            } // if

            // determines left or right key
            switch (event.keyCode) {

                case 80:
                    if (isGameStarted) {
                        pauseGame();
                        controller.right = false;
                        controller.left = false;
                    } // if
                    break;
                case 27:
                    if (isGameStarted) {
                        resumeGame();
                    } // if
                    break;

                // left key
                case 37:
                    controller.left = keyState;
                    break;

                // right key
                case 39:
                    controller.right = keyState;
                    break;

                default:
                    break;

            }

        } // keyListener

    }; // controller

function Horse(x, y, dx, dy, maxDistanceBetweenJump) {

    this.horse = imageRepository.horseRight;

    // horse height and width properties
    this.height = this.horse.height;
    this.width = this.horse.width;

    // x position
    this.x = x - this.width/2; // center of the canvas
    this.dx = dx; // x velocity
    this.y = y; // y position
    this.dy = dy; // y velocity

    // draws horse image
    this.draw = function(){

        ctxGame.drawImage(this.horse, this.x, this.y);

    }; // draw

    this.update = function() {

        if (isPlatformMoved && horse.y > canvasGame.height && isFall === 0){
            isFall = 1;
        } // if

        checkGreatestY();

        if (!isPaused){
            this.oldDx = this.dx;
            this.oldDy = this.dy;
        } // if

        // initial grass field jumping
        if (!isPlatformMoved) {
            if (this.y > canvasGame.height - this.height) {

                // reset y velocities
                this.dy = 7.5;
                this.dy = -this.dy;

            } // if
        } // if

        if (this.y  + this.height >=  canvasGame.height / 2 ){ // if the bottom of the horse is below the middle of canvas

            // add gravity
            this.y += this.dy;
            this.dy += gravity;

        } else {

            platformArray.forEach(function(p, i) {

                if (horse.dy < 0) {
                    p.y -= horse.dy;
                    isPlatformMoved = true;
                } // if

                if (p.y > canvasGame.height) {

                    // generating new platforms
                    platformArray[i] = new Platform();
                    platformArray[i].y = randomIntegerFromRange(greatestPlatformY - maxDistanceBetweenJump , greatestPlatformY - 20);
                    greatestPlatformY = 560;

                } // if

            }); // for each


            this.dy += gravity;

            if (this.dy < 0) {
                background.fieldY -= this.dy / 2; // grass field

                background.firstSkyY -= this.dy / 2; // blue gradient

                if(backgroundOrder === 2){
                    background.secondSkyY -= this.dy / 2; // solid blue sky
                } // if

                if(backgroundOrder === 3){
                    background.thirdSkyY -= this.dy / 2; // darker sky gradient

                } // if

                if(backgroundOrder === 4){
                    background.fourthSkyY -= this.dy / 2; // space transition gradient

                } // if

                if(backgroundOrder === 5) {
                    background.fifthSkyY -= this.dy / 2; // space image
                } // if

            } // if

            if (horse.dy >= 0) {
                horse.y += horse.dy;
                horse.dy += gravity;
            } // if

            if (Math.floor(horse.y) < 240){

                if(!isPaused) {
                    score++;

                } // if
            } // if

        } // else

        // left arrow key response
        if (controller.left && this.dx > TERMINAL_VELOCITY_LEFT) {

            this.horse.src = "images/horseleft.png";

            // add x velocity left
            this.dx -= 0.8;

        } else if (!controller.left && ! controller.right){ // add friction when not moving

            this.dx *= STOP_FRICTION;
        } // else if    F

        if (controller.right && this.dx < TERMINAL_VELOCITY_RIGHT) {
            this.horse.src = "images/horseright.png";

            // add x velocity right
            this.dx += 0.8;
        } // if

        // add friction when moving
        this.dx *= MOVE_FRICTION;

        // update positions from velocities
        this.x += this.dx;

        // calculates x center of horse
        this.centerX = this.x + (this.width / 2);

        // calculates y center of horse
        this.centerY = this.y + (this.height / 2);


        // if this is going off the left of the screen
        if (this.x < -this.width) {

            this.x = canvasGame.width;

        } else if (this.x > canvasGame.width) {// if this goes past right boundary

            this.x = -this.width;

        } // else if

        if (isFall === 1 || isFall === 2){
            endGame();
        } // if

        // draws horse
        this.draw();

    }; // update

} // Horse

function endGame(){

    platformArray.forEach(function(p){
        p.y -= 15;
    });

    if (isFall === 1 && horse.y > canvasGame.height / 2){

        horse.y -= 6.5;
        horse.dy = 0;

    } else if (horse.y < canvasGame.height / 2){

        isFall = 2;

    } else if (horse.y + horse.height > canvasGame.height){
        restart();
    } // else if

}

function updateScore() {
    var scoreText = document.getElementById("score");
    scoreText.innerHTML = score;
} // updateScore


// Background constructor
function Background(){

    // images
    this.startBackground = imageRepository.startBackground;
    this.gradientSky = imageRepository.skyGradientBackground;
    this.cloudSky = imageRepository.cloudBackground;
    this.darkCloudSky = imageRepository.thirdSky;
    this.skySpace = imageRepository.spaceGradient;
    this.spaceBackground = imageRepository.space;

    // grass field initial background position
    this.fieldY = 400;

    // iniital position of first clouds
    this.firstSkyY = -400;


    // draws background
    this.draw = function() {

            // grass field initial background image
            ctxGame.drawImage(this.startBackground, 0, this.fieldY);

            ctxGame.drawImage(this.gradientSky, 0, this.firstSkyY);

    };

    // background move and image change detection called everytime animation occurs or re-drawn
    this.update = function () {

        // sky clouds
        if (this.firstSkyY > 0){
            this.secondSkyY = this.firstSkyY - 560;
            backgroundOrder = 2;
            ctxGame.drawImage(this.cloudSky, 0, this.secondSkyY);
        } // if

        // sky clouds
        if (this.secondSkyY > 0){
            this.thirdSkyY = this.secondSkyY - 560;

            backgroundOrder = 3;
            ctxGame.drawImage(this.darkCloudSky, 0, this.thirdSkyY);
        } // if

        // space gradient
        if (this.thirdSkyY > 0){
            this.fourthSkyY = this.thirdSkyY - 560;

            backgroundOrder = 4;
            ctxGame.drawImage(this.skySpace, 0, this.fourthSkyY);
        } // if

        // space background
        if (this.fourthSkyY > 0 ){
            this.fifthSkyY = this.fourthSkyY - 560;

            backgroundOrder = 5;
            ctxGame.drawImage(this.spaceBackground, 0, this.fifthSkyY);

            if (this.fifthSkyY > 0){
                this.fifthSkyY = 0;
                ctxGame.drawImage(this.spaceBackground, 0, 0);
            } // if

        } // if

        // change color of canvas menu for readability
        if (backgroundOrder === 4 || backgroundOrder === 5 ){
            document.getElementById("home").style.color = "#f1f1f1";
            document.getElementById("score").style.color = "#f1f1f1";
            document.getElementById("pause").src = "images/pause32white.png";
        } else {
            document.getElementById("home").style.color = "black";
            document.getElementById("score").style.color = "black";
            document.getElementById("pause").src = "images/pause32.png";
        }

        this.draw();

    }; // update


    // was hoping to have a infinite background but not enough time
} // Background

// Platform constructor
function Platform(topLimit, bottomLimit, maxDistanceBetweenJump){

    // distance between platform and horse
    var vectorX;
    var vectorY;

    // bar properties
    this.width = 35;
    this.height = 5;
    this.dy = 0;

    // current test x and y values
    this.x = randomIntegerFromRange(0, 400 - this.width);
    this.y = position;

    // reset new platform position
    position = randomIntegerFromRange(position - maxDistanceBetweenJump, position - this.height);

    // draws bar
    this.draw = function(){
        ctxGame.lineWidth=4;
        ctxGame.fillStyle = '#00b900';
        ctxGame.strokeStyle = '#006400';
        roundRect(ctxGame, this.x, this.y, this.width, this.height, 3, true, true);

    }; // draw

    // collision detection called everytime animation occurs or re-drawn
    this.update = function(){

        // calculates center of each bar
        this.centerX = this.x + (this.width / 2);
        this.centerY = this.y + (this.height / 2);

        // calculates x difference between bar and horse
        vectorX = this.centerX - horse.centerX;

        // calculates y difference between bar and horse
        vectorY = this.centerY - horse.centerY;

        greatestPlatformY = 560;

        checkGreatestY();

        // broad phase collision detection
        // calculates distance from horse to each bar
        if ((horse.centerX < this.centerX && vectorX < 35 || horse.centerX > this.centerX && vectorX > -35) &&
            (horse.centerY < this.centerY && vectorY < 35) && horse.dy > 0){

            // narrow phase collision detection
            // collision response
            if (((horse.x + horse.width) - this.x > 0) && (horse.x - (this.x + this.width) < 0) &&
                (horse.y + horse.height) - this.y > 0){

                horse.dy = -7.5;

            } // if


            // draw the line between the center points of the rectangles for developing stage
            // remember to comment out
            /*
            ctxGame.lineWidth = 2;
            ctxGame.beginPath();
            ctxGame.moveTo(this.centerX, this.centerY);
            ctxGame.lineTo(horse.centerX, horse.centerY);
            ctxGame.strokeStyle = "#303840";
            ctxGame.stroke();
			*/

        } // if

        // deletes platforms that go off screen
        platformArray = platformArray.filter(function(item){

            return (item.y < 560);
        });


        // calls draw
        this.draw();

    }; // update

} // Platform

function resetCircleVariables(){
    isStop = false;
    numHomeClicks = 0;

} // resetCircleVariables

function resetGameVariables(){

    isFall = 0;
    backgroundOrder = 1;
    position = randomIntegerFromRange(419, 560);
    score = 0;
    gravity = 0.2;
    greatestPlatformY = 560;
    isPaused = false;
    isPlatformMoved = false;
} // resetGameVariables

function restart(){
    document.getElementById("pauseMenu").style.display = "none";

    platformArray.splice(0, platformArray.length);
    resetGameVariables();
    initGame();

} // restart

function showCredits(){
    var creditsText = document.getElementById("creditsText");

    if(creditsText.innerHTML == "Close"){
        $(document).ready(function () {
            $("#creditsPage").slideUp();
        });
        creditsText.innerHTML = "Credits";

    } else {

        if(isGameStarted) {
            $(document).ready(function () {
                $("#pauseMenu").slideDown();

                $("#creditsPage").slideDown();
            });
        }else{
            $(document).ready(function () {

                $("#creditsPage").slideDown();
            });
        } // else
        creditsText.innerHTML = "Close";

    } // else

    if (isGameStarted) {
        horse.dy = 0;
        horse.dx = 0;
        gravity = 0;
        isPaused = true;
    } // if

} // showCredits

function pauseGame(){

    $(document).ready(function () {
        $("#pauseMenu").slideDown();

    });

    horse.dy = 0;
    horse.dx = 0;
    gravity = 0;
    isPaused = true;
} // pauseGame

function resumeGame(){
    $(document).ready(function () {
        $("#pauseMenu").slideUp();
    });

    horse.dx = horse.oldDx;
    horse.dy = horse.oldDy;
    gravity = 0.2;

    isPaused = false;

} // resumeGame

function checkGreatestY(){
    for (var i = 0; i < platformArray.length; i++){
        if (greatestPlatformY > platformArray[i].y ){
            greatestPlatformY = Math.floor(platformArray[i].y);
        } // if
    } // for
} // checkGreatesty

function goToHome() {

    // stops circle animation
    animateGame(false);

    // clear circles at home
    platformArray.splice(0, circleArray.length);

    resetCircleVariables();

    // reset title settings
    document.getElementById("titleText").style.fontSize = "5rem";
    document.getElementById("title").style.paddingTop = "10vh";

    // initializes game
    initCircle();

    // reset game started
    isGameStarted = false;

    // starts game animation
    animateCircle(true);

    // clear circle drawings
    ctxCircle.clearRect(0, 0, innerWidth, innerHeight);

    document.getElementById("pauseMenu").style.display = "none";

    // hides stop button
    changeDisplay("box", "inline-block");
    changeDisplay("stop", "inline-block");

    // hide instructions
    document.getElementById("instructionsHome").style.display = "none";
    document.getElementById("instructionsStart").style.display = "none";
    document.getElementById("instructionsPage").style.display = "none";

    changeDisplay("instructions", "block");	// hides instructions button
    changeDisplay("begin", "block");	// hides begin button

    document.getElementById("game-container").hidden = true;	// change game canvas visibility

}

// initialization
function initCircle() {

    circleArray = []; // reset circle array so on resize no extra circles are generated

    // generates 500 circles
    for (var i = 0; i < 400; i++){
        var radius = Math.random()*7 + 1;
        var xCircle = Math.random() * (innerWidth - radius*2) + radius;
        var yCircle =  Math.random() * (innerHeight - footerHeight - radius*2) + radius;
        var dxCircle = (Math.random() - 0.5) * 2;
        var dyCircle = (Math.random() - 0.5) * 2;
        circleArray.push(new Circle(xCircle, yCircle, dxCircle, dyCircle, radius))

    } // for

} // init

function initGame(){

    platformArray = []; // reset platformArray for new games

    for (var i = 0; i < platformAmount; i++){
        //var dxPlatform = (Math.random() - 0.5) * 2;
        //var dyPlatform = (Math.random() - 0.5) * 2;
        platformArray.push(new Platform(0, 560, 142));

    } // for

    var xHorse = 200; // initial x horse value
    var yHorse = 560; // initial y horse value
    var dxHorse = 0; // initial x horse velocity
    var dyHorse = 7.5; // initial y horse velocity
    var maxDistanceBetweenJump = 142; // max distance horse can jump to next platform

    background = new Background(); // new background object

    horse = new Horse(xHorse, yHorse, dxHorse, dyHorse, maxDistanceBetweenJump); // new horse

}

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 * from http://js-bits.blogspot.ca/2010/07/canvas-rounded-corner-rectangles.html
 */

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {

    if (typeof stroke == "undefined" ) {
        stroke = true;
    } // if
    if (typeof radius === "undefined") {
        radius = 5;
    } // if

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    if (stroke) {
        ctx.stroke();

    } // if'

    if (fill) {
        ctx.fill();

    } // if

} // roundRect

// disable key events on mobile
if(!onMobile) {
    window.addEventListener("keydown", controller.keyListener);
    window.addEventListener("keyup", controller.keyListener);
} // if

// animates circles
function animateCircle(boolean) {
    if (boolean) {

        // clearing previous circles on animation
        ctxCircle.clearRect(0, 0, innerWidth, innerHeight);

        // updating location of circles
        for (var i = 0; i < circleArray.length; i++) {
            circleArray[i].update();
        }

        // calls function
        globalIdCircle = requestAnimationFrame(animateCircle);

    } else {
        cancelAnimationFrame(globalIdCircle); // shuts down circle animation
    }

} // animateCircle

// animates game
function animateGame(boolean) {
    if (boolean) {

        // clearing previous circles on animation
        ctxGame.clearRect(0, 0, canvasGame.width, canvasGame.height);

        updateScore(); // updates score

        background.update(); // updates background for limited time

        // updates each platform
        for (var i = 0; i < platformArray.length; i++) {
            platformArray[i].update();
        }

        // update velocity if on mobile
        buttonRightMobile();
        buttonLeftMobile();

        // calls function recursively
        globalIdGame = requestAnimationFrame(animateGame); // has to be in front of horse update for game to stop animating

        horse.update(); // updates horse

    } else {
        cancelAnimationFrame(globalIdGame); // shuts down game animation
        ctxGame.clearRect(0, 0, innerWidth, innerHeight); // clear canvas
    }

} // animateGame

initCircle(); // initialize circles
animateCircle(true); // start animatting circles
