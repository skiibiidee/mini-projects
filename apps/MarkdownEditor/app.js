module.exports = ({ app }) => {
  app.get("/markdown", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });
};
