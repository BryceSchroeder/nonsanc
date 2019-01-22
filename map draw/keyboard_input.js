/*
	keyboard_input.js - keyboard input reader
	 
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

const keys = Object.freeze({
	list: [],
	
	// Returns an array containing the whole list of keys
	getList: function () {
		return this.list;
	},
	
	// Returns the length of the list of keys
	getCount: function () {
		return this.list.length;
	},
	
	// Returns true if needle (or any element of needle) is in the list of keys, and false if needle is not in the list
	isInList: function (needle) {
		if (needle instanceof Array) {
			return needle.some(i => this.list.includes(i))
		}
		else {
			return keys.list.includes(needle);
		}
	},
	
	// Returns index of needle in the list of keys if needle is in the list, and -1 if needle is not in the list
	positionInList: function (needle) {
		let i = this.list.indexOf(needle);
		return i;
	},
	
	// Adds key to the list of keys if key is not already in the list
	addToList: function (key) {
		if (!keys.isInList(key)) {
			keys.list.push(key);
			//console.log("added key '" + key + "' to input list.");
		}
	},
	
	// Removes needle from the list of keys if needle is in the list
	removeFromList: function (needle) {
		let i = this.list.indexOf(needle);
		if (i !== -1) {
			this.list.splice(i, 1);
			//console.log("removed key '" + needle + "' from input list.");
		}
	},
	
	// Clears the whole list of keys
	clearList: function () {
		this.list = [];
	},
	
	// keydown event listener
	keyDown: function (e) {
		if (!e.repeat) {
			keys.addToList(e.key);
		}
		
		// Stops browser control events from firing in (eg., prevents Ctrl+S from opening the Save Page As... dialogue)
		e.preventDefault();
	},
	
	// keyup event listener
	keyUp: function (e) {
		keys.removeFromList(e.key);
	},
});

window.addEventListener('keydown', keys.keyDown, false);
window.addEventListener('keyup', keys.keyUp, false);
