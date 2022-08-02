const fs = require('fs');
const path = require('path');
const mockHTML = fs.readFileSync(path.join(__dirname, './mockPage.html'), {
    encoding: 'utf-8',
});

const expectedArticles = [
    {
        title: 'Bollettino Covid',
        url: 'https://www.corriere.it/salute/22_agosto_02/covid-italia-bollettino-oggi-2-agosto-64861-nuovi-casi-190-morti-99ed18a4-1251-11ed-ac67-e469b36a2788.shtml',
    },
];

module.exports = { mockHTML, expectedArticles };
