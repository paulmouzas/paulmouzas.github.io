---
layout: post
title: 'Messing With Pygame and Trigonometry'
---
I didn't do too well in high school trigonometry. I think it's because I couldn't quite grok it. I slogged through the course and passed but I just couldn't intuitively understand it. Later, after programming for a little while and messing around with pygame, I finally got it. I think if programming were required in school, and kids made their own games, it would be a lot easier for kids to understand trig.

After reading about some articles about pygame and physics, I decided to make a couple of programs for fun. The first is an animation to help understand what the hell sine and cosine actually are (I wish they showed this to me in high school when I was struggling with this stuff).

<iframe width="420" height="315" src="https://www.youtube.com/embed/NixEtaxaHec" frameborder="0" allowfullscreen></iframe>

Here is the code for it:

{% highlight python %}
import pygame
import math

pygame.init()
font = pygame.font.SysFont("Arial", 14)

screen = pygame.display.set_mode((700, 700))

white = (255, 255, 255)
red = (255, 0, 0)
green = (0, 255, 0)
black = (0, 0, 0)

center = (350, 350)
radius = 300
angle = 0

clock = pygame.time.Clock()

while True:
    screen.fill(black)

    sin = math.sin(angle)
    cos = math.cos(angle)
    tan = math.tan(angle)

    # calculate the x and y coordinate
    y = -radius * sin + 350
    x = radius * cos + 350

    sin_text = font.render('sin: ' + '{0:.2f}'.format(sin), True, (0,128,0))
    cos_text = font.render('cos: ' + '{0:.2f}'.format(cos), True, (0,128,0))
    tan_text = font.render('tan: ' + '{0:.2f}'.format(tan), True, (0,128,0))
    degree_text = font.render('angle: ' + str(int(math.degrees(angle))) + u"\u00b0", True, (0,128,0))

    opposite_x = x
    opposite_y = 350

    adjacent_x = x
    adjacent_y = 350

    # draw the circle
    pygame.draw.circle(screen, white, center, radius, 3) 

    #draw the line from the center to the x and y coordinates
    pygame.draw.line(screen, white, center, (x,y), 3)

    # draw the opposite line
    pygame.draw.line(screen, red, (opposite_x, opposite_y), (x, y), 3)

    # draw the adjacent line
    pygame.draw.line(screen, green, center, (adjacent_x, adjacent_y), 3)

    screen.blit(sin_text, (50, 10))
    screen.blit(cos_text, (50, 30))
    screen.blit(tan_text, (50, 50))
    screen.blit(degree_text, (50, 70))

    pygame.display.flip()

    # reset angle if full sweep completed
    if angle > math.pi * 2:
        angle = 0
    # increase angle by .1 radians
    angle += .01
    clock.tick(50)
{% endhighlight %}

The second program I made was a experiment in physics. I did this to understand how to add in order to change the direction of an objects.

<iframe width="420" height="315" src="https://www.youtube.com/embed/p9Xoes63rWI" frameborder="0" allowfullscreen></iframe>

And here is the code for that:

{% highlight python %}
import pygame
import math

pygame.init()
screen = pygame.display.set_mode((700, 700))

white = (255, 255, 255)
black = (0, 0, 0)

x = 100
y = 450
radius = 10
speed = 3
drag = .999
angle = math.radians(270)

gravity = (math.pi, 0.02)

clock = pygame.time.Clock()

def addVectors((angle1, length1), (angle2, length2)):
    x  = math.sin(angle1) * length1 + math.sin(angle2) * length2
    y  = math.cos(angle1) * length1 + math.cos(angle2) * length2
    
    angle = 0.5 * math.pi - math.atan2(y, x)
    length  = math.hypot(x, y)

    return (angle, length)

running = True
click_down = False

while running:

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

        if event.type == pygame.MOUSEBUTTONDOWN:
            x, y = pygame.mouse.get_pos()
            click_down = True
        elif event.type == pygame.MOUSEBUTTONUP:
            click_down = False

    screen.fill(black)
    pygame.draw.circle(screen, white, (int(x), int(y)), radius)
    pygame.display.flip()

    angle, speed = addVectors((angle, speed), gravity)

    if click_down:
        mouse_x, mouse_y = pygame.mouse.get_pos()
        dx = mouse_x - x
        dy = mouse_y - y
        angle = 0.5 * math.pi + math.atan2(dy, dx)
        speed = math.hypot(dx, dy) * .1

    x += math.sin(angle) * speed
    y -= math.cos(angle) * speed

    if x > 690:
        # setting the x or y ensures that the particle doesn't 'stick' to the boundaries
        x = 690
        angle = -angle
    elif x < 10:
        x = 10
        angle = -angle
    if y > 690:
        y = 690
        angle = math.pi - angle
    elif y < 10:
        y = 10
        angle = math.pi - angle

    speed *= drag
    clock.tick(90)

pygame.quit()
{% endhighlight %}
