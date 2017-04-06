

function MakeAncestors(supertypes$cores) {
  let next, supertypes$core, ancestors, visited

  next = supertypes$cores.length
  if (next === 0) { return [] }

  supertype$core = supertypes$cores[--next]
  ancestors      = supertype$core._ancestors.slice()
  if (next === 0) {
    ancestors.push(supertype$core)
    return ancestors
  }

  visited = new Set(ancestors)
  do {
    supertype$core = supertypes$cores[--next]
    if (!visited.has(supertype$core)) {
      supertype$core._ancestors.forEach(type$core => {
        if (!visited.has(type$core)) { ancestors.push(type$core) }
      })
    }
  } while (next)
  return ancestors
}


// function SeedInstanceRootMethodHandlers(_root, _ancestors) {
//   const count = _ancestors.length
//   let next = 0
//   while (next < count) {
//     const methods = _ancestors[next++].methods
//     for (const selector in methods) {
//       _root[selector] = methods[selector].handler
//     }
//   }
// }
//
// function ReseedSubtypesMethodHandler(type, selector, handler) {
//   const subtypes = type.subtypes
//   for (const oid in subtypes) {
//     ReseedTypeMethodHandler(subtypes[oid], selector, handler)
//   }
// }
//
// function ReseedTypeMethodHandler(type, selector, handler) {
//   if (type.methods[selector] == undefined) {
//     type._instanceRoot[selector] = handler
//     ReseedSubtypesMethodHandler(type, selector, handler)
//   }
// }



// function Make$lookup(type$twin) {
//   const type$core = InterMap.get(type$twin[RIND])
//
//   function $lookup(selector) {
//     const ancestors = type$core._ancestors
//     let  next = ancestors.length
//
//     while (next--) {
//       ancestor$core = ancestors[next]
//       properties = ancestor$core._properties
//       value = properties[selector]
//       if (value !== undefined || (selector in properties)) {
//         if (value === PROPERTY) {
//           return (type$core._blanker.$root$twin[selector] = value)
//         }
//         type$core.addMethod(value, null, DONT_RECORD) // value isMethod
//         return this[$TWIN][selector]
//       }
//     }
//     if (this._noSuchProperty) { return this[$TWIN]._noSuchProperty(selector) }
//     return (type$core._blanker.$root$twin[selector] = undefined)
//   }
//   return AsSafeFunction($lookup)
// }



// SUPER

//
// SuperMethodsBase = { __proto__ : null }
// SuperMethodsBase
//
// function CreateSuperHandler(Selector) {
//   return function (...args) {
//     const _target = this._target
//     const superHandler = _target[SUPERS][Selector]
//     return superHandler.apply(_target, ...args)
//   }
// }
