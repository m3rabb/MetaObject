
const Nothing = Type({
  name      : "Nothing",
  supertype : null,
})

const Nothing$ = InterMap.get(Nothing)
const Void$    = new Nothing$._blanker()
const Void_    = Void$[$PULP]
const Void     = Void$[$RIND]

Void_.id     = "Void,0.Nothing"
Void_.isVoid = true

_BasicSetImmutable.call(Void$)


Nothing$._setImmutable()


//     Nothing
//        _unknownProperty
//        isNothing
//       Void
//        id
//        isVoid
