Tranya(function (
  $BARRIER, $OUTER, $RIND, IS_IMMUTABLE, SYMBOL_1ST_CHAR, VALUE_METHOD,
  AsName, SetInvisibly, SignalError, _$Something, _Super,
  PrivateAccessFromOutsideError, UnknownPropertyError
) {
  "use strict"


  _$Something.addRetroactiveValue(function self() {
    return this[$RIND]
  })


  _$Something.addAlias("$", "self")


  _$Something.addValueMethod(function _super() { // RetroactiveProperty
    const _$target = this[$BARRIER]._$target
    return SetInvisibly(_$target, "_super", new Proxy(_$target, _Super))
  })




  _$Something.addValueMethod(Symbol.toPrimitive, function (hint) { // eslint-disable-line
    return this.id
  })


  _$Something.addValueMethod(function is(value) {
    return (this[$RIND] === value)
  })

  // _$Something.addMethod(function is(value) {
  //   return (this === value) || (this[$RIND] === value)
  // }, IDEMPOT_VALUE_METHOD)



  _$Something.addSharedProperty("isSauced", true)



  _$Something.addValueMethod(function isImmutable() {
    return this[IS_IMMUTABLE] || false
  })


  _$Something.addValueMethod(function isPermeable() {
    return (this[$OUTER].this) ? true : false
  })



  _$Something.addMethod(function _unknownProperty(selector, isFromOutside_) {
    if (isFromOutside_) {
      const firstChar = selector[0] || selector.toString()[SYMBOL_1ST_CHAR]
      if (firstChar === "_") {
        return PrivateAccessFromOutsideError(this, selector)
      }
    }
    return UnknownPropertyError(this, selector)
  })


})


// $Base
//
//   $Something
//      [$IS_INNER] === PROOF
//      id = null
//      IS_IMMUTABLE = null
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
