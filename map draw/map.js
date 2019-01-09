/*
	map.js - map data for map rendering engine test/demo
	 
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

let maps = {
	data: {
		testmap: {
			defaultBgTile: 'grass_light',
			defaultFgTile: false,
			sizeX: 20,
			sizeY: 20,
			bgTiles: {
				0:  {0: ['grass_light', 'temple'], 19: ['grass_light', 'temple']},
				1:  {1: ['grass_light', 'tree']},
				6:  {6: ['grass_light', 'tree']},
				7:	{5: ['grass_dark'], 6: ['grass_dark'], 7: ['grass_dark',]},
				8:  {3: ['grass_light', 'dead_tree'], 5: ['grass_dark'], 6: ['grass_dark', 'fountain'], 7: ['grass_dark', 'tree']},
				9:	{5: ['grass_dark'], 6: ['grass_dark'], 7: ['grass_dark',]},
				10: {4: ['glowing_rocks'], 5: ['glowing_rocks'], 6: ['glowing_rocks'], 7: ['glowing_rocks'], 8: ['glowing_rocks'], 9: ['glowing_rocks'], 10: ['glowing_rocks'], 11: ['glowing_rocks']},
				19: {0: ['grass_light', 'temple'], 19: ['grass_light', 'temple']},
			},
			fgTiles: {
				0:  {1: ['diag_bars_opaque'], 2: ['diag_bars_opaque', 'tree'], 3: ['diag_bars_50'], 4: ['diag_bars_25']},
				1:  {0: ['diag_bars_50'], 1: ['diag_bars_50'], 2: ['diag_bars_50'], 3: ['diag_bars_50'], 4: ['diag_bars_25']},
				2:  {0: ['diag_bars_25'], 1: ['diag_bars_25'], 2: ['diag_bars_25'], 3: ['diag_bars_25'], 4: ['diag_bars_25']},
			},
			traversable: {
				// 1 = traversable, 0 = impassable
				0:  {0: false, 19: false},
				6:  {6: false},
				8:  {3: false, 6: false, 7: false,},
				19: {0: false, 19: false},
			},
			startFrame: {
				10: {5: 8, 6: 7, 7: 6, 8: 5, 9: 4, 10: 3, 11: 2},
			}
		},	
	},
	
	cells: new Array(),
	
	createCells: function () {
		for (var mapname in maps.data) {
			maps.cells[mapname] = new Array();
			for (let i = 0; i < maps.data[mapname].sizeX; i++) {
				
				if (typeof maps.data[mapname].bgTiles[i] === 'undefined') {
					maps.data[mapname].bgTiles[i] = new Array();
				}
				
				if (typeof maps.data[mapname].fgTiles[i] === 'undefined') {
					maps.data[mapname].fgTiles[i] = new Array();
				}
				
				maps.cells[mapname][i] = new Array();
				
				for (let j = 0; j < maps.data[mapname].sizeY; j++) {
					// background tiles
					if (typeof maps.data[mapname].bgTiles[i][j] === 'undefined' && maps.data[mapname].defaultBgTile != false) {
						maps.data[mapname].bgTiles[i][j] = new Array();
						maps.data[mapname].bgTiles[i][j][0] = maps.data[mapname].defaultBgTile;
					}
					let bg_tiles = maps.data[mapname].bgTiles[i][j];
					
					// foreground tiles
					if (typeof maps.data[mapname].fgTiles[i][j] === 'undefined' && maps.data[mapname].defaultFgTile != false) {
						maps.data[mapname].fgTiles[i][j] = new Array();
						maps.data[mapname].fgTiles[i][j][0] = maps.data[mapname].defaultFgTile;
					}
					let fg_tiles = maps.data[mapname].fgTiles[i][j];
					
					// traversability
					let traversable = true;
					if (typeof maps.data[mapname].traversable[i] !== 'undefined' && typeof maps.data[mapname].traversable[i][j] !== 'undefined') {
						traversable = maps.data[mapname].traversable[i][j];
						
						/*
						// Just illustrates non-traversable cells - remove later
						if (!traversable) {
							bg_tiles.push('diag_bars_50');
						}
						*/
					}

					// starting frame
					// Possible TODO: expand this to allow selection of starting frame for each individual tile
					let start_frame = 1;
					if (typeof maps.data[mapname].startFrame[i] !== 'undefined') {
						if (typeof maps.data[mapname].startFrame[i][j] !== 'undefined') {
							start_frame = maps.data[mapname].startFrame[i][j];
						}
					}
						
					maps.cells[mapname][i][j] = new Cell(bg_tiles, fg_tiles, traversable, start_frame);
				}
			}
		}
	},
};