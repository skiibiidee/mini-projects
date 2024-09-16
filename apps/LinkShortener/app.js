module.exports = ({ app, appUrl }) => {
  const shortened = {};
  const adjectives = require("./adjectives.json");
  const colors = require("./colors.json");
  const nouns = require("./nouns.json");
  function generateShortenedId() {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${adjective}-${color}-${noun}`;
  }

  app.post("/shorten", (req, res) => {
    const originalUrl = req.body.url;
    const id = generateShortenedId();
    while (Object.keys(shortened).includes(id)) {
      id = generateShortenedId();
    }
    shortened[id] = originalUrl;

    res.redirect(
      `/shorten?created=1&result=${encodeURI(
        appUrl + "/shorten/" + id,
      )}&url=${encodeURI(originalUrl)}`,
    );
  });

  app.get("/shorten", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });

  app.get("/shorten/:id", (req, res) => {
    const id = req.params.id;
    if (shortened[id]) {
      res.redirect(shortened[id]);
    } else {
      res.redirect("/shorten");
    }
  });
};
