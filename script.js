/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */
const clueHoldTime = 500;
const cluePauseTime = 500;
const nextClueWaitTime = 1000;
const AudioContext = window.AudioContext || window.webkitAudioContext;

//Global variables
var pattern = Array(8);
for (var i =0; i < 8; i++){
  pattern[i] = Math.floor(Math.random()*5 +1);
}
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var mistakes = 0;

function startGame() {
  //initialize game varibales
  progress = 0;
  gamePlaying = true;

  //sawp the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence()
}

function stopGame() {
  //update game varibales
  gamePlaying = false;

  //sawp the Start and Stop buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

//sound synthesis

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);
const freqMap = {
  1: 200,
  2: 300,
  3: 400,
  4: 700,
  5: 800
};

function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  tonePlaying = true;
  setTimeout(function() {
    stopTone();
  }, len);
}

function startTone(btn) {
  if (!tonePlaying) {
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.025, 0.025);
  tonePlaying = false;
}


function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}
function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  
  if (btn == pattern[guessCounter]){
    if (guessCounter == progress){
      if (progress == pattern.length -1){
        winGame();
      }
      else{
        progress++
        playClueSequence()
        
      }
    }
    else{
      guessCounter++;
    }
  }
  else{
    mistakes++;
    if (mistakes > 3){
      loseGame();
    }
    else{
      playClueSequence()
    }
  }
}

function winGame(){
  stopGame();
  alert("Game Over. You won!");
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost");
}