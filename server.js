const express = require("express");
const request = require("request");
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  // Définir CSP pour autoriser l'iframe de votre domaine
  // Remplacez 'example.com' par votre domaine réel
  res.header("Content-Security-Policy", "frame-ancestors 'self' http://localhost:5173/");

  next();
});

app.get("/proxy", (req, res) => {
  const urlToProxy = req.query.url;

  if (!urlToProxy) {
    return res.status(400).send("URL is required as a query parameter.");
  }

  try {
    const options = {
      url: urlToProxy,
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      // Ajoutez cette option pour ignorer l'en-tête X-Frame-Options de la réponse
      gzip: true,
    };

    // Suppression de l'en-tête X-Frame-Options de la réponse proxifiée
    request(options, (error, response, body) => {
      if (error) {
        console.error("Error during the proxy request:", error);
        return res.status(500).send("Proxy request failed.");
      }

      res.removeHeader("X-Frame-Options"); // Supprimer cet en-tête pour éviter les conflits
      res.send(body);
    });
  } catch (error) {
    console.error("Proxy server error:", error);
    res.status(500).send("Error while processing the proxy request.");
  }
});

app.listen(PORT, () => {
  console.log(`CORS Proxy server running on http://localhost:${PORT}`);
});
