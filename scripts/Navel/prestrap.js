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
  const     TypeBlanker     = NewBlanker($IntrinsicBlanker, Type_apply   )
  const     ContextBlanker  = NewBlanker($IntrinsicBlanker, Context_apply)

  const ThingAncestry       = []


  function BootstrapType(iid, count, name, blanker_) {
    const _$type = new TypeBlanker([name])

    _$type._iidCount         = count
    _$type._definitions      = SpawnFrom(null)
    _$type._subordinateTypes = new Set()
    _$type._blanker          = blanker_ || NewBlanker($IntrinsicBlanker)
    _$type._supertypes       = TheEmptyArray

    SetInvisibly(_$type, "iid", iid, "SET BOTH INNER & OUTER")
    return _$type[$PULP]
  }

  const _$Something = BootstrapType(-100, 0, "$Something", $SomethingBlanker)
  const _$Intrinsic = BootstrapType( -11, 0, "$Intrinsic", $IntrinsicBlanker)
  const _Nothing    = BootstrapType(   0, 0, "Nothing"   , $NothingBlanker  )
  const _Thing      = BootstrapType(   1, 0, "Thing"     , null             )
  const _Type       = BootstrapType(   2, 4, "Type"      , TypeBlanker      )
  const _Context    = BootstrapType(   3, 0, "Context"   , ContextBlanker   )
  const _Definition = BootstrapType(   4, 0, "Definition", null             )

  const Thing      = _Thing[$RIND]
  const Definition = _Definition[$RIND]

  ThingAncestry[0] = Thing


  const $Something$root$inner = $SomethingBlanker.$root$inner
  const $Something$root$outer = $SomethingBlanker.$root$outer
  const Context$root$inner    = _Context._blanker.$root$inner
  const Definition$root$inner = _Definition._blanker.$root$inner
  const Type$root$inner       = TypeBlanker.$root$inner


  // Stubs for known properties

  // This secret is only known by inner objects
  $Something$root$inner[$IS_INNER]       = PROOF
  $Something$root$outer[$IS_INNER]       = null

  $Something$root$outer.type             = null

  $Something$root$inner._retarget        = null

  Type$root$inner.new                    = _BasicNew
  Type$root$inner._setDefinitionAt       = _SetDefinitionAt
  Type$root$inner._propagateDefinition   = AlwaysSelf

  Definition$root$inner._setImmutable    = _BasicSetImmutable
  Definition$root$inner._init            = Definition_init

  Context$root$inner._init               = Context_init
  Context$root$inner._atPut              = Context_atPut



  const _$RootContext    = new ContextBlanker("ObjectSauce")
  const  _RootContext    = _$RootContext[$PULP]
  const   RootContext    = _$RootContext[$RIND]

  const _$DefaultContext = new ContextBlanker("Default")
  const  _DefaultContext = _$DefaultContext[$PULP]
  const   DefaultContext = _$DefaultContext[$RIND]

  _RootContext._init("ObjectSauce")
  _DefaultContext._init("Default", RootContext)


  Context_atPut.call(_RootContext, "Thing"     , Thing     )
  Context_atPut.call(_RootContext, "Definition", Definition)



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


  _OSauce.AddIntrinsicDeclaration = function (selector) {
    _SetDefinitionAt.call(_$Intrinsic, selector, null, INVISIBLE)
  }


  OSauce.rootContext            =  RootContext
  OSauce.defaultContext         =  DefaultContext

  _OSauce.$BaseBlanker          =  $BaseBlanker
  _OSauce.$SomethingBlanker     =  $SomethingBlanker
  _OSauce.$IntrinsicBlanker     =  $IntrinsicBlanker
  _OSauce.$Something$root$inner =  $Something$root$inner

  _OSauce._$Something           = _$Something
  _OSauce._$Intrinsic           = _$Intrinsic
  _OSauce._Nothing              =  _Nothing
  _OSauce._Thing                =  _Thing
  _OSauce._Type                 =  _Type
  _OSauce._Context              =  _Context
  _OSauce._Definition           =  _Definition

  _OSauce._$DefaultContext      = _$DefaultContext
  _OSauce._RootContext          =  _RootContext
  _OSauce.Thing                 =   Thing

  _OSauce._BasicSetImmutable    =  _BasicSetImmutable

})
