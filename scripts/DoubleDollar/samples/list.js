/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

Krust.set((context) => {

  const EDGE      =  0
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

  const SCAN      = "scan"
  const FILL      = "fill"

  const INDEX     = "index"
  const VALUE     = "value"
  const SPAN      = "span"
  const SUB       = "sub"

  const UNTIL_EDGE  = Symbol("UNTIL_EDGE")
  const BEYOND_EDGE = Symbol("BEYOND_EDGE")

  const BEYOND      = 1000000000000


  context.newType({
    name : "List",

    instanceConstants: {

    },

    instanceMethods: [

      function _init(elements_) {
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

        return this.withinMap(readSpan, (value) => value))
      },

      function beyond(edge, scanDirective_) {
        const edge = (edge.toFixed) ? edge : edge[EDGE]
        this._within(edge, null, scanDirective_)
      },

      function until(edge, scanDirective_) {
        const edge = (edge.toFixed) ? edge : edge[EDGE]
        return this._within(0, edge, scanDirective_)
      },

      function initial(count = 1, scanDirective_) {
        return this._within(0, count, scanDirective_)
      },

      function final(count = 1, scanDirective_) {
        const size = this.size
        return this._within(size - count, size, scanDirective_)
      },


      function _within(start, end, scanDirective, _wraps) {
        const readSpan = this._asNormalizedSpan([start, end])

        readSpan[DIR] = (scanDirective == null) ? FWD :
          AsDirection(SCAN, scanDirective)
        return this.withinMap(readSpan, (value) => value))
      },



      //// ACCESS : answer an Index satisfying a Condition

      function indexWhere(scanDirective_, test, absent_) {
        return this._byFind(INDEX, ...Justify(scanDirective_, test, absent_))
      },

      function indexesWhere(scanDirective_, condition) {
        return this._byFindEvery(INDEX, ...Justify(scanDirective_, condition))
      },


      function _byFind(grip, scanDirective, Condition, absent_) {
        const found = this.withinDo(scanDirective, (value, index) => {
          if (Conditional.call(this.$, value, index)) {
            return { index: index, value: value } // element: value, key: index,
          }
        })
        return found ? found[grip] :
          (typeof absent_ !== "function") ? absent_ : absent_.call(this.$)
      },

      function _byFindEvery(Grip, scanDirective, Condition) {
        return this.new((result) => {
          this.withinDo(scanDirective, (value, index) => {
            if (Conditional.call(this.$, value, index)) {
              const slot = { index: index, value: value }
              result.add( slot[Grip] )        // element: value, key: index,
            }
          })
        })
      },



      //// ACCESS : answer a Value satisfying a Condition

      function valueWhere(directive_, condition, absent_) {
        return this._byFind(VALUE, JustifyWithAll(directive_, test, absent_))
      },



      function everyWhere(scanDirective_, conditional) {
        return this._byFindEvery(VALUE, ...Justify(scanDirective_, condition))
      },

      function everyWhereNot(scanDirective_, conditional) {
        const [scanDirective, action] = Justify(scanDirective_, condition)
        const inverseCondition =
          (value, index) => !action.call(this.$, value, index)
        return this.everyWhere(scanDirective_, inverseCondition)
      },

      { ALIAS : {
        where   : "valueWhere"
        detect  : "valueWhere",
        find    : "valueWhere",
        select  : "everyWhere",
        reject  : "everyWhereNot"
      } },



      //// ACCESS : answer the Count satisfying a Condition

      function countWhere(scanDirective_, conditional) {
        let [scanDirective, Conditional] = Justify(scanDirective_, conditional)
        let count = 0
        this.withinDo(scanDirective, (value, index) => {
          if (Conditional.call(this.$, value, index)) { count++ }
        })
        return count
      },



      //// ACCESS : answer the Index at a Value

      function indexOf(value, scanDirective_) {
        const condition = (existing) => value === existing)
        return this._byFind(INDEX, scanDirective_, condition)
      },

      function indexOfFirst(value) {
        return this.indexOf(value, FORWARD)
      },

      function indexOfLast(value) {
        return this.indexOf(value, BACKWARD)
      },

      function indexesOfEvery(value, scanDirective_) {
        const condition = (existing) => value === existing)
        return this._byFindEvery(INDEX, scanDirective_, condition)
      },



      //// ACCESS : answer the Count of a Value

      function countOf(value) {
        return this.countWhere((existing) => (existing === value))
      },



      //// ACCESS : answer the presence (or not) of a Value

      function contains(value) {
        return (this.indexOf(value) >= 0)
      },



      //// ACCESS : answer a Span satisfying a Condition

      function spanWhere(directives_, subSize, condition) {
        return this._byFindSub(
          SPAN, ...Justify(directives_, subSize, condition))
      },

      function distinctSpansWhere(directives_, subSize, condition) {
        return this._byFindEverySub(
            SPAN, true, ...Justify(directives_, subSize, condition))
      },

      function indistinctSpansWhere(directives_, subSize, condition) {
        return this._byFindEverySub(
          SPAN, false, ...Justify(directives_, subSize, condition))
      },


      function _byFindSub(grip, directives, subSize, condition) {
        return this._overDo(false, directives, subSize, (sub, span) => {
          if (Condition.call(this.$, sub, span)) {
            return (grip === SUB) ? sub : span
          }
        })
      },

      function _byFindEverySub(grip, distinct, directives, subSize, condition) {
        return this.new((result) => {
          this._overDo(distinct, directives, subSize, (sub, span) => {
            if (Conditional.call(this.$, sub, span)) {
              result.add( (grip === SUB) ? sub : span )
            }
          })
        })
      },



      //// ACCESS : answer a Subsequence satisfying a Condition

      function subWhere(directives_, subSize, condition) {
        return this._byFindSub(SUB, ...Justify(directives_, subSize, condition))
      },

      function distinctWhere(directives_, subSize, condition) {
        return this._byFindEverySub(
          SUB, true, ...Justify(directives_, subSize, condition))
      },

      function indistinctWhere(directives_, subSize, condition) {
        return this._byFindEverySub(
          SUB, false, ...Justify(directives_, subSize, condition))
      },



      //// ACCESS : answering the Span of a Subsequence

      function spanOf(sub, directives_) {
        const matchSub   = AsArray(sub)
        const subSize    = matchSub.length

        return this._overDo(false, directives_, subSize, (sub, span) => {
          if (EqualArrays(sub, matchSub)) { return span }
        })
      },

      function spanOfFirst(sub, subDirection_) {
        return this.spanOf(sub, {scan: FORWARD, sub: subDirection_})
      },

      function spanOfLast(sub, subDirection_) {
        return this.spanOf(sub, {scan: BACKWARD, sub: subDirection_})
      },

      function spansOfDistinct(sub, directive_) {
        return this._spansOfEvery(true, sub, directive_)
      },

      function spansOfIndistinct(sub, directives_) {
        return this._spansOfEvery(false, sub, directives_)
      },


      function _spansOfEvery(distinct, sub, directives_) {
        const matchSub   = AsArray(sub)
        const subSize    = matchSub.length

        return this.new((result) => {
          this._overDo(distinct, directives_, subSize, (sub, span) => {
            if (EqualArrays(sub, matchSub)) {
              result.add( (grip === SUB) ? sub : span )
            }
          })
        })
      },



      //// ACCESS : answering the Count of a Subsequence

      function countOfDistinct(sub, directives_) {
        return this._spansOfEvery(true, sub, directives_).size
      },

      function countOfIndistinct(sub, directives_) {
        return this._spansOfEvery(false, sub, directives_).size
      },



      //// ACCESS : answer the presence (or not) of a Subsequence

      function containsSub(sub, directives_) {
        return (this.spanOf(sub, directives_) != null)
      },




      //// ENUMERATION METHODS ////

      //// ENUMERATION : by Value & Index

      function withinDo(scanDirective, action) {
        let target = this._elements
        let size   = target.length
        let preIndex, preLimit, sIndex, sLimit, noWrap, result
        let [lo, hi, dir, wraps] = this._asNormalizedSpan(scanDirective)

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

      function withinMap(scanDirective, Action) {
        return this.new((result) => {
          const target = result._elements

          this.withinDo(scanDirective, (value, index) => {
            target[index] = Action.call(this.$, value, index)
          })
        })
      },

      function withinReduce(directive, Accumulator_, Reducer) {
        if (Reducer === undefined) {
          Reducer   = Accumulator_
          directive = this._asNormalizedSpan(directive)
          let index = (directive[DIR] < 0) ? --directive[HI] : directive[LO]++
          Accumulator_ = this._atIndex(index)
        }

        this.withinDo(directive, function (value, index) {
          Accumulator_ = Reducer.call(this.$, Accumulator_, value, index)
        })

        return Accumulator_
      },

      function eachDo(scanDirective_, action) {
        return action ?
          this.withinDo(scanDirective_, action) :
          this.withinDo(undefined, action = scanDirective_)
      },

      function map(scanDirective_, action) {
        return action ?
          this.withinMap(scanDirective_, action) :
          this.withinMap(undefined, action = scanDirective_)
      },

      function eachSend(...scanDirective___method_selector__args_) {
        const [directive, action, ...args] =
          JustifyWithAll(...scanDirective___method_selector__args_)

        return (typeof action === "function") ?
          this.withinDo(directive, (value) => { action.apply(value, args)) }
          this.withinDo(directive, (value) => { value[action](...args))    }
      },

      function mapSend(...scanDirective___method_selector__args_) {
        const [directive, action, ...args] =
          JustifyWithAll(...scanDirective___method_selector__args_)

        return (typeof action === "function") ?
          this.withinMap(directive, (value) => { action.apply(value, args)) }
          this.withinMap(directive, (value) => { value[action](...args))    }
      },

      function reduce(accumulator_, reducer) {
        return this.withinReduce(null, accumulator_, reducer)
      },

      { ALIAS : {
        do         : "eachDo",
        elementsDo : "eachDo",
        collect    : "map",
        inject     : "reduce",
      } },




      //// ENUMERATION : by Subsequence & Span

      function distinctDo(directives_, subSize, action) {
        return this._overDo(true, ...Justify(directives_, subSize, action))
      },

      function indistinctDo(directives_, subSize, action) {
        return this._overDo(false, ...Justify(directives_, subSize, action))
      },

      function distinctMap(directives_, subSize, action) {
        return this._overMap(true, ...Justify(directives_, subSize, action))
      },

      function indistinctMap(directives_, subSize, action) {
        return this._overMap(false, ...Justify(directives_, subSize, action))
      },


      function _overDo(distinct, directives, subSize, action) {
        const target   = this._elements
        const readSpan = this._asNormalizedSpan(directives)
        const subDir   = directives && directives.sub || FWD

        if (wraps) { return this.error(
            "Wrapping on seq enumerations is not yet implemented!") }

        let [start, limit, startInc, endInc] = (scanDir < 0) ?
              [hi, lo, BWD, -subSize] : [lo, hi, FWD, subSize]

        if (distinct) { startInc *= subSize }

        let [sStart, sLimit, sInc] = (subDir < 0) ?
              [subSize - 1, -1, BWD] : [0, subSize, FWD]

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

          subSize += count
          end = limit
        } while (true)

        return undefined
      },


      function _overMap(distinct, directives, subSize, Action) {
        return this.new((result) => {
          this._overDo(distinct, directives, subSize, (sublist, span) => {
            result.add( Action.call(this.$, sublist, span) )
          })
        })
      },




      //// PUT METHODS ////

      //// PUT : Generic

      // NOTE: Consider adding 'put' directives put: fan|fill|lay !!!
      function atPut(position, value) {
        return (position.length) ?
          this.withinPut(position, value) :
          this.putAtIndex(value, index)
      },

      function putAt(value, position) {
        return (position.length) ?
          this.withinPut(position, value) :
          this.putAtIndex(value, index)
      },

      // LOOK check use of set vs _set!!!
      function putAtEach(value, positions) {
        return this.set(function () {
          Each(positions, (position) => this.putAt(value, position))
        })
      },

      function putEachAtEach(Values, positions) {
        return this.set(function () {
          Each(positions, (position, next) => {
            this.putAt(Values[next], positions)
          })
        })
      },

      function fanAt(values, position) {
        const span = (position.length) ? position : [position, position + 1]
        return this.fanWithin(values, span)
      },



      //// PUT : a Value at the Index

      function putAtIndex(value, index) {
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

      function putWithin(value, edge_span) {
        const writeSpan = this._asNormalizedSpan(edge_span, STRETCH)

        return this._withinSetBy(writeSpan, [value], "__fillWithin")
      },

      function echoWithin(value, span) {
        const writeSpan = this._asNormalizedSpan(span, UNBOUNDED)

        return this._withinSetBy(writeSpan, value, "__echoWithin")
      },

      function fanWithin(values, directives = FORWARD) {
        const source = AsArray(values)
        const span   = this._asNormalizedSpan(directives, STRETCH)

        return this._withinSetBy(span, source, "__fillWithin", directives.fill)
      },

      function fillWithin(values, directives = FORWARD) {
        const source = AsArray(values)
        const span   = this._contractSpanTo(span, source.length)

        return this._withinSetBy(span, source, "__fillWithin", directives.fill)
      },

      function echoFillWithin(values, directives = FORWARD) {
        const source  = AsArray(values)
        const span    = this._asNormalizedSpan(span, UNBOUNDED)
        const fillDir = directives.fill

        return this._withinSetBy(span, source, "__echoFillWithin", fillDir)
      },

      function layBeyond(values, edge, fillDirective_) {
        const source    = AsArray(values)
        const edge      = (edge.toFixed) ? edge : edge[EDGE]
        const writeSpan = this._contractSpanTo([edge, BEYOND], source.length)
        const fillDir   = AsDirection(FILL, fillDirective_)

        return this._withinSetBy(writeSpan, source, "__fillWithin", fillDir)
      },

      function layUntil(values, edge, fillDirective_) {
        const source    = AsArray(values)
        const edge      = (edge.toFixed) ? edge : edge[EDGE]
        const writeSpan = this._contractSpanTo([-BEYOND, edge], source.length)
        const fillDir   = AsDirection(FILL, fillDirective_)

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
        putAtValue, "putAtFirst"
      } },

      function putAtFirst(newValue, matchValue) {
        return this.putAtIndex(newValue, this.indexOf(matchValue, FORWARD))
      },

      function putAtLast(newValue, matchValue) {
        return this.putAtIndex(newValue, this.indexOf(matchValue, BACKWARD))
      },

      function putAtEvery(newValue, matchValue) {
        return this._set((result) => {
          let target = result._elements
          let count = 0

          this.withinDo(undefined, function (value, index) {
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

      function fanOver(values, sub, directives = FORWARD) {
        const source = AsArray(values)
        const span   = this.spanOf(sub, directives)
        if (!span) { return undefined }

        span[DIR]  = STRETCH
        return this._withinSetBy(span, source, "__fillWithin", directives.fill)
      },

      // function fanOverLast(values, sub, sub_fill_dir_) {
      //   let directives = AsDirectives(SUB, sub_fill_dir_)
      //   directives = { __proto__ : directives, SCAN : FORWARD }
      //   return this.fanOver(values, sub, directives)
      // },

      // function fanOverLast(values, sub, subDirection = FORWARD) {
      //   return this.fanOver(values, sub, {scan: FORWARD, sub: subDirection})
      // },

      function fanOverFirst(values, sub) {
        return this.fanOver(values, sub, FORWARD)
      },

      function fanOverLast(values, sub) {
        return this.fanOver(values, sub, BACKWARD)
      },

      function fanOverEvery(values, subSeq, directives = FORWARD) {
        const original     = this._elements
        const matchSub     = AsArray(subSeq)
        const matchSize    = matchSub.length
        const filler       = AsArray(values)
        const fillerSize   = original.length
        const fillDir      = directives.fill

        return this._nonCopy((result) => {
          if (matchSize === fillerSize && this === result) {
            this._overDo(true, directives, matchSize, (sub, [lo, hi, dir]) => {
              if (EqualArrays(sub, matchSub)) {
                this.__fillWithin(filler, lo, hi, FORWARD, fillDir)
              }
            })
            return this
          }

          const spans = this._spansOfEvery(true, matchSub, directives)

          if (spans.size === 0)    { return this }
          if (AsDirection(SCAN, directives) < 0) { spans = spans.reversed }

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

      function addBefore(value, matchValue, scanDirective_) {
        const index = this.indexOf(matchValue, scanDirective_)
        if (index === undefined) { return this }

        return this.withinPut([index], value)
      },

      function addAfter(value, matchValue, scanDirective_) {
        const index = this.indexOf(matchValue, scanDirective_)
        if (index === undefined) { return this }

        return this.withinPut([++index], value)
      },



      //// ADD : a Sequence at a Position

      function addFirstAll(values, fillDirective_) {
        return this.fanWithin(values, { scan: [0], fill: fillDirective_ })
      },

      function addLastAll(values, fillDirective_) {
        return this.fanWithin(values, { scan: [null], fill: fillDirective_ })
      },

      function addAllBefore(values, sub, directives_) {
        const span = this.spanOf(sub, directives_)
        return (!span) ? this :
          this.fanWithin(values, { scan: [span[LO]], fill: directives_.fill })
      },

      function addAllAfter(values, sub, directives_) {
        const span = this.spanOf(sub, directives_)
        return (!span) ? this :
          this.fanWithin(values, { scan: [span[HI]], fill: directives_.fill })
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

        return this._removeWithin(span)
      },

      function removeBeyond(edge) {
        return this._removeWithin([edge, null])
      },

      function removeUntil(edge) {
        return this._removeWithin([0, edge])
      },

      function removeInitial(count = 1) {
        return this._removeWithin([0, count])
      },

      function removeFinal(count = 1) {
        return this._removeWithin([-count, null])
      },


      function _removeWithin(span) {
        const [lo, hi] = this._asNormalizedSpan(span)

        return (lo === hi) ? this : this._set(this.__subFromShiftTo, hi, lo)
      },



      //// REMOVE : a Value satisfying a Condition

      function removeWhere(scanDirective_, condition) {
        const index = this.indexWhere(scanDirective_, condition)
        return (index >= 0) ? this._set(this._removeAtIndex(index)) : this
      },

      function removeEveryWhere(scanDirective_, test) {
        return this._new((result) => {
          const indexes = this.indexesWhere(...Justify(scanDirective_, test))

          if (indexes.size === 0) { return this }

          const mapDir = readSpan[DIR]
          const spans  = indexes.map(mapDir, (index) => [index, index + 1])

          this.__fanAcrossWithinAll([], this._elements, spans)
        })
      },

      function removeEveryWhereNot(scanDirective_, condition) {
        const [directive, test] = Justify(scanDirective_, condition)
        const inverseTest = (value, index) => !test.call(this.$, value, index)
        return this.removeEveryWhere(directive, inverseTest)
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



      //// REMOVE : a Subsequence

      function removeOver(sub, directives_) {
        const span = this.spanOf(sub, directives_)
        return (span) ? this._removeWithin(span) : this
      },

      function removeOverFirst(sub, subDirection = FORWARD) {
        return this.removeOver(sub, {scan: FORWARD, sub: subDirection})
      },

      function removeOverLast(sub, subDirection = FORWARD) {
        return this.removeOver(sub, {scan: BACKWARD, sub: subDirection})
      },

      function removeOverEvery(matchSub, directives_) {
        return fanOverEvery([], matchSub, directives_)
      },



      //

      //// SUPPORT METHODS ////

      //   undefined    + direction     /// Removed as an option now
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
          if (specifier === undefined) {return [0, size, FWD]} // forward
          if (specifier.toFixed) {return [0, size, (specifier < 0) ? BWD : FWD]}
                                                                 // direction
          switch (span.length) {
            case undefined :
              if (typof specifier === "boolean") {              // direction
                return [0, size, (specifier) ? FWD : BWD]
              }
              specifier = specifier.scan                        // dirSpec
              ;continue
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
              // break omitted
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
