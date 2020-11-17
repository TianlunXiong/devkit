const { parse } = require('@babel/parser');
const t = require('@babel/types');
const { default: traverse } = require('@babel/traverse');
const { default: generator } = require('@babel/generator');

let deps = [];


const external_code =  `
  function runtime(App) {
    console.log(App)
  }
`

const external_ast = parse(external_code);

traverse(external_ast, getVisitor())

const { code } = generator(external_ast, {}, external_code);

// console.log(code)

module.exports = function (source) {
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript', 'dynamicImport'],
  });

  traverse(ast, getVisitor());

  const { code } = generator(ast, {}, source);

  console.log(code)

  return code;
};


function getVisitor(config) {
  const visitor = {
    ImportDeclaration(path) {
      const { node } = path;
      deps.push(node);
      path.remove();
    },
    ExportDefaultDeclaration(path) {
      path.remove();
    },
    Program: {
      enter() {
        deps = [];
      },
      exit(path) {
        // console.log(deps);
        const from = [];
        const imports = [];
        for (let i = 0; i < deps.length; i += 1) {
          const {
            source: { value },
            specifiers,
          } = deps[i];
          if (specifiers) {
            for (let j = 0; j < specifiers.length; j += 1) {
              const {
                type,
                local: { name },
              } = specifiers[j];
              imports.push({
                type,
                name,
                sourceId: i,
                sourceName: value,
              });
            }
          }
          from.push(value);
        }
        const main = path.get('body')[0];
  
        path.unshiftContainer(
          'body',
          t.expressionStatement(
            t.callExpression(
              t.memberExpression(
                t.callExpression(
                  t.memberExpression(
                    t.identifier('Promise'),
                    t.identifier('all'),
                  ),
                  from.length > 0
                    ? [
                        t.arrayExpression([
                          t.callExpression(
                            t.import(),
                            from.map((item) => t.stringLiteral(item)),
                          ),
                        ]),
                      ]
                    : [],
                ),
                t.identifier('then'),
              ),
              [
                t.arrowFunctionExpression(
                  from.map((item, i) => t.identifier(`MODULE_${i}`)),
                  t.blockStatement([
                    imports.length > 0 ?
                    t.variableDeclaration(
                      'const',
                      imports.map((item) => {
                        const {
                          type,
                          name,
                          sourceId: i,
                          // sourceName: value,
                        } = item;
                        if (type === 'ImportSpecifier') {
                          return t.variableDeclarator(
                            t.identifier(name),
                            t.memberExpression(
                              t.identifier(`MODULE_${i}`),
                              t.identifier(name),
                            ),
                          );
                        }

                        if (type === 'ImportDefaultSpecifier') {
                          return t.variableDeclarator(
                            t.identifier(name),
                            t.memberExpression(
                              t.identifier(`MODULE_${i}`),
                              t.identifier('default'),
                            ),
                          );
                        }
                      }),
                    ) : t.expressionStatement(
                      t.stringLiteral('// no import')
                    ),
                    main.node,
                  ]),
                  true,
                ),
              ],
            ),
          ),
        );
        main.remove();
      },
    },
  };
  return visitor;
}