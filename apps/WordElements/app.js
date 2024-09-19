module.exports = ({ app }) => {
  const path = require("path");
  app.get("/wordelements", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
  });

  app.get("/wordelements/elements", (req, res) => {
    res.send(JSON.stringify(require("./elements.json")));
  });
};
