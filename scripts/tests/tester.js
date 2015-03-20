"use strict";

function sum(x, y, z) {
  var a = arguments;
  return x + y + z;
}

var g = function (x, y, z) {
  nextIndex = g.length;
  arguments[nextIndex] = { what : "hello"};
  arguments.length = nextIndex + 1;
  // arguments._purse = { what : "hello"};
  sum.apply(null, arguments);

}


var SpawnFrom   = Object.create;

var _Top_root             = SpawnFrom(null);
var 	Stash_root          = SpawnFrom(_Top_root);
var 	_Ref_root           = SpawnFrom(_Top_root);
var 	_Base_root          = SpawnFrom(_Top_root);
var 		_Default_root     = SpawnFrom(_Base_root);
var 			Primordial_root = SpawnFrom(_Default_root);
var 				Thing_root    = SpawnFrom(Primordial_root);
var 				Nothing_root  = SpawnFrom(Primordial_root);
var 		_Super_root       = SpawnFrom(_Base_root);



function NewSuper(target) {
  return {__Ref: target.__Ref, __Target: target};
}

// function LoadSuper() {
//   var _super = NewSuper(this);
//   Object.defineProperty(this, '_super', {
//     configurable: true
//   });
//   Object.defineProperty(this, '_super', {
//     value: 				_super,
//   });
//   return _super;
// }

function LoadSuper() {
  Object.defineProperty(this, '_super', {
    writable: true,
    configurable: true,
    enumerable: false,
  });
  return this._super = NewSuper(this);
}

Object.defineProperty(_Default_root, '_super', {
  get: LoadSuper,
  // writable: false,
  enumerable: true,
  configurable: true
});

var t1 = SpawnFrom(Thing_root);
var t2 = Object.create(Thing_root);
t1.name = "I'm T1 baby!";
