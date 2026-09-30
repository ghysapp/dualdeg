import type { PhraseBank } from '../types';

// Swedish style: "kl. 14", "kl. 19.42" (period between hours and minutes).
const hour = (h: number): string => (h === 0 ? 'midnatt' : `kl. ${h}`);
const time = (h: number, m: number): string => `kl. ${h}.${String(m).padStart(2, '0')}`;
const duration = (min: number): string => `${Math.floor(min / 60)} tim ${min % 60} min`;

export const sv: PhraseBank = {
  title: 'Din dag i korthet',
  labels: {
    today: 'I dag',
    tonight: 'I natt',
    tomorrow: 'I morgon',
    laterToday: 'När du vaknar',
  },
  hour,
  time,
  duration,

  greetings: {
    earlyBird: ['Uppe före solen? Respekt.', 'Morgonpigg! Vädret har knappt hunnit gnugga sömnen ur ögonen.'],
    morning: [
      'God morgon! Här är dagen i ett nötskal.',
      'God morgon! Kaffe först, sedan det här.',
      'God morgon. Himlen har planer för dig.',
    ],
    midday: ['Lunchkoll på vädret.', 'Halvvägs genom dagen. Här är resten.'],
    afternoon: ['Dags för eftermiddagsfika och väderkoll.', 'Eftermiddagsrapporten är här.'],
    evening: ['God kväll! I kväll och i morgon, i korthet.', 'Kvällens väder, serverat med en kopp te.'],
    late: ['Sen koll? Här är natten och morgondagen.', 'En sista titt innan läggdags.'],
    nightOwl: [
      'Fortfarande vaken? Vädret sover, det borde du också.',
      'Nattuggla spanad. Här är vad som väntar.',
    ],
    firstWorkday: ['Måndag. Vi tar oss igenom det här tillsammans.', 'Måndagsmorgon. Andas djupt.'],
    midweek: ['Onsdag – lillördag! Halvvägs till helgen.', 'Onsdag: nu bär det utför mot helgen.'],
    lastWorkday: ['Fredag! Helgen skymtar vid horisonten.', 'Det är fredag. Du är (nästan) i mål.'],
    lastWorkdayEvening: ['Dags för fredagsmys! Här är helgens väder.', 'Helgen börjar nu. Prognosen också.'],
    weekend: ['Äntligen {day}! Ingen väckarklocka i dag.', 'Helgläge: på.'],
    weekendEnd: [
      'Söndagsångest? Här kommer morgondagens väder, varsamt.',
      'Helgen går mot sitt slut. Här är vad som väntar.',
    ],
    newYear: ['Gott nytt år! Årets första prognos.'],
    newYearsEve: ['Årets sista dag! Här är den sista prognosen.'],
    christmas: ['God jul! Din prognos, inslagen i julklappspapper.'],
    halloween: ['Glad halloween! Bus eller godis? Prognosen bjuder på godis.'],
    friday13: ['Fredagen den 13:e. Läs prognosen – om du vågar.'],
    aprilFools: ['1 april. Den här prognosen är inget aprilskämt. Troligen.'],
    valentine: ['Glad alla hjärtans dag! Vädret, med kärlek.'],
    alert: ['Observera: besvärligt väder på väg.', 'Viktigt: vädret kräver din uppmärksamhet.'],
  },

  lines: {
    // Regn
    rainAllDay: [
      'Regn från början till slut. Himlen har mycket att få ur sig.',
      'Blött, blötare, blötast: regnet tar knappt en paus.',
      'Det finns inget dåligt väder, bara dåliga kläder. Nu testas teorin: regn hela dagen.',
    ],
    rainLater: [
      'Uppehåll till runt {start}, sedan regn resten av dagen.',
      'Ärenden? Gör dem före {start}, då flyttar regnet in för gott.',
      'Njut av det torra: regnet stämplar in runt {start} och jobbar övertid.',
    ],
    rainStops: [
      'Blöt start, men det torkar upp runt {end}. Tålamod lönar sig.',
      'Regnet packar väskorna runt {end}. Håll ut.',
      'Regn fram till ungefär {end}, sedan lugnar himlen ner sig.',
    ],
    rainWindow: [
      'Skurar mellan {start} och {end}, torrt före och efter. Timing är allt.',
      'Regn inbokat från {start} till {end}. Resten är torrt.',
      'Ett blött fönster från {start} till {end}: lägg utomhusplanerna runt det.',
    ],
    rainBrief: [
      'En snabb skur runt {t}. Blinka och du missar den – om du inte är ute, vill säga.',
      'En kort skur runt {t}, sedan är allt som vanligt igen.',
    ],
    rainOnOff: [
      'Skurar av och till. Himlen kan inte bestämma sig.',
      'Skurarna kommer och går som en katt vid dörren: in, ut, in, ut.',
      'Aprilväder, oavsett månad. Ta med både solglasögon och paraply, och lita på ingen av dem.',
    ],
    showersPossible: [
      'En skur kan dyka upp mellan {start} och {end}. Kan.',
      'Viss risk för regn mellan {start} och {end}. Singla slant, typ.',
    ],
    rainCommuteAM: [
      'Regn runt {start}, precis när du ska till jobbet. Såklart.',
      'Regnet dyker upp runt {start}, lagom för att hänga med dig till jobbet.',
    ],
    rainCommutePM: [
      'Regnet kommer runt {start}, perfekt tajmat till hemvägen.',
      'Torrt hela dagen, blött på vägen hem: regn från runt {start}.',
    ],
    drizzle: [
      'Duggregn mellan {start} och {end}: inte riktigt regn, bara lagom irriterande.',
      'Fint dugg från {start} till {end}. Frisyren märker det före dig.',
    ],
    downpour: [
      'Kraftigt skyfall möjligt runt {t}. Inte rätt stund för en promenad.',
      'Runt {t} tömmer himlen hinken. Håll dig under tak om du kan.',
    ],
    thunder: [
      'Risk för åska mellan {start} och {end}. När åskan mullrar, gå inomhus.',
      'Åskväder på gång från {start} till {end}: blixtar, muller, hela paketet. Undvik öppna ytor.',
    ],
    thunderSnow: ['Åsksnö runt {start}: snö OCH blixtar. Ovanligt, konstigt och rätt spektakulärt.'],

    // Vinter
    snowLight: [
      'Några flingor mellan {start} och {end}. Fint, inte mycket mer.',
      'Lätt snöfall från {start} till {end}: vykortsläge, inte skottningsläge.',
    ],
    snow: [
      'Snö från {start} till {end}. Vägarna blir hala, så ta det lugnt.',
      'Snöfall mellan {start} och {end}. Varm choklad är officiellt motiverad.',
    ],
    snowHeavy: [
      'Kraftigt snöfall mellan {start} och {end}. Resor blir besvärliga; gå bara ut om du måste.',
      'Mycket snö väntas från {start} till {end}. Räkna med förseningar och hala vägar.',
    ],
    blizzard: ['Snöstorm från runt {start}: kraftigt snöfall och hård vind. Stanna inne om du kan.'],
    slush: [
      'Blötsnö från runt {start} som blir till slask. Det sämsta av två världar.',
      'Snö som inte kan bestämma sig, från runt {start}. Vattentäta skor rekommenderas.',
    ],
    sleet: [
      'Snöblandat regn mellan {start} och {end}: regn som inte riktigt vågade bli snö.',
      'Snöblandat regn från {start} till {end}. Kallt, blött och på tvären.',
    ],
    freezingRain: [
      'Underkylt regn från runt {start}: vägar och trottoarer kan bli som glas. Undvik att resa om du kan.',
      'Underkylt regn runt {start}. Alla ytor kan frysa till is, så var mycket försiktig.',
    ],

    // Is och dimma
    blackIce: [
      'Risk för ishalka runt {t}. Fram med broddarna, eller gå som en pingvin.',
      'Blöt mark möter minusgrader: se upp för svartis runt {t}.',
    ],
    frost: [
      'Frostig start, ner till {low}. Isskrapan, gör dig redo.',
      'Ner till {low} tidigt: frost på bilar, gräsmattor och kanske humöret.',
    ],
    fogMorning: [
      'Dimma till runt {end}. Halvljuset på, tålamodet också.',
      'Dimma tjock som gröt till runt {end}. Utsikten kommer tillbaka, lovar.',
    ],
    fogTonight: [
      'Dimma bildas runt {start}. Kör försiktigt och använd halvljus.',
      'Dimman smyger in runt {start}. Väldigt stämningsfullt, väldigt dåligt för sikten.',
    ],
    freezingFog: ['Underkyld dimma till runt {end}: dålig sikt och hala ytor. Var försiktig i trafiken.'],

    // Himmel
    sunnyAllDay: [
      'Sol från morgon till kväll, upp till {high}. Himlen har inget att dölja.',
      'Blå himmel hela dagen, upp till {high}. Misstänkt fint.',
    ],
    grayAllDay: [
      'Grått från början till slut. Solen har sjukanmält sig.',
      'Grått i grått hela dagen. Solen verkar vabba. Torrt är det i alla fall.',
    ],
    clearingLater: [
      'Molnig start, men solen tittar fram runt {t}. Värt att vänta på.',
      'Molnen packar ihop runt {t}; andra halvan ser mycket bättre ut.',
    ],
    cloudingLater: [
      'Solig start, molnen rullar in runt {t}. Passa på att sola tidigt.',
      'Njut av solen medan den varar: molnen tar över runt {t}.',
    ],
    perfectDay: [
      'Skolboksdag: torrt, soligt, {high}. Stannar du inne får du skylla dig själv.',
      '{high}, sol och inget regn. Ärligt talat, bättre än så blir det inte.',
      'Väder i toppklass: torrt, ljust och {high}. Ta fikan ut, du har ingen ursäkt.',
    ],

    // Temperatur
    bigSwing: [
      'Från {low} på morgonen till {high} på eftermiddagen. Lökprincipen gäller.',
      '{low} tidigt, {high} senare. Jackan får tillbringa eftermiddagen i handen.',
    ],
    warm: [
      'Varmt, upp till {high}. Shorts är ett fullt rimligt livsval.',
      'Upp till {high}: varmt nog för att glass ska räknas som lunch.',
    ],
    hot: [
      'Hett: känns som {feels} mellan {start} och {end}. Skugga, vatten, ta det lugnt.',
      'Känns som {feels} från {start} till {end}. Allt ansträngande: före eller efter.',
    ],
    extremeHeat: [
      'Extrem värme, känns som {feels}. Undvik solen mellan {start} och {end}, drick ofta och håll koll på sårbara personer.',
    ],
    tropicalNight: [
      'Tropisk natt: det blir inte svalare än {low}. Att sova blir en uthållighetssport.',
      'Bara ner till {low} i natt. Fläkten på, täcket av.',
    ],
    freezingDay: [
      'Minusgrader hela dagen, {high} som mest. Utomhus är i princip en frys.',
      'Inget töväder i sikte: {high} som mest. Vantar är inte valfritt.',
    ],
    bitterCold: [
      'Bitande kallt: känns som {feels}. Täck all hud du kan.',
      'Känns som {feels}. Nu hjälper bara ylle, ylle och mer ylle.',
    ],
    extremeCold: [
      'Farlig kyla, känns som {feels}. Köldskador kan uppstå inom några minuter; begränsa tiden utomhus.',
    ],
    windChill: [
      'Termometern säger en sak, vinden säger {feels}. Lita på vinden.',
      'Vinden gör att det känns som {feels}. Upp med luvan.',
    ],
    muggy: [
      'Kvavt och klibbigt: vid lunch känner du dig som en nyångad dumpling.',
      'Så fuktigt att man nästan kan simma genom luften. Välj luftiga kläder.',
    ],
    tempDrop: [
      'Kraftigt temperaturfall runt {t}: cirka {diff} kallare inom några timmar. Ha jackan nära till hands.',
      'En kallfront tränger sig på runt {t} och knuffar ner temperaturen {diff}.',
    ],
    eveningChill: [
      'Det svalnar fort: {low} runt {t}. Jackan du inte behöver nu? Ta med den.',
      'Ner till {low} runt {t}. Kvällen har en annan klädkod.',
    ],
    warmForSeason: [
      '{high}? För årstiden är det nästan en present.',
      'Ovanligt milt, {high}. Naturen verkar ha tappat bort almanackan.',
    ],
    coldForSeason: [
      'Bara {high}. Årstiden verkar ha tryckt på snooze.',
      'Som mest {high}. Inte särskilt säsongsenligt, men så är det.',
    ],
    sunnyButCold: [
      'Strålande sol, {high} som mest: mycket sken, lite värme.',
      'Soligt men bara {high}. Genom fönstret ser det varmt ut. Det är det inte.',
    ],

    // Vind
    breezy: [
      'Friska vindar, upp till {wind}. Dålig frisyrdag, bra drakdag.',
      'En pigg bris, upp till {wind}. Håll i mössan.',
    ],
    windy: [
      'Blåsigt, upp till {wind}. Paraplyer kommer att vändas ut och in.',
      'Vind upp till {wind}. Säkra det som är lätt, och frisyren.',
    ],
    gale: [
      'Hård vind upp till {wind}. Säkra utemöblerna och se upp för fallande grenar.',
      'Kraftiga byar upp till {wind}. Inte dagen att bära hem en stor gipsskiva.',
    ],
    storm: ['Stormvindar upp till {wind}. Håll dig borta från träd, byggnadsställningar och kusten.'],
    hurricane: ['Orkanvindar upp till {wind}. Följ myndigheternas anvisningar.'],

    // Exponering
    uvHigh: [
      'UV {uv} runt {t}. Solskydd, om du inte satsar på kräftskive-looken.',
      'UV-index når {uv} runt {t}. Solglasögon på, solkräm också.',
    ],
    uvVeryHigh: [
      'Mycket högt UV-index ({uv}) mellan {start} och {end}. Solkräm och skugga, på riktigt.',
      'UV {uv} från {start} till {end}: huden bränns fortare än en toast.',
    ],
    uvExtreme: [
      'Extremt UV-index ({uv}). Oskyddad hud bränns på några minuter: täck dig och sök skugga mitt på dagen.',
    ],
    airPoor: [
      'Dålig luftkvalitet. Kanske flytta joggingturen inomhus.',
      'Luften är inte den bästa just nu. Känsliga lungor, ta det lugnt.',
    ],
    airVeryPoor: [
      'Mycket dålig luftkvalitet. Begränsa ansträngande aktiviteter utomhus, särskilt om du är känslig.',
    ],

    // Natt
    clearNight: [
      'Klar himmel i natt, ner till {low}. En bra natt att titta upp.',
      'Stjärnklart i natt, {low} som kallast.',
    ],
    calmNight: [
      'Lugn natt, ner till {low}. Vädret har gått hem för dagen.',
      'Inget att rapportera i natt: {low} som kallast. Sov gott.',
    ],
    nightRainAll: [
      'Regn hela natten. Perfekt sovljud, sämre för hundpromenaden.',
      'Regn från nu till morgonen. Stuprören får jobba.',
    ],
    nightRainFrom: [
      'Regnet kommer runt {start} och stannar natten. Ta in dynorna.',
      'Torrt till {start}, sedan smattrar regnet på taken hela natten.',
    ],
    nightRainUntil: [
      'Regn till ungefär {end}, sedan torrt resten av natten.',
      'Regnet går och lägger sig runt {end}.',
    ],
    nightRainWindow: [
      'Regn mellan {start} och {end}, annars torrt.',
      'En blöt period från {start} till {end}, sedan lugnt igen.',
    ],
    nightSnow: [
      'Snö från runt {start}. Du kanske vaknar till en vit värld.',
      'Snö under natten från {start}. I morgon: vykort genom fönstret, skridskobana på vägen.',
    ],
    nightStorm: [
      'Risk för åska mellan {start} och {end}. Dra ur sladden till det du är rädd om.',
      'Åska mellan {start} och {end}. Hunden kommer att vilja sova i din säng.',
    ],

    // I morgon
    tomorrowColder: [
      'Cirka {diff} kallare, som mest {high}. Plocka fram vinterjackan redan i kväll.',
      'Temperaturen sjunker {diff}: {high} som mest. Njut av i dag medan det varar.',
    ],
    tomorrowWarmer: [
      'Cirka {diff} varmare, upp till {high}. Något att se fram emot.',
      'Ett lyft på {diff}, upp till {high}. Morgondagens du säger tack.',
    ],

    // Lugnt
    calmSunny: [
      'Soligt och händelselöst, {low} till {high}. Vädret har ledigt.',
      'Lugnt och skönt: sol, {low} till {high}, inget att oroa sig för.',
    ],
    calmCloudy: [
      'Molnigt men torrt, {low} till {high}. Inte spännande, inte ett problem.',
      'Gråaktigt och lugnt, {low} till {high}. Lagom är bäst, som bekant.',
    ],
    calmMixed: [
      'Sol och moln turas om, {low} till {high}. Inget drama.',
      'Lite av allt utom regn: {low} till {high}.',
    ],

    // Extra
    fullMoon: [
      'Fullmåne i kväll under klar himmel. Varulvar, ni är varnade.',
      'Fullmåne och klar himmel: naturens nattlampa är tänd.',
    ],
    supermoon: ['Supermåne i kväll: månen är extra nära och extra ljus. Titta upp!'],
    newMoonStars: [
      'Nymåne och klar himmel: perfekt för stjärnskådning. Ta dig bort från stadsljusen.',
      'Ingen måne, inga moln: i natt har stjärnorna scenen för sig själva.',
    ],
    meteors: [
      '{name} når sin topp i natt: upp till {rate} stjärnfall i timmen. Ha önskningarna redo.',
      'Klar himmel för {name} i natt, upp till {rate} meteorer i timmen. Titta upp, långt från ljusen.',
    ],
    goldenHour: [
      'Gyllene timmen från {golden}, solnedgång {sunset}. Fotografer, intag era platser.',
      'Klar himmel vid solnedgången ({sunset}). Värt en titt ut genom fönstret runt {golden}.',
    ],
    sunriseClear: ['Soluppgång {sunrise} under klar himmel. De morgonpigga får hela föreställningen.'],
    midnightSun: ['Solen går inte ner i dag – midnattssol! Mörkläggningsgardiner är din bästa vän.'],
    polarNight: ['Ingen soluppgång i dag: polarnatt. D-vitamin, levande ljus och gott sällskap. Mys, helt enkelt.'],
    longestDay: ['Årets längsta dag: {daylight} dagsljus. Midsommarkänsla! Använd det väl, gärna utomhus.'],
    shortestDay: ['Årets kortaste dag: bara {daylight} dagsljus. Från och med i morgon slår ljuset tillbaka.'],
    springEquinox: ['Vårdagjämning: dag och natt är lika långa. Härifrån vinner ljuset.'],
    autumnEquinox: ['Höstdagjämning: dag och natt är lika långa. Nu tar mörkret över – fram med filtarna och tänd ljusen.'],
    earlySunset: ['Solnedgång {sunset}. Ja, redan.', 'Solen går hem redan {sunset}. Tur för den.'],
    lateSunset: ['Solnedgång först {sunset}: en lång kväll väntar.'],
    whiteChristmas: ['Vit jul på riktigt! Nu saknas bara Kalle Anka klockan tre.'],
    greenChristmas: ['{high} i jul. Tomten kanske byter släden mot en elsparkcykel.'],
    nyeDry: ['Runt midnatt: torrt, {low}. Perfekt för fyrverkerierna.'],
    nyeWet: ['Risk för nederbörd runt midnatt: fyrverkerier under paraply, alltså.'],
    halloween: ['Halloween med det här vädret? Den spöklika stämningen bjuder vi på.'],
  },

  tips: {
    umbrella: [
      'Paraply: ja. Mockaskor: nej.',
      'Packa ett paraply. Framtida du säger tack.',
      'Paraply i väskan. Det väger mindre än ånger.',
    ],
    raincoat: [
      'Regn plus vind gör paraplyet chanslöst. Regnjacka med luva i stället.',
      'För blåsigt för paraply. Inget dåligt väder, bara dåliga kläder: ta regnjackan.',
    ],
    snowBoots: ['Ordentliga skor i dag: grepp före stil.', 'Kängor med bra grepp, och gå hemifrån lite tidigare.'],
    snowman: ['Snö och ledigt: dags att bygga snögubbe. Morot ingår ej.'],
    layers: [
      'Lager på lager: av med dem på eftermiddagen, på igen i kväll.',
      'Lökprincipen: flera lager som du kan skala av ett i taget.',
    ],
    sunscreen: [
      'Solkräm, även om det inte är en stranddag. Särskilt på näsan.',
      'Solskydd på, solglasögon på. Huden tackar dig om 20 år.',
    ],
    scrape: [
      'Gå 5 minuter tidigare så du hinner skrapa rutan.',
      'Isskrapan redo. Varmt vatten på vindrutan: aldrig.',
    ],
    hydrate: [
      'Vattenflaska obligatorisk. Kaffe räknas inte.',
      'Drick innan du blir törstig och håll dig i skuggan mitt på dagen.',
    ],
    bundleUp: ['Mössa, vantar, halsduk. Mamma hade rätt.', 'Klä dig varmt. Lägg sedan till ett lager till.'],
    laundry: [
      'Perfekt tvättväder: sol, bris och inget regn. Torktumlaren får ledigt.',
      'Häng ut tvätten, den torkar på rekordtid.',
    ],
    terrace: [
      'Varm kväll på gång: altan, grill eller picknick, välj själv.',
      'En kväll gjord för att äta ute. Bara så du vet.',
    ],
    mosquitoes: ['Varm, kvav kväll: myggen står på gästlistan. Myggmedel rekommenderas.'],
    noCarWash: ['Tänkt tvätta bilen? Morgondagens regn gör det gratis.'],
    stayIn: [
      'Stanna inne om du kan, ladda telefonen och ha en ficklampa nära till hands.',
      'Skjut upp alla resor som inte är nödvändiga och håll telefonen laddad.',
    ],
    secureObjects: ['Förankra eller ta in allt som kan blåsa iväg: soptunnor, studsmattor, trädgårdsstolar.'],
    extraTime: ['Räkna med extra restid och gå försiktigt.', 'Sänk farten och ge dig själv extra tid.'],
    jacketEvening: ['Ta med en jacka till kvällen, även om det känns fånigt just nu.'],
  },

  meteorNames: {
    quadrantids: 'Kvadrantiderna',
    lyrids: 'Lyriderna',
    etaAquariids: 'Eta Aquariiderna',
    perseids: 'Perseiderna',
    orionids: 'Orioniderna',
    leonids: 'Leoniderna',
    geminids: 'Geminiderna',
  },
};
