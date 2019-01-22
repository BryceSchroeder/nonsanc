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

let playMap = {
	lastFrameRequestID: undefined,
	
	cellFrameTick: function (t) {
		gameMaps.map[render.map.name].tickCellFrames();
		
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
	
	refreshMap: function (t) {
		gameMaps.map[render.map.name].drawMap(render.map.context);
		
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
		// Temporary for development: allows hitting spacebar to stop animating the map
		if (keys.isInList(' ')) {
			render.map.totalFrames = 6000;
		}
		
		
		if ((t - render.cell.lastFrameT) >= (render.cell.interval - render.cell.lastFrameSlip)) {
			playMap.cellFrameTick(t);	// Update map cell frame number
		}

		// TODO: fix this for real
		if ((t - render.map.lastFrameT) >= (render.map.interval - render.map.lastFrameSlip) - 3) { // Hacky fix by adding the - 3
			playMap.refreshMap(t);		// Redraw the map
		}

		/*
		if (t - render.secondTimer >= 1000) {
			// Track how many frames are drawn per second:
			console.log(render.map.totalFrames + "fps");
			render.secondTimer = t;
			render.map.totalFrames = 0;
		}
		*/
		
		playMap.lastFrameRequestID = requestAnimationFrame(playMap.loop);
		if (render.map.totalFrames >= 6000) {
			// Conditional exit from map loop to some other game functionality (dialogue box, menu, etc.)
			// Actual exit conditions will be coded later
			cancelAnimationFrame(playMap.lastFrameRequestID);
		}
	},
};
