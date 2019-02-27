declare var window: any;
declare var Math;

window.stickies = {};

import { StickyTable } from './sticky-table';

interface JQuery {
    sticky(options: Object): JQuery;
    unstick(): JQuery;
}

$.fn.extend({
    sticky: function(options: any) {

        if (this.length == 0 || !$(this).is('table')) {
            console.warn('find not found table sticky');
            return;
        }

        new StickyTable({
            table: this,
            stickies: options
        });

        return this;
    },
    unstick: function() {
        if (this.length == 0 || !$(this).is('table')) {
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
    }
});