var greenBoatSpriteSheet; // Variable to hold the animated green boat sprite
var greenCannonSpriteSheet; // Variable to hold the animated green cannon sprite
var greenFireSpriteSheet; // Variable to hold the animated green fire sprite
var blueBoatSpriteSheet; // Variable to hold the animated blue boat sprite
var blueCannonSpriteSheet; // Variable to hold the animated blue cannon sprite
var blueFireSpriteSheet; // Variable to hold the animated blue fire sprite
var backgroundImage; // Variable to hold the background image
var heartSpriteSheet; // Variable to hold the heart image
var tileSize = 100; // Size of the tile 
var words = ["ADVENTURE", "SAIL", "OCEAN", "TREASURE", "JOURNEY", "EXPLORE"]; // Array of words
var wordPositions = []; // Array to hold the current positions of each word
var animationSpeed = 1; // Slower speed at which words move towards the center
var fontSize = 32; // Set the desired font size
var currentWordIndex = 0; // Index of the current word moving towards the center
var userInput = ""; // Variable to track user input
var currentWord = words[currentWordIndex]; // Current word being typed
var backgroundOffsetX = 0; // Initial offset for the background
var wordCompleted = false; // Flag to indicate if the current word is completed
var score = 0; // Variable to track the user's score
var blueBoatAlpha = 255; // Alpha value for the blue boat
var fadeSpeed = 5; // Speed at which the blue boat fades
var waitingForNextWord = false; // Flag to indicate if waiting for the next word
var blinkCount = 0; // Track the number of blinks

function preload() {
  greenBoatSpriteSheet = loadAnimation(
    "assets/boats/boat1/Boat1_water_frame1.png",
    "assets/boats/boat1/Boat1_water_frame2.png",
    "assets/boats/boat1/Boat1_water_frame3.png",
    "assets/boats/boat1/Boat1_water_frame4.png"
  );

  greenCannonSpriteSheet = loadAnimation(
    "assets/cannons/cannon1/Cannon1_color1_1.png",
    "assets/cannons/cannon1/Cannon1_color1_2.png",
    "assets/cannons/cannon1/Cannon1_color1_3.png",
    "assets/cannons/cannon1/Cannon1_color1_4.png"
  );

  greenFireSpriteSheet = loadAnimation(
    "assets/fires/fire1/Fire1_1.png",
    "assets/fires/fire1/Fire1_2.png",
    "assets/fires/fire1/Fire1_3.png"
  );

  blueBoatSpriteSheet = loadAnimation(
    "assets/boats/boat2/Boat2_water_frame1.png",
    "assets/boats/boat2/Boat2_water_frame2.png",
    "assets/boats/boat2/Boat2_water_frame3.png",
    "assets/boats/boat2/Boat2_water_frame4.png"
  );

  blueCannonSpriteSheet = loadAnimation(
    "assets/cannons/cannon2/Cannon2_color1_1.png",
    "assets/cannons/cannon2/Cannon2_color1_2.png",
    "assets/cannons/cannon2/Cannon2_color1_3.png"
  );

  blueFireSpriteSheet = loadAnimation(
    "assets/fires/fire2/Fire2_1.png",
    "assets/fires/fire2/Fire2_2.png",
    "assets/fires/fire2/Fire2_3.png"
  );

  heartSpriteSheet = loadAnimation(
    "assets/hearts/heart1.png",
    "assets/hearts/heart2.png",
    "assets/hearts/heart3.png",
    "assets/hearts/heart4.png",
    "assets/hearts/heart5.png"
  );

  backgroundImage = loadImage("assets/water-tile.png"); 
}

function setup() {
  var canvasWidth = 800; 
  var canvasHeight = (3 / 4) * canvasWidth; // Calculate height for 4:3 aspect ratio
  createCanvas (canvasWidth, canvasHeight); // Create the canvas
  angleMode(DEGREES); // Use degrees for rotation

  // Initialize word positions randomly around the edges of the canvas
  for (var i = 0; i < words.length; i++) {
    var startX, startY;
    var edge = floor(random(4)); // Randomly choose an edge (0: top, 1: right, 2: bottom, 3: left)
    if (edge === 0) { // Top edge
      startX = random(width);
      startY = 0;
    } else if (edge === 1) { // Right edge
      startX = width;
      startY = random(height);
    } else if (edge === 2) { // Bottom edge
      startX = random(width);
      startY = height;
    } else { // Left edge
      startX = 0;
      startY = random(height);
    }
    wordPositions.push({ x: startX, y: startY });
  }
}

function draw() {
  background(0); // Clear the canvas
  drawBackground();

  // Draw the heart
  drawHeart();

  // Draw the green boat
  drawGreenBoat();

  // Draw the blue boat regardless of the word completion status
  drawBlueBoat();

  // Animate words towards the center
  drawWordsTowardsCenter();

  // Display the score
  displayScore();

  handleInput();

  // Update the background offset to create a flowing effect
  backgroundOffsetX += 0.15; // Increment the offset for animation
  if (backgroundOffsetX >= tileSize) { // Reset the offset to loop the background
    backgroundOffsetX = 0;
  }
}

function displayScore() {
  fill(255); // Set text color to white
  textSize(24); // Set text size
  textAlign(LEFT, TOP); // Align text to the top left
  textFont('monospace');
  text("Score: " + score, 10, 10); // Display the score in the top left corner
}

function drawHeart() {
  // Draw the heart in the upper left corner using the heart sprite sheet
  push(); // Save the current drawing state
  translate(50, 50); // Position the heart
  scale(1.5); // Increase the size of the heart (1.5x)
  animation(heartSpriteSheet, 0, 0); // Draw the heart at the origin (0,0) after scaling
  pop(); // Restore the previous state
}

function drawBackground() {
  for (var x = -tileSize; x < width + tileSize; x += tileSize) {
    for (var y = 0; y < height; y += tileSize) {
      image(backgroundImage, x + backgroundOffsetX, y, tileSize, tileSize); // Apply the offset to the x-coordinate
    }
  }
}

function drawWordsTowardsCenter() {
  push();
  translate(width / 2, height / 2); // Move to the center position

  var i = currentWordIndex; // Get the index of the current word
  fill(255); // Default text color (white)
  textAlign(CENTER, CENTER); // Center the text horizontally and vertically
  textFont('monospace'); // Use a monospace font
  textSize(fontSize); // Set the font size

  // Draw each letter of the current word only if the word is not completed
  if (!wordCompleted) {
    for (var j = 0; j < currentWord.length; j++) {
      fill(0, 0, 0, 100); // Semi-transparent black background for the letter

      // Draw the background rectangle behind the text
      let rectX = wordPositions[i].x - width / 2 + j * fontSize / 2 - fontSize / 4;
      let rectY = wordPositions[i].y - height / 2 - fontSize / 2;
      let rectWidth = fontSize * 0.5;
      let rectHeight = fontSize;

      // Center the background rectangle
      rect(rectX, rectY, rectWidth, rectHeight);

      // Change text color based on correctness
      if (userInput[j] === currentWord[j]) {
        fill(0, 255, 0); // Green for correct letters
      } else {
        fill(255); // White for incorrect letters
      }

      // Draw the letter
      text(currentWord[j], wordPositions[i].x - width / 2 + j * fontSize / 2, wordPositions[i].y - height / 2); 
    }

    // Move the word towards the center
    var centerX = width / 2;
    var centerY = height / 2;
    var dirX = centerX - wordPositions[i].x;
    var dirY = centerY - wordPositions[i].y;
    var distance = dist(wordPositions[i].x, wordPositions[i].y, centerX, centerY);

    // Normalize the direction and move the word towards the center
    if (distance > 1) { // Only move if the word is not already at the center
      wordPositions[i].x += (dirX / distance) * animationSpeed;
      wordPositions[i].y += (dirY / distance) * animationSpeed;
    }
  } else {
    // If the word is completed, start fading the blue boat
    if (blueBoatAlpha > 0) {
      blueBoatAlpha -= fadeSpeed; // Decrease the alpha value
    } else {
      // Reset for the next word
      currentWordIndex = (currentWordIndex + 1) % words.length;
      currentWord = words[currentWordIndex]; // Update the current word
      userInput = ""; // Reset user input for the new word
      wordCompleted = false; // Reset the completion flag for the next word
      blueBoatAlpha = 255; // Reset the blue boat alpha for the next word
    }
  }

  pop(); // Restore the previous state
}
function drawGreenBoat() {
  // Calculate the angle to the current word
  var targetWordPosition = wordPositions[currentWordIndex];
  var angleToWord = atan2(targetWordPosition.y - height / 2, targetWordPosition.x - width / 2);

  // Check if the blue boat is near the center
  var blueBoatDistance = dist(wordPositions[currentWordIndex].x, wordPositions[currentWordIndex].y, width / 2, height / 2);
  var blink = blueBoatDistance < 200; // the distance threshold 

  // Move and rotate the green boat, cannon, and fire together
  push();
  translate(width / 2, height / 2); // Move to the center position
  rotate(angleToWord - 85); // Rotate the group to face the current word

  if (blink) {
    // Blink the green boat by rapidly changing its alpha value
    var alpha = sin(frameCount * 15) * 255; // adjust the blink speed as needed
    tint(255, alpha);

    // Increment the blink count every frame the green boat is blinking
    blinkCount++;
    
    // Reset the blink count if it exceeds the threshold
    if (blinkCount >= 10) {
      // Start fading the blue boat
      if (blueBoatAlpha > 0) {
        blueBoatAlpha -= fadeSpeed; // Decrease the alpha value of the blue boat
      } else {
        // Reset for the next word
        currentWordIndex = (currentWordIndex + 1) % words.length;
        currentWord = words[currentWordIndex]; // Update the current word
        userInput = ""; // Reset user input for the new word
        wordCompleted = false; // Reset the completion flag for the next word
        blueBoatAlpha = 255; // Reset the blue boat alpha for the next word
      }
    }
  } else {
    // Reset blink count if the green boat is not blinking
    blinkCount = 0;
  }

  animation(greenBoatSpriteSheet, 0, 0); // Draw the green boat

  animation(greenCannonSpriteSheet, 2, 30); // Draw the green cannon in relation to the boat

  animation(greenFireSpriteSheet, -2, 100); // Draw the fire in relation to the cannon

  pop(); // Restore the previous state for the group
}

function drawBlueBoat() {
  var i = currentWordIndex;

  // Calculate the angle to the current word
  var targetWordPosition = wordPositions[i];
  var angleToWord = atan2(targetWordPosition.y - height / 2, targetWordPosition.x - width / 2);

  // Position and rotate the blue boat to match the green fire's direction
  push();
  translate(targetWordPosition.x, targetWordPosition.y); // Move to the word's position
  rotate(angleToWord + 95); // Rotate to align with the angle to the target word

  // Set the fill color with the current alpha value
  tint(255, blueBoatAlpha); // Apply the alpha value to the blue boat
  animation(blueBoatSpriteSheet, 22, 22); // Draw the blue boat

  animation(blueCannonSpriteSheet, 22, 42); // Draw the blue cannon in relation to the boat

  animation(blueFireSpriteSheet, 22, 102); // Draw the fire in relation to the cannon

  pop();
}


function handleInput() {
  if (keyIsPressed) {
    // Capture the user's input only if it's a valid letter and within the length of the current word
    var typedChar = String.fromCharCode(keyCode);
    
    // Check if the typed character matches the corresponding character in the current word
    if (typedChar.match(/[a-zA-Z]/) && userInput.length < currentWord.length) {
      if (typedChar === currentWord[userInput.length]) {
        userInput += typedChar; // Append the correct character to user input
        
        // Check if the user has completed the word
        if (userInput.length === currentWord.length) {
          if (userInput === currentWord) {
            score++; // Increment the score only if the word is completed correctly
            wordCompleted = true; // Set the wordCompleted flag to true
            blueBoatAlpha -= fadeSpeed; // Start fading the blue boat immediately
          }
        }
      }
    }
  }
}
