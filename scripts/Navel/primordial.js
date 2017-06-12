_$Primordial.addMethod(function $() {
  const $inner = this[$INNER]
  const $rind  = $inner[$RIND]

  DefineProperty($inner, "$", InvisibleConfiguration)
  if (!$inner[IS_IMMUTABLE]) { $inner[$OUTER].$ = $rind }
  return ($inner.$ = $rind)
}, BASIC_VALUE_IMMEDIATE)


_$Primordial.addMethod(function _super() {
  const $inner = this[$INNER]
  const $super = new Proxy($inner, SuperBehavior)

  DefineProperty($inner, "_super", InvisibleConfiguration)
  return ($inner._super = $super)
}, BASIC_VALUE_IMMEDIATE)



_$Primordial.addMethod(function _unknownProperty(property) {
  return SignalError(this, `Receiver ${this.id} doesn't have a property: ${AsName(property)}!!`)
})



_$Primordial.addMethod(function is(value) {
  return (this === value) || (this[$RIND] === value)
}, BASIC_VALUE_METHOD)


_$Primordial.addMethod(function isPermeable() {
  return (this[$PERMEABILITY] === Permeable)
}, BASIC_VALUE_IMMEDIATE)

_$Primordial.addMethod(function isImmutable() {
  return this[IS_IMMUTABLE] ? true : false
}, BASIC_VALUE_IMMEDIATE)



// $Base
//
//   $Primordial
//      $SECRET = $inner
//      _unknownProperty
//
//      $
//      _super
//
//      id = null
//      IS_IMMUTABLE = null
//      $PERMEABILITY
//      is
//      isPermeable
//      isImmutable
//      type
//
//     $Innate|$Thing
//         oid
//         iid
//         uid
//         isA
//        isVoid
//        isNothing
//        isThing
//       Thing
//          _unknownProperty
//         Type
//
//     Nothing
//        _unknownProperty
//        isNothing
//       Void
//        id
//        isVoid



/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
