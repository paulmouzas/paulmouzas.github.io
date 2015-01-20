---
layout: post
title: 'Coding Every Day'
---
I'm going to challenge myself by writing code every day. It's going to be difficult but I think it's necessary to practice every day to get to where I want to be. Even if all I do is write a little script to solve a puzzle, I must write some code once a day, for at least 30 minutes. I don't think any less than 30 minutes will help much because I find it takes around 15 minutes to get in a flow state.

I have one large program that I'm working on. It's a [blogging application](http://blogodrone.herokuapp.com) built with Django. It's a work in progress but I think it's coming along nicely. I will try and focus on that. 

One of my weaknesses as a programmer I feel is that I don't write enough tests. I'm learning that as a program gets larger and more complex, writing tests is essential. There's no way I can manually check for bugs every time I edit some code. I think if I write some tests every day, it will greatly improve my code and allow me to catch bugs before they start to cause a problem.

For today, I wrote a script to solve one of reddit.com's daily programmer puzzles. The program takes two words as inputs. Here's the description from the puzzle:

> I had a dream a few weeks back that I thought would be a good challenge. I woke up early and quickly typed up a text description so I wouldn't forget (Seriously, it was about 5am and when I explained it to my wife she just laughed at me)
Okay so there is a valley. On each side you got cannons. They are firing words at each other. In the middle of the valley the words would make contact and explode. Similar letters from each word would cancel out. But the left over unique letters from each word would fall to the valley and slowly fill it up.
> So your challenge is to come up with the code given two words you eliminate letters in common at a ratio of 1 for 1 and produce a set of letters that are left over from each word after colliding in mid air. Which ever side has the most letters left over "wins". If each side donates an equal amount of letters it is a "tie".

{% highlight python %}
left, right = raw_input("Enter two words separated by spaces: ").split()

left_list = list(left)
right_list = list(right)

chr_array = left_list + right_list

for i in range(len(chr_array)):
    if chr_array[i] in left_list and chr_array[i] in right_list:
        for left_idx in range(len(left_list)) :
            if chr_array[i] == left_list[left_idx]:
                left_list[left_idx] = ''
                break
        for right_idx in range(len(right_list)):
            if chr_array[i] == right_list[right_idx]:
                right_list[right_idx] = ''
                break

if len_left > len_right:
    print 'Left wins'
elif len_left < len_right:
    print 'Right wins'
else:
    print 'Tie'
{% endhighlight %}