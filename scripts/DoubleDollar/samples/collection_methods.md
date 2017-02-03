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

Conversion
  toString()
  asString

Accessing
  General
    size
    slots
    elements
    values
    keys
    indexes
    span
    inverseSpan
    reversed
    isEmpty

  Generic
    at(index_span, absent_)
    atEach(indexers)
    reverse()

  By Index
    atIndex(index, absent_)
    first
    last

  By Span
    within(lo, hi = lo, direction, wrap)
    beyond(edge, scanDir_)
    until(edge, scanDir_)
    initial(count = 1, scanDir_)
    final(count = 1, scanDir_)

  By Value
    Answer Index
      indexOf(value, scanDir_)
      indexOfFirst(value)
      indexOfLast(value)
      indexOfEvery(value, scanDir_)

    Answer Count
      countOf(value)
      countOfWhere(span_, conditional)
      contains(value)

  By Value Condition
    Answer Index
      indexOfWhere(span_, condition, absent_)
      indexesOfWhere(span_, condition)

    Answer Value
      valueWhere(span_, condition, absent_)
      everyWhere(span_, conditional)
      everyWhereNot(span_, conditional)

    where   : "valueWhere"
    detect  : "valueWhere",
    find    : "valueWhere",
    select  : "everyWhere",
    reject  : "everyWhereNot"

  By Sub
    Answer Span
      spanOf(matchSub, directives_)                  scan|match
      spanOfFirst(matchSub)
      spanOfLast(matchSub)
      spanOfEvery(matchSub, directives_)             scan|sub|overlaps

    Answer Count
      countOfSeq(matchSub, directives_)               scan|sub|overlaps
      containsSeq(sub)


Enumeration
  By Value
    withinDo(normSpan, action)
    withinMap(normSpan, Action)

    eachDo(span_, action)
    map(span_, action)
    eachSend(span_, method_selector, ...args)
    mapSend(span_, method_selector, ...args)

    reduce(span_, action, seed_)

    do      : "eachDo",
    collect : "map",
    inject  : "reduce",

  By Sub
    _ Do(directives, subSize, action)           scan|sub|overlaps|subsAsLists

    overDo(directives_, subSize, action)           scan|sub|overlaps
    overMap(directives_, subSize, action)          scan|sub|overlaps

Put
  Generic
    atPut(index_span, value)
    atEachPut(indexers, value)
    atEachPutEach(indexers, values)
    atFan()

  By Index
    atIndexPut(index, value)

  By Span
    withinPut(edge_span, value)
    withinEcho(span, value)

    withinFan(span, values, fillDir_)              fill
    withinFill(span, values, fillDir_)             fill
    withinEchoFill(span, values, fillDir_)         fill

    beyondLay(edge, sub, fillDir_)                 fill
    untilLay(edgs, sub, fillDir_)                  fill

  By Value
   atValuePut
   atFirstPut(matchElement, newElement)
   atLastPut(matchElement, newElement)
   atEveryPut(matchElement, newElement)

  By Sub
    overFan(sub, values, directives_)              scan|sub|fill
    overFirstFan(sub, values)
    overLastFan(sub, values)
    overEveryFan(sub, values, directives_)         scan|sub|fill

Add
  Generic
    add    : "addLast",
    addAll : "addAllLast",                   fill

  By Value
    addFirst(value)
    addLast(value)
    addBefore(value, targetValue)
    addAfter(value, targetValue)

  By Sub
    addFirstAll(values, directive_)                fill
    addLastAll(values, directive_)                 fill
    addAllBefore(values, targetValue, directive_)  scan|sub|fill
    addAllAfter(values, targetValue, directive_)   scan|sub|fill

Remove
  Generic
    removeAt(index_span)
    removeAtEach(indexers)
    removeEach(values)
    removeAll()
    empty

  By Index
    removeAtIndex(index)

  By Span
    removeWithin(lo, hi = lo)
    removeBeyond(edge)
    removeUntil(edge)
    removeInitial(count = 1)
    removeFinal(count = 1)

  By Value
    remove(value, scanDir_)
    removeFirst(value_)
    removeLast(value_)
    removeEvery(value)

    removeWhere(span_, condition, absent_)
    removeEveryWhere(span_, conditional)
    removeEveryWhereNot(span_, conditional)

  By Span
    removeOver(span, directive_)    scan|sub
    removeOverFirst(span, directive_)    scan|sub
    removeOverLast(span, directive_)    scan|sub
    removeOverEvery(span, directive_)    scan|sub
