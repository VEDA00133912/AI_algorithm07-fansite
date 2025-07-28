const axios = require('axios');
const xml2js = require('xml2js');

const CACHE_DURATION = 10 * 60 * 1000;

let cachedVideos = null;
let lastFetched = 0;

async function getLatestVideos() {
  const now = Date.now();

  if (cachedVideos && now - lastFetched < CACHE_DURATION) {
    return cachedVideos;
  }

  try {
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=UCvU3eD93bK6wROvTFFulGoQ`;
    const res = await axios.get(url);
    const parsed = await xml2js.parseStringPromise(res.data);

    const entries = parsed.feed.entry || [];

    const videos = entries.slice(0, 5).map(entry => {
      const videoId = entry['yt:videoId'][0];
      const title = entry.title[0];
      const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

      return {
        videoId,
        title,
        thumbnail
      };
    });

    cachedVideos = videos;
    lastFetched = now;

    return videos;
  } catch (err) {
    console.error('YouTube RSS取得失敗:', err.message);
    return cachedVideos || [];
  }
}

module.exports = getLatestVideos;