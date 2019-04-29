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
        console.log("New conversation; number of dialogs =", dialogs.length);
        this._tree = {"$DEFAULT": "<b>Conversation: No $DEFAULT specified</b>",
                      "$START": "<b>Conversation: No $START node exists.</b>"};
        for (let dialog of dialogs)
            for (let keyword_spec in dialog) {
                let keywords = this._flatten_keyword_spec(keyword_spec);
                for (let keyword of keywords)
                    this._tree[keyword] = dialog[keyword_spec];
            }
            
    }

    begin_conversation(story_context, initial_locals={}, start_node="$START") {
        this._sc = story_context;
        this._locals = {};
        for (let key in initial_locals) this._locals[key] = initial_locals[key];
        this._current_keywords = new Set();
        this._configure_for_node(start_node);
    }

    
    get_npc_line() {
        let locals = this._locals; 

        let node = this._tree[this._current_node];
        if (typeof node == 'string') { /* Simple text reply. */
            this._current_index = node.length;
            return this._reply_text(node);
        }

        /* multiple items */
        /* Some lines may be code only, with an empty text output. These lines should be 
           skipped. */
 
        // We start at the current index, and process lines until we hit one with a 
        // valid text output, which we save. At that point, we should check if the 
        // _next_ item is a list, in which case it is the responses (and we are done
        // with the node.)

        let retval = null;
        let element = null;
        while (!retval && this._current_index < node.length) {
            element = node[this._current_index++];
            retval = this._reply_text(element);
        }

        
        // Check for fixed response lines
        if (this._current_index < node.length) {
            if (typeof node[this._current_index] === 'object')
                this._current_responses = node[this._current_index++];
        }
            

        return (retval)? retval: `<b>Conversation: no text in node ${this._current_node}</b>`;
    }

    has_more_to_say() {
        return (this._current_index < this._tree[this._current_node].length
                && typeof this._tree[this._current_node][this._current_index] === 'string');
    }

    /* 
       If this is text, it's a freetext entry or keyword. If it's a number, it's an index
       into the current responses. */
    give_pc_line(response) {
        // We might consider checking for the appropriateness of the response type here,
        // but we currently elect to trust the interface to not allow free-keyword responses when
        // canned responses are shown. (We hide the automatic keywords on our end when we
        // are expecting a canned response, so unless the interface is really buggy or badly
        // designed that shouldn't be an issue.)

        if (typeof response === 'number') {
            let [_,tags] = this._filter_tags(this._current_responses[response], true, true);
            response = "$" + tags[tags.length-1];
        }

        // Keyword - free-text or an automatic one
        response = response.trim().toLowerCase();
        this._locals.LAST_KEYWORD = response;
        this._locals.LAST_KEYWORD_TITLE = response.charAt(0).toUpperCase() + response.slice(1);
        if (this._tree.hasOwnProperty(response)) {
            this._configure_for_node(response);
            return true;
        } else {
            this._configure_for_node("$DEFAULT");
            return false;
        }
    }

    current_keywords() {
        return (this._current_responses.length || this.has_more_to_say())? 
            new Set() : this._current_keywords;
    }

    current_responses() {
        let processed_responses = [];
        let locals = this._locals;
        for (let response_template of this._current_responses) {
            let variate = this._sc.process(response_template, locals);
            processed_responses.push(this._filter_tags(variate));
        }
        return processed_responses;
    }

    _configure_for_node(node_name) {
        this._current_index = 0;
        this._current_node = node_name;
        this._current_responses = [];
    }

    _reply_text(text) {
        let locals = this._locals;
        let variate = this._sc.process(text, locals);
        let [reply, new_keywords] = this._filter_tags(variate, false, true);
        for (let keyword of new_keywords) this._current_keywords.add(keyword);
        return (/^\s*$/.test(reply))? null : reply; // only spaces left after processing -> null
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

    _purify_tag(tag) {
        let output = [];
        let puretag = [];
        let escaped = false;
        let passed_end = true;
        for (let i = 0; i < tag.length; ++i) {
            if (escaped || (tag[i] != '\\' && tag[i] != '$')) {
                output.push(tag[i]);
                if (!passed_end) puretag.push(tag[i]);
                escaped = false;
                continue;
            }
            if (tag[i] == '\\') 
                escaped = true;
            else if (tag[i] == '$') passed_end = !passed_end;
        }
        return [output.join(''), puretag.join('')];
    }

    /* Removes the tags (words beginning with $) from a string, or
       just removes the $ from the text. hide=true is the correct
       behavior for PC replies, hide=false for NPC dialogue. */
    _filter_tags(text, hide=true, return_tags=false) {
        let output = new Array();
        let tags = new Array();
        let output_word = null;
        let output_tag = null;
        for (let word of text.split(/\s+/)) {
            if (!word || !word.length) continue; 
      

            if ((word[0] == '$' || word[0] == '\\')) {
                [output_word, output_tag] = this._purify_tag(word);
                if (!hide && output_word.length) output.push(output_word); 
                if (output_tag.length) tags.push(output_tag);
            } else 
                output.push(word);
        }

        if (return_tags) {
          return [output.join(' '), tags];
        } else
          return output.join(' ');
    }

    /* Turns a keyword spec into a list of the individual keywords. At this
       point it just splits by commas. */
    _flatten_keyword_spec(keyspec) {
        // Uncomment when JS gets list comprehensions like a real language (i.e. python)
        //return [for (keyword of keyspec.split(',')) if (!/^\s*$/.test(keyword)) keyword];
        return keyspec.split(',').filter(keyword => !/^\s*$/.test(keyword));
    }

}
