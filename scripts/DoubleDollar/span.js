

DD.newType(Span => {
  Span.addSMethods([
    function __init(elements_) {
      this._elements = []
      elements_ && this.addAll(elements_)
    },
