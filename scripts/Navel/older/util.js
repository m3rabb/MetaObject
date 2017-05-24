



// function InAtPut(target, selector, func) {
//   target[selector] = func
// }

// function InPutNamedFunc(target, namedFunc) {
//   target[namedFunc.name] = namedFunc
// }





// function AddGetter(target, namedGetter_name, getter_) {
//   const [name, getter] = (typeof namedGetter_name === "function") ?
//       [namedGetter_name.name, namedGetter_name] :
//       [namedGetter_name     , getter_         ]
//
//   return _AddGetter(target, name, true, getter)
// }
//
// // UNTESTED
// function AddInvisibleGetter(target, namedGetter_name, getter_) {
//   const [name, getter] = (typeof namedGetter_name === "function") ?
//       [namedGetter_name.name, namedGetter_name] :
//       [namedGetter_name     , getter_         ]
//
//   return _AddGetter(target, name, false, getter)
// }

// function AddLazyProperty(target, namedInstaller_name, installer_) {
//   const [Name, Installer] =
//     (typeof namedInstaller_name === "function") ?
//       [namedInstaller_name.name, namedInstaller_name] :
//       [namedInstaller_name     , installer_         ]
//
//   _AddGetter(target, Name, true, function $loader() {
//     DefineProperty(this, Name, InvisibleConfiguration)
//     return (this[Name] = Installer.call(this))
//   })
// }




// function AsMethod(method_func__name, func__, mode___) {
//   if (method_func__name.isMethod) { return method_func__name }
//   const method$core = new MethodBlanker()
//   method$core[INNER]._init(method_func__name, func__, mode___)
//   return method$core[RIND]
// }





// function MakeAncestors(_supertypes) {
//   let next, _supertype, _ancestors, visited
//
//   next = _supertypes.length
//   if (next === 0) { return [] }
//
//   _supertype = _supertypes[--next]
//   _ancestors = _supertype._ancestors.slice()
//   if (next === 0) {
//     _ancestors.push(_supertype)
//     return _ancestors
//   }
//
//   visited = new Set(_ancestors)
//   do {
//     _supertype = _supertypes[--next]
//     if (!visited.has(_supertype)) {
//       _supertype._ancestors.forEach(_type => {
//         if (!visited.has(_type)) { _ancestors.push(_type) }
//       })
//     }
//   } while (next)
//   return _ancestors
// }
