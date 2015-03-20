// ref & thing/targ/obj


// Enable an option on instantiation to enable an obj to add local methods.
// It won't when the outer obj descends from descrete sub public roots.  It
// requires that an obj's outer descend directly from Public_root to work.

._super


- simple structure
- add accessors
- add $ methods

POSSIBLE_PRIVATE_ACCESS_MATCHER = /(\.\s*_)|([\w$\)\]}]\s*\[)/;

at_ifAbsent_ifPresent(key, absentAction_, presentAction_)

at_ifPresent_ifAbsent
at_ifAbsent_ifPresent



function NewPermute10(method) {
  return function permute10(b, a) {
    var count = arguments.length;
    return (count <= 2) ?
      method.call(this, a, b) :
      method.apply(this, FixArgs([a, b], 2, arguments, count));
  };
}

function NewPermute021(method) {
  return function permute021(a, c, b) {
    var count = arguments.length;
    return (count <= 3) ?
      method.call(this, a, b, c) :
      method.apply(this, FixArgs([a, b, c], 3, arguments, count));
  };
}

function NewPermute102(method) {
  return function permute102(b, a, c) {
    var count = arguments.length;
    return (count <= 3) ?
      method.call(this, a, b, c) :
      method.apply(this, FixArgs([a, b, c], 3, arguments, count));
  };
}

function NewPermute120(method) {
  return function permute120(b, c, a) {
    var count = arguments.length;
    return (count <= 3) ?
      method.call(this, a, b, c) :
      method.apply(this, FixArgs([a, b, c], 3, arguments, count));
  };
}

function NewPermute201(method) {
  return function permute201(c, a, b) {
    var count = arguments.length;
    return (count <= 3) ?
      method.call(this, a, b, c) :
      method.apply(this, FixArgs([a, b, c], 3, arguments, count));
  };
}

function NewPermute210(method) {
  return function permute210(c, b, a) {
    var count = arguments.length;
    return (count <= 3) ?
      method.call(this, a, b, c) :
      method.apply(this, FixArgs([a, b, c], 3, arguments, count));
}

function FixArgs(args, next, actualArgs, count) {
  while (next < count) {
    args[next] = actualArgs[next++];
  }
  return args;
}



ifAbsent_at_ifPresent
ifAbsent_ifPresent_at
ifPresent_at_ifAbsent
ifPresent_ifAbsent_at
at_ifPresent
ifPresent_at
at








check to make sure that if a method has super it must be followed by an access

  /_super\s*[\[\.]/




  Thing.addInstanceMethod(function _init$($spec) {
    // $(element next _set)
    this._Name = $spec.name;
    $spec._set.call(this);
  });


  function CreateGeneralAccessor(_Selector, Options) {
    //      [&]   friends [&][!] *
    var IsCopyOnWrite        = Options.isCopyOnWrite;
    var IsCopyOnRead         = Options.isCopyOnRead;
    var IsAlwaysAnswersValue = Options.isForceForReads;

    return function(value_) {
      var value;
      if (arguments.length) {
        value = IsCopyOnWrite ? Dup(value_) : value_;
        this[_Selector] = value;
        return IsAlwaysAnswersValue ? value : this;
      }
      value = this[_Selector];
      return IsCopyOnRead ? Dup(value) : value;
    };
  }

  function NewCommonAccessor(_Selector) {
    return function(value_) {
      return (arguments.length) ?
        (this[_Selector] = value_, this) : this[_Selector];
    };
  });

  function improperSuperAccessError() {
    SignalError(this, "_super can only be called from within a method!");
  }

  Object.defineProperty(Public_root, '_super', {get: improperSuperAccessError});

  .lockProperty



  function CreateGeneralWriteOnceAccessor(_$Selector, Options) {
    //    + [&][!]friends [&][!][?]
    var IsCopyOnWrite             = Options.isCopyOnWrite;
    var IsAlwaysAnswersValue      = Options.isForceForReads;
    var IsAnswersSelfWhenAsSetter = Options.isForceForWrites;
    var IsCopyOnRead              = Options.isCopyOnRead;
    var IsArgChecking             = Options.isArgChecking;

    return function (value_) {
      var value;
      if (arguments.length) {
        if (_$Selector in this) {
          if (IsArgChecking) { return this.immutableWriteError(Options); }
          if (IsAnswersSelfWhenAsSetter) { return this; }
        }
        else {
          value = IsCopyOnWrite ? Dup(value_) : value_;
          this[_$Selector] = value;
          this.lockProperty(_$Selector);
          return IsAlwaysAnswersValue ? value : this;
        }
      }
      value = this[_$Selector];
      return IsCopyOnRead ? Dup(value) : value;
    };
  }

  function CreateCommonWriteOnceAccessor(_$Selector) {
    return function (value_) {
      if (arguments.length) {
        this[_$Selector] = value_;
        return this.lockProperty(_$Selector);
      }
      return this[_$Selector];
    };
  }




  dog({at:1, put: 2})
dog()

  NewInstance = function newInstance(/* arguments */) {
    var  root     = this._InstanceRoot;
    var  ref      = SpawnFrom(Ref_root);
    var  instance = SpawnFrom(root);
    var _super    = SpawnFrom(Super_root);

    ref.__target = NewInnerAccessor(instance);
    ref.__Ref    = ref;

    // instance.__target must be undefined
    instance.__Ref  =  ref;
    instance._super = _super;

    _super.__Ref    = ref;
    _super.__Target = instance;

    root._init.apply(instance, arguments);
    return Lock(ref);
  }


InvalidateRef
_noSuchMethod(Selector, arguments);


  function NewDelegationMethod(Selector) {
    return AsMethodNamed(function (/* arguments */) {  // __delegate
      var target = this.__target(INNER_KEY);
      var result = target[Selector].apply(target, arguments);
      return (result instanceof Implementation) ? result.__Ref : result;
    }, Selector);
  }




InvalidInner.addInstanceMethod(function _init(outer, inner) {
  this._Inner = inner;
  this._Outer = outer;
});

InvalidInner.addInstanceMethod(function _noSuchMethod(selector, args) {
  return SignalError(
    this._Inner,
    "The outer: " + this._Outer + " for the inner: " + this._Inner +
    " is invalid.")
});


function AttachNewPublicOuter(outer, inner) {
  var newOuter = SpawnFrom(Public_root);
  var invalidInner = InvalidInner.newInstance(outer, inner);
  outer.__target(REPLACE_INNER_KEY, invalidInner);
}


InstallMethodSet_(Thing_public, Thing_private, "atPutMethod",
  function atPutMethod(selector, method) {
    var outer = this.__Outer;
    if (outer.__proto__ !== Public_root) {
      outer = AttachNewPublicOuter(outer, this);
    }
    InstallMethod(outer, this, selector, method);
    return this;
  }
);

InstallMethodSet_(Thing_public, Thing_private, "addMethod",
  function addMethod(namedFunction) {
    return this.atPutMethod(namedFunction.name, namedFunction);
  }
);

InstallMethodSet_(Thing_public, Thing_private, "_newInstance", _NewInstance);

InstallMethodSet_(Thing_public, Thing_private, "newInstance",
  function newInstance(/* arguments */) {
    return Cover(this._newInstance.apply(this, arguments));
  }
);


this._new_from("List", args)
this._Top.String

thing.$({at: "a", put: 4})




=====

!!! Already chosen #2

Two ways to go:
1) check to prevent this from being assigned or passed as a parameter (except to
  apply or call) within private methods, to keep it from being assigned to an
  ivar, or escaping into another function as a param
2) simple check all public functions to make sure they don''t return any
  implementation obj, not just inner this

// ASSIGNMENT_OF_THIS_MATCHER = /[^=!+]=\s*this([;,]|\s+[$\w;,])/;
ASSIGNMENT_OF_THIS_MATCHER = /[^=!+]=\s*this([;,]|(\s*\/\/.*\n|\/\*(.|\n)+\*\/|\s)?\s*[$\w;,])/;
