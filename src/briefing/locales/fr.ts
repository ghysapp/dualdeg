import type { PhraseBank } from '../types';

const hour = (h: number): string => (h === 0 ? 'minuit' : h === 12 ? 'midi' : `${h} h`);
const time = (h: number, m: number): string => `${h} h ${String(m).padStart(2, '0')}`;
const duration = (min: number): string => `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')}`;

export const fr: PhraseBank = {
  title: 'Votre journée en bref',
  labels: {
    today: 'Aujourd’hui',
    tonight: 'Cette nuit',
    tomorrow: 'Demain',
    laterToday: 'Au réveil',
  },
  hour,
  time,
  duration,

  greetings: {
    earlyBird: ['Debout avant le soleil ? Respect.', 'Lève-tôt ! La météo, elle, se frotte encore les yeux.'],
    morning: [
      'Bonjour ! Votre journée en deux coups de cuillère à pot.',
      'Bonjour ! Café d’abord, météo ensuite.',
      'Bonjour. Le ciel a des projets pour vous.',
    ],
    midday: ['Point météo de midi.', 'Mi-temps ! Voici la suite du programme.'],
    afternoon: ['Bon après-midi ! Voici ce qu’il reste de la journée.', 'Le bulletin de l’après-midi est arrivé.'],
    evening: ['Bonsoir ! Cette nuit et demain, en bref.', 'Le bulletin du soir, servi tiède.'],
    late: ['Un dernier coup d’œil avant de dormir ?', 'Tard, mais pas trop tard pour la météo.'],
    nightOwl: [
      'Encore debout ? La météo dort, vous devriez aussi.',
      'Oiseau de nuit repéré. Voici ce qui arrive.',
    ],
    firstWorkday: ['Lundi. On va y arriver ensemble.', 'Lundi matin. On respire un grand coup.'],
    midweek: ['Mercredi : la moitié est faite.', 'Mercredi ! Après, ça descend.'],
    lastWorkday: ['Vendredi ! Le week-end est en vue.', 'C’est vendredi. Vous y êtes (presque).'],
    lastWorkdayEvening: ['Vendredi soir ! Voici l’avant-goût du week-end.', 'Le week-end commence. La météo aussi.'],
    weekend: ['Vive le {day} ! Pas de réveil aujourd’hui.', 'Mode week-end : activé.'],
    weekendEnd: ['Dimanche soir. La météo de demain, en douceur.', 'Le week-end se termine. Voici la suite.'],
    newYear: ['Bonne année ! Voici la première météo de l’année.'],
    newYearsEve: ['Dernier jour de l’année ! Voici l’ultime bulletin.'],
    christmas: ['Joyeux Noël ! Votre météo, emballée dans du papier cadeau.'],
    halloween: ['Joyeux Halloween ! La météo, sans farce.'],
    friday13: ['Vendredi 13. Lisez la météo… si vous osez.'],
    aprilFools: ['1er avril. Cette météo n’est pas un poisson. En principe.'],
    valentine: ['Joyeuse Saint-Valentin ! La météo, avec amour.'],
    alert: ['Attention : temps difficile en approche.', 'Important : la météo mérite votre attention.'],
  },

  lines: {
    // Pluie
    rainAllDay: [
      'De la pluie du début à la fin. Le ciel a visiblement beaucoup de choses à dire.',
      'Mouillé, très mouillé, trempé : la pluie ne prend quasiment pas de pause.',
      'Une de ces journées où la pluie ne fait même pas semblant de s’arrêter.',
    ],
    rainLater: [
      'Sec jusque vers {start}, puis de la pluie pour le reste de la journée.',
      'Des courses à faire ? Avant {start}, quand la pluie s’installe pour de bon.',
      'Profitez du sec : la pluie pointe vers {start} et fait des heures sup’.',
    ],
    rainStops: [
      'Début mouillé, mais ça sèche vers {end}. La patience paie.',
      'La pluie fait ses valises vers {end}. Courage.',
      'De la pluie jusque vers {end}, puis le ciel se calme.',
    ],
    rainWindow: [
      'Averses entre {start} et {end}, sec avant et après. Tout est une question de timing.',
      'Pluie au programme de {start} à {end}. Le reste est sec.',
      'Une fenêtre mouillée de {start} à {end} : organisez vos sorties autour.',
    ],
    rainBrief: [
      'Une petite averse vers {t}. Vite passée, sauf si vous êtes dessous.',
      'Une courte averse vers {t}, puis on reprend comme si de rien n’était.',
    ],
    rainOnOff: [
      'Des averses, puis des éclaircies, puis des averses. Le ciel n’arrive pas à se décider.',
      'Les averses vont et viennent comme un chat devant la porte : dedans, dehors, dedans.',
      'Averses en pointillé. Prenez lunettes de soleil et parapluie, et ne faites confiance à aucun des deux.',
    ],
    showersPossible: [
      'Une averse pourrait tomber entre {start} et {end}. Pourrait.',
      'Un risque de pluie entre {start} et {end}. Pile ou face, en somme.',
    ],
    rainCommuteAM: [
      'De la pluie vers {start}, pile à l’heure du trajet. Évidemment.',
      'La pluie arrive vers {start}, juste à temps pour vous accompagner au boulot.',
    ],
    rainCommutePM: [
      'La pluie arrive vers {start}, parfaitement synchronisée avec le retour à la maison.',
      'Sec toute la journée, mouillé pour rentrer : pluie à partir de {start}.',
    ],
    drizzle: [
      'Bruine entre {start} et {end} : pas vraiment de la pluie, juste de quoi agacer.',
      'Crachin de {start} à {end}. Vos cheveux le remarqueront avant vous.',
    ],
    downpour: [
      'Grosse averse possible vers {t}. Pas le moment de flâner.',
      'Vers {t}, le ciel vide le seau. Restez à l’abri si possible.',
    ],
    thunder: [
      'Orages possibles entre {start} et {end}. Quand le tonnerre gronde, on rentre.',
      'Ça gronde de {start} à {end} : éclairs, roulements, la totale. Évitez les terrains dégagés.',
    ],
    thunderSnow: [
      'Orage de neige vers {start} : de la neige ET des éclairs. Rare, étrange et plutôt spectaculaire.',
    ],

    // Hiver
    snowLight: [
      'Quelques flocons entre {start} et {end}. Joli, sans plus.',
      'Petite neige de {start} à {end} : mode carte postale, pas mode pelle.',
    ],
    snow: [
      'Neige de {start} à {end}. Les routes deviennent glissantes : on lève le pied.',
      'Il neige entre {start} et {end}. Le chocolat chaud est officiellement justifié.',
    ],
    snowHeavy: [
      'Fortes chutes de neige entre {start} et {end}. Déplacements difficiles : ne sortez que si nécessaire.',
      'Beaucoup de neige attendue de {start} à {end}. Prévoyez des retards et des routes glissantes.',
    ],
    blizzard: [
      'Blizzard à partir de {start} environ : forte neige et vent violent. Restez à l’abri si possible.',
    ],
    slush: [
      'Neige mouillée à partir de {start}, qui tourne à la gadoue. Le pire des deux mondes.',
      'De la neige qui n’ose pas s’engager, dès {start}. Chaussures imperméables conseillées.',
    ],
    sleet: [
      'Neige fondue entre {start} et {end} : de la pluie qui n’a pas su choisir.',
      'Neige fondue de {start} à {end}. Froid, mouillé et de travers : le combo gagnant.',
    ],
    freezingRain: [
      'Pluie verglaçante à partir de {start} environ : routes et trottoirs peuvent se transformer en patinoire. Évitez de vous déplacer.',
      'Pluie verglaçante vers {start}. Toutes les surfaces peuvent geler : prudence maximale.',
    ],

    // Verglas & brouillard
    blackIce: [
      'Plaques de verglas probables vers {t}. Marchez comme un pingouin, conduisez comme votre grand-mère.',
      'Sol mouillé et air glacial : attention au verglas vers {t}.',
    ],
    frost: [
      'Réveil givré à {low}. Grattoirs, à vos postes.',
      'Jusqu’à {low} au petit matin : givre sur les voitures, les pelouses et peut-être le moral.',
    ],
    fogMorning: [
      'Brouillard jusque vers {end}. Codes allumés, patience aussi.',
      'Purée de pois jusque vers {end}. La vue revient plus tard, promis.',
    ],
    fogTonight: [
      'Le brouillard se forme vers {start}. Roulez doucement, feux de croisement allumés.',
      'Brouillard vers {start}. Très cinématographique, beaucoup moins pour la visibilité.',
    ],
    freezingFog: [
      'Brouillard givrant jusque vers {end} : visibilité réduite et surfaces glissantes. Prudence sur la route.',
    ],

    // Ciel
    sunnyAllDay: [
      'Du soleil du matin au soir, jusqu’à {high}. Le ciel n’a rien à cacher.',
      'Ciel bleu toute la journée, jusqu’à {high}. Presque suspect.',
    ],
    grayAllDay: [
      'Gris du début à la fin. Le soleil s’est fait porter pâle.',
      'Cinquante nuances de gris, surtout les ternes. Au moins, c’est sec.',
    ],
    clearingLater: [
      'Début nuageux, mais le soleil perce vers {t}. Ça valait la peine d’attendre.',
      'Les nuages plient bagage vers {t} ; la seconde moitié s’annonce bien meilleure.',
    ],
    cloudingLater: [
      'Soleil au départ, les nuages arrivent vers {t}. Faites le plein de lumière tôt.',
      'Profitez du soleil tant qu’il est là : les nuages prennent le relais vers {t}.',
    ],
    perfectDay: [
      'Journée de manuel : sec, ensoleillé, {high}. Si vous restez enfermé, c’est votre choix.',
      '{high}, soleil, pas de pluie. Franchement, difficile de faire mieux.',
      'Météo haut de gamme : sec, lumineux et {high}. Trouvez une excuse pour sortir.',
    ],

    // Températures
    bigSwing: [
      'De {low} le matin à {high} l’après-midi. Le grand écart thermique du jour.',
      '{low} au réveil, {high} plus tard. Votre veste passera l’après-midi sous le bras.',
    ],
    warm: [
      'Belle chaleur, jusqu’à {high}. Le short est un choix de vie tout à fait valable.',
      'Jusqu’à {high} : assez chaud pour qu’une glace compte comme un déjeuner.',
    ],
    hot: [
      'Chaud : ressenti {feels} entre {start} et {end}. Ombre, eau, on ralentit.',
      'Ressenti {feels} de {start} à {end}. Tout effort : avant ou après.',
    ],
    extremeHeat: [
      'Chaleur extrême, ressenti {feels}. Évitez le soleil entre {start} et {end}, buvez souvent et prenez des nouvelles des personnes fragiles.',
    ],
    tropicalNight: [
      'Nuit tropicale : pas moins de {low}. Dormir va devenir un sport d’endurance.',
      'Seulement {low} au plus frais cette nuit. Ventilateur allumé, couette au placard.',
    ],
    freezingDay: [
      'Sous zéro toute la journée, {high} au mieux. Dehors, c’est à peu près le congélateur.',
      'Pas de dégel en vue : {high} maximum. Les gants ne sont pas une option.',
    ],
    bitterCold: [
      'Froid mordant : ressenti {feels}. Couvrez chaque centimètre de peau.',
      'Ressenti {feels}. Même les pingouins réclameraient une écharpe.',
    ],
    extremeCold: [
      'Froid dangereux, ressenti {feels}. Les gelures peuvent apparaître en quelques minutes : limitez le temps dehors.',
    ],
    windChill: [
      'Le thermomètre dit une chose, le vent dit {feels}. Croyez le vent.',
      'Avec le vent, ressenti {feels}. Capuche de rigueur.',
    ],
    muggy: [
      'Lourd et moite : à midi, vous vous sentirez comme un dim sum à la vapeur.',
      'Assez humide pour nager dans l’air. Tissus respirants, s’il vous plaît.',
    ],
    tempDrop: [
      'Chute brutale vers {t} : environ {diff} de moins en quelques heures. Gardez une veste à portée.',
      'Un front froid débarque vers {t} et fait tomber le thermomètre de {diff}.',
    ],
    eveningChill: [
      'Ça se rafraîchit vite : {low} vers {t}. La veste dont vous n’avez pas besoin maintenant ? Prenez-la.',
      '{low} vers {t}. La soirée impose un autre dress code.',
    ],
    warmForSeason: [
      '{high} ? Pour la saison, c’est presque un cadeau.',
      'Douceur inhabituelle : {high}. La nature a dû perdre le calendrier.',
    ],
    coldForSeason: [
      'Seulement {high}. L’été a appuyé sur « snooze ».',
      '{high} au mieux. Pas très de saison, mais bon.',
    ],
    sunnyButCold: [
      'Grand soleil, {high} maximum : beaucoup d’esbroufe, peu de chaleur.',
      'Ensoleillé mais {high} seulement. Derrière la fenêtre, ça a l’air chaud. Ça ne l’est pas.',
    ],

    // Vent
    breezy: [
      'Brise soutenue, jusqu’à {wind}. Mauvais jour pour la coiffure, bon jour pour le cerf-volant.',
      'Ça souffle un peu, jusqu’à {wind}. Tenez bien votre chapeau.',
    ],
    windy: [
      'Venteux, jusqu’à {wind}. Les parapluies vont se retourner.',
      'Vent jusqu’à {wind}. Attachez ce qui est léger, et votre brushing.',
    ],
    gale: [
      'Vent fort jusqu’à {wind}. Rangez le mobilier de jardin et gare aux chutes de branches.',
      'Rafales jusqu’à {wind}. Pas le jour pour transporter une grande plaque de contreplaqué.',
    ],
    storm: [
      'Vent de tempête jusqu’à {wind}. Éloignez-vous des arbres, des échafaudages et du littoral.',
    ],
    hurricane: [
      'Vents de force ouragan jusqu’à {wind}. Suivez les consignes des autorités locales.',
    ],

    // Exposition
    uvHigh: [
      'UV {uv} vers {t}. Crème solaire, sauf si le look homard vous tente.',
      'L’UV grimpe à {uv} vers {t}. Lunettes de soleil et crème solaire.',
    ],
    uvVeryHigh: [
      'UV très élevé ({uv}) entre {start} et {end}. Crème solaire et ombre, sérieusement.',
      'UV {uv} de {start} à {end} : la peau grille plus vite qu’un toast.',
    ],
    uvExtreme: [
      'UV extrême ({uv}). La peau non protégée brûle en quelques minutes : couvrez-vous et restez à l’ombre à midi.',
    ],
    airPoor: [
      'Qualité de l’air médiocre. Le footing, peut-être en salle aujourd’hui.',
      'L’air n’est pas terrible en ce moment. Poumons sensibles, allez-y doucement.',
    ],
    airVeryPoor: [
      'Qualité de l’air très mauvaise. Limitez les efforts en extérieur, surtout si vous êtes sensible.',
    ],

    // Nuit
    clearNight: [
      'Ciel dégagé cette nuit, jusqu’à {low}. Une belle nuit pour lever les yeux.',
      'Nuit étoilée en vue, {low} au plus frais.',
    ],
    calmNight: [
      'Nuit tranquille, jusqu’à {low}. La météo est en repos.',
      'Rien à signaler cette nuit : {low} au plus frais. Dormez bien.',
    ],
    nightRainAll: [
      'Pluie toute la nuit. Parfait comme bruit de fond pour dormir, moins pour promener le chien.',
      'De la pluie jusqu’au matin. Les gouttières vont faire des heures sup’.',
    ],
    nightRainFrom: [
      'La pluie arrive vers {start} et reste pour la nuit. Rentrez les coussins du salon de jardin.',
      'Sec jusqu’à {start}, puis la pluie tambourine sur les toits toute la nuit.',
    ],
    nightRainUntil: [
      'Pluie jusque vers {end}, puis une fin de nuit au sec.',
      'La pluie va se coucher vers {end}.',
    ],
    nightRainWindow: [
      'Pluie entre {start} et {end}, sec le reste du temps.',
      'Un passage pluvieux de {start} à {end}, puis le calme revient.',
    ],
    nightSnow: [
      'Neige à partir de {start} environ. Réveil tout en blanc possible.',
      'Neige cette nuit dès {start}. Demain matin : carte postale côté fenêtre, patinoire côté route.',
    ],
    nightStorm: [
      'Orages possibles entre {start} et {end}. Débranchez ce qui vous est cher.',
      'Orages entre {start} et {end}. Le chien voudra dormir dans votre lit.',
    ],

    // Demain
    tomorrowColder: [
      'Environ {diff} de moins, {high} au maximum. Ressortez le manteau ce soir.',
      'Le thermomètre perd {diff} : {high} au mieux. Profitez d’aujourd’hui.',
    ],
    tomorrowWarmer: [
      'Environ {diff} de plus, jusqu’à {high}. De quoi se réjouir.',
      'Un bond de {diff}, jusqu’à {high}. Le vous de demain vous dit merci.',
    ],

    // Calme
    calmSunny: [
      'Ensoleillé et sans histoire, de {low} à {high}. La météo prend sa journée.',
      'Tout en douceur : soleil, de {low} à {high}, rien à craindre.',
    ],
    calmCloudy: [
      'Nuageux mais sec, de {low} à {high}. Pas palpitant, pas gênant.',
      'Grisâtre et calme, de {low} à {high}. Une journée parfaitement moyenne, météo parlant.',
    ],
    calmMixed: [
      'Soleil et nuages se relaient, de {low} à {high}. Pas de drame.',
      'Un peu de tout, sauf de la pluie : de {low} à {high}.',
    ],

    // Bonus
    fullMoon: [
      'Pleine lune ce soir sous un ciel dégagé. Loups-garous, vous êtes prévenus.',
      'Pleine lune et ciel clair : la veilleuse de la nature est allumée.',
    ],
    supermoon: ['Super lune ce soir : la Lune est plus proche et plus brillante. Levez les yeux !'],
    newMoonStars: [
      'Nouvelle lune et ciel dégagé : idéal pour les étoiles. Éloignez-vous des lumières de la ville.',
      'Pas de lune, pas de nuages : les étoiles ont la scène pour elles ce soir.',
    ],
    meteors: [
      'Pic des {name} cette nuit : jusqu’à {rate} étoiles filantes par heure. Préparez vos vœux.',
      'Ciel dégagé pour les {name} cette nuit, jusqu’à {rate} météores par heure. Levez les yeux, loin des lumières.',
    ],
    goldenHour: [
      'Heure dorée dès {golden}, coucher du soleil à {sunset}. Photographes, en position.',
      'Ciel dégagé au coucher du soleil ({sunset}). Ça vaut un coup d’œil par la fenêtre vers {golden}.',
    ],
    sunriseClear: ['Lever du soleil à {sunrise} sous un ciel dégagé. Le spectacle est pour les lève-tôt.'],
    midnightSun: ['Le soleil ne se couchera pas aujourd’hui. Les rideaux occultants sont vos meilleurs amis.'],
    polarNight: ['Pas de lever de soleil aujourd’hui : nuit polaire. Vitamine D, bougies et bonne compagnie.'],
    longestDay: ['Jour le plus long de l’année : {daylight} de lumière. Profitez-en (dehors, idéalement).'],
    shortestDay: ['Jour le plus court de l’année : seulement {daylight} de lumière. Dès demain, la lumière contre-attaque.'],
    springEquinox: ['Équinoxe de printemps : le jour et la nuit sont à égalité. À partir d’ici, la lumière gagne.'],
    autumnEquinox: ['Équinoxe d’automne : jour et nuit à égalité. Les nuits l’emportent désormais. Plaids à portée de main.'],
    earlySunset: ['Coucher du soleil à {sunset}. Oui, déjà.', 'Le soleil débauche à {sunset}. Veinard.'],
    lateSunset: ['Coucher du soleil seulement à {sunset} : longue soirée en perspective.'],
    whiteChristmas: ['De la neige à Noël : le vrai de vrai. Qu’on lance la musique.'],
    greenChristmas: ['{high} à Noël. Le père Noël pourrait troquer son traîneau contre une trottinette.'],
    nyeDry: ['Vers minuit : sec, {low}. Parfait pour les feux d’artifice.'],
    nyeWet: ['Pluie possible vers minuit : feux d’artifice sous parapluie, donc.'],
    halloween: ['Halloween avec ce temps-là ? L’ambiance lugubre est offerte par la maison.'],
  },

  tips: {
    umbrella: [
      'Parapluie : oui. Chaussures en daim : non.',
      'Prenez un parapluie. Le vous de ce soir vous remerciera.',
      'Parapluie dans le sac. C’est plus léger que les regrets.',
    ],
    raincoat: [
      'Pluie + vent = parapluie condamné. Optez pour un imperméable à capuche.',
      'Trop de vent pour un parapluie : une veste à capuche fera mieux le travail.',
    ],
    snowBoots: ['Bonnes chaussures aujourd’hui : l’adhérence avant le style.', 'Des chaussures qui accrochent, et partez un peu plus tôt.'],
    snowman: ['De la neige et pas de boulot : c’est l’heure du bonhomme de neige. Carotte non fournie.'],
    layers: [
      'Des couches : vous les enlèverez l’après-midi et les remettrez le soir.',
      'Habillez-vous comme un oignon : plusieurs couches, amovibles une par une.',
    ],
    sunscreen: [
      'Crème solaire, même si ce n’est pas un jour de plage. Surtout sur le nez.',
      'Crème et lunettes de soleil. Votre peau vous remerciera dans 20 ans.',
    ],
    scrape: [
      'Partez 5 minutes plus tôt pour gratter le pare-brise.',
      'Grattoir à portée de main. L’eau chaude sur le pare-brise : jamais.',
    ],
    hydrate: [
      'Gourde obligatoire. Le café ne compte pas.',
      'Buvez avant d’avoir soif et restez à l’ombre aux heures chaudes.',
    ],
    bundleUp: ['Bonnet, gants, écharpe : la panoplie complète.', 'Couvrez-vous bien. Puis ajoutez une couche.'],
    laundry: [
      'Temps idéal pour le linge : soleil, brise, pas de pluie. Le sèche-linge peut prendre congé.',
      'Étendez le linge, il séchera en un temps record.',
    ],
    terrace: [
      'Soirée douce en vue : terrasse, barbecue ou pique-nique, à vous de choisir.',
      'Une soirée faite pour manger dehors. Je dis ça, je dis rien.',
    ],
    mosquitoes: ['Soirée chaude et moite : les moustiques sont sur la liste des invités. Répulsif conseillé.'],
    noCarWash: ['Vous comptiez laver la voiture ? La pluie de demain s’en charge gratuitement.'],
    stayIn: [
      'Restez à l’intérieur si possible, chargez votre téléphone et gardez une lampe torche à portée.',
      'Reportez tout déplacement non essentiel et gardez votre téléphone chargé.',
    ],
    secureObjects: ['Attachez ou rentrez tout ce qui peut s’envoler : poubelles, trampolines, chaises de jardin.'],
    extraTime: ['Prévoyez plus de temps pour vos trajets et marchez prudemment.', 'Levez le pied sur la route et prévoyez de la marge.'],
    jacketEvening: ['Prenez une veste pour ce soir, même si ça paraît absurde maintenant.'],
  },

  meteorNames: {
    quadrantids: 'Quadrantides',
    lyrids: 'Lyrides',
    etaAquariids: 'Êta Aquarides',
    perseids: 'Perséides',
    orionids: 'Orionides',
    leonids: 'Léonides',
    geminids: 'Géminides',
  },
};
