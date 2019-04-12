/*
	tile_resources.js - tile resource definitions for map rendering engine test/demo
	 
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

const tileDefs = Object.freeze({
	// Tile definition information
	
	// Tile size in pixels
	tileWidth: 32,
	tileHeight: 32,
	
	// Name of individual tile frame is keyed to an object containing the frame's defining information
	// x and y are the tile position coordinates on the tilesheet img, not pixel coordinates
	frames: {
		grass_light:		{resource: 'bg_tiles_small', x: 0, y: 0},
		grass_dark:			{resource: 'bg_tiles_small', x: 10, y: 0},
		glowing_rocks_1:	{resource: 'bg_tiles_small', x: 1, y: 0},
		glowing_rocks_2:	{resource: 'bg_tiles_small', x: 2, y: 0},
		glowing_rocks_3:	{resource: 'bg_tiles_small', x: 3, y: 0},
		sand_light:			{resource: 'bg_tiles_small', x: 4, y: 0},
		sand_medium:		{resource: 'bg_tiles_small', x: 5, y: 0},
		sand_dark:			{resource: 'bg_tiles_small', x: 6, y: 0},
		tree:				{resource: 'bg_tiles_small', x: 7, y: 0},
		dead_tree:			{resource: 'bg_tiles_small', x: 8, y: 0},
		temple:				{resource: 'bg_tiles_small', x: 9, y: 0},
		fountain_1:			{resource: 'bg_tiles_small', x: 11, y: 0},
		fountain_2:			{resource: 'bg_tiles_small', x: 12, y: 0},
		
		diag_bars_opaque:	{resource: 'fg_tiles_small', x: 0, y: 0},
		diag_bars_50:		{resource: 'fg_tiles_small', x: 1, y: 0},
		diag_bars_25:		{resource: 'fg_tiles_small', x: 2, y: 0},
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
});
