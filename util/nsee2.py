#!/usr/bin/env python3
#
#    This file is part of the Nonsanc Project.
#    (C) 2019 Gnostic Instruments, Inc.
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
TAG = "<!-- _NSE_RESOURCES -->"
USAGE_TEXT = """
nsee2 template_file.html resource-root-1/ [root-2/ ... root-n/]

Replaces a special HTML comment in the provided template_file with
the resources in the directories provided as subsequent command line
arguments. Specifically, the comment "<!-- NSEE2 -->", which should be
placed in the header section, is replaced with the resources. 
For a more detailed explanation of how nsee2 works, see:
  https://github.com/BryceSchroeder/nonsanc/wiki
""".strip()

JAVASCRIPT_KEYWORDS = """
break case catch continue debugger default delete do else finally for
function if in instanceof new return switch this throw try typeof var void
while with class const enum export extends import super implements let
interface package private protected public static yield null true false 
NaN Infinity undefined console int byte char goto long final float short
double native throws boolean abstract volatile transient synchronized
""".strip().split()

# ------------------------------------------------------------------------

import os, sys, base64, json, time, io
import os.path
ENABLE_CACHE = True
HAS_YAML = False
try:
  import yaml
  HAS_YAML = True
except ImportError:
  print ("Could not import yaml, YAML support disabled.", file=sys.stderr)

  

def full_split(pth):
  r = []
  while True:
    a,b = os.path.split(pth)
    pth = a
    r.insert(0,b)
    if not a: break
  return [p for p in r if p]


# ------------------------------------------------------------------------

class Leaf:
  """Base class for representing a leaf (individual resource) of the 
     resource tree."""
  extensions = ['txt']
  name = "GENERIC"
  def __init__(self, file_name):
    self.file_name = file_name 
    #print ("Leaf parent class called for", file_name, file=sys.stderr)
  def __repr__(self):
    return "<%s>"%(self.file_name)
  def embed(self, left_side, target):
    target.write("%s = null;\n"%('.'.join(left_side)));
  def begin_type(self, target):
    target.write("/* BEGIN Resource type: %s */\n"%self.name)
  def end_type(self, target):
    target.write("/* END Resource type: %s */\n"%self.name)
  def is_up_to_date(self):
    if not ENABLE_CACHE: return False
    if not os.path.exists(self.file_name+".cache"): return False
    cache_mtime = os.path.getmtime(self.file_name+".cache")
    source_mtime = os.path.getmtime(self.file_name)
    return source_mtime < cache_mtime 
  def embed_cached(self, target):
    cache_data = open(self.file_name+".cache", 'rb').read()
    target.write(str(cache_data, 'utf-8'))
    

class ObjectLeaf(Leaf):
  extensions = []
  name = "OBJECT"
  def __init__(self, prefix, class_path, instance_paths):
    self.file_name = class_path
    self.class_name = prefix[-1]
    self.instance_names = instance_paths 
  def embed(self, left_side, target):
    lhs = '.'.join(left_side)
    #target.write("<script id='_%s_loader'>\n"%self.class_name)
    target.write("%s = {};\n"%(lhs))
    data = open(self.file_name,'r').read() # Class path
    target.write(data)
    target.write("/* Instances of %s: */\n"%self.class_name)
    for instance in self.instance_names:
      data = open(instance,'r').read() # instance json
      instance_name = full_split(instance)[-1].split('.')[0]
      instance_extension = full_split(instance)[-1].split('.')[-1]
      if instance_extension == 'yaml':
        if not HAS_YAML:
          print ("No YAML support but %s exists."%instance, file=sys.stderr)
          sys.exit(-3)
        data = json.dumps(yaml.safe_load(data))
      target.write("%s.%s = new %s();\n"%(lhs, instance_name, 
                                          self.class_name))
      target.write("Object.assign(%s.%s, JSON.parse(atob('"%(
        '.'.join(left_side), instance_name))
      target.write(str(base64.b64encode(bytes(data, 'utf-8')), 'utf-8'))
      target.write("')));\n")
      #target.write("</script>\n")
  def is_up_to_date(self):
    if not os.path.exists(self.file_name+".cache"): return False
    cache_mtime = os.path.getmtime(self.file_name+".cache")
    for source in [self.file_name, *self.instance_names]:
      source_mtime = os.path.getmtime(source)
      if source_mtime > cache_mtime: return False
    return True


class TextLeaf(Leaf):
  name = "TEXT"
  extensions = ['html', 'htm', 'txt']
  def embed(self, left_side, target):
    data = open(self.file_name,'r').read()
    target.write("%s = atob('"%('.'.join(left_side)))
    target.write(str(base64.b64encode(bytes(data, 'utf-8')), 'utf-8'))
    target.write("');\n")

class StyleLeaf(Leaf):
  name = "STYLE"
  extensions = ['css']
  def embed(self, left_side, target):
    lhs = '.'.join(left_side)
    data = open(self.file_name,'r').read()

    target.write("%s = document.createElement('style');\n"%lhs)
    target.write("%s.type = 'text/css';\n"%lhs)
    target.write("%s.disabled = true;\n"%lhs)
    target.write("%s.innerHTML = atob('"%lhs)
    target.write(str(base64.b64encode(bytes(data, 'utf-8')), 'utf-8'))
    target.write("');\n")



class DataLeaf(Leaf):
  name = "DATA"
  extensions = ['yaml', 'json']
  def __init__(self, file_name):
    self.file_name = file_name
    self.format = file_name.split('.')[-1].lower()
    if "yaml" == self.format and not HAS_YAML:
      print("No YAML support, but file %s exists"%file_name, file=sys.stderr)
      sys.exit(-2)
  def embed(self, left_side, target):
    lhs = '.'.join(left_side)
    data = open(self.file_name,'r').read()
    if self.format == 'yaml':
      data = json.dumps(yaml.load(data))
    target.write("%s = JSON.parse(atob('"%lhs)
    target.write(str(base64.b64encode(bytes(data, 'utf-8')), 'utf-8'))
    target.write("'));\n")

    


class ImageLeaf(Leaf):
  name = "IMAGE"
  extensions = ['png', 'jpg', 'jpeg', 'gif', 'svg']
  MIME = {
    "jpg": 'image/jpeg',
    "jpeg": 'image/jpeg',
    "gif": 'image/gif',
    "svg": 'image/svg+xml',
    "png": 'image/png'
  }
  def __init__(self, file_name):
    self.file_name = file_name
    self.mime = self.MIME[file_name.split('.')[-1].lower()]
  def embed(self, left_side, target):
    lhs = '.'.join(left_side)
    data = open(self.file_name, 'rb').read()
    target.write("%s = new Image();\n"%lhs)
    target.write("%s.src = 'data:%s;base64,"%(lhs, self.mime));
    target.write(str(base64.b64encode(data), 'utf-8'))
    target.write("';\n");
    

class SoundLeaf(Leaf):
  name = "SOUND"
  extensions = ['wav', 'ogg', 'mp3']
  MIME = {
    "wav": 'audio/vnd.wav',
    "ogg": 'audio/ogg',
    "mp3": 'audio/mpeg',
  }
  def __init__(self, file_name):
    self.file_name = file_name
    self.mime = self.MIME[file_name.split('.')[-1].lower()]

  def embed(self, left_side, target):
    lhs = '.'.join(left_side)
    data = open(self.file_name, 'rb').read()
    target.write("%s = new Audio();\n"%lhs)
    target.write("%s.src = 'data:%s;base64,"%(lhs, self.mime));
    target.write(str(base64.b64encode(data), 'utf-8'))
    target.write("';\n");

class ScriptLeaf(Leaf):
  name = "SCRIPT"
  extensions = ['js', 'es6']
  def embed(self, left_side, target):
    #target.write( '<script id="%s">\n'%'.'.join(left_side))
    target.write(open(self.file_name,'r').read())
    #target.write('</script>\n')

# ------------------------------------------------------------------------

class ResourceTree:
  """Class for representing and organizing the resource tree for
     embedding."""
  leaf_node_classes = [TextLeaf, StyleLeaf, DataLeaf, ImageLeaf, 
                       SoundLeaf, ScriptLeaf]
  def __init__(self):
    self.tree = {}
    self.index = {}
  def find_leaf_class(self, extension):
    for leaf_class in self.leaf_node_classes:
      if extension in leaf_class.extensions: return leaf_class
    return None
  def make_prefix_path(self, *path):
    tree = self.tree
    for level in path:
      if level not in tree: tree[level] = {}
      tree = tree[level]
    return tree
  def write_hierarchy(self, target, tree, path=[]):
    if not path: target.write("<!-- Global NSEE2 Hierarchy -->\n")
    for branch in tree:
      subpath = [*path, branch]
      if isinstance(tree[branch], dict):
        target.write("%s = {};\n"%('.'.join(subpath)))
        self.write_hierarchy(target, tree[branch], subpath)

  def add_object_class(self, prefix, class_path, instances):
    #print("Object class added", '.'.join(prefix), class_path, instances)
    node = self.make_prefix_path(*prefix[:-1])
    node[prefix[-1]] = ObjectLeaf(prefix, class_path, instances)

  def add(self, prefix, file_path, resource_name, extension):
    LeafClass = self.find_leaf_class(extension)
    node = self.make_prefix_path(*prefix)
    if resource_name in node:
      print ("Warning: replacing non-unique resource name '{}' in {}".format(
             resource_name, prefix), file=sys.stderr)
    node[resource_name] = LeafClass(file_path)

  def traverse(self, tree, prefix = []):
    results = []
    for branch in tree:
      if not branch.isidentifier():
        print ("Warning: `"+branch+"' is not a valid identifier.",
               file = sys.stderr)
      if branch in JAVASCRIPT_KEYWORDS:
        print ("Warning: `"+branch+"' may be a JS keyword.",
               file = sys.stderr)
      if isinstance(tree[branch], Leaf): 
        results.append((tree[branch].__class__, tree[branch], 
                        prefix + [branch,]))
      else:
        results.extend(self.traverse(tree[branch], prefix + [branch,]))
    return results

  def resources_by_class(self):
    res_by_class = {}
    for Class, leaf, path in self.traverse(self.tree):
      if not Class in res_by_class: res_by_class[Class] = []
      res_by_class[Class].append((leaf, path))
    return res_by_class
    
  def embed(self, target):
    print ("<!-- NSEE2 Resources -->\n<script>", file=target)
    res_by_class = self.resources_by_class()
    self.write_hierarchy(target, self.tree)
    for Class, resources in res_by_class.items():
      Class.begin_type(Class, target)
      for resource, path in resources:
        canon_name = '.'.join(path)
        begin = target.tell()
        if resource.is_up_to_date():
          #print ("Resource", canon_name, "is up to date")
          resource.embed_cached(target)
        else:
          print ("Resource", canon_name, "had been modified")
          cache = io.StringIO()
          resource.embed(path, cache)
          cache.seek(0)
          target.write(cache.read())
          cache.seek(0)
          cache_file = open(resource.file_name+".cache",'wb')
          cache_file.write(bytes(cache.read(), 'utf-8'))
          cache_file.close()
          cache.close()
          
          
        self.index[canon_name] = (begin, target.tell(), time.time())
      Class.end_type(Class, target)
    target.write("</script>\n")

# ------------------------------------------------------------------------
if '--no-cache' in sys.argv:
  ENABLE_CACHE = False
  sys.argv.remove('--no-cache')
# Gather arguments
if len(sys.argv) < 3:
  print(USAGE_TEXT, file=sys.stderr)
  sys.exit(-1)





template_path = sys.argv[1]
root_paths = sys.argv[2:]

resource_tree = ResourceTree()

for root_path in root_paths:
  for root, dirs, file_paths in os.walk(root_path):
    # detect if this is an object class directory
    dn =  full_split(root)[-1] + '.js'
    if dn in file_paths:
      instances = []
      for file_path in file_paths:
        if file_path == dn: continue
        extension = file_path.split('.')[-1].lower() if '.' in file_path else ''
        full_path = os.path.join(root,file_path)
        if extension in ['json', 'yaml']:
          instances.append(full_path)
        elif extension == 'cache':
          pass
        else:
          print("Warning: ignoring non-data file '%s' in object class dir."%(
            full_path))
      resource_tree.add_object_class(full_split(root),
                                     os.path.join(root,dn), instances)
      continue

    # This is not an object class directory
    for file_path in file_paths:
      full_path = os.path.join(root,file_path)
      file_path_split = file_path.split('.')
      extension = file_path_split[-1].lower() if '.' in file_path else ''
      resource_name = file_path_split[0]
      if resource_name == 'nsee_index': continue
      prefix = full_split(root)
      if resource_tree.find_leaf_class(extension):
        resource_tree.add(prefix, full_path, resource_name, extension)
        #print ("Add Prefix: {}, File: '{}', Extension: '{}'".format(
        #  prefix, full_path, extension))
      else:
        #print ("Ignoring unrecognized file '%s', unknown type '%s'"%(
        #       full_path, extension), file=sys.stderr)
        pass


# Load template
template_before, template_after = open(sys.argv[1], 'r').read().split(TAG)

# Prepare the output file.
output_file_path = sys.argv[1].replace('.html', '.pack.html', -1)
output_file = open(output_file_path, 'w')
output_file.write(template_before)
resource_tree.embed(output_file)
output_file.write(template_after)
#for (res, (begin, end, mtime)) in resource_tree.index.items():
#  print (res, begin, end, mtime)

