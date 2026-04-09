<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">

    <xsl:output method="html" encoding="UTF-8" indent="yes"
        doctype-public="-//W3C//DTD HTML 4.01//EN" />

    <xsl:template match="/">
        <html>
            <head>
                <title>XML Sitemap</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style>
                    body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    padding: 20px;
                    background: #f8fafc;
                    color: #1e293b;
                    line-height: 1.6;
                    }
                    .container { max-width: 1200px; margin: 0 auto; }
                    h1 {
                    color: #1e40af;
                    border-bottom: 3px solid #3b82f6;
                    padding-bottom: 10px;
                    margin-bottom: 30px;
                    }
                    .sitemap-info {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    margin-bottom: 30px;
                    }
                    .sitemap-group {
                    background: white;
                    margin-bottom: 20px;
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    overflow: hidden;
                    }
                    .sitemap-header {
                    background: #f1f5f9;
                    padding: 15px 20px;
                    border-bottom: 1px solid #e2e8f0;
                    font-weight: 600;
                    }
                    .sitemap-content {
                    padding: 15px 20px;
                    }
                    a {
                    text-decoration: none;
                    color: #1e40af;
                    word-break: break-all;
                    }
                    a:hover {
                    text-decoration: underline;
                    color: #1d4ed8;
                    }
                    .meta-info {
                    color: #64748b;
                    font-size: 0.9em;
                    margin-top: 5px;
                    }
                    .count {
                    background: #3b82f6;
                    color: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 0.8em;
                    }
                    @media (max-width: 768px) {
                    body { padding: 10px; }
                    .sitemap-header, .sitemap-content { padding: 10px 15px; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>XML Sitemap</h1>

                    <div class="sitemap-info">
                        <p>This is an XML sitemap that helps search engines discover and index your
                            website's content.</p>
                        <p>
                            <xsl:choose>
                                <!-- If it's a sitemap index -->
                                <xsl:when test="//sitemap:sitemap"> Number of sitemaps: <span
                                        class="count">
                                        <xsl:value-of select="count(//sitemap:sitemap)" />
                                    </span>
                                </xsl:when>

                                <!-- If it's a URL set -->
                                <xsl:when test="//sitemap:url"> Number of URLs: <span class="count">
                                        <xsl:value-of select="count(//sitemap:url)" />
                                    </span>
                                </xsl:when>
                            </xsl:choose>
                        </p>
                    </div>

                    <!-- Handle sitemap index -->
                    <xsl:if test="//sitemap:sitemapindex">
                        <xsl:for-each select="//sitemap:sitemap">
                            <div class="sitemap-group">
                                <div class="sitemap-header"> Sitemap <xsl:value-of
                                        select="position()" />
                                </div>
                                <div class="sitemap-content">
                                    <div>
                                        <a href="{sitemap:loc}">
                                            <xsl:value-of select="sitemap:loc" />
                                        </a>
                                    </div>
                                    <xsl:if test="sitemap:lastmod">
                                        <div class="meta-info"> Last modified: <xsl:value-of
                                                select="sitemap:lastmod" />
                                        </div>
                                    </xsl:if>
                                </div>
                            </div>
                        </xsl:for-each>
                    </xsl:if>

                    <!-- Handle regular sitemap URLs -->
                    <xsl:if test="//sitemap:urlset">
                        <xsl:for-each select="//sitemap:url">
                            <div class="sitemap-group">
                                <div class="sitemap-header"> URL <xsl:value-of select="position()" />
                                </div>
                                <div class="sitemap-content">
                                    <div>
                                        <a href="{sitemap:loc}">
                                            <xsl:value-of select="sitemap:loc" />
                                        </a>
                                    </div>
                                    <xsl:if test="sitemap:lastmod">
                                        <div class="meta-info"> Last modified: <xsl:value-of
                                                select="sitemap:lastmod" />
                                        </div>
                                    </xsl:if>
                                    <xsl:if test="sitemap:changefreq">
                                        <div class="meta-info"> Change frequency: <xsl:value-of
                                                select="sitemap:changefreq" />
                                        </div>
                                    </xsl:if>
                                    <xsl:if test="sitemap:priority">
                                        <div class="meta-info"> Priority: <xsl:value-of
                                                select="sitemap:priority" />
                                        </div>
                                    </xsl:if>
                                </div>
                            </div>
                        </xsl:for-each>
                    </xsl:if>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>