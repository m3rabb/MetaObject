
var secret = Symbol("SECRET")
var t1 = HandAxe.Thing.new_({name: "momo", _age: 50, [secret]: "funny" })
t1.addOwnMethod(function bark() { return "Woof!" })
t1.beImmutable

var selectors = t1.ownNameSelectors


/*       1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// https://www.youtube.com/watch?v=k-oVuQpjG3s
// https://www.rspb.org.uk/birds-and-wildlife/bird-and-wildlife-guides/bird-a-z/c/cuckoo/
// http://www.bbc.com/earth/story/20150410-devious-ways-birds-fight-egg-wars
// http://ichef.bbci.co.uk/wwfeatures/wm/live/1280_720/images/live/p0/2n/py/p02npyxp.jpg
// https://en.wikipedia.org/wiki/Brood_parasite


;(function () {
  "use strict"

  class Animal {
    constructor (name, age) {
      this.name = name
      this.age  = age
    }
  }

  class Possum extends Animal {
    constructor (name, age, teeth) {
      super(name, age)
      this.teeth  = teeth
    }
  }

  // Animal.prototype = null

  var possum = new Possum("Buffy", 3, 100)
})()


this.addEventListener("DOMContentLoaded", function(event) {
  const iframe = document.createElement("iframe")
  iframe.hidden = true
  document.body.appendChild(iframe)
  const hasOwnPropertyhandler = iframe.contentWindow.Object.hasOwnProperty

  const iframe2 = new HTMLIFrameElement()
})


var el = document.createElement('div');
var domString = '<div class="container"><span class="intro">Hello</span> <span id="name"> World!</span></div>';
el.innerHTML =  domString;
document.body.appendChild(el.firstChild);

// http://garystorey.com/2017/02/27/three-ways-to-create-dom-elements-without-jquery/
// https://stackoverflow.com/questions/9614932/best-way-to-create-large-static-dom-elements-in-javascript

// https://javascript.info/onload-ondomcontentloaded
