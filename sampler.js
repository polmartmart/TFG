let nSteps = 32;
let nTracks = 8;
let kit;
let cellWidth = 35;
let origen = 200;
let beats = 0;
let pattern = [];
let currentStep = 0;
let playButton, bpmButton, recordButton, downloadJSONButton, cleanPatternButton;
let track1FxButton, track2FxButton, track3FxButton, track4FxButton, track5FxButton, track6FxButton, track7FxButton, track8FxButton;
let track1MuteButton, track2MuteButton, track3MuteButton, track4MuteButton, track5MuteButton, track6MuteButton, track7MuteButton, track8MuteButton;
let inputSoundFile, fileUploaded, uploadedFiles = 0, inputPatternFile;
let track1Select, track2Select, track3Select, track4Select, track5Select, track6Select, track7Select, track8Select, trackSelect;
let trackSelected = false, trackSelectedName;
let userSampleTrack = [{},{},{},{},{},{},{},{}];
let pitchPlayer, pitchTrack = 7;
let index;
let routes = [];
let div1, div2;
let indexKick = 0, indexSnare = 5, indexHh = 10, indexOhh = 15, indexClap = 20,
indexPerc = 25, indexStab = 30, indexVocal = 35;
let sampleType;
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
 
let defaultPattern = ['100010001000100010001000100010000',
                      '00000000000000000000000000000000',
                      '00100010001000100010001000100010',
                      '00000000000000000000000000000000',
                      '00001000000010000000100000001000',  
                      '00100100000000000100000000100000',
                      '00000100000001000000010000000100',
                      '00010000001000000001000000100000'];

let pitchValues = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

let userpattern = [];
let logoImatge;
//efectes
let recorder, stopRecordButton, timeRecording = 60000;
let micRecorder, micRecordButton, initialized = false;
let knobsDrawing;
let effectsTrack1, effectsTrack2, effectsTrack3, effectsTrack4, effectsTrack5, effectsTrack6, effectsTrack7, effectsTrack8;
let knobsTrack1, knobsTrack2, knobsTrack3, knobsTrack4, knobsTrack5, knobsTrack6, knobsTrack7, knobsTrack8;

//----------------- Declaracio de classes ---------------------//
class Dropdown {
  constructor(sampleType, x ,y, track, id){
    this.sampleType = sampleType;
    this.x = x;
    this.y = y;
    this.track = track;
    this.sel = createSelect();
    this.sel.ide = id;    
    this.sel.changed(() => this.changeSample());
  }

  create() {
    this.sel.position(this.x, this.y);
    this.sel.style("width", "90px");

    for (i = 1; i < 6; i++) {
      this.sel.option(`${this.sampleType}${i}`);
    }

    this.sel.id(this.sel.ide);
  }

  setOption(sampleName) {
    this.sel.option(sampleName);
  }

  selectOption(index) {
    document.getElementById(this.sel.ide).selectedIndex = String(index);
    this.changeSample(this.sampleType, this.sel.value(), this.track);
  }

  getIndexItemSelected() {
    return document.getElementById(this.sel.ide).selectedIndex;
  }

  changeSample() {
    let bufferIndex;  
    let index = this.sel.value().match(/(\d+)/); //index representa el index del sample de l'usuari usersample1, 2, 3...
    let isUserSample = this.sel.value().match('usersample');
    let associated = false;

    if (isUserSample != null) {

      // userSampleTrack = [{index del sample de l'usuari : index del buffer},{},{},{},{},{},{},{}]; cada posicio de la array representa un track-1
      for (i = 0; i < 9 && associated === false; i++) {
        if ((index in Object(userSampleTrack[i])) === true) {

          //agafem aquell buffer ja associat per reproduir-lo
          bufferIndex = userSampleTrack[i][index];

          //asssociem el buffer associat al sample al track actual per
          userSampleTrack[this.track-1][index] = bufferIndex;

          //parem la cerca
          associated = true;
        }
      }

      /* sino hi ha cap associat significa que haurem de reproduir-ne l'ultim del buffer que es l´ultim que hem afegit
      i també associar-lo a la array per facilitar la feina després */
      if (associated === false) {
        bufferIndex = buffer.length-1;
        userSampleTrack[this.track-1][index] = bufferIndex;
      }

      changePlayers(bufferIndex, this.track);
    }

    else if (this.sampleType === 'kick') {
      bufferIndex = Number((index[0]-1));
      changePlayers(bufferIndex, 1);
    }

    else if (this.sampleType === 'snare') {
      bufferIndex = Number((index[0]-1)+5);
      changePlayers(bufferIndex, 2);
    }

    else if (this.sampleType === 'hh') {
      bufferIndex = Number((index[0]-1)+10);
      changePlayers(bufferIndex, 3);
    }

    else if (this.sampleType === 'ohh') {
      bufferIndex = Number((index[0]-1)+15);
      changePlayers(bufferIndex, 4);
    }

    else if (this.sampleType === 'clap') {
      bufferIndex = Number((index[0]-1)+20);
      changePlayers(bufferIndex, 5);
    }

    else if (this.sampleType === 'perc') {
      bufferIndex = Number((index[0]-1)+25);
      changePlayers(bufferIndex, 6);
    }

    else if (this.sampleType === 'stab') {
      bufferIndex = Number((index[0]-1)+30);
      changePlayers(bufferIndex, 7);
    }

    else if (this.sampleType === 'vocal') {
      bufferIndex = Number((index[0]-1)+35);
      changePlayers(bufferIndex, 8);
    }
  }
}

class Switch {

  constructor(state) {
    this.state = state;
  }

  getState() {
    return this.state;
  }

  switchState() {
    this.state = !this.state;
  }
}

class MuteButton {

  constructor(x, y, player) {
    this.x = x;
    this.y = y;
    this.player = player;
    this.button = createButton('Mute');
    this.muted = new Switch(false);
    this.button.mousePressed(() => this.mute());
  }
  
  create() {  
    this.button.position(this.x, this.y);
    this.getState(this.muted);
  }

  mute() {
    if (this.muted.getState() === false) {
      kit.player(this.player).mute = true;
      this.muted.switchState();
      this.button.html('Muted');
    }
    else {
      kit.player(this.player).mute = false;
      this.muted.switchState();
      this.button.html('Mute');
    }
  }

  keepMute() {
    kit.player(this.player).mute = true;
  }

  getState() {
    return this.muted.getState();
  }
}

class Effects {

  constructor(player) {
    this.player = player;
    this.delay = new Tone.FeedbackDelay("3n", 0.2);
    this.reverb = new Tone.Reverb(2);
    this.vol = new Tone.Volume(0);
    this.hpfilter = new Tone.Filter(20, "highpass");
    this.lpfilter = new Tone.Filter(20000, "lowpass");
    this.pitchShifter = new Tone.PitchShift(0);
  }

  setValues(value1, value2, value3, value4, value5, value6) {
    this.delay.wet.value = value1*0.1;
    this.delay.delayTime.value = value2;
    this.vol.volume.value = value3;
    this.hpfilter.frequency.value = value4;
    this.lpfilter.frequency.value = value5;
    this.reverb.wet.value= value6*0.1;
  }

  changePitch(semitone) {
    this.pitchShifter.pitch = semitone;
  }

  chain(record) {
    if (record === null) {
      kit.player(this.player).chain(this.pitchShifter, this.vol, this.hpfilter, this.lpfilter, this.delay, this.reverb, Tone.Destination);
    }

    else if (record != null){
      kit.player(this.player).chain(this.pitchShifter, this.vol, this.hpfilter, this.lpfilter,  this.delay, this.reverb, Tone.Destination, recorder);
    }
  }

}

class Knobs {

  constructor(color) {
    this.delayKnob = new MakeKnobC(color, 50, 900, 530, 0, 10, 0, 0,"Feedback Time", [0,200,200], 12);
    this.delayTimeKnob = new MakeKnobC(color, 50, 1000, 530, 0, 1, 0, 0,"Delay Time", [0,200,200], 12);
    this.reverbKnob = new MakeKnobC(color, 50, 1100, 530, 0, 10, 0, 0,"Reverb", [0,200,200], 12);
    this.volumeKnob = new MakeKnobC(color, 50, 800, 530, -12, 0, 0, 0,"Volume", [0,200,200], 12);
    this.hpfilterKnob = new MakeKnobC(color, 50, 1200, 530, 0, 10000, 0, 0,"HPF", [0,200,200], 12);
    this.lpfilterKnob = new MakeKnobC(color, 50, 1300, 530, 20000, 20, 20000, 0,"LPF", [0,200,200], 12);
  }

  update() {
    this.volumeKnob.update();
    this.delayKnob.update();
    this.delayTimeKnob.update();
    this.reverbKnob.update();
    this.hpfilterKnob.update();
    this.lpfilterKnob.update();
  }

  getValue(effectKnob) {
    return eval(`this.${effectKnob}.knobValue`);
  }

  active() {
    this.volumeKnob.active();
    this.delayKnob.active();
    this.delayTimeKnob.active();
    this.reverbKnob.active();
    this.hpfilterKnob.active();
    this.lpfilterKnob.active();
  }

  inactive() {
    this.volumeKnob.inactive();
    this.delayKnob.inactive();
    this.delayTimeKnob.inactive();
    this.reverbKnob.inactive();
    this.hpfilterKnob.inactive();
    this.lpfilterKnob.inactive();
  }

}

class KnobsDrawing {

  setKnobsDrawing(track) {
    this.knobs = `knobsTrack${track}.update();`;
  }

  getKnobsDrawing() {
    return eval(this.knobs);
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

function changePlayers(ind, track){
  if (track === 1) {
    indexKick = ind;
  }
  else if (track === 2) {
    indexSnare = ind;
  }
  else if (track === 3) {
    indexHh = ind;
  }
  else if (track === 4) {
    indexOhh = ind;
  }
  else if (track === 5) {
    indexClap = ind;
  }
  else if (track === 6) {
    indexPerc = ind; 
  }
  else if (track === 7) {
    indexStab = ind;
  }
  else if (track === 8) {
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
  });

  unmuteTrackWhenPlayerChanged(track);

  makeChain(null);
}

function unmuteTrackWhenPlayerChanged(track) {
  if (eval(`track${track}MuteButton`).getState() === true) {
    eval(`track${track}MuteButton`).mute();
  }
  for (i = 1; i < 9; i++) { 
    if (eval(`track${i}MuteButton`).getState() === true && i != track) {
      eval(`track${i}MuteButton`).keepMute();
    }
  }
}

//sense el time hi ha un delay entre reproduccions i la seqüencia no sona bé
//el callback no està perfectament quantitzat però cada cop que s'executa anticipa el següent ritme ben quantitzat
// time representa el temps en el que el reproductor ha de reproduir
function onStep(time){
	for(let track=0; track<nTracks; track++){
  	if(pattern[track][currentStep] === 1){
        eval(`effectsTrack${pitchTrack}`).changePitch(pitchValues[track][currentStep]);
        kit.player(drumNames[track]).start(time); 
    }
  }
  beats++;
  currentStep = (beats) % nSteps;
}

function setDefaultBPM() {
  Tone.Transport.bpm.value = 110;
}

function createSelects() {
  track1Select = new Dropdown('kick', 95, 205, 1, "selectTrack1");
  track1Select.create();

  track2Select = new Dropdown('snare', 95, 240, 2, "selectTrack2");
  track2Select.create();

  track3Select = new Dropdown('hh', 95, 275, 3, "selectTrack3");
  track3Select.create();

  track4Select = new Dropdown('ohh', 95, 310, 4, "selectTrack4");
  track4Select.create();

  track5Select = new Dropdown('clap', 95, 345, 5, "selectTrack5");
  track5Select.create();

  track6Select = new Dropdown('perc', 95, 380, 6, "selectTrack6");
  track6Select.create();

  track7Select = new Dropdown('stab', 95, 415, 7, "selectTrack7");
  track7Select.create();

  track8Select = new Dropdown('vocal', 95, 450, 8, "selectTrack8");
  track8Select.create();

  trackSelect = createSelect();
  trackSelect.position(150, 680);
  for (i = 1; i < 9; i++) {
    trackSelect.option(`track${i}`);
  }

  trackSelect.changed(() => addFileNameToATrack(trackSelect.value()));
}

function addFileNameToATrack(value) {
  let index = value.match(/(\d+)/);
  trackSelected = true;
  trackSelectedName = value;
  if (Number(index[0]) === 1) {
    track1Select.setOption(`usersample${uploadedFiles}`);
  }

  else if (Number(index[0]) === 2) {
    track2Select.setOption(`usersample${uploadedFiles}`);
  }

  else if (Number(index[0]) === 3) {
    track3Select.setOption(`usersample${uploadedFiles}`);
  }

  else if (Number(index[0]) === 4) {
    track4Select.setOption(`usersample${uploadedFiles}`);
  }

  else if (Number(index[0]) === 5) {
    track5Select.setOption(`usersample${uploadedFiles}`);
  }

  else if (Number(index[0]) === 6) {
    track6Select.setOption(`usersample${uploadedFiles}`);
  }

  else if (Number(index[0]) === 7) {
    track7Select.setOption(`usersample${uploadedFiles}`);
  }

  else if (Number(index[0]) === 8) {
    track8Select.setOption(`usersample${uploadedFiles}`);
  }
}

function createInputs() {
  input = createInput();
  input.position(origen+cellWidth*2 + 23, cellWidth*nTracks+origen+2);
}

function createButtons () {
  bpmButton = createButton('Change BPM');
  bpmButton.position(origen, cellWidth*nTracks+origen+2);
  bpmButton.mouseClicked(changeBpm);

  playButton = createButton('Play');
  playButton.position(150, 540);
  playButton.mouseClicked(togglePlay);

  recordButton = createButton('Record').mousePressed(recordSequence);
  recordButton.position(200, 540);

  micRecordButton = createButton('Micro Recorder').mousePressed(recordFromMic);
  micRecordButton.position(300, 680);

  //boto per obrir els efectes de cada track per separat
  knobsDrawing = new KnobsDrawing();
  track1FxButton = createButton('FX').mousePressed(()  =>   knobsDrawing.setKnobsDrawing(1));
  track1FxButton.position(1390, 205);

  track2FxButton = createButton('FX').mousePressed(()  =>  knobsDrawing.setKnobsDrawing(2));
  track2FxButton.position(1390, 240);

  track3FxButton = createButton('FX').mousePressed(()  =>  knobsDrawing.setKnobsDrawing(3));
  track3FxButton.position(1390, 275);
  
  track4FxButton = createButton('FX').mousePressed(()  =>  knobsDrawing.setKnobsDrawing(4));
  track4FxButton.position(1390, 310);

  track5FxButton = createButton('FX').mousePressed(()  =>  knobsDrawing.setKnobsDrawing(5));
  track5FxButton.position(1390, 345);

  track6FxButton = createButton('FX').mousePressed(()  =>  knobsDrawing.setKnobsDrawing(6));
  track6FxButton.position(1390, 380);

  track7FxButton = createButton('FX').mousePressed(()  =>  knobsDrawing.setKnobsDrawing(7));
  track7FxButton.position(1390, 415);

  track8FxButton = createButton('FX').mousePressed(()  =>  knobsDrawing.setKnobsDrawing(8));
  track8FxButton.position(1390, 450);

  downloadJSONButton = createButton('Save Pattern').mousePressed(downloadJSON);
  downloadJSONButton.position(900, 600);

  cleanPatternButton = createButton('Clean Pattern').mousePressed(cleanPattern);
  cleanPatternButton.position(1000, 600);

  //Botons per mutejar les pistes
  track1MuteButton = new MuteButton(1330, 205, 'kick');
  track1MuteButton.create();

  track2MuteButton = new MuteButton(1330, 240, 'snare');
  track2MuteButton.create();

  track3MuteButton = new MuteButton(1330, 275, 'hh');
  track3MuteButton.create();

  track4MuteButton = new MuteButton(1330, 310, 'ohh');
  track4MuteButton.create();

  track5MuteButton = new MuteButton(1330, 345, 'clap');
  track5MuteButton.create();

  track6MuteButton = new MuteButton(1330, 380, 'perc');
  track6MuteButton.create();

  track7MuteButton = new MuteButton(1330, 415, 'stab');
  track7MuteButton.create();

  track8MuteButton = new MuteButton(1330, 450, 'vocal');
  track8MuteButton.create();

  pitchTrack1 = createButton('PITCH').mousePressed(() => {pitchPlayer = "kick", pitchTrack = 1});
  pitchTrack1.position(30, 205);

  pitchTrack2 = createButton('PITCH').mousePressed(() => {pitchPlayer = "snare", pitchTrack = 2});
  pitchTrack2.position(30, 240);

  pitchTrack3 = createButton('PITCH').mousePressed(() => {pitchPlayer = "hh", pitchTrack = 3});
  pitchTrack3.position(30, 275);

  pitchTrack4 = createButton('PITCH').mousePressed(() =>  {pitchPlayer = "ohh", pitchTrack = 4});
  pitchTrack4.position(30, 310);

  pitchTrack5 = createButton('PITCH').mousePressed(() => {pitchPlayer = "clap", pitchTrack = 5});
  pitchTrack5.position(30, 345);

  pitchTrack6 = createButton('PITCH').mousePressed( () => {pitchPlayer = "perc", pitchTrack = 6});
  pitchTrack6.position(30, 380);

  pitchTrack7 = createButton('PITCH').mousePressed(() =>  {pitchPlayer = "stab", pitchTrack = 7});
  pitchTrack7.position(30, 415);

  pitchTrack8 = createButton('PITCH').mousePressed(() =>  {pitchPlayer = "vocal", pitchTrack = 8});
  pitchTrack8.position(30, 450);
}

function cleanPattern() {
  for (i = 0; i < nTracks; i++) {
    for (j = 0; j < nSteps; j++) {
      pattern[i][j] = 0;
    }
  }
}


function loadPattern(userpattern) {
  for(let track=0; track<nTracks; track++){
    pattern[track] = [];
    for(let step=0; step<nSteps; step++){
      if (userpattern === null) {
        pattern[track][step] = Number(defaultPattern[track][step]);
      }

      else {
        pattern[track][step] = Number(userpattern[track][step]);
      }
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
  for(let track=0; track<nTracks; track++){
  	for(let step=0; step<nSteps; step++){
  		if(pattern[track][step] === 1){
        fill(255 - track*30);
        rect(step*cellWidth+cellWidth/6 + origen, track*cellWidth + cellWidth/6 + origen, cellWidth*2/3, cellWidth*2/3, 2); 
      }
  	}
  }
}

function drawGrid() { 
  //horizontal lines
  for(let j=0; j<nTracks+1; j++) {
      stroke(200);
      strokeWeight(3);
  	  line(origen,j*cellWidth+origen,cellWidth*32+origen,j*cellWidth +origen);
  }

  //vertical lines
  for(let i=0; i<nSteps+1; i++) {
    if (i % 4 === 0 && i != 0 && i != 32) {
      stroke(50);
      strokeWeight(4);
  	  line(i*cellWidth+origen, origen, i*cellWidth +origen,cellWidth*8+origen);
    }
    else {
      stroke(200);
      strokeWeight(3);
      line(i*cellWidth+origen, origen, i*cellWidth +origen,cellWidth*8+origen);
    }
  }
}


function drawHighlight() {
  highlight = (beats-1) % nSteps;
	fill(200, 60);
	noStroke();
  if (highlight !== -1) {
    rect(highlight*cellWidth + origen, origen, cellWidth, cellWidth*8); 
  }
}

function makeKnobs() {
  // creacio dels knobs
  knobsTrack1 = new Knobs("#249da3");
  knobsTrack2 = new Knobs("#FF0000");
  knobsTrack3 = new Knobs("#7BAE9F");
  knobsTrack4 = new Knobs("#7B42E3");
  knobsTrack5 = new Knobs("#0642E3");
  knobsTrack6 = new Knobs("#064218");
  knobsTrack7 = new Knobs("#FFF100");
  knobsTrack8 = new Knobs("#FFA9EF");
}


function createEffects() {
  // creació dels efectes
  effectsTrack1 = new Effects('kick');
  effectsTrack2 = new Effects('snare');
  effectsTrack3 = new Effects('hh');
  effectsTrack4 = new Effects('ohh');
  effectsTrack5 = new Effects('clap');
  effectsTrack6 = new Effects('perc');
  effectsTrack7 = new Effects('stab');
  effectsTrack8 = new Effects('vocal');

  makeChain(null);
}

function makeChain(record) {
  effectsTrack1.chain(record);
  effectsTrack2.chain(record);
  effectsTrack3.chain(record);
  effectsTrack4.chain(record);
  effectsTrack5.chain(record);
  effectsTrack6.chain(record);
  effectsTrack7.chain(record);
  effectsTrack8.chain(record);
}

function dataUrlToBlob(dataURI, dataTYPE) {
  var binary = atob(dataURI.split(',')[1]), array = [];
  for(var i = 0; i < binary.length; i++) array.push(binary.charCodeAt(i));
  return new Blob([new Uint8Array(array)], {type: dataTYPE});
}

function handleAudioFile(file) {
  if (file.type === 'audio') {
    console.log(file);
    let blobObj = dataUrlToBlob(file.data, "audio");
    console.log(blobObj);
    let fileurl = URL.createObjectURL(blobObj);
    console.log(fileurl); 
    append(buffer, new Tone.Buffer(fileurl));
    uploadedFiles++;
    fileUploaded = new Switch(true);
    fileUploaded = fileUploaded.getState();
  } 
}


function handlePatternFile(file) {
  let base64Str = file.data.split(",")[1];
  let jsonStr = atob(base64Str);
  let JSONObject = JSON.parse(jsonStr);
  console.log(JSONObject);
  let userpattern = JSONObject.pattern;

  loadPattern(userpattern);

  track1Select.selectOption(JSONObject.track1SampleIndex);
  track2Select.selectOption(JSONObject.track2SampleIndex);
  track3Select.selectOption(JSONObject.track3SampleIndex);
  track4Select.selectOption(JSONObject.track4SampleIndex);
  track5Select.selectOption(JSONObject.track5SampleIndex);
  track6Select.selectOption(JSONObject.track6SampleIndex);
  track7Select.selectOption(JSONObject.track7SampleIndex);
  track8Select.selectOption(JSONObject.track8SampleIndex);
}

function downloadJSON() {
  let JSONPattern = [];
  //per fer el JSON més llegible quan el descarreguem
  for (i = 0; i < pattern.length; i++) {
    JSONPattern[i] = pattern[i].toString().replace(/,/g, "");
  }

  createStringDict({
    pattern : JSONPattern, 
    track1SampleIndex : track1Select.getIndexItemSelected(),
    track2SampleIndex : track2Select.getIndexItemSelected(),
    track3SampleIndex : track3Select.getIndexItemSelected(),
    track4SampleIndex : track4Select.getIndexItemSelected(),
    track5SampleIndex : track5Select.getIndexItemSelected(),
    track6SampleIndex : track6Select.getIndexItemSelected(),
    track7SampleIndex : track7Select.getIndexItemSelected(),
    track8SampleIndex : track8Select.getIndexItemSelected()
  }).saveJSON('userpattern');
}

function recordSequence() {
  recorder = new Tone.Recorder();
  makeChain(1);
  currentStep = 0;
  beats = 0;
  recorder.start();

  // this local function records the input and saves it as a file. Copied from the Tone reference materials.
  setTimeout(async () => {
	// the recorded audio is returned as a blob
	const recording = await recorder.stop();
	// download the recording by creating an anchor element and blob url
	const url = URL.createObjectURL(recording);
	const anchor = document.createElement("a");
	anchor.download = "userRecording.webm"; //saves as a .webm file. change the suffix to .mp3 or .wav for a different file type.
	anchor.href = url;
  anchor.click();
}, 20000);

  Tone.Transport.start();
}


function recordFromMic() {
  if (!initialized) {
  mic = new Tone.UserMedia();
  micRecorder = new Tone.Recorder();
  mic.connect(micRecorder);
  mic.open();
  initialized = true;
  }
  micRecorder.start();
  setTimeout(async () => {
    let data = await micRecorder.stop();
    console.log(data);
    let blobUrl = URL.createObjectURL(data);
    userPlayer = new Tone.Player(blobUrl, () => {
      userPlayer.start();
      append(buffer, new Tone.Buffer(blobUrl));
      uploadedFiles++;
      fileUploaded = new Switch(true);
      fileUploaded = fileUploaded.getState();
    }).toDestination();
  }, 2000);
};

//----------------- Fi declaracio de funcions ---------------------//

//----------------- Declaració de funcions de p5.js ---------------------//

function setup(){
  cnv = createCanvas(window.innerWidth,window.innerHeight);
  background("#249da3");
  loadBuffers();
  frameRate(10);

  kit = new Tone.Players(
    {"kick" : buffer[indexKick],
      "snare" : buffer[indexSnare],
      "hh" : buffer[indexHh],
      "ohh" : buffer[indexOhh],
      "clap" : buffer[indexClap],
      "perc" : buffer[indexPerc],
      "stab" : buffer[indexStab],
      "vocal" : buffer[indexVocal]
    });
  Tone.Transport.scheduleRepeat(onStep, "16n");	

  logoImatge = loadImage("logo1.png");

  setDefaultBPM();
  loadPattern(null);

  createInputs();
  createButtons();
  createSelects();

  inputSoundFile = createFileInput(handleAudioFile);
  inputSoundFile.position(150, 600);

  inputPatternFile = createFileInput(handlePatternFile);
  inputPatternFile.position(900, 680);

  makeKnobs();
  createEffects();

  jsonTextDiv = createDiv('Puja aquí el teu sample');
  jsonTextDiv.style('font-size', '20px');
  jsonTextDiv.style('color', 'rgb(0, 0, 0)');
  jsonTextDiv.style('font-family', 'monospace');
  jsonTextDiv.position(150, 570);

  jsonTextDiv = createDiv('Puja aquí el teu pattern en format JSON');
  jsonTextDiv.style('font-size', '20px');
  jsonTextDiv.style('color', 'rgb(0, 0, 0)');
  jsonTextDiv.style('font-family', 'monospace');
  jsonTextDiv.position(900, 640);

  cnv.mousePressed(canvasPressed);
  console.clear();
}

function draw() {
  clear();
	background("#249da3");
  stroke(255);
  drawPattern();
  drawGrid();
  drawHighlight();

  fill(0, 102, 153);

  image(logoImatge, 160, -20);

  //valors mapejats efectes/ knobs
  effectsTrack1.setValues(knobsTrack1.getValue("delayKnob"), knobsTrack1.getValue("delayTimeKnob"), knobsTrack1.getValue("volumeKnob"), knobsTrack1.getValue("hpfilterKnob"), knobsTrack1.getValue("lpfilterKnob"), knobsTrack1.getValue("reverbKnob"));
  effectsTrack2.setValues(knobsTrack2.getValue("delayKnob"), knobsTrack2.getValue("delayTimeKnob"), knobsTrack2.getValue("volumeKnob"), knobsTrack2.getValue("hpfilterKnob"), knobsTrack2.getValue("lpfilterKnob"), knobsTrack2.getValue("reverbKnob"));
  effectsTrack3.setValues(knobsTrack3.getValue("delayKnob"), knobsTrack3.getValue("delayTimeKnob"), knobsTrack3.getValue("volumeKnob"), knobsTrack3.getValue("hpfilterKnob"), knobsTrack3.getValue("lpfilterKnob"), knobsTrack3.getValue("reverbKnob"));
  effectsTrack4.setValues(knobsTrack4.getValue("delayKnob"), knobsTrack4.getValue("delayTimeKnob"), knobsTrack4.getValue("volumeKnob"), knobsTrack4.getValue("hpfilterKnob"), knobsTrack4.getValue("lpfilterKnob"), knobsTrack4.getValue("reverbKnob"));
  effectsTrack5.setValues(knobsTrack5.getValue("delayKnob"), knobsTrack5.getValue("delayTimeKnob"), knobsTrack5.getValue("volumeKnob"), knobsTrack5.getValue("hpfilterKnob"), knobsTrack5.getValue("lpfilterKnob"), knobsTrack5.getValue("reverbKnob"));
  effectsTrack6.setValues(knobsTrack6.getValue("delayKnob"), knobsTrack6.getValue("delayTimeKnob"), knobsTrack6.getValue("volumeKnob"), knobsTrack6.getValue("hpfilterKnob"), knobsTrack6.getValue("lpfilterKnob"), knobsTrack6.getValue("reverbKnob"));
  effectsTrack7.setValues(knobsTrack7.getValue("delayKnob"), knobsTrack7.getValue("delayTimeKnob"), knobsTrack7.getValue("volumeKnob"), knobsTrack7.getValue("hpfilterKnob"), knobsTrack7.getValue("lpfilterKnob"), knobsTrack7.getValue("reverbKnob"));
  effectsTrack8.setValues(knobsTrack8.getValue("delayKnob"), knobsTrack8.getValue("delayTimeKnob"), knobsTrack8.getValue("volumeKnob"), knobsTrack8.getValue("hpfilterKnob"), knobsTrack8.getValue("lpfilterKnob"), knobsTrack8.getValue("reverbKnob"));

  if (fileUploaded) {
    fill(0);
    textSize(20);
    t = text(`userSample${uploadedFiles}. A quina pista vols reproduir el teu fitxer?`, 393, 655);
  }
  
  if (trackSelected) {
    fill(0);
    textSize(20);
    text(`userSample${uploadedFiles} assignat a ${trackSelectedName}`, 287, 740);
  } 

  knobsDrawing.getKnobsDrawing();
}


function canvasPressed(){
  Tone.start();

  if (mouseY > origen &&  mouseX > origen && mouseX < (origen+cellWidth*32) && mouseY < (origen+cellWidth*8)) {
    let row = floor((mouseY-origen)/cellWidth);
    let index = floor((mouseX-origen)/cellWidth);

    pattern[row][index] = +!pattern[row][index];
  }

  knobsTrack1.active();
  knobsTrack2.active();
  knobsTrack3.active();
  knobsTrack4.active();
  knobsTrack5.active();
  knobsTrack6.active();
  knobsTrack7.active();
  knobsTrack8.active();

	return false;
}

function mouseReleased() { 
  knobsTrack1.inactive();
  knobsTrack2.inactive();
  knobsTrack3.inactive();
  knobsTrack4.inactive();
  knobsTrack5.inactive();
  knobsTrack6.inactive();
  knobsTrack7.inactive();
  knobsTrack8.inactive();
}

function keyPressed() {
  //PITCH Players
  if (keyCode === 65) {
    setSampleAtCurrentStep(1);
  }

  if (keyCode === 83) {
    setSampleAtCurrentStep(2);
  }

  if (keyCode === 68) {
    setSampleAtCurrentStep(3);
  }

  if (keyCode === 70) {
    setSampleAtCurrentStep(4);
  }

  if (keyCode === 71) {
    setSampleAtCurrentStep(5);
  }

  if (keyCode === 72) {
    setSampleAtCurrentStep(6);
  }

  if (keyCode === 74) {
    setSampleAtCurrentStep(7);
  }

  if (keyCode === 75) {
    setSampleAtCurrentStep(8);
  }

  //PITCH CONTROL
  if (keyCode === 9) {
    setPitch(-6);
  }

  if (keyCode === 81) {
    setPitch(-5);
  }

  if (keyCode === 87) {
    setPitch(-4);
  }

  if (keyCode === 69) {
    setPitch(-3);
  }

  if (keyCode === 82) {
    setPitch(-2);
  }
  
  if (keyCode === 84) {
    setPitch(-1);
  }

  if (keyCode === 89) {
    setPitch(0);
  }

  if (keyCode === 85) {
    setPitch(1);
  }

  if (keyCode === 73) {
    setPitch(2);
  }

  if (keyCode === 79) {
    setPitch(3);
  }

  if (keyCode === 80) {
    setPitch(4);
  }

  if (keyCode === 192) {
    setPitch(5);
  }

  if (keyCode === 171) {
    setPitch(6);
  }

  if (keyCode === 32) {
    if (toneStarted()) {
      Tone.Transport.stop();
    } else {
      beats = 0;
      currentStep = 0;
      Tone.Transport.start();
    }
  }
}

function setSampleAtCurrentStep(track) {
  if (!toneStarted()) {
    beats = 0;
    currentStep = 0;
    Tone.Transport.start();
  }
    pattern[track-1][currentStep] = 1;
}

function setPitch(pitchValue) {
  eval(`effectsTrack${pitchTrack}`).changePitch(pitchValue);
  setSampleAtCurrentStep(pitchTrack);
  for(i = currentStep ; i < pitchValues[pitchTrack].length; i++) {
    pitchValues[pitchTrack-1][i] = pitchValue;
  }
}

function toneStarted() {
  return Tone.Transport.state === "started";
}

function togglePlay() {
	if(Tone.Transport.state === "started"){
  	Tone.Transport.stop();
    playButton.html('Play');
    Tone.getContext().rawContext.suspend();
  } else {
  	Tone.Transport.start();
    playButton.html('Stop');
    Tone.getContext().rawContext.resume();
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