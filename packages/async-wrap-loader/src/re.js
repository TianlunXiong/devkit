const { parse } = require('@babel/parser');
const t = require('@babel/types');
const { default: traverse } = require('@babel/traverse');
const { default: generator } = require('@babel/generator');
const loaderUtils = require('loader-utils');
const fs = require('fs');
const pathTool = require('path');

const bootCodeRequest = pathTool.join(process.cwd(), './loader/test.tsx');
const fd = fs.openSync(bootCodeRequest);

const parserConfig = {
  sourceType: 'module',
  plugins: ['jsx', 'typescript', 'dynamicImport'],
}

module.exports = function (source) {
  const options = loaderUtils.getOptions(this);
  // this.addDependency(bootRequest);
  const bootstrap_src = Buffer.from('');
  fs.readSync(fd, bootstrap_src)
  const bootstrapcode_ast = parse(bootstrap_src, parserConfig);
  const source_ast = parse(source, parserConfig);
  // traverse(bootstrapcode_ast, getVisitor({ awaitHead: true }));
  const {
    program: { body: bootstrapcode_ast_body },
  } = bootstrapcode_ast;
  const {
    program: { body: source_ast_body },
  } = source_ast;

  source_ast_body.push(
    ...bootstrapcode_ast_body
  )

  // console.log(source_ast);

  // traverse(
  //   ast,
  //   getVisitor({
  //     thenBody: bootstrapcode_ast_body,
  //   }),
  // );

  console.log(source_ast_body);
  let { code } = generator(source_ast, {}, source);



  return source;
};

// @deprecated
function getVisitor(config = {}) {
  const { awaitHead = false, thenBody = [] } = config;
  let deps = [];
  let entryExported = null;
  const bodys = [];
  const visitor = {
    ImportDeclaration(path) {
      const { node } = path;
      deps.push(node);
      path.remove();
    },
    ExportDefaultDeclaration(path) {
      entryExported = path.node;
      // console.log(entryExported);
      path.remove();
    },
    Statement(path) {
      bodys.push(path.node);
      path.remove();
    },
    Program: {
      enter() {
        deps = [];
      },
      exit(path) {
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
        const thenArg = [
          t.arrowFunctionExpression(
            imports.length > 0 ? [t.identifier('MODULES')] : [],
            t.blockStatement([
              imports.length > 0
                ? t.variableDeclaration(
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
                            t.memberExpression(
                              t.identifier('MODULES'),
                              t.identifier(`${i}`),
                              true,
                            ),
                            t.identifier(name),
                          ),
                        );
                      }

                      if (type === 'ImportDefaultSpecifier') {
                        return t.variableDeclarator(
                          t.identifier(name),
                          t.memberExpression(
                            t.memberExpression(
                              t.identifier('MODULES'),
                              t.identifier(`${i}`),
                              true,
                            ),
                            t.identifier('default'),
                          ),
                        );
                      }
                    }),
                  )
                : t.expressionStatement(t.stringLiteral('// no import')),
              ...bodys,
              ...thenBody.map((item) =>
                t.isStatement(item) ? item : t.expressionStatement(item),
              ),
            ]),
            true,
          ),
        ];

        let promise = thenWrap(
          t.callExpression(
            t.memberExpression(t.identifier('Promise'), t.identifier('all')),
            from.length > 0
              ? [
                  t.arrayExpression(
                    from.map((item) => {
                      return t.callExpression(t.import(), [
                        t.stringLiteral(item),
                      ]);
                    }),
                  ),
                ]
              : [t.arrayExpression()],
          ),
          thenArg,
        );

        const wrapAwait = (b, body) => {
          if (b) {
            return t.awaitExpression(body);
          } else {
            return t.expressionStatement(body);
          }
        };

        path.node.body[0] = wrapAwait(awaitHead, promise);
      },
    },
  };
  return visitor;
}

function thenWrap(body, then) {
  return t.callExpression(t.memberExpression(body, t.identifier('then')), then);
}
