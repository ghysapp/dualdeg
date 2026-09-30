import type { PhraseBank } from '../types';

// Mid-sentence hours carry their own "kl.": "fra kl. 14", "omkring midnat".
// Templates must never write "kl." themselves.
const hour = (h: number): string => (h === 0 ? 'midnat' : `kl. ${h}`);
const time = (h: number, m: number): string => `kl. ${h}.${String(m).padStart(2, '0')}`;
const duration = (min: number): string => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const hh = `${h} ${h === 1 ? 'time' : 'timer'}`;
  return m === 0 ? hh : `${hh} og ${m} ${m === 1 ? 'minut' : 'minutter'}`;
};

export const da: PhraseBank = {
  title: 'Din dag kort fortalt',
  labels: {
    today: 'I dag',
    tonight: 'I nat',
    tomorrow: 'I morgen',
    laterToday: 'Når du vågner',
  },
  hour,
  time,
  duration,

  greetings: {
    earlyBird: [
      'Oppe før solen? Respekt.',
      'Morgenfrisk! Vejret gnider stadig søvnen ud af øjnene.',
      'Morgenstund har guld i mund – og her er dit vejr.',
    ],
    morning: [
      'Godmorgen! Din dag i en nøddeskal.',
      'Morgen! Først kaffe, så det her.',
      'Godmorgen. Himlen har planer for dig i dag.',
    ],
    midday: ['Frokosttid! Rugbrødet kan vente et øjeblik – her er vejret.', 'Halvvejs gennem dagen. Her er resten.'],
    afternoon: ['God eftermiddag! Her er, hvad der er tilbage af i dag.', 'Eftermiddagsrapporten er landet.'],
    evening: ['Godaften! I nat og i morgen, kort fortalt.', 'Aftenens vejrudsigt, serveret lun.'],
    late: ['Sent tjek? Her er i nat og i morgen.', 'Et sidste kig, inden du går i seng.'],
    nightOwl: [
      'Stadig oppe? Vejret sover, det burde du også.',
      'Natteravn spottet. Her er, hvad der venter.',
    ],
    firstWorkday: ['Mandag. Vi klarer det sammen.', 'Mandag morgen. Træk vejret dybt.'],
    midweek: [
      'Onsdag: halvvejs. I morgen er det lille fredag.',
      'Onsdag! Toppen er nået – og den var ikke højere end Himmelbjerget.',
    ],
    lastWorkday: [
      'Fredag! Weekenden er i sigte.',
      'Det er fredag. Du har (næsten) klaret det.',
      'Fredag! Fredagsbaren kalder snart.',
    ],
    lastWorkdayEvening: ['Fredagshygge! Her er vejret til weekenden.', 'Weekenden starter nu. Vejrudsigten også.'],
    weekend: ['Det er {day}! Intet vækkeur nødvendigt.', 'Weekendtilstand: slået til.'],
    weekendEnd: ['Søndag aften. Morgendagens vejr, helt blidt.', 'Weekenden er ved at slutte. Her er, hvad der kommer.'],
    newYear: ['Godt nytår! Årets første vejrudsigt.'],
    newYearsEve: ['Årets sidste dag! Her er den sidste vejrudsigt – kransekagen må vente lidt.'],
    christmas: ['Glædelig jul! Din vejrudsigt, pakket ind i gavepapir.'],
    halloween: ['Glædelig halloween! Vejret, helt uden numre.'],
    friday13: ['Fredag den 13. Læs vejrudsigten … hvis du tør.'],
    aprilFools: ['1. april. Denne vejrudsigt er ikke en aprilsnar. Sikkert.'],
    valentine: ['Glædelig valentinsdag! Vejret, med kærlighed.'],
    alert: ['Bemærk: Der er farligt vejr på vej.', 'Vigtigt: Vejret kræver din opmærksomhed i dag.'],
  },

  lines: {
    // Regn
    rainAllDay: [
      'Regn fra start til slut. Himlen har meget på hjerte.',
      'Vådt, vådere, vådest: Regnen holder næsten ingen pauser.',
      'Regn hele dagen. Tæppe, te og hygge – du kender opskriften.',
    ],
    rainLater: [
      'Tørvejr til omkring {start}, derefter regn resten af dagen.',
      'Ærinder? Klar dem før {start}, hvor regnen flytter ind for alvor.',
      'Nyd tørvejret: Regnen stempler ind omkring {start} og tager overarbejde.',
    ],
    rainStops: [
      'Våd start, men omkring {end} tørrer det op. Tålmodighed betaler sig.',
      'Regnen pakker kufferten omkring {end}. Hold ud.',
      'Regn til omkring {end}, derefter falder himlen til ro.',
    ],
    rainWindow: [
      'Byger mellem {start} og {end}, tørt før og efter. Timing er alt.',
      'Regn på programmet fra {start} til {end}. Resten er tørt.',
      'Et vådt vindue fra {start} til {end}: Planlæg cykelturen uden om det.',
    ],
    rainBrief: [
      'En kort byge omkring {t}. Hurtigt overstået – medmindre du står lige under den.',
      'Én kort byge omkring {t}, så er det tilbage til hverdagen.',
    ],
    rainOnOff: [
      'Byger, der kommer og går. Himlen kan ikke bestemme sig.',
      'Bygerne opfører sig som en kat ved døren: ind, ud, ind, ud.',
      'Typisk dansk vejr: Tag både solbriller og regnjakke med, og stol på ingen af dem.',
    ],
    showersPossible: [
      'Der kan komme en byge mellem {start} og {end}. Kan.',
      'Lidt risiko for regn mellem {start} og {end}. Plat eller krone, egentlig.',
    ],
    rainCommuteAM: [
      'Regn omkring {start}, lige når du skal på arbejde. Selvfølgelig.',
      'Regnen dukker op omkring {start} – lige i tide til at cykle med dig på arbejde.',
    ],
    rainCommutePM: [
      'Regnen kommer omkring {start}, perfekt timet til turen hjem.',
      'Tørt hele dagen, vådt på vej hjem: regn fra omkring {start}. Regnbukserne i cykeltasken?',
    ],
    drizzle: [
      'Støvregn mellem {start} og {end}: ikke rigtig regn, bare nok til at irritere.',
      'Småregn fra {start} til {end}. Dit hår opdager det før dig.',
    ],
    downpour: [
      'Kraftigt skybrud muligt omkring {t}. Ikke tidspunktet for en gåtur.',
      'Omkring {t} regner det skomagerdrenge. Find ly, hvis du kan.',
    ],
    thunder: [
      'Risiko for torden mellem {start} og {end}. Når det tordner, så gå indenfor.',
      'Der brygger sig noget sammen fra {start} til {end}: lyn, buldren, hele pakken. Hold dig væk fra åbent terræn.',
    ],
    thunderSnow: [
      'Tordensne omkring {start}: sne OG lyn. Sjældent, mærkeligt og ret spektakulært.',
    ],

    // Vinter
    snowLight: [
      'Et par fnug mellem {start} og {end}. Pænt, men heller ikke mere.',
      'Let sne fra {start} til {end}: postkorttilstand, ikke skovltilstand.',
    ],
    snow: [
      'Sne fra {start} til {end}. Veje og cykelstier bliver glatte, så tag det roligt.',
      'Snefald mellem {start} og {end}. Varm kakao er hermed officielt berettiget.',
    ],
    snowHeavy: [
      'Kraftigt snefald mellem {start} og {end}. Det bliver svært at komme frem; tag kun af sted, hvis det er nødvendigt.',
      'Meget sne ventes fra {start} til {end}. Regn med forsinkelser og glatte veje.',
    ],
    blizzard: [
      'Snestorm fra omkring {start}: kraftigt snefald og hård vind. Bliv, hvor du er, hvis du kan.',
    ],
    slush: [
      'Våd sne fra omkring {start}, der hurtigt bliver til sjap. Det værste fra begge verdener.',
      'Sne, der ikke kan beslutte sig, fra omkring {start}. Vandtætte sko anbefales.',
    ],
    sleet: [
      'Slud mellem {start} og {end}: regn, der ikke kunne beslutte sig for at blive sne.',
      'Slud fra {start} til {end}. Koldt, vådt og fra siden: Danmarks nationalvejr.',
    ],
    freezingRain: [
      'Isslag fra omkring {start}: Veje og fortove kan blive spejlglatte. Undgå transport, hvis du kan.',
      'Isslag omkring {start}. Alle overflader kan fryse til, så vær ekstra forsigtig.',
    ],

    // Glatføre og tåge
    blackIce: [
      'Risiko for glatføre omkring {t}. Gå som en pingvin, kør som din bedstemor.',
      'Våd jord møder frostluft: Pas på isglatte veje omkring {t}.',
    ],
    frost: [
      'Frostklar start med {low}. Isskrabere, indtag jeres pladser!',
      'Tidligt ned til {low}: rim på biler, græsplæner og måske dit humør.',
    ],
    fogMorning: [
      'Tåge til omkring {end}. Nærlys på, tålmodighed også.',
      'Du kan ikke se en hånd for dig til omkring {end}. Udsigten kommer tilbage senere, lovet.',
    ],
    fogTonight: [
      'Tåge dannes omkring {start}. Kør langsomt, og brug nærlys.',
      'Tågen ruller ind omkring {start}. Meget stemningsfuldt, meget dårligt for udsynet.',
    ],
    freezingFog: [
      'Frysende tåge til omkring {end}: dårligt udsyn og glatte overflader. Pas på i trafikken.',
    ],

    // Himmel
    sunnyAllDay: [
      'Sol fra morgen til aften, op til {high}. Himlen har intet at skjule.',
      'Blå himmel hele dagen, op til {high}. Næsten mistænkeligt.',
    ],
    grayAllDay: [
      'Gråt fra start til slut. Solen har meldt sig syg.',
      'Halvtreds nuancer af gråt, mest de kedelige. Men tørt, det er da noget.',
    ],
    clearingLater: [
      'Skyet start, men solen bryder igennem omkring {t}. Værd at vente på.',
      'Skyerne pakker sammen omkring {t}; anden halvleg ser meget bedre ud.',
    ],
    cloudingLater: [
      'Solrig start, skyerne ruller ind omkring {t}. Få din sol tidligt.',
      'Nyd solen, mens den er der: Skyerne tager over omkring {t}.',
    ],
    perfectDay: [
      'Bragende godt vejr: tørt, solrigt, {high}. Bliver du indenfor, er det din egen skyld.',
      '{high}, sol og ingen regn. Ærligt talt bliver det ikke meget bedre.',
      'Førsteklasses vejr: tørt, lyst og {high}. Find en undskyldning for at komme ud.',
    ],

    // Temperatur
    bigSwing: [
      'Fra {low} om morgenen til {high} om eftermiddagen. Lag på lag er dagens melodi.',
      '{low} tidligt, {high} senere. Din jakke kommer til at tilbringe eftermiddagen under armen.',
    ],
    warm: [
      'Varmt, op til {high}. Shorts er et helt legitimt livsvalg.',
      'Op til {high}: varmt nok til, at en is tæller som frokost.',
    ],
    hot: [
      'Hedt: føles som {feels} mellem {start} og {end}. Skygge, vand og ro på.',
      'Føles som {feels} fra {start} til {end}. Alt anstrengende: før eller efter.',
    ],
    extremeHeat: [
      'Ekstrem varme, føles som {feels}. Undgå solen mellem {start} og {end}, drik ofte, og hold øje med sårbare personer.',
    ],
    tropicalNight: [
      'Tropenat: Det bliver ikke koldere end {low}. At sove bliver en udholdenhedssport.',
      'Kun ned til {low} i nat. Ventilatoren på, dynen af.',
    ],
    freezingDay: [
      'Frost hele dagen, højst {high}. Udenfor er stort set en fryser.',
      'Ingen tø i sigte: højst {high}. Handsker er ikke til forhandling.',
    ],
    bitterCold: [
      'Bidende kulde: føles som {feels}. Dæk hver en centimeter hud.',
      'Føles som {feels}. Selv pingviner ville bede om et halstørklæde.',
    ],
    extremeCold: [
      'Farlig kulde, føles som {feels}. Forfrysninger kan opstå på få minutter; begræns tiden udenfor.',
    ],
    windChill: [
      'Termometeret siger én ting, vinden siger {feels}. Tro på vinden.',
      'Vinden får det til at føles som {feels}. Hætten op.',
    ],
    muggy: [
      'Lummert og klistret: Ved middagstid føler du dig som en frikadelle under låg.',
      'Så fugtigt, at man næsten kan svømme gennem luften. Åndbart tøj, tak.',
    ],
    tempDrop: [
      'Brat fald omkring {t}: cirka {diff} koldere på få timer. Hold en jakke ved hånden.',
      'En koldfront buldrer ind omkring {t} og barberer {diff} af.',
    ],
    eveningChill: [
      'Det køler hurtigt af: {low} omkring {t}. Den jakke, du ikke har brug for nu? Tag den med.',
      'Kun {low} omkring {t}. Aftenen har en anden dresscode.',
    ],
    warmForSeason: [
      '{high}? For årstiden er det nærmest en gave.',
      'Usædvanligt mildt med {high}. Naturen har vist mistet kalenderen.',
    ],
    coldForSeason: [
      'Kun {high}. Årstiden har trykket på snooze.',
      'Højst {high}. Ikke ligefrem årstidens vejr, men sådan er det.',
    ],
    sunnyButCold: [
      'Strålende sol, højst {high}: masser af show, ingen varme.',
      'Solrigt, men kun {high}. Det ser varmt ud gennem vinduet. Det er det ikke.',
    ],

    // Vind
    breezy: [
      'Frisk brise, op til {wind}. Dårlig hårdag, god dragedag.',
      'En livlig brise, op til {wind}. Hold fast i huen.',
    ],
    windy: [
      'Blæsende, op til {wind}. Paraplyer vender vrangen ud.',
      'Vind op til {wind}. Modvind på cyklen – uanset hvilken vej du skal.',
    ],
    gale: [
      'Kraftig vind op til {wind}. Sørg for havemøblerne, og pas på nedfaldne grene.',
      'Hårde vindstød op til {wind}. Ikke dagen at fragte en stor krydsfinerplade på cyklen.',
    ],
    storm: [
      'Storm med vind op til {wind}. Hold dig væk fra træer, stilladser og kysten.',
    ],
    hurricane: [
      'Vind af orkanstyrke, op til {wind}. Følg de lokale myndigheders anvisninger.',
    ],

    // Eksponering
    uvHigh: [
      'UV-indeks {uv}, kraftigst omkring {t}. Solcreme – medmindre du går efter hummer-looket.',
      'UV-indekset når {uv}, højest omkring {t}. Solbriller på, solcreme også.',
    ],
    uvVeryHigh: [
      'Meget højt UV-indeks ({uv}) mellem {start} og {end}. Solcreme og skygge, helt seriøst.',
      'UV-indeks {uv} fra {start} til {end}: Huden brænder hurtigere end en toast.',
    ],
    uvExtreme: [
      'Ekstremt UV-indeks ({uv}). Ubeskyttet hud forbrænder på få minutter: Dæk dig til, og søg skygge midt på dagen.',
    ],
    airPoor: [
      'Luftkvaliteten er dårlig. Måske skal løbeturen tages indenfor i dag.',
      'Luften er ikke helt god lige nu. Følsomme lunger, tag den med ro.',
    ],
    airVeryPoor: [
      'Luftkvaliteten er meget dårlig. Begræns hård fysisk aktivitet udendørs, især hvis du er følsom.',
    ],

    // Nat
    clearNight: [
      'Klar himmel i nat, ned til {low}. En god nat til at kigge op.',
      'Stjerneklar nat forude, {low}, når det er koldest.',
    ],
    calmNight: [
      'Stille nat forude, ned til {low}. Vejret har fri.',
      'Intet at melde i nat: {low}, når det er koldest. Sov godt.',
    ],
    nightRainAll: [
      'Regn hele natten. Perfekt at sove til, mindre perfekt til hundeluftningen.',
      'Regn fra nu til morgen. Tagrenderne har nattevagt.',
    ],
    nightRainFrom: [
      'Regnen kommer omkring {start} og bliver natten over. Tag hyndene ind.',
      'Tørt til {start}, derefter trommer regnen på taget hele natten.',
    ],
    nightRainUntil: [
      'Regn til omkring {end}, derefter tørt resten af natten.',
      'Regnen går i seng omkring {end}.',
    ],
    nightRainWindow: [
      'Regn mellem {start} og {end}, ellers tørt.',
      'En våd periode fra {start} til {end}, så bliver det stille igen.',
    ],
    nightSnow: [
      'Sne fra omkring {start}. Måske vågner du op til en hvid verden.',
      'Sne i nat fra {start}. I morgen: postkort fra vinduet, skøjtebane på vejen.',
    ],
    nightStorm: [
      'Risiko for torden mellem {start} og {end}. Træk stikket ud på det, du holder af.',
      'Torden mellem {start} og {end}. Hunden vil gerne sove i din seng i nat.',
    ],

    // I morgen
    tomorrowColder: [
      'Omkring {diff} koldere, højst {high}. Find den varme frakke frem i aften.',
      'Temperaturen falder {diff}: højst {high}. Nyd i dag, mens det varer.',
    ],
    tomorrowWarmer: [
      'Omkring {diff} varmere, op til {high}. Noget at glæde sig til.',
      'Et hop på {diff}, op til {high}. Morgendagens dig siger tak.',
    ],

    // Roligt
    calmSunny: [
      'Solrigt og begivenhedsløst, {low} til {high}. Vejret holder fridag.',
      'Nemt og ligetil: sol, {low} til {high}, intet at bekymre sig om.',
    ],
    calmCloudy: [
      'Skyet, men tørt, {low} til {high}. Ikke spændende, ikke et problem.',
      'Gråligt og roligt, {low} til {high}. En helt gennemsnitlig dag, vejrmæssigt.',
    ],
    calmMixed: [
      'Sol og skyer skiftes, {low} til {high}. Intet drama.',
      'Lidt af hvert, bare ikke regn: {low} til {high}.',
    ],

    // Ekstra
    fullMoon: [
      'Fuldmåne i nat under en klar himmel. Varulve, I er advaret.',
      'Fuldmåne og klar himmel: Naturens natlampe er tændt.',
    ],
    supermoon: ['Supermåne i nat: Månen er ekstra tæt på og ekstra lysende. Kig op!'],
    newMoonStars: [
      'Nymåne og klar himmel: perfekt til stjernekig. Kom væk fra byens lys.',
      'Ingen måne, ingen skyer: Stjernerne har scenen i nat.',
    ],
    meteors: [
      '{name} topper i nat: op til {rate} stjerneskud i timen. Hav dine ønsker klar.',
      'Klar himmel til {name} i nat, op til {rate} meteorer i timen. Kig op, langt fra lysene.',
    ],
    goldenHour: [
      'Den gyldne time fra {golden}, solnedgang {sunset}. Fotografer, frem med kameraet.',
      'Klar himmel ved solnedgang ({sunset}). Et kig ud ad vinduet omkring {golden} er det værd.',
    ],
    sunriseClear: ['Solen står op {sunrise} på en skyfri himmel. Morgenfriske får forestillingen.'],
    midnightSun: ['Solen går ikke ned i dag. Mørklægningsgardiner er din bedste ven.'],
    polarNight: ['Ingen solopgang i dag: polarnat. D-vitamin, stearinlys og masser af hygge.'],
    longestDay: ['Årets længste dag: {daylight} dagslys. Brug det godt (eller i det mindste udenfor).'],
    shortestDay: ['Årets korteste dag: kun {daylight} dagslys. Fra i morgen slår lyset igen.'],
    springEquinox: ['Forårsjævndøgn: Dag og nat er lige lange. Herfra vinder lyset.'],
    autumnEquinox: ['Efterårsjævndøgn: Dag og nat er lige lange. Nu vinder nætterne. Tæpper og stearinlys klar.'],
    earlySunset: ['Solnedgang {sunset}. Ja, allerede.', 'Solen stempler ud {sunset}. Heldige sol.'],
    lateSunset: ['Solen går først ned {sunset}: Der er masser af aften tilbage.'],
    whiteChristmas: ['Hvid jul, for alvor! Det sker sjældnere end en dansk hedebølge, så nyd det.'],
    greenChristmas: ['{high} til jul. Julemanden bytter måske kanen ud med en ladcykel.'],
    nyeDry: ['Tørt omkring midnat, {low}. Perfekt til fyrværkeri – og til at hoppe ned fra stolen.'],
    nyeWet: ['Regn eller sne omkring midnat: Fyrværkeriet foregår med hætten oppe i år.'],
    halloween: ['Halloween i det her vejr? Den uhyggelige stemning er på husets regning.'],
  },

  tips: {
    umbrella: [
      'Paraply: ja. Ruskindssko: nej.',
      'Pak en paraply. Fremtidens dig siger tak.',
      'Cykler du? Så hellere regntøj – paraply på cykel er en disciplin for sig.',
    ],
    raincoat: [
      'Der findes ikke dårligt vejr, kun dårligt tøj. I dag er det rigtige en regnjakke med hætte.',
      'For meget vind til paraply: En jakke med hætte klarer det bedre.',
    ],
    snowBoots: ['Ordentlige sko i dag: greb frem for stil.', 'Støvler med godt greb, og tag lidt tidligere af sted.'],
    snowman: ['Sne og fri: tid til en snemand. Gulerod medfølger ikke.'],
    layers: [
      'Lag på lag: Du tager dem af om eftermiddagen og på igen om aftenen.',
      'Klæd dig på som et løg: flere lag, der kan tages af et ad gangen.',
    ],
    sunscreen: [
      'Solcreme, selvom det ikke er en stranddag. Især på næsen.',
      'Solfaktor på, solbriller på. Din hud takker dig om 20 år.',
    ],
    scrape: [
      'Tag af sted 5 minutter tidligere, så du kan skrabe forruden.',
      'Isskraber klar. Varmt vand på forruden: aldrig.',
    ],
    hydrate: [
      'Vandflaske er obligatorisk. Kaffe tæller ikke.',
      'Drik, før du bliver tørstig, og hold dig i skyggen midt på dagen.',
    ],
    bundleUp: ['Hue, handsker, halstørklæde: hele pakken.', 'Klæd dig varmt på. Og tag så et lag mere.'],
    laundry: [
      'Perfekt tørrevejr: sol, brise, ingen regn. Tørretumbleren kan holde fri.',
      'Hæng vasketøjet ud; det tørrer på rekordtid.',
    ],
    terrace: [
      'Lun aften forude: terrasse, grill eller picnic – du vælger.',
      'En aften skabt til at spise udenfor. Bare så du ved det.',
    ],
    mosquitoes: ['Varm, lummer aften: Myggene står på gæstelisten. Myggespray anbefales.'],
    noCarWash: ['Vaske bilen? Morgendagens regn gør det gratis.'],
    stayIn: [
      'Bliv indenfor, hvis du kan, oplad din telefon, og hav en lommelygte ved hånden.',
      'Udskyd al rejse, der ikke er nødvendig, og hold din telefon opladet.',
    ],
    secureObjects: ['Fastgør eller tag alt ind, der kan flyve: skraldespande, trampoliner, havestole.'],
    extraTime: ['Beregn ekstra tid til transport, og gå forsigtigt.', 'Sæt farten ned på vejen, og giv dig selv ekstra tid.'],
    jacketEvening: ['Tag en jakke med til i aften, selvom det føles fjollet lige nu.'],
  },

  meteorNames: {
    quadrantids: 'Kvadrantiderne',
    lyrids: 'Lyriderne',
    etaAquariids: 'Eta Aquariiderne',
    perseids: 'Perseiderne',
    orionids: 'Orioniderne',
    leonids: 'Leoniderne',
    geminids: 'Geminiderne',
  },
};
