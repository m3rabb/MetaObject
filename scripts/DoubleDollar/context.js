

function ExtractParameters(func) {
  var source = func.toString();
  var parametersText = source.split(ParenthesesMatcher)[1];
  return AsSelectorList(parametersText);
}

function AsSelectorList(string_strings) {
  return IsArray(string_strings) ? string_strings :
    (string_strings.match(SelectorMatcher) || []);
  }
}



function ExtractParametersAsSelectors(func) {
        var source, parametersString, parameterNames;
        source = func.toString();
        parametersString = source.split(/\(|\)/)[1];
        parameterNames = AsSelectorList(parametersString);
        return parameterNames.map(function (name) {
            var selector, firstChar;
            selector = name.match(/([a-z0-9$_]+)?[a-z0-9$]/i)[0];
            firstChar = selector[0];
            return firstChar.toLowerCase() + selector.slice(1);
        });
    }




Context = Type.New("Context", function () {
  this.AddIMethod(function New(name, supercontext_) {
    if (IsLowerCase(name)) {
      return this.SignalError("Context must have an uppercase name!");
    }
    var supercontext = supercontext_ || null;
    if (supercontext && supercontext[As$Name(name)]) {
      return this.SignalError("Super context already contains name!");
    }
    var root = (supercontext === global) ? null : supercontext;
    var instance = SpawnFrom(root || this._instanceRoot);
    return instance._Init(name, supercontext, root);
  });

  this.AddIMethod(function _Init(name, supercontext, supercontext_) {
    this._super._Init(name);
    this._subcontexts = [];
    this._supercontext = supercontext;
    this.AddProperty(name, this);
    if (supercontext_) {
      var subcontexts = supercontext_._subcontexts;
      subcontexts.push(this);
      subcontexts.sort();
    }
  });

  this.AddIMethod(function Supercontext() { return this._supercontext; });

  this.AddIMethod(function Subcontexts() {
    return this._subcontexts.slice();
  });

  this.AddIMethod(function Lock() {
    if (this.IsLocked()) { return this; }
    return this.PropertiesDo(this.LockProperty);
    // return this._super.Lock();
  });

  this.AddIMethod(function PropertiesDo(action) {
    var name, names, index;
    names = PropertiesOf(this);
    index = names.length;
    while (index--) {
      name = names[index];
      if (name[0] === "$") {
        action.call(this, name, this[name]);
      }
    }
    return this;
  });

  this.AddIMethod(function AddProperty(name, value) {
    var $name = As$Name(name);
    if (IsLowerCase) {
      return this.SignalError("Property name ", name, " must be uppercase!");
    }
    if (this.IsLocked()) {
      if (this[$name]) {
        return this.SignalError("Cannot overwrite locked property: ", $name, " !");
      }
      return SetImmutableProperty(this, $name, value);
    }
    this[$name] = value;
    return this;
  });

  this.AddIMethod(function Add(/* arguments */) {
    var index, count, namedObject;
    index = -1;
    count = arguments.length;
    while (++index < count) {
      namedObject = arguments[index];
      this.AddProperty(namedObject.Name(), namedObject);
    }
    return this;
  });

  this.AddIMethod(function SetType(name, supertype_extend_, extend_) {
    var supertype, extensionAction, type;

    switch (typeof supertype_extend_) {
      case "string" :
        supertype = this[As$Name(supertype_extend_)];
        extensionAction = extend_;
        if (supertype == null) {
          this.SignalError("Can't find supertype: ", supertype_extend_, "!");
          return null;
        }
        break;
      case "object" :
        supertype = supertype_extend_;
        extensionAction = extend_;
        break;
      case "function" :
        extensionAction = supertype_extend_;
        break;
    }

    if ((type = this[As$Name(name)])) {
      if (supertype && supertype !== type._supertype) {
        this.SignalError("Type ", name, " exists with different supertype!");
        return null;
      }
    } else {
      type = Type.New(name, supertype);
      this.Add(type);
    }
    return type.Extend(extensionAction);
  });

  this.AddIMethod(function SetSubcontext(name, extend_) {
    return Context.New(name, this).Extend(extend_);
  });
});

return Context.New("Top", function () {
  this.Add(Thing, Nothing, Type, Context);
  this.AddMethod(NewStash, RootOf, SpawnFrom);
  this.AddMethod(IsArray, IsUpperCase);

  this.AddMethod(function IsRind(target) {
    return target instanceof _Rind;
  });

  this.AddMethod(function IsPulp(target) {
    return target instanceof _Pulp;
  });
});
}
