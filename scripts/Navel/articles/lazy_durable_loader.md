Show prior straightforward versions

===

_$Intrinsic.addMethod(function _getLazyId(name, setter) {
  const $inner = this[$INNER]

  if ($inner[IS_IMMUTABLE]) {
    // Will set the $inner uid even on an immutable object!!!
    return $inner[name] || ($inner[name] = setter())
  }

  const value = setter()
  DefineProperty($inner, name, InvisibleConfiguration)
  return ($inner[$OUTER][name] = $inner[name] = value)
}, BASIC_VALUE_METHOD)

_$Intrinsic.addMethod(function uid() {
  return this._getLazyId(
    "uid", () => this._hasOwn("guid") ? this.guid : NewUniqueId())
}, BASIC_VALUE_IMMEDIATE)

_$Intrinsic.addMethod(function iid() {
  return this._getLazyId(
    "iid", () => InterMap.get(this.type)[$PULP]._nextIID)
}, BASIC_VALUE_IMMEDIATE)


====

function AsDurableProperty(PropertyName, Loader) {
  const name = `${AsName(PropertyName)}_$durable`
  return {
    [name] : function () {
      const $inner = this[$INNER]

      if ($inner[IS_IMMUTABLE]) {
        return $inner[Property] || ($inner[PropertyName] = Loader())
      }

      DefineProperty($inner, PropertyName, InvisibleConfiguration)
      return InSetProperty($inner, PropertyName, Loader(), this)
    }
  }[name]
}

_$Intrinsic.addDurableProperty(function uid() {
  return this._hasOwn("guid") ? this.guid : NewUniqueId())
}, BASIC_VALUE_METHOD)


_Type.addMethod(function addDurableProperty(property_loader, loader_, mode__) {
  // Will set the $inner property even on an immutable object!!!
  const [property, loader, mode = STANDARD_METHOD] =
    (typeof property_loader === "function") ?
      [property_loader.name, property_loader, loader_] :
      [property_loader     , loader_        , mode__ ]

  this.addMethod(property, AsDurableProperty(property, loader), mode)
})
