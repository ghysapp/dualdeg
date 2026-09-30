import type { PhraseBank } from '../types';

/**
 * Hours carry their own article ("le 14", "l’una", "mezzanotte",
 * "mezzogiorno"), so templates only use prepositions that don't fuse with it:
 * "verso {t}", "tra {start} e {end}", "dopo {start}", "fin verso {end}".
 * Clock times ({sunset}, {sunrise}, {golden}) are bare ("19:42") and follow
 * "alle" / "dalle" / "verso le".
 */
const hour = (h: number): string => {
  if (h === 0) return 'mezzanotte';
  if (h === 12) return 'mezzogiorno';
  return h === 1 ? 'l’una' : `le ${h}`;
};
const time = (h: number, m: number): string => `${h}:${String(m).padStart(2, '0')}`;
const duration = (min: number): string => `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')} min`;

export const it: PhraseBank = {
  title: 'La tua giornata in breve',
  labels: {
    today: 'Oggi',
    tonight: 'Stanotte',
    tomorrow: 'Domani',
    laterToday: 'Al risveglio',
  },
  hour,
  time,
  duration,

  greetings: {
    earlyBird: ['In piedi prima del sole? Rispetto.', 'Il mattino ha l’oro in bocca. Il meteo, per ora, solo uno sbadiglio.'],
    morning: [
      'Buongiorno! La tua giornata in pillole.',
      'Buongiorno! Prima l’espresso, poi il meteo.',
      'Buongiorno. Il cielo ha dei piani per te.',
    ],
    midday: ['Pausa pranzo, meteo servito.', 'Metà giornata è andata. Ecco il resto.'],
    afternoon: ['Buon pomeriggio! Ecco cosa resta della giornata.', 'È arrivato il bollettino del pomeriggio.'],
    evening: ['Buonasera! Stanotte e domani, in breve.', 'Il bollettino della sera, servito caldo.'],
    late: ['Controllo dell’ultimo minuto? Ecco stanotte e domani.', 'Un’ultima occhiata prima di dormire.'],
    nightOwl: [
      'Ancora in piedi? Il meteo dorme, dovresti farlo anche tu.',
      'Gufo notturno avvistato. Ecco cosa arriva.',
    ],
    firstWorkday: [
      'Lunedì. Ce la faremo, insieme.',
      'Lunedì mattina. Respiro profondo.',
      'Lunedì: oggi il caffè lavora più di te.',
    ],
    midweek: ['Mercoledì: metà strada è fatta.', 'Mercoledì! Da qui è tutta discesa.'],
    lastWorkday: ['Venerdì! Il weekend è all’orizzonte.', 'È venerdì. Ce l’hai fatta (quasi).'],
    lastWorkdayEvening: ['Venerdì sera! Ecco l’anteprima del weekend.', 'Il weekend comincia adesso. E il meteo pure.'],
    weekend: ['È {day}: niente sveglia, niente fretta.', 'Modalità weekend: attivata.'],
    weekendEnd: ['Domenica sera. Il meteo di domani, con delicatezza.', 'Il weekend sta per finire. Ecco cosa ci aspetta.'],
    newYear: ['Buon anno! Il primo meteo dell’anno.'],
    newYearsEve: ['Ultimo giorno dell’anno! Ecco il meteo finale. Alle lenticchie pensi tu.'],
    christmas: ['Buon Natale! Il tuo meteo, incartato come un regalo.'],
    halloween: ['Buon Halloween! Il meteo è un dolcetto, niente scherzetti.'],
    friday13: ['Venerdì 13. Niente panico: in Italia quello che porta sfortuna è il 17.'],
    aprilFools: ['Primo aprile. Questo meteo non è un pesce d’aprile. Probabilmente.'],
    valentine: ['Buon San Valentino! Il meteo, con amore.'],
    alert: ['Attenzione: maltempo in arrivo.', 'Importante: il meteo richiede la tua attenzione.'],
  },

  lines: {
    // Pioggia
    rainAllDay: [
      'Pioggia dall’inizio alla fine. Il cielo ha parecchio da sfogare.',
      'Bagnato, bagnatissimo, fradicio: la pioggia non si prende quasi pause.',
      'Una di quelle giornate in cui la pioggia non finge nemmeno di smettere.',
    ],
    rainLater: [
      'Asciutto per ora: la pioggia arriva verso {start} e resta fino a sera.',
      'Commissioni? Meglio sbrigarle presto: verso {start} arriva la pioggia e non se ne va più.',
      'Goditi l’asciutto: la pioggia timbra il cartellino verso {start} e fa gli straordinari.',
    ],
    rainStops: [
      'Inizio bagnato, ma verso {end} smette. La pazienza paga.',
      'La pioggia fa le valigie verso {end}. Tieni duro.',
      'Pioggia fin verso {end}, poi il cielo si calma.',
    ],
    rainWindow: [
      'Rovesci tra {start} e {end}, asciutto prima e dopo. È tutta questione di tempismo.',
      'Pioggia in agenda tra {start} e {end}. Il resto è asciutto.',
      'Finestra bagnata tra {start} e {end}: organizza le uscite di conseguenza.',
    ],
    rainBrief: [
      'Un rovescio veloce verso {t}. Un attimo e passa, a meno che tu non ci sia sotto.',
      'Un breve scroscio verso {t}, poi tutto come prima.',
    ],
    rainOnOff: [
      'Rovesci a intermittenza. Il cielo non sa decidersi.',
      'Gli acquazzoni vanno e vengono come un gatto alla porta: dentro, fuori, dentro, fuori.',
      'Rovesci a macchia di leopardo. Porta occhiali da sole e ombrello, e non fidarti di nessuno dei due.',
    ],
    showersPossible: [
      'Tra {start} e {end} potrebbe scappare un rovescio. Potrebbe.',
      'Qualche possibilità di pioggia tra {start} e {end}. Testa o croce, in pratica.',
    ],
    rainCommuteAM: [
      'Pioggia verso {start}, proprio all’ora di andare al lavoro. Ovviamente.',
      'La pioggia arriva verso {start}, giusto in tempo per accompagnarti in ufficio.',
    ],
    rainCommutePM: [
      'La pioggia arriva verso {start}, perfettamente sincronizzata con il rientro a casa.',
      'Asciutto tutto il giorno, bagnato per tornare: pioggia dopo {start}.',
    ],
    drizzle: [
      'Pioviggine tra {start} e {end}: non proprio pioggia, ma quanto basta per dare fastidio.',
      'Pioggerellina tra {start} e {end}. I tuoi capelli se ne accorgeranno prima di te.',
    ],
    downpour: [
      'Possibile acquazzone verso {t}. Non è il momento per una passeggiata.',
      'Verso {t} piove a catinelle. Se puoi, stai al coperto.',
    ],
    thunder: [
      'Possibili temporali tra {start} e {end}. Quando tuona, tutti dentro.',
      'Temporali in arrivo tra {start} e {end}: lampi, tuoni, il pacchetto completo. Evita gli spazi aperti.',
    ],
    thunderSnow: [
      'Temporale nevoso verso {start}: neve E fulmini. Raro, strano e piuttosto spettacolare.',
    ],

    // Inverno
    snowLight: [
      'Qualche fiocco tra {start} e {end}. Carino, niente di più.',
      'Neve leggera tra {start} e {end}: modalità cartolina, non modalità pala.',
    ],
    snow: [
      'Neve tra {start} e {end}. Strade scivolose: vai piano.',
      'Nevica tra {start} e {end}. La cioccolata calda è ufficialmente giustificata.',
    ],
    snowHeavy: [
      'Forti nevicate tra {start} e {end}. Spostamenti difficili: esci solo se necessario.',
      'Molta neve attesa tra {start} e {end}. Prevedi ritardi e strade scivolose.',
    ],
    blizzard: [
      'Bufera di neve in arrivo verso {start}: neve intensa e vento forte. Resta al riparo se puoi.',
    ],
    slush: [
      'Neve bagnata verso {start}, che diventa subito neve marcia. Il peggio di due mondi.',
      'Neve indecisa in arrivo verso {start}. Scarpe impermeabili consigliate.',
    ],
    sleet: [
      'Nevischio tra {start} e {end}: pioggia che non ha saputo decidere se diventare neve.',
      'Pioggia mista a neve tra {start} e {end}. Freddo, bagnato e di traverso: un tris da incubo.',
    ],
    freezingRain: [
      'Pioggia gelata verso {start}: strade e marciapiedi possono diventare lastre di ghiaccio. Evita gli spostamenti se puoi.',
      'Pioggia che gela al suolo verso {start}. Qualsiasi superficie può ghiacciare: massima prudenza.',
    ],

    // Ghiaccio e nebbia
    blackIce: [
      'Probabili lastre di ghiaccio verso {t}. Cammina come un pinguino, guida come la nonna.',
      'Suolo bagnato e aria gelida: attenzione al ghiaccio verso {t}.',
    ],
    frost: [
      'Risveglio gelato, {low}. Raschietti, ai vostri posti.',
      'Minima di {low} al mattino presto: brina sulle auto, sui prati e forse anche sull’umore.',
    ],
    fogMorning: [
      'Nebbia fin verso {end}. Anabbaglianti accesi, pazienza pure.',
      'Nebbia da tagliare col coltello fin verso {end}. La vista torna dopo, promesso.',
    ],
    fogTonight: [
      'La nebbia si forma verso {start}. Guida piano e accendi gli anabbaglianti.',
      'Nebbia in arrivo verso {start}. Molto cinematografica, pessima per la visibilità.',
    ],
    freezingFog: [
      'Nebbia gelata fin verso {end}: visibilità ridotta e superfici scivolose. Prudenza alla guida.',
    ],

    // Cielo
    sunnyAllDay: [
      'Sole dalla mattina alla sera, fino a {high}. Il cielo non ha niente da nascondere.',
      'Cielo azzurro tutto il giorno, fino a {high}. Sospettosamente bello.',
    ],
    grayAllDay: [
      'Grigio dall’inizio alla fine. Il sole si è dato malato.',
      'Cinquanta sfumature di grigio, quasi tutte noiose. Almeno è asciutto.',
    ],
    clearingLater: [
      'Inizio nuvoloso, ma verso {t} il sole fa capolino. Vale l’attesa.',
      'Le nuvole fanno i bagagli verso {t}; la seconda metà promette molto meglio.',
    ],
    cloudingLater: [
      'Partenza soleggiata, nuvole in arrivo verso {t}. Fai il pieno di sole presto.',
      'Goditi il sole finché dura: verso {t} le nuvole prendono il comando.',
    ],
    perfectDay: [
      'Giornata da manuale: asciutto, soleggiato, {high}. Se resti in casa, è una tua scelta.',
      '{high}, sole e niente pioggia. Onestamente, di meglio non si può.',
      'Meteo di prima scelta: asciutto, luminoso e {high}. Trova una scusa per uscire.',
    ],

    // Temperature
    bigSwing: [
      'Da {low} al mattino a {high} nel pomeriggio. Vestiti a cipolla.',
      '{low} presto, {high} più tardi. La giacca passerà il pomeriggio in mano.',
    ],
    warm: [
      'Bella giornata calda, fino a {high}. I pantaloncini sono una scelta di vita legittima.',
      'Fino a {high}: abbastanza caldo da far passare un gelato per un pranzo.',
    ],
    hot: [
      'Caldo: percepiti {feels} tra {start} e {end}. Ombra, acqua e calma.',
      'Temperatura percepita {feels} tra {start} e {end}. Sforzi: prima o dopo.',
    ],
    extremeHeat: [
      'Caldo estremo, con temperatura percepita di {feels}. Evita il sole tra {start} e {end}, bevi spesso e controlla come stanno le persone fragili.',
    ],
    tropicalNight: [
      'Notte tropicale: non si scende sotto {low}. Dormire sarà uno sport di resistenza.',
      'Minima di {low} stanotte. Ventilatore acceso, piumone in cantina.',
    ],
    freezingDay: [
      'Sotto zero tutto il giorno, {high} al massimo. Fuori è praticamente un freezer.',
      'Nessun disgelo in vista: {high} al massimo. I guanti non sono facoltativi.',
    ],
    bitterCold: [
      'Freddo pungente: percepiti {feels}. Copri ogni centimetro di pelle.',
      'Percepiti {feels}. Anche i pinguini chiederebbero una sciarpa.',
    ],
    extremeCold: [
      'Freddo pericoloso, con temperatura percepita di {feels}. Il congelamento può arrivare in pochi minuti: limita il tempo all’aperto.',
    ],
    windChill: [
      'Il termometro dice una cosa, il vento dice {feels}. Fidati del vento.',
      'Col vento, percepiti {feels}. Cappuccio su.',
    ],
    muggy: [
      'Afa appiccicosa: a mezzogiorno ti sentirai un raviolo al vapore.',
      'Così umido che si potrebbe nuotare nell’aria. Tessuti traspiranti, per favore.',
    ],
    tempDrop: [
      'Calo brusco verso {t}: circa {diff} in meno nel giro di poche ore. Tieni una giacca a portata di mano.',
      'Un fronte freddo irrompe verso {t} e si porta via {diff}.',
    ],
    eveningChill: [
      'Rinfresca in fretta: {low} verso {t}. Quella giacca che ora non ti serve? Portala.',
      '{low} verso {t}. La sera ha un altro dress code.',
    ],
    warmForSeason: [
      '{high}? Per il periodo, è quasi un regalo.',
      'Insolitamente mite: {high}. La natura deve aver perso il calendario.',
    ],
    coldForSeason: [
      'Solo {high}. La bella stagione ha premuto «posticipa».',
      '{high} al massimo. Poco di stagione, ma tant’è.',
    ],
    sunnyButCold: [
      'Sole pieno, {high} al massimo: tanto fumo e poco arrosto.',
      'Soleggiato ma solo {high}. Dalla finestra sembra caldo. Non lo è.',
    ],

    // Vento
    breezy: [
      'Brezza vivace, fino a {wind}. Giornataccia per i capelli, giornata ideale per l’aquilone.',
      'Un bel venticello, fino a {wind}. Tieni stretto il cappello.',
    ],
    windy: [
      'Ventoso, fino a {wind}. Gli ombrelli si rovesceranno.',
      'Vento fino a {wind}. Fissa le cose leggere, e anche la piega.',
    ],
    gale: [
      'Vento forte fino a {wind}. Metti al sicuro i mobili da giardino e attenzione ai rami che cadono.',
      'Raffiche fino a {wind}. Non è giornata per portare in giro un pannello di compensato.',
    ],
    storm: [
      'Vento di tempesta fino a {wind}. Stai lontano da alberi, impalcature e costa.',
    ],
    hurricane: [
      'Venti di forza uragano fino a {wind}. Segui le indicazioni delle autorità locali.',
    ],

    // Esposizione
    uvHigh: [
      'UV {uv} verso {t}. Crema solare, a meno che tu non punti al look aragosta.',
      'L’UV arriva a {uv} verso {t}. Occhiali da sole e crema, grazie.',
    ],
    uvVeryHigh: [
      'UV molto alto ({uv}) tra {start} e {end}. Crema solare e ombra, sul serio.',
      'UV {uv} tra {start} e {end}: la pelle si tosta più in fretta di una bruschetta.',
    ],
    uvExtreme: [
      'UV estremo ({uv}). La pelle non protetta si scotta in pochi minuti: copriti e cerca l’ombra a mezzogiorno.',
    ],
    airPoor: [
      'Qualità dell’aria scarsa. Forse oggi la corsetta è meglio al chiuso.',
      'L’aria non è granché in questo momento. Se hai i polmoni sensibili, vacci piano.',
    ],
    airVeryPoor: [
      'Qualità dell’aria pessima. Limita gli sforzi all’aperto, soprattutto se sei una persona sensibile.',
    ],

    // Notte
    clearNight: [
      'Cielo sereno stanotte, minima di {low}. Una bella notte per guardare in su.',
      'Notte stellata in arrivo, {low} nel momento più freddo.',
    ],
    calmNight: [
      'Notte tranquilla, minima di {low}. Il meteo è fuori servizio.',
      'Niente da segnalare stanotte: {low} la minima. Dormi bene.',
    ],
    nightRainAll: [
      'Pioggia tutta la notte. Colonna sonora perfetta per dormire, pessima per la passeggiata col cane.',
      'Pioggia fino al mattino. Le grondaie avranno il loro bel da fare.',
    ],
    nightRainFrom: [
      'La pioggia arriva verso {start} e resta a dormire. Metti dentro i cuscini del balcone.',
      'Asciutto fin verso {start}, poi pioggia sui tetti per tutta la notte.',
    ],
    nightRainUntil: [
      'Pioggia fin verso {end}, poi il resto della notte all’asciutto.',
      'La pioggia va a dormire verso {end}.',
    ],
    nightRainWindow: [
      'Pioggia tra {start} e {end}, asciutto il resto del tempo.',
      'Un passaggio piovoso tra {start} e {end}, poi torna la calma.',
    ],
    nightSnow: [
      'Neve verso {start}. Potresti svegliarti in un mondo bianco.',
      'Neve nella notte, dopo {start}. Domani: cartolina dalla finestra, pista di pattinaggio in strada.',
    ],
    nightStorm: [
      'Possibili temporali tra {start} e {end}. Stacca la spina a ciò che ti è caro.',
      'Temporali tra {start} e {end}. Il cane vorrà dormire nel tuo letto.',
    ],

    // Domani
    tomorrowColder: [
      'Circa {diff} in meno, massima di {high}. Tira fuori il cappotto stasera.',
      'Le temperature calano di {diff}: {high} al massimo. Goditi oggi finché dura.',
    ],
    tomorrowWarmer: [
      'Circa {diff} in più, fino a {high}. Qualcosa di bello da aspettare.',
      'Un balzo di {diff}, fino a {high}. Il tuo io di domani ringrazia.',
    ],

    // Calma
    calmSunny: [
      'Soleggiato e senza sorprese, da {low} a {high}. Il meteo si prende un giorno libero.',
      'Tutto tranquillo: sole, da {low} a {high}, niente di cui preoccuparsi.',
    ],
    calmCloudy: [
      'Nuvoloso ma asciutto, da {low} a {high}. Niente di emozionante, niente di problematico.',
      'Grigiastro e calmo, da {low} a {high}. Una giornata perfettamente nella media.',
    ],
    calmMixed: [
      'Sole e nuvole si danno il cambio, da {low} a {high}. Nessun dramma.',
      'Un po’ di tutto tranne la pioggia: da {low} a {high}.',
    ],

    // Extra
    fullMoon: [
      'Luna piena stanotte con cielo sereno. Lupi mannari, siete avvisati.',
      'Luna piena e cielo limpido: serata perfetta per un «Che fai tu, luna, in ciel?».',
    ],
    supermoon: ['Superluna stanotte: la Luna è più vicina e più luminosa del solito. Guarda in su!'],
    newMoonStars: [
      'Luna nuova e cielo sereno: serata ideale per le stelle. Allontanati dalle luci della città.',
      'Niente luna, niente nuvole: stanotte il palco è tutto delle stelle.',
    ],
    meteors: [
      'Picco delle {name} stanotte: fino a {rate} stelle cadenti all’ora. Tieni pronti i desideri.',
      'Cielo sereno per le {name} stanotte, fino a {rate} meteore all’ora. Guarda in su, lontano dalle luci.',
    ],
    goldenHour: [
      'Ora d’oro dalle {golden}, tramonto alle {sunset}. Fotografi, in posizione.',
      'Tramonto limpido alle {sunset}. Vale la pena affacciarsi verso le {golden}.',
    ],
    sunriseClear: ['Alba alle {sunrise} con cielo sereno. Lo spettacolo è per chi si alza presto.'],
    midnightSun: ['Oggi il sole non tramonta. Le tende oscuranti sono le tue migliori amiche.'],
    polarNight: ['Oggi il sole non sorge: notte polare. Vitamina D, candele e buona compagnia.'],
    longestDay: ['Il giorno più lungo dell’anno: {daylight} di luce. Usala bene (possibilmente all’aperto).'],
    shortestDay: ['Il giorno più corto dell’anno: solo {daylight} di luce. Da domani la luce contrattacca.'],
    springEquinox: ['Equinozio di primavera: giorno e notte in parità. Da qui in poi vince la luce.'],
    autumnEquinox: ['Equinozio d’autunno: giorno e notte in parità. Da adesso vincono le notti. Coperte a portata di mano.'],
    earlySunset: ['Tramonto alle {sunset}. Sì, già.', 'Il sole stacca alle {sunset}. Beato lui.'],
    lateSunset: ['Il sole tramonta solo alle {sunset}: lunga serata davanti.'],
    whiteChristmas: ['Neve a Natale: quella vera. Qualcuno faccia partire la musica.'],
    greenChristmas: ['{high} a Natale. Babbo Natale potrebbe scambiare la slitta con un monopattino.'],
    nyeDry: ['Verso mezzanotte: asciutto, {low}. Perfetto per i fuochi d’artificio.'],
    nyeWet: ['Possibile pioggia verso mezzanotte: brindisi sotto l’ombrello, allora.'],
    halloween: ['Halloween con questo tempo? L’atmosfera spettrale la offre la casa.'],
  },

  tips: {
    umbrella: [
      'Ombrello: sì. Scarpe di camoscio: no.',
      'Porta l’ombrello. Il tuo io del futuro ringrazia.',
      'Ombrello in borsa. Pesa meno dei rimpianti.',
    ],
    raincoat: [
      'Pioggia più vento: l’ombrello non ha speranze. Meglio un impermeabile col cappuccio.',
      'Troppo vento per l’ombrello: una giacca col cappuccio farà un lavoro migliore.',
    ],
    snowBoots: ['Scarpe serie oggi: aderenza prima dello stile.', 'Scarponi con buona presa, ed esci un po’ prima.'],
    snowman: ['Neve e niente lavoro: è l’ora del pupazzo di neve. Carota non inclusa.'],
    layers: [
      'Strati: li toglierai nel pomeriggio e li rimetterai la sera.',
      'Vestiti a strati, da togliere uno alla volta. La cipolla approva.',
    ],
    sunscreen: [
      'Crema solare, anche se non è giornata da spiaggia. Soprattutto sul naso.',
      'Crema e occhiali da sole. La tua pelle ti ringrazierà tra 20 anni.',
    ],
    scrape: [
      'Esci 5 minuti prima per grattare il ghiaccio dal parabrezza.',
      'Raschietto a portata di mano. Acqua calda sul parabrezza: mai.',
    ],
    hydrate: [
      'Borraccia obbligatoria. Il caffè non conta.',
      'Bevi prima di avere sete e stai all’ombra nelle ore più calde.',
    ],
    bundleUp: ['Berretto, guanti, sciarpa: il kit completo.', 'Copriti bene. Poi aggiungi un altro strato.'],
    laundry: [
      'Tempo perfetto per il bucato: sole, brezza e niente pioggia. L’asciugatrice può prendersi un giorno libero.',
      'Stendi i panni: si asciugheranno a tempo di record.',
    ],
    terrace: [
      'Serata calda in arrivo: terrazzo, grigliata o picnic, scegli tu.',
      'Una serata fatta per cenare all’aperto. Io lo dico, poi vedi tu.',
    ],
    mosquitoes: ['Serata calda e afosa: le zanzare sono nella lista degli invitati. Repellente consigliato.'],
    noCarWash: ['Volevi lavare la macchina? Ci pensa gratis la pioggia di domani.'],
    stayIn: [
      'Resta in casa se puoi, carica il telefono e tieni una torcia a portata di mano.',
      'Rimanda gli spostamenti non indispensabili e tieni il telefono carico.',
    ],
    secureObjects: ['Fissa o porta dentro tutto ciò che può volare via: bidoni, trampolini, sedie da giardino.'],
    extraTime: ['Calcola più tempo per gli spostamenti e cammina con attenzione.', 'Rallenta alla guida e prenditi un margine in più.'],
    jacketEvening: ['Porta una giacca per la sera, anche se adesso sembra assurdo.'],
  },

  meteorNames: {
    quadrantids: 'Quadrantidi',
    lyrids: 'Liridi',
    etaAquariids: 'Eta Aquaridi',
    perseids: 'Perseidi',
    orionids: 'Orionidi',
    leonids: 'Leonidi',
    geminids: 'Geminidi',
  },
};
