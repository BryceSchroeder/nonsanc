nse\_embed is a utility for combining resources/assets (images, sounds, scripts, stylesheets, and text) into a single HTML file. No external files are required; the resource data is encoded in Base64 data URIs.

Usage:

`nse_embed embed templatefile.html directories/ containing/ resources/`

This produces an output file called (in this example) `templatefile.pack.html` which contains the embedded resources replacing a special HTML comment, `<!-- _NSE_RESOURCES -->` in `templatefile.html`.

The resources receive a DOM ID based on their filename. For example, if a resource is in `sprites/mons2.png`, then the ID of the resulting tag will be `<img id="sprites_mons2">`.

Resource types, and the tags they use, are inferred from the file extension (case insensitive):
 * `png`, `gif`, `jpg`: Become (hidden) `<img>` tags.
 * `ogg`, `mp3`, `wav`: Become (hidden) `<audio>` tags.
 * `css`: Becomes a `<style>` tag, which will be disabled with its `onload`.
 * `js`: Becomes a `<script>` tag.
 * `json`, `yaml`: Raw text becomes a hidden `<div>` or `<object>`, but the interpreted contents are accessible through the object hierarchy described below.
 * `html`, `txt`, `htm`: Becomes a (hidden) `<div>` tag with the contents. (If you have an explicit `body` tag in the file, the contents of this tag will be placed into the `<div>`.)

In relation to scripts, note that whereas nse\_embed prevents any of the other resources from being visible/active until you explicitly invoke them later on, scripts will be interpreted by the browser as they are loaded. You should ensure that their behaviour is well-defined when this happens in an arbitrary loading order. So, e.g. it is fine if they define functions or data you will use later, but you need to be careful if they actually _do_ anything upon evaluation.

In addition to accessing the resources via the DOM (e.g. with `.getElementById()`), they are made available through a global object for each top level directory, as, e.g. `res.scn.map.outside` for a file `res/scn/map/outside.txt` JSON and YAML objects are _only_ available in this way.

Besides the `embed` mode described above, it can also be invoked with `link`, i.e:

`nse_embed link templatefile.html directories/ containing/ resources/`

In that case, the resulting `templatefile.pack.html` will not contain the resources embedded in it, but instead will have the resources linked. That way, you can modify them and just reload the page in your browser, rather than having to run nse\_embed again. Note that nse\_embed must be run from the directory containing `templatefile.html` for the resulting relative links to be correct. This is intended for debugging purposes; for convenient distribution, one should generally use `embed`. Note that if you add _new_ resources, you will still have to rerun nse\_embed.
