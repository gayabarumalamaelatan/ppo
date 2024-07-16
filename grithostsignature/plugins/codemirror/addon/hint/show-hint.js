!function(t){"object"==typeof exports&&"object"==typeof module?t(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],t):t(CodeMirror)}((function(t){"use strict";var e="CodeMirror-hint-active";function i(t,e){if(this.cm=t,this.options=e,this.widget=null,this.debounce=0,this.tick=0,this.startPos=this.cm.getCursor("start"),this.startLen=this.cm.getLine(this.startPos.line).length-this.cm.getSelection().length,this.options.updateOnCursorActivity){var i=this;t.on("cursorActivity",this.activityFunc=function(){i.cursorActivity()})}}t.showHint=function(t,e,i){if(!e)return t.showHint(i);i&&i.async&&(e.async=!0);var n={hint:e};if(i)for(var o in i)n[o]=i[o];return t.showHint(n)},t.defineExtension("showHint",(function(e){e=function(t,e,i){var n=t.options.hintOptions,o={};for(var s in h)o[s]=h[s];if(n)for(var s in n)void 0!==n[s]&&(o[s]=n[s]);if(i)for(var s in i)void 0!==i[s]&&(o[s]=i[s]);return o.hint.resolve&&(o.hint=o.hint.resolve(t,e)),o}(this,this.getCursor("start"),e);var n=this.listSelections();if(!(n.length>1)){if(this.somethingSelected()){if(!e.hint.supportsSelection)return;for(var o=0;o<n.length;o++)if(n[o].head.line!=n[o].anchor.line)return}this.state.completionActive&&this.state.completionActive.close();var s=this.state.completionActive=new i(this,e);s.options.hint&&(t.signal(this,"startCompletion",this),s.update(!0))}})),t.defineExtension("closeHint",(function(){this.state.completionActive&&this.state.completionActive.close()}));var n=window.requestAnimationFrame||function(t){return setTimeout(t,1e3/60)},o=window.cancelAnimationFrame||clearTimeout;function s(t){return"string"==typeof t?t:t.text}function c(t,e){for(;e&&e!=t;){if("LI"===e.nodeName.toUpperCase()&&e.parentNode==t)return e;e=e.parentNode}}function r(i,n){this.id="cm-complete-"+Math.floor(Math.random(1e6)),this.completion=i,this.data=n,this.picked=!1;var o=this,r=i.cm,l=r.getInputField().ownerDocument,h=l.defaultView||l.parentWindow,a=this.hints=l.createElement("ul");a.setAttribute("role","listbox"),a.setAttribute("aria-expanded","true"),a.id=this.id;var u=i.cm.options.theme;a.className="CodeMirror-hints "+u,this.selectedHint=n.selectedHint||0;for(var d=n.list,f=0;f<d.length;++f){var p=a.appendChild(l.createElement("li")),m=d[f],g="CodeMirror-hint"+(f!=this.selectedHint?"":" "+e);null!=m.className&&(g=m.className+" "+g),p.className=g,f==this.selectedHint&&p.setAttribute("aria-selected","true"),p.id=this.id+"-"+f,p.setAttribute("role","option"),m.render?m.render(p,n,m):p.appendChild(l.createTextNode(m.displayText||s(m))),p.hintId=f}var v=i.options.container||l.body,y=r.cursorCoords(i.options.alignWithWord?n.from:null),b=y.left,w=y.bottom,A=!0,H=0,C=0;if(v!==l.body){var k=-1!==["absolute","relative","fixed"].indexOf(h.getComputedStyle(v).position)?v:v.offsetParent,x=k.getBoundingClientRect(),S=l.body.getBoundingClientRect();H=x.left-S.left-k.scrollLeft,C=x.top-S.top-k.scrollTop}a.style.left=b-H+"px",a.style.top=w-C+"px";var T=h.innerWidth||Math.max(l.body.offsetWidth,l.documentElement.offsetWidth),F=h.innerHeight||Math.max(l.body.offsetHeight,l.documentElement.offsetHeight);v.appendChild(a),r.getInputField().setAttribute("aria-autocomplete","list"),r.getInputField().setAttribute("aria-owns",this.id),r.getInputField().setAttribute("aria-activedescendant",this.id+"-"+this.selectedHint);var M,O=i.options.moveOnOverlap?a.getBoundingClientRect():new DOMRect,N=!!i.options.paddingForScrollbar&&a.scrollHeight>a.clientHeight+1;if(setTimeout((function(){M=r.getScrollInfo()})),O.bottom-F>0){var I=O.bottom-O.top;if(y.top-(y.bottom-O.top)-I>0)a.style.top=(w=y.top-I-C)+"px",A=!1;else if(I>F){a.style.height=F-5+"px",a.style.top=(w=y.bottom-O.top-C)+"px";var P=r.getCursor();n.from.ch!=P.ch&&(y=r.cursorCoords(P),a.style.left=(b=y.left-H)+"px",O=a.getBoundingClientRect())}}var E,W=O.right-T;if(N&&(W+=r.display.nativeBarWidth),W>0&&(O.right-O.left>T&&(a.style.width=T-5+"px",W-=O.right-O.left-T),a.style.left=(b=y.left-W-H)+"px"),N)for(var R=a.firstChild;R;R=R.nextSibling)R.style.paddingRight=r.display.nativeBarWidth+"px";r.addKeyMap(this.keyMap=function(t,e){var i={Up:function(){e.moveFocus(-1)},Down:function(){e.moveFocus(1)},PageUp:function(){e.moveFocus(1-e.menuSize(),!0)},PageDown:function(){e.moveFocus(e.menuSize()-1,!0)},Home:function(){e.setFocus(0)},End:function(){e.setFocus(e.length-1)},Enter:e.pick,Tab:e.pick,Esc:e.close};/Mac/.test(navigator.platform)&&(i["Ctrl-P"]=function(){e.moveFocus(-1)},i["Ctrl-N"]=function(){e.moveFocus(1)});var n=t.options.customKeys,o=n?{}:i;function s(t,n){var s;s="string"!=typeof n?function(t){return n(t,e)}:i.hasOwnProperty(n)?i[n]:n,o[t]=s}if(n)for(var c in n)n.hasOwnProperty(c)&&s(c,n[c]);var r=t.options.extraKeys;if(r)for(var c in r)r.hasOwnProperty(c)&&s(c,r[c]);return o}(i,{moveFocus:function(t,e){o.changeActive(o.selectedHint+t,e)},setFocus:function(t){o.changeActive(t)},menuSize:function(){return o.screenAmount()},length:d.length,close:function(){i.close()},pick:function(){o.pick()},data:n})),i.options.closeOnUnfocus&&(r.on("blur",this.onBlur=function(){E=setTimeout((function(){i.close()}),100)}),r.on("focus",this.onFocus=function(){clearTimeout(E)})),r.on("scroll",this.onScroll=function(){var t=r.getScrollInfo(),e=r.getWrapperElement().getBoundingClientRect();M||(M=r.getScrollInfo());var n=w+M.top-t.top,o=n-(h.pageYOffset||(l.documentElement||l.body).scrollTop);if(A||(o+=a.offsetHeight),o<=e.top||o>=e.bottom)return i.close();a.style.top=n+"px",a.style.left=b+M.left-t.left+"px"}),t.on(a,"dblclick",(function(t){var e=c(a,t.target||t.srcElement);e&&null!=e.hintId&&(o.changeActive(e.hintId),o.pick())})),t.on(a,"click",(function(t){var e=c(a,t.target||t.srcElement);e&&null!=e.hintId&&(o.changeActive(e.hintId),i.options.completeOnSingleClick&&o.pick())})),t.on(a,"mousedown",(function(){setTimeout((function(){r.focus()}),20)}));var B=this.getSelectedHintRange();return 0===B.from&&0===B.to||this.scrollToActive(),t.signal(n,"select",d[this.selectedHint],a.childNodes[this.selectedHint]),!0}function l(t,e,i,n){if(t.async)t(e,n,i);else{var o=t(e,i);o&&o.then?o.then(n):n(o)}}i.prototype={close:function(){this.active()&&(this.cm.state.completionActive=null,this.tick=null,this.options.updateOnCursorActivity&&this.cm.off("cursorActivity",this.activityFunc),this.widget&&this.data&&t.signal(this.data,"close"),this.widget&&this.widget.close(),t.signal(this.cm,"endCompletion",this.cm))},active:function(){return this.cm.state.completionActive==this},pick:function(e,i){var n=e.list[i],o=this;this.cm.operation((function(){n.hint?n.hint(o.cm,e,n):o.cm.replaceRange(s(n),n.from||e.from,n.to||e.to,"complete"),t.signal(e,"pick",n),o.cm.scrollIntoView()})),this.options.closeOnPick&&this.close()},cursorActivity:function(){this.debounce&&(o(this.debounce),this.debounce=0);var t=this.startPos;this.data&&(t=this.data.from);var e=this.cm.getCursor(),i=this.cm.getLine(e.line);if(e.line!=this.startPos.line||i.length-e.ch!=this.startLen-this.startPos.ch||e.ch<t.ch||this.cm.somethingSelected()||!e.ch||this.options.closeCharacters.test(i.charAt(e.ch-1)))this.close();else{var s=this;this.debounce=n((function(){s.update()})),this.widget&&this.widget.disable()}},update:function(t){if(null!=this.tick){var e=this,i=++this.tick;l(this.options.hint,this.cm,this.options,(function(n){e.tick==i&&e.finishUpdate(n,t)}))}},finishUpdate:function(e,i){this.data&&t.signal(this.data,"update");var n=this.widget&&this.widget.picked||i&&this.options.completeSingle;this.widget&&this.widget.close(),this.data=e,e&&e.list.length&&(n&&1==e.list.length?this.pick(e,0):(this.widget=new r(this,e),t.signal(e,"shown")))}},r.prototype={close:function(){if(this.completion.widget==this){this.completion.widget=null,this.hints.parentNode&&this.hints.parentNode.removeChild(this.hints),this.completion.cm.removeKeyMap(this.keyMap);var t=this.completion.cm.getInputField();t.removeAttribute("aria-activedescendant"),t.removeAttribute("aria-owns");var e=this.completion.cm;this.completion.options.closeOnUnfocus&&(e.off("blur",this.onBlur),e.off("focus",this.onFocus)),e.off("scroll",this.onScroll)}},disable:function(){this.completion.cm.removeKeyMap(this.keyMap);var t=this;this.keyMap={Enter:function(){t.picked=!0}},this.completion.cm.addKeyMap(this.keyMap)},pick:function(){this.completion.pick(this.data,this.selectedHint)},changeActive:function(i,n){if(i>=this.data.list.length?i=n?this.data.list.length-1:0:i<0&&(i=n?0:this.data.list.length-1),this.selectedHint!=i){var o=this.hints.childNodes[this.selectedHint];o&&(o.className=o.className.replace(" "+e,""),o.removeAttribute("aria-selected")),(o=this.hints.childNodes[this.selectedHint=i]).className+=" "+e,o.setAttribute("aria-selected","true"),this.completion.cm.getInputField().setAttribute("aria-activedescendant",o.id),this.scrollToActive(),t.signal(this.data,"select",this.data.list[this.selectedHint],o)}},scrollToActive:function(){var t=this.getSelectedHintRange(),e=this.hints.childNodes[t.from],i=this.hints.childNodes[t.to],n=this.hints.firstChild;e.offsetTop<this.hints.scrollTop?this.hints.scrollTop=e.offsetTop-n.offsetTop:i.offsetTop+i.offsetHeight>this.hints.scrollTop+this.hints.clientHeight&&(this.hints.scrollTop=i.offsetTop+i.offsetHeight-this.hints.clientHeight+n.offsetTop)},screenAmount:function(){return Math.floor(this.hints.clientHeight/this.hints.firstChild.offsetHeight)||1},getSelectedHintRange:function(){var t=this.completion.options.scrollMargin||0;return{from:Math.max(0,this.selectedHint-t),to:Math.min(this.data.list.length-1,this.selectedHint+t)}}},t.registerHelper("hint","auto",{resolve:function(e,i){var n,o=e.getHelpers(i,"hint");if(o.length){var s=function(t,e,i){var n=function(t,e){if(!t.somethingSelected())return e;for(var i=[],n=0;n<e.length;n++)e[n].supportsSelection&&i.push(e[n]);return i}(t,o);!function o(s){if(s==n.length)return e(null);l(n[s],t,i,(function(t){t&&t.list.length>0?e(t):o(s+1)}))}(0)};return s.async=!0,s.supportsSelection=!0,s}return(n=e.getHelper(e.getCursor(),"hintWords"))?function(e){return t.hint.fromList(e,{words:n})}:t.hint.anyword?function(e,i){return t.hint.anyword(e,i)}:function(){}}}),t.registerHelper("hint","fromList",(function(e,i){var n,o=e.getCursor(),s=e.getTokenAt(o),c=t.Pos(o.line,s.start),r=o;s.start<o.ch&&/\w/.test(s.string.charAt(o.ch-s.start-1))?n=s.string.substr(0,o.ch-s.start):(n="",c=o);for(var l=[],h=0;h<i.words.length;h++){var a=i.words[h];a.slice(0,n.length)==n&&l.push(a)}if(l.length)return{list:l,from:c,to:r}})),t.commands.autocomplete=t.showHint;var h={hint:t.hint.auto,completeSingle:!0,alignWithWord:!0,closeCharacters:/[\s()\[\]{};:>,]/,closeOnPick:!0,closeOnUnfocus:!0,updateOnCursorActivity:!0,completeOnSingleClick:!0,container:null,customKeys:null,extraKeys:null,paddingForScrollbar:!0,moveOnOverlap:!0};t.defineOption("hintOptions",null)}));