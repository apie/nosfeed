#!/usr/bin/env python3
# Parses NOS feed urls from the overview page
# By Apie. 20230730
import urllib.request
from lxml import html

URL = 'https://nos.nl/feeds'


def get_feeds():
    response = urllib.request.urlopen(URL).read()
    page = html.fromstring(response)
    flist = page.xpath("//a[contains(@href, 'https://feeds.nos.nl')]")
    for f in flist:
        yield ','.join((f.text, f.get('href')))


if __name__ == '__main__':
    for f in get_feeds():
        print(f)
