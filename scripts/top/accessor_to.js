// ### JS Hint global pragmas

/* global
  Top
*/
/* jshint

  maxerr:66, bitwise:true, curly:true, eqeqeq:true, forin:true,
  plusplus:false, noarg:true, nonew:true, latedef:true, regexp:true,
  noempty:false, lastsemic:true, immed:true, expr:true,
  browser:true, jquery:true, devel:true,
  smarttabs:true, trailing:false, newcap:false, undef:true, unused:false
*/
// validthis:true, globalstrict:true,

(function (global) {
  "use strict";

  function factory(require) {
    var ACCESSOR_DELIMITER_MATCH = /\s*[ ,]\s*/;
    var SELECTOR_SPEC_MATCHER    = /((\+&?)|(&\+?))?([\w$]+)((!&?)|(&!?))?/i;

    var PropertiesOf = Object.keys;
    var IsArray      = Top.isArray;

    var SpawnFrom    = Top.spawnRoof;
    var NewStash     = Top.newStash;
    var RootOf       = Top.rootOf;
    var Thing        = Top.Thing;
    var Type         = Top.Type;

    function CopyObject(source_) {
      var source, target, propertyNames, propertyName, index;

      source = source_ || this;
      target = SpawnFrom(RootOf(source));
      propertyNames = PropertiesOf(source);
      index = propertyNames.length;

      while (index-- > 0) {
        propertyName = propertyNames[index];
        target[propertyName] = source[propertyName];
      }
      return target;
    }

    function Dup(value) {
      if (value instanceof Thing) { return value.copy(); }
      if (typeof value === "object") {
        if (IsArray(value)) { return value.slice(); }
        if (value !== null)  { return CopyObject(value); }
      }
      return value;
    }

    function AsSelectorList(specsString_accessorSpecs) {
      return (typeof specsString_accessorSpecs === "string") ?
        specsString_accessorSpecs.split(ACCESSOR_DELIMITER_MATCH) :
        specsString_accessorSpecs;
    }

    function AsProtectedSelector(selector) {
      var firstChar = selector[0];
      return (firstChar === "_") ? selector :
        "_" + firstChar.toUpperCase() + selector.slice(1);
    }


    Thing_root.addMethod(function init(name_) {
      // this.superPerformWithArgs("init", arguments);
      // this._super_init.apply(this, arguments);
      if (arguments.length) { this._Name = name_; }
      this._setPurse(this._(PURSE).purseKey);
      return this;
    });

    function CreatePurseAccessor(secretKey) {
      var SecretKeys = NewStash();
      var Purse = NewPurse(secretKey);
      return function (key) {
        Purse(MASTER_KEY, "_secretkeys")
      }
    }

    Thing_root.addMethod(function _setPurse(secretKey) {

      Object_defineProperty(this, "_", {
        value: CreatePurseAccessor(secretKey),
        writable: false,
        enumerable: false,
        configurable: false
      });
    });


// - private by convention
// - plain purse passed in
// - request to make plain purse
// - purse a descendent of target obj
// - add purse key during init
// - pass purse key in during newInstance
// - context-wide purse key
// - plain purse in hidden property
// -

  addPurseKey();

  addPurseKey


function _purse(key) {
  var Keys = NewStash();
  var Purse = NewStash();
  Keys[GLOBAL_PURSE_KEY] = true;
  Keys[key] = true;
  this._purse = function _purse(key) {
    return (key in Keys) ? Purse : this.illegalPurseAccessError();
  };
  return Purse;
}

 ->  initiatize();


    x._X
    x._("x")

    Object.defineProperty(o, 'abc', {
      value: 345,
      writable: true,
      enumerable: false,
      configurable: false
    });

    Thing.s

    Top.newType({name : "Dog", superType : Animal, purseKey : key}, function (purse) {

    });



    Thing.addSharedMethod(function _immutablePropertyAt(selector) {
      return undefined;
    });

    Thing.addSharedMethod(function _immutablePropertyAtSet(selector, value) {
      var ImmutableProperties = NewStash();

      this._immutablePropertyAt = function (selector) {
        return ImmutableProperties[selector];
      };

      this._immutablePropertyAtSet = function (selector, value) {
        if (selector in ImmutableProperties) {
          return this.settingError(selector);
        }
        ImmutableProperties[selector] = value;
        return this;
      };

      return this._immutablePropertyAtSet(selector, value);
    });


    Person.addSharedMethod(function )





    //   friends    basicAccessor
    //   friends&   basicAccessor with duplicate
    //  &friends&   basicAccessor with duplicate
    //  &friends    basicAccessor with duplicate
    //
    //   friends!   basicGetter
    //   friends!&  basicGetter with duplicate
    //
    //  +friends    writeOnce with closured shared immutable accessor
    // &+friends    writeOnce with closured shared immutable accessor
    // &+friends!   writeOnce with closured shared immutable getter
    //  +friends!   writeOnce with closured shared immutable getter

    //  +friends&   writeOnce with closured per-instance copying accessor
    // &+friends&   writeOnce with closured per-instance copying accessor
    // &+friends!&  writeOnce with closured per-instance copying getter
    //  +friends!&  writeOnce with closured per-instance copying getter

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       .addSharedMethod(function init(accessorSpec, target) {
      var matcher = accessorSpec.match(SELECTOR_SPEC_MATCHER);
      var writingOptions, readingOptions;

      if (matcher === null) { return this.accessorSpecError(accessorSpec); }

      writingOptions = matcher[1];
      this._Selector = matcher[4];
      readingOptions = matcher[5];
      this._IsWriteOnce    = writingOptions.indexOf("+") >= 0;
      this._IsCopyOnWrite  = writingOptions.indexOf("&") >= 0;
      this._IsGetterPure   = readingOptions.indexOf("!") >= 0;
      this._IsCopyOnRead   = readingOptions.indexOf("&") >= 0;

      if (this._IsWriteOnce) {
        return this.makeWriteOnceAccessor();
      }
      this._ProtectedSelector = AsProtectedSelector(selector);

      if (this._IsGetterPure) {
        if (this._IsCopyOnWrite) { return this.pureGetterError(accessorSpec); }
        return this._IsCopyOnRead ?
          this.buildCopyOnReadPureGetter(_selector) :
          this.buildPureGetter(_selector);
      }
      return this._IsCopyOnWrite ?
        (this._IsCopyOnRead ?
          CreateCopyOnReadWriteAccessor(_selector) :
         CreateCopyOnWriteAccessor(_selector)) :
        (this._IsCopyOnRead ?
          CreateCopyOnReadAccessor(_selector) : CreateAccessor(_selector));
    });

    Thing.addSharedMethod(function addAccessor(accessorSpec, purse_) {
      var accessor = Method.newAccessor(accessorSpec, this).make();
      return this.atPutMethod(selector, accessor);
    });

    Type.addSharedMethod(function addSharedAccessor(accessorSpec, purse_) {
      this._InstanceRoot.addAccessor(accessorSpec, purse_);
      return this;
    });

    function AddAllToUsing(specsString_accessorSpecs, target, methodName, purse_) {
      var accessorSpecs = AsSelectorList(specsString_accessorSpecs);
      accessorSpecs.forEach(function (spec) {
        target[methodName](spec, purse_);
      });
      return target;
    }

    Thing.addSharedMethod(function addAccessors(specsString_accessorSpecs, purse_) {
      return AddAllToUsing(specsString_accessorSpecs, this, "addAccessor", purse_);
    });

    Type.addSharedMethod(function addSharedAccessors(specsString_accessorSpecs) {
      return AddAllToUsing(specsString_accessorSpecs, this, "addSharedAccessor", purse_);
    });


    Top.dup = Dup;
  }

  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(factory);
  } else {
      // Browser globals
      factory(global);
  }
})(this);
