/*
	render.js - rendering control for map rendering engine test/demo
	 
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

let render = {
	map: {
		fps: 60,
		interval: 0,
		lastFrameT: 0,
		lastFrameSlip: 0,
		totalFrames: 0,
		name: 'testmap',
		cellsX: 15,
		cellsY: 15,
		canvasContext: undefined,
	},
	
	cell: {
		fps: 5,
		interval: 0,
		lastFrameT: 0,
		lastFrameSlip: 0,
		totalFrames: 0,
		sizeX: 32,
		sizeY: 32,
	},
	
	dialogue: {
		fps: 10,
		interval: 0,
		lastFrameT: 0,
		lastFrameSlip: 0,
		totalFrames: 0,
		canvasContext: undefined,
	},
	
	scaleX: 1,
	scaleY: 1,
	displayChanged: false,
	secondTimer: 0,
	
	findIntervals: function () {
		// Interval between frames (in milliseconds) = 1000 / target_fps
		render.map.interval = 1000 / render.map.fps;
		render.cell.interval = 1000 / render.cell.fps;
		render.dialogue.interval = 1000 / render.dialogue.fps;
	},
	
	setupDisplay: function () {
		// Resize canvas physical pixel size
		DOM.mapCanvas.style.width = (render.map.cellsX * render.cell.sizeX * render.scaleX) + 'px';
		DOM.mapCanvas.style.height = (render.map.cellsY * render.cell.sizeY * render.scaleY) +'px';

		// Logically resize canvas, allowing the browser to handle scaling
		DOM.mapCanvas.width = render.map.cellsX * render.cell.sizeX;
		DOM.mapCanvas.height = render.map.cellsY * render.cell.sizeY;
		
		render.displayChanged = false;
	}
};