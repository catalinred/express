const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index')
})

// https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md
function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({chromeFlags:["--headless"] }).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      return chrome.kill().then(() => results.lhr)
    });
  });
}

app.get('/lighthouse/:site', function (req, res) {
  const site = req.params.site;
  const flags = {onlyCategories: ['accessibility']};

  launchChromeAndRunLighthouse(site, flags).then( results => {
    res.send(results);
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
