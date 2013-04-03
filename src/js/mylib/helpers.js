// ALL USEFUL FCTS
JSON.tryParse = function(o, undefined) {
  try {
    return JSON.parse(o);
  } catch (e) {
    return undefined;
  }
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

var scrollTop = function () {
	setTimeout(function () {	
		var scrollTop = document.documentElement ? document.documentElement.scrollTop : document.body.scrollTop;	
		scrollTop = 0;
	}, 0);
}

function goBack(){
    if (typeof (navigator.app) !== "undefined") {
        navigator.app.backHistory();
    } else {
        window.history.back();
    }
}

var assert = function () { };
/*@ifdef DEV*/
assert = function (t) { if (!t) throw "assert false" };
/*@endif*/
