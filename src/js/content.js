'use strict';

chrome.extension.onMessage.addListener(function(request, sender, sendResponse){

    switch (request.action)
    {
        case 'is':
            sendResponse({ retval: app.is() });
            return;

        case 'show':
            app.show(request.comments);
            break;

        case 'hide':
            app.hide();
            break;
    }

    sendResponse({});
});
