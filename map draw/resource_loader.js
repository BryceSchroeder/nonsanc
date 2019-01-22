/*
	resource_loader.js - resource preloader for map rendering engine test/demo
	 
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

// Image preloader
const imgLoader = Object.freeze({
	imgs: [],

	loadImages: function (list) {
		let loadedImgs = 0;
		let imgCount = 0;
		for (let src in list) {
			imgCount++;
		}

		let checkPreloadComplete = function (e) {
			loadedImgs++;
			if (loadedImgs >= imgCount) {
				console.log('done.');
				game.imgPreloaded = true;
				game.initialize();		// In game.js
			}
		}

		for (var src in list) {
			imgLoader.imgs[src] = new Image();
			imgLoader.imgs[src].addEventListener('load', checkPreloadComplete);
			imgLoader.imgs[src].src = list[src];
		}
	},
});

// Sound effect preloader
const sfxLoader = Object.freeze({
	sfx: [],
	
	loadSfx: function (list) {
		// Stub for now; develop audio loader later...
		console.log('done.');
		game.sfxPreloaded = true;
		game.initialize();		// In game.js
	},
});

// Music preloader
const musicLoader = Object.freeze({
	music: [],
	
	loadMusic: function (list) {
		// Stub for now; develop music loader later...
		console.log('done.');
		game.musicPreloaded = true;
		game.initialize();		// In game.js
	},
});

// Namespace for handles on DOM elements
let DOM = {
	mapCanvas: '',
	scratchCanvas: '',
	
	initializeDOM: function () {
		DOM.mapCanvas = document.getElementById('map_canvas');
		DOM.scratchCanvas = document.getElementById('scratchCanvas');
	}
};
