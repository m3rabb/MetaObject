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


    var PropertiesOf     = Object.keys;
    var IsArray          = Top.isArray;
    var SpawnFrom        = Top.spawnRoof;
    var NewStash         = Top.newStash;
    var RootOf           = Top.rootOf;
    var Thing            = Top.Thing;
    var Type             = Top.Type;
    var Object_prototype = Object.prototype;


    // retry
    // get all Keys from obj then remove any key while values from Object_prototype

    function NewStash$(spec) {
      var stash, selectors, index, selector, value;

      stash = NewStash();
      if (IsProtectingAgainstObjectIntrusion && spec instanceof Object) {
        selectors = PropertiesOf(spc);
        index = selectors.length;
        while (index--) {
          selector = selectors[index];
          value    = spec[selector];
          if (value !== Object_prototype[selector] ||
              Object_hasOwnProperty.call(spec, selector)) {
            stash[selector] = spec[selector];
          }
        }
      } else {
        for (selector in spec) {
          stash[selector] = spec[selector];
        }
      }
      return stash;
    }



var PRIVATE_IMMUTABLE_CONFIGURATION = NewStash_({
                                 writable: false,
                                 enumerable: false,
                                 configurable: false
                               });

var LOCKED_CONFIGURATION = NewStash_({
                                 writable: false,
                                 configurable: false,
                                 // enumerable: ???
                               });

var LOCKED_METHOD_CONFIGURATION NewStash_({
                                 writable: false,
                                 configurable: false,
                                 enumerable: true
                               });

    function CopyObject(source_) {
      var source, target, selectors, index, selector;

      source = source_ || this;
      target = SpawnFrom(RootOf(source));
      selectors = PropertiesOf(source);
      index = selectors.length;

      while (index--) {
        selector = selectors[index];
        target[selector] = source[selector];
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

    var ACCESSOR_DELIMITER_MATCH = /\s*[ ,]\s*/;

    function AsSelectorList(specsString_accessorSpecs) {
      return (typeof specsString_accessorSpecs === "string") ?
        specsString_accessorSpecs.split(ACCESSOR_DELIMITER_MATCH) :
        specsString_accessorSpecs;
    }


    Thing_root.addMethod(function init(name) {
      // this.superPerformWithArgs("init", arguments);
      // this._super$_init.apply(this, arguments);
      if (name) { this.name(name); }
      return this;
    });

    Thing_root.addMethod(function lockProperty(selector) {
      var configuration = SpawnFrom(LOCKED_CONFIGURATION);
      configuration.enumerable = this.propertyIsEnumerable(selector);
      Object_defineProperty(this, selector, configuration);
      return this;
    });

    Thing_root.addMethod(function lockMethod(selector) {
      Object_defineProperty(this, selector, LOCKED_METHOD_CONFIGURATION);
      return this;
    });

    Thing_root.addMethod(function addPrivilegedMethod(NamedFunction) {
      this.atPutMethod(NamedFunction.name, function priv(/* arguments */) {
        var _this = this.__(PRIVACY_KEY);
        var result = NamedFunction.apply(_this, arguments);
        return (result === _this) ? this : result;
      });
    });

    Thing_root.addMethod(function addLockedMethod(NamedFunction) {
      this.addMethod(namedFunction);
      this.lockMethod(namedFunction.name);
    });

    Thing_root.addMethod(function addLockedPrivilegedMethod(NamedFunction) {
      this.addPrivilegedMethod(namedFunction);
      this.lockMethod(namedFunction.name);
    });



    Thing_root.addLockedPrivilegedMethod(function extend(extensionAction) {
      var target = this._IsUnlocked ? this : RootOf(this);
      var result = extensionAction.call(target);
      if (result === true) { this._IsUnlocked = true; }
      return target;
    });





    Type_root.addMethod(function newInstance(/* arguments */) {
      var instanceRoot = this._InstanceRoot;
      var instance = SpawnFrom(instanceRoot);
      return instanceRoot._init.apply(InstallInnerThisOn(instance), arguments);
    });

    Type_root.addPrivilegedMethod(function newInstance_(spec, extensionAction_) {
      var instanceRoot = this._InstanceRoot;
      var instance = SpawnFrom(instanceRoot);
      var _this = InstallInnerThisOn(instance);
      instanceRoot.init_.call(_this, spec);
      return _this.extend(extensionAction_);
    });


    Thing_root.atPutMethod = function atPutMethod(selector, method) {
      var selector_;
      if (selector[selector.length - 1] !== UNDERSCORE) {
        selector_ = selector + UNDERSCORE;
        this[selector_] = AsSpecMethodNamed(method, selector_);
        EnsureDefaultMethodsFor(selector_);
      }
      this[selector] = AsMethodNamed(method, selector);
      EnsureDefaultMethodsFor(selector);
      return this;
    };



    function ExtendType(extensionAction) {
      var target = this._IsUnlocked ? this : RootOf(this);
      var result = extensionAction.call(target);
      if (result === false) { this._IsUnlocked = false; }
      return target;
    }

    Type_root.addPrivilegedMethod(function init(name, supertype, instanceRoot) {
      this._super$_init(name);
      this._Supertype = supertype._addSubtype(this);
      this._Subtypes = NewStash();
      this._InstanceRoot = instanceRoot;

      this.addLockedPrivilegedMethod(ExtendType);

      instanceRoot.type = CreatePureGetter(this);

      return this;
    });

    AccessorFactory_root.addPrivilegedMethod(
      function makeCopyOnReadPureGetter_(_Selector) {
        return function () { return Dup(this[_Selector]); };
      }
    );


    function CreateWriteOnceAccessor(Selector, _Options) {
      return function (value_) {
        if (arguments.length) {
          var value = _Options.isCopyOnWrite ? Dup(value_) : value_;
          this.__(PURSE_WRITE_KEY)[Selector] = value;
          this._installPurseGetter(Selector, _Options, value_);
          return _Options.alwaysAnswersValue ? value : this;
        }
        return undefined;
      };
    }


    Thing.addSharedMethod(function _installPurseGetter(selector, _options, value) {
      var getter = PurseGetterFor(selector, _options, value);
      return this.addLockedProperty(selector, getter);
    });

    function PurseGetterFor(selector, _options, value) {
      if (_options.isCopyOnRead) {
        if (value instanceof Thing) {
          return _options.isArgChecking ?
            CreateThingCopyingCheckingPurseGetter(selector) :
            CreateThingCopyingPurseGetter(selector);

        }
        if (typeof value === "object") {
          if (IsArray(value)) {
            return _options.isArgChecking ?
              CreateArrayCopyingCheckingPurseGetter(selector) :
              CreateArrayCopyingPurseGetter(selector);
          }
          if (value !== null) {
            return _options.isArgChecking ?
              CreateObjectCopyingCheckingPurseGetter(selector) :
              CreateObjectCopyingPurseGetter(selector);
          }
        }
      }
      return _options.isArgChecking ?
        CreateCheckingPurseGetter(selector) :
        CreatePurseGetter(selector);
    }

    var CreateThingCopyingPurseGetter = AsMemoizing(function (Selector) {
      return function () {
        return this.__(PURSE_READ_KEY)[Selector].copy();
      }
    });

    var CreateThingCopyingCheckingPurseGetter = AsMemoizing(function (Selector) {
      return function (value_) {
        return arguments.length ?
          this.accessorWriteError(Selector) :
          this.__(PURSE_READ_KEY)[Selector].copy();
      }
    });

    var CreateArrayCopyingPurseGetter = AsMemoizing(function (Selector) {
      return function () {
        return this.__(PURSE_READ_KEY)[Selector].slice();
      }
    });

    var CreateArrayCopyingCheckingPurseGetter = AsMemoizing(function (Selector) {
      return function (value_) {
        return arguments.length ?
          this.accessorWriteError(Selector) :
          this.__(PURSE_READ_KEY)[Selector].slice();
      }
    });

    var CreateObjectCopyingPurseGetter = AsMemoizing(function (Selector) {
      return function () {
        return CopyObject(this.__(PURSE_READ_KEY)[Selector]);
      }
    });

    var CreateObjectCopyingCheckingPurseGetter = AsMemoizing(function (Selector) {
      return function (value_) {
        return arguments.length ?
          this.accessorWriteError(Selector) :
          CopyObject(this.__(PURSE_READ_KEY)[Selector]);
      }
    });

    var CreateCopyingPurseGetter = AsMemoizing(function (Selector) {
      return function () {
        return this.__(PURSE_READ_KEY)[Selector];
      }
    });

    var CreateCopyingCheckingPurseGetter = AsMemoizing(function (Selector) {
      return function (value_) {
        return arguments.length ?
          this.accessorWriteError(Selector) :
          this.__(PURSE_READ_KEY)[Selector];
      }
    });


    function CreateCopyingCheckingGetter(_Selector) {
      return function (value_) {
        return arguments.length ?
          this.getterUsedAsSetterError(_Selector) :
          Dup(this.__(PRIVACY_KEY)[_Selector]);
      };
    }

    function CreateCopyingPureGetter(_Selector) {
      return function () {
        return Dup(this.__(PRIVACY_KEY)[_Selector]);
      };
    }

    function CreateCheckingGetter(_Selector) {
      return function (value_) {
        return arguments.length ?
          this.getterUsedAsSetterError(_Selector) :
          this.__(PRIVACY_KEY)[_Selector];
      };
    }

    function CreatePureGetter(_Selector) {
      return function () {
        return this.__(PRIVACY_KEY)[_Selector];
      };
    }

    var GetterFor = AsMemoizing(function CreateGetter(accessorSpec, settings) {
      return settings.isCopyOnRead ?
        (settings.isArgChecking ?
          CreateCopyingCheckingGetter(settings._selector) :
          CreateCopyingPureGetter(settings._selector)) :
        (settings.isArgChecking ?
          CreateCheckingGetter(settings._selector) :
          CreatePureGetter(settings._selector));
    });



    var SetterFor = AsMemoizing(function CreateSetter(accessorSpec, settings) {
      var  Selector     = settings.selector;
      var _Selector     = settings._selector;
      var IsWriteOnce   = settings.isWriteOnce;
      var IsArgChecking = settings.isArgChecking;
      var IsCopyOnWrite = settings.isCopyOnWrite;

      return function (value) {
        var _this = this.__(PRIVACY_KEY);
        if (arguments.length) {
          if (IsWriteOnce && _Selector in _this) {
            return IsArgChecking ? this.accessorWriteError(Selector) : this;
          }
          _this[_Selector] = IsCopyOnWrite ? Dup(value) : value;
          return this;
        }
        return IsArgChecking ? this.setterUsedAsGetterError(Selector) : this;
      };
    }


    var ReadWriteAccessorFor =
      AsMemoizing(function CreateReadWriteAccessor(accessorSpec, settings) {
        var  Selector     = settings.selector;
        var _Selector     = settings._selector;
        var IsCopyOnWrite   = settings.isCopyOnWrite;
        var AlwaysAnswersValue = settings.alwaysAnswersValue;
        var IsCopyOnRead = settings.isCopyOnRead;

        return function (value_) {
          return arguments.length ?
            (this.__(PRIVACY_KEY)[_Selector] = value_, this) :
            this.__(PRIVACY_KEY)[_Selector];
        }

        return function (value_) {
          if (arguments.length) {
            value = IsCopyOnWrite ? Dup(value_) : value_;
            this.__(PRIVACY_KEY)[_Selector] = value;
            return AlwaysAnswersValue ? value : this;
          }
          value = this.__(PRIVACY_KEY)[_Selector];
          return IsCopyOnRead ? Dup(value) : value;
        }

    //  ~      friends [&] * [?]  ! is implicit   getter
    //   [+][&]friends~      [?]                  setter
    //    + [&]friends [&][!][?]                  write once - uses purse
    //      [&]friends [&][!] *   ? is moot       accessor

    //  ~ = no setter or getter
    //  + = write once
    //  & = duplicate before or after access
    //  ! = always return value
    //  ? = check the arguments and error if problem

    var SELECTOR_SPEC_MATCHER = /((~?)(\+?)(&?)([\w$]+)(~?)(&?))(!?)(\??)/i
                             // /([~+&?]*)([\w$]+)([~&!]*)/i;

    Thing.addSharedMethod(function addAccessor(accessorSpec) {
      var matcher = accessorSpec.match(SELECTOR_SPEC_MATCHER);
      var options, selector, id, accessor;
      if (matcher === null) { return this.accessorSpecError(accessorSpec); }

      settings = {
        isReadOnly         : matcher[2] === "~",
        isWriteOnce        : matcher[3] === "+",
        isCopyOnWrite      : matcher[4] === "&",
         selector          : (selector = matcher[5]),
        _selector          : AsProtectedSelector(selector),
        isWriteOnly        : matcher[6] === "~",
        isCopyOnRead       : matcher[7] === "&",
        alwaysAnswersValue : matcher[8] === "!",
        isArgChecking      : matcher[9] === "?",
      };

      if (settings.isReadOnly) {
        if (settings.isWriteOnce || settings.isCopyOnWrite ||
            settings.isWriteOnly) {
          return this.getterSpecificationError(accessorSpec);
        }
        id = matcher[1] + matcher[9];
        accessor = GetterFor(id, settings);
      }
      else if (settings.isWriteOnly) {
        if (settings.isCopyOnRead || settings.alwaysAnswersValue) {
          return this.setterSpecificationError(accessorSpec);
        }
        id = selector;
        accessor = SetterFor(id, settings);
      }
      else if (settings.isWriteOnce) {
        id = selector;
        accessor = WriteOnceAccessorFor(id, settings);
      }
      else {
        id = matcher[1] + matcher[8];
        accessor = BasicAccessorFor(id, settings);
      }
      return this.atPutMethod(selector, accessor);
    });


//====================

function CreateGeneralWriteOncer(_Selector, Options) {
  //    + [&][!]friends [&][!][?]
  var IsCopyOnWrite             = Options.isCopyOnWrite;
  var IsAnswersSelfWhenAsSetter = Options.isForceForWrites;
  var IsCopyOnRead              = Options.isCopyOnRead;
  var IsAlwaysAnswersValue      = Options.isForceForReads;
  var IsArgChecking             = Options.isArgChecking;
  var IsSet, CopyMethod;

  return function (value_) {
    var value, copyMethod;
    if (IsSet) {
      if (arguments.length) {
        if (IsArgChecking) { return this.immutableWriteError(Options); }
        if (IsAnswersSelfWhenAsSetter) { return this; }
      }
      value = this.__(PURSE_READ_KEY)[_Selector];
      return CopyMethod ? CopyMethod.call(value) : value;
    }
    if (arguments.length) {
      value = IsCopyOnWrite ?
        (copyMethod = CopyMethodFor(value_)).call(value_) : value_;
      }
      if (IsCopyOnRead) {
        CopyMethod = copyMethod || CopyMethodFor(value_);
      }
      this.__(PURSE_WRITE_KEY)[_Selector] = value;
      IsSet = true;
      return IsAlwaysAnswersValue ? value : this;
    }
    return undefined;
  };



function CreateGeneralWriteOnceAccessor(_Selector, Options) {
  //    + [&][!]friends [&][!][?]
  var PurseKey = PURSE_WRITE_KEY;
  return function (value_) {
    if (arguments.length) {
      if (PurseKey === PURSE_WRITE_KEY) {
        var value = Options.isCopyOnWrite ? Dup(value_) : value_;
        var getter = ImmutableGetterFor(_Selector, Options, value_);
        this.__(PurseKey)[_Selector] = value;
        this.addLockedProperty(selector, getter);
        PurseKey = PURSE_READ_KEY;
        return Options.alwaysAnswersValue ? value : this;
      }
      Options.isArgChecking

      return Options.alwaysAnswersValue ? value : this;
    }
    if (arguments.length && Options.isArgChecking) {
      return this.immutableWriteError(Options);
    }
    var value = this.__(PURSE_READ_KEY)[_Selector];
    return CopyMethod ? CopyMethod.call(value) : value;
  };
    return undefined;
  };
}


function ImmutableGetterFor(_selector, options, value) {
  var getterId = "~+" + options.selector;
  var copyMethod = options.isCopyOnRead ? CopyMethodFor(value) : Yourself;
  var copySuffix = copyMethod ? "&" : "";
  var checkSuffix = options.isArgChecking ? "?" : "";

  getterId += copySuffix + checkSuffix;


  canonicalAccessorFor(getterId, absentAction)
//  ~      [!]friends [&] * [?]                  getter
//   [+][&]   friends~      [?]                  setter
//    + [&][!]friends [&][!][?]  ! only 1        write once - uses purse
//      [&]   friends [&][!] *   ? is moot       accessor

//  ~ = no setter or getter
//  + = write once
//  & = duplicate before or after access
//  ! = focus bias of return behavior
//  ? = check the arguments and error if problem


}

function CreateGeneralImmutableGetter(_Selector, Options, CopyMethod) {
  return function (value_) {
    if (arguments.length && Options.isArgChecking) {
      return this.immutableWriteError(Options);
    }
    var value = this.__(PURSE_READ_KEY)[_Selector];
    return CopyMethod ? CopyMethod.call(value) : value;
  };
}

function CreateCommonImmutableGetter(_Selector) {
  return function () {
    return this.__(PURSE_READ_KEY)[_Selector];
  };
}



// Add lazyAccessor
