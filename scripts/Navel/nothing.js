HandAxe(function (
  $PULP, AddIntrinsicDeclaration, InterMap, _Nothing, _RootContext
) {
  "use strict"

  const  nil = _Nothing.new()
  const _nil = InterMap.get(nil)[$PULP]

  _nil.id    = "Nil,0.Nothing"
  _nil.isNil = true
  _nil._setImmutable()

  _RootContext._atPut("nil", nil)




  //// TESTING ////

  AddIntrinsicDeclaration("isNil")


})

/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


//     Nothing
//        _unknownProperty
//        isNothing
//       Nil
//        id
//        isNil
