HandAxe(function (
  $PULP, $RIND, _Nothing, RootContext,
  AddIntrinsicDeclaration, InterMap, Type, _BasicSetImmutable
) {
  "use strict"

  const _$Nothing = InterMap.get(_Nothing[$RIND])
  const _$Void    = new _$Nothing._blanker()
  const _Void     = _$Void[$PULP]
  const  Void     = _$Void[$RIND]

  _Void.id     = "Void,0.Nothing"
  _Void.isVoid = true

  AddIntrinsicDeclaration("isVoid")
  _BasicSetImmutable.call(_$Void)

  RootContext.atPut("void", Void)

})

//     Nothing
//        _unknownProperty
//        isNothing
//       Void
//        id
//        isVoid
