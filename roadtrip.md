## road trip for Rummikub

1. [angular]

2. [js] how to judge whether it is an empty object
  ```javascript
  if (Object.keys(params).length === 0) {
    // object (or associated arry ) params has nothing
  }
  ```
3. [boostrap data-toggle] data-toggle="collapse" 
  ```html
  <button type="button" data-toggle="collapse" data-target="#undercontrol"> collapse button </button>
  <div id="#undercontrol">I will collapse when above button is clicked.</div>
  ```
4. [angular] limit number of items when ng-repeat: (limitTo: int)
  ```html
   <div class="" ng-repeat="tile in opponent_top | limitTo: 20">
    {{tile.score}}
   </div>
  ```

5. [css] resize text font according to window
   font-size=4vmim;   /min of (view width, view height)