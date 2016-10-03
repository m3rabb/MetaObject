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
