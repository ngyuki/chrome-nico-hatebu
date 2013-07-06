'use strict';

chrome.browserAction.onClicked.addListener(function(tab){

    if (!tab.url.match(/^https?:\/\//))
    {
        return;
    }

    function sendMessage(action, params)
    {
        var params = $.extend(params || {}, {action:action});
        var def = $.Deferred();

        chrome.tabs.sendMessage(tab.id, params, function(response){
            def.resolve(response);
        });

        return def.promise();
    }

    sendMessage('started').done(function(response){

        if (!response.started)
        {
            $.Deferred().resolve()
                .then(function(){
                    chrome.browserAction.setIcon({path:'img/icon-run.png', tabId:tab.id});
                })
                .then(function(){
                    return sendMessage('start', {comments:["Now Loading..."]});
                })
                .then(function(){
                    return app.requestBookmarks(tab.url);
                })
                .then(function(comments){
                    var count = comments.length + '';
                    count.length > 4 && (count = '9999');
                    chrome.browserAction.setBadgeText({text:count, tabId:tab.id});
                    return sendMessage('start', {comments:comments});
                })
            ;
        }
        else
        {
            $.Deferred().resolve()
                .then(function(){
                    return sendMessage('stop');
                })
                .then(function(){
                    chrome.browserAction.setBadgeText({text:'', tabId:tab.id});
                    chrome.browserAction.setIcon({path:'img/icon.png', tabId:tab.id});
                })
            ;
        }
    });
});
