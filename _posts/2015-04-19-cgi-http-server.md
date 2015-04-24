---
layout: post
title: Simple CGI Server
---
The best way to learn how a program works is to write
that program yourself. You want to learn how servers work?
Great! Try and write one on your own. Even if you fail, 
I guarantee you will learn something out of the whole
experience. In this post, I will show you how to create your
very own server that accepts POST requests. But, I won't show you how
to create the whole thing from scratch. I will be focusing
on how to handle a POST request and return a response from the
output of a Python script. This will allow us to use create a web form that
takes in a user's name from a text box, and display it on a web page. This is a
fairly trivial task with a web framework like Flask or Pyramid, but we're going be handling things a
much lower level, so it will be a bit trickier.

Python already has a couple of modules that contains a classes that can serve files
from the current directory. It can serve plain text, and HTML. This module will start us out with a very rudimentary
server that handles GET requests.

To start with, create a file called myserver.py and place
the following code in there:

{% highlight python %}

import SimpleHTTPServer
import BaseHTTPServer

httpd = BaseHTTPServer.HTTPServer(('', 8000),
                    SimpleHTTPServer.SimpleHTTPRequestHandler)

httpd.serve_forever()

{% endhighlight %}

To create an instance of HTTPServer, you must pass two arguments: the
server address in the form of a tuple, and a request handler. SimpleHTTPRequestHandler is a class that handles
the requests coming in from the client (more about that later).

Now run the script and open up a web browser and go to
[http://localhost:8000/](http://localhost:8000/). That will list the contents of
the directory the script was run in. If there were any HTML files in there, the
browser should display a hyperlink to that HTML page and properly render the it,
after clicking on it. This basic server can only handle two
types of requests: GET and HEAD. It does not handle POST requests. Let's try and
send a POST request anyway to see what happens. Run the script. If you don't have the commandline tool netcat, 
go download it. With netcat,
connect to localhost on port 8000:

{% highlight text %}

nc localhost 8000

{% endhighlight %}

Following the HTTP protocol, to send a POST request we need three things:

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
SimpleHTTPRequestHandler.Notice that it has methods called do\_GET() and
do\_HEAD():

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
our own handler class that inherits from it. Then, we can extend that class by
creating a method called do_POST() that will handle the POST requests.

{% highlight python %}

import SimpleHTTPServer
class MyRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    
    def do_POST():
        pass

{% endhighlight %}

Of course, this code actually won't do anything. But, if you try and send
another POST request to the server (like we did with netcat above), you won't get the error anymore. Try sending
another POST with netcat. You'll see that you don't get any response.

When a browser sends POST requests, it will send the request line like we sent, followed by
the headers. Before we write any code to handle the request, let's see exactly what a
browser will send us when sending a POST request via a web form. Put the
following HTML in a file called index.html:

{% highlight html %}

<form action="http://localhost:8000/hello.py" method="POST">
  Enter your name: <input type="text" name="first_name">
  <input type="submit" value="Submit">
</form>

{% endhighlight %}

So, we have a form that takes in text input, and submits a script called
hello.py (which we didn't create yet). Open up another terminal and use netcat to listen on port 8000:

{% highlight text %}

nc -l 8000

{% endhighlight %}

Now open up that index.html file with a web browser. Go ahead and enter your
name and click submit. After you submit, you'll notice something like this in
the terminal:

{% highlight text %}

POST /hello.py HTTP/1.1
Host: localhost:8000
User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:33.0) Gecko/20100101 Firefox/33.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Cookie: csrftoken=9k6939gc9Pg1OBvSeQYkjtdScoivNgwI; sessionid=3rci1ducdekt7go84jnnl3ugg6c2wnmz
Connection: keep-alive
Content-Type: application/x-www-form-urlencoded
Content-Length: 15

first_name=paul

{% endhighlight %}

Notice at the very end, there is a key-value pair separated by an equals sign.
The first part (first_name) is what we called the name attribute in that text
input above:

{% highlight text %}

Enter your name: <input type="text" name="first_name">

{% endhighlight %}

The second part, after the equals sign, is the name you entered in the text
box. What we want to do, is write a script that takes that name and spits back
some HTML with the name you entered. Now let's create the hello.py. This is
going to contain the program that takes the name a user entered, and displays it
back to the user like this:

{% highlight text %}

Hello, Paul!

{% endhighlight %}

That script looks like this:

{% highlight python %}

#!/usr/bin/env python
import sys

qs = sys.argv[1]
POST = {}
for kv in qs.split('&'):
    k, v = kv.split('=')
    POST[k] = v

name = POST['first_name']

print 'Content-type: text/html'
print

print '<h1>Hello, {name}!</h1>'.format(name=name)

{% endhighlight %}

The first line contains what's called a shebang followed a file path, and python. Basically,
this will help allow the operating system to run the program as an executable
file. To make sure that our OS can indeed run this program as an executable,
type this in the terminal:

{% highlight text %}

chmod 755 hello.py

{% endhighlight %}

Now, the file is executable. This will allow our server to run the script.

Back to myserver.py. Here is the full script:

{% highlight python %}

import BaseHTTPServer
import SimpleHTTPServer
import subprocess

class RequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):

    def do_POST(self):
        length = self.headers.getheader('content-length')
        content_type = self.headers.getheader('content-type')
        nbytes = int(length)
        data = self.rfile.read(nbytes)

        path = self.path
        file_name = self.translate_path(path)

        cmd = [file_name]

        print content_type
        if content_type == 'application/x-www-form-urlencoded':
            cmd.append(data)

        p = subprocess.Popen(cmd, stdin=subprocess.PIPE,
                                    stdout=subprocess.PIPE,
                                    stderr=subprocess.PIPE)
        output, err = p.communicate()
        self.send_response(200, 'Here comes the script output!')
        self.wfile.write(output)
        p.stdout.close()
        p.stderr.close()

httpd = BaseHTTPServer.HTTPServer(('', 8000), RequestHandler)

httpd.serve_forever()

{% endhighlight %}

To see this in action:

1. python myserver.py
2. Navigate to [http://localhost:8000/](http://localhost:8000)
3. Enter your name and hit submit.

Pretty simple.
