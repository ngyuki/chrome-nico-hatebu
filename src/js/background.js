'use strict';

chrome.browserAction.onClicked.addListener(function(tab){

    if (!tab.url.match(/^https?:\/\//))
    {
        return;
    }

    function sendMessage(action, params)
    {
        var def = $.Deferred();
        var params = $.extend(params || {}, { action:action });

        chrome.tabs.sendMessage(tab.id, params, function(response){
            def.resolve(response);
        });

        return def.promise();
    }

    sendMessage('is').done(function(response){
        if (!response.retval)
        {
            $.Deferred().resolve()
                .then(function(){
                    chrome.browserAction.setIcon({path:'img/icon-run.png', tabId:tab.id});
                })
                .then(function(){
                    var comments = [];
                    for (var i=0; i<10; i++)
                    {
                        comments.push("Now Loading...");
                    }
                    return sendMessage('show', {comments:["Now Loading..."]});
                })
                .then(function(){
                    return app.request_bookmarks(tab.url);
                })
                .then(function(comments){
                    console.log('comments', comments.length);
                    return sendMessage('show', {comments:comments});
                })
                .then(function(){
                    console.log('show', response);
                    chrome.browserAction.setIcon({path:'img/icon-run.png', tabId:tab.id});
                })
            ;
        }
        else
        {
            $.Deferred().resolve()
                .then(function(){
                    return sendMessage('hide');
                })
                .then(function(){
                    console.log('hide', response);
                    chrome.browserAction.setIcon({path:'img/icon.png', tabId:tab.id});
                })
            ;
        }
    });
});
