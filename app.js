var express = require('express');
var app = express();

// set up handlebars view engine
var exphbs = require('express-handlebars');
var hbs = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(function (req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' &&
        req.query.test === '1';
    next();
});

app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);

// home page
app.get('/', function (req, res) {
    res.render('jquery-test');
});

// about page
app.get('/about', function (req, res) {
    var fortune = require('./lib/fortune.js');
    var randomFortune = fortune.getFortune();
    res.render('about', { fortune: randomFortune });
});

app.get('/nursery-rhyme', function (req, res) {
    res.render('nursery-rhyme');
});
app.get('/data/nursery-rhyme', function (req, res) {
    res.json({
        animal: 'squirrel',
        bodyPart: 'tail',
        adjective: 'bushy',
        noun: 'heck',
    });
});

// custom 500 page
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

// custom 404 page
app.use(function (req, res, next) {
    res.status(404);
    res.render('404');
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});
