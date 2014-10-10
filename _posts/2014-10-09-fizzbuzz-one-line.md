---
layout: post
title: FizzBuzz in One Line
---
Ahhh the infamous FizzBuzz test. Nothing like a useless quiz that tells you absolutely nothing about your programming abilities. I have read that there are actually programmers (or people that call themselves programmers) that actually cannot create a FizzBuzz program. Pretty hard to believe.

Here is my version of FizzBuzz using a conditional expression.

{% highlight python %}
print '\n'.join(['FizzBuzz' if x%15==0 else 'Fizz' if x%3==0 else 'Buzz' if x%5=0 else str(x) for x in range(1, 101)])
{% endhighlight %}
