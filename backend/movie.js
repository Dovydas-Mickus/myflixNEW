const puppeteer = require('puppeteer');
const axios = require('axios');

async function getMovieDetails(movieId, api_key) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error fetching movie details:`, response.statusText);
            return {};
        }
        const data = await response.json();
        // Fetch and return the .m3u8 file URLs
        const m3u8Urls = await getMovieFile(movieId);
        return { movieDetails: data, m3u8Urls };
    } catch (error) {
        console.error(`Error fetching movie details:`, error);
        return {};
    }
}

async function getMovieFile(movieId) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Enable request interception
    await page.setRequestInterception(true);

    // Array to store multiple m3u8 URLs
    const m3u8Files = [];

    page.on('request', async (request) => {
        const headers = {
            ...request.headers(),
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Accept': '*/*',
        };

        if (request.url().endsWith('.m3u8')) {
            const m3u8Url = request.url();
            console.log('Found .m3u8 URL:', m3u8Url);
            m3u8Files.push(m3u8Url); // Add the URL to the array
        }

        request.continue({ headers });
    });

    // Navigate to the movie page
    await page.goto(`https://vidlink.pro/movie/${movieId}`, { waitUntil: 'networkidle2' });

    await browser.close();

    // Return the array of m3u8 URLs
    return m3u8Files;
}

module.exports = { getMovieDetails, getMovieFile };
