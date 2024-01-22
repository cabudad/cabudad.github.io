$(window).scroll(function() {
	if($(document).scrollTop() < 450) {
		$('.btnkfbx').css('display', 'none');
	} else {
		$('.btnkfbx').css('display', 'block');
	}
})
$('.kfclosevid').click(function() {
	$('.btnkfbx').addClass('on')
})

const Dialog = defineconflict2();
function TGDialogS(e) {
	Dialog.show({
			id: e,
			bgcolor: '#000',
			opacity: 50 
	});
}

function closeDialog() {
	Dialog.hide();
}


$('.gunbifc').click(function(){
	$(this).parent('.boxfc').hide();
})
$('.listwish .btnchangeyw').click(function() {
    $(this).parent('.bxwhisrig').siblings('.boxfc').show();
})

function updateImagesAndText(element) {
    var img1 = element.children('img').attr('src');
    element.parent('.boxfc').siblings('.bxlfpic').children('img').attr('src', img1);
    var txt1 = element.children('.textnmdj').text();
    element.parent('.boxfc').siblings('.bxlfpic').children('.whisname').text(txt1);
}
let thisClick;
var flag = 0;
var indeXuanz2 = false;
var btnxuanz = $('.boxfc a');

function IEVersion() {
        var userAgent = navigator.userAgent;
        //取得浏览器的userAgent字符串
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
        //判断是否IE<11浏览器
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE;
        //判断是否IE的Edge浏览器
        var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        if (isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if (fIEVersion == 7) {
                return 7;
            } else if (fIEVersion == 8) {
                return 8;
            } else if (fIEVersion == 9) {
                return 9;
            } else if (fIEVersion == 10) {
                return 10;
            } else {
                return 6;
                //IE版本<=7
            }
        } else if (isEdge) {
            return 'edge';
            //edge
        } else if (isIE11) {
            return 11;
            //IE11
        } else {
            return -1;
            //不是ie浏览器
        }
    }
    var version = IEVersion();
    if (version != "edge" && version != -1 && version <= 9 && location.hostname == "act.daoju.qq.com") {
        alert("亲爱的玩家，您的浏览器版本过低，请您升级浏览器版本。推荐您使用chrome浏览器以获得更优质体验。");
    }
    
    function browserRedirect() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            if(location.hostname == "app.daoju.qq.com"){
                return;
            }
            if (window.location.search) {
                // window.location.href = '//app.daoju.qq.com' + location.pathname + window.location.search + '&plat_support=mqq';
                window.location.href = '//app.daoju.qq.com' + location.pathname + window.location.search;
            } else {
                window.location.href = '//app.daoju.qq.com' + location.pathname;
            }
        } else {
            if(location.hostname == "act.daoju.qq.com"){
                return;
            }
            location.href = '//act.daoju.qq.com'+location.pathname + window.location.search
        }
    }

    window.alert = function (msg, callback, callback1) {
		const Dialog = defineconflict();
		Dialog.alert(msg, {
			onConfirm: function () {
				typeof callback == "function" ? callback() : console.log("no callback")
			},
			onClose: function () {
				typeof callback1 == "function" ? callback1() : console.log("no callback1")
			}
		});
    };
    
    window.confirm = function (msg, callback, callback1, callback2) {
		const Dialog = defineconflict();
		Dialog.confirm(msg, {
			onConfirm: function () {
				typeof callback == "function" ? callback() : console.log("no confirmCB")
			},
			onCancel: function () {
				typeof callback1 == "function" ? callback1() : console.log("no cancelCB")
			},
			onClose: function () {
				typeof callback1 == "function" ? callback2() : console.log("no closeCB")
			}
		});
    };
    
    //判断微信app
    function isWxApp() {
        return /MicroMessenger/gi.test(navigator.userAgent);
    }
    
    //判断掌火
    function isZhApp(){
        return /GameHelper_1001/.test(navigator.userAgent) || /cfapp/.test(navigator.userAgent);
    }
	
    //对连抽数据结果处理
    function tenResult(iPackageIdCnt, sPackageName) {
        var idArr = iPackageIdCnt.substring(0, iPackageIdCnt.length - 1).split(",");
        var nameArr = sPackageName.split(",");
        var obj = [];
    
        $.each(idArr, function (k, v) {
            tmp = {
                id: v.split(":")[0],
                name: nameArr[k]
            }
            num = v.split(":")[1];
            for (var i = 0; i < num; i++) {
                obj.push(tmp)
            }
        })
        //console.log(obj)
        return obj;
    }
    
	function defineconflict() {
		var style =
			'<style type="text/css">div.amsdialog_modal{border-radius:3px 3px 0px 0px;overflow:hidden}div.amsdialog_header{line-height:30px;color:#fff;background-color:#2196F3;padding:0px 5px;font-size:16px}a.amsdialog_close{float:right;color:#fff;text-decoration:none;cursor:pointer;font-size:24px}a.amsdialog_close:hover{color:red}.amsdialog_cmain{padding:5px;min-height:50px;font-size:14px;color:#000}div.amsdialog_footer{line-height:40px;text-align:right}div.amsdialog_footer a.amsdialog_btn{line-height:30px;display:inline-block;min-width:100px;text-align:center;text-decoration:none;color:#fff;border-radius:3px;margin:0px 5px}div.amsdialog_footer a.amsdialog_btn.amsdialog_bconfirm{background-color:#2096f3}div.amsdialog_footer a.amsdialog_btn.amsdialog_bconfirm:hover{background-color:#027bdc}div.amsdialog_footer a.amsdialog_btn.amsdialog_bcancel{background-color:#a7a6a4}div.amsdialog_footer a.amsdialog_btn.amsdialog_bcancel:hover{background-color:#908f8d}</style>';
		$(style).appendTo(document.getElementsByTagName("head")[0]);
		var amsopen = {};
		var amsopenTemplate =
			'<div class="amsdialog_modal" style="left:50%;top:50%;min-width:400px;max-width:100%;background-color:white"><div class="amsdialog_header" style="width:auto;"><a class="amsdialog_close" href="javascript:void(0)">\xd7</a><span>amsopen-Title</span></div><div class="amsdialog_content"><div class="amsdialog_cmain" style="max-height:800px;overflow-y:auto;overflow-x:hidden;width:auto;">\u63d0\u793a\u8bed\u3002\u3002\u3002</div><div class="amsdialog_footer"><a href="javascript:void(0)" class="amsdialog_btn amsdialog_bconfirm">amsopen-OK</a><a href="javascript:void(0)" class="amsdialog_btn amsdialog_bcancel" style="">amsopen-Cancel</a></div></div></div>';
		var amsopenCover = '<div id="amsdialog_cover" style="z-index:500;display:none"></div>';
		var DialogPool = {};
		var defaultOption = {
			title: "\u7cfb\u7edf\u6d88\u606f",
			confirmTitle: "\u786e\u8ba4",
			cancelTitle: "\u53d6\u6d88",
			msg: "hello,world",
			isHtml: false,
			coverColor: "#777",
			width: "auto",
			height: "auto",
			onSuccess: function(selector) {},
			onConfirm: function() {},
			onClose: function() {}
		};
		var currentZIndex = 1e5;
		var isDOM = typeof HTMLElement === "object" ? function(obj) {
			return obj instanceof HTMLElement
		} : function(obj) {
			return obj && typeof obj === "object" && obj.nodeType === 1 && typeof obj.nodeName === "string"
		};
		var amsopenShow = function($_amsframe, _opt) {
			if (!$_amsframe.css) {
				$_amsframe = $($_amsframe)
			}
			var global_body = document.compatMode == "BackCompat" ? document.body : document.documentElement;
			var gWidth = global_body.clientWidth;
			var gHeight = global_body.clientHeight;
			$_amsframe.css("display", "block");
			var cntWidth = _opt && _opt.width ? _opt.width : "auto";
			if (!_opt.isHtml && cntWidth == "auto") {
				cntWidth = "400px"
			}
			var maxHeight = gHeight - 150 < 50 ? 50 : gHeight - 150;
			if (_opt.height != "auto") {
				$_amsframe.find(".amsdialog_content>div:first").css({
					height: /^[0-9]+$/.test(_opt.height) ? _opt.height + "px" : _opt.height,
					"overflow-y": "auto"
				})
			} else {
				$_amsframe.find(".amsdialog_content>div:first").css({
					"max-height": maxHeight + "px",
					"overflow-y": "auto"
				})
			}
			$_amsframe.find(".amsdialog_content>div:first").css("width", cntWidth);
			var fWidth = $_amsframe.get(0).clientWidth;
			var fHeight = $_amsframe.get(0).clientHeight;
			var cntWidth = _opt && _opt.width ? _opt.width : "auto";
			if (!_opt.isHtml && cntWidth == "auto") {
				cntWidth = "400px"
			}
			var maxHeight = gHeight - 150 < 50 ? 50 : gHeight - 150 - (gHeight - fHeight) / 2;
			if (_opt.height != "auto") {
				$_amsframe.find(".amsdialog_content>div:first").css({
					height: /^[0-9]+$/.test(_opt.height) ? _opt.height + "px" : _opt.height,
					"overflow-y": "auto"
				})
			} else {
				$_amsframe.find(".amsdialog_content>div:first").css({
					"max-height": maxHeight + "px",
					"overflow-y": "auto"
				})
			}
			$_amsframe.find(".amsdialog_content>div:first").css("width", cntWidth);
			_opt.cover.width(gWidth);
			_opt.cover.height(gHeight);
			_opt.cover.css("display", "block");
			$_amsframe.css("position", "fixed");
			$_amsframe.css("left", (gWidth - fWidth) / 2 + "px");
			$_amsframe.css("top", (gHeight - fHeight) / 2 + "px")
		};
		var amsopenHide = function($_amsframe, _opt) {
			if ($_amsframe.css) {
				$_amsframe.css("display", "none");
				if (!_opt["notRemove"]) {
					$_amsframe.remove()
				}
			} else if ($_amsframe.addEventListener) {
				$($_amsframe).css("display", "none");
				if (!_opt["notRemove"]) {
					$($_amsframe).remove()
				}
			}
			_opt.cover.css("display", "none");
			if (!_opt["notRemove"]) {
				_opt.cover.remove()
			}
			if (_opt.dialogId && DialogPool[_opt.dialogId]) {
				delete DialogPool[_opt.dialogId]
			}
		};
		var amsopenInit = function($_obj, _opt) {
			var dialogId = (new Date).getTime() + "-" + Math.ceil(Math.random() * 1e5);
			_opt.dialogId = dialogId;
			var opt = $.extend(true, {}, defaultOption);
			opt = $.extend(true, opt, _opt);
			if (!$_obj.css) {
				$_obj = $($_obj)
			}
			var divTitle, divClose, divContent, divConfirm, divCancel;
			divTitle = $_obj.find(".amsdialog_header>span");
			divClose = $_obj.find(".amsdialog_header>a");
			divContent = $_obj.find(".amsdialog_content>div:first");
			divCancel = $_obj.find(".amsdialog_footer>a:eq(1)");
			divConfirm = $_obj.find(".amsdialog_footer>a:eq(0)");
			divTitle.text(opt.title);
			if (typeof opt.msg == "string" || typeof opt.msg == "number") {
				if (opt.isHtml) {
					divContent.html(opt.msg)
				} else {
					divContent.text(opt.msg)
				}
			} else {
				opt.msg = $(opt.msg);
				divContent.html("");
				divContent.append(opt.msg)
			}
			divConfirm.html(opt.confirmTitle);
			divCancel.html(opt.cancelTitle);
			$("#amsdialog_cover").css("background-color", opt.coverColor);
			divClose.unbind("click");
			divConfirm.unbind("click");
			divCancel.unbind("click");
			divContent.unbind("load");
			if (opt.onConfirm && typeof opt.onConfirm == "function") {
				divConfirm.css("display", "inline-block");
				divConfirm.click(function() {
					if (opt.onConfirm(divContent, divConfirm, divCancel) !== false) {
						amsopenHide($_obj, opt)
					}
				})
			} else {
				divConfirm.css("display", "none")
			}
			if (opt.onCancel && typeof opt.onCancel == "function") {
				divCancel.css("display", "inline-block");
				divCancel.click(function() {
					if (opt.onCancel(divContent, divConfirm, divCancel) !== false) {
						amsopenHide($_obj, opt)
					}
				})
			} else {
				divCancel.css("display", "none")
			}
			if (opt.onClose && typeof opt.onClose == "function") {
				divClose.click(function() {
					if (opt.onClose(divContent, divConfirm, divCancel) !== false) {
						amsopenHide($_obj, opt)
					}
				})
			} else {
				divClose.click(function() {
					amsopenHide($_obj, opt)
				})
			}
			if (opt.onSuccess && typeof opt.onSuccess == "function") {
				opt.onSuccess(divContent, divConfirm, divCancel);
				window.setTimeout(function() {
					amsopenShow($_obj, opt);
					defaultOption.onSuccess(divContent, divConfirm, divCancel)
				}, 200)
			} else {
				window.setTimeout(function() {
					amsopenShow($_obj, opt);
					defaultOption.onSuccess(divContent, divConfirm, divCancel)
				}, 200)
			}
			DialogPool[dialogId] = {
				frame: $_obj,
				opt: opt
			};
			return dialogId
		};
	
		function amsopenObject() {
			this.setFrame = function() {
				var _frame = $(amsopenTemplate).attr("id", "amsopenFrame_" + (new Date).getTime());
				var _cover = $(amsopenCover).attr("id", "amsopenCover_" + (new Date).getTime());
				$(document.getElementsByTagName("body")[0]).append(_frame);
				_frame.css({
					"font-size": "14px",
					"font-family": "Microsoft YaHei, Arial, sans-serif"
				});
				$(document.getElementsByTagName("body")[0]).append(_cover);
				_cover.ready(function() {
					_cover.css({
						position: "fixed",
						"background-color": "#777",
						opacity: .5,
						filter: "alpha(opacity=50)",
						left: "0px",
						top: "0px",
						border: "none"
					})
				});
				_cover.css("z-index", currentZIndex += 2);
				_frame.css("z-index", currentZIndex += 2);
				amsopenShow(_frame, {
					frame: _frame,
					cover: _cover
				});
				amsopenHide(_frame, {
					frame: _frame,
					cover: _cover,
					notRemove: true
				});
				return {
					frame: _frame,
					cover: _cover
				}
			};
			this.alert = function() {
				var self = this;
				var _opt = {};
				var args = ["", "onConfirm", "onClose", "onSuccess"];
				if (!arguments.length) {
					throw "alert \u5fc5\u987b\u81f3\u5c11\u5e26\u4e00\u4e2a\u53c2\u6570";
					return
				}
				if (typeof arguments[0] !== "number" && typeof arguments[0] !== "string" && (typeof arguments[
						0] == "object" && !arguments[0].css) && !isDOM(arguments[0])) {
					throw "alert \u7b2c\u4e00\u4e2a\u53c2\u6570\u5fc5\u987b\u4e3astring,number,jquery object,DOM\u4e4b\u4e00";
					return
				}
				_opt.msg = undefined === arguments[0] ? "undefined" : arguments[0];
				if (arguments.length >= 2) {
					if (typeof arguments[1] == "function") {
						for (var i = 1; i < arguments.length; i++) {
							_opt[args[i]] = arguments[i]
						}
					} else {
						_opt = $.extend(_opt, arguments[1])
					}
				}
				$.extend(true, _opt, self.setFrame());
				return amsopenInit(_opt.frame, _opt)
			};
			this.confirm = function() {
				var self = this;
				var _opt = {};
				var args = ["", "onConfirm", "onCancel", "onClose", "onSuccess"];
				if (!arguments.length) {
					throw "confirm \u5fc5\u987b\u81f3\u5c11\u5e26\u4e00\u4e2a\u53c2\u6570";
					return
				}
				if (typeof arguments[0] !== "number" && typeof arguments[0] !== "string" && (typeof arguments[
						0] == "object" && !arguments[0].css) && !arguments[0].css && !isDOM(arguments[0])) {
					throw "confirm \u7b2c\u4e00\u4e2a\u53c2\u6570\u5fc5\u987b\u4e3astring,number,jquery object,DOM\u4e4b\u4e00";
					return
				}
				_opt.msg = undefined === arguments[0] ? "undefined" : arguments[0];
				if (arguments.length >= 2) {
					if (typeof arguments[1] == "function") {
						for (var i = 1; i < arguments.length; i++) {
							_opt[args[i]] = arguments[i]
						}
					} else {
						_opt = $.extend(_opt, arguments[1])
					}
				}
				if (!_opt.onCancel && null !== _opt.onCancel) {
					_opt.onCancel = function() {}
				}
				$.extend(true, _opt, self.setFrame());
				return amsopenInit(_opt.frame, _opt)
			}
		}
		amsopen = {
			alert: function() {
				var newObj = new amsopenObject;
				return newObj.alert.apply(newObj, arguments)
			},
			confirm: function() {
				var newObj = new amsopenObject;
				return newObj.confirm.apply(newObj, arguments)
			},
			close: function(dialogId) {
				if (DialogPool[dialogId]) {
					var _frame = DialogPool[dialogId].frame;
					var _opt = DialogPool[dialogId].opt;
					amsopenHide(_frame, _opt)
				}
			}
		};
		return amsopen
	};
	
	
	function defineconflict2() {
	    var M = milo, oIfrBg, fixIECenter, oOverLay, popType = "", fMsgClose = null, fixOverlay = null, dialogElement = null, lastFocus = null, focusHandle = null, escCloseHandle = null, bOverlay = false, isLongPopBox = false, dialogOpen = false, oBw = M.browser, isIE = oBw.msie, bVsn = oBw.version, isIE6 = isIE && bVsn == "6.0", isIE9 = isIE && bVsn == "9.0", isSafari = oBw.safari, oWin = window, oDoc = document, oBody = oDoc.body, oDel = oDoc.documentElement, IFRAME_ID = "_PopupIframe_", MESSAGE_ID = "_PopupMsg_", OVERLAY_ID = "_overlay_";
	    var dialogs = {
	        show: function(p) {
	            var _p = typeof p === "object" ? p : {}
	              , _sAuto = "auto";
	            this.id = _p.id || null;
	            this.bgcolor = _p.bgcolor || "#111";
	            this.opacity = _p.opacity || 70;
	            this.src = _p.src || null;
	            this.fixed = _p.fixed || false;
	            this.iTop = _p.iTop || _sAuto;
	            this.iWidth = _p.iWidth || _sAuto;
	            this.iHeight = _p.iHeight || _sAuto;
	            this.sMsg = _p.sMsg || null;
	            this.sClass = _p.sClass || null;
	            this.sStyles = _p.sStyle || "padding:10px;border:4px solid #dedede;background-color:#fff";
	            this.sTime = _p.sTime || null;
	            this.delayPop = _p.delayPop || false;
	            this.sPzIndex = _p.PopzIndex || 9999;
	            this.isNoAccessible = _p.isNoAccessible || false;
	            if (this.sPzIndex < 9) {
	                this.sPzIndex = 9
	            }
	            this.onPopupCallback = _p.onPopupCallback || null;
	            this.onCloseCallback = _p.onCloseCallback || null;
	            this.hasFrame = _p.bFrame || false;
	            if (typeof p == "string" && p != null && p != "") {
	                this.id = p
	            }
	            if (arguments.length == 4) {
	                this.src = arguments[0];
	                this.iWidth = arguments[1];
	                this.iHeight = arguments[2]
	            }
	            if (this.id == null && this.src == null && this.sMsg == null) {
	                return
	            }
	            if (dialogOpen) {
	                this.hide({
	                    isNoCloseOverLay: true
	                })
	            }
	            if (this.src != null) {
	                this.id = IFRAME_ID;
	                popType = "iframe";
	                return this.popupInit()
	            }
	            if (this.sMsg != null) {
	                this.id = MESSAGE_ID;
	                popType = "message";
	                return this.popupInit()
	            }
	            if (this.id != null) {
	                dialogElement = M.g(this.id);
	                dialogElement.setAttribute("data-milodialog", "1");
	                popType = "dialog";
	                return this.popupInit()
	            }
	        },
	        popupInit: function() {
	            var _callBack = this.onPopupCallback, _zIndex = this.sPzIndex, _that = this, _oIfrWrap, _oIframe, _oMsg, _class, _length, _msgCloseTime;
	            if (typeof _callBack === "function") {
	                _callBack()
	            }
	            if (oOverLay === undefined) {
	                oOverLay = M.g(OVERLAY_ID)
	            }
	            if (!bOverlay) {
	                if (oOverLay) {
	                    M.setStyle(oOverLay, {
	                        backgroundColor: this.bgcolor,
	                        zIndex: _zIndex - 1,
	                        display: "block"
	                    })
	                } else {
	                    this.overlay()
	                }
	            }
	            if (popType === "iframe") {
	                if (!M.g(IFRAME_ID)) {
	                    _oIfrWrap = oDoc.createElement("div");
	                    oOverLay.parentNode.insertBefore(_oIfrWrap, oOverLay)
	                } else {
	                    _oIfrWrap = M.g(IFRAME_ID).parentNode
	                }
	                _oIfrWrap.style.display = "none";
	                _oIframe = oDoc.createElement("iframe");
	                _oIframe.setAttribute("allowtransparency", "true");
	                _oIframe.setAttribute("scrolling", "no");
	                _oIframe.setAttribute("frameborder", "0");
	                _oIframe.setAttribute("height", this.iHeight);
	                _oIframe.setAttribute("width", this.iWidth);
	                _oIframe.setAttribute("id", IFRAME_ID);
	                _oIframe.src = this.src;
	                if (_oIframe.attachEvent) {
	                    _oIframe.attachEvent("onload", function() {
	                        _that.ifrAutoHeight(_oIframe)
	                    })
	                } else {
	                    _oIframe.onload = function() {
	                        _that.ifrAutoHeight(_oIframe)
	                    }
	                }
	                if (!this.delayPop) {
	                    _oIfrWrap.style.display = "block"
	                }
	                _oIfrWrap.innerHTML = "";
	                _oIfrWrap.appendChild(_oIframe);
	                dialogElement = _oIfrWrap
	            }
	            if (popType === "message") {
	                if (!M.g(MESSAGE_ID)) {
	                    _oMsg = oDoc.createElement("div");
	                    _oMsg.setAttribute("id", MESSAGE_ID);
	                    oOverLay.parentNode.insertBefore(_oMsg, oOverLay)
	                } else {
	                    _oMsg = M.g(MESSAGE_ID)
	                }
	                _oMsg.style.cssText = this.sStyles;
	                if (this.sClass != null) {
	                    _class = isIE ? "className" : "class";
	                    _oMsg.setAttribute(_class, this.sClass)
	                }
	                _oMsg.style.display = "none";
	                _oMsg.innerHTML = this.sMsg;
	                if (!this.delayPop) {
	                    _oMsg.style.display = "block"
	                }
	                if (this.sTime != null) {
	                    if (!dialogOpen) {
	                        clearTimeout(_msgCloseTime)
	                    }
	                    _msgCloseTime = setTimeout(function() {
	                        _that.hide()
	                    }, this.sTime)
	                } else {
	                    fMsgClose = function(e) {
	                        var targ;
	                        e = e || oWin.event;
	                        targ = e.target || e.srcElement;
	                        if (targ.id === OVERLAY_ID) {
	                            M.stopPropagation(e);
	                            _that.hide()
	                        }
	                    }
	                    ;
	                    M.addEvent(oOverLay, "click", fMsgClose)
	                }
	                dialogElement = _oMsg
	            }
	            if (this.delayPop) {
	                dialogElement.style.display = "none"
	            } else {
	                dialogElement.style.display = "block"
	            }
	            M.setStyle(dialogElement, {
	                visibility: "visible",
	                position: "absolute",
	                zIndex: _zIndex,
	                left: "50%",
	                top: "50%"
	            });
	            dialogElement.setAttribute("role", "dialog");
	            dialogElement.tabIndex = -1;
	            if (!this.isNoAccessible) {
	                focusHandle = function(e) {
	                    var targ;
	                    e = e || oWin.event;
	                    targ = e.target || e.srcElement;
	                    if (dialogOpen && !dialogElement.contains(targ) && !dialogElement.getAttribute("data-milodialog")) {
	                        M.stopPropagation(e);
	                        M.setStyle(dialogElement, {
	                            display: "block",
	                            visibility: "visible"
	                        });
	                        setTimeout(function() {
	                            try {
	                                if (dialogElement && dialogElement.offsetHeight > 0) {
	                                    dialogElement.focus()
	                                }
	                            } catch (e) {}
	                        }, 250)
	                    }
	                }
	                ;
	                lastFocus = oDoc.activeElement;
	                oDoc.onfocus = focusHandle;
	                if (oDoc.addEventListener) {
	                    oDoc.addEventListener("focus", focusHandle, true)
	                } else {
	                    oDoc.onfocusin = focusHandle
	                }
	                escCloseHandle = function(e) {
	                    var code;
	                    e = e || oWin.event;
	                    code = e.keyCode || e.which;
	                    if (dialogOpen && code == 27 && !this.isNoAccessible) {
	                        _that.hide()
	                    }
	                }
	                ;
	                M.addEvent(oDoc, "keyup", escCloseHandle, true)
	            }
	            if (!this.delayPop) {
	                this.adjust()
	            }
	        },
	        popup: function() {
	            var _obj = dialogElement, _oIfrWrap;
	            if (this.delayPop) {
	                if (popType === "iframe") {
	                    _oIfrWrap = M.g(IFRAME_ID).parentNode;
	                    _oIfrWrap.style.display = "block"
	                }
	                _obj.style.display = "block"
	            }
	            this.adjust()
	        },
	        adjust: function() {
	            var _h = M.getWinHeight(), _imh = M.getMaxH(), _rt = null, _st = null, _that = this, _obj = dialogElement, _iw, _ih, _iTop, _iPh;
	            if (oOverLay === undefined) {
	                oOverLay = M.g(OVERLAY_ID)
	            }
	            if (_obj) {
	                _iw = _obj.offsetWidth;
	                _ih = _obj.offsetHeight;
	                if (this.fixed) {
	                    if (M.isInt(this.iTop)) {
	                        M.setStyle(_obj, {
	                            top: this.iTop + "px",
	                            marginTop: 0
	                        })
	                    } else {
	                        _obj.style.marginTop = "-" + _ih / 2 + "px"
	                    }
	                    M.setStyle(_obj, {
	                        position: "absolute",
	                        marginLeft: "-" + _iw / 2 + "px"
	                    })
	                } else {
	                    if (_ih >= _h) {
	                        isLongPopBox = true;
	                        if (M.isInt(this.iTop)) {
	                            _iTop = this.iTop
	                        } else {
	                            _iTop = oBody.scrollTop || oDel.scrollTop || 0;
	                            _iTop = _iTop + 50
	                        }
	                        M.setStyle(_obj, {
	                            position: "absolute",
	                            top: _iTop + "px",
	                            marginLeft: "-" + _iw / 2 + "px",
	                            marginTop: 0
	                        });
	                        _iPh = _ih + _iTop;
	                        oOverLay.style.height = Math.max(_iPh, _imh) + "px"
	                    } else {
	                        isLongPopBox = false;
	                        isIE6 || oDoc.documentMode < 7 ? _obj.style.position = "absolute" : _obj.style.position = "fixed";
	                        M.setStyle(_obj, {
	                            marginTop: "-" + _ih / 2 + "px",
	                            marginLeft: "-" + _iw / 2 + "px"
	                        })
	                    }
	                }
	                fixOverlay = function() {
	                    if (_rt) {
	                        clearTimeout(_rt)
	                    }
	                    _rt = setTimeout(function() {
	                        _that.fix_Overlay()
	                    }, 250)
	                }
	                ;
	                M.addEvent(oWin, "resize", fixOverlay);
	                if (isIE || isSafari) {
	                    this.fix_Overlay();
	                    if (isIE6) {
	                        this.fixIE6_Center();
	                        fixIECenter = function() {
	                            if (_st) {
	                                clearTimeout(_st)
	                            }
	                            _st = setTimeout(function() {
	                                _that.fixIE6_Center()
	                            }, 250)
	                        }
	                        ;
	                        M.addEvent(oWin, "scroll", fixIECenter)
	                    }
	                }
	            }
	            dialogOpen = true
	        },
	        fix_Overlay: function() {
	            var _w = M.getMaxW(), _h = M.getMaxH(), _wh = M.getWinHeight(), _obj = dialogElement, _ih, _iTop;
	            if (oOverLay === undefined) {
	                oOverLay = M.g(OVERLAY_ID)
	            }
	            if (isIE9 && (!oDoc.documentMode || oDoc.documentMode > 8)) {
	                _w = _w - 17 < 0 ? 0 : _w - 3
	            }
	            _h = _h - 3 < 0 ? 0 : _h - 3;
	            try {
	                _ih = _obj.offsetHeight
	            } catch (e) {
	                _ih = this.iHeight;
	                _obj = M.g(IFRAME_ID)
	            }
	            if (_ih >= _wh) {
	                isLongPopBox = true;
	                if (M.isInt(this.iTop)) {
	                    _iTop = this.iTop
	                } else {
	                    _iTop = oBody.scrollTop || oDel.scrollTop;
	                    _iTop = _iTop + 50
	                }
	                M.setStyle(_obj, {
	                    position: "absolute",
	                    top: _iTop + "px",
	                    marginTop: "0"
	                })
	            } else {
	                isLongPopBox = false
	            }
	            if (isIE) {
	                oOverLay.style.width = _w + "px"
	            }
	            oOverLay.style.height = _h + "px"
	        },
	        fixIE6_Center: function() {
	            var _iScrollTop, _obj = dialogElement;
	            if (!isLongPopBox) {
	                if (!this.fixed) {
	                    _iScrollTop = oBody.scrollTop || oDel.scrollTop;
	                    dialogElement.style.marginTop = parseInt(_iScrollTop - _obj.offsetHeight / 2, 10) + "px"
	                }
	            }
	        },
	        ifrAutoHeight: function(ele) {
	            var _bh, _dh, _win, _h;
	            if (this.iHeight != "auto") {
	                return
	            }
	            _win = dialogElement;
	            try {
	                _bh = _win.contentWindow.document.body.scrollHeight;
	                _dh = _win.contentWindow.document.documentElement.scrollHeight;
	                _h = Math.max(_bh, _dh);
	                this.iHeight = win.height = _h
	            } catch (e) {}
	            M.setStyle(_win, {
	                marginTop: "-" + _win.offsetHeight / 2 + "px",
	                marginLeft: "-" + _win.offsetWidth / 2 + "px"
	            });
	            this.fix_Overlay()
	        },
	        hide: function(p) {
	            var _p = typeof p === "object" ? p : {}
	              , _callBack = this.onCloseCallback
	              , _cancleCallback = _p.cancleCallback || false
	              , _isNoCloseOverLay = _p.isNoCloseOverLay || false;
	            if (oOverLay === undefined) {
	                oOverLay = M.g(OVERLAY_ID)
	            }
	            if (fixOverlay !== null) {
	                M.removeEvent(oWin, "resize", fixOverlay)
	            }
	            if (isIE6 && fixIECenter != null) {
	                M.removeEvent(oWin, "scroll", fixIECenter)
	            }
	            if (fMsgClose !== null) {
	                M.removeEvent(oOverLay, "click", fMsgClose)
	            }
	            if (escCloseHandle !== null) {
	                M.removeEvent(oDoc, "keyup", escCloseHandle)
	            }
	            if (typeof _callBack === "function" && !_cancleCallback) {
	                _callBack()
	            }
	            dialogOpen = false;
	            if (!this.isNoAccessible) {
	                if (focusHandle !== null) {
	                    if (oDoc.removeEventListener) {
	                        oDoc.removeEventListener("focus", focusHandle, false)
	                    } else {
	                        oDoc.onfocus = null
	                    }
	                    if (oDoc.onfocus = focusHandle) {
	                        oDoc.onfocus = null
	                    }
	                }
	                if (lastFocus && lastFocus.offsetHeight > 0) {
	                    lastFocus.focus()
	                }
	            }
	            if (dialogElement === null) {
	                switch (popType) {
	                case "message":
	                    dialogElement = M.g(MESSAGE_ID);
	                case "iframe":
	                    dialogElement = M.g(IFRAME_ID);
	                case "dialog":
	                    dialogElement = M.g(this.id);
	                default:
	                    return
	                }
	            }
				
	            dialogElement.style.display = "none";
	            if (!_isNoCloseOverLay) {
	                oOverLay.style.display = "none"
	            }
	            bOverlay = false;
	            return
	        },
	        overlay: function() {
	            var _h = M.getMaxH(), _zIndex = this.sPzIndex - 1, _op = this.opacity, _it, _ib, _w;
	            if (isIE) {
	                _it = parseInt(M.getStyle(oBody, "marginTop"), 10);
	                _ib = parseInt(M.getStyle(oBody, "marginBottom"), 10);
	                _h = _h + _it + _ib
	            }
	            oOverLay = oDoc.createElement("div");
	            oOverLay.setAttribute("id", OVERLAY_ID);
	            M.setStyle(oOverLay, {
	                backgroundColor: this.bgcolor,
	                borderTop: "1px solid " + this.bgcolor,
	                position: "absolute",
	                height: _h + "px",
	                zIndex: _zIndex,
	                width: "100%",
	                left: "0",
	                top: "0"
	            });
	            if (isIE6 || this.hasFrame) {
	                _w = M.getMaxW();
	                oOverLay.style.width = _w + "px";
	                oOverLay.innerHTML = '<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;filter:alpha(opacity=0);z-index:9" src="javascript:void(0)"></iframe>'
	            }
	            if (isIE && (!oDoc.documentMode || oDoc.documentMode < 9)) {
	                oOverLay.style.filter = "Alpha(opacity=" + _op + ")"
	            } else {
	                oOverLay.style.opacity = _op / 100
	            }
	            bOverlay = true;
	            return oBody.appendChild(oOverLay)
	        }
	    };
	    showDialog = dialogs;
	    return dialogs
	};