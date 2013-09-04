/*
 * @description   prototype.js based context menu
 * @author        Juriy Zaytsev; kangax [at] gmail [dot] com; http://thinkweb2.com/projects/prototype/
 * @version       0.6
 * @date          12/03/07
 * @requires      prototype.js 1.6
 * @license:      MIT License
 */
if(Object.isUndefined(Proto)) {var Proto = {}}
Proto.Menu = Class.create({initialize: function() {
	var b = Prototype.emptyFunction;
	this.ie = Prototype.Browser.IE;
	this.options = Object.extend({selector: ".contextmenu", className: "protoMenu", pageOffset: 25, fade: false, zIndex: 100, beforeShow: b, beforeHide: b, beforeSelect: b}, arguments[0] || {});
	this.shim = new Element("iframe", {style: "position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);display:none", src: "javascript:false;", frameborder: 0});
	this.options.fade = this.options.fade && !Object.isUndefined(Effect);
	this.container = new Element("div", {className: this.options.className, style: "display:none"});
	var a = new Element("ul");
	this.options.menuItems.each(function(c) {a.insert(new Element("li", {className: c.separator ? "separator" : ""}).insert(c.separator ? "" : Object.extend(new Element("a", {href: "#", title: c.name, className: (c.className || "") + (c.disabled ? " disabled" : " enabled")}), {_callback: c.callback}).observe("click", this.onClick.bind(this)).observe("contextmenu", Event.stop).update(c.name)))}.bind(this));
	$(document.body).insert(this.container.insert(a).observe("contextmenu", Event.stop));
	if(this.ie) {$(document.body).insert(this.shim)}
	document.observe("click", function(c) {
		if(this.container.visible() && !c.isRightClick()) {
			this.options.beforeHide(c);
			if(this.ie) {this.shim.hide()}
			this.container.hide()
		}
	}.bind(this));
	document.observe(Prototype.Browser.Opera ? "click" : "contextmenu", function(f) {
		if(Prototype.Browser.Opera && !f.ctrlKey) {return}
		var c = Event.element(f);
		var d = null;
		if(Element.match(c, this.options.selector)) {d = c} else {d = Element.up(c, this.options.selector)}
		if(!d) {return}
		f.contextMenuElement = d;
		f.contextMenuContainerElement = this.container;
		this.show(f)
	}.bind(this))
}, show: function(g) {
	g.stop();
	this.options.beforeShow(g);
	var b = Event.pointer(g).x, h = Event.pointer(g).y, d = document.viewport.getDimensions(), f = document.viewport.getScrollOffsets(), a = this.container.getDimensions(), c = {left: ((b + a.width + this.options.pageOffset) > d.width ? (d.width - a.width - this.options.pageOffset) : b) + "px", top: ((h - f.top + a.height) > d.height && (h - f.top) > a.height ? (h - a.height) : h) + "px"};
	this.container.setStyle(c).setStyle({zIndex: this.options.zIndex});
	if(this.ie) {this.shim.setStyle(Object.extend(Object.extend(a, c), {zIndex: this.options.zIndex - 1})).show()}
	this.options.fade ? Effect.Appear(this.container, {duration: 0.25}) : this.container.show();
	this.event = g
}, onClick: function(a) {
	a.stop();
	if(a.target._callback && !a.target.hasClassName("disabled")) {
		this.options.beforeSelect(a);
		if(this.ie) {this.shim.hide()}
		this.container.hide();
		a.target._callback(this.event)
	}
}});
