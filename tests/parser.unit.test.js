const {
    extractArticlesFromHtml,
} = require('../controllers/articles/getArticles');

describe('Article Parser Tests', () => {
    it('Should return with expectedOutput array', () => {
        const html = require('./tests_utils/parserHelper').mockHTML;
        const expectedOutput =
            require('./tests_utils/parserHelper').expectedArticles;
        const result = extractArticlesFromHtml(html, 'bollettino');
        expect(result).toEqual(expectedOutput);
    });
    it('Should return with expectedOutput array', () => {
        const html = require('./tests_utils/parserHelper').mockHTML;
        const expectedOutput =
            require('./tests_utils/parserHelper').expectedArticles;
        const result = extractArticlesFromHtml(html, 'Bollettino');
        expect(result).toEqual(expectedOutput);
    });
    it('Should return an empty array when no articles are found', () => {
        const html = require('./tests_utils/parserHelper').mockHTML;
        const result = extractArticlesFromHtml(html, 'gelato');
        expect(result).toEqual([]);
    });
});
