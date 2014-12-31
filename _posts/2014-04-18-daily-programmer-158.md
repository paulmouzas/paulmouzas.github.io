---
layout: post
title: ! 'Daily Programmer #158'
categories: []
tags: []
status: publish
type: post
published: true
meta:
  _edit_last: '1'
author:
  login: paul
  email: paul.mouzas@gmail.com
  display_name: paul
  first_name: ''
  last_name: ''
---
This was Reddit's intermediate daily programmer challenge #158. The challenge is take input like this:

j3f3e3e3d3d3c3cee3c3c3d3d3e3e3f3fjij3f3f3e3e3d3d3c3cee3c3c3d3d3e3e3fj

And turn it into ASCII art that looks like this:</p>

    .                 . .                 .
    .*              **...**              *.
    .***          ****...****          ***.
    *-----      ------***------      -----*
    *-------  --------***--------  -------*
    *+++++++**++++++++***++++++++**+++++++*
    -+++++++--++++++++---++++++++--+++++++-
    -       --        ---        --       -
    +       ++        +++        ++       +
    +       ++        +++        ++       +

Each character in the input is either a digit, or a letter from 'a' to 'j'. 'j' represents a string that looks like this:</p>

    ...***--++

Which, if you look carefully at the ASCII art, is a string of the largest columns. Each letter before the letter 'j' represents a smaller slice of that string, so that:

    'j' is '...***--++'
    'i' is '..***--++'<br />
    'h' is '.***--++'<br />
    'g' is '***--++'
    
And so on until 'a', which is '+'.

Each digit in the input will be the amount white space below the column. The input in our example only has the digit 3. You'll notice in the example that the space below each raised column from the 'ground' is 3. 

Here is what the code will look like:

{% highlight python %}

letts = '...***--++'
ans = ['']*10
user_input = raw_input()

for i in range(len(input)):
    if user_input[i].isalpha():
    
        top_space = ord('j') - ord(user_input[i])
        slice = letts[top_space:]
        bottom_space = user_input[i-1] if user_input[i-1].isdigit() else 0
        bottom_space = int(bottom_space)
        line = (' '*(top_space-bottom_space))+slice+(' ' * bottom_space)

        for j in range(10):
            ans[j] += line[j]

print '\n'.join(ans)

{% endhighlight %}

First, we'll create a variable letts that will hold this string (this is what would be the largest column): 

    ...***--++ 

The next line creates a list of 10 empty strings that will represent each row of the ASCII art. We choose 10 because that is how long the longest column will be.

Now we iterate through the length of the user\_input. If the i index of user\_input is not a letter of the alphabet, we ignore it and move on. 

We need to calculate how much white space will go on top of this column. We can do this by finding the difference of the Unicode point characters of 'j' and whatever character user\_input[i] is. We'll store this in a variable called top\_space, because this white space will be added to the top of the column.

We can also use top\_space to find the slice of letts we need for this column.

{% highlight python %}

slice = letts[top_space:]

{% endhighlight %}

The bottom white space will simply be the the digit before user\_input\[i] (this will simply be user\_input[i-1]). If it is not a digit, the bottom white space will default to zero, so that our column will all the way at the bottom.

To make sure our columns are the correct length, we will need to minus the top white space by the bottom white space. We can now create our column by concatenating the top white space, the slice of letts, and the bottom white space. 

Now, all that's left to do is add each character of line (which is a piece of the whole column) to ans.

Print out the result and enjoy the ASCII art.