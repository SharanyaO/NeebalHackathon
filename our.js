/*-----------------------------------------------------------------------------
This template demonstrates how to use an IntentDialog with a LuisRecognizer to add 
natural language support to a bot. 
For a complete walkthrough of creating this type of bot see the article at
http://docs.botframework.com/builder/node/guides/understanding-natural-language/
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: 'dbc8c994-34a1-48e5-acab-2d1cc604397f',
    appPassword: 'ZGUBxaOJ0xzkVJJ3HLkFjpa',
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var source;
var destination;
var bot = new builder.UniversalBot(connector);

// Make sure you add code to validate these fields
var luisAppId = '48ad4685-83fe-4e90-bb26-c0b932c784dc';
var luisAPIKey = '94799c1e2f4a406a85dfb15937e64ec0';
var luisAPIHostName = process.env.LuisAPIHostName || 'api.projectoxford.ai';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/',intents);
/*
.matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
*/
intents.matches('greeting', (session, args) => {
    session.send('Hi! Welcome to HelpDeskBot! What is your current location in the mall?');
    
})

intents.matches('getsrc', [
    function (session, args, next) {
        var s = builder.EntityRecognizer.findEntity(args.entities, 'src');
        if (!s) {
            builder.Prompts.text(session, "Where are you");
        } else {
            next({ response: s.entity });
        }
    },
    function (session, results) {
        if (results.response) {
            // ... save task
            session.send("Ok... Added the '%s' source. What is your destination?", results.response);
            source = results.reponse;
        } else {
            session.send("Ok");
        }
    }
]);

intents.matches('getdest', [
    function (session, args, next) {
        var d = builder.EntityRecognizer.findEntity(args.entities, 'dest');
        if (!d) {
            builder.Prompts.text(session, "Where do you want to go?");
        } else {
            next({ response: d.entity });
        }
    },
    function (session, results) {
        if (results.response) {
            // ... save task
            session.send("Ok... Added the '%s' destination.", results.response);
            destinantion = results.response;
        } else {
            session.send("Ok");
        }
    }
]);

intents.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
});

  

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
    });
    server.post('/api/messages', connector.listen());
    request({
            method: 'GET',
            url: 'https://05d4256f.ngrok.io?source='+source+'&destination='+destination,
            }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var object = JSON.parse(body);
                console.dir(object, {depth: null, colors: true})
                res.send(body);
            }
        });

} 
else {
    module.exports = { default: connector.listen() }
}


