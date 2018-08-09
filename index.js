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

// https://github.com/GoogleChrome/lighthouse/blob/master/docs/headless-chrome.md#running-lighthouse-using-headless-chrome
function launchChromeAndRunLighthouse(url, flags = {}, config = null) {
  return chromeLauncher.launch(flags).then(chrome => {
    flags.port = chrome.port;
    return lighthouse(url, flags, config).then(results =>
      chrome.kill().then(() => results));
  });
}

const flags = {
  chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox'],
  onlyCategories: ['accessibility']
};

app.get('/lighthouse/:site', function (req, res) {
  const site = req.params.site;

  launchChromeAndRunLighthouse(site, flags).then( results => {
    res.send(results);
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
