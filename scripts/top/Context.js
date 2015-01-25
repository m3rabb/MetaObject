

  Context.addInstanceMethod(function subcontextsDo(actionBlock) {
    var name, subcontexts;
    subcontexts = this._Subcontexts;
    for (name in subcontexts) {
      actionBlock.call(this, subcontexts[name]);
    }
    return this;
  });

  Context.addInstanceMethod(function addType(block_name, supertypeName_type_) {
    var typeName, type, supertype, block, parameterNames;

    supertype = IsString(supertypeName_type_) ?
      this[supertypeName_type_] : supertypeName_type_;
    switch(typeof block_name) {
      case "function" :
        block = block_name;
        parameterNames = ExtractParameters(block);
        typeName = parameterNames[0];
        supertype = parameterNames[1] || supertype;
        break;
      case "string" :
        typeName = block_name;
        break;
    }

    this[typeName] = type = Type.newInstance(typeName, supertype);
    block && block.call(null, type, supertype);
    return this;
  });

  Context.addInstanceMethod(function addContext(block_name) {
    var subcontextName, block;

    switch(typeof block_name) {
      case "function" :
        block = block_name;
        subcontextName = ExtractParameters(block)[0];
        break;
      case "string" :
        subcontextName = block_name;
        break;
    }

    this[typeName] = type = Type.newInstance(typeName, supertype);
    block && block.call(null, type, supertype);
    return this;
  });
