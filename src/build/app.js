// ALL USEFUL FCTS
JSON.tryParse = function(o) {
  try {
    return JSON.parse(o);
  } catch (e) {
    return null;
  }
};

var assert = function () { };
// #BEGIN_DEV
assert = function (t) { if (!t) throw "assert false" }
// #END_DEV
/*!
 Lo-Dash 0.6.1 lodash.com/license
 Underscore.js 1.3.3 github.com/documentcloud/underscore/blob/master/LICENSE
*/
;(function(e,t){function s(e){return new o(e)}function o(e){if(e&&e._wrapped)return e;this._wrapped=e}function u(e,t,n){t||(t=0);var r=e.length,i=r-t>=(n||V),s=i?{}:e;if(i)for(var o=t-1;++o<r;)n=e[o]+"",(ft.call(s,n)?s[n]:s[n]=[]).push(e[o]);return function(e){if(i){var n=e+"";return ft.call(s,n)&&-1<k(s[n],e)}return-1<k(s,e,t)}}function a(){for(var e,t,n,s=-1,o=arguments.length,u={e:"",f:"",j:"",q:"",c:{d:""},m:{d:""}};++s<o;)for(t in e=arguments[s],e)n=(n=e[t])==r?"":n,/d|i/.test(t)?
("string"==typeof n&&(n={b:n,l:n}),u.c[t]=n.b||"",u.m[t]=n.l||""):u[t]=n;e=u.a,t=/^[^,]+/.exec(e)[0],n=u.s,u.g=t,u.h=Lt,u.k=Ft,u.n=Mt,u.p=st,u.r=u.r!==i,u.s=n==r?It:n,u.o==r&&(u.o=Pt),u.f||(u.f="if(!"+t+")return u");if("d"!=t||!u.c.i)u.c=r;t="",u.s&&(t+="'use strict';"),t+="var i,A,j="+u.g+",u",u.j&&(t+="="+u.j),t+=";"+u.f+";"+u.q+";",u.c&&(t+="var l=j.length;i=-1;",u.m&&(t+="if(l>-1&&l===l>>>0){"),u.o&&(t+="if(z.call(j)==x){j=j.split('')}"),t+=u.c.d+";while(++i<l){A=j[i];"+u.c.i+"}",u.m&&(t+="}"
));if(u.m){u.c?t+="else{":u.n&&(t+="var l=j.length;i=-1;if(l&&P(j)){while(++i<l){A=j[i+=''];"+u.m.i+"}}else{"),u.h||(t+="var v=typeof j=='function'&&r.call(j,'prototype');");if(u.k&&u.r)t+="var o=-1,p=Y[typeof j]?m(j):[],l=p.length;"+u.m.d+";while(++o<l){i=p[o];",u.h||(t+="if(!(v&&i=='prototype')){"),t+="A=j[i];"+u.m.i+"",u.h||(t+="}");else{t+=u.m.d+";for(i in j){";if(!u.h||u.r)t+="if(",u.h||(t+="!(v&&i=='prototype')"),!u.h&&u.r&&(t+="&&"),u.r&&(t+="g.call(j,i)"),t+="){";t+="A=j[i];"+u.m.i+";";if(!
u.h||u.r)t+="}"}t+="}";if(u.h){t+="var f=j.constructor;";for(n=0;7>n;n++)t+="i='"+u.p[n]+"';if(","constructor"==u.p[n]&&(t+="!(f&&f.prototype===j)&&"),t+="g.call(j,i)){A=j[i];"+u.m.i+"}"}if(u.c||u.n)t+="}"}return t+=u.e+";return u",Function("D,E,F,I,e,K,g,h,N,P,R,T,U,k,X,Y,m,r,w,x,z","var G=function("+e+"){"+t+"};return G")(qt,q,_,f,at,un,ft,D,k,b,tn,w,E,p,xt,Wt,gt,ct,ht,Nt,pt)}function f(e,n){var r=e.b,i=n.b,e=e.a,n=n.a;return e===t?1:n===t?-1:e<n?-1:e>n?1:r<i?-1:1}function l(e,t){return ut[t]}function c
(e){return"\\"+Xt[e]}function h(e){return Ut[e]}function p(e,t){return function(n,r,i){return e.call(t,n,r,i)}}function d(){}function v(e,t){if(e&&J.test(t))return"<e%-"+t+"%>";var n=ut.length;return ut[n]="'+__e("+t+")+'",ot+n}function m(e,t,n,i){return i?(e=ut.length,ut[e]="';"+i+";__p+='",ot+e):t?v(r,t):g(r,n)}function g(e,t){if(e&&J.test(t))return"<e%="+t+"%>";var n=ut.length;return ut[n]="'+((__t=("+t+"))==null?'':__t)+'",ot+n}function y(e){return zt[e]}function b(e){return pt.call(e)==yt}function w
(e){return"function"==typeof e}function E(e,t){return e?e==U||e.__proto__==U&&(t||!b(e)):i}function S(e,t,s,o,u){if(e==r)return e;s&&(t=i),u||(u={d:r}),u.d==r&&(u.d=!(!R.clone&&!z.clone&&!W.clone));if(((s=Wt[typeof e])||u.d)&&e.clone&&w(e.clone))return u.d=r,e.clone(t);if(s){var a=pt.call(e);if(!Rt[a]||_t&&b(e))return e;var f=a==bt,s=f||(a==xt?E(e,n):s)}if(!s||!t)return s?f?ht.call(e):on({},e):e;s=e.constructor;switch(a){case wt:return new s(e==n);case Et:return new s(+e);case St:case Nt:return new 
s(e);case Tt:return s(e.source,Z.exec(e))}o||(o=[]);for(a=o.length;a--;)if(o[a].c==e)return o[a].d;var a=e.length,l=f?s(a):{};o.push({d:l,c:e});if(f)for(f=-1;++f<a;)l[f]=S(e[f],t,r,o,u);else an(e,function(e,n){l[n]=S(e,t,r,o,u)});return l}function x(e,t,s,o){if(e==r||t==r)return e===t;o||(o={value:r}),o.value==r&&(o.value=!(!R.isEqual&&!z.isEqual&&!W.isEqual));if(Wt[typeof e]||Wt[typeof t]||o.value){e._chain&&(e=e._wrapped),t._chain&&(t=t._wrapped);if(e.isEqual&&w(e.isEqual))return o.value=r,e.isEqual
(t);if(t.isEqual&&w(t.isEqual))return o.value=r,t.isEqual(e)}if(e===t)return 0!==e||1/e==1/t;var u=pt.call(e);if(u!=pt.call(t))return i;switch(u){case wt:case Et:return+e==+t;case St:return e!=+e?t!=+t:0==e?1/e==1/t:e==+t;case Tt:case Nt:return e==t+""}var a=qt[u];if(_t&&!a&&(a=b(e))&&!b(t)||!a&&(u!=xt||Ht&&("function"!=typeof e.toString&&"string"==typeof (e+"")||"function"!=typeof t.toString&&"string"==typeof (t+""))))return i;s||(s=[]);for(u=s.length;u--;)if(s[u]==e)return n;var u=-1,f=n,l=0;s.
push(e);if(a){l=e.length;if(f=l==t.length)for(;l--&&(f=x(e[l],t[l],s,o)););return f}a=e.constructor,f=t.constructor;if(a!=f&&(!w(a)||!(a instanceof a&&w(f)&&f instanceof f)))return i;for(var c in e)if(ft.call(e,c)&&(l++,!ft.call(t,c)||!x(e[c],t[c],s,o)))return i;for(c in t)if(ft.call(t,c)&&!(l--))return i;if(Lt)for(;7>++u;)if(c=st[u],ft.call(e,c)&&(!ft.call(t,c)||!x(e[c],t[c],s,o)))return i;return n}function T(e,t,n,r){if(!e)return n;var i=e.length,s=3>arguments.length;r&&(t=p(t,r));if(-1<i&&i===
i>>>0){var o=Pt&&pt.call(e)==Nt?e.split(""):e;for(i&&s&&(n=o[--i]);i--;)n=t(n,o[i],i,e);return n}o=cn(e);for((i=o.length)&&s&&(n=e[o[--i]]);i--;)s=o[i],n=t(n,e[s],s,e);return n}function N(e,t,n){if(e)return t==r||n?e[0]:ht.call(e,0,t)}function C(e,t){var n=[];if(!e)return n;for(var r,i=-1,s=e.length;++i<s;)r=e[i],tn(r)?lt.apply(n,t?r:C(r)):n.push(r);return n}function k(e,t,n){if(!e)return-1;var r=-1,i=e.length;if(n){if("number"!=typeof n)return r=O(e,t),e[r]===t?r:-1;r=(0>n?Math.max(0,i+n):n)-1}for(
;++r<i;)if(e[r]===t)return r;return-1}function L(e,t,n){var r=-Infinity,i=r;if(!e)return i;var s=-1,o=e.length;if(!t){for(;++s<o;)e[s]>i&&(i=e[s]);return i}for(n&&(t=p(t,n));++s<o;)n=t(e[s],s,e),n>r&&(r=n,i=e[s]);return i}function A(e,t,n){return e?ht.call(e,t==r||n?1:t):[]}function O(e,t,n,r){if(!e)return 0;var i=0,s=e.length;if(n){r&&(n=_(n,r));for(t=n(t);i<s;)r=i+s>>>1,n(e[r])<t?i=r+1:s=r}else for(;i<s;)r=i+s>>>1,e[r]<t?i=r+1:s=r;return i}function M(e,t,n,r){var s=[];if(!e)return s;var o=-1,u=
e.length,a=[];"function"==typeof t&&(r=n,n=t,t=i);for(n?r&&(n=p(n,r)):n=D;++o<u;)if(r=n(e[o],o,e),t?!o||a[a.length-1]!==r:0>k(a,r))a.push(r),s.push(e[o]);return s}function _(e,t){function n(){var o=arguments,u=t;return i||(e=t[r]),s.length&&(o=o.length?s.concat(ht.call(o)):s),this instanceof n?(d.prototype=e.prototype,u=new d,(o=e.apply(u,o))&&Wt[typeof o]?o:u):e.apply(u,o)}var r,i=w(e);if(i){if(jt||dt&&2<arguments.length)return dt.call.apply(dt,arguments)}else r=t,t=e;var s=ht.call(arguments,2);
return n}function D(e){return e}function P(e){wn(fn(e),function(t){var r=s[t]=e[t];o.prototype[t]=function(){var e=[this._wrapped];return arguments.length&&lt.apply(e,arguments),e=r.apply(s,e),this._chain&&(e=new o(e),e._chain=n),e}})}var n=!0,r=null,i=!1,H,B,j,F,I="object"==typeof exports&&exports&&("object"==typeof global&&global&&global==global.global&&(e=global),exports),q=Array.prototype,R=Boolean.prototype,U=Object.prototype,z=Number.prototype,W=String.prototype,X=0,V=30,$=e._,J=/[-+=!~*%&^<>|{(\/]|\[\D|\b(?:delete|in|instanceof|new|typeof|void)\b/
,K=/&(?:amp|lt|gt|quot|#x27);/g,Q=/\b__p\+='';/g,G=/\b(__p\+=)''\+/g,Y=/(__e\(.*?\)|\b__t\))\+'';/g,Z=/\w*$/,et=/(?:__e|__t=)\(\s*(?![\d\s"']|this\.)/g,tt=RegExp("^"+(U.valueOf+"").replace(/[.*+?^=!:${}()|[\]\/\\]/g,"\\$&").replace(/valueOf|for [^\]]+/g,".+?")+"$"),nt=/__token__(\d+)/g,rt=/[&<>"']/g,it=/['\n\r\t\u2028\u2029\\]/g,st="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "),ot="__token__",ut=[],at=q.concat,ft=U.hasOwnProperty,lt=q.push
,ct=U.propertyIsEnumerable,ht=q.slice,pt=U.toString,dt=tt.test(dt=ht.bind)&&dt,vt=tt.test(vt=Array.isArray)&&vt,mt=e.isFinite,gt=tt.test(gt=Object.keys)&&gt,yt="[object Arguments]",bt="[object Array]",wt="[object Boolean]",Et="[object Date]",St="[object Number]",xt="[object Object]",Tt="[object RegExp]",Nt="[object String]",Ct=e.clearTimeout,kt=e.setTimeout,Lt,At,Ot,Mt=n;(function(){function e(){this.x=1}var t={0:1,length:1},n=[];e.prototype={valueOf:1,y:1};for(var r in new e)n.push(r);for(r in arguments
)Mt=!r;Lt=4>(n+"").length,Ot="x"!=n[0],At=(n.splice.call(t,0,1),t[0])})(1);var _t=!b(arguments),Dt="x"!=ht.call("x")[0],Pt="xx"!="x"[0]+Object("x")[0];try{var Ht=("[object Object]",pt.call(e.document||0)==xt)}catch(Bt){}var jt=dt&&/\n|Opera/.test(dt+pt.call(e.opera)),Ft=gt&&/^.+$|true/.test(gt+!!e.attachEvent),It=!jt,qt={"[object Arguments]":n,"[object Array]":n,"[object Boolean]":i,"[object Date]":i,"[object Function]":i,"[object Number]":i,"[object Object]":i,"[object RegExp]":i,"[object String]"
:n},Rt={"[object Arguments]":i,"[object Array]":n,"[object Boolean]":n,"[object Date]":n,"[object Function]":i,"[object Number]":n,"[object Object]":n,"[object RegExp]":n,"[object String]":n},Ut={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;"},zt={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#x27;":"'"},Wt={"boolean":i,"function":n,object:n,number:i,string:i,"undefined":i,unknown:n},Xt={"\\":"\\","'":"'","\n":"n","\r":"r","	":"t","\u2028":"u2028","\u2029":"u2029"};s.templateSettings=
{escape:/<%-([\s\S]+?)%>/g,evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,variable:""};var Vt={a:"d,c,y",j:"d",q:"if(!c)c=h;else if(y)c=k(c,y)",i:"if(c(A,i,d)===false)return u"},$t={j:"{}",q:"var q;if(typeof c!='function'){var ii=c;c=function(A){return A[ii]}}else if(y)c=k(c,y)",i:"q=c(A,i,d);(g.call(u,q)?u[q]++:u[q]=1)"},Jt={r:i,a:"n,c,y",j:"{}",q:"var S=typeof c=='function';if(!S){var t=e.apply(E,arguments)}else if(y)c=k(c,y)",i:"if(S?!c(A,i,n):N(t,i)<0)u[i]=A"},Kt={j:"true",i:"if(!c(A,i,d))return!u"
},Qt={r:i,s:i,a:"n",j:"n",q:"for(var a=1,b=arguments.length;a<b;a++){if(j=arguments[a]){",i:"u[i]=A",e:"}}"},Gt={j:"[]",i:"c(A,i,d)&&u.push(A)"},Yt={q:"if(y)c=k(c,y)"},Zt={i:{l:Vt.i}},en={j:"",f:"if(!d)return[]",d:{b:"u=Array(l)",l:"u="+(Ft?"Array(l)":"[]")},i:{b:"u[i]=c(A,i,d)",l:"u"+(Ft?"[o]=":".push")+"(c(A,i,d))"}};_t&&(b=function(e){return!!e&&!!ft.call(e,"callee")});var tn=vt||function(e){return pt.call(e)==bt};w(/x/)&&(w=function(e){return"[object Function]"==pt.call(e)}),E(Wt)||(E=function(
e,t){var n=i;if(!e||"object"!=typeof e||!t&&b(e))return n;var r=e.constructor;return(!Ht||"function"==typeof e.toString||"string"!=typeof (e+""))&&(!w(r)||r instanceof r)?Ot?(un(e,function(t,r){return n=!ft.call(e,r),i}),n===i):(un(e,function(e,t){n=t}),n===i||ft.call(e,n)):n});var nn=a({a:"n",j:"[]",i:"u.push(i)"}),rn=a(Qt,{i:"if(u[i]==null)"+Qt.i}),sn=a(Jt),on=a(Qt),un=a(Vt,Yt,Zt,{r:i}),an=a(Vt,Yt,Zt),fn=a({r:i,a:"n",j:"[]",i:"if(T(A))u.push(i)",e:"u.sort()"}),ln=a({a:"A",j:"true",q:"var H=z.call(A),l=A.length;if(D[H]"+
(_t?"||P(A)":"")+"||(H==X&&l>-1&&l===l>>>0&&T(A.splice)))return!l",i:{l:"return false"}}),cn=gt?function(e){var t=typeof e;return"function"==t&&ct.call(e,"prototype")?nn(e):e&&Wt[t]?gt(e):[]}:nn,hn=a(Qt,{a:"n,ee,O,ff",q:"var J,L,Q,gg,dd=O==U;if(!dd)ff=[];for(var a=1,b=dd?2:arguments.length;a<b;a++){if(j=arguments[a]){",i:"if(A&&((Q=R(A))||U(A))){L=false;gg=ff.length;while(gg--)if(L=ff[gg].c==A)break;if(L){u[i]=ff[gg].d}else{J=(J=u[i])&&Q?(R(J)?J:[]):(U(J)?J:{});ff.push({d:J,c:A});u[i]=G(J,A,U,ff)}}else if(A!=null)u[i]=A"
}),pn=a(Jt,{q:"if(typeof c!='function'){var q,t=e.apply(E,arguments),l=t.length;for(i=1;i<l;i++){q=t[i];if(q in n)u[q]=n[q]}}else{if(y)c=k(c,y)",i:"if(c(A,i,n))u[i]=A",e:"}"}),dn=a({a:"n",j:"[]",i:"u.push(A)"}),vn=a({a:"d,hh",j:"false",o:i,d:{b:"if(z.call(d)==x)return d.indexOf(hh)>-1"},i:"if(A===hh)return true"}),mn=a(Vt,$t),gn=a(Vt,Kt),yn=a(Vt,Gt),bn=a(Vt,Yt,{j:"",i:"if(c(A,i,d))return A"}),wn=a(Vt,Yt),En=a(Vt,$t,{i:"q=c(A,i,d);(g.call(u,q)?u[q]:u[q]=[]).push(A)"}),Sn=a(en,{a:"d,V",q:"var C=w.call(arguments,2),S=typeof V=='function'"
,i:{b:"u[i]=(S?V:A[V]).apply(A,C)",l:"u"+(Ft?"[o]=":".push")+"((S?V:A[V]).apply(A,C))"}}),xn=a(Vt,en),Tn=a(en,{a:"d,bb",i:{b:"u[i]=A[bb]",l:"u"+(Ft?"[o]=":".push")+"(A[bb])"}}),Nn=a({a:"d,c,B,y",j:"B",q:"var W=arguments.length<3;if(y)c=k(c,y)",d:{b:"if(W)u=j[++i]"},i:{b:"u=c(u,A,i,d)",l:"u=W?(W=false,A):c(u,A,i,d)"}}),Cn=a(Vt,Gt,{i:"!"+Gt.i}),kn=a(Vt,Kt,{j:"false",i:Kt.i.replace("!","")}),Ln=a(Vt,$t,en,{i:{b:"u[i]={a:c(A,i,d),b:i,d:A}",l:"u"+(Ft?"[o]=":".push")+"({a:c(A,i,d),b:i,d:A})"},e:"u.sort(I);l=u.length;while(l--)u[l]=u[l].d"
}),An=a(Gt,{a:"d,aa",q:"var t=[];K(aa,function(A,q){t.push(q)});var cc=t.length",i:"for(var q,Z=true,s=0;s<cc;s++){q=t[s];if(!(Z=A[q]===aa[q]))break}Z&&u.push(A)"}),On=a({r:i,s:i,a:"n",j:"n",q:"var M=arguments,l=M.length;if(l>1){for(var i=1;i<l;i++)u[M[i]]=F(u[M[i]],u);return u}",i:"if(T(u[i]))u[i]=F(u[i],u)"});s.VERSION="0.6.1",s.after=function(e,t){return 1>e?t():function(){if(1>--e)return t.apply(this,arguments)}},s.bind=_,s.bindAll=On,s.chain=function(e){return e=new o(e),e._chain=n,e},s.clone=
S,s.compact=function(e){var t=[];if(!e)return t;for(var n=-1,r=e.length;++n<r;)e[n]&&t.push(e[n]);return t},s.compose=function(){var e=arguments;return function(){for(var t=arguments,n=e.length;n--;)t=[e[n].apply(this,t)];return t[0]}},s.contains=vn,s.countBy=mn,s.debounce=function(e,t,n){function i(){a=r,n||e.apply(u,s)}var s,o,u,a;return function(){var r=n&&!a;return s=arguments,u=this,Ct(a),a=kt(i,t),r&&(o=e.apply(u,s)),o}},s.defaults=rn,s.defer=function(e){var n=ht.call(arguments,1);return kt
(function(){return e.apply(t,n)},1)},s.delay=function(e,n){var r=ht.call(arguments,2);return kt(function(){return e.apply(t,r)},n)},s.difference=function(e){var t=[];if(!e)return t;for(var n=-1,r=e.length,i=at.apply(t,arguments),i=u(i,r);++n<r;)i(e[n])||t.push(e[n]);return t},s.drop=sn,s.escape=function(e){return e==r?"":(e+"").replace(rt,h)},s.every=gn,s.extend=on,s.filter=yn,s.find=bn,s.first=N,s.flatten=C,s.forEach=wn,s.forIn=un,s.forOwn=an,s.functions=fn,s.groupBy=En,s.has=function(e,t){return e?
ft.call(e,t):i},s.identity=D,s.indexOf=k,s.initial=function(e,t,n){return e?ht.call(e,0,-(t==r||n?1:t)):[]},s.intersection=function(e){var t=[];if(!e)return t;var n,r=arguments.length,i=[],s=-1,o=e.length;e:for(;++s<o;)if(n=e[s],0>k(t,n)){for(var a=1;a<r;a++)if(!(i[a]||(i[a]=u(arguments[a])))(n))continue e;t.push(n)}return t},s.invoke=Sn,s.isArguments=b,s.isArray=tn,s.isBoolean=function(e){return e===n||e===i||pt.call(e)==wt},s.isElement=function(e){return e?1===e.nodeType:i},s.isEmpty=ln,s.isEqual=
x,s.isFinite=function(e){return mt(e)&&pt.call(e)==St},s.isFunction=w,s.isNaN=function(e){return pt.call(e)==St&&e!=+e},s.isNull=function(e){return e===r},s.isObject=function(e){return e?Wt[typeof e]:i},s.isUndefined=function(e){return e===t},s.keys=cn,s.last=function(e,t,n){if(e){var i=e.length;return t==r||n?e[i-1]:ht.call(e,-t||i)}},s.lastIndexOf=function(e,t,n){if(!e)return-1;var r=e.length;for(n&&"number"==typeof n&&(r=(0>n?Math.max(0,r+n):Math.min(n,r-1))+1);r--;)if(e[r]===t)return r;return-1
},s.map=xn,s.max=L,s.memoize=function(e,t){var n={};return function(){var r=t?t.apply(this,arguments):arguments[0];return ft.call(n,r)?n[r]:n[r]=e.apply(this,arguments)}},s.merge=hn,s.min=function(e,t,n){var r=Infinity,i=r;if(!e)return i;var s=-1,o=e.length;if(!t){for(;++s<o;)e[s]<i&&(i=e[s]);return i}for(n&&(t=p(t,n));++s<o;)n=t(e[s],s,e),n<r&&(r=n,i=e[s]);return i},s.mixin=P,s.noConflict=function(){return e._=$,this},s.once=function(e){var t,s=i;return function(){return s?t:(s=n,t=e.apply(this,
arguments),e=r,t)}},s.partial=function(e){var t=ht.call(arguments,1),n=t.length;return function(){var r;return r=arguments,r.length&&(t.length=n,lt.apply(t,r)),r=1==t.length?e.call(this,t[0]):e.apply(this,t),t.length=n,r}},s.pick=pn,s.pluck=Tn,s.range=function(e,t,n){e=+e||0,n=+n||1,t==r&&(t=e,e=0);for(var i=-1,t=Math.max(0,Math.ceil((t-e)/n)),s=Array(t);++i<t;)s[i]=e,e+=n;return s},s.reduce=Nn,s.reduceRight=T,s.reject=Cn,s.rest=A,s.result=function(e,t){if(!e)return r;var n=e[t];return w(n)?e[t](
):n},s.shuffle=function(e){if(!e)return[];for(var t,n=-1,r=e.length,i=Array(r);++n<r;)t=Math.floor(Math.random()*(n+1)),i[n]=i[t],i[t]=e[n];return i},s.size=function(e){if(!e)return 0;var t=pt.call(e),n=e.length;return qt[t]||_t&&b(e)||t==xt&&-1<n&&n===n>>>0&&w(e.splice)?n:cn(e).length},s.some=kn,s.sortBy=Ln,s.sortedIndex=O,s.tap=function(e,t){return t(e),e},s.template=function(e,t,n){n||(n={});var e=e+"",o,u;o=n.escape;var a=n.evaluate,f=n.interpolate,h=s.templateSettings,p=n=n.variable||h.variable
;o==r&&(o=h.escape),a==r&&(a=h.evaluate||i),f==r&&(f=h.interpolate),o&&(e=e.replace(o,v)),f&&(e=e.replace(f,g)),a!=H&&(H=a,F=RegExp("<e%-([\\s\\S]+?)%>|<e%=([\\s\\S]+?)%>"+(a?"|"+a.source:""),"g")),o=ut.length,e=e.replace(F,m),o=o!=ut.length,e="__p += '"+e.replace(it,c).replace(nt,l)+"';",ut.length=0,p||(n=B||"obj",o?e="with("+n+"){"+e+"}":(n!=B&&(B=n,j=RegExp("(\\(\\s*)"+n+"\\."+n+"\\b","g")),e=e.replace(et,"$&"+n+".").replace(j,"$1__d"))),e=(o?e.replace(Q,""):e).replace(G,"$1").replace(Y,"$1;")
,e="function("+n+"){"+(p?"":n+"||("+n+"={});")+"var __t,__p='',__e=_.escape"+(o?",__j=Array.prototype.join;function print(){__p+=__j.call(arguments,'')}":(p?"":",__d="+n+"."+n+"||"+n)+";")+e+"return __p}";try{u=Function("_","return "+e)(s)}catch(d){u=function(){throw d}}return t?u(t):(u.source=e,u)},s.throttle=function(e,t){function n(){a=new Date,u=r,e.apply(o,i)}var i,s,o,u,a=0;return function(){var r=new Date,f=t-(r-a);return i=arguments,o=this,0>=f?(a=r,s=e.apply(o,i)):u||(u=kt(n,f)),s}},s.times=
function(e,t,n){var r=-1;if(n)for(;++r<e;)t.call(n,r);else for(;++r<e;)t(r)},s.toArray=function(e){if(!e)return[];if(e.toArray&&w(e.toArray))return e.toArray();var t=e.length;return-1<t&&t===t>>>0?(Dt?pt.call(e)==Nt:"string"==typeof e)?e.split(""):ht.call(e):dn(e)},s.unescape=function(e){return e==r?"":(e+"").replace(K,y)},s.union=function(){for(var e=-1,t=[],n=at.apply(t,arguments),r=n.length;++e<r;)0>k(t,n[e])&&t.push(n[e]);return t},s.uniq=M,s.uniqueId=function(e){var t=X++;return e?e+t:t},s.values=
dn,s.where=An,s.without=function(e){var t=[];if(!e)return t;for(var n=-1,r=e.length,i=u(arguments,1,20);++n<r;)i(e[n])||t.push(e[n]);return t},s.wrap=function(e,t){return function(){var n=[e];return arguments.length&&lt.apply(n,arguments),t.apply(this,n)}},s.zip=function(e){if(!e)return[];for(var t=-1,n=L(Tn(arguments,"length")),r=Array(n);++t<n;)r[t]=Tn(arguments,t);return r},s.zipObject=function(e,t){if(!e)return{};var n=-1,r=e.length,i={};for(t||(t=[]);++n<r;)i[e[n]]=t[n];return i},s.all=gn,s.
any=kn,s.collect=xn,s.detect=bn,s.each=wn,s.foldl=Nn,s.foldr=T,s.head=N,s.include=vn,s.inject=Nn,s.methods=fn,s.omit=sn,s.select=yn,s.tail=A,s.take=N,s.unique=M,wn({Date:Et,Number:St,RegExp:Tt,String:Nt},function(e,t){s["is"+t]=function(t){return pt.call(t)==e}}),o.prototype=s.prototype,P(s),o.prototype.chain=function(){return this._chain=n,this},o.prototype.value=function(){return this._wrapped},wn("pop push reverse shift sort splice unshift".split(" "),function(e){var t=q[e];o.prototype[e]=function(
){var e=this._wrapped;return t.apply(e,arguments),At&&e.length===0&&delete e[0],this._chain&&(e=new o(e),e._chain=n),e}}),wn(["concat","join","slice"],function(e){var t=q[e];o.prototype[e]=function(){var e=t.apply(this._wrapped,arguments);return this._chain&&(e=new o(e),e._chain=n),e}}),typeof define=="function"&&typeof define.amd=="object"&&define.amd?(e._=s,define(function(){return s})):I?"object"==typeof module&&module&&module.t==I?(module.t=s)._=s:I._=s:e._=s})(this);
// Backbone.js 0.9.10

// (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.
// Backbone may be freely distributed under the MIT license.
// For all details and documentation:
// http://backbonejs.org
(function(){var n=this,B=n.Backbone,h=[],C=h.push,u=h.slice,D=h.splice,g;g="undefined"!==typeof exports?exports:n.Backbone={};g.VERSION="0.9.10";var f=n._;!f&&"undefined"!==typeof require&&(f=require("underscore"));g.$=n.jQuery||n.Zepto||n.ender;g.noConflict=function(){n.Backbone=B;return this};g.emulateHTTP=!1;g.emulateJSON=!1;var v=/\s+/,q=function(a,b,c,d){if(!c)return!0;if("object"===typeof c)for(var e in c)a[b].apply(a,[e,c[e]].concat(d));else if(v.test(c)){c=c.split(v);e=0;for(var f=c.length;e<
f;e++)a[b].apply(a,[c[e]].concat(d))}else return!0},w=function(a,b){var c,d=-1,e=a.length;switch(b.length){case 0:for(;++d<e;)(c=a[d]).callback.call(c.ctx);break;case 1:for(;++d<e;)(c=a[d]).callback.call(c.ctx,b[0]);break;case 2:for(;++d<e;)(c=a[d]).callback.call(c.ctx,b[0],b[1]);break;case 3:for(;++d<e;)(c=a[d]).callback.call(c.ctx,b[0],b[1],b[2]);break;default:for(;++d<e;)(c=a[d]).callback.apply(c.ctx,b)}},h=g.Events={on:function(a,b,c){if(!q(this,"on",a,[b,c])||!b)return this;this._events||(this._events=
{});(this._events[a]||(this._events[a]=[])).push({callback:b,context:c,ctx:c||this});return this},once:function(a,b,c){if(!q(this,"once",a,[b,c])||!b)return this;var d=this,e=f.once(function(){d.off(a,e);b.apply(this,arguments)});e._callback=b;this.on(a,e,c);return this},off:function(a,b,c){var d,e,t,g,j,l,k,h;if(!this._events||!q(this,"off",a,[b,c]))return this;if(!a&&!b&&!c)return this._events={},this;g=a?[a]:f.keys(this._events);j=0;for(l=g.length;j<l;j++)if(a=g[j],d=this._events[a]){t=[];if(b||
c){k=0;for(h=d.length;k<h;k++)e=d[k],(b&&b!==e.callback&&b!==e.callback._callback||c&&c!==e.context)&&t.push(e)}this._events[a]=t}return this},trigger:function(a){if(!this._events)return this;var b=u.call(arguments,1);if(!q(this,"trigger",a,b))return this;var c=this._events[a],d=this._events.all;c&&w(c,b);d&&w(d,arguments);return this},listenTo:function(a,b,c){var d=this._listeners||(this._listeners={}),e=a._listenerId||(a._listenerId=f.uniqueId("l"));d[e]=a;a.on(b,"object"===typeof b?this:c,this);
return this},stopListening:function(a,b,c){var d=this._listeners;if(d){if(a)a.off(b,"object"===typeof b?this:c,this),!b&&!c&&delete d[a._listenerId];else{"object"===typeof b&&(c=this);for(var e in d)d[e].off(b,c,this);this._listeners={}}return this}}};h.bind=h.on;h.unbind=h.off;f.extend(g,h);var r=g.Model=function(a,b){var c,d=a||{};this.cid=f.uniqueId("c");this.attributes={};b&&b.collection&&(this.collection=b.collection);b&&b.parse&&(d=this.parse(d,b)||{});if(c=f.result(this,"defaults"))d=f.defaults({},
d,c);this.set(d,b);this.changed={};this.initialize.apply(this,arguments)};f.extend(r.prototype,h,{changed:null,idAttribute:"id",initialize:function(){},toJSON:function(){return f.clone(this.attributes)},sync:function(){return g.sync.apply(this,arguments)},get:function(a){return this.attributes[a]},escape:function(a){return f.escape(this.get(a))},has:function(a){return null!=this.get(a)},set:function(a,b,c){var d,e,g,p,j,l,k;if(null==a)return this;"object"===typeof a?(e=a,c=b):(e={})[a]=b;c||(c={});
if(!this._validate(e,c))return!1;g=c.unset;p=c.silent;a=[];j=this._changing;this._changing=!0;j||(this._previousAttributes=f.clone(this.attributes),this.changed={});k=this.attributes;l=this._previousAttributes;this.idAttribute in e&&(this.id=e[this.idAttribute]);for(d in e)b=e[d],f.isEqual(k[d],b)||a.push(d),f.isEqual(l[d],b)?delete this.changed[d]:this.changed[d]=b,g?delete k[d]:k[d]=b;if(!p){a.length&&(this._pending=!0);b=0;for(d=a.length;b<d;b++)this.trigger("change:"+a[b],this,k[a[b]],c)}if(j)return this;
if(!p)for(;this._pending;)this._pending=!1,this.trigger("change",this,c);this._changing=this._pending=!1;return this},unset:function(a,b){return this.set(a,void 0,f.extend({},b,{unset:!0}))},clear:function(a){var b={},c;for(c in this.attributes)b[c]=void 0;return this.set(b,f.extend({},a,{unset:!0}))},hasChanged:function(a){return null==a?!f.isEmpty(this.changed):f.has(this.changed,a)},changedAttributes:function(a){if(!a)return this.hasChanged()?f.clone(this.changed):!1;var b,c=!1,d=this._changing?
this._previousAttributes:this.attributes,e;for(e in a)if(!f.isEqual(d[e],b=a[e]))(c||(c={}))[e]=b;return c},previous:function(a){return null==a||!this._previousAttributes?null:this._previousAttributes[a]},previousAttributes:function(){return f.clone(this._previousAttributes)},fetch:function(a){a=a?f.clone(a):{};void 0===a.parse&&(a.parse=!0);var b=a.success;a.success=function(a,d,e){if(!a.set(a.parse(d,e),e))return!1;b&&b(a,d,e)};return this.sync("read",this,a)},save:function(a,b,c){var d,e,g=this.attributes;
null==a||"object"===typeof a?(d=a,c=b):(d={})[a]=b;if(d&&(!c||!c.wait)&&!this.set(d,c))return!1;c=f.extend({validate:!0},c);if(!this._validate(d,c))return!1;d&&c.wait&&(this.attributes=f.extend({},g,d));void 0===c.parse&&(c.parse=!0);e=c.success;c.success=function(a,b,c){a.attributes=g;var k=a.parse(b,c);c.wait&&(k=f.extend(d||{},k));if(f.isObject(k)&&!a.set(k,c))return!1;e&&e(a,b,c)};a=this.isNew()?"create":c.patch?"patch":"update";"patch"===a&&(c.attrs=d);a=this.sync(a,this,c);d&&c.wait&&(this.attributes=
g);return a},destroy:function(a){a=a?f.clone(a):{};var b=this,c=a.success,d=function(){b.trigger("destroy",b,b.collection,a)};a.success=function(a,b,e){(e.wait||a.isNew())&&d();c&&c(a,b,e)};if(this.isNew())return a.success(this,null,a),!1;var e=this.sync("delete",this,a);a.wait||d();return e},url:function(){var a=f.result(this,"urlRoot")||f.result(this.collection,"url")||x();return this.isNew()?a:a+("/"===a.charAt(a.length-1)?"":"/")+encodeURIComponent(this.id)},parse:function(a){return a},clone:function(){return new this.constructor(this.attributes)},
isNew:function(){return null==this.id},isValid:function(a){return!this.validate||!this.validate(this.attributes,a)},_validate:function(a,b){if(!b.validate||!this.validate)return!0;a=f.extend({},this.attributes,a);var c=this.validationError=this.validate(a,b)||null;if(!c)return!0;this.trigger("invalid",this,c,b||{});return!1}});var s=g.Collection=function(a,b){b||(b={});b.model&&(this.model=b.model);void 0!==b.comparator&&(this.comparator=b.comparator);this.models=[];this._reset();this.initialize.apply(this,
arguments);a&&this.reset(a,f.extend({silent:!0},b))};f.extend(s.prototype,h,{model:r,initialize:function(){},toJSON:function(a){return this.map(function(b){return b.toJSON(a)})},sync:function(){return g.sync.apply(this,arguments)},add:function(a,b){a=f.isArray(a)?a.slice():[a];b||(b={});var c,d,e,g,p,j,l,k,h,m;l=[];k=b.at;h=this.comparator&&null==k&&!1!=b.sort;m=f.isString(this.comparator)?this.comparator:null;c=0;for(d=a.length;c<d;c++)(e=this._prepareModel(g=a[c],b))?(p=this.get(e))?b.merge&&(p.set(g===
e?e.attributes:g,b),h&&(!j&&p.hasChanged(m))&&(j=!0)):(l.push(e),e.on("all",this._onModelEvent,this),this._byId[e.cid]=e,null!=e.id&&(this._byId[e.id]=e)):this.trigger("invalid",this,g,b);l.length&&(h&&(j=!0),this.length+=l.length,null!=k?D.apply(this.models,[k,0].concat(l)):C.apply(this.models,l));j&&this.sort({silent:!0});if(b.silent)return this;c=0;for(d=l.length;c<d;c++)(e=l[c]).trigger("add",e,this,b);j&&this.trigger("sort",this,b);return this},remove:function(a,b){a=f.isArray(a)?a.slice():[a];
b||(b={});var c,d,e,g;c=0;for(d=a.length;c<d;c++)if(g=this.get(a[c]))delete this._byId[g.id],delete this._byId[g.cid],e=this.indexOf(g),this.models.splice(e,1),this.length--,b.silent||(b.index=e,g.trigger("remove",g,this,b)),this._removeReference(g);return this},push:function(a,b){a=this._prepareModel(a,b);this.add(a,f.extend({at:this.length},b));return a},pop:function(a){var b=this.at(this.length-1);this.remove(b,a);return b},unshift:function(a,b){a=this._prepareModel(a,b);this.add(a,f.extend({at:0},
b));return a},shift:function(a){var b=this.at(0);this.remove(b,a);return b},slice:function(a,b){return this.models.slice(a,b)},get:function(a){if(null!=a)return this._idAttr||(this._idAttr=this.model.prototype.idAttribute),this._byId[a.id||a.cid||a[this._idAttr]||a]},at:function(a){return this.models[a]},where:function(a){return f.isEmpty(a)?[]:this.filter(function(b){for(var c in a)if(a[c]!==b.get(c))return!1;return!0})},sort:function(a){if(!this.comparator)throw Error("Cannot sort a set without a comparator");
a||(a={});f.isString(this.comparator)||1===this.comparator.length?this.models=this.sortBy(this.comparator,this):this.models.sort(f.bind(this.comparator,this));a.silent||this.trigger("sort",this,a);return this},pluck:function(a){return f.invoke(this.models,"get",a)},update:function(a,b){b=f.extend({add:!0,merge:!0,remove:!0},b);b.parse&&(a=this.parse(a,b));var c,d,e,g,h=[],j=[],l={};f.isArray(a)||(a=a?[a]:[]);if(b.add&&!b.remove)return this.add(a,b);d=0;for(e=a.length;d<e;d++)c=a[d],g=this.get(c),
b.remove&&g&&(l[g.cid]=!0),(b.add&&!g||b.merge&&g)&&h.push(c);if(b.remove){d=0;for(e=this.models.length;d<e;d++)c=this.models[d],l[c.cid]||j.push(c)}j.length&&this.remove(j,b);h.length&&this.add(h,b);return this},reset:function(a,b){b||(b={});b.parse&&(a=this.parse(a,b));for(var c=0,d=this.models.length;c<d;c++)this._removeReference(this.models[c]);b.previousModels=this.models.slice();this._reset();a&&this.add(a,f.extend({silent:!0},b));b.silent||this.trigger("reset",this,b);return this},fetch:function(a){a=
a?f.clone(a):{};void 0===a.parse&&(a.parse=!0);var b=a.success;a.success=function(a,d,e){a[e.update?"update":"reset"](d,e);b&&b(a,d,e)};return this.sync("read",this,a)},create:function(a,b){b=b?f.clone(b):{};if(!(a=this._prepareModel(a,b)))return!1;b.wait||this.add(a,b);var c=this,d=b.success;b.success=function(a,b,f){f.wait&&c.add(a,f);d&&d(a,b,f)};a.save(null,b);return a},parse:function(a){return a},clone:function(){return new this.constructor(this.models)},_reset:function(){this.length=0;this.models.length=
0;this._byId={}},_prepareModel:function(a,b){if(a instanceof r)return a.collection||(a.collection=this),a;b||(b={});b.collection=this;var c=new this.model(a,b);return!c._validate(a,b)?!1:c},_removeReference:function(a){this===a.collection&&delete a.collection;a.off("all",this._onModelEvent,this)},_onModelEvent:function(a,b,c,d){("add"===a||"remove"===a)&&c!==this||("destroy"===a&&this.remove(b,d),b&&a==="change:"+b.idAttribute&&(delete this._byId[b.previous(b.idAttribute)],null!=b.id&&(this._byId[b.id]=
b)),this.trigger.apply(this,arguments))},sortedIndex:function(a,b,c){b||(b=this.comparator);var d=f.isFunction(b)?b:function(a){return a.get(b)};return f.sortedIndex(this.models,a,d,c)}});f.each("forEach each map collect reduce foldl inject reduceRight foldr find detect filter select reject every all some any include contains invoke max min toArray size first head take initial rest tail drop last without indexOf shuffle lastIndexOf isEmpty chain".split(" "),function(a){s.prototype[a]=function(){var b=
u.call(arguments);b.unshift(this.models);return f[a].apply(f,b)}});f.each(["groupBy","countBy","sortBy"],function(a){s.prototype[a]=function(b,c){var d=f.isFunction(b)?b:function(a){return a.get(b)};return f[a](this.models,d,c)}});var y=g.Router=function(a){a||(a={});a.routes&&(this.routes=a.routes);this._bindRoutes();this.initialize.apply(this,arguments)},E=/\((.*?)\)/g,F=/(\(\?)?:\w+/g,G=/\*\w+/g,H=/[\-{}\[\]+?.,\\\^$|#\s]/g;f.extend(y.prototype,h,{initialize:function(){},route:function(a,b,c){f.isRegExp(a)||
(a=this._routeToRegExp(a));c||(c=this[b]);g.history.route(a,f.bind(function(d){d=this._extractParameters(a,d);c&&c.apply(this,d);this.trigger.apply(this,["route:"+b].concat(d));this.trigger("route",b,d);g.history.trigger("route",this,b,d)},this));return this},navigate:function(a,b){g.history.navigate(a,b);return this},_bindRoutes:function(){if(this.routes)for(var a,b=f.keys(this.routes);null!=(a=b.pop());)this.route(a,this.routes[a])},_routeToRegExp:function(a){a=a.replace(H,"\\$&").replace(E,"(?:$1)?").replace(F,
function(a,c){return c?a:"([^/]+)"}).replace(G,"(.*?)");return RegExp("^"+a+"$")},_extractParameters:function(a,b){return a.exec(b).slice(1)}});var m=g.History=function(){this.handlers=[];f.bindAll(this,"checkUrl");"undefined"!==typeof window&&(this.location=window.location,this.history=window.history)},z=/^[#\/]|\s+$/g,I=/^\/+|\/+$/g,J=/msie [\w.]+/,K=/\/$/;m.started=!1;f.extend(m.prototype,h,{interval:50,getHash:function(a){return(a=(a||this).location.href.match(/#(.*)$/))?a[1]:""},getFragment:function(a,
b){if(null==a)if(this._hasPushState||!this._wantsHashChange||b){a=this.location.pathname;var c=this.root.replace(K,"");a.indexOf(c)||(a=a.substr(c.length))}else a=this.getHash();return a.replace(z,"")},start:function(a){if(m.started)throw Error("Backbone.history has already been started");m.started=!0;this.options=f.extend({},{root:"/"},this.options,a);this.root=this.options.root;this._wantsHashChange=!1!==this.options.hashChange;this._wantsPushState=!!this.options.pushState;this._hasPushState=!(!this.options.pushState||
!this.history||!this.history.pushState);a=this.getFragment();var b=document.documentMode,b=J.exec(navigator.userAgent.toLowerCase())&&(!b||7>=b);this.root=("/"+this.root+"/").replace(I,"/");b&&this._wantsHashChange&&(this.iframe=g.$('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow,this.navigate(a));if(this._hasPushState)g.$(window).on("popstate",this.checkUrl);else if(this._wantsHashChange&&"onhashchange"in window&&!b)g.$(window).on("hashchange",this.checkUrl);
else this._wantsHashChange&&(this._checkUrlInterval=setInterval(this.checkUrl,this.interval));this.fragment=a;a=this.location;b=a.pathname.replace(/[^\/]$/,"$&/")===this.root;if(this._wantsHashChange&&this._wantsPushState&&!this._hasPushState&&!b)return this.fragment=this.getFragment(null,!0),this.location.replace(this.root+this.location.search+"#"+this.fragment),!0;this._wantsPushState&&(this._hasPushState&&b&&a.hash)&&(this.fragment=this.getHash().replace(z,""),this.history.replaceState({},document.title,
this.root+this.fragment+a.search));if(!this.options.silent)return this.loadUrl()},stop:function(){g.$(window).off("popstate",this.checkUrl).off("hashchange",this.checkUrl);clearInterval(this._checkUrlInterval);m.started=!1},route:function(a,b){this.handlers.unshift({route:a,callback:b})},checkUrl:function(){var a=this.getFragment();a===this.fragment&&this.iframe&&(a=this.getFragment(this.getHash(this.iframe)));if(a===this.fragment)return!1;this.iframe&&this.navigate(a);this.loadUrl()||this.loadUrl(this.getHash())},
loadUrl:function(a){var b=this.fragment=this.getFragment(a);return f.any(this.handlers,function(a){if(a.route.test(b))return a.callback(b),!0})},navigate:function(a,b){if(!m.started)return!1;if(!b||!0===b)b={trigger:b};a=this.getFragment(a||"");if(this.fragment!==a){this.fragment=a;var c=this.root+a;if(this._hasPushState)this.history[b.replace?"replaceState":"pushState"]({},document.title,c);else if(this._wantsHashChange)this._updateHash(this.location,a,b.replace),this.iframe&&a!==this.getFragment(this.getHash(this.iframe))&&
(b.replace||this.iframe.document.open().close(),this._updateHash(this.iframe.location,a,b.replace));else return this.location.assign(c);b.trigger&&this.loadUrl(a)}},_updateHash:function(a,b,c){c?(c=a.href.replace(/(javascript:|#).*$/,""),a.replace(c+"#"+b)):a.hash="#"+b}});g.history=new m;var A=g.View=function(a){this.cid=f.uniqueId("view");this._configure(a||{});this._ensureElement();this.initialize.apply(this,arguments);this.delegateEvents()},L=/^(\S+)\s*(.*)$/,M="model collection el id attributes className tagName events".split(" ");
f.extend(A.prototype,h,{tagName:"div",$:function(a){return this.$el.find(a)},initialize:function(){},render:function(){return this},remove:function(){this.$el.remove();this.stopListening();return this},setElement:function(a,b){this.$el&&this.undelegateEvents();this.$el=a instanceof g.$?a:g.$(a);this.el=this.$el[0];!1!==b&&this.delegateEvents();return this},delegateEvents:function(a){if(a||(a=f.result(this,"events"))){this.undelegateEvents();for(var b in a){var c=a[b];f.isFunction(c)||(c=this[a[b]]);
if(!c)throw Error('Method "'+a[b]+'" does not exist');var d=b.match(L),e=d[1],d=d[2],c=f.bind(c,this),e=e+(".delegateEvents"+this.cid);if(""===d)this.$el.on(e,c);else this.$el.on(e,d,c)}}},undelegateEvents:function(){this.$el.off(".delegateEvents"+this.cid)},_configure:function(a){this.options&&(a=f.extend({},f.result(this,"options"),a));f.extend(this,f.pick(a,M));this.options=a},_ensureElement:function(){if(this.el)this.setElement(f.result(this,"el"),!1);else{var a=f.extend({},f.result(this,"attributes"));
this.id&&(a.id=f.result(this,"id"));this.className&&(a["class"]=f.result(this,"className"));a=g.$("<"+f.result(this,"tagName")+">").attr(a);this.setElement(a,!1)}}});var N={create:"POST",update:"PUT",patch:"PATCH","delete":"DELETE",read:"GET"};g.sync=function(a,b,c){var d=N[a];f.defaults(c||(c={}),{emulateHTTP:g.emulateHTTP,emulateJSON:g.emulateJSON});var e={type:d,dataType:"json"};c.url||(e.url=f.result(b,"url")||x());if(null==c.data&&b&&("create"===a||"update"===a||"patch"===a))e.contentType="application/json",
e.data=JSON.stringify(c.attrs||b.toJSON(c));c.emulateJSON&&(e.contentType="application/x-www-form-urlencoded",e.data=e.data?{model:e.data}:{});if(c.emulateHTTP&&("PUT"===d||"DELETE"===d||"PATCH"===d)){e.type="POST";c.emulateJSON&&(e.data._method=d);var h=c.beforeSend;c.beforeSend=function(a){a.setRequestHeader("X-HTTP-Method-Override",d);if(h)return h.apply(this,arguments)}}"GET"!==e.type&&!c.emulateJSON&&(e.processData=!1);var m=c.success;c.success=function(a){m&&m(b,a,c);b.trigger("sync",b,a,c)};
var j=c.error;c.error=function(a){j&&j(b,a,c);b.trigger("error",b,a,c)};a=c.xhr=g.ajax(f.extend(e,c));b.trigger("request",b,a,c);return a};g.ajax=function(){return g.$.ajax.apply(g.$,arguments)};r.extend=s.extend=y.extend=A.extend=m.extend=function(a,b){var c=this,d;d=a&&f.has(a,"constructor")?a.constructor:function(){return c.apply(this,arguments)};f.extend(d,c,b);var e=function(){this.constructor=d};e.prototype=c.prototype;d.prototype=new e;a&&f.extend(d.prototype,a);d.__super__=c.prototype;return d};
var x=function(){throw Error('A "url" property or function must be specified');}}).call(this);
// Generated by CoffeeScript 1.4.0
(function() {

  (function(global, _, Backbone) {
    global.Offline = {
      VERSION: '0.4.3',
      localSync: function(method, model, options, store) {
        var resp, _ref;
        resp = (function() {
          switch (method) {
            case 'read':
              if (_.isUndefined(model.id)) {
                return store.findAll(options);
              } else {
                return store.find(model, options);
              }
              break;
            case 'create':
              return store.create(model, options);
            case 'update':
              return store.update(model, options);
            case 'delete':
              return store.destroy(model, options);
          }
        })();
        if (resp) {
          return options.success(model, (_ref = resp.attributes) != null ? _ref : resp, options);
        } else {
          return typeof options.error === "function" ? options.error('Record not found') : void 0;
        }
      },
      sync: function(method, model, options) {
        var store, _ref;
        store = model.storage || ((_ref = model.collection) != null ? _ref.storage : void 0);
        if (store && (store != null ? store.support : void 0)) {
          return Offline.localSync(method, model, options, store);
        } else {
          return Backbone.ajaxSync(method, model, options);
        }
      },
      onLine: function() {
        return navigator.onLine !== false;
      }
    };
    Backbone.ajaxSync = Backbone.sync;
    Backbone.sync = Offline.sync;
    Offline.Storage = (function() {

      function Storage(name, collection, options) {
        this.name = name;
        this.collection = collection;
        if (options == null) {
          options = {};
        }
        this.support = this.isLocalStorageSupport();
        this.allIds = new Offline.Index(this.name, this);
        this.destroyIds = new Offline.Index("" + this.name + "-destroy", this);
        this.sync = new Offline.Sync(this.collection, this);
        this.keys = options.keys || {};
        this.autoPush = options.autoPush || false;
      }

      Storage.prototype.isLocalStorageSupport = function() {
        try {
          localStorage.setItem('isLocalStorageSupport', '1');
          localStorage.removeItem('isLocalStorageSupport');
          return true;
        } catch (e) {
          return false;
        }
      };

      Storage.prototype.setItem = function(key, value) {
        try {
          return localStorage.setItem(key, value);
        } catch (e) {
          if (e.name === 'QUOTA_EXCEEDED_ERR') {
            return this.collection.trigger('quota_exceed');
          } else {
            return this.support = false;
          }
        }
      };

      Storage.prototype.removeItem = function(key) {
        return localStorage.removeItem(key);
      };

      Storage.prototype.getItem = function(key) {
        return localStorage.getItem(key);
      };

      Storage.prototype.create = function(model, options) {
        if (options == null) {
          options = {};
        }
        options.regenerateId = true;
        return this.save(model, options);
      };

      Storage.prototype.update = function(model, options) {
        if (options == null) {
          options = {};
        }
        return this.save(model, options);
      };

      Storage.prototype.destroy = function(model, options) {
        var sid;
        if (options == null) {
          options = {};
        }
        if (!(options.local || (sid = model.get('sid')) === 'new')) {
          this.destroyIds.add(sid);
        }
        return this.remove(model, options);
      };

      Storage.prototype.find = function(model, options) {
        if (options == null) {
          options = {};
        }
        
        /*return JSON.parse(this.getItem("" + this.name + "-" + model.id));
        */
        
        var item = null;
		try {
		   item = this.getItem(this.name + "-" + model.id);
		} catch (e) {};
			
		return JSON.parse(item);      
        
      };

      Storage.prototype.findAll = function(options) {
        var id, _i, _len, _ref, _results;
        if (options == null) {
          options = {};
        }
        if (!options.local) {
          if (this.isEmpty()) {
            this.sync.full(options);
          } else {
            this.sync.incremental(options);
          }
        }
        _ref = this.allIds.values;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          id = _ref[_i];
          _results.push(JSON.parse(this.getItem("" + this.name + "-" + id)));
        }
        return _results;
      };

      Storage.prototype.s4 = function() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };

      Storage.prototype.incrementId = 0x1000000;

      Storage.prototype.localId1 = ((1 + Math.random()) * 0x100000 | 0).toString(16).substring(1);

      Storage.prototype.localId2 = ((1 + Math.random()) * 0x100000 | 0).toString(16).substring(1);

      Storage.prototype.mid = function() {
        return ((new Date).getTime() / 1000 | 0).toString(16) + this.localId1 + this.localId2 + (++this.incrementId).toString(16).substring(1);
      };

      Storage.prototype.guid = function() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
      };

      Storage.prototype.save = function(item, options) {
        var id, _ref, _ref1;
        if (options == null) {
          options = {};
        }
        if (options.regenerateId) {
          id = options.id === 'mid' ? this.mid() : this.guid();
          item.set({
            sid: ((_ref = item.attributes) != null ? _ref.sid : void 0) || ((_ref1 = item.attributes) != null ? _ref1.id : void 0) || 'new',
            id: id
          });
        }
        if (!options.local) {
          item.set({
            updated_at: (new Date()).toJSON(),
            dirty: true
          });
        }
        this.replaceKeyFields(item, 'local');
        this.setItem("" + this.name + "-" + item.id, JSON.stringify(item));
        this.allIds.add(item.id);
        if (this.autoPush && !options.local) {
          this.sync.pushItem(item);
        }
        return item;
      };

      Storage.prototype.remove = function(item, options) {
        var sid;
        if (options == null) {
          options = {};
        }
        this.removeItem("" + this.name + "-" + item.id);
        this.allIds.remove(item.id);
        sid = item.get('sid');
        if (this.autoPush && sid !== 'new' && !options.local) {
          this.sync.flushItem(sid);
        }
        return item;
      };

      Storage.prototype.isEmpty = function() {
        return this.getItem(this.name) === null;
      };

      Storage.prototype.clear = function() {
        var collectionKeys, key, keys, record, _i, _j, _len, _len1, _ref, _results,
          _this = this;
        keys = Object.keys(localStorage);
        collectionKeys = _.filter(keys, function(key) {
          return (new RegExp(_this.name)).test(key);
        });
        for (_i = 0, _len = collectionKeys.length; _i < _len; _i++) {
          key = collectionKeys[_i];
          this.removeItem(key);
        }
        _ref = [this.allIds, this.destroyIds];
        _results = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          record = _ref[_j];
          _results.push(record.reset());
        }
        return _results;
      };

      Storage.prototype.replaceKeyFields = function(item, method) {
        var collection, field, newValue, replacedField, wrapper, _ref, _ref1, _ref2;
        if (Offline.onLine()) {
          if (item.attributes) {
            item = item.attributes;
          }
          _ref = this.keys;
          for (field in _ref) {
            collection = _ref[field];
            replacedField = item[field];
            if (!/^\w{8}-\w{4}-\w{4}/.test(replacedField) || method !== 'local') {
              newValue = method === 'local' ? (wrapper = new Offline.Collection(collection), (_ref1 = wrapper.get(replacedField)) != null ? _ref1.id : void 0) : (_ref2 = collection.get(replacedField)) != null ? _ref2.get('sid') : void 0;
              if (!_.isUndefined(newValue)) {
                item[field] = newValue;
              }
            }
          }
        }
        return item;
      };

      return Storage;

    })();
    Offline.Sync = (function() {

      function Sync(collection, storage) {
        this.collection = new Offline.Collection(collection);
        this.storage = storage;
      }

      Sync.prototype.ajax = function(method, model, options) {
        if (Offline.onLine()) {
          this.prepareOptions(options);
          return Backbone.ajaxSync(method, model, options);
        } else {
          return this.storage.setItem('offline', 'true');
        }
      };

      Sync.prototype.full = function(options) {
        var _this = this;
        if (options == null) {
          options = {};
        }
        return this.ajax('read', this.collection.items, _.extend({}, options, {
          success: function(model, response, opts) {
            var item, _i, _len;
            _this.storage.clear();
            _this.collection.items.reset([], {
              silent: true
            });
            for (_i = 0, _len = response.length; _i < _len; _i++) {
              item = response[_i];
              _this.collection.items.create(item, {
                silent: true,
                local: true,
                regenerateId: true
              });
            }
            if (!options.silent) {
              _this.collection.items.trigger('reset');
            }
            if (options.success) {
              return options.success(model, response, opts);
            }
          }
        }));
      };

      Sync.prototype.incremental = function(options) {
        var _this = this;
        if (options == null) {
          options = {};
        }
        return this.pull(_.extend({}, options, {
          success: function() {
            return _this.push();
          }
        }));
      };

      Sync.prototype.prepareOptions = function(options) {
        var success,
          _this = this;
        if (this.storage.getItem('offline')) {
          this.storage.removeItem('offline');
          success = options.success;
          return options.success = function(model, response, opts) {
            success(model, response, opts);
            return _this.incremental();
          };
        }
      };

      Sync.prototype.pull = function(options) {
        var _this = this;
        if (options == null) {
          options = {};
        }
        return this.ajax('read', this.collection.items, _.extend({}, options, {
          success: function(model, response, opts) {
            var item, _i, _len;
            _this.collection.destroyDiff(response);
            for (_i = 0, _len = response.length; _i < _len; _i++) {
              item = response[_i];
              _this.pullItem(item);
            }
            if (options.success) {
              return options.success(model, response, opts);
            }
          }
        }));
      };

      Sync.prototype.pullItem = function(item) {
        var local;
        local = this.collection.get(item.id);
        if (local) {
          return this.updateItem(item, local);
        } else {
          return this.createItem(item);
        }
      };

      Sync.prototype.createItem = function(item) {
        if (!_.include(this.storage.destroyIds.values, item.id.toString())) {
          item.sid = item.id;
          delete item.id;
          return this.collection.items.create(item, {
            local: true
          });
        }
      };

      Sync.prototype.updateItem = function(item, model) {
        if ((new Date(model.get('updated_at'))) < (new Date(item.updated_at))) {
          delete item.id;
          return model.save(item, {
            local: true
          });
        }
      };

      Sync.prototype.push = function() {
        var item, sid, _i, _j, _len, _len1, _ref, _ref1, _results;
        _ref = this.collection.dirty();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          this.pushItem(item);
        }
        _ref1 = this.storage.destroyIds.values;
        _results = [];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          sid = _ref1[_j];
          _results.push(this.flushItem(sid));
        }
        return _results;
      };

      Sync.prototype.pushItem = function(item) {
        var localId, method, _ref,
          _this = this;
        this.storage.replaceKeyFields(item, 'server');
        localId = item.id;
        delete item.attributes.id;
        _ref = item.get('sid') === 'new' ? ['create', null] : ['update', item.attributes.sid], method = _ref[0], item.id = _ref[1];
        this.ajax(method, item, {
          success: function(model, response, opts) {
            if (method === 'create') {
              item.set({
                sid: response.id
              });
            }
            return item.save({
              dirty: false
            }, {
              local: true
            });
          }
        });
        item.attributes.id = localId;
        return item.id = localId;
      };

      Sync.prototype.flushItem = function(sid) {
        var model,
          _this = this;
        model = this.collection.fakeModel(sid);
        return this.ajax('delete', model, {
          success: function(model, response, opts) {
            return _this.storage.destroyIds.remove(sid);
          }
        });
      };

      return Sync;

    })();
    Offline.Index = (function() {

      function Index(name, storage) {
        var store;
        this.name = name;
        this.storage = storage;
        store = this.storage.getItem(this.name);
        this.values = (store && store.split(',')) || [];
      }

      Index.prototype.add = function(itemId) {
        if (!_.include(this.values, itemId.toString())) {
          this.values.push(itemId.toString());
        }
        return this.save();
      };

      Index.prototype.remove = function(itemId) {
        this.values = _.without(this.values, itemId.toString());
        return this.save();
      };

      Index.prototype.save = function() {
        return this.storage.setItem(this.name, this.values.join(','));
      };

      Index.prototype.reset = function() {
        this.values = [];
        return this.storage.removeItem(this.name);
      };

      return Index;

    })();
    return Offline.Collection = (function() {

      function Collection(items) {
        this.items = items;
      }

      Collection.prototype.dirty = function() {
        return this.items.where({
          dirty: true
        });
      };

      Collection.prototype.get = function(sid) {
        return this.items.find(function(item) {
          return item.get('sid') === sid;
        });
      };

      Collection.prototype.destroyDiff = function(response) {
        var diff, sid, _i, _len, _ref, _results;
        diff = _.difference(_.without(this.items.pluck('sid'), 'new'), _.pluck(response, 'id'));
        _results = [];
        for (_i = 0, _len = diff.length; _i < _len; _i++) {
          sid = diff[_i];
          _results.push((_ref = this.get(sid)) != null ? _ref.destroy({
            local: true
          }) : void 0);
        }
        return _results;
      };

      Collection.prototype.fakeModel = function(sid) {
        var model;
        model = new Backbone.Model({
          id: sid
        });
        model.urlRoot = this.items.url;
        return model;
      };

      return Collection;

    })();
  })(window, _, Backbone);

}).call(this);

/**
(c) 2012 Uzi Kilon, Splunk Inc.
Backbone Poller 0.2.1
https://github.com/uzikilon/backbone-poller
Backbone Poller may be freely distributed under the MIT license.
*/(function(e,t){"use strict";function u(e){return n.find(o,function(t){return t.model===e})}function f(e,t){this.model=e,this.set(t)}function l(e){if(e.active()!==!0){e.stop({silent:!0});return}var t=n.extend({data:e.options.data},{success:function(){e.trigger("success",e.model),e.options.condition(e.model)!==!0?(e.stop({silent:!0}),e.trigger("complete",e.model)):e.timeoutId=n.delay(l,e.options.delay,e)},error:function(){e.stop({silent:!0}),e.trigger("error",e.model)}});e.trigger("fetch",e.model),e.xhr=e.model.fetch(t)}var n=e._,r=e.Backbone,i={delay:1e3,condition:function(){return!0}},s=["start","stop","fetch","success","error","complete"],o=[],a={get:function(e,t){var n=u(e);return n?n.set(t):(n=new f(e,t),o.push(n)),t&&t.autostart===!0&&n.start({silent:!0}),n},getPoller:function(){return window.console&&window.console.warn("getPoller() is depreacted, Use Backbone.Poller.get()"),this.get.apply(this,arguments)},size:function(){return o.length},reset:function(){while(o.length)o.pop().stop()}};n.extend(f.prototype,r.Events,{set:function(e){return this.off(),this.options=n.extend({},i,e||{}),n.each(s,function(e){var t=this.options[e];n.isFunction(t)&&this.on(e,t,this)},this),this.model instanceof r.Model&&this.model.on("destroy",this.stop,this),this.stop({silent:!0})},start:function(e){return this.active()||(e=e||{},e.silent||this.trigger("start",this.model),this.options.active=!0,l(this)),this},stop:function(e){return e=e||{},e.silent||this.trigger("stop",this.model),this.options.active=!1,this.xhr&&n.isFunction(this.xhr.abort)&&this.xhr.abort(),this.xhr=null,clearTimeout(this.timeoutId),this.timeoutId=null,this},active:function(){return this.options.active===!0}}),window.PollingManager=a,r.Poller=a})(this);
// Global Object
(function (global) {
  "use strict";

  var ondevicereadyCallbacks = []
    , onreadyCallbacks = [];

  var Cordova = {
    Geoloc: null,  // null until ready.

    status: "uninitialized", // uninitialized, loading, ready

    initialize: function () {
      // allready loaded.
      if (this.status !== "uninitialized")
        return;
      // we are now "loading"
      var that = this;
      this.status = "loading";
      var onDeviceReady = function () {
        // we are now "ready"
        that.status = "ready";
        // first => oninitialized
        _(ondevicereadyCallbacks).forEach(function (f) { f() });
        // second => onready
        _(onreadyCallbacks).forEach(function (f) { f() });
      };

      // Windows Phone 8 cordova bug.
      if (navigator.userAgent.match(/(IEMobile)/)) {
        setTimeout(function () { onDeviceReady() }, 2000);
      }
      else {
        // #BEGIN_DEV
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
          // #END_DEV
          window.addEventListener("load", function () {
            document.addEventListener("deviceready", onDeviceReady, false);
          }, false);
          // #BEGIN_DEV
        } else {
          // We cannot simulate "deviceready" event using standard API.
          // So, we trigger cordova startup on chrome browser in dev after random time < 1s
          setTimeout(function () { onDeviceReady() }, Math.round(Math.random() * 1000));
        }
        // #END_DEV
      }
    },

    deviceready: function (callback) {
      switch (this.status) {
        case "uninitialized":
          // when Cordova is uninitialized, we just stack the callbacks.
          ondevicereadyCallbacks.push(callback);
          break;
        case "loading":
          // when Cordova is loading, we just stack the callbacks.
          ondevicereadyCallbacks.push(callback);
          break;
        case "ready":
          // when Cordova is ready, call the callback !
          setTimeout(callback, 10);
          break;
        default:
          throw "error";
      }
    },

    // same as jquery ;)
    ready: function ready(callback) {
      switch (this.status) {
        case "uninitialized":
          // when Cordova is uninitialized, we just stack the callbacks.
          onreadyCallbacks.push(callback);
          break;
        case "loading":
          // when Cordova is loading, we just stack the callbacks.
          onreadyCallbacks.push(callback);
          break;
        case "ready":
          // when Cordova is ready, call the callback !
          setTimeout(callback, 10);
          break;
        default:
          throw "error";
      }
    }
  };

  // initializing on launch. (before exporting to global namespace).
  Cordova.initialize();

  // exporting Cordova to global scope
  global.Cordova = Cordova;
})(this);
(function (Cordova, undefined) {
  var Connection = {
    types: {
      UNKNOWN: null,
      ETHERNET: null,
      WIFI: null,
      CELL_2G: null,
      CELL_3G: null,
      CELL_4G: null,
      NONE: null
    },

    initialize: function () {
      this.types.UNKNOWN = Connection.UNKNOWN || "UNKNOWN";
      this.types.ETHERNET = Connection.ETHERNET || "ETHERNET";
      this.types.WIFI = Connection.WIFI || "WIFI";
      this.types.CELL_2G = Connection.CELL_2G || "CELL_2G";
      this.types.CELL_3G = Connection.CELL_3G || "CELL_3G";
      this.types.CELL_4G = Connection.CELL_4G || "CELL_4G";
      this.types.NONE = Connection.NONE || "NONE";
    },

    getType: function () {
      if (navigator.connection !== undefined)
        return navigator.connection.type;
      return this.types.UNKNOWN; // inside the browser...
    },

    isOnline: function () {
      switch (this.getType()) {
        case this.types.UNKNOWN: // unknown <=> offline ?
        case this.types.NONE:
          return false;
        default:
          return true;
      }
    },

    isFast: function () {
      switch (this.getType()) {
        case this.types.ETHERNET:
        case this.types.WIFI:
          return true;
        default:
          return false;
      }
    }
  };

  Cordova.deviceready(function () {
    Connection.initialize();
    Cordova.Connection = Connection;
  });
})(Cordova);
(function (Cordova, undefined) {
  "use strict";

  // wrapper around cordova geolocation
  var Geolocation = {
    getCurrentPosition: function (callback) {
      navigator.geolocation.getCurrentPosition(
        function Cordova_Geolocation_Success(position) {
          if (position && position.coords)
            callback(position.coords)
          else
            callback(null);
        },
        function Cordova_Geolocation_Error() {
          callback(null);
        }
      );
    }
  };

  // registering geolocalisation only when cordova is ready.
  Cordova.deviceready(function () {
    Cordova.Geolocation = Geolocation;
  });
})(Cordova);
(function (Cordova, undefined) {
  "use strict";

  // Api:
  // 
  //  Cordova.File.Read("test.txt", function (err, text) {
  //    if (err)
  //      return console.log("error !");
  //    console.log(text);
  //  });
  //
  //  Cordova.File.Write("test.txt", "some text", function (err) {
  //    if (err)
  //      return console.log("error !");
  //  });
  //

  // FileError is the only parameter of any of the File API's error callbacks.
  // @see http://docs.phonegap.com/en/2.4.0/cordova_file_file.md.html#FileError
  var getErrorMessage = function (evt) {
    try {
      for (var errorCodeName in FileError) {
        if (typeof FileError[errorCodeName] !== "function" &&
            FileError[errorCodeName] === evt.target.error.code) {
          return "error " + msg + " " + i;
        }
      }
    } catch (e) { return "exception in error handler " + e; }
    return "unknown error " + msg;
  };

  var requestFileSystem = function (callback) {
    if (!window.requestFileSystem)
      return callback("fileY Can't access Cordova requestFileSystem");
    window.requestFileSystem(
      LocalFileSystem.PERSISTENT,
      0,
      function success(result) { callback(null, result) },
      function error(evt) { callback(getErrorMessage(evt)) }
    );
  };

  var getFileEntryFromDirectory = function (directory, filename, options, callback) {
    directory.getFile(
      filename,
      options,
      function success(result) { callback(null, result); },
      function error(evt) { callback(getErrorMessage(evt)) }
    );
  };

  var getFileEntryFromRootDirectory = function (filename, options, callback) {
    requestFileSystem(function (err, filesystem) {
      if (err)
        return callback(err);
      getFileEntryFromDirectory(
        filesystem.root,
        filename,
        options,
        callback);
    });
  };

  var File = {
    read: function (filename, callback) {
      getFileEntryFromRootDirectory(filename, null, function (err, fileEntry) {
        if (err)
          return callback(err);
        // reading file.
        fileEntry.file(
          function success(file) {
            var reader = new FileReader();
            reader.onloadend = function (evt) { callback(null, evt.target.result) };
            reader.onerror = function (evt) { callback("file reader error") };
            reader.readAsText(file);
          },
          function error(evt) { callback(getErrorMessage(evt)) }
        );
      });
    },


    write: function (filename, data, callback) {
      getFileEntryFromRootDirectory(String(filename), { create: true, exclusive: false }, function (err, fileEntry) {
        if (err)
          return callback(err);
        // write file.
        fileEntry.createWriter(
          function success(writer) {
            writer.onwrite = function success(evt) { callback() };
            writer.onerror = function error(evt) { callback("file writer error") };
            writer.write(String(data));
          },
          function error(evt) { callback(getErrorMessage(evt)) }
        );
      });
    }
  };

  // registering file only when cordova is ready.
  Cordova.deviceready(function () {
    Cordova.File = File;

    // #BEGIN_DEV
    // test de l'ecriture
    /*
    var now = new Date().getTime();
    console.log("DEV: test writing " + now + " in temp.text");
    File.write('temp.txt', now, function (err) {
      if (err)
        return console.log("error: " + err);
      // test de la lecture
      console.log('DEV ecriture dans temp.txt OK');
      File.read('temp.txt', function (err, data) {
        if (err)
          return console.log("erreor: " + err);
        console.log('DEV lecture dans temp.txt de ' + data);
        //
        assert(data === String(now));
      });
    });
    */
    // #END_DEV

  });
})(Cordova);
// Global Object
(function (global) {
  "use strict";

  var YesWeScore = {
    lang: "fr",
    Conf: null,     // @see yws/conf.js
    Router: null,   // @see yws/router.js
    Templates: null, // @see yws/tempates.js

    Env: {
      DEV: "DEV",
      PROD: "PROD",
      CURRENT: null
    },

    load: function (callback) {
      var that = this;
      // init self configuration
      this.Conf.initEnv()
               .load(this.Env.CURRENT, function onConfLoaded() {
        // init router
        that.Router.initialize();
        // load the templates.
        that.Templates.loadAsync(function () {
          // start dispatching routes
          // @see http://backbonejs.org/#History-start
          Backbone.history.start();
          // waiting for cordova to be ready
          callback();
        });
      });
    },

    // same as jquery ;)
    ready: (function () {
      var status = "uninitialized"  // uninitialized, loading, loaded
        , callbacks = [];

      return function ready(callback) {
        switch (status) {
          case "uninitialized":
            // when YesWeScore is uninitialized, we just stack the callbacks.
            callbacks.push(callback);
            // we are now "loading"
            status = "loading";
            this.load(function () {
              // We are now ready.
              status = "ready";
              _(callbacks).forEach(function (f) { f() });
            });
            break;
          case "loading":
            // when YesWeScore is loading, we just stack the callbacks.
            callbacks.push(callback);
            break;
          case "ready":
            // when YesWeScore is ready, call the callback !
            setTimeout(callback, 10);
            break;
          default:
            throw "error";
        }
      };
    })()
  };
  // exporting YesWeScore to global scope, aliasing it to Y.
  global.YesWeScore = YesWeScore;
  global.Y = YesWeScore;
})(this);
(function (Y, undefined) {
  "use strict";

  // permanent storage
  var filename = "yws.json";

  // DB: no need of any drivers
  //  localStorage is supported on android / iOS
  //  @see http://caniuse.com/#feat=namevalue-storage
  //
  // FIXME: utiliser une surcouche au localstorage qui g�re le quota et 
  //    une notion de date et priorit� (#44910971)
  var DB = {
    // in local storage, all conf keys will be prefixed "Y.conf."
    prefix: "Y.Conf.",

    save: function (k, v) {
      assert(typeof k === "string");
      assert(typeof v === "string");

      window.localStorage.setItem(this.prefix + k, v);
    },

    // @return value/null if not exist.
    read: function (k) {
      assert(typeof k === "string");

      return window.localStorage.getItem(this.prefix + k);
    },

    remove: function (k) {
      assert(typeof k === "string");

      return window.localStorage.removeItem(k);
    },

    getKeys: function () {
      return _.filter(_.keys(window.localStorage), function (k) {
        return k.substr(0, this.prefix.length) == this.prefix;
      }, this);
    }
  };

  var Conf = {
    initEnv: function () {
      Y.Env.CURRENT = Y.Env.PROD; // default behaviour
      // #BEGIN_DEV
      // Y.Env.CURRENT = Y.Env.DEV;  // overloaded in dev
      // #END_DEV
      return this; // chainable
    },

    load: function (env, callback) {
      assert(env === Y.Env.DEV ||
             env === Y.Env.PROD);

      // conf already loaded => we directly return
      if (this.exist("_env") && this.get("_env") === env)
        return callback();

      // Param�trage des variables dependantes d'un environnement
      switch (env) {
        case Y.Env.DEV:
          // #BEGIN_DEV
          this.setNX("api.url.auth", "http://91.121.184.177:1024/v1/auth/");
          this.setNX("api.url.bootstrap", "http://91.121.184.177:1024/bootstrap/conf.json?version=%VERSION%");
          this.setNX("api.url.games", "http://91.121.184.177:1024/v1/games/");
          this.setNX("api.url.players", "http://91.121.184.177:1024/v1/players/");
          this.setNX("api.url.clubs", "http://91.121.184.177:1024/v1/clubs/");
          this.setNX("api.url.stats", "http://91.121.184.177:1024/v1/stats/");
          // #END_DEV
          break;
        case Y.Env.PROD:
          this.setNX("api.url.auth", "http://api.yeswescore.com/v1/auth/");
          this.setNX("api.url.bootstrap", "http://91.121.184.177:1024/bootstrap/conf.json?version=%VERSION%");
          this.setNX("api.url.games", "http://api.yeswescore.com/v1/games/");
          this.setNX("api.url.players", "http://api.yeswescore.com/v1/players/");
          this.setNX("api.url.clubs", "http://api.yeswescore.com/v1/clubs/");
          this.setNX("api.url.stats", "http://api.yeswescore.com/v1/stats/");
          break;
        default:
          break;
      }

      // Param�trage des variables non d�pendantes d'un environnement
      this.setNX("game.refresh", 5000); // gameRefresh
      this.set("pooling.geolocation", 5000);
      this.set("pooling.connection", 1000);
      this.set("version", "1"); // might be usefull on update.

      // loading permanent keys
      //  stored inside yws.json using format [{key:...,value:...,metadata:...},...]
      Cordova.ready(function () {
        Cordova.File.read(filename, function (err, data) {
          if (err)
            return callback();
          var k = [];
          try { k = JSON.parse(data); } catch (e) { }
          _.forEach(k, function (o) {
            this.set(o.key, o.value, o.metadata);
          });
          callback();
        });
      });
    },

    // Read API
    // @param string/regExp key
    // @return [values]/value/undefined
    get: function (key) {
      assert(typeof key === "string" || key instanceof RegExp);

      if (typeof key === "string") {
        if (DB.read(key)) {
          try {
            return JSON.parse(DB.read(key)).value;
          } catch (e) { assert(false) }
        }
        return undefined;
      }
      // recursive call.
      return _.map(this.keys(key), function (key) {
        return this.get(key);
      }, this);
    },

    // @param string key
    // @return object/undefined
    getMetadata: function (key) {
      assert(typeof key === "string");

      if (DB.read(key)) {
        try {
          return JSON.parse(DB.read(key)).metadata;
        } catch (e) { }
      }
      return undefined;
    },

    // @param string key
    // @return object/undefined
    getRaw: function (key) {
      assert(typeof key === "string");

      if (DB.read(key)) {
        try {
          return JSON.parse(DB.read(key));
        } catch (e) { }
      }
      return undefined;
    },

    // Write API (inspired by http://redis.io)
    set: function (key, value, metadata, callback) {
      assert(typeof key === "string");
      assert(typeof value !== "undefined");

      var obj = { key: key, value: value, metadata: metadata };
      DB.save(key, JSON.stringify(obj));

      // events
      this.trigger("set", [obj]);

      // permanent keys (cost a lot).
      if (metadata && metadata.permanent) {
        var permanentKeys = _.filter(DB.getKeys(), function (k) {
          var metadata = this.getMetadata(k);
          return metadata && metadata.permanent;
        }, this);
        var permanentObjs = _.map(permanentKeys, function (k) {
          return this.getRaw(k);
        }, this);
        // saving when cordova is ready.
        Cordova.ready(function () {
          Cordova.File.write(filename, JSON.stringify(permanentObjs), callback || function () { });
        });
      }
    },

    // set if not exist.
    setNX: function (key, value, metadata) {
      assert(typeof key === "string");

      if (!this.exist(key))
        this.set(key, value, metadata);
    },

    // search configuration keys.
    keys: function (r) {
      assert(r instanceof RegExp);

      return _.filter(DB.getKeys(), function (key) {
        return key.match(r);
      });
    },

    exist: function (key) {
      assert(typeof key === "string");

      return DB.read(key) !== null;
    },

    unload: function () {
      _.forEach(DB.getKeys(), function (key) {
        DB.remove(key);
      });
    },

    reload: function () {
      this.unload();
      this.load();
    }
  };

  // using mixin
  _.extend(Conf, Backbone.Events);

  // setting conf
  Y.Conf = Conf;
})(Y);


(function (Y, undefined) {
  var Connection = {
    ONLINE: "ONLINE",
    OFFLINE: "OFFLINE",

    status: null,

    initialize: function () {
      this.status = this.OFFLINE;
    },

    isOnline: function () {
      this.update();
      return this.status === this.ONLINE;
    },

    update: function () {
      if (Cordova.status !== "ready")
        return;
      var newStatus = Cordova.Connection.isOnline() ? this.ONLINE : this.OFFLINE;
      if (this.status !== newStatus) {
        this.status = newStatus;
        this.trigger("change", [newStatus]);
      }
    }
  };

  // adding some mixin for events.
  _.extend(Connection, Backbone.Events);

  // pooling cordova to auto-update connection status
  setInterval(function () { Connection.update(); }, Y.Conf.get("pooling.connection"));

  // exporting to global scope
  Y.Connection = Connection;
})(Y);
(function (Y) {
  "use strict";

  // overloading backbone close.
  Backbone.View.prototype.close = function () {
    this.off();
    if (typeof this.onClose === "function")
      this.onClose();
  };

  var currentView = null;

  var Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      'games/me/:id': 'gameMe',
      'games/add': 'gameAdd',
      'games/follow': 'gameFollow',
      'games/end/:id': 'gameEnd',
      'games/club/:id': 'gameClub',
      'games/:id': 'game',
      'players/list': 'playerList',
      'players/club/:id': 'playerListByClub',
      'players/form': 'playerForm',
      'players/signin': 'playerSignin',
      'players/forget': 'playerForget',
      'players/follow': 'playerFollow',
      //'players/follow/:id':                           'playerFollow',    
      //'players/nofollow/:id':                         'playerNoFollow',                                    
      'players/:id': 'player',
      'clubs/add': 'clubAdd',
      'clubs/:id': 'club',
      'account': 'account'
    },


    initialize: function (options) {
      var that = this;

      //Global Transition handler
      $("a").live("touch vclick", function (e) {
        that.setNextTransition(this);
      });
    },

    account: function () {
      var accountView = new AccountView();
      this.changePage(accountView);
    },

    club: function (id) {
      var clubView = new ClubView({ id: id });
      this.changePage(clubView);
    },

    clubAdd: function (id) {
      var clubAddView = new ClubAddView();
      this.changePage(clubAddView);
    },

    index: function () {
      var indexView = new IndexView();
      this.changePage(indexView);
    },


    game: function (id) {
      var gameView = new GameView({ id: id });
      this.changePage(gameView);
    },

    gameAdd: function () {
      var gameAddView = new GameAddView();
      this.changePage(gameAddView);
    },

    gameEnd: function () {
      var gameEndView = new GameEndView();
      this.changePage(gameEndView);
    },

    gameFollow: function () {
      var gameFollowView = new GameFollowView();
      this.changePage(gameFollowView);
    },

    gameMe: function (id) {
      var gameListView = new GameListView({ mode: 'me', id: id });
      this.changePage(gameListView);
    },

    gameClub: function (id) {
      var gameListView = new GameListView({ mode: 'club', clubid: id });
      this.changePage(gameListView);
    },

    player: function (id) {
      //console.log('router ',id);
      var playerView = new PlayerView({ id: id, follow: '' });
      this.changePage(playerView);
    },


    playerFollow: function (id) {
      var playerFollowView = new PlayerFollowView();
      this.changePage(playerFollowView);
    },

    playerNoFollow: function (id) {
      var playerView = new PlayerView({ id: id, follow: 'false' });
      this.changePage(playerView);
    },

    playerForm: function () {
      var playerFormView = new PlayerFormView();
      this.changePage(playerFormView);
    },

    playerList: function () {
      var playerListView = new PlayerListView();
      this.changePage(playerListView);
    },

    playerListByClub: function (id) {
      var playerListView = new PlayerListView({ id: id });
      this.changePage(playerListView);
    },

    playerSignin: function () {
      var playerSigninView = new PlayerSigninView();
      this.changePage(playerSigninView);
    },

    playerForget: function () {
      var playerForgetView = new PlayerForgetView();
      this.changePage(playerForgetView);
    },

    setNextTransition: function (el) {
    },

    changePage: function (view) {

      try {
        var previousPageName = "none";
        var nextPageName = "unknown";

        if (currentView && currentView.pageName)
          previousPageName = currentView.pageName;
        if (currentView)
          currentView.close();
        currentView = view;
        if (view.pageName)
          nextPageName = view.pageName;

        Y.Stats.page(previousPageName, nextPageName);
        console.log('DEV ChangePage', new Date().getTime());

        $.mobile.changePage(view.$el, {
          transition: 'none',
          //showLoadMsg: false,
          changeHash: false,
          reverse: false
        });
      }
      catch (e) {
        console.log('DEV ChangePage Error', e);
      }


    },

    historyCount: 0
  });

  Y.Router = new Router();
})(Y);
(function (Y, undefined) {
  /*
  * Api:
  *  Y.Stats.click(ev, 'button:les_plus');
  *  Y.Stats.page(from, to);
  *
  * Stats format example:
  *  "1361549744511","
  *
  */
  var stack = [ /* String */]; // "timestamp","playerid","type","..."

  var playerid = "";

  var Stats = {
    TYPE: {
      STARTUP: "STARTUP",
      CORDOVA: "CORDOVA",
      CLICK: "CLICK",
      PAGE: "PAGE"
    },

    initialize: function () {
      playerid = Y.Conf.get("playerid") || "";
      Y.Conf.on("set", function (o) {
        if (o.key === "playerid") {
          playerid = o.value;
        }
      });
    },

    startup: function () {
      var msg = [this.TYPE.STARTUP];
      msg.push(navigator.language);
      msg.push(navigator.platform);
      msg.push(navigator.appName);
      msg.push(navigator.appVersion);
      msg.push(navigator.vendor);
      msg.push(window.innerWidth);
      msg.push(window.innerHeight);
      msg.push(window.devicePixelRatio);
      this.send(msg);
    },

    cordova: function () {
      if (typeof device !== "undefined") {
        var msg = [this.TYPE.CORDOVA];
        msg.push(device.name);
        msg.push(device.cordova);
        msg.push(device.platform);
        msg.push(device.uuid);
        msg.push(device.model);
        msg.push(device.version);
        this.send(msg);
      }
    },

    clic: function (ev, data) {
      assert(typeof ev === "object");
      assert(_.isArray(data));

      var msg = [this.TYPE.CLICK];
      // compute mouse position
      var posx = 0;
      var posy = 0;
      if (!e) var e = window.event;
      if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
      }
      else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft
			    + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop
			    + document.documentElement.scrollTop;
      }
      msg.push(posx);
      msg.push(posy);
      // concat with the info
      msg = msg.concat(data);
      // send
      this.send(msg);
    },

    page: function (from, to) {
      var msg = [this.TYPE.PAGE];
      msg.push(from);
      msg.push(to);
      this.send(msg);
    },

    // push a message to send
    // @param msg Array  [type,arg2,arg3]
    push: function (msg) {
      assert(_.isArray(msg));
      assert(msg.length > 1);

      // add timestamp & playerid in front of the msg
      msg.unshift(playerid);
      msg.unshift(new Date().getTime());
      // push on stack.
      stack.push(_.reduce(msg, function (result, entry) {
        return result + ((result) ? "," : "") + JSON.stringify(String(entry || ""));
      }, ""));
    },

    trySend: (function () {
      var sending = false; // semaphore
      return function () {
        if (stack.length == 0 || sending)
          return;
        sending = true;
        var msg = stack.shift(); // fifo.
        $.ajax({
          url: Y.Conf.get("api.url.stats") + "?q=" + encodeURIComponent(msg),
          type: 'GET',
          success: function () {
           // everything went ok, next stat in 1 sec.
           		setTimeout(function () {
             	sending = false;
             	Y.Stats.trySend();
           		}, 1000);
	         },
	       error: function () {
	           // retry after 5 sec.
	           setTimeout(function () {
	             // msg again in the stack
	             stack.unshift(msg);
	             sending = false;
	             Y.Stats.trySend();
	           }, 3000);
	        }
         });
        }
      })(),

    send: function (msg) {
      this.push(msg);
      this.trySend();
    }
  };

  // initializing
  Stats.initialize();

  // starting stats.
  Cordova.ready(function () {
    Stats.startup();
    Stats.cordova();
  });

  // export to global namespace
  Y.Stats = Stats;
})(Y);
(function (Y) {
  "use strict";

  Y.Templates = {
    // Hash of preloaded templates for the app
    templates : {
      HTML: { /* name: "HTML" */ },
      compiled: { /* name: compiled */ }
    },

    // Load all the templates Async
    loadAsync: function (callback) {
      // searching scripts nodes
      var nodes = document.querySelectorAll("script[type=text\\/template]");
      // foreach script node, get the html.
      var html = this.templates.HTML;
      _(nodes).forEach(function (node) {
        // save the template
        var templateId = node.getAttribute('id');
        html[templateId] = node.innerHTML;
        // optim: remove the script from the dom.
        node.parentNode.removeChild(node);
      });
      // we have finished.
      callback();
    },

    // Get template by name from hash of preloaded templates
    get: function (templateId) {
      var html = this.templates.HTML
        , compiled = this.templates.compiled;
      if (typeof html[templateId] === "undefined")
        throw "unknown template "+templateId;
      if (typeof compiled[templateId] === "undefined")
        compiled[templateId] = _.template(html[templateId]);
      return compiled[templateId];
    }
  };
})(Y);

(function (Y, undefined) {
  "use strict";

  var Geolocation = {
    longitude: null,
    latitude: null,

    update: (function () {
      var pooling = false; // avoiding pooling twice

      return function () {
        if (Cordova.status !== "ready" || pooling)
          return;
        pooling = true;
        // FIXME: treshold on "change" event ?
        Cordova.Geolocation.getCurrentPosition(function (coords) {
          if (coords &&
              (Y.Geolocation.longitude !== coords.longitude ||
               Y.Geolocation.latitude !== coords.latitude)) {
            Y.Geolocation.longitude = coords.longitude;
            Y.Geolocation.latitude = coords.latitude;
            Y.Geolocation.trigger("change", [Y.Geolocation.longitude, Y.Geolocation.latitude]);
          }
          pooling = false;
        });
      };
    })()
  };

  // adding some mixin for events.
  _.extend(Geolocation, Backbone.Events);

  // pooling cordova to auto-update geoloc coordinates
  setInterval(function () { Geolocation.update(); }, Y.Conf.get("pooling.geolocation"));

  // exporting to global scope
  Y.Geolocation = Geolocation;
})(Y);

//FIXME:si connection revient on update le tout via 
// Game.syncDirtyAndDestroyed(); 

var GameModel = Backbone.Model.extend({

  // storeName : "game",

  urlRoot : Y.Conf.get("api.url.games"),

  initialize : function() {

    this.updated_at = new Date();

  },

  setSets : function(s) {
    this.sets = s;
  },

  defaults : {
    sport : "tennis",
    status : "ongoing",
    location : {
      country : "",
      city : "",
      pos : []
    },
    teams : [ {
      points : "",
      players : [ {
        name : "A"
      } ]
    }, {
      points : "",
      players : [ {
        name : "B"
      } ]
    } ],
    options : {
      subtype : "A",
      sets : "0/0",
      score : "0/0",
      court : "",
      surface : "",
      tour : ""
    },
    updated_at : new Date()
  },

  sync : function(method, model, options) {

    console.log('method sync Model Game', method);

    if (method === 'create' && this.get('playerid') !== undefined) {

      var team1_json = '';
      var team2_json = '';

      // if player exists / not exists

      if (this.get('team1_id') === '')
        team1_json = {
          name : this.get('team1'),
          rank : 'NC'
        };
      else
        team1_json = {
          id : this.get('team1_id')
        };

      if (this.get('team2_id') === '')
        team2_json = {
          name : this.get('team2'),
          rank : 'NC'
        };
      else
        team2_json = {
          id : this.get('team2_id')
        };

      var object = {
        teams : [ {
          id : null,
          players : [ team1_json ]
        }, {
          id : null,
          players : [ team2_json ]
        } ],
        options : {
          type : 'singles',
          subtype : (this.get('subtype') || 'A'),
          sets : '',
          score : '',
          court : (this.get('court') || ''),
          surface : (this.get('surface') || ''),
          tour : (this.get('tour') || '')
        },
        location : {
          country : (this.get('country') || ''),
          city : (this.get('city') || ''),
          pos : [ appConfig.latitude, appConfig.longitude ]
        }
      };

      console.log('tmp Game POST', JSON.stringify(object));

      return $.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.games") + '?playerid=' + (this.get('playerid') || '')
            + '&token=' + (this.get('token') || ''),
        type : 'POST',
        data : object,
        success : function(result) {
          console.log('data result Game', result);
          // FIXME : on redirige sur //si offline id , si online sid
          window.location.href = '#games/' + result.id;
        },
        error : function(result) {
          // si erreur on stocke dans localstorage console.log('error
          // Game',result);

        }
      });

    } else if (method === 'update' && this.get('playerid') !== undefined) {

      return $.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.games") + '?playerid=' + (this.get('playerid') || '')
            + '&token=' + (this.get('token') || ''),
        type : 'POST',
        data : {

          options : {
            sets : (this.get('sets') || '')
          }
        },
        success : function(result) {

          console.log('data update Game', result);

        }

      });

    } else {
      
      
      console.log('GameModel default '+Y.Conf.get("api.url.games")+this.id);
      
      //var params = _.extend({ type: 'GET', dataType: 'json', url: Y.Conf.get("api.url.games")+this.id, processData:false }, options); 
      //return $.ajax(params);
      model.url = Y.Conf.get("api.url.games")+this.id+"?stream=true";

      return Backbone.sync(method, model, options);
    }
  }

});

var StreamModel = Backbone.Model.extend({

  urlRoot : Y.Conf.get("api.url.games"),

  defaults : {
    id : null,
    date : null,
    type : "comment",
    owner : null,
    data : {
      text : "...."
    }
  },

  initialize : function() {

  },

  comparator : function(item) {
    // POSSIBLE MULTI FILTER [a,b,..]
    return -item.get("date").getTime();
  },

  sync : function(method, model, options) {

    console.log('method Stream', method);
    console.log('url', Y.Conf.get("api.url.games") + (this.get('gameid') || '')
        + '/stream/?playerid=' + (this.get('playerid') || '') + '&token='
        + (this.get('token') || ''));

    if (method === 'update' || method === 'create') {

      return $.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.games") 
        	+ (this.get('gameid') || '') 
        	+ '/stream/?playerid='
            + (this.get('playerid') || '') 
            + '&token='
            + (this.get('token') || ''),
        type : 'POST',
        data : {
          // FIXME : only comment
          type : 'comment',
          data : {
            text : (this.get('text') || '')
          }
        },
        success : function(result) {
          // put your code after the game is saved/updated.

          console.log('data Stream', result);

        }
      });

    } else {

	  // http://api.yeswescore.com/v1/games/511d31971ad3857d0a0000f8/stream/
      return Backbone.sync(method, model, options);

    }

  }

});

var PlayerModel = Backbone.Model.extend({
  urlRoot : Y.Conf.get("api.url.players"),

  mode : '',

  defaults : {
    name : "",
    nickname : "",
    rank : "NC",
    type : "default",
    games : [],
    club : {
      id : "",
      name : ""
    },
    dates : {
      update : "",
      creation : new Date()
    },
    language : window.navigator.language,
    location : {
      currentPos : [ 0, 0 ]
    },
    updated_at : new Date()
  },

  initialize : function() {

  },

  login : function(mail, password) {

    return $.ajax({
      dataType : 'json',
      url : Y.Conf.get("api.url.auth"),
      type : 'POST',
      data : {
        email : {address : mail},
        uncryptedPassword : password
      },
      success : function(data) {

        console.log('data result Login', data);

        // Display Results
        // TODO : prevoir code erreur
        if (data.id !== undefined) {
          $('span.success').html('Login OK ' + data.id).show();

           window.localStorage.setItem("Y.Cache.Player",JSON.stringify(data));

           //players = new PlayersCollection('me');
           //players.create(data);

        } else
          $('span.success').html('Erreur').show();

        // FIXME : on redirige sur la page moncompte

      }
    });

  },
  
  
  newpass : function(mail) {
    
    console.log('On demande un newpass');

    return $.ajax({
      dataType : 'json',
      url : Y.Conf.get("api.url.auth")+"resetPassword/",
      type : 'POST',
      data : {
        email : {address : mail}
      },
      success : function(data) {

        console.log('data result Reset Password', data);

        // Display Results
        // TODO : prevoir code erreur
        
        
          $('span.success').html(' ' + data.message+' Attention, le mail qui rappelle votre mot de passe peut arriver dans le spam.').show();
       
        
      }
    });

  },  

  sync : function(method, model, options) {

    console.log('Player sync:' + method + " playerid:"+this.get('playerid')+" id:"+this.id);

    if (method==='create' && this.get('playerid') === undefined) {

      return $.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.players"),
        type : 'POST',
        data : {
          nickname : (this.get('nickname') || ''),
          name : (this.get('name') || ''),
          rank : (this.get('rank') || ''),
          email : (this.get('email') || ''),
          uncryptedPassword : (this.get('password') || ''),
          language : window.navigator.language,
          location : {
            currentPos : [ (this.get('latitude') || 0),(this.get('longitude') || 0), ]
          },
          club : (this.get('club') || '')
        },
        success : function(data) {

          console.log('Create Player', data);

          // Display Results
          // TODO : prevoir code erreur
          if (data.id !== null)
            $('span.success').html('Enregistrement OK ' + data.id).show();
          else
            $('span.success').html('Erreur').show();

          // FIXME : recup id et token = player ok
          // On fixe dans localStorage
          if (data.token !== null) {
            data.password = '';
            window.localStorage.setItem("Y.Cache.Player", JSON.stringify(data));
            
            Y.Conf.set("playerid", data.id, { permanent: true })
            
          } else
            console.log('Erreur Creation User par defaut');
        },
        error : function(xhr, ajaxOptions, thrownError) {
        }
      });

    }
    // Update
    else if ( this.get('playerid') !== undefined ){

		
      var dataSend = {
        id : (this.get('playerid') || ''),
        nickname : (this.get('nickname') || ''),
        name : (this.get('name') || ''),
        email : {address : (this.get('email') || '')},
        rank : (this.get('rank') || ''),
        idlicense : (this.get('idlicense') || ''),
        language : window.navigator.language,
        games : [],
        token : (this.get('token') || ''),
        location : {
          currentPos : [ (this.get('latitude') || 0),(this.get('longitude') || 0), ]
        },
      };

      // si mot de passe defini
      if (this.get('password') !== '') {
        dataSend.uncryptedPassword = this.get('password');
      }
      // si club non nul
      if (this.get('clubid') !== '') {
        dataSend.club = {
          id : (this.get('clubid') || undefined)
        };
      }

      console.log('Update Player', dataSend);

      return $.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.players") + (this.get('playerid') || '')
            + '/?playerid=' + (this.get('playerid') || '') + '&token='
            + (this.get('token') || ''),
        type : 'POST',
        data : dataSend,
        success : function(data) {

          console.log('Update Player Result', data);

          // Display Results //TODO : prevoir code erreur
          $('span.success').html('MAJ OK ' + data.id).show();

          if (data.id !== undefined) {

            // On met � jour le local storage
			console.log('On stocke dans le localStorage');
            window.localStorage.removeItem("Y.Cache.Player");
            window.localStorage.setItem("Y.Cache.Player", JSON.stringify(data));
          }
          else
			console.log('Erreur : On stocke pas dans le localStorage');          
        }
      });
      
      

    }
    else {
    	model.url = Y.Conf.get("api.url.players")+this.id;
	    console.log('model.url : ',model.url);
	    
	    return Backbone.sync(method, model, options);
    
    }



  }

});

var ClubModel = Backbone.Model.extend({

  urlRoot : Y.Conf.get("api.url.clubs"),

  mode : '',
  
  defaults : {
    sport : "tennis",
    name : "",
    ligue : "",
    zip : "",
    outdoor : 0,
    indoor : 1,
    countPlayers : 0,
    countPlayers1AN : 0,
    countTeams : 0,
    countTeams1AN : 0,
    school : "",
    location : {
      address : "",
      city : "",
      pos : [ 0, 0 ]
    },
    dates : {
      update : "",
      creation : new Date()
    },
    updated_at : new Date()
  },  

  initialize : function() {

  },

  sync : function(method, model, options) {

    /*
     * var params = _.extend({ type: 'GET', dataType: 'json', url: model.url(),
     * processData:false }, options);
     * 
     * return $.ajax(params);
     */
    console.log("method Club "+method);
    
    if (method === 'create') {


      var object = {
          
          sport: "tennis",
          name: this.get('name'),
          location : {
            pos: (this.get('pos') || ''),
            address: (this.get('address') || ''),
            zip: (this.get('zip') || ''),
            city: (this.get('city') || '')
          }
         
      };

      console.log('Create Club POST', JSON.stringify(object));

      return $.ajax({
        dataType : 'json',
        url : Y.Conf.get("api.url.clubs"),
        type : 'POST',
        data : object,
        success : function(result) {
          console.log('data result Club', result);
          
          if (result.id !== null)
            $('span.success').html('Enregistrement OK ' + data.id).show();
          else
            $('span.success').html('Erreur').show();
          
        }
      });

    }
    else {
      model.url = Y.Conf.get("api.url.clubs")+this.id;
      return Backbone.sync(method, model, options);
    }

  }


});

var GamesCollection = Backbone.Collection.extend({
  	 
	model:GameModel, 
	
	mode:'default',
	latitude:null,
	longitude:null,
	
	initialize: function (param) {	
		this.changeSort("city");		

		if (param==='follow')
			this.storage = new Offline.Storage('gamesfollow', this);		

	},
	
		  
  url:function() {
    console.log('mode de games',this.mode); 	
          
    if (this.mode === 'clubid') 
      return Y.Conf.get("api.url.clubs") + "" + this.query + "/games/";    
    else if (this.mode === 'club') 
      return Y.Conf.get("api.url.games");
    else if (this.mode === 'player') 
      return Y.Conf.get("api.url.games") + "?q=" + this.query;
    else if (this.mode === 'me') {      
      // /v1/players/:id/games/  <=> cette url liste tous les matchs dans lequel un player joue / a jou�
	    // /v1/players/:id/games/?owned=true <=> cette url liste tous les matchs qu'un player poss�de (qu'il a cr��)
      return Y.Conf.get("api.url.players") + this.query + "/games/";
    }
    else if (this.mode === 'geolocation' && this.latitude!==null && this.longitude!==null) { 
      return Y.Conf.get("api.url.games") + "?distance=30&latitude="+this.latitude+"&longitude="+this.longitude;
    }
    return Y.Conf.get("api.url.games");	
  },
  
  setMode:function(m,q) {
    this.mode=m;
    this.query=q;
  },
  
  setPos:function(lat,long) {
    this.latitude=lat;
    this.longitude=long;
  },  
  
	//FIXME : if exists in localStorage, don't request
	/*
  sync: function(method, model, options) {
    
  //checkConnection();
  //console.log('etat du tel ',appConfig.networkState);
    
  console.log(' On est dans Games Collection avec '+model.url());
    
    return Backbone.sync(method, model, options); 
      
  },
  */
    
    
  /* ON AFFICHE QUE EN FCT DES IDS */
  //filterWithIds: function(ids) {
  //	return _(this.models.filter(function(c) { return _.include(ids, Game.id); }));
//},
    
  /*
  comparator: function(item) {
    //POSSIBLE MULTI FILTER [a,b,..]
      return [item.get("city")];
    },
  */
    
  comparator: function (property) {
    return selectedStrategy.apply(Game.get(property));
  },
    
  strategies: {
      city: function (item) { return [item.get("city")]; }, 
      status: function (item) { return [item.get("status")]; },
      player: function (item) { return [item.get("teams[0].players[0].name"),item.get("teams[1].players[0].name")]; },
  },
    
  changeSort: function (sortProperty) {
      this.comparator = this.strategies[sortProperty];
  }
});


var PlayersCollection = Backbone.Collection.extend({
  model: PlayerModel, 
  		
  mode: 'default',
  	
  query: '',
 	
	initialize: function (param) {
		this.changeSort("name");
		
		//console.log('Players mode '+param);
		
		if (param==='follow')
			this.storage = new Offline.Storage('playersfollow', this);		

	},
	  
  url:function() {
    //console.log('url() : mode de Players',this.mode); 	
    //console.log('url Players', Y.Conf.get("api.url.players")+'autocomplete/?q='+this.query); 	
          
    if (this.mode === 'club')
      return Y.Conf.get("api.url.players")+'?club='+this.query;
    else if (this.mode === 'search'  )
      return Y.Conf.get("api.url.players")+'autocomplete/?q='+this.query;        
    else	
      return Y.Conf.get("api.url.players");
  },
	
	setMode:function(m,q) {
    this.mode=m;
    this.query=q;
  },
    
  comparator: function (property) {
    return selectedStrategy.apply(Game.get(property));
  },

  strategies : {
    name : function(item) { return [ item.get("name") ] }
  , nickname : function(item) { return [ item.get("nickname") ] }
  , rank : function(item) { return [ item.get("rank") ] }
  },

  changeSort : function(sortProperty) {
    this.comparator = this.strategies[sortProperty];
  }
});

var ClubsCollection = Backbone.Collection.extend({

  model : ClubModel,

  mode : 'default',

  query : '',

  // storeName : "club",

  initialize : function(param) {

    if (param === 'follow')
      this.storage = new Offline.Storage('clubsfollow', this);

  },

  url : function() {

    if (this.mode === 'search')
      return Y.Conf.get("api.url.clubs") + 'autocomplete/?q=' + this.query;
    else
      return Y.Conf.get("api.url.clubs");

  },

  setMode : function(m, q) {
    this.mode = m;
    this.query = q;
  },

  // FIXME : if exists in localStorage, don't request
  sync : function(method, model, options) {

    return Backbone.sync(method, model, options);

  },

});

var AccountView = Backbone.View.extend({
  el : "#index",

  events : {
    'vclick #debug' : 'debug'
  },

  pageName: "account",

  initialize : function() {
    
    this.accountViewTemplate = Y.Templates.get('accountViewTemplate');
    
    this.Owner = JSON.tryParse(window.localStorage.getItem("Y.Cache.Player"));

    console.log('DEV Time init',new Date().getTime());
    
    
    this.render();
  },

  debug : function() {
    console.log('synchro');
    //players = new PlayersCollection('me');
    //players.storage.sync.push();

    //players = new PlayersCollection();
    //players.storage.sync.push();

    // games = new GamesCollection();
    // games.storage.sync.push();
  },

  // render the content into div of view
  render : function() {
    
    console.log('DEV Time render Begin',new Date().getTime());

    $(this.el).html(this.accountViewTemplate({
      Owner : this.Owner
    }));

    $(this.el).trigger('pagecreate');

    // this.$el.html(this.accountViewTemplate(),{Owner:Owner});
    // $.mobile.hidePageLoadingMsg();
    // this.$el.trigger('pagecreate');
    
    console.log('DEV Time render End',new Date().getTime());
    
    return this;
  },

  onClose : function() {
    this.undelegateEvents();
  }
});
var ClubView = Backbone.View.extend({
  el : "#index",

  events : {
    'vclick #followButton' : 'follow'
  },

  pageName: "club",

  initialize : function() {
    this.clubViewTemplate = Y.Templates.get('clubViewTemplate');

    this.club = new ClubModel({
      id : this.id
    });
    this.club.fetch();

    // this.render();
    this.club.on('change', this.render, this);
  },

  follow : function() {
    this.clubsfollow = new ClubsCollection('follow');
    this.clubsfollow.create(this.club);
  },

  // render the content into div of view
  render : function() {
    this.$el.html(this.clubViewTemplate({
      club : this.club.toJSON()
    }));

    $.mobile.hidePageLoadingMsg();

    // Trigger jquerymobile rendering
    // var thisel=this.$el;
    // this.$el.on( 'pagebeforeshow',function(event){
    // thisel.trigger('pagecreate');
    // });
    // return to enable chained calls
    this.$el.trigger('pagecreate');
    return this;
  },

  onClose : function() {
    this.undelegateEvents();
    this.club.off("change", this.render, this);
    // this.$el.off('pagebeforeshow');
  }
});
var ClubAddView = Backbone.View.extend({
  el: "#index",

  events: {
    'submit form#frmAddClub': 'addClub'
  },

  pageName: "clubAdd",

  initialize: function () {

    this.clubAddTemplate = Y.Templates.get('clubAddTemplate');

    this.Owner = JSON.tryParse(window.localStorage.getItem("Y.Cache.Player"));

    this.render();
    $.mobile.hidePageLoadingMsg();
  },

 

  addClub: function (event) {

    console.log('add Club');
    
    var name = $('#name').val()
    , city = $('#city').val();
    
    var club = new ClubModel({
      name: name
    , city: city          
    });

    console.log('club form envoie ',club.toJSON());
  
    club.save();    
   
    return false;
  },

  //render the content into div of view
  render: function () {
    this.$el.html(this.clubAddTemplate({ playerid: this.Owner.id, token: this.Owner.token }));
    this.$el.trigger('pagecreate');
    return this;
  },

  onClose: function () {
    //Clean
    this.undelegateEvents();

  }
});
var GameView = Backbone.View.extend({
      el : "#index",
      
      displayViewScoreBoard : "#displayViewScoreBoard",
      // Flux des commentaires
      // FIXME: sort by priority
      incomingComment : "#incomingComment",      
      
      events : {
        'vclick #setPlusSetButton' : 'setPlusSet',
        'vclick #setMinusSetButton' : 'setMinusSet',
        'vclick #setPointWinButton' : 'setPointWin',
        'vclick #setPointErrorButton' : 'setPointError',
        'vclick #endButton' : 'endGame',
        'vclick #followButton' : 'followGame',
        'vclick #cancelButton' : 'cancelGame',
        'submit #frmAttachment' : 'submitAttachment',
        "keypress #messageText" : "updateOnEnter",
        'vclick #team1_set1_div' : 'setTeam1Set1',
        'vclick #team1_set2_div' : 'setTeam1Set2',
        'vclick #team1_set3_div' : 'setTeam1Set3',
        'vclick #team2_set1_div' : 'setTeam2Set1',
        'vclick #team2_set2_div' : 'setTeam2Set2',
        'vclick #team2_set3_div' : 'setTeam2Set3',
        'vclick #commentDeleteButton' : 'commentDelete',
        'vclick #commentSendButton' : 'commentSend'
      },

      pageName: "game",

      initialize : function() {
        // FIXME : temps de rafrichissement selon batterie et selon forfait
        this.gameViewTemplate = Y.Templates.get('gameViewTemplate');
        this.gameViewScoreBoardTemplate = Y.Templates
            .get('gameViewScoreBoardTemplate');
        this.gameViewCommentListTemplate = Y.Templates
            .get('gameViewCommentListTemplate');

        this.Owner = JSON.tryParse(window.localStorage.getItem("Y.Cache.Player"));

        this.score = new GameModel({id : this.id});
        this.score.fetch();

        //this.render();
        this.score.on("all",this.render,this);

        var games = Y.Conf.get("owner.games.followed");
        if (games !== undefined)
        {
          if (games.indexOf(this.id) === -1) {
            this.follow = 'false';
          }
          else
            this.follow = 'true';          
        }
        else
          this.follow = 'false';
        
        var options = {
          // default delay is 1000ms
          // FIXME : on passe sur 30 s car souci avec API
          delay : Y.Conf.get("game.refresh")
        // data: {id:this.id}
        };

        // FIXME: SI ONLINE
        
        poller = Backbone.Poller.get(this.score, options)
        poller.start();
        poller.on('success', this.getObjectUpdated, this);
        
        //this.score.on("all",this.renderRefresh,this);
        
        
      },

      commentDelete : function() {
        // messageText
        $('#messageText').value(' ');
      },

      updateOnEnter : function(e) {
        if (e.keyCode == 13) {
          console.log('touche entr�e envoie le commentaire');
          this.commentSend();
        }
      },

      commentSend : function() {
        var playerid = $('#playerid').val()
        , token  = $('#token').val()
        , gameid = $('#gameid').val()
        , comment = $('#messageText').val();

        var stream = new StreamModel({
          type : "comment",
          playerid : playerid,
          token : token,
          text : comment,
          gameid : gameid
        });
        // console.log('stream',stream);
        stream.save();

        $('#messageText').val();
      },

      setTeamSet : function(input, div) {
        if ($.isNumeric(input.val()))
          set = parseInt(input.val(), 10) + 1;
        else
          set = '1';

        input.val(set);
        div.html(set);
        this.sendUpdater();
      },

      setTeam1Set1 : function() {
        this.setTeamSet($('#team1_set1'), $('#team1_set1_div'));
      },

      setTeam1Set2 : function(options) {
        this.setTeamSet($('#team1_set2'), $('#team1_set2_div'));
      },

      setTeam1Set3 : function() {
        this.setTeamSet($('#team1_set3'), $('#team1_set3_div'));
      },

      setTeam2Set1 : function() {
        this.setTeamSet($('#team2_set1'), $('#team2_set1_div'));
      },

      setTeam2Set2 : function() {
        this.setTeamSet($('#team2_set2'), $('#team2_set2_div'));
      },

      setTeam2Set3 : function() {
        this.setTeamSet($('#team2_set3'), $('#team2_set3_div'));
      },

      submitAttachment : function(data) {
        // formData = new FormData($(this)[0]);
        console.log('date-form', data);

        /*
         * $.ajax({ type:'POST', url:urlServiceUpload, data:formData,2
         * contentType: false, processData: false, error:function (jqXHR,
         * textStatus, errorThrown) { alert('Failed to upload file') },
         * success:function () { alert('File uploaded')
         */
        return false;
      },

      sendUpdater : function() {
        // console.log('action setPlusSet avec
        // '+$('input[name=team_selected]:checked').val());

        // ADD SERVICE
        var gameid = $('#gameid').val(), team1_id = $('#team1_id').val(), team1_points = $(
            '#team1_points').val(), team1_set1 = $('#team1_set1').val(), team1_set2 = $(
            '#team1_set2').val(), team1_set3 = $('#team1_set3').val(), team2_id = $(
            '#team2_id').val(), team2_points = $('#team2_points').val(), team2_set1 = $(
            '#team2_set1').val(), team2_set2 = $('#team2_set2').val(), team2_set3 = $(
            '#team2_set3').val(), playerid = $('#playerid').val(), token = $(
            '#token').val(), tennis_update = null;

        if ($.isNumeric(team1_set1) === false)
          team1_set1 = '0';
        if ($.isNumeric(team2_set1) === false)
          team2_set1 = '0';

        var sets_update = team1_set1 + '/' + team2_set1;

        if (team1_set2 > 0 || team2_set2 > 0) {
          if ($.isNumeric(team1_set2) === false)
            team1_set2 = '0';
          if ($.isNumeric(team2_set2) === false)
            team2_set2 = '0';

          sets_update += ";" + team1_set2 + '/' + team2_set2;
        }
        if (team1_set3 > 0 || team2_set3 > 0) {

          if ($.isNumeric(team1_set3) === false)
            team1_set3 = '0';
          if ($.isNumeric(team2_set3) === false)
            team2_set3 = '0';

          sets_update += ";" + team1_set3 + '/' + team2_set3;
        }

        // FIXME : On remplace les espaces par des zeros
        // sets_update = sets_update.replace(/ /g,'0');

        // console.log('sets_update',sets_update);

        tennis_update = new GameModel({
          sets : sets_update,
          team1_points : team1_points,
          team2_points : team2_points,
          id : gameid,
          team1_id : team1_id,
          team2_id : team2_id,
          playerid : playerid,
          token : token
        });

        // console.log('setPlusSet',tennis_update);

        tennis_update.save();

        // FIXME: on ajoute dans le stream
        var stream = new StreamModel({
          type : "score",
          playerid : playerid,
          token : token,
          text : sets_update,
          gameid : gameid
        });
        // console.log('stream',stream);
        stream.save();
      },

      setPlusSet : function() {
        var selected = $('input[name=team_selected]:checked').val();
        var set = parseInt($('#team' + selected + '_set1').val(), 10) + 1;
        // console.log(set);

        // FIXME : Regle de Gestion selon le score

        $('#team' + selected + '_set1').val(set);
        $('#team' + selected + '_set1_div').html(set);

        this.sendUpdater();
      },

      setMinusSet : function() {
        var selected = $('input[name=team_selected]:checked').val();
        var set = parseInt($('#team' + selected + '_set1').val(), 10) - 1;
        console.log(set);

        if (set < 0)
          set = 0;
        // FIXME : Regle de Gestion selon le score

        $('#team' + selected + '_set1').val(set);
        $('#team' + selected + '_set1_div').html(set);

        this.sendUpdater();
      },

      setPoint : function(mode) {
        // 15 30 40 AV
        var selected = $('input[name=team_selected]:checked').val(), selected_opponent = '';

        // le serveur gagne un point
        if (mode == true) {
          if (selected == '2') {
            selected_opponent = '2';
          } else
            selected_opponent = '1';
        }
        // le serveur perd un point
        else {
          if (selected == '2') {
            selected = '1';
            selected_opponent = '2';
          } else
            selected = '2';
          selected_opponent = '1';
        }

        var set_current = $('input[name=set_current]:checked').val(), point = $(
            '#team' + selected + '_points').val(), point_opponent = $(
            '#team' + selected_opponent + '_points').val();

        // Le serveur gagne son set
        if (point == 'AV'
            || (point == '40' && (point_opponent != '40' || point_opponent != 'AV'))) {
          // On ajoute 1 set au gagnant les point repartent � zero
          var set = parseInt(
              $('#team' + selected + '_set' + set_current).val(), 10) + 1;
          $('#team' + selected + '_set1').val(set);
          $('#team' + selected + '_set1_div').html(set);

          point = '00';
          $('#team1_points').val(point);
          $('#team1_points_div').html(point);
          $('#team2_points').val(point);
          $('#team2_points_div').html(point);
        } else {
          if (point === '00')
            point = '15';
          else if (point === '15')
            point = '30';
          else if (point === '30')
            point = '40';
          else if (point === '40')
            point = 'AV';
          else if (point === 'AV')
            point = '00';
          else {
            point = '00';
            // On met l'adversaire � z�ro
            $('#team' + selected_opponent + '_points').val(point);
            $('#team' + selected_opponent + '_points_div').html(point);
          }

          $('#team' + selected + '_points').val(point);
          $('#team' + selected + '_points_div').html(point);
        }
        this.sendUpdater();
      },

      setPointWin : function() {
        console.log('setPointWin');
        this.setPoint(true);
      },

      setPointError : function() {
        console.log('setPointError');
        this.setPoint(false);
      },
      
      
      getObjectUpdated: function() {
        this.score.on("all",this.renderRefresh,this);     
      },

      // render the content into div of view
      renderRefresh : function() {
        
        //console.log('renderRefresh');
        
        $(this.displayViewScoreBoard).html(this.gameViewScoreBoardTemplate({
          game : this.score.toJSON(),
          Owner : this.Owner
        }));
             
        
        $(this.displayViewScoreBoard).trigger('create');

        // if we have comments
        if (this.score.toJSON().stream !== undefined) {
          
          $(this.incomingComment).html(this.gameViewCommentListTemplate({
            streams : this.score.toJSON().stream.reverse(),
            query : ' '
          }));

          $(this.incomingComment).listview('refresh',true);
        }
        
        //return this;
        return false;
      },

      render : function() {
        // On rafraichit tout
        // FIXME: refresh only input and id
        this.$el.html(this.gameViewTemplate({
          game : this.score.toJSON(),
          Owner : this.Owner,
          follow : this.follow
        }));

        $.mobile.hidePageLoadingMsg();
        this.$el.trigger('pagecreate');

        return this;
      },

      alertDismissed : function() {
        // do something
      },

      endGame : function() {
        //window.location.href = '#games/end/' + this.id;
        Y.Router.navigate("/#games/end/"+this.id, true)
      },

      followGame : function() {

        if (this.follow === 'true') {
          //this.gamesfollow = new GamesCollection('follow');

          console.log('On ne suit plus nofollow ' + this.id);

          //this.gamesfollow.storage.remove(this.scoreboard);
          var games = Y.Conf.get("owner.games.followed");
          if (games !== undefined)
          {
            if (games.indexOf(this.id) === -1) {
              //On retire l'elmt
              games.splice(games.indexOf(this.id), 1);
              Y.Conf.set("Owner.games.followed", games);
            }
          }
          
          $('span.success').html('Vous ne suivez plus ce match').show();
          // $('#followPlayerButton').html('Suivre ce joueur');
          $("#followButton .ui-btn-text").text("Suivre");

          this.follow = 'false';

        } else {

          //Via backbone.offline
          //this.gamesfollow = new GamesCollection('follow');
          //this.gamesfollow.create(this.scoreboard);
          
          //Via localStorage
          var games = Y.Conf.get("owner.games.followed");
          if (games !== undefined)
          {
            if (games.indexOf(this.id) === -1) {
              games.push(this.id);
              Y.Conf.set("Owner.games.followed", games);
            }
          }
          else
            Y.Conf.set("Owner.games.followed", [this.id]);

          $('span.success').html('Vous suivez ce joueur').show();
          // $('#followPlayerButton').html('Ne plus suivre ce joueur');
          $("#followButton .ui-btn-text").text("Ne plus suivre");

          this.follow = 'true';

        }

        this.$el.trigger('pagecreate');

      },

      cancelGame : function() {

        console.log('On retire la derniere action');

      },

      onClose : function() {
        // Clean
        this.undelegateEvents();
        this.score.off("all",this.render,this);
        //this.score.off("all",this.renderRefresh,this);
        
        // FIXME:remettre
        poller.stop();
        poller.off('success', this.renderRefresh, this);

        // FIXME:
        // poller.off('complete', this.render, this);
        // this.$el.off('pagebeforeshow');
      }
    });
var GameAddView = Backbone.View.extend({
  el: "#index",

  events: {
    'submit form#frmAddGame': 'addGame',
    'change #myself': 'updateTeam1',
    'change #team1': 'changeTeam1',
    'keyup #team1': 'updateListTeam1',
    'keyup #team2': 'updateListTeam2',
    'click #team1_choice': 'displayTeam1',
    'click #team2_choice': 'displayTeam2'
  },

  pageName: "gameAdd",

  listview1: "#team1_suggestions",
  listview2: "#team2_suggestions",

  initialize: function () {
    this.playerListAutoCompleteViewTemplate = Y.Templates.get('playerListAutoCompleteViewTemplate');
    this.gameAddTemplate = Y.Templates.get('gameAddTemplate');

    this.Owner = JSON.tryParse(window.localStorage.getItem("Y.Cache.Player"));
    //this.players = new PlayersCollection('me');
    //console.log('Owner',this.players.storage.findAll({local:true}));	   	
    //this.Owner = new PlayerModel(this.players.storage.findAll({ local: true }));


    this.render();
    $.mobile.hidePageLoadingMsg();
  },

  displayTeam1: function (li) {
    selectedId = $('#team1_choice:checked').val();
    selectedName = $('#team1_choice:checked').next('label').text();
    selectedRank = $('#team1_choice:checked').next('label').next('label').text();
    //$('label[for=pre-payment]').text();

    $('#team1').val($.trim(selectedName));
    $('#rank1').val($.trim(selectedRank));
    $('#team1_id').val(selectedId);
    $('team1_error').html('');

    //console.log('selected '+selectedId+' '+selectedName);

    $(this.listview1).html('');
    $(this.listview1).listview('refresh');
  },

  displayTeam2: function (li) {
    selectedId = $('#team2_choice:checked').val();
    selectedName = $('#team2_choice:checked').next('label').text();
    selectedRank = $('#team2_choice:checked').next('label').next('label').text();
    //$('label[for=pre-payment]').text();

    $('#team2').val($.trim(selectedName));
    $('#rank2').val($.trim(selectedRank));
    $('#team2_id').val(selectedId);
    $('team2_error').html('');

    //console.log('selected '+selectedId+' '+selectedName);

    $(this.listview2).html('');
    $(this.listview2).listview('refresh');
  },

  fetchCollection: function () {
    if (this.collectionFetched) return;

    //this.usersCollection.fetch();
    /*
    this.userCollection.fetch({ url: Y.Conf.get("api.url.players")+'97e2f09341b45294f3cd2699', success: function() {
    console.log('usersCollection 2',this.userCollection);
    }});        */
    //Games.fetch();

    this.collectionFetched = true;
  },

  changeTeam1: function () {
    if ($('#myself').attr('checked') !== undefined) {
      console.log($('#myself').attr('checked'));

      //Si Owner.name == : On update objet Player
      if (Owner.name === '') {
        player = new Player({
          id: Owner.id,
          token: Owner.token,
          name: Owner.name,
          nickname: Owner.nickname,
          password: Owner.password,
          rank: Owner.rank,
          club: Owner.club
        });

        console.log('Player gameadd', player)

        player.save();
      }
    }
  },

  updateTeam1: function () {
    $('#team1').val(this.Owner.name);
    $('#rank1').val(this.Owner.rank);
    $('#team1_id').val(this.Owner.id);
  },

  updateListTeam1: function (event) {
    if ($('#myself').attr('checked') === undefined) {
      var q = $("#team1").val();

      this.playersTeam1 = new PlayersCollection();
      this.playersTeam1.setMode('search', q);
      if (q.length > 2) {
        this.playersTeam1.fetch();
        this.playersTeam1.on('all', this.renderListTeam1, this);
      }
    }
  },

  renderListTeam1: function () {
    var q = $("#team1").val();
    $(this.listview1).html(this.playerListAutoCompleteViewTemplate({ players: this.playersTeam1.toJSON(), query: q, select: 1 }));
    $(this.listview1).listview('refresh');
  },


  updateListTeam2: function (event) {
    var q = $("#team2").val();
    this.playersTeam2 = new PlayersCollection();
    this.playersTeam2.setMode('search', q);
    if (q.length > 2) {
      this.playersTeam2.fetch();

      this.playersTeam2.on('all', this.renderListTeam2, this);
    }

  },

  renderListTeam2: function () {
    var q = $("#team2").val();
    $(this.listview2).html(this.playerListAutoCompleteViewTemplate({ players: this.playersTeam2.toJSON(), query: q, select: 2 }));
    $(this.listview2).listview('refresh');
  },

  addGame: function (event) {
    var team1 = $('#team1').val()
      , rank1 = $('#rank1').val()
      , team1_id = $('#team1_id').val()
      , team2 = $('#team2').val()
      , rank2 = $('#rank2').val()
      , team2_id = $('#team2_id').val()
      , city = $('#city').val()
      , playerid = $('#playerid').val()
      , token = $('#token').val()
      , court = $('#court').val()
      , surface = $('#surface').val()
      , tour = $('#tour').val()
      , subtype = $('#subtype').val()
      , game = null;

    if (team1 === '' && team1_id === '') {
      //alert('Il manque le joueur 1 '+$('#myself').attr('checked'));
      $('span.team1_error').html('Vous devez indiquer un joueur !').show();
      return false;
    }

    if (rank1 === '') {
      //alert('Il manque le joueur 1 '+$('#myself').attr('checked'));
      $('span.team1_error').html('Vous devez indiquer le classement !').show();
      return false;
    }

    if (team2 === '' && team2_id === '') {
      $('span.team2_error').html('Vous devez indiquer un joueur !').show();
      return false;
    }

    if (rank2 === '') {
      //alert('Il manque le joueur 1 '+$('#myself').attr('checked'));
      $('span.team2_error').html('Vous devez indiquer le classement !').show();
      return false;
    }

    var game = {
		team1 : $('#team1').val()
      , rank1 : $('#rank1').val()
      , team1_id : $('#team1_id').val()
      , team2 : $('#team2').val()
      , rank2 : $('#rank2').val()
      , team2_id : $('#team2_id').val()
      , city : $('#city').val()
      , playerid : $('#playerid').val()
      , token : $('#token').val()
      , court : $('#court').val()
      , surface : $('#surface').val()
      , tour : $('#tour').val()
      , subtype : $('#subtype').val()
    };

	/*
    if (team1_id.length > 2)
      game.teams[0].players[0].id = team1_id;
    else
      game.teams[0].players[0].name = team1;

    if (team2_id.length > 2)
      game.teams[1].players[0].id = team2_id;
    else
      game.teams[1].players[0].name = team2;
	*/
	
    console.log('gameadd on envoie objet ', game);

    //On sauve dans Collections
    var gameNew = new GameModel(game);
    var gameCache = gameNew.save();

	//On stocke dans le localStorage
    //Y.Conf.set("Y.Cache.Game"+data.id, gameCache.id, { permanent: true })

    //console.log('gamecache.id ', gameCache.id);

    //if (gamecache.id !== 'undefined') {
      //Backbone.Router.navigate("/#games/"+gamecache.id, true);
      //window.location.href = '#games/' + gameCache.id;
    //}
    
    
    return false;
  },

  //render the content into div of view
  render: function () {
    this.$el.html(this.gameAddTemplate({ playerid: this.Owner.id, token: this.Owner.token }));
    this.$el.trigger('pagecreate');
    return this;
  },

  onClose: function () {
    //Clean
    this.undelegateEvents();
    if (this.playersTeam1 !== undefined) this.playersTeam1.off("all", this.renderListTeam1, this);
    if (this.playersTeam2 !== undefined) this.playersTeam2.off("all", this.renderListTeam2, this);
  }
});
var GameEndView = Backbone.View.extend({
  el:"#index",

  events: {
    'submit form#frmEndGame':'endGame'
  },

  pageName: "gameEnd",
    
  initialize:function() {
    this.gameEndTemplate = Y.Templates.get('gameEndTemplate');
    Owner = JSON.tryParse(window.localStorage.getItem("Y.Cache.Player"));
    //this.players = new PlayersCollection("me");
    //this.Owner = new PlayerModel(this.players.storage.findAll({local:true}));  
    this.render();
    $.mobile.hidePageLoadingMsg(); 
  },
  
  endGame: function (event) {
    var privateNote = $('#privateNote').val(),
    fbNote = $('#fbNote').val();
        
    //Backbone.Router.navigate("/#games/"+game.id, true);
    alert(privateNote+' '+fbNote);
    return false;
  },
  
  //render the content into div of view
  render: function(){
	  this.$el.html(this.gameEndTemplate({playerid:Owner.id, token:Owner.token}));
	  this.$el.trigger('pagecreate');
	  return this;
  },

  onClose: function(){
    this.undelegateEvents();
  }
});
var GameFollowView = Backbone.View.extend({
  el:"#index",

  listview:"#listGamesView",
    
  events: {
    "keyup input#search-basic": "search"
  },

  pageName: "gameFollow",

  initialize:function() {
    this.indexViewTemplate = Y.Templates.get('indexViewTemplate');
    this.gameListViewTemplate = Y.Templates.get('gameListViewTemplate');
        
    $.mobile.showPageLoadingMsg();
        
    this.games = new GamesCollection('follow');
    this.gamesfollow = new GamesCollection(this.games.storage.findAll({local:true}));
		
    this.render();
        
    //this.games.on( 'all', this.renderList, this );
    //this.games.on("all", this.renderList, this);
    //this.games.findAll();
        
    //$.mobile.showPageLoadingMsg();
    this.renderList();
  },
    
  search:function() {
    //FIXME if($("#search-basic").val().length>3) {
    var q = $("#search-basic").val();
    $(this.listview).empty();
    //gamesList = new GamesSearch();
    //gamesList.setQuery(q);
    //gamesList.fetch();
    this.games.setMode('player',q);
    this.games.fetch();
    $(this.listview).html(this.gameListViewTemplate({games:this.games.toJSON(), query:q}));
    $(this.listview).listview('refresh');
    //}
    return this;
  },

  //render the content into div of view
  render: function(){
    this.$el.html(this.indexViewTemplate(), {});
    //Trigger jquerymobile rendering
    this.$el.trigger('pagecreate');
      
    //return to enable chained calls
    return this;
  },

  renderList: function(query) {
    console.log('renderList');
    
    $(this.listview).html(this.gameListViewTemplate({games:this.gamesfollow.toJSON(),query:' '}));
    $(this.listview).listview('refresh');
    $.mobile.hidePageLoadingMsg();
    return this;
  },
  
  onClose: function() {
    this.undelegateEvents();
    //this.games.off("all",this.renderList,this);
  }
});

var GameListView = Backbone.View.extend({
  el:"#index",
    
  events: {
      "keyup input#search-basic": "search"
  },

  listview:"#listGamesView",
  
  pageName: "gameList",

  mode:'',

  initialize: function(data) {
    this.gameListTemplate = Y.Templates.get('gameListTemplate');
    this.gameListViewTemplate = Y.Templates.get('gameListViewTemplate');
    
    $.mobile.showPageLoadingMsg();
        
    console.log('gamelist mode ', data);
        
    if (data.mode==='club') {
      this.games = new GamesCollection();
      this.games.setMode('clubid',data.clubid);	
    } else if (data.mode==='me') {
      this.games = new GamesCollection();
      this.games.setMode('me',data.id);	
    } else {
      this.games = new GamesFollow();
    }
        	
    this.mode = data.mode;
        
    this.games.fetch();

    this.render();
        
    this.games.on("all", this.renderList, this);
        
    //$.mobile.showPageLoadingMsg();
  },


  search:function() {
    //FIXME if($("#search-basic").val().length>3) {
    var q = $("#search-basic").val();
    $(this.listview).empty();
    //gamesList = new GamesSearch();
    //gamesList.setQuery(q);
    //gamesList.fetch();
    this.games.setMode('player',q);
    this.games.fetch();          
    $(this.listview).html(this.gameListViewTemplate({games:this.games.toJSON(),query:q}));
    $(this.listview).listview('refresh');
    //}
    return this;
  },

  //render the content into div of view
  render: function(){
    this.$el.html(this.gameListTemplate({mode:this.mode}));
    //Trigger jquerymobile rendering
    this.$el.trigger('pagecreate');
    //return to enable chained calls
    return this;
  },

  renderList: function(query) {
    console.log('renderList');
    
    $(this.listview).html(this.gameListViewTemplate({games:this.games.toJSON(),query:' '}));
    $(this.listview).listview('refresh');
    $.mobile.hidePageLoadingMsg();
    return this;
  },
  
  onClose: function(){
    this.undelegateEvents();
    this.games.off("all",this.renderList,this);
  }
});
var IndexView = Backbone.View.extend({
  el: "#index",

  events: {
    "keyup input#search-basic": "search"
  },

  listview: "#listGamesView",

  pageName: "index",

  initialize: function () {
    //this.indexViewTemplate = Y.Templates.get('indexViewTemplate');
    this.gameListViewTemplate = Y.Templates.get('gameListViewTemplate');

    //we capture config from bootstrap
    //FIXME: put a timer
    //this.config = new Config();
    //this.config.fetch();

    this.games = new GamesCollection();
    this.games.fetch();

    //console.log('on pull');
    //this.games.storage.sync.pull();   

    this.render();

    //console.log('this.games in cache size ',this.games.length);

    this.games.on('all', this.renderList, this);
    
    //Controle si localStorage contient Owner
    var Owner = window.localStorage.getItem("Y.Cache.Player");


    if (Owner === null) {
      //alert('Pas de owner');
      //Creation user � la vol�e
      console.log('Pas de Owner, on efface la cache . On cr�e le Ownner');
        
      //debug si pas de Owner, on init le localStorage
      window.localStorage.removeItem("Y.Cache.Player");

      player = new PlayerModel();
      player.save();
      //players = new PlayersCollection('me');
      //players.create();
    }
    else {
      Y.Geolocation.on("change", function (longitude, latitude) { 
        
        var Owner = JSON.tryParse(window.localStorage.getItem("Y.Cache.Player"));
        //console.log("On m�morise la Geoloc OK pour playerid :"+Owner.id);
        
        //On sauve avec les coord actuels
        player = new PlayerModel({
           latitude : latitude
         , longitude : longitude
         , playerid : Owner.id
         , token : Owner.token
        });
        player.save();
        
        this.games = new GamesCollection();
        this.games.setMode('geolocation','');
        this.games.setPos(latitude,longitude);
        this.games.fetch();
        this.games.on('all', this.renderList, this);
        
        
      });
    }
    
  },

  search: function () {
    //FIXME if($("#search-basic").val().length>3) {
    var q = $("#search-basic").val();
    $(this.listview).empty();
    //gamesList = new GamesSearch();
    //gamesList.setQuery(q);
    //gamesList.fetch();
    this.games.setMode('player', q);
    this.games.fetch();
    $(this.listview).html(this.gameListViewTemplate({ games: this.games.toJSON(), query: q }));
    $(this.listview).listview('refresh');
    //}
    return this;
  },

  render: function () {
    //this.$el.html(this.indexViewTemplate(), {});
    //Trigger jquerymobile rendering
    //this.$el.trigger('pagecreate');
    
    new Y.FastButton(document.querySelector("#mnufollow"), function () { Y.Router.navigate('#', true);});
    new Y.FastButton(document.querySelector("#mnudiffuse"), function () { Y.Router.navigate('#games/add', true);});
    new Y.FastButton(document.querySelector("#mnuaccount"), function () { Y.Router.navigate('#account', true);});
            
    return this;
  },

  renderList: function (query) {
  
 	//console.log('renderList games:',this.games.toJSON());
  
    $(this.listview).html(this.gameListViewTemplate({ games: this.games.toJSON(), query: ' ' }));
    $(this.listview).listview('refresh');
    $.mobile.hidePageLoadingMsg();
    return this;
  },

  onClose: function () {
    this.undelegateEvents();
    this.games.off("all", this.renderList, this);
    
  }
});
var PlayerView = Backbone.View.extend({
  el:"#index",

  events: {
    'vclick #followPlayerButton': 'followPlayer'
  },

  pageName: "player",

  initialize: function(options) {
    this.playerViewTemplate = Y.Templates.get('playerViewTemplate');

	//console.log('player init '+this.id);

    this.player = new PlayerModel({id:this.id});
    this.player.fetch(); 

    //console.log('Player',this.player.toJSON());
    
    // control if player id in playersfollow
    this.playersfollow = new PlayersCollection('follow');

    result = this.playersfollow.storage.find({id:this.id});
    if (result===null) 
    	this.follow = 'false';
    else	
    	this.follow = 'true';

    //change
    this.player.on( 'change', this.render, this );
  },

  followPlayer: function() {
    if (this.follow==='true') 
    {
	    this.playersfollow = new PlayersCollection('follow');
	       
	    console.log('On ne suit plus nofollow '+this.id);
	       
	    this.playersfollow.storage.remove(this.player);
      
	    $('span.success').html('Vous ne suivez plus ce joueur').show();
	    //$('#followPlayerButton').html('Suivre ce joueur');
      $("#followButton .ui-btn-text").text("Suivre ce joueur");
	    this.follow = 'false';
    }
    else 
    {
      this.playersfollow = new PlayersCollection('follow');
      this.playersfollow.create(this.player);
      $('span.success').html('Vous suivez ce joueur').show();	
      //$('#followPlayerButton').html('Ne plus suivre ce joueur');	
      $("#followButton .ui-btn-text").text("Ne plus suivre ce joueur");
	    this.follow = 'true';
    }
		
    this.$el.trigger('pagecreate');
  },    

  //render the content into div of view
  render: function(){
    console.log('render player view ',this.player.toJSON());
    
    this.$el.html(this.playerViewTemplate({
      player:this.player.toJSON(),follow:this.follow
    }));
    $.mobile.hidePageLoadingMsg();
    this.$el.trigger('pagecreate');
    return this;
  },

  onClose: function(){
    this.undelegateEvents();
    this.player.off("change",this.render,this);   
    //this.$el.off('pagebeforeshow'); 
  }
});
var PlayerFollowView = Backbone.View.extend({
  el:"#index",
  
  events: {
    "keyup input#search-basic": "search"
  },

  listview:"#listPlayersView",

  pageName: "playerFollow",

  initialize:function() {
    this.playerListViewTemplate = Y.Templates.get('playerListViewTemplate');
    this.playerSearchTemplate = Y.Templates.get('playerSearchTemplate');

    $.mobile.showPageLoadingMsg();

    this.playersfollow = new PlayersCollection('follow');
    //On cherche que 
    this.playersfollow = new PlayersCollection(this.playersfollow.storage.findAll({local:true}));
    this.render();		
        
    console.log('players ',this.playersfollow.toJSON());
        	
    //this.players.on( 'all', this.renderList, this );
    this.renderList();
  },
  
  search:function() {
    //FIXME if($("#search-basic").val().length>3) {
    var q = $("#search-basic").val();
    $(this.listview).empty();    	  
    this.players.setMode('search',q);
    this.players.fetch();
    $(this.listview).html(this.playerListViewTemplate({players:this.playersfollow.toJSON(), query:q}));
    $(this.listview).listview('refresh');
    //}
  },

  //render the content into div of view
  render: function(){
    this.$el.html(this.playerSearchTemplate({}));
    //Trigger jquerymobile rendering
    this.$el.trigger('pagecreate');
    //return to enable chained calls
    return this;
  },

  renderList: function(query) {
    $(this.listview).html(this.playerListViewTemplate({players:this.playersfollow.toJSON(), query:' '}));
    $(this.listview).listview('refresh');
    $.mobile.hidePageLoadingMsg();
    return this;
  },

  onClose: function(){
    this.undelegateEvents();
    //this.players.off("all",this.renderList,this);   
  }
});
var PlayerFormView = Backbone.View.extend({
  el:"#index",
    
  events: {
    'submit form#frmAddPlayer':'add',
    'keyup #club': 'updateList',
    'click #club_choice' : 'displayClub'
  },
  
  listview:"#suggestions",

  pageName: "playerForm",
    
  clubs:null,

  initialize:function() {	
    this.playerFormTemplate = Y.Templates.get('playerFormTemplate');
    this.clubListAutoCompleteViewTemplate = Y.Templates.get('clubListAutoCompleteViewTemplate');
    
    this.Owner = JSON.tryParse(window.localStorage.getItem("Y.Cache.Player"));
    	
    this.player = new PlayerModel({id:this.Owner.id});
    this.player.fetch(); 
    	
    this.player.on( 'change', this.renderPlayer, this );  	 	
    $.mobile.hidePageLoadingMsg();
  },
  
  updateList: function (event) {
    var q = $("#club").val();

    //console.log('updateList');	  
   	//Utiliser ClubListViewTemplate
    //$(this.listview).html('<li><a href="" data-transition="slide">Club 1</a></li>');    	
    this.clubs = new ClubsCollection();
    this.clubs.setMode('search',q);
    if (q.length>2) {
      this.clubs.fetch();
      this.clubs.on( 'all', this.renderList, this );
    }
    //$(this.listview).listview('refresh');
  },
    
  renderList: function () {
    var q = $("#club").val();
    	
    console.log(this.clubs.toJSON());
    	
	  $(this.listview).html(this.clubListAutoCompleteViewTemplate({clubs:this.clubs.toJSON(), query:q}));
	  $(this.listview).listview('refresh');
  },
    
    
  displayClub: function(li) {
    selectedId = $('#club_choice:checked').val();
    selectedName = $('#club_choice:checked').next('label').text();
    	
    $('#club').val(selectedName);
    //FIXME : differencier idclub et fftid
    $('#clubid').val(selectedId); 
    $('club_error').html('');
    	
    //console.log('selected '+selectedId+' '+selectedName);
    	
    $(this.listview).html('');
    $(this.listview).listview('refresh');
  },
      
  add: function (event) {
    var name = $('#name').val()
      , nickname = $('#nickname').val()
      , password = $('#password').val()
      , email = $('#email').val()
      , rank = $('#rank').val()
      , playerid = $('#playerid').val()
      , token = $('#token').val()
      , club = $('#club').val()
      , clubid = $('#clubid').val()
      , idlicense = $('#idlicense').val()
      , player = null;
           

    var player = new PlayerModel({
        name: name
      , nickname: nickname
      , password: password
      , email: email
      , rank: rank                  	
      , playerid: playerid
      , idlicense:idlicense
      , token: token
      , club: club
      , clubid:clubid            
    });

    console.log('player form envoie ',player.toJSON());

    player.save();
   
    return false;
  },     
    

  //render the content into div of view
  renderPlayer: function(){
    	
    var dataDisplay = {
	      name:this.Owner.name
	    , nickname:this.Owner.nickname
	    , rank:this.Owner.rank
	    , password:this.Owner.password
	    , idlicense:this.Owner.idlicense
	    , playerid:this.Owner.id
	    , token:this.Owner.token
    };
      
    if (this.Owner.club!== undefined) {    
      dataDisplay.club = this.Owner.club.name;
      dataDisplay.idclub = this.Owner.club.id;      	
    }
    
    if (this.Owner.email!== undefined) {    
      dataDisplay.email = this.Owner.email.address;    
    }
    
    //player:this.player.toJSON(),playerid:Owner.id,token:Owner.token	
    this.$el.html(this.playerFormTemplate(dataDisplay));
    this.$el.trigger('pagecreate');
    return this;
  },

  onClose: function(){
    this.undelegateEvents();
    this.player.off("change",this.renderPlayer,this); 
  }
});
var PlayerListView = Backbone.View.extend({
  el : "#index",

  events : {
    "keyup input#search-basic" : "search"
  },

  listview : "#listPlayersView",

  pageName: "playerList",

  initialize : function() {
    this.playerListViewTemplate = Y.Templates.get('playerListViewTemplate');
    this.playerSearchTemplate = Y.Templates.get('playerSearchTemplate');
    $.mobile.showPageLoadingMsg();

    if (this.id !== 'null') {
      console.log('on demande les joueurs par club ' + this.id);

      this.players = new PlayersCollection();
      this.players.setMode('club', this.id);
      this.players.fetch();
      this.players.on('all', this.renderList, this);
    }
    this.render();
    // this.renderList();
    $.mobile.hidePageLoadingMsg();
  },

  search : function() {
    // FIXME if($("#search-basic").val().length>3) {
    var q = $("#search-basic").val();
    $(this.listview).empty();
    
    this.players.setMode('search', q);
    this.players.fetch();
    
	try {
	    $(this.listview).html(this.playerListViewTemplate, {
	      players : this.players.toJSON(),
	      query : q
	    });
    }
    catch(e) {
    
    }
    
    $(this.listview).listview('refresh');
    // }
    return this;
  },

  // render the content into div of view
  render : function() {
    this.$el.html(this.playerSearchTemplate({}));
    // Trigger jquerymobile rendering
    this.$el.trigger('pagecreate');
    // return to enable chained calls
    return this;
  },

  renderList : function(query) {
    $(this.listview).html(this.playerListViewTemplate({
      players : this.players.toJSON(),
      query : ' '
    }));
    $(this.listview).listview('refresh');
    return this;
  },

  onClose : function() {
    this.undelegateEvents();
    this.players.off("all", this.render, this);
  }
});

var PlayerSigninView = Backbone.View.extend({
  el : "#index",

  events: {
    'submit form#frmSigninPlayer' : 'signin'
  },

  pageName: "playerSignin",

  initialize : function() {
    this.playerSigninTemplate = Y.Templates.get('playerSigninTemplate');
    this.render();
    $.mobile.hidePageLoadingMsg();
  },

  signin : function(event) {
    var email = $('#email').val();
    var password = $('#password').val();

    console.log('test authentification avec ' + email);
    this.player = new PlayerModel();
    this.player.login(email, password);
    return false;
  },

  // render the content into div of view
  render : function() {
    this.$el.html(this.playerSigninTemplate({}));
    this.$el.trigger('pagecreate');
    return this;
  },

  onClose : function() {
    this.undelegateEvents();
  }
});

var PlayerForgetView = Backbone.View.extend({
  el : "#index",

  events: {
    'submit form#frmForgetPlayer' : 'forget'
  },

  pageName: "playerForget",

  initialize : function() {
    this.playerForgetTemplate = Y.Templates.get('playerForgetTemplate');
    this.render();
    $.mobile.hidePageLoadingMsg();
  },

  forget : function(event) {
    var email = $('#email').val();

    console.log('test mot de passe oublie avec ' + email);
    
    this.player = new PlayerModel();
    this.player.newpass(email);
    
    return false;
  },

  // render the content into div of view
  render : function() {
    this.$el.html(this.playerForgetTemplate({}));
    this.$el.trigger('pagecreate');
    return this;
  },

  onClose : function() {
    this.undelegateEvents();
  }
});

// MAIN ENTRY POINT
$(document).ready(function () {
  // Document is ready => initializing YesWeScore
  Y.ready(function () {
    // YesWeScore is ready.
    console.log('YesWeScore is ready.');
  });

  Cordova.ready(function () {
    // Cordova is ready
    console.log('Cordova is ready.')
  });
});