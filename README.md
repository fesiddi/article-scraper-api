# Article Scraper API

API to scrape web articles containing a specific keyword in the article title from a news website. You can also post a new website where it's possible to scrape for articles and get the list of news websites already stored in the DB.

## API Endpoints

### /websites

-   `GET` : Get all websites where it is possible to search for articles
-   `POST` : Post a new website to the database

### /articles?siteName=value?keyword=value

-   `GET` : Get articles that contains keyword value provided in query string parameter from the website specified in the siteName value provided in query string parameter.

## Install

```
git clone https://github.com/fesiddi/article-scraper-api.git
cd article-scraper-api
npm install
```

## Start

Before running the app locally you need to set DB_URI env variable to a valid mongodb atlas cluster URI in a .env file.

```
npm start
```

The entry point of the application is the `server.js` file.

The API runs on port `3000` by default, and the home route can be accessed by navigating to `http://localhost:3000/` in your browser.

## Testing

The tests for the API can be found in `tests/app.test.js`. A sample html page used for testing the parser functionality can be found in `tests/mockPage.html` and expected parser results in `tests/testHelper.js`.

Before running the tests you need to set TEST_DB_URI env variable to a valid mongodb atlas cluster URI in a .env file.

To run the tests:

```
npm test
```

## Heroku hosted running app

A online working version of the app can be found at:

    https://article-scraping-app.herokuapp.com/
