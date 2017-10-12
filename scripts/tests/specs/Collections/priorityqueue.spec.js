// describe("PriorityQueue", function () {
//
//   beforeEach(function () {
//     this.maurice     = "maurice".split("")
//     this.phrase      = "maurice codes".split("")
//     this.uncle_momo  = "uncle momo".split("")
//     this.queue       = new PriorityQueue()
//     this.stuffed     = new PriorityQueue("stuffed".split(""))
//     this.backward    = new PriorityQueue([7,6,5,4,3,2,1])
//   })
//
//   describe("on instantiation", function () {
//     describe("when instantiated with no args", function () {
//       it("has empty elements", function () {
//         expect( this.queue.elements ).toEqual( [] )
//       })
//
//       it("has the default comparator", function () {
//         expect( this.queue.comparator ).toBe( DEFAULT_COMPARATOR )
//       })
//     })
//
//     describe("when instantiated with elements", function () {
//       it("contains the elements in heap priority", function () {
//         const queue = new PriorityQueue(this.maurice)
//         expect( queue.elements ).toEqual( ['a','i','c','r','m','u','e'] )
//       })
//     })
//
//     describe("when instantiated with a comparator", function () {
//       it("uses the comparator to add and remove the elements", function () {
//         const numericRanking = (a, b) => a.value - b.value
//         const queue = new PriorityQueue(numericRanking)
//         queue.addAll(Coin.allInAlphabeticOrder)
//         const result = queue.removeAll()
//         const kinds = result.map(coin => coin.kind).join(" ")
//         expect( kinds ).toBe( "penny nickel dime quarter half dollar" )
//       })
//     })
//
//   })
//
//   describe("#add", function () {
//     it("answers itself", function () {
//       expect( this.queue.add(1) ).toBe( this.queue )
//     })
//
//     it("adds an element, mantaining heap priority", function () {
//       let queue = new PriorityQueue()
//       queue.add(7)                  //   0
//       expect( queue.elements ).toEqual( [7] )
//
//       queue.add(6)                  //   0  1
//                                     //  [7, 6]
//       expect( queue.elements ).toEqual( [6, 7] )
//
//       queue.add(5)                  //   0  1  2
//                                     //  [6, 7, 5]
//       expect( queue.elements ).toEqual( [5, 7, 6] )
//
//       queue.add(4)                  //   0  1  2  3
//                                     //  [5, 7, 6, 4]
//                                     //  [5, 4, 6, 7]
//       expect( queue.elements ).toEqual( [4, 5, 6, 7] )
//
//       queue.add(3)                  //   0  1  2  3  4
//                                     //  [4, 5, 6, 7, 3]
//                                     //  [4, 3, 6, 7, 5]
//       expect( queue.elements ).toEqual( [3, 4, 6, 7, 5]  )
//
//       queue.add(2)                  //   0  1  2  3  4  5
//                                     //  [3, 4, 6, 7, 5, 2]
//                                     //  [3, 4, 2, 7, 5, 6]
//       expect( queue.elements ).toEqual( [2, 4, 3, 7, 5, 6] )
//
//       queue.add(1)                  //   0  1  2  3  4  5  6
//                                     //  [2, 4, 3, 7, 5, 6, 1]
//                                     //  [2, 4, 1, 7, 5, 6, 3]
//       expect( queue.elements ).toEqual( [1, 4, 2, 7, 5, 6, 3] )
//     })
//   })
//
//   describe("#removeFirst", function () {
//     it("removes and answers its first element", function () {
//       let queue = new PriorityQueue(this.maurice)
//       expect( queue.removeFirst() ).toBe( 'a' )
//     })
//
//     it("mantaining the remaining elements in heap priority", function () {
//       let queue = new PriorityQueue(this.maurice)
//       queue.removeFirst()           //    0    1    2    3    4    5    6
//                                     //  ['a', 'i', 'c', 'r', 'm', 'u', 'e']
//                                     //  ['e', 'i', 'c', 'r', 'm', 'u']
//       expect( queue.elements ).toEqual( ['c', 'i', 'e', 'r', 'm', 'u'] )
//
//       queue.removeFirst()           //    0    1    2    3    4    5
//                                     //  ['c', 'i', 'e', 'r', 'm', 'u']
//                                     //  ['u', 'i', 'e', 'r', 'm']
//       expect( queue.elements ).toEqual( ['e', 'i', 'u', 'r', 'm'] )
//
//       queue.removeFirst()           //    0    1    2    3    4
//                                     //  ['e', 'i', 'u', 'r', 'm']
//                                     //  ['m', 'i', 'u', 'r']
//       expect( queue.elements ).toEqual( ['i', 'm', 'u', 'r'] )
//
//       queue.removeFirst()           //    0    1    2    3
//                                     //  ['i', 'm', 'u', 'r']
//                                     //  ['r', 'm', 'u']
//       expect( queue.elements ).toEqual( ['m', 'r', 'u'] )
//
//       queue.removeFirst()           //    0    1    2
//                                     //  ['m', 'r', 'u']
//                                     //  ['u', 'r']
//       expect( queue.elements ).toEqual( ['r', 'u'] )
//
//       queue.removeFirst()           //    0    1
//                                     //  ['u', 'r']
//       expect( queue.elements ).toEqual( ['u'] )
//
//       queue.removeFirst()           //    0
//                                     //  ['u']
//       expect( queue.elements ).toEqual( [] )
//     })
//
//     it("answers undefined when it's empty", function () {
//       expect( this.queue.removeFirst() ).toBe ( undefined )
//     })
//   })
//
//   describe("#addAll", function () {
//     it("answers itself", function () {
//       expect( this.queue.addAll(this.maurice) ).toBe( this.queue )
//     })
//
//     it("adds an array of elements, mantaining heap priority", function () {
//       this.queue.addAll(this.maurice)
//       expect( this.queue.elements ).toEqual( ['a','i','c','r','m','u','e'] )
//     })
//   })
//
//   describe("#removeAll", function () {
//     it("answers an array of all of its elements in priority order", function () {
//       const result = this.queue.addAll(this.maurice).removeAll()
//       expect( result.join("") ).toBe( "aceimru" )
//     })
//
//     it("answer an empty array when it's empty", function () {
//       expect( this.queue.removeAll() ).toEqual( [] )
//     })
//   })
//
//   describe("#first", function () {
//     it("answers the first element", function () {
//       this.queue.addAll(this.maurice)
//       expect( this.queue.first(1) ).toBe( "a" )
//     })
//   })
//
//   describe("#isEmpty", function () {
//     it("answers true when empty", function () {
//       expect( this.queue.isEmpty() ).toBe( true )
//     })
//
//     it("answers false when it contains elements", function () {
//       expect( this.stuffed.isEmpty() ).toBe( false )
//     })
//   })
//
//   describe("#size", function () {
//     it("answers its size", function () {
//       expect( this.stuffed.size() ).toBe( 7 )
//     })
//   })
//
//   describe("#includes", function () {
//     it("answers true if the element is included", function () {
//       expect( this.stuffed.includes("u") ).toBe( true )
//     })
//
//     it("answers false if the element is not included", function () {
//       expect( this.stuffed.includes("x") ).toBe( false )
//     })
//
//     it("answers false if it's empty", function () {
//       expect( this.queue.includes("x") ).toBe( false )
//     })
//   })
//
//   describe("#toString", function () {
//     it("answers itself as a string", function () {
//       this.queue.addAll(this.maurice)
//       expect( `${this.queue}` ).toEqual( "PQ[a,c,e,i,m,r,u]" )
//     })
//   })
//
// })
