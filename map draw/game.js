/*
	game.js - game setup and launcher for map rendering engine test/demo
	 
	---------------------------------------------------------------------
	
	This file is part of the Nonsanc Project.
	(C) 2018-2019 Gnostic Instruments, Inc.
	Author(s): Winston Deleon, wdeleon0@gmail.com
	
	
	This program is free software: you can redistribute it and/or  modify
	it under the terms of the GNU Affero General Public License, version 3,
	as published by the Free Software Foundation.
	
	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	
	You should have received a copy of the GNU Affero General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

"use strict";

let game = {
	imgPreloaded: false,
	audioPreloaded: false,
	
	initialize: function () {
		if (!game.imgPreloaded) {
			// Call img resource loader
			console.log('Loading images...');
			imgLoader.loadImages();		// In resource_loader.js
		}
		else if (!game.audioPreloaded) {
			// Call audio resource loader
			console.log('Loading sounds...');
			audioLoader.loadAudio();	// In resource_loader.js
		}
		else {
			// DOM handles
			DOM.initializeDOM();
			
			// Add ability to click on map rendering canvas to resize it
			// This is for development, remove later
			DOM.mapCanvas.addEventListener('click', function () {
				render.displayChanged = true;
				if (render.scaleX == 1 || render.scaleY == 1) {
					render.scaleX = 2;
					render.scaleY = 2;
				}
				else {
					render.scaleX = 1;
					render.scaleY = 1;
				}
			});
			
			// Initialize game assets
			console.log('Setting up game assets...');
			tiles.createTiles();
			gameMaps.createMaps();
			console.log('done.');
			
			// Initialize renderer
			console.log('Setting up renderer...');
			
			render.map.fps = 60;
			render.cell.fps = 5;
			render.dialogue.fps = 10;
			render.findIntervals();

			render.map.canvasContext = DOM.mapCanvas.getContext('2d');
			
			render.scaleX = 1;
			render.scaleY = 1;
			render.setupDisplay();
			
			console.log('done.');

			// Start game loop (which is the map loop for now)
			console.log('Starting game.');
			requestAnimationFrame(playMap.loop);
		}
	},
};

window.addEventListener('load', function() {
	game.initialize();
});
