var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================



var recognizer = new cognitiveservices.QnAMakerRecognizer({
	knowledgeBaseId: process.env.QNA_KNOWLEDGEBASE_ID,
	subscriptionKey: process.env.QNA_SUBSCRIPTION_KEY
});

var BasicQnAMakerDialog = new cognitiveservices.QnAMakerDialog({
	recognizers: [recognizer],
	defaultMessage: 'No good match in FAQ.',
	qnaThreshold: 0.5});

bot.dialog('/', BasicQnAMakerDialog);


// var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/0bd654cf-6de3-4e9c-a611-096414a65eb2?subscription-key=67630055817641179c82295f202cbe19&q=design%20strategies';
// var recognizer = new builder.LuisRecognizer(model);
// var dialogDesignStrategies = new builder.IntentDialog({ recognizers: [recognizer] });
// bot.dialog('/', dialogDesignStrategies);
//
// // Add intent handlers
// dialog.matches('responsive design', builder.DialogAction.send("Have you tried creating a responsive design?"));
// dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand."));





// bot.dialog('/', function (session) {
//     session.send("Hello Fjord");
//     console.log("hello");
// });
