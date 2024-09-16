const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Create an interface to get user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to create the project
function createProject(projectName) {
  const projectDir = path.join(process.cwd(), `apps/${projectName}`);
  const projectJsonPath = path.join(process.cwd(), "apps/apps.json");
  const appJsContent = `module.exports = ({app, appUrl, io})=>{
    app.get('/${projectName}',(req,res)=>{


      res.send("Welcome to ${projectName}, powered by mini-projects.")
    })
  }`;
  const appJsonContent = JSON.stringify(
    {
      name: projectName,
      version: "1.0.0",
      run: "app.js",
      data: {
        get: [`/${projectName}`],
        post: [],
        socket: [],
        localstorage: [],
      },
    },
    null,
    2,
  );

  // Create the project directory
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  } else {
    console.log(
      `Directory for ${projectDir} already exists. Please delete the directory or choose another project name.`,
    );
    rl.close();

    return;
  }

  // Create app.js
  fs.writeFileSync(path.join(projectDir, "app.js"), appJsContent);

  // Create app.json
  fs.writeFileSync(path.join(projectDir, "app.json"), appJsonContent);

  // Read and update apps.json outside the project directory
  let projectsData = { apps: [] };
  if (fs.existsSync(projectJsonPath)) {
    const existingData = fs.readFileSync(projectJsonPath, "utf-8");
    projectsData = JSON.parse(existingData);
  }
  let appsenvdata = {};
  if (fs.existsSync(appsenvpath)) {
    const existingData = fs.readFileSync(appsenvpath, "utf-8");
    appsenvdata = JSON.parse(existingData);
  }
  appsenvdata[projectName] = "";
  projectsData.apps.push({
    name: projectName,
    path: projectName,

    title: projectName,
    description: `Project ${projectName}`,
    href: "/" + projectName,
  });
  fs.writeFileSync(projectJsonPath, JSON.stringify(projectsData, null, 2));
  fs.writeFileSync(appsenvpath, JSON.stringify(appsenvdata, null, 2));

  console.log(
    `Project ${projectName} initialized successfully in ${projectDir}!`,
  );
  rl.close();
}
const appsenvpath = path.join(process.cwd(), "appsenv");

// Prompt for the project name
if (fs.existsSync(appsenvpath)) {
  rl.question("Enter a name for the project: ", (projectName) => {
    createProject(
      projectName.replace(" ", "_").replace("/", "").replace("?", ""),
    );
  });
} else {
  console.log(
    `No "appsenv" file found in working directory. Please run "npm run dev" to setup "appsenv" file.`,
  );
  rl.close();
}
