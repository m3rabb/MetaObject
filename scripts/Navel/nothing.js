
const Nothing = Type({
  name      : "Nothing",
  supertype : null,
  define    : _NoSuchProperty // { _noSuchProperty : _NoSuchProperty }
})


const $Nothing = InterMap.get(Nothing)
const $Void    = new $Nothing._blanker()
const _Void    = $Void[$PULP]
const Void     = $Void[$RIND]

_Void.id     = "Void,0.Nothing"
_Void.isVoid = true

_BasicSetImmutable.call($Void)


_$Inate.addSharedProperty("isVoid", false)


//     Nothing
//        _noSuchProperty
//        isNothing
//       Void
//        id
//        isVoid
