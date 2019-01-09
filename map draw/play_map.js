/*
	play_map.js - game map loop for map rendering engine test/demo
	 
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

const playMap = Object.freeze({
	cellFrameTick: function (t) {
		for (let i = 0; i < maps.cells[render.map.name].length; i++) {
			for (let j = 0; j < maps.cells[render.map.name][i].length; j++) {
				maps.cells[render.map.name][i][j].advanceFrame();
			}
		}
		
		// Find the excess time beyond the nominal frame interval between this frame and the last one
		render.cell.lastFrameSlip = (t - render.cell.lastFrameT) - render.cell.interval;
		if (render.cell.lastFrameSlip < 0) {
			render.cell.lastFrameSlip = 0;
		}
		
		//console.log("Cell tick: " + (t - render.cell.lastFrameT) + "ms since last cell tick");
		render.cell.lastFrameT = t;
		
		render.cell.totalFrames++;
		//console.log(render.ceil.totalFrames);
	},
	
	drawMap: function (t) {
		// TODO: split this apart to draw background tiles, then sprites, then foreground tiles
		for (let i = 0; i < maps.cells[render.map.name].length; i++) {
			for (let j = 0; j < maps.cells[render.map.name][i].length; j++) {
				let x = j * render.cell.sizeX;
				let y = i * render.cell.sizeY;
				maps.cells[render.map.name][i][j].drawFrame(render.map.canvasContext, x, y, cell.BG_TILES | cell.FG_TILES, 1, 1);
			}
		}
		
		// Find the excess time, beyond the nominal frame interval, between this frame and the last one
		render.map.lastFrameSlip = (t - render.map.lastFrameT) - render.map.interval;
		if (render.map.lastFrameSlip < 0) {
			render.map.lastFrameSlip = 0;
		}

		//console.log("Frame draw: " + (t - render.map.lastFrameT) + "ms since last frame");
		//console.log("Frame slip: " + render.map.lastFrameSlip + "ms");
		render.map.lastFrameT = t;
		
		render.map.totalFrames++;
		//console.log(render.map.totalFrames);
	},
	
	loop: function (t) {
		if (render.displayChanged) {
			render.setupDisplay();	// Re-setup the map rendering canvas
		}
		
		// TODO: Poll input, etc., here
		
		if ((t - render.cell.lastFrameT) >= (render.cell.interval - render.cell.lastFrameSlip)) {
			playMap.cellFrameTick(t);	// Update map cell frame number
		}

		if ((t - render.map.lastFrameT) >= (render.map.interval - render.map.lastFrameSlip)) {
			playMap.drawMap(t);		// Redraw the map
		}

		/*
		if (t - render.secondTimer >= 1000) {
			// Track how many frames are drawn per second:
			console.log(render.map.totalFrames + "fps");
			render.secondTimer = t;
			render.map.totalFrames = 0;
		}
		*/
		
		if (render.map.totalFrames > 6000) {
			// Conditional exit from map loop to some other game functionality (dialogue box, menu, etc.)
			// This is a stub; actual exit conditions will be coded later
			// Right now it just renders 6000 frames and then exits the loop, so that the demo doesn't sit and run forever
		}
		else if (false) {
			// Another possible point of conditional exit from map loop to some other game functionality
		}
		else {
			requestAnimationFrame(playMap.loop);
		}
	},
});