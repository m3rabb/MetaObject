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

    value @ index|span
      atIndex(index, absent_)
      first
      last

    index|span @ value(s)
      indexOf(value, scanDir_)
      indexOfFirst(value)
      indexOfLast(value)
      indexOfEvery(value, scanDir_)

      countOf(value)
      contains(value)

      indexWhere(span_, condition, absent_)
      indexesWhere(span_, condition)
      countWhere(span_, conditional)

      valueWhere(span_, condition, absent_)
      everyWhere(span_, conditional)
      everyNotWhere(span_, conditional)

  Enumeration
    withinDo(normSpan, action)
    withinMap(normSpan, Action)

    eachDo(span_, action)
    map(span_, action)
    eachSend(span_, method_selector, ...args)
    mapSend(span_, method_selector, ...args)
    reduce(span_, action, seed_)

    do      : "eachDo",
    overDo  : "eachDo",
    collect : "map",
    detect  : "valueWhere",
    find    : "valueWhere",
    select  : "everyWhere",
    reject  : "everyNotWhere"
    inject  : "reduce",
    where   : "valueWhere"

Put
  Generic
    atPut(index_span, value)
    atFan()
    atEachPut(indexers, value)
    atEachPutEach(indexers, values)

  index|span PUT value(s)
    atIndexPut(index, value)
    withinPut(edge_span, value)

    withinEcho(span, value)

  value PUT value
   atFirstPut(matchElement, newElement)
   atLastPut(matchElement, newElement)
   atEveryPut(matchElement, newElement)



Add
  addFirst(value)
  addLast(value)
  addBefore(value, targetValue)
  addAfter(value, targetValue)

  add    : "addLast",

  plural
    within(lo, hi = lo, direction, wrap)
    beyond(edge, scanDir_)
    until(edge, scanDir_)
    initial(count = 1, scanDir_)
    final(count = 1, scanDir_)

    _overDo(directives, subSize, action)           scan|sub|overlaps|subsAsLists

    overDo(directives_, subSize, action)           scan|sub|overlaps
    overMap(directives_, subSize, action)          scan|sub|overlaps

    spanOf(matchSub, directives_)                  scan|match
    spanOfFirst(matchSub)
    spanOfLast(matchSub)

    spanOfEvery(matchSub, directives_)             scan|sub|overlaps
    countOver(matchSub, directives_)               scan|sub|overlaps

    withinFan(span, values, fillDir_)              fill
    withinFill(span, values, fillDir_)             fill
    withinEchoFill(span, values, fillDir_)         fill
    beyondLay(edge, sub, fillDir_)                 fill
    untilLay(edgs, sub, fillDir_)                  fill

    overFan(sub, values, directives_)              scan|sub|fill
    overFirstFan(sub, values)
    overLastFan(sub, values)
    overEveryFan(sub, values, directives_)         scan|sub|fill

    addAll(values, directive_)                     fill
    addFirstAll(values, directive_)                fill
    addLastAll(values, directive_)                 fill

    addAllBefore(values, targetValue, directive_)  scan|sub|fill
    addAllAfter(values, targetValue, directive_)   scan|sub|fill

    addAll : "addAllLast",

    List("but but but not wow").overFirstFan(
      List("but", List("near"), BACKWARD



Remove
    removeAt(index_span)
    removeAtEach(indexers)

    removeAtIndex(index)
    removeWithin(lo, hi = lo)
    removeFirst
    removeLast

    removeBeyond(edge)
    removeUntil(edge)
    removeInitial(count = 1)
    removeFinal(count = 1)

    removeWhere(span_, condition, absent_)
    removeEveryWhere(span_, conditional)

    remove(value, scanDir_)
    removeFirst(value_)
    removeLast(value_)
    removeEvery(value)

    removeOver(span, directive_)    scan|sub
    removeOverFirst(span, directive_)    scan|sub
    removeOverLast(span, directive_)    scan|sub
    removeOverEvery(span, directive_)    scan|sub

    empty
    removeAll


    reversed
    reverse()
