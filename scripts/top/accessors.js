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
    if (value != null) {
      if (that[ThingMarker]) { return value.copy(); }
      else if (typeof value === "object") {
        return IsArray(value) ? value.slice() : CopyObject(value);
      }
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
      var accessor = AccessorFactory.Make(accessorSignature);
      this.atPutMethod(selector, accessor);
    });

    this.AddIMethod(function AddAccessors(signatures_list) {

    });
  });



  //   2  3  4  5   6 7 8  9  10   11     13 14 15 16     RegExp Grouping
  //  [~][#][&][!] [^]([_][$](a)ccessor) [~][&][!][?]     Guide
  //
  //   ~       [!] [^]([_][$](a)ccessor)    [&] - [?]     getter
  //      * [&] -  [^]([_] * (a)ccessor)  ~       [?]     setter
  //      + [&] |  [^]([_] + (a)ccessor)    [&][!][?]     write once
  //        [&]    [^]([_]   (a)ccessor)    [&][!] -      accessor


  //  ~  = no setter|getter. never on bothsides
  //  #  = write once
  //  &  = duplicate before|after access
  //  !  = focus bias of return behavior. never on bothsides
  //  ^  = uppercase ivar name
  //  _  = underscore prefixed
  //  $  = immutable prefixed
  //  ?  = check the arguments and error if problem. may overshadow ! focus bias

  //     = illegal option
  //  [] = optional
  //  -  = not applicable
  //  *  = none, one, or both a # and/or $ prefix
  //  +  =       one, or both a # and/or $ prefix
  //  |  = not applicable, but never when has ! as a suffix




  AccessorFactory = this.SetType("AccessorFactory", function () {
    var SIG_MATCHER =
      /((~)|(#)|(&)|(!)|(\^))*((_*)(\$?)([a-z])([\w$]*))((~)|(&)|(!)|(\?))*/i;
      // Visualize SIG_MATCHER in regexper.com via http://bit.ly/1yGt52x

    var AccessorRepo = NewStash();

    function AccessorAt(canonicalSignature, absentAction_) {
      var accessor = AccessorRepo[canonicalSignature];
      if (accessor) { return accessor; }
      if (absentAction_) {
        return (AccessorRepo[canonicalSignature] = absentAction_.call(this));
      }
      return null;
    }

    this.AddMethod(function Make(accessorSignature) {
      return this.New(accessorSignature).Make();
    });

    this.AddMethod(function New(accessorSignature) {
      var match = accessorSignature.match(SIG_MATCHER);
      return match ?
        this._super.New(accessorSignature, match) :
        this.AccessorSignatureError(accessorSignature);
    });

    this.AddIMethod(function _Init(validSignature, match) {
      //   2  3  4  5   6 7 8  9  10   11     13 14 15 16     RegExp Grouping
      //  [~][#][&][!] [^]([_][$](a)ccessor) [~][&][!][?]     Guide
      this._signature        = validSignature;
      this._match            = match;

      this._prefixes         = match[ 1];
      this._isNoWriting      = match[ 2] === "~"; // isReadOnly
      this._isWriteOnce      = match[ 3] === "#";
      this._isCopyOnWrite    = match[ 4] === "&";
      this._isForceForWrites = match[ 5] === "!"; // AlwaysAnswerSelfWhenSetter
      this._isUpperCaseName  = match[ 6] === "^";

      this._accessorName     = match[ 7];
      this._underscores      = match[ 8];
      this._isImmutable      = match[ 9] === "$";
      this._leadChar         = match[10];
      this._remaining        = match[11];

      this._suffixes         = match[12];
      this._isNoReading      = match[13] === "~"; // isWriteOnly
      this._isCopyOnRead     = match[14] === "&";
      this._isForceForReads  = match[15] === "!"; // AlwaysAnswersValue
      this._isArgChecking    = match[16] === "?";
    });

    this.AddMethod(function AccessorSignatureError(accessorSignature) {
      return this.SignalError("Accessor signature ", accessorSignature, " is improper!");
    });


    this.AddIMethod(function Make() {
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
      if (isReadOnly) {
        //  [~][#][&][!] [^]([_][$](a)ccessor) [~][&][!][?]
        //   ~       [!] [^]([_][$](a)ccessor)    [&] - [?]     getter
        if (this._isWriteOnce || this._isCopyOnWrite) {
          return this.GetterSpecError();
        }
        return this.MakeGetter();
      }
      if (isWriteOnly) {
        //  [~][#][&][!] [^]([_][$](a)ccessor) [~][&][!][?]
        //      * [&] -  [^]([_] * (a)ccessor)  ~       [?]     setter
        if (this._isCopyOnRead || isForceForReads) {
          return this.SetterSpecError();
        }
        return this.MakeSetter();
      }
      if (this._isWriteOnce) {
        //  [~][#][&][!] [^]([_][$](a)ccessor) [~][&][!][?]
        //      + [&] |  [^]([_] + (a)ccessor)    [&][!][?]     write once
        return this.MakeWriteOnceAccessor();
      }
      if (isForceForWrites) {
        return this.CannotForceWriteReturnSpecError();
      }
        //  [~][#][&][!] [^]([_][$](a)ccessor) [~][&][!][?]
        //        [&]    [^]([_]   (a)ccessor)    [&][!] -      accessor
      return this.MakeAccessor();
    });



    this.addIMethod(function AccessorAt(canonicalSignature, absentAction_) {
      return AccessorAt.call(this, canonicalSignature, absentAction_);
    });


    this.addIMethod(function PropertyName() {
      var leadChar = this._isUpperCaseName ?
        this._leadChar.toUpperCase() : this._leadChar.toLowerCase();
      var mutability = (this._isWriteOnce || this._isImmutable) ? "$" : "";
      var remaining = this._remaining;
      var propertyName = "_" + mutability + leadChar + remaining;
      if (propertyName === this._accessorName) {
        return this.ProtectedPropertyHasSameNameAsAccessorError();
      }
      return propertyName;
    });


    this.addIMethod(function MakeGetter() {
      //   2  3  4  5   6 7 8  9  10   11     13 14 15 16
      //  [~][#][&][!] [^]([_][$](a)ccessor) [~][&][!][?]
      //   ~       [!] [^]([_][$](a)ccessor)    [&] - [?]
      var Signature    = this._signature;
      var PropertyName = this.PropertyName();
      var pattern      = "~$5" + PropertyName + "$14$16";
      var canonicalSig = Signature.replace(SIG_MATCHER, pattern);

      return this.AccessorAt(canonicalSig, function () {
        var a = this._isForceForWrites;
        var b = this._isCopyOnRead;
        var c = this._isArgChecking;

        return (a || b || c) ?
          this.NewGeneralGetter(PropertyName, a, b, c) :
          this.NewCommonGetter(PropertyName);
      });
    });

    this.addIMethod(function NewGeneralGetter(
        _Name, AlwaysAnswerSelfWhenSetter, IsCopyOnRead, IsArgChecking) {
        //  ~[!]accessor[&][?]
      return function __GeneralGetter() {
        var value = this[_Name];
        if (arguments.length) {
          if (IsArgChecking) { return this.GetterUsedAsSetterError(); }
          if (AlwaysAnswerSelfWhenSetter) { return this; }
        }
        return IsCopyOnRead ? Dup(value) : value;
      };
    });

    this.addIMethod(function NewCommonGetter(_Name) {
      return function __CommonGetter() {
        return this[_Name];
      };
    });


    this.addIMethod(function MakeSetter() {
      //   2  3  4  5   6 7 8  9  10   11     13 14 15 16
      //  [~][#][&][!] [^]([_][$](a)ccessor) [~][&][!][?]
      //      * [&] -  [^]([_] * (a)ccessor)  ~       [?]
var Signature    = this._signature;
      var PropertyName = this.PropertyName();
      var pattern      = "$4" + PropertyName + "~$16";
      var canonicalSig = Signature.replace(SIG_MATCHER, pattern);

      return this.AccessorAt(canonicalSig, function () {
        var a = this._isWriteOnce || this._isImmutable;
        var b = this._isCopyOnWrite;
        var c = this._isArgChecking;

        return (a || b || c) ?
          this.NewGeneralSetter(PropertyName, a, b, c) :
          this.NewCommonSetter(PropertyName);
      });
    });

    this.addIMethod(function NewGeneralSetter(
        _Name, IsWriteOnce, IsCopyOnWrite, IsArgChecking) {
        //  {#}[&]{$}accessor~[?]
      return function __GeneralSetter(value) {
        if (arguments.length) {
          if (IsWriteOnce) {
            if (_Name in this) {
              return IsArgChecking ? this.AccessorWriteError() : this;
            }
            var _value = IsCopyOnWrite ? Dup(value) : value;
            return SetImmutableProperty(this, _Name, _value);
          }
          this[_Name] = IsCopyOnWrite ? Dup(value) : value;
          return this;
        }
        return IsArgChecking ? this.SetterUsedAsGetterError() : this;
      };
    });

    this.addIMethod(function NewCommonSetter(_Name) {
      return function __CommonSetter(value) {
        if (arguments.length) {
          this[_Name] = value;
        }
        return this;
      };
    });


    this.addIMethod(function MakeWriteOnceAccessor() {
      //   2  3  4  5   6 7 8  9  10   11     13 14 15 16
      //  [~][#][&][!] [^]([_][$](a)ccessor) [~][&][!][?]
      //      + [&] |  [^]([_] + (a)ccessor)    [&][!][?]
      var Signature    = this._signature;
      var PropertyName = this.PropertyName();
      var pattern      = "$4" + PropertyName + "$14$15$16";
      var canonicalSig = Signature.replace(SIG_MATCHER, pattern);

      return this.AccessorAt(canonicalSig, function () {
        var a = this._isCopyOnWrite;
        var b = this._isCopyOnRead;
        var c = this._isForceForReads;
        var d = this._isArgChecking;

        if (a || b || d) {
          return this.NewGeneralWriteOnceAccessor(PropertyName, a, b, c, d);
        }
        return c ?
          this.NewValueWriteOnceAccessor(PropertyName, this._accessorName) :
          this.NewCommonWriteOnceAccessor(PropertyName);
      });
    });

    this.addIMethod(function NewGeneralWriteOnceAccessor(
        _Name, IsCopyOnWrite, IsCopyOnRead, AlwaysAnswersValue, IsArgChecking) {
        //  {#}[&][!]{$}accessor[&][!][?]
      return function __GeneralWriteOnceAccessor(value_) {
        var value;
        if (arguments.length) {
          if (_Name in this) {
            return IsArgChecking ? this.AccessorWriteError() : this;
          }
          value = IsCopyOnWrite ? Dup(value_) : value_;
          SetImmutableProperty(this, _Name, value);
          if (!AlwaysAnswersValue) { return this; }
        } else {
          value = this[_Name];
        }
        return IsCopyOnRead ? Dup(value) : value;
      };
    });


    function NewImmutableAccessor(_Name) {
      return AccessorAt(_Name, function () {
        return function __ImmutableGetter() {
          return this[_Name];
        };
      });
    }

    this.addIMethod(function NewValueWriteOnceAccessor(_Name, Name) {
      return function __WriteOnceValueAccessor(value_) {
        if (arguments.length) {
          SetImmutableProperty(this, _Name, value_);
          SetImmutableProperty(this, Name, NewImmutableAccessor(_Name));
          return value_;
        }
        return this[_Name];
      };
    });

    this.addIMethod(function NewCommonWriteOnceAccessor(_Name) {
      return function __CommonWriteOnceAccessor(value_) {
        return (arguments.length) ?
          ((_Name in this) ? this : SetImmutableProperty(this, _Name, value_)) :
          this[_Name];
      };
    });



    this.addIMethod(function MakeAccessor() {
      //   2  3  4  5   6 7 8  9  10   11     13 14 15 16
      //  [~][#][&][!] [^]([_][$](a)ccessor) [~][&][!][?]
      //        [&]    [^]([_]   (a)ccessor)    [&][!] -
      var Signature    = this._signature;
      var PropertyName = this.PropertyName();
      var pattern      = "$4" + PropertyName + "$14$15";
      var canonicalSig = Signature.replace(SIG_MATCHER, pattern);

      return this.AccessorAt(canonicalSig, function () {
        var a = this._isCopyOnWrite;
        var b = this._isCopyOnRead;
        var c = this._isForceForReads;

        if (a || b) { return this.NewGeneralAccessor(PropertyName, a, b, c); }
        if (c)      { return this.NewValueAccessor(PropertyName); }
                      return this.NewCommonAccessor(PropertyName);
      });
    });

    this.addIMethod(function NewGeneralAccessor(
        _Name, IsCopyOnWrite, IsCopyOnRead, AlwaysAnswersValue) {
        //  [$]accessor[$][?]
      return function __GeneralAccessor(value_) {
        var value;
        if (arguments.length) {
          value = IsCopyOnWrite ? Dup(value_) : value_;
          this[_Name] = value;
          if (!AlwaysAnswersValue) { return this; }
        } else {
          value = this[_Name];
        }
        return IsCopyOnRead ? Dup(value) : value;
      };
    });

    this.addIMethod(function NewValueAccessor(_Name) {
      return function __ValueAccessor(value_) {
        return arguments.length ? (this[_Name] = value_) : this[_Name];
      };
    });

    this.addIMethod(function NewCommonAccessor(_Name) {
      return function __CommonAccessor(value_) {
        return arguments.length ? (this[_Name] = value_, this) : this[_Name];
      };
    });


  });
});
