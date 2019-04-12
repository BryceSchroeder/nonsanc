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
	sX: 1,
	sY: 1,
	secondTimer: 0,
	ctxType: '2d',
	displayChanged: false,
	
	get scaleX () {
		return this.sX;
	},
	
	get scaleY () {
		return this.sY;
	},
	
	set scaleX (s) {
		this.sX = s;
		this.displayChanged = true;
	},
	
	set scaleY (s) {
		this.sY = s;
		this.displayChanged = true;
	},
	
	setupDisplay: function () {
		// Resize canvas physical pixel size
		DOM.mapCanvas.style.width = (render.map.cellsX * render.cell.sizeX * render.scaleX) + 'px';
		DOM.mapCanvas.style.height = (render.map.cellsY * render.cell.sizeY * render.scaleY) +'px';

		// Logically resize canvas, allowing the browser to handle scaling
		DOM.mapCanvas.width = render.map.cellsX * render.cell.sizeX;
		DOM.mapCanvas.height = render.map.cellsY * render.cell.sizeY;
		
		// Reset display changed flag
		this.displayChanged = false;
	},
	
	// Game map rendering
	map: {
		interval: 0,
		lastFrameT: 0,
		lastFrameSlip: 0,
		totalFrames: 0,
		name: 'testmap',
		cellsX: 15,
		cellsY: 15,
		ctx: undefined,
		
		set context (c) {
			this.ctx = c.getContext(render.ctxType);
		},
		
		get context () {
			return this.ctx;
		},
				
		set fps (f) {
			this.interval = 1000 / f;
		},
	},
	
	// Cell rendering
	cell: {
		interval: 0,
		lastFrameT: 0,
		lastFrameSlip: 0,
		totalFrames: 0,
		sizeX: 32,
		sizeY: 32,
		
		set fps (f) {
			this.interval = 1000 / f;
		},
	},
	
	// Dialogue box rendering
	dialogue: {
		interval: 0,
		lastFrameT: 0,
		lastFrameSlip: 0,
		totalFrames: 0,
		ctx: undefined,
		
		set context (c) {
			this.ctx = c.getContext(render.ctxType);
		},
		
		get context () {
			return this.ctx;
		},
		
		set fps (f) {
			this.interval = 1000 / f;
		},
	},
};
