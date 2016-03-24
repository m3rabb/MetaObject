// simpleEqulity
// shallowEquality
// valueEquality
// structuralEquality







  EqualityMeasure = this.SetType("EqualityMeasure", function () {
    this.AddIMethod(function Compare(a, b, comparator_) {





// this.AddIMethod(function _PulpOfSimilar(target) {
//   if (target == null) { return null; }
//
//   var _target =
//   return (target instanceof this.__$rootConstructor_) ?
//     (target[PULP] ? target[PulpAccessor](PULP_KEY) : target) : null;
// });
//
// this.AddIMethod(function IsEqualType(that) {
//   if (that == null) { return false; }
//
//
//   if (that instanceof _Ref) {
//     this[PulpAccessor](PULP_KEY).
//     return this.__$type === that.__Base(BASE_KEY).__$type;
//   }
//   return (that instanceof _Base) ? this.__$type === that.__$type : false;
// });


 // function ShallowCompare(a, b, namesA, namesB) {
 //   var source, target, selectors, index, selector;
 //   if (RootOf(a) !== RootOf(b)) { return false; }
 //   namesA = PropertiesOf(a).sort();
 //   namesB = PropertiesOf(b).sort();
 //   index = namesA.length;
 //   if (index !== namesB.length) { return false; }
 //   while (index--) {
 //     name = namesA[index];
 //     if (name !== namesB[index]) { return false; }
 //     if (a[name] !== b[name]) { return false; }
 //   }
 //   return true;
 // }
