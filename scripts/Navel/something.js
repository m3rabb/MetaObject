HandAxe(function (
  $BARRIER, $DELETE_IMMUTABILITY, $INNER, $OUTER, $RIND,
  IMMUTABLE, SYMBOL_1ST_CHAR, SELF_METHOD, VALUE_METHOD, _DURABLES,
  AsRetroactiveProperty, BasicSetInvisibly, NewAssignmentErrorHandler,
  SignalError, _$Something, _BasicSetImmutable, _Super
) {
  "use strict"


  //// TESTING ////

  _$Something.addValueMethod(function isImmutable() {
    return this[IMMUTABLE] || false
  })

  _$Something.addValueMethod(function isPermeable() {
    return (this[$OUTER].this) ? true : false
  })


  _$Something.addValueMethod(function is(value) {
    return (this === value) || (this[$RIND] === value)
  })

  _$Something.addSharedProperty("isSomething", true, "INVISIBLE")

  _$Something.addValueMethod(Symbol.toPrimitive, function (hint) { // eslint-disable-line
    return this.id
  }, "INVISIBLE")




  //// INTRINSIC ////

  _$Something.addRetroactiveValue(function self() {
    return this[$RIND]
  }, "INVISIBLE")

  _$Something.forAddAssigner(_DURABLES,
      NewAssignmentErrorHandler(_DURABLES, "addDurables"))

  _$Something.forAddAssigner(IMMUTABLE,
      NewAssignmentErrorHandler(IMMUTABLE, "beImmutable"))

  _$Something.addValueMethod("_setImmutable", _BasicSetImmutable, "INVISIBLE")


  _$Something.addValueMethod(function _super() { // RetroactiveValue
    const _$target = this[$BARRIER]._$target
    return BasicSetInvisibly(_$target, "_super", new Proxy(_$target, _Super))
  })

  // It's not enough to simple make this method access the receiver's barrier.
  // The receiver only references its original barrier, and there may be more
  // than one proxy/barrier associated with the receiver, so we need to invoke
  // the proxy to force the proper change to occur thru it.
  _$Something.addValueMethod(function _retarget() {
    const $inner = this[$INNER]
    if ($inner[IMMUTABLE]) {
      delete this[$DELETE_IMMUTABILITY]
      return this
    }
    return BasicSetInvisibly($inner, "_retarget", this)
  })
})

/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


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
//        isNil
//        isNothing
//        isThing
//       Thing
//         Type
//
//     Nothing
//        isNothing
//       Nil
//        id
//        isNil


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
