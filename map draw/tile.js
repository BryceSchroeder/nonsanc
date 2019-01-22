/*
	tile.js - tile object and Tile class for map rendering engine test/demo
	 
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
// TODO: unfreeze this to allow tile frame lists to be changed later for special effects?
const tiles = Object.freeze({
	tile: [],
	
	// Create tile objects
	createTiles: function (list) {
		for (var tile_name in list.frame_lists) {			
			tiles.tile[tile_name] = new Tile(list.frame_lists[tile_name]);
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
			var resource = tileDefs.frames[this.frames[n]].resource;
			var img_resource = imgLoader.imgs[resource];
			
			var rx = tileDefs.frames[this.frames[n]].x * tileDefs.tileWidth;
			var ry = tileDefs.frames[this.frames[n]].y * tileDefs.tileHeight;
			
			var w = tileDefs.tileWidth * scale_x;
			var h = tileDefs.tileHeight * scale_y;
			
			ctx.drawImage(img_resource, rx, ry, tileDefs.tileWidth, tileDefs.tileHeight, x, y, w, h);
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
			return tileDefs.frames[this.frames[n]];
		}
		else {
			return false;
		}
	}
	
	getFrameCount () {
		return this.frames.length;
	}
}
