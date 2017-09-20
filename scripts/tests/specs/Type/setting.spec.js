Tranya.ImplementationTesting(function (
  $ASSIGNERS, $BARRIER, $OUTER, $PULP,
  HasOwn, OwnKeys, RootOf, Type
) {
  "use strict"

  describe("Type setting methods", function () {
    const BREED = Symbol("BREED")

    beforeAll(function () {
      this.CatSpec = {
        name   : "Cat",
        define : [
          function _init(name, breed, age) {
            this._setName(name)
            this[BREED] = breed
            this._age   = age
          },

          function age() { return this._age },

          function asString() { return `${this.name}:${this.age}` },
        ]
      }
    })

    describe("#forAddAssigner", function () {
      beforeEach(function () {
        this.Cat_   = Type.new_(this.CatSpec)
        this.cat_   = this.Cat_.new("Rufus", "Siamese-tabby", 18)
        this._cat   = this.cat_.this
        this._$root = this.Cat_.this._blanker.$root$inner
      })

      describe("Before the method is added", function () {
        it("The instance root has no property", function () {
          expect( HasOwn(this._$root, "mood") ).toBe( false )
        })

        it("The instance root has no setter", function () {
          expect( HasOwn(this._$root, "setMood") ).toBe( false )
        })

        it("The instance root has no assigner", function () {
          expect( HasOwn(this._$root[$ASSIGNERS], "mood") ).toBe( false )
        })

        it("There is no set undefined placeholder in the root", function () {
          expect( HasOwn("mood" in this._$root) ).toBe( false )
        })

        it("Throws an error when the property is read", function () {
          var execution =  () => { return this.cat_.mood }
          expect( execution ).toThrowError( /doesn't have a property 'mood'/ )
        })
      })

      describe("When called with 1 args: a property named func", function () {
        beforeEach(function () {
          this.assigner = function mood(newMood) { return `very ${newMood}` }
          this.Cat_.forAddAssigner(this.assigner)
        })

        it("Sets undefined as a placeholder at the selector in the root", function () {
          expect( this._$root.mood ).toBe( undefined )
          expect( HasOwn(this._$root, "mood") ).toBe( true )
        })

        it("Doesn't put a setter property in the root", function () {
          expect( HasOwn(this._$root, "setMood") ).toBe( false )
        })

        it("Puts an assigner func in the root", function () {
          expect( this._$root[$ASSIGNERS].mood ).toBe( this.assigner )
        })

        describe("When the property is assigned", function () {
          it("Executes the assigner", function () {
            this._cat.mood = "happy"
            expect( this.cat_.mood ).toBe( "very happy" )
          })
        })

        describe("When the property read before being set", function () {
          it("Answers null", function () {
            var result = this._cat.mood
            expect( result ).toBe( null )
          })
        })
      })

      describe("When called with 2 args: a property name and a func", function () {
        beforeEach(function () {
          this.assigner = function (newMood) { return `very ${newMood}` }
          this.Cat_.forAddAssigner("mood", this.assigner)
        })

        it("Sets undefined as a placeholder at the selector in the root", function () {
          expect( this._$root.mood ).toBe( undefined )
          expect( HasOwn(this._$root, "mood") ).toBe( true )
        })

        it("Doesn't put a setter property in the root", function () {
          expect( HasOwn(this._$root, "setMood") ).toBe( false )
        })

        it("Puts an assigner func in the root", function () {
          expect( this._$root[$ASSIGNERS].mood ).toBe( this.assigner )
        })

        describe("When the property is assigned", function () {
          it("Executes the assigner", function () {
            this._cat.mood = "happy"
            expect( this.cat_.mood ).toBe( "very happy" )
          })
        })

        describe("When the property read before being set", function () {
          it("Answers null", function () {
            var result = this._cat.mood
            expect( result ).toBe( null )
          })
        })
      })
    })



    describe("#addSetter", function () {
      beforeEach(function () {
        this.Cat_   = Type.new_(this.CatSpec)
        this.cat_   = this.Cat_.new("Rufus", "Siamese-tabby", 18)
        this._cat   = this.cat_.this
        this._$root = this.Cat_.this._blanker.$root$inner
      })

      describe("Before the method is added", function () {
        it("The instance root has no property", function () {
          expect( HasOwn(this._$root, "mood") ).toBe( false )
        })

        it("The instance root has no setter", function () {
          expect( HasOwn(this._$root, "setMood") ).toBe( false )
        })

        it("The instance root has no assigner", function () {
          expect( HasOwn(this._$root[$ASSIGNERS], "mood") ).toBe( false )
        })

        it("There is no set undefined placeholder in the root", function () {
          expect( HasOwn("mood" in this._$root) ).toBe( false )
        })

        it("Throws an error when the property is read", function () {
          var execution =  () => { return this.cat_.mood }
          expect( execution ).toThrowError( /doesn't have a property 'mood'/ )
        })
      })

      describe("When called with 1 args: a setter name", function () {
        beforeEach(function () {
          this.Cat_.addSetter("setMood")
        })

        it("Sets undefined as a placeholder at the selector in the root", function () {
          expect( this._$root.mood ).toBe( undefined )
          expect( HasOwn(this._$root, "mood") ).toBe( true )
        })

        it("Puts as basic setter property in the root", function () {
          expect( this._$root.setMood.method.handler.name ).toBe( "setMood_$set_mood" )
        })

        it("Doesn't put an assigner func in the root", function () {
          expect( HasOwn(this._$root[$ASSIGNERS], "mood") ).toBe( false )
        })

        describe("When the setter is called", function () {
          it("The property is set", function () {
            this._cat.setMood("happy")
            expect( this.cat_.mood ).toBe( "happy" )
          })
        })

        describe("When the property is assigned", function () {
          it("The property is set", function () {
            this._cat.mood = "happy"
            expect( this.cat_.mood ).toBe( "happy" )
          })
        })

        describe("When the property read before being set", function () {
          it("Answers null", function () {
            var result = this._cat.mood
            expect( result ).toBe( null )
          })
        })
      })

      describe("When called with 1 args: a setter named func", function () {
        beforeEach(function () {
          this.setter = function setMood(newMood) {
            this.mood = `very ${newMood}`
          }
          this.Cat_.addSetter(this.setter)
        })

        it("Sets undefined as a placeholder at the selector in the root", function () {
          expect( this._$root.mood ).toBe( undefined )
          expect( HasOwn(this._$root, "mood") ).toBe( true )
        })

        it("Puts a basic setter property in the root", function () {
          expect( this._$root.setMood.name ).toBe( "setMood_inner_self" )
        })

        it("Doesn't put an assigner func in the root", function () {
          expect( HasOwn(this._$root[$ASSIGNERS], "mood") ).toBe( false )
        })

        describe("When the setter is called", function () {
          it("The property is set", function () {
            this._cat.setMood("happy")
            expect( this.cat_.mood ).toBe( "very happy" )
          })
        })

        describe("When the property is assigned", function () {
          it("The property is set", function () {
            this._cat.mood = "happy"
            expect( this.cat_.mood ).toBe( "happy" )
          })
        })

        describe("When the property read before being set", function () {
          it("Answers null", function () {
            var result = this._cat.mood
            expect( result ).toBe( null )
          })
        })

        describe("When the setter doesn't even set the property for which it's named", function () {
          beforeEach(function () {
            this.setter = function setMood(newMood) { this.xyz = newMood }
            this.Cat_.addSetter(this.setter)
          })

          it("Sets undefined as a placeholder at the selector in the root", function () {
            expect( this._$root.mood ).toBe( undefined )
            expect( HasOwn(this._$root, "mood") ).toBe( true )
          })

          it("Answers null when the property is read", function () {
            var result = this._cat.mood
            expect( result ).toBe( null )
          })
        })
      })

      describe("When called with 2 args: a setter name and a property", function () {
        beforeEach(function () {
          this.Cat_.addSetter("setXyz", "_qrs")
        })

        it("Sets undefined as a placeholder at the selector in the root", function () {
          expect( this._$root._qrs ).toBe( undefined )
          expect( HasOwn(this._$root, "_qrs") ).toBe( true )
        })

        it("Puts a basic setter property in the root", function () {
          expect( this._$root.setXyz.name ).toBe( "setXyz_inner_self" )
        })

        it("Doesn't put an assigner func in the root", function () {
          expect( HasOwn(this._$root[$ASSIGNERS], "_qrs") ).toBe( false )
        })

        describe("When the setter is called", function () {
          it("The property is set", function () {
            this._cat.setXyz("happy")
            expect( this._cat._qrs ).toBe( "happy" )
          })
        })

        describe("When the property is assigned", function () {
          it("The property is set", function () {
            this._cat._qrs = "happy"
            expect( this._cat._qrs ).toBe( "happy" )
          })
        })

        describe("When the property read before being set", function () {
          it("Answers null", function () {
            var result = this._cat._qrs
            expect( result ).toBe( null )
          })
        })
      })

      describe("When called with 2 args: a setter name and a func", function () {
        beforeEach(function () {
          this.func = function (newMood) {
            this.mood = `very ${newMood}`
          }
          this.Cat_.addSetter("setMood", this.func)
        })

        it("Sets undefined as a placeholder at the selector in the root", function () {
          expect( this._$root.mood ).toBe( undefined )
          expect( HasOwn(this._$root, "mood") ).toBe( true )
        })

        it("Puts a basic setter property in the root", function () {
          expect( this._$root.setMood.name ).toBe( "setMood_inner_self" )
        })

        it("Doesn't put an assigner func in the root", function () {
          expect( HasOwn(this._$root[$ASSIGNERS], "mood") ).toBe( false )
        })

        describe("When the setter is called", function () {
          it("The property is set", function () {
            this._cat.setMood("happy")
            expect( this.cat_.mood ).toBe( "very happy" )
          })
        })

        describe("When the property is assigned", function () {
          it("The property is set", function () {
            this._cat.mood = "happy"
            expect( this.cat_.mood ).toBe( "happy" )
          })
        })

        describe("When the property read before being set", function () {
          it("Answers null", function () {
            var result = this._cat.mood
            expect( result ).toBe( null )
          })
        })

        describe("When the setter doesn't even set the property for which it's named", function () {
          beforeEach(function () {
            this.setter = function setMood(newMood) { this.xyz = newMood }
            this.Cat_.addSetter(this.setter)
          })

          it("Sets undefined as a placeholder at the selector in the root", function () {
            expect( this._$root.mood ).toBe( undefined )
            expect( HasOwn(this._$root, "mood") ).toBe( true )
          })

          it("Answers null when the property is read", function () {
            var result = this._cat.mood
            expect( result ).toBe( null )
          })
        })
      })


      describe("When called with 2 args: a setter name and an assigner func", function () {
        beforeEach(function () {
          this.Cat_.addSetter("setMood", function _mood(newMood) {
            return `very ${newMood}`
          })
        })

        it("Puts a basic setter property in the root", function () {
          expect( this._$root.setMood.name ).toBe( "setMood_inner_self" )
        })

        it("Put an assigner func in the root", function () {
          expect( HasOwn(this._$root[$ASSIGNERS], "mood") ).toBe( false )
          expect( HasOwn(this._$root[$ASSIGNERS], "_mood") ).toBe( true )
        })

        it("Sets undefined as a placeholder at the property in the root", function () {
          expect( this._$root._mood ).toBe( undefined )
          expect( HasOwn(this._$root, "_mood") ).toBe( true )
        })

        it("Sets undefined as a placeholder at the matching selector in the root", function () {
          expect( this._$root._mood ).toBe( undefined )
          expect( HasOwn(this._$root, "_mood") ).toBe( true )
        })

        describe("When the setter is called", function () {
          it("The property is set", function () {
            this._cat.setMood("happy")
            expect( this._cat._mood ).toBe( "very happy" )
          })
        })

        describe("When the property is assigned", function () {
          it("The property is set", function () {
            this._cat._mood = "happy"
            expect( this._cat._mood ).toBe( "very happy" )
          })
        })

        describe("When the property read before being set", function () {
          it("Answers null", function () {
            var result = this._cat._mood
            expect( result ).toBe( null )
          })
        })
      })


      describe("When called with an improper setter name", function () {
        it("Throws an error", function () {
          var execution =  () => { this.Cat_.addSetter("mood") }
          expect( execution ).toThrowError( /Improper setter 'mood'!!/ )
        })
      })
    })



    describe("#forAddSetter", function () {
      beforeEach(function () {
        this.Cat_   = Type.new_(this.CatSpec)
        this.cat_   = this.Cat_.new("Rufus", "Siamese-tabby", 18)
        this._cat   = this.cat_.this
        this._$root = this.Cat_.this._blanker.$root$inner
      })

      describe("Before the method is added", function () {
        it("The instance root has no property", function () {
          expect( HasOwn(this._$root, "mood") ).toBe( false )
        })

        it("The instance root has no setter", function () {
          expect( HasOwn(this._$root, "setMood") ).toBe( false )
        })

        it("The instance root has no assigner", function () {
          expect( HasOwn(this._$root[$ASSIGNERS], "mood") ).toBe( false )
        })

        it("There is no set undefined placeholder in the root", function () {
          expect( HasOwn("mood" in this._$root) ).toBe( false )
        })

        it("Throws an error when the property is read", function () {
          var execution =  () => { return this.cat_.mood }
          expect( execution ).toThrowError( /doesn't have a property 'mood'/ )
        })
      })

      describe("When called with 1 args: a property name", function () {
        beforeEach(function () {
          this.Cat_.forAddSetter("mood")
        })

        it("Sets undefined as a placeholder at the selector in the root", function () {
          expect( this._$root.mood ).toBe( undefined )
          expect( HasOwn(this._$root, "mood") ).toBe( true )
        })

        it("Puts as basic setter property in the root", function () {
          expect( this._$root.setMood.method.handler.name ).toBe( "setMood_$set_mood" )
        })

        it("Doesn't put an assigner func in the root", function () {
          expect( HasOwn(this._$root[$ASSIGNERS], "mood") ).toBe( false )
        })

        describe("When the setter is called", function () {
          it("The property is set", function () {
            this._cat.setMood("happy")
            expect( this.cat_.mood ).toBe( "happy" )
          })
        })

        describe("When the property is assigned", function () {
          it("The property is set", function () {
            this._cat.mood = "happy"
            expect( this.cat_.mood ).toBe( "happy" )
          })
        })

        describe("When the property read before being set", function () {
          it("Answers null", function () {
            var result = this._cat.mood
            expect( result ).toBe( null )
          })
        })
      })

      describe("When called with 2 args: a property and a setter name", function () {
        beforeEach(function () {
          this.Cat_.forAddSetter("_qrs", "setXyz")
        })

        it("Sets undefined as a placeholder at the selector in the root", function () {
          expect( this._$root._qrs ).toBe( undefined )
          expect( HasOwn(this._$root, "_qrs") ).toBe( true )
        })

        it("Puts a basic setter property in the root", function () {
          expect( this._$root.setXyz.name ).toBe( "setXyz_inner_self" )
        })

        it("Doesn't put an assigner func in the root", function () {
          expect( HasOwn(this._$root[$ASSIGNERS], "_qrs") ).toBe( false )
        })

        describe("When the setter is called", function () {
          it("The property is set", function () {
            this._cat.setXyz("happy")
            expect( this._cat._qrs ).toBe( "happy" )
          })
        })

        describe("When the property is assigned", function () {
          it("The property is set", function () {
            this._cat._qrs = "happy"
            expect( this._cat._qrs ).toBe( "happy" )
          })
        })

        describe("When the property read before being set", function () {
          it("Answers null", function () {
            var result = this._cat._qrs
            expect( result ).toBe( null )
          })
        })
      })
    })


    describe("#addMandatorySetter", function () {
      beforeEach(function () {
        this.Cat_   = Type.new_(this.CatSpec)
        this.cat_   = this.Cat_.new("Rufus", "Siamese-tabby", 18)
        this._cat   = this.cat_.this
        this._$root = this.Cat_.this._blanker.$root$inner
      })

      describe("Before the method is added", function () {
        it("The instance root has no property", function () {
          expect( HasOwn(this._$root, "mood") ).toBe( false )
        })

        it("The instance root has no setter", function () {
          expect( HasOwn(this._$root, "setMood") ).toBe( false )
        })

        it("The instance root has no assigner", function () {
          expect( HasOwn(this._$root[$ASSIGNERS], "mood") ).toBe( false )
        })

        it("There is no set undefined placeholder in the root", function () {
          expect( HasOwn("mood" in this._$root) ).toBe( false )
        })

        it("Throws an error when the property is read", function () {
          var execution =  () => { return this.cat_.mood }
          expect( execution ).toThrowError( /doesn't have a property 'mood'/ )
        })
      })

      describe("When called with 1 args: a setter name", function () {
        beforeEach(function () {
          this.Cat_.addMandatorySetter("setMood")
        })

        it("Puts as basic setter property in the root", function () {
          expect( this._$root.setMood.method.handler.name ).toBe( "setMood_$set_mood" )
        })

        it("Puts an assigner func in the root", function () {
          expect( HasOwn(this._$root[$ASSIGNERS], "mood") ).toBe( true )
        })

        it("Sets undefined as a placeholder at the selector in the root", function () {
          expect( this._$root.mood ).toBe( undefined )
          expect( HasOwn(this._$root, "mood") ).toBe( true )
        })

        describe("When the setter is called", function () {
          it("The property is set", function () {
            this._cat.setMood("happy")
            expect( this.cat_.mood ).toBe( "happy" )
          })
        })

        describe("When the property is assigned", function () {
          it("Throws an error", function () {
            var execution =  () => { this._cat.mood = "happy" }
            expect( execution ).toThrowError( /Assignment of property 'mood' is not allowed/ )
          })
        })

        describe("When the property read before being set", function () {
          it("Answers null", function () {
            var result = this._cat.mood
            expect( result ).toBe( null )
          })
        })
      })

      describe("When called with 1 args: a setter named func", function () {
        beforeEach(function () {
          this.setter = function setMood(newMood) {
            this._basicSet("mood", `very ${newMood}`)
          }
          this.Cat_.addMandatorySetter(this.setter)
        })

        it("Puts a basic setter property in the root", function () {
          expect( this._$root.setMood.name ).toBe( "setMood_inner_self" )
        })

        it("Puts an assigner func in the root", function () {
          expect( HasOwn(this._$root[$ASSIGNERS], "mood") ).toBe( true )
        })

        it("Sets undefined as a placeholder at the selector in the root", function () {
          expect( this._$root.mood ).toBe( undefined )
          expect( HasOwn(this._$root, "mood") ).toBe( true )
        })

        describe("When the setter is called", function () {
          it("The property is set", function () {
            this._cat.setMood("happy")
            expect( this.cat_.mood ).toBe( "very happy" )
          })
        })

        describe("When the property is assigned", function () {
          it("Throws an error", function () {
            var execution =  () => { this._cat.mood = "happy" }
            expect( execution ).toThrowError( /Assignment of property 'mood' is not allowed/ )
          })
        })

        describe("When the property read before being set", function () {
          it("Answers null", function () {
            var result = this._cat.mood
            expect( result ).toBe( null )
          })
        })

        describe("When the setter doesn't even set the property for which it's named", function () {
          beforeEach(function () {
            this.setter = function setMood(newMood) { this.xyz = newMood }
            this.Cat_.addMandatorySetter(this.setter)
          })

          it("Sets undefined as a placeholder at the selector in the root", function () {
            expect( this._$root.mood ).toBe( undefined )
            expect( HasOwn(this._$root, "mood") ).toBe( true )
          })

          it("Answers null when the property is read", function () {
            var result = this._cat.mood
            expect( result ).toBe( null )
          })
        })
      })

      describe("When called with 2 args: a setter name and a property", function () {
        beforeEach(function () {
          this.Cat_.addMandatorySetter("setXyz", "_qrs")
        })

        it("Puts a basic setter property in the root", function () {
          expect( this._$root.setXyz.name ).toBe( "setXyz_inner_self" )
        })

        it("Puts an assigner func in the root", function () {
          expect( HasOwn(this._$root[$ASSIGNERS], "_qrs") ).toBe( true )
        })

        it("Sets undefined as a placeholder at the selector in the root", function () {
          expect( this._$root._qrs ).toBe( undefined )
          expect( HasOwn(this._$root, "_qrs") ).toBe( true )
        })

        describe("When the setter is called", function () {
          it("The property is set", function () {
            this._cat.setXyz("happy")
            expect( this._cat._qrs ).toBe( "happy" )
          })
        })

        describe("When the property is assigned", function () {
          it("Throws an error", function () {
            var execution =  () => { this._cat._qrs = "happy" }
            expect( execution ).toThrowError( /Assignment of property '_qrs' is not allowed/ )
          })
        })

        describe("When the property read before being set", function () {
          it("Answers null", function () {
            var result = this._cat._qrs
            expect( result ).toBe( null )
          })
        })
      })

      describe("When called with 2 args: a setter name and a func", function () {
        beforeEach(function () {
          this.Cat_.addMandatorySetter("setMood", function (newMood) {
            this._basicSet("mood", `very ${newMood}`)
          })
        })

        it("Puts a basic setter property in the root", function () {
          expect( this._$root.setMood.name ).toBe( "setMood_inner_self" )
        })

        it("Puts an assigner func in the root", function () {
          expect( HasOwn(this._$root[$ASSIGNERS], "mood") ).toBe( true )
        })

        it("Sets undefined as a placeholder at the selector in the root", function () {
          expect( this._$root.mood ).toBe( undefined )
          expect( HasOwn(this._$root, "mood") ).toBe( true )
        })

        describe("When the setter is called", function () {
          it("The property is set", function () {
            this._cat.setMood("happy")
            expect( this.cat_.mood ).toBe( "very happy" )
          })
        })

        describe("When the property is assigned", function () {
          it("Throws an error", function () {
            var execution =  () => { this._cat.mood = "happy" }
            expect( execution ).toThrowError( /Assignment of property 'mood' is not allowed/ )
          })
        })

        describe("When the property read before being set", function () {
          it("Answers null", function () {
            var result = this._cat.mood
            expect( result ).toBe( null )
          })
        })

        describe("When the setter doesn't even set the property for which it's named", function () {
          beforeEach(function () {
            this.setter = function setMood(newMood) { this.xyz = newMood }
            this.Cat_.addMandatorySetter(this.setter)
          })

          it("Sets undefined as a placeholder at the selector in the root", function () {
            expect( this._$root.mood ).toBe( undefined )
            expect( HasOwn(this._$root, "mood") ).toBe( true )
          })

          it("Answers null when the property is read", function () {
            var result = this._cat.mood
            expect( result ).toBe( null )
          })
        })
      })

      describe("When called with 2 args: a setter name and an assigner func", function () {
        beforeEach(function () {
          this.Cat_.addMandatorySetter("setMood", function _mood(newMood) {
            return `very ${newMood}`
          })
        })

        it("Puts a basic setter property in the root", function () {
          expect( this._$root.setMood.name ).toBe( "setMood_inner_self" )
        })

        it("Put an assigner func in the root", function () {
          expect( HasOwn(this._$root[$ASSIGNERS], "mood") ).toBe( false )
          expect( HasOwn(this._$root[$ASSIGNERS], "_mood") ).toBe( true )
        })

        it("Sets undefined as a placeholder at the selector in the root", function () {
          expect( this._$root._mood ).toBe( undefined )
          expect( HasOwn(this._$root, "_mood") ).toBe( true )
        })

        describe("When the setter is called", function () {
          it("The property is set", function () {
            this._cat.setMood("happy")
            expect( this._cat._mood ).toBe( "very happy" )
          })
        })

        describe("When the property is assigned", function () {
          it("Throws an error", function () {
            var execution =  () => { this._cat._mood = "happy" }
            expect( execution ).toThrowError( /Assignment of property '_mood' is not allowed/ )
          })
        })

        describe("When the property read before being set", function () {
          it("Answers null", function () {
            var result = this._cat._mood
            expect( result ).toBe( null )
          })
        })
      })


      describe("When called with an improper setter name", function () {
        it("Throws an error", function () {
          var execution =  () => { this.Cat_.addMandatorySetter("mood") }
          expect( execution ).toThrowError( /Improper setter 'mood'!!/ )
        })
      })
    })


    describe("#forAddMandatorySetter", function () {
      beforeEach(function () {
        this.Cat_   = Type.new_(this.CatSpec)
        this.cat_   = this.Cat_.new("Rufus", "Siamese-tabby", 18)
        this._cat   = this.cat_.this
        this._$root = this.Cat_.this._blanker.$root$inner
      })

      describe("Before the method is added", function () {
        it("The instance root has no property", function () {
          expect( HasOwn(this._$root, "mood") ).toBe( false )
        })

        it("The instance root has no setter", function () {
          expect( HasOwn(this._$root, "setMood") ).toBe( false )
        })

        it("The instance root has no assigner", function () {
          expect( HasOwn(this._$root[$ASSIGNERS], "mood") ).toBe( false )
        })

        it("There is no set undefined placeholder in the root", function () {
          expect( HasOwn("mood" in this._$root) ).toBe( false )
        })

        it("Throws an error when the property is read", function () {
          var execution =  () => { return this.cat_.mood }
          expect( execution ).toThrowError( /doesn't have a property 'mood'/ )
        })
      })

      describe("When called with 1 args: a property name", function () {
        beforeEach(function () {
          this.Cat_.forAddMandatorySetter("mood")
        })

        it("Puts as basic setter property in the root", function () {
          expect( this._$root.setMood.method.handler.name ).toBe( "setMood_$set_mood" )
        })

        it("Puts an assigner func in the root", function () {
          expect( HasOwn(this._$root[$ASSIGNERS], "mood") ).toBe( true )
        })

        it("Sets undefined as a placeholder at the selector in the root", function () {
          expect( this._$root.mood ).toBe( undefined )
          expect( HasOwn(this._$root, "mood") ).toBe( true )
        })

        describe("When the setter is called", function () {
          it("The property is set", function () {
            this._cat.setMood("happy")
            expect( this.cat_.mood ).toBe( "happy" )
          })
        })

        describe("When the property is assigned", function () {
          it("Throws an error", function () {
            var execution =  () => { this._cat.mood = "happy" }
            expect( execution ).toThrowError( /Assignment of property 'mood' is not allowed/ )
          })
        })

        describe("When the property read before being set", function () {
          it("Answers null", function () {
            var result = this._cat.mood
            expect( result ).toBe( null )
          })
        })
      })

      describe("When called with 2 args: a property and a setter name", function () {
        beforeEach(function () {
          this.Cat_.forAddMandatorySetter("_qrs", "setXyz")
        })

        it("Puts a basic setter property in the root", function () {
          expect( this._$root.setXyz.name ).toBe( "setXyz_inner_self" )
        })

        it("Puts an assigner func in the root", function () {
          expect( HasOwn(this._$root[$ASSIGNERS], "_qrs") ).toBe( true )
        })

        it("Sets undefined as a placeholder at the selector in the root", function () {
          expect( this._$root._qrs ).toBe( undefined )
          expect( HasOwn(this._$root, "_qrs") ).toBe( true )
        })

        describe("When the setter is called", function () {
          it("The property is set", function () {
            this._cat.setXyz("happy")
            expect( this._cat._qrs ).toBe( "happy" )
          })
        })

        describe("When the property is assigned", function () {
          it("Throws an error", function () {
            var execution =  () => { this._cat._qrs = "happy" }
            expect( execution ).toThrowError( /Assignment of property '_qrs' is not allowed/ )
          })
        })

        describe("When the property read before being set", function () {
          it("Answers null", function () {
            var result = this._cat._qrs
            expect( result ).toBe( null )
          })
        })
      })

      describe("When called with 2 args: a setter name and an assigner func", function () {
        beforeEach(function () {
          this.Cat_.forAddMandatorySetter("_mood", function setMood(newMood) {
            this._basicSet("_mood", `very ${newMood}`)
          })
        })

        it("Puts a basic setter property in the root", function () {
          expect( this._$root.setMood.name ).toBe( "setMood_inner_self" )
        })

        it("Put an assigner func in the root", function () {
          expect( HasOwn(this._$root[$ASSIGNERS], "mood") ).toBe( false )
          expect( HasOwn(this._$root[$ASSIGNERS], "_mood") ).toBe( true )
        })

        it("Sets undefined as a placeholder at the selector in the root", function () {
          expect( this._$root._mood ).toBe( undefined )
          expect( HasOwn(this._$root, "_mood") ).toBe( true )
        })

        describe("When the setter is called", function () {
          it("The property is set", function () {
            this._cat.setMood("happy")
            expect( this._cat._mood ).toBe( "very happy" )
          })
        })

        describe("When the property is assigned", function () {
          it("Throws an error", function () {
            var execution =  () => { this._cat._mood = "happy" }
            expect( execution ).toThrowError( /Assignment of property '_mood' is not allowed/ )
          })
        })

        describe("When the property read before being set", function () {
          it("Answers null", function () {
            var result = this._cat._mood
            expect( result ).toBe( null )
          })
        })
      })
    })
  })
})
