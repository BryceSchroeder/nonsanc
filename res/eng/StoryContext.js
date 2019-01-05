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

class StoryContext extends Map {

  /* Render a template into processed text for display. */
  process(template, locals = null) {
    this.locals = (locals? new Map(locals) : new Map());
    

    return template + " <b>Processed! FIXME</b> ";
  }

  /* Add or update multiple new story variables at once */
  extend(additional_environment) {
    // crazy... surely there is a better way??
    for (let name of additional_environment.keys())
      this[name] = additional_environment[name];
  }

}
