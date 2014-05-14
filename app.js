
/**
 * Module dependencies.
 */

var express = require('express'),
    mongo   = require('mongoose'),
    http    = require('http'),
    path    = require('path');

var app = express();

// Set up Mongo connection
mongo.connect('mongodb://localhost/hf_scammers');

// We need a model, to interact with Mongo
var ScammerSchema = new mongo.Schema({
    thread_id: { type: Number, unique: true, required: true },

    plaintiff_id: { type: Number, required: true },
    plaintiff_name: { type: String, default: 'Unknown' },
    
    defendant_id: { type: Number, required: true },
    defendant_name: { type: String, default: 'Unknown' },
    
    severity: Number,
    status: { type: String, validate: /^open|resolved|closed$/ },
    updated_at: { type: Date, default: Date.now }
});

var Scammer = mongo.model('scammers', ScammerSchema);

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Index page, display the scammers list
app.get('/scammers', function (req, res) {
    Scammer.find()
        .sort({ updated_at: -1 })
        .limit(20)
        .lean()
        .exec(function (err, scammers) {
            if (err) {
                res.send(err);
            }

            res.json(scammers);
        });

    //res.send(scammers);
});

app.post('/scammers', function (req, res) {
    Scammer.create({
        thread_id: req.body.t_id,
        plaintiff_id: req.body.p_id,
        plaintiff_name: req.body.p_name,
        defendant_id: req.body.d_id,
        defendant_name: req.body.d_name,
        severity: req.body.severity,
        status: req.body.status
    }, function (err, scammer) {
        if (err) {
            res.json(err);
        }
    });
});

app.get('/', function (req, res) {
    res.sendFile('./public/index.html');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
