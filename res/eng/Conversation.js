/*
    Conversation.js : Class for conversation dialogue structures.
 
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

class Conversation {
    /* Takes one or more objects as parameters, which are generally taken
       from .json/.yaml files in res/scn/dlg/. Later items (i.e. parameters
       farther right in the parameter list) override previous ones in 
       case of conflict. */ 
    constructor(...dialogs) {
        ;
    }

    begin_conversation(start_node="$start") {
        this.locals = {};
    }

    
    converse(response=null) {
        ;
    }

    current_keywords() {
        ;
    }

    current_responses() {
        ;
    }

    /* SUPERSEEDED by _filter_tags
       Finds all tags (words beginning with $) in text. (For finding
       new keywords in NPC dialogue, and for finding the link node in 
       PC responses.) Returns the list of all tags. 
    _find_tags(text) {
        let tags = new Array();
        let tag_begins = -1;
        for (var i = 0; i < text.length; ++i) {
            if (text[i] == '$') {
              tag_begins = i+1;
              continue; // Don't save the $
            }
            if (tag_begins < 0) continue;

            // We are in a tag now. Should we end?
            if (/\s/.test(text[i])) {
                tags.push(text.slice(tag_begins,i));
                tag_begins = -1;
            } else if (i == text.length - 1) 
                tags.push(text.slice(tag_begins));
            

        }

        return tags;
    } */

    /* Removes the tags (words beginning with $) from a string, or
       just removes the $ from the text. hide=true is the correct
       behavior for PC replies, hide=false for NPC dialogue. */
    _filter_tags(text, hide=true, return_tags=false) {
        let output = new Array();
        let tags = new Array();
        for (let word of text.split(/\s/)) {
            if (!word) continue; 
            if (word[0] != '$') 
                output.push(word);
            else {
                tags.push(word.slice(1));
                if (!hide)
                    output.push(word.slice(1));
            }
        }

        if (return_tags) {
          return [output.join(' '), tags];
        } else
          return output.join(' ');
    }

}
