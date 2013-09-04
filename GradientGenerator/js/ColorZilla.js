/*

 ColorZilla persistence library

 Copyright (c) Alex Sirota 2010, All Rights Reserved

 Please do not use without permission

 */
(function(window, document, undefined) {
	"use strict";
	if(typeof ColorZilla == "undefined") {var ColorZilla = {}}

	ColorZilla.Cookie = {
		set: function(c, f, b, CookieDomain, CookiePath) {
			if(typeof CookieDomain == "undefined") {CookieDomain = ".colorzilla.com"}
			if(typeof CookiePath == "undefined") {CookiePath = "/"}
			var a = "";
			if(b != undefined) {
				var h = new Date();
				h.setTime(h.getTime() + (86400000 * parseFloat(b)));
				a = "; expires=" + h.toGMTString()
			}
			CookieDomain = "; domain=" + CookieDomain;
			CookiePath = "; path=" + CookiePath;
			return(document.cookie = escape(c) + "=" + escape(f || "") + a + CookieDomain + CookiePath)
		},
		get: function(a) {
			var b = document.cookie.match(new RegExp("(^|;)\\s*" + escape(a) + "=([^;\\s]*)"));
			return(b ? unescape(b[2]) : null)
		},
		remove: function(a) {
			var b = ColorZilla.Cookie.get(a) || true;
			ColorZilla.Cookie.set(a, "", -1);
			return b
		}
	};
	ColorZilla.Persist = {
		_cookieName: "persist",
		_dict: {},
		_fromCookie: function() {
			this._dict = {};
			var e = ColorZilla.Cookie.get(this._cookieName);
			if(!e) {return{}}
			var a = e.split("&");
			for(var c = 0; c < a.length; c++) {
				var d = a[c].split("=");
				if(d.length != 2) {continue}
				var b = unescape(d[0]);
				var e = unescape(d[1]);
				this._dict[b] = e
			}
			return this._dict
		},
		_toCookie: function() {
			var a = "";
			for(key in this._dict) {
				if(a != "") {a += "&"}
				a += escape(key) + "=" + escape(this._dict[key])
			}
			ColorZilla.Cookie.set(this._cookieName, a, 365 * 30)
		},
		get: function(a, b) {
			this._fromCookie();
			return(typeof this._dict[a] == "undefined") ? b : this._dict[a]
		},
		set: function(a, b) {
			this._fromCookie();
			this._dict[a] = b;
			this._toCookie()
		},
		remove: function(a, b) {
			this._fromCookie();
			if(typeof this._dict[a] != "undefined") {delete this._dict[a]}
			this._toCookie()
		},
		setAndReload: function(a, b) {
			this.set(a, b);
			window.location.reload(true)
		}
	};
	ColorZilla.LocalStorage = {
		isSupported: function() {
			try {return"localStorage" in window && window.localStorage !== null} catch(a) {return false}
		},
		get: function(a, d) {
			if(!this.isSupported()) {return d}
			try {
				var c = localStorage.getItem(a);
				return(c != null) ? c : d
			} catch(b) {return d}
		}, set: function(a, c) {
			if(!this.isSupported()) {return false}
			try {
				localStorage.setItem(a, c);
				return true
			} catch(b) {return false}
		}, remove: function(a, c) {
			if(!this.isSupported()) {return false}
			try {
				localStorage.removeItem(a, c);
				return true
			} catch(b) {return false}
		}};
	window.ColorZilla = ColorZilla
})(this, document);