function ExtractParametersAsSelectors(func) {
        var source, parametersString, parameterNames;
        source = func.toString();
        parametersString = source.split(/\(|\)/)[1];
        parameterNames = AsSelectorList(parametersString);
        return parameterNames.map(function (name) {
            var selector, firstChar;
            selector = name.match(/([a-z0-9$_]+)?[a-z0-9$]/i)[0];
            firstChar = selector[0];
            return firstChar.toLowerCase() + selector.slice(1);
        });
    }
