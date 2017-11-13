describe("Skylighting", function () {
  "use strict"

  // Object hierarchy poisoning is when an unexpected property is added to the
  // Object.prototype, causing all other objects to inherit that properties.
  // This can unintentional reek havoc on a program, or intentional be used
  // to sabotage software, and/or gain access to private data.
  //
  // Properties are coming in from above, thus 'skylighting'.


  function Person(firstName, lastName, age) {
    this.firstName = firstName
    this.lastName  = lastName
    this.age       = age
  }

  function basic_toString() {
    var pairs, selector
    pairs = []

    for (selector in this) {
      pairs.push(`${selector}: ${this[selector]}`)
    }
    const name = this.constructor ? this.constructor.name : ""
    return `${name}(${pairs.join(", ")})`
  }


  describe("Example: 1", function () {
    beforeEach(function () {
      Person.prototype.toString = basic_toString
      Object.prototype.mood = "evil"
    })

    it("Is vulnerable to skylighting", function () {
      var person = new Person("Tormund", "Giantsbane", 39)
      var string = person.toString()
      expect( string ).toMatch( /mood: evil/ )
      expect( Object.keys(person).includes("mood") ).toBe( false )
    })

    afterEach(function () {
      delete Person.prototype.toString
      delete Object.prototype.mood
    })
  })

  function filtered_toString() {
    var pairs, selector
    pairs = []

    for (selector in this) {
      if (this.hasOwnProperty(selector)) {
        pairs.push(`${selector}: ${this[selector]}`)
      }
    }
    return `${this.constructor.name}(${pairs.join(", ")})`
  }

  describe("Example: 2", function () {
    beforeEach(function () {
      Person.prototype.toString = filtered_toString
      Object.prototype.mood = "evil"
    })

    it("Naively fixes vulnerability", function () {
      var person = new Person("Tormund", "Giantsbane", 39)
      var string = person.toString()
      expect( string ).not.toMatch( /mood: evil/ )
      expect( Object.keys(person).includes("mood") ).toBe( false )
    })

    afterEach(function () {
      delete Person.prototype.toString
      delete Object.prototype.mood
    })
  })

  describe("Example: 3", function () {
    beforeEach(function () {
      Person.prototype.toString = filtered_toString
      Object.prototype.mood = "evil"

      const originalHasOwnProperty = Object.prototype.hasOwnProperty

      Object.prototype.hasOwnProperty = function (selector) {
        return (selector === "mood") ?
          true : originalHasOwnProperty.call(this, selector)
      }
    })

    it("Still vulnerable", function () {
      var person = new Person("Tormund", "Giantsbane", 39)
      var string = person.toString()
      expect( string ).toMatch( /mood: evil/ )
      expect( Object.keys(person).includes("mood") ).toBe( false )
    })

    afterEach(function () {
      delete Person.prototype.toString
      delete Object.prototype.mood
    })
  })


  function retrieveNativeHasOwnProperty() {
    const iframe = document.createElement("iframe")
    iframe.hidden = true
    document.body.appendChild(iframe)
    return iframe.contentWindow.Object.hasOwnProperty
  }

  function protected_toString() {
    var pairs, selector
    const safeHasOwnProperty = retrieveNativeHasOwnProperty()
    pairs = []

    for (selector in this) {
      if (safeHasOwnProperty.call(this, selector)) {
        pairs.push(`${selector}: ${this[selector]}`)
      }
    }
    return `${this.constructor.name}(${pairs.join(", ")})`
  }

  describe("Example: 4", function () {
    const originalHasOwnProperty = Object.prototype.hasOwnProperty

    beforeEach(function () {
      Person.prototype.toString = protected_toString
      Object.prototype.mood = "evil"

      Object.prototype.hasOwnProperty = function (selector) {
        return (selector === "evil") ? true : originalHasOwnProperty(selector)
      }
    })

    it("Better fix of vulnerability", function () {
      var person = new Person("Tormund", "Giantsbane", 39)
      var string = person.toString()
      expect( string ).not.toMatch( /mood: evil/ )
      expect( Object.keys(person).includes("mood") ).toBe( false )
    })

    afterEach(function () {
      delete Person.prototype.toString
      delete Object.prototype.mood
      Object.prototype.hasOwnProperty = originalHasOwnProperty
    })
  })

  describe("Example: 5", function () {
    beforeEach(function () {
      this.person = new Person("Tormund", "Giantsbane", 39)
      this.configuration = {}
      Object.defineProperty(this.person, "favoriteFood", this.configuration)
    })

    it("using defineProperty defaults to setting the properties as false", function () {
      var descriptor = Object.getOwnPropertyDescriptor(this.person, "favoriteFood")
      expect( descriptor.writable ).toBe( false )
      expect( descriptor.configurable ).toBe( false )
      expect( descriptor.enumerable ).toBe( false )
    })

    it("Writing to a nonconfigurable property throws an error", function () {
      expect( () => { this.person.favoriteFood = "candy" } ).toThrowError( /Cannot assign to read only property/ )
    })
  })

  describe("Example: 6", function () {
    beforeEach(function () {
      // Poisoning!
      Object.defineProperty(Object.prototype, "writable", {
        configurable: true,
        value : true,
      })

      this.person = new Person("Tormund", "Giantsbane", 39)
      this.configuration = {}
      Object.defineProperty(this.person, "favoriteFood", this.configuration)
    })

    it("The writability of the configuration is assumed false, but is not", function () {
      var descriptor = Object.getOwnPropertyDescriptor(this.person, "favoriteFood")
      expect( descriptor.writable ).toBe( true )
      expect( descriptor.enumerable ).toBe( false )
      expect( descriptor.configurable ).toBe( false )
    })

    it("The property can unexpectly be written", function () {
      this.person.favoriteFood = "candy"
      expect( this.person.favoriteFood ).toBe( "candy" )
    })

    // Antidote!
    afterEach(function () {
      delete Object.prototype.writable
    })
  })

  describe("Example: 7", function () {
    beforeEach(function () {
      this.baseConfiguration = {writable : true}

      this.invisibleConfiguration = {
        __proto__ : this.baseConfiguration,
        enumerable : false,
      }

      this.visibleConfiguration = {
        __proto__ : this.baseConfiguration,
        enumerable : true,
      }
    })

    describe("When we depend upon inherited properties, hasOwnProperties is inadequate", function () {
      it("Improperly excludes desired inherited properties", function () {
        var configuration, localProperties, selector
        configuration = this.visibleConfiguration
        localProperties = []

        for (selector in configuration) {
          if (configuration.hasOwnProperty(selector)) {
            localProperties.push(selector)
          }
        }

        expect( localProperties.writable ).not.toBe( false )
      })
    })
  })

  describe("Example: 8", function () {
    describe(`One solution is to declare default values for all known
      properties in the root object
      in order to overshadow poison skylight properties.`, function () {

      beforeEach(function () {
        this.baseConfiguration = {
          writable     : false,
          configurable : false,
        }

        this.invisibleConfiguration = {
          __proto__ : this.configuration,
          enumerable : false,
        }

        this.visibleConfiguration = {
          __proto__ : this.configurable,
          enumerable : true,
        }

        // Poisoning!
        Object.defineProperty(Object.prototype, "configurable", {
          writable : true,
          value : true
        })

        it("Configuration remains false", function () {
          expect( this.visibleConfiguration.configurable ).toBe( false )
          expect( this.visibleConfiguration.__proto__.configurable ).toBe( true )
        })

        // Antidote!
        afterEach(function () {
          delete Object.prototype.configurable
        })
      })
    })
  })

  beforeAll(function () {
    this.bakingIngredients = {
      flour : 30,
      sugar : 10,
      salt  : 0.1,
      butter : 6,
    }

    this.cookieIngredients = {
      __proto__ : this.bakingIngredients,
      flour     : 15,
      butter    : 10,
    }

    this.cakeIngredients = {
      __proto__ : this.bakingIngredients,
      milk      : 20,
      eggs      : 6,
      vanilla   : 0.3,
    }

    this.mauricesCookieIngredients = {
      __proto__      : this.cookieIngredients,
      butter         : 12,
      pecans         : 2.5,
      chocolateChips : 1.5,
    }
  })

  describe("Example: 9", function () {
    describe(`However, when it's impossible/impractical to know apriori all
    possible properties, and still want/need to use inheritance, one must use
    dynamic techniques to prevent poisoned properties.`, function () {

      beforeEach(function () {
        // Poisoning!
        Object.prototype.poison = 0.2
      })

      it("Inherits poison", function () {
        var result = basic_toString.call(this.mauricesCookieIngredients)
        expect( result ).toMatch( /poison/ )
      })

      // Antidote!
      afterEach(function () {
        delete Object.prototype.poison
      })
    })
  })

  function knownVisibleProperties(object) {
    var target, ownSelectors
    const selectors = []
    const found = Object.create(null)
    target = object

    do {
      ownSelectors = Object.keys(target)
      ownSelectors.forEach(selector => {
        if (found[selector] === undefined) {
          found[selector] = true
          selectors.push(selector)
        }
      })
      target = Object.getPrototypeOf(target)
    } while (target !== null && target !== Object.prototype)

    return selectors
  }

  function limited_toString() {
    var pairs = []
    const selectors = knownVisibleProperties(this)
    selectors.forEach(selector => pairs.push(`${selector}: ${this[selector]}`))
    return `Person(${pairs.join(", ")})`
  }


  describe("Example: 10", function () {
    describe(`Collect the properties at each level of the hierarchy up until
      but not including the Object.prototype.`, function () {

      beforeEach(function () {
        // Poisoning!
        Object.prototype.poison = 0.2
      })

      it("Inherits poison", function () {
        var result = limited_toString.call(this.mauricesCookieIngredients)
        expect( result ).not.toMatch( /poison/ )
      })

      // Antidote!
      afterEach(function () {
        delete Object.prototype.poison
      })
    })
  })

  describe("Example: 11", function () {
    describe(`Better yet, avoid the entire issue by setting null as
      the root of the hierarchy.`, function () {

      beforeEach(function () {
        this.bakingIngredients.__proto__ = null

        // Poisoning!
        Object.prototype.poison = 0.2
      })

      it("Inherits poison", function () {
        var result = basic_toString.call(this.mauricesCookieIngredients)
        expect( result ).not.toMatch( /poison/ )
      })

      // Antidote!
      afterEach(function () {
        this.bakingIngredients.__proto__ = Object.prototype
        delete Object.prototype.poison
      })
    })
  })
})


// Apriori knowing all the selectors you might need might not be possible.
// Further, you might make a mistake and forget to add one.

// Philosophically, I find this problematic. It's putting a chain on a bad dog,
// instead of simply training the dog to behave in the firt placed

// Object hierarchy poisoning aka Skylighting
// The semantics of getters, can make them problematic to use with proxies.
