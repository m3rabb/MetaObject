Top.Extend(function () {
  var AccessorFactory;

  function CopyObject(source_) {
    var source, target, selectors, index, selector;

    source = source_ || this;
    target = SpawnFrom(RootOf(source));
    selectors = PropertiesOf(source);
    index = selectors.length;

    while (index--) {
      selector         = selectors[index];
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

  this.SetType("Thing", function () {
    var AccessorDelimiterMatcher = /\s*[ ,]\s*/;

    function AsSelectorList(specsString_accessorSpecs) {
      return (typeof specsString_accessorSpecs === "string") ?
        specsString_accessorSpecs.split(AccessorDelimiterMatcher) :
        specsString_accessorSpecs;
    }



    this.AddIMethod(function AddAccessor(accessorSignature) {
      var accessor = AccessorFactory.New(accessorSignature).make();
      this.atPutMethod(selector, accessor);
    });

    this.AddIMethod(function AddAccessors(signatures_list) {

    });
  });




//  [^][~][#][&][!]friends[~][&][!][?]
//  [^] ~       [!]friends   [&] * [?]                  getter
//  [^]   [#][&] * friends ~       [?]                  setter
//  [^]    # [&][!]friends   [&][!][?]  ! only 1        write once - uses purse
//  [^]      [&]   friends   [&][!] *   ? is moot       accessor


//  ^ = uppercase ivar name
//  ~ = no setter|getter
//  # = write once
//  & = duplicate before|after access
//  ! = focus bias of return behavior
//  ? = check the arguments and error if problem
//  * = not applicable

//  Need lazy immutable accessors!!!



  AccessorFactory = this.SetType("AccessorFactory", function () {
    var SigMatcher = /((\^)|(~)|(\+)|(&)|(!))*([\w$]+)((~)|(&)|(!)|(\?))/;

    this.AddMethod(function New(accessorSignature) {
      var match = accessorSignature.match(SigMatcher);
      return match ?
        this._super.New(accessorSignature, match) :
        this.AccessorSignatureError(accessorSignature);
    });

    this.AddMethod(function AccessorSignatureError(accessorSignature) {
      return this.SignalError("Accessor signature ", accessorSignature, " is improper!");
    });

    this.AddIMethod(function _Init(validSignature, match) {
      //   2  3  4  5  6    7    9  10 11 12
      //  [^][~][#][&][!]friends[~][&][!][?]
      this._signature          = validSignature;
      this._matchResult        = match;
      this._isUpperCaseName    = match[ 2] === "^";
      this._isNoWriting        = match[ 3] === "~";
      this._isWriteOnce        = match[ 4] === "#";
      this._isCopyOnWrite      = match[ 5] === "&";
      this._isForceForWrites   = match[ 6] === "!"; // isAnswersSelfWhenAsSetter
      this._selector           = match[ 7];

      this._isNoReading        = match[ 9] === "~";
      this._isCopyOnRead       = match[10] === "&";
      this._isForceForReads    = match[11] === "!"; // isAlwaysAnswersValue
      this._isArgChecking      = match[12] === "?";
    });

    this.AddIMethod(function Build() {
      var isReadOnly       = this._isNoWriting;
      var isWriteOnly      = this._isNoReading;
      var isForceForWrites = this._isForceForWrites;
      var isForceForReads  = this._isForceForReads;

      if (isReadOnly && isWriteOnly) {
        return this.CannotBeGetterAndSetterSpecError();
      }
      if (isForceForWrites && isForceForReads) {
        return this.CannotForceBothReturnsSpecError();
      }
      if (this._isArgChecking && (isForceForWrites || isForceForReads)) {
        return this.CannotBeArgCheckingAndForceReturnsSpecError();
      }
      if (isReadOnly) {
        //  [^][~][#][&][!]friends[~][&][!][?]
        //  [^] ~       [!]friends   [&] * [?]
        if (this._isWriteOnce || this._isCopyOnWrite) {
          return this.GetterSpecError();
        }
        return this.BuildGetter();
      }
      if (isWriteOnly) {
        //  [^][~][#][&][!]friends[~][&][!][?]
        //  [^]   [#][&] * friends ~       [?]
        if (this._isCopyOnRead || isForceForReads) {
          return this.SetterSpecError();
        }
        return this.BuildSetter();
      }
      if (this._isWriteOnce) {
        //  [^][~][#][&][!]friends[~][&][!][?]
        //  [^]    # [&][!]friends   [&][!][?]
        return this.BuildWriteOnceAccessor();
      }
      if (isForceForWrites) {
        return this.CannotForceWriteReturnSpecError();
      }
        //  [^][~][#][&][!]friends[~][&][!][?]
        //  [^]      [&]   friends   [&][!] *
      return this.BuildAccessor();
    });


    this.addIMethod(function AccessorAt(canonicalSignature, absentAction_) {
      var accessor = this.SavedAccessor(canonicalSignature);
      return accessor ||
        (absentAction_ ?
          this.SavedAccessor(canonicalSignature, absentAction_.call(this)) :
          null);
    });

    this.addIMethod(function ProtectedSelector() {
      var selector = this._selector;
      var match = selector.match(/^(_?)([a-z])(.*)$/i);
      if (match == null) { return this.ImproperAccessorNameError(selector); }

      var leadChar  = match[2];
      var remaining = match[3];
      var modifier = this._isUpperCaseName ? "toUpperCase" : "toLowerCase";
      var _selector = "_" + leadChar[modifier]() + remaining;
      if (_selector === selector) {
        return this.ProtectedPropertyHasSameNameAsAccessorError(_selector);
      }
      return _selector;
    });


    this.addIMethod(function BuildGetter() {
      //   2  3  4  5  6    7    9  10 11 12
      //  [^] ~       [!]friends   [&] * [?]
      var canonicalSig = this._signature.replace(SigMatcher, "$2~$6$7$10$12");

      return this.AccessorAt(canonicalSig, function () {
        var selector  = this.ProtectedSelector();
        var modifiers = this._signature.replace(SigMatcher, "$6$10$12");
        var a = this._isForceForWrites;
        var b = this._isCopyOnRead;
        var c = this._isArgChecking;

        return modifiers ?
          this.CreateGeneralGetter(selector, a, b, c) :
          this.CreateCommonGetter(selector);
      });
    });

    this.addIMethod(function CreateGeneralGetter(
        _Selector, IsAnswersSelfWhenAsSetter, IsCopyOnRead, IsArgChecking) {
      //  [^] ~       [!]friends   [&] * [?]
      return function __GeneralGetter() {
        var value = this[_Selector];
        if (arguments.length) {
          if (IsArgChecking) { return this.GetterUsedAsSetterError(); }
          if (IsAnswersSelfWhenAsSetter) { return this; }
        }
        return IsCopyOnRead ? Dup(value) : value;
      };
    });

    this.addIMethod(function CreateCommonGetter(_Selector) {
      return function __CommonGetter() {
        return this[_Selector];
      };
    });


    this.addIMethod(function BuildSetter() {
      //   2  3  4  5  6    7    9  10 11 12
      //  [^]   [#][&] * friends ~       [?]
      var canonicalSig = this._signature.replace(SigMatcher, "$2$4$5$7~$12");

      return this.AccessorAt(canonicalSig, function () {
        var selector  = this.ProtectedSelector();
        var modifiers = this._signature.replace(SigMatcher, "$4$5$12");
        var a = this._isWriteOnce;
        var b = this._isCopyOnWrite;
        var c = this._isArgChecking;

        return modifiers ?
          this.CreateGeneralSetter(selector, a, b, c) :
          this.CreateCommonSetter(selector);
      });
    });

    this.addIMethod(function CreateGeneralSetter(
        _Selector, IsWriteOnce, IsCopyOnWrite, IsArgChecking) {
      //  [^]   [#][&] * friends ~       [?]
      return function __GeneralSetter(value) {
        if (arguments.length) {
          if (IsWriteOnce) {
            if (_Selector in this) {
              return IsArgChecking ? this.accessorWriteError() : this;
            }
            var _value = IsCopyOnWrite ? Dup(value) : value;
            return SetImmutableProperty(this, _Selector, _value);
          }
          this[_Selector] = IsCopyOnWrite ? Dup(value) : value;
          return this;
        }
        return IsArgChecking ? this.SetterUsedAsGetterError() : this;
      };
    });

    this.addIMethod(function CreateCommonSetter(_Selector) {
      return function __CommonSetter(value) {
        if (arguments.length) {
          this[_Selector] = value;
        }
        return this;
      };
    });


    this.addIMethod(function BuildWriteOnceAccessor() {
      //   2  3  4  5  6    7    9  10 11 12
      //  [^]    # [&][!]friends   [&][!][?]
      var canonicalSig = this._signature.replace(SigMatcher, "$2#$5$6$7$10$11$12");

      return this.AccessorAt(canonicalSig, function () {
        var selector  = this.ProtectedSelector();
        var modifiers = this._signature.replace(SigMatcher, "$5$6$10$11$12");
        var a = this._isCopyOnWrite;
        var b = this._isForceForWrites;
        var c = this._isCopyOnRead;
        var d = this._isForceForReads;
        var e = this._isArgChecking;

        return modifiers ?
          this.CreateGeneralWriteOnceAccessor(selector, a, b, c, d, e) :
          this.CreateCommonWriteOnceAccessor(selector);
      });
    });

    this.addIMethod(function CreateGeneralWriteOnceAccessor(
        _Selector, IsCopyOnWrite, IsAnswersSelfWhenAsSetter,
        IsCopyOnRead, IsAlwaysAnswersValue, IsArgChecking) {
      //  [^]    # [&][!]friends   [&][!][?]
      return function __GeneralWriteOnceAccessor(value_) {
        var value;
        if (arguments.length) {
          if (_Selector in this) {
            if (IsArgChecking) { return this.accessorWriteError(); }
            if (IsAnswersSelfWhenAsSetter) { return this; }
          }
          else {
            value = IsCopyOnWrite ? Dup(value_) : value_;
            SetImmutableProperty(this, _Selector, value);
            if (!IsAlwaysAnswersValue) { return this; }
          }
        } else {
          value = this[_Selector];
        }
        return IsCopyOnRead ? Dup(value) : value;
      };
    });

    this.addIMethod(function CreateCommonWriteOnceAccessor(_Selector) {
      return function __CommonWriteOnceAccessor(value) {
        return (arguments.length && !(_Selector in this)) ?
           SetImmutableProperty(this, _Selector, value) : this[_Selector];
      };
    });


    this.addIMethod(function BuildAccessor() {
      //   2  3  4  5  6    7    9  10 11 12
      //  [^]      [&]   friends   [&][!] *
      var canonicalSig = this._signature.replace(SigMatcher, "$2$5$7$10$11");

      return this.AccessorAt(canonicalSig, function () {
        var selector  = this.ProtectedSelector();
        var modifiers = this._signature.replace(SigMatcher, "$5$10$11");
        var a = this._isCopyOnWrite;
        var b = this._isCopyOnRead;
        var c = this._isForceForReads;

        return modifiers ?
          this.CreateGeneralAccessor(selector, a, b, c) :
          this.CreateCommonAccessor(selector);
      });
    });

    this.addIMethod(function CreateGeneralAccessor(
        _Selector, IsCopyOnWrite, IsCopyOnRead, IsAlwaysAnswersValue) {
      //  [^]      [&]   friends   [&][!] *
      return function __GeneralAccessor(value_) {
        var value;
        if (arguments.length) {
          value = IsCopyOnWrite ? Dup(value_) : value_;
          this[_Selector] = value;
          if (!IsAlwaysAnswersValue) { return this; }
        } else {
          value = this[_Selector];
        }
        return IsCopyOnRead ? Dup(value) : value;
      };
    });

    this.addIMethod(function CreateCommonAccessor(_Selector) {
      return function __CommonAccessor(value_) {
        return arguments.length ?
          (this[_Selector] = value_, this) : this[_Selector];
      };
    });



  });
});
