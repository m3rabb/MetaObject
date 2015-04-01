
accessors

setOid()



_Private
__Private_Dont_Touch
___Implementation_Dont_Touch





  function isTopObject(target) {
    return target instanceof Implementation_root;
  }

  function AsProtectedProperty(selector) {
    return "_" + selector[0].toUpperCase() + selector.slice(1);
  }

  function AsPrivateProperty(selector) {
    return "__" + selector[0].toUpperCase() + selector.slice(1);
  }

  function AsProtectedProperty(selector) {
    var firstChar = selector[0];
    return (firstChar === "_") ?
      selector : "_" + firstChar.toUpperCase() + selector.slice(1);
  }


(function (global) {
  function factory(require) {
    var b = require("b");
      //use b in some fashion.

      // Just return a value to define the module export.
      // This example returns an object, but the module
      // can return a function as the exported value.
      return {};
  }

  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(factory);
  } else {
      // Browser globals
      global.Top = factory(global.b);
  }
})(this);





define(function (require) {
  "use strict";
  var Top = require('Top');
  var Thing = Top.Thing;

  Type.addAccessors("name! instanceRoot! supertype! subtypes!&");



  function Yourself() { return this; }

Thing_root.addGetter("oid");

Thing_root.addMethod(function init(/* arguments */) {
  // this._super_init();
  this.oid(UniqueId(this.typeName()));
  return this;
});

Thing_root.addMethod(function typeName(block) {
  return this._Type.name();
});


Thing_root.addMethod(function passInto(block) {
  block.call(this);
  return this;
});

Thing_root.addMethod(function type() {
  return this._Type;
};



  Thing.addInstanceMethod(function _setPropertiesFrom(source) {
    var propertyName;
    for (propertyName in source) {
      if (source.hasOwnProperty(propertyName)) {
        this[propertyName] = source[propertyName];
      }
    }
    return this;
  });

  Thing.addInstanceMethod(function newCopy(/* arguments */) {
    var root = this._SharedRoot;
    var newInstance = Top.spawnFrom(root);
    return root.init(newInstance, arguments);
  });

  Thing.addInstanceMethod(function shallowCopy() {
    var newInstance = Top.spawnFrom(this._SharedRoot);
    return newInstance._setPropertiesFrom(this);
  });

  Thing.addInstanceMethod(function copy() {
    return this.shallowCopy();
  });


  Thing.addInstanceMethod(function shouldNotImplement() {
    return this.signalError("Method should not be implemented!");
  });

  Thing.addInstanceMethod(function notYetImplemented() {
    return this.signalError("Method not yet implemented!");
  });

  Thing.addInstanceMethod(function notYetTested() {
    return this.signalError("Method not yet tested!");
  });

  Thing.addInstanceMethod(function subtypeResponsibility() {
    return this.signalError("Method should be implemented by this or subtype!");
  });

  Thing.addInstanceMethod(function passInto(block) {
    block.call(this);
    return this;
  });



  Type.addMethod(function newInstance(typeName, supertype_) {
    var supertype = supertype_ || Thing;
    var type = this[typeName];
    if (type) {
      return (type._Supertype === supertype) ? type :
        this.signalError("Type already exists with different supertype!");
    }
    type = this._super_newInstance(typeName, supertype);
    return (Types[typeName] = type);
  });

  Type.addMethod(function isValidName(target) {
    return target.match && target.match(/^[A-Z]/);
  });



  Type.addInstanceMethod(function addSharedInstanceProperty(name, value) {
    return this._InstanceRoot[name] = value;
  });

  Type.addInstanceMethod(function addSubtype(typeName_, block_) {
    var typeName, block, type;

    switch (typeof arguments[0]) {
      case "string" :
        block = block_ || Nop;
        typeName = typeName_;
      case "function" :
        block = typeName_;
        typeName = block.name;
    }
    if (!Type.isValidName(typeName)) {
      this.signalError(
        "Arguments must be valid typeName | typeName & function | typeNamed function!");
    }
    type = Type.newInstance(typeName, this);

    block && block.call(type, type);
    return this;
  });

  Type.addAccessors("name! instanceRoot! supertype! subtypes!&");
this._InstanceRoot = instanceRoot;
instanceRoot._Type = this;

this._Name = name;

this._Supertype = supertype;
supertype._Subtypes[name] = this;
this._Subtypes = NewStash();



});

IsFunction = function isFunction(target) {
  return typeof target === "function";
};

IsString = function isString(target) {
  return typeof target === "string";
};


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




s
