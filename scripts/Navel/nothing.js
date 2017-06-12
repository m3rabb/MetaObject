
const Nothing = Type({
  name      : "Nothing",
  supertype : null,
})

const $Nothing = InterMap.get(Nothing)
const $Void    = new $Nothing._blanker(Impermeable)
const _Void    = $Void[$PULP]
const Void     = $Void[$RIND]

_Void.id     = "Void,0.Nothing"
_Void.isVoid = true

_BasicSetImmutable.call($Void)


_$Innate.addSharedProperty("isVoid", false)


//     Nothing
//        _unknownProperty
//        isNothing
//       Void
//        id
//        isVoid
