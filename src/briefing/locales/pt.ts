import type { PhraseBank } from '../types';

/**
 * Hours and clock times carry their own "at" preposition with the right crase
 * ("às 14h", "à 1h", "à meia-noite", "ao meio-dia", "às 19h42"), so the
 * singular/feminine/masculine cases can never be mis-contracted by a template.
 * In exchange, templates only drop {start}/{end}/{t}/{sunset}… into "at" slots:
 * "a chuva chega {start}", "para {end}", "{t}, mais ou menos" — never after
 * "entre", "até", "desde" or "a partir de".
 */
const hour = (h: number): string => {
  if (h === 0) return 'à meia-noite';
  if (h === 12) return 'ao meio-dia';
  return h === 1 ? 'à 1h' : `às ${h}h`;
};
const time = (h: number, m: number): string =>
  `${h <= 1 ? 'à' : 'às'} ${h}h${String(m).padStart(2, '0')}`;
const duration = (min: number): string => `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')} min`;

export const pt: PhraseBank = {
  title: 'Seu dia em resumo',
  labels: {
    today: 'Hoje',
    tonight: 'Esta noite',
    tomorrow: 'Amanhã',
    laterToday: 'Ao acordar',
  },
  hour,
  time,
  duration,

  greetings: {
    earlyBird: ['De pé antes do sol? Respeito.', 'Madrugou! Deus ajuda, e a previsão também.'],
    morning: [
      'Bom dia! Seu dia em poucas palavras.',
      'Bom dia! Primeiro o cafezinho, depois isto aqui.',
      'Bom dia. O céu tem planos para você.',
    ],
    midday: ['Hora do almoço, previsão na mesa.', 'Metade do dia já foi. Aí vai o resto.'],
    afternoon: ['Boa tarde! Veja o que resta do dia.', 'Chegou o boletim da tarde.'],
    evening: ['Boa noite! A noite e o amanhã, em resumo.', 'Boletim da noite, servido quentinho.'],
    late: ['Olhadinha de última hora? Aí vão a noite e o amanhã.', 'Uma última espiada antes de dormir.'],
    nightOwl: [
      'Ainda de pé? O tempo já foi dormir, e você deveria ir também.',
      'Coruja detectada. Veja o que vem por aí.',
    ],
    firstWorkday: [
      'Segunda-feira. Vamos juntos nessa.',
      'Segunda de manhã. Respira fundo.',
      'Segunda-feira: hoje o café vai trabalhar mais que você.',
    ],
    midweek: ['Quarta-feira: metade do caminho.', 'Quarta! Daqui para frente é ladeira abaixo.'],
    lastWorkday: ['Sextou! O fim de semana está logo ali.', 'É sexta. Você chegou lá (quase).'],
    lastWorkdayEvening: ['Sexta à noite! Aí vai a prévia do fim de semana.', 'O fim de semana começou. A previsão também.'],
    weekend: ['Enfim, {day}! Hoje quem manda não é o despertador.', 'Modo fim de semana: ativado.'],
    weekendEnd: [
      'Domingo à noite. A previsão de amanhã, com jeitinho.',
      'O fim de semana está acabando. Veja o que vem por aí.',
    ],
    newYear: ['Feliz Ano Novo! A primeira previsão do ano.'],
    newYearsEve: ['Último dia do ano! Aí vai a previsão final. A roupa branca fica por sua conta.'],
    christmas: ['Feliz Natal! Sua previsão, embrulhada para presente.'],
    halloween: ['Feliz Halloween! A previsão é gostosura, não travessura.'],
    friday13: ['Sexta-feira 13. Leia a previsão… se tiver coragem.'],
    aprilFools: ['1º de abril. Esta previsão não é mentira. Provavelmente.'],
    valentine: ['Dia de São Valentim! Aqui o Dia dos Namorados é em junho, mas a previsão vem com carinho mesmo assim.'],
    alert: ['Atenção: tempo severo a caminho.', 'Importante: o tempo pede a sua atenção.'],
  },

  lines: {
    // Chuva
    rainAllDay: [
      'Chuva do começo ao fim. O céu tem muito o que desabafar.',
      'Molhado, mais molhado, encharcado: a chuva quase não dá trégua.',
      'Um daqueles dias em que a chuva nem finge que vai parar.',
    ],
    rainLater: [
      'Seco por enquanto: a chuva chega {start} e fica até o fim do dia.',
      'Coisas para resolver na rua? Vá cedo: a chuva chega {start} para ficar.',
      'Aproveite o tempo seco: a chuva bate o ponto {start} e faz hora extra.',
    ],
    rainStops: [
      'Começo molhado, mas a chuva vai embora {end}. A paciência compensa.',
      'A chuva faz as malas {end}. Aguenta firme.',
      'Chove no começo, mas a chuva para {end} e o céu se acalma.',
    ],
    rainWindow: [
      'Pancadas de chuva: começam {start} e terminam {end}. Seco antes e depois; tudo é questão de timing.',
      'A chuva tem hora marcada: começa {start}, termina {end}. O resto é seco.',
      'Janela molhada: abre {start}, fecha {end}. Planeje seus passeios em volta dela.',
    ],
    rainBrief: [
      'Uma pancada rápida {t}, mais ou menos. Piscou, passou, a não ser que você esteja na rua.',
      'Uma chuva rápida {t}, por aí, e vida que segue.',
    ],
    rainOnOff: [
      'Chuva no vai e vem. O céu não consegue se decidir.',
      'As pancadas vão e voltam como gato na porta: entra, sai, entra, sai.',
      'Chuva aqui e ali. Leve óculos escuros e guarda-chuva, e não confie em nenhum dos dois.',
    ],
    showersPossible: [
      'Pode cair uma chuvinha: a janela abre {start} e fecha {end}. Pode.',
      'Chuva? Talvez. A chance começa {start} e acaba {end}. Cara ou coroa.',
    ],
    rainCommuteAM: [
      'Chuva {start}, bem na hora de ir para o trabalho. Claro.',
      'A chuva aparece {start}, bem a tempo de fazer companhia no caminho para o trabalho.',
    ],
    rainCommutePM: [
      'A chuva chega {start}, perfeitamente sincronizada com a volta para casa.',
      'Seco o dia todo, molhado na volta: a chuva começa {start}.',
    ],
    drizzle: [
      'Garoa: começa {start} e vai embora {end}. Não chega a ser chuva, mas incomoda.',
      'Garoa fina, que começa {start} e para {end}. Seu cabelo vai perceber antes de você.',
    ],
    downpour: [
      'Possível pé-d’água {t}, mais ou menos. Não é hora de passear.',
      'O céu vira o balde {t}, por aí. Procure abrigo se puder.',
    ],
    thunder: [
      'Possibilidade de trovoadas: começam {start}, terminam {end}. Trovejou? Para dentro.',
      'Temporal se armando: começa {start} e se despede {end}. Raios, trovões, o pacote completo. Evite áreas abertas.',
    ],
    thunderSnow: [
      'Neve com trovoada {start}, mais ou menos: neve E raios. Raro, estranho e meio espetacular.',
    ],

    // Inverno
    snowLight: [
      'Alguns flocos: começam {start}, param {end}. Bonito, e só.',
      'Neve fraca, que começa {start} e para {end}: modo cartão-postal, não modo pá.',
    ],
    snow: [
      'A neve começa {start} e para {end}. As ruas ficam escorregadias: vá com calma.',
      'Neve chegando {start} e ficando até parar, {end}. O chocolate quente está oficialmente liberado.',
    ],
    snowHeavy: [
      'Neve forte, começando {start} e terminando {end}. Deslocamentos difíceis: saia só se for necessário.',
      'Muita neve prevista: começa {start} e termina {end}. Conte com atrasos e ruas escorregadias.',
    ],
    blizzard: [
      'Nevasca começando {start}, aproximadamente: neve forte e vento intenso. Fique em local abrigado se puder.',
    ],
    slush: [
      'Neve molhada começando {start}, que vira lama gelada. O pior dos dois mundos.',
      'Uma neve que não se decide, começando {start}. Sapatos impermeáveis, por favor.',
    ],
    sleet: [
      'Chuva com neve: começa {start} e para {end}. Chuva que não soube se queria ser neve.',
      'Chuva com neve, que começa {start} e termina {end}. Fria, molhada e de lado: combo completo.',
    ],
    freezingRain: [
      'Chuva congelante começando {start}: ruas e calçadas podem virar pista de gelo. Evite se deslocar se puder.',
      'Chuva congelante {start}, aproximadamente. Qualquer superfície pode congelar: redobre o cuidado.',
    ],

    // Gelo e neblina
    blackIce: [
      'Gelo na pista provável {t}, mais ou menos. Ande como pinguim, dirija como sua avó.',
      'Chão molhado e ar congelante: cuidado com gelo invisível {t}, por aí.',
    ],
    frost: [
      'Manhã de geada, {low}. Raspadores, a postos.',
      'Mínima de {low} de madrugada: geada nos carros, na grama e talvez no seu humor.',
    ],
    fogMorning: [
      'Neblina que só se dissipa {end}. Farol baixo ligado, paciência também.',
      'Sopa de neblina: a vista só volta {end}, prometido.',
    ],
    fogTonight: [
      'A neblina se forma {start}. Dirija devagar e com farol baixo.',
      'A neblina chega {start}. Muito cinematográfica, péssima para a visibilidade.',
    ],
    freezingFog: [
      'Nevoeiro congelante que só se dissipa {end}: pouca visibilidade e superfícies escorregadias. Cuidado na estrada.',
    ],

    // Céu
    sunnyAllDay: [
      'Sol de manhã à noite, até {high}. O céu não tem nada a esconder.',
      'Céu azul o dia todo, até {high}. Bonito até demais.',
    ],
    grayAllDay: [
      'Cinza do começo ao fim. O sol pegou atestado.',
      'Cinquenta tons de cinza, quase todos sem graça. Pelo menos não chove.',
    ],
    clearingLater: [
      'Começo nublado, mas o sol aparece {t}, por aí. Vale a espera.',
      'As nuvens juntam as coisas e vão embora {t}; a segunda metade promete.',
    ],
    cloudingLater: [
      'Começa ensolarado; as nuvens chegam {t}, mais ou menos. Pegue seu sol cedo.',
      'Aproveite o sol enquanto dura: as nuvens assumem {t}.',
    ],
    perfectDay: [
      'Dia de manual: seco, ensolarado, {high}. Se ficar em casa, é por sua conta.',
      '{high}, sol e nada de chuva. Sinceramente, não tem como melhorar.',
      'Tempo de primeira: seco, claro e {high}. Arrume uma desculpa para sair.',
    ],

    // Temperatura
    bigSwing: [
      'De {low} de manhã a {high} à tarde. Vista-se como uma cebola.',
      '{low} cedo, {high} depois. Seu casaco vai passar a tarde na mão.',
    ],
    warm: [
      'Dia quente, até {high}. Bermuda é uma escolha de vida perfeitamente válida.',
      'Até {high}: quente o bastante para um sorvete contar como almoço.',
    ],
    hot: [
      'Calorão: sensação de {feels}. O pico começa {start} e só alivia {end}. Sombra e água fresca.',
      'Sensação de {feels}: o forno liga {start} e desliga {end}. Esforço, só antes ou depois.',
    ],
    extremeHeat: [
      'Calor extremo, sensação de {feels}. Evite o sol: o período crítico começa {start} e termina {end}. Beba água sempre e cuide dos mais vulneráveis.',
    ],
    tropicalNight: [
      'Noite tropical: não baixa de {low}. Dormir vai ser esporte de resistência.',
      'Mínima de só {low} esta noite. Ventilador ligado, cobertor no armário.',
    ],
    freezingDay: [
      'Abaixo de zero o dia todo, {high} no máximo. Lá fora é basicamente um freezer.',
      'Nada de degelo: {high} no máximo. Luvas não são opcionais.',
    ],
    bitterCold: [
      'Frio de rachar: sensação de {feels}. Cubra cada pedacinho de pele.',
      'Sensação de {feels}. Até pinguim pediria cachecol.',
    ],
    extremeCold: [
      'Frio perigoso, com sensação de {feels}. O congelamento da pele pode ocorrer em minutos: limite o tempo ao ar livre.',
    ],
    windChill: [
      'O termômetro diz uma coisa, o vento diz {feels}. Acredite no vento.',
      'Com o vento, a sensação é de {feels}. Capuz na cabeça.',
    ],
    muggy: [
      'Mormaço e umidade: ao meio-dia você vai se sentir dentro de uma panela de pressão.',
      'Tão úmido que dá para nadar no ar. Roupas leves, por favor.',
    ],
    tempDrop: [
      'Queda brusca {t}, por aí: uns {diff} a menos em poucas horas. Deixe um casaco por perto.',
      'Uma frente fria chega sem pedir licença {t} e derruba {diff}.',
    ],
    eveningChill: [
      'Esfria rápido: {low} já {t}. Sabe aquele casaco que agora parece inútil? Leve.',
      'Chega a {low} {t}. A noite tem outro dress code.',
    ],
    warmForSeason: [
      '{high}? Para esta época do ano, é praticamente um presente.',
      'Ameno fora do comum: {high}. A natureza parece ter perdido o calendário.',
    ],
    coldForSeason: [
      'Só {high}. O calor apertou o soneca.',
      '{high} no máximo. Nada a ver com a estação, mas é o que temos.',
    ],
    sunnyButCold: [
      'Sol forte, {high} no máximo: muita pose, pouco calor.',
      'Ensolarado, mas só {high}. Da janela parece quente. Não é.',
    ],

    // Vento
    breezy: [
      'Brisa animada, até {wind}. Dia ruim para o cabelo, ótimo para soltar pipa.',
      'Venta um pouco, até {wind}. Segure o chapéu.',
    ],
    windy: [
      'Ventania, até {wind}. Guarda-chuvas vão virar do avesso.',
      'Vento de até {wind}. Prenda o que é leve, e o penteado.',
    ],
    gale: [
      'Vento forte de até {wind}. Recolha os móveis do quintal e cuidado com galhos caindo.',
      'Rajadas de até {wind}. Não é dia de carregar uma placa grande de compensado.',
    ],
    storm: [
      'Ventos de tempestade de até {wind}. Fique longe de árvores, andaimes e do litoral.',
    ],
    hurricane: [
      'Ventos com força de furacão, de até {wind}. Siga as orientações das autoridades locais.',
    ],

    // Exposição
    uvHigh: [
      'Índice UV {uv} no pico, {t}. Protetor solar, a não ser que o visual camarão te agrade.',
      'O UV chega a {uv} {t}, mais ou menos. Óculos escuros e protetor solar.',
    ],
    uvVeryHigh: [
      'UV muito alto ({uv}): começa {start} e só baixa {end}. Protetor e sombra, sério.',
      'UV {uv}: a torradeira liga {start} e desliga {end}. A pele queima mais rápido que pão.',
    ],
    uvExtreme: [
      'UV extremo ({uv}). Pele desprotegida queima em minutos: cubra-se e procure sombra perto do meio-dia.',
    ],
    airPoor: [
      'Qualidade do ar ruim. Que tal trocar a corrida na rua pela esteira hoje?',
      'O ar não está lá essas coisas. Se seus pulmões são sensíveis, pegue leve.',
    ],
    airVeryPoor: [
      'Qualidade do ar muito ruim. Limite esforços ao ar livre, especialmente se você for sensível.',
    ],

    // Noite
    clearNight: [
      'Céu limpo esta noite, mínima de {low}. Boa noite para olhar para cima.',
      'Noite estrelada pela frente, {low} na hora mais fria.',
    ],
    calmNight: [
      'Noite tranquila, mínima de {low}. O tempo está de folga.',
      'Nada a relatar esta noite: {low} na mínima. Durma bem.',
    ],
    nightRainAll: [
      'Chuva a noite toda. Trilha sonora perfeita para dormir, noite ruim para passear com o cachorro.',
      'Chuva até de manhã. As calhas vão fazer hora extra.',
    ],
    nightRainFrom: [
      'A chuva chega {start} e dorme aqui. Recolha as almofadas da varanda.',
      'Seco até a chuva chegar, {start}; depois, barulhinho no telhado a noite toda.',
    ],
    nightRainUntil: [
      'Chuva que só para {end}; depois, o resto da noite seco.',
      'A chuva vai dormir {end}.',
    ],
    nightRainWindow: [
      'Chuva que começa {start} e para {end}; seco no resto do tempo.',
      'Um período de chuva: começa {start}, termina {end}. Depois, silêncio de novo.',
    ],
    nightSnow: [
      'Neve começando {start}. Você pode acordar num mundo branco.',
      'Neve de madrugada, começando {start}. Amanhã: cartão-postal na janela, pista de patinação na rua.',
    ],
    nightStorm: [
      'Trovoadas possíveis: começam {start} e param {end}. Tire da tomada o que você ama.',
      'Temporal marcado: começa {start}, termina {end}. O cachorro vai querer dormir na sua cama.',
    ],

    // Amanhã
    tomorrowColder: [
      'Uns {diff} a menos, com máxima de {high}. Tire o casaco do armário hoje à noite.',
      'Os termômetros caem {diff}: {high} no máximo. Aproveite hoje enquanto dura.',
    ],
    tomorrowWarmer: [
      'Uns {diff} a mais, até {high}. Algo para esperar com vontade.',
      'Um salto de {diff}, até {high}. O você de amanhã agradece.',
    ],

    // Calmo
    calmSunny: [
      'Ensolarado e sem novidades, de {low} a {high}. O tempo tirou folga.',
      'Tranquilo: sol, de {low} a {high}, nada com que se preocupar.',
    ],
    calmCloudy: [
      'Nublado, mas seco, de {low} a {high}. Nada empolgante, nada problemático.',
      'Acinzentado e calmo, de {low} a {high}. Um dia perfeitamente comum, meteorologicamente falando.',
    ],
    calmMixed: [
      'Sol e nuvens se revezando, de {low} a {high}. Sem drama.',
      'Um pouco de tudo, menos chuva: de {low} a {high}.',
    ],

    // Extras
    fullMoon: [
      'Lua cheia esta noite e céu limpo. Lobisomens, considerem-se avisados.',
      'Lua cheia e céu limpo: é luar do sertão até na cidade.',
    ],
    supermoon: ['Superlua esta noite: a Lua está mais perto e mais brilhante. Olhe para cima!'],
    newMoonStars: [
      'Lua nova e céu limpo: noite perfeita para ver estrelas. Fuja das luzes da cidade.',
      'Sem lua, sem nuvens: esta noite o palco é das estrelas.',
    ],
    meteors: [
      'Pico das {name} esta noite: até {rate} estrelas cadentes por hora. Deixe os pedidos prontos.',
      'Céu limpo para as {name} esta noite, até {rate} meteoros por hora. Olhe para cima, longe das luzes.',
    ],
    goldenHour: [
      'A hora dourada começa {golden}; o sol se põe {sunset}. Fotógrafos, a postos.',
      'Pôr do sol com céu limpo {sunset}. Vale espiar pela janela {golden}.',
    ],
    sunriseClear: ['O sol nasce {sunrise} com céu limpo. O espetáculo é de quem madruga.'],
    midnightSun: ['O sol não se põe hoje. Cortinas blackout são suas melhores amigas.'],
    polarNight: ['O sol não nasce hoje: noite polar. Vitamina D, velas e boa companhia.'],
    longestDay: ['Dia mais longo do ano: {daylight} de luz. Aproveite bem (de preferência ao ar livre).'],
    shortestDay: ['Dia mais curto do ano: só {daylight} de luz. A partir de amanhã, a luz contra-ataca.'],
    springEquinox: ['Equinócio de primavera: dia e noite empatados. Daqui em diante, a luz vence.'],
    autumnEquinox: ['Equinócio de outono: dia e noite empatados. Agora as noites levam vantagem. Cobertores a postos.'],
    earlySunset: ['O sol se põe {sunset}. Sim, já.', 'O sol encerra o expediente {sunset}. Sortudo.'],
    lateSunset: ['O sol só se põe {sunset}: fim de tarde longo pela frente.'],
    whiteChristmas: ['Neve no Natal: de verdade, como nos filmes. Solta o som.'],
    greenChristmas: ['Natal com {high}. Papai Noel bem que podia trocar o casaco de pele por uma bermuda.'],
    nyeDry: ['Perto da meia-noite: seco, {low}. Perfeito para os fogos.'],
    nyeWet: ['Chance de chuva perto da meia-noite: fogos debaixo do guarda-chuva, então.'],
    halloween: ['Halloween com esse tempo? O clima de terror é cortesia da casa.'],
  },

  tips: {
    umbrella: [
      'Guarda-chuva: sim. Sapato de camurça: não.',
      'Leve o guarda-chuva. O você do futuro agradece.',
      'Guarda-chuva na bolsa. Pesa menos que o arrependimento.',
    ],
    raincoat: [
      'Chuva com vento: guarda-chuva não dá conta. Vá de capa de chuva com capuz.',
      'Vento demais para guarda-chuva: uma jaqueta com capuz resolve melhor.',
    ],
    snowBoots: ['Calçado de respeito hoje: aderência antes do estilo.', 'Botas que não escorregam, e saia um pouco mais cedo.'],
    snowman: ['Neve e folga: hora do boneco de neve. Cenoura não inclusa.'],
    layers: [
      'Camadas: você vai tirar à tarde e colocar de volta à noite.',
      'Vista-se em camadas, tipo cebola: tira uma, tira outra.',
    ],
    sunscreen: [
      'Protetor solar, mesmo sem praia. Principalmente no nariz.',
      'Protetor e óculos escuros. Sua pele agradece daqui a 20 anos.',
    ],
    scrape: [
      'Saia 5 minutos mais cedo para raspar o gelo do para-brisa.',
      'Raspador a postos. Água quente no para-brisa: nunca.',
    ],
    hydrate: [
      'Garrafinha de água obrigatória. Café não conta.',
      'Beba água antes de sentir sede e fique na sombra nas horas mais quentes.',
    ],
    bundleUp: ['Gorro, luvas, cachecol: o kit completo.', 'Agasalhe-se bem. Depois, mais uma camada.'],
    laundry: [
      'Tempo perfeito para lavar roupa: sol, brisa e nada de chuva. A secadora pode tirar folga.',
      'Pendure a roupa no varal: vai secar em tempo recorde.',
    ],
    terrace: [
      'Noite gostosa pela frente: varanda, churrasco ou piquenique, você escolhe.',
      'Uma noite feita para comer ao ar livre. Fica a dica.',
    ],
    mosquitoes: ['Noite quente e abafada: os pernilongos estão na lista de convidados. Repelente recomendado.'],
    noCarWash: ['Ia lavar o carro? A chuva de amanhã faz isso de graça.'],
    stayIn: [
      'Fique em casa se puder, carregue o celular e deixe uma lanterna por perto.',
      'Adie qualquer deslocamento que não seja essencial e mantenha o celular carregado.',
    ],
    secureObjects: ['Prenda ou guarde tudo o que pode voar: lixeiras, camas elásticas, cadeiras de área externa.'],
    extraTime: ['Reserve mais tempo para seus deslocamentos e caminhe com cuidado.', 'Reduza a velocidade na estrada e saia com folga.'],
    jacketEvening: ['Leve um casaco para a noite, mesmo que agora pareça bobagem.'],
  },

  meteorNames: {
    quadrantids: 'Quadrântidas',
    lyrids: 'Líridas',
    etaAquariids: 'Eta Aquáridas',
    perseids: 'Perseidas',
    orionids: 'Oriônidas',
    leonids: 'Leônidas',
    geminids: 'Geminídeas',
  },
};
