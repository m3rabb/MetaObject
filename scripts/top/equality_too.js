var MAX_SAFE_INTEGER = 9007199254740991;

Top.Extend(function () {
  var EqualityMeasure, ValuesComparator, StructuralComparator;
  var ValuesEQM, StructuralEQM, IdentityEQM, DefaultEQM;

  this.AddMethod(function AreEqual(a, b) {
    return DefaultEQM.Compare(a, b);
  });

  this.AddIMethod(function Copy(target) {
    return this.ShallowCopy(target);
  });

  this.AddIMethod(function ShallowCopy(target) {
    var copy, names, index, name;
    if (typeof target !== "object" || target === null) { return target; }
    if (IsArray(target)) { return target.slice(); }

    copy = SpawnFrom(RootOf(target));
    names = PropertiesOf(target);
    index = names.length;
    while (index--) {
      name = names[index];
      copy[name] = target[name];
    }
    return copy;
  });

  this.AddMethod(function DeepCopy(target) {
    return DeepCopier.Copy(a, b);
  });
  var copy = this.Type().New();
  var copier = copier_ || DeepCopier.New(this, copy);




  this.$Type.AddIMethod(function SupportEquality(measure) {
    var marker = measure.$protectedSupportMarker;
    SetImmutableProperty(this._instanceRoot, marker, true, true);
  });

  this.$Thing.Extend(function () {
    this.AddIMethod(function IsEqual(unknown, comparator_) {
      if (this === unknown) { return true; }
      if (unknown == null) { return false; }

      if (unknown[DefaultEQM.$protectedSupportMarker]) {
        _thing = unknown;
      }
      else {
        pulpAccessor = unknown[__PULP];
        if (pulpAccessor == null) { return false; }
        if (Function_toSource.call(pulpAccessor) !== __PULP_SOURCE) {
          this._CounterfeitPulpAccessorSecurityError(unknown);
          return false;
        }
        _thing = unknown[__PULP](KNIFE);
        if (unknown !== _thing.__peel) {  // Do we really care about this for non-equality???
          this._HijackedPulpSecurityError(unknown);
          return false;
        }
      }
      if (this === _thing) { return true; }
      return comparator_ ?
        comparator_.CompareThings_(this, _thing) : this._IsEqual_(_thing);
    });

    this.AddIMethod(function IsEqual_(_thing, comparator_) {
      if (this === _thing) { return true; }
      return comparator_ ?
        comparator_.CompareThings_(this, _thing) : this._IsEqual_(_thing);
    });

    this.AddIMethod(function _IsEqual_(_that, comparator_) {
      var namesA, namesB, index, name;
      var _a =  this;
      var _b = _that;

      var comparator = comparator_ || DefaultEQM.NewComparator(_a, _b);
      if (IsImmutable(_a) !== IsImmutable(_b)) { return false; }
      if (!comparator.CompareThings_(_a.__$type, _b.__$type)) { return false; }

      namesA = _a._knownProperties;
      namesB = _b._knownProperties;
      if (namesA === namesB) {
        if (namesA) {
          index = namesA.length;
          while (index--) {
            name = namesA[index];
            if (!comparator.Compare(_a[name], _b[name])) { return false; }
          }
          return true;
        }
        namesA = PropertiesOf(_a);
        index = namesA.length;
        if (index === 0) { return false; } // Is this necessary???
        namesB = PropertiesOf(_b);
        if (index !== namesB.length) { return false; }
        namesA.sort();
        namesB.sort();
      }
      else if (namesA && namesB) {
        index = namesA.length;
        if (index !== namesB.length) { return false; }
      }
      else { return false; }

      while (index--) {
        name = namesA[index];
        if (name !== namesB[index]) { return false; }
        if (!comparator.Compare(_a[name], _b[name])) { return false; }
      }
      return true;
    });

  });

  EqualityMeasure = this.SetType("EqualityMeasure", function () {
    this.AddIMethod(function _Init(equalitySelector, comparatorType) {
      this.publicEqualitySelector = equalitySelector;
      this.privateEqualitySelector = "_" + equalitySelector + "_";
      this.$protectedSupportMarker = NewUniqueID(equalitySelector);
      this.comparatorType = comparatorType;
    });

  });

  Traverser = this.SetType("Traverser", function () {
    this.AddIMethod(function _Init() {
      this._immutables      = [];
      // this._modified       = [];
    });

    this.AddIMethod(function _GetOid(target) {
      var immutables, index, count;

      if (IsImmutable(target)) {
        immutables = this._immutables;
        index = count = immutables.length;
        while (index--) {
          if (immutables[index] === target) { return -1 - index; }
        }
        immutables[count] = target;
        return -1 - count;
      }
      // this._modified.push(target);
      return SetImmutableProperty(target, "__$oid", RandomInt(1, MAX_SAFE_INTEGER));
    });
  });

  ValuesComparator = this.SetType("ValuesComparator", Traverser, function () {
    this.AddIMethod(function _Init(equalityMeasure) {
      this._super._Init();

      this._measure           = equalityMeasure;
      this._publicComparison  = equalityMeasure.publicComparison;
      this._privateComparison = equalityMeasure.privateComparison;
      this._immutables        = [];
      this._groupings         = NewStash();
    });

    this.AddIMethod(function Compare(a, b) {
      if (a === b) { return true; }
      switch (typeof a) {
        default : return false;
        case "object"   : if (a === null) { return false; }
        case "function" :
      }
      switch (typeof b) {
        default : return false;
        case "object"   : if (b === null) { return false; }
        case "function" :
      }

      var oidA = a.__$oid;
      var oidB = b.__$oid;

      var method   = this._CompareGenericObjects_;
      var arg0 = this;
      var arg1 = a;
      var arg2 = b;

      if (typeof oidB === "string") {
        method = b[this._publicComparison];
        arg0 = b;
        arg1 = a;
        arg2 = this;
      } else {
        oidB = oidB || this._GetOid(b);
      }
      if (typeof oidA === "string") {
        method = a[this._publicComparison];
        arg0 = a;
        arg1 = b;
        arg2 = this;
      } else {
        oidA = oidA || this._GetOid(a);
      }

      return this._Resolve(oidA, oidB, method, arg0, arg1, arg2);
    });


    this.AddIMethod(function CompareThings_(_thingA, _thingB) {
      // if (_thingA === _thingB) { return true; }
      var oidA = _thingA.__$oid;
      var oidB = _thingB.__$oid;
      var method = _thingA[this._publicComparison];
      return this._Resolve(oidA, oidB, method, _thingA, _thingB, this);
    });

    this.AddIMethod(function _CompareGenericObjects_(objA, objB) {
      var namesA, namesB, index, name;

      if (!this.Compare(RootOf(objA), RootOf(objB)) { return false; }

      namesA = PropertiesOf(objA);
      namesB = PropertiesOf(objB);
      index = namesA.length;
      if (index !== namesB.length) { return false; }
      namesA.sort();
      namesB.sort();
      while (index--) {
        name = namesA[index];
        if (name !== namesB[index]) { return false; }
        if (!this.Compare(objA[name], objB[name])) { return false; }
      }
      return true;
    });

    this.AddIMethod(function _Resolve(oidA, oidB, action, arg0, arg1, arg2) {
      if (this._AlreadyCompared(oidA, oidB)) { return true; }
      return action.call(arg0, arg1, arg2);
    });

    this.AddIMethod(function _AlreadyCompared(oidA, oidB) {
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


  });

  StructuralComparator = this.SetType(
   "StructuralComparator", "ValuesComparator", function () {
    this.AddIMethod(function _Init() {
      this._super._Init();
      this._visitedA  = NewStash();
      this._visitedB  = NewStash();
      this._pathCount = 0;
    });

    this.AddIMethod(function _Resolve(oidA, oidB, action, arg0, arg1, arg2) {
      if (this._AlreadyCompared(oidA, oidB)) { return true; }
      if (!this._HaveEqualPaths(oidA, oidB)) { return false; }
      return action.call(arg0, arg1, arg2);
    });

    this.AddIMethod(function _HaveEqualPaths(oidA, oidB) {
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

  // Finish identity!!!
  // IdentityEQM.AddMethod(function Compare(a, b) {
  //   return a === b || (a[this.$supportMarker] ? a.IsIdentical(b) : false);
  // });
  //
  // this.AddIMethod(function Compare(a, b) {
  //   if (a === b) { return true; }
  //   switch (typeof a) {
  //     default : return false;
  //     case "object"   : if (a === null) { return false; }
  //   }
  //   switch (typeof b) {
  //     default : return false;
  //     case "object"   : if (b === null) { return false; }
  //   }
  //
  //   return this._Resolve(oidA, oidB, method, arg0, arg1, arg2);
  // });

  Top.$Primordial.SupportEquality(IdentityEQM);
  Top.$Primordial.SupportEquality(ValuesEQM);
  Top.$Primordial.SupportEquality(StructuralEQM);


  this.$Thing.Extend(function () {
    this.AddIMethod(function DeepCopy(copier_) {
      return copier_ ? copier_.CopyThing_(this) : this._DeepCopy_();
    });

    this.AddIMethod(function _DeepCopy_(copier_) {
      var names, index, name;

      var copy = this.Type().New();
      var copier = copier_ || DeepCopier.New(this, copy);

      names = this._knownProperties || PropertiesOf(this);
      index = names.length;

      while (index--) {
        name = names[index];
        copy[name] = copier.Copy(this[name]);
      }
      return copy;
    });

    this.AddIMethod(function ShallowCopy() {
      var copy, names, index, name;
      copy = this.Type().New();
      names = this._knownProperties || PropertiesOf(this);
      index = names.length;
      while (index--) {
        name = names[index];
        copy[name] = this[name];
      }
      return copy;
    });

    this.AddIMethod(function Copy() {
      return this.ShallowCopy();
    });

  });


  DeepCopier = this.SetType("DeepCopier", "Traverser", function () {
    this.AddIMethod(function _Init(target, copy) {
      this._super._Init();
      this._visited = NewStash();
      this._visited[]
    });

    this.AddIMethod(function Copy(target) {
      var oid, method, arg0, arg1, visited, copy;
      if (typeof target !== "object" || target === null) { return target; }

      oid = target.__$oid;

      if (typeof oid === "string") {
        method = target.DeepCopy;
        arg0   = target;
        arg1   = this;
      }
      else {
        oid    = oid || this._GetOid(b);
        method = this._CopyGenericObject_;
        arg0   = this;
        arg1   = target;
      }

      visited = this._visited;
      copy = visited[oid];

      return copy ? copy : (visited[oid] = method.call(arg0, arg1));
    });

    this.AddIMethod(function CopyThing_(_thing) {
      var oid = _thing.__$oid;
      var visited = this._visited;
      var copy = visited[oid];
      return copy ? copy : (visited[oid] = _thing.DeepCopy(this));
    });

    this.AddIMethod(function _CopyGenericObject_(object) {
      var copy, names, index, name;
      copy = SpawnFrom(RootOf(object));
      names = PropertiesOf(object);
      index = names.length;
      while (index--) {
        name = names[index];
        copy[name] = this.Copy(object[name]);
      }
      return copy;
    });
  });
