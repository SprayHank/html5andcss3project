/*
 //
 // Prototype Window Class
 //
 // Copyright (c) 2006 S茅bastien Gruhier (http://xilinus.com, http://itseb.com)
 //
 // Permission is hereby granted, free of charge, to any person obtaining
 // a copy of this software and associated documentation files (the
 // "Software"), to deal in the Software without restriction, including
 // without limitation the rights to use, copy, modify, merge, publish,
 // distribute, sublicense, and/or sell copies of the Software, and to
 // permit persons to whom the Software is furnished to do so, subject to
 // the following conditions:
 //
 // The above copyright notice and this permission notice shall be
 // included in all copies or substantial portions of the Software.
 //
 // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 // EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 // NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 // LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 // OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 // WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 //
 // VERSION 1.3
 */
var Window = Class.create();
Window.keepMultiModalWindow = false;
Window.hasEffectLib = (typeof Effect != "undefined");
Window.resizeEffectDuration = 0.4;
Window.prototype = {
	initialize: function() {
		var c, b = 0, defaultOption = {
			className: "dialog",
			blurClassName: null,
			minWidth: 100,
			minHeight: 20,
			resizable: true,
			closable: true,
			minimizable: true,
			maximizable: true,
			draggable: true,
			userData: null,
			showEffect: (Window.hasEffectLib ? Effect.Appear : Element.show),
			hideEffect: (Window.hasEffectLib ? Effect.Fade : Element.hide),
			showEffectOptions: {},
			hideEffectOptions: {},
			effectOptions: null,
			parent: document.body,
			title: "&nbsp;",
			url: null,
			onload: Prototype.emptyFunction,
			width: 200,
			height: 300,
			opacity: 1,
			recenterAuto: true,
			wiredDrag: false,
			closeCallback: null,
			destroyOnClose: false,
			gridX: 1,
			gridY: 1
		};
		if(arguments.length > 0) {
			if(typeof arguments[0] == "string") {
				c = arguments[0];
				b = 1
			} else {c = arguments[0] ? arguments[0].id : null}
		}
		if(!c) {c = "window_" + new Date().getTime()}
		if($(c)) {alert("Window " + c + " is already registered in the DOM! Make sure you use setDestroyOnClose() or destroyOnClose: true in the constructor")}
		this.options = Object.extend(defaultOption, arguments[b] || {});
		if(this.options.blurClassName) {this.options.focusClassName = this.options.className}
		if(typeof this.options.top == "undefined" && typeof this.options.bottom == "undefined") {this.options.top = this._round(Math.random() * 500, this.options.gridY)}
		if(typeof this.options.left == "undefined" && typeof this.options.right == "undefined") {this.options.left = this._round(Math.random() * 500, this.options.gridX)}
		if(this.options.effectOptions) {
			Object.extend(this.options.hideEffectOptions, this.options.effectOptions);
			Object.extend(this.options.showEffectOptions, this.options.effectOptions);
			if(this.options.showEffect == Element.Appear) {this.options.showEffectOptions.to = this.options.opacity}
		}
		if(Window.hasEffectLib) {
			if(this.options.showEffect == Effect.Appear) {this.options.showEffectOptions.to = this.options.opacity}
			if(this.options.hideEffect == Effect.Fade) {this.options.hideEffectOptions.from = this.options.opacity}
		}
		if(this.options.hideEffect == Element.hide) {
			this.options.hideEffect = function() {
				Element.hide(this.element);
				if(this.options.destroyOnClose) {this.destroy()}
			}.bind(this)
		}
		if(this.options.parent != document.body) {this.options.parent = $(this.options.parent)}
		this.element = this._createWindow(c);
		this.element.win = this;
		this.eventMouseDown = this._initDrag.bindAsEventListener(this);
		this.eventMouseUp = this._endDrag.bindAsEventListener(this);
		this.eventMouseMove = this._updateDrag.bindAsEventListener(this);
		this.eventOnLoad = this._getWindowBorderSize.bindAsEventListener(this);
		this.eventMouseDownContent = this.toFront.bindAsEventListener(this);
		this.eventResize = this._recenter.bindAsEventListener(this);
		this.topbar = $(this.element.id + "_top");
		this.bottombar = $(this.element.id + "_bottom");
		this.content = $(this.element.id + "_content");
		Event.observe(this.topbar, "mousedown", this.eventMouseDown);
		Event.observe(this.bottombar, "mousedown", this.eventMouseDown);
		Event.observe(this.content, "mousedown", this.eventMouseDownContent);
		Event.observe(window, "load", this.eventOnLoad);
		Event.observe(window, "resize", this.eventResize);
		Event.observe(window, "scroll", this.eventResize);
		Event.observe(this.options.parent, "scroll", this.eventResize);
		if(this.options.draggable) {
			var a = this;
			[this.topbar, this.topbar.up().previous(), this.topbar.up().next()].each(function(d) {
				d.observe("mousedown", a.eventMouseDown);
				d.addClassName("top_draggable")
			});
			[this.bottombar.up(), this.bottombar.up().previous(), this.bottombar.up().next()].each(function(d) {
				d.observe("mousedown", a.eventMouseDown);
				d.addClassName("bottom_draggable")
			})
		}
		if(this.options.resizable) {
			this.sizer = $(this.element.id + "_sizer");
			Event.observe(this.sizer, "mousedown", this.eventMouseDown)
		}
		this.useLeft = null;
		this.useTop = null;
		if(typeof this.options.left != "undefined") {
			this.element.setStyle({left: parseFloat(this.options.left) + "px"});
			this.useLeft = true
		} else {
			this.element.setStyle({right: parseFloat(this.options.right) + "px"});
			this.useLeft = false
		}
		if(typeof this.options.top != "undefined") {
			this.element.setStyle({top: parseFloat(this.options.top) + "px"});
			this.useTop = true
		} else {
			this.element.setStyle({bottom: parseFloat(this.options.bottom) + "px"});
			this.useTop = false
		}
		this.storedLocation = null;
		this.setOpacity(this.options.opacity);
		if(this.options.zIndex) {this.setZIndex(this.options.zIndex)}
		if(this.options.destroyOnClose) {this.setDestroyOnClose(true)}
		this._getWindowBorderSize();
		this.width = this.options.width;
		this.height = this.options.height;
		this.visible = false;
		this.constraint = false;
		this.constraintPad = {top: 0, left: 0, bottom: 0, right: 0};
		if(this.width && this.height) {this.setSize(this.options.width, this.options.height)}
		this.setTitle(this.options.title);
		Windows.register(this)
	},
	destroy: function() {
		this._notify("onDestroy");
		Event.stopObserving(this.topbar, "mousedown", this.eventMouseDown);
		Event.stopObserving(this.bottombar, "mousedown", this.eventMouseDown);
		Event.stopObserving(this.content, "mousedown", this.eventMouseDownContent);
		Event.stopObserving(window, "load", this.eventOnLoad);
		Event.stopObserving(window, "resize", this.eventResize);
		Event.stopObserving(window, "scroll", this.eventResize);
		Event.stopObserving(this.content, "load", this.options.onload);
		if(this._oldParent) {
			var c = this.getContent();
			var a = null;
			for(var b = 0; b < c.childNodes.length; b++) {
				a = c.childNodes[b];
				if(a.nodeType == 1) {break}
				a = null
			}
			if(a) {this._oldParent.appendChild(a)}
			this._oldParent = null
		}
		if(this.sizer) {Event.stopObserving(this.sizer, "mousedown", this.eventMouseDown)}
		if(this.options.url) {this.content.src = null}
		if(this.iefix) {Element.remove(this.iefix)}
		Element.remove(this.element);
		Windows.unregister(this)
	},
	setCloseCallback: function(a) {this.options.closeCallback = a},
	getContent: function() {return this.content},
	setContent: function(h, g, b) {
		var a = $(h);
		if(null == a) {throw"Unable to find element '" + h + "' in DOM"}
		this._oldParent = a.parentNode;
		var f = null;
		var e = null;
		if(g) {f = Element.getDimensions(a)}
		if(b) {e = Position.cumulativeOffset(a)}
		var c = this.getContent();
		this.setHTMLContent("");
		c = this.getContent();
		c.appendChild(a);
		a.show();
		if(g) {this.setSize(f.width, f.height)}
		if(b) {this.setLocation(e[1] - this.heightN, e[0] - this.widthW)}
	},
	setHTMLContent: function(a) {
		if(this.options.url) {
			this.content.src = null;
			this.options.url = null;
			var b = '<div id="' + this.getId() + '_content" class="' + this.options.className + '_content"> </div>';
			$(this.getId() + "_table_content").innerHTML = b;
			this.content = $(this.element.id + "_content")
		}
		this.getContent().innerHTML = a
	},
	setAjaxContent: function(b, a, d, c) {
		this.showFunction = d ? "showCenter" : "show";
		this.showModal = c || false;
		a = a || {};
		this.setHTMLContent("");
		this.onComplete = a.onComplete;
		if(!this._onCompleteHandler) {this._onCompleteHandler = this._setAjaxContent.bind(this)}
		a.onComplete = this._onCompleteHandler;
		new Ajax.Request(b, a);
		a.onComplete = this.onComplete
	},
	_setAjaxContent: function(a) {
		Element.update(this.getContent(), a.responseText);
		if(this.onComplete) {this.onComplete(a)}
		this.onComplete = null;
		this[this.showFunction](this.showModal)
	},
	setURL: function(a) {
		if(this.options.url) {this.content.src = null}
		this.options.url = a;
		var b = "<iframe frameborder='0' name='" + this.getId() + "_content'  id='" + this.getId() + "_content' src='" + a + "' width='" + this.width + "' height='" + this.height + "'> </iframe>";
		$(this.getId() + "_table_content").innerHTML = b;
		this.content = $(this.element.id + "_content")
	},
	getURL: function() {return this.options.url ? this.options.url : null},
	refresh: function() {if(this.options.url) {$(this.element.getAttribute("id") + "_content").src = this.options.url}},
	setCookie: function(b, c, n, e, a) {
		b = b || this.element.id;
		this.cookie = [b, c, n, e, a];
		var l = WindowUtilities.getCookie(b);
		if(l) {
			var m = l.split(",");
			var j = m[0].split(":");
			var i = m[1].split(":");
			var k = parseFloat(m[2]), f = parseFloat(m[3]);
			var g = m[4];
			var d = m[5];
			this.setSize(k, f);
			if(g == "true") {this.doMinimize = true} else {if(d == "true") {this.doMaximize = true}}
			this.useLeft = j[0] == "l";
			this.useTop = i[0] == "t";
			this.element.setStyle(this.useLeft ? {left: j[1]} : {right: j[1]});
			this.element.setStyle(this.useTop ? {top: i[1]} : {bottom: i[1]})
		}
	},
	getId: function() {return this.element.id},
	setDestroyOnClose: function() {this.options.destroyOnClose = true},
	setConstraint: function(a, b) {
		this.constraint = a;
		this.constraintPad = Object.extend(this.constraintPad, b || {});
		if(this.useTop && this.useLeft) {this.setLocation(parseFloat(this.element.style.top), parseFloat(this.element.style.left))}
	},
	_initDrag: function(b) {
		if(Event.element(b) == this.sizer && this.isMinimized()) {return}
		if(Event.element(b) != this.sizer && this.isMaximized()) {return}
		if(Prototype.Browser.IE && this.heightN == 0) {this._getWindowBorderSize()}
		this.pointer = [this._round(Event.pointerX(b), this.options.gridX), this._round(Event.pointerY(b), this.options.gridY)];
		if(this.options.wiredDrag) {this.currentDrag = this._createWiredElement()} else {this.currentDrag = this.element}
		if(Event.element(b) == this.sizer) {
			this.doResize = true;
			this.widthOrg = this.width;
			this.heightOrg = this.height;
			this.bottomOrg = parseFloat(this.element.getStyle("bottom"));
			this.rightOrg = parseFloat(this.element.getStyle("right"));
			this._notify("onStartResize")
		} else {
			this.doResize = false;
			var a = $(this.getId() + "_close");
			if(a && Position.within(a, this.pointer[0], this.pointer[1])) {
				this.currentDrag = null;
				return
			}
			this.toFront();
			if(!this.options.draggable) {return}
			this._notify("onStartMove")
		}
		Event.observe(document, "mouseup", this.eventMouseUp, false);
		Event.observe(document, "mousemove", this.eventMouseMove, false);
		WindowUtilities.disableScreen("__invisible__", "__invisible__", this.overlayOpacity);
		document.body.ondrag = function() {return false};
		document.body.onselectstart = function() {return false};
		this.currentDrag.show();
		Event.stop(b)
	},
	_round: function(b, a) {return a == 1 ? b : b = Math.floor(b / a) * a},
	_updateDrag: function(b) {
		var a = [this._round(Event.pointerX(b), this.options.gridX), this._round(Event.pointerY(b), this.options.gridY)];
		var k = a[0] - this.pointer[0];
		var j = a[1] - this.pointer[1];
		if(this.doResize) {
			var i = this.widthOrg + k;
			var d = this.heightOrg + j;
			k = this.width - this.widthOrg;
			j = this.height - this.heightOrg;
			if(this.useLeft) {i = this._updateWidthConstraint(i)} else {this.currentDrag.setStyle({right: (this.rightOrg - k) + "px"})}
			if(this.useTop) {d = this._updateHeightConstraint(d)} else {this.currentDrag.setStyle({bottom: (this.bottomOrg - j) + "px"})}
			this.setSize(i, d);
			this._notify("onResize")
		} else {
			this.pointer = a;
			if(this.useLeft) {
				var c = parseFloat(this.currentDrag.getStyle("left")) + k;
				var g = this._updateLeftConstraint(c);
				this.pointer[0] += g - c;
				this.currentDrag.setStyle({left: g + "px"})
			} else {this.currentDrag.setStyle({right: parseFloat(this.currentDrag.getStyle("right")) - k + "px"})}
			if(this.useTop) {
				var f = parseFloat(this.currentDrag.getStyle("top")) + j;
				var e = this._updateTopConstraint(f);
				this.pointer[1] += e - f;
				this.currentDrag.setStyle({top: e + "px"})
			} else {this.currentDrag.setStyle({bottom: parseFloat(this.currentDrag.getStyle("bottom")) - j + "px"})}
			this._notify("onMove")
		}
		if(this.iefix) {this._fixIEOverlapping()}
		this._removeStoreLocation();
		Event.stop(b)
	},
	_endDrag: function(a) {
		WindowUtilities.enableScreen("__invisible__");
		if(this.doResize) {this._notify("onEndResize")} else {this._notify("onEndMove")}
		Event.stopObserving(document, "mouseup", this.eventMouseUp, false);
		Event.stopObserving(document, "mousemove", this.eventMouseMove, false);
		Event.stop(a);
		this._hideWiredElement();
		this._saveCookie();
		document.body.ondrag = null;
		document.body.onselectstart = null
	},
	_updateLeftConstraint: function(b) {
		if(this.constraint && this.useLeft && this.useTop) {
			var a = this.options.parent == document.body ? WindowUtilities.getPageSize().windowWidth : this.options.parent.getDimensions().width;
			if(b < this.constraintPad.left) {b = this.constraintPad.left}
			if(b + this.width + this.widthE + this.widthW > a - this.constraintPad.right) {b = a - this.constraintPad.right - this.width - this.widthE - this.widthW}
		}
		return b
	},
	_updateTopConstraint: function(c) {
		if(this.constraint && this.useLeft && this.useTop) {
			var a = this.options.parent == document.body ? WindowUtilities.getPageSize().windowHeight : this.options.parent.getDimensions().height;
			var b = this.height + this.heightN + this.heightS;
			if(c < this.constraintPad.top) {c = this.constraintPad.top}
			if(c + b > a - this.constraintPad.bottom) {c = a - this.constraintPad.bottom - b}
		}
		return c
	},
	_updateWidthConstraint: function(a) {
		if(this.constraint && this.useLeft && this.useTop) {
			var b = this.options.parent == document.body ? WindowUtilities.getPageSize().windowWidth : this.options.parent.getDimensions().width;
			var c = parseFloat(this.element.getStyle("left"));
			if(c + a + this.widthE + this.widthW > b - this.constraintPad.right) {a = b - this.constraintPad.right - c - this.widthE - this.widthW}
		}
		return a
	},
	_updateHeightConstraint: function(b) {
		if(this.constraint && this.useLeft && this.useTop) {
			var a = this.options.parent == document.body ? WindowUtilities.getPageSize().windowHeight : this.options.parent.getDimensions().height;
			var c = parseFloat(this.element.getStyle("top"));
			if(c + b + this.heightN + this.heightS > a - this.constraintPad.bottom) {b = a - this.constraintPad.bottom - c - this.heightN - this.heightS}
		}
		return b
	},
	_createWindow: function(a) {
		var f = this.options.className;
		var d = document.createElement("div");
		d.setAttribute("id", a);
		d.className = "dialog";
		var e;
		if(this.options.url) {
			e = '<iframe frameborder="0" name="' + a + '_content"  id="' + a + '_content" src="' + this.options.url + '"> </iframe>'
		} else {
			e = '<div id="' + a + '_content" class="' + f + '_content"> </div>'
		}
		var g = this.options.closable ? "<div class='" + f + "_close' id='" + a + "_close' onclick='Windows.close(\"" + a + "\", event)'> </div>" : "";
		var h = this.options.minimizable ? "<div class='" + f + "_minimize' id='" + a + "_minimize' onclick='Windows.minimize(\"" + a + "\", event)'> </div>" : "";
		var i = this.options.maximizable ? "<div class='" + f + "_maximize' id='" + a + "_maximize' onclick='Windows.maximize(\"" + a + "\", event)'> </div>" : "";
		var c = this.options.resizable ? "class='" + f + "_sizer' id='" + a + "_sizer'" : "class='" + f + "_se'";
		var b = "../themes/default/blank.gif";
		d.innerHTML = g + h + i + "      <table id='" + a + "_row1' class=\"top table_window\">        <tr>          <td class='"
			+ f + "_nw'></td>          <td class='" + f + "_n'><div id='" + a + "_top' class='" + f +
			"_title title_window'>" + this.options.title + "</div></td>          <td class='" + f
			+ "_ne'></td>        </tr>      </table>      <table id='" + a
			+ "_row2' class=\"mid table_window\">        <tr>          <td class='"
			+ f + "_w'></td>            <td id='" + a + "_table_content' class='" + f + "_content' valign='top'>" +
			e + "</td>          <td class='" + f
			+ "_e'></td>        </tr>      </table>        <table id='" + a
			+ "_row3' class=\"bot table_window\">        <tr>          <td class='" + f +
			"_sw'></td>            <td class='" + f
			+ "_s'><div id='" + a + "_bottom' class='status_bar'><span style='float:left; width:1px; height:1px'></span></div></td>            <td "
			+ c + "></td>        </tr>      </table>    ";
		Element.hide(d);
		this.options.parent.insertBefore(d, this.options.parent.firstChild);
		Event.observe($(a + "_content"), "load", this.options.onload);
		return d
	},
	changeClassName: function(a) {
		var b = this.options.className;
		var c = this.getId();
		$A(["_close", "_minimize", "_maximize", "_sizer", "_content"]).each(function(d) {this._toggleClassName($(c + d), b + d, a + d)}.bind(this));
		this._toggleClassName($(c + "_top"), b + "_title", a + "_title");
		$$("#" + c + " td").each(function(d) {d.className = d.className.sub(b, a)});
		this.options.className = a
	},
	_toggleClassName: function(c, b, a) {
		if(c) {
			c.removeClassName(b);
			c.addClassName(a)
		}
	},
	setLocation: function(c, b) {
		c = this._updateTopConstraint(c);
		b = this._updateLeftConstraint(b);
		var a = this.currentDrag || this.element;
		a.setStyle({top: c + "px"});
		a.setStyle({left: b + "px"});
		this.useLeft = true;
		this.useTop = true
	},
	getLocation: function() {
		var a = {};
		if(this.useTop) {a = Object.extend(a, {top: this.element.getStyle("top")})} else {a = Object.extend(a, {bottom: this.element.getStyle("bottom")})}
		if(this.useLeft) {a = Object.extend(a, {left: this.element.getStyle("left")})} else {a = Object.extend(a, {right: this.element.getStyle("right")})}
		return a
	},
	getSize: function() {return{width: this.width, height: this.height}},
	setSize: function(c, b, a) {
		c = parseFloat(c);
		b = parseFloat(b);
		if(!this.minimized && c < this.options.minWidth) {c = this.options.minWidth}
		if(!this.minimized && b < this.options.minHeight) {b = this.options.minHeight}
		if(this.options.maxHeight && b > this.options.maxHeight) {b = this.options.maxHeight}
		if(this.options.maxWidth && c > this.options.maxWidth) {c = this.options.maxWidth}
		if(this.useTop && this.useLeft && Window.hasEffectLib && Effect.ResizeWindow && a) {new Effect.ResizeWindow(this, null, null, c, b, {duration: Window.resizeEffectDuration})} else {
			this.width = c;
			this.height = b;
			var f = this.currentDrag ? this.currentDrag : this.element;
			f.setStyle({width: c + this.widthW + this.widthE + "px"});
			f.setStyle({height: b + this.heightN + this.heightS + "px"});
			if(!this.currentDrag || this.currentDrag == this.element) {
				var d = $(this.element.id + "_content");
				d.setStyle({height: b + "px"});
				d.setStyle({width: c + "px"})
			}
		}
	},
	updateHeight: function() {this.setSize(this.width, this.content.scrollHeight, true)},
	updateWidth: function() {this.setSize(this.content.scrollWidth, this.height, true)},
	toFront: function() {
		if(this.element.style.zIndex < Windows.maxZIndex) {this.setZIndex(Windows.maxZIndex + 1)}
		if(this.iefix) {this._fixIEOverlapping()}
	},
	getBounds: function(b) {
		if(!this.width || !this.height || !this.visible) {this.computeBounds()}
		var a = this.width;
		var c = this.height;
		if(!b) {
			a += this.widthW + this.widthE;
			c += this.heightN + this.heightS
		}
		var d = Object.extend(this.getLocation(), {width: a + "px", height: c + "px"});
		return d
	},
	computeBounds: function() {
		if(!this.width || !this.height) {
			var a = WindowUtilities._computeSize(this.content.innerHTML, this.content.id, this.width, this.height, 0, this.options.className);
			if(this.height) {this.width = a + 5} else {this.height = a + 5}
		}
		this.setSize(this.width, this.height);
		if(this.centered) {this._center(this.centerTop, this.centerLeft)}
	},
	show: function(b) {
		this.visible = true;
		if(b) {
			if(typeof this.overlayOpacity == "undefined") {
				var a = this;
				setTimeout(function() {a.show(b)}, 10);
				return
			}
			Windows.addModalWindow(this);
			this.modal = true;
			this.setZIndex(Windows.maxZIndex + 1);
			Windows.unsetOverflow(this)
		} else {if(!this.element.style.zIndex) {this.setZIndex(Windows.maxZIndex + 1)}}
		if(this.oldStyle) {this.getContent().setStyle({overflow: this.oldStyle})}
		this.computeBounds();
		this._notify("onBeforeShow");
		if(this.options.showEffect != Element.show && this.options.showEffectOptions) {this.options.showEffect(this.element, this.options.showEffectOptions)} else {this.options.showEffect(this.element)}
		this._checkIEOverlapping();
		WindowUtilities.focusedWindow = this;
		this._notify("onShow")
	},
	showCenter: function(a, c, b) {
		this.centered = true;
		this.centerTop = c;
		this.centerLeft = b;
		this.show(a)
	},
	isVisible: function() {return this.visible},
	_center: function(c, b) {
		var d = WindowUtilities.getWindowScroll(this.options.parent);
		var a = WindowUtilities.getPageSize(this.options.parent);
		if(typeof c == "undefined") {c = (a.windowHeight - (this.height + this.heightN + this.heightS)) / 2}
		c += d.top;
		if(typeof b == "undefined") {b = (a.windowWidth - (this.width + this.widthW + this.widthE)) / 2}
		b += d.left;
		this.setLocation(c, b);
		this.toFront()
	},
	_recenter: function(b) {
		if(this.centered) {
			var a = WindowUtilities.getPageSize(this.options.parent);
			var c = WindowUtilities.getWindowScroll(this.options.parent);
			if(this.pageSize && this.pageSize.windowWidth == a.windowWidth && this.pageSize.windowHeight == a.windowHeight && this.windowScroll.left == c.left && this.windowScroll.top == c.top) {return}
			this.pageSize = a;
			this.windowScroll = c;
			if($("overlay_modal")) {$("overlay_modal").setStyle({height: (a.pageHeight + "px")})}
			if(this.options.recenterAuto) {this._center(this.centerTop, this.centerLeft)}
		}
	},
	hide: function() {
		this.visible = false;
		if(this.modal) {
			Windows.removeModalWindow(this);
			Windows.resetOverflow()
		}
		this.oldStyle = this.getContent().getStyle("overflow") || "auto";
		this.getContent().setStyle({overflow: "hidden"});
		this.options.hideEffect(this.element, this.options.hideEffectOptions);
		if(this.iefix) {this.iefix.hide()}
		if(!this.doNotNotifyHide) {this._notify("onHide")}
	},
	close: function() {
		if(this.visible) {
			if(this.options.closeCallback && !this.options.closeCallback(this)) {return}
			if(this.options.destroyOnClose) {
				var a = this.destroy.bind(this);
				if(this.options.hideEffectOptions.afterFinish) {
					var b = this.options.hideEffectOptions.afterFinish;
					this.options.hideEffectOptions.afterFinish = function() {
						b();
						a()
					}
				} else {this.options.hideEffectOptions.afterFinish = function() {a()}}
			}
			Windows.updateFocusedWindow();
			this.doNotNotifyHide = true;
			this.hide();
			this.doNotNotifyHide = false;
			this._notify("onClose")
		}
	},
	minimize: function() {
		if(this.resizing) {return}
		var a = $(this.getId() + "_row2");
		if(!this.minimized) {
			this.minimized = true;
			var d = a.getDimensions().height;
			this.r2Height = d;
			var c = this.element.getHeight() - d;
			if(this.useLeft && this.useTop && Window.hasEffectLib && Effect.ResizeWindow) {new Effect.ResizeWindow(this, null, null, null, this.height - d, {duration: Window.resizeEffectDuration})} else {
				this.height -= d;
				this.element.setStyle({height: c + "px"});
				a.hide()
			}
			if(!this.useTop) {
				var b = parseFloat(this.element.getStyle("bottom"));
				this.element.setStyle({bottom: (b + d) + "px"})
			}
		} else {
			this.minimized = false;
			var d = this.r2Height;
			this.r2Height = null;
			if(this.useLeft && this.useTop && Window.hasEffectLib && Effect.ResizeWindow) {new Effect.ResizeWindow(this, null, null, null, this.height + d, {duration: Window.resizeEffectDuration})} else {
				var c = this.element.getHeight() + d;
				this.height += d;
				this.element.setStyle({height: c + "px"});
				a.show()
			}
			if(!this.useTop) {
				var b = parseFloat(this.element.getStyle("bottom"));
				this.element.setStyle({bottom: (b - d) + "px"})
			}
			this.toFront()
		}
		this._notify("onMinimize");
		this._saveCookie()
	},
	maximize: function() {
		if(this.isMinimized() || this.resizing) {return}
		if(Prototype.Browser.IE && this.heightN == 0) {this._getWindowBorderSize()}
		if(this.storedLocation != null) {
			this._restoreLocation();
			if(this.iefix) {this.iefix.hide()}
		} else {
			this._storeLocation();
			Windows.unsetOverflow(this);
			var g = WindowUtilities.getWindowScroll(this.options.parent);
			var b = WindowUtilities.getPageSize(this.options.parent);
			var f = g.left;
			var e = g.top;
			if(this.options.parent != document.body) {
				g = {top: 0, left: 0, bottom: 0, right: 0};
				var d = this.options.parent.getDimensions();
				b.windowWidth = d.width;
				b.windowHeight = d.height;
				e = 0;
				f = 0
			}
			if(this.constraint) {
				b.windowWidth -= Math.max(0, this.constraintPad.left) + Math.max(0, this.constraintPad.right);
				b.windowHeight -= Math.max(0, this.constraintPad.top) + Math.max(0, this.constraintPad.bottom);
				f += Math.max(0, this.constraintPad.left);
				e += Math.max(0, this.constraintPad.top)
			}
			var c = b.windowWidth - this.widthW - this.widthE;
			var a = b.windowHeight - this.heightN - this.heightS;
			if(this.useLeft && this.useTop && Window.hasEffectLib && Effect.ResizeWindow) {new Effect.ResizeWindow(this, e, f, c, a, {duration: Window.resizeEffectDuration})} else {
				this.setSize(c, a);
				this.element.setStyle(this.useLeft ? {left: f} : {right: f});
				this.element.setStyle(this.useTop ? {top: e} : {bottom: e})
			}
			this.toFront();
			if(this.iefix) {this._fixIEOverlapping()}
		}
		this._notify("onMaximize");
		this._saveCookie()
	},
	isMinimized: function() {return this.minimized},
	isMaximized: function() {return(this.storedLocation != null)},
	setOpacity: function(a) {if(Element.setOpacity) {Element.setOpacity(this.element, a)}},
	setZIndex: function(a) {
		this.element.setStyle({zIndex: a});
		Windows.updateZindex(a, this)
	},
	setTitle: function(a) {
		if(!a || a == "") {a = "&nbsp;"}
		Element.update(this.element.id + "_top", a)
	},
	getTitle: function() {return $(this.element.id + "_top").innerHTML},
	setStatusBar: function(b) {
		var a = $(this.getId() + "_bottom");
		if(typeof(b) == "object") {if(this.bottombar.firstChild) {this.bottombar.replaceChild(b, this.bottombar.firstChild)} else {this.bottombar.appendChild(b)}} else {this.bottombar.innerHTML = b}
	},
	_checkIEOverlapping: function() {
		if(!this.iefix && (navigator.appVersion.indexOf("MSIE") > 0) && (navigator.userAgent.indexOf("Opera") < 0) && (this.element.getStyle("position") == "absolute")) {
			new Insertion.After(this.element.id, '<iframe id="' + this.element.id + '_iefix" style="display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" src="javascript:false;" frameborder="0" scrolling="no"></iframe>');
			this.iefix = $(this.element.id + "_iefix")
		}
		if(this.iefix) {setTimeout(this._fixIEOverlapping.bind(this), 50)}
	},
	_fixIEOverlapping: function() {
		Position.clone(this.element, this.iefix);
		this.iefix.style.zIndex = this.element.style.zIndex - 1;
		this.iefix.show()
	},
	_getWindowBorderSize: function(b) {
		var c = this._createHiddenDiv(this.options.className + "_n");
		this.heightN = Element.getDimensions(c).height;
		c.parentNode.removeChild(c);
		var c = this._createHiddenDiv(this.options.className + "_s");
		this.heightS = Element.getDimensions(c).height;
		c.parentNode.removeChild(c);
		var c = this._createHiddenDiv(this.options.className + "_e");
		this.widthE = Element.getDimensions(c).width;
		c.parentNode.removeChild(c);
		var c = this._createHiddenDiv(this.options.className + "_w");
		this.widthW = Element.getDimensions(c).width;
		c.parentNode.removeChild(c);
		var c = document.createElement("div");
		c.className = "overlay_" + this.options.className;
		document.body.appendChild(c);
		var a = this;
		setTimeout(function() {
				a.overlayOpacity = ($(c).getStyle("opacity"));
				c.parentNode.removeChild(c)
			},
			10);
		if(Prototype.Browser.IE) {
			this.heightS = $(this.getId() + "_row3").getDimensions().height;
			this.heightN = $(this.getId() + "_row1").getDimensions().height
		}
		if(Prototype.Browser.WebKit && Prototype.Browser.WebKitVersion < 420) {this.setSize(this.width, this.height)}
		if(this.doMaximize) {this.maximize()}
		if(this.doMinimize) {this.minimize()}
	},
	_createHiddenDiv: function(b) {
		var a = document.body;
		var c = document.createElement("div");
		c.setAttribute("id", this.element.id + "_tmp");
		c.className = b;
		c.style.display = "none";
		c.innerHTML = "";
		a.insertBefore(c, a.firstChild);
		return c
	},
	_storeLocation: function() {
		if(this.storedLocation == null) {
			this.storedLocation = {
				useTop: this.useTop,
				useLeft: this.useLeft,
				top: this.element.getStyle("top"),
				bottom: this.element.getStyle("bottom"),
				left: this.element.getStyle("left"),
				right: this.element.getStyle("right"),
				width: this.width,
				height: this.height
			}
		}
	},
	_restoreLocation: function() {
		if(this.storedLocation != null) {
			this.useLeft = this.storedLocation.useLeft;
			this.useTop = this.storedLocation.useTop;
			if(this.useLeft && this.useTop && Window.hasEffectLib && Effect.ResizeWindow) {
				new Effect.ResizeWindow(this, this.storedLocation.top, this.storedLocation.left, this.storedLocation.width, this.storedLocation.height, {duration: Window.resizeEffectDuration})
			} else {
				this.element.setStyle(this.useLeft ? {left: this.storedLocation.left} : {right: this.storedLocation.right});
				this.element.setStyle(this.useTop ? {top: this.storedLocation.top} : {bottom: this.storedLocation.bottom});
				this.setSize(this.storedLocation.width, this.storedLocation.height)
			}
			Windows.resetOverflow();
			this._removeStoreLocation()
		}
	},
	_removeStoreLocation: function() {this.storedLocation = null},
	_saveCookie: function() {
		if(this.cookie) {
			var a = "";
			if(this.useLeft) {
				a += "l:" + (this.storedLocation ? this.storedLocation.left : this.element.getStyle("left"))
			} else {
				a += "r:" + (this.storedLocation ? this.storedLocation.right : this.element.getStyle("right"))
			}
			if(this.useTop) {
				a += ",t:" + (this.storedLocation ? this.storedLocation.top : this.element.getStyle("top"))
			} else {
				a += ",b:" + (this.storedLocation ? this.storedLocation.bottom : this.element.getStyle("bottom"))
			}
			a += "," + (this.storedLocation ? this.storedLocation.width : this.width);
			a += "," + (this.storedLocation ? this.storedLocation.height : this.height);
			a += "," + this.isMinimized();
			a += "," + this.isMaximized();
			WindowUtilities.setCookie(a, this.cookie)
		}
	},
	_createWiredElement: function() {
		if(!this.wiredElement) {
			if(Prototype.Browser.IE) {this._getWindowBorderSize()}
			var b = document.createElement("div");
			b.className = "wired_frame " + this.options.className + "_wired_frame";
			b.style.position = "absolute";
			this.options.parent.insertBefore(b, this.options.parent.firstChild);
			this.wiredElement = $(b)
		}
		if(this.useLeft) {this.wiredElement.setStyle({left: this.element.getStyle("left")})} else {this.wiredElement.setStyle({right: this.element.getStyle("right")})}
		if(this.useTop) {this.wiredElement.setStyle({top: this.element.getStyle("top")})} else {this.wiredElement.setStyle({bottom: this.element.getStyle("bottom")})}
		var a = this.element.getDimensions();
		this.wiredElement.setStyle({width: a.width + "px", height: a.height + "px"});
		this.wiredElement.setStyle({zIndex: Windows.maxZIndex + 30});
		return this.wiredElement
	},
	_hideWiredElement: function() {
		if(!this.wiredElement || !this.currentDrag) {return}
		if(this.currentDrag == this.element) {this.currentDrag = null} else {
			if(this.useLeft) {this.element.setStyle({left: this.currentDrag.getStyle("left")})} else {this.element.setStyle({right: this.currentDrag.getStyle("right")})}
			if(this.useTop) {this.element.setStyle({top: this.currentDrag.getStyle("top")})} else {this.element.setStyle({bottom: this.currentDrag.getStyle("bottom")})}
			this.currentDrag.hide();
			this.currentDrag = null;
			if(this.doResize) {this.setSize(this.width, this.height)}
		}
	},
	_notify: function(a) {if(this.options[a]) {this.options[a](this)} else {Windows.notify(a, this)}}};
var Windows = {windows: [], modalWindows: [], observers: [], focusedWindow: null, maxZIndex: 0, overlayShowEffectOptions: {duration: 0.5}, overlayHideEffectOptions: {duration: 0.5},
	addObserver: function(a) {
		this.removeObserver(a);
		this.observers.push(a)
	},
	removeObserver: function(a) {this.observers = this.observers.reject(function(b) {return b == a})},
	notify: function(a, b) {this.observers.each(function(c) {if(c[a]) {c[a](a, b)}})},
	getWindow: function(a) {return this.windows.detect(function(b) {return b.getId() == a})},
	getFocusedWindow: function() {return this.focusedWindow},
	updateFocusedWindow: function() {this.focusedWindow = this.windows.length >= 2 ? this.windows[this.windows.length - 2] : null},
	register: function(a) {this.windows.push(a)},
	addModalWindow: function(a) {
		if(this.modalWindows.length == 0) {WindowUtilities.disableScreen(a.options.className, "overlay_modal", a.overlayOpacity, a.getId(), a.options.parent)} else {
			if(Window.keepMultiModalWindow) {
				$("overlay_modal").style.zIndex = Windows.maxZIndex + 1;
				Windows.maxZIndex += 1;
				WindowUtilities._hideSelect(this.modalWindows.last().getId())
			} else {this.modalWindows.last().element.hide()}
			WindowUtilities._showSelect(a.getId())
		}
		this.modalWindows.push(a)
	},
	removeModalWindow: function(a) {
		this.modalWindows.pop();
		if(this.modalWindows.length == 0) {WindowUtilities.enableScreen()} else {
			if(Window.keepMultiModalWindow) {
				this.modalWindows.last().toFront();
				WindowUtilities._showSelect(this.modalWindows.last().getId())
			} else {this.modalWindows.last().element.show()}
		}
	},
	register: function(a) {this.windows.push(a)},
	unregister: function(a) {this.windows = this.windows.reject(function(b) {return b == a})},
	closeAll: function() {this.windows.each(function(a) {Windows.close(a.getId())})},
	closeAllModalWindows: function() {
		WindowUtilities.enableScreen();
		this.modalWindows.each(function(a) {if(a) {a.close()}})
	},
	minimize: function(c, a) {
		var b = this.getWindow(c);
		if(b && b.visible) {b.minimize()}
		Event.stop(a)
	},
	maximize: function(c, a) {
		var b = this.getWindow(c);
		if(b && b.visible) {b.maximize()}
		Event.stop(a)
	},
	close: function(c, a) {
		var b = this.getWindow(c);
		if(b) {b.close()}
		if(a) {Event.stop(a)}
	},
	blur: function(b) {
		var a = this.getWindow(b);
		if(!a) {return}
		if(a.options.blurClassName) {a.changeClassName(a.options.blurClassName)}
		if(this.focusedWindow == a) {this.focusedWindow = null}
		a._notify("onBlur")
	},
	focus: function(b) {
		var a = this.getWindow(b);
		if(!a) {return}
		if(this.focusedWindow) {this.blur(this.focusedWindow.getId())}
		if(a.options.focusClassName) {a.changeClassName(a.options.focusClassName)}
		this.focusedWindow = a;
		a._notify("onFocus")
	},
	unsetOverflow: function(a) {
		this.windows.each(function(b) {
			b.oldOverflow = b.getContent().getStyle("overflow") || "auto";
			b.getContent().setStyle({overflow: "hidden"})
		});
		if(a && a.oldOverflow) {a.getContent().setStyle({overflow: a.oldOverflow})}
	},
	resetOverflow: function() {this.windows.each(function(a) {if(a.oldOverflow) {a.getContent().setStyle({overflow: a.oldOverflow})}})},
	updateZindex: function(a, b) {
		if(a > this.maxZIndex) {
			this.maxZIndex = a;
			if(this.focusedWindow) {this.blur(this.focusedWindow.getId())}
		}
		this.focusedWindow = b;
		if(this.focusedWindow) {this.focus(this.focusedWindow.getId())}
	}};
var Dialog = {dialogId: null, onCompleteFunc: null, callFunc: null, parameters: null,
	confirm: function(d, c) {
		if(d && typeof d != "string") {
			Dialog._runAjaxRequest(d, c, Dialog.confirm);
			return
		}
		d = d || "";
		c = c || {};
		var f = c.okLabel ? c.okLabel : "Ok";
		var a = c.cancelLabel ? c.cancelLabel : "Cancel";
		c = Object.extend(c, c.windowParameters || {});
		c.windowParameters = c.windowParameters || {};
		c.className = c.className || "alert";
		var b = "class ='" + (c.buttonClass ? c.buttonClass + " " : "") + " ok_button'";
		var e = "class ='" + (c.buttonClass ? c.buttonClass + " " : "") + " cancel_button'";
		var d = "      <div class='" + c.className + "_message'>" +
			d + "</div>        <div class='" + c.className + "_buttons'>          <input type='button' value='" +
			f + "' onclick='Dialog.okCallback()' " + b + "/>          <input type='button' value='" +
			a + "' onclick='Dialog.cancelCallback()' " + e + "/>        </div>    ";
		return this._openDialog(d, c)
	},
	alert: function(c, b) {
		if(c && typeof c != "string") {
			Dialog._runAjaxRequest(c, b, Dialog.alert);
			return
		}
		c = c || "";
		b = b || {};
		var d = b.okLabel ? b.okLabel : "Ok";
		b = Object.extend(b, b.windowParameters || {});
		b.windowParameters = b.windowParameters || {};
		b.className = b.className || "alert";
		var a = "class ='" + (b.buttonClass ? b.buttonClass + " " : "") + " ok_button'";
		var c = "      <div class='" + b.className + "_message'>" + c + "</div>        <div class='" + b.className + "_buttons'>          <input type='button' value='" + d + "' onclick='Dialog.okCallback()' " + a + "/>        </div>";
		return this._openDialog(c, b)
	},
	info: function(b, a) {
		if(b && typeof b != "string") {
			Dialog._runAjaxRequest(b, a, Dialog.info);
			return
		}
		b = b || "";
		a = a || {};
		a = Object.extend(a, a.windowParameters || {});
		a.windowParameters = a.windowParameters || {};
		a.className = a.className || "alert";
		var b = "<div id='modal_dialog_message' class='" + a.className + "_message'>" + b + "</div>";
		if(a.showProgress) {b += "<div id='modal_dialog_progress' class='" + a.className + "_progress'>  </div>"}
		a.ok = null;
		a.cancel = null;
		return this._openDialog(b, a)
	},
	setInfoMessage: function(a) {$("modal_dialog_message").update(a)},
	closeInfo: function() {Windows.close(this.dialogId)},
	_openDialog: function(e, d) {
		var c = d.className;
		if(!d.height && !d.width) {d.width = WindowUtilities.getPageSize(d.options.parent || document.body).pageWidth / 2}
		if(d.id) {this.dialogId = d.id} else {
			var b = new Date();
			this.dialogId = "modal_dialog_" + b.getTime();
			d.id = this.dialogId
		}
		if(!d.height || !d.width) {
			var a = WindowUtilities._computeSize(e, this.dialogId, d.width, d.height, 5, c);
			if(d.height) {d.width = a + 5} else {d.height = a + 5}
		}
		d.effectOptions = d.effectOptions;
		d.resizable = d.resizable || false;
		d.minimizable = d.minimizable || false;
		d.maximizable = d.maximizable || false;
		d.draggable = d.draggable || false;
		d.closable = d.closable || false;
		var f = new Window(d);
		f.getContent().innerHTML = e;
		f.showCenter(true, d.top, d.left);
		f.setDestroyOnClose();
		f.cancelCallback = d.onCancel || d.cancel;
		f.okCallback = d.onOk || d.ok;
		return f
	},
	_getAjaxContent: function(a) {Dialog.callFunc(a.responseText, Dialog.parameters)},
	_runAjaxRequest: function(c, b, a) {
		if(c.options == null) {c.options = {}}
		Dialog.onCompleteFunc = c.options.onComplete;
		Dialog.parameters = b;
		Dialog.callFunc = a;
		c.options.onComplete = Dialog._getAjaxContent;
		new Ajax.Request(c.url, c.options)
	},
	okCallback: function() {
		var a = Windows.focusedWindow;
		if(!a.okCallback || a.okCallback(a)) {
			$$("#" + a.getId() + " input").each(function(b) {b.onclick = null});
			a.close()
		}
	},
	cancelCallback: function() {
		var a = Windows.focusedWindow;
		$$("#" + a.getId() + " input").each(function(b) {b.onclick = null});
		a.close();
		if(a.cancelCallback) {a.cancelCallback(a)}
	}};
if(Prototype.Browser.WebKit) {
	var array = navigator.userAgent.match(new RegExp(/AppleWebKit\/([\d\.\+]*)/));
	Prototype.Browser.WebKitVersion = parseFloat(array[1])
}
var WindowUtilities = {
	getWindowScroll: function(parent) {
		var T, L, W, H;
		parent = parent || document.body;
		if(parent != document.body) {
			T = parent.scrollTop;
			L = parent.scrollLeft;
			W = parent.scrollWidth;
			H = parent.scrollHeight
		} else {
			var w = window;
			with(w.document) {
				if(w.document.documentElement && documentElement.scrollTop) {
					T = documentElement.scrollTop;
					L = documentElement.scrollLeft
				} else if(w.document.body) {
					T = body.scrollTop;
					L = body.scrollLeft
				}

				if(w.innerWidth) {
					W = w.innerWidth;
					H = w.innerHeight
				} else if(w.document.documentElement && documentElement.clientWidth) {
					W = documentElement.clientWidth;
					H = documentElement.clientHeight
				} else {
					W = body.offsetWidth;
					H = body.offsetHeight
				}
			}
		}
		return{top: T, left: L, width: W, height: H}
	},
	getPageSize: function(d) {
		d = d || document.body;
		var c, g;
		var e, b;
		if(d != document.body) {
			c = d.getWidth();
			g = d.getHeight();
			b = d.scrollWidth;
			e = d.scrollHeight
		} else {
			var f, a;
			if(window.innerHeight && window.scrollMaxY) {
				f = document.body.scrollWidth;
				a = window.innerHeight + window.scrollMaxY
			} else if(document.body.scrollHeight > document.body.offsetHeight) {
				f = document.body.scrollWidth;
				a = document.body.scrollHeight
			} else {
				f = document.body.offsetWidth;
				a = document.body.offsetHeight
			}

			if(self.innerHeight) {
				c = self.innerWidth;
				g = self.innerHeight
			} else if(document.documentElement && document.documentElement.clientHeight) {
				c = document.documentElement.clientWidth;
				g = document.documentElement.clientHeight
			} else if(document.body) {
				c = document.body.clientWidth;
				g = document.body.clientHeight
			}


			if(a < g) {e = g} else {e = a}
			if(f < c) {b = c} else {b = f}
		}
		return{pageWidth: b, pageHeight: e, windowWidth: c, windowHeight: g}
	},
	disableScreen: function(c, a, d, e, b) {WindowUtilities.initLightbox(a, c, function() {this._disableScreen(c, a, d, e)}.bind(this), b || document.body)},
	_disableScreen: function(c, b, e, f) {
		var d = $(b);
		var a = WindowUtilities.getPageSize(d.parentNode);
		if(f && Prototype.Browser.IE) {
			WindowUtilities._hideSelect();
			WindowUtilities._showSelect(f)
		}
		d.style.height = (a.pageHeight + "px");
		d.style.display = "none";
		if(b == "overlay_modal" && Window.hasEffectLib && Windows.overlayShowEffectOptions) {
			d.overlayOpacity = e;
			new Effect.Appear(d, Object.extend({from: 0, to: e}, Windows.overlayShowEffectOptions))
		} else {d.style.display = "block"}
	},
	enableScreen: function(b) {
		b = b || "overlay_modal";
		var a = $(b);
		if(a) {
			if(b == "overlay_modal" && Window.hasEffectLib && Windows.overlayHideEffectOptions) {
				new Effect.Fade(a, Object.extend({from: a.overlayOpacity, to: 0}, Windows.overlayHideEffectOptions))
			} else {
				a.style.display = "none";
				a.parentNode.removeChild(a)
			}
			if(b != "__invisible__") {WindowUtilities._showSelect()}
		}
	},
	_hideSelect: function(a) {
		if(Prototype.Browser.IE) {
			a = a == null ? "" : "#" + a + " ";
			$$(a + "select").each(function(b) {
				if(!WindowUtilities.isDefined(b.oldVisibility)) {
					b.oldVisibility = b.style.visibility ? b.style.visibility : "visible";
					b.style.visibility = "hidden"
				}
			})
		}
	},
	_showSelect: function(a) {
		if(Prototype.Browser.IE) {
			a = a == null ? "" : "#" + a + " ";
			$$(a + "select").each(function(b) {
				if(WindowUtilities.isDefined(b.oldVisibility)) {
					try {b.style.visibility = b.oldVisibility} catch(c) {b.style.visibility = "visible"}
					b.oldVisibility = null
				} else {if(b.style.visibility) {b.style.visibility = "visible"}}
			})
		}
	},
	isDefined: function(a) {return typeof(a) != "undefined" && a != null},
	initLightbox: function(e, c, a, b) {
		if($(e)) {
			Element.setStyle(e, {zIndex: Windows.maxZIndex + 1});
			Windows.maxZIndex++;
			a()
		} else {
			var d = document.createElement("div");
			d.setAttribute("id", e);
			d.className = "overlay_" + c;
			d.style.display = "none";
			d.style.position = "absolute";
			d.style.top = "0";
			d.style.left = "0";
			d.style.zIndex = Windows.maxZIndex + 1;
			Windows.maxZIndex++;
			d.style.width = "100%";
			b.insertBefore(d, b.firstChild);
			if(Prototype.Browser.WebKit && e == "overlay_modal") {setTimeout(function() {a()}, 10)} else {a()}
		}
	},
	setCookie: function(b, a) {
		document.cookie = a[0] + "=" + escape(b) + ((a[1]) ? "; expires="
			+ a[1].toGMTString() : "") + ((a[2]) ? "; path="
			+ a[2] : "") + ((a[3]) ? "; domain=" + a[3] : "") + ((a[4]) ? "; secure" : "")
	},
	getCookie: function(c) {
		var b = document.cookie;
		var e = c + "=";
		var d = b.indexOf("; " + e);
		if(d == -1) {
			d = b.indexOf(e);
			if(d != 0) {return null}
		} else {d += 2}
		var a = document.cookie.indexOf(";", d);
		if(a == -1) {a = b.length}
		return unescape(b.substring(d + e.length, a))
	},
	_computeSize: function(e, a, b, g, d, f) {
		var i = document.body;
		var c = document.createElement("div");
		c.setAttribute("id", a);
		c.className = f + "_content";
		if(g) {c.style.height = g + "px"} else {c.style.width = b + "px"}
		c.style.position = "absolute";
		c.style.top = "0";
		c.style.left = "0";
		c.style.display = "none";
		c.innerHTML = e;
		i.insertBefore(c, i.firstChild);
		var h;
		if(g) {h = $(c).getDimensions().width + d} else {h = $(c).getDimensions().height + d}
		i.removeChild(c);
		return h
	}};
