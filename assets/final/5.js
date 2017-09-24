!function(t){t.fn.extend({tableExport:function(e){function o(t,e,o){var n="";if(null!==t){var i=g(t,e,o),a=null===i||""===i?"":i.toString();"tsv"==T.type?(i instanceof Date&&i.toLocaleString(),n=f(a,"\t"," ")):i instanceof Date?n=T.csvEnclosure+i.toLocaleString()+T.csvEnclosure:((n=f(a,T.csvEnclosure,T.csvEnclosure+T.csvEnclosure)).indexOf(T.csvSeparator)>=0||/[\r\n ]/g.test(n))&&(n=T.csvEnclosure+n+T.csvEnclosure)}return n}function n(e){var o=[];return t(e).find("thead").first().find("th").each(function(e,n){void 0!==t(n).attr("data-field")?o[e]=t(n).attr("data-field"):o[e]=e.toString()}),o}function i(e,o){var n=!1;return T.ignoreColumn.length>0&&(-1!=t.inArray(o,T.ignoreColumn)||-1!=t.inArray(o-e,T.ignoreColumn)||B.length>o&&void 0!==B[o]&&-1!=t.inArray(B[o],T.ignoreColumn))&&(n=!0),n}function a(e,o,n,a,r){if(-1==t.inArray(n,T.ignoreRow)&&-1==t.inArray(n-a,T.ignoreRow)){var l=t(e).filter(function(){return"none"!=t(this).data("tableexport-display")&&(t(this).is(":visible")||"always"==t(this).data("tableexport-display")||"always"==t(this).closest("table").data("tableexport-display"))}).find(o),s=0;if(l.each(function(e){if(("always"==t(this).data("tableexport-display")||"none"!=t(this).css("display")&&"hidden"!=t(this).css("visibility")&&"none"!=t(this).data("tableexport-display"))&&"function"==typeof r){var o,a,c=1,h=1,d=l.length;if(void 0!==L[n]&&L[n].length>0){var f=e;for(o=0;f>=o;o++)void 0!==L[n][o]&&(r(null,n,o),delete L[n][o],f++);e+=L[n].length,d+=L[n].length}if(t(this).is("[colspan]")&&(c=parseInt(t(this).attr("colspan"))||1,s+=c>0?c-1:0),t(this).is("[rowspan]")&&(h=parseInt(t(this).attr("rowspan"))||1),!1===i(d,e+s))for(r(this,n,e),o=1;c>o;o++)r(null,n,e+o);if(h>1)for(a=1;h>a;a++)for(void 0===L[n+a]&&(L[n+a]=[]),L[n+a][e+s]="",o=1;c>o;o++)L[n+a][e+s-o]=""}}),void 0!==L[n]&&L[n].length>0)for(var c=0;c<=L[n].length;c++)void 0!==L[n][c]&&(r(null,n,c),delete L[n][c])}}function r(t,e){if(!0===T.consoleLog&&console.log(t.output()),"string"===T.outputMode)return t.output();if("base64"===T.outputMode)return E(t.output());if("window"!==T.outputMode)try{var o=t.output("blob");saveAs(o,T.fileName+".pdf")}catch(o){A(T.fileName+".pdf","data:application/pdf"+(e?"":";base64")+",",e?t.output("blob"):t.output())}else window.open(URL.createObjectURL(t.output("blob")))}function l(t,e,o){var n=0;if(void 0!==o&&(n=o.colspan),n>=0){for(var i=t.width,a=t.textPos.x,r=e.table.columns.indexOf(e.column),l=1;n>l;l++)i+=e.table.columns[r+l].width;if(n>1&&("right"===t.styles.halign?a=t.textPos.x+i-t.width:"center"===t.styles.halign&&(a=t.textPos.x+(i-t.width)/2)),t.width=i,t.textPos.x=a,void 0!==o&&o.rowspan>1&&(t.height=t.height*o.rowspan),"middle"===t.styles.valign||"bottom"===t.styles.valign){var s=("string"==typeof t.text?t.text.split(/\r\n|\r|\n/g):t.text).length||1;s>2&&(t.textPos.y-=(2-P)/2*e.row.styles.fontSize*(s-2)/3)}return!0}return!1}function s(e,o,n){void 0!==n.images&&o.each(function(){var o=t(this).children();if(t(this).is("img")){var i=k(this.src);n.images[i]={url:this.src,src:this.src}}void 0!==o&&o.length>0&&s(e,o,n)})}function c(e,o,n){o.each(function(){var o=t(this).children(),i=0;if(t(this).is("div")){var a=y(b(this,"background-color"),[255,255,255]),r=y(b(this,"border-top-color"),[0,0,0]),l=x(this,"border-top-width",T.jspdf.unit),s=this.getBoundingClientRect(),h=this.offsetLeft*n.dw;i=this.offsetTop*n.dh;var d=s.width*n.dw,f=s.height*n.dh;n.doc.setDrawColor.apply(void 0,r),n.doc.setFillColor.apply(void 0,a),n.doc.setLineWidth(l),n.doc.rect(e.x+h,e.y+i,d,f,l?"FD":"F")}else if(t(this).is("img")&&void 0!==n.images){var u=k(this.src),p=n.images[u];if(void 0!==p){var g=e.width/e.height,m=this.width/this.height,v=e.width,w=e.height,S=19.049976/25.4;g>=m?(w=Math.min(e.height,this.height),v=this.width*w/this.height):m>g&&(v=Math.min(e.width,this.width),w=this.height*v/this.width),v*=S,(w*=S)<e.height&&(i=(e.height-w)/2);try{n.doc.addImage(p.src,e.textPos.x,e.y+i,v,w)}catch(t){}e.textPos.x+=v}}void 0!==o&&o.length>0&&c(e,o,n)})}function h(e,o,n){if("function"==typeof n.onAutotableText)n.onAutotableText(n.doc,e,o);else{var i=e.textPos.x,a=e.textPos.y,r={halign:e.styles.halign,valign:e.styles.valign};if(o.length){for(var l=o[0];l.previousSibling;)l=l.previousSibling;for(var s=!1,c=!1;l;){var h=l.innerText||l.textContent||"";h=(h.length&&" "==h[0]?" ":"")+t.trim(h)+(h.length>1&&" "==h[h.length-1]?" ":""),t(l).is("br")&&(i=e.textPos.x,a+=n.doc.internal.getFontSize()),t(l).is("b")?s=!0:t(l).is("i")&&(c=!0),(s||c)&&n.doc.setFontType(s&&c?"bolditalic":s?"bold":"italic");var d=n.doc.getStringUnitWidth(h)*n.doc.internal.getFontSize();if(d){if("linebreak"===e.styles.overflow&&i>e.textPos.x&&i+d>e.textPos.x+e.width){if(".,!%*;:=-".indexOf(h.charAt(0))>=0){var f=h.charAt(0);i+(d=n.doc.getStringUnitWidth(f)*n.doc.internal.getFontSize())<=e.textPos.x+e.width&&(n.doc.autoTableText(f,i,a,r),h=h.substring(1,h.length)),d=n.doc.getStringUnitWidth(h)*n.doc.internal.getFontSize()}i=e.textPos.x,a+=n.doc.internal.getFontSize()}for(;h.length&&i+d>e.textPos.x+e.width;)h=h.substring(0,h.length-1),d=n.doc.getStringUnitWidth(h)*n.doc.internal.getFontSize();n.doc.autoTableText(h,i,a,r),i+=d}(s||c)&&(t(l).is("b")?s=!1:t(l).is("i")&&(c=!1),n.doc.setFontType(s||c?s?"bold":"italic":"normal")),l=l.nextSibling}e.textPos.x=i,e.textPos.y=a}else n.doc.autoTableText(e.text,e.textPos.x,e.textPos.y,r)}}function d(t){return t.replace(/([.*+?^=!:${}()|\[\]\/\\])/g,"\\$1")}function f(t,e,o){return t.replace(new RegExp(d(e),"g"),o)}function u(t){return t=t||"0",t=f(t,T.numbers.html.thousandsSeparator,""),("number"==typeof(t=f(t,T.numbers.html.decimalMark,"."))||!1!==jQuery.isNumeric(t))&&t}function p(t){return t.indexOf("%")>-1?!1!==(t=u(t.replace(/%/g,"")))&&(t/=100):t=!1,t}function g(e,o,n){var i="";if(null!==e){var a,r=t(e);if(r[0].hasAttribute("data-tableexport-value"))a=r.data("tableexport-value"),a=a?a+"":"";else if(a=r.html(),"function"==typeof T.onCellHtmlData)a=T.onCellHtmlData(r,o,n,a);else if(""!=a){var l=t.parseHTML(a),s=0,c=0;a="",t.each(l,function(){t(this).is("input")?a+=r.find("input").eq(s++).val():t(this).is("select")?a+=r.find("select option:selected").eq(c++).text():void 0===t(this).html()?a+=t(this).text():(void 0===jQuery().bootstrapTable||!0!==t(this).hasClass("filterControl"))&&(a+=t(this).html())})}if(!0===T.htmlContent)i=t.trim(a);else if(a&&""!=a){var h=a.replace(/\n/g,"\u2028").replace(/<br\s*[\/]?>/gi,"⁠"),d=t("<div/>").html(h).contents(),f=!1;if(h="",t.each(d.text().split("\u2028"),function(e,o){e>0&&(h+=" "),h+=t.trim(o)}),t.each(h.split("⁠"),function(e,o){e>0&&(i+="\n"),i+=t.trim(o).replace(/\u00AD/g,"")}),"json"==T.type||"excel"===T.type&&"xmlss"===T.excelFileFormat||!1===T.numbers.output)!1!==(f=u(i))&&(i=Number(f));else if((T.numbers.html.decimalMark!=T.numbers.output.decimalMark||T.numbers.html.thousandsSeparator!=T.numbers.output.thousandsSeparator)&&!1!==(f=u(i))){var p=(""+f.substr(0>f?1:0)).split(".");1==p.length&&(p[1]="");var g=p[0].length>3?p[0].length%3:0;i=(0>f?"-":"")+(T.numbers.output.thousandsSeparator?(g?p[0].substr(0,g)+T.numbers.output.thousandsSeparator:"")+p[0].substr(g).replace(/(\d{3})(?=\d)/g,"$1"+T.numbers.output.thousandsSeparator):p[0])+(p[1].length?T.numbers.output.decimalMark+p[1]:"")}}!0===T.escape&&(i=escape(i)),"function"==typeof T.onCellData&&(i=T.onCellData(r,o,n,i))}return i}function m(t,e,o){return e+"-"+o.toLowerCase()}function y(t,e){var o=/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/.exec(t),n=e;return o&&(n=[parseInt(o[1]),parseInt(o[2]),parseInt(o[3])]),n}function v(e){var o=b(e,"text-align"),n=b(e,"font-weight"),i=b(e,"font-style"),a="";"start"==o&&(o="rtl"==b(e,"direction")?"right":"left"),n>=700&&(a="bold"),"italic"==i&&(a+=i),""===a&&(a="normal");var r={style:{align:o,bcolor:y(b(e,"background-color"),[255,255,255]),color:y(b(e,"color"),[0,0,0]),fstyle:a},colspan:parseInt(t(e).attr("colspan"))||0,rowspan:parseInt(t(e).attr("rowspan"))||0};if(null!==e){var l=e.getBoundingClientRect();r.rect={width:l.width,height:l.height}}return r}function b(t,e){try{return window.getComputedStyle?(e=e.replace(/([a-z])([A-Z])/,m),window.getComputedStyle(t,null).getPropertyValue(e)):t.currentStyle?t.currentStyle[e]:t.style[e]}catch(t){}return""}function w(t,e,o){var n=document.createElement("div");n.style.overflow="hidden",n.style.visibility="hidden",t.appendChild(n),n.style.width=100+o;var i=100/n.offsetWidth;return t.removeChild(n),e*i}function x(t,e,o){var n=b(t,e).match(/\d+/);return null!==n?(n=n[0],w(t.parentElement,n,o)):0}function S(){return this instanceof S?(this.SheetNames=[],void(this.Sheets={})):new S}function C(t){for(var e=new ArrayBuffer(t.length),o=new Uint8Array(e),n=0;n!=t.length;++n)o[n]=255&t.charCodeAt(n);return e}function N(t,e){return e&&(t+=1462),(Date.parse(t)-new Date(Date.UTC(1899,11,30)))/864e5}function k(t){var e,o,n,i=0;if(0===t.length)return i;for(e=0,n=t.length;n>e;e++)o=t.charCodeAt(e),i=(i<<5)-i+o,i|=0;return i}function A(t,e,o){var n=window.navigator.userAgent;if(!1!==t&&(n.indexOf("MSIE ")>0||n.match(/Trident.*rv\:11\./)))if(window.navigator.msSaveOrOpenBlob)window.navigator.msSaveOrOpenBlob(new Blob([o]),t);else{var i=document.createElement("iframe");i&&(document.body.appendChild(i),i.setAttribute("style","display:none"),i.contentDocument.open("txt/html","replace"),i.contentDocument.write(o),i.contentDocument.close(),i.focus(),i.contentDocument.execCommand("SaveAs",!0,t),document.body.removeChild(i))}else{var a=document.createElement("a");if(a){var r=null;a.style.display="none",!1!==t?a.download=t:a.target="_blank","object"==typeof o?(r=window.URL.createObjectURL(o),a.href=r):e.toLowerCase().indexOf("base64,")>=0?a.href=e+E(o):a.href=e+encodeURIComponent(o),document.body.appendChild(a),document.createEvent?(null===O&&(O=document.createEvent("MouseEvents")),O.initEvent("click",!0,!1),a.dispatchEvent(O)):document.createEventObject?a.fireEvent("onclick"):"function"==typeof a.onclick&&a.onclick(),r&&window.URL.revokeObjectURL(r),document.body.removeChild(a)}}}function j(t){t=t.replace(/\x0d\x0a/g,"\n");for(var e="",o=0;o<t.length;o++){var n=t.charCodeAt(o);128>n?e+=String.fromCharCode(n):n>127&&2048>n?(e+=String.fromCharCode(n>>6|192),e+=String.fromCharCode(63&n|128)):(e+=String.fromCharCode(n>>12|224),e+=String.fromCharCode(n>>6&63|128),e+=String.fromCharCode(63&n|128))}return e}function E(t){var e,o,n,i,a,r,l,s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",c="",h=0;for(t=j(t);h<t.length;)e=t.charCodeAt(h++),o=t.charCodeAt(h++),n=t.charCodeAt(h++),i=e>>2,a=(3&e)<<4|o>>4,r=(15&o)<<2|n>>6,l=63&n,isNaN(o)?r=l=64:isNaN(n)&&(l=64),c=c+s.charAt(i)+s.charAt(a)+s.charAt(r)+s.charAt(l);return c}var D,T={consoleLog:!1,csvEnclosure:'"',csvSeparator:",",csvUseBOM:!0,displayTableName:!1,escape:!1,excelFileFormat:"xlshtml",excelstyles:[],fileName:"tableExport",htmlContent:!1,ignoreColumn:[],ignoreRow:[],jsonScope:"all",jspdf:{orientation:"p",unit:"pt",format:"a4",margins:{left:20,right:10,top:10,bottom:10},onDocCreated:null,autotable:{styles:{cellPadding:2,rowHeight:12,fontSize:8,fillColor:255,textColor:50,fontStyle:"normal",overflow:"ellipsize",halign:"left",valign:"middle"},headerStyles:{fillColor:[52,73,94],textColor:255,fontStyle:"bold",halign:"center"},alternateRowStyles:{fillColor:245},tableExport:{doc:null,onAfterAutotable:null,onBeforeAutotable:null,onAutotableText:null,onTable:null,outputImages:!0}}},numbers:{html:{decimalMark:".",thousandsSeparator:","},output:{decimalMark:".",thousandsSeparator:","}},onCellData:null,onCellHtmlData:null,onMsoNumberFormat:null,outputMode:"file",pdfmake:{enabled:!1,docDefinition:{pageOrientation:"portrait",defaultStyle:{font:"Roboto"}},fonts:{}},tbodySelector:"tr",tfootSelector:"tr",theadSelector:"tr",tableName:"myTableName",type:"csv",worksheetName:"Worksheet"},P=1.15,M=this,O=null,R=[],W=[],F=0,L=[],I="",B=[];if(t.extend(!0,T,e),B=n(M),"csv"==T.type||"tsv"==T.type||"txt"==T.type){var U="",H=0;F=0;var z=function(e,n,i){return e.each(function(){I="",a(this,n,F,i+e.length,function(t,e,n){I+=o(t,e,n)+("tsv"==T.type?"\t":T.csvSeparator)}),(I=t.trim(I).substring(0,I.length-1)).length>0&&(U.length>0&&(U+="\n"),U+=I),F++}),e.length};if(H+=z(t(M).find("thead").first().find(T.theadSelector),"th,td",H),t(M).find("tbody").each(function(){H+=z(t(this).find(T.tbodySelector),"td,th",H)}),T.tfootSelector.length&&z(t(M).find("tfoot").first().find(T.tfootSelector),"td,th",H),U+="\n",!0===T.consoleLog&&console.log(U),"string"===T.outputMode)return U;if("base64"===T.outputMode)return E(U);if("window"===T.outputMode)return void A(!1,"data:text/"+("csv"==T.type?"csv":"plain")+";charset=utf-8,",U);try{D=new Blob([U],{type:"text/"+("csv"==T.type?"csv":"plain")+";charset=utf-8"}),saveAs(D,T.fileName+"."+T.type,"csv"!=T.type||!1===T.csvUseBOM)}catch(t){A(T.fileName+"."+T.type,"data:text/"+("csv"==T.type?"csv":"plain")+";charset=utf-8,"+("csv"==T.type&&T.csvUseBOM?"\ufeff":""),U)}}else if("sql"==T.type){F=0;var K="INSERT INTO `"+T.tableName+"` (";if((R=t(M).find("thead").first().find(T.theadSelector)).each(function(){a(this,"th,td",F,R.length,function(t,e,o){K+="'"+g(t,e,o)+"',"}),F++,K=t.trim(K),K=t.trim(K).substring(0,K.length-1)}),K+=") VALUES ",t(M).find("tbody").each(function(){W.push.apply(W,t(this).find(T.tbodySelector))}),T.tfootSelector.length&&W.push.apply(W,t(M).find("tfoot").find(T.tfootSelector)),t(W).each(function(){I="",a(this,"td,th",F,R.length+W.length,function(t,e,o){I+="'"+g(t,e,o)+"',"}),I.length>3&&(K+="("+I,K=t.trim(K).substring(0,K.length-1),K+="),"),F++}),K=t.trim(K).substring(0,K.length-1),K+=";",!0===T.consoleLog&&console.log(K),"string"===T.outputMode)return K;if("base64"===T.outputMode)return E(K);try{D=new Blob([K],{type:"text/plain;charset=utf-8"}),saveAs(D,T.fileName+".sql")}catch(t){A(T.fileName+".sql","data:application/sql;charset=utf-8,",K)}}else if("json"==T.type){var X=[];(R=t(M).find("thead").first().find(T.theadSelector)).each(function(){var t=[];a(this,"th,td",F,R.length,function(e,o,n){t.push(g(e,o,n))}),X.push(t)});var q=[];t(M).find("tbody").each(function(){W.push.apply(W,t(this).find(T.tbodySelector))}),T.tfootSelector.length&&W.push.apply(W,t(M).find("tfoot").find(T.tfootSelector)),t(W).each(function(){var e={},o=0;a(this,"td,th",F,R.length+W.length,function(t,n,i){X.length?e[X[X.length-1][o]]=g(t,n,i):e[o]=g(t,n,i),o++}),!1===t.isEmptyObject(e)&&q.push(e),F++});var Q="";if(Q="head"==T.jsonScope?JSON.stringify(X):"data"==T.jsonScope?JSON.stringify(q):JSON.stringify({header:X,data:q}),!0===T.consoleLog&&console.log(Q),"string"===T.outputMode)return Q;if("base64"===T.outputMode)return E(Q);try{D=new Blob([Q],{type:"application/json;charset=utf-8"}),saveAs(D,T.fileName+".json")}catch(t){A(T.fileName+".json","data:application/json;charset=utf-8;base64,",Q)}}else if("xml"===T.type){F=0;var Y='<?xml version="1.0" encoding="utf-8"?>';Y+="<tabledata><fields>",(R=t(M).find("thead").first().find(T.theadSelector)).each(function(){a(this,"th,td",F,R.length,function(t,e,o){Y+="<field>"+g(t,e,o)+"</field>"}),F++}),Y+="</fields><data>";var J=1;if(t(M).find("tbody").each(function(){W.push.apply(W,t(this).find(T.tbodySelector))}),T.tfootSelector.length&&W.push.apply(W,t(M).find("tfoot").find(T.tfootSelector)),t(W).each(function(){var t=1;I="",a(this,"td,th",F,R.length+W.length,function(e,o,n){I+="<column-"+t+">"+g(e,o,n)+"</column-"+t+">",t++}),I.length>0&&"<column-1></column-1>"!=I&&(Y+='<row id="'+J+'">'+I+"</row>",J++),F++}),Y+="</data></tabledata>",!0===T.consoleLog&&console.log(Y),"string"===T.outputMode)return Y;if("base64"===T.outputMode)return E(Y);try{D=new Blob([Y],{type:"application/xml;charset=utf-8"}),saveAs(D,T.fileName+".xml")}catch(t){A(T.fileName+".xml","data:application/xml;charset=utf-8;base64,",Y)}}else if("excel"===T.type&&"xmlss"===T.excelFileFormat){var V=[];t(M).filter(function(){return"none"!=t(this).data("tableexport-display")&&(t(this).is(":visible")||"always"==t(this).data("tableexport-display"))}).each(function(){var e=t(this),o="";F=0,B=n(this),R=e.find("thead").first().find(T.theadSelector),o+="<Table>";var i=0;R.each(function(){I="",a(this,"th,td",F,R.length,function(t,e,o){null!==t&&(I+='<Cell><Data ss:Type="String">'+g(t,e,o)+"</Data></Cell>",i++)}),I.length>0&&(o+="<Row>"+I+"</Row>"),F++}),W=[],e.find("tbody").each(function(){W.push.apply(W,t(this).find(T.tbodySelector))}),t(W).each(function(){I="",a(this,"td,th",F,R.length+W.length,function(t,e,o){if(null!==t){var n="String",i="",a=g(t,e,o);if(!1!==jQuery.isNumeric(a))n="Number";else{var r=p(a);!1!==r&&(a=r,n="Number",i=' ss:StyleID="pct1"')}"Number"!==n&&(a=a.replace(/\n/g,"<br>")),I+="<Cell"+i+'><Data ss:Type="'+n+'">'+a+"</Data></Cell>"}}),I.length>0&&(o+="<Row>"+I+"</Row>"),F++}),o+="</Table>",V.push(o),!0===T.consoleLog&&console.log(o)});for(var $='<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?> <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40"> <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"> <Created>'+(new Date).toISOString()+'</Created> </DocumentProperties> <OfficeDocumentSettings xmlns="urn:schemas-microsoft-com:office:office"> <AllowPNG/> </OfficeDocumentSettings> <ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel"> <WindowHeight>9000</WindowHeight> <WindowWidth>13860</WindowWidth> <WindowTopX>0</WindowTopX> <WindowTopY>0</WindowTopY> <ProtectStructure>False</ProtectStructure> <ProtectWindows>False</ProtectWindows> </ExcelWorkbook> <Styles> <Style ss:ID="Default" ss:Name="Default"> <Alignment ss:Vertical="Center"/> <Borders/> <Font/> <Interior/> <NumberFormat/> <Protection/> </Style> <Style ss:ID="Normal" ss:Name="Normal"/> <Style ss:ID="pct1">   <NumberFormat ss:Format="Percent"/> </Style> </Styles>',_=0;_<V.length;_++){var G="string"==typeof T.worksheetName?T.worksheetName+" "+(_+1):void 0!==T.worksheetName[_]?T.worksheetName[_]:"Table "+(_+1);$+='<Worksheet ss:Name="'+G+'">'+V[_]+"<WorksheetOptions/> </Worksheet>"}if($+="</Workbook>",!0===T.consoleLog&&console.log($),"string"===T.outputMode)return $;if("base64"===T.outputMode)return E($);try{D=new Blob([$],{type:"application/xml;charset=utf-8"}),saveAs(D,T.fileName+".xml")}catch(t){A(T.fileName+".xml","data:application/xml;charset=utf-8;base64,",$)}}else if("excel"==T.type||"xls"==T.type||"word"==T.type||"doc"==T.type){var Z="excel"==T.type||"xls"==T.type?"excel":"word",tt="excel"==Z?"xls":"doc",et='xmlns:x="urn:schemas-microsoft-com:office:'+Z+'"',ot="";t(M).filter(function(){return"none"!=t(this).data("tableexport-display")&&(t(this).is(":visible")||"always"==t(this).data("tableexport-display"))}).each(function(){var e=t(this);F=0,B=n(this),ot+="<table><thead>",(R=e.find("thead").first().find(T.theadSelector)).each(function(){I="",a(this,"th,td",F,R.length,function(e,o,n){if(null!==e){var i="";I+="<th";for(var a in T.excelstyles)if(T.excelstyles.hasOwnProperty(a)){var r=t(e).css(T.excelstyles[a]);""!==r&&"0px none rgb(0, 0, 0)"!=r&&"rgba(0, 0, 0, 0)"!=r&&(i+=""===i?'style="':";",i+=T.excelstyles[a]+":"+r)}""!==i&&(I+=" "+i+'"'),t(e).is("[colspan]")&&(I+=' colspan="'+t(e).attr("colspan")+'"'),t(e).is("[rowspan]")&&(I+=' rowspan="'+t(e).attr("rowspan")+'"'),I+=">"+g(e,o,n)+"</th>"}}),I.length>0&&(ot+="<tr>"+I+"</tr>"),F++}),ot+="</thead><tbody>",e.find("tbody").each(function(){W.push.apply(W,t(this).find(T.tbodySelector))}),T.tfootSelector.length&&W.push.apply(W,e.find("tfoot").find(T.tfootSelector)),t(W).each(function(){var e=t(this);I="",a(this,"td,th",F,R.length+W.length,function(o,n,i){if(null!==o){var a=g(o,n,i),r="",l=t(o).data("tableexport-msonumberformat");void 0===l&&"function"==typeof T.onMsoNumberFormat&&(l=T.onMsoNumberFormat(o,n,i)),void 0!==l&&""!==l&&(r="style=\"mso-number-format:'"+l+"'");for(var s in T.excelstyles)T.excelstyles.hasOwnProperty(s)&&(""===(l=t(o).css(T.excelstyles[s]))&&(l=e.css(T.excelstyles[s])),""!==l&&"0px none rgb(0, 0, 0)"!=l&&"rgba(0, 0, 0, 0)"!=l&&(r+=""===r?'style="':";",r+=T.excelstyles[s]+":"+l));I+="<td",""!==r&&(I+=" "+r+'"'),t(o).is("[colspan]")&&(I+=' colspan="'+t(o).attr("colspan")+'"'),t(o).is("[rowspan]")&&(I+=' rowspan="'+t(o).attr("rowspan")+'"'),"string"==typeof a&&""!=a&&(a=a.replace(/\n/g,"<br>")),I+=">"+a+"</td>"}}),I.length>0&&(ot+="<tr>"+I+"</tr>"),F++}),T.displayTableName&&(ot+="<tr><td></td></tr><tr><td></td></tr><tr><td>"+g(t("<p>"+T.tableName+"</p>"))+"</td></tr>"),ot+="</tbody></table>",!0===T.consoleLog&&console.log(ot)});var nt='<html xmlns:o="urn:schemas-microsoft-com:office:office" '+et+' xmlns="http://www.w3.org/TR/REC-html40">';if(nt+='<meta http-equiv="content-type" content="application/vnd.ms-'+Z+'; charset=UTF-8">',nt+="<head>","excel"===Z&&(nt+="\x3c!--[if gte mso 9]>",nt+="<xml>",nt+="<x:ExcelWorkbook>",nt+="<x:ExcelWorksheets>",nt+="<x:ExcelWorksheet>",nt+="<x:Name>",nt+=T.worksheetName,nt+="</x:Name>",nt+="<x:WorksheetOptions>",nt+="<x:DisplayGridlines/>",nt+="</x:WorksheetOptions>",nt+="</x:ExcelWorksheet>",nt+="</x:ExcelWorksheets>",nt+="</x:ExcelWorkbook>",nt+="</xml>",nt+="<![endif]--\x3e"),nt+="<style>br {mso-data-placement:same-cell;}</style>",nt+="</head>",nt+="<body>",nt+=ot,nt+="</body>",nt+="</html>",!0===T.consoleLog&&console.log(nt),"string"===T.outputMode)return nt;if("base64"===T.outputMode)return E(nt);try{D=new Blob([nt],{type:"application/vnd.ms-"+T.type}),saveAs(D,T.fileName+"."+tt)}catch(t){A(T.fileName+"."+tt,"data:application/vnd.ms-"+Z+";base64,",nt)}}else if("xlsx"==T.type){var it=[],at=[];F=0,W=t(M).find("thead").first().find(T.theadSelector),t(M).find("tbody").each(function(){W.push.apply(W,t(this).find(T.tbodySelector))}),T.tfootSelector.length&&W.push.apply(W,t(M).find("tfoot").find(T.tfootSelector)),t(W).each(function(){var t=[];a(this,"th,td",F,W.length,function(e,o,n){if(void 0!==e&&null!==e){var i=g(e,o,n),a=parseInt(e.getAttribute("colspan")),r=parseInt(e.getAttribute("rowspan"));if(at.forEach(function(e){if(F>=e.s.r&&F<=e.e.r&&t.length>=e.s.c&&t.length<=e.e.c)for(var o=0;o<=e.e.c-e.s.c;++o)t.push(null)}),(r||a)&&(r=r||1,a=a||1,at.push({s:{r:F,c:t.length},e:{r:F+r-1,c:t.length+a-1}})),"function"!=typeof T.onCellData&&""!==i&&i==+i&&(i=+i),t.push(""!==i?i:null),a)for(var l=0;a-1>l;++l)t.push(null)}}),it.push(t),F++});var rt=new S,lt=function(t){for(var e={},o={s:{c:1e7,r:1e7},e:{c:0,r:0}},n=0;n!=t.length;++n)for(var i=0;i!=t[n].length;++i){o.s.r>n&&(o.s.r=n),o.s.c>i&&(o.s.c=i),o.e.r<n&&(o.e.r=n),o.e.c<i&&(o.e.c=i);var a={v:t[n][i]};if(null!==a.v){var r=XLSX.utils.encode_cell({c:i,r:n});"number"==typeof a.v?a.t="n":"boolean"==typeof a.v?a.t="b":a.v instanceof Date?(a.t="n",a.z=XLSX.SSF._table[14],a.v=N(a.v)):a.t="s",e[r]=a}}return o.s.c<1e7&&(e["!ref"]=XLSX.utils.encode_range(o)),e}(it);lt["!merges"]=at,rt.SheetNames.push(T.worksheetName),rt.Sheets[T.worksheetName]=lt;var st=XLSX.write(rt,{bookType:T.type,bookSST:!1,type:"binary"});try{D=new Blob([C(st)],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"}),saveAs(D,T.fileName+"."+T.type)}catch(t){A(T.fileName+"."+T.type,"data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8,",C(st))}}else if("png"==T.type)html2canvas(t(M)[0]).then(function(t){for(var e=t.toDataURL(),o=atob(e.substring(22)),n=new ArrayBuffer(o.length),i=new Uint8Array(n),a=0;a<o.length;a++)i[a]=o.charCodeAt(a);if(!0===T.consoleLog&&console.log(o),"string"===T.outputMode)return o;if("base64"===T.outputMode)return E(e);if("window"!==T.outputMode)try{D=new Blob([n],{type:"image/png"}),saveAs(D,T.fileName+".png")}catch(t){A(T.fileName+".png","data:image/png,",D)}else window.open(e)});else if("pdf"==T.type)if(!0===T.pdfmake.enabled){var ct=[],ht=[];F=0;for(var dt=function(e,o,n){var i=0;return t(e).each(function(){var t=[];a(this,o,F,n,function(e,o,n){if(void 0!==e&&null!==e){var i=parseInt(e.getAttribute("colspan")),a=parseInt(e.getAttribute("rowspan")),r=g(e,o,n)||" ";i>1||a>1?(i=i||1,a=a||1,t.push({colSpan:i,rowSpan:a,text:r})):t.push(r)}else t.push(" ")}),t.length&&ht.push(t),i<t.length&&(i=t.length),F++}),i},ft=dt(R=t(this).find("thead").first().find(T.theadSelector),"th,td",R.length),ut=ct.length;ft>ut;ut++)ct.push("*");t(this).find("tbody").each(function(){W.push.apply(W,t(this).find(T.tbodySelector))}),T.tfootSelector.length&&W.push.apply(W,t(this).find("tfoot").find(T.tfootSelector)),dt(W,"th,td",R.length+W.length);var pt={content:[{table:{headerRows:R.length,widths:ct,body:ht}}]};t.extend(!0,pt,T.pdfmake.docDefinition),pdfMake.fonts={Roboto:{normal:"Roboto-Regular.ttf",bold:"Roboto-Medium.ttf",italics:"Roboto-Italic.ttf",bolditalics:"Roboto-MediumItalic.ttf"}},t.extend(!0,pdfMake.fonts,T.pdfmake.fonts),pdfMake.createPdf(pt).getBuffer(function(t){try{var e=new Blob([t],{type:"application/pdf"});saveAs(e,T.fileName+".pdf")}catch(e){A(T.fileName+".pdf","data:application/pdf;base64,",t)}})}else if(!1===T.jspdf.autotable){var gt={dim:{w:x(t(M).first().get(0),"width","mm"),h:x(t(M).first().get(0),"height","mm")},pagesplit:!1},mt=new jsPDF(T.jspdf.orientation,T.jspdf.unit,T.jspdf.format);mt.addHTML(t(M).first(),T.jspdf.margins.left,T.jspdf.margins.top,gt,function(){r(mt,!1)})}else{var yt=T.jspdf.autotable.tableExport;if("string"==typeof T.jspdf.format&&"bestfit"===T.jspdf.format.toLowerCase()){var vt={a0:[2383.94,3370.39],a1:[1683.78,2383.94],a2:[1190.55,1683.78],a3:[841.89,1190.55],a4:[595.28,841.89]},bt="",wt="",xt=0;t(M).filter(":visible").each(function(){if("none"!=t(this).css("display")){var e=x(t(this).get(0),"width","pt");if(e>xt){e>vt.a0[0]&&(bt="a0",wt="l");for(var o in vt)vt.hasOwnProperty(o)&&vt[o][1]>e&&(bt=o,wt="l",vt[o][0]>e&&(wt="p"));xt=e}}}),T.jspdf.format=""===bt?"a4":bt,T.jspdf.orientation=""===wt?"w":wt}null==yt.doc&&(yt.doc=new jsPDF(T.jspdf.orientation,T.jspdf.unit,T.jspdf.format),"function"==typeof T.jspdf.onDocCreated&&T.jspdf.onDocCreated(yt.doc)),!0===yt.outputImages&&(yt.images={}),void 0!==yt.images&&(t(M).filter(function(){return"none"!=t(this).data("tableexport-display")&&(t(this).is(":visible")||"always"==t(this).data("tableexport-display"))}).each(function(){var e=0;R=t(this).find("thead").find(T.theadSelector),t(this).find("tbody").each(function(){W.push.apply(W,t(this).find(T.tbodySelector))}),T.tfootSelector.length&&W.push.apply(W,t(this).find("tfoot").find(T.tfootSelector)),t(W).each(function(){a(this,"td,th",R.length+e,R.length+W.length,function(e){if(void 0!==e&&null!==e){var o=t(e).children();void 0!==o&&o.length>0&&s(e,o,yt)}}),e++})}),R=[],W=[]),function(t,e){function o(){e(i)}var n,i=0,a=0;if(void 0!==t.images)for(n in t.images)t.images.hasOwnProperty(n)&&function(t){if(t.url){var e=new Image;i=++a,e.crossOrigin="Anonymous",e.onerror=e.onload=function(){if(e.complete&&(0===e.src.indexOf("data:image/")&&(e.width=t.width||e.width||0,e.height=t.height||e.height||0),e.width+e.height)){var n=document.createElement("canvas"),i=n.getContext("2d");n.width=e.width,n.height=e.height,i.drawImage(e,0,0),t.src=n.toDataURL("image/jpeg")}--a||o()},e.src=t.url}}(t.images[n]);a||o()}(yt,function(){t(M).filter(function(){return"none"!=t(this).data("tableexport-display")&&(t(this).is(":visible")||"always"==t(this).data("tableexport-display"))}).each(function(){var e,o=0;if(B=n(this),yt.columns=[],yt.rows=[],yt.rowoptions={},"function"==typeof yt.onTable&&!1===yt.onTable(t(this),T))return!0;T.jspdf.autotable.tableExport=null;var i=t.extend(!0,{},T.jspdf.autotable);if(T.jspdf.autotable.tableExport=yt,i.margin={},t.extend(!0,i.margin,T.jspdf.margins),i.tableExport=yt,"function"!=typeof i.beforePageContent&&(i.beforePageContent=function(t){1==t.pageCount&&t.table.rows.concat(t.table.headerRow).forEach(function(e){e.height>0&&(e.height+=(2-P)/2*e.styles.fontSize,t.table.height+=(2-P)/2*e.styles.fontSize)})}),"function"!=typeof i.createdHeaderCell&&(i.createdHeaderCell=function(e,o){if(e.styles=t.extend({},o.row.styles),void 0!==yt.columns[o.column.dataKey]){var n=yt.columns[o.column.dataKey];if(void 0!==n.rect){var a;e.contentWidth=n.rect.width,(void 0===yt.heightRatio||0===yt.heightRatio)&&(a=o.row.raw[o.column.dataKey].rowspan?o.row.raw[o.column.dataKey].rect.height/o.row.raw[o.column.dataKey].rowspan:o.row.raw[o.column.dataKey].rect.height,yt.heightRatio=e.styles.rowHeight/a),(a=o.row.raw[o.column.dataKey].rect.height*yt.heightRatio)>e.styles.rowHeight&&(e.styles.rowHeight=a)}void 0!==n.style&&!0!==n.style.hidden&&(e.styles.halign=n.style.align,"inherit"===i.styles.fillColor&&(e.styles.fillColor=n.style.bcolor),"inherit"===i.styles.textColor&&(e.styles.textColor=n.style.color),"inherit"===i.styles.fontStyle&&(e.styles.fontStyle=n.style.fstyle))}}),"function"!=typeof i.createdCell&&(i.createdCell=function(t,e){var o=yt.rowoptions[e.row.index+":"+e.column.dataKey];void 0!==o&&void 0!==o.style&&!0!==o.style.hidden&&(t.styles.halign=o.style.align,"inherit"===i.styles.fillColor&&(t.styles.fillColor=o.style.bcolor),"inherit"===i.styles.textColor&&(t.styles.textColor=o.style.color),"inherit"===i.styles.fontStyle&&(t.styles.fontStyle=o.style.fstyle))}),"function"!=typeof i.drawHeaderCell&&(i.drawHeaderCell=function(t,e){var o=yt.columns[e.column.dataKey];return(!0!==o.style.hasOwnProperty("hidden")||!0!==o.style.hidden)&&o.rowIndex>=0&&l(t,e,o)}),"function"!=typeof i.drawCell&&(i.drawCell=function(t,e){var o=yt.rowoptions[e.row.index+":"+e.column.dataKey];if(l(t,e,o))if(yt.doc.rect(t.x,t.y,t.width,t.height,t.styles.fillStyle),void 0!==o&&void 0!==o.kids&&o.kids.length>0){var n=t.height/o.rect.height;(n>yt.dh||void 0===yt.dh)&&(yt.dh=n),yt.dw=t.width/o.rect.width;var i=t.textPos.y;c(t,o.kids,yt),t.textPos.y=i,h(t,o.kids,yt)}else h(t,{},yt);return!1}),yt.headerrows=[],(R=t(this).find("thead").find(T.theadSelector)).each(function(){e=0,yt.headerrows[o]=[],a(this,"th,td",o,R.length,function(t,n,i){var a=v(t);a.title=g(t,n,i),a.key=e++,a.rowIndex=o,yt.headerrows[o].push(a)}),o++}),o>0)for(var r=o-1;r>=0;)t.each(yt.headerrows[r],function(){var t=this;r>0&&null===this.rect&&(t=yt.headerrows[r-1][this.key]),null!==t&&t.rowIndex>=0&&(!0!==t.style.hasOwnProperty("hidden")||!0!==t.style.hidden)&&yt.columns.push(t)}),r=yt.columns.length>0?-1:r-1;var s=0;W=[],t(this).find("tbody").each(function(){W.push.apply(W,t(this).find(T.tbodySelector))}),T.tfootSelector.length&&W.push.apply(W,t(this).find("tfoot").find(T.tfootSelector)),t(W).each(function(){var n=[];e=0,a(this,"td,th",o,R.length+W.length,function(o,i,a){var r;void 0===yt.columns[e]&&(r={title:"",key:e,style:{hidden:!0}},yt.columns.push(r)),void 0!==o&&null!==o?(r=v(o),r.kids=t(o).children(),yt.rowoptions[s+":"+e++]=r):(r=t.extend(!0,{},yt.rowoptions[s+":"+(e-1)]),r.colspan=-1,yt.rowoptions[s+":"+e++]=r),n.push(g(o,i,a))}),n.length&&(yt.rows.push(n),s++),o++}),"function"==typeof yt.onBeforeAutotable&&yt.onBeforeAutotable(t(this),yt.columns,yt.rows,i),yt.doc.autoTable(yt.columns,yt.rows,i),"function"==typeof yt.onAfterAutotable&&yt.onAfterAutotable(t(this),i),T.jspdf.autotable.startY=yt.doc.autoTableEndPosY()+i.margin.top}),r(yt.doc,void 0!==yt.images&&!1===jQuery.isEmptyObject(yt.images)),void 0!==yt.headerrows&&(yt.headerrows.length=0),void 0!==yt.columns&&(yt.columns.length=0),void 0!==yt.rows&&(yt.rows.length=0),delete yt.doc,yt.doc=null})}return this}})}(jQuery);