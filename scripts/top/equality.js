// simpleEqulity
// shallowEquality
// valueEquality
// structuralEquality

Top.Extend(function () {
  var EqualityMeasure, ValuesComparator, StructuralComparator;
  var ValuesEQM, StructuralEQM, IdentityEQM, DefaultEQM;


  Top.AddMethod(function AreEqual(a, b) {
    return DefaultEQM.Compare(a, b);
  });

  Top.AddMethod(function HaveEqualValues(a, b) {
    return ValuesEQM.Compare(a, b);
  });

  Top.AddMethod(function AreStructurallyEqual(a, b) {
    return StructuralEQM.Compare(a, b);
  });

  Top.AddMethod(function AreIdentical(a, b) {
    return IdentityEQM.Compare(a, b);
  });

  Top.AddMethod(function IsTopObject(target) {
    return (target instanceof _Top);
  });




  this.$Thing.Extend(function () {
    this.AddIMethod(function IsEqual(that, comparator_) {
      return (that != null && that[DefaultEQM.$supportMarker]) ?
        that.CompareThing_(this, comparator_ || DefaultEQM) : false;
    });

    this.AddIMethod(function HasEqualValues(that, comparator_) {
      return (that != null && that[ValuesEQM.$supportMarker]) ?
        that.CompareThing_(this, comparator_ || ValuesEQM) : false;
    });

    this.AddIMethod(function IsStructurallyEqual(that, comparator_) {
      return (that != null && that[StructuralEQM.$supportMarker]) ?
        that.CompareThing_(this, comparator_ || StructuralEQM) : false;
    });

    this.AddIMethod(function CompareThing_(_thingA, eqm_comparator) {
      if (_thingA === this) { return true; }
      return eqm_comparator.CompareEducatedObjects_(_thingA, this);
    });



    this.AddIMethod(function _IsEqual_(_that, comparator) {
      if (!this._HasEqualAncestry_(_that, comparator)) { return false; }
      return this._HasEqualProperties_(_that, comparator);
    });

    this.AddIMethod(function _HasEqualAncestry_(_that, comparator_) {
      return this.__$type === _that.__$type;
    });

    this.AddIMethod(function _HasEqualProperties_(_that, comparator) {
      var namesA, namesB, index, name;

      namesA =  this._knownProperties;
      namesB = _that._knownProperties;
      if (namesA === namesB) {
        if (namesA) {
          index = namesA.length;
          while (index--) {
            name = namesA[index];
            if (!comparator.Compare(this[name], _that[name])) { return false; }
          }
          return true;
        }
        namesA = PropertiesOf(this);
        index = namesA.length;
        if (index === 0)                                      { return false; }
        namesB = PropertiesOf(_that);
        if (index !== namesB.length)                          { return false; }
        namesA.sort();
        namesB.sort();
      }
      else if (namesA && namesB) {
        index = namesA.length;
        if (index !== namesB.length)                          { return false; }
      }
      else                                                    { return false; }

      while (index--) {
        name = namesA[index];
        if (name !== namesB[index])                           { return false; }
        if (!comparator.Compare(this[name], _that[name]))     { return false; }
      }
      return true;
    });

  });

  this.$Type.AddIMethod(function SupportEquality(measure) {
    var marker = measure.$supportMarker;
    SetHiddenImmutableProperty(_Ref_root, marker , true);
    SetHiddenImmutableProperty(this._instanceRoot, marker , true);
  });

  EqualityMeasure = this.SetType("EqualityMeasure", function () {
    this.AddIMethod(function _Init(equalitySelector, comparatorType) {
      this.publicComparison = equalitySelector;
      this.privateComparison = "_" + equalitySelector + "_";
      this.$supportMarker = NewUniqueID(equalitySelector);
      this.comparatorType = comparatorType;
    });

    this.AddIMethod(function Compare(a, b, comparator_) {
      if (a === b)   {                                      return true;   }
      if (a == null) {                                      return a == b; }
      if (a[this.$supportMarker]) {
        return a[this.publicComparison](b, comparator_ || this);
      }
      if (typeof a !== "object" || typeof b !== "object") { return false;  }
      var comparator = comparator_ || this.comparatorType.New(this);
      return comparator.CompareIgnorantObjects_(a, b);
    });

    this.AddIMethod(function CompareEducatedObjects_(a, b) {
      return this.comparatorType.New(this).CompareEducatedObjects_(a, b);
    });
  });

  ValuesComparator = this.SetType("ValuesComparator", function () {
    this.AddIMethod(function _Init(equalityMeasure) {
      this._measure           = equalityMeasure;
      this._publicComparison  = equalityMeasure.publicComparison;
      this._privateComparison = equalityMeasure.privateComparison;
      this._immutables        = [];
      this._groupings         = NewStash();
      // this._modified       = [];
    });

    this.AddIMethod(function Compare(a, b) {
      return this._measure.Compare(a, b, this);
    });

    this.AddIMethod(function CompareEducatedObjects_(a, b) {
      var isImmutable = IsImmutable(a);
      if ((isImmutable) !== IsImmutable(b))  { return false; }
      var oidA = a.__$oid;
      var oidB = b.__$oid;
      if ( this.AlreadyCompared(oidA, oidB)) { return true;  }

      return a[this._privateComparison](b, this);
    });

    this.AddIMethod(function CompareIgnorantObjects_(a, b) {
      var isImmutable = IsImmutable(a);
      if ((isImmutable) !== IsImmutable(b)) { return false; }
      var oidA = a.__$oid || this._GetOid(a, isImmutable);
      var oidB = b.__$oid || this._GetOid(b, isImmutable);
      if (this.AlreadyCompared(oidA, oidB)) { return true;  }

      if (!this.HaveEqualAncestry(a, b))    { return false; }
      return this.HaveEqualProperties(a, b);
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

    this.AddIMethod(function HaveEqualAncestry(a, b) {
      return this._measure.Compare(RootOf(a), RootOf(b));
    });

    this.AddIMethod(function HaveEqualProperties(objA, objB) {
      var namesA, namesB, index, measure, name;

      namesA = PropertiesOf(objA);
      index = namesA.length;
      if (index === 0)                                { return false; }
      namesB = PropertiesOf(objB);
      if (index !== namesB.length)                    { return false; }
      namesA.sort();
      namesB.sort();
      measure = this._measure;
      while (index--) {
        name = namesA[index];
        if (name !== namesB[index])                   { return false; }
        if (!measure.Compare(objA[name], objB[name])) { return false; }
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

  StructuralComparator = this.SetType(
   "StructuralComparator", "ValuesComparator", function () {
    this.AddIMethod(function _Init(equalityMeasure) {
      this._super._Init(equalityMeasure);
      this._visitedA  = NewStash();
      this._visitedB  = NewStash();
      this._pathCount = 0;
    });

    this.AddIMethod(function CompareEducatedObjects_(a, b) {
      var isImmutable = IsImmutable(a);
      if ((isImmutable) !== IsImmutable(b))  { return false; }
      var oidA = a.__$oid;
      var oidB = b.__$oid;
      if ( this.AlreadyCompared(oidA, oidB)) { return true;  }
      if (!this.HaveEqualPaths(oidA, oidB))  { return false; }

      return a[this._privateComparison](b, this);
    });

    this.AddIMethod(function CompareIgnorantObjects_(a, b) {
      var isImmutable = IsImmutable(a);
      if ((isImmutable) !== IsImmutable(b)) { return false; }
      var oidA = a.__$oid || this._GetOid(a, isImmutable);
      var oidB = b.__$oid || this._GetOid(b, isImmutable);
      if (this.AlreadyCompared(oidA, oidB)) { return true;  }
      if (!this.HaveEqualPaths(oidA, oidB)) { return false; }

      if (!this.HaveEqualAncestry(a, b))    { return false; }
      return this.HaveEqualProperties(a, b);
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
  });

  ValuesEQM     = EqualityMeasure.New("HasEqualValues"     , ValuesComparator);
  StructuralEQM = EqualityMeasure.New("IsStructurallyEqual", StructuralComparator);
  DefaultEQM    = StructuralEQM;
  IdentityEQM   = EqualityMeasure.New("IsIdentical"        , null);

  IdentityEQM.AddMethod(function Compare(a, b, comparator_) {
    return a === b || (a[this.$supportMarker] ? a.IsIdentical(b) : false);
  });

  Top.$Primordial.SupportEquality(IdentityEQM);
  Top.$Primordial.SupportEquality(ValuesEQM);
  Top.$Primordial.SupportEquality(StructuralEQM);


});



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
