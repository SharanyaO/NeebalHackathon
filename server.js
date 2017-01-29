const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const router = express.Router();
const app = express();
app.set('port', (process.env.PORT || 6666));
// parse application/x-www-form-urlencoded
app.use('/', router);

var source;
var destination;
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'));
});
console.log('1');

router.get('/', function(req, response){
	
	console.log('in router.get');
	source = req.query.source;
	destination = req.query.destination;
});

router.post('/', function(req, response){

	console.log('in router.post');
});