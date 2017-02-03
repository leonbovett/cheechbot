var restify = require('restify');
var serveStatic = require('serve-static-restify')

var builder = require('botbuilder');
var cognitiveservices = require('botbuilder-cognitiveservices');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();

server.pre(serveStatic(__dirname + '/assets/img'));
server.pre(serveStatic(__dirname + '/assets/css'));
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

server.get('/chat', function page(req, res, next) {
    var body =
        "<head><title>CheechBot</title><link rel='stylesheet' type='text/css' href='style.css'></head>" +
        "<div class='title-image'></div>" +
        "<iframe class='chat-frame' src='https://webchat.botframework.com/embed/cheechbot?s=" +
        process.env.QNA_SECRET +
        "'></iframe>";
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'text/html'
    });
    res.write(body);
    res.end();
})

//=========================================================
// Bots Dialogs
//=========================================================



var recognizerQnA = new cognitiveservices.QnAMakerRecognizer({
	knowledgeBaseId: process.env.QNA_KNOWLEDGEBASE_ID,
	subscriptionKey: process.env.QNA_SUBSCRIPTION_KEY
});

var BasicQnAMakerDialog = new cognitiveservices.QnAMakerDialog({
	recognizers: [recognizerQnA],
	defaultMessage: 'I\'m not sure about that. You need to push your design into a place where you aren\'t comfortable with your ideas. That\'s the only way that you will grow your abilities and confidence as a designer.',
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
