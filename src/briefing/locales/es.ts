import type { PhraseBank } from '../types';

/**
 * Hours and clock times carry their own article ("las 14:00", "la 1:00",
 * "medianoche", "mediodía"), so templates write "a {start}", "hacia {t}",
 * "desde {start}", "hasta {end}", "entre {start} y {end}", "de {start} a {end}"
 * and every hour reads correctly, including "la una" and noon/midnight.
 */
const hour = (h: number): string => {
  if (h === 0) return 'medianoche';
  if (h === 12) return 'mediodía';
  return `${h === 1 ? 'la' : 'las'} ${h}:00`;
};
const time = (h: number, m: number): string => `${h === 1 ? 'la' : 'las'} ${h}:${String(m).padStart(2, '0')}`;
const duration = (min: number): string => `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')} min`;

export const es: PhraseBank = {
  title: 'Tu día en breve',
  labels: {
    today: 'Hoy',
    tonight: 'Esta noche',
    tomorrow: 'Mañana',
    laterToday: 'Al despertar',
  },
  hour,
  time,
  duration,

  greetings: {
    earlyBird: ['¿En pie antes que el sol? Respeto.', 'A quien madruga, el pronóstico le avisa.'],
    morning: [
      '¡Buenos días! Tu día, en pocas palabras.',
      '¡Buenos días! Primero el café, luego esto.',
      'Buenos días. El cielo tiene planes para ti.',
    ],
    midday: ['Parada técnica de mediodía.', 'Medio día hecho. Aquí va el resto.'],
    afternoon: ['¡Buenas tardes! Esto es lo que queda del día.', 'El informe de la tarde ya está aquí.'],
    evening: ['¡Buenas! Esta noche y mañana, en resumen.', 'El boletín de la noche, recién salido del horno.'],
    late: ['¿Consulta de última hora? Aquí van la noche y mañana.', 'Un último vistazo antes de dormir.'],
    nightOwl: [
      '¿Todavía en pie? El tiempo ya duerme, y tú deberías hacer lo mismo.',
      'Modo búho activado. Esto es lo que se viene.',
    ],
    firstWorkday: [
      'Lunes. Vamos a superarlo juntos.',
      'Lunes por la mañana. Respira hondo.',
      'Lunes: hoy el café va a trabajar más que tú.',
    ],
    midweek: ['Miércoles: ya pasamos el ecuador.', 'Miércoles. Desde aquí, todo cuesta abajo.'],
    lastWorkday: ['¡Viernes! El fin de semana ya asoma por el horizonte.', 'Es viernes. Lo lograste (casi).'],
    lastWorkdayEvening: ['¡Viernes por la noche! Aquí va el adelanto del fin de semana.', 'Arranca el fin de semana. Y el pronóstico también.'],
    weekend: ['¡Por fin es {day}! Hoy no manda el despertador.', 'Modo fin de semana: activado.'],
    weekendEnd: ['Domingo por la noche. El pronóstico de mañana, con suavidad.', 'El fin de semana se despide. Esto es lo que viene.'],
    newYear: ['¡Feliz Año Nuevo! El primer pronóstico del año.'],
    newYearsEve: ['¡Último día del año! Aquí va el pronóstico final. Las uvas corren por tu cuenta.'],
    christmas: ['¡Feliz Navidad! Tu pronóstico, envuelto para regalo.'],
    halloween: ['¡Feliz Halloween! Este pronóstico es trato, no truco.'],
    friday13: ['Viernes 13. Tranquilidad: en español, el día de la mala suerte es el martes.'],
    aprilFools: ['1 de abril. Aquí los Inocentes son en diciembre, así que este pronóstico va en serio.'],
    valentine: ['¡Feliz San Valentín! El tiempo, con cariño.'],
    alert: ['Atención: se acerca mal tiempo.', 'Importante: el tiempo requiere tu atención.'],
  },

  lines: {
    // Lluvia
    rainAllDay: [
      'Lluvia de principio a fin. El cielo tiene mucho que soltar.',
      'Llueve, llueve y vuelve a llover: casi sin tregua.',
      'Uno de esos días en que la lluvia ni finge que va a parar.',
    ],
    rainLater: [
      'Seco hasta {start}; después, lluvia el resto del día.',
      '¿Recados? Antes de {start}: después la lluvia se instala para quedarse.',
      'Aprovecha lo seco: la lluvia entra a trabajar hacia {start} y hace horas extra.',
    ],
    rainStops: [
      'Empieza mojado, pero escampa hacia {end}. La paciencia tiene premio.',
      'La lluvia hace las maletas hacia {end}. Aguanta.',
      'Lluvia hasta {end}; luego el cielo se calma.',
    ],
    rainWindow: [
      'Chubascos entre {start} y {end}, seco antes y después. Todo es cuestión de elegir el momento.',
      'Lluvia agendada de {start} a {end}. El resto, seco.',
      'Ventana mojada de {start} a {end}: organiza tus salidas alrededor.',
    ],
    rainBrief: [
      'Un chaparrón rápido hacia {t}. Si parpadeas, te lo pierdes… salvo que estés en la calle.',
      'Un chubasco corto hacia {t} y a otra cosa, mariposa.',
    ],
    rainOnOff: [
      'Chubascos intermitentes. El cielo no se decide.',
      'Los chubascos entran y salen como Pedro por su casa.',
      'Chubascos a ratos. Lleva paraguas y protector solar, y no te fíes de ninguno.',
    ],
    showersPossible: [
      'Podría caer un chubasco entre {start} y {end}. Podría.',
      'Algo de probabilidad de lluvia entre {start} y {end}. Una moneda al aire, vaya.',
    ],
    rainCommuteAM: [
      'Lluvia hacia {start}, justo a la hora de ir al trabajo. Cómo no.',
      'La lluvia llega hacia {start}, justo a tiempo para acompañarte al trabajo.',
    ],
    rainCommutePM: [
      'La lluvia llega hacia {start}, perfectamente sincronizada con la vuelta a casa.',
      'Seco todo el día, mojado para volver: lluvia desde {start}.',
    ],
    drizzle: [
      'Llovizna entre {start} y {end}: no llega a lluvia, pero sí a molestar.',
      'Llovizna fina de {start} a {end}. Tu pelo se enterará antes que tú.',
    ],
    downpour: [
      'Posible aguacero hacia {t}. No es momento para pasear.',
      'Hacia {t} va a llover a cántaros. Mejor bajo techo.',
    ],
    thunder: [
      'Posibles tormentas entre {start} y {end}. Si truena, bajo techo.',
      'Tormentas de {start} a {end}: rayos, truenos, el paquete completo. Evita los espacios abiertos.',
    ],
    thunderSnow: [
      'Nevada con tormenta eléctrica hacia {start}: nieve Y rayos. Raro, curioso y bastante espectacular.',
    ],

    // Invierno
    snowLight: [
      'Algunos copos entre {start} y {end}. Bonito, poco más.',
      'Nevada ligera de {start} a {end}: modo postal, no modo pala.',
    ],
    snow: [
      'Nieve de {start} a {end}. Carreteras resbaladizas: con calma.',
      'Nieva entre {start} y {end}. El chocolate caliente queda oficialmente justificado.',
    ],
    snowHeavy: [
      'Nevadas intensas entre {start} y {end}. Desplazamientos difíciles: sal solo si es necesario.',
      'Mucha nieve prevista de {start} a {end}. Espera retrasos y carreteras resbaladizas.',
    ],
    blizzard: [
      'Ventisca desde {start} aproximadamente: nieve intensa y viento fuerte. Quédate a resguardo si puedes.',
    ],
    slush: [
      'Nieve húmeda desde {start}, que acaba convertida en barro helado. Lo peor de ambos mundos.',
      'Nieve indecisa desde {start}. Calzado impermeable, por favor.',
    ],
    sleet: [
      'Aguanieve entre {start} y {end}: lluvia que no supo decidir si ser nieve.',
      'Aguanieve de {start} a {end}. Frío, mojado y de lado: combo completo.',
    ],
    freezingRain: [
      'Lluvia helada desde {start}: calles y aceras pueden convertirse en pistas de hielo. Evita desplazarte si puedes.',
      'Lluvia helada hacia {start}. Cualquier superficie puede congelarse: extrema la precaución.',
    ],

    // Hielo y niebla
    blackIce: [
      'Placas de hielo probables hacia {t}. Camina como un pingüino y ve al volante como tu abuela.',
      'Suelo mojado y aire helado: ojo con el hielo hacia {t}.',
    ],
    frost: [
      'Amanecer helado, {low}. Rasquetas, a sus puestos.',
      'Mínima de {low} de madrugada: escarcha en el parabrisas, en el césped y quizá en tu humor.',
    ],
    fogMorning: [
      'Niebla hasta {end}. Luces encendidas, paciencia también.',
      'Sopa de niebla hasta {end}. Las vistas vuelven luego, prometido.',
    ],
    fogTonight: [
      'Se forma niebla hacia {start}. Ve despacio y con las luces encendidas.',
      'Niebla hacia {start}. Muy cinematográfica, fatal para la visibilidad.',
    ],
    freezingFog: [
      'Niebla helada hasta {end}: poca visibilidad y superficies resbaladizas. Precaución en la carretera.',
    ],

    // Cielo
    sunnyAllDay: [
      'Sol de la mañana a la noche, hasta {high}. El cielo no tiene nada que esconder.',
      'Cielo azul todo el día, hasta {high}. Sospechosamente bonito.',
    ],
    grayAllDay: [
      'Gris de principio a fin. El sol se ha pedido el día.',
      'Cincuenta sombras de gris, casi todas aburridas. Al menos no llueve.',
    ],
    clearingLater: [
      'Empieza nublado, pero el sol asoma hacia {t}. Vale la pena esperar.',
      'Las nubes recogen sus cosas hacia {t}; la segunda mitad pinta mucho mejor.',
    ],
    cloudingLater: [
      'Arranca soleado; las nubes llegan hacia {t}. Toma el sol temprano.',
      'Disfruta del sol mientras dure: las nubes toman el relevo hacia {t}.',
    ],
    perfectDay: [
      'Día de manual: seco, soleado y {high}. Si te quedas en casa, es cosa tuya.',
      '{high}, sol y cero lluvia. Sinceramente, difícil mejorarlo.',
      'Tiempo de primera: seco, luminoso y {high}. Búscate una excusa para salir.',
    ],

    // Temperatura
    bigSwing: [
      'De {low} por la mañana a {high} por la tarde. Vístete como una cebolla.',
      '{low} temprano, {high} después. Tu chaqueta pasará la tarde en la mano.',
    ],
    warm: [
      'Día cálido, hasta {high}. Los shorts son una decisión de vida perfectamente válida.',
      'Hasta {high}: suficiente para que un helado cuente como plato principal.',
    ],
    hot: [
      'Calor: sensación de {feels} entre {start} y {end}. Sombra, agua y sin prisas.',
      'Sensación de {feels} de {start} a {end}. Cualquier esfuerzo, mejor antes o después.',
    ],
    extremeHeat: [
      'Calor extremo, con sensación de {feels}. Evita el sol entre {start} y {end}, bebe a menudo y cuida a las personas vulnerables.',
    ],
    tropicalNight: [
      'Noche tropical: no bajará de {low}. Dormir será un deporte de resistencia.',
      'Mínima de {low} esta noche. Ventilador encendido, manta fuera.',
    ],
    freezingDay: [
      'Bajo cero todo el día, {high} como mucho. La calle es básicamente un congelador.',
      'Ni rastro de deshielo: {high} como máximo. Los guantes no son opcionales.',
    ],
    bitterCold: [
      'Frío intenso: sensación de {feels}. Tapa toda la piel que puedas.',
      'Sensación de {feels}. Hasta los pingüinos pedirían bufanda.',
    ],
    extremeCold: [
      'Frío peligroso, con sensación de {feels}. La congelación puede aparecer en minutos: limita el tiempo al aire libre.',
    ],
    windChill: [
      'El termómetro dice una cosa; el viento dice {feels}. Hazle caso al viento.',
      'Con el viento, la sensación es de {feels}. Capucha puesta.',
    ],
    muggy: [
      'Bochorno pegajoso: a mediodía, el aire será una sauna gratis.',
      'Tanta humedad que se podría nadar en el aire. Ropa transpirable, por favor.',
    ],
    tempDrop: [
      'Bajón brusco hacia {t}: unos {diff} menos en pocas horas. Ten una chaqueta a mano.',
      'Un frente frío irrumpe hacia {t} y se lleva {diff} por delante.',
    ],
    eveningChill: [
      'Refresca rápido: {low} hacia {t}. ¿Esa chaqueta que ahora no necesitas? Llévala.',
      '{low} hacia {t}. La noche tiene otro código de vestimenta.',
    ],
    warmForSeason: [
      '¿{high}? Para esta época, es casi un regalo.',
      'Inusualmente templado: {high}. La naturaleza parece haber perdido el calendario.',
    ],
    coldForSeason: [
      'Solo {high}. El buen tiempo le ha dado al botón de posponer.',
      '{high} como mucho. Poco propio de la época, pero es lo que hay.',
    ],
    sunnyButCold: [
      'Mucho sol, {high} como máximo: todo fachada, cero calor.',
      'Soleado, pero solo {high}. Desde la ventana parece verano. Spoiler: no lo es.',
    ],

    // Viento
    breezy: [
      'Brisa animada, hasta {wind}. Mal día para el peinado, buen día para la cometa.',
      'Sopla con ganas, hasta {wind}. Sujeta el sombrero.',
    ],
    windy: [
      'Ventoso, hasta {wind}. Los paraguas se van a dar la vuelta.',
      'Viento de hasta {wind}. Asegura lo ligero, y tu peinado.',
    ],
    gale: [
      'Viento fuerte de hasta {wind}. Recoge los muebles de jardín y cuidado con las ramas que caen.',
      'Rachas de hasta {wind}. No es día para cargar un tablero de madera grande.',
    ],
    storm: [
      'Viento de temporal de hasta {wind}. Aléjate de los árboles, los andamios y la costa.',
    ],
    hurricane: [
      'Vientos huracanados de hasta {wind}. Sigue las indicaciones de las autoridades locales.',
    ],

    // Exposición
    uvHigh: [
      'UV {uv} hacia {t}. Protector solar, salvo que el look tomate te tiente.',
      'El UV llega a {uv} hacia {t}. Sombrero y protector solar.',
    ],
    uvVeryHigh: [
      'UV muy alto ({uv}) entre {start} y {end}. Protector solar y sombra, en serio.',
      'UV {uv} de {start} a {end}: la piel se tuesta más rápido que el pan.',
    ],
    uvExtreme: [
      'UV extremo ({uv}). La piel sin protección se quema en minutos: cúbrete y busca sombra al mediodía.',
    ],
    airPoor: [
      'La calidad del aire es mala. Quizá hoy toca correr en interiores.',
      'El aire no anda muy bien ahora. Si tus pulmones son sensibles, tómatelo con calma.',
    ],
    airVeryPoor: [
      'Calidad del aire muy mala. Limita el esfuerzo al aire libre, sobre todo si eres sensible.',
    ],

    // Noche
    clearNight: [
      'Cielo despejado esta noche, mínima de {low}. Buena noche para mirar arriba.',
      'Noche estrellada por delante, {low} en el momento más frío.',
    ],
    calmNight: [
      'Noche tranquila, mínima de {low}. El tiempo se toma la noche libre.',
      'Nada que reportar esta noche: {low} como mínimo. Que descanses.',
    ],
    nightRainAll: [
      'Lluvia toda la noche. Banda sonora perfecta para dormir; mala noche para pasear al perro.',
      'Lluvia hasta la mañana. Los canalones van a hacer horas extra.',
    ],
    nightRainFrom: [
      'La lluvia llega hacia {start} y se queda a dormir. Mete los cojines de la terraza.',
      'Seco hasta {start}; luego, lluvia sobre los tejados toda la noche.',
    ],
    nightRainUntil: [
      'Lluvia hasta {end}; después, el resto de la noche seco.',
      'La lluvia se va a dormir hacia {end}.',
    ],
    nightRainWindow: [
      'Lluvia entre {start} y {end}; seco el resto.',
      'Un rato de lluvia de {start} a {end}, y vuelve la calma.',
    ],
    nightSnow: [
      'Nieve desde {start}. Puede que despiertes en un mundo blanco.',
      'Nieve esta noche desde {start}. Mañana: postal en la ventana, pista de patinaje en la carretera.',
    ],
    nightStorm: [
      'Posibles tormentas entre {start} y {end}. Desenchufa lo que más quieras.',
      'Tormentas entre {start} y {end}. El perro querrá dormir en tu cama.',
    ],

    // Mañana
    tomorrowColder: [
      'Unos {diff} menos, con máxima de {high}. Saca el abrigo esta noche.',
      'Las temperaturas bajan {diff}: {high} como mucho. Disfruta de hoy mientras dure.',
    ],
    tomorrowWarmer: [
      'Unos {diff} más, hasta {high}. Algo que esperar con ganas.',
      'Un salto de {diff}, hasta {high}. Tu yo de mañana te lo agradece.',
    ],

    // Calma
    calmSunny: [
      'Soleado y sin sobresaltos, de {low} a {high}. El tiempo se toma el día libre.',
      'Todo tranquilo: sol, de {low} a {high}, nada de qué preocuparse.',
    ],
    calmCloudy: [
      'Nublado pero seco, de {low} a {high}. Ni emocionante ni problemático.',
      'Grisáceo y tranquilo, de {low} a {high}. Un día perfectamente normalito.',
    ],
    calmMixed: [
      'Sol y nubes se turnan, de {low} a {high}. Sin dramas.',
      'Un poco de todo menos lluvia: de {low} a {high}.',
    ],

    // Extras
    fullMoon: [
      'Luna llena esta noche con cielo despejado. Aviso para hombres lobo.',
      'Luna llena y cielo despejado: la lamparita de la naturaleza está encendida.',
    ],
    supermoon: ['Superluna esta noche: la Luna está más cerca y brilla más. ¡Mira arriba!'],
    newMoonStars: [
      'Luna nueva y cielo despejado: noche ideal para ver estrellas. Aléjate de las luces de la ciudad.',
      'Sin luna y sin nubes: esta noche las estrellas tienen el escenario para ellas solas.',
    ],
    meteors: [
      'Las {name} alcanzan su pico esta noche: hasta {rate} estrellas fugaces por hora. Ten tus deseos preparados.',
      'Cielo despejado para las {name} esta noche, hasta {rate} meteoros por hora. Mira arriba, lejos de las luces.',
    ],
    goldenHour: [
      'Hora dorada desde {golden}, puesta de sol a {sunset}. Fotógrafos, a sus puestos.',
      'Atardecer despejado a {sunset}. Merece la pena asomarse a la ventana hacia {golden}.',
    ],
    sunriseClear: ['Amanece a {sunrise} con cielo despejado. El espectáculo es para los madrugadores.'],
    midnightSun: ['Hoy el sol no se pone. Las cortinas opacas son tus mejores amigas.'],
    polarNight: ['Hoy no sale el sol: noche polar. Vitamina D, velas y buena compañía.'],
    longestDay: ['El día más largo del año: {daylight} de luz. Aprovéchalo (al aire libre, a ser posible).'],
    shortestDay: ['El día más corto del año: solo {daylight} de luz. Desde mañana, la luz contraataca.'],
    springEquinox: ['Equinoccio de primavera: el día y la noche empatan. A partir de ahora, gana la luz.'],
    autumnEquinox: ['Equinoccio de otoño: día y noche empatados. A partir de aquí ganan las noches. Mantas a mano.'],
    earlySunset: ['El sol se pone a {sunset}. Sí, ya.', 'El sol termina su jornada a {sunset}. Qué suerte tiene.'],
    lateSunset: ['El sol no se pone hasta {sunset}: tarde larga por delante.'],
    whiteChristmas: ['Nieve en Navidad: de la de verdad. Que suenen los villancicos.'],
    greenChristmas: ['{high} en Navidad. Papá Noel podría cambiar las botas por chanclas.'],
    nyeDry: ['Hacia medianoche: seco, {low}. Perfecto para los fuegos artificiales (y las uvas).'],
    nyeWet: ['Posible lluvia hacia medianoche: toca brindar bajo el paraguas.'],
    halloween: ['¿Halloween con este tiempo? El ambiente tenebroso corre por cuenta de la casa.'],
  },

  tips: {
    umbrella: [
      'Paraguas: sí. Zapatos de gamuza: no.',
      'Lleva paraguas. Tu yo del futuro te lo agradecerá.',
      'Paraguas en la mochila. Pesa menos que el arrepentimiento.',
    ],
    raincoat: [
      'Lluvia más viento: el paraguas no tiene nada que hacer. Mejor un impermeable con capucha.',
      'Demasiado viento para el paraguas: una chaqueta con capucha hará mejor papel.',
    ],
    snowBoots: ['Hoy, calzado como es debido: agarre antes que estilo.', 'Botas con buen agarre, y sal un poco antes.'],
    snowman: ['Nieve y sin trabajo: hora del muñeco de nieve. Zanahoria no incluida.'],
    layers: [
      'Capas: te las quitarás por la tarde y te las volverás a poner por la noche.',
      'Vístete por capas, estilo cebolla: se quitan una a una.',
    ],
    sunscreen: [
      'Protector solar, aunque no sea día de playa. Sobre todo en la nariz.',
      'Protector y sombrero. Tu piel te lo agradecerá dentro de 20 años.',
    ],
    scrape: [
      'Sal 5 minutos antes para quitar el hielo del parabrisas.',
      'Rasqueta a mano. ¿Agua caliente en el parabrisas? Jamás.',
    ],
    hydrate: [
      'Botella de agua obligatoria. El café no cuenta.',
      'Bebe antes de tener sed y quédate a la sombra en las horas centrales.',
    ],
    bundleUp: ['Gorro, guantes y bufanda: el equipo completo.', 'Abrígate bien. Y luego añade una capa más.'],
    laundry: [
      'Tiempo perfecto para tender: sol, brisa y nada de lluvia. La secadora puede tomarse el día libre.',
      'Tiende la ropa: se secará en tiempo récord.',
    ],
    terrace: [
      'Noche templada por delante: terraza, barbacoa o pícnic, tú eliges.',
      'Una noche hecha para cenar fuera. Ahí lo dejo.',
    ],
    mosquitoes: ['Noche cálida y húmeda: los mosquitos están en la lista de invitados. Repelente recomendado.'],
    noCarWash: ['¿Ibas a lavar el coche? La lluvia de mañana lo hará gratis.'],
    stayIn: [
      'Quédate en casa si puedes, carga el teléfono y ten una linterna a mano.',
      'Aplaza los desplazamientos que no sean imprescindibles y ten el teléfono cargado.',
    ],
    secureObjects: ['Asegura o guarda todo lo que pueda salir volando: macetas, camas elásticas, sillas de jardín.'],
    extraTime: ['Calcula más tiempo para tus desplazamientos y camina con cuidado.', 'Reduce la velocidad al volante y date margen.'],
    jacketEvening: ['Lleva una chaqueta para la noche, aunque ahora parezca absurdo.'],
  },

  meteorNames: {
    quadrantids: 'Cuadrántidas',
    lyrids: 'Líridas',
    etaAquariids: 'Eta Acuáridas',
    perseids: 'Perseidas',
    orionids: 'Oriónidas',
    leonids: 'Leónidas',
    geminids: 'Gemínidas',
  },
};
