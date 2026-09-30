import type { PhraseBank } from '../types';

// Mid-sentence hours: "vanaf 14 uur", "rond middernacht", "tussen 14 uur en 17 uur".
const hour = (h: number): string => (h === 0 ? 'middernacht' : `${h} uur`);
const time = (h: number, m: number): string => `${h}.${String(m).padStart(2, '0')} uur`;
const duration = (min: number): string => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (m === 0) return `${h} uur`;
  return `${h} uur en ${m} ${m === 1 ? 'minuut' : 'minuten'}`;
};

export const nl: PhraseBank = {
  title: 'Je dag in het kort',
  labels: {
    today: 'Vandaag',
    tonight: 'Vannacht',
    tomorrow: 'Morgen',
    laterToday: 'Als je wakker wordt',
  },
  hour,
  time,
  duration,

  greetings: {
    earlyBird: ['Eerder op dan de zon? Respect.', 'Vroege vogel! Het weer wrijft nog de slaap uit z’n ogen.'],
    morning: [
      'Goedemorgen! Je dag in een notendop.',
      'Morgen! Eerst koffie, dan dit.',
      'Goedemorgen. De lucht heeft plannen met je.',
    ],
    midday: ['Boterhammetje erbij? Hier is het weer.', 'Halverwege de dag. Dit is de rest.'],
    afternoon: ['Goedemiddag! Dit is wat er nog over is van vandaag.', 'Het middagbericht is binnen.'],
    evening: ['Goedenavond! Vannacht en morgen, in het kort.', 'Het avondbericht, warm opgediend.'],
    late: ['Nog laat even kijken? Dit brengen vannacht en morgen.', 'Nog één blik voor het slapengaan.'],
    nightOwl: [
      'Nog wakker? Het weer slaapt al, en jij eigenlijk ook.',
      'Nachtbraker gespot. Dit komt eraan.',
    ],
    firstWorkday: ['Maandag. We slaan ons er samen doorheen.', 'Maandagochtend. Diep ademhalen.'],
    midweek: ['Woensdag: de helft zit erop.', 'Woensdag! Over de top, vanaf hier gaat het bergaf. In de goede zin.'],
    lastWorkday: [
      'Vrijdag! Het weekend is in zicht.',
      'Het is vrijdag. Je bent er (bijna).',
      'Vrijdag! De vrijdagmiddagborrel lonkt.',
    ],
    lastWorkdayEvening: ['Vrijdagavond! Hier is je weekendvoorspelling.', 'Het weekend begint nu. De voorspelling ook.'],
    weekend: ['Het is {day}! Geen wekker nodig.', 'Weekendmodus: aan.'],
    weekendEnd: ['Zondagavond. Het weer van morgen, rustig aan.', 'Het weekend loopt ten einde. Dit komt er hierna.'],
    newYear: ['Gelukkig nieuwjaar! De eerste voorspelling van het jaar.'],
    newYearsEve: ['Oudejaarsdag! De laatste voorspelling van het jaar. Oliebol erbij?'],
    christmas: ['Fijne kerst! Je weerbericht, mooi ingepakt.'],
    halloween: ['Fijne Halloween! Het weer, zonder trucjes.'],
    friday13: ['Vrijdag de 13e. Lees het weerbericht… als je durft.'],
    aprilFools: ['1 april. Dit weerbericht is geen grap. Waarschijnlijk.'],
    valentine: ['Fijne Valentijnsdag! Het weer, met liefde.'],
    alert: ['Let op: er komt gevaarlijk weer aan.', 'Belangrijk: het weer vraagt vandaag je aandacht.'],
  },

  lines: {
    // Regen
    rainAllDay: [
      'Regen van begin tot eind. De lucht heeft veel op z’n hart.',
      'Nat, natter, natst: de regen neemt amper pauze.',
      'Het regent pijpenstelen, de hele dag. Thee, dekentje, serie – je kent het recept.',
    ],
    rainLater: [
      'Droog tot ongeveer {start}, daarna regen voor de rest van de dag.',
      'Boodschappen? Doe ze vóór {start}, want dan trekt de regen voorgoed binnen.',
      'Geniet van het droge stuk: rond {start} klokt de regen in en maakt hij overuren.',
    ],
    rainStops: [
      'Natte start, maar rond {end} droogt het op. Geduld wordt beloond.',
      'Rond {end} pakt de regen z’n koffers. Volhouden.',
      'Regen tot ongeveer {end}, daarna komt de lucht tot rust.',
    ],
    rainWindow: [
      'Buien tussen {start} en {end}, daarvoor en daarna droog. Timing is alles.',
      'Regen ingepland van {start} tot {end}. De rest blijft droog.',
      'Een nat venster van {start} tot {end}: plan je fietstocht eromheen.',
    ],
    rainBrief: [
      'Een korte bui rond {t}. Zo voorbij, tenzij je net buiten staat.',
      'Eén korte bui rond {t}, daarna gewoon weer door.',
    ],
    rainOnOff: [
      'Buien die komen en gaan. De lucht kan maar niet kiezen.',
      'De buien gedragen zich als een kat bij de deur: erin, eruit, erin, eruit.',
      'Wisselvallig, zoals altijd. Neem een zonnebril én een regenjas mee, en vertrouw geen van beide.',
    ],
    showersPossible: [
      'Tussen {start} en {end} kan er een bui vallen. Kán.',
      'Kleine kans op regen tussen {start} en {end}. Kop of munt, eigenlijk.',
    ],
    rainCommuteAM: [
      'Regen rond {start}, precies in de spits. Uiteraard.',
      'De regen komt rond {start} – net op tijd om met je mee naar je werk te fietsen.',
    ],
    rainCommutePM: [
      'Rond {start} komt de regen, perfect getimed voor de weg naar huis.',
      'De hele dag droog, nat voor de rit naar huis: regen vanaf ongeveer {start}. Regenpak mee?',
    ],
    drizzle: [
      'Motregen tussen {start} en {end}: niet echt regen, net genoeg om te irriteren.',
      'Miezeren van {start} tot {end}. Je haar merkt het eerder dan jij.',
    ],
    downpour: [
      'Rond {t} kan er een flinke plensbui vallen. Niet het moment voor een wandeling.',
      'Rond {t} komt het met bakken uit de lucht. Zoek een afdakje als het kan.',
    ],
    thunder: [
      'Kans op onweer tussen {start} en {end}. Hoor je donder, ga dan naar binnen.',
      'Van {start} tot {end} broeit er wat: bliksem, gerommel, het hele pakket. Blijf uit het open veld – en van de fiets.',
    ],
    thunderSnow: [
      'Onweerssneeuw rond {start}: sneeuw ÉN bliksem. Zeldzaam, vreemd en best spectaculair.',
    ],

    // Winter
    snowLight: [
      'Een paar vlokjes tussen {start} en {end}. Mooi, verder niks.',
      'Lichte sneeuw van {start} tot {end}: ansichtkaartmodus, geen schepmodus.',
    ],
    snow: [
      'Sneeuw van {start} tot {end}. Wegen en fietspaden worden glad, dus doe rustig aan.',
      'Sneeuw tussen {start} en {end}. Warme chocolademelk is hierbij officieel gerechtvaardigd.',
    ],
    snowHeavy: [
      'Zware sneeuwval tussen {start} en {end}. Reizen wordt lastig; ga alleen de weg op als het moet.',
      'Veel sneeuw verwacht van {start} tot {end}. Houd rekening met vertraging en gladde wegen.',
    ],
    blizzard: [
      'Sneeuwstorm vanaf ongeveer {start}: zware sneeuwval en harde wind. Blijf waar je bent als het kan.',
    ],
    slush: [
      'Natte sneeuw vanaf ongeveer {start}, die al snel prut wordt. Het slechtste van twee werelden.',
      'Sneeuw die niet kan kiezen, vanaf ongeveer {start}. Waterdichte schoenen aanbevolen.',
    ],
    sleet: [
      'Natte sneeuw en ijskorrels tussen {start} en {end}: regen die niet kon kiezen of hij sneeuw wilde zijn.',
      'Natte sneeuw van {start} tot {end}. Koud, nat en van opzij: de ultieme fietsbeproeving.',
    ],
    freezingRain: [
      'IJzel vanaf ongeveer {start}: wegen en stoepen kunnen spiegelglad worden. Vermijd reizen als het kan.',
      'IJzel rond {start}. Elk oppervlak kan bevriezen, dus wees extra voorzichtig.',
    ],

    // Gladheid & mist
    blackIce: [
      'Rond {t} kans op gladde plekken. Loop als een pinguïn, fiets als je opa.',
      'Natte grond en vriezende lucht: pas rond {t} op voor gladheid.',
    ],
    frost: [
      'Vriezende start met {low}. IJskrabbers, in de aanslag!',
      'Vroeg nog maar {low}: rijp op auto’s, gras en misschien op je humeur.',
    ],
    fogMorning: [
      'Mist tot ongeveer {end}. Dimlicht aan, geduld ook.',
      'Geen hand voor ogen tot rond {end}. Het uitzicht komt later terug, beloofd.',
    ],
    fogTonight: [
      'Rond {start} komt er mist opzetten. Rijd rustig en zet je dimlicht aan.',
      'Mist vanaf ongeveer {start}. Heel sfeervol, heel slecht voor het zicht.',
    ],
    freezingFog: [
      'Aanvriezende mist tot ongeveer {end}: slecht zicht en gladde oppervlakken. Voorzichtig op de weg.',
    ],

    // Lucht
    sunnyAllDay: [
      'Zon van ’s ochtends tot ’s avonds, tot {high}. De lucht heeft niks te verbergen.',
      'De hele dag blauwe lucht, tot {high}. Bijna verdacht.',
    ],
    grayAllDay: [
      'Grijs van begin tot eind. De zon heeft zich ziek gemeld.',
      'Grijs, grijzer, grijst – maar wel droog. Dat is ook wat waard.',
    ],
    clearingLater: [
      'Bewolkte start, maar rond {t} breekt de zon door. Het wachten waard.',
      'Rond {t} pakken de wolken hun spullen; de tweede helft ziet er veel beter uit.',
    ],
    cloudingLater: [
      'Zonnige start, rond {t} rollen de wolken binnen. Pak je zon vroeg.',
      'Geniet van de zon zolang het kan: rond {t} nemen de wolken het over.',
    ],
    perfectDay: [
      'Plaatjesweer: droog, zonnig, {high}. Binnen blijven is voor eigen rekening.',
      '{high}, zon, geen regen. Eerlijk, veel beter wordt het niet.',
      'Topweer: droog, helder en {high}. Verzin een smoes om naar buiten te gaan. Terrasje?',
    ],

    // Temperatuur
    bigSwing: [
      'Laagjesdag: van {low} in de ochtend naar {high} in de middag.',
      '’s Ochtends {low}, later {high}. Je jas brengt de middag onder je arm door.',
    ],
    warm: [
      'Warm, tot {high}. Een korte broek is een prima levenskeuze.',
      'Tot {high}: warm genoeg om een ijsje als lunch te laten tellen.',
    ],
    hot: [
      'Heet: gevoelstemperatuur {feels} tussen {start} en {end}. Schaduw, water, rustig aan.',
      'Voelt als {feels} van {start} tot {end}. Alles wat zweet kost: ervoor of erna.',
    ],
    extremeHeat: [
      'Extreme hitte, gevoelstemperatuur {feels}. Mijd de zon tussen {start} en {end}, drink vaak en let op kwetsbare mensen.',
    ],
    tropicalNight: [
      'Tropische nacht: het koelt niet af onder {low}. Slapen wordt een duursport.',
      'Vannacht niet kouder dan {low}. Ventilator aan, dekbed uit.',
    ],
    freezingDay: [
      'De hele dag vorst, hooguit {high}. Buiten is het gewoon een vriezer.',
      'Geen dooi in zicht: hooguit {high}. Elfstedenkoorts? Nog even geduld.',
    ],
    bitterCold: [
      'Bijtende kou: gevoelstemperatuur {feels}. Bedek elk stukje huid dat je kunt.',
      'Voelt als {feels}. Zelfs pinguïns zouden om een sjaal vragen.',
    ],
    extremeCold: [
      'Gevaarlijke kou, gevoelstemperatuur {feels}. Bevriezing kan binnen minuten optreden; beperk je tijd buiten.',
    ],
    windChill: [
      'De thermometer zegt het ene, de wind zegt {feels}. Geloof de wind.',
      'Door de wind voelt het als {feels}. Capuchon op.',
    ],
    muggy: [
      'Broeierig en plakkerig: tegen de middag voel je je een gestoomde bapao.',
      'Zo vochtig dat je bijna door de lucht kunt zwemmen. Ademende kleding, graag.',
    ],
    tempDrop: [
      'Scherpe daling rond {t}: binnen een paar uur zo’n {diff} kouder. Houd een jas bij de hand.',
      'Rond {t} dendert een koufront binnen en haalt er {diff} af.',
    ],
    eveningChill: [
      'Het koelt snel af: {low} rond {t}. Die jas die je nu niet nodig hebt? Neem hem mee.',
      'Rond {t} nog maar {low}. ’s Avonds geldt een andere dresscode.',
    ],
    warmForSeason: [
      '{high}? Voor de tijd van het jaar is dat bijna een cadeautje.',
      'Ongewoon zacht met {high}. De natuur is de kalender kwijt.',
    ],
    coldForSeason: [
      'Maar {high}. Het seizoen heeft op snooze gedrukt.',
      'Hooguit {high}. Niet echt passend bij het seizoen, maar het is niet anders.',
    ],
    sunnyButCold: [
      'Stralende zon, hooguit {high}: veel show, weinig warmte.',
      'Zonnig, maar slechts {high}. Door het raam lijkt het warm. Dat is het niet.',
    ],

    // Wind
    breezy: [
      'Een stevig briesje, tot {wind}. Slechte haardag, goede vliegerdag.',
      'Een frisse bries, tot {wind}. Houd je pet vast.',
    ],
    windy: [
      'Winderig, tot {wind}. Paraplu’s klappen binnenstebuiten.',
      'Wind tot {wind}. Tegenwind op de fiets: altijd precies de kant die jij op moet.',
    ],
    gale: [
      'Harde wind tot {wind}. Zet tuinmeubels vast en let op vallende takken.',
      'Windstoten tot {wind}. Niet de dag om een grote plaat multiplex te vervoeren. Op de fiets al helemaal niet.',
    ],
    storm: [
      'Storm, met wind tot {wind}. Blijf uit de buurt van bomen, steigers en de kust.',
    ],
    hurricane: [
      'Wind met orkaankracht, tot {wind}. Volg de aanwijzingen van de lokale autoriteiten.',
    ],

    // Blootstelling
    uvHigh: [
      'UV-index {uv}, het sterkst rond {t}. Insmeren, tenzij je voor de kreeftenlook gaat.',
      'De UV-index haalt {uv}, rond {t} op z’n hoogst. Zonnebril op, zonnebrand ook.',
    ],
    uvVeryHigh: [
      'Zeer hoge UV-index ({uv}) tussen {start} en {end}. Zonnebrand en schaduw, echt waar.',
      'UV-index {uv} van {start} tot {end}: je huid verbrandt sneller dan een tosti.',
    ],
    uvExtreme: [
      'Extreme UV-index ({uv}). Onbeschermde huid verbrandt binnen minuten: bedek je en zoek rond het middaguur de schaduw op.',
    ],
    airPoor: [
      'De luchtkwaliteit is slecht. Misschien vandaag binnen hardlopen.',
      'De lucht is nu niet geweldig. Gevoelige longen: doe het rustig aan.',
    ],
    airVeryPoor: [
      'De luchtkwaliteit is zeer slecht. Beperk zware inspanning buiten, zeker als je gevoelig bent.',
    ],

    // Nacht
    clearNight: [
      'Heldere lucht vannacht, tot {low}. Een mooie nacht om omhoog te kijken.',
      'Sterrennacht op komst, op z’n koudst {low}.',
    ],
    calmNight: [
      'Rustige nacht, tot {low}. Het weer heeft vrij.',
      'Niets te melden vannacht: op z’n koudst {low}. Slaap lekker.',
    ],
    nightRainAll: [
      'De hele nacht regen. Heerlijk slaapgeluid, minder fijn voor het rondje met de hond.',
      'Regen tot de ochtend. De dakgoten draaien nachtdienst.',
    ],
    nightRainFrom: [
      'Rond {start} komt de regen, en die blijft de hele nacht. Haal de kussens binnen.',
      'Droog tot {start}, daarna tikt de regen de hele nacht op het dak.',
    ],
    nightRainUntil: [
      'Regen tot ongeveer {end}, daarna een droge rest van de nacht.',
      'Rond {end} gaat ook de regen naar bed.',
    ],
    nightRainWindow: [
      'Regen tussen {start} en {end}, verder droog.',
      'Een natte periode van {start} tot {end}, daarna weer rustig.',
    ],
    nightSnow: [
      'Sneeuw vanaf ongeveer {start}. Misschien word je wakker in een witte wereld.',
      'Sneeuw vannacht vanaf {start}. Morgen: ansichtkaart vanuit het raam, ijsbaan op de weg.',
    ],
    nightStorm: [
      'Kans op onweer tussen {start} en {end}. Haal de stekker uit wat je dierbaar is.',
      'Onweer tussen {start} en {end}. De hond wil vannacht bij jou in bed.',
    ],

    // Morgen
    tomorrowColder: [
      'Zo’n {diff} kouder, hooguit {high}. Leg vanavond je warme jas alvast klaar.',
      'De temperatuur zakt {diff}: hooguit {high}. Geniet nog even van vandaag.',
    ],
    tomorrowWarmer: [
      'Zo’n {diff} warmer, tot {high}. Iets om naar uit te kijken.',
      'Een sprong van {diff}, tot {high}. De jij van morgen zegt dankjewel.',
    ],

    // Rustig
    calmSunny: [
      'Zonnig en rustig, {low} tot {high}. Het weer heeft een vrije dag.',
      'Lekker makkelijk: zon, {low} tot {high}, niets om je druk over te maken.',
    ],
    calmCloudy: [
      'Bewolkt maar droog, {low} tot {high}. Niet spannend, geen probleem.',
      'Grijzig en kalm, {low} tot {high}. Een doodgewone dag, weertechnisch gezien.',
    ],
    calmMixed: [
      'Zon en wolken wisselen elkaar af, {low} tot {high}. Geen drama.',
      'Van alles een beetje, behalve regen: {low} tot {high}.',
    ],

    // Extra’s
    fullMoon: [
      'Volle maan vannacht, met een heldere lucht. Weerwolven, jullie zijn gewaarschuwd.',
      'Volle maan en heldere lucht: het nachtlampje van de natuur staat aan.',
    ],
    supermoon: ['Supermaan vannacht: de maan staat extra dichtbij en is extra helder. Kijk omhoog!'],
    newMoonStars: [
      'Nieuwe maan en een heldere lucht: ideaal om sterren te kijken. Ga weg van de stadslichten.',
      'Geen maan, geen wolken: vannacht hebben de sterren het podium.',
    ],
    meteors: [
      'De {name} bereiken vannacht hun hoogtepunt: tot {rate} vallende sterren per uur. Houd je wensen klaar.',
      'Heldere lucht voor de {name} vannacht, tot {rate} meteoren per uur. Kijk omhoog, ver van de lichten.',
    ],
    goldenHour: [
      'Gouden uur vanaf {golden}, zonsondergang om {sunset}. Fotografen, in positie.',
      'Heldere lucht bij zonsondergang ({sunset}). Rond {golden} is een blik uit het raam de moeite waard.',
    ],
    sunriseClear: ['De vroege vogel vangt de zonsopkomst: om {sunrise}, onder een heldere lucht.'],
    midnightSun: ['De zon gaat vandaag niet onder. Verduisteringsgordijnen zijn je beste vriend.'],
    polarNight: ['Vandaag komt de zon niet op: poolnacht. Vitamine D, kaarsjes en veel gezelligheid.'],
    longestDay: ['Langste dag van het jaar: {daylight} daglicht. Gebruik het goed (of in elk geval buiten).'],
    shortestDay: ['Kortste dag van het jaar: maar {daylight} daglicht. Vanaf morgen slaat het licht terug.'],
    springEquinox: ['Lente-equinox: dag en nacht zijn even lang. Vanaf nu wint het licht.'],
    autumnEquinox: ['Herfstequinox: dag en nacht zijn even lang. Vanaf nu winnen de nachten. Dekentjes klaar.'],
    earlySunset: ['Zonsondergang om {sunset}. Ja, nu al.', 'De zon klokt om {sunset} al uit. Bofkont.'],
    lateSunset: ['Zonsondergang pas om {sunset}: nog een lange avond te gaan.'],
    whiteChristmas: ['Een witte kerst, echt waar! Leg het vast, want dat maken we niet elk jaar mee.'],
    greenChristmas: ['{high} met kerst. De kerstman ruilt z’n arrenslee misschien in voor een fiets.'],
    nyeDry: ['Rond middernacht droog, {low}. Oliebollen binnen, vuurwerk buiten: perfect.'],
    nyeWet: ['Rond middernacht kans op regen of sneeuw: vuurwerk met de capuchon op.'],
    halloween: ['Halloween met dit weer? De griezelsfeer krijg je er gratis bij.'],
  },

  tips: {
    umbrella: [
      'Paraplu: ja. Suède schoenen: nee.',
      'Neem een paraplu mee. Je toekomstige ik is je dankbaar.',
      'Op de fiets? Dan liever een regenjas – fietsen met een paraplu is een sport op zich.',
    ],
    raincoat: [
      'Regen plus wind: je paraplu is kansloos. Regenjas met capuchon dus.',
      'Te veel wind voor een paraplu: een jas met capuchon doet het beter. Fietsers: regenpak.',
    ],
    snowBoots: ['Goede schoenen vandaag: grip gaat voor stijl.', 'Schoenen met profiel, en vertrek wat eerder.'],
    snowman: ['Sneeuw en vrij: tijd voor een sneeuwpop. Wortel niet inbegrepen.'],
    layers: [
      'Laagjes! ’s Middags pel je ze af, ’s avonds trek je ze weer aan.',
      'Kleed je als een ui: meerdere laagjes, één voor één uit te trekken.',
    ],
    sunscreen: [
      'Zonnebrand, ook al is het geen stranddag. Vooral op je neus.',
      'Insmeren en zonnebril op. Je huid bedankt je over 20 jaar.',
    ],
    scrape: [
      'Vertrek 5 minuten eerder om je voorruit te krabben.',
      'IJskrabber klaar. Heet water op de ruit: nooit doen.',
    ],
    hydrate: [
      'Waterfles verplicht. Koffie telt niet.',
      'Drink voordat je dorst hebt en blijf rond het middaguur in de schaduw.',
    ],
    bundleUp: ['Muts, handschoenen, sjaal: de volle uitrusting.', 'Kleed je warm aan. En doe er dan nog een laagje bij.'],
    laundry: [
      'Perfect droogweer: zon, bries, geen regen. De droger heeft vrij.',
      'Hang de was buiten; die is in recordtijd droog.',
    ],
    terrace: [
      'Warme avond op komst: terras, barbecue of picknick, jij kiest.',
      'Een avond om buiten te eten. Of gewoon een terrasje pakken.',
    ],
    mosquitoes: ['Warme, broeierige avond: de muggen staan op de gastenlijst. Muggenspray aanbevolen.'],
    noCarWash: ['Auto wassen? De regen van morgen doet het gratis.'],
    stayIn: [
      'Blijf binnen als het kan, laad je telefoon op en houd een zaklamp bij de hand.',
      'Stel reizen die niet nodig zijn uit en houd je telefoon opgeladen.',
    ],
    secureObjects: ['Zet vast of haal binnen wat kan wegwaaien: vuilnisbakken, trampolines, tuinstoelen.'],
    extraTime: ['Neem extra reistijd en loop voorzichtig.', 'Rijd rustig en trek extra tijd uit.'],
    jacketEvening: ['Neem een jas mee voor vanavond, ook al voelt dat nu overdreven.'],
  },

  meteorNames: {
    quadrantids: 'Quadrantiden',
    lyrids: 'Lyriden',
    etaAquariids: 'Eta Aquariden',
    perseids: 'Perseïden',
    orionids: 'Orioniden',
    leonids: 'Leoniden',
    geminids: 'Geminiden',
  },
};
