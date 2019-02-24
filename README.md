# Sticky Table

Sticky Table is a jQuery plugin that gives you the ability to make any table element  on your page always stay visible.

## Demo

 <a target="_blank" href="https://lethevinh.github.io/sticky-table/dist/all.html">Full Sticky</a> , 
 <a target="_blank" href="https://lethevinh.github.io/sticky-table/dist/left-top.html">Sticky Left Top</a> , 
 <a target="_blank" href="https://lethevinh.github.io/sticky-table/dist/top-bottom.html">Sticky Top Bottom</a> , 
 <a target="_blank" href="https://lethevinh.github.io/sticky-table/dist/top-right.html">Sticky Top Right</a> , 
 <a target="_blank" href="https://lethevinh.github.io/sticky-table/dist/left-right.html">Sticky Left Right</a> 
 
## Usage

- Include jQuery & Sticky Table.
- Call Sticky Table.

Create table like hmtl example: 
 - Class name `.sticky-table`  
 - Attribute : `data-sticky-top`,`data-sticky-left`,`data-sticky-right`,`data-sticky-bottom`
```html
<script src="jquery.js"></script>
<script src="sticky.js"></script>
<link rel="stylesheet" type="text/css" href="../stickytable.css">

<table class="table-sticky" 
data-sticky-top="thead tr" 
data-sticky-left="tbody tr td:first-child, tr th:first-child"  
data-sticky-bottom="tfoot tr" 
data-sticky-rigth="tbody tr td:last-child, tr th:last-child">
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
Or Call function `sticky(option)`
```html
 $('.selector-table').sticky({
    top:"",
    bottom:"",
    left:"",
    right:""
 });
```
 ####Options 
  - `top`: selectors row need sticky header.(eg:`table tr:first-child`)<br>
  - `bottom`: selectors row need sticky footer(eg:`table tr:last-child`)<br>
  - `left`: selectors row need sticky Left.(eg:`table tr td:first-child`)<br>
  - `right`: selectors row need sticky Right(eg:`table tr td:last-child`)<br>

## Methods

- `sticky(options)`: Initializer. `options` is optional.
- `sticky()`: Initializer. `options` is optional.
- `unstick()`: Recalculates the element's position.

## Events

- `sticky-table-start`: When the element becomes Sticky Table.
- `sticky-table-sucsses`: When the element becomes Sticky Table.
- `sticky-table-removed`: When the element becomes Sticky Table.