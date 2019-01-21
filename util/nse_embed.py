#!/usr/bin/env python3
#
#    This file is part of the Nonsanc Project.
#    (C) 2018-2019 Gnostic Instruments, Inc.
#    Author(s): Bryce Schroeder, bryce@gnosticinstruments.com
#
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

def img_tag(mime, name, data):
  return '<img id="%s" style="display:none" src="%s">\n'%(
    name, srcatr(mime, data))

def txt_tag(mime, name, data):
  global loaders
  if mode == 'embed':
    return '<div id="%s" style="display:none">%s</div>\n'%(
      name, str(data, 'utf-8'))
  else:
    loaders.append("_nse_object_loader('_nse_%s', '%s');"%(name,name))
    return '''<object id="_nse_%s" type="%s" data="%s" style="display:none"
 onload="_nse_object_loader('_nse_%s', '%s')">
      </object>\n'''%(
      name, mime, data,name,name)

def json_tag(name, data):
  global loaders
  if mode == 'embed':
    data = json.loads(str(data, 'utf-8'))
    return '''<script>\nnse_res["%s"] = %s;\n</script>\n'''%(
      name, json.dumps(data))
  else:
    return '''<object id="_nse_%s" type="application/json" data="%s" style="display:none"
 onload="_nse_json_loader('_nse_%s', '%s')">
      </object>\n'''%(
      name, data,name,name)


def audio_tag(mime, name, data):
  if mode == 'embed':
    return '''<audio id="%s" preload="auto" style="display:none">
  <source src="%s" />
</audio>\n'''%(
    name, srcatr(mime, data)
    )
  else:
    return '''<audio id="%s" preload="auto" style="display:none">
  <source src="%s"/></audio>\n'''%(name, data)
def css_tag(name, data):
  if mode == 'embed':
    return '''<style id="%s" onload="this.disabled=true">\n%s</style>\n'''%(
      name, str(data, 'utf-8'),
      )
  else:
    return '<style id="%s" onload="this.disabled=true" src="%s"></style>\n'%(
      name, data)
def script_tag(name, data):
  if mode == 'embed':
    return '''<script id="%s">\n%s\n</script>\n'''%(
      name, str(data, 'utf-8'))
  else:
    return '<script id="%s" src="%s"></script>\n'%(name, data)

HANDLERS = {
  'jpg': (lambda fn,d: img_tag('image/jpeg', fn, d)),
  'png': (lambda fn,d: img_tag('image/png', fn, d)),
  'gif': (lambda fn,d: img_tag('image/gif', fn, d)),
  'svg': (lambda fn,d: img_tag('image/svg+xml', fn, d)),
  'txt': (lambda fn,d: txt_tag('text/plain', fn, d)),
  'html':(lambda fn,d: txt_tag('text/html', fn, d)),
  'htm': (lambda fn,d: txt_tag('text/html', d)),
  'css': (lambda fn,d: css_tag(fn, d)),
  'js': (lambda fn,d: script_tag(fn, d)),
#  'json': (lambda fn,d: json_tag(fn, d)),
  'yaml': (lambda fn,d: yaml_tag(fn, d)),
  'ogg': (lambda fn,d: audio_tag('audio/ogg', fn, d)),
  'wav': (lambda fn,d: audio_tag('audio/wav', fn, d)),
  'mp3': (lambda fn,d: audio_tag('audio/mpeg', fn, d)),
}

PREFIX = """
<!-- Included Resources Begin -->

<div style="display:none" id="_nse_loaded_objects"></div>

<script>
"use strict;"

let nse_res = {};

function _nse_json_loader(object_id, symbolic_name) {
  console.info("_nse_json_loader");
}

function _nse_object_loader(object_id, new_div_id) {
  //console.info("_nse_object_loader");
  //console.info(object_id);
  //console.info(new_div_id);
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




output_file = open(sys.argv[2].replace('.html', '.pack.html'), 'w')
print (template_start, file = output_file)
print (PREFIX, file = output_file)

directories = sys.argv[3:]


for directory in directories:
  for root, dirs, files in os.walk(directory):
    path_prefix = '_'.join([x for x in root.split(os.path.sep) if x])
    for filen in files:
      basename,typeext = os.path.splitext(filen)
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
        tag = HANDLERS[typeext](
          idnm, data.read() if mode == 'embed' else datapath)
        if mode == 'embed': data.close()
        output_file.write(tag)

#if mode == 'link':
#  print ("<!-- Loaders for linked objects -->\n<script>", file=output_file)
#  for loader in loaders:
#    print (loader, file=output_file)
#  print ("</script>", file=output_file)
print (SUFFIX, file = output_file)
print (template_end, file = output_file)
output_file.close()
