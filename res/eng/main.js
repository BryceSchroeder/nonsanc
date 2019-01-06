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
  let main_div = document.getElementById("nse_main_div");

  let text_example = document.getElementById("res_scn_variable_text_example");

  let sc = new StoryContext();
  sc["Trainer"] = "Jack";
  sc["his"] = "his";
  sc["Rival"] = "Jill";
  sc["sibling"] = "sister";
  sc.favorite_color = 2; // This works too, might as well own it.
  sc.ann_betrayed = true;


  main_div.innerHTML = sc.process(text_example.innerHTML, {myLocal: "Hello!"});
  


}
