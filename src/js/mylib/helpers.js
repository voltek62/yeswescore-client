// ALL USEFUL FCTS
var checkName =  function(input) {
  //var ck_name = /^[A-Za-z ]{3,40}$/;
  var ck_name = /^[a-zA-ZàáâäãåąćęèéêëìíîïłńòóôöõøùúûüÿýżźñçčšžÀÁÂÄÃÅĄĆĘÈÉÊËÌÍÎÏŁŃÒÓÔÖÕØÙÚÛÜŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{3,40}$/;
  if (!ck_name.test(input)) 
	  return true;
  return false;
};

var checkRank =  function(input) {
  var ck_rank =  /^[A-Za-z0-9!\/\_-]{1,5}$/;
  if (!ck_rank.test(input)) 
	  return true;
  return false;
};



var checkLicence = function(input){
 var ck_licence = /^[A-Za-z0-9 ]{4,16}$/;

  if (!ck_licence.test(input)) 
	return true;
	
  return false; 
};

var checkComment = function(input){
 var ck_comment = /^[A-Za-z0-9 ]{2,300}$/;

  if (!ck_comment.test(input)) 
	return true;
	
  return false; 
};

JSON.tryParse = function(o, undefined) {
  try {
    return JSON.parse(o);
  } catch (e) {
    return undefined;
  }
};

String.prototype.startsWith = function (subString) {
    return this.indexOf(subString) === 0;
};

String.prototype.padLeft = function (size, padString) {
    var n = String(this);
    padString = padString || " ";
    while (n.length < size) {
        n = padString + n;
    }
    return n;
};

String.prototype.padRight = function(size, padString) {
  var t = String(this), l = padString.length;
  while (t.length + l <= size)
    t += padString;
  if (t.length < size)
    t += padString.substring(0, size - t);
  return t;
};

String.prototype.toRegExp = function () {
    return this.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

String.prototype.isEmail = function() {
  return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(this);
};

if(!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g,'');
  };
}

// undefined <=> ''.
String.prototype.isDifferentFrom = function (o) {
  o = o || '';
  return this.toString() !== o;
}

// for old browser : parse a date in yyyy-mm-dd format
var parseDate = function(input) {
  var parts = input.match(/(\d+)/g);
  
  //console.log('ANDROID parts',parts);
  
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1]-1, parts[2], parts[3], parts[4], parts[5]); // months are 0-based
};

Date.prototype.getMonthName = function(lang) {
    lang = lang && (lang in Date.locale) ? lang : 'fr';
    return Date.locale[lang].month_names[this.getMonth()];
};

Date.prototype.getMonthNameShort = function(lang) {
    lang = lang && (lang in Date.locale) ? lang : 'fr';
    return Date.locale[lang].month_names_short[this.getMonth()];
};

Date.locale = {
    fr: {
       month_names: ['janvier', 'f&eacute;vrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'd&eacute;cembre'],
       month_names_short: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jui', 'Jui', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    en: {
       month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
       month_names_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
};

Date.prototype.toYYYYMMDD = function (separator) {
  separator = separator || '';

  return String(this.getFullYear())+separator+
         String(this.getMonth()+1).padLeft(2, '0')+separator+
         String(this.getDate()).padLeft(2, '0');
};

Date.prototype.toHHMM = function (separator) {
  separator = separator || '';

  return String(this.getHours()).padLeft(2, '0')+separator+
         String(this.getMinutes()).padLeft(2, '0');
}

window.isMobileBrowser = (function () {
  // detect lots of mobile browser (not ipad/tablet/..)
  // isMobileBrowser copyright to http://detectmobilebrowsers.com/ (@chadsmith)
  var isMobileBrowser = null;
  /*#ifndef WEB*/
  isMobileBrowser = true; // WEB => null => dynamic computation.
  /*#endif*/
  return function () {
    if (isMobileBrowser === null) {
      var userAgent = navigator.userAgent || navigator.vendor || window.opera;
      isMobileBrowser = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(userAgent) ||
                        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4));
    }
    return isMobileBrowser;
  }
})();

var assert = function () { };
/*#ifdef DEV*/
assert = function (t) {
  if (!t) {
    try {
      wtf.is.that.code += "YesWeScore rulez d4 W0rld";
    } catch (e) {
      if (e.stack) {
        console.log('ASSERT STACK TRACE: '+JSON.stringify(e.stack));
        e.stack.split('\n').forEach(function (line, i) {
          console.log(i+': '+line);
        });
      }
    }
    throw "assert false ";
  }
};
/*#endif*/

var PROD = true;
/*#ifdef DEV*/
PROD = false;
/*#endif*/
if (PROD) {
  // we do not want any console.log in production environment.
  setTimeout(function () {
    var f = console.log;
    console.log = function () {
      return;
    };
    console.log.f = f;
  }, 5000);
} else {
  (function () {
    var start = Date.now();
     var f = console.log;
 
     var ios = true;  
     /*#ifndef IOS*/
     ios = false;
     /*#endif*/ 
     if (ios) {     
       return;
     } 
    
    console.log = function () {
      var a = Array.prototype.slice.apply(arguments);
      var now = Date.now() - start;
      now = String(Math.floor(now / 1000)).padLeft(3, '0') + "." + String(now % 1000).padRight(3, '0');
      a.unshift(now);
      // cas specifique android ... 
      // il semble que logcat n'affiche que le 1er param du console.log()
      var android = true;
      /*#ifndef ANDROID*/
        android = false;
      /*#endif*/
      if (android) {
        a = [ a.join("|") ];
      }
      f.apply(console, a);
    };
    console.log.f = f;
  })();

  /*#ifdef CORDOVA*/
  // on prend les précautions psychologiques d'usage
  // => on rend les consoles logs asynchrones.
  //  car sous cordova, console.log met en attente le JS !!!
  setTimeout(function () {
    var f = console.log;
    console.log = function () {
      var a = Array.prototype.slice.apply(arguments);
      setTimeout(function () { f.apply(console, a); }, 10);
    };
    console.log.f = f;
  }, 5000);
  /*#endif*/
}

