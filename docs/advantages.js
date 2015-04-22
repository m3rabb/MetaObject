
function Person(name, ssn) {
  this.name = name;
  this.ssn = ssn;
}

function Student(name, ssn, cohort) {
  this.name = name;
  this.ssn = ssn;
  this.cohort = cohort;
}

Student.prototype = new Person();



function Person(name, ssn) {
  this.name = name;
  this.ssn = ssn;
}

function Student(name, ssn, githubId) {
  Person.call(this, name, ssn);
  this.id = githubId;
}

Student.prototype = Object.create(Person.prototype);

s1 = new Student("Maurice", "m3rabb");




Person_root = Object.create(Object.prototype);

Person_root.init = function (name, ssn) {
  this.name = name;
  this.ssn = ssn;
  return this;
};

function NewPerson(name, ssn) {
  var instance = Object.create(Person_root);
  return instance.init(name, ssn);
}

Student_root = Object.create(Person_root);

Student_root.init = function (name, ssn, id) {
  Person_root.init.call(this, name, ssn);
  this.id = id;
  return this;
};

function NewStudent(name, ssn, githubId) {
  var instance = Object.create(Student_root);
  return instance.init(name, ssn, githubId);
}



Student_root.init = function (name, ssn, id) {
  var root = Object.getPrototypeOf(this);
  var parentRoot = Object.getPrototypeOf(root);
  parentRoot.init.call(this, name, ssn);
  this.id = id;
  return this;
};

Person = Type.New("Person", function () {
  this.addIMethod(function init() {
    this.name = name;
    this.ssn = ssn;
  });
});

Person.NewSubtype("Student", function () {
  this.addIMethod(function init() {
    this._super.init(name, ssn);
    this.id = id;
  });
});
