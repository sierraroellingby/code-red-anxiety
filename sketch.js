// P_2_3_6_01
//
// Generative Gestaltung – Creative Coding im Web
// ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018
// Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
// with contributions by Joey Lee and Niels Poldervaart
// Copyright 2018
//
// http://www.generative-gestaltung.de
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * draw tool. draws a specific module according to
 * its east, south, west and north neighbours.
 *
 * MOUSE
 * drag left           : draw new module
 * drag right          : delete a module
 *
 * KEYS
 * del, backspace      : clear screen
 * g                   : toggle show grid
 * d                   : toggle show module values
 * s                   : save png
 */
'use strict';

var modules;

var tileSize = 30;
var gridResolutionX;
var gridResolutionY;
var tiles = [];

var doDrawGrid = true;
var isDebugMode = false;

function preload() {
  // load SVG modules
  modules = [];

  // METHOD 1: Looping through local files is efficient
  // for (var i = 0; i < 16; i++) {
  //   modules[i] = loadImage('data/' + nf(i, 2) + '.svg');
  // }

  // METHOD 2: Read files one-by-one
  modules[0] = loadImage('pscircle1.jpg');
  modules[1] = loadImage('pscircle1.jpg');
  modules[2] = loadImage('pscircle2.jpg');
  modules[3] = loadImage('pscircle2.jpg');
  modules[4] = loadImage('pscircle3.jpg');
  modules[5] = loadImage('pscircle3.jpg');
  modules[6] = loadImage('pscircle4.jpg');
  modules[7] = loadImage('psredcircle1.jpg');
    modules[8] = loadImage('pscircle5.jpg');
      modules[9] = loadImage('pscircle5.jpg');
        modules[10] = loadImage('pscircle6.jpg');
          modules[11] = loadImage('psredcircle1.jpg');
            modules[12] = loadImage('pscircle7.jpg');
              modules[13] = loadImage('pscircle7.jpg');
                modules[14] = loadImage('pscircle1.jpg');
                  modules[15] = loadImage('psredcircle1.jpg');

}

function setup() {
  // use full window size
  createCanvas(windowWidth, windowHeight);

  cursor(CROSS);
  rectMode(CENTER);
  imageMode(CENTER);
  strokeWeight(0.15);
  textSize(8);
  textAlign(CENTER, CENTER);

  gridResolutionX = round(width / tileSize) + 2;
  gridResolutionY = round(height / tileSize) + 2;

  initTiles();
}

function draw() {
  background(500);

  if (mouseIsPressed) {
    if (mouseButton == LEFT) setTile();
    if (mouseButton == RIGHT) unsetTile();
  }

  if (doDrawGrid) drawGrid();
  drawModules();
}

function initTiles() {
  for (var gridX = 0; gridX < gridResolutionX; gridX++) {
    tiles[gridX] = [];
    for (var gridY = 0; gridY < gridResolutionY; gridY++) {
      tiles[gridX][gridY] = 0;
    }
  }
}

function setTile() {
  // convert mouse position to grid coordinates
  var gridX = floor(mouseX / tileSize) + 1;
  gridX = constrain(gridX, 1, gridResolutionX - 2);
  var gridY = floor(mouseY / tileSize) + 1;
  gridY = constrain(gridY, 1, gridResolutionY - 2);
  tiles[gridX][gridY] = 1;
}

function unsetTile() {
  var gridX = floor(mouseX / tileSize) + 1;
  gridX = constrain(gridX, 1, gridResolutionX - 2);
  var gridY = floor(mouseY / tileSize) + 1;
  gridY = constrain(gridY, 1, gridResolutionY - 2);
  tiles[gridX][gridY] = 0;
}

function drawGrid() {
  fill(500);
  for (var gridX = 0; gridX < gridResolutionX; gridX++) {
    for (var gridY = 0; gridY < gridResolutionY; gridY++) {
      var posX = tileSize * gridX - tileSize / 2;
      var posY = tileSize * gridY - tileSize / 2;
    //  fill(500);
      if (isDebugMode) {
        if (tiles[gridX][gridY] == 1) fill(500);
      }
      rect(posX, posY, tileSize, tileSize);
    }
  }
}

//function to draw circles using north west vars
function drawModules() {
  for (var gridX = 0; gridX < gridResolutionX - 1; gridX++) {
    for (var gridY = 0; gridY < gridResolutionY - 1; gridY++) {
      // use only active tiles
      if (tiles[gridX][gridY] == 1) {
        // check the four neightbours, each can be true or false
        var NORTH = str(tiles[gridX][gridY - 1]);
        var WEST = str(tiles[gridX - 1][gridY]);
        var SOUTH = str(tiles[gridX][gridY + 1]);
        var EAST = str(tiles[gridX + 1][gridY]);

        // create binary result out of it
        var binaryResult = NORTH + WEST + SOUTH + EAST;

        // convert binary string to a decimal value from 0 - 15
        var decimalResult = parseInt(binaryResult, 2);

        var posX = tileSize * gridX - tileSize / 2;
        var posY = tileSize * gridY - tileSize / 2;

        // decimalResult is also the index for the shape array
        image(modules[decimalResult], posX, posY, tileSize, tileSize);

        if (isDebugMode) {
          fill(200);
          text(decimalResult + '\n' + binaryResult, posX, posY);
        }
      }
    }
  }

//if (var decimalResult = 16){
  //image('psredcircle1.jpg')
}


function keyPressed() {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');

  if (keyCode == DELETE || keyCode == BACKSPACE) initTiles();
  if (key == 'g' || key == 'G') doDrawGrid = !doDrawGrid;
  if (key == 'd' || key == 'D') isDebugMode = !isDebugMode;
}
