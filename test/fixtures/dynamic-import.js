Promise.all([
  import('./package.json'),
  import('./yaml.yaml'),
  import('./typescript.ts')
]).then(([pjson, yaml, ts]) => {
  if (pjson.default.name === 'custom-package')
    console.log(ts.transform(yaml.default.some).code);
});