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



_$Primordial.addMethod(function is(something) {
  return (this === something) || (this[$RIND] === something)
}, BASIC_VALUE_METHOD)



// $Base
//
//   $Primordial
//      $SECRET = $inner
//      NoSuchPropertyError
//
//      $
//      _super
//
//      id = null
//      IS_IMMUTABLE = null
//      is
//      type
//
//     $Inate|$Thing
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
