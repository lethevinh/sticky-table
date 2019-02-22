(function(factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {

    var stickyTop = 'thead tr, tbody tr:nth-child(3),tbody tr:nth-child(10)';
    var stickyBottom = 'tfoot tr, tbody tr:nth-child(30)';
    var stickyLeft = 'tbody tr td:first-child, tr th:first-child';
    var stickRight = 'tbody tr td:last-child, tr th:last-child';
    var tableSticky;

    var stickyTable = function() {

        var positionStickySupport = function() {
            var el = document.createElement('a'),
                mStyle = el.style;
            mStyle.cssText = "position:sticky;position:-webkit-sticky;position:-ms-sticky;";
            return mStyle.position.indexOf('sticky') !== -1;
        }();

        var scrollTypeRTL = function() {
            var definer = $('<div dir="rtl" style="font-size: 14px; width: 4px; height: 1px; position: absolute; top: -1000px; overflow: scroll">ABCD</div>').appendTo('body')[0],
                scrollTypeRTL = 'reverse';

            if (definer.scrollLeft > 0) {
                scrollTypeRTL = 'default';
            } else {
                definer.scrollLeft = 1;
                if (definer.scrollLeft === 0) {
                    scrollTypeRTL = 'negative';
                }
            }
            $(definer).remove();
            return scrollTypeRTL;
        }();

        if (!positionStickySupport) {
            if (navigator.userAgent.match(/Trident\/7\./)) {
                $('.sticky-table').on("mousewheel", function(event) {
                    event.preventDefault();
                    var wd = event.originalEvent.wheelDelta;
                    var csp = $(this).scrollTop();
                    $(this).scrollTop(csp - wd);
                });
            }

            $(".sticky-table").scroll(function() {
                $(this).find("table tr.sticky-header th").css('top', $(this).scrollTop());
                $(this).find("table tr.sticky-header td").css('top', $(this).scrollTop());
                var maxScroll = $(this).find("table").prop("clientHeight") - $(this).prop("clientHeight");
                $(this).find("table tr.sticky-footer th").css('bottom', maxScroll - $(this).scrollTop());
                $(this).find("table tr.sticky-footer td").css('bottom', maxScroll - $(this).scrollTop());
            }).scroll();

            $(".sticky-ltr-cells").scroll(function() {
                $(this).find("table th.sticky-cell").css('left', $(this).scrollLeft());
                $(this).find("table td.sticky-cell").css('left', $(this).scrollLeft());
                var maxScroll = $(this).find("table").prop("clientWidth") - $(this).prop("clientWidth");
                $(this).find("table th.sticky-cell-opposite").css('right', maxScroll - $(this).scrollLeft());
                $(this).find("table td.sticky-cell-opposite").css('right', maxScroll - $(this).scrollLeft());
            }).scroll();
        }
        if ($(".sticky-rtl-cells").length && !(positionStickySupport && scrollTypeRTL == 'negative')) {
            if (positionStickySupport) {
                $(".sticky-rtl-cells table th.sticky-cell").css('position', "relative");
                $(".sticky-rtl-cells table td.sticky-cell").css('position', "relative");
                $(".sticky-rtl-cells table th.sticky-cell-opposite").css('position', "relative");
                $(".sticky-rtl-cells table td.sticky-cell-opposite").css('position', "relative");

                $(".sticky-table").scroll(function() {
                    $(this).find("table tr.sticky-header .sticky-cell").css('top', $(this).scrollTop());
                    $(this).find("table tr.sticky-header .sticky-cell-opposite").css('top', $(this).scrollTop());
                    var maxScroll = $(this).find("table").prop("clientHeight") - $(this).prop("clientHeight");
                    $(this).find("table tr.sticky-footer .sticky-cell").css('bottom', maxScroll - $(this).scrollTop());
                    $(this).find("table tr.sticky-footer .sticky-cell-opposite").css('bottom', maxScroll - $(this).scrollTop());
                }).scroll();
            }
            $(".sticky-rtl-cells").scroll(function() {
                var maxScroll = $(this).find("table").prop("clientWidth") - $(this).prop("clientWidth");
                switch (scrollTypeRTL) {
                    case "default": // webKit Browsers
                        $(this).find("table th.sticky-cell").css('right', maxScroll - $(this).scrollLeft());
                        $(this).find("table td.sticky-cell").css('right', maxScroll - $(this).scrollLeft());
                        $(this).find("table th.sticky-cell-opposite").css('left', $(this).scrollLeft());
                        $(this).find("table td.sticky-cell-opposite").css('left', $(this).scrollLeft());
                        break;
                    case "negative": // Firefox, Opera
                        $(this).find("table th.sticky-cell").css('right', $(this).scrollLeft() * -1);
                        $(this).find("table td.sticky-cell").css('right', $(this).scrollLeft() * -1);
                        $(this).find("table th.sticky-cell-opposite").css('left', maxScroll + $(this).scrollLeft());
                        $(this).find("table td.sticky-cell-opposite").css('left', maxScroll + $(this).scrollLeft());
                        break;
                    case "reverse": // IE, Edge
                        $(this).find("table th.sticky-cell").css('right', $(this).scrollLeft());
                        $(this).find("table td.sticky-cell").css('right', $(this).scrollLeft());
                        $(this).find("table th.sticky-cell-opposite").css('left', maxScroll - $(this).scrollLeft());
                        $(this).find("table td.sticky-cell-opposite").css('left', maxScroll - $(this).scrollLeft());
                }
            }).scroll();
        }
    };

    var createStructureTable = function() {

        if (tableSticky.parent().hasClass('sticky-table') || tableSticky.length == 0) {
            return false;
        }

        tableSticky.wrap('<div class="sticky-table sticky-ltr-cells"></div>');
        stickyTop = tableSticky.data('sticky-top');
        stickyBottom = tableSticky.data('sticky-bottom');
        stickyLeft = tableSticky.data('sticky-left');
        stickRight = tableSticky.data('sticky-rigth');

        $(stickyTop).addClass('sticky-header');
        $(stickyBottom).addClass('sticky-footer');
        $(stickyLeft).addClass('sticky-cell');
        $(stickRight).addClass('sticky-cell-opposite');

        return true;
    };

    var initStickyTable = function() {
        if (createStructureTable())
            stickyTable();
    };

    jQuery(document).on('sticky-table', stickyTable);
    jQuery(document).on('init-sticky-table', initStickyTable);

    $(function() {
        tableSticky = $('.table');
        $(document).trigger("init-sticky-table");

        tableSticky.parent().scroll(function() {
            $(document).trigger("sticky-table");
        });
    });

    var timeoutId;
    $(window).resize(function() {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(function() {
            $('.wrapper').trigger("sticky-table");
        }, 500);
    });
}));