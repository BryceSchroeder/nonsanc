/*
	game_map.js - game map object and class for map rendering engine test/demo
	 
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

const gameMaps = Object.freeze({
	map: [],
	
	createMaps: function (maps) {
		for (let map_name in maps) {			
			gameMaps.map[map_name] = new GameMap(maps[map_name]);
		}
	}
});

class GameMap {
	constructor (map_data) {
		this.cells = [];
		
		this.sizeX = map_data.sizeX;
		this.sizeY = map_data.sizeY;
		
		for (let i = 0; i < this.sizeX; i++) {
			
			if (typeof map_data.bgTiles[i] === 'undefined') {
					map_data.bgTiles[i] = [];
			}

			if (typeof map_data.fgTiles[i] === 'undefined') {
					map_data.fgTiles[i] = [];
			}
			
			this.cells[i] = [];
				
			for (let j = 0; j < this.sizeY; j++) {
				// background tiles
				if (typeof map_data.bgTiles[i][j] === 'undefined' && map_data.defaultBgTile != false) {
					map_data.bgTiles[i][j] = [];
					map_data.bgTiles[i][j][0] = map_data.defaultBgTile;
				}
				let bg_tiles = map_data.bgTiles[i][j];
				
				// foreground tiles
				if (typeof map_data.fgTiles[i][j] === 'undefined' && map_data.defaultFgTile != false) {
					map_data.fgTiles[i][j] = [];
					map_data.fgTiles[i][j][0] = map_data.defaultFgTile;
				}
				let fg_tiles = map_data.fgTiles[i][j];
				
				// traversability
				let traversable = true;
				if (typeof map_data.traversable[i] !== 'undefined') {
					if ((typeof map_data.traversable[i][j] !== 'undefined') && !(map_data.traversable[i][j])) {
						traversable = map_data.traversable[i][j];
						
						/*
						if (typeof fg_tiles === 'undefined') {
							fg_tiles = new Array();
						}
						fg_tiles.push('diag_bars_50');
						*/
					}
				}
				
				// starting frame
				// Possible TODO: expand this to allow selection of starting frame for each individual tile
				let start_frame = 1;
				if (typeof map_data.startFrame[i] !== 'undefined') {
					if (typeof map_data.startFrame[i][j] !== 'undefined') {
						start_frame = map_data.startFrame[i][j];
					}
				}
				
				this.cells[i][j] = new Cell(bg_tiles, fg_tiles, traversable, start_frame);
			}
		}
	}
	
	// Draw the map on context ctx
	drawMap (ctx, tile_flags = cell.BG_TILES | cell.FG_TILES) {
		// TODO: split this apart to draw background tiles, then sprites, then foreground tiles
		for (let i = 0; i < this.cells.length; i++) {
			for (let j = 0; j < this.cells[i].length; j++) {
				let x = j * render.cell.sizeX;
				let y = i * render.cell.sizeY;
				this.cells[i][j].drawFrame(ctx, x, y, tile_flags, 1, 1);
			}
		}
		
	}
	
	tickCellFrames () {
		for (let i = 0; i < this.cells.length; i++) {
			for (let j = 0; j < this.cells[i].length; j++) {
				this.cells[i][j].advanceFrame();
			}
		}
	}
}
