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
	sfxPreloaded: false,
	musicPreloaded: false,
	
	initialize: function () {
		if (!game.imgPreloaded) {
			// Call img resource loader
			console.log('Loading images...');
			imgLoader.loadImages(imgResources);		// In resource_loader.js
		}
		else if (!game.sfxPreloaded) {
			// Call audio resource loader
			console.log('Loading sounds...');
			sfxLoader.loadSfx(sfxResources);		// In resource_loader.js
		}
		else if (!game.musicPreloaded) {
			// Call audio resource loader
			console.log('Loading music...');
			musicLoader.loadMusic(musicResources);	// In resource_loader.js
		}
		else {
			// DOM handles
			DOM.initializeDOM();	// In resource_loader.js
			
			// Add ability to click on map rendering canvas to resize it
			// This is for development, will probably be removed later
			DOM.mapCanvas.addEventListener('click', function () {
				if (render.scaleX == 1) {
					render.scaleX = 2;
					render.scaleY = 2;
				}
				else {
					render.scaleX = 1;
					render.scaleY = 1;
				}
			});
			
			// Initialize game assets
			console.log('Setting up game resources...');
			tiles.createTiles(tileDefs);
			gameMaps.createMaps(gameMapDefs);
			console.log('done.');
			
			// Initialize renderer
			console.log('Setting up renderer...');
			
			render.map.fps = 60;
			render.cell.fps = 5;
			render.dialogue.fps = 10;

			render.map.context = DOM.mapCanvas;
			
			render.scaleX = 1;
			render.scaleY = 1;
			
			console.log('done.');

			// Start game loop (which is the map loop for now)
			// Presumably this will be replaced with the opening cinematic as development progresses
			console.log('Starting game.');
			requestAnimationFrame(playMap.loop);
		}
	},
};

window.addEventListener('load', function() {
	game.initialize();
});
