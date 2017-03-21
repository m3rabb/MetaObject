
Perhaps name classes with $, such as $Method to signify them as immutable instances


Type.new("", [Plastic, Robotic, Flying, Mammal], function (ToyBat) {})

Type.new(function (ToyBat, Plastic, Robotic, Flying, Mammal) {

})

- private local (unsearchable/unfindable) types
- inner access to types
- locking types so they are not extensible
- decouple the Inner_root from all types, so that if a vilain makes a
new type it doesnt infect all of the other types
-- perhaps fully separate copies of the type hierachy
-- OR immutable base types hierarchy, and multiple discrete subcontexts

===


https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment


a type should be definable as non-extensible to prevent improper use of inherited private methods



Make outer objects write-once by default



function _super(supertype) {
  const type = this.$type
  const ancestors = _type[_$ancestor]
  ancestors.forEach(ancestor => {
    const root = ancestor._instanceRoot
    if ()
  })
}

this._super.bark()
this._as(Dog).bark()

this._asExec(Dog, "bark", name, supertypes)

get (func, selector, outer) {
  func[_$super](selector)
}

// Top.addOMethod(function isThing(target) {
//   if (target[INTER] === SECRET) { return true }
//   const inner = InnerWeakMap.get(target)
//   return (target === inner[OUTER])
// })

Top.addOMethod(function isThing(target) {
  return target ||
    (target[INTER] === SECRET) ||
    (InnerWeakMap.get(target) !== undefined)
})





two ways:
$someProperty --> fixed property
someProperty$ --> immutable value at property


===
- When accessing Types within Contexts, consider wrapping them in a proxy, so
  that if they are attempted to be modified, a new copy instead is generated
  instead.  The krusts would now, also need to detect such wrapped objects and
  and unwrapped them and rewrap them properly.

===
About to take steps to remove the vulnerability/dependency of direct access to super type hierarchy from below.
- Within contexts, one can create and use new types. These types are inner objects.
- When a context is closed its types and properties become immutable
- Within contexts, one can access types inherited from super contexts as immutable inner objects
- Outside of a context one accesses its properties, including contained types, as outer objects, which themselves make outer objects.

===
About to take steps to remove the vulnerability/dependency of direct access to super type hierarchy from below.
- Within contexts, one can create and use new types. These types are inner objects.
- Within contexts, one can access types inherited from super contexts, other these types are copies with inner access.
- Outside of a context one accesses its properties, including contained types, as outer objects, which themselves make outer objects.

same
equals
identical

asFact



asNew           new empty mutable
asCopy          new mutable copy
asNonCopy       self if mutable, new empty mutable otherwise

copy            copy of same mutability
List(elements)  new immutable made from elements
List()          new empty mutable

_new            new
_set            set
_copy           copy

#unique-name
name.type

NameRec
theOneCalled
theOneNamed

explictId
implicitId
id
uuid/uri/cuid
ids[]
oid
type iid
given-name
#name

#idea
name
.type

name
unique
count



Rynd
Krust.Collections.Ordered
window.krust("")
kontext
Koating
Wrapture
Fragrant
HeatShield
MagicShell
MagicShield
MagicKrust

Skins
Gourd
Casaba melon
Cassava/Manniac
Soursop/Guanabana/Graviola/
pumkin
Abacaxi
Swolt
drupe
CocoaButter
HotSauce
ChiliDog

guarana
Cherimoya

rind/skin/peel/pith
flesh/pulp/seed

purple carrot
http://www.popsci.com/wtf-are-purple-carrots-and-where-did-they-come-from



gourd
rind/pulp/seed/core

rind,pulp,seed

chaperon

Klobal
Krust.Krust
Krust.Name.globalUniques/allUniques

Krust.localNames
Krust.allUniqueNames
Krust.containedUniqueNames
Krust.context
Krust.subcontexts

Type.name

rynd
kontext
krust
topjs
