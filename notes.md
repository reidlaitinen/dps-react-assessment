Started: 2018-04-04 7:30 PM

2018-04-04 10:52 PM: 
  Preparing Beers.js for infinite-scroll pagination.

2018-04-05 11:25 PM:
  Beers component infinite scroll works
  Show labels if they have them, icons if not
  Click a row & get a modal that shows beer info
    - modal shows labels if present, icon if not


remarks:
  - why do I have to check presence of .styles before I can use any of it?


TODOS (Little)
  + Finish beer info modal info / styling / layout
    - ABV, IBUs, etc _below_ description
  + Fix beer list table header alignment
  + Fix beer modal alignment
    - too high up. closeIcon shows up with its head cut off
  + ABV min/max avg if ABV not specified
    - duh, just use a helper method... getAbv(entry)

TODOS (Medium)
  + Setup Breweries / info
    - use cards instead of list?

TODOS (Big)
  + Beer name search
  + Beer style filter
  + Beer minimum ABV filter