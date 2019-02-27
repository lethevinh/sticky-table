declare var window: any;
declare var Math;
declare var Event;

window.stickies = {};

var $ = jQuery;

export var CLASS = {
    "wrapper": "wrapper-sticky",
    "wrapperLTR": "sticky-ltr-cells",
    "wrapperRTL": "sticky-rtl-cells",
    "tableSticky": "table-sticky"
};

export var EVENTS = {
    responsiveSusses: 'stk:responsive-susses',
    responsiveStart: 'stk:responsive-start',
    scrolling: 'stk:scrolling',
    initSusses: 'stk:init-susses',
    initStart: 'stk:init-start',
    removeSusses: 'stk:remove-susses',
};

export class StickyTable {

    id: string;

    config: any = {
        table: "",
        stickies: {}
    };

    tableSticky: any;

    wrapperSticky: any;

    constructor(config: any) {

        this.config = config;
        this.tableSticky = $(config.table);
        if (!this.tableSticky.length) {
            console.warn('Page is missing a sticky table region');
        }
        this.id = "stk-" + Math.random(200, 1000);
        if (!this.tableSticky.parent().hasClass(CLASS.wrapper)) {
            this.tableSticky.wrap('<div class="' + CLASS.wrapper + ' skt-sticky-ltr-cells" id="' + this.id + '"></div>');
        }

        this.tableSticky.attr('data-id-stk', this.id);
        window.stickies[this.id] = this;

        this.wrapperSticky = this.tableSticky.parent('.' + CLASS.wrapper);

        this.registerEventListeners();

        this.tableSticky.trigger(EVENTS.initStart, { stickytable: this });

        var $this = this;

        this.wrapperSticky.scroll(function() {
            $this.tableSticky.trigger(EVENTS.scrolling, { stickytable: $this });
        });

        var timeoutId;
        $(window).resize(function() {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(function() {
                $this.tableSticky.trigger(EVENTS.responsiveStart, { stickytable: $this });
            }, 500);
        });

        this.tableSticky.trigger(EVENTS.initSusses, { stickytable: this });
    }

    registerEventListeners() {

        $(this.tableSticky).on(EVENTS.initStart, function(event, data) {
            var stickyTable = data.stickytable;
            stickyTable.initStickyTable();
            stickyTable.handleResponsiveSticky();
        });

        $(this.tableSticky).on(EVENTS.responsiveStart, function(event, data) {
            var stickyTable = data.stickytable;
            stickyTable.handleResponsiveSticky();
        });

        $(this.tableSticky).on(EVENTS.scrolling, function(event, data) {
            var stickyTable = data.stickytable;
            stickyTable.handleSupportPositionSticky();
        });
    };

    initStickyTable() {
        var stickies = this.config.stickies;
        var $this = this;
        $.each(stickies, function(position: string, stickySelector) {
            $this.tableSticky.find(stickySelector).addClass('skt-sticky-' + position);
        });

    };

    handleResponsiveSticky() {
        console.log('response sticky');
        this.tableSticky.trigger(EVENTS.responsiveSusses, { stickytable: this });
    };

    handleRemoveSticky() {
        var stickies = this.config.stickies;
        var $this = this;
        this.tableSticky.unwrap();
        this.tableSticky.removeAttr('data-id-stk');

        $.each(stickies, function(position: string, stickySelector) {
            $this.tableSticky.find(stickySelector).removeClass('skt-sticky-' + position);
        });

        $.each(EVENTS, function(key, event) {
            $this.tableSticky.off(event);
        });

        $(this.tableSticky).trigger(EVENTS.removeSusses, { stickytable: this });
    };
    handleSupportPositionSticky() {
    	
        console.log('scrolling sticky');
        // Multi Position Sticky


        // Cross Browser

        var positionStickySupport = this.positionStickySupport();

        var scrollTypeRTL = this.scrollTypeRTL();

        if (!positionStickySupport) {
            this.handelNotPositionStickySupport();

        }

        if ($(CLASS.wrapperRTL).length && !(positionStickySupport && scrollTypeRTL === 'negative')) {

            if (positionStickySupport) {
                $(".st-sticky-rtl-cells table th.st-sticky-left").css('position', "relative");
                $(".st-sticky-rtl-cells table td.st-sticky-left").css('position', "relative");
                $(".st-sticky-rtl-cells table th.st-sticky-right").css('position', "relative");
                $(".st-sticky-rtl-cells table td.st-sticky-right").css('position', "relative");

                $(CLASS.wrapper).scroll(function() {
                    $(this).find("table tr.st-sticky-top .st-sticky-left").css('top', $(this).scrollTop());
                    $(this).find("table tr.st-sticky-top .st-sticky-right").css('top', $(this).scrollTop());
                    var maxScroll = $(this).find("table").prop("clientHeight") - $(this).prop("clientHeight");
                    $(this).find("table tr.st-sticky-bottom .st-sticky-left").css('bottom', maxScroll - $(this).scrollTop());
                    $(this).find("table tr.st-sticky-bottom .st-sticky-right").css('bottom', maxScroll - $(this).scrollTop());
                }).scroll();
            }
            $(CLASS.wrapperRTL).scroll(function() {
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

    handleSupportScrollTypeRTL() {

    };

    handelNotPositionStickySupport() {
        if (navigator.userAgent.match(/Trident\/7\./)) {
            $(CLASS.wrapper).on("mousewheel", function(event: any) {
                event.preventDefault();
                var wd = event.originalEvent.wheelDelta;
                var csp = $(this).scrollTop();
                $(this).scrollTop(csp - wd);
            });
        }

        $(CLASS.wrapper).scroll(function() {
            $(this).find("table tr.st-sticky-top th").css('top', $(this).scrollTop());
            $(this).find("table tr.st-sticky-top td").css('top', $(this).scrollTop());
            var maxScroll = $(this).find("table").prop("clientHeight") - $(this).prop("clientHeight");
            $(this).find("table tr.st-sticky-bottom th").css('bottom', maxScroll - $(this).scrollTop());
            $(this).find("table tr.st-sticky-bottom td").css('bottom', maxScroll - $(this).scrollTop());
        }).scroll();

        $(CLASS.wrapperLTR).scroll(function() {
            $(this).find("table th.st-sticky-left").css('left', $(this).scrollLeft());
            $(this).find("table td.st-sticky-left").css('left', $(this).scrollLeft());
            var maxScroll = $(this).find("table").prop("clientWidth") - $(this).prop("clientWidth");
            $(this).find("table th.st-sticky-right").css('right', maxScroll - $(this).scrollLeft());
            $(this).find("table td.st-sticky-right").css('right', maxScroll - $(this).scrollLeft());
        }).scroll();

    };

    scrollTypeRTL() {
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
    };


    positionStickySupport() {
        var el = document.createElement('a'),
            mStyle = el.style;
        mStyle.cssText = "position:sticky;position:-webkit-sticky;position:-ms-sticky;";
        return mStyle.position.indexOf('sticky') !== -1;
    };

}