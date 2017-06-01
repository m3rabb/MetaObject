// $Inate methods
//   id
//   _basicSet
//   other basicMethods
//   $
//   _super
//   isPermeable
//   isImmutable|isMutable
//   beImmutable
//   typeMembership methods
//   asMutable|asCopy
//   copying methods
//
// USER CAN/SHOULD NEVER REDEFINE INATE METHODS
//

_$Inate._setDisplayNames("$Outer", "$Inner") // Helps with debugging!!!

_$Inate.addSharedProperty("isPermeable", false)


_$Inate.addLazyProperty(function basicId() {
  return `${this.uid}.${this.type.formalName}`
})


_$Inate.addMethod(function $() {
  const $inner = this[$INNER]

  DefineProperty($inner, "$", InvisibleConfiguration)
  return ($inner[$OUTER].$ = $inner.$ = $inner[$RIND])
}, BASIC_IMMEDIATE)

_$Inate.addMethod(function _super() {
  const $inner = this[$INNER]
  const $super = new Proxy($inner, SuperBehavior)

  DefineProperty($inner, "_super", InvisibleConfiguration)
  return ($inner._super = $super)
}, BASIC_IMMEDIATE)


_$Inate.addMethod(function isImmutable() {
  return this[IS_IMMUTABLE] ? true : false
}, BASIC_IMMEDIATE)

_$Inate.addMethod(function isMutable() {
  return !this[IS_IMMUTABLE]
}, BASIC_IMMEDIATE)

_$Inate.addMethod(function isFact() {
  return this[IS_IMMUTABLE] ? true : (this.id != null)
}, BASIC_IMMEDIATE)



_$Inate.addMethod(function copy(asImmutable_, visited_) {
  const [asImmutable, visited] = (typeof visited_asImmutable_ === "object") ?
    [undefined, visited_asImmutable_] : [visited_asImmutable_, visited__]
  return (this[IS_IMMUTABLE] && asImmutable !== false) ?
    this[$RIND] : Copy(this[$INNER], asImmutable, visited)
}, BASIC_METHOD)

_$Inate.addMethod(function immutableCopy(visited_) {
  return this[IS_IMMUTABLE] ? this[$RIND] : Copy(this[$INNER], true, visited_)
}, BASIC_METHOD)

_$Inate.addMethod(function mutableCopy(visited_) {
  return Copy(this[$INNER], false, visited_)
}, BASIC_METHOD)

_$Inate.addMethod(function mutableCopyExcept(property) {
  return Copy(this[$INNER], false, undefined, property)
}, BASIC_METHOD)

// Thing.add(function _nonCopy() {
//   return (this[IS_FACT] === IMMUTABLE) ? this._newBlank() : this
// })


_$Inate.addMethod(function asCopy() {
  return this[IS_IMMUTABLE] ? this[$RIND] : Copy(this[$INNER], false)
}, BASIC_IMMEDIATE)

_$Inate.addMethod(function asMutableCopy() {
  return Copy(this[$INNER], false)
}, BASIC_IMMEDIATE)

_$Inate.addMethod(function asFact() {
  return this[IS_IMMUTABLE] || (this.id != null) ?
    this[$RIND] : Copy(this[$INNER], true)
}, BASIC_IMMEDIATE)

_$Inate.addMethod(function asImmutable() {
  return this[IS_IMMUTABLE] ? this[$RIND] : Copy(this[$INNER], true)
}, BASIC_IMMEDIATE)

_$Inate.addMethod(function asMutable() {
  return this[IS_IMMUTABLE] ? Copy(this[$INNER], false) : this[$RIND]
}, BASIC_IMMEDIATE)

// ADD ABILITY TO BE IMMUTABLE 'INPLACE'!!!
_$Inate.addMethod(function beImmutable() {
  return this[IS_IMMUTABLE] ? this[$RIND] : BeImmutable(this[$INNER])
}, BASIC_IMMEDIATE)


_$Inate.addMethod(function _setImmutable() {
  const $inner = this[$INNER]
  const $outer = $inner[$OUTER]
  $outer[IS_IMMUTABLE] = $inner[IS_IMMUTABLE] = true
  new ImmutableInner($inner)
  Frost($outer)
  return $inner[$RIND]
}, BASIC_IMMEDIATE)


_$Inate.addMethod(BasicBeImmutable, BASIC_IMMEDIATE)

// _$Inate.addMethod(function basicBeImmutable() {
//   const $inner = this[$INNER]
//   if ($inner[IS_IMMUTABLE]) { return $inner[$RIND] }
//   const $outer = $inner[$OUTER]
//   $outer[IS_IMMUTABLE] = $inner[IS_IMMUTABLE] = true
//   new ImmutableInner($inner)
//   Frost($outer)
//   return $inner[$RIND]
// }, BASIC_IMMEDIATE)






//
// _$Inate.addImmediate(function _captureChanges() {
//   const $inner = this[$INNER]
//   if ($inner[IS_IMMUTABLE]) { delete this._IMMUTABILITY }
//   DefineProperty($inner, "_captureChanges", InvisibleConfiguration)
//   return ($inner._captureChanges = this)
// }, BASIC_IMMEDIATE)
//
//
// _$Inate.addImmediate(function _captureOverwrite() {
//   const $inner = this[$INNER]
//   if ($inner[IS_IMMUTABLE]) { delete this._ALL }
//   DefineProperty($inner, "_captureOverwrite", InvisibleConfiguration)
//   return ($inner._captureOverwrite = this)
// }, BASIC_IMMEDIATE)

// Must we delete the _captureChanges and _captureOverwrite when copying or
// otherwise done using them???
