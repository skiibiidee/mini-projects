module.exports = ({ expressapp, appUrl, processargs, io }) => {
  console.log('Starting apps.');
  const fs = require('fs');
  const path = require('path');
  const apps = require('./apps/apps.json').apps;
  if (!fs.existsSync(path.join(__dirname + '/appsenv'))) {
    console.log('appsenv plaintext file not found in working directory. ');
    process.exit(1);
  }
  const appsenv = JSON.parse(
    fs.readFileSync(path.join(__dirname + '/appsenv'))
  );
  const args = { app: expressapp, appUrl: appUrl, io: io };
  const data = { get: {}, post: {}, socket: {}, localstorage: {} };
  for (let i = 0; i < apps.length; i++) {
    const appenv = appsenv[apps[i].path];
    if (appenv == undefined) {
      throw new Error(
        `App ${apps[i].name} has no .env string in appsenv.json. (set to "" if no .env variables.)`
      );
    }
    fs.writeFileSync(__dirname + `/apps/${apps[i].path}/.env`, appenv);
    const appData = require(`./apps/${apps[i].path}/app.json`);
    if (appData) {
      if (
        appData.data?.get &&
        appData.data?.post &&
        appData.data?.socket &&
        appData.data?.localstorage
      ) {
        for (const datapoint in appData.data) {
          for (let index = 0; index < appData.data[datapoint].length; index++) {
            const endingwslash =
              appData.data[datapoint][index].charAt(
                appData.data[datapoint][index].length - 1
              ) == '/' && ['get', 'post'].includes(datapoint);
            if (endingwslash && appData.data[datapoint][index] !== '/') {
              for (const endpoint in data[datapoint]) {
                if (endpoint.startsWith(appData.data[datapoint][index])) {
                  throw new Error(
                    `App ${appData.name} has a data conflict with ${data[datapoint][endpoint]}. Data conflicted: "${appData.data[datapoint][index]}" and "${endpoint}"`
                  );
                }
              }
            }
            if (
              !Object.keys(data[datapoint]).includes(
                appData.data[datapoint][index]
              )
            ) {
              data[datapoint][appData.data[datapoint][index]] =
                appData.name || 'No Name App';
            } else {
              throw new Error(
                `App ${appData.name} has a data conflict with ${
                  data[datapoint][appData.data[datapoint][index]]
                }. Data conflicted: "${appData.data[datapoint][index]}"`
              );
            }
          }
        }
      } else {
        throw new Error(
          `app.json in ${apps[i].path} (${apps[i].name}) has no data property. Example: "data" : {"get":["/home","/home/","/send"],"post":["/home"],"socket":[],"localstorage":["app-save"]}`
        );
      }
      console.log(`Starting ${appData.name} v${appData.version}..`);
      if (appData.run) {
        if (fs.existsSync(__dirname + `/apps/${apps[i].path}/${appData.run}`)) {
          const app = require(`./apps/${apps[i].path}/${appData.run}`);
          app(args);
          continue;
        }
      } else {
        throw new Error(
          `app.json in ${apps[i].path} (${apps[i].name}) has no run property. Example: "run" : "app.js"`
        );
      }
      console.log(
        `Main run file for ${appData.name} v${appData.version} not found: "${
          __dirname + `/apps/${apps[i].path}/${appData.run}`
        }"`
      );
    }
  }
  if (processargs.E) {
    console.log('Datapoints/Endpoints taken: ' + JSON.stringify(data, null, 2));
  }
  console.log('Apps Started.');
  return data;
};
