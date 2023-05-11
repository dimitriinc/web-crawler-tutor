import { JSDOM } from 'jsdom'

async function crawlPage(baseURL, currentURL, pages)  {

    const baseURLObject = new URL(baseURL)
    const currentURLObject = new URL(currentURL)
    if (baseURLObject.hostname !== currentURLObject.hostname) {
        return pages
    }

    const normalizedCurrentURL = normalizeUrl(currentURL)
    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++
        return pages
    }

    pages[normalizedCurrentURL] = 1

    console.log(`actively crawling ${currentURL}`)

    try {
        const resp = await fetch(currentURL)

        if (resp.status > 399) {
            console.log(`error in fetch status code: ${resp.status}, on page: ${currentURL}`)
            return pages
        }

        const contentType = resp.headers.get("content-type")
        if (!contentType.includes("text/html")) {
            console.log(`non-html response, content type: ${contentType}, on page: ${currentURL}`)
            return pages
        }

        const htmlBody = await resp.text()
        nextURLs = getUrlsFromHTML(htmlBody, baseURL)

        for (const nextURL of nextURLs) {
            pages = crawlPage(baseURL, nextURL, pages)
        }

    } catch (err) {
        console.log(`error in fetch: ${err.message}, on page: ${currentURL}`)
    }

    return pages
    
}

function getUrlsFromHTML(htmlBody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    for (const linkElement of linkElements) {
        if (linkElement.href.slice(0,1) === '/') {
            try {
                const urlObj = new URL(`${baseURL}${linkElement.href}`)
                urls.push(urlObj.href)
            } catch (err) {
                console.log(`error with relative url: ${err.message}`)
            }
            
        } else {
            try {
                const urlObj = new URL(linkElement.href)
                urls.push(urlObj.href)
            } catch (err) {
                console.log(`error with absolute url: ${err.message}`)
            }
        }
        
    }
    return urls
}

function normalizeUrl(urlString) {
    const urlObj = new URL(urlString);
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
    if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1)
    }
    return hostPath
}

export default {
    normalizeUrl, getUrlsFromHTML, crawlPage
}