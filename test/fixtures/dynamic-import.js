Promise.all([
  import('./package.json'),
  import('./yaml.yaml'),
  import('./typescript.ts')
]).then(([pjson, yaml, ts]) => {
  if (pjson.name === 'custom-package')
    console.log(ts.transform(yaml.some).code);
});