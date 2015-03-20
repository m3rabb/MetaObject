Node.addInstanceMethod(function _init(element, next) {
  this.element(element);
  this.next(next);
});

Node.addInstanceAccessors("element next");



LinkedList.addInstanceAccessors("_head _tail");

LinkedList.addInstanceMethod(function _init() {
  var node = Node.make(null, null);
  this._head(node)._tail(node);
});

LinkedList.addInstanceMethod(function addFirst(element) {
  return this._head(Node.make(element, this._head().next()));
});

LinkedList.addInstanceMethod(function addLast(element) {
  var node = Node.make(element, null);
  this._tail().next(node);
  return this._tail(node);
});

LinkedList.addInstanceMethod(function removeFirst() {
  var node = this._head();
  this._head(node.next());
  return node.element();
});

//=========

Thing.addInstanceMethod(function _init$($spec) {
  // $(element next _set)
  this._Name = $spec.name;
  $spec._set.call(this);
});

Node.addInstanceMethod(function _init(element, _next, _list_, _property_) {
  this._Element = element;
  this._Next    = _next;
  _list_ && (_list_[_property_] = this);
});

LinkedList.addInstanceMethod(function _init() {
  Node.make(null, null, this, "_Head");
  this._Tail = this._Head;
});

LinkedList.addInstanceMethod(function addFirst(element) {
  Node.make(element, this._Head, this, "_Head");
  return this;
});

LinkedList.addInstanceMethod(function addLast(element) {
  var prev = ;
  Node.newInstance$(element, null, "_tail", this, this._Tail);
  prev._Next = this._Tail;
  return this;
});

LinkedList.addInstanceMethod(function removeFirst() {
  var node = this._Head;
  this._Head = node._Next;
  return node._Element;
});


//=========


Type_root.AddMethod(function New(/* arguments */) {
  var instanceRoot = this._instanceRoot;
  var instance = SpawnFrom(_instanceRoot);
  instanceRoot._Init$.apply(instance, arguments);
  return instanceRoot;
});

Thing.AddInstanceMethod(function _Init($spec) {
  this._name = $spec.name;
});

Node.AddMethod(function NewWithin_Using(_list, _setter) {
  _list[_setter](this.New());
});

Node.AddMethod(function _Init($spec) {
  this._element = $spec.element;
  this._next    = $spec.next;
});

Node.AddMethod(function New($spec) {
  // (_list, _setter, element, next)
  spec._list[spec._setter](this.New(spec));
});


LinkedList.addInstanceMethod(function _Init() {
  Node.NewWithin_Using(this, "_Setup");
});

LinkedList.addInstanceMethod(function _Setup(_node) {
  this._head = this._tail = _node;
  return this;
});

LinkedList.addInstanceMethod(function _Head(_node) {
  this._head = _node;
  return this;
});

LinkedList.addInstanceMethod(function _Tail(_node) {
  this._tail = _node;
  return this;
});


LinkedList.addInstanceMethod(function addFirst(element) {
  Node.NewWithin_Using(this, "_Head");
  return this;
});

LinkedList.addInstanceMethod(function addLast(element) {
  var prev = ;
  Node.newInstance$(element, null, "_tail", this, this._Tail);
  prev._Next = this._Tail;
  return this;
});

LinkedList.addInstanceMethod(function removeFirst() {
  var node = this._Head;
  this._Head = node._Next;
  return node._Element;
});

/////=====================

Type_root.AddMethod(function New(/* arguments */) {
  var instanceRoot = this._instanceRoot;
  var instance = SpawnFrom(instanceRoot);
  instanceRoot._Init$.apply(instance, arguments);
  return instanceRoot;
});

Thing.AddInstanceMethod(function _Init(name) {
  this._name = name;
});

Node.AddInstanceMethod(function _Init(element, next) {
  this._element = element;
  this._next    = next;
});

_Node = _Top.Node;


LinkedList.AddInstanceMethod(function _Init() {
  this._head = this._tail = _Node.New();
});

LinkedList.AddInstanceMethod(function IsEmpty() {
  return (this._head === this._tail);
});

LinkedList.AddInstanceMethod(function AddFirst(element) {
  var head = this._head;
  head._next = _Node.New(element, head._next);
  return this;
});

LinkedList.AddInstanceMethod(function AddLast(element) {
  this._tail = this._tail._next = _Node.New(element, null);
  return this;
});

LinkedList.AddInstanceMethod(function RemoveFirst(absentAction_, presentAction_) {
  var head, first, element;
  head = this._head;
  if (head === this._tail) {
    return absentAction_ ? absentAction_(this) : null;
  }
  first = head._next;
  element = first._element;
  head._next = first._next;
  return presentAction_ ? presentAction_(element, this) : element;
});

LinkedList.AddInstanceMethod(function RemoveLast(absentAction_, presentAction_) {
  var tail, prior, next, element;
  tail = this._tail;
  prior = this._head;
  if (prior === tail) {
    return absentAction_ ? absentAction_(this) : null;
  }
  while ((next = prior._next) !== tail) {
    prior = next;
  }
  this._tail = prior;
  element = tail._element;
  return presentAction_ ? presentAction_(element, this) : element;
});


list.RemoveFirst()
list.RemoveFirst(absentAction)
list.RemoveFirst(null, presentAction)
list.RemoveFirst(absentAction, presentAction)
list.RemoveFirst$({presentAction : func})
list.$("RemoveFirst");
list.$("RemoveFirst", absentAction);
list.$("RemoveFirst$", {absentAction: func1, presentAction: func2});
list.$({RemoveFirst: null});
list.$({RemoveFirst: absentAction});

list.at(key)
list.at$({key: "a", absentAction: })
list.at_ifAbsent(key, func)
list.at_ifPresent(key, func)
list.at_ifPresent_ifAbsent(key, func1, func2)
list.$({at: key})
list.$({at: key, ifPresent: func})
