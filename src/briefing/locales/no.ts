import type { PhraseBank } from '../types';

// Norwegian style: "kl. 14", "kl. 19.42" (period between hours and minutes).
const hour = (h: number): string => (h === 0 ? 'midnatt' : `kl. ${h}`);
const time = (h: number, m: number): string => `kl. ${h}.${String(m).padStart(2, '0')}`;
const duration = (min: number): string => `${Math.floor(min / 60)} t ${min % 60} min`;

export const no: PhraseBank = {
  title: 'Dagen din i korte trekk',
  labels: {
    today: 'I dag',
    tonight: 'I natt',
    tomorrow: 'I morgen',
    laterToday: 'Når du våkner',
  },
  hour,
  time,
  duration,

  greetings: {
    earlyBird: ['Oppe før sola? Respekt.', 'A-menneske! Været har knapt gnidd søvnen ut av øynene.'],
    morning: [
      'God morgen! Her er dagen i et nøtteskall.',
      'God morgen! Kaffe først, så dette.',
      'God morgen. Himmelen har planer for deg.',
    ],
    midday: ['Matpakke og værsjekk.', 'Halvveis gjennom dagen. Her er resten.'],
    afternoon: ['God ettermiddag! Her er det som er igjen av dagen.', 'Ettermiddagsrapporten er klar.'],
    evening: ['God kveld! I natt og i morgen, kort fortalt.', 'Kveldens værmelding, servert varm.'],
    late: ['Sen sjekk? Her er natten og morgendagen.', 'En siste titt før leggetid.'],
    nightOwl: [
      'Fortsatt våken? Været sover, det burde du også.',
      'Nattugle observert. Her er det som kommer.',
    ],
    firstWorkday: ['Mandag. Dette kommer vi oss gjennom sammen.', 'Mandag morgen. Pust dypt.'],
    midweek: ['Onsdag – lillelørdag! Halvveis til helgen.', 'Onsdag: nå går det nedoverbakke mot helgen.'],
    lastWorkday: ['Fredag! Helgen er i sikte.', 'Det er fredag. Du er (nesten) i mål.'],
    lastWorkdayEvening: ['Fredagstaco-tid! Her er helgeværet.', 'Helgen starter nå. Værmeldingen også.'],
    weekend: ['Endelig {day}! Ingen vekkerklokke i dag.', 'Helgemodus: på.'],
    weekendEnd: [
      'Søndagskveld. Morgendagens vær, skånsomt servert.',
      'Helgen går mot slutten. Her er det som venter.',
    ],
    newYear: ['Godt nytt år! Årets første værmelding.'],
    newYearsEve: ['Årets siste dag! Her er den siste værmeldingen.'],
    christmas: ['God jul! Værmeldingen din, pakket inn i julepapir.'],
    halloween: ['God halloween! Knask eller knep? Værmeldingen byr på knask.'],
    friday13: ['Fredag den 13. Les værmeldingen – hvis du tør.'],
    aprilFools: ['1. april. Denne værmeldingen er ingen aprilspøk. Sannsynligvis.'],
    valentine: ['God valentinsdag! Været, med kjærlighet.'],
    alert: ['OBS: krevende vær på vei.', 'Viktig: været krever oppmerksomheten din.'],
  },

  lines: {
    // Regn
    rainAllDay: [
      'Regn hele dagen. I Bergen kaller de det bare «vær».',
      'Vått, våtere, våtest: regnet tar knapt en pause.',
      'Det finnes ikke dårlig vær, bare dårlige klær. Nå blir teorien testet: regn hele dagen.',
    ],
    rainLater: [
      'Opphold til rundt {start}, så regn resten av dagen.',
      'Ærend? Ta dem før {start}, da flytter regnet inn for godt.',
      'Nyt det tørre: regnet stempler inn rundt {start} og jobber overtid.',
    ],
    rainStops: [
      'Våt start, men det tørker opp rundt {end}. Tålmodighet lønner seg.',
      'Regnet pakker kofferten rundt {end}. Hold ut.',
      'Regn til rundt {end}, så roer himmelen seg.',
    ],
    rainWindow: [
      'Byger mellom {start} og {end}, tørt før og etter. Timing er alt.',
      'Regn booket fra {start} til {end}. Resten er tørt.',
      'Et vått vindu fra {start} til {end}: legg uteplanene rundt det.',
    ],
    rainBrief: [
      'En rask byge rundt {t}. Blunk og du går glipp av den – med mindre du er ute.',
      'En kort byge rundt {t}, så er alt som før.',
    ],
    rainOnOff: [
      'Byger av og på. Himmelen klarer ikke å bestemme seg.',
      'Bygene kommer og går som en katt ved døra: inn, ut, inn, ut.',
      'Aprilvær, uansett måned. Ta med både solbriller og paraply, og stol ikke på noen av dem.',
    ],
    showersPossible: [
      'En byge kan dukke opp mellom {start} og {end}. Kan.',
      'Litt fare for regn mellom {start} og {end}. Kron eller mynt, egentlig.',
    ],
    rainCommuteAM: [
      'Regn rundt {start}, akkurat når du skal på jobb. Selvfølgelig.',
      'Regnet dukker opp rundt {start}, akkurat tidsnok til å følge deg til jobben.',
    ],
    rainCommutePM: [
      'Regnet kommer rundt {start}, perfekt timet til hjemturen.',
      'Tørt hele dagen, vått på vei hjem: regn fra rundt {start}.',
    ],
    drizzle: [
      'Yr mellom {start} og {end}: ikke helt regn, bare akkurat nok til å irritere.',
      'Fint yr fra {start} til {end}. Håret merker det før deg.',
    ],
    downpour: [
      'Kraftig regnskyll mulig rundt {t}. Ikke tiden for en spasertur.',
      'Rundt {t} tømmer himmelen bøtta. Hold deg under tak hvis du kan.',
    ],
    thunder: [
      'Fare for torden mellom {start} og {end}. Når tordenen buldrer, gå inn.',
      'Tordenvær på gang fra {start} til {end}: lyn, brak, hele pakka. Unngå åpne områder.',
    ],
    thunderSnow: ['Tordensnø rundt {start}: snø OG lyn. Sjeldent, rart og ganske spektakulært.'],

    // Vinter
    snowLight: [
      'Noen fnugg mellom {start} og {end}. Pent, ikke så mye mer.',
      'Lett snø fra {start} til {end}: postkortmodus, ikke måkemodus.',
    ],
    snow: [
      'Snø fra {start} til {end}. Veiene blir glatte, så ta det rolig.',
      'Snøfall mellom {start} og {end}. Kakao er offisielt berettiget.',
    ],
    snowHeavy: [
      'Kraftig snøfall mellom {start} og {end}. Det blir vanskelig å komme fram; gå bare ut hvis du må.',
      'Mye snø ventes fra {start} til {end}. Regn med forsinkelser og glatte veier.',
    ],
    blizzard: ['Snøstorm fra rundt {start}: kraftig snøfall og sterk vind. Hold deg inne hvis du kan.'],
    slush: [
      'Våt snø fra rundt {start} som blir til sørpe. Det verste fra begge verdener.',
      'Snø som ikke klarer å bestemme seg, fra rundt {start}. Vanntette sko anbefales.',
    ],
    sleet: [
      'Sludd mellom {start} og {end}: regn som ikke helt turte å bli snø.',
      'Sludd fra {start} til {end}. Kaldt, vått og på skrå.',
    ],
    freezingRain: [
      'Underkjølt regn fra rundt {start}: veier og fortau kan bli som glass. Unngå å reise hvis du kan.',
      'Underkjølt regn rundt {start}. Alle flater kan fryse til is, så vær svært forsiktig.',
    ],

    // Is og tåke
    blackIce: [
      'Fare for glattis rundt {t}. Brodder på, eller gå som en pingvin.',
      'Våt bakke møter kuldegrader: se opp for svart is rundt {t}.',
    ],
    frost: [
      'Frostkald start, ned mot {low}. Isskrapa, gjør deg klar.',
      'Ned til {low} tidlig: rim på biler, plener og kanskje humøret.',
    ],
    fogMorning: [
      'Tåke til rundt {end}. Nærlyset på, tålmodigheten også.',
      'Tåke tykk som graut til rundt {end}. Utsikten kommer tilbake, lover.',
    ],
    fogTonight: [
      'Tåke dannes rundt {start}. Kjør forsiktig og bruk nærlys.',
      'Tåka siger inn rundt {start}. Veldig stemningsfullt, veldig dårlig sikt.',
    ],
    freezingFog: ['Underkjølt tåke til rundt {end}: dårlig sikt og glatte flater. Vær forsiktig i trafikken.'],

    // Himmel
    sunnyAllDay: [
      'Sol fra morgen til kveld, opp til {high}. Himmelen har ingenting å skjule.',
      'Blå himmel hele dagen, opp til {high}. Mistenkelig fint.',
    ],
    grayAllDay: [
      'Grått fra start til slutt. Sola har meldt seg syk.',
      'Grått i grått, men i det minste tørt. Perfekt for en kaffe inne.',
    ],
    clearingLater: [
      'Skyet start, men sola titter fram rundt {t}. Verdt å vente på.',
      'Skyene pakker sammen rundt {t}; andre halvdel ser mye bedre ut.',
    ],
    cloudingLater: [
      'Sol til å begynne med, skyer fra rundt {t}. Ta sola tidlig.',
      'Nyt sola mens den varer: skyene tar over rundt {t}.',
    ],
    perfectDay: [
      'Lærebokdag: tørt, sol, {high}. Blir du inne, er det ditt valg.',
      '{high}, sol og ikke regn. Ærlig talt, bedre blir det ikke.',
      'Ut på tur, aldri sur: tørt, lyst og {high}. Pakk sekken.',
    ],

    // Temperatur
    bigSwing: [
      'Fra {low} om morgenen til {high} på ettermiddagen. Kle deg som en løk.',
      '{low} tidlig, {high} senere. Jakka tilbringer ettermiddagen under armen.',
    ],
    warm: [
      'Varmt, opp til {high}. Shorts er et helt gyldig livsvalg.',
      'Opp til {high}: varmt nok til at is teller som lunsj.',
    ],
    hot: [
      'Hett: føles som {feels} mellom {start} og {end}. Skygge, vann, ta det rolig.',
      'Føles som {feels} fra {start} til {end}. Alt som er slitsomt: før eller etter.',
    ],
    extremeHeat: [
      'Ekstrem varme, føles som {feels}. Unngå sola mellom {start} og {end}, drikk ofte og følg med på sårbare personer.',
    ],
    tropicalNight: [
      'Tropenatt: det blir ikke kjøligere enn {low}. Å sove blir en utholdenhetsidrett.',
      'Bare ned til {low} i natt. Vifta på, dyna av.',
    ],
    freezingDay: [
      'Kuldegrader hele dagen, {high} på det meste. Ute er i praksis en fryser.',
      'Ikke noe mildvær i sikte: {high} på det meste. Votter er ikke valgfritt.',
    ],
    bitterCold: [
      'Bitende kaldt: føles som {feels}. Dekk til all hud du kan.',
      'Føles som {feels}. Nå hjelper bare ull, ull og mer ull.',
    ],
    extremeCold: [
      'Farlig kulde, føles som {feels}. Forfrysninger kan oppstå i løpet av minutter; begrens tiden ute.',
    ],
    windChill: [
      'Termometeret sier én ting, vinden sier {feels}. Stol på vinden.',
      'Vinden gjør at det føles som {feels}. Hetta opp.',
    ],
    muggy: [
      'Lummert og klissete: ved lunsj føler du deg som en dampet dumpling.',
      'Så fuktig at du nesten kan svømme gjennom lufta. Velg luftige klær.',
    ],
    tempDrop: [
      'Kraftig temperaturfall rundt {t}: omtrent {diff} kaldere i løpet av noen timer. Ha jakka nær.',
      'En kaldfront braser inn rundt {t} og tar {diff} med seg.',
    ],
    eveningChill: [
      'Det kjøles fort ned: {low} rundt {t}. Jakka du ikke trenger nå? Ta den med.',
      'Ned til {low} rundt {t}. Kvelden har en annen dresskode.',
    ],
    warmForSeason: [
      '{high}? For årstiden er det nesten en gave.',
      'Uvanlig mildt, {high}. Naturen ser ut til å ha mistet kalenderen.',
    ],
    coldForSeason: [
      'Bare {high}. Årstiden har visst trykket på slumreknappen.',
      'Maks {high}. Ikke akkurat sesongriktig, men sånn er det.',
    ],
    sunnyButCold: [
      'Strålende sol, {high} på det meste: mye show, lite varme.',
      'Sol, men bare {high}. Gjennom vinduet ser det varmt ut. Det er det ikke.',
    ],

    // Vind
    breezy: [
      'Frisk bris, opp til {wind}. Dårlig hårdag, god dragedag.',
      'En sprek bris, opp til {wind}. Hold på lua.',
    ],
    windy: [
      'Mye vind, opp til {wind}. Paraplyene kommer til å vrenge seg.',
      'Vind opp til {wind}. Sikre det som er lett, og frisyren.',
    ],
    gale: [
      'Kraftig vind opp til {wind}. Sikre hagemøblene og se opp for fallende greiner.',
      'Kraftige vindkast opp til {wind}. Ikke dagen for å bære hjem en stor gipsplate.',
    ],
    storm: ['Vind av stormstyrke, opp til {wind}. Hold deg unna trær, stillaser og kysten.'],
    hurricane: ['Orkan, vind opp til {wind}. Følg rådene fra lokale myndigheter.'],

    // Eksponering
    uvHigh: [
      'UV {uv} rundt {t}. Solkrem, med mindre du sikter mot hummerfarge.',
      'UV-indeksen når {uv} rundt {t}. Solbriller på, solkrem også.',
    ],
    uvVeryHigh: [
      'Svært høy UV ({uv}) mellom {start} og {end}. Solkrem og skygge, helt seriøst.',
      'UV {uv} fra {start} til {end}: huden brenner fortere enn en toast.',
    ],
    uvExtreme: [
      'Ekstrem UV ({uv}). Ubeskyttet hud brenner på få minutter: dekk til og søk skygge midt på dagen.',
    ],
    airPoor: [
      'Dårlig luftkvalitet. Kanskje ta løpeturen innendørs.',
      'Lufta er ikke helt på topp nå. Sensitive lunger, ta det med ro.',
    ],
    airVeryPoor: [
      'Svært dårlig luftkvalitet. Begrens anstrengende aktivitet ute, særlig hvis du er sårbar.',
    ],

    // Natt
    clearNight: [
      'Klar himmel i natt, ned til {low}. En fin natt for å se opp.',
      'Stjerneklart i natt, {low} på det kaldeste.',
    ],
    calmNight: [
      'Rolig natt, ned til {low}. Været har fri.',
      'Ingenting å melde i natt: {low} på det kaldeste. Sov godt.',
    ],
    nightRainAll: [
      'Regn hele natten. Perfekt søvnlyd, verre for hundeluftingen.',
      'Regn fra nå til morgenen. Takrennene får jobbe.',
    ],
    nightRainFrom: [
      'Regnet kommer rundt {start} og blir natten over. Ta inn putene.',
      'Tørt til {start}, så trommer regnet på taket hele natten.',
    ],
    nightRainUntil: [
      'Regn til rundt {end}, så tørt resten av natten.',
      'Regnet legger seg rundt {end}.',
    ],
    nightRainWindow: [
      'Regn mellom {start} og {end}, ellers tørt.',
      'En våt periode fra {start} til {end}, så rolig igjen.',
    ],
    nightSnow: [
      'Snø fra rundt {start}. Kanskje du våkner til en hvit verden.',
      'Snø i natt fra {start}. I morgen: postkort i vinduet, skøytebane på veien.',
    ],
    nightStorm: [
      'Fare for torden mellom {start} og {end}. Trekk ut kontakten på det du er glad i.',
      'Torden mellom {start} og {end}. Hunden kommer til å ville sove i senga di.',
    ],

    // I morgen
    tomorrowColder: [
      'Omtrent {diff} kaldere, maks {high}. Finn fram vinterjakka i kveld.',
      'Temperaturen faller {diff}: {high} på det meste. Nyt dagen i dag.',
    ],
    tomorrowWarmer: [
      'Omtrent {diff} varmere, opp til {high}. Noe å glede seg til.',
      'Et hopp på {diff}, opp til {high}. Morgendagens deg sier takk.',
    ],

    // Rolig
    calmSunny: [
      'Sol og ingen dramatikk, {low} til {high}. Været har fridag.',
      'Rolig og fint: sol, {low} til {high}, ingenting å bekymre seg for.',
    ],
    calmCloudy: [
      'Skyet, men tørt, {low} til {high}. Ikke spennende, ikke noe problem.',
      'Gråaktig og rolig, {low} til {high}. En helt gjennomsnittlig dag, værmessig.',
    ],
    calmMixed: [
      'Sol og skyer bytter på, {low} til {high}. Null drama.',
      'Litt av alt unntatt regn: {low} til {high}.',
    ],

    // Ekstra
    fullMoon: [
      'Fullmåne i kveld under klar himmel. Varulver, dere er advart.',
      'Fullmåne og klar himmel: naturens nattlampe er tent.',
    ],
    supermoon: ['Supermåne i kveld: månen er ekstra nær og ekstra lys. Se opp!'],
    newMoonStars: [
      'Nymåne og klar himmel: perfekt for stjernekikking. Kom deg unna bylysene.',
      'Ingen måne, ingen skyer: i natt har stjernene scenen for seg selv.',
    ],
    meteors: [
      '{name} topper seg i natt: opptil {rate} stjerneskudd i timen. Ha ønskene klare.',
      'Klar himmel for {name} i natt, opptil {rate} meteorer i timen. Se opp, langt fra lysene.',
    ],
    goldenHour: [
      'Gyllen time fra {golden}, solnedgang {sunset}. Fotografer, innta posisjonene.',
      'Klar himmel ved solnedgang ({sunset}). Verdt en titt ut vinduet rundt {golden}.',
    ],
    sunriseClear: ['Soloppgang {sunrise} under klar himmel. A-menneskene får hele forestillingen.'],
    midnightSun: ['Sola går ikke ned i dag – midnattssol! Blendingsgardiner er din beste venn.'],
    polarNight: ['Ingen soloppgang i dag: mørketid. Tran, stearinlys og godt selskap. Koselig, egentlig.'],
    longestDay: ['Årets lengste dag: {daylight} dagslys. Bruk det godt (eller i det minste ute).'],
    shortestDay: ['Årets korteste dag: bare {daylight} dagslys. Fra i morgen slår lyset tilbake.'],
    springEquinox: ['Vårjevndøgn: dag og natt er like lange. Herfra vinner lyset.'],
    autumnEquinox: ['Høstjevndøgn: dag og natt er like lange. Nå vinner mørket – finn fram pleddet og tenn lys.'],
    earlySunset: ['Solnedgang {sunset}. Ja, allerede.', 'Sola går hjem allerede {sunset}. Heldiggris.'],
    lateSunset: ['Solnedgang først {sunset}: lang kveld i vente.'],
    whiteChristmas: ['Snø til jul: ekte vare. Nå mangler bare «Tre nøtter til Askepott».'],
    greenChristmas: ['{high} i jula. Nissen bytter kanskje sleden mot elsparkesykkel.'],
    nyeDry: ['Rundt midnatt: tørt, {low}. Perfekt for rakettene.'],
    nyeWet: ['Fare for nedbør rundt midnatt: raketter under paraply, altså.'],
    halloween: ['Halloween i dette været? Den skumle stemningen spanderer vi.'],
  },

  tips: {
    umbrella: [
      'Paraply: ja. Semskede sko: nei.',
      'Pakk en paraply. Fremtidens deg sier takk.',
      'Paraply i veska. Den veier mindre enn anger.',
    ],
    raincoat: [
      'Regn pluss vind gjør paraplyen sjanseløs. Regnjakke med hette i stedet.',
      'For mye vind for paraply. Ikke dårlig vær, bare dårlige klær: ta regnjakka.',
    ],
    snowBoots: ['Ordentlige sko i dag: feste før stil.', 'Sko med godt grep, og dra litt tidligere.'],
    snowman: ['Snø og fri: tid for snømann. Gulrot ikke inkludert.'],
    layers: [
      'Lag på lag: av med dem på ettermiddagen, på igjen i kveld.',
      'Løkprinsippet: flere lag du kan skrelle av ett om gangen.',
    ],
    sunscreen: [
      'Solkrem, selv om det ikke er stranddag. Spesielt på nesa.',
      'Solkrem på, solbriller på. Huden takker deg om 20 år.',
    ],
    scrape: [
      'Dra 5 minutter tidligere så du rekker å skrape ruta.',
      'Isskrapa klar. Varmt vann på frontruta: aldri.',
    ],
    hydrate: [
      'Vannflaske obligatorisk. Kaffe teller ikke.',
      'Drikk før du blir tørst, og hold deg i skyggen midt på dagen.',
    ],
    bundleUp: ['Lue, votter, skjerf: hele pakka.', 'Kle deg godt. Så ett lag til. Ull er gull.'],
    laundry: [
      'Perfekt tørkevær: sol, bris og ikke regn. Tørketrommelen får fri.',
      'Heng ut klesvasken, den tørker på rekordtid.',
    ],
    terrace: [
      'Varm kveld i vente: terrasse, grill eller piknik, du velger.',
      'En kveld skapt for å spise ute. Bare sier det.',
    ],
    mosquitoes: ['Varm, lummer kveld: myggen står på gjestelista. Myggmiddel anbefales.'],
    noCarWash: ['Tenkt å vaske bilen? Morgendagens regn gjør det gratis.'],
    stayIn: [
      'Hold deg inne hvis du kan, lad telefonen og ha en lommelykt klar.',
      'Utsett alle reiser som ikke er nødvendige, og hold telefonen ladet.',
    ],
    secureObjects: ['Fest eller ta inn alt som kan blåse vekk: søppeldunker, trampoliner, hagestoler.'],
    extraTime: ['Beregn ekstra reisetid og gå forsiktig.', 'Senk farten og gi deg selv ekstra tid.'],
    jacketEvening: ['Ta med jakke til kvelden, selv om det føles dumt akkurat nå.'],
  },

  meteorNames: {
    quadrantids: 'Kvadrantidene',
    lyrids: 'Lyridene',
    etaAquariids: 'Eta Aquaridene',
    perseids: 'Perseidene',
    orionids: 'Orionidene',
    leonids: 'Leonidene',
    geminids: 'Geminidene',
  },
};
