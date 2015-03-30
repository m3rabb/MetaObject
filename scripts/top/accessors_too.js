    function InstallInnerThisOn(target) {
      var _This = SpawnFrom(target);
      var _Purse;
      target.__ = function (key) {
        if (key === INNER_KEY)     { return _This; }
        if (key === PURSE_READ_KEY)  { return _Purse; }
        if (key === PURSE_WRITE_KEY) {
          if (_Purse) {} else {
            _Purse = NewStash();
            if (PROTECT_IMMUTABLE_PROPERTIES) {} else {
              _This.__Immutables = _Purse;
            }
          }
          return _Purse;
        }
        return this.privateAccessError();
      });
      Object_defineProperty(target, "__", PRIVATE_IMMUTABLE_CONFIG);
      return _This;
    });



    Thing.addSharedMethod(function addAccessor(accessorSignature) {
      var accessor = AccessorMaker.newFrom(accessorSignature).make();
      this.atPutMethod(selector, accessor);
    });

    AccessorMaker.addMethod(function newFrom(accessorSignature) {
      var matchResult = accessorSignature.match(SELECTOR_SPEC_MATCHER);
      return (matchResult !== null) ?
        this._super$newFrom(accessorSignature, matchResult) :
        this.accessorSignatureError(accessorSignature);
    });


    //  ~      [!]friends [&] * [?]                  getter
    //   [+][&] * friends~      [?]                  setter
    //    + [&][!]friends [&][!][?]  ! only 1        write once - uses purse
    //      [&]   friends [&][!] *   ? is moot       accessor

    //  ~ = no setter|getter
    //  + = write once
    //  & = duplicate before|after access
    //  ! = focus bias of return behavior
    //  ? = check the arguments and error if problem

    //  Need lazy immutable accessors!!!

    var SELECTOR_SPEC_MATCHER = /(~?)(\+?)(&?)(!?)([\w$]+)(~?)(&?)(!?)(\??)/i
                         // /([~+&?]*)([\w$]+)([~&!]*)/i;

    AccessorMaker.addSPMethod(function _init(validSignature, matchResult) {
      var selector = matcher[5];

      this._super$_init();
      this._AccessorSignature = validSignature;
      this._MatchResult       = matchResult;
      this._ProtectedSelector =
        "_" + selector[0].toUpperCase() + selector.slice(1);

      this._Options = NewStash({
        isReadOnly         : matchResult[1] === "~",
        isWriteOnce        : matchResult[2] === "+",
        isCopyOnWrite      : matchResult[3] === "&",
        isForceForWrites   : matchResult[4] === "!", // isAnswersSelfWhenAsSetter
        selector           : selector,
        isWriteOnly        : matchResult[6] === "~",
        isCopyOnRead       : matchResult[7] === "&",
        isForceForReads    : matchResult[8] === "!", // isAlwaysAnswersValue
        isArgChecking      : matchResult[9] === "?",
      });
    });

    AccessorMaker.addSPMethod(function make() {
      var options = this._Options;
      var selector = options.selector;

      if (options.isReadOnly) {
        //  ~      [!]friends [&] * [?]
        if (options.isWriteOnly) {
          return this.cannotBeGetterAndSetterSpecificationError();
        }
        if (options.isWriteOnce || options.isCopyOnWrite) {
          return this.getterSpecificationError();
        }
        if (options.isForceForWrites && options.isForceForReads) {
          return this.cannotForceBothReturnsSpecificationError();
        }
        return this.answerGetter();
      }
      if (options.isWriteOnly) {
        //   [+][&] * friends~      [?]
        if (options.isCopyOnRead || options.isForceForReads) {
          return this.setterSpecificationError();
        }
        return this.answerSetter();
      }
      if (options.isWriteOnce) {
        //    + [&][!]friends [&][!][?]
        if (options.isForceForWrites && options.isForceForReads) {
          return this.cannotForceBothReturnsSpecificationError();
        }
        return this.answerWriteOnceAccessor();
      }
      //      [&]   friends [&][!] *
      if (options.isForceForWrites) {
        return this.cannotForceWriteReturnSpecificationError();
      }
      return this.answerAccessor();
    });

    AccessorMaker.addSMethod(function canonicalAccessorFor(id, absentAction) {
      var accessor = AccessorMaker._accessorAt(id);
      if (accessor) { return accessor; }
      if (absentAction) {
        accessor = absentAction.call(this);
        return AccessorMaker._accessorAtPut(id, accessor);
      }
      return null;
    });

    var GETTER_SPEC_MATCHER = /~(!?)([\w$]+)(&?)!?(\??)/i

    AccessorMaker.addSPMethod(function answerGetter() {
      //  ~      [!]friends [&] * [?]
      var Signature = this._AccessorSignature;
      var accessorId = Signature.replace(GETTER_SPEC_MATCHER, "~$1$2$3$4");

      return this.canonicalAccessorFor(accessorId, function () {
        var _selector = this._ProtectedSelector;
        var  flags    = Signature.replace(GETTER_SPEC_MATCHER, "$1$3$4");

        return flags ?
          CreateGeneralGetter(_selector, this._Options) :
          CreateCommonGetter(_selector);
      });
    });

    function CreateGeneralGetter(_Selector, Options) {
      //  ~      [!]friends [&] * [?]
      var IsAnswersSelfWhenAsSetter = Options.isForceForWrites;
      var IsCopyOnRead              = Options.isCopyOnRead;
      var IsArgChecking             = Options.isArgChecking;

      return function() {
        var value = this.__(INNER_KEY)[_Selector];
        if (arguments.length) {
          if (IsArgChecking) {
            return this.getterUsedAsSetterError(Options);
          }
          if (IsAnswersSelfWhenAsSetter) { return this; }
        }
        return IsCopyOnRead ? Dup(value) : value;
      };
    }

    function CreateCommonGetter(_Selector) {
      return function() {
        return this.__(INNER_KEY)[_Selector];
      };
    });

    var SETTER_SPEC_MATCHER = /(\+?&?)!?([\w$]+~)(\??)/i

    AccessorMaker.addSPMethod(function answerSetter() {
      //   [+][&] * friends~      [?]
      var Signature = this._AccessorSignature;
      var accessorId = Signature.replace(SETTER_SPEC_MATCHER, "$1$2$3");

      return this.canonicalAccessorFor(accessorId, function () {
        var _selector = this._ProtectedSelector;
        var  flags    = Signature.replace(SETTER_SPEC_MATCHER, "$1$3");

        return flags ?
          CreateGeneralSetter(_selector, this._Options) :
          CreateCommonSetter(_selector);
      });
    });


    function CreateGeneralSetter(_Selector, Options) {
      //   [+][&] * friends~      [?]
      var IsWriteOnce   = Options.isWriteOnce;
      var IsCopyOnWrite = Options.isCopyOnWrite;
      var IsArgChecking = Options.isArgChecking;

      return function (value) {
        var _this = this.__(INNER_KEY);
        if (arguments.length) {
          if (IsWriteOnce && _Selector in _this) {
            return IsArgChecking ? this.accessorWriteError(Options) : this;
          }
          _this[_Selector] = IsCopyOnWrite ? Dup(value) : value;
          return this;
        }
        return IsArgChecking ? this.setterUsedAsGetterError(Options) : this;
      };
    }

    function CreateCommonSetter(_Selector) {
      return function(value) {
        if (arguments.length) {
          this.__(INNER_KEY)[_Selector] = value;
        }
        return this;
      };
    }

    var WRITE_ONCE_SPEC_MATCHER = /\+(&?!?)[\w$]+(&?!?\??)/i

    AccessorMaker.addSPMethod(function answerWriteOnceAccessor() {
      //    + [&][!]friends [&][!][?]
      var Signature = this._AccessorSignature;

      return this.canonicalAccessorFor(Signature, function () {
        var  flags    = Signature.replace(WRITE_ONCE_SPEC_MATCHER, "$1$2");
        var _selector = this._ProtectedSelector;
        var  options  = this._Options;

        return flags ?
          CreateGeneralWriteOnceAccessor(_selector, options) :
          CreateCommonWriteOnceAccessor(_selector, options.selector);
      });
    });

    function CreateGeneralImmutableGetter(_Selector, Options) {
      var IsAnswersSelfWhenAsSetter = Options.isForceForWrites;
      var IsCopyOnRead              = Options.isCopyOnRead;
      var IsArgChecking             = Options.isArgChecking;

      return function () {
        var value;
        if (arguments.length) {
          if (IsArgChecking) { return this.immutableWriteError(Options); }
          if (IsAnswersSelfWhenAsSetter) { return this; }
        }
        value = this.__(PURSE_READ_KEY)[_Selector];
        return IsCopyOnRead ? Dup(value) : value;
      };
    }

    function CreateGeneralWriteOnceAccessor(_Selector, Options) {
      //    + [&][!]friends [&][!][?]
      var IsCopyOnWrite        = Options.isCopyOnWrite;
      var IsAlwaysAnswersValue = Options.isForceForReads;
      var Selector             = Options.selector;
      var ImmutableGetter = CreateGeneralImmutableGetter(_Selector, Options);

      return function (value_) {
        var value;
        if (arguments.length) {
          value = IsCopyOnWrite ? Dup(value_) : value_;
          this.__(PURSE_WRITE_KEY)[_Selector] = value;
          this.addLockedProperty(Selector, ImmutableGetter);
          return IsAlwaysAnswersValue ? value : this;
        }
        return undefined;
      };
    }

    function CreateCommonImmutableGetter(_Selector) {
      return function () {
        return this.__(PURSE_READ_KEY)[_Selector];
      };
    }

    function CreateCommonWriteOnceAccessor(_Selector, Selector) {
      var ImmutableGetter = CreateCommonImmutableGetter(_Selector);

      return function (value_) {
        if (arguments.length) {
          this.__(PURSE_WRITE_KEY)[_Selector] = value_;
          return this.addLockedProperty(Selector, ImmutableGetter);
        }
        return undefined;
      };
    }

    var ACCESSOR_SPEC_MATCHER = /(&?)([\w$]+)(&?!?)\??/i

    AccessorMaker.addSPMethod(function answerAccessor() {
      //      [&]   friends [&][!] *
      var Signature = this._AccessorSignature;
      var accessorId = Signature.replace(ACCESSOR_SPEC_MATCHER, "$1$2$3");

      return this.canonicalAccessorFor(Signature, function () {
        var  flags    = Signature.replace(WRITE_ONCE_SPEC_MATCHER, "$1$3");
        var _selector = this._ProtectedSelector;

        return flags ?
          CreateGeneralAccessor(_selector, this._Options) :
          CreateCommonAccessor(_selector);
      });
    });

    function CreateGeneralAccessor(_Selector, Options) {
      //      [&]   friends [&][!] *
      var IsCopyOnWrite        = Options.isCopyOnWrite;
      var IsCopyOnRead         = Options.isCopyOnRead;
      var IsAlwaysAnswersValue = Options.isForceForReads;

      return function(value_) {
        var _this, value;
        _this = this.__(INNER_KEY);
        if (arguments.length) {
          value = IsCopyOnWrite ? Dup(value_) : value_;
          _this[_Selector] = value;
          return IsAlwaysAnswersValue ? value : this;
        }
        value = _this[_Selector];
        return IsCopyOnRead ? Dup(value) : value;
      };
    }

    function CreateCommonAccessor(_Selector) {
      return function(value_) {
        var _this = this.__(INNER_KEY);
        return arguments.length ?
          (_this[_Selector] = value_, this) : _this[_Selector];
      };
    });


    function CopyMethodFor(value) {
      if (value instanceof Thing) { return value.copy; }
      if (typeof value === "object") {
        if (IsArray(value)) { return value.slice; }
        if (value !== null)  { return CopyObject; }
      }
      return Yourself;
    }



});
