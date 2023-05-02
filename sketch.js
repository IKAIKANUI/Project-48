var bg, bgImg
var bottomGround
var topGround
var balloon, balloonImg
var START = 2
var PLAY = 1;
var END = 0;
var gameState = START;
var score = 0

function preload() {
  bgImg = loadImage("assets/bg.png")
  bgImg2 = loadImage("assets/bgImg2.jpg")

  startImg = loadImage("assets/Start.png")

  obsBot1 = loadImage("assets/obsBottom1.png")
  obsBot2 = loadImage("assets/obsBottom2.png")
  obsBot3 = loadImage("assets/obsBottom3.png")

  obsTop1 = loadImage("assets/obsTop1.png")
  obsTop2 = loadImage("assets/obsTop2.png")

  restartImg = loadImage("assets/restart.png")

  gameoverImg = loadImage("assets/gameOver.png")

  balloonImg = loadAnimation("assets/balloon1.png", "assets/balloon2.png", "assets/balloon3.png")
}

function setup() {
  createCanvas(500, 400);
  //background image
  bg = createSprite(165, 485, 1, 1);


  //creating top and bottom grounds
  topObstaclesGroup = new Group()
  bottomObstaclesGroup = new Group()

  bottomGround = createSprite(200, 390, 800, 20);
  bottomGround.visible = false;

  topGround = createSprite(200, 10, 800, 20);
  topGround.visible = false;

  //creating balloon     
  balloon = createSprite(100, 200, 20, 50);
  balloon.addAnimation("balloon", balloonImg);
  balloon.scale = 0.17;
  balloon.debug = true;
  balloon.setCollider("circle", 0, 0, 250);
  // creating Start, Gameover, and Restart sprite
  start = createSprite(220, 350);
  start.addImage("Start", startImg);
  start.visible = false;
  start.scale = 0.3

  gameover = createSprite(220, 200);
  gameover.addImage("gameover", gameoverImg);
  gameover.visible = false;

  restart = createSprite(220, 245);
  restart.addImage("restart", restartImg);
  restart.visible = false;


  getBackgroundImg();
}

function draw() {

  if (gameState === START) {
    start.visible = true;
    balloon.velocityY = 0;
    if (mousePressedOver(start)) {
      startFunction();
    }



  }

  if (gameState === PLAY) {

    start.visible = false;

    if (keyDown("space")) {
      balloon.velocityY = -6;

    }

    //adding gravity
    balloon.velocityY = balloon.velocityY + 1;

    spawnObstacleTop();
    spawnObstacleBottom();

    if (balloon.isTouching(topObstaclesGroup) || balloon.isTouching(bottomObstaclesGroup) || balloon.isTouching(bottomGround) || balloon.isTouching(topGround)) {
      gameState = END;
    }

  }

  if (gameState === END) {
    gameover.visible = true;
    restart.visible = true;
    balloon.velocityX = 0;
    balloon.velocityY = 0;
    gameover.depth += 2;
    restart.depth += 2;
    topObstaclesGroup.setLifetimeEach(-1)
    bottomObstaclesGroup.setLifetimeEach(-1)
    topObstaclesGroup.setVelocityXEach(0);
    bottomObstaclesGroup.setVelocityXEach(0);
    if (mousePressedOver(restart)) {
      resetFunction();
    }
  }

  background("black");

  //making the hot air balloon jump


  drawSprites();
  Score();

  // console.log(gameState);
}

function spawnObstacleTop() {


  if (World.frameCount % 60 === 0) {

    obstacleTop = createSprite(500, 50, 40, 50);
    obstacleTop.velocityX = -4;
    obstacleTop.y = random(10, 100);
    obstacleTop.scale = 0.15;
    obstacleTop.lifetime = 150;
    balloon.depth += 1;
    obstacleTop.debug = true;
    topObstaclesGroup.add(obstacleTop);

    var ranTop = Math.round(random(1, 2));
    switch (ranTop) {
      case 1: obstacleTop.addImage(obsTop1);
        break;
      case 2: obstacleTop.addImage(obsTop2);
        break;
      default: break;

    }

  }

}

function spawnObstacleBottom() {

  if (World.frameCount % 60 === 0) {
    obstacleBottom = createSprite(500, 350, 40, 50);
    obstacleBottom.velocityX = -4;
    obstacleBottom.y = random(340, 390);
    bottomObstaclesGroup.add(obstacleBottom);
    obstacleBottom.scale = 0.1;
    obstacleBottom.lifetime = 150;
    var ranBottom = Math.round(random(1, 3));
    switch (ranBottom) {
      case 1: obstacleBottom.addImage(obsBot1);
        break;
      case 2: obstacleBottom.addImage(obsBot2);
        break;
      case 3: obstacleBottom.addImage(obsBot3);
        break;
      default: break;

    }
  }


}

function startFunction() {
  gameState = PLAY;

  balloon.y = 200;
  restart.visible = false;
  gameover.visible = false;

}

function resetFunction() {
  gameState = PLAY;
  balloon.y = 200;
  restart.visible = false;
  gameover.visible = false;
  bottomObstaclesGroup.destroyEach();
  topObstaclesGroup.destroyEach();
  score = 0;
}

function Score() {

  if (gameState === PLAY) {
    if (!balloon.isTouching(topObstaclesGroup) || !balloon.isTouching(bottomObstaclesGroup)) {
      score += 1;
    }

  }
  text("Score: " + score, 290, 50);
  textSize(50);
  textFont("algerian");
}


async function getBackgroundImg() {
  let response = await fetch("http://worldtimeapi.org/api/timezone/Pacific/Honolulu");
  let responseJson = await response.json();
  let dateTime = responseJson.datetime
  let hour = dateTime.slice(11, 13)
  console.log(hour)

  if (hour >= 06 && hour <= 19) {

    bg.addImage(bgImg);
    bg.scale = 1.3


  }
  else {
    bg.addImage(bgImg2);
    bg.scale = 1.5
    bg.x = 200
    bg.y = 200
  }

}