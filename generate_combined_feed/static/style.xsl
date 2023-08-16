<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <title><xsl:value-of select="/rss/channel/title"/> RSS feed</title>
                <meta charset="UTF-8" />
                <meta http-equiv="x-ua-compatible" content="IE=edge,chrome=1" />
                <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1,shrink-to-fit=no" />
                <style type="text/css">
                    @font-face {
                        font-family: 'Effra-Bold';
                        font-style: normal;
                        font-display: block;
                        font-weight: 700;
                        src: local('EffraBold'), local('EffraBold'),
                            url('https://static.nos.nl/fonts/effra/EffraBold.woff?v=prod-app') format('woff'),
                            url('https://static.nos.nl/fonts/effra/EffraBold.woff2?v=prod-app') format('woff2');
                    }

                    body {
                        color: #222;
                        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        margin: 1.6rem auto;
                        max-width: 40rem;
                    }

                    img {
                        border-radius: 4px;
                        width: 100%;
                    }

                    body > header h1 {
                        color: #eb0018;
                    }

                    h1,
                    h2 {
                        font-family: 'Effra-Bold';
                    }

                    article {
                        border-bottom: 1px solid #aaa;
                        margin-bottom: 120px;
                        padding-bottom: 60px;
                    }

                    article:last-child {
                        border-bottom: 0;
                        margin-bottom: 0;
                        padding-bottom: 0;
                    }

                    article header {
                        color: #666;
                        font-size: 16px;
                        font-weight: bold;
                        margin-bottom: 32px;
                        margin-top: 40px;
                    }

                    article h1 {
                        font-size: 28px;
                        line-height: 33.6px;
                    }

                    article h1 a {
                        color: black;
                    }

                    p,
                    article > a {
                        font-feature-settings: 'liga', 'kern';
                        font-size: 18px;
                        line-height: 29.78px;
                        margin: 0 0 32px;
                    }

                    article main h2 {
                        font-size: 20px;
                        line-height: 24px;
                    }

                    footer {
                        border-top: 1px solid #aaa;
                        margin-top: 120px;
                        padding-top: 60px;
                    }

                    article a,
                    footer a {
                        color: #eb0018;
                    }

                    @-moz-document url-prefix() {
                        article main {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <header>
                    <h1><xsl:value-of select="/rss/channel/title"/> RSS Feed</h1>
                </header>
                <main>
                    <xsl:for-each select="/rss/channel/item">
                        <article>
                            <img>
                                <xsl:attribute name="src">
                                    <xsl:value-of select="enclosure/@url"/>
                                </xsl:attribute>
                                <xsl:attribute name="alt"></xsl:attribute>
                            </img>
                            <header>
                                <time>
                                    <xsl:attribute name="datetime">
                                        <xsl:value-of select="pubDate"/>
                                    </xsl:attribute>
                                    <xsl:value-of select="substring(pubDate, 6, 20)" />
                                </time>
                                <h1>
                                    <a target="_blank">
                                        <xsl:attribute name="href">
                                            <xsl:value-of select="link"/>
                                        </xsl:attribute>
                                        <xsl:value-of select="title"/>
                                    </a>
                                </h1>
                                <xsl:value-of select="category" disable-output-escaping="yes" />
                            </header>
                            <main>
                                <xsl:value-of select="description" disable-output-escaping="yes" />
                            </main>
                        </article>
                    </xsl:for-each>
                </main>
                <footer>
                    <span>
                        &#169;
                        <a href="https://nos.nl">NOS</a>&#160;<xsl:value-of select="substring(/rss/channel/pubDate, 13, 4)" />
                    </span>
                </footer>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
