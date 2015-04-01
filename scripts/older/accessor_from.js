

    var CopyOnReadPureGetterFor = AsMemoizing(function (_Selector) {
      return function () { return Dup(this[_Selector]); };
    });

    var PureGetterFor = AsMemoizing(function (_Selector) {
      return function () { return this[_Selector]; };
    });


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

        this._immutablePropertyAtPut(Selector, value);
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
