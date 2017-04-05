- spans
- collections naming consistency
- hijacking method declaration
- privacy wrapping
- immutability
- return from looping
- how debugger finds names of functions
- proxies
- disguising functions
- lazy installer properties
- making newless constructors
- naming functions dynamically; enabling uses of arguments, etc
- deep copying and equality
- have proxy handler hold extra state to simplier proxy/handler CreateEmptyNamelessFunction

- faking immutability!!!

- grocery bag example

function CreateFactory(typeName, basicConstructor) {
  const funcBody =
    `return function (_basic_${typeName}) {
      return function ${typeName}(...args) {
        const instance = new _basic_${typeName}()
        instance._init(...args)
        if (args.length && instance.id === undefined) { instance.beImmutable }
        return instance
      }
    }`
  const customFactoryGenerator = Function(funcBody)()
  const factory = customFactoryGenerator(basicConstructor)

  BeImmutable(factory.prototype)
  return BeImmutable(factory)
}

====

approaches to isFact

straight isFact

isFact && object.constructor !== Object || (objData = InterMap.get(object) && objData.isFact)


[IS_FACT]

customs getter/setter to ensure security of objData rep of isFact as sole truth

isFact with special case symbol for object
(isFact && (object.constructor !== Object || isFact === FACTUAL))


====

do switch trick

do {
  // Consider moving this check into each branch below!!!
  if (core[selector] === value) { // && IsLocalProperty.call(core, selector)
    if (isPublic) { core[OUTER][selector] = value }
    return true
  }

  switch (value[SECRET]) {
    case PARAM :
      value = value[isPublic ? WRITE_PARAM_AS_FACT : WRITE_PARAM]
      continue

    case INNER :
      if (isPublic) {
        inner = value.isFact ? value : value[COPY](true)
        core[selector] = inner
        core[OUTER][selector] = inner[OUTER_BARRIER]
      }
      else {
        core[selector] = value
      }
      return true

    case OUTSIDER :
      barrier = value
      object  = value[OBJECT]

      if (isPublic) {
        copy = CopyObject(object, true)
        if (copy === object) { barrier = new OutsideBarrier(copy) }
        core[OUTER][selector] = core[selector] = barrier
      }
      else {
        core[selector] = barrier
      }
      return true

    default :  // value is outer or locally created|exposed object
      if (isPublic) {
        core[OUTER][selector] = core[selector] =
          ((objData = InterMap.get(value))) ?
            (objData.isFact ? value : objData[COPY](true)[OUTER_BARRIER]) :
            CopyObject(value, true)
      }
      else {
        core[selector] = value
      }
      return true
  }
} while (true)


===
Naming

For hasOwnProperty -> IsLocalSelector -> HasOwnSelector -> ContainsSelector


KNOWN_PROPERTIES -> KNOWN_SELECTORS

Hidden|Shown| VisibleConfiguration|InvisibleConfiguration

own|known|unknown

KNOWN_SELECTORS
UNKNOWNS_SELECTORS
OWN

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties


addMethod|addOwnMethod
