Top.Extend(function () {
  this.SetType("LinkedList", function () {

    var _Node = this.$Type.New("Node", function () {
      this.AddIMethod(function _Init(element, next) {
        this.element = element;
        this.next    = next;
      }));
    });

    this.AddAccessors("~Size");

    this.AddIMethod(function _Init() {
      this._head = this._tail = _Node.New();
      this._size = 0;
    });

    this.AddIMethod(function IsEmpty() {
      return (this._size === 0);
    });

    this.AddIMethod(function AddFirst(element) {
      var head = this._head;
      head.next = _Node.New(element, head.next);
      this._size++;
      return this;
    });

    this.AddIMethod(function AddLast(element) {
      this._tail = this._tail.next = _Node.New(element, null);
      this._size++;
      return this;
    });

    this.AddIMethod(function RemoveFirst(absentAction_, presentAction_) {
      var head, first, element;
      head = this._head;
      if (head === this._tail) {
        return absentAction_ ? absentAction_.call(this) : null;
      }
      first = head.next;
      element = first.element;
      head.next = first.next;
      this._size--;
      return presentAction_ ? presentAction_.call(this, element) : element;
    });

    this.AddIMethod(function RemoveLast(absentAction_, presentAction_) {
      var tail, prior, next, element;
      tail = this._tail;
      prior = this._head;
      if (prior === tail) {
        return absentAction_ ? absentAction_.call(this) : null;
      }
      while ((next = prior.next) !== tail) {
        prior = next;
      }
      this._tail = prior;
      element = tail.element;
      this._size--;
      return presentAction_ ? presentAction_.call(this, element) : element;
    });

    this.AddIMethod(function ForEach(action) {
      var current, tail;
      if (action) {
        current = this._head;
        tail = this._tail;
        while ((current = current.next) !== tail) {
          action.call(this, current.element);
        }
      }
      return this;
    });

  });


});
