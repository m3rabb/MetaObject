Top.Extend(function (_Thing) {
  _Thing.addIMethod(function addAccessor(accessorSignature, options_) {
    const accessor = AccessorFactory.make(accessorSignature, options_)
    this.atPutMethod(accessor.selector, accessor)
  })

  AccessorFactory = Type.new(function (AccessorFactory) {
      // Visualize SIG_MATCHER in regexper.com via http://bit.ly/------

    //  1 2  3   4   5  6  7   8 9  10   11    12 13 14  15  16 17 RegExp Grouping
    //  ([~][+][*+][#+][?]) ([_][$]accessor)(:+)(ivar) ([~][*+][#+][!][?])    Guide
    //
    //    ~            [?]  ([_][$]accessor)     [*+][#+] . [?]     getter
    //      [+][*+][#+][?]  ([_][$]accessor)   ~            [?]     setter
    //      [+][*+][#+][?]  ([_][$]accessor)     [*+][#+][!][?]     accessor

    //  ~  = no setter|getter. never on bothsides
    //  +  = write once
    //  *  = duplicate before|after access ** for deepcopy
    //  #  = as immutable before|after access ## for deep immutable
    //  &  = use private (vs symbol) for internal ivar property
    //  ?  = check the arguments and error if problem
    //  _  = privacy prefixed
    //  $  = fixed property prefixed
    //  !  = alway return value

    //     = illegal option
    //  [] = optional
    //  .  = not applicable/ignored

    const SymbolRepo   = NewStash()
    const AccessorRepo = NewStash()

    AccessorFactory.addOMethod(function symbolAt(name) {
      return SymbolRepo[name] || (SymbolRepo[name] = Symbol(`@${name}`))
    })


    AccessorFactory.addOMethod(function make(signature_selector, options_) {
      const [selector, options] = options_ ?
        [signature_selector, options_] : this.parseSignature(signature_selector)
      const accessor = this._super("new", selector, options).make()
      return {selector: selector, accessor: accessor}
    })

    AccessorFactory.removeOMethod("new")

    AccessorFactory.addOMethod(function accessorSignatureError(accessorSignature) {
      return this.SignalError(`Accessor signature ${accessorSignature} is improper!`);
    })

    AccessorFactory.addOMethod(function parseSignature(signature) {
      const SIGNATURE_MATCHER   = /^([~*#:?+]*)([\w$]+)(:([\w$]+))?([~*#:?!]*)$/
      const COPY_POLICY_MATCHER = /(^[^#*]*(\*{1,2}|#{1,2})[^#*]*$)?/

      const match = SIGNATURE_MATCHER.exec(signature)
      if (!match) { return this.improperAccessorSignatureError(signature) }

      const prefix      = match[1]
      const selector    = match[2]
      const ivarName    = match[3] && match[4] || ""
      const suffix      = match[5]

      const options = {
        isArgChecking         : signature.indexOf("?") >= 0,
        isExplicit            : signature.indexOf("~~") >= 0,
        ivarName              : ivarName,

        isGetter              : prefix.indexOf("~") >= 0,
        isWriteOnce           : prefix.indexOf("+") >= 0,
        setCopyPolicy         : prefix.match(COPY_POLICY_MATCHER)[2] || "",

        isSetter              : suffix.indexOf("~") >= 0,
        getCopyPolicy         : suffix.match(COPY_POLICY_MATCHER)[2] || "",
        alwayReturnValue      : suffix.indexOf("!") >= 0,
      }

      return [selector, options]
    })


    AccessorFactory.addIMethod(function _init(selector, options) {
      const ACCESSOR_SELECTOR_MATCHER = /_*(\$*)([\w$]+)/
      const EXPLICIT_ACCESSOR_MATCHER = /_*(\$*)(set|get)(([A-Z])|_*(\$*))([\w$]+)/
      let name = options.ivarName
      const match, isFixed, first, descriptor, prefix

      if (!name) {
        if (options.isExplicit) {
          match = selector.match(EXPLICIT_ACCESSOR_MATCHER)
          if (!match) { return this.explicitAccessorError(selector) }
          isFixed = !!(match[1] && match[5])
          first = (match[4] || "").toLowerCase()
          descriptor = first + match[6]
        }
        else {
          match = selector.match(ACCESSOR_SELECTOR_MATCHER)
          if (!match) { return this.accessorSelectorError(selector) }
          isFixed = !!(match[1])
          descriptor = match[2]
        }
        prefix = (name === "") ? "_" : "@"
        name = prefix + descriptor
      }
      const property = (name[0] === "@") ? this.symbolAt(name) : name

      if (property === selector) {
        return this.selectorAndIvarShareSameNameError(selector)
      }

      const isWriteOnce = !!options.isWriteOnce
      if (isWriteOnce && isFixed) {
        return this.accessorSpecError(
          "It's redundant to specify a fixed accessor as write-once!");
      }
      this._selector    = selector
      this._options     = options
      this._isWriteOnce = isWriteOnce || isFixed
      this._name        = name
      this._property    = property
    })

    //
    // isSetter;isArgChecking;isWriteOnce;setCopyPolicy;alwayReturnValue
    // isGetter;getCopyPolicy
    //


    AccessorFactory.addIMethod(function make() {
      const options = this._options
      if (options.isGetter) {
        //  ([~][+][*+][#+][&][?]) ([_][$]accessor) ([~][*+][#+][!][?])    Guide
        //
        //    ~            [&][?]  ([_][$]accessor)     [*+][#+] . [?]     getter

        if (options.isSetter) {
          return this.accessorSpecError(
            "An accessor can't be pure getter and pure setter at once!")
        }
        if (options.isWriteOnce) {
          return this.accessorSpecError(
            "An accessor can't be pure getter and write-once at once!")
        }
        if (options.setCopyPolicy) {
          return this.accessorSpecError(
            "A getter can't specify a setter copying policy!")
        }

        return this.makeGetter()
      }

      if (options.isSetter) {
        //  ([~][+][*+][#+][&][?]) ([_][$]accessor) ([~][*+][#+][!][?])    Guide
        //
        //      [+][*+][#+][&][?]  ([_][$]accessor)   ~            [?]     setter

        if (options.getCopyPolicy) {
          return this.accessorSpecError(
            "A setter can't specify a getter copying policy!")
        }
        if (options.alwayReturnValue) {
          return this.accessorSpecError(
            "A setter can't be specified to return a value!")
        }
        return this.makeSetter()
      }

      //  ([~][+][*+][#+][&][?]) ([_][$]accessor) ([~][*+][#+][!][?])    Guide
      //
      //      [+][*+][#+][&][?]  ([_][$]accessor)     [*+][#+][!][?]     accessor
      return this.makeAccessor();
    })


    AccessorFactory.addIMethod(function makeGetter() {
      //  ([~][+][*+][#+][&][?]) ([_][$]accessor) ([~][*+][#+][!][?])    Guide
      //
      //    ~            [&][?]  ([_][$]accessor)     [*+][#+] . [?]     getter

      return this.accessorIfAbsent((property, options) => {
        const iac = options.isArgChecking
        const gcp = options.getCopyPolicy

        return (iac || gcp) ?
          this.newGeneralGetter(property, iac, gcp) :
          this.newCommonGetter(property)
      })
    })

    AccessorFactory.addIMethod(function newGeneralGetter(
        Property, IsArgChecking, CopyPolicy) {
      return function __GeneralGetter() {
        if (IsArgChecking && arguments.length) {
          return this.error("Getter must be called with no args!")
        }
        switch (CopyPolicy) {
          case "*"  : return Dup(this[Property])
          case "**" : return DeepDup(this[Property])
          case "#"  : return AsImmutable(this[Property])
          case "##" : return AsDeepImmutable(this[Property])
          default   : return this[Property]
        }
      }
    })

    AccessorFactory.addIMethod(function newCommonGetter(Property) {
      return function __CommonGetter() {
        return this[Property];
      }
    })


    AccessorFactory.addIMethod(function makeSetter() {
      //  ([~][+][*+][#+][&][?]) ([_][$]accessor) ([~][*+][#+][!][?])    Guide
      //
      //      [+][*+][#+][&][?]  ([_][$]accessor)   ~            [?]     setter

      return this.accessorIfAbsent((property, options) => {
        const iac = options.isArgChecking;
        const iwo = this._isWriteOnce
        const scp = options.setCopyPolicy;

        return (iac || iwo || scp) ?
          this.newGeneralSetter(property, iac, iwo, scp) :
          this.newCommonSetter(property);
      })
    })

    AccessorFactory.addIMethod(function newGeneralSetter(
        Property, IsArgChecking, IsWriteOnce, CopyPolicy) {
      return function __GeneralSetter(value) {
        if (IsArgChecking && arguments.length !== 1) {
          return this.error("Setter must be called with exactly one arg!")
        }
        if (IsWriteOnce && Property in this) {
          return (IsArgChecking) ?
            this.error("Write-once property is already defined!") : this
        }

        switch (CopyPolicy) {
          case "*"  : this[Property] = Dup(value)            ; break
          case "**" : this[Property] = DeepDup(value)        ; break
          case "#"  : this[Property] = AsImmutable(value)    ; break
          case "##" : this[Property] = AsDeepImmutable(value); break
          default   : this[Property] = value                 ; break
        }
        return this
        // existing butt capital cupcake# even not stupid @ ellar {= kf dopode baba}
      }
    })

    AccessorFactory.addIMethod(function newCommonSetter(Property) {
      return function __CommonSetter(value) {
        return arguments.length ? (this[Property] = value, this) : this
      }
    })


    AccessorFactory.addIMethod(function makeAccessor() {
      //  ([~][+][*+][#+][&][?]) ([_][$]accessor) ([~][*+][#+][!][?])    Guide
      //
      //      [+][*+][#+][&][?]  ([_][$]accessor)     [*+][#+][!][?]     accessor
      return this.accessorIfAbsent((property, options) => {
        const iac = options.isArgChecking
        const iwo = this._isWriteOnce
        const scp = options.setCopyPolicy
        const srp = !options.alwayReturnValue // setReturnPolicy
        const gcp = options.getCopyPolicy

        return (iac || iwo || scp || arv || gcp) ?
          this.newGeneralAccessor(property, iac, iwo, scp, srp, gcp) :
          this.newCommonAccessor(property, srp);
      })
    })

    AccessorFactory.addIMethod(function newGeneralAccessor(
        Property, IsArgChecking, IsWriteOnce,
        SetCopyPolicy, OnSetReturnSelf, GetCopyPolicy) {
      return function __GeneralAccessor(value_) {
        switch (arguments.length) {
          default : // More than 1 arg
            if (IsArgChecking) {
              return this.error("Accessor must be called with no more than one arg!")
            }
          case 1 :
            if (IsWriteOnce && Property in this) {
              if (IsArgChecking) {
                return this.error("Write-once property is already defined!")
              }
            }
            else {
              switch (CopyPolicy) {
                case "*"  : this[Property] = Dup(value_)            ; break
                case "**" : this[Property] = DeepDup(value_)        ; break
                case "#"  : this[Property] = AsImmutable(value_)    ; break
                case "##" : this[Property] = AsDeepImmutable(value_); break
                default   : this[Property] = value_                 ; break
              }
            }
            if (OnSetReturnSelf) { return this }
          case 0 : break
        }
        switch (CopyPolicy) {
          case "*"  : return Dup(this[Property])
          case "**" : return DeepDup(this[Property])
          case "#"  : return AsImmutable(this[Property])
          case "##" : return AsDeepImmutable(this[Property])
          default   : return this[Property]
        }
        // existing butt capital cupcake# even not stupid @ ellar {= kf dopode baba}
      }
    })

    AccessorFactory.addIMethod(function newCommonAccessor(
        Property, OnSetReturnSelf) {
      return function __CommonAccessor(value_) {
        return arguments.length ?
          (this[Property] = value_, OnSetReturnSelf ? this : value_) :
          this[Property]
      }
    })



    AccessorFactory.addIMethod(function accessorIfAbsent(absentAction) {
      const options = this._options
      const iac = options.isArgChecking ? "?" : ""
      const iwo = this._isWriteOnce ? "+" : ""
      const srp = options.alwayReturnValue ? "!" : ""
      const scp = options.setCopyPolicy
      const gcp = options.getCopyPolicy

      const canonicalSignature =
        (options.isGetter ?              `~${name}${gcp}${iac}` :
          (options.isSetter ? `${iwo}${scp}${name}~${iac}` :
                              `${iwo}${scp}${name}${gcp}${srp}${iac}`))

      return AccessorRepo[canonicalSignature] ||
        (AccessorRepo[canonicalSignature] =
          absentAction.call(this, this._property, options))
    })

  //  1 2  3   4   5  6  7   8 9  10   11    12 13 14  15  16 17 RegExp Grouping
  //  ([~][+][*+][#+][?]) ([_][$]accessor)(:+)(ivar) ([~][*+][#+][!][?])    Guide
  //
  //    ~            [?]  ([_][$]accessor)     [*+][#+] . [?]     getter
  //      [+][*+][#+][?]  ([_][$]accessor)   ~            [?]     setter
  //      [+][*+][#+][?]  ([_][$]accessor)     [*+][#+][!][?]     accessor



name ##+setName
setName

_setName _name

~+**##?_name~**##!?

match(//g)


//  ([~][+][*+][#+][&][?]) ([_][$]accessor) ([~][*+][#+][!][?])    Guide
