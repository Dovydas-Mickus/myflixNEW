require('dotenv').config();
const express = require('express');
const trending = require('./backend/trending');
const movieDetails = require('./backend/movie')
const app = express();

const api_key = '8be1f700d2547e560efe20e398bbe52b'

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (req, res) => {
    try {
        const trendingMovies = await trending.fetchTrending('movie', 'week');
        const trendingShows = await trending.fetchTrending('tv', 'week');

        const image_base_url = 'https://image.tmdb.org/t/p/w500';

        res.render('pages/index', { trendingMovies, trendingShows, image_base_url });
    } catch (error) {
        console.error('Error fetching trending:', error);
        res.status(500).send('Something went wrong');
    }
});

app.get('/movie/:id', async (req, res) => {
    console.log(`REQ - movie/${req.params.id}`)
    const movieId = req.params.id;
    try {
        const movie = await movieDetails.getMovieDetails(movieId, api_key);
        const m3u8urls = await movieDetails.getMovieFile(movieId);
        res.render('pages/movie', {movie, m3u8urls})
    } catch (error) {
        console.error('Error fetching movie details:', error);
        res.status(500).send('Internal Server Error');
    }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app