/*
 ColorPicker
 Copyright (c) 2007 John Dyer (http://johndyer.name)
 MIT style license
 */

(function(window, document, undefined) {
	"use strict";

	var Refresh = {}, Web = {};
	Web.Color = function(b) {
		var a = {
			r: 0,
			g: 0,
			b: 0,
			h: 0,
			s: 0,
			v: 0,
			hex: "",
			setRgb: function(e, d, c) {
				this.r = e;
				this.g = d;
				this.b = c;
				var f = ColorMethods.rgbToHsv(this);
				this.h = f.h;
				this.s = f.s;
				this.v = f.v;
				this.hex = ColorMethods.rgbToHex(this)
			},
			setHsv: function(e, d, c) {
				this.h = e;
				this.s = d;
				this.v = c;
				var f = ColorMethods.hsvToRgb(this);
				this.r = f.r;
				this.g = f.g;
				this.b = f.b;
				this.hex = ColorMethods.rgbToHex(f)
			},
			setHex: function(c) {
				this.hex = c;
				var e = ColorMethods.hexToRgb(this.hex);
				this.r = e.r;
				this.g = e.g;
				this.b = e.b;
				var d = ColorMethods.rgbToHsv(e);
				this.h = d.h;
				this.s = d.s;
				this.v = d.v
			}
		};
		if(b) {
			if("hex" in b) {
				a.setHex(b.hex)
			} else if("r" in b) {
				a.setRgb(b.r, b.g, b.b)
			} else if("h" in b) {
				a.setHsv(b.h, b.s, b.v)
			}
		}

		return a
	};
	var ColorMethods = {
		hexToRgb: function(e) {
			e = this.validateHex(e);
			var d = "00", c = "00", a = "00";
			if(e.length == 6) {
				d = e.substring(0, 2);
				c = e.substring(2, 4);
				a = e.substring(4, 6)
			} else {
				if(e.length > 4) {
					d = e.substring(4, e.length);
					e = e.substring(0, 4)
				}
				if(e.length > 2) {
					c = e.substring(2, e.length);
					e = e.substring(0, 2)
				}
				if(e.length > 0) {a = e.substring(0, e.length)}
			}
			return{r: this.hexToInt(d), g: this.hexToInt(c), b: this.hexToInt(a)}
		},
		validateHex: function(a) {
			a = new String(a).toUpperCase();
			a = a.replace(/[^A-F0-9]/g, "0");
			if(a.length > 6) {a = a.substring(0, 6)}
			return a
		},
		webSafeDec: function(a) {
			a = Math.round(a / 51);
			a *= 51;
			return a
		},
		hexToWebSafe: function(e) {
			var d, c, a;
			if(e.length == 3) {
				d = e.substring(0, 1);
				c = e.substring(1, 1);
				a = e.substring(2, 1)
			} else {
				d = e.substring(0, 2);
				c = e.substring(2, 4);
				a = e.substring(4, 6)
			}
			return intToHex(this.webSafeDec(this.hexToInt(d))) + this.intToHex(this.webSafeDec(this.hexToInt(c))) + this.intToHex(this.webSafeDec(this.hexToInt(a)))
		},
		rgbToWebSafe: function(a) {return{r: this.webSafeDec(a.r), g: this.webSafeDec(a.g), b: this.webSafeDec(a.b)}},
		rgbToHex: function(a) {return this.intToHex(a.r) + this.intToHex(a.g) + this.intToHex(a.b)},
		intToHex: function(b) {
			var a = (parseInt(b).toString(16));
			if(a.length == 1) {a = ("0" + a)}
			return a.toUpperCase()
		},
		hexToInt: function(a) {return(parseInt(a, 16))},
		rgbToHsv: function(d) {
			var h = d.r / 255, f = d.g / 255, c = d.b / 255, hsv = {h: 0, s: 0, v: 0}, e = 0, a = 0;
			if(h >= f && h >= c) {
				a = h;
				e = (f > c) ? c : f
			} else if(f >= c && f >= h) {
				a = f;
				e = (h > c) ? c : h
			} else {
				a = c;
				e = (f > h) ? h : f
			}

			hsv.v = a;
			hsv.s = (a) ? ((a - e) / a) : 0;
			if(!hsv.s) {hsv.h = 0} else {
				var delta = a - e;
				if(h == a) {hsv.h = (f - c) / delta} else {if(f == a) {hsv.h = 2 + (c - h) / delta} else {hsv.h = 4 + (h - f) / delta}}
				hsv.h = parseInt(hsv.h * 60);
				if(hsv.h < 0) {hsv.h += 360}
			}
			hsv.s = parseInt(hsv.s * 100);
			hsv.v = parseInt(hsv.v * 100);
			return hsv
		}, hsvToRgb: function(e) {
			var rgb = {r: 0, g: 0, b: 0}, d = e.h, l = e.s, j = e.v;
			if(l == 0) {if(j == 0) {rgb.r = rgb.g = rgb.b = 0} else {rgb.r = rgb.g = rgb.b = parseInt(j * 255 / 100)}} else {
				if(d == 360) {d = 0}
				d /= 60;
				l /= 100;
				j /= 100;
				var c = parseInt(d), g = d - c, b = j * (1 - l), a = j * (1 - (l * g)), k = j * (1 - (l * (1 - g)));
				switch(c) {
					case 0:
						rgb.r = j;
						rgb.g = k;
						rgb.b = b;
						break;
					case 1:
						rgb.r = a;
						rgb.g = j;
						rgb.b = b;
						break;
					case 2:
						rgb.r = b;
						rgb.g = j;
						rgb.b = k;
						break;
					case 3:
						rgb.r = b;
						rgb.g = a;
						rgb.b = j;
						break;
					case 4:
						rgb.r = k;
						rgb.g = b;
						rgb.b = j;
						break;
					case 5:
						rgb.r = j;
						rgb.g = b;
						rgb.b = a;
						break
				}
				rgb.r = parseInt(rgb.r * 255);
				rgb.g = parseInt(rgb.g * 255);
				rgb.b = parseInt(rgb.b * 255)
			}
			return rgb
		}, normalizeHex: function(a) {return this.rgbToHex(this.hexToRgb(a))}};

	Web.ColorMethods = ColorMethods;

	/*
	 ColorPicker
	 Copyright (c) 2007 John Dyer (http://johndyer.name)
	 MIT style license
	 */
	var ColorValuePicker = Class.create();
	ColorValuePicker.prototype = {
		initialize: function(a) {
			this.id = a;
			this.onValuesChanged = null;
			this._hueInput = $(this.id + "_Hue");
			this._valueInput = $(this.id + "_Brightness");
			this._saturationInput = $(this.id + "_Saturation");
			this._redInput = $(this.id + "_Red");
			this._greenInput = $(this.id + "_Green");
			this._blueInput = $(this.id + "_Blue");
			this._hexInput = $(this.id + "_Hex");
			this._event_onHsvKeyUp = this._onHsvKeyUp.bindAsEventListener(this);
			this._event_onHsvBlur = this._onHsvBlur.bindAsEventListener(this);
			this._event_onRgbKeyUp = this._onRgbKeyUp.bindAsEventListener(this);
			this._event_onRgbBlur = this._onRgbBlur.bindAsEventListener(this);
			this._event_onHexKeyUp = this._onHexKeyUp.bindAsEventListener(this);
			Event.observe(this._hueInput, "keyup", this._event_onHsvKeyUp);
			Event.observe(this._valueInput, "keyup", this._event_onHsvKeyUp);
			Event.observe(this._saturationInput, "keyup", this._event_onHsvKeyUp);
			Event.observe(this._hueInput, "blur", this._event_onHsvBlur);
			Event.observe(this._valueInput, "blur", this._event_onHsvBlur);
			Event.observe(this._saturationInput, "blur", this._event_onHsvBlur);
			Event.observe(this._redInput, "keyup", this._event_onRgbKeyUp);
			Event.observe(this._greenInput, "keyup", this._event_onRgbKeyUp);
			Event.observe(this._blueInput, "keyup", this._event_onRgbKeyUp);
			Event.observe(this._redInput, "blur", this._event_onRgbBlur);
			Event.observe(this._greenInput, "blur", this._event_onRgbBlur);
			Event.observe(this._blueInput, "blur", this._event_onRgbBlur);
			Event.observe(this._hexInput, "keyup", this._event_onHexKeyUp);
			this.color = new Refresh.Web.Color();
			if(this._hexInput.value != "") {this.color.setHex(this._hexInput.value)}
			this._hexInput.value = this.color.hex;
			this._redInput.value = this.color.r;
			this._greenInput.value = this.color.g;
			this._blueInput.value = this.color.b;
			this._hueInput.value = this.color.h;
			this._saturationInput.value = this.color.s;
			this._valueInput.value = this.color.v
		},
		_onHsvKeyUp: function(a) {
			if(a.target.value == "") {return}
			this.validateHsv(a);
			this.setValuesFromHsv();
			if(this.onValuesChanged) {this.onValuesChanged(this)}
		},
		_onRgbKeyUp: function(a) {
			if(a.target.value == "") {return}
			this.validateRgb(a);
			this.setValuesFromRgb();
			if(this.onValuesChanged) {this.onValuesChanged(this)}
		},
		_onHexKeyUp: function(a) {
			if(a.target.value == "") {return}
			this.validateHex(a);
			this.setValuesFromHex();
			if(this.onValuesChanged) {this.onValuesChanged(this)}
		},
		_onHsvBlur: function(a) {if(a.target.value == "") {this.setValuesFromRgb()}},
		_onRgbBlur: function(a) {if(a.target.value == "") {this.setValuesFromHsv()}},
		HexBlur: function(a) {if(a.target.value == "") {this.setValuesFromHsv()}},
		validateRgb: function(a) {
			if(!this._keyNeedsValidation(a)) {return a}
			this._redInput.value = this._setValueInRange(this._redInput.value, 0, 255);
			this._greenInput.value = this._setValueInRange(this._greenInput.value, 0, 255);
			this._blueInput.value = this._setValueInRange(this._blueInput.value, 0, 255)
		},
		validateHsv: function(a) {
			if(!this._keyNeedsValidation(a)) {return a}
			this._hueInput.value = this._setValueInRange(this._hueInput.value, 0, 359);
			this._saturationInput.value = this._setValueInRange(this._saturationInput.value, 0, 100);
			this._valueInput.value = this._setValueInRange(this._valueInput.value, 0, 100)
		},
		validateHex: function(b) {
			if(!this._keyNeedsValidation(b)) {return b}
			var a = new String(this._hexInput.value).toUpperCase();
			if(a.substr(0, 1) == "#") {a = a.substring(1)}
			a = a.replace(/[^A-F0-9]/g, "0");
			if(a.length > 6) {a = a.substring(0, 6)}
			this._hexInput.value = a
		},
		_keyNeedsValidation: function(a) {
			if(a.keyCode == 9 || a.keyCode == 16 || a.keyCode == 38 || a.keyCode == 29 || a.keyCode == 40 || a.keyCode == 37 || (a.ctrlKey && (a.keyCode == "c".charCodeAt() || a.keyCode == "v".charCodeAt()))) {return false}
			return true
		},
		_setValueInRange: function(c, b, a) {
			if(c == "" || isNaN(c)) {return b}
			c = parseInt(c);
			if(c > a) {return a}
			if(c < b) {return b}
			return c
		},
		setValuesFromRgb: function() {
			this.color.setRgb(this._redInput.value, this._greenInput.value, this._blueInput.value);
			this._hexInput.value = this.color.hex;
			this._hueInput.value = this.color.h;
			this._saturationInput.value = this.color.s;
			this._valueInput.value = this.color.v
		},
		setValuesFromHsv: function() {
			this.color.setHsv(this._hueInput.value, this._saturationInput.value, this._valueInput.value);
			this._hexInput.value = this.color.hex;
			this._redInput.value = this.color.r;
			this._greenInput.value = this.color.g;
			this._blueInput.value = this.color.b
		},
		setValuesFromHex: function() {
			this.color.setHex(this._hexInput.value);
			this._redInput.value = this.color.r;
			this._greenInput.value = this.color.g;
			this._blueInput.value = this.color.b;
			this._hueInput.value = this.color.h;
			this._saturationInput.value = this.color.s;
			this._valueInput.value = this.color.v
		}};
	Web.ColorValuePicker = ColorValuePicker;
	/*
	 ColorPicker
	 Copyright (c) 2007 John Dyer (http://johndyer.name)
	 MIT style license
	 */
	Web.SlidersList = [];
	Web.DefaultSliderSettings = {
		xMinValue: 0,
		xMaxValue: 100,
		yMinValue: 0,
		yMaxValue: 100,
		arrowImage: "images/rangearrows.gif"
	};
	Web.Slider = Class.create();
	Web.Slider.prototype = {
		_container: null,
		_bar: null,
		_arrow: null,
		initialize: function(d, b, a) {
			this.id = d;
			this.settings = Object.extend(Object.extend({}, Web.DefaultSliderSettings), b || {});
			this.xValue = 0;
			this.yValue = 0;
			this._bar = $(this.id);
			this._arrow = document.createElement("img");
			this._arrow.border = 0;
			this._arrow.src = this.settings.arrowImage;
			this._arrow.margin = 0;
			this._arrow.padding = 0;
			this._arrow.style.position = "absolute";
			this._arrow.style.zIndex = "5";
			this._arrow.style.top = "0px";
			this._arrow.style.left = "0px";
			if(a) {
				a.appendChild(this._arrow);
				this._container = a
			} else {document.body.appendChild(this._arrow)}
			var c = this;
			this.setPositioningVariables();
			this._event_docMouseMove = this._docMouseMove.bindAsEventListener(this);
			this._event_docMouseUp = this._docMouseUp.bindAsEventListener(this);
			this._event_docMouseOut = this._docMouseOut.bindAsEventListener(this);
			Event.observe(this._bar, "mousedown", this._bar_mouseDown.bindAsEventListener(this));
			Event.observe(this._arrow, "mousedown", this._arrow_mouseDown.bindAsEventListener(this));
			this.setArrowPositionFromValues();
			if(this.onValuesChanged) {this.onValuesChanged(this)}
			Refresh.Web.SlidersList.push(this)
		},
		setPositioningVariables: function() {
			this._barWidth = this._bar.getWidth();
			this._barHeight = this._bar.getHeight();
			var a = this._bar.cumulativeOffset();
			this._barTop = a.top;
			this._barLeft = a.left;
			this._barBottom = this._barTop + this._barHeight;
			this._barRight = this._barLeft + this._barWidth;
			this._arrow = $(this._arrow);
			this._arrowWidth = this._arrow.getWidth();
			this._arrowHeight = this._arrow.getHeight();
			this.MinX = this._barLeft;
			this.MinY = this._barTop;
			this.MaxX = this._barRight;
			this.MinY = this._barBottom
		},
		setArrowPositionFromValues: function(g) {
			this.setPositioningVariables();
			var b = 0;
			var a = 0;
			if(this.settings.xMinValue != this.settings.xMaxValue) {
				if(this.xValue == this.settings.xMinValue) {b = 0} else {
					if(this.xValue == this.settings.xMaxValue) {b = this._barWidth - 1} else {
						var h = this.settings.xMaxValue;
						if(this.settings.xMinValue < 1) {h = h + Math.abs(this.settings.xMinValue) + 1}
						var d = this.xValue;
						if(this.xValue < 1) {d = d + 1}
						b = d / h * this._barWidth;
						if(parseInt(b) == (h - 1)) {b = h} else {b = parseInt(b)}
						if(this.settings.xMinValue < 1) {b = b - Math.abs(this.settings.xMinValue) - 1}
					}
				}
			}
			if(this.settings.yMinValue != this.settings.yMaxValue) {
				if(this.yValue == this.settings.yMinValue) {a = 0} else {
					if(this.yValue == this.settings.yMaxValue) {a = this._barHeight - 1} else {
						var f = this.settings.yMaxValue;
						if(this.settings.yMinValue < 1) {f = f + Math.abs(this.settings.yMinValue) + 1}
						var c = this.yValue;
						if(this.yValue < 1) {c = c + 1}
						var a = c / f * this._barHeight;
						if(parseInt(a) == (f - 1)) {a = f} else {a = parseInt(a)}
						if(this.settings.yMinValue < 1) {a = a - Math.abs(this.settings.yMinValue) - 1}
					}
				}
			}
			this._setArrowPosition(b, a)
		},
		_setArrowPosition: function(a, d) {
			if(a < 0) {a = 0}
			if(a > this._barWidth) {a = this._barWidth}
			if(d < 0) {d = 0}
			if(d > this._barHeight) {d = this._barHeight}
			if(!this._container) {
				var c = this._barLeft + a;
				var b = this._barTop + d
			} else {
				var c = a;
				var b = d
			}
			if(this._arrowWidth > this._barWidth) {c = c - (this._arrowWidth / 2 - this._barWidth / 2)} else {c = c - parseInt(this._arrowWidth / 2)}
			if(this._arrowHeight > this._barHeight) {b = b - (this._arrowHeight / 2 - this._barHeight / 2)} else {b = b - parseInt(this._arrowHeight / 2)}
			this._arrow.style.left = c + "px";
			this._arrow.style.top = b + "px"
		},
		_bar_mouseDown: function(a) {this._mouseDown(a)},
		_arrow_mouseDown: function(a) {this._mouseDown(a)},
		_mouseDown: function(a) {
			Refresh.Web.ActiveSlider = this;
			this.setValuesFromMousePosition(a);
			Event.observe(document, "mousemove", this._event_docMouseMove);
			Event.observe(document, "mouseup", this._event_docMouseUp);
			Event.observe(document, "mouseout", this._event_docMouseOut);
			Event.stop(a)
		},
		_docMouseOut: function(a) {if(a.target.tagName == "HTML") {this._docMouseUp(a)}},
		_docMouseMove: function(a) {
			this.setValuesFromMousePosition(a);
			Event.stop(a)

		},
		_docMouseUp: function(a) {
			Event.stopObserving(document, "mouseup", this._event_docMouseUp);
			Event.stopObserving(document, "mousemove", this._event_docMouseMove);
			Event.stopObserving(document, "mouseout", this._event_docMouseOut);
			Event.stop(a)
		},
		setValuesFromMousePosition: function(g) {
			this.setPositioningVariables();
			var a = Event.pointer(g);
			var d = 0;
			var b = 0;
			if(a.x < this._barLeft) {d = 0} else {if(a.x > this._barRight) {d = this._barWidth} else {d = a.x - this._barLeft + 1}}
			if(a.y < this._barTop) {b = 0} else {if(a.y > this._barBottom) {b = this._barHeight} else {b = a.y - this._barTop + 1}}
			var f = parseInt(d / this._barWidth * this.settings.xMaxValue);
			var c = parseInt(b / this._barHeight * this.settings.yMaxValue);
			this.xValue = f;
			this.yValue = c;
			if(this.settings.xMaxValue == this.settings.xMinValue) {d = 0}
			if(this.settings.yMaxValue == this.settings.yMinValue) {b = 0}
			this._setArrowPosition(d, b);
			if(this.onValuesChanged) {this.onValuesChanged(this)}
		}};

	/*
	 ColorPicker
	 Copyright (c) 2007 John Dyer (http://johndyer.name)
	 MIT style license
	 */
	Web.DefaultColorPickerSettings = {startMode: "h", startHex: "ff0000", clientFilesPath: "images/"};
	Web.ColorPicker = Class.create();
	Web.ColorPicker.prototype = {
		initialize: function(d, b) {
			this.id = d;
			this.settings = Object.extend(Object.extend({}, Web.DefaultColorPickerSettings), b || {});
			this._hueRadio = $(this.id + "_HueRadio");
			this._saturationRadio = $(this.id + "_SaturationRadio");
			this._valueRadio = $(this.id + "_BrightnessRadio");
			this._redRadio = $(this.id + "_RedRadio");
			this._greenRadio = $(this.id + "_GreenRadio");
			this._blueRadio = $(this.id + "_BlueRadio");
			this._hueRadio.value = "h";
			this._saturationRadio.value = "s";
			this._valueRadio.value = "v";
			this._redRadio.value = "r";
			this._greenRadio.value = "g";
			this._blueRadio.value = "b";
			this._event_onRadioClicked = this._onRadioClicked.bindAsEventListener(this);
			Event.observe(this._hueRadio, "click", this._event_onRadioClicked);
			Event.observe(this._saturationRadio, "click", this._event_onRadioClicked);
			Event.observe(this._valueRadio, "click", this._event_onRadioClicked);
			Event.observe(this._redRadio, "click", this._event_onRadioClicked);
			Event.observe(this._greenRadio, "click", this._event_onRadioClicked);
			Event.observe(this._blueRadio, "click", this._event_onRadioClicked);
			this._preview = $(this.id + "_Preview");
			this._mapBase = $(this.id + "_ColorMap");
			this._mapBase.style.width = "256px";
			this._mapBase.style.height = "256px";
			this._mapBase.style.padding = 0;
			this._mapBase.style.margin = 0;
			this._mapBase.style.border = "solid 1px #000";
			this._mapBase.style.position = "relative";
			this._mapL1 = new Element("img", {src: this.settings.clientFilesPath + "blank.gif", width: 256, height: 256});
			this._mapL1.style.margin = "0px";
			this._mapL1.style.display = "block";
			this._mapBase.appendChild(this._mapL1);
			this._mapL2 = new Element("img", {src: this.settings.clientFilesPath + "blank.gif", width: 256, height: 256});
			this._mapBase.appendChild(this._mapL2);
			this._mapL2.style.clear = "both";
			this._mapL2.style.margin = "-256px 0px 0px 0px";
			this._mapL2.setOpacity(0.5);
			this._mapL2.style.display = "block";
			this._bar = $(this.id + "_ColorBar");
			this._bar.style.width = "20px";
			this._bar.style.height = "256px";
			this._bar.style.padding = 0;
			this._bar.style.margin = "0px 10px";
			this._bar.style.border = "solid 1px #000";
			this._bar.style.position = "relative";
			this._barL1 = new Element("img", {src: this.settings.clientFilesPath + "blank.gif", width: 20, height: 256});
			this._barL1.style.margin = "0px";
			this._barL1.style.display = "block";
			this._bar.appendChild(this._barL1);
			this._barL2 = new Element("img", {src: this.settings.clientFilesPath + "blank.gif", width: 20, height: 256});
			this._barL2.style.margin = "-256px 0px 0px 0px";
			this._barL2.style.display = "block";
			this._bar.appendChild(this._barL2);
			this._barL3 = new Element("img", {src: this.settings.clientFilesPath + "blank.gif", width: 20, height: 256});
			this._barL3.style.margin = "-256px 0px 0px 0px";
			this._barL3.style.backgroundColor = "#ff0000";
			this._barL3.style.display = "block";
			this._bar.appendChild(this._barL3);
			this._barL4 = new Element("img", {src: this.settings.clientFilesPath + "bar-brightness.png", width: 20, height: 256});
			this._barL4.style.margin = "-256px 0px 0px 0px";
			this._barL4.style.display = "block";
			this._bar.appendChild(this._barL4);
			this._map = new Refresh.Web.Slider(this._mapL2, {xMaxValue: 255, yMinValue: 255, arrowImage: this.settings.clientFilesPath + "mappoint.gif"}, this._mapBase);
			this._slider = new Refresh.Web.Slider(this._barL4, {xMinValue: 1, xMaxValue: 1, yMinValue: 255, arrowImage: this.settings.clientFilesPath + "rangearrows.gif"}, this._bar);
			this._cvp = new Refresh.Web.ColorValuePicker(this.id);
			var c = this;
			this._slider.onValuesChanged = function() {c.sliderValueChanged()};
			this._map.onValuesChanged = function() {c.mapValueChanged()};
			this._cvp.onValuesChanged = function() {c.textValuesChanged()};
			this.isLessThanIE7 = false;
			var a = parseFloat(navigator.appVersion.split("MSIE")[1]);
			if((a < 7) && (document.body.filters)) {this.isLessThanIE7 = true}
			this.setColorMode(this.settings.startMode);
			if(this.settings.startHex) {this._cvp._hexInput.value = this.settings.startHex}
			this._cvp.setValuesFromHex();
			this.positionMapAndSliderArrows();
			this.updateVisuals();
			this.color = null
		},
		show: function() {
			this._map.Arrow.style.display = "";
			this._slider.Arrow.style.display = "";
			this._map.setPositioningVariables();
			this._slider.setPositioningVariables();
			this.positionMapAndSliderArrows()
		},
		hide: function() {
			this._map.Arrow.style.display = "none";
			this._slider.Arrow.style.display = "none"
		},
		_onRadioClicked: function(a) {this.setColorMode(a.target.value)},
		_onWebSafeClicked: function(a) {this.setColorMode(this.ColorMode)},
		textValuesChanged: function() {
			this.positionMapAndSliderArrows();
			this.updateVisuals()
		},
		setColorMode: function(b) {
			this.color = this._cvp.color;
			function a(d, c) {
				d.setAlpha(c, 100);
				c.style.backgroundColor = "";
				c.src = d.settings.clientFilesPath + "blank.gif";
				c.style.filter = ""
			}

			a(this, this._mapL1);
			a(this, this._mapL2);
			a(this, this._barL1);
			a(this, this._barL2);
			a(this, this._barL3);
			a(this, this._barL4);
			this._hueRadio.checked = false;
			this._saturationRadio.checked = false;
			this._valueRadio.checked = false;
			this._redRadio.checked = false;
			this._greenRadio.checked = false;
			this._blueRadio.checked = false;
			switch(b) {
				case"h":
					this._hueRadio.checked = true;
					this._mapL1.style.backgroundColor = "#" + ColorMethods.normalizeHex(this.color.hex);
					this._mapL2.style.backgroundColor = "transparent";
					this.setImg(this._mapL2, "map-hue.png");
					this.setAlpha(this._mapL2, 100);
					this.setImg(this._barL4, "bar-hue.png");
					this._map.settings.xMaxValue = 100;
					this._map.settings.yMaxValue = 100;
					this._slider.settings.yMaxValue = 359;
					break;
				case"s":
					this._saturationRadio.checked = true;
					this.setImg(this._mapL1, "map-saturation.png");
					this.setImg(this._mapL2, "map-saturation-overlay.png");
					this.setAlpha(this._mapL2, 0);
					this.setBG(this._barL3, this.color.hex);
					this.setImg(this._barL4, "bar-saturation.png");
					this._map.settings.xMaxValue = 359;
					this._map.settings.yMaxValue = 100;
					this._slider.settings.yMaxValue = 100;
					break;
				case"v":
					this._valueRadio.checked = true;
					this.setBG(this._mapL1, "000");
					this.setImg(this._mapL2, "map-brightness.png");
					this._barL3.style.backgroundColor = "#" + Refresh.Web.ColorMethods.normalizeHex(this.color.hex);
					this.setImg(this._barL4, "bar-brightness.png");
					this._map.settings.xMaxValue = 359;
					this._map.settings.yMaxValue = 100;
					this._slider.settings.yMaxValue = 100;
					break;
				case"r":
					this._redRadio.checked = true;
					this.setImg(this._mapL2, "map-red-max.png");
					this.setImg(this._mapL1, "map-red-min.png");
					this.setImg(this._barL4, "bar-red-tl.png");
					this.setImg(this._barL3, "bar-red-tr.png");
					this.setImg(this._barL2, "bar-red-br.png");
					this.setImg(this._barL1, "bar-red-bl.png");
					break;
				case"g":
					this._greenRadio.checked = true;
					this.setImg(this._mapL2, "map-green-max.png");
					this.setImg(this._mapL1, "map-green-min.png");
					this.setImg(this._barL4, "bar-green-tl.png");
					this.setImg(this._barL3, "bar-green-tr.png");
					this.setImg(this._barL2, "bar-green-br.png");
					this.setImg(this._barL1, "bar-green-bl.png");
					break;
				case"b":
					this._blueRadio.checked = true;
					this.setImg(this._mapL2, "map-blue-max.png");
					this.setImg(this._mapL1, "map-blue-min.png");
					this.setImg(this._barL4, "bar-blue-tl.png");
					this.setImg(this._barL3, "bar-blue-tr.png");
					this.setImg(this._barL2, "bar-blue-br.png");
					this.setImg(this._barL1, "bar-blue-bl.png");
					break;
				default:
					alert("invalid mode");
					break
			}
			switch(b) {
				case"h":
				case"s":
				case"v":
					this._map.settings.xMinValue = 1;
					this._map.settings.yMinValue = 1;
					this._slider.settings.yMinValue = 1;
					break;
				case"r":
				case"g":
				case"b":
					this._map.settings.xMinValue = 0;
					this._map.settings.yMinValue = 0;
					this._slider.settings.yMinValue = 0;
					this._map.settings.xMaxValue = 255;
					this._map.settings.yMaxValue = 255;
					this._slider.settings.yMaxValue = 255;
					break
			}
			this.ColorMode = b;
			this.positionMapAndSliderArrows();
			this.updateMapVisuals();
			this.updateSliderVisuals()
		},
		mapValueChanged: function() {
			switch(this.ColorMode) {
				case"h":
					this._cvp._saturationInput.value = this._map.xValue;
					this._cvp._valueInput.value = 100 - this._map.yValue;
					break;
				case"s":
					this._cvp._hueInput.value = this._map.xValue;
					this._cvp._valueInput.value = 100 - this._map.yValue;
					break;
				case"v":
					this._cvp._hueInput.value = this._map.xValue;
					this._cvp._saturationInput.value = 100 - this._map.yValue;
					break;
				case"r":
					this._cvp._blueInput.value = this._map.xValue;
					this._cvp._greenInput.value = 256 - this._map.yValue;
					break;
				case"g":
					this._cvp._blueInput.value = this._map.xValue;
					this._cvp._redInput.value = 256 - this._map.yValue;
					break;
				case"b":
					this._cvp._redInput.value = this._map.xValue;
					this._cvp._greenInput.value = 256 - this._map.yValue;
					break
			}
			switch(this.ColorMode) {
				case"h":
				case"s":
				case"v":
					this._cvp.setValuesFromHsv();
					break;
				case"r":
				case"g":
				case"b":
					this._cvp.setValuesFromRgb();
					break
			}
			this.updateVisuals()
		},
		sliderValueChanged: function() {
			switch(this.ColorMode) {
				case"h":
					this._cvp._hueInput.value = 360 - this._slider.yValue;
					break;
				case"s":
					this._cvp._saturationInput.value = 100 - this._slider.yValue;
					break;
				case"v":
					this._cvp._valueInput.value = 100 - this._slider.yValue;
					break;
				case"r":
					this._cvp._redInput.value = 255 - this._slider.yValue;
					break;
				case"g":
					this._cvp._greenInput.value = 255 - this._slider.yValue;
					break;
				case"b":
					this._cvp._blueInput.value = 255 - this._slider.yValue;
					break
			}
			switch(this.ColorMode) {
				case"h":
				case"s":
				case"v":
					this._cvp.setValuesFromHsv();
					break;
				case"r":
				case"g":
				case"b":
					this._cvp.setValuesFromRgb();
					break
			}
			this.updateVisuals()
		},
		positionMapAndSliderArrows: function() {
			this.color = this._cvp.color;
			var b = 0;
			switch(this.ColorMode) {
				case"h":
					b = 360 - this.color.h;
					break;
				case"s":
					b = 100 - this.color.s;
					break;
				case"v":
					b = 100 - this.color.v;
					break;
				case"r":
					b = 255 - this.color.r;
					break;
				case"g":
					b = 255 - this.color.g;
					break;
				case"b":
					b = 255 - this.color.b;
					break
			}
			this._slider.yValue = b;
			this._slider.setArrowPositionFromValues();
			var a = 0;
			var c = 0;
			switch(this.ColorMode) {
				case"h":
					a = this.color.s;
					c = 100 - this.color.v;
					break;
				case"s":
					a = this.color.h;
					c = 100 - this.color.v;
					break;
				case"v":
					a = this.color.h;
					c = 100 - this.color.s;
					break;
				case"r":
					a = this.color.b;
					c = 256 - this.color.g;
					break;
				case"g":
					a = this.color.b;
					c = 256 - this.color.r;
					break;
				case"b":
					a = this.color.r;
					c = 256 - this.color.g;
					break
			}
			this._map.xValue = a;
			this._map.yValue = c;
			this._map.setArrowPositionFromValues()
		},
		updateVisuals: function() {
			this.updatePreview();
			this.updateMapVisuals();
			this.updateSliderVisuals();
			if(this.updateColorZilla) {this.updateColorZilla()}
		},
		updatePreview: function() {try {this._preview.style.backgroundColor = "#" + ColorMethods.normalizeHex(this._cvp.color.hex)} catch(a) {}},
		updateMapVisuals: function() {
			this.color = this._cvp.color;
			switch(this.ColorMode) {
				case"h":
					var a = new Refresh.Web.Color({h: this.color.h, s: 100, v: 100});
					this.setBG(this._mapL1, a.hex);
					break;
				case"s":
					this.setAlpha(this._mapL2, 100 - this.color.s);
					break;
				case"v":
					this.setAlpha(this._mapL2, this.color.v);
					break;
				case"r":
					this.setAlpha(this._mapL2, this.color.r / 256 * 100);
					break;
				case"g":
					this.setAlpha(this._mapL2, this.color.g / 256 * 100);
					break;
				case"b":
					this.setAlpha(this._mapL2, this.color.b / 256 * 100);
					break
			}
		}, updateSliderVisuals: function() {
			this.color = this._cvp.color;
			switch(this.ColorMode) {
				case"h":
					break;
				case"s":
					var a = new Web.Color({h: this.color.h, s: 100, v: this.color.v});
					this.setBG(this._barL3, a.hex);
					break;
				case"v":
					var e = new Web.Color({h: this.color.h, s: this.color.s, v: 100});
					this.setBG(this._barL3, e.hex);
					break;
				case"r":
				case"g":
				case"b":
					var h = 0;
					var c = 0;
					if(this.ColorMode == "r") {
						h = this._cvp._blueInput.value;
						c = this._cvp._greenInput.value
					} else if(this.ColorMode == "g") {
						h = this._cvp._blueInput.value;
						c = this._cvp._redInput.value
					} else if(this.ColorMode == "b") {
						h = this._cvp._redInput.value;
						c = this._cvp._greenInput.value
					}
					var b = (h / 256) * 100;
					var d = (c / 256) * 100;
					var g = ((256 - h) / 256) * 100;
					var f = ((256 - c) / 256) * 100;
					this.setAlpha(this._barL4, (d > g) ? g : d);
					this.setAlpha(this._barL3, (d > b) ? b : d);
					this.setAlpha(this._barL2, (f > b) ? b : f);
					this.setAlpha(this._barL1, (f > g) ? g : f);
					break
			}
		},
		setBG: function(a, d) {
			try {a.style.backgroundColor = "#" + ColorMethods.normalizeHex(d)} catch(b) {}
		},
		setImg: function(a, b) {
			if(b.indexOf("png") && this.isLessThanIE7) {
				a.pngSrc = this.settings.clientFilesPath + b;
				a.src = this.settings.clientFilesPath + "blank.gif";
				a.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + b + "');"
			} else {a.src = this.settings.clientFilesPath + b}
		},
		setAlpha: function(b, a) {
			if(this.isLessThanIE7) {
				var c = b.pngSrc;
				if(c != null && c.indexOf("map-hue") == -1) {
					b.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + c + "') progid:DXImageTransform.Microsoft.Alpha(opacity=" + a + ")"
				}
			} else {b.setOpacity(a / 100)}
		}};


	Refresh.Web = Web;

	window.Refresh = Refresh;
})(this, document);