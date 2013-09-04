<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; Charset=UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=EDGE,chrome=1"/>
	<title>HTML5 &amp; CSS3 Project</title>
	<script src="Static/JavaScript/Modernizr.js">//Modernizr JS</script>
	<?PHP
	include 'FetchCDN/index.php';
	exportjs('TweenMax.min.js');
	?></head>
<body>

<link rel="stylesheet" type="text/css" href="Static/CSS/global_reset.css"/>
<link rel="stylesheet" type="text/css" href="Static/CSS/normalize.css"/>
<link rel="stylesheet" type="text/css" href="Static/CSS/demo.css"/>
<link rel="stylesheet" type="text/css" href="Static/CSS/component.css"/>
<link rel="stylesheet" type="text/css" href="Static/CSS/GradientGenerator.css"/>
<script type="text/javascript" src="GradientGenerator/JavaScript/prototype.js"></script>
<script type="text/javascript" src="GradientGenerator/JavaScript/combo.js"></script>
<script type="text/javascript" src="GradientGenerator/JavaScript/ContextMenu.js"></script>
<script type="text/javascript" src="GradientGenerator/JavaScript/ColorZilla.js"></script>
<script type="text/javascript" src="GradientGenerator/JavaScript/GradientDatabase.js"></script>
<script type="text/javascript" src="GradientGenerator/JavaScript/CSSGradientEditor.js"></script>
<script type="text/javascript" src="GradientGenerator/JavaScript/base64.js"></script>
<script type="text/javascript" src="GradientGenerator/JavaScript/ColorMethods.js"></script>
<script type="text/javascript" src="GradientGenerator/JavaScript/ZeroClipboard.js"></script>
<script type="text/javascript" src="GradientGenerator/JavaScript/FlashDetect.js"></script>
<style type="text/css">
	.content { margin: 200px 150px; }
</style>
<ul id="gn-menu" class="gn-menu-main">
	<li class="gn-trigger">
		<a class="gn-icon gn-icon-menu"><span>Menu</span></a>
		<nav class="gn-menu-wrapper">
			<div class="gn-scroller">
				<ul class="gn-menu">
					<li class="gn-search-item">
						<input placeholder="Search" type="search" class="gn-search">
						<a class="gn-icon gn-icon-search"><span>Search</span></a>
					</li>
					<li>
						<a class="gn-icon gn-icon-download">Downloads</a>
						<ul class="gn-submenu">
							<li><a class="gn-icon gn-icon-illustrator">Vector Illustrations</a></li>
							<li><a class="gn-icon gn-icon-photoshop">Photoshop files</a></li>
						</ul>
					</li>
					<li><a class="gn-icon gn-icon-cog">Settings</a></li>
					<li><a class="gn-icon gn-icon-help">Help</a></li>
					<li>
						<a class="gn-icon gn-icon-archive">Archives</a>
						<ul class="gn-submenu">
							<li><a class="gn-icon gn-icon-article">Articles</a></li>
							<li><a class="gn-icon gn-icon-pictures">Images</a></li>
							<li><a class="gn-icon gn-icon-videos">Videos</a></li>
						</ul>
					</li>
				</ul>
			</div>
			<!-- /gn-scroller -->
		</nav>
	</li>
	<li><a href="http://tympanus.net/codrops">Codrops</a></li>
	<li>
		<a class="codrops-icon codrops-icon-prev" href="http://tympanus.net/Development/HeaderEffects/"><span>Previous Demo</span></a>
	</li>
	<li>
		<a class="codrops-icon codrops-icon-drop" href="http://tympanus.net/codrops/?p=16030"><span>Back to the Codrops Article</span></a>
	</li>
</ul>
<div class="content">

<div id="editor-heading" class="info-panel">
	<h1>Ultimate CSS Gradient Generator</h1>

	<p>
		A powerful Photoshop-like CSS gradient editor from <a href="/">ColorZilla</a>.
	</p>
</div>
<div id="gradient-control-1" class="gradient-control cl">
<div class="presets dialog-panel cl noselect">
	<div class="panel-label">Presets</div>
	<div class="presets-container"></div>
</div>
<div class="gradient-name">
	Name: <input class="name-input" type="text">
	<button class="save-new-preset" autocomplete="off">save</button>
</div>
<div class="stop-details dialog-panel cl">
	<div class="panel-label">Stops</div>
	<div class="stop-details-opacity cl">
		<div class="details-panel">
			<div class="opacity-label stop-type-label">Opacity:</div>
			<input size="3" class="opacity-value">
			<div class="opacity-adjust-open-button"></div>
		</div>
		<div class="details-panel position-details">Location: <input size="3" class="position opacity-position">%
		</div>
		<div class="details-panel delete-button">
			<button autocomplete="off">delete</button>
		</div>
	</div>

	<div class="stop-details-color cl">
		<div class="details-panel">
			<div class="color-label stop-type-label">Color:</div>
			<div class="color"></div>
		</div>
		<div class="details-panel position-details">Location: <input size="3" class="position color-position">%
		</div>
		<div class="details-panel delete-button color-delete-button">
			<button autocomplete="off">delete</button>
		</div>
	</div>
</div>
<div class="gradient-group-panel">
	<div class="stop-markers-deleter stop-markers-opacity-deleter noselect"></div>
	<div class="stop-markers stop-markers-opacity noselect" title="Click to add an opacity stop"></div>
	<div class="gradient-panel-background gradient-background"><div class="gradient-panel noselect cl"></div></div>
	<div class="stop-markers stop-markers-color noselect" title="Click to add a color stop"></div>
	<div class="stop-markers-deleter stop-markers-color-deleter noselect"></div>
</div>
<div class="column left cl">

	<div class="gradient-adjustments-panel dialog-panel cl">
		<div class="panel-label">Adjustments</div>

		<div class="adjustment-ops-panel">
			<button class="adjust-hue-sat" autocomplete="off">hue/saturation...</button>
			<button class="adjust-reverse" autocomplete="off">reverse</button>
		</div>


		<div class="adjust-hue-saturation-panel inner-sub-panel cl" style="display:none">
			<div class="hue-adjust-container adjustment-slider-control-containter">
				<span class="adjustment-slider-title">Hue:</span>
				<input class="hue-adjust-value adjustment-slider-value" type="text" value="0">

				<div class="hue-adjust-bar-container adjustment-slider-bar-containter noselect">
					<div class="hue-adjust-bar adjustment-slider-bar"></div>
				</div>
			</div>

			<div class="sat-adjust-container adjustment-slider-control-containter">
				<span class="adjustment-slider-title">Saturation:</span>
				<input class="sat-adjust-value adjustment-slider-value" type="text" value="0">

				<div class="sat-adjust-bar-container adjustment-slider-bar-containter noselect">
					<div class="sat-adjust-bar adjustment-slider-bar"></div>
				</div>
			</div>

			<div class="light-adjust-container adjustment-slider-control-containter">
				<span class="adjustment-slider-title">Lightness:</span>
				<input class="light-adjust-value adjustment-slider-value" type="text" value="0">

				<div class="light-adjust-bar-container adjustment-slider-bar-containter noselect">
					<div class="light-adjust-bar adjustment-slider-bar"></div>
				</div>
			</div>

			<div class="dialog-button-panel">
				<button class="ok" autocomplete="off">ok</button>
				<button class="cancel" autocomplete="off">cancel</button>
			</div>

		</div>

	</div>



</div>
<!-- left col -->

<div class="column right cl">
	<div class="preview dialog-panel cl">
		<div class="panel-label">Preview</div>
		<div class="preview-panel-background gradient-background">
			<div class="preview-panel"></div>
			<div class="preview-panel-handle"></div>
		</div>
		<div class="output-options">
			Orientation:
			<select class="orientation">
				<option value="horizontal">horizontal&nbsp;&nbsp;&#8594;</option>
				<option value="vertical">vertical&nbsp;&nbsp;&#8595;</option>
				<option value="diagonal">diagonal&nbsp;&nbsp;&#8600;</option>
				<option value="diagonal-bottom">diagonal&nbsp;&nbsp;&#8599;</option>
				<option value="radial">radial&nbsp;&nbsp;&#9675;</option>
			</select>
			<span class="label">Size: </span>
			<input class="dimension dimension-width" type="text" value="350">
			x
			<input class="dimension dimension-height" type="text" value="50">

			<input type="checkbox" class="preview-as-ie"> <span class="preview-as-ie">IE</span>

		</div>

	</div>

	<style>
		.loop-panel { padding: 1em; font-size: 12px; line-height: 135%; }
		.loop-title { font-weight: bold }
		.loop-image { float: left; margin: 0 1em 1em 0; }
	</style>
	<div class="dialog-panel cl" id="loop-dialog" style="display:none">
		<div class="panel-label">A message from the creator of this site</div>
		<div class="loop-panel">
			<div class="loop-image">
				<a href="http://www.loopcommerce.com/jobs/join"><img src="http://www.loopcommerce.com/images/girl-130x100.jpg" width="130" height="100" alt="Loop"></a>
			</div>
			<div class="loop-title">
				Join Loop
			</div>
			<div class="loop-content">
				Would you like to be a key part of something really awesome and big? Are you an amazing front-end developer or designer? My new company is looking for you -
				<a href="http://www.loopcommerce.com/jobs/join">learn more here</a>.
			</div>
		</div>
	</div>

	<div class="dialog-panel cl">
		<div class="panel-label">Permalink</div>
		<div class="permalink-panel">
			Link to, save or share the current gradient using its
			<a href="#" target="_blank" class="permalink">unique link</a>.
		</div>
	</div>

</div>
<!-- right col -->


<div class="css-output dialog-panel cl">
	<div class="panel-label current-output-format">CSS</div>
	<div class="panel-label right"><a href="#" class="switch-output-format">switch to sass</a></div>
	<div class="css-output-text-container">
		<div class="css-output-text initial">
			<div>background: -moz-linear-gradient(); /* FF3.6+ */</div>
			<div>background: -webkit-gradient(); /* Chrome,Safari4+ */</div>
			<div>background: -webkit-linear-gradient(); /* Chrome10+,Safari5.1+ */</div>
			<div>background: -o-linear-gradient(); /* Opera 11.10+ */</div>
			<div>background: -ms-linear-gradient(); /* IE10+ */</div>
			<div>background: linear-gradient(); /* W3C */</div>
			<div>filter: progid:DXImageTransform.Microsoft.gradient(); /* IE6-9 */</div>
		</div>
		<div class="copy-status-container cl">
			<div class="copy-status" style="display:none">&#10004; copied to clipboard</div>
		</div>
		<div class="copy-button-container cl">
			<div class="copy-button noselect">copy</div>
		</div>
	</div>
	<div class="css-notes" style="display:none;">
		<span class="css-notes-text"></span>

		<div class="small-close-button"></div>
	</div>
	<div class="css-options cl">
		<div class="import-buttons cl">
			<button class="import import-css" autocomplete="off">import from css</button>
			<button class="import import-image" autocomplete="off">import from image</button>
		</div>
		Color format:
		<select class="color-format">
			<option>hex</option>
			<option>rgb</option>
			<option>rgba</option>
			<option>hsl</option>
			<option>hsla</option>
		</select>
		<input type="checkbox" id="css-comments" class="css-comments">
		<label for="css-comments" class="css-comments">Comments</label>
		<input type="checkbox" id="css-ie9-support" class="css-comments">
		<label for="css-ie9-support" class="css-comments">IE9 Support</label>
		<span class="css-ie9-support-help"> (<a href="#">?</a>) </span>
	</div>
	<div class="inner-sub-panel import-css-input-panel cl" style="display:none">
		Enter existing gradient CSS to import.<br>Use Mozilla, Webkit, Opera, W3C or IE format.
		<textarea class="import-css-text"></textarea>

		<div class="dialog-button-panel">
			<button class="ok" autocomplete="off">import</button>
			<button class="cancel" autocomplete="off">cancel</button>
		</div>
	</div>
	<div class="inner-sub-panel import-image-input-panel cl" style="display:none">
		Import from an existing gradient image file.<br>This allows converting an image gradient to CSS.
		<p>

		<form class="import-image-form" enctype="multipart/form-data" action="/gradient-editor/import/" method="POST">
			<input type="hidden" name="MAX_FILE_SIZE" value="512000">
			upload a gradient image:<br>
			<input class="import-image-file-input" name="gradfile" type="file">

			<p>
				<strong>or</strong> specify gradient image URL: <br>
				<input class="import-image-url-input" name="gradurl" type="text">
		</form>

		<iframe id="import-image-upload-target" name="import-image-upload-target" src="" style="width:0;height:0;border:0px solid #fff;"></iframe>

		<div class="dialog-button-panel">
			<button class="ok" autocomplete="off">import</button>
			<button class="cancel" autocomplete="off">cancel</button>
		</div>

	</div>
</div>
</div>

<div id="transparent-screen" style="display:none"></div>
<div class="opacity-stop-adjust-container inner-sub-panel" style="display:none;">
	<div class="opacity-slider-container noselect">
		<div class="opacity-slider-bar-background gradient-background">
			<div class="opacity-slider-bar"></div>
		</div>
	</div>
</div>

<!-- COLOR PICKER -->
<div id="colorpicker-1" class="colorpicker dialog_content" style="display:none">
	<table>
		<tr>
			<td valign="top" class="color-map">
				<div id="cp1_ColorMap" style="width:256px;"></div>
			</td>
			<td valign="top" class="color-bar">
				<div id="cp1_ColorBar"></div>
			</td>

			<td valign="top" class="color-entry-boxes">

				<table>
					<tr>
						<td colspan="3">
							<div id="cp1_Preview" style="background-color: #fff; width: 60px; height: 60px; padding: 0; margin: 0; border: solid 1px #000;">
								<br/>
							</div>
						</td>
					</tr>

					<tr>
						<td colspan="3" height="10"></td>
					</tr>

					<tr>
						<td>
							<input type="radio" id="cp1_HueRadio" name="cp1_Mode" value="0"/>
						</td>
						<td>
							<label for="cp1_HueRadio">H:</label>
						</td>
						<td>
							<input type="text" id="cp1_Hue" value="0" style="width: 40px;"/> &deg;
						</td>
					</tr>

					<tr>
						<td>
							<input type="radio" id="cp1_SaturationRadio" name="cp1_Mode" value="1"/>
						</td>
						<td>
							<label for="cp1_SaturationRadio">S:</label>
						</td>
						<td>
							<input type="text" id="cp1_Saturation" value="100" style="width: 40px;"/> %
						</td>
					</tr>

					<tr>
						<td>
							<input type="radio" id="cp1_BrightnessRadio" name="cp1_Mode" value="2"/>
						</td>
						<td>
							<label for="cp1_BrightnessRadio">B:</label>
						</td>
						<td>
							<input type="text" id="cp1_Brightness" value="100" style="width: 40px;"/> %
						</td>
					</tr>

					<tr>
						<td colspan="3" height="5"></td>
					</tr>

					<tr>
						<td>
							<input type="radio" id="cp1_RedRadio" name="cp1_Mode" value="r"/>
						</td>
						<td>
							<label for="cp1_RedRadio">R:</label>
						</td>
						<td>
							<input type="text" id="cp1_Red" value="255" style="width: 40px;"/>
						</td>
					</tr>

					<tr>
						<td>
							<input type="radio" id="cp1_GreenRadio" name="cp1_Mode" value="g"/>
						</td>
						<td>
							<label for="cp1_GreenRadio">G:</label>
						</td>
						<td>
							<input type="text" id="cp1_Green" value="0" style="width: 40px;"/>
						</td>
					</tr>
					<tr>
						<td>
							<input type="radio" id="cp1_BlueRadio" name="cp1_Mode" value="b"/>
						</td>
						<td>
							<label for="cp1_BlueRadio">B:</label>
						</td>
						<td>
							<input type="text" id="cp1_Blue" value="0" style="width: 40px;"/>
						</td>
					</tr>
					<tr>
						<td colspan="3" height="5"></td>
					</tr>
					<tr>
						<td align="right">
							#:
						</td>
						<td colspan="2">
							<input type="text" id="cp1_Hex" value="FF0000" style="width: 60px;"/>
						</td>
					</tr>

				</table>
			</td>
			<td valign="top">
				<table>
					<tr>
						<td>
							<button class="dialog-button ok-button" autocomplete="off">OK</button>
						</td>
					</tr>
					<tr>
						<td>
							<button class="dialog-button cancel-button" autocomplete="off">Cancel</button>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</div>


<div id="tags">
	Tags: CSS Gradient Editor, CSS Gradient Generator, HTML5 Gradient Generator, CSS3 Gradient Generator, CSS Gradient Maker, CSS Gradient Creator, Linear Gradients, Radial Gradients, IE6, IE7, IE8, IE9, IE10, SVG Gradients, ColorZilla
</div>

<div id="footer">
	<span class="copyright">Copyright &copy; 2013 <a href="http://www.iosart.com/">iosart labs llc</a>, All Rights Reserved</span>

	<p>
		<a href="/contact/">contact</a>
		| <a href="/terms.html">terms of use</a>
		| <a href="/privacy.html">privacy policy</a>
</div>

<div class="scrollbar-measure"></div>

<script type="text/javascript">
	var gGradientEditor = new Gradient.Editor('gradient-control-1');
	if(!gGradientEditor.cssGradientsSupported()) {
		Dialog.alert("Looks like your browser doesn't fully support CSS gradients. You need a recent version of Firefox, Chrome or Safari to use this tool.", {width: 300, height: 110, okLabel: "OK", ok: function(win) {return true;}});
	}
</script>

<script type='text/javascript'>
	function deliciousStats(data) {
		var info = data[0];
		if(!info.total_posts) return;
		var nPosts = info.total_posts;
		if(nPosts > 999) nPosts = parseInt(nPosts / 1000) + "," + parseInt(nPosts % 1000);
		$('delicious-count').innerHTML = nPosts;
	}
</script>

</div>
<script src="Static/JavaScript/classie.js"></script>
<script src="Static/JavaScript/gnmenu.js"></script>
<script>
	new gnMenu(document.getElementById('gn-menu'));
</script>
</body>
</html>