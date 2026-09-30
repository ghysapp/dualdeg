import type { PhraseBank } from '../types';

// Mid-sentence hours: "ab 14 Uhr", "gegen Mittag", "bis Mitternacht".
const hour = (h: number): string => (h === 0 ? 'Mitternacht' : h === 12 ? 'Mittag' : `${h} Uhr`);
const time = (h: number, m: number): string => `${h}:${String(m).padStart(2, '0')} Uhr`;
const duration = (min: number): string => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h} Std.` : `${h} Std. ${m} Min.`;
};

export const de: PhraseBank = {
  title: 'Dein Tag in Kürze',
  labels: {
    today: 'Heute',
    tonight: 'Heute Nacht',
    tomorrow: 'Morgen',
    laterToday: 'Nach dem Aufwachen',
  },
  hour,
  time,
  duration,

  greetings: {
    earlyBird: [
      'Schon vor der Sonne wach? Respekt.',
      'Frühaufsteher! Das Wetter reibt sich noch die Augen.',
      'Morgenstund hat Gold im Mund – und hier ist dein Wetter.',
    ],
    morning: [
      'Guten Morgen! Dein Tag in aller Kürze.',
      'Moin! Erst Kaffee, dann das hier.',
      'Guten Morgen. Der Himmel hat heute was mit dir vor.',
    ],
    midday: ['Mahlzeit! Kurzer Wetter-Check.', 'Halbzeit! Hier kommt die zweite Hälfte.'],
    afternoon: ['Schönen Nachmittag! Das hält der Rest des Tages bereit.', 'Der Nachmittagsbericht ist da.'],
    evening: ['Guten Abend! Heute Nacht und morgen, kurz und knapp.', 'Das Wetter zum Feierabend, noch warm serviert.'],
    late: ['Noch spät auf? Hier kommen die Nacht und der Morgen.', 'Ein letzter Blick, bevor du ins Bett gehst.'],
    nightOwl: [
      'Noch wach? Das Wetter schläft schon, du solltest auch.',
      'Nachteule gesichtet. Das kommt auf dich zu.',
    ],
    firstWorkday: [
      'Montag. Wir schaffen das zusammen.',
      'Montagmorgen. Tief durchatmen.',
      'Montag – der Tag, an dem der Kaffee Überstunden macht.',
    ],
    midweek: ['Mittwoch: Bergfest!', 'Mittwoch – ab jetzt geht’s bergab. Im guten Sinne.'],
    lastWorkday: ['Freitag! Das Wochenende ist in Sicht.', 'Es ist Freitag. Du hast es (fast) geschafft.'],
    lastWorkdayEvening: [
      'Freitagabend! Hier kommt die Wochenend-Vorschau.',
      'Feierabend und Wochenende – die Vorhersage gibt’s gratis dazu.',
    ],
    weekend: ['{day}! Kein Wecker nötig.', 'Wochenendmodus: an.'],
    weekendEnd: ['Sonntagabend. Das Wetter für morgen, ganz sanft.', 'Das Wochenende geht zu Ende. So geht’s weiter.'],
    newYear: ['Frohes neues Jahr! Die erste Vorhersage des Jahres.'],
    newYearsEve: ['Silvester! Hier kommt die letzte Vorhersage des Jahres.'],
    christmas: ['Frohe Weihnachten! Dein Wetter, hübsch verpackt.'],
    halloween: ['Süßes oder Saures? Hier kommt das Wetter – ganz ohne Streiche.'],
    friday13: ['Freitag, der 13. Lies das Wetter … wenn du dich traust.'],
    aprilFools: ['1. April. Diese Vorhersage ist kein Aprilscherz. Vermutlich.'],
    valentine: ['Alles Liebe zum Valentinstag! Das Wetter, mit Herz.'],
    alert: ['Achtung: Gefährliches Wetter im Anmarsch.', 'Wichtig: Das Wetter braucht heute deine Aufmerksamkeit.'],
  },

  lines: {
    // Regen
    rainAllDay: [
      'Regen von früh bis spät. Der Himmel hat einiges loszuwerden.',
      'Nass, nasser, am nassesten: Der Regen macht kaum Pause.',
      'Schmuddelwetter deluxe: Regen den ganzen Tag. Sofa, Tee, Serie – du kennst das Programm.',
    ],
    rainLater: [
      'Trocken bis etwa {start}, danach regnet es den Rest des Tages.',
      'Erledigungen? Am besten vor {start} – dann zieht der Regen für den Rest des Tages ein.',
      'Genieß die Trockenphase: Ab {start} stempelt der Regen ein und macht Überstunden.',
    ],
    rainStops: [
      'Nasser Start, aber gegen {end} ist Schluss. Geduld zahlt sich aus.',
      'Der Regen packt gegen {end} seine Koffer. Durchhalten!',
      'Regen bis etwa {end}, dann beruhigt sich der Himmel.',
    ],
    rainWindow: [
      'Schauer zwischen {start} und {end}, davor und danach trocken. Timing ist alles.',
      'Regen von {start} bis {end} eingeplant. Der Rest bleibt trocken.',
      'Ein nasses Zeitfenster von {start} bis {end}: Plan deine Ausflüge drumherum.',
    ],
    rainBrief: [
      'Ein kurzer Schauer gegen {t}. Schnell vorbei – außer du stehst drunter.',
      'Ein kurzer Guss gegen {t}, dann geht’s ganz normal weiter.',
    ],
    rainOnOff: [
      'Mal Schauer, mal nicht. Der Himmel kann sich einfach nicht entscheiden.',
      'Die Schauer kommen und gehen wie eine Katze an der Tür: rein, raus, rein, raus.',
      'Aprilwetter, egal was der Kalender sagt: Sonnenbrille und Schirm einpacken, keinem von beiden trauen.',
    ],
    showersPossible: [
      'Zwischen {start} und {end} könnte ein Schauer kommen. Könnte.',
      'Etwas Regenrisiko zwischen {start} und {end}. Eigentlich ein Münzwurf.',
    ],
    rainCommuteAM: [
      'Regen gegen {start}, pünktlich zum Arbeitsweg. Natürlich.',
      'Der Regen kommt gegen {start} – gerade rechtzeitig, um dich zur Arbeit zu begleiten.',
    ],
    rainCommutePM: [
      'Regen ab etwa {start}, perfekt getimt für den Heimweg.',
      'Den ganzen Tag trocken, pünktlich zum Feierabend nass: Regen ab etwa {start}.',
    ],
    drizzle: [
      'Niesel zwischen {start} und {end}: kein richtiger Regen, aber genug zum Nerven.',
      'Feiner Nieselregen von {start} bis {end}. Deine Frisur merkt’s vor dir.',
    ],
    downpour: [
      'Gegen {t} droht ein Wolkenbruch. Nicht der Moment für einen Spaziergang.',
      'Gegen {t} schüttet es wie aus Eimern. Such dir ein Dach, wenn du kannst.',
    ],
    thunder: [
      'Gewitter möglich zwischen {start} und {end}. Wenn’s donnert: ab nach drinnen.',
      'Von {start} bis {end} braut sich was zusammen: Blitz, Donner, volles Programm. Meide freies Feld.',
    ],
    thunderSnow: [
      'Gewitterschnee gegen {start}: Schnee UND Blitze. Selten, schräg und ziemlich spektakulär.',
    ],

    // Winter
    snowLight: [
      'Ein paar Flocken zwischen {start} und {end}. Hübsch, mehr nicht.',
      'Leichter Schneefall von {start} bis {end}: Postkartenmodus, nicht Schaufelmodus.',
    ],
    snow: [
      'Schnee von {start} bis {end}. Die Straßen werden glatt, also langsam machen.',
      'Schneefall zwischen {start} und {end}. Heiße Schokolade ist hiermit offiziell gerechtfertigt.',
    ],
    snowHeavy: [
      'Starker Schneefall zwischen {start} und {end}. Unterwegs wird es schwierig; fahr nur, wenn es nötig ist.',
      'Viel Neuschnee von {start} bis {end}. Rechne mit Verspätungen und glatten Straßen.',
    ],
    blizzard: [
      'Schneesturm ab etwa {start}: starker Schneefall und heftiger Wind. Bleib wenn möglich, wo du bist.',
    ],
    slush: [
      'Nassschnee ab etwa {start}, der schnell zu Matsch wird. Das Schlechteste aus beiden Welten.',
      'Ab etwa {start} Schnee, der sich nicht festlegen will. Wasserdichte Schuhe empfohlen.',
    ],
    sleet: [
      'Schneeregen zwischen {start} und {end}: Regen, der sich nicht entscheiden konnte, ob er Schnee sein will.',
      'Schneeregen von {start} bis {end}. Kalt, nass und von der Seite: der Hattrick des Schmuddelwetters.',
    ],
    freezingRain: [
      'Gefrierender Regen ab etwa {start}: Straßen und Gehwege können spiegelglatt werden. Verzichte möglichst auf Fahrten.',
      'Glatteisregen gegen {start}. Alle Flächen können vereisen – sei äußerst vorsichtig.',
    ],

    // Glätte & Nebel
    blackIce: [
      'Gegen {t} droht Glätte. Lauf wie ein Pinguin, fahr wie deine Oma.',
      'Nasser Boden trifft auf Frost: Gegen {t} Vorsicht vor Glatteis.',
    ],
    frost: [
      'Frostiger Start bei {low}. Eiskratzer, auf die Plätze!',
      'Früh nur {low}: Frost auf Autos, Rasen und vielleicht auf deiner Laune.',
    ],
    fogMorning: [
      'Nebel bis etwa {end}. Abblendlicht an, Geduld auch.',
      'Draußen Waschküche bis gegen {end}. Die Aussicht kommt später zurück, versprochen.',
    ],
    fogTonight: [
      'Gegen {start} bildet sich Nebel. Langsam fahren und Abblendlicht an.',
      'Ab etwa {start} zieht Nebel auf. Sehr Edgar Wallace, sehr schlecht für die Sicht.',
    ],
    freezingFog: [
      'Gefrierender Nebel bis etwa {end}: schlechte Sicht und glatte Flächen. Vorsicht auf der Straße.',
    ],

    // Himmel
    sunnyAllDay: [
      'Sonne von morgens bis abends, bis zu {high}. Der Himmel hat nichts zu verbergen.',
      'Den ganzen Tag blauer Himmel, bis zu {high}. Fast schon verdächtig.',
    ],
    grayAllDay: [
      'Grau von früh bis spät. Die Sonne hat sich krankgemeldet.',
      'Grau in Grau, und zwar die langweiligen Töne. Immerhin trocken.',
    ],
    clearingLater: [
      'Wolkiger Start, aber gegen {t} kommt die Sonne durch. Warten lohnt sich.',
      'Gegen {t} packen die Wolken zusammen; die zweite Tageshälfte sieht viel besser aus.',
    ],
    cloudingLater: [
      'Sonniger Start, gegen {t} ziehen Wolken auf. Tank die Sonne früh.',
      'Genieß die Sonne, solange sie da ist: Gegen {t} übernehmen die Wolken.',
    ],
    perfectDay: [
      'Bilderbuchwetter: trocken, sonnig, {high}. Wer drinnen bleibt, ist selbst schuld.',
      '{high}, Sonne, kein Regen. Viel besser wird’s ehrlich nicht.',
      'Wetter der Extraklasse: trocken, hell und {high}. Such dir einen Grund, rauszugehen.',
    ],

    // Temperatur
    bigSwing: [
      'Von {low} am Morgen bis {high} am Nachmittag. Zwiebellook ist Pflicht.',
      'Früh {low}, später {high}. Deine Jacke verbringt den Nachmittag unterm Arm.',
    ],
    warm: [
      'Warm, bis zu {high}. Kurze Hosen sind eine völlig legitime Lebensentscheidung.',
      'Bis zu {high}: warm genug, dass ein Eis als Mittagessen durchgeht.',
    ],
    hot: [
      'Heiß: gefühlt {feels} zwischen {start} und {end}. Schatten, Wasser, langsam machen.',
      'Gefühlt {feels} von {start} bis {end}. Alles Anstrengende: davor oder danach.',
    ],
    extremeHeat: [
      'Extreme Hitze, gefühlt {feels}. Meide die Sonne zwischen {start} und {end}, trink regelmäßig und schau nach gefährdeten Menschen.',
    ],
    tropicalNight: [
      'Tropennacht: nicht unter {low}. Schlafen wird zur Ausdauersportart.',
      'Heute Nacht nur runter auf {low}. Ventilator an, Decke weg.',
    ],
    freezingDay: [
      'Den ganzen Tag Dauerfrost, höchstens {high}. Draußen ist quasi Tiefkühlfach.',
      'Kein Tauwetter in Sicht: höchstens {high}. Handschuhe sind keine Option, sondern Pflicht.',
    ],
    bitterCold: [
      'Klirrende Kälte: gefühlt {feels}. Pack jedes Stückchen Haut ein.',
      'Gefühlt {feels}. Sogar Pinguine würden nach einem Schal fragen.',
    ],
    extremeCold: [
      'Gefährliche Kälte, gefühlt {feels}. Erfrierungen sind innerhalb von Minuten möglich; bleib nur kurz draußen.',
    ],
    windChill: [
      'Das Thermometer sagt das eine, der Wind sagt {feels}. Glaub dem Wind.',
      'Mit dem Wind fühlt es sich an wie {feels}. Kapuze auf.',
    ],
    muggy: [
      'Schwül und drückend: Bis Mittag fühlst du dich wie eine Dampfnudel.',
      'So feucht, dass man fast durch die Luft schwimmen kann. Atmungsaktive Klamotten, bitte.',
    ],
    tempDrop: [
      'Gegen {t} ein kräftiger Temperatursturz: in wenigen Stunden etwa {diff} kälter. Jacke griffbereit halten.',
      'Gegen {t} platzt eine Kaltfront herein und nimmt {diff} mit.',
    ],
    eveningChill: [
      'Es kühlt schnell ab: {low} gegen {t}. Die Jacke, die du jetzt nicht brauchst? Nimm sie mit.',
      'Gegen {t} nur noch {low}. Am Abend gilt ein anderer Dresscode.',
    ],
    warmForSeason: [
      '{high}? Für die Jahreszeit fast schon ein Geschenk.',
      'Ungewöhnlich mild mit {high}. Die Natur hat wohl den Kalender verlegt.',
    ],
    coldForSeason: [
      'Nur {high}. Die Jahreszeit hat wohl die Schlummertaste gedrückt.',
      'Höchstens {high}. Nicht gerade jahreszeitgemäß, aber so ist es halt.',
    ],
    sunnyButCold: [
      'Strahlende Sonne, höchstens {high}: viel Show, wenig Wärme.',
      'Sonnig, aber nur {high}. Durchs Fenster sieht’s warm aus. Ist es nicht.',
    ],

    // Wind
    breezy: [
      'Frische Brise, bis zu {wind}. Schlecht für die Frisur, gut für den Drachen.',
      'Lebhafter Wind, bis zu {wind}. Halt deinen Hut fest.',
    ],
    windy: [
      'Windig, bis zu {wind}. Regenschirme stülpen sich um.',
      'Wind bis zu {wind}. Sichere leichte Sachen – und deine Frisur.',
    ],
    gale: [
      'Starker Wind bis zu {wind}. Gartenmöbel sichern und auf herabfallende Äste achten.',
      'Sturmböen bis zu {wind}. Nicht der Tag, um eine große Sperrholzplatte zu tragen.',
    ],
    storm: [
      'Sturm mit bis zu {wind}. Halte Abstand zu Bäumen, Gerüsten und zur Küste.',
    ],
    hurricane: [
      'Orkanböen bis zu {wind}. Folge den Anweisungen der örtlichen Behörden.',
    ],

    // Belastung
    uvHigh: [
      'UV-Index bis {uv}, am stärksten gegen {t}. Sonnencreme – außer du willst den Hummer-Look.',
      'UV-Index {uv}, Höhepunkt gegen {t}. Sonnenbrille auf, Sonnencreme drauf.',
    ],
    uvVeryHigh: [
      'Sehr hoher UV-Index ({uv}) zwischen {start} und {end}. Sonnencreme und Schatten, ganz im Ernst.',
      'UV-Index {uv} von {start} bis {end}: Die Haut verbrennt schneller als Toast.',
    ],
    uvExtreme: [
      'Extremer UV-Index ({uv}). Ungeschützte Haut verbrennt in Minuten: bedecken und mittags Schatten suchen.',
    ],
    airPoor: [
      'Die Luftqualität ist schlecht. Die Joggingrunde vielleicht lieber drinnen.',
      'Die Luft ist gerade nicht die beste. Empfindliche Lungen, macht langsam.',
    ],
    airVeryPoor: [
      'Sehr schlechte Luftqualität. Vermeide anstrengende Aktivitäten im Freien, besonders wenn du empfindlich bist.',
    ],

    // Nacht
    clearNight: [
      'Klarer Himmel heute Nacht, runter auf {low}. Eine gute Nacht, um nach oben zu schauen.',
      'Sternenklare Nacht, Tiefstwert {low}.',
    ],
    calmNight: [
      'Ruhige Nacht, runter auf {low}. Das Wetter hat Feierabend.',
      'Nichts zu melden heute Nacht: Tiefstwert {low}. Schlaf gut.',
    ],
    nightRainAll: [
      'Regen die ganze Nacht. Toller Einschlaf-Soundtrack, blöde Nacht für die Gassirunde.',
      'Regen bis zum Morgen. Die Dachrinnen haben Nachtschicht.',
    ],
    nightRainFrom: [
      'Gegen {start} kommt der Regen und bleibt die ganze Nacht. Hol die Kissen rein.',
      'Trocken bis {start}, dann trommelt der Regen die ganze Nacht aufs Dach.',
    ],
    nightRainUntil: [
      'Regen bis etwa {end}, danach bleibt der Rest der Nacht trocken.',
      'Gegen {end} geht auch der Regen schlafen.',
    ],
    nightRainWindow: [
      'Regen zwischen {start} und {end}, sonst trocken.',
      'Ein nasser Abschnitt von {start} bis {end}, dann wieder Ruhe.',
    ],
    nightSnow: [
      'Schnee ab etwa {start}. Vielleicht wachst du in einer weißen Welt auf.',
      'Schnee in der Nacht ab {start}. Morgen früh: vorm Fenster Postkarte, auf der Straße Eisbahn.',
    ],
    nightStorm: [
      'Gewitter möglich zwischen {start} und {end}. Zieh den Stecker bei allem, was dir lieb ist.',
      'Gewitter zwischen {start} und {end}. Der Hund will heute bei dir im Bett schlafen.',
    ],

    // Morgen
    tomorrowColder: [
      'Etwa {diff} kälter, höchstens {high}. Hol heute Abend schon die warme Jacke raus.',
      'Die Temperaturen fallen um {diff}: höchstens {high}. Genieß heute, solange es geht.',
    ],
    tomorrowWarmer: [
      'Etwa {diff} wärmer, bis zu {high}. Etwas, worauf man sich freuen kann.',
      'Ein Sprung um {diff}, bis zu {high}. Dein Morgen-Ich sagt danke.',
    ],

    // Ruhig
    calmSunny: [
      'Sonnig und ereignislos, {low} bis {high}. Das Wetter hat frei.',
      'Ganz entspannt: Sonne, {low} bis {high}, nichts zu befürchten.',
    ],
    calmCloudy: [
      'Bewölkt, aber trocken, {low} bis {high}. Nicht aufregend, aber auch kein Problem.',
      'Gräulich und ruhig, {low} bis {high}. Wettertechnisch ein Tag wie aus dem Durchschnittskatalog.',
    ],
    calmMixed: [
      'Sonne und Wolken wechseln sich ab, {low} bis {high}. Kein Drama.',
      'Ein bisschen von allem, nur kein Regen: {low} bis {high}.',
    ],

    // Extras
    fullMoon: [
      'Vollmond heute Nacht bei klarem Himmel. Werwölfe, ihr seid gewarnt.',
      'Vollmond und klarer Himmel: Das Nachtlicht der Natur ist an.',
    ],
    supermoon: ['Supermond heute Nacht: Der Mond ist besonders nah und besonders hell. Schau nach oben!'],
    newMoonStars: [
      'Neumond und klarer Himmel: beste Bedingungen zum Sternegucken. Raus aus dem Lichtermeer der Stadt.',
      'Kein Mond, keine Wolken: Heute Nacht gehört die Bühne den Sternen.',
    ],
    meteors: [
      'Die {name} erreichen heute Nacht ihren Höhepunkt: bis zu {rate} Sternschnuppen pro Stunde. Wünsche bereithalten!',
      'Klarer Himmel für die {name} heute Nacht, bis zu {rate} Meteore pro Stunde. Weg von den Lichtern, Blick nach oben.',
    ],
    goldenHour: [
      'Goldene Stunde ab {golden}, Sonnenuntergang um {sunset}. Fotografen, auf Position!',
      'Klarer Himmel zum Sonnenuntergang ({sunset}). Gegen {golden} lohnt sich ein Blick aus dem Fenster.',
    ],
    sunriseClear: ['Sonnenaufgang um {sunrise} bei klarem Himmel. Frühaufsteher bekommen die Show.'],
    midnightSun: ['Die Sonne geht heute nicht unter. Verdunkelungsvorhänge sind deine besten Freunde.'],
    polarNight: ['Heute kein Sonnenaufgang: Polarnacht. Vitamin D, Kerzen und gute Gesellschaft.'],
    longestDay: ['Längster Tag des Jahres: {daylight} Tageslicht. Nutz es gut (oder zumindest draußen).'],
    shortestDay: ['Kürzester Tag des Jahres: nur {daylight} Tageslicht. Ab morgen schlägt das Licht zurück.'],
    springEquinox: ['Frühlings-Tagundnachtgleiche: Tag und Nacht sind gleich lang. Ab jetzt gewinnt das Licht.'],
    autumnEquinox: [
      'Herbst-Tagundnachtgleiche: Tag und Nacht sind gleich lang. Ab jetzt gewinnen die Nächte. Kuscheldecken bereit.',
    ],
    earlySunset: ['Sonnenuntergang um {sunset}. Ja, jetzt schon.', 'Die Sonne macht um {sunset} Feierabend. Glückspilz.'],
    lateSunset: ['Sonnenuntergang erst um {sunset}: Da ist noch viel Abend drin.'],
    whiteChristmas: ['Leise rieselt der Schnee – diesmal wirklich. Weiße Weihnachten!'],
    greenChristmas: ['{high} an Weihnachten. Der Weihnachtsmann tauscht den Schlitten vielleicht gegen einen E-Roller.'],
    nyeDry: ['Um Mitternacht trocken bei {low}. Sekt kalt stellen, das Feuerwerk kann kommen.'],
    nyeWet: ['Gegen Mitternacht wird’s womöglich nass: Feuerwerk mit Kapuze.'],
    halloween: ['Halloween bei diesem Wetter? Die Gruselstimmung gibt’s gratis dazu.'],
  },

  tips: {
    umbrella: [
      'Regenschirm: ja. Wildlederschuhe: nein.',
      'Schirm einpacken. Dein Zukunfts-Ich sagt danke.',
      'Schirm in die Tasche. Der wiegt weniger als die Reue.',
    ],
    raincoat: [
      'Es gibt kein schlechtes Wetter, nur falsche Kleidung. Heute richtig: Regenjacke mit Kapuze.',
      'Zu windig für einen Schirm: Eine Jacke mit Kapuze macht den besseren Job.',
    ],
    snowBoots: ['Heute gute Schuhe: Grip vor Style.', 'Schuhe mit Profil – und etwas früher los.'],
    snowman: ['Schnee und frei: Zeit für einen Schneemann. Karotte nicht inklusive.'],
    layers: [
      'Zwiebellook: Nachmittags schälst du dich raus, abends wieder rein.',
      'Zieh dich an wie eine Zwiebel: mehrere Schichten, einzeln abnehmbar.',
    ],
    sunscreen: [
      'Sonnencreme, auch wenn’s kein Strandtag ist. Vor allem auf die Nase.',
      'Lichtschutzfaktor drauf, Sonnenbrille auf. Deine Haut dankt es dir in 20 Jahren.',
    ],
    scrape: [
      'Fahr 5 Minuten früher los, um die Scheibe freizukratzen.',
      'Eiskratzer bereit. Heißes Wasser auf die Scheibe: niemals.',
    ],
    hydrate: [
      'Wasserflasche ist Pflicht. Kaffee zählt nicht.',
      'Trink, bevor du Durst hast, und bleib mittags im Schatten.',
    ],
    bundleUp: ['Mütze, Handschuhe, Schal: das volle Programm.', 'Zieh dich warm an. Und dann noch eine Schicht drüber.'],
    laundry: [
      'Perfektes Wäschewetter: Sonne, Brise, kein Regen. Der Trockner hat heute frei.',
      'Wäsche raus – die ist in Rekordzeit trocken.',
    ],
    terrace: [
      'Warmer Abend in Sicht: Terrasse, Grillen oder Picknick, du hast die Wahl.',
      'Ein Abend wie gemacht zum Draußensitzen. Biergarten, nur so als Idee.',
    ],
    mosquitoes: ['Warmer, schwüler Abend: Die Mücken stehen auf der Gästeliste. Mückenspray empfohlen.'],
    noCarWash: ['Auto waschen? Der Regen morgen erledigt das gratis.'],
    stayIn: [
      'Bleib wenn möglich drinnen, lade dein Handy auf und halte eine Taschenlampe bereit.',
      'Verschiebe alle Fahrten, die nicht nötig sind, und halte dein Handy geladen.',
    ],
    secureObjects: ['Sichere oder hol alles rein, was wegfliegen kann: Mülltonnen, Trampoline, Gartenstühle.'],
    extraTime: ['Plane mehr Zeit für den Weg ein und geh vorsichtig.', 'Fahr langsamer und nimm dir extra Zeit.'],
    jacketEvening: ['Nimm für den Abend eine Jacke mit, auch wenn es sich gerade albern anfühlt.'],
  },

  meteorNames: {
    quadrantids: 'Quadrantiden',
    lyrids: 'Lyriden',
    etaAquariids: 'Eta-Aquariiden',
    perseids: 'Perseiden',
    orionids: 'Orioniden',
    leonids: 'Leoniden',
    geminids: 'Geminiden',
  },
};
