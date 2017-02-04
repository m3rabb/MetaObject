/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

Krust.set((context) => {

  const LO        =  0
  const HI        =  1
  const START     =  0
  const END       =  1
  const DIR       =  2
  const WRAPS     =  3

  const FWD       =  1
  const BWD       = -1
  const NON       =  0
  const STRETCH   =  null
  const UNBOUNDED =  false

  const FORWARD   =  Infinity
  const BACKWARD  = -Infinity

  const SCAN      = "SCAN"
  const FILL      = "FILL"

  const INDEX     = "INDEX"
  const VALUE     = "VALUE"
  const SPAN      = "SPAN"
  const SUB       = "SUB"

  const DefaultDirectives = { SCAN: FORWARD, SUB: FORWARD, FILL: FORWARD }

  const UNTIL_EDGE  = Symbol("UNTIL_EDGE")
  const BEYOND_EDGE = Symbol("BEYOND_EDGE")

  const BEYOND      = 1000000000000


  context.newType({
    name : "List",

    instanceConstants: {

    },

    instanceMethods: [

      function __init(elements_) {
        this._elements = []
        elements_ && this.addAll(elements_)
      },


      // function copy(span_) {
      //   if (!span_ && this[IMMUTABLE]) { return this }
      //
      //   return this.within(span_ ? this._normalize(span_) : this.span)
      // },



      //// CONVERSION METHODS ////

      function toString() {
        return `List(${this._elements})`
      },

      { GETTER :
        function asString() {
          return `List(${this._elements})`
        },
      }




      //// ACCESS METHODS ////

      //// ACCESS : General

      { GETTER : [

        function size() {  //
          return this._elements.length
        },

        function slots() {
          const isImmutable = this[IMMUTABLE]
          return this.map((value, index) => {
            let slot = {index: index, element: value, key: index, value: value}

            return isImmutable ? BeImmutable(slot) : slot
          })
        },

        function elements() {
          return this.copy()
        },

        { ALIAS : {
          values: "elements"
        } },

        function keys() {
          return this.map((value, index) => index)
        },

        { ALIAS : {
          indexes: "keys"
        } },


        // LOOK: Is explicit check fo immutability necessary???
        function span() {
          const span = [0, this._elements.length, FWD]
          return this[IMMUTABLE] ? Freeze(span) : span
        },

        function inverseSpan() {
          return [0, this._elements.length, BWD]
        },

        function reversed() {
          return this._new((result) => {
            result._elements = Reverser(this.elements)
          })
        },

        function isEmpty() {
          return (this._elements.length === 0)
        },

      ] },



      //// ACCESS : Generic

      function at(position, absent_) {
        if (index_span.length) {
          const values = this.within(position)
          return values.size ? values :
            (typeof absent_ !== "function") ?
              absent_ : absent_.call(this.$, position)
        }
        return this.atIndex(position, absent_)
      },

      function atEach(indexes_spans) {
        return this.new((result) => {
          Each(indexes_spans, (index_span) => {
            result.add( this.at(index_span) )
          })
        })
      },

      function reverse() {
        return this._nonCopy((result) => {
          result._elements = Reverser(this.elements)
        })
      },



      //// ACCESS : answer the Value at the Index

      function atIndex(index, absent_) {
        const target    = this._elements
        const size      = elements.length
        const slotIndex = (index < 0) ? size - index : index

        return (slotIndex >= 0 && slotIndex < size) ? target[slotIndex] :
          (typeof absent_ !== "function") ?
            absent_ : absent_.call(this.$, index)
      },

      { GETTER : [

        function first() {
          return this._elements[0]
        },

        function last() {
          const target = this._elements
          return target[elements.length - 1]
        },

      ] },


      function _atIndex(justIndex) {
        return this._elements[justIndex]
      },



      //// ACCESS : answer the Subsequence within the Span

      function within(span_start, ...end__direction__wrap) {
        const span = (span_start.length) ? span_start :
          [span_start, ...end__direction__wrap]
        const readSpan = this._asNormalizedSpan(span)

        if (this[IMMUTABLE] {
          const [lo, hi, dir, wraps] = readSpan
          if (lo === 0 && hi === this.size && dir === FWD && !wrap) {
            return this
          }
        }

        return this._withinMap(readSpan, (value) => value))
      },

      function beyond(edge, scanDirective = FORWARD) {
        this._within(edge, null, scanDirective)
      },

      function until(edge, scanDirective = FORWARD) {
        return this._within(0, edge, scanDirective)
      },

      function initial(count = 1, scanDirective = FORWARD) {
        return this._within(0, count, scanDirective)
      },

      function final(count = 1, scanDirective = FORWARD) {
        const size = this.size
        return this.within(size - count, size, scanDirective)
      },


      function _within(start, end, scanDirective, _wraps) {
        const readSpan = this._asNormalizedSpan([start, end])

        readSpan[DIR] = AsDirection(SCAN, scanDirective)
        return this._withinMap(readSpan, (value) => value))
      },



      //// ACCESS : answer the Index at a Value

      function indexOf(value, scanDirective = FORWARD) {
        const condition = (existing) => value === existing)
        return this._byWithinFind(INDEX, scanDirective, condition)
      },

      function indexOfFirst(value) {
        return this.indexOf(value, FORWARD)
      },

      function indexOfLast(value) {
        return this.indexOf(value, BACKWARD)
      },

      function indexOfEvery(value, scanDirective = FORWARD) {
        const condition = (existing) => value === existing)

        return this._byWithinFindEvery(INDEX, scanDirective, condition)
      },



      //// ACCESS : answer the Count of a Value

      function countOf(value) {
        return this.countOfWhere((existing) => (existing === value))
      },



      //// ACCESS : answer the Count satisfying a Condition

      function countOfWhere(scanDirective_, conditional) {
        let [readSpan, Conditional] =
          this._justifyArgs(scanDirective_, conditional)

        let count = 0
        this._withinDo(readSpan, (value, index) => {
          if (Conditional.call(this.$, value, index)) { count++ }
        })
        return count
      },



      //// ACCESS : answer the presence (or not) of a Value

      function contains(value) {
        return (this.indexOf(value) >= 0)
      },



      //// ACCESS : answer the Index satisfying a Condition

      function indexOfWhere(scanDirective_, condition, absent_) {
        return this._byWithinFind(INDEX, scanDirective_, condition, absent_)
      },

      function indexesOfWhere(scanDirective_, condition) {
        return this._byWithinFindEvery(INDEX, scanDirective_, condition)
      },


      function _byWithinFind(grip, ...args) {
        const [readSpan, Conditional, absent_] = this._justifyArgs(args)

        const found = this._withinDo(readSpan, function (value, index) {
          if (Conditional.call(this.$, value, index)) {
            return { index: index, value: value } // element: value, key: index,
          }
        })
        return found ? found[grip] :
          (typeof absent_ !== "function") ? absent_ : absent_.call(this.$)
      },

      function _byWithinFindEvery(Grip, ...args) {
        const [readSpan, Conditional] = this._justifyArgs(args)

        return this.new((result) => {
          this._withinDo(readSpan, (value, index) => {
            if (Conditional.call(this.$, value, index)) {
              const slot = { index: index, value: value }
              result.add( slot[Grip] )        // element: value, key: index,
            }
          })
        })
      },



      //// ACCESS : answer a value satisfying a Condition

      function valueWhere(scanDirective_, condition, absent_) {
        return this._byWithinFind(VALUE, scanDirective_, condition, absent_)
      },

      function everyWhere(scanDirective_, conditional) {
        return this._byWithinFindEvery(VALUE, scanDirective_, conditional)
      },

      function everyWhereNot(scanDirective_, conditional) {
        const inverseCondition =
          (value, index) => !condition.call(this.$, value, index)
        return this.everyWhere(scanDirective_, inverseCondition)
      },

      { ALIAS : {
        where   : "valueWhere"
        detect  : "valueWhere",
        find    : "valueWhere",
        select  : "everyWhere",
        reject  : "everyWhereNot"
      } },

      undefined|number|bool|span|

      //// ACCESS : answering the Span of a Subsequence

      function spanOf(sub, directives = FORWARD) {
        const matchSub   = AsArray(sub)
        const subSize    = matchSub.length

        return this._overDo(directives, false, subSize, (sub, span) => {
          if (EqualArrays(sub, matchSub)) { return span }
        })
      },

      function spanOfFirst(sub, subDirection = FORWARD) {
        return this.spanOf(sub, {SCAN : FORWARD, SUB : subDirection})
      },

      function spanOfLast(sub, subDirection = FORWARD) {
        return this.spanOf(sub, {SCAN : BACKWARD, SUB : subDirection})
      },

      function spansOfDistinct(sub, directives = FORWARD) {
        return this._spansOfEvery(sub, directives, false)
      },

      function spansOfIndistinct(sub, directives = FORWARD) {
        return this._spansOfEvery(sub, directives, true)
      },


      function _spansOfEvery(sub, directives, distinct) {
        const matchSub   = AsArray(sub)
        const subSize    = matchSub.length

        return this._new((result) => {
          return this._overDo(directives, distinct, subSize, (next, span) => {
            if (EqualArrays(next, matchSub)) { result.add( span ) }
          })
        })
      },



      //// ACCESS : answering the Count of a Subsequence

      function countOfDistinct(sub, directives = FORWARD) {
        return this._spansOfEvery(sub, directives, false).size
      },

      function countOfIndistinct(sub, directives = FORWARD) {
        return this._spansOfEvery(sub, directives, true).size
      },



      //// ACCESS : answer the presence (or not) of a Subsequence

      function containsSub(sub, directives_) {
        return (this.spanOf(sub, directives_) != null)
      },




      //// ENUMERATION METHODS ////

      //// ENUMERATION : by Value & Index

      function withinDo(scanDirective, action) {
        this._withinDo(this._asNormalizedSpan(scanDirective), action)
      },

      function withinMap(scanDirective, action) {
        this._withinMap(this._asNormalizedSpan(scanDirective), action)
      },

      function withinReduce(scanDirective, Accumulator_, Reducer) {
        const readSpan = this._asNormalizedSpan(scanDirective)

        if (action === undefined) {
          Reducer = Accumulator_
          Accumulator_ = (readSpan[DIR] < 0) ?
            this._atIndex(--readSpan[HI]) : this._atIndex(readSpan[LO]++)]
        }

        this._withinDo(readSpan, function (value, index) {
          Accumulator_ = Reducer.call(this.$, Accumulator_, value, index)
        })

        return Accumulator_
      },

      function eachDo(scanDirective_, action) {
        return action ?
          this._withinDo(this._asNormalizedSpan(scanDirective_), action) :
          this._withinDo(this.span, action = scanDirective_)
      },

      function map(scanDirective_, action) {
        return action ?
          this._withinMap(this._asNormalizedSpan(scanDirective_), action) :
          this._withinMap(this.span, action = scanDirective_)
      },

      function eachSend(scanDirective_, method_selector, ...args) {
        let [readSpan, Method, Args] =
          this._justifyArgs(scanDirective_, method_selector, args)

        return (typeof Method === "function") ?
          this._withinDo(readSpan, (value) => { Method.apply(value, Args))
          this._withinDo(readSpan, (value) => { value[Method](...Args))
      },

      function mapSend(scanDirective_, method_selector, ...args) {
        let [readSpan, Method, Args] =
          this._justifyArgs(scanDirective_, method_selector, args)

        return (typeof Method === "function") ?
          this._withinMap(readSpan, (value) => { Method.apply(value, Args))
          this._withinMap(readSpan, (value) => { value[Method](...Args))
      },

      function reduce(accumulator_, reducer) {
        return this.withinReduce(FORWARD, accumulator_, reducer)
      },

      { ALIAS : {
        do      : "eachDo",
        collect : "map",
        inject  : "reduce",
      } },


      function _withinDo(readSpan, action) {
        let target = this._elements
        let size   = target.length
        let preIndex, preLimit, sIndex, sLimit, noWrap, result
        let [lo, hi, dir, wraps] = readSpan

        if (wraps) {
          [preIndex, preLimit, sIndex, sLimit, inc] =
            (dir < 0) ?
              [hi - 1, ((noWrap = (hi > lo)) ? lo : 0   ) - 1, size, lo, -1] :
              [lo    , ((noWrap = (lo < hi)) ? hi : size)    , 0   , hi,  1]

          while (preIndex !== preLimit) {
            result = action.call(this.$, target[preIndex], preIndex)
            if (result !== undefined) { return result }
            preIndex += inc
          }

          if (noWrap) { return this }
        }
        else {
          [sIndex, sLimit, inc] = (dir < 0) ? [hi - 1, lo - 1, -1] : [lo, hi, 1]
        }

        while (sIndex !== sLimit) {
          result = action.call(this.$, target[sIndex], sIndex)
          if (result !== undefined) { return result }
          sIndex += inc
        }

        return undefined
      },

      function _withinMap(readSpan, Action) {
        return this.new((result) => {
          const target = result._elements

          this._withinDo(readSpan, (value, index) => {
            target[index] = Action.call(this.$, value, index)
          })
        })
      },



      //// ENUMERATION : by Subsequence & Span

      function distinctDo(directives_, subSize, action) {
        return (action) ?
          this._overDo(directives, true, subSize, action) :
          this._overDo(FORWARD, true, directives_, subSize)
      },

      function indistinctDo(directives_, subSize, action) {
        return (action) ?
          this._overDo(directives, false, subSize, action) :
          this._overDo(FORWARD, false, directives_, subSize)
      },

      function distinctMap(directives_, subSize, action) {
        return (action) ?
          this._overMap(directives, true, subSize, action) :
          this._overMap(FORWARD, true, directives_, subSize)
      },

      function indistinctMap(directives_, subSize, action) {
        return (action) ?
          this._overMap(directives, false, subSize, action) :
          this._overMap(FORWARD, false, directives_, subSize)
      },

      // NOTE: Can't use _justifyArgs for previous methods because the
      // next arg is a number!!!


      function _overDo(directives, distinct, size, action) {
        const target = this._elements
        const subDir = directives.SUB || FWD
        let   [lo, hi, scanDir, wraps] = this._asNormalizedSpan(directives)

        if (wraps) {
          return this.error("Wrapping on span enumeration is not yet implemented!")
        }

        let [start, limit, startInc, endInc] = (scanDir < 0) ?
              [hi, lo, BWD, -size] : [lo, hi, FWD, size]

        if (distinct) { startInc *= size }

        let [sStart, sLimit, sInc] = (subDir < 0) ?
              [size - 1, -1, BWD] : [0, size, FWD]

        do {
          do {
            let end       = start + endInc
            let remaining = (limit - end) * scanDir

            if (remaining < 0) { break }

            let [tIndex, span] = (scanDir < 0) ?
                  [end  , [end, start, sInc]] :
                  [start, [start, end, sInc]]

            let sub = []
            let sIndex = sStart

            while (sIndex !== sLimit) {
              sub[sIndex] = target[tIndex++]
              sIndex += sInc
            }

            let result  = action.call(this.$, sub, span)
            if (result !== undefined) { return result }

            start += startInc
          } while (true)

          if (remaining === 0) { break }

          size += count
          end = limit
        } while (true)

        return undefined
      },


      function _overMap(directives, distinct, subSize, action) {
        return this.new((result) => {
          this._overDo(directives, distinct, subSize, (sublist, span) => {
            result.add( Action.call(this.$, sublist, span) )
          })
        })
      },




      //// PUT METHODS ////

      //// PUT : Generic

      // NOTE: Consider adding 'put' directives put: fan|fill|lay !!!
      function atPut(position, value) {
        return (index_span.length) ?
          this.withinPut(position, value) :
          this.atIndexPut(position, value)
      },

      // LOOK check use of set vs _set!!!
      function atEachPut(positions, value) {
        return this.set(function () {
          Each(positions, (position) => this.atPut(position, value))
        })
      },

      function atEachPutEach(positions, Values) {
        return this.set(function () {
          Each(positions, (position, next) => {
            this.atPut(positions, Values[next])
          })
        })
      },

      function atFan(position, values) {
        const span = (position.length) ? position : [position, position + 1]
        return this.withinFan(span, values)
      },



      //// PUT : a Value at the Index

      function atIndexPut(index, value) {
        return this._set(function () {
          const target = this._elements
          const slotIndex

          if   (index >= 0) { slotIndex = index }
          else (index <  0) { slotIndex = target.length - index }
          else              { return this }

          if (slotIndex >= 0) {
            target[slotIndex] = value
          }
          else {
            const right = -slotIndex
            this.__subFromShiftTo(0, right)
            this.__echoWithin(undefined, 1, right)
            target[0] = value
          }
        })
      },



      //// PUT : a Sequence within a Span

      function withinPut(span, value) {
        const writeSpan = this._asNormalizedSpan(span, STRETCH)
        return this._withinSetBy(writeSpan, [value], "__fillWithin")
      },

      function withinEcho(span, value) {
        const writeSpan = this._asNormalizedSpan(span, UNBOUNDED)

        return this._withinSetBy(writeSpan, value, "__echoWithin")
      },

      function withinFan(span, values, fillDirective = FORWARD) {
        const source    = AsArray(values)
        const writeSpan = this._asNormalizedSpan(span, STRETCH)
        const fillDir   = AsDirection(FILL, fillDirective)

        return this._withinSetBy(writeSpan, source, "__fillWithin", fillDir)
      },

      function withinFill(span, values, fillDirective = FORWARD) {
        const source    = AsArray(values)
        const writeSpan = this._contractSpanTo(span, source.length)
        const fillDir   = AsDirection(FILL, fillDirective)

        return this._withinSetBy(writeSpan, source, "__fillWithin", fillDir)
      },

      function withinEchoFill(span, values, fillDirective = FORWARD) {
        const source    = AsArray(values)
        const writeSpan = this._asNormalizedSpan(span, UNBOUNDED)
        const fillDir   = AsDirection(FILL, fillDirective)

        return this._withinSetBy(writeSpan, source, "__echoFillWithin", fillDir)
      },

      function beyondLay(edge, values, fillDirective = FORWARD) {
        const source    = AsArray(values)
        const writeSpan = this._contractSpanTo([edge, BEYOND], source.length)
        const fillDir   = AsDirection(FILL, fillDirective)

        return this._withinSetBy(writeSpan, source, "__fillWithin", fillDir)
      },

      function untilLay(edge, values, fillDirective = FORWARD) {
        const source    = AsArray(values)
        const writeSpan = this._contractSpanTo([-BEYOND, edge], source.length)
        const fillDir   = AsDirection(FILL, fillDirective)

        return this._withinSetBy(writeSpan, source, "__fillWithin", fillDir)
      },


      function _contractSpanTo(span, fillSize) {
        const writeSpan     = this._asNormalizedSpan(span, UNBOUNDED)
        const [lo, hi, dir] = writeSpan
        const spanSize      = (hi - lo)
        const delta         = spanSize - fillSize

        if (delta > 0) {
          if (dir < 0) { writeSpan[LO] += delta }
          else         { writeSpan[HI] -= delta }
        }

        return writeSpan
      },

      //          lf   lo   le         i         re   ro   rf
      //   A                |                     |    :--->:
      //   B                |                     :-------->:
      //   C                |          :----------|-------->:    check trim
      //   D                |          :----------:              check trim
      //   E                |          :----:  S  |
      //
      //   F                :----------:       S  |
      //   G      :<--------|----------:       S  |
      //   H      :<-----S--:                     |
      //   I      :<---: S  |                     |
      //
      //   J                :---------------------:
      //   K                :---------------------|-------->:
      //   L      :<--------|---------------------:
      //   M      :<--------|---------------------|-------->:

      function _withinSetBy(
        [lo, hi, scanDir, wraps = false], source, selector, fillDir_
      ) {
        return this._set(function () {
          const target     = this._elements
          const targetSize = target.length
          const spanSize   = (hi - lo)
          const sourceSize = source.length
          const fillSize   = (scanDir === STRETCH) ? sourceSize : spanSize
          let   left, right

          if (wraps) { return this.error("Wrapping is not implemented yet!")}

          if (fillSize === 0) { return }

          if (lo > 0) {  //  A,B,C,D,E
            left  = lo
            right = left + fillSize

            if (fillSize !== spanSize) {
              if (hi >= targetSize) {  // A,B,C,D
                if (right < targetSize) { target.length = right }//clip capacity
              } else {                 // E
                this.__subFromShiftTo(hi, right)
              }
            }
          }
          else {   // lo <= 0
            left = 0

            if (hi < targetSize) {  // F,G,H
              if (hi >= 0) {
                right = fillSize

                if (right !== hi) { this.__subFromShiftTo(hi, right) }
              }
              else { //  hi < 0     // I
                right = fillSize - hi

                this.__subFromShiftTo(hi, right)
                this.__echoWithin(undefined, fillSize, right)
              }
            }
            else { // hi >= targetSize //  J,K,L,M
              right = fillSize

              if (right < targetSize) { target.length = right } // clip capacity
            }
          }

          this[selector](source, left, right, scanDir, fillDir_)
        })
      }



      //// PUT : a Value at a Value

      { ALIAS : {
        atValuePut, "atFirstPut"
      } },

      function atFirstPut(matchValue, newValue) {
        return this.atIndexPut(this.indexOf(matchValue, FORWARD), newValue)
      },

      function atLastPut(matchValue, newValue) {
        return this.atIndexPut(this.indexOf(matchValue, BACKWARD), newValue)
      },

      function atEveryPut(matchValue, newValue) {
        return this._set((result) => {
          let target = result._elements
          let count = 0

          this._withinDo(this.span, function (value, index) {
            if (value === matchValue) {
              target[index] = newValue
              count++
            }
          })
          if (count === 0) { return this }
        })
      },



      //// PUT : a Sequence over a Subsequence

      // NOTE: Consider adding 'put' directives put: fan|fill|lay !!!
      // overPut

      function fanOver(values, sub, directives_ = FORWARD) {
        const source = AsArray(values)
        const span   = this.spanOf(sub, directives_)
        if (!span) { return undefined }

        span[DIR]  = STRETCH
        return this._withinSetBy(span, source, "__fillWithin", directives_.FILL)
      },

      // function fanOverLast(values, sub, sub_fill_dir_) {
      //   let directives = AsDirectives(SUB, sub_fill_dir_)
      //   directives = { __proto__ : directives, SCAN : FORWARD }
      //   return this.fanOver(values, sub, directives)
      // },

      // function fanOverLast(values, sub, subDirection = FORWARD) {
      //   return this.fanOver(values, sub, {SCAN : FORWARD, SUB : subDirection})
      // },

      function fanOverLast(values, sub) {
        return this.fanOver(values, sub, FORWARD)
      },

      function fanOverLast(values, sub) {
        return this.fanOver(values, sub, BACKWARD)
      },

      function fanOverDistinct(values, subSeq, directives = FORWARD) {
        const original     = this._elements
        const matchSub     = AsArray(subSeq)
        const matchSize    = matchSub.length
        const filler       = AsArray(values)
        const fillerSize   = original.length
        const fillDir      = directives.FILL || FWD

        return this._nonCopy((result) => {
          if (matchSize === fillerSize && this === result) {
            this._overDo(directives, true, matchSize, (sub, [lo, hi, dir]) => {
              if (EqualArrays(sub, matchSub)) {
                this.__fillWithin(filler, lo, hi, FORWARD, fillDir)
              }
            })
            return this
          }

          const spans = this._spansOfEvery(matchSub, directives, false)

          if (spans.size === 0)    { return this }
          if (directives.SCAN < 0) { spans = spans.reversed }

          this.__fanAcrossWithinAll(filler, original, spans, fillDir)
        })
      },




      //// ADD METHODS ////

      //// ADD : Generic

      { ALIAS : {
        add    : "addLast",
        addAll : "addAllLast"
      } },



      //// ADD : a Value at a Position

      function addFirst(value) {
        return this._set(function () {
          this.__subFromShiftTo(0, 1)
          this._elements[0] = value
        })
      },

      function addLast(value) {
        return this._set(function () {
          const target = this._elements
          target[elements.length] = value
        }
      },

      function addBefore(value, matchValue, scanDirective = FORWARD) {
        const index = this.indexOf(matchValue, scanDirective)
        if (index === undefined) { return this }

        return this.withinPut([index], value)
      },

      function addAfter(value, matchValue, scanDirective = FORWARD) {
        const index = this.indexOf(matchValue, scanDirective)
        if (index === undefined) { return this }

        return this.withinPut([++index], value)
      },



      //// ADD : a Sequence at a Position

      function addFirstAll(values, fillDirective = FORWARD) {
        return this.withinFan([0], values, fillDirective)
      },

      function addLastAll(values, fillDirective = FORWARD) {
        return this.withinFan([null], values, fillDirective)
      },

      function addAllBefore(values, sub, directives_) {
        const span = this.spanOf(sub, directives_)
        return (span) ? this.withinFan([span[LO]], values, directives_) : this
      },

      function addAllAfter(values, sub, directives_) {
        const span = this.spanOf(sub, directives_)
        return (span) ? this.withinFan([span[HI]], values, directives_) : this
      },




      //// REMOVE METHODS ////

      //// REMOVE : Generic

      function removeAt(position) {
        return (position.length) ?
          this.removeWithin(position) : this.removeAtIndex(position)
      },

      function removeAtEach(positions) {
        return this.set((result) => {
          Each(positions, (position) => { result.removeAt( position ) })
        })
      },

      function removeEach(values) {
        return this.set((result) => {
          Each(values, (value) => { result.remove( value ) })
        })
      },

      function removeAll() {
        return this._nonCopy((result) => { result._elements = [] })
      },

      { GETTER :
        function empty() {
          return this._new((result) => {})
        },
      },



      //// REMOVE : the Value at the Index

      function removeAtIndex(index) {
        const size      = this._elements.length
        const slotIndex = (index < 0) ? size - index : index

        return (slotIndex >= 0 && slotIndex < size) ?
          this._set(this.__subFromShiftTo, slotIndex + 1, slotIndex) : this
      },


      function _removeAtIndex(validIndex) {
        return this._set(this.__subFromShiftTo, validIndex + 1, validIndex)
      },



      //// REMOVE : the Subsequence at the Span

      function removeWithin(span_start, ...end__direction__wrap) {
        const span = (span_start.length) ? span_start :
          [span_start, ...end__direction__wrap]

        return this._removeWithin(this._asNormalizedSpan(span))
      },

      function removeBeyond(edge) {
        return this._removeWithin(this._asNormalizedSpan([edge, null]))
      },

      function removeUntil(edge) {
        return this._removeWithin(this._asNormalizedSpan([0, edge]))
      },

      function removeInitial(count = 1) {
        return this._removeWithin(this._asNormalizedSpan([0, count]))
      },

      function removeFinal(count = 1) {
        return this._removeWithin(this._asNormalizedSpan([-count, null]))
      },


      function _removeWithin([lo, hi]) {
        return (lo === hi) ? this : this._set(this.__subFromShiftTo, hi, lo)
      },



      //// REMOVE : a Value

      function remove(value, scanDirective = FORWARD) {
        return this.removeAtIndex(this.indexOf(value, scanDirective))
      },

      function removeFirst(value_) {
        const index = (arguments.length) ? this.indexOfFirst(value_) : 0
        return this.removeAtIndex(index)
      },

      function removeLast(value_) {
        return (arguments.length) ?
          this.removeAtIndex(this.indexOfLast(value_)) : this.removeFinal()
      },

      function removeEvery(value) {
        return this.removeEveryWhere((existing) ==> value === existing)
      },



      //// REMOVE : a Value satisfying a Condition

      function removeWhere(scanDirective_, Condition) {
        const modified = this.eachDo(scanDirective_, function (value, index) {
          if (Conditional.call(this.$, value, index)) {
            return this._set(this._removeAtIndex(index))
          }
        })
        return modified || this
      },

      function removeEveryWhere(scanDirective_, condition) {
        return this._new((result) => {
          const originalValues =
          const [readSpan, test] =
            this._justifyArgs(scanDirective_, condition)
          const indexes = this.indexesOfWhere(readSpan, test)

          if (indexes.size === 0) { return this }

          const mapDir  = readSpan[DIR]
          const spans   = indexes.map(mapDir, (index) => [index, index + 1])

          this.__fanAcrossWithinAll([], this._elements, spans)
        })
      },

      function removeEveryWhereNot(scanDirective_, condition) {
        const inverseCondition =
          (value, index) => !condition.call(this.$, value, index)
        return this.removeEveryWhere(scanDirective_, inverseCondition)
      },



      //// REMOVE : a Subsequence

      function removeOver(sub, directives_) {
        const span = this.spanOf(sub, directives_)
        return (span) ? this._removeWithin(span) : this
      },

      function removeOverFirst(sub, subDirection = FORWARD) {
        return this.removeOver(sub, {SCAN : FORWARD, SUB : subDirection})
      },

      function removeOverLast(sub, subDirection = FORWARD) {
        return this.removeOver(sub, {SCAN : BACKWARD, SUB : subDirection})
      },

      function removeOverDistinct(matchSub, directives_) {
        return fanOverDistinct([], matchSub, directives_)
      },



      //

      //// SUPPORT METHODS ////

      //   undefined    + direction
      //   boolean      +/- direction
      //   number       +/- direction
      //   [Infinity]   +/- direction
      //   [1]          relative edge
      //   [1,,]        relative index
      //   [2,-1]       relative span
      //   [1,,,]       linear index
      //   [7,2,-1]     linear span
      //   [x,,1]       +/- direction
      //   {scan : BWD }
      //   {scan: [1,3,-1] }

      // LOOK: Can undefined ever be passed in to this method???
      // undefined|boolean|number|span|{scan: undefined|boolean|number|span }

      function _asNormalizedSpan(specifier, bounded = true) {
        let start, end, dir, lo, hi
        let size = this._elements.length

        do {
          if (specifier === undefined) {
            debugger; // LOOK: Is it necessary to check for undefined???
            return [0, size, FWD]
          } // direction
          if (specifier.toFixed) {return [0, size, (specifier < 0) ? BWD : FWD]}

          switch (span.length) {
            case undefined :
              if (typof specifier === "boolean") {              // direction
                return [0, size, (specifier) ? FWD : BWD]
              }
              specifier = specifier.scan                        // dirSpec
              if (specifier === undefined) { return [0, size, FWD] }
              // LOOK: Maybe this is where the undefined check needs to move!!!
              ;continue
              // return [0, size, (specifier.SCAN < 0) ? BWD : FWD]
            case 1 :
              ;[start, end, dir] = [specifier, specifier, NON]  // relative edge
              if (start + 1 === start) { return [0, size, FWD] }// direction
              ;break
            case 2 :
              ;[start, end] = specifier                    // relative span|edge
              if (end === undefined) { end = start + 1 }   // relative index
              ;break
            case 4 :
              wraps = specifier[WRAPS]
              // INTENTIONAL FALL THRU
            case 3 :
              [lo, hi, dir] = specifier
              if (hi === undefined) {                          // direction
                if (dir !== undefined) {return [0, size, (dir < 0) ? BWD : FWD]}
                hi = lo + 1                                   // linear index
              }                                              // linear span|edge
              dir = dir ? (dir < 0 ? BWD : FWD) : NON
              ;break
            default : return undefined
          }
        } while (false)

        if (lo === undefined) {
          start = (start >= 0) ? (start === null ? size : start) : start + size
          end   = (end   >= 0) ? (end   === null ? size : end  ) : end   + size

          ;[lo, hi, dir] = (start < end) ?
            [start, end, FWD] :
            [end, start, (start > end ? BWD : NON)]
        }

        if   (bounded) { (lo < 0) && (lo = 0); (hi > size) && (hi = size) }
        else (bounded === STRETCH) { direction = STRETCH }

        return (wraps) ? [lo, hi, dir, wraps] : [lo, hi, dir]
      },

      function _justifyArgs(...args) {
        do {
          let [first, ...remaining] = args

          switch (typeof first) {
            case "function"  : return [this.span, ...args]
            case "string"    : return [this.span, ...args]
            case "undefined" :
              if (!args.length) { return undefined } // [[0, 0, NON], ...args]
              args = remaining
              ;continue
          }

          if (args.length === 1) { args = first; continue }
        } while (false)

        return [this._asNormalizedSpan(first), ...remaining]
      },

      function __fillWithin(source, lo, hi, scanDir, fillDir_, sIndex__) {
        const target = this._elements

        let [tIndex, tLimit, tInc, sInc                      ] = (scanDir < 0) ?
            [hi - 1, lo - 1, BWD , (fillDir_ < 0 ? FWD : BWD)] :
            [lo    , hi    , FWD , (fillDir_ < 0 ? BWD : FWD)]

        let sIndex = (sIndex__ !== undefined) ? sIndex__ :
                        (sInc > 0) ? 0 : source.length - 1

        while (tIndex !== tLimit) {
          target[tIndex] = source[sIndex]
          tIndex += tInc
          sIndex += sInc
        }

        return tIndex
      },

      function __echoWithin(value, lo, hi) {
        for (let target = this._elements, index = lo; index < hi; index++) {
          target[index] = value
        }
      },

      function __echoFillWithin(source, lo, hi, scanDir, fillDir_) {
        const target = this._elements

        let [tIndex, tLimit, tInc, sInc] = (scanDir < 0) ?
        [hi - 1, lo - 1, BWD, (fillDir_ < 0) ? FWD : BWD] :
        [lo    , hi    , FWD, (fillDir_ < 0) ? BWD : FWD]

        let [sStart, sLimit] = (sInc > 0) ? [0 : sSize] : [sSize - 1, -1]

        sIndex = sStart
        while (tIndex !== tLimit) {
          target[tIndex] = source[sIndex]
          tIndex += tInc
          sIndex = (sIndex !== sLimit) ? sIndex + sInc : sStart
        }
      },

      function __subFromShiftTo(sourceEdge, targetEdge) {
        const target  = this._elements
        const endEdge = elements.length
        const size    = endEdge - sourceEdge
        let   tIndex, sIndex

        if (targetEdge === sourceEdge) { return }

        if (targetEdge < sourceEdge) {
          sIndex = sourceEdge
          tIndex = targetEdge

          while (sIndex < endEdge) { target[tIndex++] = target[sIndex++] }
          target.length -= size // NOTE: Doesn't check for a negative length!!!
        }
        else {
          sIndex = endEdge
          tIndex = targetEdge + size

          while (sIndex > sourceEdge) { target[--tIndex] = target[--sIndex] }
        }
      },

      function __fanAcrossWithinAll(filler, original, spans, fillDir_) {
          const target     = this._elements
          const fillerSize = filler.length
          const limit      = original.length   // final original edge
          let   next       = 0                 // edge traversing original
          let   start      = 0                 // target insertion edge
          let   target     = []

          spans.eachDo(([left, right]) => {
            let skipSize = left - next        // skipped elements from original
            let end      = start + skipSize   // target trailing edge

            start = this.__fillWithin(original, start, end, FWD, fillDir_, next)
            end   = start + fillerSize

            start = this.__fillWithin(filler, start, end, FWD, fillDir_)
            next  = right
          })

          if ((skipSize = limit - next)) {
            end = start + skipSize
            this.__fillWithin(original, start, end, FWD, fillDir_, next)
          }
        })
      },

    ]
  })
})
