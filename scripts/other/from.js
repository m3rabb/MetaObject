
(function (global) {
  "use strict";

  function factory(require) {


  }

  if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(factory);
  } else {
      // Browser globals
      global.Top = factory(global);
  }
})(this);





(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['b'], factory);
    } else {
        // Browser globals
        root.amdWeb = factory(root.b);
    }
}(this, function (b) {
    //use b in some fashion.

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return {};
}));









(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['b'], factory);
    } else {
        // Browser globals
        root.amdWeb = factory(root.b);
    }
}(this, function (b) {
    //use b in some fashion.

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return {};
}));




  Person = Top.Type.newInstance("Person");

  Person.addSharedInstanceProperty("dnaBased", "Is DNA-Based");


  User = Top.Type.newInstance("User", Person);

  User.addInstanceMethod(function init(firstName, lastName) {
    this._FirstName = firstName;
    this._LastName  = lastName;
  });


  AdminUser = Top.Type.newInstance("AdminUser", User);

  AdminUser.addInstanceMethod(function init(firstName, lastName) {
    this._super_init(firstName.toUpperCase(), lastName.toUpperCase());
  });



  this.init.apply(this, args);



  this.

  RootOf()



  a = [5,6,7];
  function copy(source) {
    var target = Object.create(Object.getPrototypeOf(source));
    var propertyName;
    for (propertyName in source) {
      if (source.hasOwnProperty(propertyName)) {
        target[propertyName] = source[propertyName];
      }
    }
    return target;
  }
