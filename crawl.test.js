const {normalizeUrl, getUrlsFromHTML} = require('./crawl.js');
const {test, expect} = require('@jest/globals');

test('normalizeUrl strip protocol', () => {
    const input = 'https://blog.boot.dev/path';
    const actual = normalizeUrl(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected)
})

test('normalizeUrl strip trailing slash', () => {
    const input = 'https://blog.boot.dev/path/';
    const actual = normalizeUrl(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected)
})

test('normalizeUrl capitals', () => {
    const input = 'https://BLOG.boot.dev/path';
    const actual = normalizeUrl(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected)
})

test('normalizeUrl strip http', () => {
    const input = 'http://blog.boot.dev/path';
    const actual = normalizeUrl(input);
    const expected = 'blog.boot.dev/path';
    expect(actual).toEqual(expected)
})

test('getUrlsFromHTML absolute', () => {
    const inputHTMLBody = '<html><body><a href="https://blog.boot.dev/path/">Boot.dev blog</a></body></html>';
    const inputBaseURL = 'https://blog.boot.dev/path/'
    const actual = getUrlsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = ['https://blog.boot.dev/path/'];
    expect(actual).toEqual(expected)
})

test('getUrlsFromHTML relative', () => {
    const inputHTMLBody = '<html><body><a href="/path/">Boot.dev blog</a></body></html>';
    const inputBaseURL = 'https://blog.boot.dev'
    const actual = getUrlsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = ['https://blog.boot.dev/path/'];
    expect(actual).toEqual(expected)
})

test('getUrlsFromHTML both', () => {
    const inputHTMLBody = '<html><body><a href="/path1/">Boot.dev blog</a><a href="https://blog.boot.dev/path2/">Boot.dev blog</a></body></html>';
    const inputBaseURL = 'https://blog.boot.dev'
    const actual = getUrlsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = ['https://blog.boot.dev/path1/', 'https://blog.boot.dev/path2/'];
    expect(actual).toEqual(expected)
})

test('getUrlsFromHTML invalid', () => {
    const inputHTMLBody = '<html><body><a href="invalid">Boot.dev blog</a></body></html>';
    const inputBaseURL = 'https://blog.boot.dev'
    const actual = getUrlsFromHTML(inputHTMLBody, inputBaseURL);
    const expected = [];
    expect(actual).toEqual(expected)
})