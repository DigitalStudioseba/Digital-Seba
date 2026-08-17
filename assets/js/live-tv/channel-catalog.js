// channel-catalog.js
const m3uUrl = '../assets/data/channels.m3u';
let allChannels = [];
let activeCategoryGroup = 'All';

const categoryGroupsMap = {
  1: "???? Bangladesh", 2: "???? India", 3: "? Sports", 4: "?? Music",
  5: "?? Movies", 6: "?? International", 7: "?? Kids", 8: "?? Religious",
  9: "Others", 10: "Uncategorized"
};

function parseM3U(data) {
  const lines = data.split('\n');
  const channels = [];
  let currentChannel = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    if (line.startsWith('#EXTINF:')) {
      currentChannel = {};
      const logoMatch = line.match(/tvg-logo="([^"]*)"/i);
      currentChannel.logo = logoMatch ? logoMatch[1] : '';
      const groupMatch = line.match(/group-title="([^"]*)"/i);
      currentChannel.category = groupMatch ? groupMatch[1] : 'Others';
      const countryMatch = line.match(/tvg-country="([^"]*)"/i);
      currentChannel.country = countryMatch ? countryMatch[1] : '';
      const nameParts = line.split(',');
      currentChannel.name = nameParts.length > 1 ? nameParts[1].trim() : 'Unknown Channel';
    } else if (!line.startsWith('#')) {
      if (currentChannel.name) {
        currentChannel.url = line;
        
        let prio = 10;
        let catUpper = currentChannel.category.toUpperCase();
        let ctryUpper = currentChannel.country.toUpperCase();
        
        if (ctryUpper.includes('BANGLADESH') || catUpper.includes('BANGLA')) prio = 1;
        else if (ctryUpper.includes('INDIA') || catUpper.includes('INDIA')) prio = 2;
        else if (catUpper.includes('SPORT') || catUpper.includes('CRICKET') || catUpper.includes('FOOTBALL')) prio = 3;
        else if (catUpper.includes('MUSIC')) prio = 4;
        else if (catUpper.includes('MOVIE') || catUpper.includes('ENTERTAIN')) prio = 5;
        else if (catUpper.includes('INTERNAT') || catUpper.includes('WORLD')) prio = 6;
        else if (catUpper.includes('KID') || catUpper.includes('CARTOON')) prio = 7;
        else if (catUpper.includes('RELIGI') || catUpper.includes('ISLAM')) prio = 8;
        else prio = 9;
        
        currentChannel.group_priority = prio;
        channels.push(currentChannel);
        currentChannel = {};
      }
    }
  }
  return channels;
}

function loadCatalog(onReady) {
  fetch(m3uUrl)
    .then(res => res.text())
    .then(data => {
      allChannels = parseM3U(data);
      console.log(Parsed  channels from M3U.);
      onReady(allChannels);
    })
    .catch(err => {
      console.error("Failed to load channels", err);
      if (window.uiRenderer) window.uiRenderer.showError("Failed to load M3U playlist.");
    });
}
window.channelCatalog = { loadCatalog, allChannels, categoryGroupsMap, activeCategoryGroup };
