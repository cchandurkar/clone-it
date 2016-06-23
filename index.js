
(function(){

  'use strict';

  function clone(data){

    // Object Map for Circular Dependancy
    var map = new Map();

    // -----------------------------------------
    // Helpers
    // -----------------------------------------

    function isDate(d){
      return Object.prototype.toString.call(d) === '[object Date]';
    }

    function isRegExp(d){
      return Object.prototype.toString.call(d) === '[object RegExp]';
    }

    function isArray(d){
      return Object.prototype.toString.call(d) === '[object Array]';
    }

    function isFunction(d){
      return Object.prototype.toString.call(d) === '[object Function]';
    }

    function isObject(d){
      return Object.prototype.toString.call(d) === '[object Object]';
    }

    function getRegExpFlags(d){
      return (d.ignoreCase ? "i" : "") + (d.multiline ? "m" : "") + (d.global ? "g" : "");
    }

    // Check data type and call appropriate function
    function checkType(d){
      if(isArray(d)) return cloneArray(d);
      else if(isFunction(d)) return cloneFunction(d);
      else if(isDate(d)) return cloneDate(d);
      else if(isRegExp(d)) return cloneRegExp(d);
      else if(isObject(d)) return cloneObject(d);
      else return cloneSimpleData(d);
    }

    // -----------------------------------------
    // Clone
    // -----------------------------------------

    // Clone a date
    // Use the object constructor
    function cloneDate(d){
      return new Date(d);
    }

    // Clone a RegExp
    function cloneRegExp(d){
      return new RegExp(d.source, getRegExpFlags(d));
    }

    // Clones an Object
    function cloneObject(obj){
      if(obj === null) return null;
      if(map.has(obj)) return map.get(obj);
      var clone = { };
      map.set(obj, clone);
      for(var key in obj){
        clone[key] = checkType(obj[key]);
      } return clone;
    }

    // Clones an Array
    function cloneArray(arr){
      if(map.has(arr)) return map.get(arr);
      var clone = [];
      map.set(arr, clone);
      arr.forEach(function(el){
        clone.push(checkType(el));
      }); return clone;
    }

    // Clone a function
    function cloneFunction(fn){
      if(map.has(fn)) return map.get(fn);
      var clone = function(){ return fn.apply(this, arguments); };
      map.set(fn, clone);
      for(var key in fn){
        if(fn.hasOwnProperty(key))
        clone[key] = checkType(fn[key]);
      }
      for(var protoKey in fn.prototype){
        if(fn.prototype.hasOwnProperty(protoKey))
        clone.prototype[protoKey] = checkType(fn.prototype[protoKey]);
      } return clone;
    }

    // Clones String, Number, Null, NaN and undefined
    var cloneSimpleData = function(d){
      var clone = d; return clone;
    };

    // Return Cloned
    return checkType(data);

  }

  // -----------------------------------------
  // Export
  // -----------------------------------------

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = clone;
  } else {
    if(typeof define === 'function' && define.amd){
      define([], function() {
        return clone;
      });
    } else {
      window.cloneit = clone;
    }
  }

}());
