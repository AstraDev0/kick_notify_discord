const axios = require('axios');
const { getStreamLink, getUri } = require('../utils/utils');
const initCycleTLS = require('cycletls');

const toughCookie = require('tough-cookie');

class LiveStream {
  constructor() {
  }

  async getLiveStatus(user) {

    try {
      const cycleTLS = await initCycleTLS();
      const requestUrl = getUri(user)
      const response = await cycleTLS(requestUrl, {
        userAgent:
          'KICK/1.0.13 Dalvik/2.1.0(Linux; U; Android 13; Pixel 6 Pro Build / TQ1A.221205.011)',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      cycleTLS.exit();
      const livestreamData = response.body.livestream;

      return {
        title: livestreamData?.session_title,
        viewers: livestreamData?.viewer_count,
        thumbnail: livestreamData?.thumbnail?.url,
        started_at: livestreamData?.created_at,
        category: livestreamData?.categories[0]?.name,
        is_live: livestreamData?.is_live ?? false,
        streamLink: getStreamLink(user),
        streamer: user
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération des données pour ${this.user} : ${error.message}`);
      return null;
    }
  }
}

module.exports = LiveStream;
