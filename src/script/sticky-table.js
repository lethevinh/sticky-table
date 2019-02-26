require('../style/sticky-table.css');

window.stickies = {};

var CLASS = {
    "wrapper": "wrapper-sticky",
    "wrapperLTR": "sticky-ltr-cells",
    "wrapperRTL": "sticky-rtl-cells",
    "tableSticky": "table-sticky"
};

var EVENTS = {
    responsiveSusses: 'stk:responsive-susses',
    responsiveStart: 'stk:responsive-start',
    scrolling: 'stk:scrolling',
    initSusses: 'stk:init-susses',
    initStart: 'stk:init-start',
    removeSusses: 'stk:remove-susses',
};

var StickyTable = function(config) {

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
};

StickyTable.prototype.registerEventListeners = function() {

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

StickyTable.prototype.initStickyTable = function() {
    var stickies = this.config.stickies;
    var $this = this;
    $.each(stickies, function(position, stickySelector) {
        $this.tableSticky.find(stickySelector).addClass('skt-sticky-' + position);
    });
    
};

StickyTable.prototype.handleResponsiveSticky = function() {
    console.log('response sticky');
    this.tableSticky.trigger(EVENTS.responsiveSusses, { stickytable: this });
};

StickyTable.prototype.handleSupportPositionSticky = function() {
    console.log('scrolling sticky');
    // Multi Position Sticky
    // Cross Browser
};

StickyTable.prototype.handleRemoveSticky = function() {
    var stickies = this.config.stickies;
    var $this = this;
    this.tableSticky.unwrap();
    this.tableSticky.removeAttr('data-id-stk');

    $.each(stickies, function(position, stickySelector) {
        $this.tableSticky.find(stickySelector).removeClass('skt-sticky-' + position);
    });

    $.each(EVENTS, function(key, event) {
        $this.tableSticky.off(event);
    });

    $(this.tableSticky).trigger(EVENTS.removeSusses, { stickytable: this });
};

$(function() {
    let tableSticky = $('.' + CLASS.tableSticky);
    if (tableSticky.length > 0) {
        new StickyTable({
            table: tableSticky,
            stickies: {
                top: tableSticky.data('sticky-top'),
                bottom: tableSticky.data('sticky-bottom'),
                left: tableSticky.data('sticky-left'),
                right: tableSticky.data('sticky-right'),
            }
        });
    }
});

$.fn.sticky = function(option = {}) {

    if ($(this).length == 0 || !$(this).is('table')) {
        console.warn('find not found table sticky');
        return;
    }

    var config = {
        table: this,
        stickies: option
    }
    new StickyTable(config);

    return this;
};

$.fn.unstick = function() {
    if ($(this).length == 0 || !$(this).is('table')) {
        console.warn('find not found table sticky');
        return;
    }

    var id = $(this).data("id-stk");
    var tableSticky = window.stickies[id];

    if (typeof id === 'undefined' || typeof tableSticky === 'undefined') {
        console.warn('find not found instance table sticky');
        return;
    }

    tableSticky.handleRemoveSticky();
    window.stickies[id] = {};
};