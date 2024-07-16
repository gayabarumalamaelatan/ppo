!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"object"==typeof module&&module.exports?module.exports=e(require("jquery")):e(window.jQuery)}((function(e){e.extend(e.summernote.plugins,{specialchars:function(t){var o=this,n=e.summernote.ui,i=t.layoutInfo.editor,r=t.options,a=r.langInfo,l=12,d=0,u=0,c=0,s=0,f=["&quot;","&amp;","&lt;","&gt;","&iexcl;","&cent;","&pound;","&curren;","&yen;","&brvbar;","&sect;","&uml;","&copy;","&ordf;","&laquo;","&not;","&reg;","&macr;","&deg;","&plusmn;","&sup2;","&sup3;","&acute;","&micro;","&para;","&middot;","&cedil;","&sup1;","&ordm;","&raquo;","&frac14;","&frac12;","&frac34;","&iquest;","&times;","&divide;","&fnof;","&circ;","&tilde;","&ndash;","&mdash;","&lsquo;","&rsquo;","&sbquo;","&ldquo;","&rdquo;","&bdquo;","&dagger;","&Dagger;","&bull;","&hellip;","&permil;","&prime;","&Prime;","&lsaquo;","&rsaquo;","&oline;","&frasl;","&euro;","&image;","&weierp;","&real;","&trade;","&alefsym;","&larr;","&uarr;","&rarr;","&darr;","&harr;","&crarr;","&lArr;","&uArr;","&rArr;","&dArr;","&hArr;","&forall;","&part;","&exist;","&empty;","&nabla;","&isin;","&notin;","&ni;","&prod;","&sum;","&minus;","&lowast;","&radic;","&prop;","&infin;","&ang;","&and;","&or;","&cap;","&cup;","&int;","&there4;","&sim;","&cong;","&asymp;","&ne;","&equiv;","&le;","&ge;","&sub;","&sup;","&nsub;","&sube;","&supe;","&oplus;","&otimes;","&perp;","&sdot;","&lceil;","&rceil;","&lfloor;","&rfloor;","&loz;","&spades;","&clubs;","&hearts;","&diams;"];t.memo("button.specialchars",(function(){return n.button({contents:'<i class="fa fa-font fa-flip-vertical"></i>',tooltip:a.specialChar.specialChar,click:function(){o.show()}}).render()})),this.makeSpecialCharSetTable=function(){var t=e("<table></table>");return e.each(f,(function(o,i){var r=e("<td></td>").addClass("note-specialchar-node"),a=o%l==0?e("<tr></tr>"):t.find("tr").last(),d=n.button({callback:function(e){e.html(i),e.attr("title",i),e.attr("data-value",encodeURIComponent(i)),e.css({width:35,"margin-right":"2px","margin-bottom":"2px"})}}).render();r.append(d),a.append(r),o%l==0&&t.append(a)})),s=t.find("tr").length,c=l,t},this.initialize=function(){var t=r.dialogsInBody?e(document.body):i,o='<div class="form-group row-fluid">'+this.makeSpecialCharSetTable()[0].outerHTML+"</div>";this.$dialog=n.dialog({title:a.specialChar.select,body:o}).render().appendTo(t)},this.show=function(){var o=t.invoke("editor.getSelectedText");t.invoke("editor.saveRange"),this.showSpecialCharDialog(o).then((function(o){t.invoke("editor.restoreRange");var n=e("<span></span>").html(o)[0];n&&t.invoke("editor.insertNode",n)})).fail((function(){t.invoke("editor.restoreRange")}))},this.showSpecialCharDialog=function(t){return e.Deferred((function(i){var r=o.$dialog,a=r.find(".note-specialchar-node"),f=null,p=[38,40,37,39];function m(e){e&&(e.find("button").addClass("active"),f=e)}function h(e){e.find("button").removeClass("active"),f=null}function g(t){t.preventDefault();var o=t.keyCode;if(null!=o){if(p.indexOf(o)>-1){if(null===f)return m(a.eq(0)),d=1,void(u=1);!function(t){var o,n,i,r,p=a.length%c;37===t?d>1?d-=1:1===u&&1===d?(d=p,u=s):(d=c,u-=1):39===t?u===s&&p===d?(d=1,u=1):d<c?d+=1:(d=1,u+=1):38===t?1===u&&p<d?u=s-1:u-=1:40===t&&(u+=1),u===s&&d>p||u>s?u=1:u<1&&(u=s),n=u,i=d,r=null,e.each(a,(function(e,t){if(Math.ceil((e+1)/l)===n&&((e+1)%l==0?l:(e+1)%l)===i)return r=t,!1})),(o=e(r))&&(h(f),m(o))}(o)}else 13===o&&f&&(i.resolve(decodeURIComponent(f.find("button").attr("data-value"))),r.modal("hide"));return!1}}if(h(a),t)for(var v=0;v<a.length;v++){var b=e(a[v]);b.text()===t&&(m(b),u=Math.ceil((v+1)/l),d=(v+1)%l)}n.onDialogShown(o.$dialog,(function(){e(document).on("keydown",g),o.$dialog.find("button").tooltip(),a.on("click",(function(t){t.preventDefault(),i.resolve(decodeURIComponent(e(t.currentTarget).find("button").attr("data-value"))),n.hideDialog(o.$dialog)}))})),n.onDialogHidden(o.$dialog,(function(){a.off("click"),o.$dialog.find("button").tooltip(),e(document).off("keydown",g),"pending"===i.state()&&i.reject()})),n.showDialog(o.$dialog)}))}}})}));