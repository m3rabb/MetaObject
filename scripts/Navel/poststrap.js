HandAxe(function (
  $INNER, $OUTER_WRAPPER, $PULP, $RIND, INHERIT, INVISIBLE,
  $BaseBlanker, $IntrinsicBlanker, BasicSetInvisibly, DeclareImmutable,
  FreezeSurface, InterMap, ImplementationSelectors, IsPublicSelector,
  SetAsymmetricProperty, SpawnFrom,
  TheEmptyArray, _$DefaultContext, _$Intrinsic, _$Something, _BasicSetImmutable,
  _RootContext, _Context, _Definition, _Nothing, _Thing, _Type, _OwnKeysOf,
  DefaultContext, RootContext,
  Shared, _Shared
) {
  "use strict"


  // Are these declarations still necessary???
  _Type.addDeclaration($OUTER_WRAPPER)    // Ensures method wrappers work!!!
  _Context.addDeclaration($OUTER_WRAPPER) // Ensures method wrappers work!!!


  const ThingAncestry = DeclareImmutable([_Thing[$RIND]])
  const BasicSet      = $IntrinsicBlanker.$root$inner._basicSet

  const  TestContext  = _Context.new("_Implementation", RootContext)
  const _TestContext  = InterMap.get(TestContext)[$PULP]


  function BootstrapType(_type, name, isRootType, spawnIntoRoot, isHidden) {
    const supertypes = isRootType ? TheEmptyArray : ThingAncestry
    const ancestry   = _type._buildAncestry(supertypes)
    const context    = isHidden ? _TestContext : _RootContext
    const type       = _type[$RIND]

    // The order of the following is intentional.
    _type._setSupertypesAndAncestry(supertypes, ancestry, INHERIT)
    _type.setName(name)
    _type.addSharedProperty("type", type, "INVISIBLE")
    BasicSet.call(_type, "context", RootContext)
    context._atPut(name, type)
    if (spawnIntoRoot) {
      _type.addSharedProperty("context", RootContext, "INVISIBLE")
    }
  }

  _$Something.addSharedProperty("context", DefaultContext, "INVISIBLE")
  //               type         name     isRootType, spawnIntoRoot, isHidden
  BootstrapType(_$Something, "$Something", true ,       false,       true )
  BootstrapType(_$Intrinsic, "$Intrinsic", true ,       false,       true )
  BootstrapType(_Nothing   , "Nothing"   , true ,       true ,       false)
  BootstrapType(_Thing     , "Thing"     , true ,       false,       false)
  BootstrapType(_Type      , "Type"      , false,       false,       false)
  BootstrapType(_Definition, "Definition", false,       true ,       false)
  BootstrapType(_Context   , "Context"   , false,       true ,       false)


  // Used to provide good "type" naming in the debugger.
  _$Something._setDisplayNames("Base")
  _$Intrinsic._setDisplayNames("Shared")

  SetAsymmetricProperty(_$Intrinsic, "isOuter", false, true )
  SetAsymmetricProperty(_$Intrinsic, "isInner", true , false)


  // Note: If this was called before the previous declarations,
  // $IMMEDIATES, $ASSIGNERS, constructor, etc, would not be overridable
  // in the descendent $roots.
  FreezeSurface($BaseBlanker.$root$outer)
  FreezeSurface($BaseBlanker.$root$inner)
  DeclareImmutable($BaseBlanker)

  BasicSetInvisibly(_$DefaultContext, "iid", 0, "SET OUTER TOO")
  RootContext.iid

  for (var name in Shared) { _RootContext._atPut(name, Shared[name]) }

  _OwnKeysOf(_Shared).forEach(selector => {
    const value = _Shared[selector]
    if (!_RootContext.valueIsInner(value)) {
      _TestContext._atPut(selector, value)
      if (selector[0] === "$" && typeof value === "symbol") {
        ImplementationSelectors[value] = true
      }
    }
  })

  _OwnKeysOf(Object.prototype).forEach(sel => {
    if (!IsPublicSelector(sel)) { ImplementationSelectors[sel] = true }
  })

  _RootContext.add(DefaultContext)
  _RootContext.add(TestContext)
  _RootContext.atPut("_", TestContext)

  HandAxe = RootContext
})



/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
