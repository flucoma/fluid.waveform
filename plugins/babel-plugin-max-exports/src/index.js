// JS in Max doesn't do module.exports, but it does support an exports object with otherwise CommonJS-like behaviour. 
// So we replace `module.exports`  with `exports.default`
// and `require(<thing>)` with `require(<thing>).default`

module.exports = function({types: t}) {
  return {
    visitor: {
      //module.exports is a member expression, simple replace: 
      MemberExpression(path) {
        if (path.node.object.name === "module" && path.node.property.name === "exports") {
          path.node.object.name = "exports";
          path.node.property.name = "default";
        }
      },
      //require(X) is a call expression. More complex replacement, as we 
      //need to produce a member expression .default that contains the original
      //call expression require(X)
      CallExpression(path) {
        if (path.node.callee.name === "require" &&
          !(//Avoid infinite recursion...(this is well flaky, but)
            path.parent.type === "MemberExpression" && path.parent.property.name === "default"
          )
        ) {
          let arg = path.node.arguments[0].value
          path.replaceWith(
            t.memberExpression(
              t.callExpression(
                t.identifier("require"), [t.stringLiteral(arg)]
              ),
              t.identifier("default")
            )
          );
        }
      }
    }
  }
};
