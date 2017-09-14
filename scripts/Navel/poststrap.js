ObjectSauce(function (
  $OUTER_WRAPPER, $PULP, $RIND, VISIBLE,
  Frost, InterMap, SetAsymmetricProperty, _BasicSetImmutable,
  DefaultContext, OwnKeys, RootContext, _RootContext, $BaseBlanker,
  _$Intrinsic, _$Something, _Context, _Definition, _Nothing, _Thing, _Type,
  OSauce, _OSauce
) {
  "use strict"


  _Type.addDeclaration("_blanker")
  _Type.addDeclaration($OUTER_WRAPPER)    // Ensures method wrappers work!!!
  _Context.addDeclaration($OUTER_WRAPPER) // Ensures method wrappers work!!!


  _Type      ._init("Type"      , undefined, DefaultContext)
  _$Something._init("$Something", []                       )
  _$Intrinsic._init("$Intrinsic", []                       )
  _Nothing   ._init("Nothing"   , []       , RootContext   )
  _Thing     ._init("Thing"     , null     , RootContext   )
  _Definition._init("Definition", undefined, RootContext   )
  _Context   ._init("Context"   , undefined, RootContext   )

  _Type._iidCount = 4
  _Type._basicSet("context", RootContext)
  _RootContext._atPut("Type", _Type[$RIND])

  // Helps with debugging!!!
  _$Something._setDisplayNames("$Intrinsic$Outer", "$Intrinsic$Inner")
  _$Intrinsic._setDisplayNames("$Outer"          , "$Inner"          )

  SetAsymmetricProperty(_$Intrinsic, "isOuter", false, true , VISIBLE)
  SetAsymmetricProperty(_$Intrinsic, "isInner", true , false, VISIBLE)


  // Note: If this was called before the previous declarations,
  // $IMMEDIATES, $ASSIGNERS, constructor, etc, would not be overridable
  // in the descendent $roots.
  Frost($BaseBlanker.$root$outer)
  Frost($BaseBlanker.$root$inner)
  // _BasicSetImmutable.call(_$Intrinsic)
  // _BasicSetImmutable.call(_$Something)


  DefaultContext.oid

  for (var name in OSauce) { _RootContext._atPut(name, OSauce[name]) }

  const  Test = _Context.new("Test", RootContext)
  const _Test = InterMap.get(Test)[$PULP]

  const selectors = OwnKeys(_OSauce)
  selectors.forEach(selector => {
    const value = _OSauce[selector]
    if (value && !value.isInner) { _Test._atPut(selector, value) }
  })

  _RootContext.add(Test)

  ObjectSauce = RootContext
})



/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
