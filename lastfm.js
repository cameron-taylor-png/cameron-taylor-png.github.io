const LASTFM_API_KEY = 'd845396cb55c5f4f3862123f896d1657';
const LASTFM_USER = 'Cam___taylor';

function lfm(method, params) {
    const url = new URL('https://ws.audioscrobbler.com/2.0/');
    url.searchParams.set('method', method);
    url.searchParams.set('user', LASTFM_USER);
    url.searchParams.set('api_key', LASTFM_API_KEY);
    url.searchParams.set('format', 'json');
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    return fetch(url).then(r => r.json());
}

lfm('user.getrecenttracks', { limit: 1 })
    .then(data => {
        const track = data.recenttracks.track[0];
        const nowPlaying = track['@attr'] && track['@attr'].nowplaying;
        const el = document.getElementById('lastfm-track');
        if (el) {
            el.innerHTML = `<span class="lastfm-status">${nowPlaying ? '&#9654; now playing' : '&#9632; last played'}</span><br>${track.name}<br><em>${track.artist['#text']}</em>`;
        }
    })
    .catch(() => {
        const el = document.getElementById('lastfm-track');
        if (el) el.innerHTML = '<small>unavailable</small>';
    });

lfm('user.gettopartists', { period: '1month', limit: 5 })
    .then(data => {
        const artists = data.topartists.artist;
        const el = document.getElementById('lastfm-artists');
        if (el && artists && artists.length) {
            el.innerHTML = artists.map((a, i) => `${i + 1}. ${a.name}`).join('<br>');
        }
    })
    .catch(() => {
        const el = document.getElementById('lastfm-artists');
        if (el) el.innerHTML = '<small>unavailable</small>';
    });

lfm('user.gettoptracks', { period: '7day', limit: 1 })
    .then(data => {
        const tracks = data.toptracks.track;
        const section = document.getElementById('lastfm-obsession-section');
        if (!tracks || !tracks.length || !section) return;
        const top = tracks[0];
        const plays = parseInt(top.playcount, 10);
        if (plays >= 5) {
            section.style.display = '';
            const el = document.getElementById('lastfm-obsession');
            if (el) {
                el.innerHTML = `${top.name}<br><em>${top.artist.name}</em><br><small>${plays} plays this week</small>`;
            }
        }
    })
    .catch(() => {});
