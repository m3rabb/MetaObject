// Finsih code to make peels/rinds have a hierarchy that mirrors the pulps

Type_pulp_root.__$peel_root


Type_root.AddMethod(function _Init(name, supertype, instanceRoot) {
      this._super._Init(name);
      this._subtypes = NewStash();
      ConnectSubtype_ToSupertype(this, supertype);
      this._instanceRoot = instanceRoot;
      SetImmutableProperty(instanceRoot, "__$type"     , this        , true);
      SetImmutableProperty(instanceRoot, "__$pulp_root", instanceRoot, true);
      // SetHiddenImmutableProperty(
      //   instanceRoot, "__$rootConstructor", NewFauxConstructor(instanceRoot));

      // instanceRoot.At_PutMethod("Type", CreatePureGetter(this));
    });

    ConnectSubtype_ToSupertype = function (_newType, supertype) {
      var _supertype = supertype.__Pulp(KNIFE);
      var _super_instanceRoot = _supertype._instanceRoot;
      var _super_pulp_root = _super_instanceRoot.__$pulp_root;
      var _super_peel_root = _super_instanceRoot.__$peel_root;

      _newType._supertype = supertype;
      _supertype._subtypes[_newType.__$oid] = _newType;
    };


(function Bootstrap_Core_Types() {
  ConnectSubtype_ToSupertype = function (_subtype, supertype) {
    _subtype._supertype = supertype;
  };

  Type_root._instanceRoot = Type_root;

  Primordial = Type_root.New("Primordial", null, Primordial_root);

  ConnectSubtype_ToSupertype = function (_subtype, supertype) {
    var _supertype = supertype.__Pulp(KNIFE);
    _subtype._supertype = supertype;
    _supertype._subtypes[_subtype.__$oid] = _subtype;
  };

  Nothing = Type_root.New("Nothing", Primordial, Nothing_root);
  Thing   = Type_root.New("Thing"  , Primordial, Thing_root);
  Type    = Type_root.New("Type"   , Thing     , Type_root );

  delete Type_root._instanceRoot;

})();

var obj = {};
var config = {configurable: true, set: function (v) {return this._xyz = v + 1}};
Object.defineProperty(obj, "xyz", config);
Object.defineProperty(obj, "xyz", {get: function () {return this._xyz}});















function(k){return k===K?O:E(O)}
function(k,n){return k===K?P:k===S?P=n:E(P)}

__

__Syringe()






// function Create_Cover(Target) {
// 		return function Cover(arg, arg_, arg__, arg___) {
// 			var result, cover;
// 			if (typeof arg === STRING) {
// 				if (arg[0] === UNDERSCORE) {
// 					if (arg_ === REASSIGN_COVER_TARGET) {
// 						Target = arg__; // Overwrite original closure argument!!!
// 						return Cover;
// 					}
// 					if (arg_ === VALIDITY_CHECK) { return VALID_PROOF; }
// 					// Should the validity check should be rewritten after each check???
// 					return _Error("Improper Method Call", "Cannot call private methods!");
// 				}
// 				switch (arguments.length) {
// 					case 1  : result = Target[arg]();                    break;
// 					case 2  : result = Target[arg](arg_);                break;
// 					case 3  : result = Target[arg](arg_, arg__);         break;
// 					case 4  : result = Target[arg](arg_, arg__, arg___); break;
// 					default : result =
// 						Target[arg].apply(Target, CopyWithoutFirstArg(arguments));
// 				}
// 			} else if (IsArray(arg)) {
// 				result = IsArray(arg_) ?
// 					ExecuteFromSelectorArrays(Target, arg, arg_, arguments) :
// 					ExecuteFromSelectorArray(Target, arg, arguments);
// 			} else {
// 				result = ExecuteFromSelectorMap(Target, arg, arguments);
// 			}
// 			if (result instanceof Implementation) {
// 				cover = result.__;
// 				return cover === VOID ? (result.__ = Create_Cover(this)) : cover;
// 			}
// 			return result;
// 		};
// 	}


bad.__Pulp =  good.__Pulp()

Public
PublicHidden
Protected




// use __$inner/__$outer instead of __$rind/__$peel/__$pulp ???

AttachRind = (function (K, E) {
  return function AttachRind(P, Rind) {
    P.__Syringe = function (pulp) {
      P.__$rind = null;
      P = pulp;
      return (pulp.__$rind = Rind);
    };
    SetHiddenImmutableProperty(Rind, "__Pulp",
      function (k){return k===K?P:E(P)}
    );
    SetHiddenImmutableProperty(Rind, "__Exec", function __Exec(selector, args) {
      if (this !== Rind) { return HijackedPulpSecurityError(this, Rind, P); }
      var result = P[selector].exec(P, args); // exec|apply
      return (result instanceof _Inner) ? result.__$rind : result;
    });
    P.__$rind = P.__rind = Rind;
  }
})(PULP_KEY, ImproperAttemptToAccessPulpError);


function NewDelegationHandler(Selector) {
  return function __Delegation(/* arguments */) {
    return this.__Exec(Selector, arguments);
  };
}

// for method functions add exec method. i.e. a SetHiddenImmutableProperty
// nontamperable version of Function#apply.


// function NewPulpAccessor(_Pulp, _Peel) {
//   return function __Pulp(key) {
//     if (this !== _Peel) {
//       return HijackedReceiverError(this, _Pulp);
//     }
//     return (key === PULP_KEY) ? _Pulp : ImproperAttemptToAccessPulp(_Pulp);
//   }
// }

// function NewPulpAccessor(P, R) {
//   return function (k){return this===R&&k===K?P:E(P)}
// }




function NewDelegationHandler(Selector) {
  return function __Delegation(/* arguments */) {
    return this.__(Selector, arguments);
  };
}


function _IsValid(unknown) {
  if (unknown instanceof _Pulp) { return true; }
  if (unknown == null) { return false; }
  var __method = unknown.__
  return (__method == null) || Function_source.call(__method) !== __SOURCE;
}
if (unknown == null || !unknown[DefaultEQM.$supportMarker]) { return false; }
var ThingA = this;
var wrappedA = function (key) {
  return key === WRAPPER_KEY ? ThingA : error();
}
unknown.IsEqualToWrappedThing_(wrappedA);
}

this.AddIMethod(function _IsValid(unknown, action) {
  if (!unknown instanceof _Pulp_root) {
    if (unknown == null) { return false; }
    var __pulpMethod = unknown[__PULP];
    if (__pulpMethod == null) { return false; }
    if (Function_toSource.call(__pulpMethod) !== __PULP_SOURCE) {
      this.CounterfeitPulpAccessorSecurityError(unknown);
      return false;
    }
    var pulp = unknown[__PULP](KNIFE);
    if (unknown !== pulp.__peel) {
      this.HijackedPulpSecurityError(unknown);
      return false;
    }
    if (!pulp instanceof _Pulp_root) { return false; }
  }
  action && action.call(pulp);
  return true;
});


this.AddIMethod(function _PulpOfIfSimilar(unknown) {
  var fauxConstructor = this.__$fauxConstructor;
  if (unknown instanceof fauxConstructor) { return unknown; }
  if (unknown == null) { return null; }
  var __pulpMethod = unknown[__PULP];
  if (__pulpMethod == null) { return null; }
  if (Function_toSource.call(__pulpMethod) !== __PULP_SOURCE) {
    this.CounterfeitPulpAccessorSecurityError(unknown);
    return null;
  }
  var pulp = unknown[__PULP](KNIFE);
  if (unknown !== pulp.__peel) {
    this.HijackedPulpSecurityError(unknown);
    return null;
  }
  return (pulp instanceof fauxConstructor) ? pulp : null;
});

this.AddIMethod(function _PulpOfIfSameType(unknown) {
  var type = this.__$type;
  if (unknown == null) { return null; }
  if (unknown.__$type === type) { return unknown; }
  var __pulpMethod = unknown[__PULP];
  if (__pulpMethod == null) { return null; }
  if (Function_toSource.call(__pulpMethod) !== __PULP_SOURCE) {
    this.CounterfeitPulpAccessorSecurityError(unknown);
    return null;
  }
  var pulp = unknown[__PULP](KNIFE);
  if (unknown !== pulp.__peel) {
    this.HijackedPulpSecurityError(unknown);
    return null;
  }
  return (pulp.__$type === type) ? pulp : null;
});

function IsEqual(unknown) {
  thingB = this._PulpOfIfSameType(unknown);
  if (thingB === null) { return false; }
}

/// add simlar test to Type insace to return pulp of a member or descendant object !!!









// function NewTrampoline(_Pulp, _Peel) {
//   return function __(selector_newTarget, args) {
//     if (this !== _Peel) {
//       if (this === Transplanter) {
//         _Pulp = selector_newTarget;
//         return this;
//       }
//       return HijackedReceiverError(this, _Pulp);
//     }
//     var result = _Target.apply(selector_newTarget, args);
//     return (result instanceof _Inner) ? result.__$peel : result;
//   }
// }


// function NewWrapper(Target) {
//   return function (k) {return k===K?T:E()}
//   // return function (key) {
//   //   return key === WRAPPER_KEY ? Target : error();
//   // }
// }
//
// function IsEqual(unknown) {
//   if (unknown instanceof _Thing_pulp) {
//     return unknown._CompareThing_(this, DefaultEQM);
//   }
//   if (unknown == null) { return false; }
//   var __method = unknown.__
//   if (__method == null) { return false; }
//   if (Function_source.call(__method) !== __SOURCE) { return false; }
//
//   if (unknown instanceof _Thing_peel) {
//     return unknown._CompareThing_(this, DefaultEQM);
//   }
//
//
//
// this.AddIMethod(function IsEqualToWrappedThing_(wrappedA) {
//   var _thingA = Function_source.call(wrappedA) === WRAPPER_SOURCE;
//   if (_thingA === this) { return true; }
//   return eqm_comparator.CompareEducatedObjects_(_thingA, this);
// });
