
// Unnecessary because a private property such as _initFrom_ cannot be set
// from the outside!!!
//
// function Wrap_initFrom_(OriginalFunc) {
//   if (OriginalFunc.length < 4) {
//     return function $_initFrom_3(_source, visited, exceptSelector_) {
//       const receiver =
//         (this != null && this[SECRET] === $FLESH) ? this[RIND] : this
//       const source = (_source != null && _source[SECRET] === $FLESH) ?
//         _source[RIND] : _source
//       return OriginalFunc.apply(receiver, source, visited, exceptSelector_)
//     }
//   }
//   return function $_initFrom_4(_source, visited, exceptSelector_, asImmutable) {
//     const receiver =
//       (this != null && this[SECRET] === $FLESH) ? this[RIND] : this
//     const source = (_source != null && _source[SECRET] === $FLESH) ?
//       _source[RIND] : _source
//     return OriginalFunc.apply(
//       receiver, source, visited, exceptSelector_, asImmutable)
//   }
// }


// UNTESTED
function WrapFunc(OriginalFunc) {
  return function $wrappedOutsideFunc(...args) {
    const receiver =
      (this != null && this[$SECRET] === $INNER) ? this[RIND] : this
    return OriginalFunc.apply(receiver, ...args)
  }
}

const PublicHandlers = SpawnFrom(null)  // Should these be WeakSets instead???
const PublicGetters  = SpawnFrom(null)


function PublicHandlerFor(selector, mode) {
  let IsGetter       = (mode === GETTER)
  let publicHandlers = IsGetter ? PublicGetters : PublicHandlers
  let publicHandler  = publicHandlers[selector]

  if (publicHandler) { return publicHandler }

  publicHandler = function (...args) {
    let $inner, porosity, $pulp, result, result$inner

    $inner = InterMap.get(this[RIND])

    if ((porosity = $inner[$INNER_POROSITY])) { // indicator that $pulp isImmutable
      if (porosity.inUse) { porosity = new ImmutableInnerPorosity($inner) }
      porosity.inUse = true
      $pulp = porosity.target

      result = IsGetter ? $pulp[selector] : $pulp[selector](...args)

      if (result === $pulp) {
        result = porosity.target
        if (result !== $pulp) {
          porosity.target = porosity.$pulp  // reset porosity
          result.beImmutable
        }
        porosity.inUse = false
        return result[RIND]
      }
      if (typeof result !== "object" || result === null) { return result }
      if (result[IS_IMMUTABLE] || result.id != null)     { return result }
      return ((result$inner = InterMap.get(result))) ?
        result$inner[COPY](true)[RIND] : CopyObject(result, true)
    }

    $pulp = $inner[$PULP]
    result = IsGetter ? $pulp[selector] : $pulp[selector](...args)
    return (result === $pulp) ? result[RIND] : result
  }

  publicHandlers[selector] = publicHandler
  return AsSafeFunction(publicHandler)
}


function EnsureMutablePublicHandlerFor(selector, mode) {
  let IsGetter       = (mode === GETTER)
  let publicHandlers = IsGetter ? PublicGetters : PublicHandlers
  let publicHandler  = function (...args) {
    let $pulp = InterMap.get(this[RIND])[$PULP]
    let result = IsGetter ? $pulp[selector] : $pulp[selector](...args)
    return (result === $pulp) ? result[RIND] : result
  }
  publicHandlers[selector] = publicHandler
  AsSafeFunction(publicHandler)
}


EnsureMutablePublicHandlerFor("mutableCopy"      , STANDARD)
EnsureMutablePublicHandlerFor("mutableCopyExcept", STANDARD)
EnsureMutablePublicHandlerFor("asMutableCopy"    , GETTER  )
EnsureMutablePublicHandlerFor("asMutable"        , GETTER  )




// function AsPublic(originalFunc) {
//   const name     = originalFunc.name
//   const funcBody = `
//     return function (
//       InterMap, Frost, ImmutableInnerPorosity,
//       $FLESH, IS_IMMUTABLE, _INNER_POROSITY
//     ) {
//       return function ${name}(OriginalMethod) {
//         let inner, porosity, receiver, result
//         ...
//         return (result === receiver) ? result.$ : result
//       }
//     }
//   `
//   const maker = Function(funcBody)
//   const publicHandler = maker(
//     InterMap, Frost, ImmutableInnerPorosity,
//     $FLESH, IS_IMMUTABLE, _INNER_POROSITY
//   )
//   publicHandler[IS_IMMUTABLE] = true
//   Frost(publicMethod.prototype)
//   return Frost(publicMethod)
// }
