/* eslint no-console:0 */

$(document).ready(function() {
    console.log('sticky_header');

    var $table = $('.js-table'),
        $thead = $('.js-thead'),
        $tbody = $('.js-tbody'),
        $tr = $('.js-tr'),
        $th = $('.js-th'),
        $td = $('.js-td');

    var _timerVal = 30,
        timerId,
        $sidebar = $('.js-sidebar'),
        $timerBlock = $('.js-timeout');

    var $updateBtn = $('.js-update-data'),
        $resizeBtn = $('.js-resize-table');

    var $window = $(window),
        windowScroll,
        tableOffsetTop,
        tableOffsetleft,
        tableHeight,
        tableWidth,
        fixedStop,
        tdSizes;

    function init() {
        timer();
        updateVars();
        bindEvents();
        fixedHeader();
    }

    function updateVars() {
        windowScroll = $window.scrollTop();
        tableOffsetTop = $table.offset().top;
        tableOffsetleft = $table.offset().left;
        tableHeight = $table.outerHeight();
        tableWidth = $table.outerWidth();
        fixedStop = tableHeight + tableOffsetTop - 350;
        tdSizes= getTdSize();
    }

    function bindEvents() {
        $window.on('scroll', function() {
            fixedHeader();
        })

        $window.on('resize', function() {
            $table.trigger('update');
        })

        $window.on('gettingData', function() {
            getData();
            fixedHeader();
        })

        $table.on('update', function() {
            fixedHeader();
        })

        $updateBtn.on('click', function() {
            clearInterval(timerId);
            getData();
        })

        $resizeBtn.on('click', function() {
            resizeTable();
            $table.trigger('update');
        })
    }

    function getTdSize() {
        var sizes = [];
        $tr.eq(0).find($td).each(function() {
            sizes.push($(this).outerWidth());
        });

        return sizes;
    }

    function clearTdSizes() {
        $td.each(function() {
            $(this).css('width', 'auto');
        });
    }

    function fixedHeader() {
        updateVars();
        if (windowScroll >= tableOffsetTop && windowScroll <= fixedStop) {

            $th.each(function(index) {
                $(this).css('width', tdSizes[index]);
            });

            $thead.addClass('fixed').css({
                'width': tableWidth,
                'left': tableOffsetleft
            });

        } else  {
            $thead.removeClass('fixed').css('width', '100%');
        }
    }

    function resizeTable() {
        var rand = random(200, 600, 100);
        var td = $tr.eq(0).find($td);

        td.eq(0).css('width', rand);
        td.eq(1).css('width', (tableWidth - rand) / 4);
        td.eq(2).css('width', (tableWidth - rand) / 4);
        td.eq(3).css('width', (tableWidth - rand) / 4);
        td.eq(4).css('width', (tableWidth - rand) / 4);
    }

    function timer() {
        $sidebar.show();

        $timerBlock.html(_timerVal);

        var i = _timerVal;

        timerId = setInterval(function() {
            if (i > 0) {
                $timerBlock.html(i - 1);
                i--;
            } else {
                $window.trigger('gettingData');
                clearInterval(timerId);
            }
        }, 1000)

        return timerId;
    }

    function getData() {
        $.ajax({
            type: "POST",
            url: '../../../api/index.php',
            dataType: 'json',
            data: {'count': $td.length},
            beforeSend: function() {},
            success: function(resp){
                setData(resp.text);
            }
        });
    }

    function setData(data) {
        data.reverse();

        $td.each(function(index, el) {
            $(el).html(data[index]);
        });

        clearTdSizes();
        fixedHeader();
        timer();
    }

    function random(min,max,num){
        return Math.floor(Math.floor(Math.random()*(max-min+1)+min) / num) * num;
    }


    init();
})