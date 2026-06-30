/**
 * Localization strings for the app's UI.
 *
 * Weather *condition* text (e.g. "Partly cloudy") is localized by WeatherAPI
 * itself via the `lang` query param — see {@link languageToApiLang}. Everything
 * else (labels, sections, moon phases, weekdays) lives here.
 */

export type LanguageCode =
  | 'en'
  | 'es'
  | 'zh'
  | 'ja'
  | 'de'
  | 'fr'
  | 'pt'
  | 'ko'
  | 'ar'
  | 'hi'
  | 'it'
  | 'nl'
  | 'sv'
  | 'no'
  | 'da'
  | 'el'
  | 'pl'
  | 'ru'
  | 'uk';

export interface Strings {
  current: string;
  add: string;
  settings: string;
  done: string;

  hourly: string;
  feelsLike: string;
  humidity: string;
  wind: string;
  precip: string;

  subCooler: string;
  subWarmer: string;
  subSimilar: string;
  subDry: string;
  subComfortable: string;
  subHumid: string;

  now: string;
  nextDays: string; // "{n}"
  tomorrow: string;

  sunMoon: string;
  sunrise: string;
  sunset: string;
  illuminated: string; // "{n}"

  moonNew: string;
  moonWaxingCrescent: string;
  moonFirstQuarter: string;
  moonWaxingGibbous: string;
  moonFull: string;
  moonWaningGibbous: string;
  moonLastQuarter: string;
  moonWaningCrescent: string;

  /** Sunday → Saturday. */
  weekdays: string[];

  addCity: string;
  searchCity: string;
  savedSection: string;
  noMatches: string;
  searchPrompt: string;
  remove: string;
  added: string;
  capacity: string; // "{n}"
  searchFailed: string;

  temperature: string;
  language: string;

  locationError: string;
  loadError: string;
  tryAgain: string;
}

export const TRANSLATIONS: Record<LanguageCode, Strings> = {
  en: {
    current: 'Current', add: 'Add', settings: 'Settings', done: 'Done',
    hourly: 'Hourly', feelsLike: 'Feels like', humidity: 'Humidity', wind: 'Wind', precip: 'Precip',
    subCooler: 'cooler', subWarmer: 'warmer', subSimilar: 'similar', subDry: 'dry', subComfortable: 'comfortable', subHumid: 'humid',
    now: 'Now', nextDays: 'Next {n} days', tomorrow: 'Tomorrow',
    sunMoon: 'Sun & Moon', sunrise: 'Sunrise', sunset: 'Sunset', illuminated: '{n}% illuminated',
    moonNew: 'New Moon', moonWaxingCrescent: 'Waxing Crescent', moonFirstQuarter: 'First Quarter', moonWaxingGibbous: 'Waxing Gibbous', moonFull: 'Full Moon', moonWaningGibbous: 'Waning Gibbous', moonLastQuarter: 'Last Quarter', moonWaningCrescent: 'Waning Crescent',
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    addCity: 'Add city', searchCity: 'Search for a city', savedSection: 'Saved', noMatches: 'No matches.', searchPrompt: 'Search above to add your first city.', remove: 'Remove', added: 'Added', capacity: 'You can save up to {n} cities. Remove one to add another.', searchFailed: 'Search failed.',
    temperature: 'Temperature', language: 'Language',
    locationError: 'Unable to determine your location. Enable location access to see local weather.', loadError: 'Something went wrong loading weather.', tryAgain: 'Try again',
  },
  es: {
    current: 'Actual', add: 'Añadir', settings: 'Ajustes', done: 'Listo',
    hourly: 'Por horas', feelsLike: 'Sensación', humidity: 'Humedad', wind: 'Viento', precip: 'Precip.',
    subCooler: 'más frío', subWarmer: 'más cálido', subSimilar: 'similar', subDry: 'seco', subComfortable: 'cómodo', subHumid: 'húmedo',
    now: 'Ahora', nextDays: 'Próximos {n} días', tomorrow: 'Mañana',
    sunMoon: 'Sol y Luna', sunrise: 'Amanecer', sunset: 'Atardecer', illuminated: '{n}% iluminada',
    moonNew: 'Luna nueva', moonWaxingCrescent: 'Luna creciente', moonFirstQuarter: 'Cuarto creciente', moonWaxingGibbous: 'Gibosa creciente', moonFull: 'Luna llena', moonWaningGibbous: 'Gibosa menguante', moonLastQuarter: 'Cuarto menguante', moonWaningCrescent: 'Luna menguante',
    weekdays: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    addCity: 'Añadir ciudad', searchCity: 'Buscar una ciudad', savedSection: 'Guardadas', noMatches: 'Sin resultados.', searchPrompt: 'Busca arriba para añadir tu primera ciudad.', remove: 'Quitar', added: 'Añadida', capacity: 'Puedes guardar hasta {n} ciudades. Quita una para añadir otra.', searchFailed: 'Error en la búsqueda.',
    temperature: 'Temperatura', language: 'Idioma',
    locationError: 'No se pudo determinar tu ubicación. Activa el acceso a la ubicación para ver el clima local.', loadError: 'Algo salió mal al cargar el clima.', tryAgain: 'Reintentar',
  },
  zh: {
    current: '当前', add: '添加', settings: '设置', done: '完成',
    hourly: '每小时', feelsLike: '体感', humidity: '湿度', wind: '风', precip: '降水',
    subCooler: '更凉', subWarmer: '更暖', subSimilar: '相近', subDry: '干燥', subComfortable: '舒适', subHumid: '潮湿',
    now: '现在', nextDays: '未来 {n} 天', tomorrow: '明天',
    sunMoon: '日月', sunrise: '日出', sunset: '日落', illuminated: '亮度 {n}%',
    moonNew: '新月', moonWaxingCrescent: '蛾眉月', moonFirstQuarter: '上弦月', moonWaxingGibbous: '盈凸月', moonFull: '满月', moonWaningGibbous: '亏凸月', moonLastQuarter: '下弦月', moonWaningCrescent: '残月',
    weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    addCity: '添加城市', searchCity: '搜索城市', savedSection: '已保存', noMatches: '无结果。', searchPrompt: '在上方搜索以添加第一个城市。', remove: '移除', added: '已添加', capacity: '最多可保存 {n} 个城市。移除一个以添加新的。', searchFailed: '搜索失败。',
    temperature: '温度', language: '语言',
    locationError: '无法确定您的位置。请启用位置访问以查看本地天气。', loadError: '加载天气时出错。', tryAgain: '重试',
  },
  ja: {
    current: '現在地', add: '追加', settings: '設定', done: '完了',
    hourly: '時間ごと', feelsLike: '体感', humidity: '湿度', wind: '風', precip: '降水',
    subCooler: '涼しい', subWarmer: '暖かい', subSimilar: 'ほぼ同じ', subDry: '乾燥', subComfortable: '快適', subHumid: '湿気',
    now: '今', nextDays: '今後{n}日間', tomorrow: '明日',
    sunMoon: '太陽と月', sunrise: '日の出', sunset: '日の入り', illuminated: '輝面比 {n}%',
    moonNew: '新月', moonWaxingCrescent: '三日月', moonFirstQuarter: '上弦の月', moonWaxingGibbous: '盈凸月', moonFull: '満月', moonWaningGibbous: '虧凸月', moonLastQuarter: '下弦の月', moonWaningCrescent: '有明月',
    weekdays: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
    addCity: '都市を追加', searchCity: '都市を検索', savedSection: '保存済み', noMatches: '該当なし。', searchPrompt: '上で検索して最初の都市を追加しましょう。', remove: '削除', added: '追加済み', capacity: '都市は最大{n}件まで保存できます。追加するには1件削除してください。', searchFailed: '検索に失敗しました。',
    temperature: '温度', language: '言語',
    locationError: '現在地を特定できません。現地の天気を見るには位置情報を有効にしてください。', loadError: '天気の読み込み中に問題が発生しました。', tryAgain: '再試行',
  },
  de: {
    current: 'Aktuell', add: 'Hinzufügen', settings: 'Einstellungen', done: 'Fertig',
    hourly: 'Stündlich', feelsLike: 'Gefühlt', humidity: 'Luftfeuchte', wind: 'Wind', precip: 'Niederschlag',
    subCooler: 'kühler', subWarmer: 'wärmer', subSimilar: 'ähnlich', subDry: 'trocken', subComfortable: 'angenehm', subHumid: 'feucht',
    now: 'Jetzt', nextDays: 'Nächste {n} Tage', tomorrow: 'Morgen',
    sunMoon: 'Sonne & Mond', sunrise: 'Sonnenaufgang', sunset: 'Sonnenuntergang', illuminated: '{n}% beleuchtet',
    moonNew: 'Neumond', moonWaxingCrescent: 'Zunehmende Sichel', moonFirstQuarter: 'Erstes Viertel', moonWaxingGibbous: 'Zunehmender Mond', moonFull: 'Vollmond', moonWaningGibbous: 'Abnehmender Mond', moonLastQuarter: 'Letztes Viertel', moonWaningCrescent: 'Abnehmende Sichel',
    weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    addCity: 'Stadt hinzufügen', searchCity: 'Stadt suchen', savedSection: 'Gespeichert', noMatches: 'Keine Treffer.', searchPrompt: 'Oben suchen, um deine erste Stadt hinzuzufügen.', remove: 'Entfernen', added: 'Hinzugefügt', capacity: 'Du kannst bis zu {n} Städte speichern. Entferne eine, um eine andere hinzuzufügen.', searchFailed: 'Suche fehlgeschlagen.',
    temperature: 'Temperatur', language: 'Sprache',
    locationError: 'Standort konnte nicht ermittelt werden. Aktiviere den Standortzugriff, um das lokale Wetter zu sehen.', loadError: 'Beim Laden des Wetters ist etwas schiefgelaufen.', tryAgain: 'Erneut versuchen',
  },
  fr: {
    current: 'Actuel', add: 'Ajouter', settings: 'Réglages', done: 'OK',
    hourly: 'Par heure', feelsLike: 'Ressenti', humidity: 'Humidité', wind: 'Vent', precip: 'Précip.',
    subCooler: 'plus frais', subWarmer: 'plus chaud', subSimilar: 'similaire', subDry: 'sec', subComfortable: 'agréable', subHumid: 'humide',
    now: 'Maintenant', nextDays: '{n} prochains jours', tomorrow: 'Demain',
    sunMoon: 'Soleil et Lune', sunrise: 'Lever du soleil', sunset: 'Coucher du soleil', illuminated: '{n}% éclairée',
    moonNew: 'Nouvelle lune', moonWaxingCrescent: 'Premier croissant', moonFirstQuarter: 'Premier quartier', moonWaxingGibbous: 'Gibbeuse croissante', moonFull: 'Pleine lune', moonWaningGibbous: 'Gibbeuse décroissante', moonLastQuarter: 'Dernier quartier', moonWaningCrescent: 'Dernier croissant',
    weekdays: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
    addCity: 'Ajouter une ville', searchCity: 'Rechercher une ville', savedSection: 'Enregistrées', noMatches: 'Aucun résultat.', searchPrompt: 'Recherchez ci-dessus pour ajouter votre première ville.', remove: 'Retirer', added: 'Ajoutée', capacity: 'Vous pouvez enregistrer jusqu’à {n} villes. Retirez-en une pour en ajouter une autre.', searchFailed: 'Échec de la recherche.',
    temperature: 'Température', language: 'Langue',
    locationError: 'Impossible de déterminer votre position. Activez l’accès à la localisation pour voir la météo locale.', loadError: 'Une erreur est survenue lors du chargement de la météo.', tryAgain: 'Réessayer',
  },
  pt: {
    current: 'Atual', add: 'Adicionar', settings: 'Ajustes', done: 'Concluído',
    hourly: 'Por hora', feelsLike: 'Sensação', humidity: 'Umidade', wind: 'Vento', precip: 'Precip.',
    subCooler: 'mais frio', subWarmer: 'mais quente', subSimilar: 'parecido', subDry: 'seco', subComfortable: 'confortável', subHumid: 'úmido',
    now: 'Agora', nextDays: 'Próximos {n} dias', tomorrow: 'Amanhã',
    sunMoon: 'Sol e Lua', sunrise: 'Nascer do sol', sunset: 'Pôr do sol', illuminated: '{n}% iluminada',
    moonNew: 'Lua nova', moonWaxingCrescent: 'Crescente côncava', moonFirstQuarter: 'Quarto crescente', moonWaxingGibbous: 'Crescente gibosa', moonFull: 'Lua cheia', moonWaningGibbous: 'Minguante gibosa', moonLastQuarter: 'Quarto minguante', moonWaningCrescent: 'Minguante côncava',
    weekdays: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
    addCity: 'Adicionar cidade', searchCity: 'Buscar uma cidade', savedSection: 'Salvas', noMatches: 'Sem resultados.', searchPrompt: 'Busque acima para adicionar sua primeira cidade.', remove: 'Remover', added: 'Adicionada', capacity: 'Você pode salvar até {n} cidades. Remova uma para adicionar outra.', searchFailed: 'Falha na busca.',
    temperature: 'Temperatura', language: 'Idioma',
    locationError: 'Não foi possível determinar sua localização. Ative o acesso à localização para ver o clima local.', loadError: 'Algo deu errado ao carregar o clima.', tryAgain: 'Tentar novamente',
  },
  ko: {
    current: '현재 위치', add: '추가', settings: '설정', done: '완료',
    hourly: '시간별', feelsLike: '체감', humidity: '습도', wind: '바람', precip: '강수',
    subCooler: '더 시원함', subWarmer: '더 따뜻함', subSimilar: '비슷함', subDry: '건조', subComfortable: '쾌적', subHumid: '습함',
    now: '지금', nextDays: '향후 {n}일', tomorrow: '내일',
    sunMoon: '해와 달', sunrise: '일출', sunset: '일몰', illuminated: '{n}% 밝음',
    moonNew: '삭', moonWaxingCrescent: '초승달', moonFirstQuarter: '상현달', moonWaxingGibbous: '차오르는 볼록달', moonFull: '보름달', moonWaningGibbous: '기우는 볼록달', moonLastQuarter: '하현달', moonWaningCrescent: '그믐달',
    weekdays: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    addCity: '도시 추가', searchCity: '도시 검색', savedSection: '저장됨', noMatches: '결과 없음.', searchPrompt: '위에서 검색하여 첫 도시를 추가하세요.', remove: '삭제', added: '추가됨', capacity: '최대 {n}개 도시를 저장할 수 있습니다. 추가하려면 하나를 삭제하세요.', searchFailed: '검색 실패.',
    temperature: '온도', language: '언어',
    locationError: '위치를 확인할 수 없습니다. 현지 날씨를 보려면 위치 접근을 허용하세요.', loadError: '날씨를 불러오는 중 문제가 발생했습니다.', tryAgain: '다시 시도',
  },
  ar: {
    current: 'الحالي', add: 'إضافة', settings: 'الإعدادات', done: 'تم',
    hourly: 'كل ساعة', feelsLike: 'الإحساس', humidity: 'الرطوبة', wind: 'الرياح', precip: 'هطول',
    subCooler: 'أبرد', subWarmer: 'أدفأ', subSimilar: 'مشابه', subDry: 'جاف', subComfortable: 'مريح', subHumid: 'رطب',
    now: 'الآن', nextDays: 'الأيام {n} القادمة', tomorrow: 'غدًا',
    sunMoon: 'الشمس والقمر', sunrise: 'الشروق', sunset: 'الغروب', illuminated: '{n}% مضاء',
    moonNew: 'المحاق', moonWaxingCrescent: 'الهلال المتزايد', moonFirstQuarter: 'التربيع الأول', moonWaxingGibbous: 'الأحدب المتزايد', moonFull: 'البدر', moonWaningGibbous: 'الأحدب المتناقص', moonLastQuarter: 'التربيع الأخير', moonWaningCrescent: 'الهلال المتناقص',
    weekdays: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    addCity: 'إضافة مدينة', searchCity: 'ابحث عن مدينة', savedSection: 'المحفوظة', noMatches: 'لا نتائج.', searchPrompt: 'ابحث بالأعلى لإضافة أول مدينة.', remove: 'إزالة', added: 'مضافة', capacity: 'يمكنك حفظ حتى {n} مدن. أزل واحدة لإضافة أخرى.', searchFailed: 'فشل البحث.',
    temperature: 'درجة الحرارة', language: 'اللغة',
    locationError: 'تعذّر تحديد موقعك. فعّل الوصول إلى الموقع لرؤية الطقس المحلي.', loadError: 'حدث خطأ أثناء تحميل الطقس.', tryAgain: 'حاول مرة أخرى',
  },
  hi: {
    current: 'वर्तमान', add: 'जोड़ें', settings: 'सेटिंग्स', done: 'पूर्ण',
    hourly: 'प्रति घंटा', feelsLike: 'महसूस', humidity: 'आर्द्रता', wind: 'हवा', precip: 'वर्षा',
    subCooler: 'अधिक ठंडा', subWarmer: 'अधिक गर्म', subSimilar: 'समान', subDry: 'शुष्क', subComfortable: 'आरामदायक', subHumid: 'आर्द्र',
    now: 'अभी', nextDays: 'अगले {n} दिन', tomorrow: 'कल',
    sunMoon: 'सूर्य और चंद्रमा', sunrise: 'सूर्योदय', sunset: 'सूर्यास्त', illuminated: '{n}% प्रकाशित',
    moonNew: 'अमावस्या', moonWaxingCrescent: 'बढ़ता अर्धचंद्र', moonFirstQuarter: 'प्रथम चतुर्थांश', moonWaxingGibbous: 'बढ़ता उभरा चंद्र', moonFull: 'पूर्णिमा', moonWaningGibbous: 'घटता उभरा चंद्र', moonLastQuarter: 'अंतिम चतुर्थांश', moonWaningCrescent: 'घटता अर्धचंद्र',
    weekdays: ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
    addCity: 'शहर जोड़ें', searchCity: 'शहर खोजें', savedSection: 'सहेजे गए', noMatches: 'कोई परिणाम नहीं।', searchPrompt: 'अपना पहला शहर जोड़ने के लिए ऊपर खोजें।', remove: 'हटाएँ', added: 'जोड़ा गया', capacity: 'आप अधिकतम {n} शहर सहेज सकते हैं। दूसरा जोड़ने के लिए एक हटाएँ।', searchFailed: 'खोज विफल।',
    temperature: 'तापमान', language: 'भाषा',
    locationError: 'आपका स्थान निर्धारित नहीं हो सका। स्थानीय मौसम देखने के लिए स्थान पहुँच सक्षम करें।', loadError: 'मौसम लोड करने में कुछ गड़बड़ हुई।', tryAgain: 'पुनः प्रयास करें',
  },
  it: {
    current: 'Attuale', add: 'Aggiungi', settings: 'Impostazioni', done: 'Fatto',
    hourly: 'Orario', feelsLike: 'Percepita', humidity: 'Umidità', wind: 'Vento', precip: 'Precip.',
    subCooler: 'più fresco', subWarmer: 'più caldo', subSimilar: 'simile', subDry: 'secco', subComfortable: 'confortevole', subHumid: 'umido',
    now: 'Ora', nextDays: 'Prossimi {n} giorni', tomorrow: 'Domani',
    sunMoon: 'Sole e Luna', sunrise: 'Alba', sunset: 'Tramonto', illuminated: '{n}% illuminata',
    moonNew: 'Luna nuova', moonWaxingCrescent: 'Luna crescente', moonFirstQuarter: 'Primo quarto', moonWaxingGibbous: 'Gibbosa crescente', moonFull: 'Luna piena', moonWaningGibbous: 'Gibbosa calante', moonLastQuarter: 'Ultimo quarto', moonWaningCrescent: 'Luna calante',
    weekdays: ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'],
    addCity: 'Aggiungi città', searchCity: 'Cerca una città', savedSection: 'Salvate', noMatches: 'Nessun risultato.', searchPrompt: 'Cerca sopra per aggiungere la tua prima città.', remove: 'Rimuovi', added: 'Aggiunta', capacity: 'Puoi salvare fino a {n} città. Rimuovine una per aggiungerne un’altra.', searchFailed: 'Ricerca non riuscita.',
    temperature: 'Temperatura', language: 'Lingua',
    locationError: 'Impossibile determinare la tua posizione. Abilita l’accesso alla posizione per vedere il meteo locale.', loadError: 'Si è verificato un errore durante il caricamento del meteo.', tryAgain: 'Riprova',
  },
  nl: {
    current: 'Huidige', add: 'Toevoegen', settings: 'Instellingen', done: 'Klaar',
    hourly: 'Per uur', feelsLike: 'Gevoel', humidity: 'Vochtigheid', wind: 'Wind', precip: 'Neerslag',
    subCooler: 'koeler', subWarmer: 'warmer', subSimilar: 'vergelijkbaar', subDry: 'droog', subComfortable: 'aangenaam', subHumid: 'vochtig',
    now: 'Nu', nextDays: 'Komende {n} dagen', tomorrow: 'Morgen',
    sunMoon: 'Zon & Maan', sunrise: 'Zonsopkomst', sunset: 'Zonsondergang', illuminated: '{n}% verlicht',
    moonNew: 'Nieuwe maan', moonWaxingCrescent: 'Wassende sikkel', moonFirstQuarter: 'Eerste kwartier', moonWaxingGibbous: 'Wassende maan', moonFull: 'Volle maan', moonWaningGibbous: 'Afnemende maan', moonLastQuarter: 'Laatste kwartier', moonWaningCrescent: 'Afnemende sikkel',
    weekdays: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
    addCity: 'Stad toevoegen', searchCity: 'Zoek een stad', savedSection: 'Opgeslagen', noMatches: 'Geen resultaten.', searchPrompt: 'Zoek hierboven om je eerste stad toe te voegen.', remove: 'Verwijderen', added: 'Toegevoegd', capacity: 'Je kunt maximaal {n} steden opslaan. Verwijder er een om een andere toe te voegen.', searchFailed: 'Zoeken mislukt.',
    temperature: 'Temperatuur', language: 'Taal',
    locationError: 'Kan je locatie niet bepalen. Schakel locatietoegang in om lokaal weer te zien.', loadError: 'Er ging iets mis bij het laden van het weer.', tryAgain: 'Opnieuw proberen',
  },
  sv: {
    current: 'Aktuell', add: 'Lägg till', settings: 'Inställningar', done: 'Klar',
    hourly: 'Per timme', feelsLike: 'Känns som', humidity: 'Luftfuktighet', wind: 'Vind', precip: 'Nederbörd',
    subCooler: 'svalare', subWarmer: 'varmare', subSimilar: 'liknande', subDry: 'torrt', subComfortable: 'behagligt', subHumid: 'fuktigt',
    now: 'Nu', nextDays: 'Nästa {n} dagar', tomorrow: 'Imorgon',
    sunMoon: 'Sol & Måne', sunrise: 'Soluppgång', sunset: 'Solnedgång', illuminated: '{n}% upplyst',
    moonNew: 'Nymåne', moonWaxingCrescent: 'Tilltagande skära', moonFirstQuarter: 'Första kvarteret', moonWaxingGibbous: 'Tilltagande halvmåne', moonFull: 'Fullmåne', moonWaningGibbous: 'Avtagande halvmåne', moonLastQuarter: 'Sista kvarteret', moonWaningCrescent: 'Avtagande skära',
    weekdays: ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'],
    addCity: 'Lägg till stad', searchCity: 'Sök efter en stad', savedSection: 'Sparade', noMatches: 'Inga träffar.', searchPrompt: 'Sök ovan för att lägga till din första stad.', remove: 'Ta bort', added: 'Tillagd', capacity: 'Du kan spara upp till {n} städer. Ta bort en för att lägga till en annan.', searchFailed: 'Sökningen misslyckades.',
    temperature: 'Temperatur', language: 'Språk',
    locationError: 'Det gick inte att fastställa din plats. Aktivera platsåtkomst för att se lokalt väder.', loadError: 'Något gick fel när vädret laddades.', tryAgain: 'Försök igen',
  },
  no: {
    current: 'Nåværende', add: 'Legg til', settings: 'Innstillinger', done: 'Ferdig',
    hourly: 'Per time', feelsLike: 'Føles som', humidity: 'Luftfuktighet', wind: 'Vind', precip: 'Nedbør',
    subCooler: 'kjøligere', subWarmer: 'varmere', subSimilar: 'lignende', subDry: 'tørt', subComfortable: 'behagelig', subHumid: 'fuktig',
    now: 'Nå', nextDays: 'Neste {n} dager', tomorrow: 'I morgen',
    sunMoon: 'Sol og måne', sunrise: 'Soloppgang', sunset: 'Solnedgang', illuminated: '{n}% opplyst',
    moonNew: 'Nymåne', moonWaxingCrescent: 'Voksende månesigd', moonFirstQuarter: 'Første kvarter', moonWaxingGibbous: 'Voksende halvmåne', moonFull: 'Fullmåne', moonWaningGibbous: 'Avtagende halvmåne', moonLastQuarter: 'Siste kvarter', moonWaningCrescent: 'Avtagende månesigd',
    weekdays: ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'],
    addCity: 'Legg til by', searchCity: 'Søk etter en by', savedSection: 'Lagrede', noMatches: 'Ingen treff.', searchPrompt: 'Søk ovenfor for å legge til din første by.', remove: 'Fjern', added: 'Lagt til', capacity: 'Du kan lagre opptil {n} byer. Fjern én for å legge til en annen.', searchFailed: 'Søket mislyktes.',
    temperature: 'Temperatur', language: 'Språk',
    locationError: 'Kunne ikke fastslå posisjonen din. Aktiver posisjonstilgang for å se lokalt vær.', loadError: 'Noe gikk galt under lasting av været.', tryAgain: 'Prøv igjen',
  },
  da: {
    current: 'Nuværende', add: 'Tilføj', settings: 'Indstillinger', done: 'Færdig',
    hourly: 'Per time', feelsLike: 'Føles som', humidity: 'Luftfugtighed', wind: 'Vind', precip: 'Nedbør',
    subCooler: 'køligere', subWarmer: 'varmere', subSimilar: 'lignende', subDry: 'tørt', subComfortable: 'behageligt', subHumid: 'fugtigt',
    now: 'Nu', nextDays: 'Næste {n} dage', tomorrow: 'I morgen',
    sunMoon: 'Sol og måne', sunrise: 'Solopgang', sunset: 'Solnedgang', illuminated: '{n}% oplyst',
    moonNew: 'Nymåne', moonWaxingCrescent: 'Tiltagende månesegl', moonFirstQuarter: 'Første kvarter', moonWaxingGibbous: 'Tiltagende måne', moonFull: 'Fuldmåne', moonWaningGibbous: 'Aftagende måne', moonLastQuarter: 'Sidste kvarter', moonWaningCrescent: 'Aftagende månesegl',
    weekdays: ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'],
    addCity: 'Tilføj by', searchCity: 'Søg efter en by', savedSection: 'Gemte', noMatches: 'Ingen resultater.', searchPrompt: 'Søg ovenfor for at tilføje din første by.', remove: 'Fjern', added: 'Tilføjet', capacity: 'Du kan gemme op til {n} byer. Fjern en for at tilføje en anden.', searchFailed: 'Søgningen mislykkedes.',
    temperature: 'Temperatur', language: 'Sprog',
    locationError: 'Din placering kunne ikke bestemmes. Aktivér placeringsadgang for at se lokalt vejr.', loadError: 'Noget gik galt under indlæsning af vejret.', tryAgain: 'Prøv igen',
  },
  el: {
    current: 'Τρέχουσα', add: 'Προσθήκη', settings: 'Ρυθμίσεις', done: 'Τέλος',
    hourly: 'Ωριαία', feelsLike: 'Αίσθηση', humidity: 'Υγρασία', wind: 'Άνεμος', precip: 'Βροχή',
    subCooler: 'πιο δροσερά', subWarmer: 'πιο ζεστά', subSimilar: 'παρόμοια', subDry: 'ξηρά', subComfortable: 'άνετα', subHumid: 'υγρά',
    now: 'Τώρα', nextDays: 'Επόμενες {n} ημέρες', tomorrow: 'Αύριο',
    sunMoon: 'Ήλιος & Σελήνη', sunrise: 'Ανατολή', sunset: 'Δύση', illuminated: '{n}% φωτισμένη',
    moonNew: 'Νέα Σελήνη', moonWaxingCrescent: 'Αύξουσα Ημισέληνος', moonFirstQuarter: 'Πρώτο Τέταρτο', moonWaxingGibbous: 'Αύξουσα Αμφίκυρτη', moonFull: 'Πανσέληνος', moonWaningGibbous: 'Φθίνουσα Αμφίκυρτη', moonLastQuarter: 'Τελευταίο Τέταρτο', moonWaningCrescent: 'Φθίνουσα Ημισέληνος',
    weekdays: ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'],
    addCity: 'Προσθήκη πόλης', searchCity: 'Αναζήτηση πόλης', savedSection: 'Αποθηκευμένες', noMatches: 'Καμία αντιστοιχία.', searchPrompt: 'Αναζητήστε παραπάνω για να προσθέσετε την πρώτη σας πόλη.', remove: 'Αφαίρεση', added: 'Προστέθηκε', capacity: 'Μπορείτε να αποθηκεύσετε έως {n} πόλεις. Αφαιρέστε μία για να προσθέσετε άλλη.', searchFailed: 'Η αναζήτηση απέτυχε.',
    temperature: 'Θερμοκρασία', language: 'Γλώσσα',
    locationError: 'Δεν ήταν δυνατός ο προσδιορισμός της τοποθεσίας σας. Ενεργοποιήστε την πρόσβαση τοποθεσίας για να δείτε τον τοπικό καιρό.', loadError: 'Παρουσιάστηκε σφάλμα κατά τη φόρτωση του καιρού.', tryAgain: 'Δοκιμάστε ξανά',
  },
  pl: {
    current: 'Bieżąca', add: 'Dodaj', settings: 'Ustawienia', done: 'Gotowe',
    hourly: 'Godzinowa', feelsLike: 'Odczuwalna', humidity: 'Wilgotność', wind: 'Wiatr', precip: 'Opady',
    subCooler: 'chłodniej', subWarmer: 'cieplej', subSimilar: 'podobnie', subDry: 'sucho', subComfortable: 'komfortowo', subHumid: 'wilgotno',
    now: 'Teraz', nextDays: 'Następne {n} dni', tomorrow: 'Jutro',
    sunMoon: 'Słońce i Księżyc', sunrise: 'Wschód słońca', sunset: 'Zachód słońca', illuminated: '{n}% oświetlenia',
    moonNew: 'Nów', moonWaxingCrescent: 'Przybywający sierp', moonFirstQuarter: 'Pierwsza kwadra', moonWaxingGibbous: 'Przybywający garbaty', moonFull: 'Pełnia', moonWaningGibbous: 'Ubywający garbaty', moonLastQuarter: 'Ostatnia kwadra', moonWaningCrescent: 'Ubywający sierp',
    weekdays: ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'],
    addCity: 'Dodaj miasto', searchCity: 'Szukaj miasta', savedSection: 'Zapisane', noMatches: 'Brak wyników.', searchPrompt: 'Wyszukaj powyżej, aby dodać pierwsze miasto.', remove: 'Usuń', added: 'Dodano', capacity: 'Możesz zapisać do {n} miast. Usuń jedno, aby dodać inne.', searchFailed: 'Wyszukiwanie nie powiodło się.',
    temperature: 'Temperatura', language: 'Język',
    locationError: 'Nie można ustalić Twojej lokalizacji. Włącz dostęp do lokalizacji, aby zobaczyć lokalną pogodę.', loadError: 'Coś poszło nie tak podczas ładowania pogody.', tryAgain: 'Spróbuj ponownie',
  },
  ru: {
    current: 'Текущее', add: 'Добавить', settings: 'Настройки', done: 'Готово',
    hourly: 'Почасовой', feelsLike: 'Ощущается', humidity: 'Влажность', wind: 'Ветер', precip: 'Осадки',
    subCooler: 'прохладнее', subWarmer: 'теплее', subSimilar: 'похоже', subDry: 'сухо', subComfortable: 'комфортно', subHumid: 'влажно',
    now: 'Сейчас', nextDays: 'Следующие {n} дн.', tomorrow: 'Завтра',
    sunMoon: 'Солнце и Луна', sunrise: 'Восход', sunset: 'Закат', illuminated: 'Освещённость {n}%',
    moonNew: 'Новолуние', moonWaxingCrescent: 'Растущий серп', moonFirstQuarter: 'Первая четверть', moonWaxingGibbous: 'Растущая луна', moonFull: 'Полнолуние', moonWaningGibbous: 'Убывающая луна', moonLastQuarter: 'Последняя четверть', moonWaningCrescent: 'Убывающий серп',
    weekdays: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
    addCity: 'Добавить город', searchCity: 'Поиск города', savedSection: 'Сохранённые', noMatches: 'Нет совпадений.', searchPrompt: 'Найдите выше, чтобы добавить первый город.', remove: 'Удалить', added: 'Добавлено', capacity: 'Можно сохранить до {n} городов. Удалите один, чтобы добавить другой.', searchFailed: 'Ошибка поиска.',
    temperature: 'Температура', language: 'Язык',
    locationError: 'Не удалось определить ваше местоположение. Включите доступ к геолокации, чтобы видеть местную погоду.', loadError: 'Не удалось загрузить погоду.', tryAgain: 'Повторить',
  },
  uk: {
    current: 'Поточне', add: 'Додати', settings: 'Налаштування', done: 'Готово',
    hourly: 'Погодинний', feelsLike: 'Відчувається', humidity: 'Вологість', wind: 'Вітер', precip: 'Опади',
    subCooler: 'прохолодніше', subWarmer: 'тепліше', subSimilar: 'схоже', subDry: 'сухо', subComfortable: 'комфортно', subHumid: 'волого',
    now: 'Зараз', nextDays: 'Наступні {n} дн.', tomorrow: 'Завтра',
    sunMoon: 'Сонце і Місяць', sunrise: 'Схід', sunset: 'Захід', illuminated: 'Освітленість {n}%',
    moonNew: 'Молодий місяць', moonWaxingCrescent: 'Зростаючий серп', moonFirstQuarter: 'Перша чверть', moonWaxingGibbous: 'Зростаючий місяць', moonFull: 'Повний місяць', moonWaningGibbous: 'Спадний місяць', moonLastQuarter: 'Остання чверть', moonWaningCrescent: 'Спадний серп',
    weekdays: ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'п’ятниця', 'субота'],
    addCity: 'Додати місто', searchCity: 'Пошук міста', savedSection: 'Збережені', noMatches: 'Немає збігів.', searchPrompt: 'Шукайте вище, щоб додати перше місто.', remove: 'Видалити', added: 'Додано', capacity: 'Можна зберегти до {n} міст. Видаліть одне, щоб додати інше.', searchFailed: 'Помилка пошуку.',
    temperature: 'Температура', language: 'Мова',
    locationError: 'Не вдалося визначити ваше місцезнаходження. Увімкніть доступ до геолокації, щоб бачити місцеву погоду.', loadError: 'Не вдалося завантажити погоду.', tryAgain: 'Спробувати ще раз',
  },
};

/** Location-permission priming dialog + approximate-location banner strings. */
export interface PermStrings {
  locTitle: string;
  locBody: string;
  locNext: string;
  locNotNow: string;
  locApprox: string;
  locEnable: string;
}

/** "Remove ads" in-app-purchase strings. */
export interface IapStrings {
  iapRemoveAds: string;
  iapTagline: string;
  iapRestore: string;
  iapOwned: string;
  iapRestoreNone: string;
}

/** Combined strings exposed to the app (UI + permission + IAP strings). */
export type FullStrings = Strings & PermStrings & IapStrings;

export const IAP_STRINGS: Record<LanguageCode, IapStrings> = {
  en: { iapRemoveAds: 'Remove ads', iapTagline: 'Enjoy the weather without the banner', iapRestore: 'Restore purchase', iapOwned: 'Ads removed — thank you!', iapRestoreNone: 'No previous purchase found.' },
  es: { iapRemoveAds: 'Quitar anuncios', iapTagline: 'Disfruta del clima sin el banner', iapRestore: 'Restaurar compra', iapOwned: 'Anuncios eliminados: ¡gracias!', iapRestoreNone: 'No se encontró ninguna compra previa.' },
  zh: { iapRemoveAds: '去除广告', iapTagline: '享受没有横幅广告的天气', iapRestore: '恢复购买', iapOwned: '广告已移除 — 谢谢！', iapRestoreNone: '未找到以往的购买。' },
  ja: { iapRemoveAds: '広告を非表示', iapTagline: 'バナーなしで天気を楽しもう', iapRestore: '購入を復元', iapOwned: '広告を削除しました — ありがとうございます！', iapRestoreNone: '以前の購入が見つかりません。' },
  de: { iapRemoveAds: 'Werbung entfernen', iapTagline: 'Wetter ohne Banner genießen', iapRestore: 'Kauf wiederherstellen', iapOwned: 'Werbung entfernt – danke!', iapRestoreNone: 'Kein früherer Kauf gefunden.' },
  fr: { iapRemoveAds: 'Supprimer les pubs', iapTagline: 'Profitez de la météo sans bannière', iapRestore: 'Restaurer l’achat', iapOwned: 'Pubs supprimées — merci !', iapRestoreNone: 'Aucun achat précédent trouvé.' },
  pt: { iapRemoveAds: 'Remover anúncios', iapTagline: 'Aproveite o tempo sem o banner', iapRestore: 'Restaurar compra', iapOwned: 'Anúncios removidos — obrigado!', iapRestoreNone: 'Nenhuma compra anterior encontrada.' },
  ko: { iapRemoveAds: '광고 제거', iapTagline: '배너 없이 날씨를 즐기세요', iapRestore: '구매 복원', iapOwned: '광고가 제거되었습니다 — 감사합니다!', iapRestoreNone: '이전 구매를 찾을 수 없습니다.' },
  ar: { iapRemoveAds: 'إزالة الإعلانات', iapTagline: 'استمتع بالطقس بدون الشريط الإعلاني', iapRestore: 'استعادة الشراء', iapOwned: 'تمت إزالة الإعلانات — شكرًا!', iapRestoreNone: 'لم يتم العثور على عملية شراء سابقة.' },
  hi: { iapRemoveAds: 'विज्ञापन हटाएँ', iapTagline: 'बैनर के बिना मौसम का आनंद लें', iapRestore: 'खरीद पुनर्स्थापित करें', iapOwned: 'विज्ञापन हटा दिए गए — धन्यवाद!', iapRestoreNone: 'कोई पिछली खरीद नहीं मिली।' },
  it: { iapRemoveAds: 'Rimuovi le pubblicità', iapTagline: 'Goditi il meteo senza banner', iapRestore: 'Ripristina acquisto', iapOwned: 'Pubblicità rimosse — grazie!', iapRestoreNone: 'Nessun acquisto precedente trovato.' },
  nl: { iapRemoveAds: 'Advertenties verwijderen', iapTagline: 'Geniet van het weer zonder banner', iapRestore: 'Aankoop herstellen', iapOwned: 'Advertenties verwijderd — bedankt!', iapRestoreNone: 'Geen eerdere aankoop gevonden.' },
  sv: { iapRemoveAds: 'Ta bort annonser', iapTagline: 'Njut av vädret utan bannern', iapRestore: 'Återställ köp', iapOwned: 'Annonser borttagna — tack!', iapRestoreNone: 'Inget tidigare köp hittades.' },
  no: { iapRemoveAds: 'Fjern annonser', iapTagline: 'Nyt været uten banneret', iapRestore: 'Gjenopprett kjøp', iapOwned: 'Annonser fjernet — takk!', iapRestoreNone: 'Fant ingen tidligere kjøp.' },
  da: { iapRemoveAds: 'Fjern annoncer', iapTagline: 'Nyd vejret uden banneret', iapRestore: 'Gendan køb', iapOwned: 'Annoncer fjernet — tak!', iapRestoreNone: 'Intet tidligere køb fundet.' },
  el: { iapRemoveAds: 'Κατάργηση διαφημίσεων', iapTagline: 'Απολαύστε τον καιρό χωρίς το banner', iapRestore: 'Επαναφορά αγοράς', iapOwned: 'Οι διαφημίσεις αφαιρέθηκαν — ευχαριστούμε!', iapRestoreNone: 'Δεν βρέθηκε προηγούμενη αγορά.' },
  pl: { iapRemoveAds: 'Usuń reklamy', iapTagline: 'Ciesz się pogodą bez banera', iapRestore: 'Przywróć zakup', iapOwned: 'Reklamy usunięte — dziękujemy!', iapRestoreNone: 'Nie znaleziono wcześniejszego zakupu.' },
  ru: { iapRemoveAds: 'Убрать рекламу', iapTagline: 'Погода без рекламного баннера', iapRestore: 'Восстановить покупку', iapOwned: 'Реклама убрана — спасибо!', iapRestoreNone: 'Предыдущая покупка не найдена.' },
  uk: { iapRemoveAds: 'Прибрати рекламу', iapTagline: 'Погода без рекламного банера', iapRestore: 'Відновити покупку', iapOwned: 'Рекламу прибрано — дякуємо!', iapRestoreNone: 'Попередню покупку не знайдено.' },
};

export const PERMISSION_STRINGS: Record<LanguageCode, PermStrings> = {
  en: { locTitle: 'Weather where you are', locBody: 'Allow location access so we can show the forecast for exactly where you are. You can always add cities by hand.', locNext: 'Next', locNotNow: 'Not now', locApprox: 'Location off — showing approximate weather', locEnable: 'Enable' },
  es: { locTitle: 'El clima donde estás', locBody: 'Permite el acceso a la ubicación para mostrar el pronóstico de tu ubicación exacta. Siempre puedes añadir ciudades manualmente.', locNext: 'Siguiente', locNotNow: 'Ahora no', locApprox: 'Ubicación desactivada: clima aproximado', locEnable: 'Activar' },
  zh: { locTitle: '你所在地的天气', locBody: '允许访问位置，以便显示你所在位置的天气预报。你也可以随时手动添加城市。', locNext: '下一步', locNotNow: '暂不', locApprox: '位置已关闭 — 显示大致天气', locEnable: '开启' },
  ja: { locTitle: '現在地の天気', locBody: '位置情報へのアクセスを許可すると、現在地の天気予報を表示できます。都市はいつでも手動で追加できます。', locNext: '次へ', locNotNow: '後で', locApprox: '位置情報オフ — おおよその天気を表示', locEnable: '有効にする' },
  de: { locTitle: 'Wetter an deinem Ort', locBody: 'Erlaube den Standortzugriff, damit wir die Vorhersage für genau deinen Standort anzeigen können. Du kannst Städte jederzeit manuell hinzufügen.', locNext: 'Weiter', locNotNow: 'Nicht jetzt', locApprox: 'Standort aus – ungefähres Wetter', locEnable: 'Aktivieren' },
  fr: { locTitle: 'La météo près de vous', locBody: 'Autorisez l’accès à la localisation pour afficher les prévisions de votre position exacte. Vous pouvez aussi ajouter des villes manuellement.', locNext: 'Suivant', locNotNow: 'Plus tard', locApprox: 'Localisation désactivée — météo approximative', locEnable: 'Activer' },
  pt: { locTitle: 'O tempo onde você está', locBody: 'Permita o acesso à localização para mostrar a previsão do seu local exato. Você sempre pode adicionar cidades manualmente.', locNext: 'Avançar', locNotNow: 'Agora não', locApprox: 'Localização desativada — clima aproximado', locEnable: 'Ativar' },
  ko: { locTitle: '내 위치의 날씨', locBody: '위치 접근을 허용하면 정확한 현재 위치의 날씨를 보여드립니다. 도시는 언제든 직접 추가할 수 있습니다.', locNext: '다음', locNotNow: '나중에', locApprox: '위치 꺼짐 — 대략적인 날씨 표시', locEnable: '사용' },
  ar: { locTitle: 'الطقس في موقعك', locBody: 'اسمح بالوصول إلى الموقع لعرض توقعات الطقس لموقعك بالضبط. يمكنك دائمًا إضافة المدن يدويًا.', locNext: 'التالي', locNotNow: 'ليس الآن', locApprox: 'الموقع متوقف — عرض طقس تقريبي', locEnable: 'تفعيل' },
  hi: { locTitle: 'आपके स्थान का मौसम', locBody: 'अपने सटीक स्थान का पूर्वानुमान देखने के लिए स्थान पहुँच की अनुमति दें। आप शहर हमेशा मैन्युअल रूप से जोड़ सकते हैं।', locNext: 'आगे', locNotNow: 'अभी नहीं', locApprox: 'स्थान बंद — अनुमानित मौसम', locEnable: 'सक्षम करें' },
  it: { locTitle: 'Il meteo dove sei', locBody: 'Consenti l’accesso alla posizione per mostrare le previsioni del tuo luogo esatto. Puoi sempre aggiungere città manualmente.', locNext: 'Avanti', locNotNow: 'Non ora', locApprox: 'Posizione disattivata — meteo approssimativo', locEnable: 'Attiva' },
  nl: { locTitle: 'Het weer waar je bent', locBody: 'Geef toegang tot locatie om de voorspelling voor je exacte plek te tonen. Je kunt altijd handmatig steden toevoegen.', locNext: 'Volgende', locNotNow: 'Niet nu', locApprox: 'Locatie uit — geschat weer', locEnable: 'Inschakelen' },
  sv: { locTitle: 'Vädret där du är', locBody: 'Tillåt platsåtkomst så att vi kan visa prognosen för exakt din plats. Du kan alltid lägga till städer manuellt.', locNext: 'Nästa', locNotNow: 'Inte nu', locApprox: 'Plats av — ungefärligt väder', locEnable: 'Aktivera' },
  no: { locTitle: 'Været der du er', locBody: 'Tillat tilgang til posisjon så vi kan vise værmeldingen for stedet du er. Du kan alltid legge til byer manuelt.', locNext: 'Neste', locNotNow: 'Ikke nå', locApprox: 'Posisjon av — omtrentlig vær', locEnable: 'Aktiver' },
  da: { locTitle: 'Vejret hvor du er', locBody: 'Tillad placeringsadgang, så vi kan vise vejrudsigten for din præcise placering. Du kan altid tilføje byer manuelt.', locNext: 'Næste', locNotNow: 'Ikke nu', locApprox: 'Placering fra — omtrentligt vejr', locEnable: 'Aktivér' },
  el: { locTitle: 'Ο καιρός εκεί που είστε', locBody: 'Επιτρέψτε την πρόσβαση στην τοποθεσία για να δείξουμε την πρόγνωση για την ακριβή σας θέση. Μπορείτε πάντα να προσθέτετε πόλεις χειροκίνητα.', locNext: 'Επόμενο', locNotNow: 'Όχι τώρα', locApprox: 'Τοποθεσία ανενεργή — κατά προσέγγιση καιρός', locEnable: 'Ενεργοποίηση' },
  pl: { locTitle: 'Pogoda tam, gdzie jesteś', locBody: 'Zezwól na dostęp do lokalizacji, aby pokazać prognozę dla Twojego dokładnego miejsca. Miasta zawsze możesz dodać ręcznie.', locNext: 'Dalej', locNotNow: 'Nie teraz', locApprox: 'Lokalizacja wyłączona — pogoda przybliżona', locEnable: 'Włącz' },
  ru: { locTitle: 'Погода там, где вы', locBody: 'Разрешите доступ к геолокации, чтобы показать прогноз для вашего точного места. Города всегда можно добавить вручную.', locNext: 'Далее', locNotNow: 'Не сейчас', locApprox: 'Геолокация выключена — приблизительная погода', locEnable: 'Включить' },
  uk: { locTitle: 'Погода там, де ви', locBody: 'Дозвольте доступ до геолокації, щоб показати прогноз для вашого точного місця. Міста завжди можна додати вручну.', locNext: 'Далі', locNotNow: 'Не зараз', locApprox: 'Геолокацію вимкнено — приблизна погода', locEnable: 'Увімкнути' },
};

/**
 * Languages shown in the settings picker, with their native names — sorted
 * alphabetically by native name (Latin-script names first, then other scripts).
 */
export const LANGUAGES: { code: LanguageCode; name: string }[] = [
  { code: 'da', name: 'Dansk' },
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'no', name: 'Norsk' },
  { code: 'pl', name: 'Polski' },
  { code: 'pt', name: 'Português (Brasil)' },
  { code: 'sv', name: 'Svenska' },
  { code: 'el', name: 'Ελληνικά' },
  { code: 'ru', name: 'Русский' },
  { code: 'uk', name: 'Українська' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '简体中文' },
];

/** Right-to-left languages. */
export const RTL_LANGUAGES: LanguageCode[] = ['ar'];

/**
 * Map our language code to WeatherAPI's `lang` param (undefined = English
 * condition text). Norwegian ('no') isn't a WeatherAPI-supported lang, so its
 * condition text falls back to English while the UI stays fully translated.
 */
export function languageToApiLang(code: LanguageCode): string | undefined {
  if (code === 'en' || code === 'no') return undefined;
  return code;
}

/** Replace `{key}` placeholders in a template string. */
export function format(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, k: string) => String(params[k] ?? ''));
}

const MOON_PHASE_KEYS: Record<string, keyof Strings> = {
  'new moon': 'moonNew',
  'waxing crescent': 'moonWaxingCrescent',
  'first quarter': 'moonFirstQuarter',
  'waxing gibbous': 'moonWaxingGibbous',
  'full moon': 'moonFull',
  'waning gibbous': 'moonWaningGibbous',
  'last quarter': 'moonLastQuarter',
  'waning crescent': 'moonWaningCrescent',
};

/** Localize WeatherAPI's English moon-phase string; falls back to the input. */
export function localizedMoonPhase(strings: Strings, phase: string): string {
  const key = MOON_PHASE_KEYS[phase.trim().toLowerCase()];
  return key ? (strings[key] as string) : phase;
}
