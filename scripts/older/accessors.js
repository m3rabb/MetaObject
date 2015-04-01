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


    function CreateCopyOnReadPureGetter(_Selector) {
      return function () { return Dup(this[_Selector]); };
    }

    function CreatePureGetter(_Selector) {
      return function () { return this[_Selector]; };
    }


    function CreateCopyOnReadWriteAccessor(_Selector) {
      return function (value_) {
        return (arguments.length) ?
          (this[_Selector] = Dup(value_), this) : Dup(this[_Selector]);
      };
    }

    function CreateCopyOnWriteAccessor(_Selector) {
      return function (value_) {
        return (arguments.length) ?
          (this[_Selector] = Dup(value_), this) : this[_Selector];
      };
    }

    function CreateCopyOnReadAccessor(_Selector) {
      return function (value_) {
        return (arguments.length) ?
          (this[_Selector] = value_, this) : Dup(this[_Selector]);
      };
    }

    function CreateAccessor(_Selector) {
      return function (value_) {
        return (arguments.length) ?
          (this[_Selector] = value_, this) : this[_Selector];
      };
    }


    function CreateThingCopyingPureGetter(Value) {
      return function () { return Value.copy(); };
    }

    function CreateArrayCopyingPureGetter(Value) {
      return function () { return Value.slice(); };
    }

    function CreateObjectCopyingPureGetter(Value) {
      return function () { return CopyObject(Value); };
    }

    function CreateThingCopyingCheckingGetter(Value) {
      return function (value_) {
        return arguments.length ? this.setImmutableError() : Value.copy();
      };
    }

    function CreateArrayCopyingCheckingGetter(Value) {
      return function (value_) {
        return arguments.length ? this.setImmutableError() : Value.slice();
      };
    }

    function CreateObjectCopyingCheckingGetter(Value) {
      return function (value_) {
        return arguments.length ? this.setImmutableError() : CopyObject(Value);
      };
    }

    function CreateCopyingClosuredGetter(value, isGetterPure) {
      if (value instanceof Thing) {
        return isGetterPure ?
          CreateThingCopyingPureGetter(value) :
          CreateThingCopyingCheckingGetter(value);
      }
      if (typeof value === "object") {
        if (IsArray(value)) {
          return isGetterPure ?
            CreateArrayCopyingPureGetter(value) :
            CreateArrayCopyingCheckingGetter(value);
        }
        if (value !== null) {
          return isGetterPure ?
            CreateObjectCopyingPureGetter(value) :
            CreateObjectCopyingCheckingGetter(value);
        }
      }
      return null;
    }


    var PureGetters     = NewStash();
    var CheckingGetters = NewStash();

    function CreateImmutablePureGetter(Selector) {
      return function () { return this._immutablePropertyAt(Selector); };
    }

    function CreateImmutableCheckingGetter(Selector) {
      return function (value_) {
        return arguments.length ?
          this.setImmutableError(Selector) :
          this._immutablePropertyAt(Selector);
      };
    }

    function ImmutableGetterFor(selector, isPureGetter) {
      return isPureGetter ?
        (PureGetters[selector] ||
          (PureGetters[selector] = CreateImmutablePureGetter(selector))) :
        (CheckingGetters[selector] ||
          (CheckingGetters[selector] = CreateImmutableCheckingGetter(selector)));
    }

    function CreateWriteOnceAccessor(Selector, IsCopyOnWrite, IsCopyOnRead, IsGetterPure) {
      return function (value_) {
        var value, getter;
        if (arguments.length === 0) { return undefined; }

        value = IsCopyOnWrite ? Dup(value_) : value_;
        if (IsCopyOnRead) {
          getter = CreateCopyingClosuredGetter(value, IsGetterPure);
          if (getter) { return this.addProperty(Selector, getter); }
        }

        this._immutablePropertyAtSet(Selector, value);
        getter = ImmutableGetterFor(Selector, IsGetterPure);
        return this.addProperty(Selector, getter);
      };
    }



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

    Thing.addSharedMethod(function addAccessor(accessorSpec) {
      var matcher = accessorSpec.match(SELECTOR_SPEC_MATCHER);
      var writingOptions, readingOptions, selector, _selector, accessor;
      var isWriteOnce, isCopyOnWrite, isGetterPure, isCopyOnRead;

      if (matcher === null) { return this.accessorSpecError(accessorSpec); }

      writingOptions = matcher[1];
      selector       = matcher[4];
      readingOptions = matcher[5];
      isWriteOnce    = writingOptions.indexOf("+") >= 0;
      isCopyOnWrite  = writingOptions.indexOf("&") >= 0;
      isGetterPure   = readingOptions.indexOf("!") >= 0;
      isCopyOnRead   = readingOptions.indexOf("&") >= 0;

      if (isWriteOnce) {
        accessor = CreateWriteOnceAccessor(
          selector, isCopyOnWrite, isCopyOnRead, isGetterPure);
      }
      else {
        _selector = AsProtectedSelector(selector);

        if (isGetterPure) {
          if (isCopyOnWrite) { return this.pureGetterError(accessorSpec); }
          accessor = isCopyOnRead ?
            CreateCopyOnReadPureGetter(_selector) : CreatePureGetter(_selector);
        }
        else {
          accessor = isCopyOnWrite ?
            (isCopyOnRead ?
              CreateCopyOnReadWriteAccessor(_selector) :
             CreateCopyOnWriteAccessor(_selector)) :
            (isCopyOnRead ?
              CreateCopyOnReadAccessor(_selector) : CreateAccessor(_selector));
        }
      }
      return this.atPutMethod(selector, accessor);
    });

    Type.addSharedMethod(function addSharedAccessor(accessorSpec) {
      this._InstanceRoot.addAccessor(accessorSpec);
      return this;
    });

    function AddAllToUsing(specsString_accessorSpecs, target, methodName) {
      var accessorSpecs = AsSelectorList(specsString_accessorSpecs);
      accessorSpecs.forEach(target[methodName], target);
      return target;
    }

    Thing.addSharedMethod(function addAccessors(specsString_accessorSpecs) {
      return AddAllToUsing(specsString_accessorSpecs, this, "addAccessor");
    });

    Type.addSharedMethod(function addSharedAccessors(specsString_accessorSpecs) {
      return AddAllToUsing(specsString_accessorSpecs, this, "addSharedAccessor");
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
