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
