=== Older

function NewBlanker(rootBlanker, permeability_, maker_) {
  const root$root$inner = rootBlanker.$root$inner
  const root$root$outer = rootBlanker.$root$outer
  const root$supers     = root$root$inner[$SUPERS]

  const blankerMaker    = maker_        || rootBlanker.maker
  const permeability    = permeability_ || Impermeable

  const $root$inner     = SpawnFrom(root$root$inner)
  const $root$outer     = SpawnFrom(root$root$outer)
  // Note: The blanker function must be unnamed in order for the debugger to
  // display the type of instances using type name determined by the name of
  // its constructor function property.
  const OuterBlanker   = NewNamelessVacuousFunc()
  const Blanker        = blankerMaker(OuterBlanker, permeability)
                         // Should this simply inherit from null!!!???
  const supers         = SpawnFrom(root$supers)
  supers[$IMMEDIATES]  = SpawnFrom(root$supers[$IMMEDIATES])

  Blanker.maker             = blankerMaker
  Blanker.permeability      = permeability
  Blanker.prototype         = $root$inner
  Blanker.$root$inner       = $root$inner
  Blanker.$root$outer       = $root$outer
  OuterBlanker.prototype    = $root$outer

  $root$inner[$OUTER]       = $root$outer
  $root$inner[$SUPERS]      = supers
  $root$inner[$SET_LOADERS] = SpawnFrom(root$root$inner[$SET_LOADERS])
  $root$inner[$IMMEDIATES]  = SpawnFrom(root$root$inner[$IMMEDIATES])
  $root$outer[$IMMEDIATES]  = SpawnFrom(root$root$outer[$IMMEDIATES])
  $root$inner[$BLANKER]     = Blanker

  InterMap.set(Blanker, BLANKER_FUNC)
  return Frost(Blanker)
}

function _PreInitType(func, $inner, $outer, permeability) {
  const mutability = new TypeInner($inner)
  const $pulp      = new Proxy(func, mutability)
  mutability.$pulp = $pulp
  const porosity   = new TypeOuter($pulp, $outer, permeability)
  const $rind      = new Proxy(func, porosity)
  // const $rind           = new Proxy(NewAsFact, privacyPorosity)

  $inner._disguisedFunc = func
  $inner[$INNER] = $inner
  $inner[$OUTER] = $outer
  $inner[$RIND]  = $rind
  $outer[$RIND]  = $rind
  InterMap.set($rind, $inner)
  // this[$PULP]  = new Proxy(NewAsFact, mutability)
  InterMap.set($pulp, TYPE_PULP)
  return ($inner[$PULP] = $pulp)
}

_Type.addMethod(function asPermeable() {
  const type$inner   = this[$INNER]
  const type$outer   = type$inner[$OUTER]
  const blanker      = type$inner._blanker

  const type$inner_  = SpawnFrom(type$inner)
  const type$outer_  = SpawnFrom(type$outer)
  const typeName_    = type$inner.name + "_"
  const func_        = NewVacuousConstructor(typeName_)
  const permeability = type$inner.isPermeable ? Permeable : Impermeable

  const type$pulp_ = _PreInitType(func_, type$inner_, type$outer_, permeability)

  type$inner_._blanker = NewBlanker(blanker, Permeable)

  type$pulp_._initCoreIdentity(name)
  type$pulp_.addSharedProperty("isPermeable", true)

  DefineProperty(type$inner, "asPermeable", InvisibleConfiguration)
  return (this.asPermeable = type$inner_[$RIND])
}, BASIC_VALUE_IMMEDIATE)


_Type.addMethod(function asImpermeable() {
  const $inner       = this[$INNER]
  const permeability = $inner._blanker.permeability
  const $primary     = (permeability === Impermeable) ? $inner : RootOf($inner)

  DefineProperty(primary, "asImpermeable", InvisibleConfiguration)
  return ($primary[$PULP].asImpermeable = $primary[$RIND])
}, BASIC_VALUE_IMMEDIATE)



===

The handler for the outer proxy normally references either the fixed outer object: Impermeable, or Permeable.  If a type's new method is overridden, it should change is _blanker to always attach a new copy of the Impermeable handler object, and then if the target object is made permeable, it changes the get/set methods of its copy of the impermeable handler object to behave as
permeable.
