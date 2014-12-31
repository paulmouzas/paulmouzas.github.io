---
layout: post
title: A Simple Hash Table in Python
---

When you need a hash table in Python you, you would normally use the dict data structure. This is enough for your purposes if all you need to do is store information in key, value pairs. If you needed a mapping of all the zip codes and their associated location, a Python dict would suffice. 

{% highlight python %}

zip_map = {'06770': 'Naugatuck, CT', '06403': 'Beacon Falls'} 
{% endhighlight %}
To retrieve, the town that 06770 is associated with you simply write town = zip_map['06770'].

So why exactly do we use this instead of something else. I can think of another way to store key, value pairs. Using a list of tuples would get the job done as well.

{% highlight python %}

other_zip_map = [('06770', 'Naugatuck CT',), ('06403', 'Beacon Falls')]
{% endhighlight %}
To retrieve 'Naugatuck CT', I could write a function for retrieval:

{% highlight python %}

def get(map, key):
    for item in other_zip_map:
        if item[0] == key:
            return item[1]
        return None

def set(map, key, value):
    map.append((key, value))
{% endhighlight %}
Then, to retrieve a value, I can write town = retrieve\_value(other\_zip\_map, '06770'). So why not use this implementation? The answer is greater time complexity. It simply takes longer to retrieve and set values for my other\_zip\_map when you don't know the index of the value. Let's say the length of zip map was more than 2 items long. How about every single zip code in the US (let's say 40,000). OK, now let's pretend that the zip code we want, is all the way at the end of the list. Since, we don't know the index, just the key, we have to do a linear search from the beginning of the list in other\_zip\_map to the very end. Let's say this 40,000 units of work. With Python's dictionary data structure, retrieving a value from zip\_map will not take nearly as long. In the worst case scenario, it will in fact take 40,000 operations to find the value. But in practice, dicts are much faster in retrieving values. 

So what magic is working under the hood? Well, we could analyze the source code for dict. But it would be much easier to implement a our own simple dict using Python to get a rough idea of how hashmaps work. This will be a very rudimentary hash table that will only be able to hold so many key, value pairs before becoming a very inefficient data structure. But the purpose is just to learn on a basic level how hash tables operate.


So that we don't step on Python's dict keyword, instead of calling this a dict, let's call it hashMap. Let's start by creating a nested list. This list has will have 256 empty lists inside of it. Let's call these empty list buckets.

{% highlight python %}

hashMap = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],
    [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]]
{% endhighlight %}
If you want to follow along in a Python interpreter, type:

{% highlight python %}
hashMap = [[] for bucket in range(256)]
{% endhighlight %}
So we have our hashMap. Each bucket is empty, but may be populated with one or more tuples with a key and value inside like this:

{% highlight python %}

('06770', 'Naugatuck, CT')
('06403', 'Beacon Falls')
{% endhighlight %}
Now we need to find a quick way to insert one of the key, value pairs above into one of the buckets, and also be able to retrieve it quickly without knowing the exact index of where it is stored. We can do this using a hash function. Luckily, Python has a built-in hash function. What the hash function does, is take in an object and returns it's hash value (an integer). Let's create a hash key with '06770'. 

{% highlight python %}

hash_key = hash('06770') 

{% endhighlight %}
If you type this into your Python interpreter, you will discover hash\_key will now equal -591106659. The hash value is deterministic, meaning it always give you the same return value with the same input. We can use this as an address for our hashMap. But this long number isn't very useful to us. How are we going to use this key to set an item in a bucket in the map? Well, we can use the modulo operator and the length of hash map to get us an index that will fit inside hashMap.

{% highlight python %}

hash_key = hash('06770') % len(hashMap)
{% endhighlight %}
 This gives you a value of 157. The computational cost of creating a hash value and finding the length of hashMap are very low, meaning this is computed very fast. Now that we have a hash key, we can insert the value into the hashMap.

{% highlight python %}
hashMap[hash_key] = ('06770', 'Naugatuck CT')
{% endhighlight %}
If you're observant, you'll see a problem in this. The hash function will give you a unique integer (there is a very slight chance that it won't but we don't have to worry about that). When we find the hash\_key by getting the remainder of the hashMap value divided by the length of hashMap (hash('06770') % len(hashMap)) the resulting hash\_key will eventually give you the same hash\_key as another. This means that sometimes, multiple key, value pairs will have to be in a single bucket. This means we will have to append this to the bucket instead.

{% highlight python %}

hashMap[hash_key].append(('06770', 'Naugatuck, CT'))
{% endhighlight %}
There is yet another problem. What if your program will try insert the key, value pair ('06770', 'Naugatuck CT') multiple times. We don't want or need the same data in a single bucket. Also, what if we want to replace the value of the key? We will have to check for this by iterating through the bucket.

{% highlight python %}

hash_key = hash('06770') % len(hashMap)
key_exists = False
bucket = hashMap[hash_key]
for i, kv in enumerate(bucket):
    k, v = kv 
    if key == k:
        key_exists = True
        break
        
if key_exists:
    #  replace the key, value pair in the bucket
    bucket[i] = (('06770', 'Naugatuck CT'))
else:
    #  add the new key, value pair to the end of the bucket
    bucket.append(('06770', 'Naugatuck CT'))
{% endhighlight %}
Retrieving a value from a key isn't much different. We must find the hash\_key, find the bucket, and iterate through the key, value pairs in the bucket until we find the key we're looking for (if it exists).

{% highlight python %}

hash_key = hash(key) % len(self.hashmap)
bucket = hashMap[hash_key]
for kv in bucket:
    k, v = kv
    if k == key:
        print key
        break
{% endhighlight %}
Now that we have the basics of how this works, let's write a class called HashMap.

{% highlight python %}

class HashMap(object):
    def __init__(self):
        self.hashmap = [[] for i in range(256)]

    def insert(self, key, value):
        hash_key = hash(key) % len(self.hashmap)
        key_exists = False
        bucket = self.hashmap[hash_key]
        for i, kv in enumerate(bucket):
            k, v = kv
            if key == k:
                key_exists = True
                break
        if key_exists:
            bucket[i] = ((key, value))
        else:
            bucket.append((key,value))

    def retrieve(self, key):
        hash_key = hash(key) % len(self.hashmap)
        bucket = self.hashmap[hash_key]
        for kv in enumerate(bucket):
            k, v = kv
            return v
        raise KeyError
{% endhighlight %}