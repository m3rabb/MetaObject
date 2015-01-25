
var obj = {};
var results;

function xyz(abc) {
  try {
    obj.strange(abc);
  } catch (e) {
    results = e;
  }
}
