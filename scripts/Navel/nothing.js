
const Nothing = Type({
  name      : "Nothing",
  supertype : null,
  define    : _UnknownProperty // { _unknownProperty : _UnknownProperty }
})

const $Nothing = InterMap.get(Nothing)
const $Void    = new $Nothing._blanker(Impermeable)
const _Void    = $Void[$PULP]
const Void     = $Void[$RIND]

_Void.id     = "Void,0.Nothing"
_Void.isVoid = true

_BasicSetImmutable.call($Void)


_$Inate.addSharedProperty("isVoid", false)


//     Nothing
//        _unknownProperty
//        isNothing
//       Void
//        id
//        isVoid
