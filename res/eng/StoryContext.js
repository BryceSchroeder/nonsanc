/*
    StoryContext.js : Class for tracking the player's progress in the story,
    and for handling the generation of dynamic story text in the game (e.g. 
    character dialog, conversations) from templates. 
    This covers things like gender-appropriate pronouns for 
    characters, names of name-able characters, cosmetic random variation in
    text (to reduce repetitiveness), and variation in text depending on the 
    status of story events.

    Text substitution:
    The syntax is straightforward. Square brackets, [ and ], surround tags.
    The StoryContext is an associative array which stores the 
    'story variables', and it can introduce simple substitutions, e.g:
      I went to see my [sister], [Jill].
    If for example the character has a sibling whose name and gender the 
    player can customize, this text might be rendered into:
      I went to see my brother, Phil.
    Or perhaps:
      I went to see my sister, Jane.
    As appropriate to the characters involved.

    Another construct allows random variations:
      My favorite color is [red|green|blue].
    Variations are separated by pipes, |, and are all equally probable. 
    Entries may be repeated (to crudely increase their probability) or may
    be empty (in which case the whole tag will sometimes generate no output.
    Tags may be nested:
      My favorite [fruit is [strawberry|rambutan]|color is [red|green|blue]].
    
    If an entry in the story variable associative array is not text, but 
    rather an integer or boolean, it overrides the random number generator
    that would otherwise be used for alternative selection. For example:
      [ann_betrayed][|Did you think I would forget your betrayal?]
    Note that the _false_ alternative is first, and the true is second;
    this is because false is interpreted as 0 and true as 1.

    If the variable is an integer, and it < 0 or >= the length of the list
    of alternatives, rather than throwing an error, the value will be 
    considered to "saturate" at 0 or length-1. For example, supposing that
    foo = -1 and baz = 3:
      The first letter is [foo][a|b|c], and the second is [baz][a|b|c].
    Renders to:
      The first letter is a, and the second is c.
    This is useful for when the variable is an open-ended quantity.

    Finally, for scripting integration, a story variable entry may be a
    function. It will be called with the name of the entry and the 
    invoking StoryContext instance as parameters. The return value will
    be processed according to the rules above (strings are rendered as
    output; integers or booleans allow indexing the following alterative
    list.)
 
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

class StoryContext {
  _handle_lookup(item) {
    if (typeof item === 'string')
      return item;
    else if (typeof item === 'number') {
      this._force_rng = item;
      return '';
    } else if (typeof item === 'function') {
      return this._handle_lookup(item(this, item));
    } else if (typeof item === 'boolean') {
      this._force_rng = (item? 1 : 0); 
      return '';
    }
      
    return `<b>StoryContext: bad type for '${item}': ${typeof item}</b>`
  }


  _handle_tag(tag_contents, locals) {
    //console.log("%&", this["Trainer"], typeof this[tag_contents[0]]);
    if (tag_contents.length == 1) {
      let name = tag_contents[0];
      if (name in StoryContext.prototype) {
        return `<b>StoryContext: '${name}' is a reserved variable name.</b>`
      }
      if (name in locals) 
        return this._handle_lookup(locals[name]);
      else if (name in this)
        return this._handle_lookup(this[name]);
      else
        return `<b>StoryContext: undefined tag '${name}'</b>`;

      return "{" + tag_contents[0] + "}";
    } else if (tag_contents.length > 1) {
      if (this._force_rng !== null) {
        let saturated_index = Math.max(0, Math.min(this._force_rng, 
                                            tag_contents.length - 1))
        this._force_rng = null;
        return tag_contents[saturated_index];
      } else
        return nse.random_choice(tag_contents);
      //return "{" + tag_contents.join("*") + "}";
    }

    return "<b>StoryContext: empty tag error</b>"
  }

  _parse(template, locals) {
    this._force_rng = null; // Do this at each parse level so that
                           // a misplaced tag can't cause mysterious behavior

    let tag_depth = 0,
        max_tag_depth = 0,
        tag_start = 0,
        escaped = false;

    let line_number = 0;

    let tag_contents = new Array(),
        parsed = new Array(),
        pipe_position = 0;

    for (var i = 0; i < template.length; ++i) {
      switch(template[i]) {
        case '\\':
          if (i >= template.length - 1) {
            parsed.push("<b>StoryContext: pruned trailing backslash</b>");
          } else {
            if (tag_depth == 0) parsed.push('\\'+template[i+1]);
            ++i;
          }
          break;
        case '[':
          ++tag_depth;
          max_tag_depth = Math.max(tag_depth, max_tag_depth);
          if (tag_depth == 1) {
            tag_start = i+1;
            pipe_position = i;
          }
          break;
        case '|':
          if (tag_depth == 1) {
            tag_contents.push(template.slice(pipe_position+1, i));
            pipe_position = i;
          }
          break;
        case ']':
          --tag_depth;
          if (tag_depth == 0) {
            tag_contents.push(template.slice(pipe_position+1, i));
            parsed.push(this._handle_tag(tag_contents, locals));
            tag_contents = new Array();
          }
          break;
        default:
          if (tag_depth == 0) parsed.push(template[i]);
          break;
      }

    }
   
    return [parsed.join(''), max_tag_depth];
  }


  /* Render a template into processed text for display. */
  process(template, locals = null) {
    locals = (locals? locals : new Map());
    
    let parsed = template, max_tag_depth = 0;

    do {
      [parsed, max_tag_depth] = this._parse(parsed, locals);
    } while (max_tag_depth);

    return parsed.replace(/\\([[|\]\\])/gm, '$1');
  }

  /* Add or update multiple new story variables at once */
  extend(additional_environment) {
    // crazy... surely there is a better way??
    for (let name of additional_environment.keys())
      this[name] = additional_environment[name];
  }

  /* Save the contents of the StoryContext to a string. */
  serialize() {
    let state = new Map();
    for (let key in this) {
      /* ignore keys that are inherited from the prototype, i.e. that are
         not set by the scenario, and internal state information (variables
         whose names begin with underscore.) */
      if (!this.hasOwnProperty(key) || key[0] == '_') continue;
      
      //console.log("Key: " + key + " = " + this[key]);
      state[key] = this[key];
    }
    return JSON.stringify(state);
    
  }

  /* Restore the contents of the StoryContext from a string. */
  deserialize(source) {
    let state = JSON.parse(source);
    for (let key in state) {
      this[key] = state[key];
    }
  }

}
