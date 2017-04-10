










// const existingTypeProperties = Type$inner._properties
//
// for (let sel in Type$properties) {
//   let prop = existingTypeProperties[sel]
//   if (prop === PROPERTY) { Type$inner.addProperty(sel, Type$inner[sel]) }
//   else { Type$inner.addMethod(prop, null, DONT_RECORD) }
// }


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



// function Make$lookup(type$flesh) {
//   const type$inner = InterMap.get(type$flesh[RIND])
//
//   function $lookup(selector) {
//     const ancestors = type$inner._ancestors
//     let  next = ancestors.length
//
//     while (next--) {
//       ancestor$inner = ancestors[next]
//       properties = ancestor$inner._properties
//       value = properties[selector]
//       if (value !== undefined || (selector in properties)) {
//         if (value === PROPERTY) {
//           return (type$inner._blanker.$root$flesh[selector] = value)
//         }
//         type$inner.addMethod(value, null, DONT_RECORD) // value isMethod
//         return this[$FLESH][selector]
//       }
//     }
//     if (this._noSuchProperty) { return this[$FLESH]._noSuchProperty(selector) }
//     return (type$inner._blanker.$root$flesh[selector] = undefined)
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
