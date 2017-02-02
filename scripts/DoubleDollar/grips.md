


mode
match
  primary
    grip
    the/some/every/all
    eqm
  secondary
    grip
    the/some/every/all
    eqm
put
  one/many

putValue AtTheKey

putValue OverTheValue matchUsing AtTheKey matchUsing



set
at/fill/

put   replace as a unit
fan   spread elements across span/index
echo  repeatedly replace at each slot in the span
fill  another kind of repeating? perhaps fanning over repeatedly

spread/splay/lay/fill/replace
putAll --> fill/fan/lay
atAll  --> echo

insertAt(index) === putAt(index)
insertFrom(edge)
putFrom
fanFrom


fan??
the/some/every

from/to <edge>
before/after <value>
ante/post
aheadOf/behind
leading/trailing

all/slots

matching
suchThat
satisfying
pleasing
suiting
meeting
sating
apt
where


allSuchThat

  Replacing/Over
  One/Some/Any/Value/The
  All/Each/
  First/Last/Some/Every

  at/atKey/atIndex/atValue/atElement
  over/within
  from/to
  across

  within --> place
  over   --> elements/values

  span|realm|bounds|region|area|place|site|spot|position|location

  scan|match|fill  take|place

  directions
    FWD     1
    BWD    -1
    NON     0
    STRETCH null

  all - as a group  e.g. removeAll
        or getter #allFrom
  every - all values
  each - each for looping

  atEach --> over

  putOver
  fanOver
  putEachOver

  span              within            over
   6                edge
  [6]               edge
  [6,6]             null              6 --> |0 --> 6
  [6,9]             6 --> 9
  [6,]              6 --> |
  [,9]              0 --> 9
  [7,6]             null              7 --> |0 --> 6
  [6,9,true]        6 --> 9
  [9,6,true]        9 --> |0 --> 6
  [6,6,true]        6 --> |0 --> 6
  [6,true]          6 --> |0 --> 6
  [6,6,-1]          null
  [6,9,-1]          null
  [9,6,-1]          6 <-- 9
  [6,9,-1,true]     9 <-- |0 <-- 6
  [6,6,-1,true]     6 <-- |0 <-- 6
  [-2,-1]           null
  [-2,6]            0 --> 6
  [6,-2]            null
  [-3,-1,-1]        null
  [-3,6,-1]         0 --> 6
  [6,-2,-1]         null
  [-2,-1,true]      null
  [-2,6,true]       0 --> 6
  [6,-2,true]       null
  [-2,-1,-1,true]   null
  [-2,6,-1,true]    0 --> 6
  [6,-2,-1,true]    null

[     fan      ]
|>    lay  -->
|>    fill     |

- anchor edge for placements
- anchor wrapping ground

6               edge      [6,6]       |
[6]             span      [6,SIZE]    |-->
[6,]            span      [6,SIZE]    |-->
[6,,]           span      [6,SIZE]    |-->
[6,null]        span      [6,SIZE]    |-->
[6,undefined]   span      [6,SIZE]    |-->

LINEAR vs RELATIVE
SOLID vs SPLIT
CONTINUOUS

      SPAN_START
      SPAN_END
      SPAN_DIRECTION
      SPAN_WRAPS

      LEADING_ANCHOR
      TRAILING_ANCHOR
      FRONT_ANCHOR|REAR_ANCHOR
      LO_ANCHOR|HI_ANCHOR


within
  linear indexing
  direction implicitly forward
over
  wraparound indexing
  direction is calculated


mode      sizing
fan       source  PutAllWithin    FillWithin  stretch
echo      span    EchoWithin                  exact
fill      span    FillWithin      FillWithin  underflow
lay       span    PutAllWithin    FillWithin  overflow
echoFill  span    EchoFillWithin              exact


until/prior
past/beyond/behind


_set
_new
_copy
_nonCopy


past|until
earlier|later     --> viaLaterValues
biasLaterValues
__putAllBiasHea__

List
  access
    generic
      at(index|span, absentAction_)
      atEach(span|indexes)

    index
      atIndex(index, absentValue_)
      over(relativeSpan)
      within(linearSpan)

      first
      last

      subPast(edge, viaLaterValues_)
      subUntil(edge, viaLaterValues_)
      initial(count)
      final(count)

    element
      elements
      indexOf(value, absentAction_)
      indexOfFirst(value, absentAction_)
      indexOfLast(value, absentAction_)
      indexesOfEvery(value)

      spanOf(sub)
      spanOfFirst(sub)
      spanOfLast(sub)
      spansOfEvery(sub)

      countOf(value)

      valueWhere
      firstWhere|detect|find(conditional, absentAction_)
      everyWhere|select(conditional)

      eachDo|
      overDo
      withinDo(span_edge, func_edge, func_, improperAction_)
      withinMap|collect(span_edge, func_edge, func_, improperAction_)
      reduce,inject,

  put
    generic
      putAt(value, indexer)                    // 1 to 1
      putAtEach(value, indexers)               // 1 to N discretes
      putEachAtEach(values, indexers)          // N ( discrete 1 to 1 )

    index
      putAtIndex(index)                        // 1 to 1 slot
      putWithin(value, edge|baseSpan, edge_)  // 1 to 1 span (reduced 1-sized)
      putOver(value, edge|span)                // 1 to 1 span (reduced 1-sized)

      fanWithin(values, edge|baseSpan, edge_)// 1 span to 1 span (value-sized)
      fanOver(values, edge|span)               // 1 span to 1 span (value-sized)

      echoWithin(value, baseSpan, edge_)       // 1 to many slots (key-sized)
      echoOver(value, span)                    // 1 to many slots (key-sized)

      fillOver(values, span, fromLaterValues_)  // 1 span to 1 span (key-sized)
      fillWithin(values, echo_, span)           // 1 span to 1 span (key-sized)

      echoFillWithin(values, echo_, span)        // 1 span to 1 span (key-sized)
      echoFillOver(values, echo_, span)          // 1 span to 1 span (key-sized)

      layPast(values, edge, fromLaterValues_)  // 1 span to 1 span (variable)
      layUntil(values, edge, fromLaterValues_) // 1 span to 1 span (variable)

  add
    generic
      add(element)
      addAll(element)
    index
      addFirst(element)
      addLast(element)
      addAllFirst(elements)
      addAllLast(elements)
    element
      addBefore(element, targetElement)
      addAfter(element, targetElement)
      addAllBefore(elements, targetElement)
      addAllAfter(elements, targetElement)

    value
      putAtFirst(newElement, existingElement, absentAction_)
      putAtLast(newElement, existingElement, absentAction_)
      putAtEvery(newElement, existingElement, absentAction_)

      fanOverFirst(newElements, existingElements, absentAction_)
      fanOverLast(newElements, existingElements, absentAction_)
      fanOverEvery(newElements, existingElements, absentAction_)

remove
  generic
    empty
    removeAll
    removeAt
    removeAtEach(span|indexes)

  index
    removeAtIndex(index, (index, absentValue_))
    removeOver(relativeSpan)
    removeWithin(edge|absoluteSpan, edge_, improperAction_)

    removePast(edge)
    removeUntil(edge)
    removeInitial(count)
    removeFinal(count)

  value
    remove(element, absentAction_)
    removeFirst(value_, absentAction__)
    removeLast(value_, absentAction__)
    removeEvery(value)

    removeSub(values, absentAction_)
    removeFirstSub(values, absentAction_)
    removeLastSub(values, absentAction_)
    removeEverySub(values)

    removeFirstWhere(conditional, absentAction_)
    removeLastWhere(conditional, absentAction_)
    removeEveryWhere|reject(conditional)



OrderedDict
  add
    generic
      add(assoc)
      addAll(associations)
    index
      addFirst(assoc)
      addLast(assoc)
      addAllFirst(associations)
      addAllLast(associations)
    element
      addBefore(assoc, targetAssoc)
      addAfter(assoc, targetAssoc)
      addAllBefore(associations, targetAssoc)
      addAllAfter(associations, targetAssoc)

  put
    generic
      putAt(index|value, indexer|key)              // 1 to 1
      putAtEach(value, indexer|keys)               // 1 to N discretes
      putEachAtEach(values, indexer|keys)          // N ( discrete 1 to 1 )

    index
      putAtIndex(value, index)                     // 1 to 1 slot
      putWithin(value, edge|span, edge_)
      putOver(value, edge|span)

      echoWithin(value, edge|span, edge_)      // 1 to many slots (key-sized)
      echoOver(value, span)                    // 1 to many slots (key-sized)
      echoFrom(value, span)                    // 1 to many slots (key-sized)
      echoTo(value, span)                      // 1 to many slots (key-sized)

      fillFrom(values, edge|span, echo_)       // 1 span to 1 span (key-sized)
      fillTo(values, edge|span, echo_)         // 1 span to 1 span (key-sized)

    key
      putAtkey(value, key)

    value
      putAtFirst(newElement, existingElement)
      putAtLast(newElement, existingElement)
      putAtEvery(newElement, existingElement)

      fanOverFirst(newElements, existingElements)
      fanOverLast(newElements, existingElements)
      fanOverEvery(newElements, existingElements)

  remove
    generic
      empty
      removeAll
      removeAt(index|key, absentAction_)
      removeAtEach(span|collection)

    index
      removeAtIndex(index, absentAction_)
      removeOver(relativeSpan)
      removeWithin(edge|absoluteSpan, edge_, improperAction_)

      removeSubTo(edge)
      removeSubFrom(edge)
      removeInitial(count)
      removeFinal(count)

    key
      removeAtKey(key, absentAction_)

    value
      remove(element, absentAction_)
      removeFirst(value_, absentAction__)
      removeLast(value_, absentAction__)
      removeEvery(element)

      removeSub(elements, absentAction_)
      removeFirstSub(elements, absentAction_)
      removeLastSub(elements, absentAction_)
      removeEverySub(elements)

      removeFirstWhere(conditional, absentAction_)
      removeEveryWhere|reject(conditional)

    value
      removeElement(assoc)

  access
    generic
      at(indexer|key, absentAction_)
      atEach(indexers|keys)

    index
      atIndex(index, absentValue_)
      over(relativeSpan)
      within(edge|absoluteSpan, edge_, improperAction_)

      first
      last

      subTo(edge)
      subFrom(edge)
      initial(count)
      final(count)

    key
      atKey
      indexAtKey

    element
      elements

    value
      indexAt(value, absentAction_)
      indexAtFirst(value, absentAction_)
      indexAtLast(value, absentAction_)
      indexAtEvery(element)
      spanOver(elements)


      firstWhere|detect|find(conditional, absentAction_)
      everyWhere|select(conditional)

      withinEach(span_edge, func_edge, func_, improperAction_)
      withinMap|collect(span_edge, func_edge, func_, improperAction_)


      reduce,inject,


OrderedDict


remove
  index
  element
  key
  value
  slot

access
  index
  element
  key
  value


at/over/within/from/to
first/last/some/every/only



putFrom
putUpTo





  overDo
  overMap

  removeAllSuchThat
  allSuchThat

Not sure if these ones are necessary or good!!!
  *     spanWhere(span_, condition, absent_)
  *     spansWhere(span_, condition)
  *     countSubsWhere(span_, condition)

  *     subWhere(span_, condition, absent_)
  *     everySubWhere(span_, condition)



  spread/splay/lay/fill/replace
  putAll --> fan/fill
  atAll  --> echo

  lay
  replace


  at/atKey/atIndex/atValue/atElement
  over/within
  from/to

  fan/echo


EnterXD elements=2XD Enter:1 EnterXD Delete:4 poopie prototype yucky lalaloopsie {Should}```2222 exit bofle AtPutMethod auto message grren poopie jelly bean yummy gorossey gross hello be bye



```
