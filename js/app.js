'use strict';

var app = (function(undefined){
    var self = {};

    self.request_bookmarks = function(url, opt)
    {
        var opt = $.extend({
            url: "http://b.hatena.ne.jp/entry/jsonlite/",
            dataType: "json",
            data: {url:url}
        }, opt);

        var def = $.Deferred();

        $.ajax(opt).done(function(json){
            var comments = $.map(json.bookmarks, function(data){
                if (data.comment && data.comment.length)
                {
                    return data.comment;
                }
            });
            def.resolve(comments);
        });
        return def.promise();
    };

    function create_elements()
    {
        if ($('#nicoscreen-wrap').size() !== 0)
        {
            return $('#nicoscreen-wrap');
        }
        else
        {
            return $('<div id="nicoscreen-wrap"></div>')
                .css({
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    right: 0,
                    'z-index': 99999
                })
                .append($('<div id="nicoscreen"></div>').css({
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%'
                }))
                .prependTo('body')
            ;
        }
    };

    function delete_elements()
    {
        $('#nicoscreen-wrap').remove();
    };

    self.is = function()
    {
        return $('#nicoscreen-wrap').size() !== 0;
    };

    self.show = function(comments)
    {
        create_elements();

        nicoscreen.set({
            comments:comments,
            base:{
                color: "white",
                speed: "fast",
                font_size: "48px",
                loop: true
            }
        });

        nicoscreen.start();
    };

    self.hide = function()
    {
        delete_elements();
    };

    return self;
}())

