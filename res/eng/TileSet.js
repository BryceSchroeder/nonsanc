/*
	TileSet.js - Class for making tiles defined in tile_definitions.js
          available as Tiles.
	 
	---------------------------------------------------------------------
	
	This file is part of the Nonsanc Project.
	(C) 2018-2019 Gnostic Instruments, Inc.
	Author(s): Bryce Schroeder, bryce@gnosticinstruments.com
	
	
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

class TileSet {
  constructor(tile_width = 32, tile_height = 32, img_name = null, tiles = {}) {
    this._width = tile_width;
    this._height = tile_height;
    this._image_resource_name = img_name;
    this._tile_names = new Array();

    let scratch = document.createElement('canvas');
    let context = scratch.getContext("2d");
    let image_resource = res.scn.tiles[img_name];
  
    //console.log( tile_width, tile_height, file_name, tiles);
    for (const name in tiles) {
      this._tile_names.push(name);
      let frames = new Array();
      let flags = this._movement_str2int(tiles[name][0]);
      for (let j = 1; j < tiles[name].length; j += 2) {
        context.clearRect(0,0,tile_width,tile_height);
        let x = tiles[name][j] * tile_width;
        let y = tiles[name][j+1] * tile_height;
        context.drawImage(image_resource, x, y, tile_width, tile_height, 0,0, tile_width, tile_height);
        let image = new Image(tile_width, tile_height);
        image.src = scratch.toDataURL("image/png");
        frames.push(image);
      }
      this[name] = new Tile(frames, flags = flags);
    }

  }

  _movement_str2int(mstr) {
    let intval = 0;
    for (let i = 0; i < mstr.length; ++i)
      intval |= tile_movement_categories[mstr[i]];
    return intval;
  }
}
