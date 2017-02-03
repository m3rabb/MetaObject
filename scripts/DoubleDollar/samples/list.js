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



      //// ACCESS : answer the Sequence within the Span

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

        readSpan[DIR] = (AsDirection(SCAN, scanDirective) < 0) ? BWD : FWD
        return this._withinMap(readSpan, (value) => value))
      },



      //// ACCESS : answer the Index at a Value

      function indexOf(value, scanDirective = FORWARD) {
        const condition = (existing) => value === existing)
        const readSpan  = this._asNormalizedSpan(scanDirective)

        return this._byWithinFind(INDEX, readSpan, condition)
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
              const slot =
                { index: index, value: value } // element: value, key: index,
              result.add( slot[Grip] )
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



      //// ACCESS : answering the Span of a Sequence

      function spanOf(sub, directives_) {
        const matchSub   = AsArray(sub)
        const subSize    = matchSub.length
        const directives = NormalizeDirectives(directives_)

        return this._overDo(directives, true, subSize, false, (sub, span) => {
          if (EqualArrays(sub, matchSub)) { return span }
        })
      },

      function spanOfFirst(sub, subDirection = FORWARD) {
        return this.spanOf(sub, {SCAN : FORWARD, SUB : subDirection})
      },

      function spanOfLast(sub, subDirection = FORWAR) {
        return this.spanOf(sub, {SCAN : BACKWARD, SUB : subDirection})
      },

      function spanOfEvery(sub, directives_) {
        const directives__overlaps = NormalizeDirectives(directives_, false)

        return this._spanOfEvery(sub, ...directives__overlaps)
      },


      function _spanOfEvery(sub, directives, overlaps = false) {
        const matchSub   = AsArray(sub)
        const subSize    = matchSub.length

        return this._new((result) => {
          return this._overDo(directives, overlaps, subSize, false,
            (next, span) => {
              if (EqualArrays(next, matchSub)) { result.add( span ) }
            })
        })
      },



      //// ACCESS : answering the Count of a Sequence

      function countOfSeq(sub, directives_) {
        return this.spanOfEvery(sub, directives_).size
      },



      //// ACCESS : answer the presence (or not) of a sequence of Subelements

      function containsSeq(sub, directives_) {
        return (this.spanOf(sub, directives_) != null)
      },




      //// ENUMERATION METHODS ////

      //// ENUMERATION : by Value & Index

      function withinDo(span, action) {
        this._withinDo(this._asNormalizedSpan(span), action)
      },

      function withinMap(span, action) {
        this._withinMap(this._asNormalizedSpan(span), action)
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

      function reduce(...scanDirective___action__seed_) {
        let args = this._justifyArgs(scanDirective___action__seed_)
        let [readSpan, Action, Accumulator] = args
        let scanDir = readSpan[DIR]

        if (args.length === 2) {
          Accumulator = (scanDir < 0) ?
            this._atIndex(--readSpan[HI]) : this._atIndex(readSpan[LO]++)
        }

        this._withinDo(readSpan, function (value, index) {
          Accumulator = Action.call(this.$, Accumulator, value, index)
        })

        return Accumulator
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

      function overDo(directives_, subSize, action) {
        // NOTE: Can't use _justifyArgs here because next arg is a number!!!
        if (action === undefined) {
          [directives_, subSize, action] = [DEF, directives_, subSize]
        }
        const directives__overlaps = NormalizeDirectives(directives_, true)

        return this._overDo(...directives__overlaps, subSize, true, action)
      },

      function overMap(directives_, subSize, action) {
        // NOTE: Can't use _justifyArgs here because next arg is a number!!!
        if (action === undefined) {
          [directives_, subSize, action] = [DEF, directives_, subSize]
        }
        const directives__overlaps = NormalizeDirectives(directives_, true)

        return this.new((result) => {
          this._overDo(...directives__overlaps, subSize, true, (sublist, span) => {
            result.add( Action.call(this.$, sublist, span) )
          })
        })
      },


      function _overDo(directives, overlaps, size, subsAsLists, action) {
        const target = this._elements
        const subDir = directives.SUB
        let   [lo, hi, scanDir, wraps] = this._asNormalizedSpan(directives)

        if (wraps) {
          return this.error("Wrapping on span enumeration is not yet implemented!")
        }

        let [start, limit, startInc, endInc] = (scanDir < 0) ?
              [hi, lo, BWD, -size] : [lo, hi, FWD, size]

        if (!overlaps) { startInc *= size }

        let [sStart, sLimit, sInc] = (subDir < 0) ?
              [size - 1, -1, BWD] : [0, size, FWD]

        do {
          do {
            let end       = start + endInc
            let remaining = (limit - end) * scanDir

            if (remaining < 0) { break }

            let [tIndex, nextSpan] = (scanDir < 0) ?
                  [end  , [end, start, sInc]] :
                  [start, [start, end, sInc]]

            let sub = []
            let sIndex = sStart

            while (sIndex !== sLimit) {
              sub[sIndex] = target[tIndex++]
              sIndex += sInc
            }

            let nextSub = subsAsLists ? List(sub) : sub
            let result  = action.call(this.$, nextSub, nextSpan)

            if (result !== undefined) { return result }

            start += startInc
          } while (true)

          if (remaining === 0) { break }

          size += count
          end = limit
        } while (true)

        return undefined
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

      function atEachPutEach(indexes_spans, Values) {
        return this.set(function () {
          Each(indexes_spans,
            (index_span, next) => this.atPut(index_span, Values[next]))
        })
      },

      function atFan(index_span, values) {
        const span = (index_span.length) ?
          index_span : [index_span, index_span + 1]
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
        const direction = AsDirection(FILL, fillDirective)

        return this._withinSetBy(writeSpan, source, "__fillWithin", direction)
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



      //// PUT : a Sequence over a Sequence

      // NOTE: Consider adding 'put' directives put: fan|fill|lay !!!
      // overPut

      function overFan(sub, values, directives_) {
        const directives = NormalizeDirectives(directives_)
        const source     = AsArray(values)
        const span       = this.spanOf(sub, directives)
        if (!span) { return undefined }

        span[DIR]  = STRETCH
        return this._withinSetBy(span, source, "__fillWithin", directives.FILL)
      },

      // function overFirstFan(sub, values, sub_fill_dir_) {
      //   let directives = NormalizeDirectives(SUB, sub_fill_dir_)
      //   directives = { __proto__ : directives, SCAN : FORWARD }
      //   return this.overFan(sub, values, directives)
      // },

      function overFirstFan(sub, values) {
        return this.overFan(sub, values, FORWARD)
      },

      function overLastFan(sub, values) {
        return this.overFan(sub, values, BACKWARD)
      },

      function overEveryFan(sub, values, directives_) {
        const directives   = NormalizeDirectives(directives_)
        const original     = this._elements
        const matchSub     = AsArray(sub)
        const matchSize    = matchSub.length
        const filler       = AsArray(values)
        const fillerSize   = original.length
        const fillDir      = directives.FILL

        return this._nonCopy((result) => {
          if (matchSize === fillerSize && this === result) {
            this._overDo(directives, false, matchSize, false,
              (nextSub, [left, right, dir]) => {
                if (EqualArrays(nextSub, matchSub)) {
                  this.__fillWithin(filler, left, right, FORWARD, fillDir)
                }
              })

            return this
          }

          const spans = this._spanOfEvery(matchSub, directives, false)

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

      function removeAt(index_span) {
        return (index_span.length) ?
          this.removeWithin(index_span) : this.removeAtIndex(index_span
      },

      function removeAtEach(indexes_spans) {
        return this.set((result) => {
          Each(indexes_spans, (index_span) => { result.removeAt( index_span ) })
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



      //// REMOVE : the Sequence at the Span

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

      function removeEvery(value, scanDirective = FORWARD) {
        const condition = (existing) ==> value === existing
        return this.removeEveryWhere(scanDirective, condition)
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



      //// REMOVE : a Sequence

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

      function removeOverEvery(matchSub, directives_) {
        return overEveryFan(matchSub, [], directives_)
      },




      //// SUPPORT METHODS ////

      //    1           direction
      //   [1]          relative edge
      //   [1,,]        relative index
      //   [2,-1]       relative span
      //   [1,,,]       linear index
      //   [7,2,-1]     linear span

      function _asNormalizedSpan(specifier, bounded = true) {
        let start, end, dir, lo, hi
        let size = this._elements.length

        if (specifier.toFixed) {                   // direction
          return [0, size, (specifier < 0) ? BWD : FWD]
        }

        switch (span.length) {
          case undefined :                         // scanDirective
            return [0, size, (specifier.SCAN < 0) ? BWD : FWD]
          case 1 :                                 // relative edge
            ;[start, end, dir] = [specifier, specifier, NON]
            ;break
          case 2 :
            ;[start, end = start + 1] = specifier  // relative span|edge|index
            ;break
          case 4 :
            wraps = specifier[WRAPS]
            // INTENTIONAL FALL THRU
          case 3 :
            ;[lo, hi = lo, dir] = specifier        // linear span|edge|index
            dir = dir ? (dir < 0 ? BWD : FWD) : NON
            ;break
          default : return undefined
        }

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
