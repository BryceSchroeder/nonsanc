/*
	cell.js - Cell class for map rendering engine test/demo
	 
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

// Cell constants
const cell = Object.freeze({
	BG_TILES: 1,	//00000001
	FG_TILES: 2,	//00000010
});

class Cell {
	constructor (bg_tiles = '', fg_tiles = '', traversable = true, start_frame = 1) {
		this.tiles = new Array();
		
		this.tiles[cell.BG_TILES] = new Array();
		for (var i = 0; i < bg_tiles.length; i++) {
			this.tiles[cell.BG_TILES].push(bg_tiles[i]);
		}
		
		this.tiles[cell.FG_TILES] = new Array();
		for (var i = 0; i < fg_tiles.length; i++) {
			this.tiles[cell.FG_TILES].push(fg_tiles[i]);
		}
		
		this.currentFrame = start_frame;	// Frame count starts at 1, not 0, to make modulo math easy
		this.calculateFrameCount();		
		this.setTraversable(traversable);
	}
	
	// Draw Cell's tiles on context ctx at pixel coordinates (x, y), with optional scaling
	drawFrame (ctx, x, y, tile_flags = cell.BG_TILES, scale_x = 1, scale_y = 1) {
		if (tile_flags & cell.BG_TILES) {
			for (var i = 0; i < this.tiles[cell.BG_TILES].length; i++) {
				var tile_current_frame = this.currentFrame % tiles.tile[this.tiles[cell.BG_TILES][i]].getFrameCount();	
				tiles.tile[this.tiles[cell.BG_TILES][i]].drawTile(ctx, x, y, tile_current_frame, scale_x, scale_y);
			}
		}
		if (tile_flags & cell.FG_TILES) {
			for (var i = 0; i < this.tiles[cell.FG_TILES].length; i++) {
				var tile_current_frame = this.currentFrame % tiles.tile[this.tiles[cell.FG_TILES][i]].getFrameCount();	
				tiles.tile[this.tiles[cell.FG_TILES][i]].drawTile(ctx, x, y, tile_current_frame, scale_x, scale_y);
			}
		}
	}
	
	// Advance the current Cell frame number, resetting back to frame 1 after the last frame
	advanceFrame () {
		if (this.frameCount > 1) {
			if (this.currentFrame < this.frameCount) {
				this.currentFrame++;
			}
			else {
				this.currentFrame = 1;
			}
		}
	}
	
	// Calculate total frames needed for this cell
	calculateFrameCount () {
		this.frameCount = 1;
		for (let i = 0; i < this.tiles[cell.BG_TILES].length; i++) {
			this.frameCount *= tiles.tile[this.tiles[cell.BG_TILES][i]].getFrameCount();
		}
		for (let i = 0; i < this.tiles[cell.FG_TILES].length; i++) {
			this.frameCount *= tiles.tile[this.tiles[cell.FG_TILES][i]].getFrameCount();
		}
	}
	
	// Add a tile to cell at specified index in the tile list (at end of list if index <= -1)
	tileAdd (tile_name, tile_list = cell.BG_TILES, index = -1) {
		if (index <= -1 || index >= this.tiles[tile_list].length) {
			this.tiles[tile_list].push(tile_name);
		}
		else {
			var new_tiles = new Array();
			for (var i = 0; i < this.tiles[tile_list].length; i++) {
				if (i == index) {
					new_tiles.push(tile_name);
				}
				new_tiles.push(this.tiles[tile_list][i]);
			}
			this.tiles[tile_list] = new_tiles;
		}
		this.calculateFrameCount();
	}
	
	// Remove all tiles by clearing the list
	tileRemoveAll (tile_list = cell.BG_TILES) {
		this.tiles[tile_list] = new Array();
		this.calculateFrameCount();
	}
	
	// Remove the last tile from the list
	tileRemoveLast (tile_list = cell.BG_TILES) {
		var new_tiles = new Array();
		for (var i = 0; i < (this.tiles[tile_list].length - 1); i++) {
			new_tiles.push(this.tiles[tile_list][i]);
		}

		this.tiles[tile_list] = new_tiles;
		this.calculateFrameCount();
	}
	
	// Remove tile at specified index in the tile list from cell
	tileRemoveIndex (index, tile_list = cell.BG_TILES) {
		if (index >= 0 && index < this.tiles[tile_list].length) {
			var new_tiles = new Array();
			for (var i = 0; i < this.tiles[tile_list].length; i++) {
				if (i != index) {
					new_tiles.push(this.tiles[tile_list][i]);
				}
			}
			this.tiles[tile_list] = new_tiles;
			this.calculateFrameCount();
		}
	}
	
	// Remove all instances of a background tile with tile_name
	tileRemoveName (tile_name, tile_list = cell.BG_TILES) {
		var new_tiles = new Array();
		for (var i = 0; i < this.tiles[tile_list].length; i++) {
			if (this.tiles[tile_list][i] != tile_name) {
				new_tiles.push(this.tiles[tile_list][i]);
			}
		}
		this.tiles[tile_list] = new_tiles;
		this.calculateFrameCount();
	}
	
	getTileCount (tile_list = cell.BG_TILES) {
		return this.tiles[tile_list].length;
	}
	
	isTraversable () {
		return this.traversable;
	}
	
	setTraversable (traversable) {
		this.traversable = traversable;
	}
}