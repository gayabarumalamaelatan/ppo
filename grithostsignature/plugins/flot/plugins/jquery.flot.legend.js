!function(e){function t(e){var t="",o=e.name,l=e.xPos,n=e.yPos,i=e.fillColor,s=e.strokeColor,r=e.strokeWidth;switch(o){case"circle":default:t='<use xlink:href="#circle" class="legendIcon" x="'+l+'" y="'+n+'" fill="'+i+'" stroke="'+s+'" stroke-width="'+r+'" width="1.5em" height="1.5em"/>';break;case"diamond":t='<use xlink:href="#diamond" class="legendIcon" x="'+l+'" y="'+n+'" fill="'+i+'" stroke="'+s+'" stroke-width="'+r+'" width="1.5em" height="1.5em"/>';break;case"cross":t='<use xlink:href="#cross" class="legendIcon" x="'+l+'" y="'+n+'" stroke="'+s+'" stroke-width="'+r+'" width="1.5em" height="1.5em"/>';break;case"rectangle":t='<use xlink:href="#rectangle" class="legendIcon" x="'+l+'" y="'+n+'" fill="'+i+'" stroke="'+s+'" stroke-width="'+r+'" width="1.5em" height="1.5em"/>';break;case"plus":t='<use xlink:href="#plus" class="legendIcon" x="'+l+'" y="'+n+'" stroke="'+s+'" stroke-width="'+r+'" width="1.5em" height="1.5em"/>';break;case"bar":t='<use xlink:href="#bars" class="legendIcon" x="'+l+'" y="'+n+'" fill="'+i+'" width="1.5em" height="1.5em"/>';break;case"area":t='<use xlink:href="#area" class="legendIcon" x="'+l+'" y="'+n+'" fill="'+i+'" width="1.5em" height="1.5em"/>';break;case"line":t='<use xlink:href="#line" class="legendIcon" x="'+l+'" y="'+n+'" stroke="'+s+'" stroke-width="'+r+'" width="1.5em" height="1.5em"/>'}return t}function o(e,t){for(var o in e)if(e.hasOwnProperty(o)&&e[o]!==t[o])return!0;return!1}e.plot.plugins.push({init:function(l){l.hooks.setupGrid.push((function(l){var n=l.getOptions(),i=l.getData(),s=n.legend.labelFormatter,r=n.legend.legendEntries,a=n.legend.plotOffset,h=function(t,o,l){var n=o,i=t.reduce((function(e,t,o){var l=n?n(t.label,t):t.label;if(!t.hasOwnProperty("label")||l){var i={label:l||"Plot "+(o+1),color:t.color,options:{lines:t.lines,points:t.points,bars:t.bars}};e.push(i)}return e}),[]);if(l)if(e.isFunction(l))i.sort(l);else if("reverse"===l)i.reverse();else{var s="descending"!==l;i.sort((function(e,t){return e.label===t.label?0:e.label<t.label!==s?1:-1}))}return i}(i,s,n.legend.sorted),d=l.getPlotOffset();(function(e,t){if(!e||!t)return!0;if(e.length!==t.length)return!0;var l,n,i;for(l=0;l<t.length;l++){if(n=t[l],i=e[l],n.label!==i.label)return!0;if(n.color!==i.color)return!0;if(o(n.options.lines,i.options.lines))return!0;if(o(n.options.points,i.options.points))return!0;if(o(n.options.bars,i.options.bars))return!0}return!1}(r,h)||o(a,d))&&function(o,l,n,i){if(null!=l.legend.container?e(l.legend.container).html(""):n.find(".legend").remove(),l.legend.show){var s,r,a,h,d=l.legend.legendEntries=i,c=l.legend.plotOffset=o.getPlotOffset(),g=[],p=0,f="",m=l.legend.position,u=l.legend.margin,b={name:"",label:"",xPos:"",yPos:""};g[p++]='<svg class="legendLayer" style="width:inherit;height:inherit;">',g[p++]='<rect class="background" width="100%" height="100%"/>',g[p++]='<defs><symbol id="line" fill="none" viewBox="-5 -5 25 25"><polyline points="0,15 5,5 10,10 15,0"/></symbol><symbol id="area" stroke-width="1" viewBox="-5 -5 25 25"><polyline points="0,15 5,5 10,10 15,0, 15,15, 0,15"/></symbol><symbol id="bars" stroke-width="1" viewBox="-5 -5 25 25"><polyline points="1.5,15.5 1.5,12.5, 4.5,12.5 4.5,15.5 6.5,15.5 6.5,3.5, 9.5,3.5 9.5,15.5 11.5,15.5 11.5,7.5 14.5,7.5 14.5,15.5 1.5,15.5"/></symbol><symbol id="circle" viewBox="-5 -5 25 25"><circle cx="0" cy="15" r="2.5"/><circle cx="5" cy="5" r="2.5"/><circle cx="10" cy="10" r="2.5"/><circle cx="15" cy="0" r="2.5"/></symbol><symbol id="rectangle" viewBox="-5 -5 25 25"><rect x="-2.1" y="12.9" width="4.2" height="4.2"/><rect x="2.9" y="2.9" width="4.2" height="4.2"/><rect x="7.9" y="7.9" width="4.2" height="4.2"/><rect x="12.9" y="-2.1" width="4.2" height="4.2"/></symbol><symbol id="diamond" viewBox="-5 -5 25 25"><path d="M-3,15 L0,12 L3,15, L0,18 Z"/><path d="M2,5 L5,2 L8,5, L5,8 Z"/><path d="M7,10 L10,7 L13,10, L10,13 Z"/><path d="M12,0 L15,-3 L18,0, L15,3 Z"/></symbol><symbol id="cross" fill="none" viewBox="-5 -5 25 25"><path d="M-2.1,12.9 L2.1,17.1, M2.1,12.9 L-2.1,17.1 Z"/><path d="M2.9,2.9 L7.1,7.1 M7.1,2.9 L2.9,7.1 Z"/><path d="M7.9,7.9 L12.1,12.1 M12.1,7.9 L7.9,12.1 Z"/><path d="M12.9,-2.1 L17.1,2.1 M17.1,-2.1 L12.9,2.1 Z"/></symbol><symbol id="plus" fill="none" viewBox="-5 -5 25 25"><path d="M0,12 L0,18, M-3,15 L3,15 Z"/><path d="M5,2 L5,8 M2,5 L8,5 Z"/><path d="M10,7 L10,13 M7,10 L13,10 Z"/><path d="M15,-3 L15,3 M12,0 L18,0 Z"/></symbol></defs>';var y=0,x=[],w=window.getComputedStyle(document.querySelector("body"));for(h=0;h<d.length;++h){let e=h%l.legend.noColumns;s=d[h],b.label=s.label;var k=o.getSurface().getTextInfo("",b.label,{style:w.fontStyle,variant:w.fontVariant,weight:w.fontWeight,size:parseInt(w.fontSize),lineHeight:parseInt(w.lineHeight),family:w.fontFamily}).width;x[e]?k>x[e]&&(x[e]=k+48):x[e]=k+48}for(h=0;h<d.length;++h){let e=h%l.legend.noColumns;s=d[h],a="",b.label=s.label,b.xPos=y+3+"px",y+=x[e],(h+1)%l.legend.noColumns==0&&(y=0),b.yPos=1.5*Math.floor(h/l.legend.noColumns)+"em",s.options.lines.show&&s.options.lines.fill&&(b.name="area",b.fillColor=s.color,a+=t(b)),s.options.bars.show&&(b.name="bar",b.fillColor=s.color,a+=t(b)),s.options.lines.show&&!s.options.lines.fill&&(b.name="line",b.strokeColor=s.color,b.strokeWidth=s.options.lines.lineWidth,a+=t(b)),s.options.points.show&&(b.name=s.options.points.symbol,b.strokeColor=s.color,b.fillColor=s.options.points.fillColor,b.strokeWidth=s.options.points.lineWidth,a+=t(b)),r='<text x="'+b.xPos+'" y="'+b.yPos+'" text-anchor="start"><tspan dx="2em" dy="1.2em">'+b.label+"</tspan></text>",g[p++]="<g>"+a+r+"</g>"}g[p++]="</svg>",null==u[0]&&(u=[u,u]),"n"===m.charAt(0)?f+="top:"+(u[1]+c.top)+"px;":"s"===m.charAt(0)&&(f+="bottom:"+(u[1]+c.bottom)+"px;"),"e"===m.charAt(1)?f+="right:"+(u[0]+c.right)+"px;":"w"===m.charAt(1)&&(f+="left:"+(u[0]+c.left)+"px;");var v=6;for(h=0;h<x.length;++h)v+=x[h];var L,M=1.6*Math.ceil(d.length/l.legend.noColumns);l.legend.container?(L=e(g.join("")).appendTo(l.legend.container)[0],l.legend.container.style.width=v+"px",l.legend.container.style.height=M+"em"):((L=e('<div class="legend" style="position:absolute;'+f+'">'+g.join("")+"</div>").appendTo(n)).css("width",v+"px"),L.css("height",M+"em"),L.css("pointerEvents","none"))}}(l,n,l.getPlaceholder(),h)}))},options:{legend:{show:!1,noColumns:1,labelFormatter:null,container:null,position:"ne",margin:5,sorted:null}},name:"legend",version:"1.0"})}(jQuery);