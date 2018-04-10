const fs = require('fs');
const babel = require('@babel/core');
const helpers = require('@babel/helpers');
const t = babel.types;

const programNodes = [];
for (const helperName of helpers.list) {
  const helper = helpers.get(helperName);
  const exportDeclaration = helper.nodes.find(node => t.isExportDefaultDeclaration(node));
  let declaration
  if (t.isFunctionDeclaration(exportDeclaration.declaration) || t.isClassDeclaration(exportDeclaration.declaration)) {
    declaration = exportDeclaration.declaration;
    if (helperName !== 'typeof' && helperName !== 'instanceof' && helperName !== 'extends')
      declaration.id.name = helperName;
  } else {
    declaration = t.variableDeclaration('var', [t.variableDeclarator(t.identifier(helperName), exportDeclaration.declaration)]);
  }
  programNodes.push(t.exportNamedDeclaration(declaration, []));
}

const tree = t.program(programNodes);
fs.writeFileSync('./babel-helpers.js', babel.transformFromAst(tree).code + '\nexport { _typeof as typeof, _extends as extends, _instanceof as instanceof }');