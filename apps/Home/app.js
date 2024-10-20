module.exports = ({ app, path, fs }) => {
  function getProjectCards() {
    let html = "";
    const apps = require("../apps.json").apps;
    for (let i = 0; i < apps.length; i++) {
      if (apps[i].name == "Home") {
        continue;
      }

      html += `
        <div class="card">
          <h2 class="card-title">${apps[i].title}</h2>
          <p class="card-body mt-2">${apps[i].description}
          </p>
          <a
            href="${apps[i].href}"
            class="card-button button"
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
  app.get("/mainstyle.css", (req,res)=>{
    res.sendFile(path.join(__dirname, "mainstyle.css"))
  })
};
