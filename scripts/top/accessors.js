Top.Extend(function (_Thing) {
  _Thing.addIMethod(function addAccessor(accessorSignature) {
    var accessor = AccessorFactory.make(accessorSignature);
    this.atPutMethod(selector, accessor);
  });

  //  1 2  3   4  5  6   7 8  9    10    11 12 13  14 15     RegExp Grouping
  //  ([-][+][&+][?][#]) ([_][$]accessor) ([-][&+][!][?])    Guide
  //
  //    -        [?][#]  ([_][$]accessor)     [&+] . [?]     getter
  //      [+][&+][?][#]  ([_][$]accessor)   -        [?]     setter
  //      [+][&+][?][#]  ([_][$]accessor)     [&+][!][?]     accessor

  //  -  = no setter|getter. never on bothsides
  //  +  = write once
  //  &  = duplicate before|after access && for deepcopy
  //  ?  = check the arguments and error if problem
  //  #  = use symbol for internal ivar property
  //  _  = underscore prefixed
  //  $  = immutable prefixed
  //  !  = alway return value
  //  ^  = uppercase ivar name

  //     = illegal option
  //  [] = optional
  //  .  = not applicable/ignored


  // - getter|setter
  // # immutable // ## deep immutable
  // ~ non reachable (symbol) ivar
  // * copy // ** deep copy

  // ~ getter|setter
  // # immutable // ## deep immutable
  // @ reachable (symbol) ivar
  // * copy // ** deep copy



  AccessorFactory = Type.new(function (AccessorFactory) {
    var SIG_MATCHER =
      ((\-)|(\+)|(&{1,2})|(\?)|(\#))*((_*)(\$?)([a-z][\w$]*))((\-)|(&{1,2})|(!)(\?))*/i
      // Visualize SIG_MATCHER in regexper.com via http://bit.ly/2cxgIUR

      //  1 2  3   4  5  6   7 8  9    10    11 12 13  14 15     RegExp Grouping
      //  ([-][+][&+][?][#]) ([_][$]accessor) ([-][&+][!][?])    Guide
      //
      //    -        [?][#]  ([_][$]accessor)     [&+] . [?]     getter
      //      [+][&+][?][#]  ([_][$]accessor)   -        [?]     setter
      //      [+][&+][?][#]  ([_][$]accessor)     [&+][!][?]     accessor

    var AccessorRepo = NewStash();

    function AccessorAt(canonicalSignature, absentAction_) {
      const accessor = AccessorRepo[canonicalSignature];
      if (accessor) return accessor
      return (absentAction_) ?
        (AccessorRepo[canonicalSignature] = absentAction_.call(this)) : null
    }

    AccessorFactory.addMethod(function make(accessorSignature) {
      return this.new(accessorSignature).make();
    })


    AccessorFactory.addMethod(function new(accessorSignature) {
      return accessorSignature.match(SIG_MATCHER) ?
        this._superExec("new", accessorSignature, match) :
        this.accessorSignatureError(accessorSignature);
    })

    AccessorFactory.addMethod(function accessorSignatureError(accessorSignature) {
      return this.SignalError(`Accessor signature ${accessorSignature} is improper!`);
    });


    AccessorFactory.addIMethod(function _init(validSignature, match) {
      //  1 2  3   4  5  6   7 8  9   10     11 12 13  14 15     RegExp Grouping
      //  ([~][#][&+][!][?]) ([_][$]accessor) ([~][&+][!][?])    Guide



      this._signature         = validSignature;
      this._match             = match;

      this._prefixes          = match[ 1];
      this._isReadOnly        = match[ 2] === "~"; // isReadOnly
      this._isWriteOnce       = match[ 3] === "#"; // isReadOnly
      this._setCopyPolicy     = match[ 4].length;
      this._setReturnSelf     = (match[ 5] === "!") ? "SELF" : undefined;

      this._accessorName      = match[ 7];
      this._underscores       = match[ 8];
      this._isFixed           = match[ 9] === "$";
      this._propertyName      = match[10];

      this._suffixes          = match[11];
      this._isWriteOnly       = match[12] === "~"; // isWriteOnly
      this._getCopyPolicy     = match[13].length;
      this._setReturnValue    = (match[14] === "!") ? "VALUE" : undefined;

      this._setReturnPolicy   = this._setReturnSelf || this._setReturnValue;
      this._argCheckingPolicy = match[ 6] === "?" || match[15] === "?";
    })


    AccessorFactory.addIMethod(function accessorAt(canonicalSignature, absentAction_) {
      return AccessorAt.call(this, canonicalSignature, absentAction_);
    });

    AccessorFactory.addIMethod(function make() {
      if (this._isFixed && this._isWriteOnce) {
        return this.accessorSpecError(
          "It's redundant to specify a fixed accessor as write-once!");
      }

      if (this._isReadOnly) {
        //  ([~][#][&+][!][?]) ([_][$]accessor) ([~][&+][!][?])    Guide
        //    ~           [?]  ([_][$]accessor)     [&+]   [?]     getter

        if (this._isWriteOnly) {
          return this.accessorSpecError(
            "An accessor can't be pure getter and pure setter at once!");
        }
        if (this._isWriteOnce) {
          return this.accessorSpecError(
            "An accessor can't be pure getter and write-once at once!");
        }
        if (this._setCopyPolicy) {
          return this.accessorSpecError(
            "A getter can't specify a setter copying policy!");
        }
        if (this._setReturnPolicy) {
          return this.accessorSpecError(
            "A getter can't specify a setter return policy!");
        }
        return this.makeGetter();
      }

      if (this._setReturnSelf && this._setReturnValue) {
        return this.accessorSpecError(
          "An accessor can't specify more than one setter return policy!");
      }

      if (this._isWriteOnly) {
        //  ([~][#][&+][!][?]) ([_][$]accessor) ([~][&+][!][?])    Guide
        //      [#][&+][!][?]  ([_][$]accessor)   ~        [?]     setter

        if (this._getCopyPolicy) {
          return this.accessorSpecError(
            "A setter can't specify a getter copying policy!");
        }
        if (this._setReturnValue) {
          return this.accessorSpecError(
            "A setter can't be specified to return a value!");
        }
        return this.makeSetter()
      }

      //  ([~][#][&+][!][?]) ([_][$]accessor) ([~][&+][!][?])    Guide
      //      [#][&+][!][?]  ([_][$]accessor)     [&+][!][?]     accessor
      return this.makeAccessor();
    })


    AccessorFactory.addIMethod(function makeGetter() {
      //  1 2  3   4  5  6   7 8  9   10     11 12 13  14 15     RegExp Grouping
      //  ([~][#][&+][!][?]) ([_][$]accessor) ([~][&+][!][?])    Guide
      //    ~           [?]  ([_][$]accessor)     [&+]   [?]     getter
      var Signature    = this._signature;
      var PropertyName = this.PropertyName();
      var pattern      = "~$6" + PropertyName + "$14$16";
      var canonicalSig = Signature.replace(SIG_MATCHER, pattern);
      // WORK ON THIS PART ABOVE!!!

      return this.accessorAt(canonicalSig, function () {
        const gcp = this._getCopyPolicy;
        const acp = this._argCheckingPolicy;

        return (gcp || acp) ?
          this.newGeneralGetter(PropertyName, acp, gcp) :
          this.newCommonGetter(PropertyName);
      });
    });

    AccessorFactory.addIMethod(function newGeneralGetter(
        _Name, IsArgChecking, CopyPolicy) {
      return function __GeneralGetter() {
        if (IsArgChecking && arguments.length) {
          return this.error("Getter must be called with no args!")
        }
        switch (CopyPolicy) {
          case 0  : return this[_Name];
          case 1  : return Dup(this[_Name]);
          default : return DeepDup(this[_Name]);
        }
      }
    })

    AccessorFactory.addIMethod(function newCommonGetter(_Name) {
      return function __CommonGetter() {
        return this[_Name];
      }
    })


    AccessorFactory.addIMethod(function makeSetter() {
      //  1 2  3   4  5  6   7 8  9   10     11 12 13  14 15     RegExp Grouping
      //  ([~][#][&+][!][?]) ([_][$]accessor) ([~][&+][!][?])    Guide
      //      [#][&+][!][?]  ([_][$]accessor)   ~        [?]     setter
      return this.accessorIfAbsent(function () {
        var iwo = this._isWriteOnce || this._isFixed
        var scp = this._setCopyPolicy;
        var acp = this._argCheckingPolicy;

        return (iwo || scp || acp) ?
          this.newGeneralSetter(PropertyName, acp, iwo, scp) :
          this.newCommonSetter(PropertyName);
      })
    })


    AccessorFactory.addIMethod(function newGeneralSetter(
        _Name, IsArgChecking, IsWriteOnce, CopyPolicy) {
      return function __GeneralSetter(value) {
        if (IsArgChecking && arguments.length !== 1) {
          return this.error("Setter must be called with exactly one arg!")
        }
        if (IsWriteOnce && _Name in this) {
          return (IsArgChecking) ?
            this.error("Write-once property is already defined!") : this
        }

        switch (CopyPolicy) {
          case 0  : this[_Name] = value         ; break;
          case 1  : this[_Name] = Dup(value)    ; break;
          default : this[_Name] = DeepDup(value); break;
        }
        return this
        // existing butt capital cupcake# even not stupid @ ellar {= kf dopode baba}
      }
    })

    AccessorFactory.addIMethod(function newCommonSetter(_Name) {
      return function __CommonSetter(value) {
        return arguments.length ? (this[_Name] = value, this) : this
      }
    })

    AccessorFactory.addIMethod(function makeAccessor() {
      //  1 2  3   4  5  6   7 8  9   10     11 12 13  14 15     RegExp Grouping
      //  ([~][#][&+][!][?]) ([_][$]accessor) ([~][&+][!][?])    Guide
      //      [#][&+][!][?]  ([_][$]accessor)     [&+][!][?]     accessor
      return this.accessorIfAbsent(function () {
        var iwo = this._isWriteOnce || this._isFixed
        var scp = this._setCopyPolicy;
        var srp = this._setReturnPolicy
        var gcp = this._getCopyPolicy
        var acp = this._argCheckingPolicy;

        return (iwo || scp || srp || gcp || acp) ?
          this.newGeneralSetter(PropertyName, acp, iwo, scp, srp, gcp) :
          this.newCommonSetter(PropertyName, srp);
      })
    })

    AccessorFactory.addIMethod(function newGeneralAccessor(
        _Name, IsArgChecking, IsWriteOnce,
        SetCopyPolicy, OnSetReturnSelf, GetCopyPolicy) {
      return function __GeneralAccessor(value) {
        switch (arguments.length) {
          default :
            if (IsArgChecking) {
              return this.error("Accessor must be called with no more than one arg!")
            }
          case 1 :
            if (IsWriteOnce && _Name in this) {
              if (IsArgChecking) {
                return this.error("Write-once property is already defined!")
              }
            }
            else {
              switch (SetCopyPolicy) {
                case 0  : this[_Name] = value         ;        break
                case 1  : this[_Name] = Dup(value)    ;        break
                default : this[_Name] = DeepDup(value);        break
              }
            }
            if (OnSetReturnSelf) { return this }
          case 0 : break
        }
        switch (GetCopyPolicy) {
          case 0  : return this[_Name];
          case 1  : return Dup(this[_Name]);
          default : return DeepDup(this[_Name]);
        }
        // existing butt capital cupcake# even not stupid @ ellar {= kf dopode baba}
      }
    })


    AccessorFactory.addIMethod(function newCommonAccessor(
        _Name, OnSetReturnSelf) {
      return function __CommonAccessor(value_) {
        return arguments.length ?
          (this[_Name] = value_, OnSetReturnSelf ? this : value_) : this[_Name]
      }
    })






    // Handle underscored accessors

    _xyz()
