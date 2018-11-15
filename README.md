# kniskern_blechdel
Re-analyzing the Blchdel test

Dataset from Sharon Brener
https://data.world/sharon/bechdel-test


Inspiring data projects on Women in Film
https://pudding.cool/2017/03/film-dialogue/index.html
https://www.refinery29.com/2018/06/201674/bechdel-test-duvernay-women-representation-movies
https://projects.fivethirtyeight.com/next-bechdel/


I chose this dataset from Data.World because it included other related datasets and was, for the most part, already cleaned. I did need to remove some rows with null values for the budget before using the data.

I chose to create two graphs ultimately:
(1) A Bar Graph
This chart displayed the amount of movies, the amount that passed the bechdel test, and the budget of those movies by year. By allowing the user to change which was displayed, and keeping the scales between movies and passing movies the same, it was obvious to the user the large disparity of movies that passed the test. A hoverable tooltip also showed the mathematical percentage of passing movies. By focusing on only lines and and length as marks and channels, the comparison is obvious to the user. A two-bar bar chart for each year may have been more successful.

(2) A Scatter Plot
This chart compared the budget of the film to the domestic earnings of the film. Using the color channel to distinguish between passing and failing movies allows the user to process the distribution of passing movies with a cursory glance. This is meant to invite the user to draw their own conclusion about the results of this comparison.

Problem Spots (Written at 4:48 am):
I wanted to change the tooltip when the graph was switched but ultimately should have referenced a different div instead of trying to resuse the already populated one.

My intention with the scatter plot was to have a dividing line that would appear on mouseover (the beginning of this work is commented out in scatter.js) and follow the mouse as a horizontal rule showing which percentage of movies above that gross amount passed the bechdel test.

Tried to make the page responsive, some wins and some losses.

Things I'm Proud Of:
The story is a focal point of the project. Although it is word heavy, it contains relevant points and is divided into digesteable chunks. The layout of the HTML page is also satisfactory.

Dynamic title and description for the bar graph. With the exception of the budget tooltip, this bar graph turned out very nicely and illustrates the correlation between the displayed data well. 