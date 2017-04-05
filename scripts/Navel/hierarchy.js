

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
