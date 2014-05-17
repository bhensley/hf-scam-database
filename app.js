/**
 *  Modules
 */
var express     = require('express'),
    mongoose    = require('mongoose'),
    monUnique   = require('mongoose-unique-validator'),
    http        = require('http'),
    path        = require('path');



/**
 * Instantiate express and load in our config file.
 *
 * Config file should look like the following:
 *
 *   exports.mongo = {
 *       "conn_string": "mongodb://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DATABASE}"
 *   }
 *
 * Replace {VARIABLE} placeholders with pertinent data.
 */
var app = express();

// Uncomment the below if using a config file
//var config = require('./config');



/**
 * Connect to MongoDB and create our model and model's schema.
 *
 * The model will be responsible for enforcing our schema and ensure we do not
 * take in data we don't want (validations).
 */
// Set up Mongo connection
mongoose.connect(process.env.MONGO_CONN_URL || config.mongo.conn_string);

// We need a model, to interact with Mongo
var ScammerSchema = new mongoose.Schema({
    thread_id: { 
        type: Number,
        unique: true,
        required: true,
        trim: true,
        min: 1
    },

    plaintiff_id: {
        type: Number,
        required: true,
        trim: true,
        min: 1
    },

    plaintiff_name: {
        type: String,
        default: 'Unknown',
        trim: true
    },
    
    defendant_id: {
        type: Number,
        required: true,
        trim: true,
        min: 1
    },

    defendant_name: {
        type: String,
        default: 'Unknown',
        trim: true
    },
    
    severity: {
        type: Number,
        trim: true
    },

    status: {
        type: String,
        validate: /^open|resolved|closed$/,
        trim: true
    },
    
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Overwrite unique validator
ScammerSchema.plugin(monUnique);

// Instantiate that model with the ScammerSchema we made above
var Scammer = mongoose.model('scammers', ScammerSchema);



/**
 * Express requires a few initial settings to be declared.
 *
 * This is a pretty barebones Express setup.  We're enabling the logger,
 * bodyParser(), methodOverride() and telling it where to find our static
 * files.
 */
app.set('port', process.env.PORT || 3000);

app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



/**
 *  Define our API routes.
 *
 * GET /scammers
 *      Grabs the latest n-number of reports (100 for now) and 
 *      returns them to the user as a JSON object.
 *
 *      THROW error
 *
 *
 * POST /scammers/reset
 *      For the purposes of the demo only.  REMOVE IN PRODUCTION.
 *      Resets the collection in its entirety.
 *
 *      NO SECURITY MEASURES EMPLOYED; DEMO CAN BE RESET AT WILL BY ANYBODY
 *      This is intentional.
 *
 *
 * POST /scammers
 *      Saves a new scam report to the database.
 *
 *      TODO:
 *          1. Perform better error checking- aka, do not throw the error out,
 *              but rather use it to determine the issue and let the user know.
 *          2. Set it so new reports go into a holding line, where they then
 *              need to be approved before being displayed.
 *
 *
 * PUT /scammers/:id
 *      Performs changes to the given ID.
 *
 *      TODO:
 *          1. Implement
 *
 *
 * DELETE /scammers/:id
 *      Remove a scammer from the collection based upon the ID given.
 *
 *      TODO:
 *          1. Implement
 *
 *
 * GET /
 *      Home page, show index.html
 *
 */

// GET /scammers
app.get('/scammers', function (req, res) {
    Scammer.find()
        .sort({ updated_at: -1 })
        .lean()
        .limit(100)
        .exec(function (err, scammers) {
            if (err)
                throw err;

            res.json(scammers);
        });
});

// POST /scammers/reset
app.post('/scammers/reset', function (req, res) {
    mongoose.connection.db.dropCollection('scammers', function () {
        // Seed data stored in seed_data.js
        var reports = require('./data/seed_data').seed_data.reports
            len = reports.length - 1;

        /**
         *  Recursively iterate over the seed data, saving it to the DB.
         */
        function saveRecord(i) {
            Scammer.create({
                thread_id: reports[i].thread_id,
                plaintiff_id: reports[i].plaintiff_id,
                plaintiff_name: reports[i].plaintiff_name,
                defendant_id: reports[i].defendant_id,
                defendant_name: reports[i].defendant_name,
                severity: reports[i].severity,
                status: reports[i].status
            }, function (err, scammer) {
                if (err)
                    throw err;

                --i;

                if (i >= 0) {
                    saveRecord(i);
                }
            });
        }

        // Invoke
        saveRecord(len);

        // No need to wait, send the user on and let the saves just happen
        res.redirect('?success');
    });
});

// POST /scammers
app.post('/scammers', function (req, res) {
    // Create a new Scammer record using the form data.
    Scammer.create({
        thread_id: req.body.thread_id,
        plaintiff_id: req.body.plaintiff_id,
        plaintiff_name: req.body.plaintiff_name,
        defendant_id: req.body.defendant_id,
        defendant_name: req.body.defendant_name,
        severity: req.body.severity,
        status: req.body.status
    }, function (err, scammer) {
        if (err)
            res.send(400);  // Couldn't save, probably due to validation errors
        else
            res.redirect('/?success'); // Success
    });
});

// PUT /scammers/:id
app.put('/scammers/:id', function (req, res) {
    res.redirect('/');
});

// DELETE /scammers/:id
app.delete('/scammers/:id', function (req, res) {
    res.redirect('/');
});

// GET /
app.get('/', function (req, res) {
    res.sendFile('./public/index.html');
});



/**
 *  Start up Express
 */
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
