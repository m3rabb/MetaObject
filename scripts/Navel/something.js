HandAxe(function (
  $BARRIER, $OUTER, $RIND, IMMUTABLE, SYMBOL_1ST_CHAR,
  SELF_METHOD, VALUE_METHOD, VISIBLE,
  AsRetroactiveProperty, BasicSetInvisibly, SignalError, _$Something, _Super
) {
  "use strict"


  // addRetroactiveValue
  _$Something._addMethod("self", AsRetroactiveProperty("self", function self() {
    return this[$RIND]
  }), VALUE_METHOD)

  // _$Something.addAlias("$", "self")


  _$Something.addValueMethod(function _super() { // RetroactiveValue
    const _$target = this[$BARRIER]._$target
    return BasicSetInvisibly(_$target, "_super", new Proxy(_$target, _Super))
  })



  _$Something.addValueMethod(function is(value) {
    return (this[$RIND] === value)
  })

  // _$Something.addValueMethod(function is(value) {
  //   return (this === value) || (this[$RIND] === value)
  // })



  _$Something.addValueMethod(function isImmutable() {
    return this[IMMUTABLE] || false
  })


  _$Something.addValueMethod(function isPermeable() {
    return (this[$OUTER].this) ? true : false
  })


  _$Something._addMethod(Symbol.toPrimitive, function (hint) { // eslint-disable-line
    return this.id
  }, VALUE_METHOD)



})


// $Base
//
//   $Something
//      [$IS_INNER] === PROOF
//      id = null
//      IMMUTABLE = null
//
//      $
//      _super
//      _unknownProperty
//      $INNER
//
//      is
//      isPermeable
//      isImmutable
//      isSomething
//      type
//
//     $Intrinsic
//        oid
//        iid
//        uid
//        isA
//        isVoid
//        isNothing
//        isThing
//       Thing
//         Type
//
//     Nothing
//        isNothing
//       Void
//        id
//        isVoid


// *
//   primitive
//     undefined
//     boolean
//     number
//     symbol
//     string
//     null
//   object
//     $Something --> thingy
//       Nothing
//       $Intrinsic
//        Thing
//     jsobject
//      Object


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
