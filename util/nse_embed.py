#!/usr/bin/env python3
#
#    This file is part of the Nonsanc Project.
#    (C) 2018 Gnostic Instruments, Inc.
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
import sys, os, base64

def img_tag(mime, name, data):
  return '<img id="%s" style="visibility:hidden" src="data:%s;base64,%s">\n'%(
    name, mime, str(base64.b64encode(data), 'utf-8')
    )

def txt_tag(name, data):
  return '<div id="%s" style="visibility:hidden">%s</div>\n'%(
    name, str(data, 'utf-8').strip())

def audio_tag(mime, name, data):
  return '''<audio id="%s" preload="auto" style="visibility:hidden">
      <source src="data:%s;base64,%s" />
      </audio>\n'''%(
    name, mime, str(base64.b64encode(data), 'utf-8')
    )
def css_tag(name, data):
  return '''<style id="%s" onload="this.disabled=true">\n%s</style>\n'''%(
    name, str(data, 'utf-8')
    )
def script_tag(name, data):
  return '''<script id="%s">\n%s\n</script>\n'''%(
    name, str(data, 'utf-8')
    )

HANDLERS = {
  'jpg': (lambda fn,d: img_tag('image/jpeg', fn, d)),
  'png': (lambda fn,d: img_tag('image/png', fn, d)),
  'gif': (lambda fn,d: img_tag('image/gif', fn, d)),
  'svg': (lambda fn,d: img_tag('image/svg+xml', fn, d)),
  'txt': (lambda fn,d: txt_tag(fn, d)),
  'html':(lambda fn,d: txt_tag(fn, d)),
  'htm': (lambda fn,d: txt_tag(fn, d)),
  'css': (lambda fn,d: css_tag(fn, d)),
  'js': (lambda fn,d: script_tag(fn, d)),
  'ogg': (lambda fn,d: audio_tag('audio/ogg', fn, d)),
  'wav': (lambda fn,d: audio_tag('audio/wav', fn, d)),
  'mp3': (lambda fn,d: audio_tag('audio/mpeg', fn, d)),
}

PREFIX = """
<!-- Embedded Resources Begin -->
"""
SUFFIX = """
<!-- Embedded Resources End -->
"""


if len(sys.argv) < 3:
  print("""
nse-embed - Assemble image, text/html, css, js and sound resources into a 
single HTML page for distribution.

Usage: nse-embed outfile.html one/ or/ more/ directories/ or files to include
e.g. nse-embed pcres.html sprites/ sounds/ text/ music.ogg graphics.png

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

output_file = open(sys.argv[1], 'w')
print (PREFIX, file = output_file)

directories = sys.argv[2:]


for directory in directories:
  for root, dirs, files in os.walk(directory):
    path_prefix = '_'.join([x for x in os.path.split(root) if x])
    for filen in files:
      basename,typeext = os.path.splitext(filen)
      typeext = typeext.lower()[1:]
      #print (os.path.join(root,filen))
      if typeext not in HANDLERS:
        print ("Ignoring unknown type of file: `%s'"%filen, file=sys.stderr)
      else:
        data = open(os.path.join(root,filen), 'rb')
        idnm = path_prefix + '_' + basename
        if idnm in seen_ids:
          print ("Warning: duplicate ID: ", idnm, file=sys.stderr)
        seen_ids[idnm] = True
        tag = HANDLERS[typeext](idnm, data.read())
        data.close()
        output_file.write(tag)


print (SUFFIX, file = output_file)
output_file.close()
