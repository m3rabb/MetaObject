// simpleEqulity
// shallowEquality
// valueEquality
// structuralEquality

Top.Extend(function () {
  var Comparator;

  this.$Thing.Extend(function () {
   this.AddIMethod(function IsEqualType(objB, comparator_) {
     if (!objB instanceof _Thing) { return false; }
     return this.__$type === objB.Type();
   });

   this.AddIMethod(function IsEqual(objB, comparator_) {
     if (!objB instanceof _Thing) {                   return false; }
     // if (!this.IsEqualType(objB)) {                   return false; }
     // if (objB == null || !objB._IsEqual_) {           return false; }
     var oidA = this.__$oid;
     var oidB = objB.__$oid;
     if (oidA === oidB) {                             return true;  }

     var comparator = comparator_ || Comparator.New();
     if ( comparator.AlreadyCompared(oidA, oidB)) {   return true;  }
     if (!comparator.HaveEqualPaths(oidA, oidB))  {   return false; }

     return objB._IsEqual_(this, comparator);
   });

   this.AddIMethod(function _IsEqual_(_objA, comparator) {
     if (this.IsImmutable() !== _objA.IsImmutable())  { return false; }
     if (!this._HasEqualAncestry_(_objA, comparator)) { return false; }
     return this._HasEqualProperties_(_objA, comparator);
   });

   this.AddIMethod(function _HasEqualAncestry_(_objB, comparator_) {
     return this.__$type === _objB.__$type;
   });

   this.AddIMethod(function _HasEqualProperties_(_objA, comparator) {
     var _objB, namesA, namesB, index, name;

     _objB = this;
     namesA = _objA._knownProperties;
     namesB = _objB._knownProperties;
     if (namesA === namesB) {
       if (namesA) {
         index = namesA.length;
         while (index--) {
           name = namesA[index];
           if (!comparator.AreEqual(_objA[name], _objB[name])) { return false; }
         }
         return true;
       }
       namesA = PropertiesOf(_objA);
       index = namesA.length;
       if (index === 0)                                    { return false; }
       namesA.sort();
       namesB = PropertiesOf(_objB).sort();
     }
     else if (namesA && namesB) {
       index = namesA.length;
     }
     else                                                  { return false; }

     if (index !== namesB.length)                          { return false; }
     while (index--) {
       name = namesA[index];
       if (name !== namesB[index])                         { return false; }
       if (!comparator.AreEqual(_objA[name], _objB[name])) { return false; }
     }
     return true;
   });
  });

  function AreEqual(a, b) {
   var measure, isImmutable, comparator, oidA, oidB;

   if (a === b)   {                                      return true;   }
   if (a == null) {                                      return a == b; }

   measure = this ? this.equalityMethod : "IsEqual";
   if (a[measure]) {                          return a[measure](b, this); }
   if (typeof a !== "object" || typeof b !== "object") { return false;  }

   isImmutable = IsImmutable(a);
   if ((isImmutable) !== IsImmutable(b)) {               return false;  }

   comparator = this || Comparator.New();
   oidA = a.__$oid || comparator._GetOid(a, isImmutable);
   oidB = b.__$oid || comparator._GetOid(b, isImmutable);
   // if (oidA === oidB) {                               return true;   }

   if ( comparator.AlreadyCompared(oidA, oidB)) {        return true;   }
   if (!comparator.HaveEqualPaths(oidA, oidB))  {        return false;  }

   if (!comparator.HaveEqualAncestry(a, b))     {        return false;  }
   return comparator.HaveEqualProperties(a, b);
  }

  Comparator = this.SetType("Comparator", function () {
   this.AddIMethod(AreEqual);

   this.AddIMethod(function _Init() {
     this._immutables = [];
     // this._modified = [];
     this._groupings = NewStash();
     this._visitedA = NewStash();
     this._visitedB = NewStash();
     this._pathCount = 0;
   });

   this.AddIMethod(function _GetOid(target, isImmutable) {
     var immutables, index, count;

     if (isImmutable) {
       immutables = this._immutables;
       index = count = immutables.length;
       while (index--) {
         if (immutables[index] === target) { return -1 - index; }
       }
       immutables[count] = target;
       return count;
     }
     // this._modified.push(target);
     return (target.__$oid = NewUniqueId(target.constructor.name));
   });

   this.AddIMethod(function AlreadyCompared(oidA, oidB) {
     var groupings = this._groupings;
     var groupingA = groupings[oidA];
     var groupingB = groupings[oidB];

     if (groupingA) {
       if (groupingB) {
         if (groupingA === groupingB) { return true; }
         this._MergeGroupings(groupingA, groupingB);
       } else {
         groupingA.push(oidB);
         groupings[oidB] = groupingA;
       }
     } else {
       if (groupingB) {
         groupingB.push(oidA);
         groupings[oidA] = groupingB;
       } else {
         groupings[oidA] = groupings[oidB] = [oidA, oidB];
       }
     }
     return false;
   });

   this.AddIMethod(function _MergeGroupings(groupingA, groupingB) {
     var groupings = this._groupings;
     var countA = groupingA.length;
     var countB = groupingB.length;
     var index, source, destination, oid;

     if (countA >= countB) {
       index = countB;
       source = groupingB;
       destination = groupingA;
     } else {
       index = countA;
       source = groupingA;
       destination = groupingB;
     }
     Array_push.apply(destination, source);
     while (index--) {
       oid = source[index];
       groupings[oid] = destination;
     }
   });

   this.AddIMethod(function HaveEqualPaths(oidA, oidB) {
     var visitedA = this._visitedA;
     var visitedB = this._visitedB;
     var indexA = visitedA[oidA];
     var indexB = visitedB[oidB];

     if (indexA !== indexB) { return false; }
     if (indexA === undefined) {
       visitedA[oidA] = visitedB[oidB] = this._pathCount++;
     }
     return true;
   });

   this.AddIMethod(function HaveEqualAncestry(objA, objB) {
     return this.AreEqual(RootOf(objA), RootOf(objB));
   });

   this.AddIMethod(function HaveEqualProperties(objA, objB) {
     var namesA, namesB, index, name;

     namesA = PropertiesOf(objA);
     index = namesA.length;
     if (index === 0)                                  { return false; }
     namesB = PropertiesOf(objB);
     if (index !== namesB.length)                      { return false; }
     while (index--) {
       name = namesA[index];
       if (name !== namesB[index])                     { return false; }
       if (!this.AreEqual(objA[name], objB[name]))     { return false; }
     }
     return true;
   });

   // this.AddIMethod(function Finalize() {
   //   var modified = this._modified;
   //   var index = modified.length
   //   while (index--) {
   //     delete modified[index].__$oid;
   //   }
   // });
  });

  Top.AddMethod(function AreEqual(a, b) {
   return AreEqual.call(null, a, b);
  });

  Top.AddMethod(function IsTopObject(target) {
   return (target instanceof _Top);
  });

});






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
