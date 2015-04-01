

Type.addInstanceMethod(function addSharedProperty(name, value) {
  return this._InstanceRoot[name] = value;
});


Type.addAccessors("name! instanceRoot! supertype! subtypes!&");
this._InstanceRoot = instanceRoot;
instanceRoot._Type = this;

this._Name = name;

this._Supertype = supertype;
supertype._Subtypes[name] = this;
this._Subtypes = NewStash();


  Type_root.addMethod(function eachSubtype(actionBlock) {
    !!!!
    var name, subcontexts;
    subcontexts = this._Subcontexts;
    for (name in subcontexts) {
      actionBlock.call(this, subcontexts[name]);
    }
    return this;
  });


Type_root.addMethod(function _addSubtype(subtype) {
  this._Subtypes[subtype._Name] = subtype;
  return this;
});
