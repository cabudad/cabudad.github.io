window.useBundleVersion = false;
if (location.href.indexOf("useBundleVersion=1") > -1) {
	window.useBundleVersion = true
} else if (location.href.indexOf("useBundleVersion=0") > -1) {
	window.useBundleVersion = false
} else if ("undefined" !== typeof window.useBundleVersion) {
	window.useBundleVersion = !!window.useBundleVersion
} else {
	window.useBundleVersion = true
}
window.useBundleVersion = true;
var _defineMethodName = window.useBundleVersion ? "defineconflict" : "define";
namespace = function() {
	var argus = arguments;
	for (var i = 0; i < argus.length; i++) {
		var objs = argus[i].split(".");
		var obj = window;
		for (var j = 0; j < objs.length; j++) {
			obj[objs[j]] = obj[objs[j]] || {};
			obj = obj[objs[j]]
		}
	}
	return obj
};
namespace("milo.base");
(function() {
	milo.base.extend = function(destination, source) {
		if (destination == null) {
			destination = source
		} else {
			for (var property in source) {
				if (getParamType(source[property]).toLowerCase() === "object" && getParamType(destination[
						property]).toLowerCase() === "object") extend(destination[property], source[property]);
				else destination[property] = source[property]
			}
		}
		return destination
	};
	milo.base.extendLess = function(destination, source) {
		var newopt = source;
		for (var i in destination) {
			if (isObject(source) && typeof source[i] != "undefined") {
				destination[i] = newopt[i]
			}
		}
		return destination
	};
	milo.base.extendClass = function(subClass, superClass) {
		var F = function() {};
		F.prototype = superClass.prototype;
		subClass.prototype = new F;
		subClass.prototype.constructor = subClass;
		subClass.superclass = superClass.prototype;
		if (superClass.prototype.constructor == Object.prototype.constructor) {
			superClass.prototype.constructor = superClass
		}
	};
	milo.base.cloneClass = function(object) {
		if (!isObject(object)) return object;
		if (object == null) return object;
		var F = new Object;
		for (var i in object) F[i] = cloneClass(object[i]);
		return F
	};
	milo.base.bind = function(fn, context) {
		return function() {
			return fn.apply(context, arguments)
		}
	};
	milo.base.extend(milo.base, {
		isUndefined: function(o) {
			return o === undefined && typeof o == "undefined"
		},
		isArray: function(obj) {
			return getParamType(obj).toLowerCase() === "array"
		},
		isFunction: function(obj) {
			return getParamType(obj).toLowerCase() === "function"
		},
		isObject: function(obj) {
			return getParamType(obj).toLowerCase() === "object"
		},
		isNumber: function(obj) {
			return getParamType(obj).toLowerCase() === "number"
		},
		isString: function(obj) {
			return getParamType(obj).toLowerCase() === "string"
		},
		isBoolean: function(obj) {
			return getParamType(obj).toLowerCase() === "boolean"
		},
		isDate: function(obj) {
			return getParamType(obj).toLowerCase() === "date"
		},
		isDom: function(obj) {
			try {
				return obj && typeof obj === "object" && !isUndefined(obj.nodeType) && obj.nodeType ==
					1 && !isUndefined(obj.nodeName) && typeof obj.nodeName == "string"
			} catch (e) {
				return false
			}
		},
		getDomVal: function(obj) {
			return obj.value || obj.innerHTML
		},
		forEach: function(haystack, callback) {
			var i = 0,
				length = haystack.length,
				name;
			if (length !== undefined) {
				for (; i < length;) {
					if (callback.call(haystack[i], i, haystack[i++]) === false) {
						break
					}
				}
			} else {
				for (name in haystack) {
					callback.call(haystack[name], name, haystack[name])
				}
			}
		},
		g: function(obj) {
			return typeof obj == "object" ? obj : document.getElementById(obj)
		}
	});

	function getParamType(obj) {
		return obj == null ? String(obj) : Object.prototype.toString.call(obj).replace(/\[object\s+(\w+)\]/i,
			"$1") || "object"
	}
})();
milo.base.extend(window, milo.base);
namespace("milo.config");
(function() {
	var config = {
		loaderPath: window.useBundleVersion ? location.protocol + "//ossweb-img.qq.com/images/js/milo_bundle/" :
			location.protocol + "//ossweb-img.qq.com/images/js/milo_bundle/",
		version: 1704370473729,
		expires: 3e4
	};
	extend(milo.config, config)
})();
namespace("milo.loader");
(function(loader) {
	var __loading = null,
		loaded = {},
		loading = {},
		queue = [],
		modulemap = {};
	charset = "gb2312";
	loader.set = function(obj) {
		charset = obj.charset
	};
	loader.need = function(modules, callback) {
		if (!isArray(modules)) {
			modules = new Array(modules)
		}
		var mc = moduleContainer("", modules, callback);
		start(mc);
		return undefined
	};
	loader[_defineMethodName] = function(name, deps, callback) {
		if (!isString(name)) {
			callback = deps;
			deps = name;
			name = null
		}
		if (!isArray(deps)) {
			callback = deps;
			deps = []
		}
		queue.push([name, deps, callback]);
		return undefined
	};
	loader[_defineMethodName].amd = {
		jQuery: true
	};
	loader.include = function(filepaths, callback) {
		var files = new Array;
		files = files.concat(filepaths);
		if (!isFunction(callback)) {
			callback = function() {}
		}
		var ic = includerContainer(files, callback);
		start(ic)
	};
	loader.loadScript = function(url, callback) {
		if (!isFunction(callback)) callback = function() {};
		loadScript(url, callback)
	};
	loader.loadCSS = function(url, callback) {
		if (url.search(/^(http:|https:|)\/\//i) == -1) {
			url = milo.config.loaderPath + url.replace(/\./g, "/") + ".css" + "?" + milo.config.version
		}
		var isCSS = /\.css(\?|$)/i.test(url);
		if (!isFunction(callback)) callback = function() {};
		if (isCSS & !loaded[url]) {
			loadCSS(url, callback);
			loaded[url] = true
		}
	};
	loader.loadByTag = function(modules) {
		for (var i = 0; i < modules.length; i++) {
			var modName = modules[i].name.replace(/\//g, ".");
			loaded[modName] = true;
			modulemap[modName] = modules[i].value
		}
	};

	function moduleContainer(name, modules, callback) {
		var needown = 0,
			hasdown = 0,
			hasmaped = 0,
			need = {};
		for (var i = 0; i < modules.length; i++) {
			var url = getModulePath(modules[i]);
			needown++;
			modules[i] = modules[i].replace(/\//g, ".");
			if (loaded[modules[i]] || loading[modules[i]]) {
				hasdown++;
				continue
			}
			need[modules[i]] = url
		}
		return {
			name: name,
			modules: modules,
			need: need,
			res: new Array,
			expires: modules.length * milo.config.expires,
			callback: callback,
			needown: needown,
			hasdown: hasdown,
			hasmaped: hasmaped,
			loadUrlCallback: function(ret, name) {
				this.hasdown++;
				if (ret) {
					loaded[name] = true;
					while (1) {
						var deps = queue.splice(0, 1).pop();
						if (deps == null) {
							modulemap[name] = ret;
							break
						}
						if (deps[0] && deps[0].toLowerCase() != name.substr(name.lastIndexOf(".") + 1)
							.toLowerCase() && deps[0].toLowerCase().indexOf(name.substr(name.lastIndexOf(".") +
								1).toLowerCase()) < 0 && name.toLowerCase().indexOf(deps[0].toLowerCase()) < 0
							) {} else {
							deps[0] = name;
							var mc = moduleContainer.apply(null, deps);
							start(mc);
							break
						}
					}
				} else {
					modulemap[name] = "undefined"
				}
			},
			loadInluderCallback: function(ret) {
				if (!ret) {}
				this.checkMaped()
			},
			completeLoad: function(maped) {
				var ret = [];
				for (var i = 0; i < this.modules.length; i++) {
					ret.push(this.res[this.modules[i]])
				}
				if (!isFunction(this.callback) && !isObject(this.callback)) return false;
				if (this.name == "") {
					this.callback.apply(null, ret)
				} else {
					isObject(this.callback) ? modulemap[this.name] = this.callback : modulemap[this.name] = this
						.callback.apply(null, ret)
				}
			},
			checkMaped: function() {
				for (var i = 0; i < this.modules.length; i++) {
					if (isUndefined(this.res[this.modules[i]]) && !isUndefined(modulemap[this.modules[i]])) {
						this.res[this.modules[i]] = modulemap[this.modules[i]];
						this.hasmaped++
					}
				}
				if (this.hasmaped == this.needown) {
					this.completeLoad.apply(this, [true]);
					return
				}
				if (this.hasmaped < this.needown && this.expires <= 0) {
					for (var i = 0; i < this.modules.length; i++) {
						if (!isObject(modulemap[this.modules[i]])) {
							this.res[this.modules[i]] = "undefined";
							this.hasmaped++
						}
					}
					this.completeLoad.apply(this, [false]);
					return
				}
				if (this.hasmaped < this.needown && this.expires > 0) {
					this.expires = this.expires - 50;
					var mc = this;
					setTimeout(function() {
						mc.checkMaped()
					}, 50)
				}
			}
		}
	}

	function start(mc) {
		var need = mc.need;
		for (var key in need) {
			load(need[key], key, mc)
		}
		checkloaded(mc)
	}

	function load(url, name, mc) {
		getGreyUrl(url, function(actualUrl) {
			var isCSS = /\.css(\?|$)/i.test(url);
			loading[name] = true;
			isCSS ? loadCSS(actualUrl, function(ret) {
				mc.loadUrlCallback.call(mc, [ret, name])
			}) : loadScript(actualUrl, function(ret) {
				mc.loadUrlCallback.apply(mc, [ret, name])
			})
		})
	}

	function checkloaded(mc) {
		if (mc.hasdown == mc.needown) {
			mc.loadInluderCallback.apply(mc, [true]);
			return
		}
		if (mc.hasdown < mc.needown && mc.expires <= 0) {
			mc.loadInluderCallback.apply(mc, [false]);
			return
		}
		if (mc.hasdown < mc.needown && mc.expires > 0) {
			mc.expires = mc.expires - 50;
			setTimeout(function() {
				checkloaded(mc)
			}, 50)
		}
	}

	function getModulePath(filepath) {
		if (filepath.search(/^http:|https:\/\//i) == -1) {
			filepath = milo.config.loaderPath + filepath.replace(/\./g, "/") + ".js" + "?" + milo.config.version
		}
		return filepath
	}

	function getModuleName() {
		return null
	}

	function includerContainer(files, callback) {
		var needown = 0,
			hasdown = 0,
			need = {};
		for (var i = 0; i < files.length; i++) {
			var url = getModulePath(files[i]);
			needown++;
			if (loaded[files[i]]) {
				hasdown++;
				break
			}
			need[files[i]] = url
		}
		return {
			files: files,
			need: need,
			res: new Array,
			expires: needown * milo.config.expires,
			callback: callback,
			needown: needown,
			hasdown: hasdown,
			loadUrlCallback: function(ret, name) {
				if (ret) this.hasdown++;
				loaded[name] = ret
			},
			loadInluderCallback: function(ret) {
				var res = [];
				for (var i = 0; i < this.files.length; i++) {
					res.push(loaded[this.files[i]])
				}
				this.callback.apply(null, res)
			}
		}
	}

	// function loadScript(url, callback) {
	// 	var head = document.getElementsByTagName("head")[0];
	// 	var script = document.createElement("script");
	// 	script.type = "text/javascript";
	// 	script.charset = charset;
	// 	script.src = url;
	// 	var timeout = setTimeout(function() {
	// 		head.removeChild(script);
	// 		isFunction(callback) && callback.call(this, false)
	// 	}, milo.config.expires);
	// 	onload(script, function(Ins) {
	// 		head.removeChild(script);
	// 		clearTimeout(timeout);
	// 		isFunction(callback) && callback(true)
	// 	});
	// 	onerror(script, function() {
	// 		head.removeChild(script);
	// 		clearTimeout(timeout);
	// 		isFunction(callback) && callback(false)
	// 	});
	// 	head.appendChild(script);
	// 	return true
	// }
	// milo.loadScript = loadScript;

	function loadCSS(url, callback) {
		var head = document.getElementsByTagName("head")[0];
		var link = head.appendChild(document.createElement("link"));
		link.href = url;
		link.rel = "stylesheet";
		callback.call(this, true)
	}

	function onload(node, callback) {
		var isImpOnLoad = "onload" in node ? true : function() {
			node.setAttribute("onload", "");
			return typeof node.onload == "function"
		}();
		if (document.addEventListener) {
			node.addEventListener("load", function() {
				callback.call(this, node)
			}, false)
		} else if (!isImpOnLoad) {
			node.attachEvent("onreadystatechange", function() {
				var rs = node.readyState.toLowerCase();
				if (rs === "loaded" || rs === "complete") {
					node.detachEvent("onreadystatechange");
					callback.call(this, node.innerHTML)
				}
			})
		} else {}
	}

	function onerror(node, callback) {
		if (document.addEventListener) {
			node.addEventListener("error", function() {
				callback.call(this, node)
			}, false)
		} else if ("onerror" in node) {
			node.onerror = function() {
				callback.call(this, node)
			}
		}
	}

	function isUinHit(whiteList) {
		var acctype = milo.cookie.get("acctype"),
			uin = "";
		if (acctype) {
			uin = milo.cookie.get("openid")
		} else {
			acctype = "pt";
			uin = milo.cookie.get("uin")
		}
		if (uin) {
			if (/^o(\S+)/.test(uin)) {
				uin = uin.match(/^o(\S+)/)[1]
			}
			var uinReg = new RegExp("(^|;)" + uin + "(;|$)");
			return uinReg.test(whiteList)
		} else {
			return false
		}
	}

	function isDomainHit(whiteList) {
		return location.hostname == whiteList
	}

	function isDomainRegHit(regStr) {
		var reg = new RegExp(regStr);
		return reg.test(location.hostname)
	}

	function isMultiDomainHit(whiteList) {
		var domainList = whiteList.split(";");
		var isHit = false;
		for (var i = 0; i < domainList.length; i++) {
			var domain = domainList[i].replace(/(^\s*)|(\s*$)/g, "");
			if (domain == location.hostname) {
				isHit = true
			}
		}
		return isHit
	}

	function isUrlHit(whiteList) {
		var url = location.href.match(/https?\:\/\/(\S+)/)[1];
		if (url.indexOf("?") > -1) {
			url = url.split("?")[0]
		}
		if (url.indexOf("#") > -1) {
			url = url.split("#")[0]
		}
		return whiteList.indexOf(url) > -1
	}

	function isUrlRegHit(regStr) {
		var reg = new RegExp(regStr);
		var url = location.href;
		if (reg.test(url)) {
			return true
		}
		url = location.href.match(/https?\:\/\/(\S+)/)[1];
		if (reg.test(url)) {
			return true
		}
		return false
	}
	var oGreyRules = null;

	// function getGreyRules(callback) {
	// 	if (oGreyRules) {
	// 		callback(oGreyRules);
	// 		return
	// 	}
	// 	var configUrl = "https://ossweb-img.qq.com/images/js/milo_config_server/milogrey_milo.js";
	// 	milo.loadScript(configUrl, function(isLoad) {
	// 		if (/(^|\.)(daoju|mall)\.qq\.com$/.test(location.host)) {
	// 			milo.loadScript(
	// 				"https://ossweb-img.qq.com/images/js/milo_config_server/milogrey_milodaoju.js",
	// 				function(isLoadDaoju) {
	// 					var oGreyData = {};
	// 					if (!isLoad && !isLoadDaoju) {
	// 						callback(null);
	// 						return
	// 					}
	// 					if (isLoad) {
	// 						extend(oGreyData, window.Milo_Publish_Path)
	// 					}
	// 					if (isLoadDaoju) {
	// 						extend(oGreyData, window.Milodaoju_Publish_Path)
	// 					}
	// 					oGreyRules = oGreyData;
	// 					callback(oGreyRules)
	// 				})
	// 		} else {
	// 			if (!isLoad) {
	// 				callback(null);
	// 				return
	// 			}
	// 			oGreyRules = window.Milo_Publish_Path;
	// 			callback(oGreyRules)
	// 		}
	// 	})
	// }

	function hitGrey(ruleArr, sUinWhiteList) {
		var isHit = false;
		if (!ruleArr || !ruleArr.length) {
			isHit = false;
			return isHit
		}
		for (var i = 0; i < ruleArr.length; i++) {
			var ruleName = ruleArr[i].split("-")[0];
			var whiteList = ruleArr[i].substr(ruleArr[i].indexOf(ruleName) + ruleName.length + 1);
			if (ruleName == "domain" && isDomainHit(whiteList)) {
				isHit = true
			} else if (ruleName == "domainReg" && isDomainRegHit(whiteList)) {
				isHit = true
			} else if (ruleName == "multiDomain" && isMultiDomainHit(whiteList)) {
				isHit = true
			} else if (ruleName == "url" && isUrlHit(whiteList)) {
				isHit = true
			} else if (ruleName == "urlReg" && isUrlRegHit(whiteList)) {
				isHit = true
			} else if (ruleName == "actid" && isActidHit(whiteList)) {
				isHit = true
			}
		}
		if (sUinWhiteList) {
			isHit = isHit && isUinHit(sUinWhiteList)
		}
		return isHit
	}

	function initGreyUrl(oriFile, version) {
		return milo.config.loaderPath + "grey" + oriFile.split(".")[0] + "-" + version + ".js"
	}

	function getGreyUrl(url, callback) {
		// getGreyRules(function(rules) {
		// 	if (!rules) {
		// 		callback(url);
		// 		return
		// 	}
		// 	var actualUrl = url;
		// 	for (var key in rules) {
		// 		var ruleArr = rules[key].arrRule;
		// 		var sUinWhiteList = rules[key].sUinWhiteList;
		// 		if (hitGrey(ruleArr, sUinWhiteList)) {
		// 			var fileArr = rules[key].arrFiles;
		// 			for (var i = 0; i < fileArr.length; i++) {
		// 				if (/^milo(\S+)\[(\S+)\]/.test(fileArr[i])) {
		// 					var oriFile = fileArr[i].match(/^(milo(\_(build|bundle))?)(\S+)\[(\S+)\]/) &&
		// 						fileArr[i].match(/^(milo(\_(build|bundle))?)(\S+)\[(\S+)\]/)[4];
		// 					var version = fileArr[i].match(/^(milo(\_(build|bundle))?)(\S+)\[(\S+)\]/) &&
		// 						fileArr[i].match(/^(milo(\_(build|bundle))?)(\S+)\[(\S+)\]/)[5];
		// 					var reg = new RegExp("ossweb-img.qq.com/images/js/(milo|milo_bundle)" +
		// 					oriFile);
		// 					if (reg.test(url)) {
		// 						actualUrl = initGreyUrl(oriFile, version)
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// 	callback(actualUrl)
		// })
	}
})(milo.loader);
extend(window, milo.loader);
namespace("milo.dom");
(function() {
	var dom = milo.dom;
	var userAgent = navigator.userAgent.toLowerCase();
	extend(dom, {
		browser: {
			version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, "0"])[1],
			webkit: /webkit/.test(userAgent),
			opera: /opera/.test(userAgent),
			msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
			mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent),
			tt: /tencenttraveler/.test(userAgent),
			chrome: /chrome/.test(userAgent),
			firefox: /firefox/.test(userAgent),
			safari: /safari/.test(userAgent),
			gecko: /gecko/.test(userAgent),
			ie6: this.msie && this.version.substr(0, 1) == "6"
		},
		g: function(obj) {
			return typeof obj == "object" ? obj : document.getElementById(obj)
		},
		hasClassName: function(element, className) {
			var elementClassName = element.className;
			return elementClassName.length > 0 && (elementClassName == className || new RegExp(
				"(^|\\s)" + className + "(\\s|$)").test(elementClassName))
		},
		addClassName: function(element, className) {
			if (!milo.hasClassName(element, className)) element.className += (element.className ? " " :
				"") + className;
			return element
		},
		removeClassName: function(element, className) {
			element.className = milo.trim(element.className.replace(new RegExp("(^|\\s+)" + className +
				"(\\s+|$)"), " "));
			return element
		},
		setStyle: function(ele, styles) {
			for (var i in styles) {
				ele.style[i] = styles[i]
			}
		},
		getStyle: function(el, prop) {
			var viewCSS = isFunction(document.defaultView) ? document.defaultView() : document
				.defaultView;
			if (viewCSS && viewCSS.getComputedStyle) {
				var s = viewCSS.getComputedStyle(el, null);
				return s && s.getPropertyValue(prop)
			}
			return el.currentStyle && (el.currentStyle[prop] || null) || null
		},
		getMaxH: function() {
			return this.getPageHeight() > this.getWinHeight() ? this.getPageHeight() : this
				.getWinHeight()
		},
		getMaxW: function() {
			return this.getPageWidth() > this.getWinWidth() ? this.getPageWidth() : this.getWinWidth()
		},
		getPageHeight: function() {
			var h = window.innerHeight && window.scrollMaxY ? window.innerHeight + window.scrollMaxY :
				document.body.scrollHeight > document.body.offsetHeight ? document.body.scrollHeight :
				document.body.offsetHeight;
			return h > document.documentElement.scrollHeight ? h : document.documentElement.scrollHeight
		},
		getPageWidth: function() {
			return window.innerWidth && window.scrollMaxX ? window.innerWidth + window.scrollMaxX :
				document.body.scrollWidth > document.body.offsetWidth ? document.body.scrollWidth :
				document.body.offsetWidth
		},
		getWinHeight: function() {
			return window.innerHeight ? window.innerHeight : document.documentElement && document
				.documentElement.clientHeight ? document.documentElement.clientHeight : document.body
				.offsetHeight
		},
		getWinWidth: function() {
			return window.innerWidth ? window.innerWidth : document.documentElement && document
				.documentElement.clientWidth ? document.documentElement.clientWidth : document.body
				.offsetWidth
		},
		setOpacity: function(ele, level) {
			if (this.browser.msie && (!document.documentMode || document.documentMode < 9)) {
				ele.style.filter = "Alpha(opacity=" + level + ")"
			} else {
				ele.style.opacity = level / 100
			}
		},
		getX: function(e) {
			var t = e.offsetLeft;
			while (e = e.offsetParent) t += e.offsetLeft;
			return t
		},
		getY: function(e) {
			var t = e.offsetTop;
			while (e = e.offsetParent) t += e.offsetTop;
			return t
		},
		request: function(pa) {
			var url = window.location.href.replace(/#+.*$/, ""),
				params = url.substring(url.indexOf("?") + 1, url.length).split("&"),
				param = {};
			for (var i = 0; i < params.length; i++) {
				var pos = params[i].indexOf("="),
					key = params[i].substring(0, pos),
					val = params[i].substring(pos + 1);
				param[key] = val
			}
			return typeof param[pa] == "undefined" ? "" : param[pa]
		}
	})
})();
namespace("milo.array");
(function() {
	var array = milo.array;
	extend(array, {
		getLength: function(arr) {
			var l = 0;
			for (var key in arr) {
				l++
			}
			return l
		},
		clone: function(arr) {
			var a = [];
			for (var i = 0; i < arr.length; ++i) {
				a.push(arr[i])
			}
			return a
		},
		hasValue: function(arr, value) {
			var find = false;
			if (isArray(arr) || isObject(arr))
				for (var key in arr) {
					if (arr[key] == value) find = true
				}
			return find
		},
		getArrayKey: function(arr, value) {
			var findKey = -1;
			if (isArray(arr) || isObject(arr))
				for (var key in arr) {
					if (arr[key] == value) findKey = key
				}
			return findKey
		},
		filter: function(a1, a2) {
			var res = [];
			for (var i = 0; i < a1.length; i++) {
				if (!milo.hasValue(a2, a1[i])) res.push(a1[i])
			}
			return res
		},
		unique: function(a1, a2) {
			return milo.filter(a1, a2).concat(milo.filter(a2, a1))
		}
	})
})();
namespace("milo.string");
(function() {
	var string = milo.string;
	extend(string, {
		getByteLength: function(str) {
			var bytes = 0,
				i = 0;
			for (; i < str.length; ++i, ++bytes) {
				if (str.charCodeAt(i) > 255) {
					++bytes
				}
			}
			return bytes
		},
		getDwordNum: function(str) {
			return string.getByteLength(str) - str.length
		},
		getChineseNum: function(str) {
			return str.length - str.replace(/[\u4e00-\u9fa5]/g, "").length
		},
		cutChinese: function(str, iMaxBytes, sSuffix) {
			if (isNaN(iMaxBytes)) return str;
			if (string.getByteLength(str) <= iMaxBytes) return str;
			var i = 0,
				bytes = 0;
			for (; i < str.length && bytes < iMaxBytes; ++i, ++bytes) {
				if (str.charCodeAt(i) > 255) {
					++bytes
				}
			}
			sSuffix = sSuffix || "";
			return (bytes - iMaxBytes == 1 ? str.substr(0, i - 1) : str.substr(0, i)) + sSuffix
		},
		trimLeft: function(str) {
			return str.replace(/^\s+/, "")
		},
		trimRight: function(str) {
			return str.replace(/\s+$/, "")
		},
		trim: function(str) {
			return milo.trimRight(milo.trimLeft(str))
		},
		replacePairs: function() {
			var str = arguments[0];
			for (var i = 1; i < arguments.length; ++i) {
				var re = new RegExp(arguments[i][0], "g");
				str = str.replace(re, arguments[i][1])
			}
			return str
		},
		toHtml: function(str) {
			var CONVERT_ARRAY = [
				["&", "&#38;"],
				[" ", "&#32;"],
				["'", "&#39;"],
				['"', "&#34;"],
				["/", "&#47;"],
				["<", "&#60;"],
				[">", "&#62;"],
				["\\\\", "&#92;"],
				["\n", "<br />"],
				["\r", ""]
			];
			return milo.replacePairs.apply(this, [str].concat(CONVERT_ARRAY))
		},
		isMail: function(str) {
			return /^(?:[\w-]+\.?)*[\w-]+@(?:[\w-]+\.)+[\w]{2,3}$/.test(str)
		},
		isTel: function(str) {
			return /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/.test(str)
		},
		isMobile: function(str) {
			return /^1[3456789]\d{9}$/.test(str)
		},
		isZipCode: function(str) {
			return /^(\d){6}$/.test(str)
		},
		isIDCard: function(str) {
			var C15ToC18 = function(c15) {
				var cId = c15.substring(0, 6) + "19" + c15.substring(6, 15);
				var strJiaoYan = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
				var intQuan = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
				var intTemp = 0;
				for (i = 0; i < cId.length; i++) intTemp += cId.substring(i, i + 1) * intQuan[i];
				intTemp %= 11;
				cId += strJiaoYan[intTemp];
				return cId
			};
			var Is18IDCard = function(IDNum) {
				var aCity = {
					11: "\u5317\u4eac",
					12: "\u5929\u6d25",
					13: "\u6cb3\u5317",
					14: "\u5c71\u897f",
					15: "\u5185\u8499\u53e4",
					21: "\u8fbd\u5b81",
					22: "\u5409\u6797",
					23: "\u9ed1\u9f99\u6c5f",
					31: "\u4e0a\u6d77",
					32: "\u6c5f\u82cf",
					33: "\u6d59\u6c5f",
					34: "\u5b89\u5fbd",
					35: "\u798f\u5efa",
					36: "\u6c5f\u897f",
					37: "\u5c71\u4e1c",
					41: "\u6cb3\u5357",
					42: "\u6e56\u5317",
					43: "\u6e56\u5357",
					44: "\u5e7f\u4e1c",
					45: "\u5e7f\u897f",
					46: "\u6d77\u5357",
					50: "\u91cd\u5e86",
					51: "\u56db\u5ddd",
					52: "\u8d35\u5dde",
					53: "\u4e91\u5357",
					54: "\u897f\u85cf",
					61: "\u9655\u897f",
					62: "\u7518\u8083",
					63: "\u9752\u6d77",
					64: "\u5b81\u590f",
					65: "\u65b0\u7586",
					71: "\u53f0\u6e7e",
					81: "\u9999\u6e2f",
					82: "\u6fb3\u95e8",
					91: "\u56fd\u5916"
				};
				var iSum = 0,
					info = "",
					sID = IDNum;
				if (!/^\d{17}(\d|x)$/i.test(sID)) {
					return false
				}
				sID = sID.replace(/x$/i, "a");
				if (aCity[parseInt(sID.substr(0, 2))] == null) {
					return false
				}
				var sBirthday = sID.substr(6, 4) + "-" + Number(sID.substr(10, 2)) + "-" + Number(
					sID.substr(12, 2));
				var d = new Date(sBirthday.replace(/-/g, "/"));
				if (sBirthday != d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())
					return false;
				for (var i = 17; i >= 0; i--) iSum += Math.pow(2, i) % 11 * parseInt(sID.charAt(17 -
					i), 11);
				if (iSum % 11 != 1) return false;
				return true
			};
			return str.length == 15 ? Is18IDCard(C15ToC18(str)) : Is18IDCard(str)
		},
		isChinese: function(str) {
			return milo.getChineseNum(str) == str.length ? true : false
		},
		isEnglish: function(str) {
			return /^[A-Za-z]+$/.test(str)
		},
		isURL: function(str) {
			return /^(https|http):\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/
				.test(str)
		},
		isNumberString: function(str) {
			return /^\d+$/.test(str)
		}
	})
})();
namespace("milo.cookie");
(function() {
	var cookie = milo.cookie;
	extend(cookie, {
		set: function(sName, sValue, iExpireSec, sDomain, sPath, bSecure) {
			if (sName == undefined) {
				return
			}
			if (sValue == undefined) {
				sValue = ""
			}
			var oCookieArray = [sName + "=" + escape(sValue)];
			if (isNumber(iExpireSec) && !isNaN(iExpireSec)) {
				var oDate = new Date;
				oDate.setTime(oDate.getTime() + iExpireSec * 1e3);
				iExpireSec == 0 ? "" : oCookieArray.push("expires=" + oDate.toGMTString())
			}
			if (sDomain != undefined) {
				oCookieArray.push("domain=" + sDomain)
			}
			if (sPath != undefined) {
				oCookieArray.push("path=" + sPath)
			}
			if (bSecure) {
				oCookieArray.push("secure")
			}
			document.cookie = oCookieArray.join("; ")
		},
		get: function(sName, sDefaultValue) {
			var sRE = "(?:; |^)" + sName + "=([^;]*);?";
			var oRE = new RegExp(sRE);
			if (oRE.test(document.cookie)) {
				return unescape(RegExp["$1"])
			} else {
				return sDefaultValue || null
			}
		},
		clear: function(sName, sDomain, sPath) {
			var oDate = new Date;
			cookie.set(sName, "", -oDate.getTime() / 1e3, sDomain, sPath)
		}
	})
})();
namespace("milo.date");
(function() {
	var date = milo.date;
	var _d = new Date;
	extend(date, {
		toDateString: function(nd) {
			var a = [],
				dt = isDate(nd) ? nd : _d;
			m = dt.getMonth() + 1, d = dt.getDate(), sep = arguments[1] ? arguments[1] : isString(
				arguments[0]) ? arguments[0] : "-";
			a.push(dt.getFullYear());
			a.push(m.toString().length < 2 ? "0" + m : m);
			a.push(d.toString().length < 2 ? "0" + d : d);
			return a.join(sep)
		},
		toDateTimeString: function(nd) {
			var dt = isDate(nd) ? nd : _d,
				h = dt.getHours(),
				i = dt.getMinutes(),
				s = dt.getSeconds(),
				a = [];
			a.push(h.toString().length < 2 ? "0" + h : h);
			a.push(i.toString().length < 2 ? "0" + i : i);
			a.push(s.toString().length < 2 ? "0" + s : s);
			return date.toDateString.apply(this, arguments) + " " + a.join(":")
		},
		isLeapYear: function(year) {
			return 0 == year % 4 && (year % 100 != 0 || year % 400 == 0)
		},
		getSeverDateTime: function() {
			var xhr = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") :
			new XMLHttpRequest;
			xhr.open("HEAD", window.location.href, false);
			xhr.send();
			var d = new Date(xhr.getResponseHeader("Date"));
			return d
		}
	})
})();
namespace("milo.number");
(function() {
	var number = milo.number;
	extend(number, {
		isInt: function(n, iMin, iMax) {
			if (!isFinite(n)) {
				return false
			}
			if (!/^[+-]?\d+$/.test(n)) {
				return false
			}
			if (iMin != undefined && parseInt(n) < parseInt(iMin)) {
				return false
			}
			if (iMax != undefined && parseInt(n) > parseInt(iMax)) {
				return false
			}
			return true
		},
		isFloat: function(n, fMin, fMax) {
			if (!isFinite(n)) {
				return false
			}
			if (fMin != undefined && parseFloat(n) < parseFloat(fMin)) {
				return false
			}
			if (fMax != undefined && parseFloat(n) > parseFloat(fMax)) {
				return false
			}
			return true
		},
		isQQ: function(qq) {
			return /^[1-9]{1}\d{4,11}$/.test(qq)
		},
		randomInt: function(n) {
			return Math.floor(Math.random() * n)
		}
	})
})();
namespace("milo.event");
(function() {
	var event = milo.event;
	extend(event, {
		preventDefault: function(e) {
			if (e.preventDefault) {
				e.preventDefault()
			} else {
				e.returnValue = false
			}
		},
		stopPropagation: function(e) {
			if (e.stopPropagation) {
				e.stopPropagation()
			} else {
				e.cancelBubble = true
			}
		},
		addEvent: function(el, type, fn) {
			if (window.addEventListener) {
				el["e" + type + fn] = fn;
				el[type + fn] = function(e) {
					var _e = e || window.event,
						_r = el["e" + type + fn](_e);
					if (_r == false) {
						milo.preventDefault(_e);
						milo.stopPropagation(_e)
					}
				};
				el.addEventListener(type, el[type + fn], false)
			} else if (window.attachEvent) {
				el["e" + type + fn] = fn;
				el[type + fn] = function(e) {
					var _r = el["e" + type + fn](window.event);
					if (_r == false) milo.preventDefault(window.event)
				};
				el.attachEvent("on" + type, el[type + fn]);
				return
			} else {
				el["on" + type] = fn
			}
		},
		removeEvent: function(_el, _type, _fn) {
			var removeSingle = function(el, type, fn) {
				if (window.removeEventListener) {
					el.removeEventListener(type, el[type + fn], false);
					el[type + fn] = null
				} else if (window.detachEvent) {
					el.detachEvent("on" + type, el[type + fn]);
					el[type + fn] = null;
					return
				} else {
					el["on" + type] = null
				}
			};
			if ("undefined" == typeof _fn) {
				for (var k in _el) {
					if (0 == k.indexOf(_type) && "function" == typeof _el[k]) {
						removeSingle(_el, _type, k.substring(_type.length))
					}
				}
			} else {
				removeSingle(_el, _type, _fn)
			}
		},
		isReady: false,
		readyFn: [],
		ready: function(fn) {
			bindReadyEvent();
			if (milo.isReady) {
				fn.call()
			} else {
				if (isFunction(fn)) {
					milo.readyFn.push(fn)
				}
			}
		}
	});

	function bindReadyEvent() {
		if (document.readyState === "complete") {
			return ready()
		}
		if (document.addEventListener) {
			document.addEventListener("DOMContentLoaded", function() {
				document.removeEventListener("DOMContentLoaded", arguments.callee, false);
				ready()
			}, false);
			window.addEventListener("load", ready, false)
		} else if (document.attachEvent) {
			document.attachEvent("onreadystatechange", function() {
				if (document.readyState === "complete") {
					document.detachEvent("onreadystatechange", arguments.callee);
					ready()
				}
			});
			window.attachEvent("onload", ready);
			if (document.documentElement.doScroll && window == window.top) {
				if (milo.isReady) return;
				try {
					document.documentElement.doScroll("left")
				} catch (e) {
					setTimeout(arguments.callee, 0);
					return
				}
				ready()
			}
		}
	}

	function ready() {
		if (!milo.isReady) {
			if (!document.body) {
				return setTimeout(ready, 13)
			}
			milo.isReady = true;
			if (milo.readyFn.length > 0) {
				var i = 0,
					fn;
				while (fn = milo.readyFn[i++]) fn.call();
				milo.readyFn.length = 0
			}
		}
	}
})();
namespace("milo.object");
(function() {
	extend(milo.object, {
		serialize: function(jsonObj) {
			var newJsonObj = null;
			if (typeof jsonObj == "undefined" || typeof jsonObj == "function") newJsonObj = "";
			if (typeof jsonObj == "number") newJsonObj = jsonObj.toString();
			if (typeof jsonObj == "boolean") newJsonObj = jsonObj ? "1" : "0";
			if (typeof jsonObj == "object") {
				if (!jsonObj) newJsonObj = "";
				if (jsonObj instanceof RegExp) newJsonObj = jsonObj.toString()
			}
			if (typeof jsonObj == "string") newJsonObj = jsonObj;
			if (typeof newJsonObj == "string") return encodeURIComponent(newJsonObj);
			var ret = [];
			if (jsonObj instanceof Array) {
				for (var i = 0; i < jsonObj.length; i++) {
					if (typeof jsonObj[i] == "undefined") continue;
					ret.push(typeof jsonObj[i] == "object" ? "" : milo.serialize(jsonObj[i]))
				}
				return ret.join("|")
			} else {
				for (var i in jsonObj) {
					if (typeof jsonObj[i] == "undefined") continue;
					newJsonObj = null;
					if (typeof jsonObj[i] == "object") {
						if (jsonObj[i] instanceof Array) {
							newJsonObj = jsonObj[i];
							ret.push(i + "=" + milo.serialize(newJsonObj))
						} else {
							ret.push(i + "=")
						}
					} else {
						newJsonObj = jsonObj[i];
						ret.push(i + "=" + milo.serialize(newJsonObj))
					}
				}
				return ret.join("&")
			}
		},
		unSerialize: function(jsonStr, de) {
			de = de || 0;
			jsonStr = jsonStr.toString();
			if (!jsonStr) return {};
			var retObj = {},
				obj1Ret = jsonStr.split("&");
			if (obj1Ret.length == 0) return retObj;
			for (var i = 0; i < obj1Ret.length; i++) {
				if (!obj1Ret[i]) continue;
				var ret2 = obj1Ret[i].split("=");
				if (ret2.length >= 2) {
					var ret0 = obj1Ret[i].substr(0, obj1Ret[i].indexOf("=")),
						ret1 = obj1Ret[i].substr(obj1Ret[i].indexOf("=") + 1);
					if (!ret1) ret1 = "";
					if (ret0) retObj[ret0] = de == 0 ? decodeURIComponent(ret1) : ret1
				}
			}
			return retObj
		},
		decode: function(newopt) {
			if (typeof newopt == "string") {
				try {
					return decodeURIComponent(newopt)
				} catch (e) {}
				return newopt
			}
			if (typeof newopt == "object") {
				if (newopt == null) {
					return null
				}
				if (newopt instanceof Array) {
					for (var i = 0; i < newopt.length; i++) {
						newopt[i] = milo.decode(newopt[i])
					}
					return newopt
				} else if (newopt instanceof RegExp) {
					return newopt
				} else {
					for (var i in newopt) {
						newopt[i] = milo.decode(newopt[i])
					}
					return newopt
				}
			}
			return newopt
		}
	})
})();
milo.base.extend(milo, milo.dom);
milo.base.extend(milo, milo.array);
milo.base.extend(milo, milo.string);
milo.base.extend(milo, milo.date);
milo.base.extend(milo, milo.number);
milo.base.extend(milo, milo.event);
milo.base.extend(milo, milo.object);
namespace("milo.ams");
(function() {
	function getAmsFileUrl(iActivityId) {
		var sActId = iActivityId + "";
		var iActId = Number(iActivityId);
		var _url = "";
		if (isString(window["ams_actdesc_secure_" + sActId])) {
			_url = location.protocol + "//" + window.location.host + "/comm-htdocs/js/ams/actDesc/" + sActId.substr(
				sActId.length - 3) + "/" + window["ams_actdesc_secure_" + sActId] + "/act.desc.js"
		} else {
			if (iActId >= 125300) {
				_url = location.protocol + "//" + window.location.host + "/comm-htdocs/js/ams/actDesc/" + sActId
					.substr(sActId.length - 3) + "/" + sActId + "/act.desc.js"
			} else {
				_url = location.protocol + "//" + window.location.host + "/comm-htdocs/js/ams/v0.2R02/act/" +
					sActId + "/act.desc.js"
			}
		}
		return _url
	}

	function getAmsFile(amsActivityId, flowId, callback) {
		if (!isFunction(callback)) callback = function(obj) {};
		var cur_actdesc = window["ams_actdesc_" + amsActivityId];
		if (isObject(cur_actdesc)) {
			callback(cur_actdesc);
			return
		}
		if (!amsActivityId || isNaN(amsActivityId) || amsActivityId <= 0) return;
		var _url = getAmsFileUrl(amsActivityId);
		milo.loadScript(_url, function(loaded) {
			if (false === loaded) {
				alert(
					"\u6d3b\u52a8\u914d\u7f6e\u83b7\u53d6\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u6216\u91cd\u8bd5");
				return
			}
			callback(window["ams_actdesc_" + amsActivityId]);
			return
		})
	}

	function getDesc(obj, callback) {
		var actDesc = window["ams_actdesc_" + obj.actId];
		var _url = getAmsFileUrl(obj.ctId);
		if (isObject(actDesc)) {
			callback(obj, actDesc);
			return
		}
		milo.loadScript(_url, function(loaded) {
			if (false === loaded) {
				alert(
					"\u6d3b\u52a8\u914d\u7f6e\u83b7\u53d6\u5931\u8d25\uff0c\u8bf7\u68c0\u67e5\u6216\u91cd\u8bd5");
				return
			}
			callback(obj, window["ams_actdesc_" + obj.actId]);
			return
		})
	}

	function init(obj) {
		getDesc(obj, function(obj, descData) {
			var flows = descData.flows,
				flow = null,
				cfg = obj;
			for (fid in flows) {
				if (fid == "f_" + obj.flowId) {
					flow = flows[fid];
					break
				}
			}
			if (flow == null) {
				return
			}
			if (flow.functions[0].sExtModuleId == null) {
				need("ams.flowengine", function(FlowEngine) {
					FlowEngine.submit(window["amsCfg_" + obj.flowId])
				})
			} else {
				var modName = flow.functions[0].method;
				if (obj.modJsPath && obj.modJsPath.indexOf("http") === -1) {} else if (obj.modJsPath) {}
				need("ams." + modName, function() {
					var module = modName.split("."),
						mn = module[module.length - 1],
						newObj = window[mn + "_" + obj.flowId];
					if (isObject(newObj) && isFunction(obj.modSubmit)) {
						if (!isFunction(newObj.submit)) {
							newObj.init(cfg);
							return false
						} else if (cfg._everyRead && isFunction(newObj.submit)) {
							newObj.init(cfg);
							obj.modSubmit(window[mn + "_" + obj.flowId]);
							return false
						} else {
							obj.modSubmit(newObj);
							return false
						}
					}
					window[mn + "_" + obj.flowId] = cloneClass(arguments[0]);
					window[mn + "_" + obj.flowId].init(cfg);
					if (isFunction(obj.modSubmit)) {
						obj.modSubmit(window[mn + "_" + obj.flowId])
					}
				})
			}
		})
	}

	function submit(obj) {
		obj.modSubmit = function(modObj) {
			if (isFunction(modObj.submit)) {
				modObj.submit(obj.flowId)
			}
		};
		init(obj)
	}
	extend(milo.ams, {
		getActivityConfig: function(iActivityId, callback) {
			getAmsFile(iActivityId, "", function(actConfig) {
				isFunction(callback) && callback(actConfig)
			})
		},
		amsInit: function(amsActivityId, flowId, callback) {
			if (arguments.length === 1) {
				init(amsActivityId);
				return
			}
			getAmsFile(amsActivityId, flowId, function(ams_actdesc) {
				var flows = ams_actdesc.flows,
					flow = null,
					cfg = window["amsCfg_" + flowId] || {};
				for (fid in flows) {
					if (fid == "f_" + flowId) {
						flow = flows[fid];
						break
					}
				}
				if (flow == null) return;
				cfg.iAMSActivityId = amsActivityId;
				cfg.iFlowId = flowId;
				if (flow.functions[0].sExtModuleId == null) {
					need("ams.flowengine", function(FlowEngine) {
						FlowEngine.submit(window["amsCfg_" + flowId])
					})
				} else {
					var modName = flow.functions[0].method;
					if (amsActivityId > 6686 && amsActivityId != 6688 && amsActivityId !=
						6701 && amsActivityId != 6731 && (modName == "share.microblogFix" ||
							modName == "share.microblogUser" || modName == "share.qqgameFeed" ||
							modName == "share.qqSignButton" || modName ==
							"share.qqSignQueryTime" || modName == "share.qqSignRadio" ||
							modName == "share.qzoneFix" || modName == "share.qzoneUser" ||
							modName == "share.shareQueryHistory")) {
						flow.functions[0].method = "share.commShare"
					}
					if ((amsActivityId == 6370 || amsActivityId == 6241 || amsActivityId ==
							3733) && (modName == "share.microblogFix" || modName ==
							"share.microblogUser" || modName == "share.qqgameFeed" || modName ==
							"share.qqSignButton" || modName == "share.qqSignQueryTime" ||
							modName == "share.qqSignRadio" || modName == "share.qzoneFix" ||
							modName == "share.qzoneUser" || modName == "share.shareQueryHistory"
							)) {
						flow.functions[0].method = "share.commShare"
					}
					need("ams." + flow.functions[0].method, function() {
						var module = flow.functions[0].method.split("."),
							mn = module[module.length - 1],
							newObj = window[mn + "_" + flowId];

						if (isObject(newObj) && isFunction(callback)) {
							if (!isFunction(newObj.submit)) {
								newObj.init(cfg, flow);
								return false
							} else if (cfg._everyRead && isFunction(newObj.submit)) {
								newObj.init(cfg, flow);
								callback(window[mn + "_" + flowId]);
								return false
							} else {
								callback(newObj);
								return false
							}
						}
						window[mn + "_" + flowId] = cloneClass(arguments[0]);
						window[mn + "_" + flowId].init(cfg, flow);
						if (isFunction(callback)) {
							callback(window[mn + "_" + flowId])
						}
					})
				}
			})
		},
		amsSubmit: function(amsActivityId, flowId) {
			if (arguments.length === 1) {
				submit(amsActivityId);
				return
			}
			var caller = arguments.callee.caller;
			if (window.event && window.event.srcElement && window.event.srcElement != document ||
				caller && caller.arguments[0]) {
				var ev = window.event || caller.arguments[0];
				if (ev[0]) {
					var target = ev[0]
				} else {
					var target = ev.srcElement || ev.target
				}
				if (target) {
					var data = target.getAttribute && target.getAttribute("action-data") || {};
					_amsCFG = window["amsCfg_" + flowId];
					try {
						_amsCFG.triggerSourceData = eval("(" + data + ")")
					} catch (e) {
						_amsCFG.triggerSourceData = data
					}
				}
			}
			amsInit(amsActivityId, flowId, function(obj) {
				if (isFunction(obj.submit)) {
					obj.submit(flowId)
				}
			})
		}
	})
})();
milo.base.extend(window, milo.ams);
namespace("milo.ui");
(function() {
	extend(milo.ui, {
		alert: function(msg) {
			alert(msg)
		}
	})
})();
namespace("milo.xss");
(function() {
	var xss = milo.xss;
	extend(xss, {
		filter: function(oriStr) {
			if (!oriStr) {
				return oriStr
			}
			var charCodes = ["3c", "3e", "27", "22", "28", "29", "60", {
				format: "script{}",
				chr: "3a"
			}];
			var xssChars = [],
				filterChars = [],
				tmpFormat = "{}",
				tmpChr;
			for (var i = 0; i < charCodes.length; i++) {
				if ("string" == typeof charCodes[i]) {
					tmpFormat = "{}";
					tmpChr = charCodes[i]
				} else {
					tmpFormat = charCodes[i].format;
					tmpChr = charCodes[i].chr
				}
				xssChars.push(tmpFormat.replace("{}", "\\u00" + tmpChr));
				xssChars.push(tmpFormat.replace("{}", "%" + tmpChr));
				xssChars.push(tmpFormat.replace("{}", "%25" + tmpChr));
				filterChars.push(tmpFormat.replace("{}", "&#x" + tmpChr + ";"));
				filterChars.push(tmpFormat.replace("{}", "%26%23x" + tmpChr + "%3B"));
				filterChars.push(tmpFormat.replace("{}", "%2526%2523x" + tmpChr + "%253B"))
			}
			for (var i = 0; i < xssChars.length; i++) {
				oriStr = oriStr.replace(new RegExp(xssChars[i], "gi"), filterChars[i])
			}
			oriStr = oriStr.replace(/script[\u000d\u000a\u0020]+\:/i, "script&#x3a;");
			return oriStr
		},
		filterWxNickName: function(oriStr) {
			var matchArr = oriStr.match(/\<span\sclass\=\"emoji\semoji[0-9a-z]+\"\>\<\/span\>/g);
			var oriTagStr = "",
				filterTagStr = "";
			var tag = "{tag_" + (new Date).getTime() + "}";
			if (!matchArr || !matchArr.length) {
				return this.filter(oriStr)
			} else {
				oriTagStr = oriStr.replace(/\<span\sclass\=\"emoji\semoji[0-9a-z]+\"\>\<\/span\>/g,
				tag);
				filterTagStr = this.filter(oriTagStr);
				for (var i = 0; i < matchArr.length; i++) {
					filterTagStr = filterTagStr.replace(tag, matchArr[i])
				}
				return filterTagStr
			}
		},
		isSafeUrl: function(_url, oSafeConfig) {
			oSafeConfig = oSafeConfig || {
				whiteDomain: ["qq.com", "tencent.com"],
				blackDomain: ["p.imtt.qq.com"]
			};
			var whiteDomain = oSafeConfig.whiteDomain || ["qq.com", "tencent.com"];
			var blackDomain = oSafeConfig.blackDomain || ["p.imtt.qq.com"];
			var isLegalDomain = function(url) {
				var isLegal = false;
				var regStr =
					"^(https\\:\\/\\/|http\\:\\/\\/|\\/\\/|)([0-9a-z-A-Z]+\\.)*reg(\\:[0-9]*){0,1}(\\/{1,2}.*){0,1}$";
				var regWhite = null;
				for (var i = 0; i < whiteDomain.length; i++) {
					regWhite = new RegExp(regStr.replace("reg", whiteDomain[i].replace(/\./g,
						"\\.")));
					if (regWhite.test(url)) {
						isLegal = true
					}
				}
				if (isLegal == false) {
					return false
				}
				var regBlack = null;
				for (var i = 0; i < blackDomain.length; i++) {
					regBlack = new RegExp(regStr.replace("reg", blackDomain[i].replace(/\./g,
						"\\.")));
					if (regBlack.test(url)) {
						isLegal = false
					}
				}
				return isLegal
			};
			return isLegalDomain(_url)
		}
	})
})();
namespace("milo.loginStatus");
(function() {
	var loginStatus = milo.loginStatus;
	extend(loginStatus, {
		arrCallbacks: [],
		doCallback: function(service) {
			var self = this;
			for (var i = 0; i < self.arrCallbacks.length;) {
				var cbObj = self.arrCallbacks[i];
				if (service == cbObj.service) {
					var childWin = g("loginStatusSyncFrame_" + cbObj.service).contentWindow || null;
					if (isFunction(cbObj.cb)) {
						cbObj.cb(childWin)
					}
					self.arrCallbacks.splice(i, 1)
				} else {
					i++;
					continue
				}
			}
		},
		waitingQueue: {},
		isInitMessage: false,
		isLegalOrigin: function(url) {
			var whiteDomain = ["qq.com"];
			var blackDomain = ["p.imtt.qq.com"];
			var isLegal = false;
			var regStr =
				"^(https\\:\\/\\/|http\\:\\/\\/|\\/\\/|)([0-9a-z-A-Z]+\\.)*reg(\\:[0-9]*){0,1}(\\/{1,2}.*){0,1}$";
			var regWhite = null;
			for (var i = 0; i < whiteDomain.length; i++) {
				regWhite = new RegExp(regStr.replace("reg", whiteDomain[i].replace(/\./g, "\\.")));
				if (regWhite.test(url)) {
					isLegal = true
				}
			}
			if (isLegal == false) {
				return false
			}
			var regBlack = null;
			for (var i = 0; i < blackDomain.length; i++) {
				regBlack = new RegExp(regStr.replace("reg", blackDomain[i].replace(/\./g, "\\.")));
				if (regBlack.test(url)) {
					isLegal = false
				}
			}
			return isLegal
		},
		init: function(service, url, callback) {
			var self = this;
			self.arrCallbacks.push({
				cb: callback,
				service: service
			});
			var asyncCookieFrame = document.getElementById("loginStatusSyncFrame_" + service);
			if (!window.miloWaitingQueue) {
				window.miloWaitingQueue = {}
			}
			if (asyncCookieFrame && "2" == asyncCookieFrame.getAttribute("miloloadstatus")) {
				self.doCallback(service);
				return
			}
			if (1 === window.miloWaitingQueue[service] || asyncCookieFrame && "1" == asyncCookieFrame
				.getAttribute("miloloadstatus")) {
				return
			}
			window.miloWaitingQueue[service] = 1;
			milo.ready(function() {
				var iframe = document.createElement("iframe");
				iframe.src = url;
				iframe.id = "loginStatusSyncFrame_" + service;
				iframe.width = 0;
				iframe.height = 0;
				iframe.frameborder = 0;
				iframe.style.border = "0";
				iframe.style.display = "none";
				iframe.setAttribute("miloloadstatus", "1");
				document.body.appendChild(iframe);
				if (iframe.attachEvent) {
					iframe.attachEvent("onload", function() {
						window.miloWaitingQueue[service] = 0;
						iframe.setAttribute("miloloadstatus", "2");
						self.doCallback(service)
					})
				} else {
					iframe.onload = function() {
						window.miloWaitingQueue[service] = 0;
						iframe.setAttribute("miloloadstatus", "2");
						self.doCallback(service)
					}
				}
			});
			if (self.isInitMessage) {
				return
			}
			if ("function" == typeof window.postMessage) {
				window.addEventListener("message", function(e) {
					if (!self.isLegalOrigin(e.origin)) {
						return
					}
					var eData = {};
					if (!e.data) {
						return
					}
					if ("string" == typeof e.data) {
						try {
							eval("eData=" + e.data)
						} catch (err) {
							console.log("milojs:eval postmessage errror,", err)
						}
					} else {
						eData = e.data
					}
					if (eData && eData.callbackName && "done" == eData.action) {
						if (isFunction(window[eData.callbackName])) {
							if (eData.data) {
								window[eData.callbackName](eData.data)
							} else {
								window[eData.callbackName]()
							}
						}
					}
				}, false)
			}
			self.isInitMessage = true
		},
		syncFromAME: function(callback) {
			this.init("ams_from_ame", "https://apps.game.qq.com/comm-htdocs/login/readLoginStatus.html",
				function() {
					var iframe = g("loginStatusSyncFrame_ams_from_ame");
					var newCookie = [];
					if ("function" == typeof window.postMessage) {
						var callbackName = "syncFromAME_" + Math.ceil(1e5 * Math.random());
						window[callbackName] = function(e) {
							try {
								isFunction(callback) && callback(JSON.parse(e))
							} catch (e) {
								console.log("milo.js syncFromAME error:", e)
							}
						};
						iframe.contentWindow.postMessage("loginStatus|" + newCookie.join(",") +
							"|" + callbackName, "*")
					}
				})
		},
		syncToQQ: function(domain, oCookie, callback) {
			if (!oCookie || "qc" != oCookie.acctype) {
				return
			}
			var service = domain.split(".")[0];
			this.init(service, location.protocol + "//" + domain +
				"/comm-htdocs/login/asyncLoginStatus.html",
				function() {
					var iframe = g("loginStatusSyncFrame_" + service);
					var newCookie = [];
					for (var k in oCookie) {
						newCookie.push([encodeURIComponent(k), encodeURIComponent(oCookie[k]),
							encodeURIComponent("/"), 600
						].join("="))
					}
					if ("function" == typeof window.postMessage) {
						var callbackName = "syncToQQ_" + Math.ceil(1e5 * Math.random());
						window[callbackName] = function() {
							isFunction(callback) && callback()
						};
						iframe.contentWindow.postMessage("loginStatus|" + newCookie.join(",") +
							"|" + callbackName, "*")
					}
				})
		},
		syncToAME: function(callback, host) {
			var ameHost = "apps.game.qq.com";
			if (host) {
				ameHost = host
			}
			var self = this;
			self.clearAME(function() {
				if ("qc" != milo.cookie.get("acctype") && "wg" != milo.cookie.get("acctype") &&
					"ks" != milo.cookie.get("acctype")) {
					isFunction(callback) && callback();
					return
				}
				var callbackName = "syncToAME_" + Math.ceil(1e5 * Math.random());
				window[callbackName] = function() {
					isFunction(callback) && callback()
				};
				var oCookie = {
					acctype: milo.cookie.get("acctype") || "",
					openid: milo.cookie.get("openid") || "",
					access_token: milo.cookie.get("access_token") || "",
					appid: milo.cookie.get("appid") || "",
					refresh_token: milo.cookie.get("refresh_token") || ""
				};
				if ("qc" == milo.cookie.get("acctype") && window.iUseQQConnect != 1) {
					oCookie = {
						acctype: "",
						openid: "",
						access_token: "",
						appid: ""
					}
				}
				if ("function" != typeof window.postMessage) {
					var newCookie = {};
					for (var k in oCookie) {
						newCookie[k] = [oCookie[k], "/", 600]
					}
					self.init("ams_ame", location.protocol + "//" + ameHost +
						"/ams/asyncCookie.html",
						function(childWin) {
							childWin.syncCookie({
								action: "ame",
								cookieObj: newCookie
							}, function() {
								isFunction(callback) && callback()
							})
						})
				} else {
					self.init("ams_ame", location.protocol + "//" + ameHost +
						"/ams/asyncCookie.html",
						function() {
							var iframe = g("loginStatusSyncFrame_ams_ame");
							var newCookie = {};
							for (var k in oCookie) {
								newCookie[k] = [oCookie[k], "/", 600]
							}
							iframe.contentWindow.postMessage(JSON.stringify({
								action: "ame",
								cookieObj: newCookie,
								callbackName: callbackName
							}), "*")
						})
				}
			}, [], host)
		},
		clearAME: function(callback, arrCookies, host) {
			var ameHost = "apps.game.qq.com";
			if (host) {
				ameHost = host
			}
			var callbackName = "syncToAME_" + Math.ceil(1e5 * Math.random());
			window[callbackName] = function() {
				isFunction(callback) && callback()
			};
			var oCookie = {
				acctype: "",
				openid: "",
				access_token: "",
				appid: ""
			};
			if (arrCookies && arrCookies.length) {
				oCookie = {};
				for (var i = 0; i < arrCookies.length; i++) {
					oCookie[arrCookies[i]] = ""
				}
			}
			if ("function" != typeof window.postMessage) {
				var newCookie = {};
				for (var k in oCookie) {
					newCookie[k] = [oCookie[k], "/", -600]
				}
				this.init("ams_ame", location.protocol + "//" + ameHost + "/ams/asyncCookie.html",
					function(childWin) {
						childWin.syncCookie({
							action: "onlygame",
							cookieObj: newCookie
						}, function() {
							isFunction(callback) && callback()
						})
					})
			} else {
				this.init("ams_ame", location.protocol + "//" + ameHost + "/ams/asyncCookie.html",
					function() {
						var iframe = g("loginStatusSyncFrame_ams_ame");
						var newCookie = {};
						for (var k in oCookie) {
							newCookie[k] = [oCookie[k], "/", -600]
						}
						iframe.contentWindow.postMessage(JSON.stringify({
							action: "onlygame",
							cookieObj: newCookie,
							callbackName: callbackName
						}), "*")
					})
			}
		}
	})
})();
if (typeof window.onbeforeunload == "function") {
	var temp_onbeforeunload = window.onbeforeunload
}
window.onbeforeunload = function() {
	if (typeof temp_onbeforeunload == "function") {
		temp_onbeforeunload()
	}
	milo.cookie.clear("lg_source", "qq.com", "/");
	milo.cookie.clear("ams_game_appid", "qq.com", "/")
};
! function() {
	if ("object" != typeof window.console) {
		window.console = {}
	}
	if ("function" != typeof window.console.log) {
		window.console.log = function() {}
	}
}();
// ! function() {
// 	milo.loadScript(location.protocol + "//ossweb-img.qq.com/images/js/eas/eas.js")
// }();
if (1 != window.MILO_Ready_FrontMonitor) {
	window.MILO_Ready_FrontMonitor = 1;
	milo.frontmonitor = {
		isReady: false,
		arrReady: [],
		oFrontmonitor: null,
		ready: function(callback) {
			this.arrReady.push(callback);
			if (!this.isReady) {
				return
			}
			while (this.arrReady.length) {
				var tmpCb = this.arrReady.shift();
				isFunction(tmpCb) && tmpCb(this.oFrontmonitor)
			}
		},
		setReady: function(oFrontmonitor) {
			this.isReady = true;
			this.oFrontmonitor = oFrontmonitor;
			while (this.arrReady.length) {
				var tmpCb = this.arrReady.shift();
				isFunction(tmpCb) && tmpCb(this.oFrontmonitor)
			}
		}
	};
	// milo.loadScript(milo.config.loaderPath + "biz/frontmonitor.js", function(isLoad) {
	// 	if (!isLoad) {
	// 		console.warn("\u7c73\u9646\u524d\u7aef\u76d1\u63a7\u52a0\u8f7d\u5931\u8d25!");
	// 		return
	// 	}
	// 	if (!window.No_FrontMonitor_Auto) {
	// 		need("biz.frontmonitor", function(frontmonitor) {
	// 			milo.frontmonitor.setReady(frontmonitor);
	// 			frontmonitor.init()
	// 		})
	// 	} else {
	// 		console.log("MiloFrontMonitorClose")
	// 	}
	// })
}
need("ams.atm", function(ATM) {
	if (ATM && isFunction(ATM.reportVist)) {
		ATM.reportVist()
	}
});
// ! function() {
// 	if (milo.request("sMiloDebugToken")) {
// 		milo.loadScript("https://ossweb-img.qq.com/images/js/miloweb/debug/latest/miloDebug.js", function(isLoad) {
// 			if (isLoad && !window.MiloDebug && miloDebug) {
// 				window.MiloDebug = {
// 					instance: new miloDebug,
// 					setJsonp: function(url, response) {
// 						var res = response;
// 						if (!isString(response)) {
// 							try {
// 								res = JSON.stringify(response)
// 							} catch (err) {
// 								console.log("[miloDebug]jsonp stringify error", err)
// 							}
// 						}
// 						this.instance.do("network.setJsonpResponse", url, res)
// 					},
// 					setXhr: function(oXhrData) {
// 						if (isObject(oXhrData)) {
// 							var url = oXhrData.url;
// 							var sResponseText = oXhrData.sResponseText;
// 							var method = oXhrData.method;
// 							if (!isString(sResponseText)) {
// 								try {
// 									sResponseText = JSON.stringify(sResponseText)
// 								} catch (err) {
// 									console.log("[miloDebug]setXhr stringify error", err)
// 								}
// 							}
// 							this.instance.do("network.setXhrResponse", {
// 								url: url,
// 								response: sResponseText,
// 								method: method
// 							})
// 						}
// 					}
// 				}
// 			}
// 		})
// 	}
// }();