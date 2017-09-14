ObjectSauce(function (
  $ASSIGNERS, $BARRIER, $IMMEDIATES, $IS_CONTEXT, $IS_DEFINITION, $IS_INNER,
  $IS_TYPE, $OUTER, $PULP, $RIND, $SUPERS,
  IMPLEMENTATION, INVISIBLE, IS_IMMUTABLE, PROOF,
  VISIBLE, _DURABLES,
  IDEMPOT_SELF_METHOD, IDEMPOT_VALUE_METHOD, TRUSTED_VALUE_METHOD,
  AlwaysSelf, DefineProperty, InterMap, InvisibleConfig, MarkFunc, NewBlanker,
  NewInner, NewVacuousConstructor, RootOf, SetInvisibly, TheEmptyArray,
  SpawnFrom,
  Context_apply, Type_apply,

  AddMethod, Context_atPut, Context_init, Definition_init,
  _BasicNew, _BasicSetImmutable, SetDefinition, _SetDefinitionAt,
  OSauce, _OSauce
) {
  "use strict"


  const $BaseBlanker = {
    innerMaker        : NewInner,
    $root$outer : {
      __proto__       : null,
      constructor     : NewVacuousConstructor("$Something$outer"), // ???
      [$IMMEDIATES]   : null, // emptyObject,
    },
    $root$inner : {
      __proto__       : null,
      constructor     : NewVacuousConstructor("$Something$inner"), // ???
      [$IMMEDIATES]   : null, // emptyObject,
      [$ASSIGNERS]    : null, // emptyObject,
      [$SUPERS]       : {
        __proto__        : null,
        [$IMMEDIATES]    : null, // emptyObject,
        [$PULP]          : IMPLEMENTATION,
      },
    },
  }

  $BaseBlanker.$root$inner[$OUTER] = $BaseBlanker.$root$outer
  DefineProperty($BaseBlanker.$root$outer, "constructor", InvisibleConfig)
  DefineProperty($BaseBlanker.$root$inner, "constructor", InvisibleConfig)

  const $SomethingBlanker   = NewBlanker($BaseBlanker)
  const $NothingBlanker     = NewBlanker($SomethingBlanker)
  const   $IntrinsicBlanker = NewBlanker($SomethingBlanker)
  const     TypeBlanker     = NewBlanker($IntrinsicBlanker, Type_apply)
  const     ContextBlanker  = NewBlanker($IntrinsicBlanker, Context_apply)

  const ThingAncestry       = []


  function BootstrapType(iid, name, blanker_) {
    const _$type           = new TypeBlanker([name])
    const isImplementation = (name[0] === "$")

    SetInvisibly(_$type, "iid", iid, $OUTER)
    _$type._definitions      = SpawnFrom(null)
    _$type._blanker          = blanker_ || NewBlanker($IntrinsicBlanker)
    _$type._subordinateTypes = new Set()
    _$type._supertypes       = TheEmptyArray
    _$type._ancestry         = isImplementation ? TheEmptyArray : ThingAncestry
    return _$type[$PULP]
  }


  const _$Something = BootstrapType(-100, "$Something", $SomethingBlanker)
  const _$Intrinsic = BootstrapType( -11, "$Intrinsic", $IntrinsicBlanker)
  const _Nothing    = BootstrapType(   0, "Nothing"   , $NothingBlanker  )
  const _Thing      = BootstrapType(   1, "Thing"     , null             )
  const _Type       = BootstrapType(   2, "Type"      , TypeBlanker      )
  const _Context    = BootstrapType(   3, "Context"   , ContextBlanker   )
  const _Definition = BootstrapType(   4, "Definition", null             )

  const $Something$root$inner = $SomethingBlanker.$root$inner
  const $Something$root$outer = $SomethingBlanker.$root$outer
  const $Intrinsic$root$inner = $IntrinsicBlanker.$root$inner
  const Context$root$inner    = _Context._blanker.$root$inner
  const Definition$root$inner = _Definition._blanker.$root$inner
  const Type$root$inner       = TypeBlanker.$root$inner


  // Stubs for known properties

  // This secret is only known by inner objects
  $Something$root$inner[$IS_INNER]       = PROOF
  $Something$root$outer[$IS_INNER]       = null

  $Something$root$outer.type             = null

  $Intrinsic$root$inner._retarget        = null

  Type$root$inner.new                    = _BasicNew
  Type$root$inner._setDefinitionAt       = _SetDefinitionAt
  Type$root$inner._propagateDefinition   = AlwaysSelf,

  Definition$root$inner._setImmutable    = _BasicSetImmutable
  Definition$root$inner._init            = Definition_init

  Context$root$inner._init               = Context_init
  Context$root$inner._atPut              = Context_atPut


  const _$RootContext    = new ContextBlanker("ObjectSauce")
  const  _RootContext    = _$RootContext[$PULP]
  // const  $RootContext    = _$RootContext[$OUTER]
  const   RootContext    = _$RootContext[$RIND]
  const _$DefaultContext = new ContextBlanker("Default")
  const  _DefaultContext = _$DefaultContext[$PULP]
  const   DefaultContext = _$DefaultContext[$RIND]

  _RootContext._init("ObjectSauce")
  _DefaultContext._init("Default", RootContext)

  SetInvisibly(_$RootContext, "iid", 0, $OUTER)


  const Thing      = _Thing[$RIND]
  const Definition = _Definition[$RIND]
  const Type       = _Type[$RIND]

  ThingAncestry[0] = Thing


  Context_atPut.call(_RootContext, "Thing"     , Thing     )
  Context_atPut.call(_RootContext, "Definition", Definition)
  Context_atPut.call(_RootContext, "Type"      , Type      )


  _SetDefinitionAt.call(_$Something, IS_IMMUTABLE  , false      , VISIBLE  )
  _SetDefinitionAt.call(_$Something, "isSomething" , true       , VISIBLE  )

  // Could have defined the follow properties later, after addDeclaration has
  // been defined, however it is fast execution within each objects' barrier#get
  // if implemented this way.  These properties are read very frequently.
  _SetDefinitionAt.call(_$Something, "id"          , null       , INVISIBLE)
  _SetDefinitionAt.call(_$Something, _DURABLES     , null       , INVISIBLE)

  _SetDefinitionAt.call(_Type      , "context"     , RootContext, VISIBLE  )

  _SetDefinitionAt.call(_Type      , $IS_TYPE      , true       , VISIBLE  )
  _SetDefinitionAt.call(_Context   , $IS_CONTEXT   , true       , VISIBLE  )
  _SetDefinitionAt.call(_Definition, $IS_DEFINITION, true       , VISIBLE  )


  AddMethod.call(_Type, AddMethod)


  _$Intrinsic.addMethod("_basicSetImmutable", _BasicSetImmutable, IDEMPOT_SELF_METHOD)

  _Type.addMethod("new", _BasicNew, IDEMPOT_VALUE_METHOD)
  _Type.addMethod(_SetDefinitionAt, TRUSTED_VALUE_METHOD)

  _Definition.addMethod(Definition_init, TRUSTED_VALUE_METHOD)
  _Definition.addMethod("_setImmutable", _BasicSetImmutable, IDEMPOT_SELF_METHOD)

  _Context.addMethod(Context_init   , TRUSTED_VALUE_METHOD)
  _Context.addMethod(Context_atPut  , TRUSTED_VALUE_METHOD)


  _Context.addMethod(function entryAt(selector, asCheckRootContext_) {
    var entry = this._knownEntries[selector]
    if (entry !== undefined) { return entry }
    if (!asCheckRootContext_) { return null }
    entry = _RootContext._knownEntries[selector]
    return (entry !== undefined) ? entry : null
  }, TRUSTED_VALUE_METHOD)



  const BasicPermeableNewDef = MakePermeableNewDef(_BasicNew, RootContext)

  function MakePermeableNewDef(NewHandler, context) {
    const Definition = context.entryAt("Definition", true)
    const handler = function permeableNew(...args) {
      const   instance = NewHandler.apply(this, args)
      const _$instance = InterMap.get(instance)

      SetInvisibly(_$instance[$OUTER], "this", _$instance[$PULP])
      return instance
    }
    return Definition("new", handler, TRUSTED_VALUE_METHOD)
  }

  _OSauce.AddPermeableNewDefinitionTo = function (_$type) {
    const _type         = _$type[$PULP]
    const newHandler    = _$type.new.method.handler
    const context       = _$type.context
    const newDefinition = (newHandler !== _BasicNew) ?
      MakePermeableNewDef(newHandler, context) : BasicPermeableNewDef
    if (_$type._definitions[$IS_TYPE]) { _type.addDefinition(newDefinition) }
    return _type.addOwnDefinition(newDefinition)
  }


  _OSauce.IsSubtypeOfThing = function (_type) {
    // return (_type._basicSet !== undefined)
    // The following fails when testing _$Something
    return (RootOf(_type._blanker.$root$inner) === $Intrinsic$root$inner)
  }

  _OSauce.AddIntrinsicDeclaration = function (selector) {
    _SetDefinitionAt.call(_$Intrinsic, selector, null, INVISIBLE)
  }


  OSauce.rootContext         =   RootContext
  OSauce.defaultContext      =   DefaultContext

  _OSauce.$BaseBlanker       =  $BaseBlanker
  _OSauce.$SomethingBlanker  =  $SomethingBlanker
  _OSauce.$IntrinsicBlanker  =  $IntrinsicBlanker

  _OSauce._$Something        = _$Something
  _OSauce._$Intrinsic        = _$Intrinsic
  _OSauce._Nothing           =  _Nothing
  _OSauce._Thing             =  _Thing
  _OSauce._Type              =  _Type
  _OSauce._Context           =  _Context
  _OSauce._Definition        =  _Definition

  _OSauce._RootContext       =  _RootContext

  _OSauce._BasicSetImmutable =  _BasicSetImmutable

})
