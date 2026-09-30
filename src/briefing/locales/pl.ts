import type { PhraseBank } from '../types';

// Polish: hours read as "14:00". Templates only put hours after od / do / około /
// o / po, which all take the genitive or locative, so midnight is "północy" and
// numeric hours never need declining. Avoid "między … a …" and "przed …"
// (instrumental) with {start}/{end}/{t}.
const hour = (h: number): string => (h === 0 ? 'północy' : `${h}:00`);
const time = (h: number, m: number): string => `${h}:${String(m).padStart(2, '0')}`;
const duration = (min: number): string => `${Math.floor(min / 60)} godz. ${min % 60} min`;

export const pl: PhraseBank = {
  title: 'Twój dzień w skrócie',
  labels: {
    today: 'Dziś',
    tonight: 'Dziś w nocy',
    tomorrow: 'Jutro',
    laterToday: 'Po przebudzeniu',
  },
  hour,
  time,
  duration,

  greetings: {
    earlyBird: ['Na nogach przed słońcem? Szacun.', 'Ranny ptaszek! Pogoda dopiero przeciera oczy.'],
    morning: [
      'Dzień dobry! Twój dzień w pigułce.',
      'Dzień dobry! Najpierw kawa, potem to.',
      'Dzień dobry. Niebo ma dziś wobec ciebie plany.',
    ],
    midday: ['Południowy rzut oka na pogodę.', 'Półmetek dnia. Oto, co dalej.'],
    afternoon: ['Popołudnie! Oto, co zostało z dzisiejszego dnia.', 'Popołudniowy raport już jest.'],
    evening: ['Dobry wieczór! Noc i jutro w skrócie.', 'Wieczorna prognoza, podana na ciepło.'],
    late: ['Późno już? Oto noc i jutro.', 'Ostatni rzut oka przed snem.'],
    nightOwl: [
      'Jeszcze nie śpisz? Pogoda już dawno śpi.',
      'Nocny marek na posterunku. Oto, co nadciąga.',
    ],
    firstWorkday: ['Poniedziałek. Kawa, kawa i jeszcze raz kawa.', 'Poniedziałek rano. Głęboki wdech.'],
    midweek: ['Środa: półmetek tygodnia.', 'Środa! Od teraz już z górki.'],
    lastWorkday: ['Piątek, piąteczek, piątunio! Weekend na horyzoncie.', 'Piątek. Jeszcze tylko chwila.'],
    lastWorkdayEvening: ['Piątkowy wieczór! Oto zapowiedź weekendu.', 'Weekend zaczyna się teraz. Prognoza też.'],
    weekend: ['Jest {day}! Budzik ma dziś wolne.', 'Tryb weekendowy: włączony.'],
    weekendEnd: ['Niedzielny wieczór. Jutrzejsza pogoda, delikatnie.', 'Weekend się kończy. Oto, co dalej.'],
    newYear: ['Szczęśliwego Nowego Roku! Pierwsza prognoza w tym roku.'],
    newYearsEve: ['Sylwester! Ostatnia prognoza w tym roku.'],
    christmas: ['Wesołych Świąt! Prognoza zapakowana pod choinkę.'],
    halloween: ['Cukierek albo psikus? Prognoza bez psikusów.'],
    friday13: ['Piątek trzynastego. Przeczytaj prognozę… jeśli się odważysz.'],
    aprilFools: ['Prima aprilis. Ta prognoza to nie żart. Chyba.'],
    valentine: ['Szczęśliwych walentynek! Pogoda, z miłością.'],
    alert: ['Uwaga: nadchodzi niebezpieczna pogoda.', 'Ważne: pogoda wymaga dziś twojej uwagi.'],
  },

  lines: {
    // Deszcz
    rainAllDay: [
      'Deszcz od rana do wieczora. Niebo ma dużo do wypłakania.',
      'Mokro, mokrzej, najmokrzej: deszcz prawie nie robi przerw.',
      'Pogoda pod psem przez cały dzień. A pies i tak będzie chciał na spacer.',
    ],
    rainLater: [
      'Sucho do około {start}, potem deszcz do końca dnia.',
      'Masz coś do załatwienia na mieście? Zdąż do {start} – potem deszcz rozgości się na dobre.',
      'Korzystaj z suchej pogody: deszcz melduje się około {start} i zostaje po godzinach.',
    ],
    rainStops: [
      'Mokry początek, ale około {end} przestaje padać. Cierpliwość popłaca.',
      'Deszcz pakuje walizki około {end}. Wytrzymaj.',
      'Pada do około {end}, potem niebo się uspokaja.',
    ],
    rainWindow: [
      'Przelotne opady od {start} do {end}, wcześniej i później sucho. Wszystko jest kwestią wyczucia.',
      'Deszcz wpisany w grafik od {start} do {end}. Reszta dnia sucha.',
      'Mokre okienko od {start} do {end}: zaplanuj wyjścia wokół niego.',
    ],
    rainBrief: [
      'Krótki prysznic około {t}. Mrugniesz i po wszystkim – chyba że akurat jesteś na dworze.',
      'Jeden krótki przelotny deszcz około {t}, potem wszystko wraca do normy.',
    ],
    rainOnOff: [
      'Przelotne opady z przerwami. Niebo nie może się zdecydować.',
      'Kwiecień plecień, niezależnie od miesiąca: trochę deszczu, trochę słońca.',
      'Deszcz przychodzi i odchodzi jak kot pod drzwiami. Weź okulary i parasol, nie ufaj żadnemu z nich.',
    ],
    showersPossible: [
      'Od {start} do {end} może popadać. Może.',
      'Jest szansa na deszcz od {start} do {end}. Rzut monetą, właściwie.',
    ],
    rainCommuteAM: [
      'Deszcz około {start}, akurat na dojazd do pracy. No jasne.',
      'Deszcz zjawia się około {start}, w sam raz, żeby towarzyszyć ci w drodze do pracy.',
    ],
    rainCommutePM: [
      'Deszcz przychodzi około {start}, idealnie na powrót do domu.',
      'Cały dzień sucho, mokro w drodze powrotnej: deszcz od około {start}.',
    ],
    drizzle: [
      'Mżawka od {start} do {end}: niby nie deszcz, a jednak irytuje.',
      'Drobna mżawka od {start} do {end}. Twoje włosy zauważą ją przed tobą.',
    ],
    downpour: [
      'Około {t} możliwa ulewa. Będzie lało jak z cebra – nie czas na spacer.',
      'Około {t} niebo wylewa wiadro. Jeśli możesz, schowaj się pod dachem.',
    ],
    thunder: [
      'Możliwe burze od {start} do {end}. Gdy grzmi, schowaj się do budynku.',
      'Burze od {start} do {end}: błyski, grzmoty, pełen pakiet. Unikaj otwartych przestrzeni.',
    ],
    thunderSnow: ['Śnieg z grzmotami około {start}: śnieg I błyskawice. Rzadkie, dziwne i dość spektakularne.'],

    // Zima
    snowLight: [
      'Kilka płatków od {start} do {end}. Ładnie, nic więcej.',
      'Lekki śnieg od {start} do {end}: tryb pocztówki, nie tryb łopaty.',
    ],
    snow: [
      'Śnieg od {start} do {end}. Na drogach będzie ślisko, więc zwolnij.',
      'Pada śnieg od {start} do {end}. Gorąca czekolada oficjalnie usprawiedliwiona.',
    ],
    snowHeavy: [
      'Intensywne opady śniegu od {start} do {end}. Podróżowanie będzie utrudnione; wychodź tylko, jeśli musisz.',
      'Dużo śniegu od {start} do {end}. Spodziewaj się opóźnień i śliskich dróg.',
    ],
    blizzard: ['Zamieć śnieżna od około {start}: intensywny śnieg i silny wiatr. Jeśli możesz, zostań w domu.'],
    slush: [
      'Od około {start} mokry śnieg, który zamienia się w breję. Najgorsze z obu światów.',
      'Śnieg, który nie może się zdecydować, od około {start}. Chlapa gwarantowana, nieprzemakalne buty wskazane.',
    ],
    sleet: [
      'Deszcz ze śniegiem od {start} do {end}: deszcz, który nie odważył się zostać śniegiem.',
      'Deszcz ze śniegiem od {start} do {end}. Zimno, mokro i w poprzek.',
    ],
    freezingRain: [
      'Marznący deszcz od około {start}: drogi i chodniki mogą zamienić się w lodowisko. Jeśli możesz, unikaj podróży.',
      'Marznący deszcz około {start}. Każda powierzchnia może pokryć się lodem, zachowaj szczególną ostrożność.',
    ],

    // Lód i mgła
    blackIce: [
      'Około {t} prawdopodobna gołoledź. Chodź jak pingwin, jedź jak dziadek w niedzielę.',
      'Mokra nawierzchnia i mróz: uważaj na gołoledź około {t}.',
    ],
    frost: [
      'Mroźny poranek, temperatura spada do {low}. Skrobaczki w dłoń.',
      'Rano nawet {low}: szron na autach, trawnikach i może na humorze.',
    ],
    fogMorning: [
      'Mgła do około {end}. Światła mijania włączone, cierpliwość też.',
      'Mleko za oknem do około {end}. Widoki wrócą, obiecujemy.',
    ],
    fogTonight: [
      'Około {start} pojawi się mgła. Jedź powoli i włącz światła przeciwmgłowe.',
      'Mgła nadciąga około {start}. Bardzo klimatycznie, bardzo słaba widoczność.',
    ],
    freezingFog: ['Marznąca mgła do około {end}: słaba widoczność i śliskie nawierzchnie. Ostrożnie na drodze.'],

    // Niebo
    sunnyAllDay: [
      'Słońce od rana do wieczora, do {high}. Niebo nie ma nic do ukrycia.',
      'Cały dzień błękitne niebo, do {high}. Podejrzanie ładnie.',
    ],
    grayAllDay: [
      'Szaro od rana do wieczora. Słońce wzięło L4.',
      'Pięćdziesiąt odcieni szarości, głównie tych nudnych. Przynajmniej sucho.',
    ],
    clearingLater: [
      'Pochmurny początek, ale około {t} przebija się słońce. Warto poczekać.',
      'Chmury zwijają się około {t}; druga połowa dnia wygląda dużo lepiej.',
    ],
    cloudingLater: [
      'Słoneczny początek, chmury nadciągają około {t}. Łap słońce wcześnie.',
      'Korzystaj ze słońca, póki jest: około {t} chmury przejmują stery.',
    ],
    perfectDay: [
      'Dzień jak z podręcznika: sucho, słonecznie, {high}. Siedzenie w domu to twój wybór.',
      '{high}, słońce, zero deszczu. Szczerze? Lepiej już nie będzie.',
      'Pogoda z najwyższej półki: sucho, jasno i {high}. Znajdź pretekst, żeby wyjść.',
    ],

    // Temperatura
    bigSwing: [
      'Od {low} rano do {high} po południu. Ubierz się na cebulkę.',
      '{low} rano, {high} później. Kurtka spędzi popołudnie w twojej ręce.',
    ],
    warm: [
      'Ciepło, do {high}. Krótkie spodenki to w pełni uzasadniony wybór.',
      'Do {high}: wystarczająco ciepło, żeby lody uznać za obiad.',
    ],
    hot: [
      'Upał: odczuwalnie {feels} od {start} do {end}. Cień, woda i zwolnij.',
      'Odczuwalnie {feels} od {start} do {end}. Wszystko, co męczące: wcześniej albo później.',
    ],
    extremeHeat: [
      'Ekstremalny upał, odczuwalnie {feels}. Unikaj słońca od {start} do {end}, pij często i sprawdzaj, jak czują się osoby wrażliwe.',
    ],
    tropicalNight: [
      'Tropikalna noc: temperatura nie spadnie poniżej {low}. Spanie będzie sportem wytrzymałościowym.',
      'W nocy tylko do {low}. Wiatrak włączony, kołdra do szafy.',
    ],
    freezingDay: [
      'Mróz przez cały dzień, najwyżej {high}. Na zewnątrz jak w zamrażarce.',
      'Odwilży nie widać: najwyżej {high}. Rękawiczki obowiązkowe.',
    ],
    bitterCold: [
      'Przenikliwe zimno: odczuwalnie {feels}. Zakryj każdy skrawek skóry.',
      'Odczuwalnie {feels}. Nawet pingwin poprosiłby o szalik.',
    ],
    extremeCold: [
      'Niebezpieczny mróz, odczuwalnie {feels}. Odmrożenia mogą pojawić się w kilka minut; ogranicz czas na zewnątrz.',
    ],
    windChill: [
      'Termometr mówi swoje, a wiatr mówi {feels}. Wierz wiatrowi.',
      'Przez wiatr odczuwalnie {feels}. Kaptur na głowę.',
    ],
    muggy: [
      'Parno i lepko: w południe poczujesz się jak pieróg na parze.',
      'Tak wilgotno, że można pływać w powietrzu. Przewiewne ubrania, proszę.',
    ],
    tempDrop: [
      'Gwałtowny spadek temperatury około {t}: w kilka godzin o {diff} chłodniej. Miej kurtkę pod ręką.',
      'Około {t} wkracza chłodny front i zabiera {diff}.',
    ],
    eveningChill: [
      'Szybko się ochładza: {low} około {t}. Kurtka, której teraz nie potrzebujesz? Weź ją.',
      'Około {t} już tylko {low}. Wieczór ma inny dress code.',
    ],
    warmForSeason: [
      '{high}? Jak na tę porę roku to prawie prezent.',
      'Nietypowo ciepło: {high}. Przyroda chyba zgubiła kalendarz.',
    ],
    coldForSeason: [
      'Tylko {high}. Pora roku chyba wcisnęła drzemkę.',
      'Najwyżej {high}. Niezbyt sezonowo, ale cóż.',
    ],
    sunnyButCold: [
      'Pełne słońce, najwyżej {high}: dużo blasku, mało ciepła.',
      'Słonecznie, ale tylko {high}. Zza szyby wygląda ciepło. Nie jest.',
    ],

    // Wiatr
    breezy: [
      'Wietrznie, porywy do {wind}. Zły dzień dla fryzury, dobry dla latawca.',
      'Rześki wiatr, do {wind}. Trzymaj czapkę.',
    ],
    windy: [
      'Silny wiatr, do {wind}. Parasole wywiną się na drugą stronę.',
      'Wiatr do {wind}. Przymocuj lekkie rzeczy. I fryzurę.',
    ],
    gale: [
      'Bardzo silny wiatr, do {wind}. Zabezpiecz meble ogrodowe i uważaj na spadające gałęzie.',
      'Porywy do {wind}. To nie jest dzień na noszenie dużej płyty gipsowej.',
    ],
    storm: ['Wiatr o sile sztormu, do {wind}. Trzymaj się z dala od drzew, rusztowań i wybrzeża.'],
    hurricane: ['Wiatr o sile huraganu, do {wind}. Stosuj się do poleceń lokalnych władz.'],

    // Ekspozycja
    uvHigh: [
      'UV {uv} około {t}. Krem z filtrem, chyba że celujesz w odcień gotowanego raka.',
      'Indeks UV sięga {uv} około {t}. Okulary przeciwsłoneczne i krem z filtrem.',
    ],
    uvVeryHigh: [
      'Bardzo wysokie UV ({uv}) od {start} do {end}. Krem z filtrem i cień, serio.',
      'UV {uv} od {start} do {end}: skóra przypieka się szybciej niż tost.',
    ],
    uvExtreme: [
      'Ekstremalne UV ({uv}). Niechroniona skóra oparzy się w kilka minut: zakryj się i szukaj cienia w południe.',
    ],
    airPoor: [
      'Słaba jakość powietrza. Smog nie śpi – może dziś bieżnia zamiast parku?',
      'Powietrze nie jest dziś najlepsze. Wrażliwe płuca, spokojnie.',
    ],
    airVeryPoor: [
      'Bardzo zła jakość powietrza. Ogranicz wysiłek na zewnątrz, zwłaszcza jeśli należysz do osób wrażliwych.',
    ],

    // Noc
    clearNight: [
      'Bezchmurna noc, spadek do {low}. Dobra noc, żeby spojrzeć w górę.',
      'Gwiaździsta noc, najzimniej {low}.',
    ],
    calmNight: [
      'Spokojna noc, spadek do {low}. Pogoda ma wolne.',
      'Nic do zgłoszenia: najzimniej {low}. Śpij dobrze.',
    ],
    nightRainAll: [
      'Deszcz przez całą noc. Świetny szum do snu, gorszy spacer z psem.',
      'Pada do rana. Rynny będą miały pełne ręce roboty.',
    ],
    nightRainFrom: [
      'Deszcz przychodzi około {start} i zostaje na noc. Zabierz poduszki z balkonu.',
      'Sucho do {start}, potem deszcz bębni po dachach całą noc.',
    ],
    nightRainUntil: [
      'Pada do około {end}, potem sucho do rana.',
      'Deszcz kładzie się spać około {end}.',
    ],
    nightRainWindow: [
      'Deszcz od {start} do {end}, poza tym sucho.',
      'Mokro od {start} do {end}, potem znów spokój.',
    ],
    nightSnow: [
      'Śnieg od około {start}. Możesz obudzić się w białym świecie.',
      'Śnieg w nocy od {start}. Jutro: pocztówka za oknem, lodowisko na drodze.',
    ],
    nightStorm: [
      'Możliwe burze od {start} do {end}. Wyłącz z prądu to, na czym ci zależy.',
      'Burze od {start} do {end}. Pies będzie chciał spać w twoim łóżku.',
    ],

    // Jutro
    tomorrowColder: [
      'O około {diff} chłodniej, najwyżej {high}. Wyciągnij ciepłą kurtkę już dziś.',
      'Temperatura spada o {diff}: najwyżej {high}. Ciesz się dzisiejszym dniem.',
    ],
    tomorrowWarmer: [
      'O około {diff} cieplej, do {high}. Jest na co czekać.',
      'Skok o {diff}, do {high}. Jutro sobie podziękujesz.',
    ],

    // Spokojnie
    calmSunny: [
      'Słonecznie i bez wydarzeń, od {low} do {high}. Pogoda ma dzień wolny.',
      'Spokojnie i przyjemnie: słońce, od {low} do {high}, nic, czym trzeba się martwić.',
    ],
    calmCloudy: [
      'Pochmurno, ale sucho, od {low} do {high}. Bez emocji, ale i bez problemu.',
      'Szaro i spokojnie, od {low} do {high}. Idealnie przeciętny dzień.',
    ],
    calmMixed: [
      'Słońce i chmury na zmianę, od {low} do {high}. Bez dramatów.',
      'Wszystkiego po trochu, poza deszczem: od {low} do {high}.',
    ],

    // Dodatki
    fullMoon: [
      'Pełnia księżyca i bezchmurne niebo. Wilkołaki w pogotowiu.',
      'Pełnia i czyste niebo: nocna lampka natury włączona.',
    ],
    supermoon: ['Superksiężyc dziś w nocy: Księżyc jest wyjątkowo blisko i wyjątkowo jasny. Spójrz w górę!'],
    newMoonStars: [
      'Nów i bezchmurne niebo: idealnie do oglądania gwiazd. Uciekaj od miejskich świateł.',
      'Bez księżyca, bez chmur: dziś scena należy do gwiazd.',
    ],
    meteors: [
      '{name} mają dziś w nocy maksimum: nawet {rate} spadających gwiazd na godzinę. Przygotuj życzenia.',
      'Bezchmurna noc, a {name} w szczycie: do {rate} meteorów na godzinę. Patrz w górę, z dala od świateł.',
    ],
    goldenHour: [
      'Złota godzina od {golden}, zachód słońca o {sunset}. Fotografowie, na stanowiska!',
      'Bezchmurny zachód słońca ({sunset}). Warto wyjrzeć przez okno około {golden}.',
    ],
    sunriseClear: ['Wschód słońca o {sunrise} przy czystym niebie. Ranne ptaszki mają pokaz.'],
    midnightSun: ['Słońce dziś nie zajdzie. Zasłony zaciemniające to twoi najlepsi przyjaciele.'],
    polarNight: ['Dziś słońce nie wzejdzie: noc polarna. Witamina D, świeczki i dobre towarzystwo.'],
    longestDay: ['Najdłuższy dzień w roku: {daylight} światła. Wykorzystaj go dobrze (najlepiej na zewnątrz).'],
    shortestDay: ['Najkrótszy dzień w roku: tylko {daylight} światła. Od jutra światło kontratakuje.'],
    springEquinox: ['Równonoc wiosenna: dzień równa się nocy. Od teraz wygrywa światło.'],
    autumnEquinox: ['Równonoc jesienna: dzień równa się nocy. Od teraz wygrywają noce. Koce w pogotowiu.'],
    earlySunset: ['Zachód słońca o {sunset}. Tak, już.', 'Słońce kończy zmianę o {sunset}. Szczęściarz.'],
    lateSunset: ['Zachód słońca dopiero o {sunset}: przed tobą długi wieczór.'],
    whiteChristmas: ['Śnieg na święta: prawdziwie biała Gwiazdka. Brakuje tylko Kevina w telewizji.'],
    greenChristmas: ['{high} w święta. Mikołaj może zamienić sanie na hulajnogę.'],
    nyeDry: ['Około północy: sucho, {low}. Idealnie na fajerwerki.'],
    nyeWet: ['Około północy możliwe opady: sylwestrowe fajerwerki pod parasolem.'],
    halloween: ['Halloween przy takiej pogodzie? Upiorny klimat gratis.'],
  },

  tips: {
    umbrella: [
      'Parasol: tak. Zamszowe buty: nie.',
      'Weź parasol. Wieczorem sobie podziękujesz.',
      'Parasol do torby. Waży mniej niż żal.',
    ],
    raincoat: [
      'Deszcz plus wiatr = parasol bez szans. Lepiej kurtka z kapturem.',
      'Nie ma złej pogody, są tylko źle ubrani ludzie. Dziś: kurtka z kapturem, parasol zostaje w domu.',
    ],
    snowBoots: ['Dziś porządne buty: przyczepność ważniejsza niż styl.', 'Buty z dobrą podeszwą i wyjdź trochę wcześniej.'],
    snowman: ['Śnieg i wolne: czas na bałwana. Marchewka we własnym zakresie.'],
    layers: [
      'Warstwy: po południu je zdejmiesz, wieczorem założysz z powrotem.',
      'Ubierz się na cebulkę: kilka warstw do zdejmowania po kolei.',
    ],
    sunscreen: [
      'Krem z filtrem, nawet jeśli to nie dzień na plażę. Zwłaszcza na nos.',
      'Filtr i okulary przeciwsłoneczne. Skóra podziękuje ci za 20 lat.',
    ],
    scrape: [
      'Wyjdź 5 minut wcześniej, żeby oskrobać szybę.',
      'Skrobaczka w pogotowiu. Gorąca woda na szybę: nigdy.',
    ],
    hydrate: [
      'Butelka wody obowiązkowo. Kawa się nie liczy.',
      'Pij, zanim poczujesz pragnienie, i w południe trzymaj się cienia.',
    ],
    bundleUp: ['Czapka, rękawiczki, szalik. Babcia miała rację.', 'Ubierz się ciepło. A potem dołóż jeszcze jedną warstwę.'],
    laundry: [
      'Idealna pogoda na pranie: słońce, wiaterek, zero deszczu. Suszarka ma wolne.',
      'Wywieś pranie, wyschnie w rekordowym tempie.',
    ],
    terrace: [
      'Ciepły wieczór przed tobą: taras, grill albo piknik – wybieraj.',
      'Wieczór stworzony do jedzenia na świeżym powietrzu. Grill sam się nie rozpali.',
    ],
    mosquitoes: ['Ciepły, parny wieczór: komary są na liście gości. Weź środek na komary.'],
    noCarWash: ['Myjnia? Jutrzejszy deszcz umyje auto za darmo.'],
    stayIn: [
      'Jeśli możesz, zostań w domu, naładuj telefon i miej pod ręką latarkę.',
      'Odłóż wszystkie niekonieczne podróże i miej naładowany telefon.',
    ],
    secureObjects: ['Przymocuj lub schowaj wszystko, co może odlecieć: kosze na śmieci, trampoliny, krzesła ogrodowe.'],
    extraTime: ['Zaplanuj więcej czasu na dojazd i chodź ostrożnie.', 'Zwolnij na drodze i daj sobie zapas czasu.'],
    jacketEvening: ['Weź kurtkę na wieczór, nawet jeśli teraz wydaje się to niedorzeczne.'],
  },

  meteorNames: {
    quadrantids: 'Kwadrantydy',
    lyrids: 'Lirydy',
    etaAquariids: 'Eta Akwarydy',
    perseids: 'Perseidy',
    orionids: 'Orionidy',
    leonids: 'Leonidy',
    geminids: 'Geminidy',
  },
};
