module.exports = ({ app }) => {
  const path = require("path");
  const fs = require("fs");
  function getProjectCards() {
    let html = "";
    const apps = require("../apps.json").apps;
    for (let i = 0; i < apps.length; i++) {
      if (apps[i].name == "Home") {
        continue;
      }

      html += `
        <div class="card p-6 rounded-lg shadow-lg">
          <h2 class="card-title text-2xl font-semibold">${apps[i].title}</h2>
          <p class="card-body mt-2">${apps[i].description}
          </p>
          <a
            href="${apps[i].href}"
            class="card-button mt-4 inline-block px-4 py-2 rounded"
            >Go</a
          >
        </div>`;
    }
    return html;
  }
  app.get("/", (req, res) => {
    let html = String(fs.readFileSync(path.join(__dirname, "index.html")));
    const projectcards = getProjectCards();
    html = html.replace("{projectcards}", projectcards);

    res.send(html);
  });
  app.get("/favicon.png", (req, res) => {
    res.sendFile(path.join(__dirname, "favicon.png"));
  });
};
