# Sticky Table

Sticky Table is a jQuery plugin that gives you the ability to make any table element  on your page always stay visible.

## Sticky Table in brief

This is how it works:

- When the target element is about to be hidden, the plugin will add the class `className` to it (and to a wrapper added as its parent), set it to `position: fixed` and calculate its new `top`, based on the element's height, the page height and the `topSpacing` and `bottomSpacing` options.
- That's it. 
In some cases you might need to set a fixed width to your element when it is "sticked".
But by default (`widthFromWrapper == true`) Sticky Table updates elements's width to the wrapper's width.
Check the `example-*.html` files for some examples.

## Usage

- Include jQuery & Sticky Table.
- Call Sticky Table.

```html
<script src="jquery.js"></script>
<script src="sticky.js"></script>

<table class="table-sticky" data-sticky-top="thead tr" data-sticky-left="tbody tr td:first-child, tr th:first-child"  data-sticky-bottom="tfoot tr" data-sticky-rigth="tbody tr td:last-child, tr th:last-child">
    <thead>
        <tr>
            <th>Sticky</th>
            <th>header</th>
            <th>header</th>
        </tr>
    </thead>
    <tbody>
        <tr>
           <th>Data</th>
           <th>Data</th>
           <th>Data</th>
        </tr>
    </tbody>
    <tfoot>
        <tr>
           <th>Sticky</th>
           <th>Footer</th>
           <th>Footer</th>
         </tr>
    </tfoot>
</table>
```

## Options

- `topSpacing`: (default: `0`) Pixels between the page top and the element's top.
- `bottomSpacing`: (default: `0`) Pixels between the page bottom and the element's bottom.
- `className`: (default: `'is-Sticky Table'`) CSS class added to the element's wrapper when "sticked".
- `wrapperClassName`: (default: `'Sticky Table-wrapper'`) CSS class added to the wrapper.
- `center`: (default: `false`) Boolean determining whether the Sticky Table element should be horizontally centered in the page.
- `getWidthFrom`: (default: `''`) Selector of element referenced to set fixed width of "Sticky Table" element.
- `widthFromWrapper`: (default: `true`) Boolean determining whether width of the "Sticky Table" element should be updated to match the wrapper's width. Wrapper is a placeholder for "Sticky Table" element while it is fixed (out of static elements flow), and its width depends on the context and CSS rules. Works only as long `getWidthForm` isn't set.
- `responsiveWidth`: (default: `false`) Boolean determining whether widths will be recalculated on window resize (using getWidthfrom).
- `zIndex`: (default: `inherit`) controls z-index of the sticked element.

## Methods

- `init(options)`: Initializer. `options` is optional.
- `update('update')`: Recalculates the element's position.

## Events

- `init-sticky-table`: When the element becomes Sticky Table.
- `sticky-table`: When the element becomes Sticky Table.
- `sticky-table-start`: When the element becomes Sticky Table.
- `sticky-table-end`: When the element returns to its original location
- `sticky-table-update`: When the element is sticked but position must be updated for constraints reasons
- `sticky-table-top`: When the element reached the bottom space limit
- `sticky-table-bottom`: When the element reached the bottom space limit
- `sticky-table-left`: When the element reached the bottom space limit
- `sticky-table-right`: When the element reached the bottom space limit
- `sticky-bottom-reached`: When the element reached the bottom space limit
- `sticky-bottom-unreached`: When the element unreached the bottom space limit
