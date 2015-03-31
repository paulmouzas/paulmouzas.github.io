---
layout: post
title: 'Creating a Command Line Roku Remote with Python'
categories: [python, http, sockets]
type: post
---

Creating a Roku remote with Python is easier than you might think. Armed with Roku's
developer [documentation](http://sdkdocs.roku.com/display/sdkdoc/External+Control+Guide),
and a little bit of HTTP and socket programming knowledge, you can whip up a command
line remote fairly quickly. You could just download the Roku remote app, but
where's the fun in that? Here's my script on [Github](https://github.com/paulmouzas/roku-remote).

To start, let's try and discover the Roku. The Roku uses SSDP (Simple Service
Discover Protocol) to allow devices (like a remote) to find it's address. You
must be in the same wireless network to discover the Roku. According to the
documentation, to find a Roku device you must send
the following message to 239.255.255.250 on port 1900:

{% highlight text %}
M-SEARCH * HTTP/1.1
Host: 239.255.255.250:1900
Man: "ssdp:discover"
ST: roku:ecp 


{% endhighlight %}

This should look fairly familiar if you've ever sent raw HTTP requests with telnet
or netcat. Upon successful transmission of the message, the Roku will send you a response:

{% highlight text %}
HTTP/1.1 200 OK
Cache-Control: max-age=3600
ST: roku:ecp
USN: uuid:roku:ecp:12C1CM005293
Ext: 
Server: Roku UPnP/1.0 MiniUPnPd/1.4
LOCATION: http://192.168.1.247:8060/


{% endhighlight %}

The first line tells us the HTTP response status. In this case the Roku gives us
a 200 status code meaning it heard us
loud and clear. The lines after the response status are the response headers that give us more
information about our particular Roku device. The only response header we really
need for our purposes is the LOCATION header.

Before we get in to how to send commands to your Roku, let's figure out how to
find it's address in the first place. You could use any programming language
you please to do this but I prefer to use Python for these sorts of things. As
long as you don't freak out when you see other languages, you should be able
to follow along with PHP, Ruby, or whatever you're most comfortable with.

So, we know that the Roku is listening on port 1900 on this address:
239.255.255.250. To send our message we must create a socket and send the
discover message (above) to the Roku. I'm going to use Python's sockets library
to create a socket and send that message:

{% highlight python %}
DISCOVER_GROUP = ('239.255.255.250', 1900)

DISCOVER_MESSAGE = '''\
M-SEARCH * HTTP/1.1\r\n\
Host: %s:%s\r\n\
Man: "ssdp:discover"\r\n\
ST: roku:ecp\r\n\r\n\
''' % DISCOVER_GROUP

def find_roku():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.sendto(DISCOVER_MESSAGE, DISCOVER_GROUP)
    data = s.recv(1024)
    return data
{% endhighlight %}

Notice that there are two CRLFs at the end of the message (\r\n\r\n). You will
not get a response if you don't include those. When creating a socket, use the
AF_INET address family make sure the socket is a datagram socket (DGRAM). If the
request is successful, you will recieve a response (the HTTP response listed above).
Call recv on the socket to recieve this response (hopefully):

{% highlight text %}
HTTP/1.1 200 OK
Cache-Control: max-age=3600
ST: roku:ecp
USN: uuid:roku:ecp:12C1CM005293
Ext: 
Server: Roku UPnP/1.0 MiniUPnPd/1.4
LOCATION: http://192.168.1.247:8060/


{% endhighlight %}

I created a quick and dirty class to help parse out the response string. It
stores all the response headers in a dictionary (hash table) in key-value pairs:

{% highlight python %}
class HTTPResponse(dict):
    def __init__(self, response_text):

        response = response_text.split('\r\n')
        status_line = response[0]

        self.http_version, self.status_code, self.status = status_line.split()
        self.headers = {}

        for line in response[1:]:
            line = line.split()
            if len(line) == 2:
                header_name = line[0][:-1]
                header_value = line[1]
                self.headers[header_name.lower()] = header_value.lower()
{% endhighlight %}

Using that class, I can easily get the location of the roku.

{% highlight python %}
response_text = find_roku()
response = HTTPResponse(response_text)
location = response.headers['location'] # =>'http://192.168.1.247:8060'
{% endhighlight %}

According to the documentation, to send a command to the Roku, we send a POST request to the location. If we
wanted to tell the Roku to go to the home screen, the request would look
something like this:

{% highlight text %}
POST /keypress/home HTTP/1.1
Host: 192.168.1.247:8060


{% endhighlight %}

Notice that /keypress is followed by the command /home. These are the command
that the Roku recognizes:

{% highlight text %}
Home
Rev
Fwd
Play
Select
Left
Right
Down
Up
Back
InstantReplay
Info
Backspace
Search
Enter
Lit_*
{% endhighlight %}

So, if we wanted to move the cursor to the right, the HTTP request would look
like this:
{% highlight text %}
POST /keypress/right HTTP/1.1
Host: 192.168.1.247:8060


{% endhighlight %}

Python's request library makes it pretty easy to send POST requests like the
ones I laid out above. Assuming the location of the Roku on your network is
192.168.1.247:8060, to send a command to the Roku you can use this code:

{% highlight python %}
import requests

def keypress(url, key):
    request_url = url + '/keypress/' + key
    requests.post()

keypress('http://192.168.1.247:8060', 'select')
{% endhighlight %}

That will send the appropriatte HTTP request to select what ever the cursor was
hovering over.
