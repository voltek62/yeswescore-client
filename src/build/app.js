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
/* Zepto v1.0rc1 - polyfill zepto event detect fx ajax form touch - zeptojs.com/license */
;(function(undefined){
  if (String.prototype.trim === undefined) // fix for iOS 3.2
    String.prototype.trim = function(){ return this.replace(/^\s+/, '').replace(/\s+$/, '') }

  // For iOS 3.x
  // from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
  if (Array.prototype.reduce === undefined)
    Array.prototype.reduce = function(fun){
      if(this === void 0 || this === null) throw new TypeError()
      var t = Object(this), len = t.length >>> 0, k = 0, accumulator
      if(typeof fun != 'function') throw new TypeError()
      if(len == 0 && arguments.length == 1) throw new TypeError()

      if(arguments.length >= 2)
       accumulator = arguments[1]
      else
        do{
          if(k in t){
            accumulator = t[k++]
            break
          }
          if(++k >= len) throw new TypeError()
        } while (true)

      while (k < len){
        if(k in t) accumulator = fun.call(undefined, accumulator, t[k], k, t)
        k++
      }
      return accumulator
    }

})()
var Zepto = (function() {
  var undefined, key, $, classList, emptyArray = [], slice = emptyArray.slice,
    document = window.document,
    elementDisplay = {}, classCache = {},
    getComputedStyle = document.defaultView.getComputedStyle,
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,

    // Used by `$.zepto.init` to wrap elements, text/comment nodes, document,
    // and document fragment node types.
    elementTypes = [1, 3, 8, 9, 11],

    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),
    containers = {
      'tr': document.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document.createElement('div')
    },
    readyRE = /complete|loaded|interactive/,
    classSelectorRE = /^\.([\w-]+)$/,
    idSelectorRE = /^#([\w-]+)$/,
    tagSelectorRE = /^[\w-]+$/,
    toString = ({}).toString,
    zepto = {},
    camelize, uniq,
    tempParent = document.createElement('div')

  zepto.matches = function(element, selector) {
    if (!element || element.nodeType !== 1) return false
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                          element.oMatchesSelector || element.matchesSelector
    if (matchesSelector) return matchesSelector.call(element, selector)
    // fall back to performing a selector:
    var match, parent = element.parentNode, temp = !parent
    if (temp) (parent = tempParent).appendChild(element)
    match = ~zepto.qsa(parent, selector).indexOf(element)
    temp && tempParent.removeChild(element)
    return match
  }

  function isFunction(value) { return toString.call(value) == "[object Function]" }
  function isObject(value) { return value instanceof Object }
  function isPlainObject(value) {
    var key, ctor
    if (toString.call(value) !== "[object Object]") return false
    ctor = (isFunction(value.constructor) && value.constructor.prototype)
    if (!ctor || !hasOwnProperty.call(ctor, 'isPrototypeOf')) return false
    for (key in value);
    return key === undefined || hasOwnProperty.call(value, key)
  }
  function isArray(value) { return value instanceof Array }
  function likeArray(obj) { return typeof obj.length == 'number' }

  function compact(array) { return array.filter(function(item){ return item !== undefined && item !== null }) }
  function flatten(array) { return array.length > 0 ? [].concat.apply([], array) : array }
  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function dasherize(str) {
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase()
  }
  uniq = function(array){ return array.filter(function(item, idx){ return array.indexOf(item) == idx }) }

  function classRE(name) {
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
  }

  function maybeAddPx(name, value) {
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
  }

  function defaultDisplay(nodeName) {
    var element, display
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName)
      document.body.appendChild(element)
      display = getComputedStyle(element, '').getPropertyValue("display")
      element.parentNode.removeChild(element)
      display == "none" && (display = "block")
      elementDisplay[nodeName] = display
    }
    return elementDisplay[nodeName]
  }

  // `$.zepto.fragment` takes a html string and an optional tag name
  // to generate DOM nodes nodes from the given html string.
  // The generated DOM nodes are returned as an array.
  // This function can be overriden in plugins for example to make
  // it compatible with browsers that don't support the DOM fully.
  zepto.fragment = function(html, name) {
    if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
    if (!(name in containers)) name = '*'
    var container = containers[name]
    container.innerHTML = '' + html
    return $.each(slice.call(container.childNodes), function(){
      container.removeChild(this)
    })
  }

  // `$.zepto.Z` swaps out the prototype of the given `dom` array
  // of nodes with `$.fn` and thus supplying all the Zepto functions
  // to the array. Note that `__proto__` is not supported on Internet
  // Explorer. This method can be overriden in plugins.
  zepto.Z = function(dom, selector) {
    dom = dom || []
    dom.__proto__ = arguments.callee.prototype
    dom.selector = selector || ''
    return dom
  }

  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overriden in plugins.
  zepto.isZ = function(object) {
    return object instanceof zepto.Z
  }

  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
  // takes a CSS selector and an optional context (and handles various
  // special cases).
  // This method can be overriden in plugins.
  zepto.init = function(selector, context) {
    // If nothing given, return an empty Zepto collection
    if (!selector) return zepto.Z()
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) return $(document).ready(selector)
    // If a Zepto collection is given, juts return it
    else if (zepto.isZ(selector)) return selector
    else {
      var dom
      // normalize array if an array of nodes is given
      if (isArray(selector)) dom = compact(selector)
      // if a JavaScript object is given, return a copy of it
      // this is a somewhat peculiar option, but supported by
      // jQuery so we'll do it, too
      else if (isPlainObject(selector))
        dom = [$.extend({}, selector)], selector = null
      // wrap stuff like `document` or `window`
      else if (elementTypes.indexOf(selector.nodeType) >= 0 || selector === window)
        dom = [selector], selector = null
      // If it's a html fragment, create nodes from it
      else if (fragmentRE.test(selector))
        dom = zepto.fragment(selector.trim(), RegExp.$1), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // And last but no least, if it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
      // create a new Zepto collection from the nodes found
      return zepto.Z(dom, selector)
    }
  }

  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, whichs makes the implementation
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
  $ = function(selector, context){
    return zepto.init(selector, context)
  }

  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  $.extend = function(target){
    slice.call(arguments, 1).forEach(function(source) {
      for (key in source)
        if (source[key] !== undefined)
          target[key] = source[key]
    })
    return target
  }

  // `$.zepto.qsa` is Zepto's CSS selector implementation which
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
  // This method can be overriden in plugins.
  zepto.qsa = function(element, selector){
    var found
    return (element === document && idSelectorRE.test(selector)) ?
      ( (found = element.getElementById(RegExp.$1)) ? [found] : emptyArray ) :
      (element.nodeType !== 1 && element.nodeType !== 9) ? emptyArray :
      slice.call(
        classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) :
        tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) :
        element.querySelectorAll(selector)
      )
  }

  function filtered(nodes, selector) {
    return selector === undefined ? $(nodes) : $(nodes).filter(selector)
  }

  function funcArg(context, arg, idx, payload) {
   return isFunction(arg) ? arg.call(context, idx, payload) : arg
  }

  $.isFunction = isFunction
  $.isObject = isObject
  $.isArray = isArray
  $.isPlainObject = isPlainObject

  $.inArray = function(elem, array, i){
    return emptyArray.indexOf.call(array, elem, i)
  }

  $.trim = function(str) { return str.trim() }

  // plugin compatibility
  $.uuid = 0

  $.map = function(elements, callback){
    var value, values = [], i, key
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i)
        if (value != null) values.push(value)
      }
    else
      for (key in elements) {
        value = callback(elements[key], key)
        if (value != null) values.push(value)
      }
    return flatten(values)
  }

  $.each = function(elements, callback){
    var i, key
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  }

  // Define methods that will be available on all
  // Zepto collections
  $.fn = {
    // Because a collection acts like an array
    // copy over these useful array functions.
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    indexOf: emptyArray.indexOf,
    concat: emptyArray.concat,

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function(fn){
      return $.map(this, function(el, i){ return fn.call(el, i, el) })
    },
    slice: function(){
      return $(slice.apply(this, arguments))
    },

    ready: function(callback){
      if (readyRE.test(document.readyState)) callback($)
      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
      return this
    },
    get: function(idx){
      return idx === undefined ? slice.call(this) : this[idx]
    },
    toArray: function(){ return this.get() },
    size: function(){
      return this.length
    },
    remove: function(){
      return this.each(function(){
        if (this.parentNode != null)
          this.parentNode.removeChild(this)
      })
    },
    each: function(callback){
      this.forEach(function(el, idx){ callback.call(el, idx, el) })
      return this
    },
    filter: function(selector){
      return $([].filter.call(this, function(element){
        return zepto.matches(element, selector)
      }))
    },
    add: function(selector,context){
      return $(uniq(this.concat($(selector,context))))
    },
    is: function(selector){
      return this.length > 0 && zepto.matches(this[0], selector)
    },
    not: function(selector){
      var nodes=[]
      if (isFunction(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this)
        })
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
        this.forEach(function(el){
          if (excludes.indexOf(el) < 0) nodes.push(el)
        })
      }
      return $(nodes)
    },
    eq: function(idx){
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
    },
    first: function(){
      var el = this[0]
      return el && !isObject(el) ? el : $(el)
    },
    last: function(){
      var el = this[this.length - 1]
      return el && !isObject(el) ? el : $(el)
    },
    find: function(selector){
      var result
      if (this.length == 1) result = zepto.qsa(this[0], selector)
      else result = this.map(function(){ return zepto.qsa(this, selector) })
      return $(result)
    },
    closest: function(selector, context){
      var node = this[0]
      while (node && !zepto.matches(node, selector))
        node = node !== context && node !== document && node.parentNode
      return $(node)
    },
    parents: function(selector){
      var ancestors = [], nodes = this
      while (nodes.length > 0)
        nodes = $.map(nodes, function(node){
          if ((node = node.parentNode) && node !== document && ancestors.indexOf(node) < 0) {
            ancestors.push(node)
            return node
          }
        })
      return filtered(ancestors, selector)
    },
    parent: function(selector){
      return filtered(uniq(this.pluck('parentNode')), selector)
    },
    children: function(selector){
      return filtered(this.map(function(){ return slice.call(this.children) }), selector)
    },
    siblings: function(selector){
      return filtered(this.map(function(i, el){
        return slice.call(el.parentNode.children).filter(function(child){ return child!==el })
      }), selector)
    },
    empty: function(){
      return this.each(function(){ this.innerHTML = '' })
    },
    // `pluck` is borrowed from Prototype.js
    pluck: function(property){
      return this.map(function(){ return this[property] })
    },
    show: function(){
      return this.each(function(){
        this.style.display == "none" && (this.style.display = null)
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName)
      })
    },
    replaceWith: function(newContent){
      return this.before(newContent).remove()
    },
    wrap: function(newContent){
      return this.each(function(){
        $(this).wrapAll($(newContent)[0].cloneNode(false))
      })
    },
    wrapAll: function(newContent){
      if (this[0]) {
        $(this[0]).before(newContent = $(newContent))
        newContent.append(this)
      }
      return this
    },
    unwrap: function(){
      this.parent().each(function(){
        $(this).replaceWith($(this).children())
      })
      return this
    },
    clone: function(){
      return $(this.map(function(){ return this.cloneNode(true) }))
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(setting){
      return (setting === undefined ? this.css("display") == "none" : setting) ? this.show() : this.hide()
    },
    prev: function(){ return $(this.pluck('previousElementSibling')) },
    next: function(){ return $(this.pluck('nextElementSibling')) },
    html: function(html){
      return html === undefined ?
        (this.length > 0 ? this[0].innerHTML : null) :
        this.each(function(idx){
          var originHtml = this.innerHTML
          $(this).empty().append( funcArg(this, html, idx, originHtml) )
        })
    },
    text: function(text){
      return text === undefined ?
        (this.length > 0 ? this[0].textContent : null) :
        this.each(function(){ this.textContent = text })
    },
    attr: function(name, value){
      var result
      return (typeof name == 'string' && value === undefined) ?
        (this.length == 0 || this[0].nodeType !== 1 ? undefined :
          (name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
        ) :
        this.each(function(idx){
          if (this.nodeType !== 1) return
          if (isObject(name)) for (key in name) this.setAttribute(key, name[key])
          else this.setAttribute(name, funcArg(this, value, idx, this.getAttribute(name)))
        })
    },
    removeAttr: function(name){
      return this.each(function(){ if (this.nodeType === 1) this.removeAttribute(name) })
    },
    prop: function(name, value){
      return (value === undefined) ?
        (this[0] ? this[0][name] : undefined) :
        this.each(function(idx){
          this[name] = funcArg(this, value, idx, this[name])
        })
    },
    data: function(name, value){
      var data = this.attr('data-' + dasherize(name), value)
      return data !== null ? data : undefined
    },
    val: function(value){
      return (value === undefined) ?
        (this.length > 0 ? this[0].value : undefined) :
        this.each(function(idx){
          this.value = funcArg(this, value, idx, this.value)
        })
    },
    offset: function(){
      if (this.length==0) return null
      var obj = this[0].getBoundingClientRect()
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: obj.width,
        height: obj.height
      }
    },
    css: function(property, value){
      if (value === undefined && typeof property == 'string')
        return (
          this.length == 0
            ? undefined
            : this[0].style[camelize(property)] || getComputedStyle(this[0], '').getPropertyValue(property))

      var css = ''
      for (key in property)
        if(typeof property[key] == 'string' && property[key] == '')
          this.each(function(){ this.style.removeProperty(dasherize(key)) })
        else
          css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'

      if (typeof property == 'string')
        if (value == '')
          this.each(function(){ this.style.removeProperty(dasherize(property)) })
        else
          css = dasherize(property) + ":" + maybeAddPx(property, value)

      return this.each(function(){ this.style.cssText += ';' + css })
    },
    index: function(element){
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
    },
    hasClass: function(name){
      if (this.length < 1) return false
      else return classRE(name).test(this[0].className)
    },
    addClass: function(name){
      return this.each(function(idx){
        classList = []
        var cls = this.className, newName = funcArg(this, name, idx, cls)
        newName.split(/\s+/g).forEach(function(klass){
          if (!$(this).hasClass(klass)) classList.push(klass)
        }, this)
        classList.length && (this.className += (cls ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name){
      return this.each(function(idx){
        if (name === undefined)
          return this.className = ''
        classList = this.className
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
          classList = classList.replace(classRE(klass), " ")
        })
        this.className = classList.trim()
      })
    },
    toggleClass: function(name, when){
      return this.each(function(idx){
        var newName = funcArg(this, name, idx, this.className)
        ;(when === undefined ? !$(this).hasClass(newName) : when) ?
          $(this).addClass(newName) : $(this).removeClass(newName)
      })
    }
  }

  // Generate the `width` and `height` functions
  ;['width', 'height'].forEach(function(dimension){
    $.fn[dimension] = function(value){
      var offset, Dimension = dimension.replace(/./, function(m){ return m[0].toUpperCase() })
      if (value === undefined) return this[0] == window ? window['inner' + Dimension] :
        this[0] == document ? document.documentElement['offset' + Dimension] :
        (offset = this.offset()) && offset[dimension]
      else return this.each(function(idx){
        var el = $(this)
        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
      })
    }
  })

  function insert(operator, target, node) {
    var parent = (operator % 2) ? target : target.parentNode
    parent ? parent.insertBefore(node,
      !operator ? target.nextSibling :      // after
      operator == 1 ? parent.firstChild :   // prepend
      operator == 2 ? target :              // before
      null) :                               // append
      $(node).remove()
  }

  function traverseNode(node, fun) {
    fun(node)
    for (var key in node.childNodes) traverseNode(node.childNodes[key], fun)
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function(key, operator) {
    $.fn[key] = function(){
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var nodes = $.map(arguments, function(n){ return isObject(n) ? n : zepto.fragment(n) })
      if (nodes.length < 1) return this
      var size = this.length, copyByClone = size > 1, inReverse = operator < 2

      return this.each(function(index, target){
        for (var i = 0; i < nodes.length; i++) {
          var node = nodes[inReverse ? nodes.length-i-1 : i]
          traverseNode(node, function(node){
            if (node.nodeName != null && node.nodeName.toUpperCase() === 'SCRIPT' && (!node.type || node.type === 'text/javascript'))
              window['eval'].call(window, node.innerHTML)
          })
          if (copyByClone && index < size - 1) node = node.cloneNode(true)
          insert(operator, target, node)
        }
      })
    }

    $.fn[(operator % 2) ? key+'To' : 'insert'+(operator ? 'Before' : 'After')] = function(html){
      $(html)[key](this)
      return this
    }
  })

  zepto.Z.prototype = $.fn

  // Export internal API functions in the `$.zepto` namespace
  zepto.camelize = camelize
  zepto.uniq = uniq
  $.zepto = zepto

  return $
})()

// If `$` is not yet defined, point it to `Zepto`
window.Zepto = Zepto
'$' in window || (window.$ = Zepto)
;(function($){
  var $$ = $.zepto.qsa, handlers = {}, _zid = 1, specialEvents={}

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
    })
  }
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eachEvent(events, fn, iterator){
    if ($.isObject(events)) $.each(events, iterator)
    else events.split(/\s/).forEach(function(type){ iterator(type, fn) })
  }

  function add(element, events, fn, selector, getDelegate, capture){
    capture = !!capture
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
    eachEvent(events, fn, function(event, fn){
      var delegate = getDelegate && getDelegate(fn, event),
        callback = delegate || fn
      var proxyfn = function (event) {
        var result = callback.apply(element, [event].concat(event.data))
        if (result === false) event.preventDefault()
        return result
      }
      var handler = $.extend(parse(event), {fn: fn, proxy: proxyfn, sel: selector, del: delegate, i: set.length})
      set.push(handler)
      element.addEventListener(handler.e, proxyfn, capture)
    })
  }
  function remove(element, events, fn, selector){
    var id = zid(element)
    eachEvent(events || '', fn, function(event, fn){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]
        element.removeEventListener(handler.e, handler.proxy, false)
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function(fn, context) {
    if ($.isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (typeof context == 'string') {
      return $.proxy(fn[context], fn)
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, callback){
    return this.each(function(){
      add(this, event, callback)
    })
  }
  $.fn.unbind = function(event, callback){
    return this.each(function(){
      remove(this, event, callback)
    })
  }
  $.fn.one = function(event, callback){
    return this.each(function(i, element){
      add(this, event, callback, null, function(fn, type){
        return function(){
          var result = fn.apply(element, arguments)
          remove(element, type, fn)
          return result
        }
      })
    })
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }
  function createProxy(event) {
    var proxy = $.extend({originalEvent: event}, event)
    $.each(eventMethods, function(name, predicate) {
      proxy[name] = function(){
        this[predicate] = returnTrue
        return event[name].apply(event, arguments)
      }
      proxy[predicate] = returnFalse
    })
    return proxy
  }

  // emulates the 'defaultPrevented' property for browsers that have none
  function fix(event) {
    if (!('defaultPrevented' in event)) {
      event.defaultPrevented = false
      var prevent = event.preventDefault
      event.preventDefault = function() {
        this.defaultPrevented = true
        prevent.call(this)
      }
    }
  }

  $.fn.delegate = function(selector, event, callback){
    var capture = false
    if(event == 'blur' || event == 'focus'){
      if($.iswebkit)
        event = event == 'blur' ? 'focusout' : event == 'focus' ? 'focusin' : event
      else
        capture = true
    }

    return this.each(function(i, element){
      add(element, event, callback, selector, function(fn){
        return function(e){
          var evt, match = $(e.target).closest(selector, element).get(0)
          if (match) {
            evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
            return fn.apply(match, [evt].concat([].slice.call(arguments, 1)))
          }
        }
      }, capture)
    })
  }
  $.fn.undelegate = function(selector, event, callback){
    return this.each(function(){
      remove(this, event, callback, selector)
    })
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function(event, selector, callback){
    return selector == undefined || $.isFunction(selector) ?
      this.bind(event, selector) : this.delegate(selector, event, callback)
  }
  $.fn.off = function(event, selector, callback){
    return selector == undefined || $.isFunction(selector) ?
      this.unbind(event, selector) : this.undelegate(selector, event, callback)
  }

  $.fn.trigger = function(event, data){
    if (typeof event == 'string') event = $.Event(event)
    fix(event)
    event.data = data
    return this.each(function(){
      // items in the collection might not be DOM elements
      // (todo: possibly support events on plain old objects)
      if('dispatchEvent' in this) this.dispatchEvent(event)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, data){
    var e, result
    this.each(function(i, element){
      e = createProxy(typeof event == 'string' ? $.Event(event) : event)
      e.data = data
      e.target = element
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback){ return this.bind(event, callback) }
  })

  ;['focus', 'blur'].forEach(function(name) {
    $.fn[name] = function(callback) {
      if (callback) this.bind(name, callback)
      else if (this.length) try { this.get(0)[name]() } catch(e){}
      return this
    }
  })

  $.Event = function(type, props) {
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null)
    return event
  }

})(Zepto)
;(function($){
  function detect(ua){
    var os = this.os = {}, browser = this.browser = {},
      webkit = ua.match(/WebKit\/([\d.]+)/),
      android = ua.match(/(Android)\s+([\d.]+)/),
      ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
      iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
      webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
      touchpad = webos && ua.match(/TouchPad/),
      kindle = ua.match(/Kindle\/([\d.]+)/),
      silk = ua.match(/Silk\/([\d._]+)/),
      blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/)

    // todo clean this up with a better OS/browser
    // separation. we need to discern between multiple
    // browsers on android, and decide if kindle fire in
    // silk mode is android or not

    if (browser.webkit = !!webkit) browser.version = webkit[1]

    if (android) os.android = true, os.version = android[2]
    if (iphone) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
    if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
    if (webos) os.webos = true, os.version = webos[2]
    if (touchpad) os.touchpad = true
    if (blackberry) os.blackberry = true, os.version = blackberry[2]
    if (kindle) os.kindle = true, os.version = kindle[1]
    if (silk) browser.silk = true, browser.version = silk[1]
    if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
  }

  detect.call($, navigator.userAgent)
  // make available to unit tests
  $.__detect = detect

})(Zepto)
;(function($, undefined){
  var prefix = '', eventPrefix, endEventName, endAnimationName,
    vendors = { Webkit: 'webkit', Moz: '', O: 'o', ms: 'MS' },
    document = window.document, testEl = document.createElement('div'),
    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
    clearProperties = {}

  function downcase(str) { return str.toLowerCase() }
  function normalizeEvent(name) { return eventPrefix ? eventPrefix + name : downcase(name) }

  $.each(vendors, function(vendor, event){
    if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
      prefix = '-' + downcase(vendor) + '-'
      eventPrefix = event
      return false
    }
  })

  clearProperties[prefix + 'transition-property'] =
  clearProperties[prefix + 'transition-duration'] =
  clearProperties[prefix + 'transition-timing-function'] =
  clearProperties[prefix + 'animation-name'] =
  clearProperties[prefix + 'animation-duration'] = ''

  $.fx = {
    off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
    cssPrefix: prefix,
    transitionEnd: normalizeEvent('TransitionEnd'),
    animationEnd: normalizeEvent('AnimationEnd')
  }

  $.fn.animate = function(properties, duration, ease, callback){
    if ($.isObject(duration))
      ease = duration.easing, callback = duration.complete, duration = duration.duration
    if (duration) duration = duration / 1000
    return this.anim(properties, duration, ease, callback)
  }

  $.fn.anim = function(properties, duration, ease, callback){
    var transforms, cssProperties = {}, key, that = this, wrappedCallback, endEvent = $.fx.transitionEnd
    if (duration === undefined) duration = 0.4
    if ($.fx.off) duration = 0

    if (typeof properties == 'string') {
      // keyframe animation
      cssProperties[prefix + 'animation-name'] = properties
      cssProperties[prefix + 'animation-duration'] = duration + 's'
      endEvent = $.fx.animationEnd
    } else {
      // CSS transitions
      for (key in properties)
        if (supportedTransforms.test(key)) {
          transforms || (transforms = [])
          transforms.push(key + '(' + properties[key] + ')')
        }
        else cssProperties[key] = properties[key]

      if (transforms) cssProperties[prefix + 'transform'] = transforms.join(' ')
      if (!$.fx.off && typeof properties === 'object') {
        cssProperties[prefix + 'transition-property'] = Object.keys(properties).join(', ')
        cssProperties[prefix + 'transition-duration'] = duration + 's'
        cssProperties[prefix + 'transition-timing-function'] = (ease || 'linear')
      }
    }

    wrappedCallback = function(event){
      if (typeof event !== 'undefined') {
        if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
        $(event.target).unbind(endEvent, arguments.callee)
      }
      $(this).css(clearProperties)
      callback && callback.call(this)
    }
    if (duration > 0) this.bind(endEvent, wrappedCallback)

    setTimeout(function() {
      that.css(cssProperties)
      if (duration <= 0) setTimeout(function() {
        that.each(function(){ wrappedCallback.call(this) })
      }, 0)
    }, 0)

    return this
  }

  testEl = null
})(Zepto)
;(function($){
  var jsonpID = 0,
      isObject = $.isObject,
      document = window.document,
      key,
      name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i,
      jsonType = 'application/json',
      htmlType = 'text/html',
      blankRE = /^\s*$/

  // trigger a custom event and return false if it was cancelled
  function triggerAndReturn(context, eventName, data) {
    var event = $.Event(eventName)
    $(context).trigger(event, data)
    return !event.defaultPrevented
  }

  // trigger an Ajax "global" event
  function triggerGlobal(settings, context, eventName, data) {
    if (settings.global) return triggerAndReturn(context || document, eventName, data)
  }

  // Number of active Ajax requests
  $.active = 0

  function ajaxStart(settings) {
    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
  }
  function ajaxStop(settings) {
    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
  }

  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context
    if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
      return false

    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
  }
  function ajaxSuccess(data, xhr, settings) {
    var context = settings.context, status = 'success'
    settings.success.call(context, data, status, xhr)
    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
    ajaxComplete(status, xhr, settings)
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, xhr, settings) {
    var context = settings.context
    settings.error.call(context, xhr, type, error)
    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error])
    ajaxComplete(type, xhr, settings)
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context
    settings.complete.call(context, xhr, status)
    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
    ajaxStop(settings)
  }

  // Empty function, used as default callback
  function empty() {}

  $.ajaxJSONP = function(options){
    var callbackName = 'jsonp' + (++jsonpID),
      script = document.createElement('script'),
      abort = function(){
        $(script).remove()
        if (callbackName in window) window[callbackName] = empty
        ajaxComplete('abort', xhr, options)
      },
      xhr = { abort: abort }, abortTimeout

    if (options.error) script.onerror = function() {
      xhr.abort()
      options.error()
    }

    window[callbackName] = function(data){
      clearTimeout(abortTimeout)
      $(script).remove()
      delete window[callbackName]
      ajaxSuccess(data, xhr, options)
    }

    serializeData(options)
    script.src = options.url.replace(/=\?/, '=' + callbackName)
    $('head').append(script)

    if (options.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.abort()
        ajaxComplete('timeout', xhr, options)
      }, options.timeout)

    return xhr
  }

  $.ajaxSettings = {
    // Default type of request
    type: 'GET',
    // Callback that is executed before request
    beforeSend: empty,
    // Callback that is executed if the request succeeds
    success: empty,
    // Callback that is executed the the server drops error
    error: empty,
    // Callback that is executed on request complete (both: error and success)
    complete: empty,
    // The context for the callbacks
    context: null,
    // Whether to trigger "global" Ajax events
    global: true,
    // Transport
    xhr: function () {
      return new window.XMLHttpRequest()
    },
    // MIME types mapping
    accepts: {
      script: 'text/javascript, application/javascript',
      json:   jsonType,
      xml:    'application/xml, text/xml',
      html:   htmlType,
      text:   'text/plain'
    },
    // Whether the request is to another domain
    crossDomain: false,
    // Default timeout
    timeout: 0
  }

  function mimeToDataType(mime) {
    return mime && ( mime == htmlType ? 'html' :
      mime == jsonType ? 'json' :
      scriptTypeRE.test(mime) ? 'script' :
      xmlTypeRE.test(mime) && 'xml' ) || 'text'
  }

  function appendQuery(url, query) {
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
  }

  // serialize payload and append it to the URL for GET requests
  function serializeData(options) {
    if (isObject(options.data)) options.data = $.param(options.data)
    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
      options.url = appendQuery(options.url, options.data)
  }

  $.ajax = function(options){
    var settings = $.extend({}, options || {})
    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

    ajaxStart(settings)

    if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
      RegExp.$2 != window.location.host

    var dataType = settings.dataType, hasPlaceholder = /=\?/.test(settings.url)
    if (dataType == 'jsonp' || hasPlaceholder) {
      if (!hasPlaceholder) settings.url = appendQuery(settings.url, 'callback=?')
      return $.ajaxJSONP(settings)
    }

    if (!settings.url) settings.url = window.location.toString()
    serializeData(settings)

    var mime = settings.accepts[dataType],
        baseHeaders = { },
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = $.ajaxSettings.xhr(), abortTimeout

    if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest'
    if (mime) {
      baseHeaders['Accept'] = mime
      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
      xhr.overrideMimeType && xhr.overrideMimeType(mime)
    }
    if (settings.contentType || (settings.data && settings.type.toUpperCase() != 'GET'))
      baseHeaders['Content-Type'] = (settings.contentType || 'application/x-www-form-urlencoded')
    settings.headers = $.extend(baseHeaders, settings.headers || {})

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        clearTimeout(abortTimeout)
        var result, error = false
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
          dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'))
          result = xhr.responseText

          try {
            if (dataType == 'script')    (1,eval)(result)
            else if (dataType == 'xml')  result = xhr.responseXML
            else if (dataType == 'json') result = blankRE.test(result) ? null : JSON.parse(result)
          } catch (e) { error = e }

          if (error) ajaxError(error, 'parsererror', xhr, settings)
          else ajaxSuccess(result, xhr, settings)
        } else {
          ajaxError(null, 'error', xhr, settings)
        }
      }
    }

    var async = 'async' in settings ? settings.async : true
    xhr.open(settings.type, settings.url, async)

    for (name in settings.headers) xhr.setRequestHeader(name, settings.headers[name])

    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort()
      return false
    }

    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.onreadystatechange = empty
        xhr.abort()
        ajaxError(null, 'timeout', xhr, settings)
      }, settings.timeout)

    // avoid sending empty string (#319)
    xhr.send(settings.data ? settings.data : null)
    return xhr
  }

  $.get = function(url, success){ return $.ajax({ url: url, success: success }) }

  $.post = function(url, data, success, dataType){
    if ($.isFunction(data)) dataType = dataType || success, success = data, data = null
    return $.ajax({ type: 'POST', url: url, data: data, success: success, dataType: dataType })
  }

  $.getJSON = function(url, success){
    return $.ajax({ url: url, success: success, dataType: 'json' })
  }

  $.fn.load = function(url, success){
    if (!this.length) return this
    var self = this, parts = url.split(/\s/), selector
    if (parts.length > 1) url = parts[0], selector = parts[1]
    $.get(url, function(response){
      self.html(selector ?
        $(document.createElement('div')).html(response.replace(rscript, "")).find(selector).html()
        : response)
      success && success.call(self)
    })
    return this
  }

  var escape = encodeURIComponent

  function serialize(params, obj, traditional, scope){
    var array = $.isArray(obj)
    $.each(obj, function(key, value) {
      if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']'
      // handle data in serializeArray() format
      if (!scope && array) params.add(value.name, value.value)
      // recurse into nested objects
      else if (traditional ? $.isArray(value) : isObject(value))
        serialize(params, value, traditional, key)
      else params.add(key, value)
    })
  }

  $.param = function(obj, traditional){
    var params = []
    params.add = function(k, v){ this.push(escape(k) + '=' + escape(v)) }
    serialize(params, obj, traditional)
    return params.join('&').replace('%20', '+')
  }
})(Zepto)
;(function ($) {
  $.fn.serializeArray = function () {
    var result = [], el
    $( Array.prototype.slice.call(this.get(0).elements) ).each(function () {
      el = $(this)
      var type = el.attr('type')
      if (this.nodeName.toLowerCase() != 'fieldset' &&
        !this.disabled && type != 'submit' && type != 'reset' && type != 'button' &&
        ((type != 'radio' && type != 'checkbox') || this.checked))
        result.push({
          name: el.attr('name'),
          value: el.val()
        })
    })
    return result
  }

  $.fn.serialize = function () {
    var result = []
    this.serializeArray().forEach(function (elm) {
      result.push( encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value) )
    })
    return result.join('&')
  }

  $.fn.submit = function (callback) {
    if (callback) this.bind('submit', callback)
    else if (this.length) {
      var event = $.Event('submit')
      this.eq(0).trigger(event)
      if (!event.defaultPrevented) this.get(0).submit()
    }
    return this
  }

})(Zepto)
;(function($){
  var touch = {}, touchTimeout

  function parentIfText(node){
    return 'tagName' in node ? node : node.parentNode
  }

  function swipeDirection(x1, x2, y1, y2){
    var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2)
    return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
  }

  var longTapDelay = 750, longTapTimeout

  function longTap(){
    longTapTimeout = null
    if (touch.last) {
      touch.el.trigger('longTap')
      touch = {}
    }
  }

  function cancelLongTap(){
    if (longTapTimeout) clearTimeout(longTapTimeout)
    longTapTimeout = null
  }

  $(document).ready(function(){
    var now, delta

    $(document.body).bind('touchstart', function(e){
      now = Date.now()
      delta = now - (touch.last || now)
      touch.el = $(parentIfText(e.touches[0].target))
      touchTimeout && clearTimeout(touchTimeout)
      touch.x1 = e.touches[0].pageX
      touch.y1 = e.touches[0].pageY
      if (delta > 0 && delta <= 250) touch.isDoubleTap = true
      touch.last = now
      longTapTimeout = setTimeout(longTap, longTapDelay)
    }).bind('touchmove', function(e){
      cancelLongTap()
      touch.x2 = e.touches[0].pageX
      touch.y2 = e.touches[0].pageY
    }).bind('touchend', function(e){
       cancelLongTap()

      // double tap (tapped twice within 250ms)
      if (touch.isDoubleTap) {
        touch.el.trigger('doubleTap')
        touch = {}

      // swipe
      } else if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
                 (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)) {
        touch.el.trigger('swipe') &&
          touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
        touch = {}

      // normal tap
      } else if ('last' in touch) {
        touch.el.trigger('tap')

        touchTimeout = setTimeout(function(){
          touchTimeout = null
          touch.el.trigger('singleTap')
          touch = {}
        }, 250)
      }
    }).bind('touchcancel', function(){
      if (touchTimeout) clearTimeout(touchTimeout)
      if (longTapTimeout) clearTimeout(longTapTimeout)
      longTapTimeout = touchTimeout = null
      touch = {}
    })
  })

  ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(m){
    $.fn[m] = function(callback){ return this.bind(m, callback) }
  })
})(Zepto); // Add trailing semi-colon so that Zepto plays nice with other libraries.

/**
* jqMobi is a query selector class for HTML5 mobile apps on a WebkitBrowser.
* Since most mobile devices (Android, iOS, webOS) use a WebKit browser, you only need to target one browser.
* We are able to increase the speed greatly by removing support for legacy desktop browsers and taking advantage of browser features, like native JSON parsing and querySelectorAll


* MIT License
* @author AppMobi
* @api private
*/
if (!window.jq || typeof (jq) !== "function") {
    /**
     *  This is our master jq object that everything is built upon.
     * $ is a pointer to this object
     * @title jqMobi
     * @api private
     */
    var jq = (function(window) {
        var undefined, document = window.document, 
        emptyArray = [], 
        slice = emptyArray.slice, 
        classCache = [], 
        eventHandlers = [], 
        _eventID = 1, 
        jsonPHandlers = [], 
        _jsonPID = 1,
        fragementRE=/^\s*<(\w+)[^>]*>/,
        _attrCache={},
        _propCache={};
        
        
        /**
         * internal function to use domfragments for insertion
         *
         * @api private
        */
        function _insertFragments(jqm,container,insert){
            var frag=document.createDocumentFragment();
            if(insert){
                for(var j=jqm.length-1;j>=0;j--)
                {
                    frag.insertBefore(jqm[j],frag.firstChild);
                }
                container.insertBefore(frag,container.firstChild);
            
            }
            else {
            
                for(var j=0;j<jqm.length;j++)
                    frag.appendChild(jqm[j]);
                container.appendChild(frag);
            }
            frag=null;
        }
                
            
                    
        

        /**
         * Internal function to test if a class name fits in a regular expression
         * @param {String} name to search against
         * @return {Boolean}
         * @api private
         */
        function classRE(name) {
            return name in classCache ? classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'));
        }

        /**
         * Internal function that returns a array of unique elements
         * @param {Array} array to compare against
         * @return {Array} array of unique elements
         * @api private
         */
        function unique(arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr.indexOf(arr[i]) != i) {
                    arr.splice(i, 1);
                    i--;
                }
            }
            return arr;
        }

        /**
         * Given a set of nodes, it returns them as an array.  Used to find
         * siblings of an element
         * @param {Nodelist} Node list to search
         * @param {Object} [element] to find siblings off of
         * @return {Array} array of sibblings
         * @api private
         */
        function siblings(nodes, element) {
            var elems = [];
            if (nodes == undefined)
                return elems;
            
            for (; nodes; nodes = nodes.nextSibling) {
                if (nodes.nodeType == 1 && nodes !== element) {
                    elems.push(nodes);
                }
            }
            return elems;
        }

        /**
         * This is the internal jqMobi object that gets extended and added on to it
         * This is also the start of our query selector engine
         * @param {String|Element|Object|Array} selector
         * @param {String|Element|Object} [context]
         */
        var $jqm = function(toSelect, what) {
            this.length = 0;
            if (!toSelect) {
                return this;
            } else if (toSelect instanceof $jqm && what == undefined) {
                return toSelect;
            } else if ($.isFunction(toSelect)) {
                return $(document).ready(toSelect);
            } else if ($.isArray(toSelect) && toSelect.length != undefined) { //Passing in an array or object
                for (var i = 0; i < toSelect.length; i++)
                    this[this.length++] = toSelect[i];
                return this;
            } else if ($.isObject(toSelect) && $.isObject(what)) { //var tmp=$("span");  $("p").find(tmp);
                if (toSelect.length == undefined) {
                    if (toSelect.parentNode == what)
                        this[this.length++] = toSelect;
                } else {
                    for (var i = 0; i < toSelect.length; i++)
                        if (toSelect[i].parentNode == what)
                            this[this.length++] = toSelect[i];
                }
                return this;
            } else if ($.isObject(toSelect) && what == undefined) { //Single object
                this[this.length++] = toSelect;
                return this;
            } else if (what !== undefined) {
                if (what instanceof $jqm) {
                    return what.find(toSelect);
                }
            
            } else {
                what = document;
            }
            
            return this.selector(toSelect, what);
            
        };

        /**
         * This calls the $jqm function
         * @param {String|Element|Object|Array} selector
         * @param {String|Element|Object} [context]
         */
        var $ = function(selector, what) {
            return new $jqm(selector, what);
        };

        /**
         * this is the query selector library for elements
         * @param {String} selector
         * @param {String|Element|Object} [context]
         * @api private
         */
 		function _selectorAll(selector, what){
 			try{
 				return what.querySelectorAll(selector);
 			} catch(e){
 				return [];
 			}
 		};
        function _selector(selector, what) {
            

			selector=selector.trim();
            
            if (selector[0] === "#" && selector.indexOf(".")==-1 && selector.indexOf(" ")===-1 && selector.indexOf(">")===-1){
                if (what == document)
                    _shimNodes(what.getElementById(selector.replace("#", "")),this);
                else
                    _shimNodes(_selectorAll(selector, what),this);
            } else if (selector[0] === "<" && selector[selector.length - 1] === ">")  //html
            {
                var tmp = document.createElement("div");
                tmp.innerHTML = selector.trim();
                _shimNodes(tmp.childNodes,this);
            } else {
                _shimNodes((_selectorAll(selector, what)),this);
            }
            return this;
        }
		
        function _shimNodes(nodes,obj){
            if(!nodes)
                return;
            if(nodes.nodeType)
                return obj[obj.length++]=nodes;
            for(var i=0,iz=nodes.length;i<iz;i++)
                obj[obj.length++]=nodes[i];
        }
        /**
        * Checks to see if the parameter is a $jqm object
            ```
            var foo=$('#header');
            $.is$(foo);
            ```

        * @param {Object} element
        * @return {Boolean}
        * @title $.is$(param)
        */
		$.is$ = function(obj){return obj instanceof $jqm;}
        /**
        * Map takes in elements and executes a callback function on each and returns a collection
        ```
        $.map([1,2],function(ind){return ind+1});
        ```

        * @param {Array|Object} elements
        * @param {Function} callback
        * @return {Object} jqMobi object with elements in it
        * @title $.map(elements,callback)
        */
        $.map = function(elements, callback) {
            var value, values = [], 
            i, key;
            if ($.isArray(elements))
                for (i = 0; i < elements.length; i++) {
                    value = callback(elements[i], i);
                    if (value !== undefined)
                        values.push(value);
                }
            else if ($.isObject(elements))
                for (key in elements) {
                    if (!elements.hasOwnProperty(key))
                        continue;
                    value = callback(elements[key], key);
                    if (value !== undefined)
                        values.push(value);
                }
            return $([values]);
        };

        /**
        * Iterates through elements and executes a callback.  Returns if false
        ```
        $.each([1,2],function(ind){console.log(ind);});
        ```

        * @param {Array|Object} elements
        * @param {Function} callback
        * @return {Array} elements
        * @title $.each(elements,callback)
        */
        $.each = function(elements, callback) {
            var i, key;
            if ($.isArray(elements))
                for (i = 0; i < elements.length; i++) {
                    if (callback(i, elements[i]) === false)
                        return elements;
                }
            else if ($.isObject(elements))
                for (key in elements) {
                    if (!elements.hasOwnProperty(key))
                        continue;
                    if (callback(key, elements[key]) === false)
                        return elements;
                }
            return elements;
        };

        /**
        * Extends an object with additional arguments
            ```
            $.extend({foo:'bar'});
            $.extend(element,{foo:'bar'});
            ```

        * @param {Object} [target] element
        * @param any number of additional arguments
        * @return {Object} [target]
        * @title $.extend(target,{params})
        */
        $.extend = function(target) {
            if (target == undefined)
                target = this;
            if (arguments.length === 1) {
                for (var key in target)
                    this[key] = target[key];
                return this;
            } else {
                slice.call(arguments, 1).forEach(function(source) {
                    for (var key in source)
                        target[key] = source[key];
                });
            }
            return target;
        };

        /**
        * Checks to see if the parameter is an array
            ```
            var arr=[];
            $.isArray(arr);
            ```

        * @param {Object} element
        * @return {Boolean}
        * @example $.isArray([1]);
        * @title $.isArray(param)
        */
        $.isArray = function(obj) {
            return obj instanceof Array && obj['push'] != undefined; //ios 3.1.3 doesn't have Array.isArray
        };

        /**
        * Checks to see if the parameter is a function
            ```
            var func=function(){};
            $.isFunction(func);
            ```

        * @param {Object} element
        * @return {Boolean}
        * @title $.isFunction(param)
        */
        $.isFunction = function(obj) {
            return typeof obj === "function";
        };
        /**
        * Checks to see if the parameter is a object
            ```
            var foo={bar:'bar'};
            $.isObject(foo);
            ```

        * @param {Object} element
        * @return {Boolean}
        * @title $.isObject(param)
        */
        $.isObject = function(obj) {
            return typeof obj === "object";
        };

        /**
         * Prototype for jqm object.  Also extens $.fn
         */
        $.fn = $jqm.prototype = {
            constructor: $jqm,
            forEach: emptyArray.forEach,
            reduce: emptyArray.reduce,
            push: emptyArray.push,
            indexOf: emptyArray.indexOf,
            concat: emptyArray.concat,
            selector: _selector,
            oldElement: undefined,
            slice: emptyArray.slice,
            /**
             * This is a utility function for .end()
             * @param {Object} params
             * @return {Object} a jqMobi with params.oldElement set to this
             * @api private
             */
            setupOld: function(params) {
                if (params == undefined)
                    return $();
                params.oldElement = this;
                return params;
            
            },
            /**
            * This is a wrapper to $.map on the selected elements
                ```
                $().map(function(){this.value+=ind});
                ```

            * @param {Function} callback
            * @return {Object} a jqMobi object
            * @title $().map(function)
            */
            map: function(fn) {
                var value, values = [], i;
                for (i = 0; i < this.length; i++) {
                    value = fn(i,this[i]);
                    if (value !== undefined)
                        values.push(value);
                }
                return $([values]);
            },
            /**
            * Iterates through all elements and applys a callback function
                ```
                $().each(function(){console.log(this.value)});
                ```

            * @param {Function} callback
            * @return {Object} a jqMobi object
            * @title $().each(function)
            */
            each: function(callback) {
                this.forEach(function(el, idx) {
                    callback.call(el, idx, el);
                });
                return this;
            },
            /**
            * This is executed when DOMContentLoaded happens, or after if you've registered for it.
                ```
                $(document).ready(function(){console.log('I'm ready');});
                ```

            * @param {Function} callback
            * @return {Object} a jqMobi object
            * @title $().ready(function)
            */
            
            ready: function(callback) {
                if (document.readyState === "complete" || document.readyState === "loaded"||(!$.os.ie&&document.readyState==="interactive")) //IE10 fires interactive too early
                    callback();
                else
                    document.addEventListener("DOMContentLoaded", callback, false);
                return this;
            },
            /**
            * Searches through the collection and reduces them to elements that match the selector
                ```
                $("#foo").find('.bar');
                $("#foo").find($('.bar'));
                $("#foo").find($('.bar').get());
                ```

            * @param {String|Object|Array} selector
            * @return {Object} a jqMobi object filtered
            * @title $().find(selector)

            */
            find: function(sel) {
                if (this.length === 0)
                    return this;
                var elems = [];
                var tmpElems;
                for (var i = 0; i < this.length; i++) {
                    tmpElems = ($(sel, this[i]));
                    
                    for (var j = 0; j < tmpElems.length; j++) {
                        elems.push(tmpElems[j]);
                    }
                }
                return $(unique(elems));
            },
            /**
            * Gets or sets the innerHTML for the collection.
            * If used as a get, the first elements innerHTML is returned
                ```
                $("#foo").html(); //gets the first elements html
                $("#foo").html('new html');//sets the html
                $("#foo").html('new html',false); //Do not do memory management cleanup
                ```

            * @param {String} html to set
            * @param {Bool} [cleanup] - set to false for performance tests and if you do not want to execute memory management cleanup
            * @return {Object} a jqMobi object
            * @title $().html([html])
            */
            html: function(html,cleanup) {
                if (this.length === 0)
                    return this;
                if (html === undefined)
                    return this[0].innerHTML;

                for (var i = 0; i < this.length; i++) {
                    if(cleanup!==false)
                        $.cleanUpContent(this[i], false, true);
                    this[i].innerHTML = html;
                }
                return this;
            },


            /**
            * Gets or sets the innerText for the collection.
            * If used as a get, the first elements innerText is returned
                ```
                $("#foo").text(); //gets the first elements text;
                $("#foo").text('new text'); //sets the text
                ```

            * @param {String} text to set
            * @return {Object} a jqMobi object
            * @title $().text([text])
            */
            text: function(text) {
                if (this.length === 0)
                    return this;
                if (text === undefined)
                    return this[0].textContent;
                for (var i = 0; i < this.length; i++) {
                    this[i].textContent = text;
                }
                return this;
            },
            /**
            * Gets or sets a css property for the collection
            * If used as a get, the first elements css property is returned
                ```
                $().css("background"); // Gets the first elements background
                $().css("background","red")  //Sets the elements background to red
                ```

            * @param {String} attribute to get
            * @param {String} value to set as
            * @return {Object} a jqMobi object
            * @title $().css(attribute,[value])
            */
            css: function(attribute, value, obj) {
                var toAct = obj != undefined ? obj : this[0];
                if (this.length === 0)
                    return this;
                if (value == undefined && typeof (attribute) === "string") {
                    var styles = window.getComputedStyle(toAct);
                    return  toAct.style[attribute] ? toAct.style[attribute]: window.getComputedStyle(toAct)[attribute] ;
                }
                for (var i = 0; i < this.length; i++) {
                    if ($.isObject(attribute)) {
                        for (var j in attribute) {
                            this[i].style[j] = attribute[j];
                        }
                    } else {
                        this[i].style[attribute] = value;
                    }
                }
                return this;
            },
            /**
             * Gets or sets css vendor specific css properties
            * If used as a get, the first elements css property is returned
                ```
                $().css("background"); // Gets the first elements background
                $().css("background","red")  //Sets the elements background to red
                ```

            * @param {String} attribute to get
            * @param {String} value to set as
            * @return {Object} a jqMobi object
            * @title $().css(attribute,[value])
            */
            vendorCss:function(attribute,value,obj){
                return this.css($.feat.cssPrefix+attribute,value,obj);
            },
            /**
            * Sets the innerHTML of all elements to an empty string
                ```
                $().empty();
                ```

            * @return {Object} a jqMobi object
            * @title $().empty()
            */
            empty: function() {
                for (var i = 0; i < this.length; i++) {
                    $.cleanUpContent(this[i], false, true);
                    this[i].innerHTML = '';
                }
                return this;
            },
            /**
            * Sets the elements display property to "none".
            * This will also store the old property into an attribute for hide
                ```
                $().hide();
                ```

            * @return {Object} a jqMobi object
            * @title $().hide()
            */
            hide: function() {
                if (this.length === 0)
                    return this;
                for (var i = 0; i < this.length; i++) {
                    if (this.css("display", null, this[i]) != "none") {
                        this[i].setAttribute("jqmOldStyle", this.css("display", null, this[i]));
                        this[i].style.display = "none";
                    }
                }
                return this;
            },
            /**
            * Shows all the elements by setting the css display property
            * We look to see if we were retaining an old style (like table-cell) and restore that, otherwise we set it to block
                ```
                $().show();
                ```

            * @return {Object} a jqMobi object
            * @title $().show()
            */
            show: function() {
                if (this.length === 0)
                    return this;
                for (var i = 0; i < this.length; i++) {
                    if (this.css("display", null, this[i]) == "none") {
                        this[i].style.display = this[i].getAttribute("jqmOldStyle") ? this[i].getAttribute("jqmOldStyle") : 'block';
                        this[i].removeAttribute("jqmOldStyle");
                    }
                }
                return this;
            },
            /**
            * Toggle the visibility of a div
                ```
                $().toggle();
                $().toggle(true); //force showing
                ```

            * @param {Boolean} [show] -force the hiding or showing of the element
            * @return {Object} a jqMobi object
            * @title $().toggle([show])
            */
            toggle: function(show) {
                var show2 = show === true ? true : false;
                for (var i = 0; i < this.length; i++) {
                    if (window.getComputedStyle(this[i])['display'] !== "none" || (show !== undefined && show2 === false)) {
                        this[i].setAttribute("jqmOldStyle", this[i].style.display)
                        this[i].style.display = "none";
                    } else {
                        this[i].style.display = this[i].getAttribute("jqmOldStyle") != undefined ? this[i].getAttribute("jqmOldStyle") : 'block';
                        this[i].removeAttribute("jqmOldStyle");
                    }
                }
                return this;
            },
            /**
            * Gets or sets an elements value
            * If used as a getter, we return the first elements value.  If nothing is in the collection, we return undefined
                ```
                $().value; //Gets the first elements value;
                $().value="bar"; //Sets all elements value to bar
                ```

            * @param {String} [value] to set
            * @return {String|Object} A string as a getter, jqMobi object as a setter
            * @title $().val([value])
            */
            val: function(value) {
                if (this.length === 0)
                    return (value === undefined) ? undefined : this;
                if (value == undefined)
                    return this[0].value;
                for (var i = 0; i < this.length; i++) {
                    this[i].value = value;
                }
                return this;
            },
            /**
            * Gets or sets an attribute on an element
            * If used as a getter, we return the first elements value.  If nothing is in the collection, we return undefined
                ```
                $().attr("foo"); //Gets the first elements 'foo' attribute
                $().attr("foo","bar");//Sets the elements 'foo' attribute to 'bar'
                $().attr("foo",{bar:'bar'}) //Adds the object to an internal cache
                ```

            * @param {String|Object} attribute to act upon.  If it's an object (hashmap), it will set the attributes based off the kvp.
            * @param {String|Array|Object|function} [value] to set
            * @return {String|Object|Array|Function} If used as a getter, return the attribute value.  If a setter, return a jqMobi object
            * @title $().attr(attribute,[value])
            */
            attr: function(attr, value) {
                if (this.length === 0)
                    return (value === undefined) ? undefined : this;            
                if (value === undefined && !$.isObject(attr)) {
                    var val = (this[0].jqmCacheId&&_attrCache[this[0].jqmCacheId][attr])?(this[0].jqmCacheId&&_attrCache[this[0].jqmCacheId][attr]):this[0].getAttribute(attr);
                    return val;
                }
                for (var i = 0; i < this.length; i++) {
                    if ($.isObject(attr)) {
                        for (var key in attr) {
                            $(this[i]).attr(key,attr[key]);
                        }
                    }
                    else if($.isArray(value)||$.isObject(value)||$.isFunction(value))
                    {
                        
                        if(!this[i].jqmCacheId)
                            this[i].jqmCacheId=$.uuid();
                        
                        if(!_attrCache[this[i].jqmCacheId])
                            _attrCache[this[i].jqmCacheId]={}
                        _attrCache[this[i].jqmCacheId][attr]=value;
                    }
                    else if (value == null && value !== undefined)
                    {
                        this[i].removeAttribute(attr);
                        if(this[i].jqmCacheId&&_attrCache[this[i].jqmCacheId][attr])
                            delete _attrCache[this[i].jqmCacheId][attr];
                    }
                    else{
                        this[i].setAttribute(attr, value);
                    }
                }
                return this;
            },
            /**
            * Removes an attribute on the elements
                ```
                $().removeAttr("foo");
                ```

            * @param {String} attributes that can be space delimited
            * @return {Object} jqMobi object
            * @title $().removeAttr(attribute)
            */
            removeAttr: function(attr) {
                var that = this;
                for (var i = 0; i < this.length; i++) {
                    attr.split(/\s+/g).forEach(function(param) {
                        that[i].removeAttribute(param);
                        if(that[i].jqmCacheId&&_attrCache[that[i].jqmCacheId][attr])
                            delete _attrCache[that[i].jqmCacheId][attr];
                    });
                }
                return this;
            },

            /**
            * Gets or sets a property on an element
            * If used as a getter, we return the first elements value.  If nothing is in the collection, we return undefined
                ```
                $().prop("foo"); //Gets the first elements 'foo' property
                $().prop("foo","bar");//Sets the elements 'foo' property to 'bar'
                $().prop("foo",{bar:'bar'}) //Adds the object to an internal cache
                ```

            * @param {String|Object} property to act upon.  If it's an object (hashmap), it will set the attributes based off the kvp.
            * @param {String|Array|Object|function} [value] to set
            * @return {String|Object|Array|Function} If used as a getter, return the property value.  If a setter, return a jqMobi object
            * @title $().prop(property,[value])
            */
            prop: function(prop, value) {
                if (this.length === 0)
                    return (value === undefined) ? undefined : this;          
                if (value === undefined && !$.isObject(prop)) {
                    var res;
                    var val = (this[0].jqmCacheId&&_propCache[this[0].jqmCacheId][prop])?(this[0].jqmCacheId&&_propCache[this[0].jqmCacheId][prop]):!(res=this[0][prop])&&prop in this[0]?this[0][prop]:res;
                    return val;
                }
                for (var i = 0; i < this.length; i++) {
                    if ($.isObject(prop)) {
                        for (var key in prop) {
                            $(this[i]).prop(key,prop[key]);
                        }
                    }
                    else if($.isArray(value)||$.isObject(value)||$.isFunction(value))
                    {
                        
                        if(!this[i].jqmCacheId)
                            this[i].jqmCacheId=$.uuid();
                        
                        if(!_propCache[this[i].jqmCacheId])
                            _propCache[this[i].jqmCacheId]={}
                        _propCache[this[i].jqmCacheId][prop]=value;
                    }
                    else if (value == null && value !== undefined)
                    {
                        $(this[i]).removeProp(prop);
                    }
                    else{
                        this[i][prop]= value;
                    }
                }
                return this;
            },
            /**
            * Removes a property on the elements
                ```
                $().removeProp("foo");
                ```

            * @param {String} properties that can be space delimited
            * @return {Object} jqMobi object
            * @title $().removeProp(attribute)
            */
            removeProp: function(prop) {
                var that = this;
                for (var i = 0; i < this.length; i++) {
                    prop.split(/\s+/g).forEach(function(param) {
                        if(that[i][param])
                            delete that[i][param];
                        if(that[i].jqmCacheId&&_propCache[that[i].jqmCacheId][prop]){
                                delete _propCache[that[i].jqmCacheId][prop];
                        }
                    });
                }
                return this;
            },

            /**
            * Removes elements based off a selector
                ```
                $().remove();  //Remove all
                $().remove(".foo");//Remove off a string selector
                var element=$("#foo").get();
                $().remove(element); //Remove by an element
                $().remove($(".foo"));  //Remove by a collection

                ```

            * @param {String|Object|Array} selector to filter against
            * @return {Object} jqMobi object
            * @title $().remove(selector)
            */
            remove: function(selector) {
                var elems = $(this).filter(selector);
                if (elems == undefined)
                    return this;
                for (var i = 0; i < elems.length; i++) {
                    $.cleanUpContent(elems[i], true, true);
                    elems[i].parentNode.removeChild(elems[i]);
                }
                return this;
            },
            /**
            * Adds a css class to elements.
                ```
                $().addClass("selected");
                ```

            * @param {String} classes that are space delimited
            * @return {Object} jqMobi object
            * @title $().addClass(name)
            */
            addClass: function(name) {
                for (var i = 0; i < this.length; i++) {
                    var cls = this[i].className;
                    var classList = [];
                    var that = this;
                    name.split(/\s+/g).forEach(function(cname) {
                        if (!that.hasClass(cname, that[i]))
                            classList.push(cname);
                    });
                    
                    this[i].className += (cls ? " " : "") + classList.join(" ");
                    this[i].className = this[i].className.trim();
                }
                return this;
            },
            /**
            * Removes a css class from elements.
                ```
                $().removeClass("foo"); //single class
                $().removeClass("foo selected");//remove multiple classess
                ```

            * @param {String} classes that are space delimited
            * @return {Object} jqMobi object
            * @title $().removeClass(name)
            */
            removeClass: function(name) {
                for (var i = 0; i < this.length; i++) {
                    if (name == undefined) {
                        this[i].className = '';
                        return this;
                    }
                    var classList = this[i].className;
                    name.split(/\s+/g).forEach(function(cname) {
                        classList = classList.replace(classRE(cname), " ");
                    });
                    if (classList.length > 0)
                        this[i].className = classList.trim();
                    else
                        this[i].className = "";
                }
                return this;
            },
            /**
            * Replaces a css class on elements.
                ```
                $().replaceClass("on", "off");
                ```

            * @param {String} classes that are space delimited
			* @param {String} classes that are space delimited
            * @return {Object} jqMobi object
            * @title $().replaceClass(old, new)
            */
            replaceClass: function(name, newName) {
                for (var i = 0; i < this.length; i++) {
                    if (name == undefined) {
                        this[i].className = newName;
                        continue;
                    }
                    var classList = this[i].className;
                    name.split(/\s+/g).concat(newName.split(/\s+/g)).forEach(function(cname) {
                        classList = classList.replace(classRE(cname), " ");
                    });
					classList=classList.trim();
                    if (classList.length > 0){
                    	this[i].className = (classList+" "+newName).trim();
                    } else
                        this[i].className = newName;
                }
                return this;
            },
            /**
            * Checks to see if an element has a class.
                ```
                $().hasClass('foo');
                $().hasClass('foo',element);
                ```

            * @param {String} class name to check against
            * @param {Object} [element] to check against
            * @return {Boolean}
            * @title $().hasClass(name,[element])
            */
            hasClass: function(name, element) {
                if (this.length === 0)
                    return false;
                if (!element)
                    element = this[0];
                return classRE(name).test(element.className);
            },
            /**
            * Appends to the elements
            * We boil everything down to a jqMobi object and then loop through that.
            * If it's HTML, we create a dom element so we do not break event bindings.
            * if it's a script tag, we evaluate it.
                ```
                $().append("<div></div>"); //Creates the object from the string and appends it
                $().append($("#foo")); //Append an object;
                ```

            * @param {String|Object} Element/string to add
            * @param {Boolean} [insert] insert or append
            * @return {Object} jqMobi object
            * @title $().append(element,[insert])
            */
            append: function(element, insert) {
                if (element && element.length != undefined && element.length === 0)
                    return this;
                if ($.isArray(element) || $.isObject(element))
                    element = $(element);
                var i;
                
                
                for (i = 0; i < this.length; i++) {
                    if (element.length && typeof element != "string") {
                        element = $(element);
                        _insertFragments(element,this[i],insert);
                    } else {
                        var obj =fragementRE.test(element)?$(element):undefined;
                        if (obj == undefined || obj.length == 0) {
                            obj = document.createTextNode(element);
                        }
                        if (obj.nodeName != undefined && obj.nodeName.toLowerCase() == "script" && (!obj.type || obj.type.toLowerCase() === 'text/javascript')) {
                            window.eval(obj.innerHTML);
                        } else if(obj instanceof $jqm) {
                            _insertFragments(obj,this[i],insert);
                        }
                        else {
                            insert != undefined ? this[i].insertBefore(obj, this[i].firstChild) : this[i].appendChild(obj);
                        }
                    }
                }
                return this;
            },
             /**
            * Appends the current collection to the selector
                ```
                $().appendTo("#foo"); //Append an object;
                ```

            * @param {String|Object} Selector to append to
            * @param {Boolean} [insert] insert or append
            * @title $().appendTo(element,[insert])
            */
            appendTo:function(selector,insert){
                var tmp=$(selector);
                tmp.append(this);
                return this;
            },
             /**
            * Prepends the current collection to the selector
                ```
                $().prependTo("#foo"); //Prepend an object;
                ```

            * @param {String|Object} Selector to prepent to
            * @title $().prependTo(element)
            */
            prependTo:function(selector){
                var tmp=$(selector);
                tmp.append(this,true);
                return this;
            },
            /**
            * Prepends to the elements
            * This simply calls append and sets insert to true
                ```
                $().prepend("<div></div>");//Creates the object from the string and appends it
                $().prepend($("#foo")); //Prepends an object
                ```

            * @param {String|Object} Element/string to add
            * @return {Object} jqMobi object
            * @title $().prepend(element)
            */
            prepend: function(element) {
                return this.append(element, 1);
            },
            /**
             * Inserts collection before the target (adjacent)
                ```
                $().insertBefore(jq("#target"));
                ```
             
             * @param {String|Object} Target
             * @title $().insertBefore(target);
             */
            insertBefore: function(target, after) {
                if (this.length == 0)
                    return this;
                target = $(target).get(0);
                if (!target)
                    return this;
                for (var i = 0; i < this.length; i++) 
                {
                    after ? target.parentNode.insertBefore(this[i], target.nextSibling) : target.parentNode.insertBefore(this[i], target);
                }
                return this;
            },
            /**
             * Inserts collection after the target (adjacent)
                ```
                $().insertAfter(jq("#target"));
                ```
             * @param {String|Object} target
             * @title $().insertAfter(target);
             */
            insertAfter: function(target) {
                this.insertBefore(target, true);
            },
            /**
            * Returns the raw DOM element.
                ```
                $().get(); //returns the first element
                $().get(2);// returns the third element
                ```

            * @param {Int} [index]
            * @return {Object} raw DOM element
            * @title $().get([index])
            */
            get: function(index) {
                index = index == undefined ? 0 : index;
                if (index < 0)
                    index += this.length;
                return (this[index]) ? this[index] : undefined;
            },
            /**
            * Returns the offset of the element, including traversing up the tree
                ```
                $().offset();
                ```

            * @return {Object} with left, top, width and height properties
            * @title $().offset()
            */
            offset: function() {
                if (this.length === 0)
                    return this;
                if(this[0]==window)
                    return {
                        left:0,
                        top:0,
                        right:0,
                        bottom:0,
                        width:window.innerWidth,
                        height:window.innerHeight
                    }
                else
                    var obj = this[0].getBoundingClientRect();
                return {
                    left: obj.left + window.pageXOffset,
                    top: obj.top + window.pageYOffset,
                    right: obj.right + window.pageXOffset,
                    bottom: obj.bottom + window.pageYOffset,
                    width: obj.right-obj.left,
                    height: obj.bottom-obj.top
                };
            },
             /**
             * returns the height of the element, including padding on IE
               ```
               $().height();
               ```
             * @return {string} height
             * @title $().height()
             */
            height:function(val){
                if (this.length === 0)
                    return this;
                if(val!=undefined)
                    return this.css("height",val);
                if(this[0]==this[0].window)
                    return window.innerHeight;
                if(this[0].nodeType==this[0].DOCUMENT_NODE)
                    return this[0].documentElement['offsetheight'];
                else
                {
                    var tmpVal=this.css("height").replace("px","");
                    if(tmpVal)
                        return tmpVal
                    else
                        return this.offset().height;
                }
            },
            /**
             * returns the width of the element, including padding on IE
               ```
               $().width();
               ```
             * @return {string} width
             * @title $().width()
             */
            width:function(val){
                if (this.length === 0)
                    return this;
                 if(val!=undefined)
                    return this.css("width",val);
                if(this[0]==this[0].window)
                    return window.innerWidth;
                if(this[0].nodeType==this[0].DOCUMENT_NODE)
                    return this[0].documentElement['offsetwidth'];
                else{
                     var tmpVal=this.css("width").replace("px","");
                    if(tmpVal)
                        return tmpVal
                    else
                        return this.offset().width;
                }
            },
            /**
            * Returns the parent nodes of the elements based off the selector
                ```
                $("#foo").parent('.bar');
                $("#foo").parent($('.bar'));
                $("#foo").parent($('.bar').get());
                ```

            * @param {String|Array|Object} [selector]
            * @return {Object} jqMobi object with unique parents
            * @title $().parent(selector)
            */
            parent: function(selector,recursive) {
                if (this.length == 0)
                    return this;
                var elems = [];
                for (var i = 0; i < this.length; i++) {
                    var tmp=this[i];
                    while(tmp.parentNode&&tmp.parentNode!=document){
                        elems.push(tmp.parentNode);
                        if(tmp.parentNode)
                            tmp=tmp.parentNode;
                        if(!recursive)
                            break;
                    }
                }
                return this.setupOld($(unique(elems)).filter(selector));
            },
             /**
            * Returns the parents of the elements based off the selector (traversing up until html document)
                ```
                $("#foo").parents('.bar');
                $("#foo").parents($('.bar'));
                $("#foo").parents($('.bar').get());
                ```

            * @param {String|Array|Object} [selector]
            * @return {Object} jqMobi object with unique parents
            * @title $().parents(selector)
            */
            parents: function(selector) {
                return this.parent(selector,true);
            },
            /**
            * Returns the child nodes of the elements based off the selector
                ```
                $("#foo").children('.bar'); //Selector
                $("#foo").children($('.bar')); //Objects
                $("#foo").children($('.bar').get()); //Single element
                ```

            * @param {String|Array|Object} [selector]
            * @return {Object} jqMobi object with unique children
            * @title $().children(selector)
            */
            children: function(selector) {
                
                if (this.length == 0)
                    return this;
                var elems = [];
                for (var i = 0; i < this.length; i++) {
                    elems = elems.concat(siblings(this[i].firstChild));
                }
                return this.setupOld($((elems)).filter(selector));
            
            },
            /**
            * Returns the siblings of the element based off the selector
                ```
                $("#foo").siblings('.bar'); //Selector
                $("#foo").siblings($('.bar')); //Objects
                $("#foo").siblings($('.bar').get()); //Single element
                ```

            * @param {String|Array|Object} [selector]
            * @return {Object} jqMobi object with unique siblings
            * @title $().siblings(selector)
            */
            siblings: function(selector) {
                if (this.length == 0)
                    return this;
                var elems = [];
                for (var i = 0; i < this.length; i++) {
                    if (this[i].parentNode)
                        elems = elems.concat(siblings(this[i].parentNode.firstChild, this[i]));
                }
                return this.setupOld($(elems).filter(selector));
            },
            /**
            * Returns the closest element based off the selector and optional context
                ```
                $("#foo").closest('.bar'); //Selector
                $("#foo").closest($('.bar')); //Objects
                $("#foo").closest($('.bar').get()); //Single element
                ```

            * @param {String|Array|Object} selector
            * @param {Object} [context]
            * @return {Object} Returns a jqMobi object with the closest element based off the selector
            * @title $().closest(selector,[context]);
            */
            closest: function(selector, context) {
                if (this.length == 0)
                    return this;
                var elems = [], 
                cur = this[0];
                
                var start = $(selector, context);
                if (start.length == 0)
                    return $();
                while (cur && start.indexOf(cur) == -1) {
                    cur = cur !== context && cur !== document && cur.parentNode;
                }
                return $(cur);
            
            },
            /**
            * Filters elements based off the selector
                ```
                $("#foo").filter('.bar'); //Selector
                $("#foo").filter($('.bar')); //Objects
                $("#foo").filter($('.bar').get()); //Single element
                ```

            * @param {String|Array|Object} selector
            * @return {Object} Returns a jqMobi object after the filter was run
            * @title $().filter(selector);
            */
            filter: function(selector) {
                if (this.length == 0)
                    return this;
                
                if (selector == undefined)
                    return this;
                var elems = [];
                for (var i = 0; i < this.length; i++) {
                    var val = this[i];
                    if (val.parentNode && $(selector, val.parentNode).indexOf(val) >= 0)
                        elems.push(val);
                }
                return this.setupOld($(unique(elems)));
            },
            /**
            * Basically the reverse of filter.  Return all elements that do NOT match the selector
                ```
                $("#foo").not('.bar'); //Selector
                $("#foo").not($('.bar')); //Objects
                $("#foo").not($('.bar').get()); //Single element
                ```

            * @param {String|Array|Object} selector
            * @return {Object} Returns a jqMobi object after the filter was run
            * @title $().not(selector);
            */
            not: function(selector) {
                if (this.length == 0)
                    return this;
                var elems = [];
                for (var i = 0; i < this.length; i++) {
                    var val = this[i];
                    if (val.parentNode && $(selector, val.parentNode).indexOf(val) == -1)
                        elems.push(val);
                }
                return this.setupOld($(unique(elems)));
            },
            /**
            * Gets or set data-* attribute parameters on elements
            * When used as a getter, it's only the first element
                ```
                $().data("foo"); //Gets the data-foo attribute for the first element
                $().data("foo","bar"); //Sets the data-foo attribute for all elements
                $().data("foo",{bar:'bar'});//object as the data
                ```

            * @param {String} key
            * @param {String|Array|Object} value
            * @return {String|Object} returns the value or jqMobi object
            * @title $().data(key,[value]);
            */
            data: function(key, value) {
                return this.attr('data-' + key, value);
            },
            /**
            * Rolls back the jqMobi elements when filters were applied
            * This can be used after .not(), .filter(), .children(), .parent()
                ```
                $().filter(".panel").end(); //This will return the collection BEFORE filter is applied
                ```

            * @return {Object} returns the previous jqMobi object before filter was applied
            * @title $().end();
            */
            end: function() {
                return this.oldElement != undefined ? this.oldElement : $();
            },
            /**
            * Clones the nodes in the collection.
                ```
                $().clone();// Deep clone of all elements
                $().clone(false); //Shallow clone
                ```

            * @param {Boolean} [deep] - do a deep copy or not
            * @return {Object} jqMobi object of cloned nodes
            * @title $().clone();
            */
            clone: function(deep) {
                deep = deep === false ? false : true;
                if (this.length == 0)
                    return this;
                var elems = [];
                for (var i = 0; i < this.length; i++) {
                    elems.push(this[i].cloneNode(deep));
                }
                
                return $(elems);
            },
            /**
            * Returns the number of elements in the collection
                ```
                $().size();
                ```

            * @return {Int}
            * @title $().size();
            */
            size: function() {
                return this.length;
            },
            /**
             * Serailizes a form into a query string
               ```
               $().serialize();
               ```
             * @return {String}
             * @title $().serialize()
             */
            serialize: function() {
                if (this.length == 0)
                    return "";
                var params = [];
                for (var i = 0; i < this.length; i++) 
                {
                    this.slice.call(this[i].elements).forEach(function(elem) {
                        var type = elem.getAttribute("type");
                        if (elem.nodeName.toLowerCase() != "fieldset" && !elem.disabled && type != "submit" 
                        && type != "reset" && type != "button" && ((type != "radio" && type != "checkbox") || elem.checked))
                        {

                            if(elem.getAttribute("name")){
                                if(elem.type=="select-multiple"){
                                    for(var j=0;j<elem.options.length;j++){
                                        if(elem.options[j].selected)
                                            params.push(elem.getAttribute("name")+"="+encodeURIComponent(elem.options[j].value))
                                    }
                                }
                                else
                                    params.push(elem.getAttribute("name")+"="+encodeURIComponent(elem.value))
                            }
                        }
                    });
                }
                return params.join("&");
            },

            /* added in 1.2 */
            /**
             * Reduce the set of elements based off index
                ```
               $().eq(index)
               ```
             * @param {Int} index - Index to filter by. If negative, it will go back from the end
             * @return {Object} jqMobi object
             * @title $().eq(index)
             */
            eq:function(ind){
                return $(this.get(ind));
            },
            /**
             * Returns the index of the selected element in the collection
               ```
               $().index(elem)
               ```
             * @param {String|Object} element to look for.  Can be a selector or object
             * @return integer - index of selected element
             * @title $().index(elem)
             */
            index:function(elem){
                return elem?this.indexOf($(elem)[0]):this.parent().children().indexOf(this[0]);
            },
            /**
              * Returns boolean if the object is a type of the selector
              ```
              $().is(selector)
              ```
             * param {String|Object|Function} selector to act upon
             * @return boolean
             * @title $().is(selector)
             */
            is:function(selector){
                return !!selector&&this.filter(selector).length>0;
            }

        };


        /* AJAX functions */
        
        function empty() {
        }
        var ajaxSettings = {
            type: 'GET',
            beforeSend: empty,
            success: empty,
            error: empty,
            complete: empty,
            context: undefined,
            timeout: 0,
            crossDomain: null
        };
        /**
        * Execute a jsonP call, allowing cross domain scripting
        * options.url - URL to call
        * options.success - Success function to call
        * options.error - Error function to call
            ```
            $.jsonP({url:'mysite.php?callback=?&foo=bar',success:function(){},error:function(){}});
            ```

        * @param {Object} options
        * @title $.jsonP(options)
        */
        $.jsonP = function(options) {
            var callbackName = 'jsonp_callback' + (++_jsonPID);
            var abortTimeout = "", 
            context;
            var script = document.createElement("script");
            var abort = function() {
                $(script).remove();
                if (window[callbackName])
                    window[callbackName] = empty;
            };
            window[callbackName] = function(data) {
                clearTimeout(abortTimeout);
                $(script).remove();
                delete window[callbackName];
                options.success.call(context, data);
            };
            script.src = options.url.replace(/=\?/, '=' + callbackName);
            if(options.error)
            {
               script.onerror=function(){
                  clearTimeout(abortTimeout);
                  options.error.call(context, "", 'error');
               }
            }
            $('head').append(script);
            if (options.timeout > 0)
                abortTimeout = setTimeout(function() {
                    options.error.call(context, "", 'timeout');
                }, options.timeout);
            return {};
        };

        /**
        * Execute an Ajax call with the given options
        * options.type - Type of request
        * options.beforeSend - function to execute before sending the request
        * options.success - success callback
        * options.error - error callback
        * options.complete - complete callback - callled with a success or error
        * options.timeout - timeout to wait for the request
        * options.url - URL to make request against
        * options.contentType - HTTP Request Content Type
        * options.headers - Object of headers to set
        * options.dataType - Data type of request
        * options.data - data to pass into request.  $.param is called on objects
            ```
            var opts={
            type:"GET",
            success:function(data){},
            url:"mypage.php",
            data:{bar:'bar'},
            }
            $.ajax(opts);
            ```

        * @param {Object} options
        * @title $.ajax(options)
        */
        $.ajax = function(opts) {
            var xhr;
            try {
				
                var settings = opts || {};
                for (var key in ajaxSettings) {
                    if (typeof(settings[key]) == 'undefined')
                        settings[key] = ajaxSettings[key];
                }
                
                if (!settings.url)
                    settings.url = window.location;
                if (!settings.contentType)
                    settings.contentType = "application/x-www-form-urlencoded";
                if (!settings.headers)
                    settings.headers = {};
               
                if(!('async' in settings)||settings.async!==false)
                    settings.async=true;
                
                if (!settings.dataType)
                    settings.dataType = "text/html";
                else {
                    switch (settings.dataType) {
                        case "script":
                            settings.dataType = 'text/javascript, application/javascript';
                            break;
                        case "json":
                            settings.dataType = 'application/json';
                            break;
                        case "xml":
                            settings.dataType = 'application/xml, text/xml';
                            break;
                        case "html":
                            settings.dataType = 'text/html';
                            break;
                        case "text":
                            settings.dataType = 'text/plain';
                            break;
                        default:
                            settings.dataType = "text/html";
                            break;
                        case "jsonp":
                            return $.jsonP(opts);
                            break;
                    }
                }
                if ($.isObject(settings.data))
                    settings.data = $.param(settings.data);
                if (settings.type.toLowerCase() === "get" && settings.data) {
                    if (settings.url.indexOf("?") === -1)
                        settings.url += "?" + settings.data;
                    else
                        settings.url += "&" + settings.data;
                }
                
                if (/=\?/.test(settings.url)) {
                    return $.jsonP(settings);
                }
                if (settings.crossDomain === null) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) &&
                    RegExp.$2 != window.location.host;
                
                if(!settings.crossDomain)
                    settings.headers = $.extend({'X-Requested-With': 'XMLHttpRequest'}, settings.headers);
                var abortTimeout;
                var context = settings.context;
                var protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;
				
				//ok, we are really using xhr
				xhr = new window.XMLHttpRequest();
				
				
                xhr.onreadystatechange = function() {
                    var mime = settings.dataType;
                    if (xhr.readyState === 4) {
                        clearTimeout(abortTimeout);
                        var result, error = false;
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0&&protocol=='file:') {
                            if (mime === 'application/json' && !(/^\s*$/.test(xhr.responseText))) {
                                try {
                                    result = JSON.parse(xhr.responseText);
                                } catch (e) {
                                    error = e;
                                }
                            } else if (mime === 'application/xml, text/xml') {
                                result = xhr.responseXML;
                            } 
                            else if(mime=="text/html"){
                                result=xhr.responseText;
                                $.parseJS(result);
                            }
                            else
                                result = xhr.responseText;
                            //If we're looking at a local file, we assume that no response sent back means there was an error
                            if(xhr.status===0&&result.length===0)
                                error=true;
                            if (error)
                                settings.error.call(context, xhr, 'parsererror', error);
                            else {
                                settings.success.call(context, result, 'success', xhr);
                            }
                        } else {
                            error = true;
                            settings.error.call(context, xhr, 'error');
                        }
                        settings.complete.call(context, xhr, error ? 'error' : 'success');
                    }
                };
                xhr.open(settings.type, settings.url, settings.async);
				if (settings.withCredentials) xhr.withCredentials = true;
                
                if (settings.contentType)
                    settings.headers['Content-Type'] = settings.contentType;
                for (var name in settings.headers)
                    xhr.setRequestHeader(name, settings.headers[name]);
                if (settings.beforeSend.call(context, xhr, settings) === false) {
                    xhr.abort();
                    return false;
                }
                
                if (settings.timeout > 0)
                    abortTimeout = setTimeout(function() {
                        xhr.onreadystatechange = empty;
                        xhr.abort();
                        settings.error.call(context, xhr, 'timeout');
                    }, settings.timeout);
                xhr.send(settings.data);
            } catch (e) {
            	// General errors (e.g. access denied) should also be sent to the error callback
                console.log(e);
            	settings.error.call(context, xhr, 'error', e);
            }
            return xhr;
        };
        
        
        /**
        * Shorthand call to an Ajax GET request
            ```
            $.get("mypage.php?foo=bar",function(data){});
            ```

        * @param {String} url to hit
        * @param {Function} success
        * @title $.get(url,success)
        */
        $.get = function(url, success) {
            return this.ajax({
                url: url,
                success: success
            });
        };
        /**
        * Shorthand call to an Ajax POST request
            ```
            $.post("mypage.php",{bar:'bar'},function(data){});
            ```

        * @param {String} url to hit
        * @param {Object} [data] to pass in
        * @param {Function} success
        * @param {String} [dataType]
        * @title $.post(url,[data],success,[dataType])
        */
        $.post = function(url, data, success, dataType) {
            if (typeof (data) === "function") {
                success = data;
                data = {};
            }
            if (dataType === undefined)
                dataType = "html";
            return this.ajax({
                url: url,
                type: "POST",
                data: data,
                dataType: dataType,
                success: success
            });
        };
        /**
        * Shorthand call to an Ajax request that expects a JSON response
            ```
            $.getJSON("mypage.php",{bar:'bar'},function(data){});
            ```

        * @param {String} url to hit
        * @param {Object} [data]
        * @param {Function} [success]
        * @title $.getJSON(url,data,success)
        */
        $.getJSON = function(url, data, success) {
            if (typeof (data) === "function") {
                success = data;
                data = {};
            }
            return this.ajax({
                url: url,
                data: data,
                success: success,
                dataType: "json"
            });
        };

        /**
        * Converts an object into a key/value par with an optional prefix.  Used for converting objects to a query string
            ```
            var obj={
            foo:'foo',
            bar:'bar'
            }
            var kvp=$.param(obj,'data');
            ```

        * @param {Object} object
        * @param {String} [prefix]
        * @return {String} Key/value pair representation
        * @title $.param(object,[prefix];
        */
        $.param = function(obj, prefix) {
            var str = [];
            if (obj instanceof $jqm) {
                obj.each(function() {
                    var k = prefix ? prefix + "[]" : this.id, 
                    v = this.value;
                    str.push((k) + "=" + encodeURIComponent(v));
                });
            } else {
                for (var p in obj) {
                    var k = prefix ? prefix + "[" + p + "]" : p, 
                    v = obj[p];
                    str.push($.isObject(v) ? $.param(v, k) : (k) + "=" + encodeURIComponent(v));
                }
            }
            return str.join("&");
        };
        /**
        * Used for backwards compatibility.  Uses native JSON.parse function
            ```
            var obj=$.parseJSON("{\"bar\":\"bar\"}");
            ```

        * @params {String} string
        * @return {Object}
        * @title $.parseJSON(string)
        */
        $.parseJSON = function(string) {
            return JSON.parse(string);
        };
        /**
        * Helper function to convert XML into  the DOM node representation
            ```
            var xmlDoc=$.parseXML("<xml><foo>bar</foo></xml>");
            ```

        * @param {String} string
        * @return {Object} DOM nodes
        * @title $.parseXML(string)
        */
        $.parseXML = function(string) {
            return (new DOMParser).parseFromString(string, "text/xml");
        };
        /**
         * Helper function to parse the user agent.  Sets the following
         * .os.webkit
         * .os.android
         * .os.ipad
         * .os.iphone
         * .os.webos
         * .os.touchpad
         * .os.blackberry
         * .os.opera
         * .os.fennec
         * .os.ie
         * .os.ieTouch
         * .os.supportsTouch
         * .os.playbook
         * .feat.nativetouchScroll
         * @api private
         */
        function detectUA($, userAgent) {
            $.os = {};
            $.os.webkit = userAgent.match(/WebKit\/([\d.]+)/) ? true : false;
            $.os.android = userAgent.match(/(Android)\s+([\d.]+)/) || userAgent.match(/Silk-Accelerated/) ? true : false;
			$.os.androidICS = $.os.android && userAgent.match(/(Android)\s4/) ? true : false;
            $.os.ipad = userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false;
            $.os.iphone = !$.os.ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true : false;
            $.os.webos = userAgent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/) ? true : false;
            $.os.touchpad = $.os.webos && userAgent.match(/TouchPad/) ? true : false;
            $.os.ios = $.os.ipad || $.os.iphone;
			$.os.playbook = userAgent.match(/PlayBook/) ? true : false;
            $.os.blackberry = $.os.playbook || userAgent.match(/BlackBerry/) ? true : false;
			$.os.blackberry10 = $.os.blackberry && userAgent.match(/Safari\/536/) ? true : false;
            $.os.chrome = userAgent.match(/Chrome/) ? true : false;
			$.os.opera = userAgent.match(/Opera/) ? true : false;
            $.os.fennec = userAgent.match(/fennec/i) ? true :userAgent.match(/Firefox/)?true: false;
            $.os.ie = userAgent.match(/MSIE 10.0/i)?true:false;
            $.os.ieTouch=$.os.ie&&userAgent.toLowerCase().match(/touch/i)?true:false;
            $.os.supportsTouch = ((window.DocumentTouch && document instanceof window.DocumentTouch) || 'ontouchstart' in window);
            //features
            $.feat = {};
            var head=document.documentElement.getElementsByTagName("head")[0];
            $.feat.nativeTouchScroll =  typeof(head.style["-webkit-overflow-scrolling"])!=="undefined"&&$.os.ios;
            $.feat.cssPrefix=$.os.webkit?"Webkit":$.os.fennec?"Moz":$.os.ie?"ms":$.os.opera?"O":"";
            $.feat.cssTransformStart=!$.os.opera?"3d(":"(";
            $.feat.cssTransformEnd=!$.os.opera?",0)":")";
            if($.os.android&&!$.os.webkit)
                $.os.android=false;
        }

        detectUA($, navigator.userAgent);
        $.__detectUA = detectUA; //needed for unit tests
        if (typeof String.prototype.trim !== 'function') {
            /**
             * Helper function for iOS 3.1.3
             */
            String.prototype.trim = function() {
                this.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/, '');
                return this
            };
        }
        
        /**
         * Utility function to create a psuedo GUID
           ```
           var id= $.uuid();
           ```
         * @title $.uuid
         */
        $.uuid = function () {
            var S4 = function () {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }
            return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        };

        /**
         * Gets the css matrix, or creates a fake one
           ```
           $.getCssMatrix(domElement)
           ```
           @returns matrix with postion
           */
        $.getCssMatrix=function(ele){
            if(ele==undefined) return window.WebKitCSSMatrix||window.MSCSSMatrix|| {a:0,b:0,c:0,d:0,e:0,f:0};
            try{
                if(window.WebKitCSSMatrix)
                    return new WebKitCSSMatrix(window.getComputedStyle(ele).webkitTransform)
                else if(window.MSCSSMatrix)
                    return new MSCSSMatrix(window.getComputedStyle(ele).transform);
                else {
                    //fake css matrix
                    var mat = window.getComputedStyle(ele)[$.feat.cssPrefix+'Transform'].replace(/[^0-9\-.,]/g, '').split(',');
                    return {a:+mat[0],b:+mat[1],c:+mat[2],d:+mat[3], e: +mat[4], f:+mat[5]};
                }
            }
            catch(e){
                return {a:0,b:0,c:0,d:0,e:0,f:0};
            }
        }

        
        /**
         Zepto.js events
         @api private
         */

        //The following is modified from Zepto.js / events.js
        //We've removed depricated jQuery events like .live and allow anonymous functions to be removed
        var handlers = {}, 
        _jqmid = 1;
        /**
         * Gets or sets the expando property on a javascript element
         * Also increments the internal counter for elements;
         * @param {Object} element
         * @return {Int} jqmid
         * @api private
         */
        function jqmid(element) {
            return element._jqmid || (element._jqmid = _jqmid++);
        }
        /**
         * Searches through a local array that keeps track of event handlers for proxying.
         * Since we listen for multiple events, we match up the event, function and selector.
         * This is used to find, execute, remove proxied event functions
         * @param {Object} element
         * @param {String} [event]
         * @param {Function} [function]
         * @param {String|Object|Array} [selector]
         * @return {Function|null} handler function or false if not found
         * @api private
         */
        function findHandlers(element, event, fn, selector) {
            event = parse(event);
            if (event.ns)
                var matcher = matcherFor(event.ns);
            return (handlers[jqmid(element)] || []).filter(function(handler) {
                return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || handler.fn == fn || (typeof handler.fn === 'function' && typeof fn === 'function' && "" + handler.fn === "" + fn)) && (!selector || handler.sel == selector);
            });
        }
        /**
         * Splits an event name by "." to look for namespaces (e.g touch.click)
         * @param {String} event
         * @return {Object} an object with the event name and namespace
         * @api private
         */
        function parse(event) {
            var parts = ('' + event).split('.');
            return {
                e: parts[0],
                ns: parts.slice(1).sort().join(' ')
            };
        }
        /**
         * Regular expression checker for event namespace checking
         * @param {String} namespace
         * @return {Regex} regular expression
         * @api private
         */
        function matcherFor(ns) {
            return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
        }

        /**
         * Utility function that will loop through events that can be a hash or space delimited and executes the function
         * @param {String|Object} events
         * @param {Function} fn
         * @param {Iterator} [iterator]
         * @api private
         */
        function eachEvent(events, fn, iterator) {
            if ($.isObject(events))
                $.each(events, iterator);
            else
                events.split(/\s/).forEach(function(type) {
                    iterator(type, fn)
                });
        }

        /**
         * Helper function for adding an event and creating the proxy handler function.
         * All event handlers call this to wire event listeners up.  We create proxy handlers so they can be removed then.
         * This is needed for delegate/on
         * @param {Object} element
         * @param {String|Object} events
         * @param {Function} function that will be executed when event triggers
         * @param {String|Array|Object} [selector]
         * @param {Function} [getDelegate]
         * @api private
         */
        function add(element, events, fn, selector, getDelegate) {
            var id = jqmid(element), 
            set = (handlers[id] || (handlers[id] = []));
            eachEvent(events, fn, function(event, fn) {
                var delegate = getDelegate && getDelegate(fn, event), 
                callback = delegate || fn;
                var proxyfn = function(event) {
                    var result = callback.apply(element, [event].concat(event.data));
                    if (result === false)
                        event.preventDefault();
                    return result;
                };
                var handler = $.extend(parse(event), {
                    fn: fn,
                    proxy: proxyfn,
                    sel: selector,
                    del: delegate,
                    i: set.length
                });
                set.push(handler);
                element.addEventListener(handler.e, proxyfn, false);
            });
            //element=null;
        }

        /**
         * Helper function to remove event listeners.  We look through each event and then the proxy handler array to see if it exists
         * If found, we remove the listener and the entry from the proxy array.  If no function is specified, we remove all listeners that match
         * @param {Object} element
         * @param {String|Object} events
         * @param {Function} [fn]
         * @param {String|Array|Object} [selector]
         * @api private
         */
        function remove(element, events, fn, selector) {
            
            var id = jqmid(element);
            eachEvent(events || '', fn, function(event, fn) {
                findHandlers(element, event, fn, selector).forEach(function(handler) {
                    delete handlers[id][handler.i];
                    element.removeEventListener(handler.e, handler.proxy, false);
                });
            });
        }
        
        $.event = {
            add: add,
            remove: remove
        }

        /**
        * Binds an event to each element in the collection and executes the callback
            ```
            $().bind('click',function(){console.log('I clicked '+this.id);});
            ```

        * @param {String|Object} event
        * @param {Function} callback
        * @return {Object} jqMobi object
        * @title $().bind(event,callback)
        */
        $.fn.bind = function(event, callback) {
            for (var i = 0; i < this.length; i++) {
                add(this[i], event, callback);
            }
            return this;
        };
        /**
        * Unbinds an event to each element in the collection.  If a callback is passed in, we remove just that one, otherwise we remove all callbacks for those events
            ```
            $().unbind('click'); //Unbinds all click events
            $().unbind('click',myFunc); //Unbinds myFunc
            ```

        * @param {String|Object} event
        * @param {Function} [callback]
        * @return {Object} jqMobi object
        * @title $().unbind(event,[callback]);
        */
        $.fn.unbind = function(event, callback) {
            for (var i = 0; i < this.length; i++) {
                remove(this[i], event, callback);
            }
            return this;
        };

        /**
        * Binds an event to each element in the collection that will only execute once.  When it executes, we remove the event listener then right away so it no longer happens
            ```
            $().one('click',function(){console.log('I was clicked once');});
            ```

        * @param {String|Object} event
        * @param {Function} [callback]
        * @return jqMobi object
        * @title $().one(event,callback);
        */
        $.fn.one = function(event, callback) {
            return this.each(function(i, element) {
                add(this, event, callback, null, function(fn, type) {
                    return function() {
                        var result = fn.apply(element, arguments);
                        remove(element, type, fn);
                        return result;
                    }
                });
            });
        };
        
         /**
         * internal variables
         * @api private
         */
        
        var returnTrue = function() {
            return true
        }, 
        returnFalse = function() {
            return false
        }, 
        eventMethods = {
            preventDefault: 'isDefaultPrevented',
            stopImmediatePropagation: 'isImmediatePropagationStopped',
            stopPropagation: 'isPropagationStopped'
        };
        /**
         * Creates a proxy function for event handlers
         * @param {String} event
         * @return {Function} proxy
         * @api private
         */
        function createProxy(event) {
            var proxy = $.extend({
                originalEvent: event
            }, event);
            $.each(eventMethods, function(name, predicate) {
                proxy[name] = function() {
                    this[predicate] = returnTrue;
                    return event[name].apply(event, arguments);
                };
                proxy[predicate] = returnFalse;
            })
            return proxy;
        }

        /**
        * Delegate an event based off the selector.  The event will be registered at the parent level, but executes on the selector.
            ```
            $("#div").delegate("p",'click',callback);
            ```

        * @param {String|Array|Object} selector
        * @param {String|Object} event
        * @param {Function} callback
        * @return {Object} jqMobi object
        * @title $().delegate(selector,event,callback)
        */
        $.fn.delegate = function(selector, event, callback) {
            for (var i = 0; i < this.length; i++) {
                var element = this[i];
                add(element, event, callback, selector, function(fn) {
                    return function(e) {
                        var evt, match = $(e.target).closest(selector, element).get(0);
                        if (match) {
                            evt = $.extend(createProxy(e), {
                                currentTarget: match,
                                liveFired: element
                            });
                            return fn.apply(match, [evt].concat([].slice.call(arguments, 1)));
                        }
                    }
                });
            }
            return this;
        };

        /**
        * Unbinds events that were registered through delegate.  It acts upon the selector and event.  If a callback is specified, it will remove that one, otherwise it removes all of them.
            ```
            $("#div").undelegate("p",'click',callback);//Undelegates callback for the click event
            $("#div").undelegate("p",'click');//Undelegates all click events
            ```

        * @param {String|Array|Object} selector
        * @param {String|Object} event
        * @param {Function} callback
        * @return {Object} jqMobi object
        * @title $().undelegate(selector,event,[callback]);
        */
        $.fn.undelegate = function(selector, event, callback) {
            for (var i = 0; i < this.length; i++) {
                remove(this[i], event, callback, selector);
            }
            return this;
        }

        /**
        * Similar to delegate, but the function parameter order is easier to understand.
        * If selector is undefined or a function, we just call .bind, otherwise we use .delegate
            ```
            $("#div").on("click","p",callback);
            ```

        * @param {String|Array|Object} selector
        * @param {String|Object} event
        * @param {Function} callback
        * @return {Object} jqMobi object
        * @title $().on(event,selector,callback);
        */
        $.fn.on = function(event, selector, callback) {
            return selector === undefined || $.isFunction(selector) ? this.bind(event, selector) : this.delegate(selector, event, callback);
        };
        /**
        * Removes event listeners for .on()
        * If selector is undefined or a function, we call unbind, otherwise it's undelegate
            ```
            $().off("click","p",callback); //Remove callback function for click events
            $().off("click","p") //Remove all click events
            ```

        * @param {String|Object} event
        * @param {String|Array|Object} selector
        * @param {Sunction} callback
        * @return {Object} jqMobi object
        * @title $().off(event,selector,[callback])
        */
        $.fn.off = function(event, selector, callback) {
            return selector === undefined || $.isFunction(selector) ? this.unbind(event, selector) : this.undelegate(selector, event, callback);
        };

        /**
        This triggers an event to be dispatched.  Usefull for emulating events, etc.
        ```
        $().trigger("click",{foo:'bar'});//Trigger the click event and pass in data
        ```

        * @param {String|Object} event
        * @param {Object} [data]
        * @return {Object} jqMobi object
        * @title $().trigger(event,data);
        */
        $.fn.trigger = function(event, data, props) {
            if (typeof event == 'string')
                event = $.Event(event, props);
            event.data = data;
            for (var i = 0; i < this.length; i++) {
                this[i].dispatchEvent(event)
            }
            return this;
        };

        /**
         * Creates a custom event to be used internally.
         * @param {String} type
         * @param {Object} [properties]
         * @return {event} a custom event that can then be dispatched
         * @title $.Event(type,props);
         */
        
        $.Event = function(type, props) {
            var event = document.createEvent('Events'), 
            bubbles = true;
            if (props)
                for (var name in props)
                    (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name]);
            event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null);
            return event;
        };
		
        /* The following are for events on objects */
		/**
         * Bind an event to an object instead of a DOM Node 
           ```
           $.bind(this,'event',function(){});
           ```
         * @param {Object} object
         * @param {String} event name
         * @param {Function} function to execute
         * @title $.bind(object,event,function);
         */
		$.bind = function(obj, ev, f){
			if(!obj.__events) obj.__events = {};
			if(!$.isArray(ev)) ev = [ev];
			for(var i=0; i<ev.length; i++){
				if(!obj.__events[ev[i]]) obj.__events[ev[i]] = [];
				obj.__events[ev[i]].push(f);
			}
		};

        /**
         * Trigger an event to an object instead of a DOM Node 
           ```
           $.trigger(this,'event',arguments);
           ```
         * @param {Object} object
         * @param {String} event name
         * @param {Array} arguments
         * @title $.trigger(object,event,argments);
         */
		$.trigger = function(obj, ev, args){
			var ret = true;
			if(!obj.__events) return ret;
			if(!$.isArray(ev)) ev = [ev];
			if(!$.isArray(args)) args = [];
			for(var i=0; i<ev.length; i++){
				if(obj.__events[ev[i]]){
					var evts = obj.__events[ev[i]];
					for(var j = 0; j<evts.length; j++)
						if($.isFunction(evts[j]) && evts[j].apply(obj, args)===false) 
							ret = false;
				}
			}
			return ret;
		};
        /**
         * Unbind an event to an object instead of a DOM Node 
           ```
           $.unbind(this,'event',function(){});
           ```
         * @param {Object} object
         * @param {String} event name
         * @param {Function} function to execute
         * @title $.unbind(object,event,function);
         */
        $.unbind = function(obj, ev, f){
			if(!obj.__events) return;
			if(!$.isArray(ev)) ev = [ev];
			for(var i=0; i<ev.length; i++){
				if(obj.__events[ev[i]]){
					var evts = obj.__events[ev[i]];
					for(var j = 0; j<evts.length; j++){
                        if(f==undefined)
                            delete evts[j];
						if(evts[j]==f) {
							evts.splice(j,1);
							break;
						}
					}
				}
			}
		};
		
        
        /**
         * Creates a proxy function so you can change the 'this' context in the function
		 * Update: now also allows multiple argument call or for you to pass your own arguments
         ```
            var newObj={foo:bar}
            $("#main").bind("click",$.proxy(function(evt){console.log(this)},newObj);
			
			or 
			
			( $.proxy(function(foo, bar){console.log(this+foo+bar)}, newObj) )('foo', 'bar');
			
			or 
			
			( $.proxy(function(foo, bar){console.log(this+foo+bar)}, newObj, ['foo', 'bar']) )();
         ```
         
         * @param {Function} Callback
         * @param {Object} Context
         * @title $.proxy(callback,context);
         */
		$.proxy=function(f, c, args){
           	return function(){
				if(args) return f.apply(c, args);	//use provided arguments
               	return f.apply(c, arguments);	//use scope function call arguments
            }
		}

      
         /**
         * Removes listeners on a div and its children recursively
            ```
             cleanUpNode(node,kill)
            ```
         * @param {HTMLDivElement} the element to clean up recursively
         * @api private
         */
		function cleanUpNode(node, kill){
			//kill it before it lays eggs!
			if(kill && node.dispatchEvent){
	            var e = $.Event('destroy', {bubbles:false});
	            node.dispatchEvent(e);
			}
			//cleanup itself
            var id = jqmid(node);
            if(id && handlers[id]){
		    	for(var key in handlers[id])
		        	node.removeEventListener(handlers[id][key].e, handlers[id][key].proxy, false);
            	delete handlers[id];
            }
		}
		function cleanUpContent(node, kill){
            if(!node) return;
			//cleanup children
            var children = node.childNodes;
            if(children && children.length > 0)
                for(var child in children)
                    cleanUpContent(children[child], kill);
			
			cleanUpNode(node, kill);
		}
		var cleanUpAsap = function(els, kill){
        	for(var i=0;i<els.length;i++){
            	cleanUpContent(els[i], kill);
            }	
		}

        /**
         * Function to clean up node content to prevent memory leaks
           ```
           $.cleanUpContent(node,itself,kill)
           ```
         * @param {HTMLNode} node
         * @param {Bool} kill itself
         * @param {kill} Kill nodes
         * @title $.cleanUpContent(node,itself,kill)
         */
        $.cleanUpContent = function(node, itself, kill){
            if(!node) return;
			//cleanup children
            var cn = node.childNodes;
            if(cn && cn.length > 0){
				//destroy everything in a few ms to avoid memory leaks
				//remove them all and copy objs into new array
				$.asap(cleanUpAsap, {}, [slice.apply(cn, [0]), kill]);
            }
			//cleanUp this node
			if(itself) cleanUpNode(node, kill);
        }
		
        // Like setTimeout(fn, 0); but much faster
		var timeouts = [];
		var contexts = [];
		var params = [];
        /**
         * This adds a command to execute in the JS stack, but is faster then setTimeout
           ```
           $.asap(function,context,args)
           ```
         * @param {Function} function
         * @param {Object} context
         * @param {Array} arguments
         */
        $.asap = function(fn, context, args) {
			if(!$.isFunction(fn)) throw "$.asap - argument is not a valid function";
            timeouts.push(fn);
			contexts.push(context?context:{});
			params.push(args?args:[]);
			//post a message to ourselves so we know we have to execute a function from the stack 
            window.postMessage("jqm-asap", "*");
        }
		window.addEventListener("message", function(event) {
            if (event.source == window && event.data == "jqm-asap") {
                event.stopPropagation();
                if (timeouts.length > 0) {	//just in case...
                    (timeouts.shift()).apply(contexts.shift(), params.shift());
                }
            }
        }, true);

        /**
         * this function executes javascript in HTML.
           ```
           $.parseJS(content)
           ```
        * @param {String|DOM} content
        * @title $.parseJS(content);
        */
        var remoteJSPages={};
        $.parseJS= function(div) {
            if (!div)
                return;
            if(typeof(div)=="string"){
                var elem=document.createElement("div");
                elem.innerHTML=div;
                div=elem;
            }
            var scripts = div.getElementsByTagName("script");
            div = null;            
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].src.length > 0 && !remoteJSPages[scripts[i].src]) {
                    var doc = document.createElement("script");
                    doc.type = scripts[i].type;
                    doc.src = scripts[i].src;
                    document.getElementsByTagName('head')[0].appendChild(doc);
                    remoteJSPages[scripts[i].src] = 1;
                    doc = null;
                } else {
                    window.eval(scripts[i].innerHTML);
                }
            }
        };
		

        /**
        //custom events since people want to do $().click instead of $().bind("click")
        */

        ["click","keydown","keyup","keypress","submit","load","resize","change","select","error"].forEach(function(event){
            $.fn[event]=function(cb){
                return cb?this.bind(event,cb):this.trigger(event);
            }
        });
         /**
         * End of APIS
         * @api private
         */
        return $;

    })(window);
    '$' in window || (window.$ = jq);
    //Helper function used in jq.mobi.plugins.
    if (!window.numOnly) {
        window.numOnly = function numOnly(val) {
			if (val===undefined || val==='') return 0;
			if ( isNaN( parseFloat(val) ) ){
				if(val.replace){
					val = val.replace(/[^0-9.-]/, "");
				} else return 0;
			}  
            return parseFloat(val);
        }
    }
}

(function ($) {
    var cache = [];
    var objId=function(obj){
        if(!obj.jqmCSS3AnimateId) obj.jqmCSS3AnimateId=$.uuid();
        return obj.jqmCSS3AnimateId;
    }
    var getEl=function(elID){
        if (typeof elID == "string" || elID instanceof String) {
            return document.getElementById(elID);
        } else if($.is$(elID)){
            return elID[0];
        } else {
            return elID;
        }
    }
    var getCSS3Animate=function(obj, options){
        var tmp, id, el = getEl(obj);
        //first one
        id = objId(el);
        if(cache[id]){
            cache[id].animate(options);
            tmp = cache[id];
        } else {
            tmp = css3Animate(el, options);
            cache[id] = tmp;
        }
        return tmp;
    }
    $.fn["css3Animate"] = function (opts) {
        //keep old callback system - backwards compatibility - should be deprecated in future versions
        if(!opts.complete && opts.callback) opts.complete = opts.callback;
        //first on
        var tmp = getCSS3Animate(this[0], opts);
        opts.complete=null;
        opts.sucess=null;
        opts.failure=null;
        for (var i = 1; i < this.length; i++) {
            tmp.link(this[i], opts);
        }
        return tmp;
    };
    

    $["css3AnimateQueue"] = function () {
        return new css3Animate.queue();
    }

    //if (!window.WebKitCSSMatrix) return;
    var translateOpen =$.feat.cssTransformStart;
    var translateClose = $.feat.cssTransformEnd;
    var transitionEnd=$.feat.cssPrefix.replace(/-/g,"")+"TransitionEnd";
    transitionEnd=($.os.fennec||$.feat.cssPrefix==""||$.os.ie)?"transitionend":transitionEnd;

    transitionEnd=transitionEnd.replace(transitionEnd.charAt(0),transitionEnd.charAt(0).toLowerCase());
    
    var css3Animate = (function () {
        
        var css3Animate = function (elID, options) {
            if(!(this instanceof css3Animate)) return new css3Animate(elID, options);
            
            //start doing stuff
            this.callbacksStack = [];
            this.activeEvent = null;
            this.countStack = 0;
            this.isActive = false;
            this.el = elID;
            this.linkFinishedProxy_ = $.proxy(this.linkFinished, this);
            
            if (!this.el) return;
            
            this.animate(options);
            
            var that = this;
            jq(this.el).bind('destroy', function(){
                var id = that.el.jqmCSS3AnimateId;
                that.callbacksStack = [];
                if(cache[id]) delete cache[id];
            });
        };
        css3Animate.prototype = {
            animate:function(options){
                
                //cancel current active animation on this object
                if(this.isActive) this.cancel();
                this.isActive = true;
                
                if (!options) {
                    alert("Please provide configuration options for animation of " + this.el.id);
                    return;
                }
            
                var classMode = !!options["addClass"];
            
                if(classMode){
                    //class defines properties being changed
                    if(options["removeClass"]){
                        jq(this.el).replaceClass(options["removeClass"], options["addClass"]);
                    } else {
                        jq(this.el).addClass(options["addClass"]);
                    }
                
                } else {
                    //property by property
                    var timeNum = numOnly(options["time"]);
                    if(timeNum==0) options["time"]=0;
                
                    if (!options["y"]) options["y"] = 0;
                    if (!options["x"]) options["x"] = 0;
                    if (options["previous"]) {
                        var cssMatrix = new $.getCssMatrix(this.el);
                        options.y += numOnly(cssMatrix.f);
                        options.x += numOnly(cssMatrix.e);
                    }
                    if (!options["origin"]) options.origin = "0% 0%";

                    if (!options["scale"]) options.scale = "1";

                    if (!options["rotateY"]) options.rotateY = "0";
                    if (!options["rotateX"]) options.rotateX = "0";
                    if (!options["skewY"]) options.skewY = "0";
                    if (!options["skewX"]) options.skewX = "0";


                    if (!options["timingFunction"]) options["timingFunction"] = "linear";

                    //check for percent or numbers
                    if (typeof (options.x) == "number" || (options.x.indexOf("%") == -1 && options.x.toLowerCase().indexOf("px") == -1 && options.x.toLowerCase().indexOf("deg") == -1)) options.x = parseInt(options.x) + "px";
                    if (typeof (options.y) == "number" || (options.y.indexOf("%") == -1 && options.y.toLowerCase().indexOf("px") == -1 && options.y.toLowerCase().indexOf("deg") == -1)) options.y = parseInt(options.y) + "px";
                    
                    var trans= "translate" + translateOpen + (options.x) + "," + (options.y) + translateClose + " scale(" + parseFloat(options.scale) + ") rotate(" + options.rotateX + ")";
                    if(!$.os.opera)
                        trans+=" rotateY(" + options.rotateY + ")";
                    trans+=" skew(" + options.skewX + "," + options.skewY + ")";
                    this.el.style[$.feat.cssPrefix+"Transform"]=trans;
                    this.el.style[$.feat.cssPrefix+"BackfaceVisibility"] = "hidden";
                    var properties = $.feat.cssPrefix+"Transform";
                    if (options["opacity"]!==undefined) {
                        this.el.style.opacity = options["opacity"];
                        properties+=", opacity";
                    }
                    if (options["width"]) {
                        this.el.style.width = options["width"];
                        properties = "all";
                    }
                    if (options["height"]) {
                        this.el.style.height = options["height"];
                        properties = "all";
                    }
                    this.el.style[$.feat.cssPrefix+"TransitionProperty"] = "all";
                
                    if((""+options["time"]).indexOf("s")===-1) {
                        var scale = 'ms';
                        var time = options["time"]+scale;
                    } else if(options["time"].indexOf("ms")!==-1){
                        var scale = 'ms';
                        var time = options["time"];
                    } else {
                        var scale = 's';
                        var time = options["time"]+scale;
                    }
            
                    this.el.style[$.feat.cssPrefix+"TransitionDuration"] = time;
                    this.el.style[$.feat.cssPrefix+"TransitionTimingFunction"] = options["timingFunction"];
                    this.el.style[$.feat.cssPrefix+"TransformOrigin"] = options.origin;

                }

                //add callback to the stack
                
                this.callbacksStack.push({
                    complete : options["complete"],
                    success : options["success"],
                    failure : options["failure"]
                });
                this.countStack++;
            
                var that = this;
                var style = window.getComputedStyle(this.el);
                if(classMode){
                    //get the duration
                    var duration = style[$.feat.cssPrefix+"TransitionDuration"];
                    var timeNum = numOnly(duration);
                    if(duration.indexOf("ms")!==-1){
                        var scale = 'ms';
                    } else {
                        var scale = 's';
                    }
                }
                
                //finish asap
                if(timeNum==0 || (scale=='ms' && timeNum<5) || style.display=='none'){
                    //the duration is nearly 0 or the element is not displayed, finish immediatly
                    $.asap($.proxy(this.finishAnimation, this, [false]));
                    //this.finishAnimation();
                    //set transitionend event
                } else {
                    //setup the event normally

                   var that=this;
                    this.activeEvent = function(event){
                        clearTimeout(that.timeout);
                        that.finishAnimation(event);
                        that.el.removeEventListener(transitionEnd, that.activeEvent, false);
                    };         
                    that.timeout=setTimeout(this.activeEvent, numOnly(options["time"]) + 50);         
                    this.el.addEventListener(transitionEnd, this.activeEvent, false);

                }
                
            },
            addCallbackHook:function(callback){
                if(callback) this.callbacksStack.push(callback);
                this.countStack++;
                return this.linkFinishedProxy_;
            },
            linkFinished:function(canceled){
                if(canceled) this.cancel();
                else this.finishAnimation();
            },
            finishAnimation: function (event) {
                if(event) event.preventDefault();
                if(!this.isActive) return;
                
                this.countStack--;
                
                if(this.countStack==0) this.fireCallbacks(false);
            },
            fireCallbacks:function(canceled){
                this.clearEvents();
                
                //keep callbacks after cleanup
                // (if any of the callbacks overrides this object, callbacks will keep on fire as expected)
                var callbacks = this.callbacksStack;
                
                //cleanup
                this.cleanup();
                
                //fire all callbacks
                for(var i=0; i<callbacks.length; i++) {
                    var complete = callbacks[i]['complete'];
                    var success = callbacks[i]['success'];
                    var failure = callbacks[i]['failure'];
                    //fire callbacks
                    if(complete && typeof (complete) == "function") complete(canceled);
                    //success/failure
                    if(canceled && failure && typeof (failure) == "function") failure();
                    else if(success && typeof (success) == "function") success();
                }
            },
            cancel:function(){
                if(!this.isActive) return;
                this.fireCallbacks(true); //fire failure callbacks
            },
            cleanup:function(){
                this.callbacksStack=[];
                this.isActive = false;
                this.countStack = 0;
            },
            clearEvents:function(){
                if(this.activeEvent) {
                    this.el.removeEventListener(transitionEnd, this.activeEvent, false);
                }
                this.activeEvent = null;
            },
            link: function (elID, opts) {
                var callbacks = {complete:opts.complete,success:opts.success,failure:opts.failure};
                opts.complete = this.addCallbackHook(callbacks);
                opts.success = null;
                opts.failure = null;
                //run the animation with the replaced callbacks
                getCSS3Animate(elID, opts);
                //set the old callback back in the obj to avoid strange stuff
                opts.complete = callbacks.complete;
                opts.success = callbacks.success;
                opts.failure = callbacks.failure;
                return this;
            }
        }
        
        return css3Animate;
    })();

    css3Animate.queue = function () {
        return {
            elements: [],
            push: function (el) {
                this.elements.push(el);
            },
            pop: function () {
                return this.elements.pop();
            },
            run: function () {
                var that = this;
                if (this.elements.length == 0) return;
                if (typeof (this.elements[0]) == "function") {
                    var func = this.shift();
                    func();
                }
                if (this.elements.length == 0) return;
                var params = this.shift();
                if (this.elements.length > 0) params.complete = function (canceled) {
                    if(!canceled) that.run();
                };
                css3Animate(document.getElementById(params.id), params);
            },
            shift: function () {
                return this.elements.shift();
            }
        }
    };
})(jq);

/**
 * jq.scroller - rewritten by Carlos Ouro @ Badoo
 * Supports iOS native touch scrolling and a much improved javascript scroller
 */
(function($) {
	var HIDE_REFRESH_TIME = 75; // hide animation of pull2ref duration in ms
	var cache = [];
	var objId = function(obj) {
			if(!obj.jqmScrollerId) obj.jqmScrollerId = $.uuid();
			return obj.jqmScrollerId;
		}
	$.fn["scroller"] = function(opts) {
		var tmp, id;
		for(var i = 0; i < this.length; i++) {
			//cache system
			id = objId(this[i]);
			if(!cache[id]) {
				if(!opts) opts = {};
				if(!$.feat.nativeTouchScroll) opts.useJsScroll = true;

				tmp = scroller(this[i], opts);
				cache[id] = tmp;
			} else {
				tmp = cache[id];
			}
		}
		return this.length == 1 ? tmp : this;
	};
	var boundTouchLayer = false;

	function checkConsistency(id) {
		if(!cache[id].el) {
			delete cache[id];
			return false;
		}
		return true;
	}

	function bindTouchLayer() {
		//use a single bind for all scrollers
		if(jq.os.android && !jq.os.chrome&&jq.os.webkit) {
			var androidFixOn = false;
			//connect to touchLayer to detect editMode
			$.bind($.touchLayer, 'pre-enter-edit', function(focusEl) {
				if(!androidFixOn) {
					androidFixOn = true;
					//activate on scroller
					for(el in cache)
					if(checkConsistency(el) && cache[el].needsFormsFix(focusEl)) cache[el].startFormsMode();
				}
			});
			$.bind($.touchLayer, ['cancel-enter-edit', 'exit-edit'], function(focusEl) {
				if(androidFixOn) {
					androidFixOn = false;
					//dehactivate on scroller
					for(el in cache)
					if(checkConsistency(el) && cache[el].androidFormsMode) cache[el].stopFormsMode();
				}
			});
		}
		boundTouchLayer = true;
	}
	var scroller = (function() {
        var translateOpen =$.feat.cssTransformStart;
        var translateClose = $.feat.cssTransformEnd;
		var jsScroller, nativeScroller;

		//initialize and js/native mode selector
		var scroller = function(elID, opts) {


				if(!boundTouchLayer && $.touchLayer && $.isObject($.touchLayer)) bindTouchLayer()
				else if(!($.touchLayer && $.isObject($.touchLayer))) $.touchLayer = {};

				if(typeof elID == "string" || elID instanceof String) {
					var el = document.getElementById(elID);
				} else {
					var el = elID;
				}
				if(!el) {
					alert("Could not find element for scroller " + elID);
					return;
				}
				if(jq.os.desktop)
					return new scrollerCore(el,opts);
				else if(opts.useJsScroll) return new jsScroller(el, opts);
				return new nativeScroller(el, opts);

			};

		//parent abstract class (common functionality)
		var scrollerCore = function(el,opts) {
			this.el=el;
			this.jqEl = $(this.el);
			for(j in opts) {
				this[j] = opts[j];
			}
		};
		scrollerCore.prototype = {
			//core default properties
			refresh: false,
			refreshContent: "Pull to Refresh",
			refreshHangTimeout: 2000,
			refreshHeight: 60,
			refreshElement: null,
			refreshCancelCB: null,
			refreshRunning: false,
			scrollTop: 0,
			scrollLeft: 0,
			preventHideRefresh: true,
			verticalScroll: true,
			horizontalScroll: false,
			refreshTriggered: false,
			moved: false,
			eventsActive: false,
			rememberEventsActive: false,
			scrollingLocked: false,
			autoEnable: true,
			blockFormsFix: false,
			loggedPcentY: 0,
			loggedPcentX: 0,
			infinite: false,
			infiniteEndCheck: false,
			infiniteTriggered: false,
			scrollSkip: false,
			scrollTopInterval:null,
			scrollLeftInterval:null,
			_scrollTo:function(params,time){
				var time=parseInt(time);
                if(time==0||isNaN(time))
                {
				this.el.scrollTop=Math.abs(params.y);
				this.el.scrollLeft=Math.abs(params.x);
					return;
				}
                var singleTick=10;
               	var distPerTick=(this.el.scrollTop-params.y)/Math.ceil(time/singleTick);
               	var distLPerTick=(this.el.scrollLeft-params.x)/Math.ceil(time/singleTick);
                var self=this;
                var toRunY=Math.ceil(this.el.scrollTop-params.y)/distPerTick;
                var toRunX=Math.ceil(this.el.scrollLeft-params.x)/distPerTick;
                var xRun=yRun=0;
               	self.scrollTopInterval=window.setInterval(function(){
                    self.el.scrollTop-=distPerTick;
                    yRun++;
                	if(yRun>=toRunY){
                		self.el.scrollTop=params.y;
                		clearInterval(self.scrollTopInterval);
                	}
                },singleTick);

                self.scrollLeftInterval=window.setInterval(function(){
                    self.el.scrollLeft-=distLPerTick;
                    xRun++;
                    if(xRun>=toRunX){
                		self.el.scrollLeft=params.x;
                		clearInterval(self.scrollLeftInterval);
                	}
                },singleTick);
			},
            enable:function(){},
            disable:function(){},
            hideScrollbars:function(){},
            addPullToRefresh:function(){},
            /**
              * We do step animations for 'native' - iOS is acceptable and desktop browsers are fine
              * instead of css3
              */
            _scrollToTop:function(time){
                this._scrollTo({x:0,y:0},time);
            },
            _scrollToBottom:function(time){
            	this._scrollTo({x:0,y:this.el.scrollHeight-this.el.offsetHeight},time);
            },
            scrollToBottom:function(time){
            	return this._scrollToBottom(time);
            },
            scrollToTop:function(time){
            	return this._scrollToTop(time);
            },

			//methods
			init: function(el, opts) {
				this.el = el;
				this.jqEl = $(this.el);
				this.defaultProperties();
				for(j in opts) {
					this[j] = opts[j];
				}
				//assign self destruct
				var that = this;
				var orientationChangeProxy = function() {
						//no need to readjust if disabled...
						if(that.eventsActive) that.adjustScroll();
					}
				this.jqEl.bind('destroy', function() {
					that.disable(true); //with destroy notice
					var id = that.el.jqmScrollerId;
					if(cache[id]) delete cache[id];
					$.unbind($.touchLayer, 'orientationchange-reshape', orientationChangeProxy);
				});
				$.bind($.touchLayer, 'orientationchange-reshape', orientationChangeProxy);
			},
			needsFormsFix: function(focusEl) {
				return this.useJsScroll && this.isEnabled() && this.el.style.display != "none" && $(focusEl).closest(this.jqEl).size() > 0;
			},
			handleEvent: function(e) {
				if(!this.scrollingLocked) {
					switch(e.type) {
					case 'touchstart':
                        clearInterval(this.scrollTopInterval);
						this.preventHideRefresh = !this.refreshRunning; // if it's not running why prevent it xD
						this.moved = false;
						this.onTouchStart(e);
						break;
					case 'touchmove':
						this.onTouchMove(e);
						break;
					case 'touchend':
						this.onTouchEnd(e);
						break;
					case 'scroll':
						this.onScroll(e);
						break;
					}
				}
			},
			coreAddPullToRefresh: function(rEl) {
				if(rEl) this.refreshElement = rEl;
				//Add the pull to refresh text.  Not optimal but keeps from others overwriting the content and worrying about italics
				//add the refresh div
				if(this.refreshElement == null) {
					var orginalEl = document.getElementById(this.container.id + "_pulldown");
					if(orginalEl != null) {
						var jqEl = jq(orginalEl);
					} else {
						var jqEl = jq("<div id='" + this.container.id + "_pulldown' class='jqscroll_refresh' style='border-radius:.6em;border: 1px solid #2A2A2A;background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0,#666666),color-stop(1,#222222));background:#222222;margin:0px;height:60px;position:relative;text-align:center;line-height:60px;color:white;width:100%;'>" + this.refreshContent + "</div>");
					}
				} else {
					var jqEl = jq(this.refreshElement);
				}
				var el = jqEl.get();

				this.refreshContainer = jq("<div style=\"overflow:hidden;width:100%;height:0;margin:0;padding:0;padding-left:5px;padding-right:5px;display:none;\"></div>");
				$(this.el).prepend(this.refreshContainer.append(el, 'top'));
				this.refreshContainer = this.refreshContainer[0];
			},
			fireRefreshRelease: function(triggered, allowHide) {
				if(!this.refresh || !triggered) return;

				var autoCancel = $.trigger(this, 'refresh-release', [triggered]) !== false;
				this.preventHideRefresh = false;
				this.refreshRunning = true;
				if(autoCancel) {
					var that = this;
					if(this.refreshHangTimeout > 0) this.refreshCancelCB = setTimeout(function() {
						that.hideRefresh()
					}, this.refreshHangTimeout);
				}
			},
			setRefreshContent: function(content) {
				jq(this.container).find(".jqscroll_refresh").html(content);
			},
			lock: function() {
				if(this.scrollingLocked) return;
				this.scrollingLocked = true;
				this.rememberEventsActive = this.eventsActive;
				if(!this.eventsActive) {
					this.initEvents();
				}
			},
			unlock: function() {
				if(!this.scrollingLocked) return;
				this.scrollingLocked = false;
				if(!this.rememberEventsActive) {
					this.removeEvents();
				}
			},
			scrollToItem: function(el, where) { //TODO: add functionality for x position
				if(!$.is$(el)) el = $(el);

				if(where == 'bottom') {
					var itemPos = el.offset();
					var newTop = itemPos.top - this.jqEl.offset().bottom + itemPos.height;
					newTop += 4; //add a small space
				} else {
					var itemTop = el.offset().top;
					var newTop = itemTop - document.body.scrollTop;
					var panelTop = this.jqEl.offset().top;
					if(document.body.scrollTop < panelTop) {
						newTop -= panelTop;
					}
					newTop -= 4; //add a small space
				}

				this.scrollBy({
					y: newTop,
					x: 0
				}, 0);
			},
			setPaddings: function(top, bottom) {
				var el = $(this.el);
				var curTop = numOnly(el.css('paddingTop'));
				el.css('paddingTop', top + "px").css('paddingBottom', bottom + "px");
				//don't let padding mess with scroll
				this.scrollBy({
					y: top - curTop,
					x: 0
				});
			},
			//freak of mathematics, but for our cases it works
			divide: function(a, b) {
				return b != 0 ? a / b : 0;
			},
			isEnabled: function() {
				return this.eventsActive;
			},
			addInfinite: function() {
				this.infinite = true;
			},
			clearInfinite: function() {
				this.infiniteTriggered = false;
				this.scrollSkip = true;
			}
		}

		//extend to jsScroller and nativeScroller (constructs)
		jsScroller = function(el, opts) {
			this.init(el, opts);
			//test
			//this.refresh=true;
			this.container = this.el.parentNode;
			this.container.jqmScrollerId = el.jqmScrollerId;
			this.jqEl = $(this.container);

			if(this.container.style.overflow != 'hidden') this.container.style.overflow = 'hidden';

			this.addPullToRefresh(null, true);
			if(this.autoEnable) this.enable(true);

			//create vertical scroll
			if(this.verticalScroll && this.verticalScroll == true && this.scrollBars == true) {
				var scrollDiv = createScrollBar(5, 20);
				scrollDiv.style.top = "0px";
				if(this.vScrollCSS) scrollDiv.className = this.vScrollCSS;
				scrollDiv.style.opacity = "0";
				this.container.appendChild(scrollDiv);
				this.vscrollBar = scrollDiv;
				scrollDiv = null;
			}
			//create horizontal scroll
			if(this.horizontalScroll && this.horizontalScroll == true && this.scrollBars == true) {
				var scrollDiv = createScrollBar(20, 5);
				scrollDiv.style.bottom = "0px";


				if(this.hScrollCSS) scrollDiv.className = this.hScrollCSS;
				scrollDiv.style.opacity = "0";
				this.container.appendChild(scrollDiv);
				this.hscrollBar = scrollDiv;
				scrollDiv = null;
			}
			if(this.horizontalScroll) this.el.style['float'] = "left";

			this.el.hasScroller = true;

		};
		nativeScroller = function(el, opts) {

			this.init(el, opts);
			var $el = $(el);
			if(opts.noParent !== true) {
				var oldParent = $el.parent();
				$el.css('height', oldParent.height());
				$el.parent().parent().append($el);
				oldParent.remove();
			}
			this.container = this.el;
			$el.css("-webkit-overflow-scrolling", "touch");
		}
		nativeScroller.prototype = new scrollerCore();
		jsScroller.prototype = new scrollerCore();




		///Native scroller
		nativeScroller.prototype.defaultProperties = function() {

			this.refreshContainer = null;
			this.dY = this.cY = 0;
			this.cancelPropagation = false;
			this.loggedPcentY = 0;
			this.loggedPcentX = 0;
			var that = this;
			this.adjustScrollOverflowProxy_ = function() {
				that.jqEl.css('overflow', 'auto');
			}
		}
		nativeScroller.prototype.enable = function(firstExecution) {
			if(this.eventsActive) return;
			this.eventsActive = true;
			//unlock overflow
			this.el.style.overflow = 'auto';
			//set current scroll

			
			if(!firstExecution) this.adjustScroll();
			//set events
			if(this.refresh || this.infinite&&!jq.os.desktop) this.el.addEventListener('touchstart', this, false);
			this.el.addEventListener('scroll', this, false)
		}
		nativeScroller.prototype.disable = function(destroy) {
			if(!this.eventsActive) return;
			//log current scroll
			this.logPos(this.el.scrollLeft, this.el.scrollTop);
			//lock overflow
			if(!destroy) this.el.style.overflow = 'hidden';
			//remove events
			this.el.removeEventListener('touchstart', this, false);
			this.el.removeEventListener('touchmove', this, false);
			this.el.removeEventListener('touchend', this, false);
			this.el.removeEventListener('scroll', this, false);
			this.eventsActive = false;
		}
		nativeScroller.prototype.addPullToRefresh = function(el, leaveRefresh) {
			this.el.removeEventListener('touchstart', this, false);
			this.el.addEventListener('touchstart', this, false);
			if(!leaveRefresh) this.refresh = true;
			if(this.refresh && this.refresh == true) {
				this.coreAddPullToRefresh(el);
                this.refreshContainer.style.position="absolute";
                this.refreshContainer.style.top="-60px";
                this.refreshContainer.style.height="60px";
                this.refreshContainer.style.display="block";
			}
		}
		nativeScroller.prototype.onTouchStart = function(e) {

			if(this.refreshCancelCB) clearTimeout(this.refreshCancelCB);
			//get refresh ready
			if(this.refresh || this.infinite) {

				this.el.addEventListener('touchmove', this, false);
				this.dY = e.touches[0].pageY;
				if(this.refresh && this.dY <0) {
					this.showRefresh();

				}
			}
			$.trigger(this,"scrollstart",[this.el]);
			$.trigger($.touchLayer,"scrollstart",[this.el]);
		}
		nativeScroller.prototype.onTouchMove = function(e) {

			var newcY = e.touches[0].pageY - this.dY;

			if(!this.moved) {
				this.el.addEventListener('touchend', this, false);
				this.moved = true;
			}

			var difY = newcY - this.cY;


			//check for trigger
			if(this.refresh && (this.el.scrollTop) < 0) {
				this.showRefresh();
				//check for cancel
			} else if(this.refreshTriggered && this.refresh && (this.el.scrollTop > this.refreshHeight)) {
				this.refreshTriggered = false;
				if(this.refreshCancelCB) clearTimeout(this.refreshCancelCB);
				this.hideRefresh(false);
				$.trigger(this, 'refresh-cancel');
			}

			this.cY = newcY;
			e.stopPropagation();
		}
        nativeScroller.prototype.showRefresh=function(){
            if(!this.refreshTriggered){
                this.refreshTriggered = true;
                $.trigger(this, 'refresh-trigger');
            }
        }
		nativeScroller.prototype.onTouchEnd = function(e) {

			var triggered = this.el.scrollTop <= -(this.refreshHeight);

			this.fireRefreshRelease(triggered, true);
            if(triggered){
                //lock in place
                this.refreshContainer.style.position="relative";
                this.refreshContainer.style.top="0px";
            }

			this.dY = this.cY = 0;
			this.el.removeEventListener('touchmove', this, false);
			this.el.removeEventListener('touchend', this, false);
			this.infiniteEndCheck = true;
			if(this.infinite && !this.infiniteTriggered && (Math.abs(this.el.scrollTop) >= (this.el.scrollHeight - this.el.clientHeight))) {
				this.infiniteTriggered = true;
				$.trigger(this, "infinite-scroll");
				this.infiniteEndCheck = true;
			}
			this.touchEndFired = true;
			//pollyfil for scroll end since webkit doesn't give any events during the "flick"
            var max=200;
            var self=this;
            var currPos={
                top:this.el.scrollTop,
                left:this.el.scrollLeft
            };
            var counter=0;
            self.nativePolling=setInterval(function(){
                counter++;
                if(counter>=max){
                    clearInterval(self.nativePolling);
                    return;
                }
                if(self.el.scrollTop!=currPos.top||self.el.scrollLeft!=currPos.left){
                    clearInterval(self.nativePolling);
                    $.trigger($.touchLayer, 'scrollend', [self.el]); //notify touchLayer of this elements scrollend
                    $.trigger(self,"scrollend",[self.el]);
                    //self.doScroll(e);
                }

            },20);
		}
		nativeScroller.prototype.hideRefresh = function(animate) {

			if(this.preventHideRefresh) return;

			var that = this;
			var endAnimationCb = function(canceled){
					if(!canceled){	//not sure if this should be the correct logic....
						that.el.style[$.feat.cssPrefix+"Transform"]="none";
						that.el.style[$.feat.cssPrefix+"TransitionProperty"]="none";
						that.el.scrollTop=0;
						that.logPos(that.el.scrollLeft, 0);
					}
					that.refreshContainer.style.top = "-60px";
					that.refreshContainer.style.position="absolute";
					that.dY = that.cY = 0;
					$.trigger(that,"refresh-finish");
				};

			if(animate === false || !that.jqEl.css3Animate) {
				endAnimationCb();
			} else {
				that.jqEl.css3Animate({
					y: (that.el.scrollTop - that.refreshHeight) + "px",
					x: "0%",
					time: HIDE_REFRESH_TIME + "ms",
					complete: endAnimationCb
				});
			}
			this.refreshTriggered = false;
			//this.el.addEventListener('touchend', this, false);
		}
		nativeScroller.prototype.hideScrollbars = function() {}
		nativeScroller.prototype.scrollTo = function(pos,time) {
			this.logPos(pos.x, pos.y);
			pos.x*=-1;
			pos.y*=-1;
			return this._scrollTo(pos,time);
		}
		nativeScroller.prototype.scrollBy = function(pos,time) {
			pos.x+=this.el.scrollLeft;
			pos.y+=this.el.scrollTop;
			this.logPos(this.el.scrollLeft, this.el.scrollTop);
			return this._scrollTo(pos,time);
		}
		nativeScroller.prototype.scrollToBottom = function(time) {
			//this.el.scrollTop = this.el.scrollHeight;
			this._scrollToBottom(time);
			this.logPos(this.el.scrollLeft, this.el.scrollTop);
		}
		nativeScroller.prototype.onScroll = function(e) {
			if(this.infinite && this.touchEndFired) {
				this.touchEndFired = false;
				return;
			}
			if(this.scrollSkip) {
				this.scrollSkip = false;
				return;
			}

			if(this.infinite) {
				if(!this.infiniteTriggered && (Math.abs(this.el.scrollTop) >= (this.el.scrollHeight - this.el.clientHeight))) {
					this.infiniteTriggered = true;
					$.trigger(this, "infinite-scroll");
					this.infiniteEndCheck = true;
				}
			}


			var that = this;
			if(this.infinite && this.infiniteEndCheck && this.infiniteTriggered) {

				this.infiniteEndCheck = false;
				$.trigger(that, "infinite-scroll-end");
			}
		}
		nativeScroller.prototype.logPos = function(x, y) {


			this.loggedPcentX = this.divide(x, (this.el.scrollWidth));
			this.loggedPcentY = this.divide(y, (this.el.scrollHeight ));
			this.scrollLeft = x;
			this.scrollTop = y;

			if(isNaN(this.loggedPcentX))
				this.loggedPcentX=0;
			if(isNaN(this.loggedPcentY))
				this.loggedPcentY=0;

		}
		nativeScroller.prototype.adjustScroll = function() {
			this.adjustScrollOverflowProxy_();
			
			this.el.scrollLeft = this.loggedPcentX * (this.el.scrollWidth);
			this.el.scrollTop = this.loggedPcentY * (this.el.scrollHeight );
			this.logPos(this.el.scrollLeft, this.el.scrollTop);
		}



		//JS scroller
		jsScroller.prototype.defaultProperties = function() {

			this.boolScrollLock = false;
			this.currentScrollingObject = null;
			this.elementInfo = null;
			this.verticalScroll = true;
			this.horizontalScroll = false;
			this.scrollBars = true;
			this.vscrollBar = null;
			this.hscrollBar = null;
			this.hScrollCSS = "scrollBar";
			this.vScrollCSS = "scrollBar";
			this.firstEventInfo = null;
			this.moved = false;
			this.preventPullToRefresh = true;
			this.doScrollInterval = null;
			this.refreshRate = 25;
			this.isScrolling = false;
			this.androidFormsMode = false;
			this.refreshSafeKeep = false;

			this.lastScrollbar = "";
			this.finishScrollingObject = null;
			this.container = null;
			this.scrollingFinishCB = null;
			this.loggedPcentY = 0;
			this.loggedPcentX = 0;

		}

		function createScrollBar(width, height) {
			var scrollDiv = document.createElement("div");
			scrollDiv.style.position = 'absolute';
			scrollDiv.style.width = width + "px";
			scrollDiv.style.height = height + "px";
			scrollDiv.style[$.feat.cssPrefix+'BorderRadius'] = "2px";
			scrollDiv.style.borderRadius = "2px";
			scrollDiv.style.opacity = 0;
			scrollDiv.className = 'scrollBar';
			scrollDiv.style.background = "black";
			return scrollDiv;
		}
		jsScroller.prototype.enable = function(firstExecution) {
			if(this.eventsActive) return;
			this.eventsActive = true;
			if(!firstExecution) this.adjustScroll();
            else
                this.scrollerMoveCSS({x:0,y:0},0);
			//add listeners
			this.container.addEventListener('touchstart', this, false);
			this.container.addEventListener('touchmove', this, false);
			this.container.addEventListener('touchend', this, false);

		}
		jsScroller.prototype.adjustScroll = function() {
			//set top/left
			var size = this.getViewportSize();
			this.scrollerMoveCSS({
				x: Math.round(this.loggedPcentX * (this.el.clientWidth - size.w)),
				y: Math.round(this.loggedPcentY * (this.el.clientHeight - size.h))
			}, 0);
		}
		jsScroller.prototype.disable = function() {
			if(!this.eventsActive) return;
			//log top/left
			var cssMatrix = this.getCSSMatrix(this.el);
			this.logPos((numOnly(cssMatrix.e) - numOnly(this.container.scrollLeft)), (numOnly(cssMatrix.f) - numOnly(this.container.scrollTop)));
			//remove event listeners
			this.container.removeEventListener('touchstart', this, false);
			this.container.removeEventListener('touchmove', this, false);
			this.container.removeEventListener('touchend', this, false);
			this.eventsActive = false;
		}
		jsScroller.prototype.addPullToRefresh = function(el, leaveRefresh) {
			if(!leaveRefresh) this.refresh = true;
			if(this.refresh && this.refresh == true) {
				this.coreAddPullToRefresh(el);
				this.el.style.overflow = 'visible';
			}
		}
		jsScroller.prototype.hideScrollbars = function() {
			if(this.hscrollBar) {
				this.hscrollBar.style.opacity = 0
				this.hscrollBar.style[$.feat.cssPrefix+'TransitionDuration'] = "0ms";
			}
			if(this.vscrollBar) {
				this.vscrollBar.style.opacity = 0
				this.vscrollBar.style[$.feat.cssPrefix+'TransitionDuration']  = "0ms";
			}
		}

		jsScroller.prototype.getViewportSize = function() {
			var style = window.getComputedStyle(this.container);
			if(isNaN(numOnly(style.paddingTop))) alert((typeof style.paddingTop) + '::' + style.paddingTop + ':');
			return {
				h: (this.container.clientHeight > window.innerHeight ? window.innerHeight : this.container.clientHeight - numOnly(style.paddingTop) - numOnly(style.paddingBottom)),
				w: (this.container.clientWidth > window.innerWidth ? window.innerWidth : this.container.clientWidth - numOnly(style.paddingLeft) - numOnly(style.paddingRight))
			};
		}

		jsScroller.prototype.onTouchStart = function(event) {

			this.moved = false;
			this.currentScrollingObject = null;

			if(!this.container) return;
			if(this.refreshCancelCB) {
				clearTimeout(this.refreshCancelCB);
				this.refreshCancelCB = null;
			}
			if(this.scrollingFinishCB) {
				clearTimeout(this.scrollingFinishCB);
				this.scrollingFinishCB = null;
			}
			

			//disable if locked
			if(event.touches.length != 1 || this.boolScrollLock) return;

			// Allow interaction to legit calls, like select boxes, etc.
			if(event.touches[0].target && event.touches[0].target.type != undefined) {
				var tagname = event.touches[0].target.tagName.toLowerCase();
				if(tagname == "select" || tagname == "input" || tagname == "button") // stuff we need to allow
				// access to legit calls
				return;

			}

			//default variables
			var scrollInfo = {
				//current position
				top: 0,
				left: 0,
				//current movement
				speedY: 0,
				speedX: 0,
				absSpeedY: 0,
				absSpeedX: 0,
				deltaY: 0,
				deltaX: 0,
				absDeltaY: 0,
				absDeltaX: 0,
				y: 0,
				x: 0,
				duration: 0
			};

			//element info
			this.elementInfo = {};
			var size = this.getViewportSize();
			this.elementInfo.bottomMargin = size.h;
			this.elementInfo.maxTop = (this.el.clientHeight - this.elementInfo.bottomMargin);
			if(this.elementInfo.maxTop < 0) this.elementInfo.maxTop = 0;
			this.elementInfo.divHeight = this.el.clientHeight;
			this.elementInfo.rightMargin = size.w;
			this.elementInfo.maxLeft = (this.el.clientWidth - this.elementInfo.rightMargin);
			if(this.elementInfo.maxLeft < 0) this.elementInfo.maxLeft = 0;
			this.elementInfo.divWidth = this.el.clientWidth;
			this.elementInfo.hasVertScroll = this.verticalScroll || this.elementInfo.maxTop > 0;
			this.elementInfo.hasHorScroll = this.elementInfo.maxLeft > 0;
			this.elementInfo.requiresVScrollBar = this.vscrollBar && this.elementInfo.hasVertScroll;
			this.elementInfo.requiresHScrollBar = this.hscrollBar && this.elementInfo.hasHorScroll;

			//save event
			this.saveEventInfo(event);
			this.saveFirstEventInfo(event);

			//get the current top
			var cssMatrix = this.getCSSMatrix(this.el);
			scrollInfo.top = numOnly(cssMatrix.f) - numOnly(this.container.scrollTop);
			scrollInfo.left = numOnly(cssMatrix.e) - numOnly(this.container.scrollLeft);

			this.container.scrollTop = this.container.scrollLeft = 0;
			this.currentScrollingObject = this.el;

			//get refresh ready
			if(this.refresh && scrollInfo.top == 0) {
				this.refreshContainer.style.display = "block";
				this.refreshHeight = this.refreshContainer.firstChild.clientHeight;
				this.refreshContainer.firstChild.style.top = (-this.refreshHeight) + 'px';
				this.refreshContainer.style.overflow = 'visible';
				this.preventPullToRefresh = false;
			} else if(scrollInfo.top < 0) {
				this.preventPullToRefresh = true;
				if(this.refresh) this.refreshContainer.style.overflow = 'hidden';
			}

			//set target
			scrollInfo.x = scrollInfo.left;
			scrollInfo.y = scrollInfo.top;

			//vertical scroll bar
			if(this.setVScrollBar(scrollInfo, 0, 0)){
	            if (this.container.clientWidth > window.innerWidth)
	                this.vscrollBar.style.left = (window.innerWidth - numOnly(this.vscrollBar.style.width) * 3) + "px";
	            else
	                this.vscrollBar.style.right = "0px";
	            this.vscrollBar.style[$.feat.cssPrefix+"Transition"] = '';
				// this.vscrollBar.style.opacity = 1;
			}

			//horizontal scroll
			if(this.setHScrollBar(scrollInfo, 0, 0)){
                if (this.container.clientHeight > window.innerHeight)
                    this.hscrollBar.style.top = (window.innerHeight - numOnly(this.hscrollBar.style.height)) + "px";
                else
                    this.hscrollBar.style.bottom = numOnly(this.hscrollBar.style.height);
                this.hscrollBar.style[$.feat.cssPrefix+"Transition"] = ''; 
				// this.hscrollBar.style.opacity = 1;
			}

			//save scrollInfo
			this.lastScrollInfo = scrollInfo;
			this.hasMoved=true;

			this.scrollerMoveCSS(this.lastScrollInfo, 0);
			$.trigger(this,"scrollstart");

		}
		jsScroller.prototype.getCSSMatrix = function(el) {
			if(this.androidFormsMode) {
				//absolute mode
				var top = parseInt(el.style.marginTop);
				var left = parseInt(el.style.marginLeft);
				if(isNaN(top)) top = 0;
				if(isNaN(left)) left = 0;
				return {
					f: top,
					e: left
				};
			} else {
				//regular transform

				var obj = $.getCssMatrix(el);
				return obj;
			}
		}
		jsScroller.prototype.saveEventInfo = function(event) {
			this.lastEventInfo = {
				pageX: event.touches[0].pageX,
				pageY: event.touches[0].pageY,
				time: event.timeStamp
			}
		}
		jsScroller.prototype.saveFirstEventInfo = function(event) {
			this.firstEventInfo = {
				pageX: event.touches[0].pageX,
				pageY: event.touches[0].pageY,
				time: event.timeStamp
			}
		}
		jsScroller.prototype.setVScrollBar = function(scrollInfo, time, timingFunction) {
			if(!this.elementInfo.requiresVScrollBar) return false;
			var newHeight = (parseFloat(this.elementInfo.bottomMargin / this.elementInfo.divHeight) * this.elementInfo.bottomMargin) + "px";
			if(newHeight != this.vscrollBar.style.height) this.vscrollBar.style.height = newHeight;
			var pos = (this.elementInfo.bottomMargin - numOnly(this.vscrollBar.style.height)) - (((this.elementInfo.maxTop + scrollInfo.y) / this.elementInfo.maxTop) * (this.elementInfo.bottomMargin - numOnly(this.vscrollBar.style.height)));
			if(pos > this.elementInfo.bottomMargin) pos = this.elementInfo.bottomMargin;
			if(pos < 0) pos = 0;
			this.scrollbarMoveCSS(this.vscrollBar, {
				x: 0,
				y: pos
			}, time, timingFunction);
			return true;
		}
		jsScroller.prototype.setHScrollBar = function(scrollInfo, time, timingFunction) {
			if(!this.elementInfo.requiresHScrollBar) return false;
			var newWidth = (parseFloat(this.elementInfo.rightMargin / this.elementInfo.divWidth) * this.elementInfo.rightMargin) + "px";
			if(newWidth != this.hscrollBar.style.width) this.hscrollBar.style.width = newWidth;
			var pos = (this.elementInfo.rightMargin - numOnly(this.hscrollBar.style.width)) - (((this.elementInfo.maxLeft + scrollInfo.x) / this.elementInfo.maxLeft) * (this.elementInfo.rightMargin - numOnly(this.hscrollBar.style.width)));

			if(pos > this.elementInfo.rightMargin) pos = this.elementInfo.rightMargin;
			if(pos < 0) pos = 0;

			this.scrollbarMoveCSS(this.hscrollBar, {
				x: pos,
				y: 0
			}, time, timingFunction);
			return true;
		}

		jsScroller.prototype.onTouchMove = function(event) {

			if(this.currentScrollingObject == null) return;
			//event.preventDefault();
			var scrollInfo = this.calculateMovement(event);
			this.calculateTarget(scrollInfo);

			this.lastScrollInfo = scrollInfo;
			if(!this.moved) {
				if(this.elementInfo.requiresVScrollBar) this.vscrollBar.style.opacity = 1;
				if(this.elementInfo.requiresHScrollBar) this.hscrollBar.style.opacity = 1;
			}
			this.moved = true;


			if(this.refresh && scrollInfo.top == 0) {
				this.refreshContainer.style.display = "block";
				this.refreshHeight = this.refreshContainer.firstChild.clientHeight;
				this.refreshContainer.firstChild.style.top = (-this.refreshHeight) + 'px';
				this.refreshContainer.style.overflow = 'visible';
				this.preventPullToRefresh = false;
			} else if(scrollInfo.top < 0) {
				this.preventPullToRefresh = true;
				if(this.refresh) this.refreshContainer.style.overflow = 'hidden';
			}


			this.saveEventInfo(event);
			this.doScroll();

		}

		jsScroller.prototype.doScroll = function() {

			if(!this.isScrolling && this.lastScrollInfo.x != this.lastScrollInfo.left || this.lastScrollInfo.y != this.lastScrollInfo.top) {
				this.isScrolling = true;
				if(this.onScrollStart) this.onScrollStart();
			} else {
				//nothing to do here, cary on
				return;
			}
			//proceed normally
			var cssMatrix = this.getCSSMatrix(this.el);
			this.lastScrollInfo.top = numOnly(cssMatrix.f);
			this.lastScrollInfo.left = numOnly(cssMatrix.e);

			this.recalculateDeltaY(this.lastScrollInfo);
			this.recalculateDeltaX(this.lastScrollInfo);

			//boundaries control
			this.checkYboundary(this.lastScrollInfo);
			if(this.elementInfo.hasHorScroll) this.checkXboundary(this.lastScrollInfo);

			//pull to refresh elastic
			var positiveOverflow = this.lastScrollInfo.y > 0 && this.lastScrollInfo.deltaY > 0;
			var negativeOverflow = this.lastScrollInfo.y < -this.elementInfo.maxTop && this.lastScrollInfo.deltaY < 0;
			if(positiveOverflow || negativeOverflow) {
				var overflow = positiveOverflow ? this.lastScrollInfo.y : -this.lastScrollInfo.y - this.elementInfo.maxTop;
				var pcent = (this.container.clientHeight - overflow) / this.container.clientHeight;
				if(pcent < .5) pcent = .5;
				//cur top, maxTop or 0?
				var baseTop = 0;
				if((positiveOverflow && this.lastScrollInfo.top > 0) || (negativeOverflow && this.lastScrollInfo.top < -this.elementInfo.maxTop)) {
					baseTop = this.lastScrollInfo.top;
				} else if(negativeOverflow) {
					baseTop = -this.elementInfo.maxTop;
				}
				var changeY = this.lastScrollInfo.deltaY * pcent;
				var absChangeY = Math.abs(this.lastScrollInfo.deltaY * pcent);
				if(absChangeY < 1) changeY = positiveOverflow ? 1 : -1;
				this.lastScrollInfo.y = baseTop + changeY;
			}

			//move
			this.scrollerMoveCSS(this.lastScrollInfo, 0);
			this.setVScrollBar(this.lastScrollInfo, 0, 0);
			this.setHScrollBar(this.lastScrollInfo, 0, 0);

			//check refresh triggering
			if(this.refresh && !this.preventPullToRefresh) {
				if(!this.refreshTriggered && this.lastScrollInfo.top > this.refreshHeight) {
					this.refreshTriggered = true;
					$.trigger(this, 'refresh-trigger');
				} else if(this.refreshTriggered && this.lastScrollInfo.top < this.refreshHeight) {
					this.refreshTriggered = false;
					$.trigger(this, 'refresh-cancel');
				}
			}

			if(this.infinite && !this.infiniteTriggered) {
				if((Math.abs(this.lastScrollInfo.top) >= (this.el.clientHeight - this.container.clientHeight))) {
					this.infiniteTriggered = true;
					$.trigger(this, "infinite-scroll");
				}
			}

		}

		jsScroller.prototype.calculateMovement = function(event, last) {
			//default variables
			var scrollInfo = {
				//current position
				top: 0,
				left: 0,
				//current movement
				speedY: 0,
				speedX: 0,
				absSpeedY: 0,
				absSpeedX: 0,
				deltaY: 0,
				deltaX: 0,
				absDeltaY: 0,
				absDeltaX: 0,
				y: 0,
				x: 0,
				duration: 0
			};

			var prevEventInfo = last ? this.firstEventInfo : this.lastEventInfo;
			var pageX = last ? event.pageX : event.touches[0].pageX;
			var pageY = last ? event.pageY : event.touches[0].pageY;
			var time = last ? event.time : event.timeStamp;

			scrollInfo.deltaY = this.elementInfo.hasVertScroll ? pageY - prevEventInfo.pageY : 0;
			scrollInfo.deltaX = this.elementInfo.hasHorScroll ? pageX - prevEventInfo.pageX : 0;
			scrollInfo.time = time;

			scrollInfo.duration = time - prevEventInfo.time;

			return scrollInfo;
		}

		jsScroller.prototype.calculateTarget = function(scrollInfo) {
			scrollInfo.y = this.lastScrollInfo.y + scrollInfo.deltaY;
			scrollInfo.x = this.lastScrollInfo.x + scrollInfo.deltaX;
		}
		jsScroller.prototype.checkYboundary = function(scrollInfo) {
			var minTop = this.container.clientHeight / 2;
			var maxTop = this.elementInfo.maxTop + minTop;
			//y boundaries
			if(scrollInfo.y > minTop) scrollInfo.y = minTop;
			else if(-scrollInfo.y > maxTop) scrollInfo.y = -maxTop;
			else return;
			this.recalculateDeltaY(scrollInfo);
		}
		jsScroller.prototype.checkXboundary = function(scrollInfo) {
			//x boundaries
			if(scrollInfo.x > 0) scrollInfo.x = 0;
			else if(-scrollInfo.x > this.elementInfo.maxLeft) scrollInfo.x = -this.elementInfo.maxLeft;
			else return;

			this.recalculateDeltaY(scrollInfo);
		}
		jsScroller.prototype.recalculateDeltaY = function(scrollInfo) {
			//recalculate delta
			var oldAbsDeltaY = Math.abs(scrollInfo.deltaY);
			scrollInfo.deltaY = scrollInfo.y - scrollInfo.top;
			newAbsDeltaY = Math.abs(scrollInfo.deltaY);
			//recalculate duration at same speed
			scrollInfo.duration = scrollInfo.duration * newAbsDeltaY / oldAbsDeltaY;

		}
		jsScroller.prototype.recalculateDeltaX = function(scrollInfo) {
			//recalculate delta
			var oldAbsDeltaX = Math.abs(scrollInfo.deltaX);
			scrollInfo.deltaX = scrollInfo.x - scrollInfo.left;
			newAbsDeltaX = Math.abs(scrollInfo.deltaX);
			//recalculate duration at same speed
			scrollInfo.duration = scrollInfo.duration * newAbsDeltaX / oldAbsDeltaX;

		}

		jsScroller.prototype.hideRefresh = function(animate) {
			var that=this;
			if(this.preventHideRefresh) return;
			this.scrollerMoveCSS({
				x: 0,
				y: 0,
				complete:function(){
					$.trigger(that,"refresh-finish");
				}
			}, HIDE_REFRESH_TIME);
			this.refreshTriggered = false;
		}

		jsScroller.prototype.setMomentum = function(scrollInfo) {
			var deceleration = 0.0012;

			//calculate movement speed
			scrollInfo.speedY = this.divide(scrollInfo.deltaY, scrollInfo.duration);
			scrollInfo.speedX = this.divide(scrollInfo.deltaX, scrollInfo.duration);

			scrollInfo.absSpeedY = Math.abs(scrollInfo.speedY);
			scrollInfo.absSpeedX = Math.abs(scrollInfo.speedX);

			scrollInfo.absDeltaY = Math.abs(scrollInfo.deltaY);
			scrollInfo.absDeltaX = Math.abs(scrollInfo.deltaX);

			//set momentum
			if(scrollInfo.absDeltaY > 0) {
				scrollInfo.deltaY = (scrollInfo.deltaY < 0 ? -1 : 1) * (scrollInfo.absSpeedY * scrollInfo.absSpeedY) / (2 * deceleration);
				scrollInfo.absDeltaY = Math.abs(scrollInfo.deltaY);
				scrollInfo.duration = scrollInfo.absSpeedY / deceleration;
				scrollInfo.speedY = scrollInfo.deltaY / scrollInfo.duration;
				scrollInfo.absSpeedY = Math.abs(scrollInfo.speedY);
				if(scrollInfo.absSpeedY < deceleration * 100 || scrollInfo.absDeltaY < 5) scrollInfo.deltaY = scrollInfo.absDeltaY = scrollInfo.duration = scrollInfo.speedY = scrollInfo.absSpeedY = 0;
			} else if(scrollInfo.absDeltaX) {
				scrollInfo.deltaX = (scrollInfo.deltaX < 0 ? -1 : 1) * (scrollInfo.absSpeedX * scrollInfo.absSpeedX) / (2 * deceleration);
				scrollInfo.absDeltaX = Math.abs(scrollInfo.deltaX);
				scrollInfo.duration = scrollInfo.absSpeedX / deceleration;
				scrollInfo.speedX = scrollInfo.deltaX / scrollInfo.duration;
				scrollInfo.absSpeedX = Math.abs(scrollInfo.speedX);
				if(scrollInfo.absSpeedX < deceleration * 100 || scrollInfo.absDeltaX < 5) scrollInfo.deltaX = scrollInfo.absDeltaX = scrollInfo.duration = scrollInfo.speedX = scrollInfo.absSpeedX = 0;
			} else scrollInfo.duration = 0;
		}


		jsScroller.prototype.onTouchEnd = function(event) {


			if(this.currentScrollingObject == null || !this.moved) return;
			//event.preventDefault();
			this.finishScrollingObject = this.currentScrollingObject;
			this.currentScrollingObject = null;

			var scrollInfo = this.calculateMovement(this.lastEventInfo, true);
			if(!this.androidFormsMode) {
				this.setMomentum(scrollInfo);
			}
			this.calculateTarget(scrollInfo);

			//get the current top
			var cssMatrix = this.getCSSMatrix(this.el);
			scrollInfo.top = numOnly(cssMatrix.f);
			scrollInfo.left = numOnly(cssMatrix.e);

			//boundaries control
			this.checkYboundary(scrollInfo);
			if(this.elementInfo.hasHorScroll) this.checkXboundary(scrollInfo);

			var triggered = !this.preventPullToRefresh && (scrollInfo.top > this.refreshHeight || scrollInfo.y > this.refreshHeight);
			this.fireRefreshRelease(triggered, scrollInfo.top > 0);

			//refresh hang in
			if(this.refresh && triggered) {
				scrollInfo.y = this.refreshHeight;
				scrollInfo.duration = HIDE_REFRESH_TIME;
				//top boundary
			} else if(scrollInfo.y >= 0) {
				scrollInfo.y = 0;
				if(scrollInfo.top >= 0) scrollInfo.duration = HIDE_REFRESH_TIME;
				//lower boundary
			} else if(-scrollInfo.y > this.elementInfo.maxTop || this.elementInfo.maxTop == 0) {
				scrollInfo.y = -this.elementInfo.maxTop;
				if(-scrollInfo.top > this.elementInfo.maxTop) scrollInfo.duration = HIDE_REFRESH_TIME;
				//all others
			}

			if(this.androidFormsMode) scrollInfo.duration = 0;
			this.scrollerMoveCSS(scrollInfo, scrollInfo.duration, "cubic-bezier(0.33,0.66,0.66,1)");
			this.setVScrollBar(scrollInfo, scrollInfo.duration, "cubic-bezier(0.33,0.66,0.66,1)");
			this.setHScrollBar(scrollInfo, scrollInfo.duration, "cubic-bezier(0.33,0.66,0.66,1)");

			this.setFinishCalback(scrollInfo.duration);
			if(this.infinite && !this.infiniteTriggered) {
				if((Math.abs(scrollInfo.y) >= (this.el.clientHeight - this.container.clientHeight))) {
					this.infiniteTriggered = true;
					$.trigger(this, "infinite-scroll");
				}
			}
		}

		//finish callback
		jsScroller.prototype.setFinishCalback = function(duration) {
			var that = this;
			this.scrollingFinishCB = setTimeout(function() {
				that.hideScrollbars();
				$.trigger($.touchLayer, 'scrollend', [that.el]); //notify touchLayer of this elements scrollend
				$.trigger(that,"scrollend",[that.el]);
				that.isScrolling = false;
				that.elementInfo = null; //reset elementInfo when idle
				if(that.infinite) $.trigger(that, "infinite-scroll-end");
			}, duration);
		}

		//Android Forms Fix
		jsScroller.prototype.startFormsMode = function() {
			if(this.blockFormsFix) return;
			//get prev values
			var cssMatrix = this.getCSSMatrix(this.el);
			//toggle vars
			this.refreshSafeKeep = this.refresh;
			this.refresh = false;
			this.androidFormsMode = true;
			//set new css rules
			this.el.style[$.feat.cssPrefix+"Transform"] = "none";
			this.el.style[$.feat.cssPrefix+"Transition"] = "none";
			this.el.style[$.feat.cssPrefix+"Perspective"] = "none";

			//set position
			this.scrollerMoveCSS({
				x: numOnly(cssMatrix.e),
				y: numOnly(cssMatrix.f)
			}, 0);

			//container
			this.container.style[$.feat.cssPrefix+"Perspective"] = "none";
			this.container.style[$.feat.cssPrefix+"BackfaceVisibility"] = "visible";
			//scrollbars
			if(this.vscrollBar){
				this.vscrollBar.style[$.feat.cssPrefix+"Transform"] = "none";
				this.vscrollBar.style[$.feat.cssPrefix+"Transition"] = "none";
				this.vscrollBar.style[$.feat.cssPrefix+"Perspective"] = "none";
				this.vscrollBar.style[$.feat.cssPrefix+"BackfaceVisibility"] = "visible";
			}
			if(this.hscrollBar){
				this.hscrollBar.style[$.feat.cssPrefix+"Transform"] = "none";
				this.hscrollBar.style[$.feat.cssPrefix+"Transition"] = "none";
				this.hscrollBar.style[$.feat.cssPrefix+"Perspective"] = "none";
				this.hscrollBar.style[$.feat.cssPrefix+"BackfaceVisibility"] = "visible";
			}

		}
		jsScroller.prototype.stopFormsMode = function() {
			if(this.blockFormsFix) return;
			//get prev values
			var cssMatrix = this.getCSSMatrix(this.el);
			//toggle vars
			this.refresh = this.refreshSafeKeep;
			this.androidFormsMode = false;
			//set new css rules
			this.el.style[$.feat.cssPrefix+"Perspective"] = 1000;
			this.el.style.marginTop = 0;
			this.el.style.marginLeft = 0;
			this.el.style[$.feat.cssPrefix+"Transition"] = '0ms linear';	//reactivate transitions
			//set position
			this.scrollerMoveCSS({
				x: numOnly(cssMatrix.e),
				y: numOnly(cssMatrix.f)
			}, 0);
			//container
			this.container.style[$.feat.cssPrefix+"Perspective"] = 1000;
			this.container.style[$.feat.cssPrefix+"BackfaceVisibility"] = "hidden";
			//scrollbars
			if(this.vscrollBar){
				this.vscrollBar.style[$.feat.cssPrefix+"Perspective"] = 1000;
				this.vscrollBar.style[$.feat.cssPrefix+"BackfaceVisibility"] = "hidden";
			}
			if(this.hscrollBar){
				this.hscrollBar.style[$.feat.cssPrefix+"Perspective"] = 1000;
				this.hscrollBar.style[$.feat.cssPrefix+"BackfaceVisibility"] = "hidden";
			}

		}



		jsScroller.prototype.scrollerMoveCSS = function(distanceToMove, time, timingFunction) {
			if(!time) time = 0;
			if(!timingFunction) timingFunction = "linear";
			time=numOnly(time);
			if(this.el && this.el.style) {

				//do not touch the DOM if disabled
				if(this.eventsActive) {
					if(this.androidFormsMode) {
						this.el.style.marginTop = Math.round(distanceToMove.y) + "px";
						this.el.style.marginLeft = Math.round(distanceToMove.x) + "px";
					} else {

			            this.el.style[$.feat.cssPrefix+"Transform"] = "translate" + translateOpen + distanceToMove.x + "px," + distanceToMove.y + "px" + translateClose;
			            this.el.style[$.feat.cssPrefix+"TransitionDuration"]= time + "ms";
			            this.el.style[$.feat.cssPrefix+"TransitionTimingFunction"] = timingFunction;
					}
				}
				// Position should be updated even when the scroller is disabled so we log the change
				this.logPos(distanceToMove.x, distanceToMove.y);
			}
		}
		jsScroller.prototype.logPos = function(x, y) {

			if(!this.elementInfo) {
				var size = this.getViewportSize();
			} else {
				var size = {
					h: this.elementInfo.bottomMargin,
					w: this.elementInfo.rightMargin
				}
			}

			this.loggedPcentX = this.divide(x, (this.el.clientWidth - size.w));
			this.loggedPcentY = this.divide(y, (this.el.clientHeight - size.h));
			this.scrollTop = y;
			this.scrollLeft = x;
		}
		jsScroller.prototype.scrollbarMoveCSS = function(el, distanceToMove, time, timingFunction) {
			if(!time) time = 0;
			if(!timingFunction) timingFunction = "linear";

			if(el && el.style) {
				if(this.androidFormsMode) {
					el.style.marginTop = Math.round(distanceToMove.y) + "px";
					el.style.marginLeft = Math.round(distanceToMove.x) + "px";
				} else {
		            el.style[$.feat.cssPrefix+"Transform"] = "translate" + translateOpen + distanceToMove.x + "px," + distanceToMove.y + "px" + translateClose;
		            el.style[$.feat.cssPrefix+"TransitionDuration"]= time + "ms";
		            el.style[$.feat.cssPrefix+"TransitionTimingFunction"] = timingFunction;
				}
			}
		}
		jsScroller.prototype.scrollTo = function(pos, time) {
			if(!time) time = 0;
			this.scrollerMoveCSS(pos, time);
		}
		jsScroller.prototype.scrollBy = function(pos, time) {
			var cssMatrix = this.getCSSMatrix(this.el);
			var startTop = numOnly(cssMatrix.f);
			var startLeft = numOnly(cssMatrix.e);
			this.scrollTo({
				y: startTop - pos.y,
				x: startLeft - pos.x
			}, time);
		}
		jsScroller.prototype.scrollToBottom = function(time) {
			this.scrollTo({
				y: -1 * (this.el.clientHeight - this.container.clientHeight),
				x: 0
			}, time);
		}
		jsScroller.prototype.scrollToTop=function(time){
			this.scrollTo({x:0,y:0},time);
		}
		return scroller;
	})();
})(jq);
/**
 * jq.popup - a popup/alert library for html5 mobile apps
 * @copyright Indiepath 2011 - Tim Fisher
 * Modifications/enhancements by appMobi for jqMobi
 * 
 */

/* EXAMPLE
  $('body').popup({
	    title:"Alert! Alert!",
	    message:"This is a test of the emergency alert system!! Don't PANIC!",
	    cancelText:"Cancel me", 
	    cancelCallback: function(){console.log("cancelled");},
	    doneText:"I'm done!",
	    doneCallback: function(){console.log("Done for!");},
	    cancelOnly:false,
        doneClass:'button',
        cancelClass:'button',
        onShow:function(){console.log('showing popup');}
        autoCloseDone:true, //default is true will close the popup when done is clicked.
        suppressTitle:false //Do not show the title if set to true
  });
  
  You can programatically trigger a close by dispatching a "close" event to it.
  
  $('body').popup({title:'Alert',id:'myTestPopup'});
  $("#myTestPopup").trigger("close");
  
 */
(function($) {
    
    $.fn.popup = function(opts) {
        return new popup(this[0], opts);
    };
    var queue = [];
    var popup = (function() {
        var popup = function(containerEl, opts) {
            
            if (typeof containerEl === "string" || containerEl instanceof String) {
                this.container = document.getElementById(containerEl);
            } else {
                this.container = containerEl;
            }
            if (!this.container) {
                alert("Error finding container for popup " + containerEl);
                return;
            }
            
            try {
                if (typeof (opts) === "string" || typeof (opts) === "number")
                    opts = {message: opts,cancelOnly: "true",cancelText: "OK"};
                this.id = id = opts.id = opts.id || $.uuid(); //opts is passed by reference
                var self = this;
                this.title = opts.suppressTitle?"":(opts.title || "Alert");
                this.message = opts.message || "";
                this.cancelText = opts.cancelText || "Cancel";
                this.cancelCallback = opts.cancelCallback || function() {
                };
                this.cancelClass = opts.cancelClass || "button";
                this.doneText = opts.doneText || "Done";
                this.doneCallback = opts.doneCallback || function(self) {
                    // no action by default
                };
                this.doneClass = opts.doneClass || "button";
                this.cancelOnly = opts.cancelOnly || false;
                this.onShow = opts.onShow || function(){};
                this.autoCloseDone=opts.autoCloseDone!==undefined?opts.autoCloseDone:true;
                
                queue.push(this);
                if (queue.length == 1)
                    this.show();
            } catch (e) {
                console.log("error adding popup " + e);
            }
        
        };
        
        popup.prototype = {
            id: null,
            title: null,
            message: null,
            cancelText: null,
            cancelCallback: null,
            cancelClass: null,
            doneText: null,
            doneCallback: null,
            doneClass: null,
            cancelOnly: false,
            onShow: null,
            autoCloseDone:true,
            supressTitle:false,
            show: function() {
                var self = this;
                var markup = '<div id="' + this.id + '" class="jqPopup hidden">\
	        				<header>' + this.title + '</header>\
	        				<div><div style="width:1px;height:1px;-webkit-transform:translate3d(0,0,0);float:right"></div>' + this.message + '</div>\
	        				<footer style="clear:both;">\
	        					<a href="javascript:;" class="'+this.cancelClass+'" id="cancel">' + this.cancelText + '</a>\
	        					<a href="javascript:;" class="'+this.doneClass+'" id="action">' + this.doneText + '</a>\
	        				</footer>\
	        			</div></div>';
                $(this.container).append($(markup));
                
                var $el=$("#"+this.id);
                $el.bind("close", function(){
                	self.hide();
                })
                
                if (this.cancelOnly) {
                    $el.find('A#action').hide();
                    $el.find('A#cancel').addClass('center');
                }
                $el.find('A').each(function() {
                    var button = $(this);
                    button.bind('click', function(e) {
                        if (button.attr('id') == 'cancel') {
                            self.cancelCallback.call(self.cancelCallback, self);
                            self.hide();
                        } else {
                            self.doneCallback.call(self.doneCallback, self);
                            if(self.autoCloseDone)
                                self.hide();
                        }
                        e.preventDefault();
                     });
                });
                self.positionPopup();
                $.blockUI(0.5);
                $el.removeClass('hidden');
                $el.bind("orientationchange", function() {
                    self.positionPopup();
                });
               
                //force header/footer showing to fix CSS style bugs
                $el.find("header").show();
                $el.find("footer").show();
                this.onShow(this);
                
            },
            
            hide: function() {
                var self = this;
                $('#' + self.id).addClass('hidden');
                $.unblockUI();
                setTimeout(function() {
                    self.remove();
                }, 250);
            },
            
            remove: function() {
                var self = this;
                var $el=$("#"+self.id);
                $el.unbind("close");
                $el.find('BUTTON#action').unbind('click');
                $el.find('BUTTON#cancel').unbind('click');
                $el.unbind("orientationchange").remove();
                queue.splice(0, 1);
                if (queue.length > 0)
                    queue[0].show();
            },
            
            positionPopup: function() {
                var popup = $('#' + this.id);
                popup.css("top", ((window.innerHeight / 2.5) + window.pageYOffset) - (popup[0].clientHeight / 2) + "px");
                popup.css("left", (window.innerWidth / 2) - (popup[0].clientWidth / 2) + "px");
            }
        };
        
        return popup;
    })();
    var uiBlocked = false;
    $.blockUI = function(opacity) {
        if (uiBlocked)
            return;
        opacity = opacity ? " style='opacity:" + opacity + ";'" : "";
        $('BODY').prepend($("<div id='mask'" + opacity + "></div>"));
        $('BODY DIV#mask').bind("touchstart", function(e) {
            e.preventDefault();
        });
        $('BODY DIV#mask').bind("touchmove", function(e) {
            e.preventDefault();
        });
        uiBlocked = true
    };
    
    $.unblockUI = function() {
        uiBlocked = false;
        $('BODY DIV#mask').unbind("touchstart");
        $('BODY DIV#mask').unbind("touchmove");
        $("BODY DIV#mask").remove();
    };
    /**
     * Here we override the window.alert function due to iOS eating touch events on native alerts
     */
    window.alert = function(text) {
        if(text===null||text===undefined)
            text="null";
        if($("#jQUi").length>0)
            $("#jQUi").popup(text.toString());
        else
            $(document.body).popup(text.toString());
    }
    
})(jq);
/**
 * jq.web.actionsheet - a actionsheet for html5 mobile apps
 * Copyright 2012 - AppMobi 
 */
(function($) {
    $.fn["actionsheet"] = function(opts) {
        var tmp;
        for (var i = 0; i < this.length; i++) {
            tmp = new actionsheet(this[i], opts);
        }
        return this.length == 1 ? tmp : this;
    };
    var actionsheet = (function() {
        var actionsheet = function(elID, opts) {
            if (typeof elID == "string" || elID instanceof String) {
                this.el = document.getElementById(elID);
            } else {
                this.el = elID;
            }
            if (!this.el) {
                alert("Could not find element for actionsheet " + elID);
                return;
            }
            
            if (this instanceof actionsheet) {
                if(typeof(opts)=="object"){
                for (j in opts) {
                    this[j] = opts[j];
                }
                }
            } else {
                return new actionsheet(elID, opts);
            }
            
            try {
                var that = this;
                var markStart = '<div id="jq_actionsheet"><div style="width:100%">';
                var markEnd = '</div></div>';
                var markup;
                if (typeof opts == "string") {
                    markup = $(markStart + opts +"<a href='javascript:;' class='cancel'>Cancel</a>"+markEnd);
                } else if (typeof opts == "object") {
                    markup = $(markStart + markEnd);
                    var container = $(markup.children().get());
                    opts.push({text:"Cancel",cssClasses:"cancel"});
                    for (var i = 0; i < opts.length; i++) {
                        var item = $('<a href="javascript:;" >' + (opts[i].text || "TEXT NOT ENTERED") + '</a>');
                        item[0].onclick = (opts[i].handler || function() {});
                        if (opts[i].cssClasses && opts[i].cssClasses.length > 0)
                            item.addClass(opts[i].cssClasses);
                        container.append(item);
                    }
                }
                $(elID).find("#jq_actionsheet").remove();
                $(elID).find("#jq_action_mask").remove();
                actionsheetEl = $(elID).append(markup);
                
                markup.get().style[$.feat.cssPrefix+'Transition']="all 0ms";
                markup.css($.feat.cssPrefix+"Transform",  "translate"+$.feat.cssTransformStart+"0,0"+$.feat.cssTransformEnd);
                markup.css("top",window.innerHeight+"px");
                this.el.style.overflow = "hidden";
                markup.on("click", "a",function(){that.hideSheet()});
                this.activeSheet=markup;
                $(elID).append('<div id="jq_action_mask" style="position:absolute;top:0px;left:0px;right:0px;bottom:0px;z-index:9998;background:rgba(0,0,0,.4)"/>');
                setTimeout(function(){
                    markup.get().style[$.feat.cssPrefix+'Transition']="all 300ms";
                    markup.css($.feat.cssPrefix+"Transform", "translate"+ $.feat.cssTransformStart+"0,"+(-(markup.height()))+"px"+$.feat.cssTransformEnd);
                 },10);
            } catch (e) {
                alert("error adding actionsheet" + e);
            }
        };
        actionsheet.prototype = {
            activeSheet:null,
            hideSheet: function() {
                var that=this;
                this.activeSheet.off("click","a",function(){that.hideSheet()});
                $(this.el).find("#jq_action_mask").remove();
                this.activeSheet.get().style[$.feat.cssPrefix+'Transition']="all 0ms";
                var markup = this.activeSheet;
                var theEl = this.el;
                setTimeout(function(){
                    
                	markup.get().style[$.feat.cssPrefix+'Transition']="all 300ms";

                	markup.css($.feat.cssPrefix+"Transform", "translate"+$.feat.cssTransformStart+"0,0px"+$.feat.cssTransformEnd);
                	setTimeout(function(){
		                markup.remove();
		                markup=null;
		                theEl.style.overflow = "none";
	                },500);
                },10);            
            }
        };
        return actionsheet;
    })();
})(jq);

/*
 * jq.web.passwordBox - password box replacement for html5 mobile apps on android due to a bug with CSS3 translate3d
 * @copyright 2011 - AppMobi
 */
(function ($) {
    $["passwordBox"] = function () {

        return new passwordBox();
    };

    var passwordBox = function () {
            this.oldPasswords = {};
        };
    passwordBox.prototype = {
        showPasswordPlainText: false,
        getOldPasswords: function (elID) {
         //   if ($.os.android == false) return; -  iOS users seem to want this too, so we'll let everyone join the party
            var container = elID && document.getElementById(elID) ? document.getElementById(elID) : document;
            if (!container) {
                alert("Could not find container element for passwordBox " + elID);
                return;
            }
            var sels = container.getElementsByTagName("input");

            var that = this;
            for (var i = 0; i < sels.length; i++) {
                if (sels[i].type != "password") continue;

                if($.os.webkit){
                    sels[i].type = "text";
                    sels[i].style['-webkit-text-security'] = "disc";
                }
            }
        },

        changePasswordVisiblity: function (what, id) {
            what = parseInt(what);
            var theEl = document.getElementById(id);
            
            if (what == 1) { //show
                theEl.style[$.cssPrefix+'text-security'] = "none";
            } else {
                theEl.style[$.cssPrefix+'text-security'] = "disc";
            }
            if(!$.os.webkit) {
                if(what==1)
                    theEl.type="text"
                else
                    theEl.type="password";
            }
            theEl = null;
        }
    };
})(jq);
/*
 * Copyright: AppMobi
 * Description:  This script will replace all drop downs with friendly select controls.  Users can still interact
 * with the old drop down box as normal with javascript, and this will be reflected
 
 */
(function($) {
    $['selectBox'] = {
        scroller: null,
        getOldSelects: function(elID) {
            if (!$.os.android || $.os.androidICS)
               return;
            if (!$.fn['scroller']) {
                alert("This library requires jq.web.Scroller");
                return;
            }
            var container = elID && document.getElementById(elID) ? document.getElementById(elID) : document;
            if (!container) {
                alert("Could not find container element for jq.web.selectBox " + elID);
                return;
            }
            var sels = container.getElementsByTagName("select");
            var that = this;
            for (var i = 0; i < sels.length; i++) {
                if (sels[i].hasSelectBoxFix)
                    continue;
                (function(theSel) {
                    var fakeInput = document.createElement("div");
					var theSelStyle = window.getComputedStyle(theSel);
					var width = theSelStyle.width=='intrinsic' ? '100%' : theSelStyle.width;
                    var selWidth = parseInt(width) > 0 ? width : '100px';
                    var selHeight = parseInt(theSel.style.height) > 0 ? theSel.style.height : (parseInt(theSelStyle.height) ? theSelStyle.height : '20px');
                    fakeInput.style.width = selWidth;
                    fakeInput.style.height = selHeight;
					fakeInput.style.margin = theSelStyle.margin;
					fakeInput.style.position = theSelStyle.position;
					fakeInput.style.left = theSelStyle.left;
					fakeInput.style.top = theSelStyle.top;
					fakeInput.style.lineHeight = theSelStyle.lineHeight;
                    //fakeInput.style.position = "absolute";
                    //fakeInput.style.left = "0px";
                    //fakeInput.style.top = "0px";
                    fakeInput.style.zIndex = "1";
                    if (theSel.value)
                        fakeInput.innerHTML = theSel.options[theSel.selectedIndex].text;
                    fakeInput.style.background = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAeCAIAAABFWWJ4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkM1NjQxRUQxNUFEODExRTA5OUE3QjE3NjI3MzczNDAzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM1NjQxRUQyNUFEODExRTA5OUE3QjE3NjI3MzczNDAzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzU2NDFFQ0Y1QUQ4MTFFMDk5QTdCMTc2MjczNzM0MDMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzU2NDFFRDA1QUQ4MTFFMDk5QTdCMTc2MjczNzM0MDMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6YWbdCAAAAlklEQVR42mIsKChgIBGwAHFPTw/xGkpKSlggrG/fvhGjgYuLC0gyMZAOoPb8//9/0Or59+8f8XrICQN66SEnDOgcp3AgKiqKqej169dY9Hz69AnCuHv3rrKyMrIKoAhcVlBQELt/gIqwstHD4B8quH37NlAQSKKJEwg3iLbBED8kpeshoGcwh5uuri5peoBFMEluAwgwAK+5aXfuRb4gAAAAAElFTkSuQmCC') right top no-repeat";
                    fakeInput.style.backgroundColor = "white";
                    fakeInput.style.lineHeight = selHeight;
                    fakeInput.style.backgroundSize = "contain"; 
                    fakeInput.className = "jqmobiSelect_fakeInput " + theSel.className;
                    fakeInput.id = theSel.id + "_jqmobiSelect";
                    
                    fakeInput.style.border = "1px solid gray";
                    fakeInput.style.color = "black";
                    fakeInput.linkId = theSel.id;
                    fakeInput.onclick = function(e) {
                        that.initDropDown(this.linkId);
                    };
                    $(fakeInput).insertBefore($(theSel));
                    //theSel.parentNode.style.position = "relative";
                    theSel.style.display = "none";
                    theSel.style.webkitAppearance = "none";
                    // Create listeners to watch when the select value has changed.
                    // This is needed so the users can continue to interact as normal,
                    // via jquery or other frameworks
                    for (var j = 0; j < theSel.options.length; j++) {
                        if (theSel.options[j].selected) {
                            fakeInput.value = theSel.options[j].text;
                        }
                        theSel.options[j].watch( "selected", function(prop, oldValue, newValue) {
                            if (newValue == true) {
                                if(!theSel.getAttribute("multiple"))
                                that.updateMaskValue(this.parentNode.id, this.text, this.value);
                                this.parentNode.value = this.value;
                            }
                            return newValue;
                        });
                    }
                    theSel.watch("selectedIndex", function(prop, oldValue, newValue) {
                        if (this.options[newValue]) {
                            if(!theSel.getAttribute("multiple"))
                            that.updateMaskValue(this.id, this.options[newValue].text, this.options[newValue].value);
                            this.value = this.options[newValue].value;
                        }
                        return newValue;
                    });
                    
                    fakeInput = null;
                    imageMask = null;
                    sels[i].hasSelectBoxFix = true;
                
                
                })(sels[i]);
            }
            that.createHtml();
        },
        updateDropdown: function(id) {
            var el = document.getElementById(id);
            if (!el)
                return;
            for (var j = 0; j < el.options.length; j++) {
                if (el.options[j].selected)
                    fakeInput.value = el.options[j].text;
                el.options[j].watch("selected", function(prop, oldValue, newValue) {
                    if (newValue == true) {
                        that.updateMaskValue(this.parentNode.id, this.text, this.value);
                        this.parentNode.value = this.value;
                    }
                    return newValue;
                });
            }
            el = null;
        },
        initDropDown: function(elID) {
            
            var that = this;
            var el = document.getElementById(elID);
            if (el.disabled)
                return;
            if (!el || !el.options || el.options.length == 0)
                return;
            var htmlTemplate = "";
            var foundInd = 0;
            document.getElementById("jqmobiSelectBoxScroll").innerHTML = "";
            
            document.getElementById("jqmobiSelectBoxHeaderTitle").innerHTML = (el.name != undefined && el.name != "undefined" && el.name != "" ? el.name : elID);
            
            for (var j = 0; j < el.options.length; j++) {
                var currInd = j;
                el.options[j].watch( "selected", function(prop, oldValue, newValue) {
                    if (newValue == true) {
                        that.updateMaskValue(this.parentNode.id, this.text, this.value);
                        this.parentNode.value = this.value;
                    }
                    return newValue;
                });
                var checked = (el.options[j].selected) ? true : false;
                var button = "";
                var div = document.createElement("div");
                div.className = "jqmobiSelectRow";
               // div.id = foundID;
                div.style.cssText = ";line-height:40px;font-size:14px;padding-left:10px;height:40px;width:100%;position:relative;width:100%;border-bottom:1px solid black;background:white;";
                var anchor = document.createElement("a");
                anchor.href = "javascript:;";
                div.tmpValue = j;
                div.onclick = function(e) {
                    that.setDropDownValue(elID, this.tmpValue,this);
                };
                anchor.style.cssText = "text-decoration:none;color:black;";
                anchor.innerHTML = el.options[j].text;
                var span = document.createElement("span");
                span.style.cssText = "float:right;margin-right:20px;margin-top:-2px";
                var rad = document.createElement("button");
                if (checked) {
                    rad.style.cssText = "background: #000;padding: 0px 0px;border-radius:15px;border:3px solid black;";
                    rad.className = "jqmobiSelectRowButtonFound";
                } else {
                    rad.style.cssText = "background: #ffffff;padding: 0px 0px;border-radius:15px;border:3px solid black;";
                    rad.className = "jqmobiSelectRowButton";
                }
                rad.style.width = "20px";
                rad.style.height = "20px";
                
                rad.checked = checked;
                
                anchor.className = "jqmobiSelectRowText";
                span.appendChild(rad);
                div.appendChild(anchor);
                div.appendChild(span);
                
                document.getElementById("jqmobiSelectBoxScroll").appendChild(div);
                
                span = null;
                rad = null;
                anchor = null;
            }
            try {
                document.getElementById("jqmobiSelectModal").style.display = 'block';
            } catch (e) {
                console.log("Error showing div " + e);
            }
            try {
                if (div) {
                    var scrollThreshold = numOnly(div.style.height);
                    var offset = numOnly(document.getElementById("jqmobiSelectBoxHeader").style.height);
                    
                    if (foundInd * scrollThreshold + offset >= numOnly(document.getElementById("jqmobiSelectBoxFix").clientHeight) - offset)
                        var scrollToPos = (foundInd) * -scrollThreshold + offset;
                    else
                        scrollToPos = 0;
                    this.scroller.scrollTo({
                        x: 0,
                        y: scrollToPos
                    });
                }
            } catch (e) {
                console.log("error init dropdown" + e);
            }
            div = null;
            el = null;
        },
        updateMaskValue: function(elID, value, val2) {
            
            var el = document.getElementById(elID + "_jqmobiSelect");
            var el2 = document.getElementById(elID);
            if (el)
                el.innerHTML = value;
            if (typeof (el2.onchange) == "function")
                el2.onchange(val2);
            el = null;
            el2 = null;
        },
        setDropDownValue: function(elID, value,div) {
            
            
            var el = document.getElementById(elID);
            if(!el)
                return

            if(!el.getAttribute("multiple")){
                el.selectedIndex = value;
                $(el).find("option").forEach(function(obj){
                    obj.selected=false;
                });  
                $(el).find("option:nth-child("+(value+1)+")").get(0).selected=true;
            this.scroller.scrollTo({
                x: 0,
                y: 0
            });
            this.hideDropDown();
            }
            else {
                //multi select
                
                var myEl=$(el).find("option:nth-child("+(value+1)+")").get(0);
                if(myEl.selected){
                    myEl.selected=false;
                    $(div).find("button").css("background","#fff");    
                }
                else {
                     myEl.selected=true;
                    $(div).find("button").css("background","#000");  
                }

            }
            $(el).trigger("change");
            el = null;
        },
        hideDropDown: function() {
            document.getElementById("jqmobiSelectModal").style.display = 'none';
            document.getElementById("jqmobiSelectBoxScroll").innerHTML = "";
        },
        createHtml: function() {
            var that = this;
            if (document.getElementById("jqmobiSelectBoxContainer")) {
                return;
            }
            var modalDiv = document.createElement("div");
            
            modalDiv.style.cssText = "position:absolute;top:0px;bottom:0px;left:0px;right:0px;background:rgba(0,0,0,.7);z-index:200000;display:none;";
            modalDiv.id = "jqmobiSelectModal";
            
            var myDiv = document.createElement("div");
            myDiv.id = "jqmobiSelectBoxContainer";
            myDiv.style.cssText = "position:absolute;top:8%;bottom:10%;display:block;width:90%;margin:auto;margin-left:5%;height:90%px;background:white;color:black;border:1px solid black;border-radius:6px;";
            myDiv.innerHTML = "<div id='jqmobiSelectBoxHeader' style=\"display:block;font-family:'Eurostile-Bold', Eurostile, Helvetica, Arial, sans-serif;color:#fff;font-weight:bold;font-size:18px;line-height:34px;height:34px; text-transform:uppercase;text-align:left;text-shadow:rgba(0,0,0,.9) 0px -1px 1px;    padding: 0px 8px 0px 8px;    border-top-left-radius:5px; border-top-right-radius:5px; -webkit-border-top-left-radius:5px; -webkit-border-top-right-radius:5px;    background:#39424b;    margin:1px;\"><div style='float:left;' id='jqmobiSelectBoxHeaderTitle'></div><div style='float:right;width:60px;margin-top:-5px'><div id='jqmobiSelectClose' class='button' style='width:60px;height:32px;line-height:32px;'>Close</div></div></div>";
            myDiv.innerHTML += '<div id="jqmobiSelectBoxFix"  style="position:relative;height:90%;background:white;overflow:hidden;width:100%;"><div id="jqmobiSelectBoxScroll"></div></div>';
            var that = this;
            modalDiv.appendChild(myDiv);
            
            $(document).ready(function() {
               
                if(jq("#jQUi"))
                   jq("#jQUi").append(modalDiv);
                else
                    document.body.appendChild(modalDiv);
                var close = $("#jqmobiSelectClose").get();
                close.onclick = function() {
                    that.hideDropDown();
                };
                
                var styleSheet = $("<style>.jqselectscrollBarV{opacity:1 !important;}</style>").get();
                document.body.appendChild(styleSheet);
                try {
                    that.scroller = $("#jqmobiSelectBoxScroll").scroller({
                        scroller: false,
                        verticalScroll: true,
                        vScrollCSS: "jqselectscrollBarV"
                    });
                
                } catch (e) {
                    console.log("Error creating select html " + e);
                }
                modalDiv = null;
                myDiv = null;
                styleSheet = null;
            });
        }
    };

//The following is based off Eli Grey's shim
//https://gist.github.com/384583
//We use HTMLElement to not cause problems with other objects
if (!HTMLElement.prototype.watch) {
	HTMLElement.prototype.watch = function (prop, handler) {
		var oldval = this[prop], newval = oldval,
		getter = function () {
			return newval;
		},
		setter = function (val) {
			oldval = newval;
			return newval = handler.call(this, prop, oldval, val);
		};
		if (delete this[prop]) { // can't watch constants
			if (HTMLElement.defineProperty) { // ECMAScript 5
				HTMLElement.defineProperty(this, prop, {
					get: getter,
					set: setter,
					enumerable: false,
					configurable: true
				});
			} else if (HTMLElement.prototype.__defineGetter__ && HTMLElement.prototype.__defineSetter__) { // legacy
				HTMLElement.prototype.__defineGetter__.call(this, prop, getter);
				HTMLElement.prototype.__defineSetter__.call(this, prop, setter);
			}
		}
	};
}
if (!HTMLElement.prototype.unwatch) {
	HTMLElement.prototype.unwatch = function (prop) {
		var val = this[prop];
		delete this[prop]; // remove accessors
		this[prop] = val;
	};
}   
})(jq);

//Touch events are from zepto/touch.js
(function($) {
    var touch = {}, touchTimeout;
    
    function parentIfText(node) {
        return 'tagName' in node ? node : node.parentNode;
    }
    
    function swipeDirection(x1, x2, y1, y2) {
        var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2);
        if (xDelta >= yDelta) {
            return (x1 - x2 > 0 ? 'Left' : 'Right');
        } else {
            return (y1 - y2 > 0 ? 'Up' : 'Down');
        }
    }
    
    var longTapDelay = 750;
    function longTap() {
        if (touch.last && (Date.now() - touch.last >= longTapDelay)) {
            touch.el.trigger('longTap');
            touch = {};
        }
    }
    var longTapTimer;
    $(document).ready(function() {
        var prevEl;
        $(document.body).bind('touchstart', function(e) {
            if(!e.touches||e.touches.length==0) return;
            var now = Date.now(), delta = now - (touch.last || now);
            if(!e.touches||e.touches.length==0) return;
            touch.el = $(parentIfText(e.touches[0].target));
            touchTimeout && clearTimeout(touchTimeout);
            touch.x1 =  e.touches[0].pageX;
            touch.y1 = e.touches[0].pageY;
            touch.x2=touch.y2=0;
            if (delta > 0 && delta <= 250)
                touch.isDoubleTap = true;
            touch.last = now;
           longTapTimer=setTimeout(longTap, longTapDelay);
            if (!touch.el.data("ignore-pressed"))
                touch.el.addClass("selected");
            if(prevEl&&!prevEl.data("ignore-pressed"))
                prevEl.removeClass("selected");
            prevEl=touch.el;
        }).bind('touchmove', function(e) {
            touch.x2 = e.touches[0].pageX;
            touch.y2 = e.touches[0].pageY;
            clearTimeout(longTapTimer);
        }).bind('touchend', function(e) {

            if (!touch.el)
                return;
            if (!touch.el.data("ignore-pressed"))
                touch.el.removeClass("selected");
            if (touch.isDoubleTap) {
                touch.el.trigger('doubleTap');
                touch = {};
            } else if (touch.x2 > 0 || touch.y2 > 0) {
                (Math.abs(touch.x1 - touch.x2) > 30 || Math.abs(touch.y1 - touch.y2) > 30) && 
                touch.el.trigger('swipe') && 
                touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
                touch.x1 = touch.x2 = touch.y1 = touch.y2 = touch.last = 0;
            } else if ('last' in touch) {
                touch.el.trigger('tap');

                
                touchTimeout = setTimeout(function() {
                    touchTimeout = null;
                    if (touch.el)
                        touch.el.trigger('singleTap');
                    touch = {};
                }, 250);
            }
        }).bind('touchcancel', function() {
            if(touch.el&& !touch.el.data("ignore-pressed"))
                touch.el.removeClass("selected");
            touch = {};
            clearTimeout(longTapTimer);

        });
    });
    
    ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(m) {
        $.fn[m] = function(callback) {
            return this.bind(m, callback)
        }
    });
})(jq);

//TouchLayer contributed by Carlos Ouro @ Badoo
//un-authoritive layer between touches and actions on the DOM 
//(un-authoritive: listeners do not require useCapture)
//handles overlooking JS and native scrolling, panning, 
//no delay on click, edit mode focus, preventing defaults, resizing content, 
//enter/exit edit mode (keyboard on screen), prevent clicks on momentum, etc
//It can be used independently in other apps but it is required by jqUi
//Object Events
//Enter Edit Mode:
//pre-enter-edit - when a possible enter-edit is actioned - happens before actual click or focus (android can still reposition elements and event is actioned)
//cancel-enter-edit - when a pre-enter-edit does not result in a enter-edit
//enter-edit - on a enter edit mode focus
//enter-edit-reshape - focus resized/scrolled event
//in-edit-reshape - resized/scrolled event when a different element is focused
//Exit Edit Mode
//exit-edit - on blur
//exit-edit-reshape - blur resized/scrolled event
//Other
//orientationchange-reshape - resize event due to an orientationchange action
//reshape - window.resize/window.scroll event (ignores onfocus "shaking") - general reshape notice
(function() {

	//singleton
	$.touchLayer = function(el) {
	//	if(jq.os.desktop||!jq.os.webkit) return;
		$.touchLayer = new touchLayer(el);
		return $.touchLayer;
	};
	//configuration stuff
	var inputElements = ['input', 'select', 'textarea'];
	var autoBlurInputTypes = ['button', 'radio', 'checkbox', 'range','date'];
	var requiresJSFocus = $.os.ios; //devices which require .focus() on dynamic click events
	var verySensitiveTouch = $.os.blackberry; //devices which have a very sensitive touch and touchmove is easily fired even on simple taps
	var inputElementRequiresNativeTap = $.os.blackberry || ($.os.android && !$.os.chrome); //devices which require the touchstart event to bleed through in order to actually fire the click on select elements
	var selectElementRequiresNativeTap = $.os.blackberry || ($.os.android && !$.os.chrome); //devices which require the touchstart event to bleed through in order to actually fire the click on select elements
	var focusScrolls = $.os.ios; //devices scrolling on focus instead of resizing
	var focusResizes = $.os.blackberry10;
	var requirePanning = $.os.ios; //devices which require panning feature
	var addressBarError = 0.97; //max 3% error in position
	var maxHideTries = 2; //HideAdressBar does not retry more than 2 times (3 overall)
	var skipTouchEnd=false; //Fix iOS bug with alerts/confirms
	function getTime(){
		var d = new Date();
		var n = d.getTime();
		return n;
	}
	var touchLayer = function(el) {
			this.clearTouchVars();
			el.addEventListener('touchstart', this, false);
			el.addEventListener('touchmove', this, false);
			el.addEventListener('touchend', this, false);
			el.addEventListener('click', this, false);
			el.addEventListener("focusin",this,false);
			document.addEventListener('scroll', this, false);
			window.addEventListener("resize", this, false);
			window.addEventListener("orientationchange", this, false);
			this.layer = el;
			//proxies
			this.scrollEndedProxy_ = $.proxy(this.scrollEnded, this);
			this.exitEditProxy_ = $.proxy(this.exitExit, this, []);
			this.launchFixUIProxy_ = $.proxy(this.launchFixUI, this);
			var that = this;
			this.scrollTimeoutExpireProxy_ = function() {
				that.scrollTimeout_ = null;
				that.scrollTimeoutEl_.addEventListener('scroll', that.scrollEndedProxy_, false);
			};
			this.retestAndFixUIProxy_ = function() {
				if(jq.os.android) that.layer.style.height = '100%';
				$.asap(that.testAndFixUI, that, arguments);
			};
			//iPhone double clicks workaround
			document.addEventListener('click', function(e) {
				if(e.clientX!==undefined&&that.lastTouchStartX!=null)
				{
					if(2>Math.abs(that.lastTouchStartX-e.clientX)&&2>Math.abs(that.lastTouchStartY-e.clientY)){
						e.preventDefault();
						e.stopPropagation();
					}
				}
			}, true);
			//js scrollers self binding
			$.bind(this, 'scrollstart', function(el) {
				that.isScrolling=true;
				that.scrollingEl_=el;
				that.fireEvent('UIEvents', 'scrollstart', el, false, false);
			});
			$.bind(this, 'scrollend', function(el) {
				that.isScrolling=false;

				that.fireEvent('UIEvents', 'scrollend', el, false, false);
			});
			//fix layer positioning
			this.launchFixUI(5); //try a lot to set page into place
		}

	touchLayer.prototype = {
		dX: 0,
		dY: 0,
		cX: 0,
		cY: 0,
		touchStartX:null,
		touchStartY:null,
		//elements
		layer: null,
		scrollingEl_: null,
		scrollTimeoutEl_: null,
		//handles / proxies
		scrollTimeout_: null,
		reshapeTimeout_: null,
		scrollEndedProxy_: null,
		exitEditProxy_: null,
		launchFixUIProxy_: null,
		reHideAddressBarTimeout_: null,
		retestAndFixUIProxy_: null,
		//options
		panElementId: "header",
		//public locks
		blockClicks: false,
		//private locks
		allowDocumentScroll_: false,
		ignoreNextResize_: false,
		blockPossibleClick_: false,
		//status vars
		isScrolling: false,
		isScrollingVertical_: false,
		wasPanning_: false,
		isPanning_: false,
		isFocused_: false,
		justBlurred_: false,
		requiresNativeTap: false,
		holdingReshapeType_: null,

		handleEvent: function(e) {
			switch(e.type) {
			case 'touchstart':
				this.onTouchStart(e);
				break;
			case 'touchmove':
				this.onTouchMove(e);
				break;
			case 'touchend':
				this.onTouchEnd(e);
				break;
			case 'click':
				this.onClick(e);
				break;
			case 'blur':
				this.onBlur(e);
				break;
			case 'scroll':
				this.onScroll(e);
				break;
			case 'orientationchange':
				this.onOrientationChange(e);
				break;
			case 'resize':
				this.onResize(e);
				break;
			case 'focusin':
				this.onFocusIn(e);
				break;
			}
		},
		launchFixUI: function(maxTries) {
			//this.log("launchFixUI");
			if(!maxTries) maxTries = maxHideTries;
			if(this.reHideAddressBarTimeout_ == null) return this.testAndFixUI(0, maxTries);
		},
		resetFixUI: function() {
			//this.log("resetFixUI");
			if(this.reHideAddressBarTimeout_) clearTimeout(this.reHideAddressBarTimeout_);
			this.reHideAddressBarTimeout_ = null;
		},
		testAndFixUI: function(retry, maxTries) {
			//this.log("testAndFixUI");
			//for ios or if the heights are incompatible (and not close)
			var refH = this.getReferenceHeight();
			var curH = this.getCurrentHeight();
			if((refH != curH && !(curH * addressBarError < refH && refH * addressBarError < curH))) {
				//panic! page is out of place!
				this.hideAddressBar(retry, maxTries);
				return true;
			}
			if(jq.os.android) this.resetFixUI();
			return false;
		},
		hideAddressBar: function(retry, maxTries) {
			if(retry >= maxTries) {
				this.resetFixUI();
				return; //avoid a possible loop
			}

			//this.log("hiding address bar");
			if(jq.os.desktop || jq.os.chrome) {
				this.layer.style.height = "100%";
			} else if(jq.os.android) {
				//on some phones its immediate
				window.scrollTo(1, 1);
				this.layer.style.height = this.isFocused_ ? (window.innerHeight) + "px" : (window.outerHeight / window.devicePixelRatio) + 'px';
				//sometimes android devices are stubborn
				that = this;
				//re-test in a bit (some androids (SII, Nexus S, etc) fail to resize on first try)
				var nextTry = retry + 1;
				this.reHideAddressBarTimeout_ = setTimeout(this.retestAndFixUIProxy_, 250 * nextTry, [nextTry, maxTries]); //each fix is progressibily longer (slower phones fix)
			} else if(!this.isFocused_) {
				document.documentElement.style.height = "5000px";
				window.scrollTo(0, 0);
				document.documentElement.style.height = window.innerHeight + "px";
				this.layer.style.height = window.innerHeight + "px";
			}
		},
		getReferenceHeight: function() {
			//the height the page should be at
			if(jq.os.android) {
				return Math.ceil(window.outerHeight / window.devicePixelRatio);
			} else return window.innerHeight;
		},
		getCurrentHeight: function() {
			//the height the page really is at
			if(jq.os.android) {
				return window.innerHeight;
			} else return numOnly(document.documentElement.style.height); //TODO: works well on iPhone, test BB
		},
		onOrientationChange: function(e) {
			//this.log("orientationchange");
			//if a resize already happened, fire the orientationchange
			if(!this.holdingReshapeType_ && this.reshapeTimeout_) {
				this.fireReshapeEvent('orientationchange');
			} else this.previewReshapeEvent('orientationchange');
		},
		onResize: function(e) {
			//avoid infinite loop on iPhone
			if(this.ignoreNextResize_) {
				//this.log('ignored resize');
				this.ignoreNextResize_ = false;
				return;
			}
			//this.logInfo('resize');
			if(this.launchFixUI()) {
				this.reshapeAction();
			}
		},
		onClick: function(e) {
			//handle forms
			var tag = e.target && e.target.tagName != undefined ? e.target.tagName.toLowerCase() : '';

			//this.log("click on "+tag);
			if(inputElements.indexOf(tag) !== -1 && (!this.isFocused_ || !e.target==(this.focusedElement))) {
				var type = e.target && e.target.type != undefined ? e.target.type.toLowerCase() : '';
				var autoBlur = autoBlurInputTypes.indexOf(type) !== -1;

				//focus
				if(!autoBlur) {
					//remove previous blur event if this keeps focus
					if(this.isFocused_) {
						this.focusedElement.removeEventListener('blur', this, false);
					}
					this.focusedElement = e.target;
					this.focusedElement.addEventListener('blur', this, false);
					//android bug workaround for UI
					if(!this.isFocused_ && !this.justBlurred_) {
						//this.log("enter edit mode");
						$.trigger(this, 'enter-edit', [e.target]);
						//fire / preview reshape event
						if($.os.ios) {
							var that = this;
							setTimeout(function() {
								that.fireReshapeEvent('enter-edit');
							}, 300); //TODO: get accurate reading from window scrolling motion and get rid of timeout
						} else this.previewReshapeEvent('enter-edit');
					}
					this.isFocused_ = true;
				} else {
					this.isFocused_ = false;
				}
				this.justBlurred_ = false;
				this.allowDocumentScroll_ = true;

				//fire focus action
				if(requiresJSFocus) {
					e.target.focus();
				}

				//BB10 needs to be preventDefault on touchstart and thus need manual blur on click
			} else if($.os.blackberry10 && this.isFocused_) {
				//this.log("forcing blur on bb10 ");
				this.focusedElement.blur();
			}
		},
		previewReshapeEvent: function(ev) {
			//a reshape event of this type should fire within the next 750 ms, otherwise fire it yourself
			that = this;
			this.reshapeTimeout_ = setTimeout(function() {
				that.fireReshapeEvent(ev);
				that.reshapeTimeout_ = null;
				that.holdingReshapeType_ = null;
			}, 750);
			this.holdingReshapeType_ = ev;
		},
		fireReshapeEvent: function(ev) {
			//this.log(ev?ev+'-reshape':'unknown-reshape');
			$.trigger(this, 'reshape'); //trigger a general reshape notice
			$.trigger(this, ev ? ev + '-reshape' : 'unknown-reshape'); //trigger the specific reshape
		},
		reshapeAction: function() {
			if(this.reshapeTimeout_) {
				//we have a specific reshape event waiting for a reshapeAction, fire it now
				clearTimeout(this.reshapeTimeout_);
				this.fireReshapeEvent(this.holdingReshapeType_);
				this.holdingReshapeType_ = null;
				this.reshapeTimeout_ = null;
			} else this.previewReshapeEvent();
		},
		onFocusIn:function(e){
			if(!this.isFocused_)
				this.onClick(e);
		},
		onBlur: function(e) {
			if(jq.os.android && e.target == window) return; //ignore window blurs
	
			this.isFocused_ = false;
			//just in case...
			if(this.focusedElement) this.focusedElement.removeEventListener('blur', this, false);
			this.focusedElement = null;
			//make sure this blur is not followed by another focus
			this.justBlurred_ = true;
			$.asap(this.exitEditProxy_, this, [e.target]);
		},
		exitExit: function(el) {
			this.justBlurred_ = false;
			if(!this.isFocused_) {
				//this.log("exit edit mode");
				$.trigger(this, 'exit-edit', [el]);
				//do not allow scroll anymore
				this.allowDocumentScroll_ = false;
				//fire / preview reshape event
				if($.os.ios) {
					var that = this;
					setTimeout(function() {
						that.fireReshapeEvent('exit-edit');
					}, 300); //TODO: get accurate reading from window scrolling motion and get rid of timeout
				} else this.previewReshapeEvent('exit-edit');
			}
		},
		onScroll: function(e) {
			//this.log("document scroll detected "+document.body.scrollTop);
			if(!this.allowDocumentScroll_ && !this.isPanning_ && e.target==(document)) {
				this.allowDocumentScroll_ = true;
				if(this.wasPanning_) {
					this.wasPanning_ = false;
					//give it a couple of seconds
					setTimeout(this.launchFixUIProxy_, 2000, [maxHideTries]);
				} else {
					//this.log("scroll forced page into place");
					this.launchFixUI();
				}
			}
		},

		onTouchStart: function(e) {
			//setup initial touch position
			this.dX = e.touches[0].pageX;
			this.dY = e.touches[0].pageY;
			this.lastTimestamp = e.timeStamp;
			this.lastTouchStartX=this.lastTouchStartY=null;


			//check dom if necessary
			if(requirePanning || $.feat.nativeTouchScroll) this.checkDOMTree(e.target, this.layer);
			//scrollend check
			if(this.isScrolling) {
				//remove prev timeout
				if(this.scrollTimeout_ != null) {
					clearTimeout(this.scrollTimeout_);
					this.scrollTimeout_ = null;
					//different element, trigger scrollend anyway
					if(this.scrollTimeoutEl_ != this.scrollingEl_) this.scrollEnded(false);
					else this.blockPossibleClick_ = true;
					//check if event was already set
				} else if(this.scrollTimeoutEl_) {
					//trigger 
					this.scrollEnded(true);
					this.blockPossibleClick_ = true;
				}

			}


			// We allow forcing native tap in android devices (required in special cases)
			var forceNativeTap = (jq.os.android && e && e.target && e.target.getAttribute && e.target.getAttribute("data-touchlayer") == "ignore");

			//if on edit mode, allow all native touches 
			//(BB10 must still be prevented, always clicks even after move)
			if(forceNativeTap || (this.isFocused_ && !$.os.blackberry10)) {
				this.requiresNativeTap = true;
				this.allowDocumentScroll_ = true;

				//some stupid phones require a native tap in order for the native input elements to work
			} else if(inputElementRequiresNativeTap && e.target && e.target.tagName != undefined) {
				var tag = e.target.tagName.toLowerCase();
				if(inputElements.indexOf(tag) !== -1) {
					//notify scrollers (android forms bug), except for selects
					if(tag != 'select') $.trigger(this, 'pre-enter-edit', [e.target]);
					this.requiresNativeTap = true;
				}
			}
			else if(e.target&&e.target.tagName!==undefined&&e.target.tagName.toLowerCase()=="input"&&e.target.type=="range"){
                this.requiresNativeTap=true;
            }

			//prevent default if possible
			if(!this.isPanning_ && !this.requiresNativeTap) {
                if((this.isScrolling && !$.feat.nativeTouchScroll)||(!this.isScrolling))
					e.preventDefault();
				//demand vertical scroll (don't let it pan the page)
			} else if(this.isScrollingVertical_) {
				this.demandVerticalScroll();
			}
		},
		demandVerticalScroll: function() {
			//if at top or bottom adjust scroll
			var atTop = this.scrollingEl_.scrollTop <= 0;
			if(atTop) {
				//this.log("adjusting scrollTop to 1");
				this.scrollingEl_.scrollTop = 1;
			} else {
				var scrollHeight = this.scrollingEl_.scrollTop + this.scrollingEl_.clientHeight;
				var atBottom = scrollHeight >= this.scrollingEl_.scrollHeight;
				if(atBottom) {
					//this.log("adjusting scrollTop to max-1");
					this.scrollingEl_.scrollTop = this.scrollingEl_.scrollHeight - this.scrollingEl_.clientHeight - 1;
				}
			}
		},
		//set rules here to ignore scrolling check on these elements
		//consider forcing user to use scroller object to assess these... might be causing bugs
		ignoreScrolling: function(el) {
			if(el['scrollWidth'] === undefined || el['clientWidth'] === undefined) return true;
			if(el['scrollHeight'] === undefined || el['clientHeight'] === undefined) return true;
			return false;
		},

		allowsVerticalScroll: function(el, styles) {
			var overflowY = styles.overflowY;
			if(overflowY == 'scroll') return true;
			if(overflowY == 'auto' && el['scrollHeight'] > el['clientHeight']) return true;
			return false;
		},
		allowsHorizontalScroll: function(el, styles) {
			var overflowX = styles.overflowX;
			if(overflowX == 'scroll') return true;
			if(overflowX == 'auto' && el['scrollWidth'] > el['clientWidth']) return true;
			return false;
		},


		//check if pan or native scroll is possible
		checkDOMTree: function(el, parentTarget) {

			//check panning
			//temporarily disabled for android - click vs panning issues
			if(requirePanning && this.panElementId == el.id) {
				this.isPanning_ = true;
				return;
			}
			//check native scroll
			if($.feat.nativeTouchScroll) {

				//prevent errors
				if(this.ignoreScrolling(el)) {
					return;
				}

				//check if vertical or hor scroll are allowed
				var styles = window.getComputedStyle(el);
				if(this.allowsVerticalScroll(el, styles)) {
					this.isScrollingVertical_ = true;
					this.scrollingEl_ = el;
					this.isScrolling = true;
					return;
				} else if(this.allowsHorizontalScroll(el, styles)) {
					this.isScrollingVertical_ = false;
					this.scrollingEl_ = null;
					this.isScrolling = true;
				}

			}
			//check recursive up to top element
			var isTarget = el==(parentTarget);
			if(!isTarget && el.parentNode) this.checkDOMTree(el.parentNode, parentTarget);
		},
		//scroll finish detectors
		scrollEnded: function(e) {
			//this.log("scrollEnded");
			if(e) this.scrollTimeoutEl_.removeEventListener('scroll', this.scrollEndedProxy_, false);
			this.fireEvent('UIEvents', 'scrollend', this.scrollTimeoutEl_, false, false);
			this.scrollTimeoutEl_ = null;
		},


		onTouchMove: function(e) {
			//set it as moved
			var wasMoving = this.moved;
			this.moved = true;
			//very sensitive devices check
			if(verySensitiveTouch) {
				this.cY = e.touches[0].pageY - this.dY;
				this.cX = e.touches[0].pageX - this.dX;
			}
			//panning check
			if(this.isPanning_) {
				return;
			}
			//native scroll (for scrollend)
			if(this.isScrolling) {

				if(!wasMoving) {
					//this.log("scrollstart");
					this.fireEvent('UIEvents', 'scrollstart', this.scrollingEl_, false, false);
				}
				//if(this.isScrollingVertical_) {
					this.speedY = (this.lastY - e.touches[0].pageY) / (e.timeStamp - this.lastTimestamp);
					this.lastY = e.touches[0].pageY;
					this.lastX = e.touches[0].pageX;
					this.lastTimestamp = e.timeStamp;
				//}
			}
			//non-native scroll devices

			if((!$.os.blackberry10 && !this.requiresNativeTap)) {
				//legacy stuff for old browsers
				if(!this.isScrolling ||!$.feat.nativeTouchScroll)
					e.preventDefault();
				return;
			}
		},

		onTouchEnd: function(e) {
			if($.os.ios){
				if(skipTouchEnd==e.changedTouches[0].identifier){
					e.preventDefault();
					return false;
				}
				skipTouchEnd=e.changedTouches[0].identifier;
			}
			//double check moved for sensitive devices
			var itMoved = this.moved;
			if(verySensitiveTouch) {
				itMoved = itMoved && !(Math.abs(this.cX) < 10 && Math.abs(this.cY) < 10);
			}

			//don't allow document scroll unless a specific click demands it further ahead
			if(!jq.os.ios || !this.requiresNativeTap) this.allowDocumentScroll_ = false;

			//panning action
			if(this.isPanning_ && itMoved) {
				//wait 2 secs and cancel
				this.wasPanning_ = true;

				//a generated click
			} else if(!itMoved && !this.requiresNativeTap) {

				//NOTE: on android if touchstart is not preventDefault(), click will fire even if touchend is prevented
				//this is one of the reasons why scrolling and panning can not be nice and native like on iPhone
				e.preventDefault();

				//fire click
				if(!this.blockClicks && !this.blockPossibleClick_) {
					var theTarget = e.target;
					if(theTarget.nodeType == 3) theTarget = theTarget.parentNode;
					this.fireEvent('Event', 'click', theTarget, true, e.mouseToTouch,e.changedTouches[0]);
					this.lastTouchStartX=this.dX;
					this.lastTouchStartY=this.dY;
				}

			} else if(itMoved) {
				//setup scrollend stuff
				if(this.isScrolling) {
					this.scrollTimeoutEl_ = this.scrollingEl_;
					if(Math.abs(this.speedY) < 0.01) {
						//fire scrollend immediatly
						//this.log(" scrollend immediately "+this.speedY);
						this.scrollEnded(false);
					} else {
						//wait for scroll event
						//this.log($.debug.since()+" setting scroll timeout "+this.speedY);
						this.scrollTimeout_ = setTimeout(this.scrollTimeoutExpireProxy_, 30)
					}
				}
				//trigger cancel-enter-edit on inputs
				if(this.requiresNativeTap) {
					if(!this.isFocused_) $.trigger(this, 'cancel-enter-edit', [e.target]);
				}
			}
			this.clearTouchVars();
		},

		clearTouchVars: function() {
			//this.log("clearing touchVars");
			this.speedY = this.lastY = this.cY = this.cX = this.dX = this.dY = 0;
			this.moved = false;
			this.isPanning_ = false;
			this.isScrolling = false;
			this.isScrollingVertical_ = false;
			this.requiresNativeTap = false;
			this.blockPossibleClick_ = false;
		},

		fireEvent: function(eventType, eventName, target, bubbles, mouseToTouch,data) {
			//this.log("Firing event "+eventName);
			//create the event and set the options
			var theEvent = document.createEvent(eventType);
			theEvent.initEvent(eventName, bubbles, true);
			theEvent.target = target;
            if(data){
                $.each(data,function(key,val){
                    theEvent[key]=val;
                });
            }
			//jq.DesktopBrowsers flag
			if(mouseToTouch) theEvent.mouseToTouch = true;
			target.dispatchEvent(theEvent);
		}
	};

})();
 /**
 * jq.ui - A User Interface library for creating jqMobi applications
 *
 * @copyright 2011
 * @author AppMobi
 */
(function($) {
    
    
    var hasLaunched = false;
    var startPath = window.location.pathname;
    var defaultHash = window.location.hash;
    var previousTarget = defaultHash;
    var ui = function() {
        // Init the page
        var that = this;

        //setup the menu and boot touchLayer
        jq(document).ready(function() {

            //boot touchLayer
            //create jQUi element if it still does not exist
            var jQUi = document.getElementById("jQUi");
            if (jQUi == null) {
                jQUi = document.createElement("div");
                jQUi.id = "jQUi";
                var body = document.body;
                while (body.firstChild) {
                    jQUi.appendChild(body.firstChild);
                }
                jq(document.body).prepend(jQUi);
            }
            if (jq.os.supportsTouch)
                $.touchLayer(jQUi);
        });
        
        if (window.AppMobi)
            document.addEventListener("appMobi.device.ready", function() {
                that.autoBoot();
                this.removeEventListener("appMobi.device.ready", arguments.callee);
            }, false);
        else if (document.readyState == "complete" || document.readyState == "loaded") {
            this.autoBoot();
        } else
            document.addEventListener("DOMContentLoaded", function() {
                that.autoBoot();
                this.removeEventListener("DOMContentLoaded", arguments.callee);
            }, false);
        
        if (!window.AppMobi)
            AppMobi = {}, AppMobi.webRoot = "";

        //click back event
         window.addEventListener("popstate", function() {
            
            var id = $.ui.getPanelId(document.location.hash);
            //make sure we allow hash changes outside jqUi
            if(id==""&&$.ui.history.length===1) //Fix going back to first panel and an empty hash
                id="#"+$.ui.firstDiv.id;
            if(id=="")
                return;
            if(document.querySelectorAll(id+".panel").length===0)
                return;
            if (id != "#" + $.ui.activeDiv.id)
                that.goBack();
        }, false);
        /**
         * Helper function to setup the transition objects
         * Custom transitions can be added via $.ui.availableTransitions
           ```
           $.ui.availableTransitions['none']=function();
           ```
         */
        
        this.availableTransitions = {};
        this.availableTransitions['default'] = this.availableTransitions['none'] = this.noTransition;
    };
    
    
    ui.prototype = {
        showLoading: true,
        loadContentQueue: [],
        isAppMobi: false,
        titlebar: "",
        navbar: "",
        header: "",
        viewportContainer: "",
        backButton: "",
        remotePages: {},
        history: [],
        homeDiv: "",
        screenWidth: "",
        content: "",
        modalWindow: "",
        customFooter: false,
        defaultFooter: "",
        defaultHeader: null,
        customMenu: false,
        defaultMenu: "",
        _readyFunc: null,
        doingTransition: false,
        passwordBox: jq.passwordBox ? new jq.passwordBox() : false,
        selectBox: jq.selectBox ? jq.selectBox : false,
        ajaxUrl: "",
        transitionType: "slide",
        scrollingDivs: [],
        firstDiv: "",
        hasLaunched: false,
        launchCompleted: false,
        activeDiv: "",
        customClickHandler: "",
        activeDiv: "",
        menuAnimation: null,
        togglingSideMenu: false,
        autoBoot: function() {
            this.hasLaunched = true;
            if (this.autoLaunch) {
                this.launch();
            }
        },
        css3animate: function(el, opts) {
            el = jq(el);
            return el.css3Animate(opts);
        },

        /**
         * this is a boolean when set to true (default) it will load that panel when the app is started
           ```
           $.ui.loadDefaultHash=false; //Never load the page from the hash when the app is started
           $.ui.loadDefaultHash=true; //Default
           ```
         *@title $.ui.loadDefaultHash
         */
        loadDefaultHash: true,
        /**
         * This is a boolean that when set to true will add "&cache=_rand_" to any ajax loaded link
           ```
           $.ui.useAjaxCacheBuster=true;
           ```
          *@title $.ui.useAjaxCacheBuster
          */
        useAjaxCacheBuster: false,
        /**
         * This is a shorthand call to the jq.actionsheet plugin.  We wire it to the jQUi div automatically
           ```
           $.ui.actionsheet("<a href='javascript:;' class='button'>Settings</a> <a href='javascript:;' class='button red'>Logout</a>")
           $.ui.actionsheet("[{
                        text: 'back',
                        cssClasses: 'red',
                        handler: function () { $.ui.goBack(); ; }
                    }, {
                        text: 'show alert 5',
                        cssClasses: 'blue',
                        handler: function () { alert("hi"); }
                    }, {
                        text: 'show alert 6',
                        cssClasses: '',
                        handler: function () { alert("goodbye"); }
                    }]");
           ```
         * @param {String,Array} links
         * @title $.ui.actionsheet()
         */
        actionsheet: function(opts) {
            return jq("#jQUi").actionsheet(opts);
        },
        /**
         * This is a wrapper to jq.popup.js plugin.  If you pass in a text string, it acts like an alert box and just gives a message
           ```
           $.ui.popup(opts);
           $.ui.popup( {
                        title:"Alert! Alert!",
                        message:"This is a test of the emergency alert system!! Don't PANIC!",
                        cancelText:"Cancel me", 
                        cancelCallback: function(){console.log("cancelled");},
                        doneText:"I'm done!",
                        doneCallback: function(){console.log("Done for!");},
                        cancelOnly:false
                      });
           $.ui.popup('Hi there');
           ```
         * @param {Object|String} options
         * @title $.ui.popup(opts)
         */
        popup: function(opts) {
            return $("#jQUi").popup(opts);
        },

        /**
         *This will throw up a mask and block the UI
         ```
         $.ui.blockUI(.9)
         ````
         * @param {Float} opacity
         * @title $.ui.blockUI(opacity)
         */
        blockUI: function(opacity) {
            $.blockUI(opacity);
        },
        /**
         *This will remove the UI mask
         ```
         $.ui.unblockUI()
         ````
         * @title $.ui.unblockUI()
         */
        unblockUI: function() {
            $.unblockUI();
        },
        /**
         * Will remove the bottom nav bar menu from your application
           ```
           $.ui.removeFooterMenu();
           ```
         * @title $.ui.removeFooterMenu
         */
        removeFooterMenu: function() {
            jq("#navbar").hide();
            jq("#content").css("bottom", "0px");
            this.showNavMenu = false;
        },
        /**
         * Boolean if you want to show the bottom nav menu.
           ```
           $.ui.showNavMenu = false;
           ```
         * @title $.ui.showNavMenu
         */
        showNavMenu: true,
        /**
         * Boolean if you want to auto launch jqUi
           ```
           $.ui.autoLaunch = false; //
         * @title $.ui.autoLaunch
         */
        autoLaunch: true,
        /**
         * Boolean if you want to show the back button
           ```
           $.ui.showBackButton = false; //
         * @title $.ui.showBackButton
         */
        showBackbutton: true,
        /**
         * @api private
         */
        backButtonText: "",
        /**
         * Boolean if you want to reset the scroller position when navigating panels.  Default is true
           ```
           $.ui.resetScrollers=false; //Do not reset the scrollers when switching panels
           ```
         * @title $.ui.resetScrollers
         */
        resetScrollers: true,
        /**
         * function to fire when jqUi is ready and completed launch
           ```
           $.ui.ready(function(){console.log('jqUi is ready');});
           ```
         * @param {Function} function to execute
         * @title $.ui.ready
         */
        ready: function(param) {
            if (this.launchCompleted)
                param();
            else
                document.addEventListener("jq.ui.ready", function(e) {
                    param();
                    this.removeEventListener('jq.ui.ready', arguments.callee);
                }, false);
        },
        /**
         * Override the back button class name
           ```
           $.ui.setBackButtonStyle('newClass');
           ```
         * @param {String} new class name
         * @title $.ui.setBackButtonStyle(class)
         */
        setBackButtonStyle: function(className) {
            jq("#backButton").get(0).className = className;
        },
        /**
         * Initiate a back transition
           ```
           $.ui.goBack()
           ```
           
         * @title $.ui.goBack()
         */
        goBack: function() {
            if (this.history.length > 0) {
                var that = this;
                var tmpEl = this.history.pop();
                //$.asap(
                
                //function() {
                    that.loadContent(tmpEl.target + "", 0, 1, tmpEl.transition);
                    that.transitionType = tmpEl.transition;
                    //document.location.hash=tmpEl.target;
                    that.updateHash(tmpEl.target);
                //for Android 4.0.x, we must touchLayer.hideAdressBar()
            //    });
            }
        },
        /**
         * Clear the history queue
           ```
           $.ui.clearHistory()
           ```
           
         * @title $.ui.clearHistory()
         */
        clearHistory: function() {
            this.history = [];
            this.setBackButtonVisibility(false)
        },

        /**
         * PushHistory
           ```
           $.ui.pushHistory(previousPage, newPage, transition, hashExtras)
           ```
           
         * @title $.ui.pushHistory()
         */
        pushHistory: function(previousPage, newPage, transition, hashExtras) {
            //push into local history
            this.history.push({
                target: previousPage,
                transition: transition
            });
            //push into the browser history
            try {
                window.history.pushState(newPage, newPage, startPath + '#' + newPage + hashExtras);
                $(window).trigger("hashchange", {
                    newUrl: startPath + '#' + newPage + hashExtras,
                    oldURL: startPath + previousPage
                });
            } catch (e) {
            }
        },


        /**
         * Updates the current window hash
         *
         * @param {String} newHash New Hash value
         * @title $.ui.updateHash(newHash)
         */
        updateHash: function(newHash) {
            newHash = newHash.indexOf('#') == -1 ? '#' + newHash : newHash; //force having the # in the begginning as a standard
            previousTarget = newHash;
            
            var previousHash = window.location.hash;
            var panelName = this.getPanelId(newHash).substring(1); //remove the #
            try {
                window.history.replaceState(panelName, panelName, startPath + newHash);
                $(window).trigger("hashchange", {
                    newUrl: startPath + newHash,
                    oldUrl: startPath + previousHash
                });
            } catch (e) {
            }
        },
        /*gets the panel name from an hash*/
        getPanelId: function(hash) {
            var firstSlash = hash.indexOf('/');
            return firstSlash == -1 ? hash : hash.substring(0, firstSlash);
        },

        /**
         * Update a badge on the selected target.  Position can be
            bl = bottom left
            tl = top left
            br = bottom right
            tr = top right (default)
           ```
           $.ui.updateBadge('#mydiv','3','bl','green');
           ```
         * @param {String} target
         * @param {String} Value
         * @param {String} [position]         
         * @param {String|Object} [color or CSS hash]         
         * @title $.ui.updateBadge(target,value,[position],[color])
         */
        updateBadge: function(target, value, position, color) {
            if (position === undefined)
                position = "";
            if (target[0] != "#")
                target = "#" + target;
            var badge = jq(target).find("span.jq-badge");
            
            if (badge.length == 0) {
                if (jq(target).css("position") != "absolute")
                    jq(target).css("position", "relative");
                badge = jq("<span class='jq-badge " + position + "'>" + value + "</span>");
                jq(target).append(badge);
            } else
                badge.html(value);
            
            
            if (jq.isObject(color)) {
                badge.css(color);
            } else if (color) {
                badge.css("background", color);
            }
            
            badge.data("ignore-pressed", "true");
        
        },
        /**
         * Removes a badge from the selected target.
           ```
           $.ui.removeBadge('#mydiv');
           ```
         * @param {String} target
         * @title $.ui.removeBadge(target)
         */
        removeBadge: function(target) {
            jq(target).find("span.jq-badge").remove();
        },
        /**
         * Toggles the bottom nav nav menu.  Force is a boolean to force show or hide.
           ```
           $.ui.toggleNavMenu();//toggle it
           $.ui.toggleNavMenu(true); //force show it
           ```
         * @param {Boolean} [force]
         * @title $.ui.toggleNavMenu([force])
         */
        toggleNavMenu: function(force) {
            if (!jq.ui.showNavMenu)
                return;
            if (jq("#navbar").css("display") != "none" && ((force !== undefined && force !== true) || force === undefined)) {
                jq("#content").css("bottom", "0px");
                jq("#navbar").hide();
            } else if (force === undefined || (force !== undefined && force === true)) {
                jq("#navbar").show();
                jq("#content").css("bottom", jq("#navbar").css("height"));
            
            }
        },
        /**
         * Toggles the top header menu.
           ```
           $.ui.toggleHeaderMenu();//toggle it
           ```
         * @param {Boolean} [force]
         * @title $.ui.toggleHeaderMenu([force])
         */
        toggleHeaderMenu: function(force) {
            if (jq("#header").css("display") != "none" && ((force !== undefined && force !== true) || force === undefined)) {
                jq("#content").css("top", "0px");
                jq("#header").hide();
            } else if (force === undefined || (force !== undefined && force === true)) {
                jq("#header").show();
                var val = numOnly(jq("#header").css("height"));
                jq("#content").css("top", val + 'px');
            }
        },
        /**
         * Toggles the side menu.  Force is a boolean to force show or hide.
           ```
           $.ui.toggleSideMenu();//toggle it
           ```
         * @param {Boolean} [force]
         * @title $.ui.toggleSideMenu([force])
         */
        toggleSideMenu: function(force, callback) {
            if (!this.isSideMenuEnabled() || this.togglingSideMenu)
                return;
            this.togglingSideMenu = true;
            
            var that = this;
            var menu = jq("#menu");
            var els = jq("#content, #menu, #header, #navbar");
            
            if (!(menu.hasClass("on") || menu.hasClass("to-on")) && ((force !== undefined && force !== false) || force === undefined)) {
                
                menu.show();
                that.css3animate(els, {
                    "removeClass": "to-off off on",
                    "addClass": "to-on",
                    complete: function(canceled) {
                        if (!canceled) {
                            that.css3animate(els, {
                                "removeClass": "to-off off to-on",
                                "addClass": "on",
                                time: 0,
                                complete: function() {
                                    that.togglingSideMenu = false;
                                    if (callback)
                                        callback(false);
                                }
                            });
                        } else {
                            that.togglingSideMenu = false;
                            if (callback)
                                callback(true);
                        }
                    }
                });
            
            } else if (force === undefined || (force !== undefined && force === false)) {
                
                
                that.css3animate(els, {
                    "removeClass": "on off to-on",
                    "addClass": "to-off",
                    complete: function(canceled) {
                        if (!canceled) {
                            that.css3animate(els, {
                                "removeClass": "to-off on to-on",
                                "addClass": "off",
                                time: 0,
                                complete: function() {
                                    menu.hide();
                                    that.togglingSideMenu = false;
                                    if (callback)
                                        callback(false);
                                }
                            });
                        } else {
                            that.togglingSideMenu = false;
                            if (callback)
                                callback(true);
                        }
                    }
                });
            }
        },
        /**
         * Disables the side menu
           ```
           $.ui.disableSideMenu();
           ```
        * @title $.ui.disableSideMenu();
        */
        disableSideMenu: function() {
            var that = this;
            var els = jq("#content, #menu, #header, #navbar");
            if (this.isSideMenuOn()) {
                this.toggleSideMenu(false, function(canceled) {
                    if (!canceled)
                        els.removeClass("hasMenu");
                });
            } else
                els.removeClass("hasMenu");
        },
        /**
         * Enables the side menu
           ```
           $.ui.enableSideMenu();
           ```
        * @title $.ui.enableSideMenu();
        */
        enableSideMenu: function() {
            var that = this;
            var els = jq("#content, #menu, #header, #navbar");
            els.addClass("hasMenu");
        },
        isSideMenuEnabled: function() {
            return jq("#content").hasClass("hasMenu");
        },
        isSideMenuOn: function() {
            var menu = jq('#menu');
            return this.isSideMenuEnabled() && (menu.hasClass("on") || menu.hasClass("to-on"));
        },

        /**
         * Updates the elements in the navbar
           ```
           $.ui.updateNavbarElements(elements);
           ```
         * @param {String|Object} Elements
         * @title $.ui.updateNavbarElements(Elements)
         */
        updateNavbarElements: function(elems) {
            var nb = jq("#navbar");
            if (elems === undefined || elems == null)
                return;
            if (typeof (elems) == "string")
                return nb.html(elems, true), null;
            nb.html("");
            for (var i = 0; i < elems.length; i++) {
                var node = elems[i].cloneNode(true);
                nb.append(node);
            }
            var tmpAnchors = jq("#navbar a");
            if (tmpAnchors.length > 0)
                tmpAnchors.data("ignore-pressed", "true").data("resetHistory", "true");
        },
        /**
         * Updates the elements in the header
           ```
           $.ui.updateHeaderElements(elements);
           ```
         * @param {String|Object} Elements
         * @title $.ui.updateHeaderElement(Elements)
         */
        updateHeaderElements: function(elems) {
            var nb = jq("#header");
            if (elems === undefined || elems == null)
                return;
            if (typeof (elems) == "string")
                return nb.html(elems, true), null;
            nb.html("");
            for (var i = 0; i < elems.length; i++) {
                var node = elems[i].cloneNode(true);
                nb.append(node);
            }
        },
        /**
         * Updates the elements in the side menu
           ```
           $.ui.updateSideMenu(elements);
           ```
         * @param {String|Object} Elements
         * @title $.ui.updateSideMenu(Elements)
         */
        updateSideMenu: function(elems) {
            var that = this;
            
            var nb = jq("#menu_scroller");
            
            if (elems === undefined || elems == null)
                return;
            if (typeof (elems) == "string") {
                nb.html(elems, true)
            } 
            else {
                nb.html('');
                var close = document.createElement("a");
                close.className = "closebutton jqMenuClose";
                close.href = "javascript:;"
                close.onclick = function() {
                    that.toggleSideMenu(false);
                };
                nb.append(close);
                var tmp = document.createElement("div");
                tmp.className = "jqMenuHeader";
                tmp.innerHTML = "Menu";
                nb.append(tmp);
                for (var i = 0; i < elems.length; i++) {
                    var node = elems[i].cloneNode(true);
                    nb.append(node);
                }
            }
            //Move the scroller to the top and hide it
            this.scrollingDivs['menu_scroller'].hideScrollbars();
            this.scrollingDivs['menu_scroller'].scrollToTop();
        },
        /**
         * Set the title of the current panel
           ```
           $.ui.setTitle("new title");
           ```
           
         * @param {String} value
         * @title $.ui.setTitle(value)
         */
        setTitle: function(val) {
            jq("#header #pageTitle").html(val);
        },
        /**
         * Override the text for the back button
           ```
           $.ui.setBackButtonText("GO...");
           ```
           
         * @param {String} value
         * @title $.ui.setBackButtonText(value)
         */
        setBackButtonText: function(text) {
            if (this.backButtonText.length > 0)
                jq("#header #backButton").html(this.backButtonText);
            else
                jq("#header #backButton").html(text);
        },
        /**
         * Toggle visibility of the back button
         */
        setBackButtonVisibility: function(show) {
            if (!show)
                jq("#header #backButton").css("visibility", "hidden");
            else
                jq("#header #backButton").css("visibility", "visible");
        },
        /**
         * Show the loading mask
           ```
           $.ui.showMask()
           $.ui.showMask(;Doing work')
           ```
           
         * @param {String} [text]
         * @title $.ui.showMask(text);
         */
        showMask: function(text) {
            if (!text)
                text = "Loading Content";
            jq("#jQui_mask>h1").html(text);
            jq("#jQui_mask").show()
        },
        /**
         * Hide the loading mask
         * @title $.ui.hideMask();
         */
        hideMask: function() {
            jq("#jQui_mask").hide()
        },
        /**
         * Load a content panel in a modal window.  We set the innerHTML so event binding will not work.
           ```
           $.ui.showModal("#myDiv");
           ```
         * @param {String|Object} panel to show
         * @title $.ui.showModal();
         */
        showModal: function(id) {
            var that = this;
            id="#"+id.replace("#","");
            try {
                if (jq(id)) {
                    jq("#modalContainer").html($.feat.nativeTouchScroll ? jq(id).html() : jq(id).get(0).childNodes[0].innerHTML + '', true);
                    jq('#modalContainer').append("<a href='javascript:;' onclick='$.ui.hideModal();' class='closebutton modalbutton'></a>");
                    this.modalWindow.style.display = "block";
                    
                    button = null;
                    content = null;
                    this.scrollingDivs['modal_container'].enable(that.resetScrollers);
                    this.scrollToTop('modal');
                     jq("#modalContainer").data("panel",id);
                }
            } catch (e) {
                console.log("Error with modal - " + e, this.modalWindow);
            }
        },
        /**
         * Hide the modal window and remove the content
           ```
           $.ui.hideModal("#myDiv");
           ```
         * @title $.ui.hideModal();
         */
        hideModal: function() {
            $("#modalContainer").html("", true);
            jq("#jQui_modal").hide()
            
            this.scrollingDivs['modal_container'].disable();

            var tmp=$($("#modalContainer").data("panel"));
            var fnc = tmp.data("unload");
            if (typeof fnc == "string" && window[fnc]) {
                window[fnc](tmp.get(0));
            }
            tmp.trigger("unloadpanel");

        },

        /**
         * Update the HTML in a content panel
           ```
           $.ui.updateContentDiv("#myDiv","This is the new content");
           ```
         * @param {String,Object} panel
         * @param {String} html to update with
         * @title $.ui.updateContentDiv(id,content);
         */
        updateContentDiv: function(id, content) {
            id="#"+id.replace("#","");
            var el = jq(id).get(0);
            if (!el)
                return;
            
            var newDiv = document.createElement("div");
            newDiv.innerHTML = content;
            if ($(newDiv).children('.panel') && $(newDiv).children('.panel').length > 0)
                newDiv = $(newDiv).children('.panel').get();
            
            
            
            if (el.getAttribute("js-scrolling") && el.getAttribute("js-scrolling").toLowerCase() == "yes") {
                $.cleanUpContent(el.childNodes[0], false, true);
                el.childNodes[0].innerHTML = content;
            } else {
                $.cleanUpContent(el, false, true);
                el.innerHTML = content;
            }
            if ($(newDiv).title)
                el.title = $(newDiv).title;
        },
        /**
         * Dynamically create a new panel on the fly.  It wires events, creates the scroller, applies Android fixes, etc.
           ```
           $.ui.addContentDiv("myDiv","This is the new content","Title");
           ```
         * @param {String|Object} Element to add
         * @param {String} Content
         * @param {String} title
         * @title $.ui.addContentDiv(id,content,title);
         */
        addContentDiv: function(el, content, title, refresh, refreshFunc) {
            el = typeof (el) !== "string" ? el : el.indexOf("#") == -1 ? "#" + el : el;
            var myEl = jq(el).get(0);
            if (!myEl) {
                var newDiv = document.createElement("div");
                newDiv.innerHTML = content;
                if ($(newDiv).children('.panel') && $(newDiv).children('.panel').length > 0)
                    newDiv = $(newDiv).children('.panel').get();
                
                if (!newDiv.title && title)
                    newDiv.title = title;
                var newId = (newDiv.id) ? newDiv.id : el.replace("#",""); //figure out the new id - either the id from the loaded div.panel or the crc32 hash
                newDiv.id = newId;
                if (newDiv.id != el)
                    newDiv.setAttribute("data-crc", el.replace("#",""));
            } else {
                newDiv = myEl;
            }
            newDiv.className = "panel";
            newId=newDiv.id;
            this.addDivAndScroll(newDiv, refresh, refreshFunc);
            myEl = null;
            newDiv = null;
            return newId;
        },
        /**
         *  Takes a div and sets up scrolling for it..
           ```
           $.ui.addDivAndScroll(object);
           ```
         * @param {Object} Element
         * @title $.ui.addDivAndScroll(element);
         * @api private
         */
        addDivAndScroll: function(tmp, refreshPull, refreshFunc, container) {
            var jsScroll = false;
            var overflowStyle = tmp.style.overflow;
            var hasScroll = overflowStyle != 'hidden' && overflowStyle != 'visible';
            
            container = container || this.content;
            //sets up scroll when required and not supported
            if (!$.feat.nativeTouchScroll && hasScroll)
                tmp.setAttribute("js-scrolling", "yes");
            
            if (tmp.getAttribute("js-scrolling") && tmp.getAttribute("js-scrolling").toLowerCase() == "yes") {
                jsScroll = true;
                hasScroll = true;
            }
            
            
            
            if (tmp.getAttribute("scrolling") && tmp.getAttribute("scrolling") == "no") {
                hasScroll = false;
                jsScroll = false;
                tmp.removeAttribute("js-scrolling");
            }
            
            if (!jsScroll) {
                container.appendChild(tmp);
                var scrollEl = tmp;
                tmp.style['-webkit-overflow-scrolling'] = "none"
            } else {
                //WE need to clone the div so we keep events
                var scrollEl = tmp.cloneNode(false);
                
                
                tmp.title = null;
                tmp.id = null;
                tmp.removeAttribute("data-footer");
                tmp.removeAttribute("data-nav");
                tmp.removeAttribute("data-header");
                tmp.removeAttribute("selected");
                tmp.removeAttribute("data-load");
                tmp.removeAttribute("data-unload");
                tmp.removeAttribute("data-tab");
                jq(tmp).replaceClass("panel", "jqmScrollPanel");
                
                scrollEl.appendChild(tmp);
                
                container.appendChild(scrollEl);
                
                if (this.selectBox !== false)
                    this.selectBox.getOldSelects(scrollEl.id);
                if (this.passwordBox !== false)
                    this.passwordBox.getOldPasswords(scrollEl.id);
            
            }
            
            if (hasScroll) {
                this.scrollingDivs[scrollEl.id] = (jq(tmp).scroller({
                    scrollBars: true,
                    verticalScroll: true,
                    horizontalScroll: false,
                    vScrollCSS: "jqmScrollbar",
                    refresh: refreshPull,
                    useJsScroll: jsScroll,
                    noParent: !jsScroll,
                    autoEnable: false //dont enable the events unnecessarilly
                }));
                //backwards compatibility
                if (refreshFunc)
                    $.bind(this.scrollingDivs[scrollEl.id], 'refresh-release', function(trigger) {
                        if (trigger)
                            refreshFunc()
                    });
            }
            
            tmp = null;
            scrollEl = null;
        },

        /**
         *  Scrolls a panel to the top
           ```
           $.ui.scrollToTop(id);
           ```
         * @param {String} id without hash
         * @title $.ui.scrollToTop(id);
         */
        scrollToTop: function(id) {
            if (this.scrollingDivs[id]) {
                this.scrollingDivs[id].scrollToTop("300ms");
            }
        },
        scrollToBottom: function(id) {
            if (this.scrollingDivs[id]) {
                this.scrollingDivs[id].scrollToBottom("300ms");
            }
        },

        /**
         *  This is used when a transition fires to do helper events.  We check to see if we need to change the nav menus, footer, and fire
         * the load/onload functions for panels
           ```
           $.ui.parsePanelFunctions(currentDiv,oldDiv);
           ```
         * @param {Object} current div
         * @param {Object} old div
         * @title $.ui.parsePanelFunctions(currentDiv,oldDiv);
         * @api private
         */
        parsePanelFunctions: function(what, oldDiv) {
            //check for custom footer
            var that = this;
            var hasFooter = what.getAttribute("data-footer");
            var hasHeader = what.getAttribute("data-header");

            //$asap removed since animations are fixed in css3animate
            if (hasFooter && hasFooter.toLowerCase() == "none") {
                that.toggleNavMenu(false);
            } else {
                that.toggleNavMenu(true);
            }
            if (hasFooter && that.customFooter != hasFooter) {
                that.customFooter = hasFooter;
                that.updateNavbarElements(jq("#" + hasFooter).children());
            } else if (hasFooter != that.customFooter) {
                if (that.customFooter)
                    that.updateNavbarElements(that.defaultFooter);
                that.customFooter = false;
            }
            if (hasHeader && hasHeader.toLowerCase() == "none") {
                that.toggleHeaderMenu(false);
            } else {
                that.toggleHeaderMenu(true);
            }

            if (hasHeader && that.customHeader != hasHeader) {
                that.customHeader = hasHeader;
                that.updateHeaderElements(jq("#" + hasHeader).children());
            } else if (hasHeader != that.customHeader) {
                if (that.customHeader) {
                    that.updateHeaderElements(that.defaultHeader);
                    that.setTitle(that.activeDiv.title);
                }
                that.customHeader = false;
            }
            if (what.getAttribute("data-tab")) { //Allow the dev to force the footer menu
                jq("#navbar a").removeClass("selected");
                jq("#" + what.getAttribute("data-tab")).addClass("selected");
            }

            //Load inline footers
            var inlineFooters = $(what).find("footer");
            if (inlineFooters.length > 0) {
                that.customFooter = what.id;
                that.updateNavbarElements(inlineFooters.children());
            }
            //load inline headers
            var inlineHeader = $(what).find("header");
            
            
            if (inlineHeader.length > 0) {
                that.customHeader = what.id;
                that.updateHeaderElements(inlineHeader.children());
            }
            //check if the panel has a footer
            if (what.getAttribute("data-tab")) { //Allow the dev to force the footer menu
                jq("#navbar a").removeClass("selected");
                jq("#navbar #" + what.getAttribute("data-tab")).addClass("selected");
            }
            
            var hasMenu = what.getAttribute("data-nav");
            if (hasMenu && this.customMenu != hasMenu) {
                this.customMenu = hasMenu;
                this.updateSideMenu(jq("#" + hasMenu).children());
            } else if (hasMenu != this.customMenu) {
                if (this.customMenu) {
                    this.updateSideMenu(this.defaultMenu);
                }
                this.customMenu = false;
            }
            
            
            
            if (oldDiv) {
                fnc = oldDiv.getAttribute("data-unload");
                if (typeof fnc == "string" && window[fnc]) {
                    window[fnc](oldDiv);
                }
                $(oldDiv).trigger("unloadpanel");
            }
            var fnc = what.getAttribute("data-load");
            if (typeof fnc == "string" && window[fnc]) {
                window[fnc](what);
            }
            $(what).trigger("loadpanel");
            if (this.isSideMenuOn()) {
                this.toggleSideMenu(false);
            }
        },
        /**
         * Helper function that parses a contents html for any script tags and either adds them or executes the code
         * @api private
         */
        parseScriptTags: function(div) {
            if (!div)
                return;
            $.parseJS(div);
        },
        /**
         * This is called to initiate a transition or load content via ajax.
         * We can pass in a hash+id or URL and then we parse the panel for additional functions
           ```
           $.ui.loadContent("#main",false,false,"up");
           ```
         * @param {String} target
         * @param {Boolean} newtab (resets history)
         * @param {Boolean} go back (initiate the back click)
         * @param {String} transition
         * @title $.ui.loadContent(target,newTab,goBack,transition);
         * @api public
         */
        loadContent: function(target, newTab, back, transition, anchor) {
            
            if (this.doingTransition) {
                var that = this;
                this.loadContentQueue.push([target, newTab, back, transition, anchor]);
                return
            }
            if (target.length === 0)
                return;
            
            what = null;
            var that = this;
            var loadAjax = true;
            anchor = anchor || document.createElement("a"); //Hack to allow passing in no anchor
            if (target.indexOf("#") == -1) {
                var urlHash = "url" + crc32(target); //Ajax urls
                var crcCheck = jq("div.panel[data-crc='" + urlHash + "']");
                if (jq("#" + target).length > 0) {
                    loadAjax = false;
                } 
                else if (crcCheck.length > 0) {
                    loadAjax = false;
                    if (anchor.getAttribute("data-refresh-ajax") === 'true' || (anchor.refresh && anchor.refresh === true || this.isAjaxApp)) {
                        loadAjax = true;
                    }
                    else {
                        target = "#" + crcCheck.get(0).id;
                    }
                } else if (jq("#" + urlHash).length > 0) {

                    //ajax div already exists.  Let's see if we should be refreshing it.
                    loadAjax = false;
                    if (anchor.getAttribute("data-refresh-ajax") === 'true' || (anchor.refresh && anchor.refresh === true || this.isAjaxApp)) {
                        loadAjax = true;
                    } else
                        target = "#" + urlHash;
                }
            }
            if (target.indexOf("#") == -1 && loadAjax) {
                this.loadAjax(target, newTab, back, transition, anchor);
            } else {
                this.loadDiv(target, newTab, back, transition);
            }
        },
        /**
         * This is called internally by loadContent.  Here we are loading a div instead of an Ajax link
           ```
           $.ui.loadDiv("#main",false,false,"up");
           ```
         * @param {String} target
         * @param {Boolean} newtab (resets history)
         * @param {Boolean} go back (initiate the back click)
         * @param {String} transition
         * @title $.ui.loadDiv(target,newTab,goBack,transition);
         * @api private
         */
        loadDiv: function(target, newTab, back, transition) {
            // load a div
            var that=this;
            what = target.replace("#", "");
            
            var slashIndex = what.indexOf('/');
            var hashLink = "";
            if (slashIndex != -1) {
                // Ignore everything after the slash for loading
                hashLink = what.substr(slashIndex);
                what = what.substr(0, slashIndex);
            }
            
            what = jq("#" + what).get(0);
            
            if (!what)
                return console.log ("Target: " + target + " was not found");
            if (what == this.activeDiv && !back) {
                //toggle the menu if applicable
                if (this.isSideMenuOn())
                    this.toggleSideMenu(false);
                return;
            }
            this.transitionType = transition;
            var oldDiv = this.activeDiv;
            var currWhat = what;
            
            if (what.getAttribute("data-modal") == "true" || what.getAttribute("modal") == "true") {
                var fnc = what.getAttribute("data-load");
                if (typeof fnc == "string" && window[fnc]) {
                    window[fnc](what);
                }
                $(what).trigger("loadpanel");
                return this.showModal(what.id);
            }
                        
            
          
            
            if (oldDiv == currWhat) //prevent it from going to itself
                return;
            
            if (newTab) {
                this.clearHistory();
                this.pushHistory("#" + this.firstDiv.id, what.id, transition, hashLink);
            } else if (!back) {
                this.pushHistory(previousTarget, what.id, transition, hashLink);
            }
            
            
            previousTarget = '#' + what.id + hashLink;
            
            
            this.doingTransition = true;

            oldDiv.style.display="block";
            currWhat.style.display="block";
            
            this.runTransition(transition, oldDiv, currWhat, back);              
            
            
            //Let's check if it has a function to run to update the data
            this.parsePanelFunctions(what, oldDiv);
            //Need to call after parsePanelFunctions, since new headers can override
            this.loadContentData(what, newTab, back, transition);
            var that=this;
            setTimeout(function(){
                if(that.scrollingDivs[oldDiv.id]) {
                    that.scrollingDivs[oldDiv.id].disable();
                }
            },200);
        
        },
        /**
         * This is called internally by loadDiv.  This sets up the back button in the header and scroller for the panel
           ```
           $.ui.loadContentData("#main",false,false,"up");
           ```
         * @param {String} target
         * @param {Boolean} newtab (resets history)
         * @param {Boolean} go back (initiate the back click)
         * @param {String} transition
         * @title $.ui.loadDiv(target,newTab,goBack,transition);
         * @api private
         */
        loadContentData: function(what, newTab, back, transition) {
            if (back) {
                if (this.history.length > 0) {
                    var val = this.history[this.history.length - 1];
                    var slashIndex = val.target.indexOf('/');
                    if (slashIndex != -1) {
                        var prevId = val.target.substr(0, slashIndex);
                    } else
                        var prevId = val.target;
                    var el = jq(prevId).get(0);
                    //make sure panel is there
                    if (el)
                        this.setBackButtonText(el.title);
                    else
                        this.setBackButtonText("Back");
                }
            } else if (this.activeDiv.title)
                this.setBackButtonText(this.activeDiv.title)
            else
                this.setBackButtonText("Back");
            if (what.title) {
                this.setTitle(what.title);
            }
            if (newTab) {
                this.setBackButtonText(this.firstDiv.title)
            }
            
            if (this.history.length == 0) {
                this.setBackButtonVisibility(false);
                this.history = [];
            } else if (this.showBackbutton)
                this.setBackButtonVisibility(true);
            this.activeDiv = what;
            if (this.scrollingDivs[this.activeDiv.id]) {
                this.scrollingDivs[this.activeDiv.id].enable(this.resetScrollers);
            }
        },
        /**
         * This is called internally by loadContent.  Here we are using Ajax to fetch the data
           ```
           $.ui.loadDiv("page.html",false,false,"up");
           ```
         * @param {String} target
         * @param {Boolean} newtab (resets history)
         * @param {Boolean} go back (initiate the back click)
         * @param {String} transition
         * @title $.ui.loadDiv(target,newTab,goBack,transition);
         * @api private
         */
        loadAjax: function(target, newTab, back, transition, anchor) {
            // XML Request
            if (this.activeDiv.id == "jQui_ajax" && target == this.ajaxUrl)
                return;
            var urlHash = "url" + crc32(target); //Ajax urls
            var that = this;
            if (target.indexOf("http") == -1)
                target = AppMobi.webRoot + target;
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    this.doingTransition = false;
                    
                    var doReturn = false;

                    //Here we check to see if we are retaining the div, if so update it
                    if (jq("#" + urlHash).length > 0) {
                        that.updateContentDiv(urlHash, xmlhttp.responseText);
                        jq("#" + urlHash).get(0).title = anchor.title ? anchor.title : target;
                    } else if (anchor.getAttribute("data-persist-ajax") || that.isAjaxApp) {
                        
                        var refresh = (anchor.getAttribute("data-pull-scroller") === 'true') ? true : false;
                        refreshFunction = refresh ? 
                        function() {
                            anchor.refresh = true;
                            that.loadContent(target, newTab, back, transition, anchor);
                            anchor.refresh = false;
                        } : null;
                        //that.addContentDiv(urlHash, xmlhttp.responseText, refresh, refreshFunction);
                        urlHash = that.addContentDiv(urlHash, xmlhttp.responseText, anchor.title ? anchor.title : target, refresh, refreshFunction);
                    } else {
                        that.updateContentDiv("jQui_ajax", xmlhttp.responseText);
                        jq("#jQui_ajax").get(0).title = anchor.title ? anchor.title : target;
                        that.loadContent("#jQui_ajax", newTab, back);
                        doReturn = true;
                    }
                    //Let's load the content now.
                    //We need to check for any script tags and handle them
                    var div = document.createElement("div");
                    div.innerHTML = xmlhttp.responseText;
                    that.parseScriptTags(div);

                    if (doReturn)
                    {
                         if (that.showLoading)
                            that.hideMask();
                        return;
                    }
                    
                    that.loadContent("#" + urlHash);
                    if (that.showLoading)
                       that.hideMask();
                    return null;
                }
            };
            ajaxUrl = target;
            var newtarget = this.useAjaxCacheBuster ? target + (target.split('?')[1] ? '&' : '?') + "cache=" + Math.random() * 10000000000000000 : target;
            xmlhttp.open("GET", newtarget, true);
            xmlhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xmlhttp.send();
            // show Ajax Mask
            if (this.showLoading)
                this.showMask();
        },
        /**
         * This executes the transition for the panel
            ```
            $.ui.runTransition(transition,oldDiv,currDiv,back)
            ```
         * @api private
         * @title $.ui.runTransition(transition,oldDiv,currDiv,back)
         */
        runTransition: function(transition, oldDiv, currWhat, back) {
            if (!this.availableTransitions[transition])
                transition = 'default';
            this.availableTransitions[transition].call(this, oldDiv, currWhat, back);
        },

        /**
         * This is callled when you want to launch jqUi.  If autoLaunch is set to true, it gets called on DOMContentLoaded.
         * If autoLaunch is set to false, you can manually invoke it.
           ```
           $.ui.autoLaunch=false;
           $.ui.launch();
           ```
         * @title $.ui.launch();
         */
        launch: function() {
            
            if (this.hasLaunched == false || this.launchCompleted) {
                this.hasLaunched = true;
                return;
            }
            
            var that = this;
            this.isAppMobi = (window.AppMobi && typeof (AppMobi) == "object" && AppMobi.app !== undefined) ? true : false;
            this.viewportContainer = jq("#jQUi");
            this.navbar = jq("#navbar").get(0);
            this.content = jq("#content").get(0);
            ;
            this.header = jq("#header").get(0);
            ;
            this.menu = jq("#menu").get(0);
            ;
            //set anchor click handler for UI
            this.viewportContainer[0].addEventListener('click', function(e) {
                var theTarget = e.target;
                checkAnchorClick(e, theTarget);
            }, false);


            //enter-edit scroll paddings fix
            //focus scroll adjust fix
            var enterEditEl = null;
            //on enter-edit keep a reference of the actioned element
            $.bind($.touchLayer, 'enter-edit', function(el) {
                enterEditEl = el;
            });
            //enter-edit-reshape panel padding and scroll adjust
            $.bind($.touchLayer, 'enter-edit-reshape', function() {
                //onReshape UI fixes
                //check if focused element is within active panel
                var jQel = $(enterEditEl);
                var jQactive = jQel.closest(that.activeDiv);
                if (jQactive && jQactive.size() > 0) {
                    if ($.os.ios || $.os.chrome) {
                        var paddingTop, paddingBottom;
                        if (document.body.scrollTop) {
                            paddingTop = document.body.scrollTop - jQactive.offset().top;
                        } else {
                            paddingTop = 0;
                        }
                        //not exact, can be a little above the actual value
                        //but we haven't found an accurate way to measure it and this is the best so far
                        paddingBottom = jQactive.offset().bottom - jQel.offset().bottom;
                        that.scrollingDivs[that.activeDiv.id].setPaddings(paddingTop, paddingBottom);
                    
                    } else if ($.os.android || $.os.blackberry) {
                        var elPos = jQel.offset();
                        var containerPos = jQactive.offset();
                        if (elPos.bottom > containerPos.bottom && elPos.height < containerPos.height) {
                            //apply fix
                            that.scrollingDivs[that.activeDiv.id].scrollToItem(jQel, 'bottom');
                        }
                    }
                }
            });
            if ($.os.ios) {
                $.bind($.touchLayer, 'exit-edit-reshape', function() {
                    that.scrollingDivs[that.activeDiv.id].setPaddings(0, 0);
                });
            }

            //elements setup
            if (!this.navbar) {
                this.navbar = document.createElement("div");
                this.navbar.id = "navbar";
                this.navbar.style.cssText = "display:none";
                this.viewportContainer.append(this.navbar);
            }
            if (!this.header) {
                this.header = document.createElement("div");
                this.header.id = "header";
                this.viewportContainer.prepend(this.header);
            }
            if (!this.menu) {
                this.menu = document.createElement("div");
                this.menu.id = "menu";
                //this.menu.style.overflow = "hidden";
                this.menu.innerHTML = '<div id="menu_scroller"></div>';
                this.viewportContainer.append(this.menu);
                this.menu.style.overflow = "hidden";
                this.scrollingDivs["menu_scroller"] = jq("#menu_scroller").scroller({
                    scrollBars: true,
                    verticalScroll: true,
                    vScrollCSS: "jqmScrollbar",
                    useJsScroll: !$.feat.nativeTouchScroll,
                    noParent: $.feat.nativeTouchScroll
                });
                if ($.feat.nativeTouchScroll)
                    $("#menu_scroller").css("height", "100%");
            }
            
            if (!this.content) {
                this.content = document.createElement("div");
                this.content.id = "content";
                this.viewportContainer.append(this.content);
            }

            //insert backbutton (should optionally be left to developer..)
            this.header.innerHTML = '<a id="backButton"  href="javascript:;"></a> <h1 id="pageTitle"></h1>' + header.innerHTML;
            this.backButton = $("#header #backButton").get(0);
            this.backButton.className = "button";
            jq(document).on("click", "#header #backButton", function() {
                that.goBack();
            });
            this.backButton.style.visibility = "hidden";

            //page title (should optionally be left to developer..)
            this.titleBar = $("#header #pageTitle").get(0);

            //setup ajax mask
            this.addContentDiv("jQui_ajax", "");
            var maskDiv = document.createElement("div");
            maskDiv.id = "jQui_mask";
            maskDiv.className = "ui-loader";
            maskDiv.innerHTML = "<span class='ui-icon ui-icon-loading spin'></span><h1>Loading Content</h1>";
            maskDiv.style.zIndex = 20000;
            maskDiv.style.display = "none";
            document.body.appendChild(maskDiv);
            //setup modalDiv
            var modalDiv = document.createElement("div");
            modalDiv.id = "jQui_modal";
            this.viewportContainer.prepend(modalDiv);
            modalDiv.appendChild(jq("<div id='modalContainer'></div>").get());
            this.scrollingDivs['modal_container'] = jq("#modalContainer").scroller({
                scrollBars: true,
                vertical: true,
                vScrollCSS: "jqmScrollbar",
                noParent: true
            });
            
            this.modalWindow = modalDiv;
            //get first div, defer
            var defer = {};
            var contentDivs = this.viewportContainer.get().querySelectorAll(".panel");
            for (var i = 0; i < contentDivs.length; i++) {
                var el = contentDivs[i];
                var tmp = el;
                var id;
                var prevSibling=el.previousSibling;
                if (el.parentNode && el.parentNode.id != "content") {

                    el.parentNode.removeChild(el);
                    id = el.id;
                    if (tmp.getAttribute("selected"))
                        this.firstDiv = jq("#" + id).get(0);
                    this.addDivAndScroll(tmp);
                    jq("#"+id).insertAfter(prevSibling);
                } else if (!el.parsedContent) {
                    el.parsedContent = 1;
                    el.parentNode.removeChild(el);
                    id = el.id;
                    if (tmp.getAttribute("selected"))
                        this.firstDiv = jq("#" + id).get(0);
                    this.addDivAndScroll(tmp);
                    jq("#"+id).insertAfter(prevSibling);
                }
                if (el.getAttribute("data-defer")) {
                    defer[id] = el.getAttribute("data-defer");
                }
                if (!this.firstDiv)
                    this.firstDiv = $("#" + id).get(0);
                
                el = null;
            }
            contentDivs = null;
            var loadingDefer = false;
            var toLoad = Object.keys(defer).length;
            if (toLoad > 0) {
                loadingDefer = true;
                var loaded = 0;
                for (var j in defer) {
                    (function(j) {
                        jq.ajax({
                            url: AppMobi.webRoot + defer[j],
                            success: function(data) {
                                if (data.length == 0)
                                    return;
                                $.ui.updateContentDiv(j, data);
                                that.parseScriptTags(jq(j).get());
                                loaded++;
                                if (loaded >= toLoad) {
                                    $(document).trigger("defer:loaded");
                                    loadingDefer = false;
                                
                                }
                            },
                            error: function(msg) {
                                //still trigger the file as being loaded to not block jq.ui.ready
                                console.log("Error with deferred load " + AppMobi.webRoot + defer[j])
                                loaded++;
                                if (loaded >= toLoad) {
                                    $(document).trigger("defer:loaded");
                                    loadingDefer = false;
                                }
                            }
                        });
                    })(j);
                }
            }
            if (this.firstDiv) {
                
                var that = this;
                // Fix a bug in iOS where translate3d makes the content blurry
                this.activeDiv = this.firstDiv;
                
                if (this.scrollingDivs[this.activeDiv.id]) {
                    this.scrollingDivs[this.activeDiv.id].enable();
                }

                //window.setTimeout(function() {
                var loadFirstDiv = function() {
                    
                    
                    if (jq("#navbar a").length > 0) {
                        jq("#navbar a").data("ignore-pressed", "true").data("resetHistory", "true");
                        that.defaultFooter = jq("#navbar").children().clone();
                        that.updateNavbarElements(that.defaultFooter);
                    }
                    //setup initial menu
                    var firstMenu = jq("nav").get();
                    if (firstMenu) {
                        that.defaultMenu = jq(firstMenu).children().clone();
                        that.updateSideMenu(that.defaultMenu);
                    }
                    //get default header
                    that.defaultHeader = jq("#header").children().clone();
                    //
                    jq("#navbar").on("click", "a", function(e) {
                        jq("#navbar a").not(this).removeClass("selected");
                            $(e.target).addClass("selected");
                    });


                    //go to activeDiv
                    var firstPanelId = that.getPanelId(defaultHash);
                    //that.history=[{target:'#'+that.firstDiv.id}];   //set the first id as origin of path
                    if (firstPanelId.length > 0 && that.loadDefaultHash && firstPanelId != ("#" + that.firstDiv.id)&&$(firstPanelId).length>0) {
                        that.loadContent(defaultHash, true, false, 'none'); //load the active page as a newTab with no transition
                    } else {
                        previousTarget = "#" + that.firstDiv.id;
                        that.loadContentData(that.firstDiv); //load the info off the first panel
                        that.parsePanelFunctions(that.firstDiv);
                        
                        that.firstDiv.style.display = "block";
                        $("#header #backButton").css("visibility", "hidden");
                        if (that.firstDiv.getAttribute("data-modal") == "true" || that.firstDiv.getAttribute("modal") == "true") {            
                            that.showModal(that.firstDiv.id);
                        }
                    }
                    
                    that.launchCompleted = true;
                    if (jq("nav").length > 0) {
                        jq("#jQUi #header").addClass("hasMenu off");
                        jq("#jQUi #content").addClass("hasMenu off");
                        jq("#jQUi #navbar").addClass("hasMenu off");
                    }
                    //trigger ui ready
                    jq(document).trigger("jq.ui.ready");
                    //remove splashscreen

                    // Run after the first div animation has been triggered - avoids flashing
                    jq("#splashscreen").remove();
                };
                if (loadingDefer) {
                    $(document).one("defer:loaded", loadFirstDiv);
                } else
                    loadFirstDiv();
            }
            var that = this;
            $.bind($.ui, "content-loaded", function() {
                if (that.loadContentQueue.length > 0) {
                    var tmp = that.loadContentQueue.splice(0, 1)[0];
                    that.loadContent(tmp[0], tmp[1], tmp[2], tmp[3], tmp[4]);
                }
            });
            if (window.navigator.standalone) {
                this.blockPageScroll();
            }
            this.topClickScroll();
           
        },
        /**
         * This simulates the click and scroll to top of browsers
         */
        topClickScroll:function(){
             document.getElementById("header").addEventListener("click",function(e){
                if(e.clientY<=15&&e.target.nodeName.toLowerCase()=="h1") //hack - the title spans the whole width of the header
                    $.ui.scrollingDivs[$.ui.activeDiv.id].scrollToTop("100");
            });
        
        },
        /**
         * This blocks the page from scrolling/panning.  Usefull for native apps
         */
        blockPageScroll: function() {
            jq("#jQUi #header").bind("touchmove", function(e) {
                e.preventDefault();
            });
        },
        /**
         * This is the default transition.  It simply shows the new panel and hides the old
         */
        noTransition: function(oldDiv, currDiv, back) {
            currDiv.style.display = "block";
            oldDiv.style.display = "block";
            var that = this;
            that.clearAnimations(currDiv);
            that.css3animate(oldDiv, {
                x: "0%",
                y: 0
            });
            that.finishTransition(oldDiv);
            currDiv.style.zIndex = 2;
            oldDiv.style.zIndex = 1;
        },
        /**
         * This must be called at the end of every transition to hide the old div and reset the doingTransition variable
         *
         * @param {Object} Div that transitioned out
         * @title $.ui.finishTransition(oldDiv)
         */
        finishTransition: function(oldDiv, currDiv) {
            oldDiv.style.display = 'none';
            this.doingTransition = false;
            if (currDiv)
                this.clearAnimations(currDiv);
            if (oldDiv)
                this.clearAnimations(oldDiv);
            $.trigger(this, "content-loaded");
        },

        /**
         * This must be called at the end of every transition to remove all transforms and transitions attached to the inView object (performance + native scroll)
         *
         * @param {Object} Div that transitioned out
         * @title $.ui.finishTransition(oldDiv)
         */
        clearAnimations: function(inViewDiv) {
            inViewDiv.style[$.feat.cssPrefix + 'Transform'] = "none";
            inViewDiv.style[$.feat.cssPrefix + 'Transition'] = "none";
        }

    /**
         * END
         * @api private
         */
    };


    //lookup for a clicked anchor recursively and fire UI own actions when applicable 
    var checkAnchorClick = function(e, theTarget) {
        
        
        if (theTarget == (jQUi)) {
            return;
        }

        //this technique fails when considerable content exists inside anchor, should be recursive ?
        if (theTarget.tagName.toLowerCase() != "a" && theTarget.parentNode)
            return checkAnchorClick(e, theTarget.parentNode); //let's try the parent (recursive)
        //anchors
        if (theTarget.tagName !== "undefined" && theTarget.tagName.toLowerCase() == "a") {
            
            var custom = (typeof jq.ui.customClickHandler == "function") ? jq.ui.customClickHandler : false;
            if (custom !== false) {
                if(jq.ui.customClickHandler(theTarget))
                   return e.preventDefault();
                
            }
            if (theTarget.href.toLowerCase().indexOf("javascript:") !== -1 || theTarget.getAttribute("data-ignore")) {
                return;
            }
            

            if (theTarget.href.indexOf("tel:") === 0)
                return false;

            //external links
            if (theTarget.hash.indexOf("#") === -1 && theTarget.target.length > 0) {
                if (theTarget.href.toLowerCase().indexOf("javascript:") != 0) {
                    if (jq.ui.isAppMobi) {
                        e.preventDefault();
                        AppMobi.device.launchExternal(theTarget.href);
                    } else if (!jq.os.desktop) {
                        e.target.target = "_blank";
                    }
                }
                return;
            }

            /* IE 10 fixes*/

            var href = theTarget.href,
            prefix = location.protocol + "//" + location.hostname+":"+location.port;
            if (href.indexOf(prefix) === 0) {
                href = href.substring(prefix.length+1);
            }
            //empty links
            if (href == "#" ||(href.indexOf("#")===href.length-1)|| (href.length == 0 && theTarget.hash.length == 0))
                return;

            //internal links
            e.preventDefault();
            var mytransition = theTarget.getAttribute("data-transition");
            var resetHistory = theTarget.getAttribute("data-resetHistory");
            resetHistory = resetHistory && resetHistory.toLowerCase() == "true" ? true : false;
            var href = theTarget.hash.length > 0 ? theTarget.hash : theTarget.href;
            jq.ui.loadContent(href, resetHistory, 0, mytransition, theTarget);
            return;
        }
    }
    
    var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D"; /* Number */
    var crc32 = function( /* String */str,  /* Number */crc) {
        if (crc == undefined)
            crc = 0;
        var n = 0; //a number between 0 and 255 
        var x = 0; //an hex number 
        crc = crc ^ (-1);
        for (var i = 0, iTop = str.length; i < iTop; i++) {
            n = (crc ^ str.charCodeAt(i)) & 0xFF;
            x = "0x" + table.substr(n * 9, 8);
            crc = (crc >>> 8) ^ x;
        }
        return crc ^ (-1);
    };
    
    
    $.ui = new ui;

})(jq);



//The following functions are utilitiy functions for jqUi within appMobi.

(function() {
    $(document).one("appMobi.device.ready", function() { //in AppMobi, we need to undo the height stuff since it causes issues.
        setTimeout(function() {
            document.getElementById('jQUi').style.height = "100%";
            document.body.style.height = "100%";
            document.documentElement.style.minHeight = window.innerHeight;
        }, 300);
        $.ui.ready(function(){
            $.ui.blockPageScroll();
        })
    });
})();
(function($ui){
    
        function fadeTransition (oldDiv, currDiv, back) {
            oldDiv.style.display = "block";
            currDiv.style.display = "block";
            var that = this
            if (back) {
                currDiv.style.zIndex = 1;
                oldDiv.style.zIndex = 2;
                that.clearAnimations(currDiv);
                that.css3animate(oldDiv, {
                    x: "0%",
                    time: "150ms",
                    opacity: .1,
                    complete: function(canceled) {
                        if(canceled) {
                            that.finishTransition(oldDiv, currDiv);
                            return;
                        }
                        
                        that.css3animate(oldDiv, {
                            x: "-100%",
                            opacity: 1,
                            complete: function() {
                                that.finishTransition(oldDiv);
                            }
                        
                        });
                        currDiv.style.zIndex = 2;
                        oldDiv.style.zIndex = 1;
                    }
                });
            } else {
                oldDiv.style.zIndex = 1;
                currDiv.style.zIndex = 2;
                currDiv.style.opacity = 0;
                that.css3animate(currDiv, {
                    x: "0%",
                    opacity: .1,
                    complete: function() {
                        that.css3animate(currDiv, {
                            x: "0%",
                            time: "150ms",
                            opacity: 1,
                            complete:function(canceled){
                                if(canceled) {
                                    that.finishTransition(oldDiv, currDiv);
                                    return;
                                }
                                
                                that.clearAnimations(currDiv);
                                that.css3animate(oldDiv, {
                                    x: "-100%",
                                    y: 0,
                                    complete: function() {
                                        that.finishTransition(oldDiv);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
        $ui.availableTransitions.fade = fadeTransition;
})($.ui);
(function($ui){
    
        function flipTransition (oldDiv, currDiv, back) {
             oldDiv.style.display = "block";
            currDiv.style.display = "block";
            var that = this
            if (back) {
                that.css3animate(currDiv, {
                    x: "100%",
                    scale: .8,
                    rotateY: "180deg",
                    complete: function() {
                        that.css3animate(currDiv, {
                            x: "0%",
                            scale: 1,
                            time: "150ms",
                            rotateY: "0deg",
                            complete: function(){
                                that.clearAnimations(currDiv);
                            }
                        });
                    }
                });
                that.css3animate(oldDiv, {
                    x: "100%",
                    time: "150ms",
                    scale: .8,
                    rotateY: "180deg",
                    complete: function() {
                        that.css3animate(oldDiv, {
                            x: "-100%",
                            opacity: 1,
                            scale: 1,
                            rotateY: "0deg",
                            complete: function() {
                                that.finishTransition(oldDiv);
                            }
                        });
                        currDiv.style.zIndex = 2;
                        oldDiv.style.zIndex = 1;
                    }
                });
            } else {
                oldDiv.style.zIndex = 1;
                currDiv.style.zIndex = 2;
                that.css3animate(oldDiv, {
                    x: "100%",
                    time: "150ms",
                    scale: .8,
                    rotateY: "180deg",
                    complete: function() {
                        that.css3animate(oldDiv, {
                            x: "-100%",
                            y: 0,
                            time: "1ms",
                            scale: 1,
                            rotateY: "0deg",
                            complete: function() {
                                that.finishTransition(oldDiv);
                            }
                        });
                    }
                });
                that.css3animate(currDiv, {
                    x: "100%",
                    time: "1ms",
                    scale: .8,
                    rotateY: "180deg",
                    complete: function() {
                        that.css3animate(currDiv, {
                            x: "0%",
                            time: "150ms",
                            scale: 1,
                            rotateY: "0deg",
                            complete:function(){
                                that.clearAnimations(currDiv);
                            }
                        });
                    }
                });
            }
        }
        $ui.availableTransitions.flip = flipTransition;
})($.ui);
(function($ui){
        
         function popTransition(oldDiv, currDiv, back) {
            oldDiv.style.display = "block";
            currDiv.style.display = "block";
            var that = this
            if (back) {
                currDiv.style.zIndex = 1;
                oldDiv.style.zIndex = 2;
                that.clearAnimations(currDiv);
                that.css3animate(oldDiv, {
                    x: "0%",
                    time: "150ms",
                    opacity: .1,
                    scale: .2,
                    origin: "-50%"+" 50%",
                    complete: function(canceled) {
                        if(canceled) {
                            that.finishTransition(oldDiv);
                            return;
                        }
                        
                        that.css3animate(oldDiv, {
                            x: "-100%",
                            complete: function() {
                                that.finishTransition(oldDiv);
                            }
                        });
                        currDiv.style.zIndex = 2;
                        oldDiv.style.zIndex = 1;
                    }
                });
            } else {
                oldDiv.style.zIndex = 1;
                currDiv.style.zIndex = 2;
                that.css3animate(currDiv, {
                    x: "0%",
                    y: "0%",
                    scale: .2,
                    origin: "-50%"+" 50%",
                    opacity: .1,
                    complete: function() {
                        that.css3animate(currDiv, {
                            x: "0%",
                            time: "150ms",
                            scale: 1,
                            opacity: 1,
                            origin: "0%"+" 0%",
                            complete: function(canceled){
                                if(canceled) {
                                    that.finishTransition(oldDiv, currDiv);
                                    return;
                                }
                                
                                that.clearAnimations(currDiv);
                                that.css3animate(oldDiv, {
                                    x: "100%",
                                    y: 0,
                                    complete: function() {
                                        that.finishTransition(oldDiv);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
        $ui.availableTransitions.pop = popTransition;
})($.ui);
(function($ui){
    
        /**
         * Initiate a sliding transition.  This is a sample to show how transitions are implemented.  These are registered in $ui.availableTransitions and take in three parameters.
         * @param {Object} previous panel
         * @param {Object} current panel
         * @param {Boolean} go back
         * @title $ui.slideTransition(previousPanel,currentPanel,goBack);
         */
        function slideTransition(oldDiv, currDiv, back) {
          	oldDiv.style.display = "block";
            currDiv.style.display = "block";
            var that = this;
            if (back) {
                that.css3animate(oldDiv, {
					x:"0%",
					y:"0%",
					complete:function(){
		                that.css3animate(oldDiv, {
		                    x: "100%",
		                    time: "150ms",
		                    complete: function() {
		                        that.finishTransition(oldDiv, currDiv);
		                    }
		                }).link(currDiv, {
	                        x: "0%",
	                        time: "150ms"
	                    });
					}
				}).link(currDiv, {
					x:"-100%",
					y:"0%"
				});
            } else {
                that.css3animate(oldDiv, {
					x:"0%",
					y:"0%",
					complete:function(){
		                that.css3animate(oldDiv, {
		                    x: "-100%",
		                    time: "150ms",
		                    complete: function() {
		                        that.finishTransition(oldDiv, currDiv);
		                    }
		                }).link(currDiv, {
	                        x: "0%",
	                        time: "150ms"
	                    });
					}
				}).link(currDiv, {
					x:"100%",
					y:"0%"
				});
            }
        }
        $ui.availableTransitions.slide = slideTransition;
        $ui.availableTransitions['default'] = slideTransition;
})($.ui);
(function($ui){
    
        function slideDownTransition (oldDiv, currDiv, back) {
            oldDiv.style.display = "block";
            currDiv.style.display = "block";
            var that = this
            if (back) {
                currDiv.style.zIndex = 1;
                oldDiv.style.zIndex = 2;
                that.clearAnimations(currDiv);
                that.css3animate(oldDiv, {
                    y: "-100%",
                    x: "0%",
                    time: "150ms",
                    complete: function(canceled) {
                        if(canceled) {
                            that.finishTransition(oldDiv, currDiv);
                            return;
                        }
                        
                        that.css3animate(oldDiv, {
                            x: "-100%",
                            y: 0,
                            complete: function() {
                                that.finishTransition(oldDiv);
                            
                            }
                        });
                        currDiv.style.zIndex = 2;
                        oldDiv.style.zIndex = 1;
                    }
                });
            } else {
                oldDiv.style.zIndex = 1;
                currDiv.style.zIndex = 2;
                that.css3animate(currDiv, {
                    y: "-100%",
                    x: "0%",
                    complete: function() {
                        that.css3animate(currDiv, {
                            y: "0%",
                            x: "0%",
                            time: "150ms",
                            complete: function(canceled){
                                if(canceled) {
                                    that.finishTransition(oldDiv, currDiv);
                                    return;
                                }
                                
                                that.clearAnimations(currDiv);
                                that.css3animate(oldDiv, {
                                    x: "-100%",
                                    y: 0,
                                    complete: function() {
                                        that.finishTransition(oldDiv);
                                    }
                                });
                                
                            }
                        });
                    }
                });
            }
        }
        $ui.availableTransitions.down = slideDownTransition;
})($.ui);

(function($ui){
    
        function slideUpTransition(oldDiv, currDiv, back) {
             oldDiv.style.display = "block";
            currDiv.style.display = "block";
            var that = this;
            if (back) {
                currDiv.style.zIndex = 1;
                oldDiv.style.zIndex = 2;
                
                that.clearAnimations(currDiv);

                that.css3animate(oldDiv, {
                    y: "100%",
                    x: "0%",
                    time: "150ms",
                    complete: function() {
                        that.finishTransition(oldDiv);
                        currDiv.style.zIndex = 2;
                        oldDiv.style.zIndex = 1;
                    }
                });
            } else {
                currDiv.style.zIndex = 2;
                oldDiv.style.zIndex = 1;
                that.css3animate(currDiv, {
                    y: "100%",
                    x: "0%",
                    complete: function() {
                        that.css3animate(currDiv, {
                            y: "0%",
                            x: "0%",
                            time: "150ms",
                            complete: function(canceled) {
                                if(canceled) {
                                    that.finishTransition(oldDiv, currDiv);
                                    return;
                                }
                                
                                that.clearAnimations(currDiv);
                                that.css3animate(oldDiv, {
                                    x: "-100%",
                                    y: 0,
                                    complete: function() {
                                        that.finishTransition(oldDiv);
                                    }
                                });
                                
                            }
                        });
                    }
                });
            }
        }
        $ui.availableTransitions.up = slideUpTransition;
})($.ui);


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
  el : "#content",

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
  el : "#content",

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
  el: "#content",

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
      el : "#content",
      
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
  el: "#content",

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
  el:"#content",

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
  el:"#content",

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
  el:"#content",
    
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
  el: "#content",

  events: {
    "keyup input#search-basic": "search"
  },

  listview: "#listGamesView",

  pageName: "index",

  initialize: function () {
    this.indexViewTemplate = Y.Templates.get('indexViewTemplate');
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
  
    this.$el.html(this.indexViewTemplate(), {});
    //Trigger jquerymobile rendering
    this.$el.trigger('pagecreate');
    
    //new Y.FastButton(document.querySelector("#mnufollow"), function () { Y.Router.navigate('#', true);});
   	//new Y.FastButton(document.querySelector("#mnudiffuse"), function () { Y.Router.navigate('#games/add', true);});
    //new Y.FastButton(document.querySelector("#mnuaccount"), function () { Y.Router.navigate('#account', true);});
            
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
  el:"#content",

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
  el:"#content",
  
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
  el:"#content",
    
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
  el : "#content",

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
  el : "#content",

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
  el : "#content",

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