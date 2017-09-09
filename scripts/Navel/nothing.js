ObjectSauce(function (
  $PULP, $RIND, _Nothing,
  AddIntrinsicDeclaration, InterMap, Type, _BasicSetImmutable, OSauce
) {
  "use strict"

  const Nothing   = _Nothing[$RIND]
  const _$Nothing = InterMap.get(Nothing)
  const _$Void    = new _$Nothing._blanker()
  const _Void     = _$Void[$PULP]

  _Void.id     = "Void,0.Nothing"
  _Void.isVoid = true

  AddIntrinsicDeclaration("isVoid")
  _BasicSetImmutable.call(_$Void)

  OSauce.Nothing = Nothing
  OSauce.Void    = _$Void[$RIND]

})

//     Nothing
//        _unknownProperty
//        isNothing
//       Void
//        id
//        isVoid
