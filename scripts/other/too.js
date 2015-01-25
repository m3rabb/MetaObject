
function CreateCopyHandler(PropertyName, value) {
  if (value instanceof Thing) {
    return function () {
      return this[PropertyName].copy();
    };
  }
  if (typeof value_ === "object") {
    if (Array_isArray(value_)) { return Array_slice; }
    if (value_ !== null)  { return Duplicate; }
  }
  return Yourself;
}

function GetAccessorFamily(propertyName) {
  return AccessorFamilies[propertyName] || (AccessorFamilies[propertyName] = NewStash());
}

function GetBasicGetter(PropertyName) {
  var accessorFamily = GetAccessorFamily(PropertyName);
  return accessorFamily.basic || (accessorFamily.basic = function () {
    return this[PropertyName];
  });
}

function DispatchFrom(value, thingAction, arrayAction, objectAction, primitiveAction) {
  var accessorFamily = GetAccessorFamily(PropertyName);

  if (value instanceof Thing) { return thingAction(); }
  if (typeof value_ === "object") {
    if (Array_isArray(value_)) { return arrayAction(); }
    if (value_ !== null)  { return objectAction(); }
  }
  return primitiveAction();
}

function AccessorAtIfAbsent(accessorFamily, namedFunction) {
  var type = namedFunction.name;
  var accessor = accessorFamily[type];
  if (accessor) { return accessor; }
  return accessorFamily[type] = namedFunction;
}





function CreateBasicAccessor(PropertyName) {
  return function (value_) {
    return (arguments.length) ?
      (this[PropertyName] = value_, this) : this[PropertyName];
  }
}

function CreateThingCopyingAccessor(PropertyName, IsCopyOnWrite, IsCopyOnRead) {
  if (IsCopyOnWrite) {
    if (IsCopyOnRead) {
      return function (value_) {
        return (arguments.length) ?
          (this[PropertyName] = value_.copy(), this) :
          this[PropertyName].copy();
      }
    }
    return function (value_) {
      return (arguments.length) ?
        (this[PropertyName] = value_.copy(), this) : this[PropertyName];
    }
  }
  return function (value_) {
    return (arguments.length) ?
      (this[PropertyName] = value_, this) : this[PropertyName].copy();
    }
  }
}

function CreateArrayCopyingGetter(PropertyName) {
  return function () {
    return this[PropertyName].slice();
  }
}

function CreateObjectCopyingGetter(PropertyName) {
  return function () {
    return Duplicate(this[PropertyName]);
  }
}



function AccessorFactory(copyingGetterFunction) {
  this._Repo = NewStash();
  this._CopyingGetterFunction = copyingGetterFunction;
}

AccessorFactory.prototype.getter = function (propertyName, IsCopying) {
  return this._Repo[propertyName] ||
    (this._Repo[propertyName] = this._CopyingGetterFunction(propertyName));
}


function BaseTypeOf(target) {
  if (value instanceof Thing) { return "thing"; }
  if (typeof value_ === "object") {
    if (Array_isArray(value)) { return "array"; }
    if (value_ !== null)  { return "object"; }
  }
  return "primitive";
}

function GetCopyingGetter(propertyName, value) {
  return CopyingGetters[BaseTypeOf(value)].get(propertyName);
}


// IsWriteOnce, IsNonChecking
function CreateWriteOnceNoArgCheckAccessor(Selector, IsCopyOnWrite, IsCopyOnRead) {
  var PropertyName = AsPrivateProperty(Selector);

  return function (value_) {
    var accessor;
    if (arguments.length) {
      accessor = (IsCopyOnRead || IsCopyOnWrite) ?
        GetCopyingGetter(propertyName, value_) :
        GetBasicGetter(propertyName);
      this[PropertyName] = IsCopyOnWrite ? accessor.call(value_) : value_;
      this[Selector] = accessor;
      return this;
    }
    return undefined;
  };
}

// IsWriteOnce, IsNonChecking
function CreateWriteOnceArgCheckAccessor(Selector, IsCopyOnWrite, IsCopyOnRead) {
  var PropertyName = AsPrivateProperty(Selector);

  return function (value_) {
    var accessor;
    if (arguments.length) {
      if (this.hasOwnProperty(PropertyName)) { return this.setterError(); }
      if (IsCopyOnRead || IsCopyOnWrite) {
        accessor = GetCopyingArgCheckAccessor(propertyName, value_);
        this[PropertyName] = IsCopyOnWrite ? accessor.call(value_) : value_;
        this[Selector] = accessor;
      } else {
        this[PropertyName] = value_;
      }
      return this;
    }
    return this[PropertyName];
  };
}
