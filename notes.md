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
  - why did I have to use some style hack to fix the modal alignment?
    see: https://github.com/Semantic-Org/Semantic-UI-React/issues/2584
  


TODOS (Little)
  + Fix beer list table header alignment
  + Fix beer modal alignment
    - too high up. closeIcon shows up with its head cut off

TODOS (Medium)
  + Responsive stuff (computer/tablet/phone)

TODOS (Big)
  + Beer name search
  + Beer style filter
  + Beer minimum ABV filter