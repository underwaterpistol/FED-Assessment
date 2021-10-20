# UWP Frontend Technical Assessment
(Submitted by Mord Maman)

## Notes

After receiving the response, we run through each object recieved and deconstruct it to access the required properties.

These are then used to construct each card and set the HTML content on the page.

The cards were then styled using CSS Grid for the layout, and BEM for the naming convention. 

I did modify the query to return more than 3 products to see how the layout would respond and have left appropriate media queries to accomodate. I did return it back to 3 after checking.

I noticed that upon repeated clicks of the fetchButton the amount of products would get longer, so I added a line on Line 11 in script.js to clear the innerHTML before adding the cards.  

Thank you!