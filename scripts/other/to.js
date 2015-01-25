HumanPrototype = {
  dnaBased: "Is DNA-Based"
}

// Create a user

function User(first, last) {
 this.first = first;
 this.last = last;
}


User.prototype = Object.create(HumanPrototype);
User.prototype.full = function() {
  return [this.first, this.last].join(' ');
}


function AdminUser(first, last) {
 this.first = first.toUpperCase();
 this.last = last.toUpperCase();
}

AdminUser.prototype = Object.create(User.prototype);
AdminUser.prototype.full = function() {
  return ["The Super Admin:", this.first, this.last].join(' ');
}

var u = new User("srinivas", "rao"),
  bofh = new AdminUser("super", "rao")

console.log(u.full() + " " + u.dnaBased);
console.log(bofh.full() + " " + bofh.dnaBased);
