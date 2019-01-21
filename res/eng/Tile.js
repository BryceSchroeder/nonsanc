/*
	Tile.js - Tile class for map rendering engine test/demo
	 
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

class Tile {
	// Create a new tile using array f as the frame list
	constructor (f, flags = 0) {
		this.frames = f;
                this.flags = flags;
	}
	
	// Draw frame n of this tile on the context ctx, at given pixel coordinates x and y, with optional scaling
	drawTile (ctx, x, y, n = 0, scale_x = 1, scale_y = 1) {
		if (n >= 0 && n < this.frames.length) {
			var img_resource = this.frames[n];
			
			var rw = img_resource.width;
			var rh = img_resource.height;
			
			//var rx = tiles.frames[this.frames[n]].x * rw;
			//var ry = tiles.frames[this.frames[n]].y * rh;
			
			var w = rw * scale_x;
			var h = rh * scale_y;
			
			ctx.drawImage(img_resource, 0, 0, rw, rh, x, y, w, h);
		}
	}
	
	// Get frame name of frame n of this tile
	/*getFrameName (n = 0) {
		if (n >= 0 && n < this.frames.length) {
			return this.frames[n];
		}
		else {
			return false;
		}
	}*/
	
	// Get frame data for frame n of this tile
	/*getFrameData (n = 0) {
		if (n >= 0 && n < this.frames.length) {
			return tiles.frames[this.frames[n]];
		}
		else {
			return false;
		}
	}*/
	
	getFrameCount () {
		return this.frames.length;
	}
}
