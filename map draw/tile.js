/*
	tile.js - tile class and data for map rendering engine test/demo
	 
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

// Namespace for tile and tile frame definitions
const tiles = Object.freeze({
	// Tile resource information
	resources: {
		testBgTiles:	{tile_width: 32, tile_height: 32},
		testFgTiles:	{tile_width: 32, tile_height: 32},
	},
	
	// Name of individual tile frame is keyed to an object containing the frame's defining information
	// x and y are the tile position coordinates on the tilesheet img, not pixel coordinates
	frames: {
		grass_light:		{resource: 'testBgTiles', x: 0, y: 0},
		grass_dark:			{resource: 'testBgTiles', x: 10, y: 0},
		glowing_rocks_1:	{resource: 'testBgTiles', x: 1, y: 0},
		glowing_rocks_2:	{resource: 'testBgTiles', x: 2, y: 0},
		glowing_rocks_3:	{resource: 'testBgTiles', x: 3, y: 0},
		sand_light:			{resource: 'testBgTiles', x: 4, y: 0},
		sand_medium:		{resource: 'testBgTiles', x: 5, y: 0},
		sand_dark:			{resource: 'testBgTiles', x: 6, y: 0},
		tree:				{resource: 'testBgTiles', x: 7, y: 0},
		dead_tree:			{resource: 'testBgTiles', x: 8, y: 0},
		temple:				{resource: 'testBgTiles', x: 9, y: 0},
		fountain_1:			{resource: 'testBgTiles', x: 11, y: 0},
		fountain_2:			{resource: 'testBgTiles', x: 12, y: 0},
		
		diag_bars_opaque:	{resource: 'testFgTiles', x: 0, y: 0},
		diag_bars_50:		{resource: 'testFgTiles', x: 1, y: 0},
		diag_bars_25:		{resource: 'testFgTiles', x: 2, y: 0},
		
	},

	// Name of each tile is keyed to a list of frames used by that tile
	frame_lists: {
		grass_light:	['grass_light'],
		grass_dark:		['grass_dark'],
		glowing_rocks:	['glowing_rocks_1',
						'glowing_rocks_1',
						'glowing_rocks_2',
						'glowing_rocks_2',
						'glowing_rocks_3',
						'glowing_rocks_3',
						'glowing_rocks_2',
						'glowing_rocks_2'],
		sand_light:		['sand_light'],
		sand_medium:	['sand_medium'],
		sand_dark:		['sand_dark'],
		tree:			['tree'],
		dead_tree:		['dead_tree'],
		temple:			['temple'],
		fountain:		['fountain_1',
						'fountain_2'],
						
		diag_bars_opaque:	['diag_bars_opaque'],
		diag_bars_50:		['diag_bars_50'],
		diag_bars_25:		['diag_bars_25'],
	},

	tile: new Array(),
	
	// Create tile objects
	createTiles: function () {	
		for (var tile_name in tiles.frame_lists) {			
			tiles.tile[tile_name] = new Tile(tiles.frame_lists[tile_name]);
		}
	},
});

class Tile {
	// Create a new tile using array f as the frame list
	constructor (f) {
		this.frames = f;
	}
	
	// Draw frame n of this tile on the context ctx, at given pixel coordinates x and y, with optional scaling
	drawTile (ctx, x, y, n = 0, scale_x = 1, scale_y = 1) {
		if (n >= 0 && n < this.frames.length) {
			var resource = tiles.frames[this.frames[n]].resource;
			var img_resource = imgLoader.imgs[resource];
			
			var rw = tiles.resources[resource].tile_width;
			var rh = tiles.resources[resource].tile_height;
			
			var rx = tiles.frames[this.frames[n]].x * rw;
			var ry = tiles.frames[this.frames[n]].y * rh;
			
			var w = rw * scale_x;
			var h = rh * scale_y;
			
			ctx.drawImage(img_resource, rx, ry, rw, rh, x, y, w, h);
		}
	}
	
	// Get frame name of frame n of this tile
	getFrameName (n = 0) {
		if (n >= 0 && n < this.frames.length) {
			return this.frames[n];
		}
		else {
			return false;
		}
	}
	
	// Get frame data for frame n of this tile
	getFrameData (n = 0) {
		if (n >= 0 && n < this.frames.length) {
			return tiles.frames[this.frames[n]];
		}
		else {
			return false;
		}
	}
	
	getFrameCount () {
		return this.frames.length;
	}
}
