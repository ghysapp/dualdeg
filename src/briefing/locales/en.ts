import type { PhraseBank } from '../types';

const hour = (h: number): string => {
  if (h === 0) return 'midnight';
  if (h === 12) return 'noon';
  return h < 12 ? `${h} am` : `${h - 12} pm`;
};

const time = (h: number, m: number): string => {
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
};

const duration = (min: number): string => `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')} min`;

export const en: PhraseBank = {
  title: 'Your day in short',
  labels: {
    today: 'Today',
    tonight: 'Tonight',
    tomorrow: 'Tomorrow',
    laterToday: 'When you wake up',
  },
  hour,
  time,
  duration,

  greetings: {
    earlyBird: ['Up before the sun? Respect.', 'Early bird! The weather is barely awake.'],
    morning: [
      'Good morning! Your day in a nutshell.',
      'Morning! Coffee first, then this.',
      'Good morning. The sky has plans for you.',
    ],
    midday: ['Lunchtime check-in.', 'Halfway through the day. Here’s the rest.'],
    afternoon: ['Afternoon! Here’s what’s left of today.', 'The afternoon report is in.'],
    evening: ['Good evening! Tonight and tomorrow, in short.', 'Evening briefing, served warm.'],
    late: ['Late check-in? Here’s tonight and tomorrow.', 'One last look before bed.'],
    nightOwl: [
      'Still up? The weather’s asleep, you should be too.',
      'Night owl spotted. Here’s what’s coming.',
    ],
    firstWorkday: ['Monday. Let’s get through this together.', 'Monday morning. Deep breath.'],
    midweek: ['Wednesday: halfway there.', 'Hump day! Downhill from here.'],
    lastWorkday: ['Friday! The weekend is in sight.', 'It’s Friday. You made it (almost).'],
    lastWorkdayEvening: ['Friday night! Here’s your weekend preview.', 'The weekend starts now. The forecast too.'],
    weekend: ['{day}! No alarm clock required.', 'Weekend mode: on.'],
    weekendEnd: ['Sunday evening. Tomorrow’s forecast, gently.', 'The weekend is wrapping up. Here’s what’s next.'],
    newYear: ['Happy New Year! The first forecast of the year.'],
    newYearsEve: ['Last day of the year! Here’s the final forecast.'],
    christmas: ['Merry Christmas! Your forecast, gift-wrapped.'],
    halloween: ['Happy Halloween! The forecast, no tricks.'],
    friday13: ['Friday the 13th. Read the forecast, if you dare.'],
    aprilFools: ['April 1st. This forecast is not a joke. Probably.'],
    valentine: ['Happy Valentine’s Day! The weather, with love.'],
    alert: ['Heads up: rough weather ahead.', 'Important: the weather needs your attention.'],
  },

  lines: {
    // Rain
    rainAllDay: [
      'Rain from start to finish. The sky has a lot to get off its chest.',
      'Wet, wetter, wettest: the rain barely takes a break.',
      'One of those days where the rain doesn’t even pretend to stop.',
    ],
    rainLater: [
      'Dry until about {start}, then rain for the rest of the day.',
      'Errands? Do them before {start}, when the rain moves in for good.',
      'Enjoy the dry spell: the rain clocks in around {start} and works overtime.',
    ],
    rainStops: [
      'Wet start, but it dries up around {end}. Patience pays.',
      'The rain packs its bags around {end}. Hang in there.',
      'Rain until about {end}, then the sky calms down.',
    ],
    rainWindow: [
      'Showers between {start} and {end}, dry on either side. Timing is everything.',
      'Rain pencilled in from {start} to {end}. The rest is dry.',
      'A wet window from {start} to {end}: plan your outdoor moves around it.',
    ],
    rainBrief: [
      'A quick shower around {t}. Blink and you’ll miss it, unless you’re outside.',
      'One short shower around {t}, then back to business.',
    ],
    rainOnOff: [
      'On-and-off showers. The sky can’t make up its mind.',
      'Showers come and go like a cat at the door: in, out, in, out.',
      'Hit-and-miss showers. Take sunglasses and an umbrella, trust neither.',
    ],
    showersPossible: [
      'A shower might pop up between {start} and {end}. Might.',
      'Some chance of rain between {start} and {end}. A coin toss, really.',
    ],
    rainCommuteAM: [
      'Rain around {start}, right on commute time. Of course.',
      'The rain shows up around {start}, just in time to join you on the way in.',
    ],
    rainCommutePM: [
      'Rain arrives around {start}, perfectly timed for the trip home.',
      'Dry all day, wet for the ride home: rain from around {start}.',
    ],
    drizzle: [
      'Drizzle between {start} and {end}: not quite rain, just enough to be annoying.',
      'Fine drizzle from {start} to {end}. Your hair will notice before you do.',
    ],
    downpour: [
      'Heavy downpour possible around {t}. Not the moment for a stroll.',
      'Around {t}, the sky empties the bucket. Stay under cover if you can.',
    ],
    thunder: [
      'Thunderstorms possible between {start} and {end}. When thunder roars, go indoors.',
      'Storms brewing from {start} to {end}: lightning, rumbles, the works. Stay off open ground.',
    ],
    thunderSnow: [
      'Thundersnow around {start}: snow AND lightning. Rare, weird and a bit spectacular.',
    ],

    // Winter
    snowLight: [
      'A few flakes between {start} and {end}. Pretty, not much more.',
      'Light snow from {start} to {end}: postcard mode, not shovel mode.',
    ],
    snow: [
      'Snow from {start} to {end}. Roads get slippery, so take it slow.',
      'Snow falls between {start} and {end}. Hot chocolate is officially justified.',
    ],
    snowHeavy: [
      'Heavy snow between {start} and {end}. Travel will be difficult; only go out if you must.',
      'Lots of snow expected from {start} to {end}. Expect delays and slippery roads.',
    ],
    blizzard: [
      'Blizzard conditions from around {start}: heavy snow and strong wind. Stay put if you can.',
    ],
    slush: [
      'Wet snow from around {start}, melting into slush. The worst of both worlds.',
      'Snow that can’t commit, from around {start}. Waterproof shoes recommended.',
    ],
    sleet: [
      'Sleet between {start} and {end}: rain that couldn’t decide whether to be snow.',
      'Sleet from {start} to {end}. Cold, wet and sideways: a triple threat.',
    ],
    freezingRain: [
      'Freezing rain from around {start}: roads and pavements can turn to glass. Avoid travel if you can.',
      'Freezing rain around {start}. Every surface can ice over, so take extreme care.',
    ],

    // Ice & fog
    blackIce: [
      'Icy patches likely around {t}. Walk like a penguin, drive like a grandparent.',
      'Wet ground meets freezing air: watch for black ice around {t}.',
    ],
    frost: [
      'Frosty start at {low}. Windscreen scrapers, assemble.',
      'Down to {low} early on: frost on cars, lawns and possibly your mood.',
    ],
    fogMorning: [
      'Fog until about {end}. Low beams on, patience on.',
      'Pea soup outside until around {end}. The view comes back later, promise.',
    ],
    fogTonight: [
      'Fog forms around {start}. Drive slowly and use your low beams.',
      'Fog rolls in around {start}. Very atmospheric, very bad for visibility.',
    ],
    freezingFog: [
      'Freezing fog until around {end}: poor visibility and icy surfaces. Take care on the road.',
    ],

    // Sky
    sunnyAllDay: [
      'Sunshine from morning to evening, up to {high}. The sky has nothing to hide.',
      'Blue sky all day, up to {high}. Suspiciously nice.',
    ],
    grayAllDay: [
      'Gray from start to finish. The sun called in sick.',
      'Fifty shades of gray, mostly the dull ones. At least it’s dry.',
    ],
    clearingLater: [
      'Cloudy start, but the sun breaks through around {t}. Worth the wait.',
      'The clouds pack up around {t}; the second half looks much better.',
    ],
    cloudingLater: [
      'Sunny start, clouds roll in around {t}. Get your sunshine early.',
      'Enjoy the sun while it lasts: clouds take over around {t}.',
    ],
    perfectDay: [
      'Textbook day: dry, sunny, {high}. If you stay inside, that’s on you.',
      '{high}, sunshine, no rain. Honestly, it doesn’t get much better.',
      'Top-shelf weather: dry, bright and {high}. Find an excuse to go outside.',
    ],

    // Temperature
    bigSwing: [
      'From {low} in the morning to {high} in the afternoon. Your wardrobe needs a strategy.',
      '{low} early, {high} later. Your jacket will spend the afternoon in your hand.',
    ],
    warm: [
      'Warm one, up to {high}. Shorts are a valid life choice.',
      'Up to {high}: warm enough to make ice cream a reasonable lunch.',
    ],
    hot: [
      'Hot: feels like {feels} between {start} and {end}. Shade, water, slow down.',
      'Feels like {feels} from {start} to {end}. Anything strenuous: before or after.',
    ],
    extremeHeat: [
      'Extreme heat, feeling like {feels}. Avoid the sun between {start} and {end}, drink often and check on vulnerable people.',
    ],
    tropicalNight: [
      'Tropical night: it won’t drop below {low}. Sleeping will be an endurance sport.',
      'Only down to {low} tonight. Fan on, blanket off.',
    ],
    freezingDay: [
      'Below freezing all day, {high} at best. The outdoors is basically a freezer.',
      'No thaw in sight: {high} at most. Gloves are not optional.',
    ],
    bitterCold: [
      'Bitter cold: feels like {feels}. Cover every bit of skin you can.',
      'Feels like {feels}. Even penguins would ask for a scarf.',
    ],
    extremeCold: [
      'Dangerous cold, feeling like {feels}. Frostbite can set in within minutes; limit time outside.',
    ],
    windChill: [
      'The thermometer says one thing, the wind says {feels}. Trust the wind.',
      'The wind makes it feel like {feels}. Hood up.',
    ],
    muggy: [
      'Muggy and sticky: you’ll feel like a steamed dumpling by midday.',
      'Humid enough to swim through the air. Breathable fabrics, please.',
    ],
    tempDrop: [
      'Sharp drop around {t}: about {diff} colder within a few hours. Keep a jacket nearby.',
      'A cold front barges in around {t} and knocks off {diff}.',
    ],
    eveningChill: [
      'It cools off fast: {low} by {t}. That jacket you don’t need now? Bring it.',
      'Down to {low} by {t}. The evening has a different dress code.',
    ],
    warmForSeason: [
      '{high}? For this time of year, that’s practically a gift.',
      'Unusually mild at {high}. Nature seems to have lost the calendar.',
    ],
    coldForSeason: [
      'Only {high}. Summer hit the snooze button.',
      'Just {high} at best. Not very seasonal, but here we are.',
    ],
    sunnyButCold: [
      'Bright sun, {high} at most: all show, no warmth.',
      'Sunny but only {high}. It looks warm through the window. It is not.',
    ],

    // Wind
    breezy: [
      'Breezy, up to {wind}. Bad hair day, good kite day.',
      'A lively breeze, up to {wind}. Hold on to your hat.',
    ],
    windy: [
      'Windy, up to {wind}. Umbrellas will turn inside out.',
      'Wind up to {wind}. Secure the light stuff, and your hairstyle.',
    ],
    gale: [
      'Strong wind up to {wind}. Secure garden furniture and watch for falling branches.',
      'Gale-force gusts up to {wind}. Not the day to carry a large sheet of plywood.',
    ],
    storm: [
      'Storm-force wind up to {wind}. Keep away from trees, scaffolding and the coast.',
    ],
    hurricane: [
      'Hurricane-force wind up to {wind}. Follow the instructions of local authorities.',
    ],

    // Exposure
    uvHigh: [
      'UV {uv} around {t}. Sunscreen, unless you’re going for the lobster look.',
      'UV reaches {uv} around {t}. Sunglasses on, sunscreen too.',
    ],
    uvVeryHigh: [
      'Very high UV ({uv}) between {start} and {end}. Sunscreen and shade, seriously.',
      'UV {uv} from {start} to {end}: skin burns faster than toast.',
    ],
    uvExtreme: [
      'Extreme UV ({uv}). Unprotected skin burns in minutes: cover up and seek shade at midday.',
    ],
    airPoor: [
      'Air quality is poor. Maybe move that run indoors.',
      'The air’s not great right now. Sensitive lungs, take it easy.',
    ],
    airVeryPoor: [
      'Air quality is very poor. Limit strenuous activity outdoors, especially if you’re sensitive.',
    ],

    // Night
    clearNight: [
      'Clear skies tonight, down to {low}. A good night for looking up.',
      'Starry night ahead, {low} at the coldest.',
    ],
    calmNight: [
      'Quiet night ahead, down to {low}. The weather’s off duty.',
      'Nothing to report tonight: {low} at the coldest. Sleep well.',
    ],
    nightRainAll: [
      'Rain all night. Great sleeping soundtrack, bad night for the dog walk.',
      'Rain from now until morning. The gutters will be busy.',
    ],
    nightRainFrom: [
      'Rain moves in around {start} and stays the night. Bring the cushions in.',
      'Dry until {start}, then rain on the rooftops all night.',
    ],
    nightRainUntil: [
      'Rain until about {end}, then a dry rest of the night.',
      'The rain calls it a night around {end}.',
    ],
    nightRainWindow: [
      'Rain between {start} and {end}, dry otherwise.',
      'A wet spell from {start} to {end}, then quiet again.',
    ],
    nightSnow: [
      'Snow from around {start}. You might wake up to a white world.',
      'Snow overnight from {start}. Tomorrow may look like a postcard and drive like an ice rink.',
    ],
    nightStorm: [
      'Thunderstorms possible between {start} and {end}. Unplug what you care about.',
      'Storms between {start} and {end}. The dog will want to sleep in your bed.',
    ],

    // Tomorrow
    tomorrowColder: [
      'About {diff} colder, topping out at {high}. Get the warm coat out tonight.',
      'Temperatures drop by {diff}: {high} at best. Enjoy today while it lasts.',
    ],
    tomorrowWarmer: [
      'About {diff} warmer, up to {high}. Something to look forward to.',
      'A {diff} jump, up to {high}. Tomorrow’s you says thanks.',
    ],

    // Calm
    calmSunny: [
      'Sunny and uneventful, {low} to {high}. The weather has a day off.',
      'Nice and easy: sunshine, {low} to {high}, nothing to worry about.',
    ],
    calmCloudy: [
      'Cloudy but dry, {low} to {high}. Not exciting, not a problem.',
      'Grayish and calm, {low} to {high}. A perfectly average day, weather-wise.',
    ],
    calmMixed: [
      'Sun and clouds taking turns, {low} to {high}. No drama.',
      'A bit of everything except rain: {low} to {high}.',
    ],

    // Extras
    fullMoon: [
      'Full moon tonight with a clear sky. Werewolves, you’ve been warned.',
      'Full moon and clear skies: nature’s night light is on.',
    ],
    supermoon: ['Supermoon tonight: the Moon is extra close and extra bright. Look up!'],
    newMoonStars: [
      'New moon and a clear sky: prime stargazing. Get away from the city lights.',
      'No moon, no clouds: the stars have the stage tonight.',
    ],
    meteors: [
      'The {name} peak tonight: up to {rate} shooting stars an hour. Have your wishes ready.',
      'Clear sky for the {name} tonight, up to {rate} meteors an hour. Look up, far from the lights.',
    ],
    goldenHour: [
      'Golden hour from {golden}, sunset at {sunset}. Photographers, positions.',
      'Clear sky at sunset ({sunset}). Worth a look out the window around {golden}.',
    ],
    sunriseClear: [
      'Sunrise at {sunrise} under a clear sky. Early birds get the show.',
    ],
    midnightSun: ['The sun won’t set today. Blackout curtains are your best friend.'],
    polarNight: ['No sunrise today: polar night. Vitamin D, candles and good company.'],
    longestDay: [
      'Longest day of the year: {daylight} of daylight. Use it wisely (or at least outside).',
    ],
    shortestDay: [
      'Shortest day of the year: only {daylight} of daylight. From tomorrow, the light fights back.',
    ],
    springEquinox: ['Spring equinox: day and night are equal. From here on, the light wins.'],
    autumnEquinox: ['Autumn equinox: day and night are equal. The nights win from here. Blankets ready.'],
    earlySunset: ['Sunset at {sunset}. Yes, already.', 'The sun clocks out at {sunset}. Lucky sun.'],
    lateSunset: ['Sunset only at {sunset}: long evening ahead.'],
    whiteChristmas: ['Snow at Christmas: the real deal. Somebody cue the music.'],
    greenChristmas: ['{high} at Christmas. Santa might swap the sleigh for a scooter.'],
    nyeDry: ['Around midnight: dry, {low}. Perfect for the fireworks.'],
    nyeWet: ['Rain possible around midnight: fireworks under umbrellas it is.'],
    halloween: ['Halloween with this weather? The spooky atmosphere is on the house.'],
  },

  tips: {
    umbrella: [
      'Umbrella: yes. Suede shoes: no.',
      'Pack an umbrella. Future you says thanks.',
      'Umbrella in the bag. It weighs less than regret.',
    ],
    raincoat: [
      'Rain plus wind makes umbrellas a lost cause. Hooded raincoat instead.',
      'Too windy for an umbrella: a hooded jacket will do a better job.',
    ],
    snowBoots: ['Proper shoes today: grip over style.', 'Boots with grip, and leave a bit earlier.'],
    snowman: ['Snow and no work: snowman time. Carrot not included.'],
    layers: [
      'Layers: you’ll peel them off in the afternoon and put them back on at night.',
      'Dress like an onion: several layers, removable one by one.',
    ],
    sunscreen: [
      'Sunscreen, even if it’s not a beach day. Especially your nose.',
      'SPF on, sunglasses on. Your skin will thank you in 20 years.',
    ],
    scrape: [
      'Leave 5 minutes early to scrape the windscreen.',
      'Scraper at the ready. Hot water on the windscreen: never.',
    ],
    hydrate: [
      'Water bottle mandatory. Coffee doesn’t count.',
      'Drink before you’re thirsty and stay in the shade at midday.',
    ],
    bundleUp: ['Hat, gloves, scarf: the full kit.', 'Dress warm. Then add one more layer.'],
    laundry: [
      'Perfect laundry weather: sun, breeze, no rain. The dryer can take a day off.',
      'Hang the washing out; it’ll dry in record time.',
    ],
    terrace: [
      'Warm evening ahead: terrace, barbecue or picnic, your pick.',
      'An evening made for eating outside. Just saying.',
    ],
    mosquitoes: ['Warm, muggy evening: mosquitoes are on the guest list. Repellent recommended.'],
    noCarWash: ['Washing the car? Tomorrow’s rain will do it for free.'],
    stayIn: [
      'Stay indoors if you can, charge your phone and keep a flashlight handy.',
      'Postpone any non-essential travel and keep your phone charged.',
    ],
    secureObjects: ['Tie down or bring in anything that could fly: bins, trampolines, garden chairs.'],
    extraTime: ['Allow extra travel time and walk carefully.', 'Slow down on the road and give yourself extra time.'],
    jacketEvening: ['Bring a jacket for the evening, even if it feels silly right now.'],
  },

  meteorNames: {
    quadrantids: 'Quadrantids',
    lyrids: 'Lyrids',
    etaAquariids: 'Eta Aquariids',
    perseids: 'Perseids',
    orionids: 'Orionids',
    leonids: 'Leonids',
    geminids: 'Geminids',
  },
};
