const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})
