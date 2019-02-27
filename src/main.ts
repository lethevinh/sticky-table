require('./style/sticky-table.css');
import { StickyTable, CLASS } from './script/sticky-table';
require('./script/jquery');

$(document).ready(function() {
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