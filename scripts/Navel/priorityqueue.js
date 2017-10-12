// https://en.wikipedia.org/wiki/Priority_queue
// http://cs.lmu.edu/~ray/notes/pqueues/
// http://www.eecs.wsu.edu/~ananth/CptS223/Lectures/heaps.pdf
// https://www.hackerearth.com/practice/notes/heaps-and-priority-queues/



HandAxe.ensureSub(function Collection(IsArray, IsEqual, _PriorityQueue) {
  "use strict"


  const DEFAULT_MEASURE = function (a, b) {
    return (a === b) ? 0 : (a < b ? -1 : 1)
  }


  _PriorityQueue.addValueMethods([

    function _init(elements_, measure_) {
      const [elements, measure] = IsArray(elements_) ?
        [elements_, measure_] : [[], elements_]
      this._heap   = []
      this.measure = measure || DEFAULT_MEASURE
      return this.addAll(elements)
    },

    function _compareProperties(object, comparator) {
      if (comparator.meetsRigorOf(IsEqual)) {
        if (this.measure !== object.measure) { return false }
      }
      return comparator.compareIndexed_(object.elements, object)
    },


    function isEmpty() {
      return !this._heap.length
    },

    function size() {
      return this._heap.length
    },

    function first() {
      return this._heap[0]
    },

    function removeFirst() {
      const element = this.first
      this.deleteFirst
      return element
    },

    function removeAll() {
      const elements = []
      var   count    = this.size

      while (count--) { elements.push(this.removeFirst) }
      return elements
    },

    function includes(element) {
      return this._heap.includes(element)
    },

    function toString() {
      return `PQ[${this.elements}]`
    },
  ])

  _PriorityQueue.addRetroactiveValue(function elements() {
    return this.asMutableCopy.removeAll
  })

  _PriorityQueue.addSelfMethods([

    function add(element) {
      var index, parentIndex, parentElement
      const heap    = this._heap
      const measure = this.measure

      delete this.elements

      index = heap.length
      heap.push(element)
      // The need for the following check didn't show until testing for
      // a custom measure. Interesting!!!
      while (index) {
        parentIndex = Math.floor((index - 1) / 2)
        parentElement = heap[parentIndex]

        if (measure(element, parentElement) >= 0) { break }

        heap[index]       = parentElement
        heap[parentIndex] = element
        index             = parentIndex
      }
    },

    function addAll(elements) {
      elements.forEach(element => this.add(element))
    },

    function deleteFirst() {
      var count, parent, left, right, child
      var parentIndex, leftIndex, rightIndex, childIndex
      const heap    = this._heap
      const measure = this.measure

      delete this.elements

      parent = heap.pop()
      if ((count = heap.length)) {
        childIndex = parentIndex = 0

        do {
          heap[parentIndex] = child
          heap[childIndex]  = parent
          parentIndex       = childIndex
          leftIndex         = parentIndex * 2 + 1
          rightIndex        = leftIndex + 1

          if (leftIndex >= count) { break }
          left = heap[leftIndex]

          if (rightIndex >= count) {
            [childIndex, child] = [leftIndex, left]
          }
          else {
            right = heap[rightIndex]
            if (measure(left, right) < 0) {
              [childIndex, child] = [leftIndex, left]
            }
            [childIndex, child] = [rightIndex, right]
          }

        } while (measure(child, parent) < 0)
      }
    },

    function deleteAll() {
      this._heap = []
      delete this.elements
    },
  ])


})

/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/
