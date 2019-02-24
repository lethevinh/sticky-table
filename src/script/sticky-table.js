require('../style/sticky-table.css');
var tableSticky;
var wrapperSticky;

const CLASS = {
    "wrapper": "wrapper-sticky",
    "wrapperLTR": "sticky-ltr-cells",
    "wrapperRTL": "sticky-rtl-cells",
    "tableSticky": "table-sticky"
};

var defaultOptions = {
    top: "",
    left: "",
    right: "",
    bottom: ""
};

var handleNotPositionSticky = function () {

    var positionStickySupport = function () {
        var el = document.createElement('a'),
            mStyle = el.style;
        mStyle.cssText = "position:sticky;position:-webkit-sticky;position:-ms-sticky;";
        return mStyle.position.indexOf('sticky') !== -1;
    }();

    var scrollTypeRTL = function () {
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
            $(CLASS.wrapper).on("mousewheel", function (event) {
                event.preventDefault();
                var wd = event.originalEvent.wheelDelta;
                var csp = $(this).scrollTop();
                $(this).scrollTop(csp - wd);
            });
        }

        $(CLASS.wrapper).scroll(function () {
            $(this).find("table tr.st-sticky-top th").css('top', $(this).scrollTop());
            $(this).find("table tr.st-sticky-top td").css('top', $(this).scrollTop());
            var maxScroll = $(this).find("table").prop("clientHeight") - $(this).prop("clientHeight");
            $(this).find("table tr.st-sticky-bottom th").css('bottom', maxScroll - $(this).scrollTop());
            $(this).find("table tr.st-sticky-bottom td").css('bottom', maxScroll - $(this).scrollTop());
        }).scroll();

        $(CLASS.wrapperLTR).scroll(function () {
            $(this).find("table th.st-sticky-left").css('left', $(this).scrollLeft());
            $(this).find("table td.st-sticky-left").css('left', $(this).scrollLeft());
            var maxScroll = $(this).find("table").prop("clientWidth") - $(this).prop("clientWidth");
            $(this).find("table th.st-sticky-right").css('right', maxScroll - $(this).scrollLeft());
            $(this).find("table td.st-sticky-right").css('right', maxScroll - $(this).scrollLeft());
        }).scroll();
    }

    if ($(CLASS.wrapperRTL).length && !(positionStickySupport && scrollTypeRTL === 'negative')) {

        if (positionStickySupport) {
            $(".st-sticky-rtl-cells table th.st-sticky-left").css('position', "relative");
            $(".st-sticky-rtl-cells table td.st-sticky-left").css('position', "relative");
            $(".st-sticky-rtl-cells table th.st-sticky-right").css('position', "relative");
            $(".st-sticky-rtl-cells table td.st-sticky-right").css('position', "relative");

            $(CLASS.wrapper).scroll(function () {
                $(this).find("table tr.st-sticky-top .st-sticky-left").css('top', $(this).scrollTop());
                $(this).find("table tr.st-sticky-top .st-sticky-right").css('top', $(this).scrollTop());
                var maxScroll = $(this).find("table").prop("clientHeight") - $(this).prop("clientHeight");
                $(this).find("table tr.st-sticky-bottom .st-sticky-left").css('bottom', maxScroll - $(this).scrollTop());
                $(this).find("table tr.st-sticky-bottom .st-sticky-right").css('bottom', maxScroll - $(this).scrollTop());
            }).scroll();
        }
        $(CLASS.wrapperRTL).scroll(function () {
            var maxScroll = $(this).find("table").prop("clientWidth") - $(this).prop("clientWidth");
            switch (scrollTypeRTL) {
                case "default": // webKit Browsers
                    $(this).find("table th.st-sticky-left").css('right', maxScroll - $(this).scrollLeft());
                    $(this).find("table td.st-sticky-left").css('right', maxScroll - $(this).scrollLeft());
                    $(this).find("table th.st-sticky-right").css('left', $(this).scrollLeft());
                    $(this).find("table td.st-sticky-right").css('left', $(this).scrollLeft());
                    break;
                case "negative": // Firefox, Opera
                    $(this).find("table th.st-sticky-left").css('right', $(this).scrollLeft() * -1);
                    $(this).find("table td.st-sticky-left").css('right', $(this).scrollLeft() * -1);
                    $(this).find("table th.st-sticky-right").css('left', maxScroll + $(this).scrollLeft());
                    $(this).find("table td.st-sticky-right").css('left', maxScroll + $(this).scrollLeft());
                    break;
                case "reverse": // IE, Edge
                    $(this).find("table th.st-sticky-left").css('right', $(this).scrollLeft());
                    $(this).find("table td.st-sticky-left").css('right', $(this).scrollLeft());
                    $(this).find("table th.st-sticky-right").css('left', maxScroll - $(this).scrollLeft());
                    $(this).find("table td.st-sticky-right").css('left', maxScroll - $(this).scrollLeft());
            }
        }).scroll();
    }
};

var addStructuringSticky = function (tableSticky, params = {}) {

    if (tableSticky.parent().hasClass(CLASS.wrapper) || tableSticky.length === 0) {
        return false;
    }

    tableSticky.wrap('<div class="' + CLASS.wrapper + ' st-sticky-ltr-cells"></div>');

    if ($.isEmptyObject(params)) {
        for (let position in defaultOptions) {
            let valueSelector = tableSticky.data('sticky-' + position);
            $(valueSelector).addClass('st-sticky-' + position);
        }
    }

    let options = $.extend({}, defaultOptions, params);
    for (let position in defaultOptions) {
        let valueSelector = options[position];
        $(valueSelector).addClass('st-sticky-' + position);
    }

    return true;
};

var removeStructuringSticky = function (event, table) {
    tableSticky = $(table);

    if (!tableSticky.parent().hasClass(CLASS.wrapper)) {
        return false;
    }

    for (position in defaultOptions) {
        $('.st-sticky-' + position).removeClass('st-sticky-' + position);
    }

    tableSticky.off("sticky-table-susses");
    tableSticky.off("sticky-table-start");
    tableSticky.trigger("sticky-table-removed");
    tableSticky.off("sticky-table-removed");
};

var initStickyTable = function (event, args = {}) {
    let tableSticky = args.tableSticky;

    tableSticky.trigger("sticky-table-start");
    if (addStructuringSticky(tableSticky, args.options)) {
        wrapperSticky = tableSticky.parent();
        handleNotPositionSticky();
        tableSticky.parent().scroll(function () {
            $(document).trigger("_sticky-table");
        });
    }
    tableSticky.trigger("sticky-table-susses");
};

$(document).on('_sticky-table', handleNotPositionSticky);
$(document).on('_add-sticky-table', initStickyTable);
$(document).on('_remove-sticky-table', removeStructuringSticky);

$(function () {
    let tableSticky = $('.' + CLASS.tableSticky);

    if (tableSticky.length > 0) {
        tableSticky.trigger("_add-sticky-table", {tableSticky: tableSticky});
    }

});

var timeoutId;
$(window).resize(function () {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
        $(CLASS.wrapper).trigger("_sticky-table");
    }, 500);
});

$.fn.sticky = function (options = {}) {
    let tableSticky = $(this);
    tableSticky.trigger("_add-sticky-table", {tableSticky: tableSticky, options: options});
};

$.fn.unstick = function () {
    $(this).trigger("_remove-sticky-table", this);
};

