

function NewGet(Selector) {
  return function __Get() {
    var result = this.__Pulp(KNIFE)[Selector];
    return (result instanceof _Inner) ? result.__$peel : result;
  };
}

function NewSet(Selector) {
  return function __Set(value) {
    var target = this.__Pulp(KNIFE);
    if (target.__$publicProperties[Selector]) {
      target[Selector] = value;
      return (value instanceof _Inner) ? value.__$peel : value; // Necessary ???
    }
    this.SignalError(Selector, " is not a known public property of this object!");
    return undefined;
  };
}

function AttemptToSetImmutablePropertyError() {
  this.SignalError(
    "Public properties beginning with a '$' cannot be set externally!");
  return undefined;
}

AccessorFactory.Make()





function AddPublicProperty(selector) {
  var configuration = SpawnFrom(LockedHiddenConfiguration);
  configuration.get = NewGet(selector);
  configuration.set = NewSet(selector);
  DefineProperty(_Peel_root, selector, configuration);
}

function AddImmutablePublicProperty(selector) {
  var configuration = SpawnFrom(LockedHiddenConfiguration);
  configuration.get = NewGet(selector);
  configuration.set = AttemptToSetImmutablePropertyError;
  DefineProperty(_Peel_root, selector, configuration);
}


// Add DataType to system !!!  Maybe not because it would expose _super :-(
// DeclarePublicProperties !!!







// function AddLazyProperty(root, installer) {
//   var configuration = NewStash({
//     writable: true,
//     enumerable: false,
//     configurable: true,
//     get: installer
//   });
//   DefineProperty(root, installer.name, configuration);
// }
//
// DefineProperty(this, "__$peel", HiddenConfiguration);
// this.__$peel = peel;
//
//
// AddLazyProperty(_Pulp_root, function __$oid() {
//   DefineProperty(this, "__$oid", HiddenConfiguration);
//   return (this.__$oid = NewUniqueId(this.TypeName()));
// });
//
// function SetImmutableProperty(target, name, value, isHidden_) {
//   var configurationRoot = isHidden_ ?
//     LockedHiddenConfiguration : LockedConfiguration;
//   var configuration = SpawnFrom(configurationRoot);
//   configuration.value = value;
//   DefineProperty(target, name, configuration);
//   return target;
// }




list.RemoveFirst()
list.RemoveFirst(absentAction)
list.RemoveFirst(null, presentAction)
list.RemoveFirst(absentAction, presentAction)
list.RemoveFirst$({presentAction : func})
list.$("RemoveFirst");
list.$("RemoveFirst", absentAction);
list.$("RemoveFirst$", {absentAction: func1, presentAction: func2});
list.$({RemoveFirst: null});
list.$({RemoveFirst: absentAction});

list.at(key)
list.at$({key: "a", absentAction: })
list.at_ifAbsent(key, func)
list.at_ifPresent(key, func)
list.at_ifPresent_ifAbsent(key, func1, func2)
list.$({at: key})
list.$({at: key, ifPresent: func})
