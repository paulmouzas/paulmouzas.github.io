from BeautifulSoup import BeautifulSoup
from BeautifulSoup import Tag
import os

for tup in os.walk('_posts'):
    files = tup[2]
    for file in files:
        with open('_posts/'+file, 'w') as f:
            soup = BeautifulSoup(f.read())
            for img_tag in soup.findAll('img'):
                if img_tag['src']:
                    new_src = "{{site.url}}/"+img_tag['src']
                    new_tag = Tag(soup, "img", img_tag.attrs)
                    img_tag.replaceWith(new_tag)
