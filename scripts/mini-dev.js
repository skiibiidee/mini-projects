const apps = require('../apps/apps.json').apps;
const fs = require('fs');
const path = require('path');
if (!fs.existsSync(path.join(process.cwd(), 'appsenv'))) {
  const appsenv = {};
  for (let i = 0; i < apps.length; i++) {
    appsenv[apps[i].name] = '';
  }
  fs.writeFileSync(
    path.join(process.cwd(), 'appsenv'),
    JSON.stringify(appsenv),
    null,
    2
  );
} else {
  const appsenv = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'appsenv'))
  );
  const left = apps;
  for (const appname in appsenv) {
    if (left.includes(appname)) {
      left.splice(left.indexOf(appname), 1);
    }
  }
  for (let i = 0; i < left.length; i++) {
    appsenv[left[i].name] = '';
    fs.writeFileSync(
      path.join(process.cwd(), 'appsenv'),
      JSON.stringify(appsenv, null, 2)
    );
  }
}
console.log('Success');
