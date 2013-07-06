'use strict';

chrome.extension.onMessage.addListener(function(request, sender, sendResponse){

    switch (request.action)
    {
        case 'started':
            sendResponse({started:app.started()});
            return;

        case 'start':
            app.start(request.comments);
            break;

        case 'stop':
            app.stop();
            break;
    }

    sendResponse({});
});
