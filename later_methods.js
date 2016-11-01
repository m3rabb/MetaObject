
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
