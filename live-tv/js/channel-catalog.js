// channel-catalog.js

window.CHANNELS_DATA = { categories: [] };



class LogoResolver {
  constructor() {
    this.logoFiles = [
      "0-toon-goggles.png",
      "03-btv.png",
      "0571.png",
      "07-channel-24.png",
      "095-goldmines.png",
      "096-goldmines-movies.png",
      "10-bangla-vision.png",
      "13-channel-i.png",
      "22scope-news.png",
      "23-me-tv.png",
      "2x2.png",
      "7tv576p.png",
      "9x-jalwa.png",
      "9x-jhakaas.png",
      "9x-tashan.png",
      "9xm.png",
      "aaj-tak.png",
      "aakashaath.png",
      "aastha-bhajan.png",
      "aastha-gujarati.png",
      "aastha-prime-1.png",
      "aastha-tamil.png",
      "aastha-telugu.png",
      "aastha.png",
      "abc-entertains-720p.jpg",
      "abc-kids.png",
      "abc-news-720p.png",
      "abp-ananda.png",
      "abp-ganga.png",
      "abp-majha.png",
      "abp-news.png",
      "abzy-dhakad.png",
      "abzy-movies.png",
      "accu-weather.png",
      "actionhollywood.svg",
      "actionhollywoodmovies.svg",
      "africanews-euronews-720p.webp",
      "akd-calcutta-news.png",
      "al-jazeera.png",
      "al-quran-tv.png",
      "al-sunnah-tv.png",
      "aljazeera.png",
      "amc-east-hd-usa.png",
      "amedia-1-576p.png",
      "amedia-2-576p.png",
      "amedia-premium-720p.png",
      "america-s-voice-720p.png",
      "americanidol.png",
      "americasgottalent.png",
      "amrita-tv.png",
      "ananda-tv.png",
      "and.png",
      "andpictures.png",
      "angel.png",
      "ani-576p.png",
      "animal-planet.png",
      "anmol-cinema-2.png",
      "antarjal.svg",
      "arihant-tv.png",
      "asian-tv.png",
      "asports.png",
      "atn-bangla-uk.png",
      "atn-bangla.png",
      "atn-music.jpg",
      "atn-news.png",
      "autoplus576p.png",
      "awaaz-india.png",
      "b4u-kadak.png",
      "b4u-movies.png",
      "b4u-music.png",
      "baallee.png",
      "balle-balle.png",
      "bangla-ananda-tv.png",
      "bangla-asian-tv.png",
      "bangla-atn-bangla.png",
      "bangla-atn-news.png",
      "bangla-bangla-vision.png",
      "bangla-bijoy-tv.png",
      "bangla-btv-world.png",
      "bangla-btv.png",
      "bangla-channel-i.png",
      "bangla-dbc-news.png",
      "bangla-dd-bangla.png",
      "bangla-desh-tv.png",
      "bangla-dhoom-music.png",
      "bangla-independent-tv.png",
      "bangla-iqra-tv-bangla.png",
      "bangla-jalsha-movies.png",
      "bangla-jamuna-tv.png",
      "bangla-madani-tv-bangla.png",
      "bangla-mohona-tv.png",
      "bangla-news18-bangla.png",
      "bangla-ntv.png",
      "bangla-plus.svg",
      "bangla-republic-bangla.png",
      "bangla-sangeet-bangla.png",
      "bangla-satv.png",
      "bangla-sony-aath.png",
      "bangla-star-jalsha-movies.png",
      "bangla-tv.png",
      "bangla-vision.png",
      "bangla-zee-bangla.png",
      "baraza-music-tv.jpg",
      "bbc-bangla.png",
      "bbc-earth-1080p.jpg",
      "bbc-earth.png",
      "bbc-news.png",
      "bbcearthus.png",
      "bein-sports-1.png",
      "bein-sports-2.png",
      "bein-sports-3.png",
      "bein-sports-4.png",
      "bein-sports-extra.jpg",
      "bein-sports-xtra-en-espanol-1080p.jpg",
      "bein-sports-xtra.png",
      "bengali-24-ghanta.png",
      "bengali-star-jalsha-movies-hd.png",
      "bharat24.png",
      "bhojpuri-cinema.png",
      "big-magic.png",
      "bijoy-tv.png",
      "biz-music.jpg",
      "biznet-adventure-1080p-id.jpg",
      "biznet-kids-1080p-id.jpg",
      "biznet-lifestyle-1080p-id.png",
      "bleav-football.png",
      "bloomberg-europe.png",
      "boishakhi-tv.png",
      "bollywoodold.png",
      "breaking-news.jpg",
      "bridge-classic-576p.png",
      "bridge-deluxe-fhd.png",
      "bridge-hits-576p.png",
      "btv-world.png",
      "btv.png",
      "buddy-star-hd.png",
      "calcutta-news.png",
      "cartoon-network.png",
      "cbs-news-fhd.jpg",
      "cctv-5-sports-fhd-18-02-26.jpeg",
      "cgtn-docment.png",
      "cgtn-espa-ol-1080p.png",
      "cgtn-news.jpeg",
      "cgtn.png",
      "channel-1.svg",
      "channel-24.png",
      "channel-9.png",
      "channel-divya.png",
      "channel-i.png",
      "channel-one-1080p.png",
      "chardikla-gurbaani-tv.png",
      "chardikla-time-tv-north-america.jpg",
      "chardikla-time-tv.png",
      "che-576p.png",
      "cineedge.png",
      "city-news-247.png",
      "cmac-tv.png",
      "cn-news.png",
      "cna-1080p-geo-blocked.png",
      "cna-news.jpg",
      "cna.svg",
      "cnbc-awaaz.svg",
      "cnbc-bajar.svg",
      "cnbc-tv18-prime-hd.svg",
      "cnews-bharat.png",
      "cnn-news.png",
      "cnn-us.svg",
      "cnn.png",
      "colors-bangla-cinema.png",
      "colors-bangla.png",
      "colors-cineplex-bollywood.png",
      "colors-cineplex-hd.png",
      "colors-hd.png",
      "colors-infinity-hd.png",
      "colorscineplexsuperhit.png",
      "court-tv.png",
      "crazyex.png",
      "crimes.jpg",
      "crimes.png",
      "dance-tv.png",
      "dangal-2.png",
      "dangal.png",
      "dazn-laliga.png",
      "dbc-news.png",
      "dd-arun-prabha.png",
      "dd-assam.png",
      "dd-bangla.png",
      "dd-bharati.png",
      "dd-bihar.png",
      "dd-chandana.png",
      "dd-chhattisgarh.png",
      "dd-girnar.png",
      "dd-goa.png",
      "dd-haryana.png",
      "dd-himachal-pradesh.png",
      "dd-india.png",
      "dd-jharkhand.png",
      "dd-kashir.png",
      "dd-kisan.png",
      "dd-madhya-pradesh.png",
      "dd-malayalam.png",
      "dd-manipur.png",
      "dd-meghalaya.png",
      "dd-mizoram.png",
      "dd-nagaland.png",
      "dd-national.png",
      "dd-news.png",
      "dd-odia.png",
      "dd-punjabi.png",
      "dd-rajasthan.png",
      "dd-sahyadri.png",
      "dd-saptagiri.png",
      "dd-sports-2-0.jpg",
      "dd-tamil.png",
      "dd-tripura.png",
      "dd-urdu.png",
      "dd-uttar-pradesh.png",
      "dd-uttarakhand.png",
      "dd-yadagiri.png",
      "deepto-tv.png",
      "delicious.png",
      "desh-tv.png",
      "deshebideshe.png",
      "deshi-tv-hd.png",
      "desi-channel.png",
      "dheeran-tv.png",
      "dhoom-music-bangla.png",
      "dios-te-ve-kids.png",
      "dipto.png",
      "discover-pakistan-tv.png",
      "discovery-bangla.png",
      "discovery-fhd-russia.jpg",
      "discovery-hd-france.png",
      "discovery-hd.PNG",
      "discovery-kids-2.jpg",
      "discovery-science.png",
      "discovery-turbo.png",
      "discovery.png",
      "duronto-tv.png",
      "dw-espanol-1080p.jpg",
      "dw-news.jpg",
      "e-24.png",
      "e24.png",
      "eet-tv.png",
      "ekattor-tv.png",
      "ekhon-tv.png",
      "ekushey-tv.png",
      "ekushey.png",
      "english-class-hd-1080p.png",
      "enterr10-bangla.png",
      "espn-2-fhd-brasil.png",
      "espn-3-fhd-brasil.png",
      "espn-3-hd-brasil.png",
      "espn-4-fhd-brasil.png",
      "espn-hd-brasil.png",
      "espn-hd-usa.jpg",
      "et-now-swadesh.png",
      "euro-sports.png",
      "eurosport-hd.png",
      "eurosport.png",
      "ewtn-tv.png",
      "f1-tv.png",
      "fan-1080p.png",
      "feniks-plus-kino-576p.png",
      "fifa-.png",
      "fifa-wc-2026.svg",
      "fighters.png",
      "flash-guys.png",
      "fonmusictntmusic.png",
      "food-food.png",
      "football-720p.jpg",
      "fox-sports-501.svg",
      "fox-sports-fhd.png",
      "fox-sports.png",
      "foxcricket501.png",
      "france-24-english-1080p.png",
      "france-24.png",
      "friday-576p.png",
      "funny-junior-hd.png",
      "g-serise.png",
      "game-changer.png",
      "gazi-tv-hd.png",
      "global-tv.jpeg",
      "go-3-sport-1-hd.png",
      "go-3-sport-2-hd.png",
      "go-3-sport-3-hd.png",
      "god-tv.png",
      "goldmines-bollywood.png",
      "goldmines-movies.png",
      "goldmines.png",
      "gopal-bhar-tv.png",
      "green-ent.png",
      "green-tv.png",
      "history-576p.png",
      "history-tv18-hd-hindi.png",
      "hollywood-hd-1080p.jpg",
      "houseofcrime.png",
      "hum-tv.png",
      "i-on-tv-uk.jpg",
      "ilm-tv.png",
      "indepen.jpg",
      "independent-tv.png",
      "india-today-720p-not-24-7.jpg",
      "india-tv.png",
      "intelligence.png",
      "investigation-discovery.png",
      "ipl.png",
      "ipl2026.png",
      "islamic-tv.png",
      "jago-news-24.png",
      "jago.png",
      "jalsha-movies-hd.png",
      "jamuna-tv.png",
      "jamuna-tv.svg",
      "joo-music.png",
      "joy-tv.jpg",
      "joy.svg",
      "khl-720p.svg",
      "khl-prime-720p.png",
      "khushboo-bangla.png",
      "kidsstars.png",
      "kino-tv-720p.png",
      "kinosat-576p.jpg",
      "knowledge-network.png",
      "kolkata.png",
      "live-sports.jpg",
      "live1080p.png",
      "love-nature.png",
      "lucky-family.jpg",
      "luxel-tv.png",
      "luxel.png",
      "maasranga-tv.png",
      "madani-channel-hd.png",
      "madina-live-tv-sunnah-tv.jpg",
      "madina-live.jpg",
      "mahamovies.png",
      "makkah-live-quran-tv.png",
      "makkah-live.jpg",
      "makkah-tv.png",
      "manoranjan-grend.jpg",
      "manoranjan-movies.png",
      "manoranjanprime.png",
      "match-game-576p.png",
      "mbc-1-1080p.jpg",
      "mbc-2-1080p-not-24-7.svg",
      "mbc-5-1080p.jpg",
      "mbc-persia-persian-1080p.png",
      "mbc-tv.jpeg",
      "me-tv.png",
      "mir.png",
      "mohona-tv.png",
      "motu-patlu.png",
      "movie-bangla.jpg",
      "moviebox.png",
      "moviesphere.png",
      "mr-bean-animated.png",
      "mtv-india.jpeg",
      "mu.png",
      "music-india.png",
      "my-cinema.png",
      "my-tv.png",
      "nat-geo-hd.svg",
      "ndtv-english.svg",
      "ndtv-news.svg",
      "ndtv.png",
      "news-24.png",
      "news-max-2.png",
      "news-nation.png",
      "news18-bangla-news.jpg",
      "news18-bangla.png",
      "nexus-tv.png",
      "nh-bolly-flix.png",
      "nhk-world.png",
      "nick-hindi.png",
      "nick.png",
      "nickjr.png",
      "nikki.svg",
      "nikky.png",
      "nk.png",
      "nrb-tv.png",
      "ntv-4-576p.png",
      "ntv-4.png",
      "ntv-7.png",
      "ntv-europe.png",
      "ntv-hit.png",
      "ntv-style.png",
      "ntv-uk.png",
      "ntv.png",
      "ntv.svg",
      "originals.png",
      "oscar-movies.png",
      "otbprime.png",
      "otr-576p.png",
      "partyuniverse.svg",
      "pbs-kids.png",
      "peace-tv-bangla.png",
      "peace-tv-english.png",
      "peace-tv-urdu.jpg",
      "popkids.png",
      "press-tv-iran.png",
      "programpromo.png",
      "ptv-sports.png",
      "quran-tv.png",
      "r-bangla.png",
      "r-plus-gold.png",
      "r-plus-news.png",
      "r-tv.png",
      "rajdhani-tv.jpeg",
      "rakuten-movies.png",
      "realmadrid.png",
      "red-bull-tv.png",
      "red-bull-tv.svg",
      "republic-bangla.png",
      "rishtey.png",
      "rongeen-tv.png",
      "rt-documentary-2-fhd.png",
      "rt-documentary.png",
      "rt-news-en.jpg",
      "rt-news.png",
      "rt.png",
      "rtv.png",
      "rupashi.png",
      "russia-1-6-576p.png",
      "russia-24-576p.png",
      "russiak.png",
      "s-tv-bangla.jpg",
      "sa-tv.png",
      "sananda.png",
      "sangeet-bangla.png",
      "sangeet-bhojpuri.png",
      "sapphire-720p.png",
      "satv.png",
      "saudiquran.png",
      "sbd.png",
      "science-1080p.png",
      "screem.png",
      "server1.png",
      "sheemaroo-bollywood.png",
      "shemaroo-tv.png",
      "sky-news.png",
      "sky-sports.png",
      "smarty.png",
      "solntseru.png",
      "somoi.png",
      "somoy-news-tv.png",
      "somoy-tv.png",
      "sonic-bangla.png",
      "sony-aath.png",
      "sony-bbc-earth-hd.png",
      "sony-max-hd.png",
      "sony-max.png",
      "sony-max2.png",
      "sony-pix-hd.png",
      "sony-sab.png",
      "sony-sports-5.png",
      "sony-sports-ten-1.png",
      "sony-sports-ten-2.png",
      "sony-sports-ten-5.png",
      "sony-wah.png",
      "sony-yay.png",
      "sonymarathi.png",
      "sonypal.png",
      "sport-tv1.svg",
      "sports-first-tv.png",
      "sports-legends.png",
      "sportsrange.png",
      "srk-tv.png",
      "star-4-576p.png",
      "star-bharat.png",
      "star-gold.png",
      "star-jalsha-hd.png",
      "star-movies-select-hd.png",
      "star-movies.png",
      "star-news.png",
      "star-plus.png",
      "star-sport-select-1.jpg",
      "star-sport-select-2.jpg",
      "star-sports-1.png",
      "star-sports-2-hd.png",
      "start-world.png",
      "sts-4-576p.png",
      "sts-love-576p.png",
      "sun-bangla.png",
      "superrix-hd.png",
      "surongo.png",
      "t-sports-2.jpg",
      "t-sports-7.png",
      "t-sports.png",
      "tbs.png",
      "teletravel-576p.png",
      "ten-sports.png",
      "the-movie-club.png",
      "thunder-er.png",
      "timetelevison.png",
      "tlc-hindi.svg",
      "tlc.png",
      "tnt-4-576p.png",
      "tnt-sport-1.png",
      "tnt-sport-2.png",
      "tom-jerry-tv.svg",
      "tonus-576p.png",
      "travel-xp-english-eu.svg",
      "travel-xp.png",
      "travel-xp.svg",
      "travel.png",
      "truestories.png",
      "tv-1000-2.jpg",
      "tv-1000-3.png",
      "tv-1000-action.svg",
      "tv-1000-hd.png",
      "tv-one.png",
      "tv9-bangla.png",
      "un-web-tv-540p.png",
      "uniques-hd.png",
      "usa-today-1080p.jpg",
      "viju-tv1000-russian.png",
      "village-cooking.jpg",
      "wild-earth.png",
      "wild-tv.png",
      "wildflix.png",
      "wildlife.png",
      "willow-sports.svg",
      "willowcricket.svg",
      "wion.png",
      "xxtremejobs.png",
      "yrf-music.png",
      "z-24-ghanta.svg",
      "z-news.png",
      "zb-cartoon.png",
      "zbihar.png",
      "zee-24-ghanta.png",
      "zee-action.png",
      "zee-anmol-cinema.png",
      "zee-anmol.png",
      "zee-bangla-cinema.png",
      "zee-bangla.png",
      "zee-bollywood.png",
      "zee-cafe-hd.png",
      "zee-cinema-hd.png",
      "zee-tv-hd.png",
      "zeecenema.png",
      "zhara-tv-576p.jpg",
      "zing.png",
      "zoo-moo.png",
      "zoo-tv-576p.png",
      "zoom-tv.svg",
      "zoom.png"
    ];
    this.stats = { total: 0, exact: 0, fuzzy: 0, json: 0, missing_generated: 0 };
  }

  cleanStr(s) {
    if (!s) return "";
    return s.toLowerCase()
      .replace(/hd|fhd|sd|backup|\(.*?\)/g, '')
      .replace(/[^a-z0-9]/g, '');
  }

  levenshtein(a, b) {
    if(a.length === 0) return b.length; 
    if(b.length === 0) return a.length; 
    let matrix = [];
    for(let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
    for(let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
    for(let i = 1; i <= b.length; i++) {
      for(let j = 1; j <= a.length; j++) {
        if(b.charAt(i-1) == a.charAt(j-1)) {
          matrix[i][j] = matrix[i-1][j-1];
        } else {
          matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, Math.min(matrix[i][j-1] + 1, matrix[i-1][j] + 1));
        }
      }
    }
    return matrix[b.length][a.length];
  }

  resolve(channelName, originalJsonLogo) {
    this.stats.total++;
    let cleanTarget = this.cleanStr(channelName);
    let finalLogo = "";
    let matchedBy = "";

    // 1. Exact Match
    for (let f of this.logoFiles) {
       let fBase = this.cleanStr(f.split('.')[0]);
       if (fBase === cleanTarget) {
           finalLogo = "assets/logos/" + f;
           matchedBy = "exact";
           break;
       }
    }

    // 2. StartsWith or Includes Match
    if (!finalLogo) {
       for (let f of this.logoFiles) {
           let fBase = this.cleanStr(f.split('.')[0]);
           if (fBase.length > 3 && (cleanTarget.startsWith(fBase) || fBase.startsWith(cleanTarget))) {
               finalLogo = "assets/logos/" + f;
               matchedBy = "fuzzy";
               break;
           }
       }
    }

    // 3. Levenshtein Fuzzy Match
    if (!finalLogo) {
       let bestDist = 999;
       let bestFile = "";
       for (let f of this.logoFiles) {
           let fBase = this.cleanStr(f.split('.')[0]);
           let dist = this.levenshtein(cleanTarget, fBase);
           if (dist < bestDist && dist <= 3) {
               bestDist = dist;
               bestFile = f;
           }
       }
       if (bestFile) {
           finalLogo = "assets/logos/" + bestFile;
           matchedBy = "fuzzy";
       }
    }

    // 4. Fallback to original JSON
    if (!finalLogo && originalJsonLogo) {
        finalLogo = originalJsonLogo;
        matchedBy = "json";
    }

    // 5. Default Fallback
    if (!finalLogo) {
        finalLogo = "";
        matchedBy = "missing_generated";
    }

    this.stats[matchedBy]++;
    return finalLogo;
  }

  printSummary() {
  }
}

fetch('../assets/data/channels.json')
  .then(res => {
    if (!res.ok) throw new Error("Failed to fetch channels.json");
    return res.text();
  })
  .then(rawText => {
    const cachedRaw = localStorage.getItem('iptv_channels_raw');
    const cachedParsed = localStorage.getItem('iptv_channels_parsed_v2');
    
    // Fast path: if raw json hasn't changed and we have cached resolved data
    if (cachedRaw === rawText && cachedParsed) {
      try {
        window.CHANNELS_DATA.categories = JSON.parse(cachedParsed);
        if (typeof initChannels === 'function') initChannels();
        if (typeof initAppRouting === 'function') initAppRouting();
        return;
      } catch (e) {
        console.warn("Failed to parse cached channel data, falling back to full process.", e);
      }
    }
    
    // Slow path: parse JSON and resolve logos
    const data = JSON.parse(rawText);
    const categoriesMap = {};
    const logoResolver = new LogoResolver();
    const seenUrls = new Set();
    const seenIds = new Set();
    
    data.forEach(ch => {
      // 3. Remove duplicate channels (by URL)
      if (seenUrls.has(ch.url)) return;
      
      const normalizedName = ch.name.replace(/^[0-9]+\.\s*/, '').trim();
      const id = normalizedName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // 3. Remove duplicate channels (by ID)
      if (seenIds.has(id)) return;
      
      seenUrls.add(ch.url);
      seenIds.add(id);

      const catName = ch.category || 'Uncategorized';
      if (!categoriesMap[catName]) {
        categoriesMap[catName] = { name: catName, channels: [] };
      }
      
      let finalLogo = logoResolver.resolve(normalizedName, ch.logo);
      
      const channelObj = {
        id: id,
        name: normalizedName, // 4. Clean channel titles
        shortName: normalizedName.slice(0, 3).toUpperCase(),
        logo: finalLogo,
        streams: [{ label: "Auto", url: ch.url }]
      };
      
      categoriesMap[catName].channels.push(channelObj);
    });
    
    logoResolver.printSummary();
    const resolvedCategories = Object.values(categoriesMap);
    window.CHANNELS_DATA.categories = resolvedCategories;
    
    // Save to cache for future instant loads
    try {
      localStorage.setItem('iptv_channels_raw', rawText);
      localStorage.setItem('iptv_channels_parsed_v2', JSON.stringify(resolvedCategories));
    } catch (e) {
      console.warn("Failed to cache channel data to localStorage (might be full).", e);
    }
    
    if (typeof initChannels === 'function') initChannels();
    if (typeof initAppRouting === 'function') initAppRouting();
  })
  .catch(err => {
    console.error("Error loading channels.json:", err);
  });
