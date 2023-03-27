// Imports
const express = require('express')
const app = express()
const port = 3001


// Static Files
app.use(express.static('static'));
// Specific folder example
// app.use('/css', express.static(__dirname + 'public/css'))
// app.use('/js', express.static(__dirname + 'public/js'))
// app.use('/img', express.static(__dirname + 'public/images'))

// Set View's
app.set('views', './views');
app.set('view engine', 'ejs');

// Navigation
app.get('', (req, res) => {
    res.render('pages/index', { text: 'Hey' })
})

app.get('/about', (req, res) => {
    res.render('pages/about')
})

app.use((req, res) => {
    res.status(404).render('pages/404.ejs');
})


// Listen on Port 3001
app.listen(port, "localhost", () => {
    console.log(`En attente des requêtes au port ${port}`)
});