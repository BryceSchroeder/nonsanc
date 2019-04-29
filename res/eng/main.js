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
    test_conversation(convo);

    
}

function test_conversation(convo) {

    
    if (convo.has_more_to_say()) {
        document.getElementById("npc_line").innerHTML = convo.get_npc_line();
    }

    // this is almost certainly not the best way to do it, someone with better DOM-fu
    // should change it to something better 
    let portrait_div = document.getElementById("npc_portrait");
    portrait_div.innerHTML = "";
    portrait_div.appendChild(convo.get_local("SpeakerPortrait"));

    if (convo.has_more_to_say()) {
        document.getElementById("pc_line").innerHTML = `
                <button onclick="test_conversation(convo)">(Continue listening)</button>
            `;
    } else if (!convo.current_keywords().size) {
        let responses = new Array();
        let i = 0;
        for (response of convo.current_responses()) {
            responses.push(`<button onclick="convo.give_pc_line(${i}); test_conversation(convo)">
                                 ${response}
                            </button><br>`)
            i += 1;
        }
        document.getElementById("pc_line").innerHTML = responses.join('\n');
    } else { 
        let responses = new Array();
        for (response of convo.current_keywords()) {
            responses.push(
                `Ask about 
                   <button onclick="convo.give_pc_line('${response}'); test_conversation(convo)">
                                ${response}
                            </button><br>`)
        }
        document.getElementById("pc_line").innerHTML = responses.join('\n')+`
            <button onclick="convo.give_pc_line(document.getElementById('freetext').value); test_conversation(convo)">
            Ask about:</button><input type="text" id="freetext"><br>
            <button onclick="convo.end_conversation(); test_conversation(convo); document.getElementById('pc_line').innerHTML = '(Conversation ends)'">Goodbye!</button>`;
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
