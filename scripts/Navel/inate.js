// $Inate methods
//   id
//   _basicSet
//   $
//   _super
//   isPermeable
//   isImmutable
//   beImmutable
//   other basicMethods
//   typeMembership methods
//   asMutable
//
// USER CAN/SHOULD NEVER REDEFINE INATE METHODS
//

_$Inate._setDisplayNames("$Outer", "$Inner") // Helps with debugging!!!

_$Inate.addSharedProperty("isPermeable", false)

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
