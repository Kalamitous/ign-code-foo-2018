$(function() {
    var index = 0;
    var itemsPerLoad = 5;
    var curType = 'video'; // video/article
    var items = {video: [], article: []}; // stores content in respective array
    var loads = {video: 0, article: 0};

    // initial load
    getItems(curType);
    
    function getItems(type, user = true, callback) {
        if (user) {
            loads[type]++;
        }

        // add items retrieved from previous api calls to minimize amount of calls
        if (items[type].length >= itemsPerLoad * loads[type]) {
            for (var i = itemsPerLoad * (loads[type] - 1); i < itemsPerLoad * loads[type]; i++) {
                if (itemsPerLoad * loads[type]) {
                    addItem(items[type][i], type, i);
                }
            }

            return;
        }

        $.ajax({
            url: 'https://ign-apis.herokuapp.com/content?startIndex=' + index + '&count=5',
            dataType: 'jsonp',
            success: function(results){
                var data = results.data;
                var ids = [];

                index += data.length;  

                for (var i = 0; i < data.length; i++) {
                    ids.push(data[i].contentId);
                }

                $.ajax({
                    url: 'https://ign-apis.herokuapp.com/comments?ids=' + ids.join(),
                    dataType: 'jsonp',
                    success: function(results) {
                        for (var i = 0; i < data.length; i++) {
                            items[data[i].metadata.contentType].push({data: data[i], commentCount: results.content[i].count});
                        }

                        // call recursively until amount of retrieved items meets `itemsPerLoad`
                        if (items[type].length < itemsPerLoad * loads[type]) {
                            getItems(type, false, callback);

                            return;
                        }

                        if (typeof(callback) == 'function') {
                            callback();
                        }

                        for (var i = itemsPerLoad * (loads[type] - 1); i < itemsPerLoad * loads[type]; i++) {
                            if (itemsPerLoad * loads[type]) {
                                addItem(items[type][i], type, i);
                            }
                        }
                    }
                });
            }
        });
    }

    function addItem(item, type, index) {
        var duration = '';

        if (type == 'video') {
            var date = new Date(null);
            date.setSeconds(item.data.metadata.duration);

            duration = date.toISOString().substr(11, 8)

            while (duration.length > 4 && duration.substr(0, 1) == '0' || duration.substr(0, 1) == ':') {
                duration = duration.slice(1);
            }
        }

        var html = [
            '<div class="container-fluid ' + type + '" id="items">',
                '<div class="row">',
                    '<div class="col">',
                        '<div class="hide thumbnail">',
                            '<div class=".d-inline-block" id="duration"><h3><i class="fas fa-play-circle"></i> ' + duration + '</h3></div>',
                            '<img src="' + item.data.thumbnails[2].url + '" class="rounded">',
                        '</div>',
                    '</div>',
                    '<div class="col">',
                        '<h2>' + timeSince(Date.parse(item.data.metadata.publishDate)) + ' - <i class="far fa-comment"></i> ' + item.commentCount + '</h2>',
                        '<h1>' + item.data.metadata.title + '</h1>',
                    '</div>',
                '</div>',
            '</div>',
        ]

        // remove video duration tag if article
        if (type == 'article') {
            html.splice(4, 1);
        }

        html = html.join('');

        // add line divider below each item except for last loaded item
        if ((index + 1) % 5 != 0) {
            html = html + '<div class="container-fluid line ' + type + '"></div>';
        }

        $('#items').append($(html));

        $('.thumbnail img').css('width', $(window).width() / 2 - (14 + 6));

        // show elements after thumbnail loads
        var thumbnail = new Image();
        thumbnail.onload = function(e) {
            $('.line').removeClass('hide');
            $('.thumbnail').removeClass('hide');

            // fake window resize to include width of scroll bar when resizing elements
            $(window).resize();
        }
        thumbnail.src = item.data.thumbnails[2].url;
    }

    function timeSince(date) {
        var seconds = Math.floor((Date.now() - date) / 1000);
        var interval = Math.floor(seconds / 31536000);
      
        if (interval > 1) {
            return interval + 'y';
        }

        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + 'm';
        }

        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + 'd';
        }

        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + 'h';
        }

        interval = Math.floor(seconds / 60);
        if (interval > 1) {
            return interval + 'm';
        }

        return Math.floor(seconds) + 's';
    }

    // resize elements on window resize
    $(window).resize(function() {
        $('.thumbnail img').css('width', $(window).width() / 2 - (14 + 6));
        $('.btn-secondary').css('width', $(window).width() - (24 * 2));
    });

    // toggle hover effect for header buttons
    $(document).on('mouseover', '#btn_videos', function() {
        if ($('#btn_videos').hasClass("active")) {
            $('#u_videos').addClass('active');
        }

        $('#u_videos').toggleClass('hover');
    }).on('mouseleave', '#btn_videos', function() {
        if ($('#btn_videos').hasClass("active")) {
            $('#u_videos').toggleClass('active');
        }

        $('#u_videos').toggleClass('hover');
    });

    $(document).on('mouseover', '#btn_articles', function() {
        if ($('#btn_articles').hasClass("active")) {
            $('#u_articles').toggleClass('active');
        }

        $('#u_articles').toggleClass('hover');
    }).on('mouseleave', '#btn_articles', function() {
        if ($('#btn_articles').hasClass("active")) {
            $('#u_articles').toggleClass('active');
        }

        $('#u_articles').toggleClass('hover');
    });

    // toggle hover effect for load button
    $(document).on('mouseover', '.load', function() {
        $('#u_load').toggleClass('hover');
    }).on('mouseleave', '.load', function() {
        $('#u_load').toggleClass('hover');
    });

    // show videos/articles when respective button is pressed
    $(document).on('click', '#btn_videos', function() {
        $('#u_videos').addClass('active');
        $('#btn_videos').addClass('active');

        $('#u_articles').removeClass('active');
        $('#btn_articles').removeClass('active');

        if (curType == 'article') {
            curType = 'video';

            if (loads[curType] == 0) {
                getItems(curType);
            }
        }

        $('.article').hide();
        $('.video').show();
    });

    $(document).on('click', '#btn_articles', function() {
        $('#u_articles').addClass('active');
        $('#btn_articles').addClass('active');

        $('#u_videos').removeClass('active');
        $('#btn_videos').removeClass('active');

        if (curType == 'video') {
            curType = 'article';
            
            if (loads[curType] == 0) {
                getItems(curType);
            }
        }
        
        $('.video').hide();
        $('.article').show();
    });

    // create line divider & load new items
    $(document).on('click', '.load', function() {
        // prevent user from spam-loading
        $('.load').prop('disabled', true);
        
        getItems(curType, true, function() {
            $('.load').prop('disabled', false);

            $('#items').append($('<div class="hide container-fluid line ' + curType + '"></div>'));
        });
    });
});
