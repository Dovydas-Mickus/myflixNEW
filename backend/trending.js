const api_key = '8be1f700d2547e560efe20e398bbe52b'
const image_base_url = 'https://image.tmdb.org/t/p/w500'

async function fetchTrending(mediaType, timeWindow) {
    const url = `https://api.themoviedb.org/3/trending/${mediaType}/${timeWindow}?api_key=${api_key}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error fetching trending ${mediaType}:`, response.statusText);
            return [];
        }
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error(`Error fetching trending ${mediaType}:`, error);
        return [];
    }
}

module.exports = { fetchTrending };