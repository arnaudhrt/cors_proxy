const express = require("express");
const request = require("request");

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/proxy", (req, res) => {
  // Récupérer l'URL du site web cible à partir des paramètres de requête
  const urlToProxy = req.query.url;

  if (!urlToProxy) {
    return res.status(400).send("URL is required as a query parameter.");
  }

  try {
    // Options pour la requête (ajoutez des en-têtes supplémentaires si nécessaire)
    const options = {
      url: urlToProxy,
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    };

    request(options)
      .on("error", (error) => {
        console.error("Error during the proxy request:", error);
        res.status(500).send("Proxy request failed.");
      })
      .pipe(res);
  } catch (error) {
    console.error("Proxy server error:", error);
    res.status(500).send("Error while processing the proxy request.");
  }
});

app.listen(PORT, () => {
  console.log(`CORS Proxy server running on http://localhost:${PORT}`);
});
