//Listens for controller connection
//Controller will register as connected when it is plugged in
//with the game open, or when some input is registered on the controller
//The browser GamepadAPI will not detect a gamepad until some action or input is done.
window.addEventListener("gamepadconnected", (event) => {
    console.log("A gamepad connected:", event.gamepad.id);
    console.log(event.gamepad);
    controller = event.gamepad;
});



//enums object assigns names to values used throught the program for easier readability
const enums = {
    //TRUE and FALSE enums are defined as 0 and 1
    //because many options in the settings use sliders as boolean switches
    //Sliders take 2 numbers as arguments, so rather than true and false they use 0 and 1 as boolean values
    TRUE: 1,
    FALSE: 0,
    menu: {
        START: 0,
        PLAY: 1,
        INSTRUCT: 2,
        INSTRUCT_2: 6,
        SETTINGS_1: 3,
        SETTINGS_2: 4,
        GAME_OVER: 5,
        GAMEPAD_CONNECT: 7
    },
    ear: {
        RIGHT: 0,
        LEFT: 1
    },
    input: {
        l: 76,
        MOUSE_R: "MOUSE_right",
        MOUSE_L: "MOUSE_left",
        E: 69,
        NONE: "NONE"
    }
};

let leftEarSounds;
let rightEarSounds;
let leftEarReactSounds;
let rightEarReactSounds;

//Jantzen:
let x, y, r, r2, r3;
let squareX = 400;
let squareY = 400;
let barX, barY;
let throtY;

let menuOption = enums.menu.START;

let curDist = 0;
let runningAvg = 0;
let runningTotal = 0;
let throtCurDist = 0;
let throtRunningAvg = 0;
let throtRunningTotal = 0;
let samples = 0;

//Default game time
let timer = 60;
let timeBuffer = timer;

let ax = 0;
let ay = 0;
let vx = 5;
let vy = 5;
let vMul = 0.3;
let aThrottle = 0;
let vThrottle = 5;
let throttleMul = 0.5 * 0.75;
let vThrottleMax = 9;
let vTargetMax = 9;

let audioCues = enums.FALSE;
let musicToggle = 0;

let haveInitSetting = 0;

let cueTotal = 0;
let cueCorrect = 0;
let cueState = 0;
let dontReact = 0;
let needClick = 0;

let firstStart = true;




//Ear to play first cue in
let cueEar = Math.round(Math.random());

//Whether the game is currently running or not
let ingame = false;

//Whether to enable debug text on the game screen
let debugToggle = enums.FALSE;

//Variable stores the key code of the last input the user entered
let lastInput = enums.input.NONE;
let currentInput = enums.input.NONE;
let expectedInput = enums.input.NONE;

//Whether the game needs to announce the first ear to listen to
let announcedFirstEar = enums.FALSE;

//Interval(in seconds) of how often to swap listening ears
let earSwapInterval = 10;

//Interval(in seconds) of how often to play a cue
let cueInterval = 5;

let reactionTime = 1;

let cueTimer = 0;

let isCuePlaying = false;

//Stores the number of frames since clicking play
let playTimeFrames = 0;

//Variables counting cues
let totalCues = 0;
let hitCues = 0;
let missedCues = 0;
let cueReactTimer = 0;

let clearIntervals = [];
let clearTimeouts = [];
let stopSounds = [];


let doEmergency = enums.FALSE;
let isEmergency = enums.FALSE;
let displayEmergencyTimer = enums.TRUE;

let emergencyNames = ["fire", "engine", "propeller"];
let orderSelected = false;

let emergencyResolutionTime = 10;
let emergencyTimer = 0;

let emergencyWait = ((timer - 37.59) / 4).toFixed(2);

let firstEmergencyCleared = false;
let secondEmergencyCleared;
let thirdEmergencyCleared;

let emergencySuccess = 0;
let emergencyFailure = 0;

let engineValue = 50;
let fuelValue = 100;

let canAdjustValues = enums.FALSE;

let upPressed = false;
let downPressed = false;

let controller;
let controllerIndex = 0;


function preload () {
    alertLeft = loadSound('assets/left.mp3');
    alertRight = loadSound('assets/right.mp3');

    earSwitchAlert = [alertRight, alertLeft];

    soundFormats('wav', 'mp3');
    menuSound = loadSound('assets/music.mp3');
    startSound = loadSound('assets/misc_menu_4.wav');

    jet = loadImage("Yellow_jet.png");
    target = loadImage("Navy_target.png");
    greenTarget = loadImage("assets/Green_target.png");
    blueAngel = loadImage('assets/blue_angel.png');
    blueAngelFlipped = loadImage('assets/blue_angel_flipped.png');
    keyMap = loadImage('assets/keyMap.PNG');

    x52 = loadImage('assets/throttle.png');

    swapRight = loadSound('assets/right.mp3');
    swapLeft = loadSound('assets/left.mp3');

    oneLeft = loadSound('assets/1_Left.mp3');
    oneRight = loadSound('assets/1_Right.mp3');
    twoLeft = loadSound('assets/2_Left.mp3');
    twoRight = loadSound('assets/2_Right.mp3');
    threeLeft = loadSound('assets/3_Left.mp3');
    threeRight = loadSound('assets/3_Right.mp3');
    fourLeft = loadSound('assets/4_Left.mp3');
    fourRight = loadSound('assets/4_Right.mp3');
    fiveLeft = loadSound('assets/5_Left.mp3');
    fiveRight = loadSound('assets/5_Right.mp3');
    sixLeft = loadSound('assets/6_Left.mp3');
    sixRight = loadSound('assets/6_Right.mp3');
    sevenLeft = loadSound('assets/7_Left.mp3');
    sevenRight = loadSound('assets/7_Right.mp3');
    eightLeft = loadSound('assets/8_Left.mp3');
    eightRight = loadSound('assets/8_Right.mp3');
    nineLeft = loadSound('assets/9_Left.mp3');
    nineRight = loadSound('assets/9_Right.mp3');

    aLeft = loadSound('assets/A_Left.mp3');
    aRight = loadSound('assets/A_Right.mp3');
    bLeft = loadSound('assets/B_Left.mp3');
    bRight = loadSound('assets/B_Right.mp3');
    cLeft = loadSound('assets/C_Left.mp3');
    cRight = loadSound('assets/C_Right.mp3');
    dLeft = loadSound('assets/D_Left.mp3');
    dRight = loadSound('assets/D_Right.mp3');
    eLeft = loadSound('assets/E_Left.mp3');
    eRight = loadSound('assets/E_Right.mp3');
    fLeft = loadSound('assets/F_Left.mp3');
    fRight = loadSound('assets/F_Right.mp3');

    leftEarSounds = [twoLeft, fourLeft, sixLeft, eightLeft, oneLeft, threeLeft, fiveLeft, sevenLeft, nineLeft, aLeft, bLeft, cLeft, dLeft, eLeft, fLeft];
    rightEarSounds = [twoRight, fourRight, sixRight, eightRight, oneRight, threeRight, fiveRight, sevenRight, nineRight, aRight, bRight, cRight, dRight, eRight, fRight];

    leftEarReactSounds = [twoLeft, fourLeft, sixLeft, eightLeft];
    rightEarReactSounds = [oneRight, threeRight, fiveRight, sevenRight, nineRight];

    alertFire = loadSound('assets/warning_fire.mp3');
    alertEngine = loadSound('assets/warning_engine.mp3');
    alertPropeller = loadSound('assets/warning_propeller.mp3');





}




function setup () {
    createCanvas(windowWidth, windowHeight);
    //fullscreen(1);
    fancyFont = loadFont('assets/HighlandGothicFLF.ttf');
    textFont(fancyFont, 50);
    x = width / 2;
    y = height / 2;
    r = random(3, 6);
    r2 = random(3, 6);
    r3 = random(2, 5);
    barX = 50;
    barY = windowHeight - 400;
    throtY = windowHeight - 150;

    console.log("Startup");
    console.log(navigator.getGamepads());

    if(navigator.getGamepads().some(slot => {controllerIndex = slot.index; return slot !== null;})) {
        console.log("Gamepads connected: ", navigator.getGamepads().length);
        //controllers = navigator.getGamepads();
        //controller = controllers[0];
        //if(controller) {
        //console.log(controller.id);
        //}
    }
    else {
        console.log("No gamepads detected");
    }


}

function windowResized () {
    resizeCanvas(windowWidth, windowHeight);
}

function gamepadCheck () {
    textAlign(CENTER);
    exitPointerLock();
    cursor();
    fill('black');
    stroke('#013993');
    strokeWeight(3);
    fill('#e4ac00');
    textSize(35);
    let textX = windowWidth / 2; // Horizontal center of the window
    let textY = 100; // Y position of the text
    let message;
    if(navigator.getGamepads().some(slot => {controllerIndex = slot.index; return slot !== null;}) == false) {
        message = `Your gamepad is not detected.
Connect it now, or, if it's already connected, press any button on the gamepad
so the GamepadAPI will recognize it.
Emergency Mode cannot be enabled until a gamepad is detected.
Emergency mode is designed to work with the x52 H.O.T.A.S flight controller.
Similar controllers may work but it is not guaranteed.`;
    }
    else {
        message = `Gamepad detected!
You're using '${navigator.getGamepads()[controllerIndex].id}'`;
    }
    text(message, textX, textY);



    fill('black');
    let rectWidth = 200;
    let rectHeight = 75;
    let rectX = windowWidth / 2 - rectWidth / 2;
    let rectY = windowHeight - 85;
    rect(rectX, rectY, rectWidth, rectHeight);

    let buttonWidth = 200;
    let buttonHeight = 75;
    let buttonX = rectX + (rectWidth / 2) - (buttonWidth / 2);
    let buttonY = rectY + (rectHeight / 2) - (buttonHeight / 2);

    if(mouseX > buttonX && mouseX < buttonX + buttonWidth) {
        if(mouseY > buttonY && mouseY < buttonY + buttonHeight) {
            fill('#e4ac00');
            rect(rectX, rectY, rectWidth, rectHeight);
        }
    }

    fill('#e4ac00');
    textSize(30);
    textAlign(CENTER); // Center the text within the rectangle
    text('Main Menu', rectX + (rectWidth / 2), rectY + (rectHeight / 2));




}




function startMenu () {
    orderSelected = false;
    firstEmergencyCleared = false;
    secondEmergencyCleared = false;
    thirdEmergencyCleared = false;
    isEmergency = enums.FALSE;
    emergencySuccess = 0;
    emergencyFailure = 0;
    totalCues = 0;
    hitCues = 0;
    missedCues = 0;
    playTimeFrames = 0;
    timer = timeBuffer;
    lastInput = 'NONE';
    announcedFirstEar = false;
    ingame = false;
    keyCode = DELETE;
    textAlign(LEFT);
    exitPointerLock();
    cursor();
    fill('black');
    rect(windowWidth / 2 - 100, windowHeight / 2 - 200, 200, 75);
    rect(windowWidth / 2 - 100, windowHeight / 2 - 100, 200, 75);
    rect(windowWidth / 2 - 100, windowHeight / 2 - 0, 200, 75);
    stroke('#013993');
    strokeWeight(3);
    fill('#e4ac00');
    textSize(45);
    text("Jantzen and Mike's ASTB trainer... 'as real as it gets!'", windowWidth / 2 - 615, 100);

    if(mouseX > windowWidth / 2 - 100 && mouseX < windowWidth / 2 + 100) {
        if(mouseY > windowHeight / 2 - 200 && mouseY < windowHeight / 2 - 125) {
            fill('#e4ac00');
            rect(windowWidth / 2 - 100, windowHeight / 2 - 200, 200, 75);
        }
        else if(mouseY > windowHeight / 2 - 100 && mouseY < windowHeight / 2 - 25) {
            fill('#e4ac00');
            rect(windowWidth / 2 - 100, windowHeight / 2 - 100, 200, 75);
        }
        else if(mouseY > windowHeight / 2 - 0 && mouseY < windowHeight / 2 + 75) {
            fill('#e4ac00');
            rect(windowWidth / 2 - 100, windowHeight / 2 - 0, 200, 75);
        }
    }

    textSize(50 - 15);
    text('START', windowWidth / 2 - 67, windowHeight / 2 - 145);
    textSize(45 - 15);
    text('SETTINGS', windowWidth / 2 - 82, windowHeight / 2 + 55);
    textSize(40 - 18);
    text('INSTRUCTIONS', windowWidth / 2 - 90, windowHeight / 2 - 50);
    text('Laptop users: zoom your browser out to 67%', windowWidth / 2 - 240, windowHeight / 2 + 150);
    text('Press F11 to go fullscreen', windowWidth / 2 - 140, windowHeight / 2 + 215);
    image(blueAngelFlipped, windowWidth / 2 - 1000, 300);
    image(blueAngel, windowWidth / 2 + 140, 300);

    menuSound.setVolume(0.10, 0.25);

    if(!menuSound.isPlaying() && musicToggle == 1) {
        menuSound.play();
    }


    if(controller) {
        let engineKnob = controller.axes[3];
        let fuelKnob = controller.axes[4];
        engineValue = Math.round((engineKnob - (-1)) * (100 - 0) / (1 - (-1)));
        regularValue = Math.floor((fuelKnob - (-1)) * (26 - 0) / (0.99 - (-1)));

        fuelValue = Math.floor((regularValue / 26) * 100);
    }



    if(doEmergency) {
        let yPadding = 20;
        let y1 = height - yPadding;

        textAlign(LEFT);
        textSize(40);
        stroke('#013993');
        fill('#e4ac00');
        text(`Fuel: ${fuelValue}`, 20, y1);
        text(`Engine: ${engineValue}`, textWidth("Engine:100") + 70, y1);


        textSize(20);
        if(navigator.getGamepads().some(slot => {controllerIndex = slot.index; return slot !== null;}) == false) {
            text(`No gamepad detected`, 20, y1 - 45);
        }
        else {
            text(`Gamepad: '${navigator.getGamepads()[controllerIndex].id}'`, 20, y1 - 45);
        }

    }

}

function mouseClicked () {
    if(menuOption == enums.menu.START) {

        if(mouseX > windowWidth / 2 - 100 && mouseX < windowWidth / 2 + 100) {
            if(mouseY > windowHeight / 2 - 200 && mouseY < windowHeight / 2 - 125) {
                menuOption = enums.menu.PLAY;
                timer = timeBuffer;
                startSound.play();
            }
            else if(mouseY > windowHeight / 2 - 100 && mouseY < windowHeight / 2 - 25) {
                menuOption = enums.menu.INSTRUCT;
            }
            else if(mouseY > windowHeight / 2 - 0 && mouseY < windowHeight / 2 + 75) {
                menuOption = enums.menu.SETTINGS_1;
            }
        }
    }
    if(menuOption == enums.menu.SETTINGS_1) {

        let buttonWidth = 200;
        let buttonHeight = 75;
        let buttonX = windowWidth - buttonWidth - 10;
        let buttonY = 10;

        if(mouseX > buttonX && mouseX < buttonX + buttonWidth) {
            if(mouseY > buttonY && mouseY < buttonY + buttonHeight) {
                menuOption = enums.menu.SETTINGS_2;
            }
        }
    }
    if(menuOption == enums.menu.INSTRUCT) {
        let buttonWidth = 200;
        let buttonHeight = 75;
        let buttonX = windowWidth - buttonWidth - 10;
        let buttonY = windowHeight - 85;

        if(mouseX > buttonX && mouseX < buttonX + buttonWidth) {
            if(mouseY > buttonY && mouseY < buttonY + buttonHeight) {
                menuOption = enums.menu.INSTRUCT_2;
            }
        }
    }
    if(menuOption == enums.menu.GAMEPAD_CONNECT) {
        let rectWidth = 200;
        let rectHeight = 75;
        let rectX = windowWidth / 2 - rectWidth / 2;
        let rectY = windowHeight - 85;
        rect(rectX, rectY, rectWidth, rectHeight);
        let buttonWidth = 200;
        let buttonHeight = 75;
        let buttonX = rectX + (rectWidth / 2) - (buttonWidth / 2);
        let buttonY = rectY + (rectHeight / 2) - (buttonHeight / 2);

        if(mouseX > buttonX && mouseX < buttonX + buttonWidth) {
            if(mouseY > buttonY && mouseY < buttonY + buttonHeight) {
                if(navigator.getGamepads().some(slot => {controllerIndex = slot.index; return slot !== null;}) == false) {
                    doEmergency = enums.FALSE;
                }

                menuOption = enums.menu.START;
            }
        }
    }

}

function gameOver () {
    playTimeFrames = 0;
    isEmergency = enums.FALSE;
    firstEmergencyCleared = false;
    secondEmergencyCleared = false;
    thirdEmergencyCleared = false;
    orderSelected = false;
    lastInput = 'NONE';
    announcedFirstEar = false;
    ingame = false;
    textAlign(CENTER);
    textSize(100);
    text("Game Over", windowWidth / 2, windowHeight / 2 - 300);
    textSize(40);
    text("Your average distance from the target was: " + round(runningAvg), windowWidth / 2, windowHeight / 2 + 0);
    text("Your average distance from the throttle target was: " + round(throtRunningAvg), windowWidth / 2, windowHeight / 2 + 100);
    text("Try to get your scores as low as possible", windowWidth / 2, windowHeight / 2 + 200);
    text("Press backspace to return to the menu", windowWidth / 2, windowHeight / 2 + 300);
    if(audioCues == enums.TRUE) {
        text("You got " + hitCues + "/" + totalCues + " cues correct", windowWidth / 2, windowHeight / 2 - 100);
    }
    if(doEmergency) {
        text("You cleared " + emergencySuccess + "/" + "3" + " emergencies succesfully", windowWidth / 2, windowHeight / 2 - 100);
    }
    if(keyCode == BACKSPACE) {
        throtRunningAvg = 0;
        runningAvg = 0;
        hitCues = 0;
        totalCues = 0;
        keyCode = DELETE;
        clear();
        menuOption = enums.menu.START;
    }

}

function instructMenu () {
    fill('black');
    rect(windowWidth - 210, windowHeight - 85, 200, 75);
    fill('#e4ac00');

    let buttonWidth = 200;
    let buttonHeight = 75;
    let buttonX = windowWidth - buttonWidth - 10;
    let buttonY = windowHeight - 85;

    if(mouseX > buttonX && mouseX < buttonX + buttonWidth) {
        if(mouseY > buttonY && mouseY < buttonY + buttonHeight) {
            fill('#e4ac00');
            rect(buttonX, buttonY, buttonWidth, buttonHeight);
        }
    }

    fill('#e4ac00');
    textSize(25);
    text('Emergency', windowWidth - 110, windowHeight - 55);
    text('Training', windowWidth - 110, windowHeight - 25);

    ingame = false;
    image(keyMap, 420, -50);
    textSize(27);
    textAlign(CENTER);
    text("Goal: Align your plane with the target using the mouse,", windowWidth / 2, windowHeight / 2 - 100);
    text(" while aligning your throttle with the target using the 'w' and 's' keys", windowWidth / 2, windowHeight / 2 - 60);
    text("If you have audio cue training on (headphones required), there are 2 more controls:", windowWidth / 2, windowHeight / 2 + 0);
    textSize(20);
    text("1. Press 'e' when you hear an EVEN number in your LEFT ear", windowWidth / 2, windowHeight / 2 + 50);
    text("2. RIGHT click when you hear an ODD number in your RIGHT ear", windowWidth / 2, windowHeight / 2 + 100);
    textSize(30);
    text("Press Backspace to return", windowWidth / 2, windowHeight / 2 + 250);

    if(keyCode == BACKSPACE) {
        keyCode = DELETE;

        clear();
        menuOption = enums.menu.START;
    }
}

function instructMenu2 () {
    ingame = false;
    image(x52, (windowWidth - x52.width) / 2, 20);
    textSize(27);
    text("Fuel", ((windowWidth - x52.width) / 2) + 200, windowHeight - (windowHeight - 30));
    text("Engine", ((windowWidth - x52.width) / 2) + 360, windowHeight - (windowHeight - 125));

    textAlign(LEFT);
    textSize(15);
    fill('#FF0000');
    stroke("#000000");
    text("Emergency Mode is designed to work with the X52 H.O.T.A.S throttle.", 0, windowHeight - (windowHeight - 25));
    text("Similar controllers may work but it is not guaranteed.", 0, windowHeight - (windowHeight - 50));
    text("You MUST have your controller plugged in before", 0, windowHeight - (windowHeight - 75));
    text("starting a game with Emergency Mode, otherwise the game will not load.", 0, windowHeight - (windowHeight - 100));
    stroke('#013993');
    fill('#e4ac00');
    textSize(25);

    let explanation =
        `In Emergency Mode, you have 10 seconds to 
set the Engine and Fuel knobs, as shown in the 
image, to the correct combination of values 
pertaining to the emergency type then pressing
ENTER. The solutions for the 3 emergency 
types are shown on the right.

Before beginning the game, make sure the Engine and Fuel 
knobs are both set to 50%. You will be able to see the
value of Engine and Fuel on the main menu to help you do this.

If you're using an input mapping software, such as AntiMicro,
you will not need to manually configure the input for the knobs on your throttle
controller. They are hardcoded and cannot be changed. 
You cannot play Emergency Mode without an X52 H.O.T.A.S throttle or similar controller.`;



    text(explanation, 0, windowHeight - (windowHeight - 160));




    textAlign(RIGHT);
    text("Fire Emergency", windowWidth - 10, windowHeight - (windowHeight - 75));
    textSize(20);
    text("- Fuel: 100", windowWidth - 10, windowHeight - (windowHeight - 100));
    text("- Engine: 0", windowWidth - 10, windowHeight - (windowHeight - 125));
    textSize(25);

    text("Engine Emergency", windowWidth - 10, windowHeight - (windowHeight - 175));
    textSize(20);
    text("- Fuel: 0", windowWidth - 10, windowHeight - (windowHeight - 200));
    text("- Engine: 100", windowWidth - 10, windowHeight - (windowHeight - 225));
    textSize(25);

    text("Propeller Emergency", windowWidth - 10, windowHeight - (windowHeight - 275));
    textSize(20);
    text("- Fuel: 50", windowWidth - 10, windowHeight - (windowHeight - 300));
    text("- Engine: 100", windowWidth - 10, windowHeight - (windowHeight - 325));
    textSize(25);





    textSize(30);
    textAlign(CENTER);
    text("Press Backspace to return", windowWidth / 2, windowHeight / 2 + 300);

    if(keyCode == BACKSPACE) {
        keyCode = DELETE;

        clear();
        menuOption = enums.menu.INSTRUCT;
    }
}

function settingsMenu () {
    //button to next settings page
    exitPointerLock();
    cursor();
    fill('black');

    rect(windowWidth - 210, 10, 200, 75);

    /*if(mouseX > windowWidth - 210 && mouseX < windowWidth + 210) {
        if(mouseY > windowHeight / 2 - 340 && mouseY < windowHeight / 2 - 265) {
            fill('#e4ac00');
            rect(windowWidth - 210, windowHeight - (windowHeight - 10), 200, 75);
        }
    }*/

    let buttonWidth = 200;
    let buttonHeight = 75;
    let buttonX = windowWidth - buttonWidth - 10;
    let buttonY = 10;

    if(mouseX > buttonX && mouseX < buttonX + buttonWidth) {
        if(mouseY > buttonY && mouseY < buttonY + buttonHeight) {
            fill('#e4ac00');
            rect(buttonX, buttonY, buttonWidth, buttonHeight);
        }
    }



    fill('#e4ac00');
    textSize(50 - 15);
    text('MORE', windowWidth - 110, windowHeight - (windowHeight - 60));

    ingame = false;
    let sliderWidth = 200;
    let sliderX = windowWidth / 2 - sliderWidth / 2;
    if(haveInitSetting == 0) {
        throtSlider = createSlider(5, 15, vThrottleMax);
        throtSlider.position(sliderX, 130);
        throtSlider.size(sliderWidth);

        targetSlider = createSlider(5, 15, vTargetMax);
        targetSlider.position(sliderX, 230);
        targetSlider.size(sliderWidth);

        if(!doEmergency) {
            timerSlider = createSlider(10, 300, timer);
            timerSlider.position(sliderX, 330);
            timerSlider.size(sliderWidth);
        }
        else {
            timerSlider = createSlider(60, 300, timer);
            timerSlider.position(sliderX, 330);
            timerSlider.size(sliderWidth);
        }

        audioSlider = createSlider(enums.FALSE, enums.TRUE, audioCues);
        audioSlider.position(sliderX, 445);
        audioSlider.size(sliderWidth);

        musicSlider = createSlider(0, 1, musicToggle);
        musicSlider.position(sliderX, 545);
        musicSlider.size(sliderWidth);

        haveInitSetting = 1;
    }
    if(haveInitSetting) {
        throtSlider.position(sliderX, 130);
        targetSlider.position(sliderX, 230);
        timerSlider.position(sliderX, 330);
        audioSlider.position(sliderX, 445);
        musicSlider.position(sliderX, 545);
    }
    timer = timerSlider.value();
    emergencyWait = ((timer - 37.59) / 4).toFixed(2);
    timeBuffer = timer;
    vThrottleMax = throtSlider.value();

    vMul = 0.15 + ((targetSlider.value() - 5) / 10) * (0.45 - 0.15);
    throttleMul = 0.225 + ((throtSlider.value() - 5) / 10) * (0.525 - 0.225);

    vTargetMax = targetSlider.value();
    audioCues = audioSlider.value();
    musicToggle = musicSlider.value();

    if(audioCues == enums.TRUE) {
        doEmergency = enums.FALSE;
        timerSlider.attribute('min', 10);
    }

    fill('#e4ac00');
    textSize(18);
    textAlign(CENTER);
    text("Easy", windowWidth / 2 - 150, 145);
    text("Hard", windowWidth / 2 + 150, 145);
    text("Easy", windowWidth / 2 - 150, 245);
    text("Hard", windowWidth / 2 + 150, 245);
    text("Time:", windowWidth / 2 - 150, 345);
    text(timer + " seconds", windowWidth / 2 + 185, 345);
    //Cue training
    text("Off", windowWidth / 2 - 150, 460);
    text("On", windowWidth / 2 + 150, 460);
    //Music
    text("Off", windowWidth / 2 - 150, 560);
    text("On", windowWidth / 2 + 150, 560);

    textSize(25);
    textAlign(CENTER);
    text("Page One", windowWidth / 2, 25);
    textAlign(CENTER);

    textSize(35);
    textAlign(CENTER);
    text("Slide to adjust throttle speed", windowWidth / 2, 100);
    textAlign(CENTER);

    text("Slide to adjust target speed", windowWidth / 2, 200);
    textAlign(CENTER);

    text("Slide to adjust game time", windowWidth / 2, 300);
    textAlign(CENTER);

    text("Audio cue training", windowWidth / 2, 400);

    textSize(17);
    fill('#FF0000');
    stroke("#000000");
    text("Turning this on will disable emergency training", windowWidth / 2, 425);

    stroke('#013993');
    fill('#e4ac00');


    text("Music", windowWidth / 2, 515);

    fill('#e4ac00');
    textSize(25);
    textAlign(CENTER);
    text('Press Backspace to return', windowWidth / 2, windowHeight / 2 + 250);

    if(musicToggle == 0) {
        menuSound.stop();
    }


    if(keyCode == BACKSPACE) {
        keyCode = DELETE;

        targetSlider.remove();
        throtSlider.remove();
        audioSlider.remove();
        timerSlider.remove();
        musicSlider.remove();
        clear();
        menuOption = enums.menu.START;
        haveInitSetting = 0;
    }

}

function settingsMenu2 () {
    targetSlider.remove();
    throtSlider.remove();
    audioSlider.remove();
    timerSlider.remove();
    musicSlider.remove();
    ingame = false;

    let sliderWidth = 200;
    let sliderX = windowWidth / 2 - sliderWidth / 2;
    if(haveInitSetting == 1) {
        //Slider for changing time between ear swap
        earSwapSlider = createSlider(5, 30, earSwapInterval);
        earSwapSlider.position(sliderX, 130);
        earSwapSlider.size(sliderWidth);

        //Slider for changing the interval at which cue sets will play
        cueIntervalSlider = createSlider(3, 15, cueInterval);
        cueIntervalSlider.position(sliderX, 230);
        cueIntervalSlider.size(sliderWidth);

        //Slider for changing the reaction time for a cue
        reactionTimeSlider = createSlider(0.1, 2.5, reactionTime, 0.1);
        reactionTimeSlider.position(sliderX, 330);
        reactionTimeSlider.size(sliderWidth);

        //Emergencies toggle
        emergencySlider = createSlider(enums.FALSE, enums.TRUE, doEmergency, 1);
        emergencySlider.position(sliderX, 445);
        emergencySlider.size(sliderWidth);

        //Slider for toggling debug text on/off
        debugSlider = createSlider(enums.FALSE, enums.TRUE, debugToggle);
        debugSlider.position(65, 130);
        debugSlider.size(200);

        haveInitSetting = 2;
    }
    if(haveInitSetting == 2) {
        earSwapSlider.position(sliderX, 130);
        cueIntervalSlider.position(sliderX, 230);
        reactionTimeSlider.position(sliderX, 330);
        emergencySlider.position(sliderX, 445);
    }

    earSwapInterval = earSwapSlider.value();
    debugToggle = debugSlider.value();
    cueInterval = cueIntervalSlider.value();
    reactionTime = reactionTimeSlider.value();
    doEmergency = emergencySlider.value();



    if(doEmergency == enums.TRUE) {
        audioCues = enums.FALSE;

        if(navigator.getGamepads().some(slot => {controllerIndex = slot.index; return slot !== null;}) == false) {
            earSwapSlider.remove();
            debugSlider.remove();
            cueIntervalSlider.remove();
            reactionTimeSlider.remove();
            emergencySlider.remove();
            clear();
            haveInitSetting = 0;
            menuOption = enums.menu.GAMEPAD_CONNECT;

        }


    }

    fill('#e4ac00');
    textSize(18);
    textAlign(CENTER);

    //Swap timing
    text("Interval:", windowWidth / 2 - 150, 145);
    text(earSwapInterval + " seconds", windowWidth / 2 + 185, 145);

    //Cue set interval
    text("Interval:", windowWidth / 2 - 150, 245);
    text(cueInterval + " seconds", windowWidth / 2 + 185, 245);

    //Reaction time
    text("Time:", windowWidth / 2 - 150, 345);
    text(reactionTime + " seconds", windowWidth / 2 + 185, 345);

    //Emergencies
    text("Off", windowWidth / 2 - 150, 460);
    text("On", windowWidth / 2 + 185, 460);

    //Debug toggle
    text("Off", 45, 145);
    text("On", 290, 145);

    textSize(25);
    textAlign(CENTER);
    text("Page Two", windowWidth / 2, 25);
    textAlign(CENTER);

    textSize(35);
    text("Interval to swap ears", windowWidth / 2, 100);

    text("Interval to play cue set(2 cues)", windowWidth / 2, 200);

    text("Cue reaction time", windowWidth / 2, 300);

    text("Emergency Training", windowWidth / 2, 400);

    textSize(17);
    fill('#FF0000');
    stroke("#000000");
    text("Turning this on will disable audio cue training and limit game time to minimum 60 seconds", windowWidth / 2, 425);

    stroke('#013993');
    fill('#e4ac00');
    textSize(35);
    text("Toggle Debug Text", 165, 100);

    fill('#e4ac00');
    textSize(25);
    textAlign(CENTER);
    text('Press Backspace to return to Page One', windowWidth / 2, windowHeight / 2 + 250);

    if(keyCode == BACKSPACE) {
        keyCode = DELETE;

        earSwapSlider.remove();
        debugSlider.remove();
        cueIntervalSlider.remove();
        reactionTimeSlider.remove();
        emergencySlider.remove();
        clear();
        menuOption = enums.menu.SETTINGS_1;
        haveInitSetting = 0;
    }

}







function shuffleArray (array) {
    for(let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}



function keyReleased () {
    keyCode = DELETE;
    currentInput = enums.input.NONE;


    upPressed = false;
    downPressed = false;

}

function keyPressed () {
    lastInput = key;
    currentInput = key;

}



function mousePressed () {

    if(mouseButton === "right") {
        lastInput = enums.input.MOUSE_R;
        currentInput = enums.input.MOUSE_R;
    }
    else if(mouseButton === "left") {
        lastInput = enums.input.MOUSE_L;
        currentInput = enums.input.MOUSE_L;
    }
    setTimeout(() => {
        currentInput = "NONE";
    }, 1000);
}


function draw () {
    background(0);

    if(doEmergency) {
        controller = navigator.getGamepads()[controllerIndex];
    }

    if(getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }

    if(menuOption == enums.menu.START) {
        firstStart = true;
        startMenu();
    }
    else if(menuOption == enums.menu.INSTRUCT) {
        instructMenu();
    }
    else if(menuOption == enums.menu.INSTRUCT_2) {
        instructMenu2();
    }
    else if(menuOption == enums.menu.SETTINGS_1) {
        settingsMenu();
    }
    else if(menuOption == enums.menu.PLAY) {

        if(firstStart == true) {
            squareX = windowWidth / 2;
            squareY = windowHeight / 2;
            firstStart = false;
        }
        playGame();
    }
    else if(menuOption == enums.menu.GAME_OVER) {
        firstStart = true;
        gameOver();
    }
    else if(menuOption == enums.menu.SETTINGS_2) {
        settingsMenu2();
    }
    else if(menuOption == enums.menu.GAMEPAD_CONNECT) {
        gamepadCheck();
    }

}



function switchEar () {
    if(cueEar == enums.ear.RIGHT) {
        cueEar = enums.ear.LEFT;
    }
    else if(cueEar == enums.ear.LEFT) {
        cueEar = enums.ear.RIGHT;
    }
    let changeSound = earSwitchAlert[cueEar];
    stopSounds.push(changeSound);
    changeSound.play();
    return changeSound;
}


function randomSound (array) {
    let randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function clearAllIntervals () {
    for(let intervalId in clearIntervals) {
        clearInterval(clearIntervals[intervalId]);
    }

    clearIntervals = []; // Reset the global array to an empty array
}

function clearAllTimeouts () {
    for(let timeoutId in clearTimeouts) {
        clearTimeout(clearTimeouts[timeoutId]);
    }

    clearTimeouts = []; // Reset the global array to an empty array
}

function stopAllSounds () {
    for(let soundId in stopSounds) {
        stopSounds[soundId].stop();
    }

    stopSounds = []; // Reset the global array to an empty array
}



function runInterval (seconds, func) {
    if(playTimeFrames % (seconds * 60) === 0) {
        func(0);
    }
}
//PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
//PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP
//PPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP







function playGame () {
    ingame = true;
    playTimeFrames++;
    if(timer <= 0.99) {
        menuOption = enums.menu.GAME_OVER;
        curDist = 0;
        runningTotal = 0;
        throtCurDist = 0;
        throtRunningTotal = 0;
        samples = 0;
        timer = timeBuffer;
        clearAllIntervals();
        clearAllTimeouts();
        stopAllSounds();
        return;
    }

    textAlign(LEFT);
    requestPointerLock();
    noCursor();
    fill(0);
    stroke("#013993");
    rect(20, 100, 70, windowHeight - 200);
    strokeWeight(3);
    stroke("#013993");

    if(keyCode == BACKSPACE) {
        keyCode = DELETE;
        clearAllIntervals();
        clearAllTimeouts();
        stopAllSounds();
        clear();
        menuOption = enums.menu.START;
    }

    if(menuSound.isPlaying()) {
        menuSound.setVolume(0);
    }




    if(doEmergency) {
        let engineKnob = controller.axes[3];
        let fuelKnob = controller.axes[4];
        engineValue = Math.round((engineKnob - (-1)) * (100 - 0) / (1 - (-1)));
        regularValue = Math.floor((fuelKnob - (-1)) * (26 - 0) / (0.99 - (-1)));

        fuelValue = Math.floor((regularValue / 26) * 100);
    }



    //Emergency training
    if(doEmergency == enums.TRUE) {
        let emergencyOrder;
        if(!orderSelected) {
            emergencyOrder = shuffleArray(emergencyNames);
            orderSelected = true;
        }




        let emergencies = {
            fire: {
                sound: alertFire,
                engine: 0,
                fuel: 100
            },
            engine: {
                sound: alertEngine,
                engine: 100,
                fuel: 0
            },
            propeller: {
                sound: alertPropeller,
                engine: 100,
                fuel: 50
            }

        };




        let yPadding = 20;
        let y = height - yPadding;
        textAlign(LEFT);
        textSize(40);
        stroke('#013993');
        fill('#e4ac00');
        text(`Fuel: ${fuelValue}`, 20, y);
        text(`Engine: ${engineValue}`, textWidth("Engine:100") + 70, y);


        function playEmergency (emergencyObject) {
            emergencyTimer = emergencyResolutionTime;
            let warning = emergencyObject.sound;
            warning.play();
            stopSounds.push(warning);

            let waitForSound = setTimeout(() => {
                let start = startSound;
                start.play();
                stopSounds.push(start);
                isEmergency = enums.TRUE;
                let updateTimer = setInterval(() => {
                    if(emergencyTimer > 0) {
                        emergencyTimer--;
                    }
                }, 1000);
                clearIntervals.push(updateTimer);

                //If enter is clicked before the timer finished
                let checkInput = setInterval(() => {
                    if(currentInput == "Enter") {
                        clearInterval(updateTimer);

                        if(engineValue === emergencyObject.engine && fuelValue === emergencyObject.fuel) {
                            emergencySuccess++;
                            isEmergency = enums.FALSE;
                            clearInterval(updateTimer);
                            clearInterval(checkTimerEnd);
                            clearInterval(checkInput);
                            clearInterval(waitForSound);
                        }
                        else {
                            emergencyFailure++;
                            isEmergency = enums.FALSE;
                            clearInterval(updateTimer);
                            clearInterval(checkTimerEnd);
                            clearInterval(checkInput);
                            clearInterval(waitForSound);
                        }
                    }
                }, 15);
                clearIntervals.push(checkInput);

                let checkTimerEnd = setInterval(() => {
                    if(emergencyTimer == 0) {
                        emergencyFailure++;
                        isEmergency = enums.FALSE;
                        clearInterval(updateTimer);
                        clearInterval(checkTimerEnd);
                        clearInterval(checkInput);
                        clearInterval(waitForSound);
                    }
                }, 16);
                clearIntervals.push(checkTimerEnd);

            }, 2.53 * 1000);
            clearTimeouts.push(waitForSound);


        }

        if(emergencyOrder) {
            let firstEmergency = emergencies[emergencyOrder[0]];
            let secondEmergency = emergencies[emergencyOrder[1]];
            let thirdEmergency = emergencies[emergencyOrder[2]];

            let first = setTimeout(() => {
                if(!firstEmergencyCleared) {
                    playEmergency(firstEmergency);
                    firstEmergencyCleared = true;
                }
            }, emergencyWait * 1000);
            clearTimeouts.push(first);

            let second = setTimeout(() => {
                if(!secondEmergencyCleared) {
                    playEmergency(secondEmergency);
                    secondEmergencyCleared = true;
                }
            }, ((emergencyWait * 2) + 2.53 + 10) * 1000);
            clearTimeouts.push(second);

            let third = setTimeout(() => {
                if(!thirdEmergencyCleared) {
                    playEmergency(thirdEmergency);
                    thirdEmergencyCleared = true;
                }
            }, ((emergencyWait * 3) + (2.53 * 2) + (10 * 2)) * 1000);
            clearTimeouts.push(third);


        }







    }


    //audio training
    if(audioCues == enums.TRUE) {

        if(!announcedFirstEar) {
            switchEar();
            announcedFirstEar = enums.TRUE;
        }

        let earSwapTimer = runInterval(earSwapInterval, function() {
            setTimeout(() => {
                if(!isCuePlaying) {
                    changeSound = switchEar();
                }
                else {
                    let checkCuePlaying = setInterval(() => {
                        if(!isCuePlaying) {
                            changeSound = switchEar();
                            clearInterval(checkCuePlaying);
                        }
                    }, 100);

                    clearIntervals.push(checkCuePlaying);
                }
            }, 500);
        });

        clearIntervals.push(earSwapTimer);





        let playCue = function() {
            let runCue = function(repeat) {
                if(repeat) {
                    isCuePlaying = true;
                }
                let rightCue = randomSound(rightEarSounds);
                let leftCue = randomSound(leftEarSounds);

                let startTime = millis();
                let endTime = startTime + (reactionTime * 1000) + (max(rightCue.duration(), leftCue.duration()) * 1000);
                isCuePlaying = true;

                stopSounds.push(rightCue);
                stopSounds.push(leftCue);


                if(cueEar == enums.ear.RIGHT) {
                    if(rightEarReactSounds.includes(rightCue)) {
                        expectedInput = enums.input.MOUSE_R;
                        totalCues++;
                    }
                    else {
                        expectedInput = enums.input.NONE;
                    }
                }
                else if(cueEar == enums.ear.LEFT) {
                    if(leftEarReactSounds.includes(leftCue)) {
                        expectedInput = "e";
                        totalCues++;
                    }
                    else {
                        expectedInput = enums.input.NONE;
                    }
                }

                rightCue.play();
                leftCue.play();



                let cueTimerMaxValue = 60; // Change this variable to set maximum cueTimer value
                let increment = cueTimerMaxValue / ((reactionTime * 1000) + (max(rightCue.duration(), leftCue.duration()) * 1000)); // Increment per millisecond
                cueTimer = cueTimerMaxValue; // Start cueTimer at maximum value

                // Continuously update cueTimer based on elapsed time
                let cueTimerUpdater = setInterval(function() {
                    let elapsedTime = millis() - startTime;
                    let cueTimerValue = cueTimerMaxValue - Math.round(increment * elapsedTime); // Subtract from maximum value
                    cueTimer = Math.max(cueTimerValue, 0); // Cap cueTimer at 0


                    if(expectedInput != enums.input.NONE) {
                        if(expectedInput === currentInput) {
                            clearInterval(cueTimerUpdater);
                            hitCues++;
                            expectedInput = enums.input.NONE;
                            cueTimer = 0;
                        }
                    }



                    if(millis() >= endTime) {
                        clearInterval(cueTimerUpdater); // Stop the interval
                        cueTimer = 0;
                        if(expectedInput != enums.input.NONE) {
                            //missedCues++;
                        }
                    }
                }, 16);

                clearIntervals.push(cueTimerUpdater);

                let checkCueDone = setInterval(() => {
                    if(millis() >= endTime) {
                        expectedInput = enums.input.NONE;
                        if(repeat == 1) {
                            runCue(0);
                            clearInterval(checkCueDone);

                        }
                        else if(repeat == 0) {
                            isCuePlaying = false;
                            clearInterval(checkCueDone);
                        }
                    }
                }, 16);

                clearIntervals.push(checkCueDone);

            };

            runCue(1);
        };

        runInterval(cueInterval, () => playCue());

    }




    if(sqrt(pow(x - squareX, 2) + (pow(y - squareY, 2))) <= 40) {
        image(greenTarget, squareX, squareY, 50, 50);
    }
    else {
        image(target, squareX, squareY, 50, 50);
    }

    if(abs(barY - throtY) <= 40) {
        image(greenTarget, barX - 17, throtY, 50, 50);
    }
    else {
        image(target, barX - 17, throtY, 50, 50);
    }

    image(jet, x, y, 85, 37.5);
    image(jet, barX - 20, barY, 51, 22.5);

    fill('#e4ac00');
    textSize(35);
    text("Target: " + round(runningAvg), 10, 30);
    text("Throttle: " + round(throtRunningAvg), 10, 70);


    //dev info
    if(debugToggle) {
        textAlign(RIGHT);
        textSize(15);
        fill('#99CC00');
        stroke('#000000');
        //Play frames
        text(`Frame Count: ${playTimeFrames}`, windowWidth - 25, 25);

        //Current input
        text(`Current Input: ${currentInput}`, windowWidth - 25, 50);

        //Last input
        text(`Expected Input: ${expectedInput}`, windowWidth - 25, 75);

        //cue ear
        if(cueEar == enums.ear.RIGHT) {
            text(`Cue ear: RIGHT`, windowWidth - 25, 100);
        }
        else {
            text(`Cue ear: LEFT`, windowWidth - 25, 100);
        }

        //Cues
        if(audioCues) {
            text(`Total Cues: ${totalCues}`, windowWidth - 25, 125);
            text(`Hit Cues: ${hitCues}`, windowWidth - 25, 150);
            text(`Missed Cues: ${missedCues}`, windowWidth - 25, 175);
            text(`Reaction Timer: ${cueTimer}`, windowWidth - 25, 200);
            text(`Cue Playing: ${isCuePlaying}`, windowWidth - 25, 225);
        }

        if(doEmergency) {
            text(`Emergency: ${isEmergency}`, windowWidth - 25, 125);
            text(`Successes: ${emergencySuccess}`, windowWidth - 25, 150);
            text(`Failures: ${emergencyFailure}`, windowWidth - 25, 175);
        }

        fill('#e4ac00');
        textAlign(LEFT);
    }

    textSize(25);
    text("Press Backspace to return", windowWidth - 370, windowHeight - 10);
    text(timer, windowWidth / 2, 30);

    if(isEmergency == enums.TRUE) {
        fill('#FF0000');
        stroke("#000000");
        text(emergencyTimer, windowWidth / 2, 60);
        stroke('#013993');
        fill('#e4ac00');
    }


    if(keyIsDown(87)) {
        throtY -= 5;
    }

    if(keyIsDown(83)) {
        throtY += 5;
    }

    squareY = squareY + (-movedY);
    squareX = squareX + (movedX);

    if(y < 150) {
        ax = random(-10, 10);
        ay = random(1, 10);

        vx = vx + ax;

        vy = abs(vy + ay);

    }
    if(y > windowHeight - 100) {
        ax = random(-10, 10);
        ay = random(-10, -1);

        vx = vx + ax;

        vy = -1 * abs(vy + ay);

    }
    if(x < 150) {
        ax = random(1, 10);
        ay = random(-10, 10);

        vx = abs(vx + ax);

        vy = vy + ay;

    }
    if(x > windowWidth - 100) {
        ax = random(-10, -1);
        ay = random(-10, 10);

        vx = -1 * abs(vx + ax);

        vy = vy + ay;

    }

    if(barY > windowHeight - 165) {
        aThrottle = random(-5, -1);
        vThrottle = vThrottle + aThrottle;
        vThrottle = -1 * abs(vThrottle);
    }

    if(barY < 100) {
        aThrottle = random(1, 5);
        vThrottle = vThrottle + aThrottle;
        vThrottle = abs(vThrottle);
    }

    if(throtY >= windowHeight - 150) {
        throtY = windowHeight - 150;
    }
    else if(throtY <= 110) {
        throtY = 110;
    }
    if(vThrottle < -vThrottleMax) {
        vThrottle = -vThrottleMax;
    }
    if(vThrottle > vThrottleMax) {
        vThrottle = vThrottleMax;
    }

    if(vx < -vThrottleMax) {
        vx = -vThrottleMax;
    }
    if(vx > vThrottleMax) {
        vx = vThrottleMax;
    }
    if(vy < -vThrottleMax) {
        vy = -vThrottleMax;
    }
    if(vy > vThrottleMax) {
        vy = vThrottleMax;
    }

    x = x + vx * vMul;
    y = y + vy * vMul;
    barY = barY + vThrottle * throttleMul;

    if(playTimeFrames % 40 == 0) {
        ax = random(-10, 10);
        ay = random(-10, 10);
        aThrottle = random(-5, 5);

        vx = vx + ax;
        vy = vy + ay;
        vThrottle = vThrottle + aThrottle;
    }

    if(playTimeFrames % 60 == 0) {
        timer--;
        if(floor(random(0, 3) == 1)) {
            vx = -vx;
        }

        if(floor(random(0, 3) == 1)) {
            vy = -vy;
        }
        if(floor(random(0, 2) == 1)) {
            vThrottle = -vThrottle;
        }

    }

    if(playTimeFrames % 30 == 0) {
        curDist = round(dist(x, y, squareX, squareY));
        throtCurDist = abs(barY - throtY);

        samples = samples + 1;
        runningTotal = runningTotal + curDist;
        throtRunningTotal = throtRunningTotal + throtCurDist;

        runningAvg = runningTotal / samples;
        throtRunningAvg = throtRunningTotal / samples;

    }
}
