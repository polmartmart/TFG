let nSteps = 32;
let nTracks = 8;
let kit;
let cellWidth = 35;
let origen = 200;
let beats = 0;
let pattern = [];
let currentStep = 0;
let playButton, bpmButton, recordButton;
let selectKick, selectSnare;
let index;
let routes = [];
//index per defecte que es carreguen a la sampler
let indexKick = 0, indexSnare = 5, indexHh = 10, indexOhh = 15, indexClap = 20,
indexPerc = 25, indexStab = 30, indexVocal = 35;
let sampleType;
//carreguem rutes dels samples al buffer
let drumNames = ["kick", "snare", "hh", "ohh", "clap", "perc", "stab", "vocal"];
let samplePath = ["samples/kicks/kick", 
                  "samples/snares/snare", 
                  "samples/hats/hat", 
                  "samples/openhats/ohh",
                  "samples/claps/clap",
                  "samples/percs/perc",
                  "samples/stabs/stab",
                  "samples/vocalshots/vocal"];
              
let buffer = [];

let patterns = [
  ['10001000100010001000100010001000',
    '0000000000000000000000000000000',
    '00100010001000100010001000100010',
    '00000000000000000000000000000000',
    '00001000000010000000100000001000',  
    '00100100000000000100000000100000',
    '00000100000001000000010000000100',
    '00010000001000000001000000100000'], 

  ['1000001010000000', 
    '0000100000001000', 
    '0010001000100010', 
    '0000000000000000']
];

let wetMix, delay;
let myKnob;
let sel;
//----------------- Declaracio de classes ---------------------//
class Dropdown {
  constructor(sampleType, x ,y){
    this.sampleType = sampleType;
    this.x = x;
    this.y = y;
    this.sel = createSelect();
  }

  create() {
    this.sel.position(this.x, this.y);

    for (i = 1; i < 6; i++) {
      this.sel.option(`${this.sampleType}${i}`);
    }

    this.sel.changed(() => this.changeSample(this.sampleType, this.sel.value()));
  }

//per rao desconeguda hem d'enviar com a paràmetre d'aquesta funció sampleType i value quan ja son variables globals dins de la classe
//sinó ho fem així, changeSample ens les agafa com a undefined, quan realment si que ho estan.
// s'ha de fer amb aquesta sintaxi  this.sel.changed(() => this.changeSample(this.sampleType, this.sel.value()));
// si ho fem sense () => tindrem un error perque per defecte la funcio changesample retornarà undefined i afectara al funcionament

changeSample(sampleType, value) {
    let bufferIndex;  
    let auxKick, auxSnare, auxHh;
    let index = value.match(/(\d+)/);
  
  // ha d'haver una variable auxiliar que guardi l'anterior index 
  // però si el sample no ha canviat haurem de cridar changePlayers amb els altres x defecte igualment
    if (sampleType === 'kick') {
      bufferIndex = Number((index[0]-1));
      changePlayers(bufferIndex);
    }

    else if (sampleType === 'snare') {
      bufferIndex = Number((index[0]-1)+5);
      changePlayers(bufferIndex);
    }

    else if (sampleType == 'hh') {
      bufferIndex = Number((index[0]-1)+10);
      changePlayers(bufferIndex);
    }

    else if (sampleType == 'ohh') {
      bufferIndex = Number((index[0]-1)+15);
      changePlayers(bufferIndex);
    }

    else if (sampleType == 'clap') {
      bufferIndex = Number((index[0]-1)+20);
      changePlayers(bufferIndex);
    }

    else if (sampleType == 'perc') {
      bufferIndex = Number((index[0]-1)+25);
      changePlayers(bufferIndex);
    }

    else if (sampleType == 'stab') {
      bufferIndex = Number((index[0]-1)+30);
      changePlayers(bufferIndex);
    }

    else if (sampleType == 'vocal') {
      bufferIndex = Number((index[0]-1)+35);
      changePlayers(bufferIndex);
    }
  }
}

//----------------- Declaracio de funcions ---------------------//
function loadBuffers() {
  for (i = 0; i < samplePath.length; i++) {
    for (j = 1; j < 6; j++) {
      routes.push(`${samplePath[i]}${j}.wav`);
    }
  }

  for (i = 0; i < routes.length; i++) {
    buffer[i] = new Tone.Buffer(routes[i]);
  }
}

function changePlayers(ind){
  console.log(`sample canviat a kick${indexKick}`); 
  if (0 <= ind && ind < 5) {
    indexKick = ind;
  }
  else if (5 <= ind && ind < 10) {
    indexSnare = ind;
  }
  else if (10 <= ind && ind < 15) {
    indexHh = ind;
  }
  else if (15 <= ind && ind < 20) {
    indexOhh = ind;
  }
  else if (20 <= ind && ind < 25) {
    indexClap = ind;
  }
  else if (25 <= ind && ind < 30) {
    indexPerc = ind; 
  }
  else if (30 <= ind && ind < 35) {
    indexStab = ind;
  }
  else if (35 <= ind && ind < 40) {
    indexVocal = ind;
  }

  kit = new Tone.Players(
    {"kick" : buffer[indexKick],
      "snare" : buffer[indexSnare],
      "hh" : buffer[indexHh],
      "ohh" : buffer[indexOhh], 
      "clap" : buffer[indexClap],
      "perc" : buffer[indexPerc],
      "stab" : buffer[indexStab],
      "vocal" : buffer[indexVocal]
    }).toDestination();

    kit.player('kick').connect(delay);

}

//sense el time hi ha un delay entre reproduccions i la seqüencia no sona bé
//el callback no està perfectament quantitzat però cada cop que s'executa anticipa el següent ritme ben quantitzat
// time representa el temps en el que el reproductor ha de reproduir
function onBeat(time){
	for(let track=0; track<nTracks; track++){
  	if(pattern[track][currentStep] === 1){
      //drumNames[track] retorna el nom dels samples que estan sonant en cada step
      kit.player(drumNames[track]).start(time);
      // drum.connect(Tone.Destination);
      // console.log(drum);
      
      // drum.stop(time);
    }
  }
  beats++;
  currentStep = (beats) % nSteps;
}

function setDefaultBPM() {
  Tone.Transport.bpm.value = 120;
}

function showIndex({indexKick = 0, indexSnare = 5, indexHh = 10, indexOhh = 15} = {}){
  console.log(`index kick a canviat a ${indexKick}`); 
  console.log(`index snare a canviat a ${indexSnare}`); 
  console.log(`index Hh a canviat a ${indexHh}`); 
  console.log(`index Oh a canviat a ${indexOhh}`); 
}

function createSelects() {
  let kickSelect = new Dropdown('kick', 100, 205);
  kickSelect.create();

  let snareSelect = new Dropdown('snare', 100, 245);
  snareSelect.create();

  let hhSelect = new Dropdown('hh', 100, 275);
  hhSelect.create();

  let ohhSelect = new Dropdown('ohh', 100, 315);
  ohhSelect.create();

  let clapSelect = new Dropdown('clap', 100, 345);
  clapSelect.create();

  let percSelect = new Dropdown('perc', 100, 385);
  percSelect.create();

  let stabSelect = new Dropdown('stab', 100, 420);
  stabSelect.create();

  let vocalSelect = new Dropdown('vocal', 100, 455);
  vocalSelect.create();
}

function createInputs() {
  input = createInput();
  input.position(origen+cellWidth+3, cellWidth*nTracks+origen+1);
}

function createButtons () {
  bpmButton = createButton('BPM');
  bpmButton.position(origen, cellWidth*nTracks+origen+1);
  bpmButton.mouseClicked(changeBpm);

  playButton = createButton('Play');
  playButton.position(1000, 100);
  playButton.mouseClicked(togglePlay);

  // recordButton = createButton('Record');
}

function loadPattern() {
  for(let track=0; track<nTracks; track++){
    pattern[track] = [];
    for(let step=0; step<nSteps; step++){
      //sino cridem a Number() '1' === 1 ens ho agafa com a fals
      pattern[track][step] = Number(patterns[0][track][step]);
    }
  }
}

function loadDefaultPattern() {
  for(let track=0; track<nTracks; track++){
  	pattern[track] = [];
    for(let step=0; step<nSteps; step++){
    	pattern[track][step] = 0;
    }
  }  
}

function drawPattern() {
    // aquest bucle omple d'un color en concret cada casella del pattern que hem seleccionat
  for(let track=0; track<nTracks; track++){
  	for(let step=0; step<nSteps; step++){
  		if(pattern[track][step] == 1){
        fill(255 - track*30);
        rect(step*cellWidth+cellWidth/6 + origen, track*cellWidth + cellWidth/6 + origen, cellWidth*2/3, cellWidth*2/3, 3); 
      }
  	}
  }
}

function drawGrid() {
  //vertical lines
  for(let i=0; i<nSteps+1; i++) {
  	line(i*cellWidth+origen, origen, i*cellWidth +origen,cellWidth*8+origen);
  }
  
  //horizontal lines
  for(let j=0; j<nTracks+1; j++) {
  	line(origen,j*cellWidth+origen,cellWidth*32+origen,j*cellWidth +origen);
  }
}

function drawHighlight() {
  highlight = (beats-1) % nSteps;
	fill(200, 60);
	noStroke();
  console.log(highlight);
  if (highlight !== -1) {
    rect(highlight*cellWidth + origen, origen, cellWidth, cellWidth*8); 
  }
}

//----------------- Fi declaracio de funcions ---------------------//

//----------------- Declaració de funcions de p5.js ---------------------//

function setup(){
  cnv = createCanvas(window.innerWidth,window.innerHeight);
  // document.body.innerHTML += "<input></input>";
  background("#249da3");

  loadBuffers();
  
  kit = new Tone.Players(
    {"kick" : buffer[indexKick],
      "snare" : buffer[indexSnare],
      "hh" : buffer[indexHh],
      "ohh" : buffer[indexOhh],
      "clap" : buffer[indexClap],
      "perc" : buffer[indexPerc],
      "stab" : buffer[indexStab],
      "vocal" : buffer[indexVocal]
    }).toDestination();
  Tone.Transport.scheduleRepeat(onBeat, "16n");	

  setDefaultBPM();
  loadPattern();

  createInputs();
  createButtons();
  createSelects();

  delay = new Tone.FeedbackDelay(0.37, 0.2).toDestination();

  kit.player('kick').connect(delay);

  wetMix = createSlider(0, 1, 1, 0);
  wetMix.position(1350, 200);
  cnv.mousePressed(canvasPressed);
}

function draw(){
  delay.wet.value = wetMix.value();
	background("#249da3");
  stroke(255);
  drawPattern();
  drawGrid();
  drawHighlight();
  text(int(wetMix.value() * 100) + "% effected sound", 20, 40);
  fill(0, 102, 153);

}


function canvasPressed(){
    /* cellwitdh es una letiable que s'ajusta a la nostra pantalla.
    Les mides de la pantalla canvien pero la relació entre posició del mouse mouseX o mouseY i cellwitdh sempre es la mateixa
    */
    // getAudioContext().resume();
  Tone.start();

  if (mouseY > origen &&  mouseX > origen && mouseX < (origen+cellWidth*32) && mouseY < (origen+cellWidth*8)) {
    let row = floor((mouseY-origen)/cellWidth);
    let index = floor((mouseX-origen)/cellWidth);

    pattern[row][index] = +!pattern[row][index];
  }

	return false;
}

function togglePlay() {
	if(Tone.Transport.state === "started"){
  	Tone.Transport.stop();
    playButton.html('Play');
    // recorder.stop(); // stop recorder, and send the result to soundFile
    // saveSound(soundFile, 'mySound.wav'); // save file
  } else {
  	Tone.Transport.start();
    playButton.html('Stop');
    // if(mic.enabled && !recorder.recording){
    //   recorder.record(soundFile);
    // }
  }
}

function changeBpm(){
  let bpm = input.value();
  Tone.Transport.bpm.value = bpm;
}


document.documentElement.addEventListener(
  "mousedown", function(){
    mouse_IsDown = true;
    if (Tone.context.state !== 'running') {
      Tone.start();
    }})