// "use strict"

// rind
//   porosity
//   outer
//
// inner
//   porosity
//   core
//     inner
//     outer
//     rind
//
// rind --> core

// rind
//   func
//   disguisedPrivacyPorosity
//     outer
//
// inner
//   func
//   disguisedMutablePorosity
//     core
//       disguised
//       inner
//       outer
//       rind
//
// rind --> core


/**
 * Converts a name into a membership selector.
 * @private
 * @param       {string} name - The target to be converted
 * @returns     {string}
 */
function AsMembershipSelector(name) {
  return `is${name[0].toUpperCase()}${name.slice(1)}`
}

/**
 * Capitalizes a word.
 * @private
 * @param       {string} word - The target to be capitalized
 * @returns     {string}
 */
function AsCapitalized(word) {
  return `${word[0].toUpperCase()}${word.slice(1)}`
}

/**
 * Answers the name if it's already a string. Otherwise, it converts the
 * symbol into a name.
 * @private
 * @param       {(string|symbol)} string|symbol - The target
 * @returns     {string}
 */
function AsName(string_symbol) {
  if (typeof string_symbol === "string") { return string_symbol }
  const name = string_symbol.toString()
  return name.slice(7, name.length - 1)
}

/**
 * Makes a setter name from a non-capitalized property name.
 * @private
 * @param       {string}
 * @returns     {string}
 */
function AsPropertyFromSetter(setterName) {
  const match = setterName.match(/^([_$]*)set([A-Z])(.*$)/)
  return `${match[1]}${match[2].toLowerCase()}${match[3]}`
}

/**
 * Makes a property name from a standard setter name.
 * @private
 * @param       {string}
 * @returns     {string}
 */
function AsSetterFromProperty(propertyName) {
  const match = setterName.match(/^([_$]*)([A-Z])(.*$)/)
  return `${match[1]}set${match[2].toUpperCase()}${match[3]}`
}

/**
 * Answers the parameter if it's already a method. Otherwise, it answers a new
 * Method created from the handler function, selector, and mode.
 * @private
 * @param       {(selector|function|Method)} selector|namedFunc|method
 * Selector | Named function | Passthru method
 * @param       {function|symbol}         handler|mode_|
 * Method handler | Method mode
 * @param       {symbol}           mode_
 * Method mode, defaults to STANDARD
 * @returns     {Method}
 *
 * @example
 * AsMethod(selector, handler)
 * AsMethod(selector, handler, mode)
 * @example
 * AsMethod(namedHandler)
 * AsMethod(namedHandler, mode)
 * @example
 * AsMethod(method)
 */
function AsMethod(method_func__selector, handler__, mode___) {
  return (method_func__selector.isMethod) ?
    method_func__selector : Method(method_func__selector, handler__, mode___)
}


/**
 * Installs a method in a target $root or object. If the method is public, it
 * installs it in the outer as well as the inner sides of the object, It also,
 * handles if the method immediate or is a set loader.
 * @private
 * @param       {$inner} $inner - The target $inner
 * @param       {Method} method - The method to install
 */
function SetMethod($inner, method) {
  const $outer   = $inner[$OUTER]
  const $method  = InterMap.get(method)
  const selector = $method.selector
  const mode     = $method.mode

  // NEED to check if this is behaving properly when redefining a method from
  // standard to immediate to set-loader.
  delete $inner[$SET_LOADERS][selector]
  delete $inner[$IMMEDIATES][selector]
  delete $outer[$IMMEDIATES][selector]

  if (mode === SET_LOADER) {
    // In a set-loader method, its handler is the loader function.
    $inner[$SET_LOADERS][selector] = $method.handler
  }
  else if (mode.isImmediate) {
    // Note: the $outer stores the outer handler, but the $inner stores the
    // entire $method to enable permeable objects to have an easy way to access
    // the outer of private methods.
    //
    // Formerly used delete, but deleting uncovered inherited value from
    // _$Inate & _$Primordial, so setting it undefined covers inherited value
    // Doing this specifically to deal with inherited null id value which breaks
    // defining immediate/lazy id values by the type instances.
    $inner[selector] = undefined
    $inner[$IMMEDIATES][selector] = $method
    if ($method.isPublic) {
      $outer[selector] = undefined
      $outer[$IMMEDIATES][selector] = $method._outer
    }
  }
  else {
    // Store the inner (and outer) wrapper in the property chain.
    $inner[selector] = $method._inner
    if ($method.isPublic) { $outer[selector] = $method._outer }
  }
}


/**
 * Sets the property of an object.
 * * If the property is public, it installs the value in the outer as well as
 * the inner sides of the object.
 * * It ensures that values assigned to public properties are stored as facts.
 * * If the value is an unknown - and therefore untrusted - function, it ensures
 * that it is wrapped to avoid access to the inside of the object when executed
 * upon it.
 * * If the value refers to the object itself, it ensures that the $rind of the
 * object is assigned instead of the $pulp.
 * * It throws and error if it detects the exposed $pulp of another object.
 * @private
 * @param       {$inner}   $inner   The target $inner
 * @param       {selector} property The target property
 * @param       {*}        value    The value to be assigned
 * @param       {$pulp}    $pulp    The target $pulp
 * @throws      Throws an error if attempting to assign undefined to a property.
 * @throws      Throws an error if it detects an exposed $pulp.
 */
function InSetProperty($inner, property, value, _instigator) {
  const isPublic = (property[0] !== "_")
  const $outer   = $inner[$OUTER]
  var   methodOuterWrapper

  switch (typeof value) {
    case "undefined" :
      // Storing undefined is prohibited!
      return _instigator._assignmentOfUndefinedError()

    case "object" :
           if (value === null)             { if (!isPublic) { break } }
      else if (value[$SECRET] === $INNER)  {
        if    (value === _instigator)      { value = $inner[$RIND]
                                             if (!isPublic) { break } }
      // Safety check: detect failure to use 'this.$' elsewhere.
        else { return _instigator._detectedInnerError(value) }
      }
      else if (!isPublic)                  {          break           }
      else if (value[IS_IMMUTABLE])        {         /* NOP */        }
      else if (value.id != null)           {         /* NOP */        }
      else if (value === $inner[$RIND])    {         /* NOP */        }
      else {   value = ($value = InterMap.get(value)) ?
                 $Copy($value, true)[$RIND] : CopyObject(value, true) }

      $outer[property] = value
      break

    case "function" : // LOOK: will catch Type things!!!
    // Note: Checking for value.constructor is inadequate to prevent func spoofing
      switch (InterMap.get(value)) {
        case TYPE_PULP    :
          // Safety check: detect failure to a type's 'this.$' elsewhere.
          return _instigator._detectedInnerError(value)

        case WRAPPER_FUNC :
          if (isPublic) {
            $outer[property] = (methodOuterWrapper = value[$OUTER_WRAPPER]) ?
              methodOuterWrapper : value
          }
          break

        case undefined    :
          // New unknown untrusted function to be wrapped.
          value = AsTameFunc(value)
          // break omitted

        default           :
          // Value is either a known function, or a type's $rind.
          if (isPublic) { $outer[property] = value }
          break
      }
      break

    default :
      if (isPublic) { $outer[property] = value }
      break
  }

  $inner[property] = value
  return _instigator
}


 // Consider caching these!!!
 function NewAssignmentErrorHandler(Property, Setter) {
   return function $assignmentError(value) {
     this._disallowedAssignmentError(Property, Setter)
   }
 }


/**
 * Answers an unnamed empty function.
 * @private
 * @return {function}
 */
function NewNamelessVacuousFunc() {
  return function () {}
}

/**
 * Answers a named empty function. The function is a false constructor, only
 * used for naming instances in the debugger.
 * @private
 * @param       {string}   name   The name of the function
 * @return      {NamedVacuousConstructor}
 */
function NewVacuousConstructor(name) {
  /**
   * This function is used as a false contructor. It's referenced by the
   * 'constructor' property in a $root, and is seen by the debugger to
   * properly name the type of its instance objects. However it is a false
   * constructor because it is never used to actually generate new instances.
   * It throws an error if accidentally executed.
   * @private
   * @callback NamedVacuousConstructor
   * @throws Throws an error if executed.
   */
  const funcBody = `
    return function ${name}() {
      const message = "This constructor is only used for naming!!"
      return SignalError(${name}, message)
    }
  `
  const func = Function(funcBody)()
  Frost(func.prototype)
  return DefineProperty(func, "name", InvisibleConfiguration)
}


/**
 * Answers a new blanker function. A 'blanker' a constructor function that
 * returns a blank object i.e. empty naked virgin instance. This method is a
 * blanker factory. The produced blanker:
 * - inherits from a 'super' blanker
 * - is set by default to produce impermeable vs permeable instances
 * - is set by default to produce basic objects vs type objects.
 * @private
 * @function    NewBlanker
 * @param       {Blanker}      rootBlanker
 * @param       {$root}        rootBlanker.$root$inner
 * The ancestor for the blanker's $root of each instance's $inner.
 * @param       {$root}        rootBlanker.$root$inner.$IMMEDIATES
 * @param       {$root}        rootBlanker.$root$inner.$SET_LOADERS
 * @param       {$root}        rootBlanker.$root$inner.$SUPERS
 * @param       {$root}        rootBlanker.$root$outer
 * The ancestor for the blanker's $root of each instance's $outer.
 * @param       {$root}        rootBlanker.$root$outer.$IMMEDIATES
 * @param       {BlankerMaker} rootBlanker.maker  The default BlankerMaker.
 * @param       {Permeability} [permeability_=Impermeable]
 * Defines the permeability of the created instances.
 * @param       {BlankerMaker} [maker_=$InnerBlanker]
 * The assisting method to make the new blanker.
 * @returns     {Blanker}
 */

/**
 * A blankers is a private constructor function that is used by each type to create new
 * blank empty virgin instances. Blankers are actully composed to two constructors:
 * the inner blanker which creates the instance's $inner, and the outer blanker
 * which creates the instance's $outer.  The blanker and the inner blanker are
 * one and the same, and references the outer blanker.
 * @private
 * @typedef {function} Blanker
 * @param   {(name|spec.name)}  name_|spec_
 * @returns {$inner}
 * The parameter is ignored by all blankers, except the Type blanker which uses
 * the name parameter to set the name of the diguised function for each new
 * type instance.
 * @property {BlankerMaker} maker
 * Its maker. Used to determine the maker of descendent blankers.
 * @property {Permeability} permeability
 * Defines the permeability of its created instances.
 * @property {$root} $root$outer
 * The $root of $outer of all created instances. $root$Outer has a parallel
 * hierarchy to $root$inner
 * @property {stash} $root$outer.$IMMEDIATES
 * References the side-lookup for the instances' $outer immediate handlers.
 * @property {$root} $root$inner
 * Same as the prototype. The $root of $inner of all created instances.
 * @property {$root} $root$inner.$OUTER
 * References the parallel $root$outer
 * @property {stash} $root$inner.$IMMEDIATES
 * References the side-lookup for the instances' $inner immediate $methods.
 * Note: Unlike the $outer, the $inner $IMMEDIATES, hold the entire $method
 * So permeable instance will have an easy way to access the outer handler of
 * private immediates.
 * @property {stash} $root$inner.$SET_LOADERS
 * References the side-lookup for the instances' set-loader handlers.
 * @property {stash} $root$inner.$SUPERS
 * References the side-lookup for the instances' super properties.
 * @property {stash} $root$inner.$SUPERS.$IMMEDIATES
 * References the side-lookup for the instances' super immediate $methods.
 * @property {Blanker} $root$inner.$BLANKER
 * Reference from the instances back to their creating blanker, itself.
 * @property {OuterBlanker} CompanionOuterBlanker
 * Closure property: The companion blanker that makes the corresponding $outer for each
 * created instance.
 */

function NewBlanker(rootBlanker, maker_) {
  const root$root$inner = rootBlanker.$root$inner
  const root$root$outer = rootBlanker.$root$outer
  const root$supers     = root$root$inner[$SUPERS]

  const blankerMaker    = maker_        || rootBlanker.maker

  const $root$inner     = SpawnFrom(root$root$inner)
  const $root$outer     = SpawnFrom(root$root$outer)
  // Note: The blanker function must be unnamed in order for the debugger to
  // display the type of instances using type name determined by the name of
  // its constructor function property.
  const OuterBlanker   = NewNamelessVacuousFunc()
  const Blanker        = blankerMaker(OuterBlanker)
                         // Should this simply inherit from null!!!???
  const supers         = SpawnFrom(root$supers)
  supers[$IMMEDIATES]  = SpawnFrom(root$supers[$IMMEDIATES])

  Blanker.maker             = blankerMaker
  Blanker.prototype         = $root$inner
  Blanker.$root$inner       = $root$inner
  Blanker.$root$outer       = $root$outer
  OuterBlanker.prototype    = $root$outer

  $root$inner[$OUTER]       = $root$outer
  $root$inner[$SUPERS]      = supers
  $root$inner[$SET_LOADERS] = SpawnFrom(root$root$inner[$SET_LOADERS])
  $root$inner[$IMMEDIATES]  = SpawnFrom(root$root$inner[$IMMEDIATES])
  $root$outer[$IMMEDIATES]  = SpawnFrom(root$root$outer[$IMMEDIATES])
  $root$inner[$BLANKER]     = Blanker

  InterMap.set(Blanker, BLANKER_FUNC)
  return Frost(Blanker)
}



/**
 * On instantiation, a blank virgin object has its implementation plumbing
 * connected.
 * @private
 * @typedef     $inner
 * @property    {$inner}       $INNER
 * @property    {Proxy}        $PULP
 * @property    {$inner}         $PULP.target
 * @property    {Mutability}     $PULP.handler
 * @property    {$outer}       $OUTER
 * @property    {Proxy}          $OUTER.$RIND
 * @property    {Proxy}        $RIND
 * @property    {$outer}         $RIND.target
 * @property    {Permeability}   $RIND.handler
 * @property    {symbol}       $SECRET
 * @property    {symbol}       $MAIN_BARRIER
 * @property    {Proxy}        _super
 * @property    {Super}          _super.handler
 * @property    {$inner}         _super.target
 */

/**
 * Called by NewBlanker to assist it in making a new blanker.
 * @private
 * @param       {OuterBlanker} CompanionOuterBlanker The companion blanker.
 * @returns     {Blanker}
 */
function _NewInnerBlanker(CompanionOuterBlanker) {
  // Note: The blanker function must be unnamed in order for the debugger to
  // display the type of instances using type name determined by the name of
  // its constructor function property.
  return function (permeability) {
    const $outer = new CompanionOuterBlanker()
    const $rind  = new Proxy($outer, permeability)

    this[$INNER]  = this
    this[$PULP]   = new Proxy(this, Mutability)
    this[$OUTER]  = $outer
    this[$RIND]   = $rind
    $outer[$RIND] = $rind
    InterMap.set($rind, this)
  }
}


/**
 * On instantiation, a blank virgin type thingy has its implementation plumbing
 * connected.
 * @private
 * @typedef     Type$inner
 * @property    {$inner}       $INNER
 * @property    {Proxy}        $PULP
 * @property    {function}       $PULP.target
 * @property    {TypeInner}      $PULP.handler
 * @property    {Type$inner}       $PULP.handler.$target
 * @property    {Type$outer}   $OUTER
 * @property    {Proxy}          $OUTER.$RIND
 * @property    {Proxy}        $RIND
 * @property    {function}       $RIND.target
 * @property    {TypeOuter}      $RIND.handler
 * @property    {Type$outer}       $RIND.handler.$outer
 * @property    {Proxy}            $RIND.handler.$pulp
 * @property    {Permeability}     $RIND.handler.permeability
 * @property    {symbol}       $SECRET
 * @property    {symbol}       $MAIN_BARRIER
 * @property    {Proxy}        _super
 * @property    {Super}          _super.handler
 * @property    {Type$inner}     _super.target
 */

/**
 * Called by NewBlanker to assist it in making a Type blanker.
 * @private
 * @param       {OuterBlanker} CompanionOuterBlanker The companion blanker.
 * @returns     {Blanker}
 */
function _NewTypeInnerBlanker(CompanionOuterBlanker) {
  // Note: The blanker function must be unnamed in order for the debugger to
  // display the type of instances using type name determined by the name of
  // its constructor function property.
  return function (permeability, [name_spec]) {
    var typeName = (typeof name_spec === "string") ? name_spec : name_spec.name
    var func     = NewVacuousConstructor(typeName || "UNNAMED")
    var $outer   = new CompanionOuterBlanker()

    const mutability = new TypeInner(this)
    const $pulp      = new Proxy(func, mutability)
    mutability.$pulp = $pulp
    const porosity   = new TypeOuter($pulp, $outer, permeability)
    const $rind      = new Proxy(func, porosity)
    // const $rind           = new Proxy(NewAsFact, privacyPorosity)

    this._func    = func
    this[$INNER]  = this
    this[$PULP]   = $pulp
    this[$OUTER]  = $outer
    this[$RIND]   = $rind
    $outer[$RIND] = $rind
    InterMap.set($pulp, TYPE_PULP)
    InterMap.set($rind, this)
    // this[$PULP]  = new Proxy(NewAsFact, mutability)

  }
}


/**
 * Called by _NewTypeInnerBlanker and Type#asPermeable to setup the complex
 * guts of new Type instances. In order the enable the magic of have a type be
 * a first-class object but also work as function, the type object is hidden
 * behind proxy over a function.  The type instance's inside and outside proxies
 * are implemented using special TypeInner and TypeOuter porosity objects, which
 * each hold a reference to the actual type object. The target of the proxy
 * instead references the disguised function.
 * @private
 * @param       {function}    func         The type's disguised function.
 * @param       {Type$inner}  $inner       The type's $inner.
 * @param       {Type$outer}  $outer       The type's $outer.
 * @param       {Permeability} permeability
 * Defines the permeability of type's instances.
 * @return      {Type$pulp} The type's $pulp.
 */



/**
 * Answers the ancestry based on a list of types, ordered in ascending
 * precedence. The result is considered rough because it may contain duplicates.
 * @private
 * @param       {Type[]}     supertypes
 * The list of types, ordered in ascending precedence.
 * @param       {Set.<Type>} [originalTypes_]
 * When first executed, this param is always absent. On recursive calls, it
 * contains the set of the original types, which are to be ignored on subsequent
 * calls to BuildRoughAncestryOf.
 * @returns     {Type[]}
 */
function BuildRoughAncestryOf(supertypes, originalTypes_) {
    const roughAncestry = []
  const originalTypes = originalTypes_ || new Set(supertypes)

  supertypes.forEach(nextType => {
    if (originalTypes_ && originalTypes_.has(nextType)) { /* continue */ }
    else {
      var nextAncestry =
        BuildRoughAncestryOf(nextType.supertypes, originalTypes)
      roughAncestry.push(...nextAncestry, nextType)
    }
  })
  return roughAncestry
}

/**
 * Answers the complete ancestry of a type and its supertypes, ordered in
 * ascending precedence..
 * @private
 * @param       {Type}       type         The type.
 * @param       {Type[]}     supertypes   The type's supertypes.
 * @returns     {Type[]}
 */
function BuildAncestryOf(type, supertypes) {
  const roughAncestry = BuildRoughAncestryOf(supertypes)
  const visited = new Set()
  const dupFreeAncestry = []
  var next, nextType

  next = roughAncestry.length
  while (next--) {
    nextType = roughAncestry[next]
    if (!visited.has(nextType)) {
      dupFreeAncestry.push(nextType)
      visited.add(nextType)
    }
  }
  dupFreeAncestry.reverse().push(type)
  return dupFreeAncestry
}



/**
 * Creates an immutable list of all of the visible properties of the target,
 * caching it within the target.
 * @private
 * @param       {Something|Object} target   The target object.
 * @param       {boolean} [setOuter_=false]
 * When true, it stores the list on outside as well as the inside of the target.
 * @return      {Array.<name>}  The list of visible properties.
 */
function SetKnownProperties($target, setOuter_) {
  const properties = VisibleProperties($target)
  properties[IS_IMMUTABLE] = true
  if (setOuter_) { $target[$OUTER][KNOWN_PROPERTIES] = properties }
  return ($target[KNOWN_PROPERTIES] = Frost(properties))
}




/**
 * Makes the target JS object be immutable. Note: This method is quick and
 * dirty. Use SetImmutableObject instead for comprehensive immutability!
 * @private
 * @param       {Object} target The target JS object.
 * @returns     {Object} Answers the target, itself.
 * @todo Consider renaming this method BasicSetImmutable
 */
function SetImmutable(target) {
  target[IS_IMMUTABLE] = true
  return Frost(target)
}

/**
 * Makes the target function and its prototype be immutable. Also, marks the
 * function as safe for use, internally.
 * @private
 * @param       {function} target The target function.
 * @returns     {function} Answers the target function, itself.
 */
function SetImmutableFunc(func, marker = SAFE_FUNC) {
  if (InterMap.get(func)) { return func }

  func[IS_IMMUTABLE] = true
  InterMap.set(func, marker)
  Frost(func.prototype)
  return Frost(func)
}


/**
 * Marks the target function as safe for use, internally.
 * @private
 * @param       {function} target The target function.
 * @returns     {function} Answers the target function, itself.
 */
function MarkFunc(func, marker = KNOWN_FUNC) {
  if (InterMap.get(func)) { return func }
  InterMap.set(func, marker)
  return func
}


// Document these!!!
const SAFE_FUNC    = Frost({ id : "SAFE_FUNC"      , [IS_IMMUTABLE] : true })
const BLANKER_FUNC = Frost({ id : "BLANKER_FUNC"   , [IS_IMMUTABLE] : true })
const TAMED_FUNC   = Frost({ id : "TAMED_FUNC"     , [IS_IMMUTABLE] : true })
const WRAPPER_FUNC = Frost({ id : "WRAPPER_FUNC"   , [IS_IMMUTABLE] : true })

const KNOWN_FUNC      = Frost({ id : "KNOWN_FUNC"      })
const TYPE_PULP       = Frost({ id : "TYPE_PULP"       })
const SET_LOADER_FUNC = Frost({ id : "SET_LOADER_FUNC" })


// Simpleton function
const ALWAYS_FALSE     = MarkFunc(          () => false       )
const ALWAYS_NULL      = MarkFunc(          () => null        )
const ALWAYS_UNDEFINED = MarkFunc(          () => undefined   )
const ALWAYS_SELF      = MarkFunc( function () { return this })






const _BasicSetImmutable = function _basicSetImmutable() {
  const $inner  = this[$INNER]
  const $outer  = $inner[$OUTER]
  const barrier = new ImmutableInner($inner)

  $inner[$MAIN_BARRIER] = barrier
  $outer[IS_IMMUTABLE]  = $inner[IS_IMMUTABLE] = true
  Frost($outer)
  return ($inner[$PULP] = new Proxy($inner, barrier))
}
//   delete this._captureChanges
//   delete this._captureOverwrite


const _UnknownProperty = function _unknownProperty(property) {
  return SignalError(this, `Receiver ${this.id} doesn't have a property: ${AsName(property)}!!`)
}


const _SetSharedProperty = function _setSharedProperty(property, value, isOwn) {
  const properties  = this._properties
  const existing    = properties[property]
  const $root$inner = this._blanker.$root$inner

  if (existing === value) { return this }

  if (value && value.type === Method) { SetMethod($root$inner, value) }
  else { InSetProperty($root$inner, property, value, this) }

  if (isOwn) { properties[property] = value }

  delete $root$inner[$SUPERS][property]
  delete $root$inner[$SUPERS][$IMMEDIATES][property]
  return this._propagateIntoSubtypes(property)
}

/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// function ResetKnownProperties($pulp) {
//   let $inner     = $pulp[$INNER]
//   let properties = SpawnFrom(null)
//   let names      = VisibleProperties($inner)
//   let next       = selectors.length
//
//   while (next--) {
//     let name         = names[next]
//     properties[name] = name
//   }
//
//   properties[IS_IMMUTABLE] = true
//   return ($inner[$KNOWN_PROPERTIES] = Frost(properties))
// }





// function CopyLog() {
//   const Visited = new Map()
//
//   this.pairing = (target, match) => Visited.set(target, match), this
//   this.pair    = (target) => Visited.get(target)
// }

// function NewVisitLog() {
//   const Visited = new Map()
//
//   return function $visitLog(target, match_) {
//     return (match_) ? (Visited.set(target, match_), null) : Visited.get(target)
//   }
// }
