__init(elements_)
__withinFill(lo, hi, fillDirection, source, takeDirection)
__echoWithin(value, lo, hi)
__echoFillWithin(source, lo, hi, fillDirection, takeDirection)
__subFromShiftTo(sourceEdge, targetEdge)

_withinSetBy(
_normalize(span_startEdge, endEdge_)
_normalizeArgs(...args)

_byOverFind(grip, ...args)
_byOverFindAll(Grip, ...args)

_contractedSpanTo(span, fillSize)
_expandFromBy(edge, anchorLocation, fillSize)


toString()

* copy(span_)
  asNew
  asCopy
  asNonCopy


Accessing
  Generic
    size
    isEmpty
    elements
    keys
    span
    inverseSpan
    slots

    values @ index|span
      at(index_span, absent_)
      atEach(indexers)

  Index|Span
    value|sub @ index|span
      atIndex(index, absent_)
      first
      last

      within(lo, hi = lo, direction, wrap)
      over(lo, hi = lo)

      subPast(edge)
      subUntil(edge)
      initial(count = 1)
      final(count = 1, viaLaterValues = false)

    index|span @ value(s)
      indexOf(value, searchDirection_)
      indexOfFirst(value)
      indexOfLast(value)
      indexesOfEvery(value, searchDirection_)

      spanOf(sub, searchDirection_)
      spanOfFirst(sub)
      spanOfLast(sub)
*      spansOfEvery(sub, searchDirection_)
      spansAcrossEvery(sub, searchDirection_)
    other
      countOf(value)
      contains(value)

    via condition
      indexWhere(span_, condition, absent_)
      indexesWhere(span_, condition)
      countWhere(span_, conditional)

      valueWhere(span_, condition, absent_)
      everyWhere(span_, conditional)
      everyNotWhere(span_, conditional)



  Enumeration
    withinDo(normSpan, action)
    withinMap(normSpan, Action)
    withinSubsDo(normSpan, subSize, action)
    withinSubsMap(normSpan, subSize, action)

    eachDo(span_, action)
    map(span_, action)
    eachSend(span_, method_selector, ...args)
    mapSend(span_, method_selector, ...args)
    reduce(span_, action, seed_)

    do      : "eachDo",
    overDo  : "eachDo",
    collect : "map",
    detect  : "firstWhere",
    find    : "firstWhere",
    select  : "everyWhere",
    reject  : "everyNotWhere"
    inject  : "reduce",
    where   : "valueWhere"

Put
  Generic
    atPut(index_span, value)
*   atFan()
    atEachPut(indexers, value)
    atEachPutEach(indexers, values)

  index|span PUT value(s)
    atIndexPut(index, value)
    overPut(edge_span, value)
    overFan(edge_span, values)

    overEcho(span, value)
    overFill(span, values, takeDirection_)
    overEchoFill(span, values, takeDirection_)
    pastLay(edge, values, takeDirection_)
    untilLay(edge, values, takeDirection_)

  value PUT value
   atFirstPut(matchElement, newElement)
   atLastPut(matchElement, newElement)
   atEveryPut(matchElement, newElement)

   overSubFan(matchSub, newSub, searchDirection_, takeDirection_)
   overFirstFan(matchSub, newSub, takeDirection_)
   overLastFan(matchSub, newSub, takeDirection_)
*   overEveryFan(matchSub, newSub, searchDirection_, takeDirection_)

*   reverse
*   reverseCopy

Add
  addFirst(value)
  addLast(value)
  addFirstAll(values)
  addLastAll(values)
  addBefore(value, targetValue)
  addAfter(value, targetValue)
  addAllBefore(values, targetValue)
  addAllAfter(values, targetValue)

  add    : "addLast",
  addAll : "addAllLast",



Remove
  removeAtIndex(index)
  removeWithin(lo, hi = lo)
  removeOver(span)

  removePast(edge)
  removeUntil(edge)
  removeInitial(count = 1)
  removeFinal(count = 1)

  remove(value, searchDirection_)
  removeFirst(value_)
  removeLast(value_)
*  removeEvery(value)

  removeSub(sub, searchDirection_)
  removeFirstSub(sub)
  removeLastSub(sub)
  removeEverySub(sub, searchDirection_)
