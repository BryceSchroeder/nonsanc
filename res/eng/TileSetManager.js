/*
	TileSetManager.js - Class for making tileset resources available.
        What tilesets it loads depends on scn/tile_definitions.js, which is
        of course scenario dependent. 
	 
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

class TileSetManager {
  constructor() {
    for (const name in tileset_definitions) {
      this[name] = new TileSet(...tileset_definitions[name]);
      for (let i = 0; i < this[name]._tile_names.length; ++i) {
        let tilename = this[name]._tile_names[i];
        this[tilename] = this[name][tilename];
      }
      
    }
  }
}
