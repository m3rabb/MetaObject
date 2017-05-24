// base
// inate
// type
// instance






// remember when executing _setSharedProperty to invalidate super !!!







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


// ownProperties = this[KNOWN_PROPERTIES] ||
//   (this[KNOWN_PROPERTIES] = VisibleProperties(this))
//
// if (ownProperties[selector]) {
//   _type = InterMap.get(this.type)[$PULP]
//   const $root$inner = _type._blanker.$root$inner
//   const descriptor = PropertyDescriptor($root$inner, selector)
//
//   if (descriptor) {
//     const getter = descriptor.get
//     if (getter) {
//       return getter.call($inner[$PULP])
//     }
//   }
//   properties = _type._properties
//   supers = supers || (this[SUPERS] = SpawnFrom(null))
//   return (super[selector] =
// }
