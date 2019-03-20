require('./style/sticky-table.css');
import $ from './script/jquery';
import {CLASS} from "./script/sticky-table";

if ($) {
    $(document).ready(function () {
        let tableSticky = $('.' + CLASS.tableSticky);
        if (tableSticky.length > 0) {
            tableSticky.sticky({
                top: tableSticky.data('sticky-top'),
                bottom: tableSticky.data('sticky-bottom'),
                left: tableSticky.data('sticky-left'),
                right: tableSticky.data('sticky-right'),
            });
        }
    });
} else {
    console.warn("Please include jquery library");
}