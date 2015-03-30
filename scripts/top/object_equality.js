// simpleEqulity
// shallowEquality
// valueEquality
// structuralEquality

   function AreEqual(a, b) {
     if (a === b)                                 { return true;  }
     if (typeof a !== "object" || a === null)     { return false; }
     if (typeof b !== "object" || b === null)     { return false; }
     isImmutable = IsImmutable(a);
     if (isImmutable !== IsImmutable(b))          { return false; }

     comparator = this || NewComparator();
     oidA = a.__oid || comparator._GetOid(a, isImmutable);
     oidB = b.__oid || comparator._GetOid(b, isImmutable);

     if ( comparator.AlreadyCompared(oidA, oidB))      { return true;  }
     if (!comparator.HaveEqualPaths(oidA, oidB))         { return false; }

     if (a.IsEqual_) {
       return (b.IsEqual_) ? a.IsEqual_(b, comparator) : false;
     }
     if (b.IsEqual_)                             { return false; }
     if (!comparator.AreEqual(RootOf(a), RootOf(b)))   { return false; }
     return comparator.HaveEqualProperties(a, b);
   }

   function IsEqual_(that, comparator) {
     var _that = that.__Base(BASE_KEY);
     if (this === _that) { return true; }
     return this._IsEqualAncestry_(_that, comparator) &&
       this._IsEqualProperties_(_that, comparator);
   }

   function NewComparator() {
     var comparator = SpawnFrom(Comparator_root);
     comparator._immutables = [];
     comparator._modified = [];
     comparator._groupings = NewStash();
     comparator._visitedA = NewStash();
     comparator._visitedB = NewStash();
     comparator._pathCount = 0;
     return comparator;
   }

   this.AddIMethod(function _GetOid(target, isImmutable) {
     if (isImmutable) {
       immutables = this._immutables;
       index = count = immutables.length;
       while (index--) {
         if (immutables[index] === target) { return -1 - index; }
       }
       immutables[count] = target;
       return count;
     }
     this._modified.push(target);
     return (target.__oid = NewUniqueId(target.constructor.name));
   });

   this.AddIMethod(function Finalize() {
     var modified = this._modified;
     var index = modified.length
     while (index--) {
       delete modified[index].__oid;
     }
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
     var index, source, destination;

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

   this.AddIMethod(function HaveEqualProperties(a, b) {
     var namesA, namesB, index, name;

     namesA = PropertiesOf(a);
     index = namesA.length;
     if (index === 0)                           { return false; }
     namesB = PropertiesOf(b);
     if (index !== namesB.length)                 { return false; }
     while (index--) {
       name = namesA[index];
       if (name !== namesB[index])                { return false; }
       if (!this.AreEqual(_a[name], _b[name]))     { return false; }
     }
     return true;
   });



           function ShallowCompare(a, b, namesA, namesB) {
             var source, target, selectors, index, selector;
             if (RootOf(a) !== RootOf(b)) { return false; }
             namesA = LocalPropertiesOf(a).sort();
             namesB = LocalPropertiesOf(b).sort();
             index = namesA.length;
             if (index !== namesB.length) { return false; }
             while (index--) {
               name = namesA[index];
               if (name !== namesB[index]) { return false; }
               if (a[name] !== b[name]) { return false; }
             }
             return true;
           }

           function Compare(a, b) {
             if (a instanceof Thing) { return value.copy(); }
             if (typeof value === "object") {
               if (IsArray(value)) { return value.slice(); }
               if (value !== null)  { return CopyObject(value); }
             }
             return value;
           }
