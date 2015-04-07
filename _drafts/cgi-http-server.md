The best way to learn how a program works is to write
that program yourself. You want to learn how servers work?
Great! Try and write one on your own. Even if you fail, 
I guarantee you will learn something out of the whole
experience. In this post, I will show you how to create your
very own server that accepts POST requests. But, I won't show you how
to create the whole thing from scratch. I will be focusing
on how to handle a POST request and return a response from the
output of a Python script.

Python already has a module that contains a class that can serve files
from the current directory. Create a file called myserver.py and place
the following code in there:

{% highlight python %}
import SimpleHTTPServer
import BaseHTTPServer

httpd = BaseHTTPServer.HTTPServer(('', 8000),
                    SimpleHTTPServer.SimpleHTTPRequestHandler)

httpd.serve_forever()
{% endhighlight %}

Now open up a web browser and go to
[http://localhost:8000/](http://localhost:8000/). That will list the contents of
the directory the script was run in. If there were any HTML files in there, the
browser should properly render the html. This basic server can only handle two
types of requests: GET and HEAD. It does not handle POST requests. Let's try and
send a POST request to see what happens. Run the myserver.py script in a
terminal:

{% highlight text %}
python myserver.py
{% endhighlight %}

If you don't have the commandline tool netcat, go download it. With netcat,
connect to localhost on port 8000:

{% highlight text %}
nc localhost 8000
{% endhighlight %}

To send a POST request we need three things:
    - the method type
    - the path
    - and the HTTP version.

After connecting with netcat, type this:

{% highlight text %}
POST / HTTP/1.1
{% endhighlight %}

Hit Enter twice and you will get the following response:

{% highlight html %}
HTTP/1.0 501 Unsupported method ('POST')
Server: SimpleHTTP/0.6 Python/2.7.6
Date: Tue, 07 Apr 2015 01:45:05 GMT
Content-Type: text/html
Connection: close

<head>
<title>Error response</title>
</head>
<body>
<h1>Error response</h1>
<p>Error code 501.
<p>Message: Unsupported method ('POST').
<p>Error code explanation: 501 = Server does not support this operation.
</body>
{% endhighlight %}


If you take a look at the source code for SimpleHTTPServer, you can view the
SimpleHTTPRequestHandler.Notice that it has methods called do_GET() and
do_HEAD():

{% highlight python %}

class SimpleHTTPRequestHandler(BaseHTTPServer.BaseHTTPRequestHandler):

    ...

    def do_GET(self):
        """Serve a GET request."""
        f = self.send_head()
        if f:
            try:
                self.copyfile(f, self.wfile)
            finally:
                f.close()

    def do_HEAD(self):
        """Serve a HEAD request."""
        f = self.send_head()
        if f:
            f.close()
    ...

{% endhighlight %}

We can easily extend the functionality of the BaseHTTPRequestHandler by creating
our own handler class that inherits from it:

{% highlight python %}
import SimpleHTTPServer
class MyRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    
    def do_POST():
        pass
{% endhighlight %}

