
- Controlled abstraction of the object creation process
- Full control of method creation
- Consistent object model
- Fully formed types
- Multiple typing (multi-inheritance)
- Full object state privacy (efficient)
- Private properties (two-phase approach to limit performance impact)
- proxy protections
- full testing of private properties
- General purpose, fully formed object equality
- General purpose deep object copying
- proper treatment of _noSuchMethod
- Naming infrastructure
- Consistent Collections/span framework
- Consistent handlingof immutability
- Write-once object properties
- smart sharing of properties
- CSS style context name mapping

- simple flyweight types

Krust
Kname
Klass



Block as protected func

_Rind_root


#####

  $TypeName -- fixed|Immutable (outer)
   TypeName -- default behavior
  _TypeName -- privilege (inner)

##### Naming #####

General-name
#unique-name-or-id
$oid _oid or just a pure number
_instance-number

@registered-name
.type


_Pulp_root
  (get) for missing property
  _@rind ==> default lazy
  _@oid  ==> default lazy
  _noSuchProperty
  _super

  _Thing_root
   _@type

  _Nothing_root
   _@type

   Symbol.hasInstance: instanceof

   Symbol.hasInstance is a Symbol which drives the behaviour of instanceof. When an ES6 compliant engine sees the instanceof operator in an expression it calls upon Symbol.hasInstance. For example, lho instanceof rho would call rho[Symbol.hasInstance](lho)


protoDog = Object.create(null)

RootHandler = {
  get (pulp, selector, rind) {
    if (selector[0] === "_") { console.log("PRIVATE") }
    console.log(`PROPERTY MISSING: ${selector}`)
  }
}

function Dog(name) {
  this.name
}

Dog.prototype = new Proxy(protoDog, RootHandler)



new Proxy(this, ProxyHandler))



RootHandler = {
  get (pulp, selector, rind) {
    if (rind !== pulp[ ]) { return Top._hijackedRindError(pulp, rind) }
    if (selector[0] === "_") { return Top._privateAccessError(pulp, selector) }
    const value = pulp[selector]
    if (value == null) {
      return (value === null) ? null : pulp._noSuchProperty(selector)
    }
    return value[__protectedOutput] || value
  }
}

Top.extend(function (_Thing) {
  _Thing.addIMethod(function isIdentical(something) {
    return (this === something || this[_$rind] === something)
  })
})









const ProxyHandler = NewStash({
  get (pulp, selector, rind) {
    if (rind !== pulp[ ]) { return Top._hijackedRindError(pulp, rind) }
    if (selector[0] === "_") { return Top._privateAccessError(pulp, selector) }
    const value = pulp[selector]
    if (value == null) {
      return (value === null) ? null : pulp._noSuchProperty(selector)
    }
    return value[__protectedOutput] || value
  },
  set (pulp, selector, value, rind) {
    const firstChar = selector[0]
    if (rind !== pulp[__rind]) { return Top._hijackedRindError(pulp, rind) }
    if (firstChar === "_") { return Top._privateAccessError(pulp, selector) }
    if (firstChar === "$") { return Top._setImmutableError(pulp, selector) }
    if (pulp[selector] === undefined) { return pulp._noSuchProperty(selector, value) }
    pulp[selector] = value
    return true
  },
  has (pulp, selector) {
    if (selector[0] === "_") { return Top._privateAccessError(pulp, selector) }
    return pulp[selector] !== undefined
  },
  ownKeys (pulp) {
    return pulp.keys().filter(selector => selector[0] !== "_")
  }
})
