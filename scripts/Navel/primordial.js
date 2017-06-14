

_$Primordial.addRetroactiveProperty(function $() {
  return this[$RIND]
}, BASIC_VALUE_METHOD)


_$Primordial.addRetroactiveProperty(function _super() {
  return new Proxy(this[$INNER], SuperBehavior)
}, BASIC_VALUE_METHOD)



_$Primordial.addMethod(function _unknownProperty(property) {
  return SignalError(this, `Receiver ${this.id} doesn't have a property: ${AsName(property)}!!`)
})



_$Primordial.addMethod(function is(value) {
  return (this === value) || (this[$RIND] === value)
}, BASIC_VALUE_METHOD)


_$Primordial.addMethod(function isPermeable() {
  return (this[$PERMEABILITY] === Permeable)
}, BASIC_VALUE_METHOD)

_$Primordial.addMethod(function isImmutable() {
  return this[IS_IMMUTABLE] ? true : false
}, BASIC_VALUE_METHOD)


// _$Primordial._setImmutable()

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
//     $Intrinsic|$Thing
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
