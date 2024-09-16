const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Create an interface to get user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function continueDeleting(projectName) {
  if (fs.existsSync(projectJsonPath)) {
    const existingData = fs.readFileSync(projectJsonPath, "utf-8");
    const projectsData = JSON.parse(existingData);
    // Filter out the project to be deleted
    let notfound = true;
    projectsData.apps = projectsData.apps.filter((app) => {
      if (app.name !== projectName) {
        return true;
      } else {
        notfound = false;
      }
    });
    if (!notfound) {
      // Write the updated data back to apps.json
      fs.writeFileSync(projectJsonPath, JSON.stringify(projectsData, null, 2));
      console.log(`Removed ${projectName} from apps.json`);
    } else {
      console.log("App not found in apps.json");
    }
  } else {
    console.log("apps.json not found. Nothing to update.");
  }
  let appsenvdata = {};
  if (fs.existsSync(appsenvpath)) {
    const existingData = fs.readFileSync(appsenvpath, "utf-8");
    appsenvdata = JSON.parse(existingData);
    if (appsenvdata[projectName] !== undefined) {
      delete appsenvdata[projectName];
      fs.writeFileSync(appsenvpath, JSON.stringify(appsenvdata, null, 2));
      console.log("Removed app from appsenv");
    } else {
      console.log("App not found in appsenv.");
    }
  }
  rl.close();
}

// Function to delete the project
function deleteProject(projectName) {
  if (projectName == undefined || projectName == "") {
    rl.close();
    return console.log("Please enter a project name");
  }
  const projectDir = path.join(process.cwd(), `apps/${projectName}`);

  if (fs.existsSync(projectDir)) {
    rl.question(
      `Delete directory recursively: "${projectDir}" ? (y/n)`,
      (ans) => {
        if (ans == "y" || ans == "Y") {
          fs.rmSync(projectDir, { recursive: true, force: true });
          console.log(`Deleted project directory: ${projectDir}`);
          continueDeleting(projectName);
        } else {
          console.log(`Did not delete project directory: ${projectDir}`);
          rl.close();
        }
      },
    );
  } else {
    console.log(`Project directory ${projectDir} does not exist.`);
    rl.close();
  }
}
const projectJsonPath = path.join(process.cwd(), "apps/apps.json");
const appsenvpath = path.join(process.cwd(), "appsenv");

// Prompt for the project name
rl.question("Enter the project name to delete: ", (projectName) => {
  deleteProject(
    projectName.replace(" ", "_").replace("/", "").replace("?", ""),
  );
});
