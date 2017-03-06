


function removeAll() {
  this._$captureChanges = true|null
  this._elements = []
  return this
},

function removeAll() {
  this._captureOverwrite = true
  this._captureOverwrite._elements = []
  return this
},


function removeAll() {
  this._captureOverwrite._elements = []
  return this
},

function removeAll() {
  return this._nonCopy((result) => {
    result._elements = []
  }
},
