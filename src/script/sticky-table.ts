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

    isPositionStickySupport: any;

    constructor(config: any) {

        this.config = config;
        this.tableSticky = $(config.table);
        this.isPositionStickySupport = this.positionStickySupport();

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

        if (!this.isPositionStickySupport) {
            this.handelNotPositionStickySupport();
        }

        this.tableSticky.trigger(EVENTS.initSusses, { stickytable: this });
    }

    registerEventListeners() {

        $(this.tableSticky).on(EVENTS.initStart, function(event, data) {
            var stickyTable = data.stickytable;
            stickyTable.initStickyTable();
            stickyTable.handleResponsiveSticky();
            stickyTable.handleScrollSticky();
        });

        $(this.tableSticky).on(EVENTS.responsiveStart, function(event, data) {
            var stickyTable = data.stickytable;
            stickyTable.handleResponsiveSticky();
        });

        $(this.tableSticky).on(EVENTS.scrolling, function(event, data) {
            var stickyTable = data.stickytable;
            stickyTable.handleScrollSticky();
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

    handleScrollSticky() {

        // Multi Position Sticky // ???
        // Cross Browser
        var $this = this;
        if (!this.isPositionStickySupport) {
            if (navigator.userAgent.match(/Trident\/7\./)) {
                $(CLASS.wrapper).on("mousewheel", function(event: any) {
                    event.preventDefault();
                    var wd = event.originalEvent.wheelDelta;
                    var csp = $(this).scrollTop();
                    $(this).scrollTop(csp - wd);
                });
            }

            $(this.tableSticky).on(EVENTS.scrolling, function(event, data) {
                var stickyTable = data.stickytable;
                stickyTable.handelNotPositionStickySupport();
            });

            $(".sticky-ltr-cells").scroll(function() {
                $(this).find("table th.skt-sticky-left").css('left', $(this).scrollLeft());
                $(this).find("table td.skt-sticky-left").css('left', $(this).scrollLeft());
                var maxScroll = $(this).find("table").prop("clientWidth") - $(this).prop("clientWidth");
                $(this).find("table th.skt-sticky-right").css('right', maxScroll - $(this).scrollLeft());
                $(this).find("table td.skt-sticky-right").css('right', maxScroll - $(this).scrollLeft());
            });
        }
    };

    handelNotPositionStickySupport() {
        this.wrapperSticky.find("table tr.skt-sticky-top th").css('top', this.wrapperSticky.scrollTop());
        this.wrapperSticky.find("table tr.skt-sticky-top td").css('top', this.wrapperSticky.scrollTop());
        var maxScroll = this.wrapperSticky.find("table").prop("clientHeight") - this.wrapperSticky.prop("clientHeight");
        this.wrapperSticky.find("table tr.skt-sticky-bottom th").css('bottom', maxScroll - this.wrapperSticky.scrollTop());
        this.wrapperSticky.find("table tr.skt-sticky-bottom td").css('bottom', maxScroll - this.wrapperSticky.scrollTop());
    };

    positionStickySupport() {
        var el = document.createElement('a'),
            mStyle = el.style;
        mStyle.cssText = "position:sticky;position:-webkit-sticky;position:-ms-sticky;";
        return mStyle.position.indexOf('sticky') !== -1;
    };
}