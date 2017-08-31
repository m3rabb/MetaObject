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


function FuncParamsListing(func) {
  return func.toString().match(/\(([^)]*)\)/)[1]
}

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
  if (string_symbol.charAt) { return string_symbol }
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
  return match && `${match[1]}${match[2].toLowerCase()}${match[3]}`
}

/**
 * Makes a property name from a standard setter name.
 * @private
 * @param       {string}
 * @returns     {string}
 */
function AsSetterFromProperty(propertyName) {
  const match = propertyName.match(/^([_$]*)([a-z])(.*$)/)
  return match && `${match[1]}set${match[2].toUpperCase()}${match[3]}`
}



function AsPropertySymbol(propertyName) {
  return PropertyToSymbol[propertyName] ||
    (PropertyToSymbol[propertyName] = Symbol(`<$${propertyName}$>`))
}


// AsDefinition(definition)
// AsDefinition(tag, definition)
// AsDefinition(namedFunc, mode_)
// AsDefinition(selector, func, mode_)

function AsDefinition(...args) {
  var def, tag
  switch (args.length) {
    case 1 :
      ;[def] = args
      if (def.isDefinition) { return def }
      break

    case 2 :
      ;[tag, def] = args
      if (def.isDefinition) {
        return (tag === def.tag) ? def : Definition(tag, def.handler, def.mode)
      }
      // break omitted

    case 3 :
      return Definition(...args) // selector, value, mode
  }
  return SignalError("Improper arguments to make a Definition!!")
}

// function AsDefinition(arg, arg_, arg__) {
//   if (arg.isDefinition) { return arg }
//   if (arg_.isDefinition) {
//     return (arg === arg_.tag) ? arg_ : Definition(arg, arg_.handler, arg_.mode)
//   }
//   return Definition(arg, arg_, arg__)
// }
//


function AddMembershipSelector(type, selector, value = true) {
  _$Intrinsic.addDeclaration(selector)
  type.addSharedProperty(selector, value)
  if (value) { type.membershipSelector = selector }
}

// /**
//  * Answers the parameter if it's already a method. Otherwise, it answers a new
//  * Definition created from the handler function, selector, and mode.
//  * @private
//  * @param       {(selector|function|Definition)} selector|namedFunc|method
//  * Selector | Named function | Passthru method
//  * @param       {function|symbol}         handler|mode_|
//  * Method handler | Method mode
//  * @param       {symbol}           mode_
//  * Definition mode, defaults to STANDARD
//  * @returns     {Definition}
//  *
//  * @example
//  * AsMethod(selector, handler)
//  * AsMethod(selector, handler, mode)
//  * @example
//  * AsMethod(namedHandler)
//  * AsMethod(namedHandler, mode)
//  * @example
//  * AsMethod(method)
//  */
// function AsMethod(method_func__selector, handler__, mode___) {
//   return (method_func__selector.isMethod) ?
//     method_func__selector : Definition(method_func__selector, handler__, mode___)
// }


/**
 * Installs a definition in a target $root or object. If the definition is public, it
 * installs it in the outer as well as the inner sides of the object, It also,
 * handles if the definition immediate or is an assigner.
 * @private
 * @param       {$inner} $inner - The target $inner
 * @param       {Definition} definition - The definition to install
 */
function SetDefinition(_$target, definition) {
  const  $target     = _$target[$OUTER]
  const _$definition = InterMap.get(definition)
  const selector     = _$definition.selector
  const property     = _$definition.property
  const isPublic     = _$definition.isPublic

  switch (_$definition.mode) {
    case IMMEDIATE_METHOD :
      // Formerly used delete, but deleting uncovered inherited value from
      // _$Intrinsic & _Something, so setting it undefined covers inherited
      // value. Doing this specifically to deal with inherited null id value
      // which breaks defining immediate/lazy id values by the type instances.
      CompletelyDeleteProperty(_$target, selector)
      // DefineProperty(_$target, selector, InvisibleConfig)
      // // _$target[selector] = undefined  // Handled by previous line!!!
       _$target[selector] = undefined // CHECK!!!
      _$target[$IMMEDIATES][selector] = _$definition.inner
      if (isPublic) {
        $target[selector] = undefined
        $target[$IMMEDIATES][selector] = _$definition.outer
      }
      return

    case ASSIGNER :
      _$target[$ASSIGNERS][selector] = _$definition.handler
      // break omitted

    case DECLARATION :
      _$target[$DECLARATIONS][selector] = isPublic
      return

    case MANDATORY_SETTER_METHOD :
      _$target[$ASSIGNERS][_$definition.mappedSymbol] = property
      _$target[$ASSIGNERS][property] = _$definition.assignmentError
      // break omitted

    case SETTER_METHOD :
      _$target[$DECLARATIONS][property] = isPublic
      // break omitted

    default :
      // Store the inner (and outer) wrapper in the property chain.
      CompletelyDeleteProperty(_$target, selector)
      // DefineProperty(_$target, selector, InvisibleConfig) // CHECK!!!
      _$target[selector] = _$definition.inner
      if (isPublic) { $target[selector] = _$definition.outer }
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

// https://en.wikipedia.org/wiki/Cyclomatic_complexity
// http://www.guru99.com/cyclomatic-complexity.html
// http://jshint.com/  CC = 22!!!
function InSetProperty(_$target, selector, value, _target) {
  const firstChar = (selector.charAt) ? selector[0] : selector.toString()[7]

  if (firstChar !== "_") {    // Public selector
    const $target = _$target[$OUTER]
    var   _$value

    switch (typeof value) {
      case "undefined" :
        // Storing undefined is prohibited!
        return AssignmentOfUndefinedError(_target, selector)

      case "object" :
             if (value === null)                 {        /* NOP */        }
        else if (value[$PROOF] === INNER_SECRET) {
          if (value === _target)                 { value = _$target[$RIND] }
         // Safety check: detect failure to use 'this.$' elsewhere.
          else                 { return DetectedInnerError(_target, value) }
        }
        else if (value[IS_IMMUTABLE])            {        /* NOP */        }
        else if (value.id != null)               {        /* NOP */        }
        else if (value === _$target[$RIND])      {        /* NOP */        }
        else {   value = (_$value = InterMap.get(value)) ?
                   _$Copy(_$value, true)[$RIND] : CopyObject(value, true)  }

        $target[selector] = value
        break

      case "function" : // LOOK: will catch Type things!!!
        // Note: Checking for value.constructor is inadequate to prevent func spoofing
        switch (InterMap.get(value)) {
          case DISGUISE_PULP :
            // Safety check: detect failure to a type's 'this.$' elsewhere.
            return DetectedInnerError(_target, value)

          case INNER_FUNC    :
            $target[selector] = value[$OUTER_WRAPPER]
            break

          case undefined     : // New unknown untrusted function to be wrapped.
          case HANDLER_FUNC  :
          case ASSIGNER_FUNC :
            value = AsTameFunc(value)
            // break omitted

          case OUTER_FUNC    :
          case TAMED_FUNC    :
          case SAFE_FUNC     :
          case BLANKER_FUNC  :
          default            : // value is a type's $rind, etc
            $target[selector] = value
            break
        }
        break

      default :
        $target[selector] = value
        break
    }
  }
  else if (value && value[$PROOF] === INNER_SECRET && value[$PULP] !== _target) {
    // Safety check: detect failure to use 'this.$' elsewhere.
    return DetectedInnerError(_target, value)
  }

  return (_$target[selector] = value)
}



 // Consider caching these!!!
 function NewAssignmentErrorHandler(Property, Setter) {
   function $assignmentError(value) {
     DisallowedAssignmentError(this, Property, Setter)
   }
   return MarkFunc($assignmentError, ASSIGNER_FUNC)
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
  return DefineProperty(func, "name", InvisibleConfig)
}

const DefaultDisguiseFunc = NewVacuousConstructor("$disguise$")


function MakeDefinitionsInfrastructure(_$target, _$root) {
  const $root        = _$root[$OUTER]
  const $target      = _$target[$OUTER]
  const declarations = SpawnFrom(_$root[$DECLARATIONS])
  const supers       = SpawnFrom(_$root[$SUPERS])

  supers[$IMMEDIATES] = SpawnFrom(supers[$IMMEDIATES])

  _$target[$SUPERS]       = supers
  _$target[$ASSIGNERS]    = SpawnFrom(_$root[$ASSIGNERS])
  _$target[$IMMEDIATES]   = SpawnFrom(_$root[$IMMEDIATES])
   $target[$IMMEDIATES]   = SpawnFrom( $root[$IMMEDIATES])
  _$target[$DECLARATIONS] = declarations
   $target[$DECLARATIONS] = declarations
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
 * @param       {$root}        rootBlanker.$root$inner.$ASSIGNERS
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
 * References the side-lookup for the instances' $inner immediate method$s.
 * Note: Unlike the $outer, the $inner $IMMEDIATES, hold the entire method$
 * So permeable instance will have an easy way to access the outer handler of
 * private immediates.
 * @property {stash} $root$inner.$ASSIGNERS
 * References the side-lookup for the instances' assigner handlers.
 * @property {stash} $root$inner.$SUPERS
 * References the side-lookup for the instances' super properties.
 * @property {stash} $root$inner.$SUPERS.$IMMEDIATES
 * References the side-lookup for the instances' super immediate method$s.
 * @property {Blanker} $root$inner.$BLANKER
 * Reference from the instances back to their creating blanker, itself.
 * @property {OuterMaker} CompanionOuterMaker
 * Closure property: The companion blanker that makes the corresponding $outer for each
 * created instance.
 */

function NewBlanker(rootBlanker, maker_) {
  const root$root$inner = rootBlanker.$root$inner
  const root$root$outer = rootBlanker.$root$outer
  const blankerMaker    = maker_ || rootBlanker.innerMaker
  const _$root          = SpawnFrom(root$root$inner)
  const  $root          = SpawnFrom(root$root$outer)
  // Note: The blanker function must be unnamed in order for the debugger to
  // display the type of instances using type name determined by the name of
  // its constructor function property.
  const OuterMaker      = NewNamelessVacuousFunc()
  const Blanker         = blankerMaker(OuterMaker)
                         // Should this simply inherit from null!!!???

  OuterMaker.prototype = $root
  Blanker.$root$outer  = $root
  Blanker.prototype    = _$root
  Blanker.$root$inner  = _$root
  Blanker.innerMaker   = blankerMaker

  _$root[$ROOT]     = _$root
  _$root[$OUTER]    = $root
  _$root[$BLANKER]  = Blanker

  MakeDefinitionsInfrastructure(_$root, root$root$inner)

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
 * @property    {symbol}       $PROOF
 * @property    {symbol}       $BARRIER
 * @property    {Proxy}        _super
 * @property    {Super}          _super.handler
 * @property    {$inner}         _super.target
 */

/**
 * Called by NewBlanker to assist it in making a new blanker.
 * @private
 * @param       {OuterMaker} CompanionOuterMaker The companion blanker.
 * @returns     {Blanker}
 */
function NewInner(CompanionOuterMaker) {
  // Note: The blanker function must be unnamed in order for the debugger to
  // display the type of instances using type name determined by the name of
  // its constructor function property.
  return function () {
    const $inner  = this
    const $outer  = new CompanionOuterMaker()
    const $rind   = new Proxy($outer, Impermeable)
    const barrier = new InnerBarrier()

    $inner[$BARRIER] = barrier
    $inner[$INNER]   = $inner
    $inner[$PULP]    = new Proxy($inner, barrier)
    $inner[$OUTER]   = $outer
    $inner[$RIND]    = $rind
    $outer[$RIND]    = $rind
    InterMap.set($rind, $inner)
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
 * @property    {DisguisedOuterBarrier}      $RIND.handler
 * @property    {Type$outer}       $RIND.handler.$outer
 * @property    {Proxy}            $RIND.handler.$pulp
 * @property    {Permeability}     $RIND.handler.permeability
 * @property    {symbol}       $PROOF
 * @property    {symbol}       $BARRIER
 * @property    {Proxy}        _super
 * @property    {Super}          _super.handler
 * @property    {Type$inner}     _super.target
 */

/**
 * Called by NewBlanker to assist it in making a Type blanker.
 * @private
 * @param       {OuterMaker} CompanionOuterMaker The companion blanker.
 * @returns     {Blanker}
 */
function NewDisguisedInner(CompanionOuterMaker) {
  // Note: The blanker function must be unnamed in order for the debugger to
  // display the type of instances using type name determined by the name of
  // its constructor function property.
  return function (arg_) {
    const name = arg_ && arg_.name || arg_[0].name || arg_[0]
    const func = name ? NewVacuousConstructor(name) : DefaultDisguiseFunc

    var $inner = this
    var $outer = new CompanionOuterMaker()

    const mutability = new DisguisedInnerBarrier($inner)
    // const barrier    = new InnerBarrier()
    const $pulp      = new Proxy(func, mutability)
    // mutability._target = $pulp
    const porosity   = new DisguisedOuterBarrier($pulp, $outer)
    const $rind      = new Proxy(func, porosity)
    // const $rind           = new Proxy(NewAsFact, privacyPorosity)

    $inner[$DISGUISE] = func
    $inner[$BARRIER]  = mutability // barrier
    $inner[$INNER]    = $inner
    $inner[$PULP]     = $pulp
    $inner[$OUTER]    = $outer
    $inner[$RIND]     = $rind
    $outer[$RIND]     = $rind

    InterMap.set($pulp, DISGUISE_PULP)
    InterMap.set($rind, $inner)
    // this[$PULP]  = new Proxy(NewAsFact, mutability)
  }
}


/**
 * Called by NewDisguisedInner and Type#asPermeable to setup the complex
 * guts of new Type instances. In order the enable the magic of have a type be
 * a first-class object but also work as function, the type object is hidden
 * behind proxy over a function.  The type instance's inside and outside proxies
 * are implemented using special DisguisedInnerBarrier and DisguisedOuterBarrier
 * porosity objects, which each hold a reference to the actual type object. The
 * target of the proxy instead references the disguised function.
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
  const roughAncestry   = BuildRoughAncestryOf(supertypes)
  const visited         = new Set()
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
  return SetImmutable(dupFreeAncestry)
}



function OwnSelectors(target) {
  const selectors = OwnNames(target)
  const symbols   = OwnSymbols(target)

  index = selectors.length
  next  = symbols.length
  while (next--) {
    symbol = symbols[next]
    if (AsName(symbol)[0] !== "$") { selectors[index++] = symbol }
  }
  return selectors
}


function OwnOrderedSelectors(target) {
  const selectors = OwnSelectors(target)
  selectors.sort((a, b) => AsName(a).localeCompare(AsName(b)))
  return SetImmutable(selectors)
}




function AllSelectors(target, excludeSymbols_) {
  var targetSelectors, selector, index, next
  const selectorPicker = excludeSymbols_ ? OwnNames : OwnSelectors
  const knowns         = SpawnFrom(null)
  const selectors      = []

  index = 0
  while (target) {
    targetSelectors = selectorPicker(target)
    next            = targetSelectors.length
    while (next--) {
      selector = targetSelectors[next]
      if (!knowns[selector]) {
        knowns[selector] = true
        selectors[index++] = selector
      }
    }
    target = RootOf(target)
  }
  selectors.sort((a, b) => AsName(a).localeCompare(AsName(b)))
  return SetImmutable(selectors)
}



function DeleteSelectorsIn(targets) {
  var selectors, selectorIndex, selector, targetIndex

  selectors     = OwnSelectors(targets[0])
  selectorIndex = selectors.length

  while (selectorIndex--) {
    selector = selectors[selectorIndex]
    targetIndex = targets.length

    while (targetIndex--) {
      delete targets[targetIndex][selector]
    }
  }
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
 function SetDurables(target) {
   const durables = OwnNames(target)
   durables[IS_IMMUTABLE] = true
   return (target[_DURABLES] = Frost(durables))
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
function MarkFunc(func, marker) {
  if (InterMap.get(func)) { return func }
  InterMap.set(func, marker)
  return func
}


// Document these!!!
const SAFE_FUNC     = Frost({ id : "SAFE_FUNC"   , [IS_IMMUTABLE] : true })
const BLANKER_FUNC  = Frost({ id : "BLANKER_FUNC", [IS_IMMUTABLE] : true })
const TAMED_FUNC    = Frost({ id : "TAMED_FUNC"  , [IS_IMMUTABLE] : true })
const OUTER_FUNC    = Frost({ id : "OUTER_FUNC"  , [IS_IMMUTABLE] : true })
const INNER_FUNC    = Frost({ id : "INNER_FUNC"  , [IS_IMMUTABLE] : true })



const DISGUISE_PULP = Frost({ id : "DISGUISE_PULP" })
const ASSIGNER_FUNC = Frost({ id : "ASSIGNER_FUNC" })
const HANDLER_FUNC  = Frost({ id : "HANDLER_FUNC"  })


// Simpleton function
const ALWAYS_FALSE     = MarkFunc(          () => false       , SAFE_FUNC)
const ALWAYS_NULL      = MarkFunc(          () => null        , SAFE_FUNC)
const ALWAYS_UNDEFINED = MarkFunc(          () => undefined   , SAFE_FUNC)
const ALWAYS_SELF      = MarkFunc( function () { return this }, SAFE_FUNC)



function PropertyAt(_$target, selector) {
  const _$method_inner = _$target[$IMMEDIATES][selector]
  if (_$method_inner) { return _$method_inner.method /* || null */ }

  const value = _$target[selector]
  return (value == null) ? null :
    (value[$OUTER_WRAPPER] ? value.method : value)
}


function SetAsymmetricProperty(_type, property, _value, $value, visibility) {
  const blanker = _type._blanker
  const  $root  = blanker.$root$outer
  const _$root  = blanker.$root$inner

  if (visibility === INVISIBLE) {
    DefineProperty( $root, property, InvisibleConfig)
    DefineProperty(_$root, property, InvisibleConfig)
  }

   $root[property] = $value
  _$root[property] = _value
  // _type._properties[property] = ASYMMETRIC_PROPERTY
}



function IsSubtypeOfThing(_type) {
  return (RootOf(_type._blanker.$root$inner) === $Intrinsic$root$inner)
}

function AncestryIncludesThing(ancestry) {
  for (var index = 0, count = ancestry.length - 1; index < count; index++) {
    var _$type = InterMap.get(ancestry[index])
    if (IsSubtypeOfThing(_$type)) { return true }
  }
  return false
}


const _BasicNew = function _basicNew(...args) {
  const _$instance = new this._blanker(args)
  const  _instance = _$instance[$PULP]
  const  _postInit = _$instance._postInit

  _$instance._init.apply(_instance, args) // <<----------
  if (_postInit) {
    const result = _postInit.call(_instance)
    if (result !== undefined && result !== _instance) { return result }
  }
  return _$instance[$RIND]
}

const _BasicNew_ = function new_(...args) {
  const $inner     = this[$INNER]
  const newHandler = $inner.new
  const instance   = (newHandler === _BasicNew || newHandler === _BasicNew_) ?
    this._basicNew(...args) : this.new(...args)
  const _$instance = InterMap.get(instance)
  const $instance  = _$instance[$OUTER]

  DefineProperty($instance, "this", InvisibleConfig)
  $instance.this = _$instance[$PULP]

  return instance
}


// This method should only be called on a mutable object!!!
const _BasicSetImmutable = function _basicSetImmutable(inPlace_, visited__) {
  const _$target = this[$INNER]
  const  $target = _$target[$OUTER]

  delete _$target._retarget
  $target[IS_IMMUTABLE] = _$target[IS_IMMUTABLE] = true
  Frost($target)
  return this
} // BASIC_SELF_METHOD



function CompletelyDeleteProperty(_$target, selector) {
  delete _$target[selector]
  const $target = _$target[$OUTER]
  const supers  = _$target[$SUPERS]
  delete _$target[$IMMEDIATES][selector]
  delete  $target[$IMMEDIATES][selector]
  delete supers[selector]
  delete supers[$IMMEDIATES][selector]
}









/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/



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
