DD.newType(Span => {
  ListMutation.addSMethods([
    function __init(elements_) {
      this._elements = []
      elements_ && this.addAll(elements_)
    },
