---
layout: post
title: Recursion with Memoization
---
I've mentioned before that I hardly ever use recursion in any of code. I find that a recursive solution to my programming problems hardly ever comes up. Even so, I love study it and create interesting scripts that use it. One very elegant use of the recursion is to create a program to print out the Fibonacci sequence up to the nth place. It is almost too beautiful:

{% highlight python %}
def fib(n):
    if n < 2:
        return n
    return fib(n - 2) + fib(n - 1)
{% endhighlight %}

Although there is no denying the elegance of this simple little script, it comes with a major problem. This program will take a *long* time to complete. The reason is that it makes a lot of unnecessary calls to itself. The time complexity of this algorithm is exponential. 

Here is how long it takes for my computer to computer to compute the above fib function for different inputs of n.

fib(28): 0.125 seconds

fib(29): 0.203000068665 seconds

fib(30): 0.328999996185 seconds

fib(31): 0.532999992371 seconds

fib(32): 0.870000123978 seconds

fib(33): 1.40999984741 seconds

fib(34): 2.26899981499 seconds

fib(35): 3.6819999218 seconds

fib(36): 5.95000004768 seconds

fib(37): 9.6210000515 seconds

fib(38): 15.5989999771 seconds

fib(39): 25.1229999065 seconds

As you can see, as n goes up, the time it takes to complete the program increases drastically. It takes a *very* long time (in the realm of computers anyway) to compute the Fibonacci number at the 39th place. At this rate, it would take days to compute the Fibonacci number for a larger n. To understand why this function takes so long to execute, it's helpful to draw out the recursion tree. If we called fib(6), this is what the tree would look like:

![Fibonacci tree]({{ site.url }}/assets/fibonacci_tree(1).png=500x)

If you count the calls, this makes 24 calls to itself (not including the original call fib(6)). There is a simple optimization we can make to this that will cut the time complexity of this function drastically. You'll notice that this function makes many redundant calls for n. For example fib(3) is called 3 different time, and fib(2) is called 5 different times. Here is how we can optimize this function.

1. Create a hash table (let's call it memo).
2. Check to see if the key n is in the hash table.
3. If it is, **do not make another recursive call**. Simply return the value for memo[n]. This is key. This will avoid creating unnecessary calls for fib(n) when we already know what n is.
4. If n is not in the hash table, put it in as the key. The value will be fib(n). The beauty is that now, there will be no more calls to fib(n) if n has already been call.

Great, so how much time will this shave off our function. Well, let's look at the data. This is how long it takes when I call fib(660).

fib(660): 0.0009999275 seconds

Much better. I couldn't go much higher than 660 because I exceed the maximum recursion depth (no tail recursion in Python!). Lets start designing a better function.

First we create a hash table.

{% highlight python %}
table = {}
{% endhighlight %}

This is where we are going to store our calls to fib(n). In the original fib function, there is an if statement that writes out the base case.

{% highlight python %}
def fib(n):
    if n < 2:  # Base case
        return n
    return fib(n - 2) + fib(n - 1)
{% endhighlight %}

Before we declare the base case, let's check to see if n is a key in table.

{% highlight python %}
def fib(n):
    if n in table:
        return table[n]
    if n < 2:  # Base case
        return n
    return fib(n - 2) + fib(n - 1)
{% endhighlight %}

This way, we may not have to make more recursive calls. Of course, right now nothing is getting inserted into table. So there is no optimization right now. Let's change that.

{% highlight python %}
def fib(n):
    if n in table:
        return table[n]
    if n < 2:  # Base case
        return n  # We could memoize this, but I don't think it's necessary. This
                  # won't make our function that much slower and I don't want to
                  # clutter up the code

    table[n] = fib2(n - 2) + fib2(n - 1)
    return table[n]
{% endhighlight %}

That's it! We've put the key n in the table and associated it with the return value of fib(n - 2) + fib(n - 1). Now, our code will run exponentially faster. The only problem is, this code isn't very modular, and it doesn't look very good. By using decorators, we could clean up this code quite a bit. First, let's recreate our original code, but add a decorator right above it.

{% highlight python %}
@memoize
def fib(n):
    if n < 2:  # Base case
        return n
    return fib(n - 2) + fib(n - 1)
{% endhighlight %}

Here's our memoize function.

{% highlight python %}
def memoize(f): # Our fib function is passed through here as f .
    table = {}  # Previously called values are stored here.
    def wrapper(n):
        if n in not in table: 
            table[n] = f(n) # Since n is not a key in the table, we will have
        return table[n]     # to call our fib function with n as an argument.
    return wrapper
{% endhighlight %}