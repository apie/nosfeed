#!/usr/bin/env python3
# Read feeds.csv and get RSS for each.
# Generate one single RSS for all feeds combined, sorted by pubdate
# By Apie 20211122 and 20230730
import datetime
import feedparser
import dateparser
import feedgenerator
from sys import argv
from os import path
from dataclasses import dataclass


@dataclass
class Enclosure:
    url: str
    mime_type: str

    @property
    def length(self):
        return str(len(self.url))


def yield_feed_entry(feed_url):
    feed = feedparser.parse(feed_url)
    for i, entry in enumerate(feed.entries):  # Sorted on publish date
        entry['published_datetime'] = dateparser.parse(entry['published'])
        yield entry


class MyGen(feedgenerator.Rss201rev2Feed):
    def write(self, outfile, encoding):
        ''' Adapted from https://github.com/django/django/blob/22b0b73c7732ba67db4e69fd9fa75aad84c8e5c4/django/utils/feedgenerator.py#L227C1-L235C34
            Added xml-stylesheet. This is also in the input feeds and quite handy.
        '''
        handler = feedgenerator.SimplerXMLGenerator(outfile, encoding, short_empty_elements=True)
        handler.startDocument()
        ######## \/\/\/\/
        handler.processingInstruction('xml-stylesheet', 'href="/static/style.xsl" type="text/xsl"')
        ######## /\/\/\/\
        handler.startElement("rss", self.rss_attributes())
        handler.startElement("channel", self.root_attributes())
        self.add_root_elements(handler)
        self.write_items(handler)
        self.endChannelElement(handler)
        handler.endElement("rss")


def write_complete_rss_for_feeds(feeds, filename):
    new_feed = MyGen(
        title="NOS combined feed",
        description="NOS combined feed",
        link="https://nos.nl",
        pubdate=datetime.datetime.now(),
    )
    seen = set()
    for feed in feeds:
        feed_name, feed_url = feed.strip().split(',')
        if feed_name[0] == '#':
            continue
        print(feed_name)
        for item in yield_feed_entry(feed_url.strip()):
            if item['title'] in seen:
                continue
            seen.add(item['title'])
            enclosure_list = [l for l in item['links'] if l['rel'] == 'enclosure']
            enclosure_dict = enclosure_list[0] if enclosure_list else None
            enclosure = Enclosure(enclosure_dict['href'], mime_type=enclosure_dict['type']) if enclosure_dict else None
            new_feed.add_item(
                title=item['title'],
                link=item['link'],
                description=item['title'],
                pubdate=item['published_datetime'],
                enclosure=enclosure,
                categories=(feed_name,),
            )
    new_feed.items.sort(key=lambda it: it['pubdate'], reverse=True)
    with open(path.join(path.dirname(path.realpath(argv[0])), 'static', filename), 'w') as f:
        new_feed.write(f, encoding='utf-8')


if __name__ == '__main__':
    with open(path.join(path.dirname(path.realpath(argv[0])), 'feeds.csv')) as c:
        feeds = c.readlines()
    write_complete_rss_for_feeds(feeds, 'combined.rss')
