
const Nothing = Type({
  name      : "Nothing",
  supertype : null,
})

const _$Nothing = InterMap.get(Nothing)
const _$Void    = new _$Nothing._blanker()
const _Void     = _$Void[$PULP]
const Void      = _$Void[$RIND]

_Void.id     = "Void,0.Nothing"
_Void.isVoid = true

_BasicSetImmutable.call(_$Void)

_$Nothing.beImmutable


//     Nothing
//        _unknownProperty
//        isNothing
//       Void
//        id
//        isVoid
