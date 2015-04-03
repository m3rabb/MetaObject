// ### JS Hint global pragmas

/* global
  jasmine:false
*/
/* jshint
  maxerr:66, bitwise:true, curly:true, eqeqeq:true, forin:false,
  plusplus:false, noarg:true, nonew:true, latedef:true, regexp:true,
  noempty:false, lastsemic:true, immed:true, expr:true, eqnull:true,
  browser:true, jquery:true, devel:true, globalstrict:true,
  smarttabs:true, trailing:false, newcap:false, undef:true, unused:false,
  futurehostile:true
*/
// validthis:true

(function (global) {
  "use strict";

  function factory(require) {
    var RootOf           = Object.getPrototypeOf;
    var SpawnFrom        = Object.create;
    var IsArray          = Array.isArray;
    var Array_join       = Array.prototype.join;
    var Math_floor       = Math.floor;
    var Math_random      = Math.random;
    var DefineProperty   = Object.defineProperty;
    var PropertiesOf     = Object.keys;
    var BeImmutable      = Object.freeze;
    var Object_prototype = Object.prototype;
    var IsLocalProperty  = Object.hasOwnProperty;

    var HandleErrorsQuietly                = false;
    var IsProtectingAgainstObjectIntrusion = true;

    // var ParenthesesMatcher   = /\(|\)/;
    // var SelectorMatcher      = /[\w\$_!&]+/gi;
    var VowelMatcher         = /^[aeiou]/i;
    var ValidSelectorMatcher = /_*[a-z][\w$]*/;

    var _ = SpawnFrom(null);

    var _Base_root               = SpawnFrom(null);
    var   Stash_root             = SpawnFrom(_Base_root);
    var   _Top_root              = SpawnFrom(_Base_root);
    var     _Peel_root           = SpawnFrom(_Top_root);
    var     _Inner_root          = SpawnFrom(_Top_root);
    var       _Super_root        = SpawnFrom(_Inner_root);
    var       _Pulp_root         = SpawnFrom(_Inner_root);
    var         Primordial_root  = SpawnFrom(_Pulp_root);
    var           Nothing_root   = SpawnFrom(Primordial_root);
    var           Thing_root     = SpawnFrom(Primordial_root);
    var             Type_root    = SpawnFrom(Thing_root);

    // var _Default  ----> deal with super called whne there is noe

    // Implementation/Base/Default

    var Primordial, Nothing, Thing, Type, Context, Void;
    var HiddenConfiguration, LockedConfiguration, LockedHiddenConfiguration;
    var ConnectSubtype_ToSupertype;


    var HandleErrorsQuietly                = false;
    var IsProtectingAgainstObjectIntrusion = true;

    function _HandleErrorsQuietly(bool_) {
      return (arguments.length) ?
        (HandleErrorsQuietly = bool_) : HandleErrorsQuietly;
    }

    function TopError(target, message) {
      this.name    = "TopError";
      this.target  = target;
      this.message = message || 'Default Message';
    }
    TopError.prototype = SpawnFrom(Error.prototype);
    TopError.prototype.constructor = TopError;


    function _SignalError(target, message) {
      if (HandleErrorsQuietly) {
        console.warn(message);
      } else {
        // console.error(message);
        throw new TopError(target, message);
      }
      return null;
    }

    function _ConstructorError(constructor) {
      _SignalError(constructor.name,
        " is only for use with 'instanceof', it's not meant to be executed!");
    }

    function _Top ()        { _ConstructorError(_Top); }
    function _Inner ()      { _ConstructorError(_Inner); }
    function _Pulp ()       { _ConstructorError(_Pulp); }
    function _Peel ()       { _ConstructorError(_Peel); }
    function _Primordial () { _ConstructorError(_Primordial); }
    function _Thing ()      { _ConstructorError(_Thing); }

    _Top.prototype        = _Top_root;
    _Inner.prototype      = _Inner_root;
    _Pulp.prototype       = _Pulp_root;
    _Peel.prototype       = _Peel_root;
    _Primordial.prototype = Primordial_root;
    _Thing.prototype      = Thing_root;


    // #### Random Number Generation
    var RANDOM_MAX = 0xFFFFFFFFFFFF;
    var ZERO_PADDING = "0000000000000000";
    var MAX_UNIQUE_ID_LENGTH =
      (+new Date("2067-01-01") * RANDOM_MAX).toString(36).length;

    function RandomInt(max_min, max_) {
      var min, max;
      if (arguments.length <= 1) {
          min = 0, max = max_min;
      } else {
          min = max_min, max = max_;
      }
      return Math_floor(Math_random() * (max - min + 1)) + min;
    }

    function NewUniqueId(prefix_, seedDate__, seedValue__) {
      var prefix, seedDate, seedValue, id, zeros;
      prefix = prefix_ || "";
      seedDate = seedDate__ || Date.now();
      seedValue = seedValue__ || RandomInt(RANDOM_MAX);
      id = seedDate * seedValue;
      id = id.toString(36);
      zeros = ZERO_PADDING.slice(0, MAX_UNIQUE_ID_LENGTH - id.length);
      return prefix + zeros + id;
    }


    var KNIFE   = NewUniqueId("KNIFE");
    var SYRINGE = NewUniqueId("SYRINGE");


    function NewStash(spec_) {
      var stash, selectors, index, selector, value;

      stash = SpawnFrom(Stash_root);
      if (spec_) {
        if (IsProtectingAgainstObjectIntrusion && spec_ instanceof Object) {
          selectors = PropertiesOf(spec_);
          index = selectors.length;
          while (index--) {
            selector = selectors[index];
            value    = spec_[selector];
            if (value !== Object_prototype[selector] ||
                IsLocalProperty.call(spec_, selector)) {
              stash[selector] = spec_[selector];
            }
          }
        } else {
          for (selector in spec_) {
            stash[selector] = spec_[selector];
          }
        }
      }
      return stash;
    }


    function IsUpperCase(string) {
      return string.match(/^[A-Z]/);
    }

    function IsLowerCase(string) {
      return string.match(/^[a-z]/);
    }

    if (jasmine) {
      Top = SpawnFrom(null);

      Top._vars = SpawnFrom(null);
      Top._vars._Base_root      = _Base_root;
      Top._vars.Stash_root      = Stash_root;
      Top._vars._Top_root       = _Top_root;
      Top._vars._Peel_root      = _Peel_root;
      Top._vars._Inner_root     = _Inner_root;
      Top._vars._Super_root     = _Super_root;
      Top._vars._Pulp_root      = _Pulp_root;
      Top._vars.Primordial_root = Primordial_root;
      Top._vars.Nothing_root    = Nothing_root;
      Top._vars.Thing_root      = Thing_root;
      Top._vars.Type_root       = Type_root;

      Top._vars._Top        = _Top;
      Top._vars._Inner      = _Inner;
      Top._vars._Pulp       = _Pulp;
      Top._vars._Peel       = _Peel;
      Top._vars._Primordial = _Primordial;
      Top._vars._Thing      = _Thing;

      Top._vars.KNIFE = KNIFE;
      Top._vars.SYRINGE = SYRINGE;

      Top._vars.HiddenConfiguration        = HiddenConfiguration;
      Top._vars.LockedConfiguration        = LockedConfiguration;
      Top._vars.LockedHiddenConfiguration  = LockedHiddenConfiguration;
      Top._vars.ConnectSubtype_ToSupertype = ConnectSubtype_ToSupertype;

      Top._vars.IsUpperCase = IsUpperCase;
      Top._vars.IsLowerCase = IsLowerCase;


      Top.$Primordial  = Primordial;
      Top.$Nothing     = Nothing;
      Top.$Thing       = Thing;
      Top.$Type        = Type;
      Top.$Context     = Context;
      Top.$Void        = Void;

      Top.RandomInt   = RandomInt;
      Top.NewUniqueId = NewUniqueId;

      Top.NewStash    = NewStash;
    }

  }
  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(factory);
  } else {
      // Browser globals
      global.Top = factory(global);
  }
})(this);
