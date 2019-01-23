#!/usr/bin/env python3
#
#    This file is part of the Nonsanc Project.
#    (C) 2018-2019 Gnostic Instruments, Inc.
#    Author(s): Bryce Schroeder, bryce@gnosticinstruments.com
#
#    This program is free software: you can redistribute it and/or  modify
#    it under the terms of the GNU Affero General Public License, version 3,
#    as published by the Free Software Foundation.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#

import sys, os, base64, json
mode = sys.argv[1] if len(sys.argv) > 2 else 'none'

def srcatr(mime, data_or_path):
  if mode == 'embed':
    data_or_path = str(base64.b64encode(data_or_path), 'utf-8')
    return "data:%s;base64,"%mime + data_or_path
  else:
    return data_or_path

def full_split(pth):
  r = []
  while True:
    a,b = os.path.split(pth)
    pth = a
    r.insert(0,b)
    if not a: break
  return r


def img_tag(mime, name, data, hierarchy):
  global loaders
  loaders.append("%s = document.getElementById('%s');"%(
        '.'.join(hierarchy),name))

  return '<img id="%s" style="display:none" src="%s">\n'%(
    name, srcatr(mime, data))

#def yaml_tag(name, data):
#  global used_YAML
#  used_YAML = True
#  print ("yaml_tag", name, data)
#  global loaders
#  loaders.append("_nse_yaml_loader('_nse_%s', '%s');"%(name,name))
#  if mode == 'embed':
#    return '''<div id="%s" style="display:none">%s</div>\n'''%(
#      name, str(data, 'utf-8'))
#  else:
#    return '''<object id="_nse_%s" type="text/html" data="%s" style="display:none">
#      </object>\n'''%(
#      name, data)


def txt_tag(mime, name, data, hierarchy):
  global loaders
  yaml=False
  json=False
  if mode == 'embed':
    f = str(data, 'utf-8')
    if f[0:3] == '---': 
      loaders.append("_nse_yaml_loader('%s', true, %s, '%s');"%(name, '.'.join(hierarchy[:-1]), hierarchy[-1]))
    else: 
      loaders.append("%s = document.getElementById('%s').innerHTML;"%(
        '.'.join(hierarchy),name))
    return '<div id="%s" style="display:none">%s</div>\n'%(
      name, f)
  else:
    f = open(data).read()
    loaders.append("_nse_object_loader('_nse_%s', '%s');"%(name,name))
    if f[0:3] == '---': 
      loaders.append("_nse_yaml_loader('%s', false, %s, '%s');"%(name, '.'.join(hierarchy[:-1]), hierarchy[-1]))
    else:
      loaders.append("%s = document.getElementById('%s').innerHTML;"%(
        '.'.join(hierarchy),name))
    return '''<object id="_nse_%s" type="%s" data="%s" style="display:none">
      </object>\n'''%(
      name, mime, data)

#def json_tag(name, data):
#  global loaders
#  if mode == 'embed':
#    data = json.loads(str(data, 'utf-8'))
#    return '''<script>\nnse_res["%s"] = %s;\n</script>\n'''%(
#      name, json.dumps(data))
#  else:
#    return '''<object id="_nse_%s" type="application/json" data="%s" style="display:none"
# onload="_nse_json_loader('_nse_%s', '%s')">
#      </object>\n'''%(
#      name, data,name,name)


def audio_tag(mime, name, data, hierarchy):
  global loaders
  loaders.append("%s = document.getElementById('%s');"%(
        '.'.join(hierarchy),name))
  if mode == 'embed':
    return '''<audio id="%s" preload="auto" style="display:none">
  <source src="%s" />
</audio>\n'''%(
    name, srcatr(mime, data)
    )
  else:
    return '''<audio id="%s" preload="auto" style="display:none">
  <source src="%s"/></audio>\n'''%(name, data)
def css_tag(name, data, hierarchy):
  global loaders
  loaders.append("%s = document.getElementById('%s');"%(
        '.'.join(hierarchy),name))

  if mode == 'embed':
    return '''<style id="%s" onload="this.disabled=true">\n%s</style>\n'''%(
      name, str(data, 'utf-8'),
      )
  else:
    return '<style id="%s" onload="this.disabled=true" src="%s"></style>\n'%(
      name, data)
def script_tag(name, data, hierarchy):
  #global loaders
  #loaders.append("%s = document.getElementById('%s');"%(
  #      '.'.join(hierarchy),name))

  if mode == 'embed':
    return '''<script id="%s">\n%s\n</script>\n'''%(
      name, str(data, 'utf-8'))
  else:
    return '<script id="%s" src="%s"></script>\n'%(name, data)

HANDLERS = {
  'jpg': (lambda fn,d,h: img_tag('image/jpeg', fn, d, h)),
  'png': (lambda fn,d,h: img_tag('image/png', fn, d, h)),
  'gif': (lambda fn,d,h: img_tag('image/gif', fn, d, h)),
  'svg': (lambda fn,d,h: img_tag('image/svg+xml', fn, d, h)),
  'txt': (lambda fn,d,h: txt_tag('text/plain;charset=UTF-8', fn, d, h)),
  'html':(lambda fn,d,h: txt_tag('text/html', fn, d, h)),
  'htm': (lambda fn,d,h: txt_tag('text/html', d, h)),
#  'yaml': (lambda fn,d: txt_tag('text/plain', fn, d)),
  'css': (lambda fn,d,h: css_tag(fn, d, h)),
  'js': (lambda fn,d,h: script_tag(fn, d, h)),
#  'json': (lambda fn,d: json_tag(fn, d)),
#  'yaml': (lambda fn,d: yaml_tag(fn, d)),
  'ogg': (lambda fn,d,h: audio_tag('audio/ogg', fn, d, h)),
  'wav': (lambda fn,d,h: audio_tag('audio/wav', fn, d, h)),
  'mp3': (lambda fn,d,h: audio_tag('audio/mpeg', fn, d, h)),
}

PREFIX = """
<!-- Included Resources Begin -->

<div style="display:none" id="_nse_loaded_objects"></div>

<script>
"use strict;"

let nse = {};
let con = {};

function _nse_json_loader(object_id, symbolic_name) {
  console.info("_nse_json_loader");
}

function _nse_yaml_loader(object_id, direct, hierarch, name) {
  //console.log("_nse_yaml_loader", object_id, direct);
  let object_contents = (direct?
      document.getElementById(object_id).innerHTML
    : document.getElementById(object_id).childNodes[0].innerHTML);
  
  //console.log(object_contents);


  hierarch[name] = jsyaml.load(object_contents);
}

function _nse_object_loader(object_id, new_div_id) {
  console.info("_nse_object_loader", object_id, new_div_id);
  let object_contents = document.getElementById(
      object_id).contentDocument.getElementsByTagName("body")[0].innerHTML;
  //console.info(object_contents);
  let destination = document.getElementById("_nse_loaded_objects");
  let new_div = document.createElement("div");
  new_div.setAttribute("id", new_div_id);
  new_div.innerHTML = object_contents;
  destination.appendChild(new_div);
}
</script>

"""
SUFFIX = """
<!-- Included Resources End -->
"""

TAG = "<!-- _NSE_RESOURCES -->"


if len(sys.argv) < 4 or mode not in ('link','embed'):
  print ("""
nse_embed - Assemble image, text/html, css, js and sound resources into a 
single HTML page for distribution. The comment <!-- _NSE_RESOURCES --> will be
replaced by the resources.

Usage: nse_embed embed outfile.html one/ or/ more/ directories/
e.g. nse_embed embed pcres.html sprites/ sounds/ text/ music.ogg graphics.png

Naming conventions: 
Images become <img> tags with an id corresponding to their directory
and filename, e.g:
  sprites/mons/packed.png
Becomes:
  <img id="sprites_mons_packed" ...>
  PNG and JPEG are recognized, with the extensions .png and .jpg.
Audio files are handled analogously.  OGG (Vorbis) and WAV are recognized
with the extensions .ogg and .wav. They naturally become invisible
<audio> tags with id formulated in the same way as with images.

Text (.txt or .html files) become (invisible) <div>s.

Style sheets (.css) become <style> tags.
Style sheets are disabled (onload="this.disabled=true") by default.

Scripts (.js) are included inside <script> tags, and are not disabled
in any way.

Symbolic links are not followed.

Note that one should not have two files with the same name and different
extensions in the same directory, since otherwise the ID will not be unique.
The script tries to detect this and issue a warning.

""".strip(), file=sys.stderr)
  sys.exit(-1)

seen_ids = {}
loaders = []

template_start, template_end = open(
  sys.argv[2], 'r').read().split(TAG)

used_YAML = False


output_file = open(sys.argv[2].replace('.html', '.pack.html'), 'w')
print (template_start, file = output_file)
print (PREFIX, file = output_file)

directories = sys.argv[3:]

hierarchy = {}

for directory in directories:
  #hierarchy[directory] = {}
  for root, dirs, files in os.walk(directory):
    dpath = [x for x in full_split(root) if x]

    path_prefix = '_'.join(dpath)
    for filen in files:
      basename,typeext = os.path.splitext(filen)
      #print ("**", dpath+[basename])
      typeext = typeext.lower()[1:]
      #print (os.path.join(root,filen))
      if typeext not in HANDLERS:
        print ("Ignoring unknown type of file: `%s'"%filen, file=sys.stderr)
      else:
        datapath = os.path.join(root,filen)
        data = open(datapath, 'rb') if mode == 'embed' else None
        idnm = path_prefix + '_' + basename
        if idnm in seen_ids:
          print ("Warning: duplicate ID: ", idnm, file=sys.stderr)
        seen_ids[idnm] = True
        h = hierarchy
        for level in dpath:
          if not level in h:
            h[level] = {}
          h = h[level]
        tag = HANDLERS[typeext](
          idnm, data.read() if mode == 'embed' else datapath, dpath+[basename])
        if mode == 'embed': data.close()
        print (tag.encode("utf-8"), file=output_file)
#print (hierarchy)
if used_YAML:
  print ("<!-- YAML Support required. js-yaml (C) (C) 2011-2015 by Vitaly Puzrin -->", 
         file = output_file)


print ("<!-- Loaders for linked objects -->\n<script>\nfunction _nse_loaders() {\n", file=output_file)

print ("  //Create object hierarchy", file=output_file)
for toplevel in hierarchy.keys():
  print ("  %s = %s"%(toplevel, json.dumps(hierarchy[toplevel])), file=output_file)

for loader in loaders:
  print ("  "+loader, file=output_file)
print ("\n}\n", file=output_file)
print ("""
window.onload = function () {
  _nse_loaders();
  main();
};
</script>""", file=output_file)
print (SUFFIX, file = output_file)
print (template_end, file = output_file)
output_file.close()
