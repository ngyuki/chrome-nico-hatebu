'use strict';

var app = (function(undefined){
    var self = {};

    var _timer = null;
    var _index = 0;
    var _comments = [];

    var _options = {
        interval: 1000,
        duration: 5000
    };

    var _css = {
        'color': '#fff',
        'text-shadow': '2px 2px 2px #000',
        'font-size': '36px',
        //
        'position': 'fixed',
        'background-color': 'transparent',
        'z-index': 99999,
        'margin': 0,
        'padding': 0,
        'line-height': 1,
        'overflow': 'visible',
        'white-space': 'nowrap',
        'cursor': 'default',
        'user-select': 'none',
        '-moz-user-select': 'none',
        '-webkit-user-select': 'none'
    };

    self.requestBookmarks = function(url, opt)
    {
        var opt = $.extend({
            url: "http://b.hatena.ne.jp/entry/jsonlite/",
            dataType: "json",
            data: {url:url}
        }, opt);

        var def = $.Deferred();

        $.ajax(opt).done(function(json){

            var comments = [];

            if (json && json.bookmarks)
            {
                comments = $.map(json.bookmarks, function(data){
                    if (data.comment && data.comment.length)
                    {
                        return data.comment;
                    }
                });
            }

            def.resolve(comments);
        });
        return def.promise();
    };

    self.started = function()
    {
        return _timer !== null;
    };

    self.start = function(comments, options, css)
    {
        if (comments.length === 0)
        {
            comments = ['No Comments.'];
        }

        self.stop();

        _comments = comments;
        _options = $.extend(_options, options);
        _css = $.extend(_css, css);

        _timer = setInterval(draw, _options.interval);
    }

    self.stop = function()
    {
        if (_timer !== null)
        {
            clearInterval(_timer);
            _timer = null;
        }
    }

    function draw()
    {
        if (_index >= _comments.length)
        {
            _index = 0;
        }

        var comment = _comments[_index++];

        var elem = $('<div>')
            .css(_css)
            .text(comment)
            .hide()
            .appendTo('body')
        ;

        var cx = document.documentElement.clientWidth;
        var cy = document.documentElement.clientHeight;

        var ox = elem.width();
        var oy = elem.height();

        var top = parseInt(Math.random() * (cy - oy));

        elem.css({left:cx, top:top});

        elem.show().animate({
            left: -ox,
        },{
            duration: _options.duration,
            easing: 'linear',
            complete: function(){ $(this).remove() },
        });
    }

    return self;
}());
