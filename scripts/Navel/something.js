Tranya(function (
  $BARRIER, $OUTER, $RIND, IDEMPOT_VALUE_METHOD, IS_IMMUTABLE,
  TRUSTED_VALUE_METHOD,
  AsName, SetInvisibly, SignalError, _$Something, _Super
) {
  "use strict"


  _$Something.addRetroactiveProperty(function $() {
    return this[$RIND]
  }, IDEMPOT_VALUE_METHOD)



  _$Something.addMethod(function _super() { // RetroactiveProperty
    const _$target = this[$BARRIER]._$target
    return SetInvisibly(_$target, "_super", new Proxy(_$target, _Super))
  }, IDEMPOT_VALUE_METHOD)




  _$Something.addMethod(Symbol.toPrimitive, function (hint) { // eslint-disable-line
    return this.id
  }, TRUSTED_VALUE_METHOD)


  _$Something.addMethod(function is(value) {
    return (this[$RIND] === value)
  }, IDEMPOT_VALUE_METHOD)

  // _$Something.addMethod(function is(value) {
  //   return (this === value) || (this[$RIND] === value)
  // }, IDEMPOT_VALUE_METHOD)



  _$Something.addSharedProperty("isSauced", true)



  _$Something.addMethod(function isImmutable() {
    return this[IS_IMMUTABLE] || false
  }, IDEMPOT_VALUE_METHOD)


  _$Something.addMethod(function isPermeable() {
    return (this[$OUTER].this) ? true : false
  }, IDEMPOT_VALUE_METHOD)



  _$Something.addMethod(function _unknownProperty(selector) {
    return SignalError(this, `Receiver ${this.id} doesn't have a property: ${AsName(selector)}!!`)
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
