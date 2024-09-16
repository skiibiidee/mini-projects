module.exports = ({ app, appUrl }) => {
  const shortened = {};

  function generateShortenedId() {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    const length = 6;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }

    return randomString;
  }

  app.post('/shorten', (req, res) => {
    const originalUrl = req.body.url;
    const id = generateShortenedId();
    while (Object.keys(shortened).includes(id)) {
      id = generateShortenedId();
    }
    shortened[id] = originalUrl;
    // Here you would save the original URL and short URL mapping in a database

    res.redirect(
      `/shorten?created=1&result=${encodeURI(
        appUrl + '/shorten/' + id
      )}&url=${encodeURI(originalUrl)}`
    );
  });

  app.get('/shorten', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  app.get('/shorten/:id', (req, res) => {
    const id = req.params.id; // Access the id from the URL
    if (shortened[id]) {
      res.redirect(shortened[id]);
    } else {
      res.redirect('/shorten');
    }
  });
};
