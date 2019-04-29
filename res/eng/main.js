/*
    main.js - Primary entry point for the NSE engine.
 
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

function main () {
    console.log("NSE Engine: main.js coming online...");

    /* StoryContext testing */
    let main_div = document.getElementById("nse_main_div");
    let text_example = res.scn.variable_text_example;

    window.sc = new StoryContext();
    sc["Trainer"] = "Jack";
    sc["LeaderName"] = "Jack"; // current party leader, i.e. the person who talks to NPCs
    sc["his"] = "his";
    sc["Rival"] = "Jill";
    sc["sibling"] = "sister";
    sc.favorite_color = 2; // This works too, might as well own it.
    sc.ann_betrayed = true;
  
    main_div.innerHTML = sc.process(text_example, {myLocal: "Hello!"});

    /* Conversation testing */
    convo = new Conversation(res.scn.dlg.base, res.scn.dlg.test);
    convo.begin_conversation(sc, {SpeakerName: "Bob"}); 
    // NPCs will have a methods to generate their locals (name, pronouns, etc)

    console.log("CONVERSATION");
    let i = 0;
    while (convo.has_more_to_say() && ++i < 10) { 
        console.log(">>>", convo.get_npc_line());
        console.log("Responses:", convo.current_responses(), 
                    "Keywords:", convo.current_keywords());
    }
    
}

/* Functions for testing purposes */
function savegame () {
  let savedata = sc.serialize();
  console.log("Saving data: " + savedata);
  let link = document.createElement('a');
  link.setAttribute('style', 'display:none;');
  link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(savedata));
  link.setAttribute('download', sc.Trainer+'_save.json');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link); // Clean up
}

function loadgame () {
  let fileinput = document.createElement('input');
  fileinput.setAttribute('style', 'display:none;');
  fileinput.setAttribute('type', 'file');
  fileinput.setAttribute('id', '_loadgame_file_input');
  fileinput.addEventListener('change', function (e) {
      console.log("changed");
      let reader = new FileReader();
      reader.onload = function (e) {
        console.log("onload");
        finish_loadgame(reader.result);
      };
      reader.readAsText(fileinput.files[0]);
    });
  document.body.appendChild(fileinput);
  fileinput.click();
}

function finish_loadgame(savedata) {
  console.log("finish_loadgame");
  sc.deserialize(savedata);
  let main_div = document.getElementById("nse_main_div");


  main_div.innerHTML = sc.process(res.scn.variable_text_example, {myLocal: "Hello from save!"});

  let fileinput = document.getElementById('_loadgame_file_input');
  document.body.removeChild(fileinput); // Clean up
}
