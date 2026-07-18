import type { Types } from '@wanderlust/common';

type Insert = Types.Cities.$Insert.City;

export const data: Insert[] = [
	{
		id: 'rome',
		name: 'Rome',
		stateCode: '62',
		stateName: 'Lazio',
		countryCode: 'IT',
		countryName: 'Italy',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/rome.webp',
		lat: 41.893333,
		lng: 12.482778,
		description:
			"Rome is the capital city of Italy. With 2,860,009 residents in 1,285 km2 (496.1 sq mi), Rome is the country's most populated comune and the third most populous city in the European Union by population within city limits. Rome is located in the central-western portion of the Italian Peninsula, within Lazio (Latium), along the shores of the Tiber Valley. Vatican City (the smallest country in the world and headquarters of the worldwide Catholic Church under the governance of the Holy See) is an independent country inside the city boundaries of Rome, the only existing example of a country within a city. Rome is often referred to as the City of Seven Hills due to its geographic location, and also as the Eternal City. Rome is generally considered to be the cradle of Western civilization and Western Christian culture, and the centre of the Catholic Church.",
		timezone: 'Europe/Rome',
		attributions: [
			{
				type: 'image',
				text: 'By Diliff - Own work, CC BY 3.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=3943681',
			},
		],
	},
	{
		id: 'milan',
		name: 'Milan',
		stateCode: '25',
		stateName: 'Lombardy',
		countryCode: 'IT',
		countryName: 'Italy',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/milan.webp',
		lat: 45.466944,
		lng: 9.19,
		description:
			'Milan is a city in northern Italy, regional capital of Lombardy, the largest city in Italy by urban population and the second-most-populous city proper in Italy after Rome. The city proper has a population of about 1.4 million, while its metropolitan city has 3.22 million residents. The urban area of Milan is the fourth-most-populous in the EU with 6.17 million inhabitants. Milan is the economic capital of Italy, one of the economic capitals of Europe and a global financial centre. Milan is a leading alpha global city, with strengths in the fields of art, chemicals, commerce, design, education, entertainment, fashion, finance, healthcare, media (communication), services, research, and tourism. In terms of GDP, Milan is the wealthiest city in Italy, having also one of the largest economies among EU cities.',
		timezone: 'Europe/Rome',
		attributions: [
			{
				type: 'image',
				text: 'By Deensel - Basilica of San Carlo al Corso, CC BY 2.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=73531334',
			},
		],
	},
	{
		id: 'turin',
		name: 'Turin',
		stateCode: '21',
		stateName: 'Piedmont',
		countryCode: 'IT',
		countryName: 'Italy',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/turin.webp',
		lat: 45.079167,
		lng: 7.676111,
		description:
			'Turin is a city and an important business and cultural centre in Northern Italy. It is the capital city of Piedmont and of the Metropolitan City of Turin, and was the first Italian capital from 1861 to 1865. The city is mainly on the western bank of the Po River, below its Susa Valley, and is surrounded by the western Alpine arch and Superga hill. The city was historically a major European political centre. From 1563, it was the capital of the Duchy of Savoy, then of the Kingdom of Sardinia ruled by the House of Savoy, and the first capital of the Kingdom of Italy from 1862 to 1865. Turin is sometimes called "the cradle of Italian liberty" for having been the political and intellectual centre of the Risorgimento that led to the unification of Italy, as well as the birthplace of notable individuals who contributed to it, such as Camillo Benso, Count of Cavour. Turin became a major European crossroad for industry, commerce and trade, and is part of the industrial triangle along with Milan and Genoa.',
		timezone: 'Europe/Rome',
		attributions: [
			{
				type: 'image',
				text: 'By Hpnx9420 - Own work, CC BY 3.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=116005874',
			},
		],
	},
	{
		id: 'paris',
		name: 'Paris',
		stateCode: 'IDF',
		stateName: 'Île-de-France',
		countryCode: 'FR',
		countryName: 'France',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/paris.webp',
		lat: 48.856667,
		lng: 2.352222,
		description:
			"Paris is the capital and largest city of France. Since the 17th century, Paris has been one of the world's major centres of finance, diplomacy, commerce, culture, fashion, and gastronomy. For its leading role in the arts and sciences, as well as its early and extensive system of street lighting, in the 19th century, it became known as the City of Light. Paris is known for its museums and architectural landmarks: the Louvre received 8.9 million visitors in 2023, on track for keeping its position as the most-visited art museum in the world. The historical district along the Seine in the city centre has been classified as a UNESCO World Heritage Site since 1991. Every July, the Tour de France bicycle race finishes on the Avenue des Champs-Élysées in Paris.",
		timezone: 'Europe/Paris',
		attributions: [
			{
				type: 'image',
				text: 'By Yann Caradec from Paris, France - La Tour Eiffel vue de la Tour Saint-Jacques, CC BY-SA 2.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=34933538',
			},
		],
	},
	{
		id: 'london',
		name: 'London',
		stateCode: 'ENG',
		stateName: 'England',
		countryCode: 'GB',
		countryName: 'United Kingdom',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/london.webp',
		lat: 51.507222,
		lng: -0.1275,
		description:
			"London is the capital and largest city of both England and the United Kingdom. London stands on the River Thames in southeast England, and has been a major settlement for nearly 2,000 years. Its ancient core and financial centre, the City of London, was founded by the Romans. London grew rapidly in the 19th century, becoming the world's largest city at the time. As one of the world's major global cities, London exerts a strong influence on world art, entertainment, fashion, commerce, finance, education, healthcare, media, science, technology, tourism, transport, and communications. It is the most visited city in Europe and has the world's busiest city airport system. The London Underground is the world's oldest rapid transit system. Four World Heritage Sites are located in London: Kew Gardens; the Tower of London; the Palace of Westminster, Church of St. Margaret, and Westminster Abbey; and the Greenwich where the Royal Observatory defines the prime meridian and Greenwich Mean Time.",
		timezone: 'Europe/London',
		attributions: [
			{
				type: 'image',
				text: 'By Ilya Grigorik - Imported from 500px (archived version) by the Archive Team. (detail page), CC BY-SA 3.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=74181523',
			},
		],
	},
	{
		id: 'patras',
		name: 'Patras',
		stateCode: 'G',
		stateName: 'West Greece Region',
		countryCode: 'GR',
		countryName: 'Greece',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/patras.webp',
		lat: 38.25,
		lng: 21.733333,
		description:
			"Patras is Greece's third-largest city and the regional capital and largest city of Western Greece. The city is built at the foot of Mount Panachaikon. The core settlement has a history spanning four millennia. In the Roman period, it had become a cosmopolitan center of the eastern Mediterranean whilst, according to the Christian tradition, it was also the place of Saint Andrew's martyrdom. Dubbed as Greece's 'Gate to the West', Patras is a commercial hub. The city has three public universities, hosting a large student population and rendering Patras an important scientific centre. Every year, in February, the city hosts one of Europe's largest carnivals. Notable features of the Patras Carnival include its mammoth satirical floats and balls and parades, enjoyed by hundreds of thousands of visitors in a Mediterranean climate. Patras is also famous for supporting an indigenous cultural scene active mainly in the performing arts and modern urban literature. It was European Capital of Culture in 2006.",
		timezone: 'Europe/Athens',
		attributions: [
			{
				type: 'image',
				text: 'By Stanislav Amelchyts, CC BY-SA 3.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=54987578',
			},
		],
	},
	{
		id: 'heraklion',
		name: 'Heraklion',
		stateCode: 'M',
		stateName: 'Crete Region',
		countryCode: 'GR',
		countryName: 'Greece',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/heraklion.webp',
		lat: 35.340278,
		lng: 25.134444,
		description:
			"Heraklion or Herakleion, sometimes Iraklion, is the largest city and the administrative capital of the island of Crete and capital of Heraklion regional unit. It is the fourth largest city in Greece with a municipal population of 179,302 (2021) and 211,370 in its wider metropolitan area, according to the 2011 census. The greater area of Heraklion has been continuously inhabited since at least 7000 BCE, making it one of the oldest inhabited regions in Europe. It is also home to the ancient Knossos Palace, a major center of the Minoan civilization dating back to approximately 2000-1350 BCE, often considered Europe's oldest city. The palace is one of the most significant archaeological sites in Greece, second only to the Parthenon in terms of visitor numbers. Heraklion was Europe's fastest growing tourism destination for 2017, according to Euromonitor, with an 11.2% growth in international arrivals.",
		timezone: 'Europe/Athens',
		attributions: [
			{
				type: 'image',
				text: 'By Taxiarchos228 - Own work, FAL',
				link: 'https://commons.wikimedia.org/w/index.php?curid=30686741',
			},
		],
	},
	{
		id: 'innsbruck',
		name: 'Innsbruck',
		stateCode: '7',
		stateName: 'Tyrol',
		countryCode: 'AT',
		countryName: 'Austria',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/innsbruck.webp',
		lat: 47.268333,
		lng: 11.393333,
		description:
			'Innsbruck is the capital of Tyrol and the fifth-largest city in Austria. On the River Inn, at its junction with the Wipp Valley, which provides access to the Brenner Pass 30 km to the south. In the broad valley between high mountains, the so-called North Chain in the Karwendel Alps to the north and Patscherkofel and Serles to the south, Innsbruck is an internationally renowned winter sports centre; it hosted the 1964 and 1976 Winter Olympics as well as the 1984 and 1988 Winter Paralympics. It also hosted the first Winter Youth Olympics in 2012. The name means "bridge over the Inn". Innsbruck is a very popular tourist destination, organizing the following events every year: Innsbrucker Tanzsommer, Bergsilvester, Innsbrucker Festwochen der Alten Musik, Los Gurkos Short Film Festival, Christkindlmarkt. In 1971, author Douglas Adams was inspired to write the internationally successful The Hitchhiker\'s Guide to the Galaxy series while lying intoxicated in a field in Innsbruck.',
		timezone: 'Europe/Vienna',
		attributions: [
			{
				type: 'image',
				text: 'By Taxiarchos228 - Own work, FAL',
				link: 'https://commons.wikimedia.org/w/index.php?curid=78239384',
			},
		],
	},
	{
		id: 'lisbon',
		name: 'Lisbon',
		stateCode: '11',
		stateName: 'Lisbon',
		countryCode: 'PT',
		countryName: 'Portugal',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/lisbon.webp',
		lat: 38.725278,
		lng: -9.15,
		description:
			"Lisbon is the capital and largest city of Portugal. Lisbon is mainland Europe's westernmost capital city (second overall after Reykjavik) and the only one along the Atlantic coast, the others (Reykjavik and Dublin) being on islands. The city lies in the western portion of the Iberian Peninsula, on the northern shore of the River Tagus. The western portion of its metro area, the Portuguese Riviera, hosts the westernmost point of Continental Europe, culminating at Cabo da Roca. Lisbon is one of the oldest cities in the world and the second-oldest European capital city (after Athens), predating other modern European capitals by centuries. Lisbon is recognised as an alpha-level global city because of its importance in finance, commerce, fashion, media, entertainment, arts, international trade, education, and tourism. Lisbon is amongst the two Portuguese cities (the other being Porto) to be recognised as a global city.",
		timezone: 'Europe/Lisbon',
		attributions: [
			{
				type: 'image',
				text: 'By Vitor Oliveira from Torres Vedras, PORTUGAL - Lisboa - Portugal 🇵🇹, CC BY-SA 2.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=128320765',
			},
		],
	},
	{
		id: 'madrid',
		name: 'Madrid',
		stateCode: 'MD',
		stateName: 'Madrid',
		countryCode: 'ES',
		countryName: 'Spain',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/madrid.webp',
		lat: 40.416944,
		lng: -3.703333,
		description:
			"Madrid is the capital and most populous city of Spain. The capital city of both Spain and the surrounding autonomous community of Madrid, it is also the political, economic, and cultural centre of the country. The climate of Madrid features hot summers and cool winters. While Madrid possesses modern infrastructure, it has preserved the look and feel of many of its historic neighbourhoods and streets. Its landmarks include the Plaza Mayor, the Royal Palace of Madrid; the Royal Theatre with its restored 1850 Opera House; the Buen Retiro Park, founded in 1631; the 19th-century National Library building (founded in 1712) containing some of Spain's historical archives; many national museums, and the Golden Triangle of Art, located along the Paseo del Prado and comprising three art museums: Prado Museum, the Reina Sofía Museum, a museum of modern art, and the Thyssen-Bornemisza Museum. Cibeles Palace and Fountain has become one of the monument symbols of the city.",
		timezone: 'Europe/Madrid',
		attributions: [
			{
				type: 'image',
				text: 'By jsogo - Palaciorealycatedraldelaalmudena.jpg, CC BY 2.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=142460121',
			},
		],
	},
	{
		id: 'athens',
		name: 'Athens',
		stateCode: 'I',
		stateName: 'Attica Region',
		countryCode: 'GR',
		countryName: 'Greece',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/athens.webp',
		lat: 37.984167,
		lng: 23.728056,
		description:
			"Athens is the capital and largest city of Greece. A major coastal urban area in the Mediterranean, Athens is also the capital of the Attica region and is the southernmost capital on the European mainland. Athens is one of the world's oldest cities, with its recorded history spanning over 3,400 years, and its earliest human presence beginning somewhere between the 11th and 7th millennia BC. According to Greek mythology the city was named after Athena, the ancient Greek goddess of wisdom, but modern scholars generally agree that the goddess took her name after the city. Classical Athens was one of the most powerful city-states in ancient Greece. It was a centre for democracy, the arts, education and philosophy, and was highly influential throughout the European continent, particularly in Ancient Rome. For this reason, it is often regarded as the cradle of Western civilization and the birthplace of democracy in its own right independently from the rest of Greece.",
		timezone: 'Europe/Athens',
		attributions: [
			{
				type: 'image',
				text: 'By dronepicr - Monastiraki Square and Acropolis in Athens, CC BY 2.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=75612185',
			},
		],
	},
	{
		id: 'thessaloniki',
		name: 'Thessaloniki',
		stateCode: 'B',
		stateName: 'Central Macedonia',
		countryCode: 'GR',
		countryName: 'Greece',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/thessaloniki.webp',
		lat: 40.640278,
		lng: 22.935556,
		description:
			"Thessaloniki, also known as Thessalonica, is the second-largest city in Greece, with slightly over one million inhabitants in its metropolitan area, and the capital of the geographic region of Macedonia, the administrative region of Central Macedonia and the Decentralized Administration of Macedonia and Thrace. Thessaloniki is located on the Thermaic Gulf, at the northwest corner of the Aegean Sea. It is bounded on the west by the delta of the Axios. It is Greece's second major economic, industrial, commercial and political centre, and a major transportation hub for Greece and southeastern Europe, notably through the Port of Thessaloniki. The city is renowned for its festivals, events and vibrant cultural life in general. Events such as the Thessaloniki International Fair and the Thessaloniki International Film Festival are held annually.",
		timezone: 'Europe/Athens',
		attributions: [
			{
				type: 'image',
				text: 'By User:JFKennedy - Own work, Public Domain',
				link: 'https://commons.wikimedia.org/w/index.php?curid=151188664',
			},
		],
	},
	{
		id: 'city-of-westminster',
		name: 'City of Westminster',
		stateCode: 'ENG',
		stateName: 'England',
		countryCode: 'GB',
		countryName: 'United Kingdom',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/city-of-westminster.webp',
		lat: 51.494722,
		lng: -0.135278,
		description:
			"Westminster is the main settlement of the City of Westminster in London, England. It extends from the River Thames to Oxford Street and has many famous landmarks, including the Palace of Westminster, Buckingham Palace, Westminster Abbey, Westminster Cathedral, Trafalgar Square and much of the West End cultural centre including the entertainment precinct of West End Theatre. The name originated from the informal description of the abbey church and royal peculiar of St Peter's (Westminster Abbey), west of the City of London (until the English Reformation there was also an Eastminster, near the Tower of London, in the East End of London). The abbey's origins date from between the 7th and 10th centuries, but it rose to national prominence when rebuilt by Edward the Confessor in the 11th century. Westminster has been the home of England's government since about 1200, and from 1707 the Government of the United Kingdom. In 1539, it became a city.",
		timezone: 'Europe/London',
		attributions: [
			{
				type: 'image',
				text: 'By © User:Colin / Wikimedia Commons, CC BY-SA 4.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=35624446',
			},
		],
	},
	{
		id: 'copenhagen',
		name: 'Copenhagen',
		stateCode: '84',
		stateName: 'Capital Region of Denmark',
		countryCode: 'DK',
		countryName: 'Denmark',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/copenhagen.webp',
		lat: 55.676111,
		lng: 12.568333,
		description:
			"Copenhagen is the capital and most populous city of Denmark. The city is situated on the islands of Zealand and Amager, separated from Malmö, Sweden, by the Øresund strait. The Øresund Bridge connects the two cities by rail and road. The city flourished as the cultural and economic centre of Scandinavia during the Renaissance, and by the 17th century, it had become a regional centre of power. With several bridges connecting the various districts, the cityscape is characterised by parks, promenades, and waterfronts. Copenhagen's landmarks such as Tivoli Gardens, The Little Mermaid statue, the Amalienborg and Christiansborg palaces, Rosenborg Castle, Frederik's Church, Børsen and many museums, restaurants and nightclubs are significant tourist attractions. The University of Copenhagen, founded in 1479, is the oldest university in Denmark. Copenhagen is one of the most bicycle-friendly cities in the world.",
		timezone: 'Europe/Copenhagen',
		attributions: [
			{
				type: 'image',
				text: 'By Moahim - Own work, CC BY-SA 4.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=72871990',
			},
		],
	},
	{
		id: 'ankara',
		name: 'Ankara',
		stateCode: '06',
		stateName: 'Ankara',
		countryCode: 'TR',
		countryName: 'Turkey',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/ankara.webp',
		lat: 39.93,
		lng: 32.85,
		description:
			"Ankara, historically known as Ancyra and Angora, is the capital of Turkey. Located in the central part of Anatolia, the city has a population of 5.1 million in its urban center and 5.8 million in Ankara Province, making it Turkey's second-largest city after Istanbul, but the first by urban area.",
		timezone: 'Europe/Istanbul',
		attributions: [
			{
				type: 'image',
				text: 'A.Savin - Yükleyenin kendi çalışması, FAL',
				link: 'https://commons.wikimedia.org/w/index.php?curid=114868158',
			},
		],
	},
	{
		id: 'bristol',
		name: 'Bristol',
		stateCode: 'ENG',
		stateName: 'England',
		countryCode: 'GB',
		countryName: 'United Kingdom',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/bristol.webp',
		lat: 51.453611,
		lng: -2.5975,
		description:
			"Bristol is a city, unitary authority area and ceremonial county in South West England, the most populous city in the region. Built around the River Avon, it is bordered by the ceremonial counties of Gloucestershire to the north and Somerset to the south. A major port, Bristol was a starting place for early voyages of exploration to the New World. The city's modern economy is built on the creative media, electronics and aerospace industries; the city-centre docks have been redeveloped as cultural and heritage centres. There are a variety of artistic and sporting organisations and venues including the Royal West of England Academy, the Arnolfini, Ashton Gate and the Memorial Stadium. The city has two universities; the University of Bristol and the University of the West of England (UWE Bristol). Bristol was named the best city in Britain in which to live in 2014 and 2017; it won the European Green Capital Award in 2015.",
		timezone: 'Europe/London',
		attributions: [
			{
				type: 'image',
				text: "By Harbour View, Bristol by Anthony O'Neil, CC BY-SA 2.0",
				link: 'https://commons.wikimedia.org/w/index.php?curid=136635101',
			},
		],
	},
	{
		id: 'aarhus',
		name: 'Aarhus',
		stateCode: '82',
		stateName: 'Central Denmark Region',
		countryCode: 'DK',
		countryName: 'Denmark',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/aarhus.webp',
		lat: 56.1572,
		lng: 10.2107,
		description:
			"Aarhus is the second-largest city in Denmark. In 1928, the first university in Jutland was founded in Aarhus and today it is a university city and the largest centre for trade, services, industry, and tourism in Jutland. Aarhus Cathedral is the longest cathedral in Denmark with a total length of 93 m (305 ft). The Church of our Lady (Vor Frue Kirke) was originally built in 1060, making it the oldest stone church in Scandinavia. The City Hall, designed by Arne Jacobsen and Erik Møller, was completed in 1941 in a modern Functionalist style. Aarhus Theatre, the largest provincial theatre in Denmark, opposite the cathedral on Bispetorvet, was built by Hack Kampmann in the Art Nouveau style and completed in 1916. Musikhuset Aarhus (concert hall) and Det Jyske Musikkonservatorium (Royal Academy of Music, Aarhus/Aalborg) are also of note, as are its museums including the open-air museum Den Gamle By, the art museum ARoS Aarhus Kunstmuseum, the Moesgård Museum and the women's museum Kvindemuseet.",
		timezone: 'Europe/Copenhagen',
		attributions: [
			{
				type: 'image',
				text: 'By Steve Knight from Halstead, United Kingdom - Modern Architecture in Aarhus Docklands development, CC BY 2.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=140190807',
			},
		],
	},
	{
		id: 'cardiff',
		name: 'Cardiff',
		stateCode: 'WLS',
		stateName: 'Wales',
		countryCode: 'GB',
		countryName: 'United Kingdom',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/cardiff.webp',
		lat: 51.483333,
		lng: -3.183333,
		description:
			'Cardiff is the capital and largest city of Wales. Located in the southeast of Wales and in the Cardiff Capital Region, Cardiff is the county town of the historic county of Glamorgan and in 1974–1996 of South Glamorgan. It belongs to the Eurocities network of the largest European cities. A small town until the early 19th century, its prominence as a port for coal when mining began in the region helped its expansion. Cardiff is the main commercial centre of Wales as well as the base for the Senedd, the Welsh Parliament. In 2011, it ranked sixth in the world in a National Geographic magazine list of alternative tourist destinations. It is the most popular destination in Wales with 21.3 million visitors in 2017. Cardiff is a major centre for television and film production (such as the 2005 revival of Doctor Who, Torchwood and Sherlock) and is the Welsh base for the main national broadcasters. Cardiff Bay contains the Senedd building and the Wales Millennium Centre arts complex.',
		timezone: 'Europe/London',
		attributions: [
			{
				type: 'image',
				text: 'By Richard Szwejkowski - https://www.flickr.com/photos/68112440@N07/50394404888/, CC BY-SA 2.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=131454840',
			},
		],
	},
	{
		id: 'graz',
		name: 'Graz',
		stateCode: '6',
		stateName: 'Styria',
		countryCode: 'AT',
		countryName: 'Austria',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/graz.webp',
		lat: 47.070833,
		lng: 15.438611,
		description:
			"Graz is the capital of the Austrian federal state of Styria and the second-largest city in Austria, after Vienna. Graz is known as a college and university city, with four colleges and four universities. Combined, the city is home to more than 60,000 students. Its historic centre (Altstadt) is one of the best-preserved city centres in Central Europe. In 1999, the city's historic centre was added to the UNESCO list of World Heritage Sites and in 2010 the designation was expanded to include Eggenberg Palace on the western edge of the city. Graz was designated the Cultural Capital of Europe in 2003 and became a City of Culinary Delights in 2008.",
		timezone: 'Europe/Vienna',
		attributions: [
			{
				type: 'image',
				text: 'By Tamirhassan~commonswiki - Self-published work by Tamirhassan~commonswiki, CC BY-SA 3.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=740590',
			},
		],
	},
	{
		id: 'linz',
		name: 'Linz',
		stateCode: '4',
		stateName: 'Upper Austria',
		countryCode: 'AT',
		countryName: 'Austria',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/linz.webp',
		lat: 48.305833,
		lng: 14.286389,
		description:
			'Linz is the capital of Upper Austria and third-largest city in Austria. Located on the river Danube, the city is in the far north of Austria. Linz Airport lies about 14 km southwest of the town centre. Linz has an oceanic climate with warm summers and quite cold winters. The main street "Landstraße" leads from the "Blumauerplatz" to "Taubenmarkt" (Pigeonmarket) near the main square. Around the main square are many historically relevant and architecturally interesting houses, such as the Old Town Hall, the Feichtinger House with its carillon, which changes the melody depending on the season, the Kirchmayr House, the Schmidtberger House or the bridgehead buildings, which house a part of the Linz Art University. The city is now home to a vibrant music and arts scene that is well-funded by the city and the state of Upper Austria. In Linz there are both traditional restaurants and old wine taverns, as well as modern and exotic cuisine. The influence of 140 nations can be felt in Linz\'s culinary offerings.',
		timezone: 'Europe/Vienna',
		attributions: [
			{
				type: 'image',
				text: 'By Radler59 (talk) - Self-photographed, CC BY-SA 4.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=92882356',
			},
		],
	},
	{
		id: 'salzburg',
		name: 'Salzburg',
		stateCode: '5',
		stateName: 'Salzburg',
		countryCode: 'AT',
		countryName: 'Austria',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/salzburg.webp',
		lat: 47.8,
		lng: 13.045,
		description:
			"Salzburg is the fourth-largest city in Austria. The town is on the site of the Roman settlement of Iuvavum. Salzburg was founded as an episcopal see in 696 and became a seat of the archbishop in 798. Its main sources of income were salt extraction, trade, as well as gold mining. The fortress of Hohensalzburg, one of the largest medieval fortresses in Europe, dates from the 11th century. In the 17th century, Salzburg became a center of the Counter-Reformation, with monasteries and numerous Baroque churches built. Salzburg's historic center is renowned for its Baroque architecture and is one of the best-preserved city centers north of the Alps. The historic center was enlisted as a UNESCO World Heritage Site in 1996. The city has three universities and a large population of students.",
		timezone: 'Europe/Vienna',
		attributions: [
			{
				type: 'image',
				text: 'By Jorge Franganillo - https://www.flickr.com/photos/franganillo/48481775381/, CC BY 2.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=84329637',
			},
		],
	},
	{
		id: 'vienna',
		name: 'Vienna',
		stateCode: '9',
		stateName: 'Vienna',
		countryCode: 'AT',
		countryName: 'Austria',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/vienna.webp',
		lat: 48.207778,
		lng: 16.371389,
		description:
			"Vienna is the capital, most populous city, and one of nine federal states of Austria. It is Austria's primate city, with just over two million inhabitants. Its larger metropolitan area has a population of nearly 2.9 million, representing nearly one-third of the country's population. Vienna is the cultural, economic, and political center of the country, the fifth-largest city by population in the European Union, and the most-populous of the cities on the Danube river.",
		timezone: 'Europe/Vienna',
		attributions: [
			{
				type: 'image',
				text: 'By Superbass - Own work, CC BY-SA 3.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=19845088',
			},
		],
	},
	{
		id: 'istanbul',
		name: 'Istanbul',
		stateCode: '34',
		stateName: 'Istanbul',
		countryCode: 'TR',
		countryName: 'Turkey',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/istanbul.webp',
		lat: 41.013611,
		lng: 28.955,
		description:
			"Istanbul is the largest city in Turkey, straddling the Bosporus Strait, the boundary between Europe and Asia. It is considered the country's economic, cultural and historic capital. The city has a population of over 15 million residents, comprising 19% of the population of Turkey, and is the most populous city in Europe and the world's fifteenth-largest city.",
		timezone: 'Europe/Istanbul',
		attributions: [
			{
				type: 'image',
				text: 'By flowcomm - File:Istanbul,_Turkey_(53688092005).jpg, CC BY 2.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=148565808',
			},
		],
	},
	{
		id: 'izmir',
		name: 'Izmir',
		stateCode: '35',
		stateName: 'Izmir',
		countryCode: 'TR',
		countryName: 'Turkey',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/izmir.webp',
		lat: 38.42,
		lng: 27.14,
		description:
			'İzmir is a metropolitan city on the west coast of Anatolia, and capital of İzmir Province. It is the third most populous city in Turkey, after Istanbul and Ankara, and the largest urban agglomeration on the Aegean Sea. Its built-up (or metro) area was home to 3,209,179 inhabitants. It extends along the outlying waters of the Gulf of İzmir and inland to the north across the Gediz River Delta; to the east along an alluvial plain created by several small streams; and to slightly more rugged terrain in the south.',
		timezone: 'Europe/Istanbul',
		attributions: [
			{
				type: 'image',
				text: 'BerkeKayalarr - Source, CC BY-SA 4.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=101400741',
			},
		],
	},
	{
		id: 'aydin',
		name: 'Aydin',
		stateCode: '09',
		stateName: 'Aydin',
		countryCode: 'TR',
		countryName: 'Turkey',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/aydin.webp',
		lat: 37.848056,
		lng: 27.845278,
		description:
			"Aydin is a city in and the seat of Aydin Province in Turkey's Aegean Region. The city is located at the heart of the lower valley of Büyük Menderes River (ancient Meander River). Aydin city is located along a region which was famous for its fertility and productivity since ancient times. Figs remain the province's best-known crop.",
		timezone: 'Europe/Istanbul',
		attributions: [
			{
				type: 'image',
				text: 'By Zeynel Cebeci - Own work, CC BY-SA 4.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=46824504',
			},
		],
	},
	{
		id: 'mugla',
		name: 'Mugla',
		stateCode: '48',
		stateName: 'Mugla',
		countryCode: 'TR',
		countryName: 'Turkey',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/mugla.webp',
		lat: 37.216667,
		lng: 28.366667,
		description:
			"Mugla is a city in southwestern Turkey. The city is the center of the district of Menteşe and Mugla Province, which stretches along Turkey's Aegean coast. Mugla has internationally well-known and popular tourist resorts such as Bodrum, Marmaris, Datça, Dalyan, Fethiye, Ölüdeniz and also the smaller resort of Sarigerme.",
		timezone: 'Europe/Istanbul',
		attributions: [
			{
				type: 'image',
				text: 'By Dosseman - Own work, CC BY-SA 4.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=122971196',
			},
		],
	},
	{
		id: 'antalya',
		name: 'Antalya',
		stateCode: '07',
		stateName: 'Antalya',
		countryCode: 'TR',
		countryName: 'Turkey',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/antalya.webp',
		lat: 36.8874,
		lng: 30.7075,
		description:
			"Antalya is the fifth-most populous city in Turkey and the capital of Antalya Province. Recognized as the capital of tourism in Turkey and a pivotal part of the Turkish Riviera, Antalya sits on Anatolia's southwest coast, flanked by the Taurus Mountains. With over 2.6 million people in its metropolitan area, it is the largest city in Turkey's Mediterranean Region. Antalya is currently the fourth-most visited city in the world, trailing behind only Istanbul, London, and Dubai, attracting more than 16.5 million foreign visitors in 2023.",
		timezone: 'Europe/Istanbul',
		attributions: [
			{
				type: 'image',
				text: 'By Esginmurat - Own work, CC BY-SA 4.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=98376445',
			},
		],
	},
	{
		id: 'mersin',
		name: 'Mersin',
		stateCode: '33',
		stateName: 'Mersin',
		countryCode: 'TR',
		countryName: 'Turkey',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/mersin.webp',
		lat: 36.8,
		lng: 34.633333,
		description:
			"Mersin is a large city and port on the Mediterranean coast of southern Türkiye. It is the provincial capital of the Mersin Province (formerly İçel). Mersin lies on the western side of Çukurova, a geographical, economic and cultural region of Türkiye. It is an important hub for Turkey's economy, with Türkiye's largest seaport located here. Çukurova International Airport (COV), 74 kilometres (46mi) from Mersin city center, is the nearest international airport.",
		timezone: 'Europe/Istanbul',
		attributions: [
			{
				type: 'image',
				text: 'Zeynel Cebeci - Yükleyenin kendi çalışması, CC BY-SA 4.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=37808975',
			},
		],
	},
	{
		id: 'adana',
		name: 'Adana',
		stateCode: '01',
		stateName: 'Adana',
		countryCode: 'TR',
		countryName: 'Turkey',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/adana.webp',
		lat: 37,
		lng: 35.321333,
		description:
			'Adana is a large city in southern Turkey. The city is situated on the Seyhan River, 35 km (22 mi) inland from the northeastern shores of the Mediterranean Sea. Adana province has a population of 1.8 million, making it the largest city in the Mediterrenean Region. Adana lies in the heart of Cilicia, which was once one of the most important regions of the classical world. Twenty-first century Adana is a centre for regional trade, healthcare, and public and private services. The closest public airport is Çukurova International Airport.',
		timezone: 'Europe/Istanbul',
		attributions: [
			{
				type: 'image',
				text: "MUSTAFA TOR - tr:Resim:Taşköprü'nün Panoramik Fotoğrafı.jpg, CC BY-SA 2.5",
				link: 'https://commons.wikimedia.org/w/index.php?curid=3948492',
			},
		],
	},
	{
		id: 'florence',
		name: 'Florence',
		stateCode: '52',
		stateName: 'Tuscany',
		countryCode: 'IT',
		countryName: 'Italy',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/florence.webp',
		lat: 43.771389,
		lng: 11.254167,
		description:
			'Florence is the capital city of the Italian region of Tuscany. It is also the most populated city in Tuscany. Florence was a centre of medieval European trade and finance and one of the wealthiest cities of that era. It is considered by many academics to have been the birthplace of the Renaissance, becoming a major artistic, cultural, commercial, political, economic and financial center. During this time, Florence rose to a position of enormous influence in Italy, Europe, and beyond. From 1865 to 1871 the city served as the capital of the Kingdom of Italy. The Florentine dialect forms the base of standard Italian and it became the language of culture throughout Italy due to the prestige of the masterpieces by Dante Alighieri, Petrarch, Giovanni Boccaccio, Niccolò Machiavelli and Francesco Guicciardini. UNESCO declared the Historic Centre of Florence a World Heritage Site in 1982. The city is noted for its culture, Renaissance art and architecture and monuments.',
		timezone: 'Europe/Rome',
		attributions: [
			{
				type: 'image',
				text: 'By Hagai Agmon-Snir حچاي اچمون-سنير חגי אגמון-שניר - Own work, CC BY-SA 4.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=142934129',
			},
		],
	},
	{
		id: 'venice',
		name: 'Venice',
		stateCode: '34',
		stateName: 'Veneto',
		countryCode: 'IT',
		countryName: 'Italy',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/venice.webp',
		lat: 45.4375,
		lng: 12.335833,
		description:
			"Venice is a city in northeastern Italy and the capital of the Veneto region. It is built on a group of 126 islands that are separated by expanses of open water and by canals; portions of the city are linked by 472 bridges. The city was historically the capital of the Republic of Venice for almost a millennium, from 810 to 1797. It was a major financial and maritime power during the Middle Ages and Renaissance, as well as an important centre of commerce. Parts of Venice are renowned for the beauty of their settings, their architecture, and artwork. Venice is known for several important artistic movements and has played an important role in the history of instrumental and operatic music; it is the birthplace of Baroque composers Tomaso Albinoni and Antonio Vivaldi. In the 21st century, Venice remains a very popular tourist destination, a major cultural centre, and has often been ranked one of the most beautiful cities in the world. It has been described by The Times as one of Europe's most romantic cities.",
		timezone: 'Europe/Rome',
		attributions: [
			{
				type: 'image',
				text: 'By kallerna - Own work, CC BY-SA 4.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=168185275',
			},
		],
	},
	{
		id: 'prague',
		name: 'Prague',
		stateCode: '10',
		stateName: 'Bohemia',
		countryCode: 'CZ',
		countryName: 'Czech Republic',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/prague.webp',
		lat: 50.0875,
		lng: 14.421389,
		description:
			'Prague is the capital and largest city of the Czech Republic and the historical capital of Bohemia. Situated on the Vltava river, Prague is home to about 1.4 million people. The city has a temperate oceanic climate, with relatively warm summers and chilly winters. Prague is a political, cultural, and economic hub of Central Europe, with a rich history and Romanesque, Gothic, Renaissance and Baroque architectures. It was the capital of the Kingdom of Bohemia and residence of several Holy Roman Emperors. Prague is home to a number of well-known cultural attractions including Prague Castle, Charles Bridge, Old Town Square with the Prague astronomical clock, the Jewish Quarter, Petřín hill and Vyšehrad. Since 1992, the historic center of Prague has been included in the UNESCO list of World Heritage Sites. The city has more than ten major museums, along with numerous theatres, galleries, cinemas, and other historical exhibits.',
		timezone: 'Europe/Prague',
		attributions: [
			{
				type: 'image',
				text: 'By Moyan Brenn from Italy - Flickr, CC BY 2.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=40605148',
			},
		],
	},
	{
		id: 'brno',
		name: 'Brno',
		stateCode: '64',
		stateName: 'South Moravian Region',
		countryCode: 'CZ',
		countryName: 'Czech Republic',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/brno.webp',
		lat: 49.1925,
		lng: 16.608333,
		description:
			'Brno is a city in the South Moravian Region of the Czech Republic. Brno has about 400,000 inhabitants, making it the second-largest city in the Czech Republic after the capital, Prague. Brno is the former capital city of Moravia and the political and cultural hub of the South Moravian Region. Brno Exhibition Centre is among the largest exhibition centres in Europe. Brno hosts motorbike and other races on the Masaryk Circuit. Another cultural tradition is an international fireworks competition, Ignis Brunensis, which attracts tens of thousands of visitors to each display. The most visited sights of the city include the Špilberk Castle and fortress and the Cathedral of Saints Peter and Paul on Petrov hill, two medieval buildings that dominate the cityscape and are often depicted as its traditional symbols. One of the natural sights nearby is the Moravian Karst. The city is a member of the UNESCO Creative Cities Network and was designated a "City of Music" in 2017.',
		timezone: 'Europe/Prague',
		attributions: [
			{
				type: 'image',
				text: 'By Thomas Ledl - Own work, CC BY 4.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=147963837',
			},
		],
	},
	{
		id: 'amsterdam',
		name: 'Amsterdam',
		stateCode: 'NHq',
		stateName: 'North Holland',
		countryCode: 'NL',
		countryName: 'Netherlands',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/amsterdam.webp',
		lat: 52.372778,
		lng: 4.893611,
		description:
			"Amsterdam is the capital and most populated city of the Netherlands. Amsterdam is colloquially referred to as the \"Venice of the North\", for its large number of canals, now a UNESCO World Heritage Site. Amsterdam became a major world port during the Dutch Golden Age of the 17th century. Amsterdam was the leading centre for finance and trade, as well as a hub of secular art production. The city has a long tradition of openness, liberalism, and tolerance. Cycling is key to the city's modern character, and there are numerous biking paths and lanes spread throughout. Amsterdam's main attractions include its historic canals; the Rijksmuseum; the Van Gogh Museum; the Dam Square; the Anne Frank House; the red-light district and cannabis coffee shops. The city is known for its nightlife and festival activity, with several nightclubs among the world's most famous. Its artistic heritage, canals and narrow canal houses with gabled façades, have attracted millions of visitors annually.",
		timezone: 'Europe/Amsterdam',
		attributions: [
			{
				type: 'image',
				text: 'By Massimo Catarinella - Own work, CC BY-SA 3.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=4553808',
			},
		],
	},
	{
		id: 'rotterdam',
		name: 'Rotterdam',
		stateCode: 'ZH',
		stateName: 'South Holland',
		countryCode: 'NL',
		countryName: 'Netherlands',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/rotterdam.webp',
		lat: 51.92,
		lng: 4.48,
		description:
			'Rotterdam is the second-largest city in the Netherlands after the national capital of Amsterdam. It is in the province of South Holland, part of the North Sea mouth of the Rhine–Meuse–Scheldt delta, via the "New Meuse" inland shipping channel, dug to connect to the Meuse at first and now to the Rhine. Rotterdam\'s history goes back to 1270, when a dam was constructed in the Rotte. In 1340, Rotterdam was granted city rights by William IV, Count of Holland. A major logistic and economic centre, Rotterdam is Europe\'s largest seaport. In 2022, Rotterdam had a population of 655,468 and is home to over 180 different nationalities. Rotterdam is known for its university, riverside setting, lively cultural life, maritime heritage and modern architecture. The near-complete destruction of the city centre during the World War II German bombing has resulted in a varied architectural landscape, including skyscrapers designed by architects such as Rem Koolhaas, Piet Blom and Ben van Berkel.',
		timezone: 'Europe/Amsterdam',
		attributions: [
			{
				type: 'image',
				text: 'By P. Hughes - Own work, CC BY-SA 4.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=128050146',
			},
		],
	},
	{
		id: 'the-hague',
		name: 'The Hague',
		stateCode: 'ZH',
		stateName: 'South Holland',
		countryCode: 'NL',
		countryName: 'Netherlands',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/the-hague.webp',
		lat: 52.08,
		lng: 4.31,
		description:
			"The Hague or Den Haag is the capital city of the South Holland province of the Netherlands. With a population of over half a million, it is the third-largest city in the Netherlands. Situated on the west coast facing the North Sea, The Hague is the country's administrative centre and its seat of government, and while the official capital of the Netherlands is Amsterdam, The Hague has been described as the country's de facto capital. Most foreign embassies in the Netherlands are in the city. The Royal Library of the Netherlands is also located there. The Hague is known as the global hub of international law and arbitration. The International Court of Justice, the main judicial arm of the United Nations, is based in the city, as are the International Criminal Court, the Permanent Court of Arbitration, the Organisation for the Prohibition of Chemical Weapons, Europol, and approximately 200 other international governmental organizations.",
		timezone: 'Europe/Amsterdam',
		attributions: [
			{
				type: 'image',
				text: 'By Zairon - Own work, CC BY-SA 4.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=55604689',
			},
		],
	},
	{
		id: 'utrecht',
		name: 'Utrecht',
		stateCode: 'UT',
		stateName: 'Utrecht',
		countryCode: 'NL',
		countryName: 'Netherlands',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/utrecht.webp',
		lat: 52.090833,
		lng: 5.121667,
		description:
			"Utrecht is the fourth-largest city of the Netherlands, as well as the capital and the most populous city of the province of Utrecht. The municipality of Utrecht is located in the eastern part of the Randstad conurbation, in the very centre of mainland Netherlands, and includes Haarzuilens, Vleuten and De Meern. Utrecht's ancient city centre features many buildings and structures, several dating as far back as the High Middle Ages. It has been the religious centre of the Netherlands since the 8th century. In 1579, the Union of Utrecht was signed in the city to lay the foundations for the Dutch Republic. Utrecht is home to Utrecht University, the largest university in the Netherlands, as well as several other institutions of higher education. Due to its central position within the country, it is an important hub for both rail and road transport; it has the busiest train station in the Netherlands, Utrecht Centraal. It has the second-highest number of cultural events in the Netherlands, after Amsterdam.",
		timezone: 'Europe/Amsterdam',
		attributions: [
			{
				type: 'image',
				text: 'By Wil Leeuwis - Olympus Pen E-P1 camera, operated by the author, CC0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=14678068',
			},
		],
	},
	{
		id: 'eindhoven',
		name: 'Eindhoven',
		stateCode: 'NB',
		stateName: 'North Brabant',
		countryCode: 'NL',
		countryName: 'Netherlands',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/eindhoven.webp',
		lat: 51.433333,
		lng: 5.483333,
		description:
			'Eindhoven is a city and municipality of the Netherlands, located in the southern province of North Brabant, of which it is the largest municipality, and is also located in the Dutch part of the natural region the Campine. Eindhoven was originally located at the confluence of the Dommel and the Gender. A municipality since the 13th century, Eindhoven witnessed rapid growth starting in the 1900s by textile and tobacco industries. Two well-known companies, DAF Trucks and Philips, were founded in the city; Philips would go on to become a major multinational conglomerate while based in Eindhoven. Apart from Philips, Eindhoven also contains the globally famous Design Academy Eindhoven. Neighbouring cities and towns include Son en Breugel, Nuenen, Geldrop-Mierlo, Helmond, Heeze-Leende, Waalre, Veldhoven, Eersel, Oirschot and Best.',
		timezone: 'Europe/Amsterdam',
		attributions: [
			{
				type: 'image',
				text: 'By Rijksdienst voor het Cultureel Erfgoed, CC BY-SA 4.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=24272072',
			},
		],
	},
	{
		id: 'alkmaar',
		name: 'Alkmaar',
		stateCode: 'NH',
		stateName: 'North Holland',
		countryCode: 'NL',
		countryName: 'Netherlands',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/alkmaar.webp',
		lat: 52.633333,
		lng: 4.75,
		description:
			"Alkmaar is a city and municipality in the Netherlands, located in the province of North Holland. Alkmaar is well known for its traditional cheese market. For tourists, it is a popular cultural destination. The municipality has a population of 111,766 as of 2023. Alkmaar has many medieval buildings that are still intact, most notably the tall tower of the Grote or Sint-Laurenskerk, where many people from Alkmaar hold wedding ceremonies. The other main attraction, especially in the summer months, is Alkmaar's cheese market at the Waagplein, one of the country's most popular tourist attractions. The cheese market traditionally takes place from the first Friday in April through the first Friday in September. It is one of only four traditional Dutch cheese markets still in existence. Alkmaar has two large theatres and a big cinema (which was originally two cinemas). Every year, at the end of May Alkmaar hosts the four-day event Alkmaar Pride, which has a canal pride parade on Saturday.",
		timezone: 'Europe/Amsterdam',
		attributions: [
			{
				type: 'image',
				text: 'By A. Bakker - Own work, CC BY-SA 3.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=32618558',
			},
		],
	},
	{
		id: 'haarlem',
		name: 'Haarlem',
		stateCode: 'NH',
		stateName: 'North Holland',
		countryCode: 'NL',
		countryName: 'Netherlands',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/haarlem.webp',
		lat: 52.383333,
		lng: 4.633333,
		description:
			'Haarlem is a city and municipality in the Netherlands. It is the capital of the province of North Holland. Haarlem is situated at the northern edge of the Randstad, one of the more populated metropolitan areas in Europe; it is also part of the Amsterdam metropolitan area. There are several museums in Haarlem. The Teylers Museum lies on the Spaarne river, and it is the oldest museum of the Netherlands. Its main subjects are art, science and, natural history, and it owns a number of works by Michelangelo and Rembrandt. The city contains several theatres, a cinema and other cultural attractions. The Philharmonie is a concert hall in the centre of the city. Every year in April, the bloemencorso takes place. Floats decorated with flowers drive from Noordwijk to Haarlem, where they are exhibited for one day.  There is also a funfair organised on the Grote Markt and the Zaanenlaan in Haarlem-Noord. Other festivals are held on the Grote Markt as well, in particular the annual Haarlem Jazz & More.',
		timezone: 'Europe/Amsterdam',
		attributions: [
			{
				type: 'image',
				text: 'By Fryslan0109 at English Wikipedia - Transferred from en.wikipedia to Commons., Public Domain',
				link: 'https://commons.wikimedia.org/w/index.php?curid=33582204',
			},
		],
	},
	{
		id: 'marseille',
		name: 'Marseille',
		stateCode: 'PAC',
		stateName: 'Provence-Alpes-Côte-d’Azur',
		countryCode: 'FR',
		countryName: 'France',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/marseille.webp',
		lat: 43.2964,
		lng: 5.37,
		description:
			"Marseille is the prefecture of the French department of Bouches-du-Rhône and of the Provence-Alpes-Côte d'Azur region. Marseille is the third largest city in France by urban area, and the second most populous city in France. Founded c. 600 BC by Greek settlers from Phocaea, Marseille is the oldest city in France, as well as one of Europe's oldest continuously inhabited settlements. Since its origins, Marseille's openness to the Mediterranean Sea has made it a cosmopolitan city marked by cultural and economic exchanges with Southern Europe, the Middle East, North Africa and Asia. In the 1990s, the Euroméditerranée project for economic development and urban renewal was launched. New infrastructure projects and renovations were carried out in the 2000s and 2010s. As a result, Marseille now has the most museums in France after Paris. The city was named European Capital of Culture in 2013 and European Capital of Sport in 2017.",
		timezone: 'Europe/Paris',
		attributions: [
			{
				type: 'image',
				text: 'By Earth777 - Own work, CC BY-SA 4.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=159498978',
			},
		],
	},
	{
		id: 'lyon',
		name: 'Lyon',
		stateCode: 'ARA',
		stateName: 'Auvergne-Rhône-Alpes',
		countryCode: 'FR',
		countryName: 'France',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/lyon.webp',
		lat: 45.76,
		lng: 4.84,
		description:
			'Lyon is the third-largest city of France and its second-largest urban area. It is located at the confluence of the rivers Rhône and Saône. The capital of the Gauls during the Roman Empire, Lyon is the seat of an archbishopric whose holder bears the title of Primate of the Gauls. Lyon became a major economic hub during the Renaissance. The city is recognised for its cuisine and gastronomy, as well as historical and architectural landmarks; as such, the districts of Old Lyon, the Fourvière hill, the Presqu\'île and the slopes of the Croix-Rousse are inscribed on the UNESCO World Heritage List. Lyon was historically an important area for the production and weaving of silk. Lyon played a significant role in the history of cinema since Auguste and Louis Lumière invented the cinematograph there. The city is also known for its light festival, the Fête des lumières, which begins every 8 December and lasts for four days, earning Lyon the title of "Capital of Lights".',
		timezone: 'Europe/Paris',
		attributions: [
			{
				type: 'image',
				text: 'By Basilio - Own work, CC BY-SA 3.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=4318460',
			},
		],
	},
	{
		id: 'toulouse',
		name: 'Toulouse',
		stateCode: 'OCC',
		stateName: 'Occitanie',
		countryCode: 'FR',
		countryName: 'France',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/toulouse.webp',
		lat: 43.6045,
		lng: 1.444,
		description:
			'Toulouse is the prefecture of the French department of Haute-Garonne and of the larger region of Occitania. It is the fourth-largest city in France after Paris, Marseille and Lyon. Toulouse is the centre of the European aerospace industry, with the headquarters of Airbus, the SPOT satellite system, ATR and the Aerospace Valley. It hosts the CNES\'s Toulouse Space Centre (CST) which is the largest national space centre in Europe. The University of Toulouse is one of the oldest in Europe (founded in 1229). Toulouse counts three UNESCO World Heritage Sites: the Canal du Midi (designated in 1996 and shared with other cities), and the Basilica of St. Sernin, the largest remaining Romanesque building in Europe, designated in 1998 along with the former hospital Hôtel-Dieu Saint-Jacques because of their significance to the Santiago de Compostela pilgrimage route. The city\'s unique architecture made of pinkish terracotta bricks has earned Toulouse the nickname La Ville rose ("The Pink city").',
		timezone: 'Europe/Paris',
		attributions: [
			{
				type: 'image',
				text: 'By Benh LIEU SONG - Own work, CC BY-SA 3.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=7292944',
			},
		],
	},
	{
		id: 'nice',
		name: 'Nice',
		stateCode: 'PAC',
		stateName: 'Provence-Alpes-Côte-d’Azur',
		countryCode: 'FR',
		countryName: 'France',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/nice.webp',
		lat: 43.7034,
		lng: 7.2663,
		description:
			"Nice is a city in and the prefecture of the Alpes-Maritimes department in France. The city is nicknamed Nice la Belle (Nissa La Bella in Niçard), meaning 'Nice the Beautiful'. The clear air and soft light have particularly appealed to notable painters, such as Marc Chagall, Henri Matisse, Niki de Saint Phalle and Arman. Their work is commemorated in many of the city's museums, including Musée Marc Chagall, Musée Matisse and Musée des Beaux-Arts. Frank Harris wrote several books including his autobiography My Life and Loves in Nice. Friedrich Nietzsche spent six consecutive winters in Nice, and wrote Thus Spoke Zarathustra there. Additionally, Russian writer Anton Chekhov completed his play Three Sisters while living in Nice. Because of its historical importance as a winter resort town for the European aristocracy and the resulting mix of cultures found in the city, UNESCO proclaimed Nice a World Heritage Site in 2021.",
		timezone: 'Europe/Paris',
		attributions: [
			{
				type: 'image',
				text: 'By Aeris06, Frédéric Oropallo - Own work, CC BY-SA 4.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=77492747',
			},
		],
	},
	{
		id: 'barcelona',
		name: 'Barcelona',
		stateCode: 'CT',
		stateName: 'Catalonia',
		countryCode: 'ES',
		countryName: 'Spain',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/barcelona.webp',
		lat: 41.382778,
		lng: 2.176944,
		description:
			'Barcelona is a city on the northeastern coast of Spain. It is the capital and largest city of the autonomous community of Catalonia, as well as the second-most populous municipality of Spain. It is one of the largest metropolises on the Mediterranean Sea, located on the coast between the mouths of the rivers Llobregat and Besòs, bounded to the west by the Serra de Collserola mountain range. According to tradition, Barcelona was founded by either the Phoenicians or the Carthaginians, who had trading posts along the Catalonian coast. Barcelona has a rich cultural heritage and is today an important cultural centre and a major tourist destination. Particularly renowned are the architectural works of Antoni Gaudí and Lluís Domènech i Montaner, which have been designated UNESCO World Heritage Sites. The city is known for hosting the 1992 Summer Olympics as well as world-class conferences and expositions. In addition, many international sport tournaments have been played here.',
		timezone: 'Europe/Madrid',
		attributions: [
			{
				type: 'image',
				text: 'By Felix König - Own work, CC BY 3.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=27450448',
			},
		],
	},
	{
		id: 'valencia',
		name: 'Valencia',
		stateCode: 'VC',
		stateName: 'Valencia',
		countryCode: 'ES',
		countryName: 'Spain',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/valencia.webp',
		lat: 39.47,
		lng: -0.376389,
		description:
			"Valencia is the capital of the province and autonomous community of the same name in Spain. It is located on the banks of the Turia, on the east coast of the Iberian Peninsula on the Mediterranean Sea. Valencia was founded as a Roman colony in 138 BC under the name Valentia Edetanorum. The city is ranked as a Gamma-level global city by the Globalization and World Cities Research Network. Its historic centre is one of the largest in Spain, spanning approximately 169 hectares (420 acres). Due to its long history, Valencia has numerous celebrations and traditions, such as the Falles (or Fallas), which was declared a Fiesta of National Tourist Interest of Spain in 1965 and an intangible cultural heritage by UNESCO in November 2016. In 2022, the city was voted the world's top destination for expatriates, based on criteria such as quality of life and affordability. The city was selected as the European Capital of Sport 2011, the World Design Capital 2022 and the European Green Capital 2024.",
		timezone: 'Europe/Madrid',
		attributions: [
			{
				type: 'image',
				text: 'By William Warby - City of Arts and Sciences, CC BY 2.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=59759320',
			},
		],
	},
	{
		id: 'seville',
		name: 'Seville',
		stateCode: 'SE',
		stateName: 'Seville',
		countryCode: 'ES',
		countryName: 'Spain',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/seville.webp',
		lat: 37.39,
		lng: -5.99,
		description:
			"Seville is the capital and largest city of the Spanish autonomous community of Andalusia and the province of Seville. Its old town, with an area of 4 square kilometres (2 sq mi), contains a UNESCO World Heritage Site comprising three buildings: the Alcázar palace complex, the Cathedral and the General Archive of the Indies. The Seville harbour, located about 80 kilometres (50 miles) from the Atlantic Ocean, is the only river port in Spain. The capital of Andalusia features hot temperatures in the summer, with daily maximums routinely above 35 °C (95 °F) in July and August. Seville was founded as the Roman city of Hispalis. The 20th century in Seville saw the tribulations of the Spanish Civil War, decisive cultural milestones such as the Ibero-American Exposition of 1929 and Expo '92, and the city's election as the capital of the Autonomous Community of Andalusia.",
		timezone: 'Europe/Madrid',
		attributions: [
			{
				type: 'image',
				text: 'By Francisco Colinet - Monumental Plaza de España de Sevilla.jpg, CC BY-SA 3.0 es',
				link: 'https://commons.wikimedia.org/w/index.php?curid=134084674',
			},
		],
	},
	{
		id: 'bilbao',
		name: 'Bilbao',
		stateCode: 'PV',
		stateName: 'Basque Country',
		countryCode: 'ES',
		countryName: 'Spain',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/bilbao.webp',
		lat: 43.256944,
		lng: -2.923611,
		description:
			'Bilbao is a city in northern Spain, the largest city in the province of Biscay and in the Basque Country as a whole. It is also the largest city proper in northern Spain. Bilbao is located in the north-central part of Spain, some 16 kilometres (10 mi) south of the Bay of Biscay, where the economic social development is located, where the estuary of Bilbao is formed. Its main urban core is surrounded by two small mountain ranges with an average elevation of 400 metres (1,300 ft). Its climate is shaped by the Bay of Biscay low-pressure systems and mild air, moderating summer temperatures by Iberian standards, with low sunshine and high rainfall. The annual temperature range is low for its latitude. Bilbao is also home to football team Athletic Club, a significant symbol for Basque nationalism due to its promotion of only Basque players and being one of the most successful clubs in Spanish football history.',
		timezone: 'Europe/Madrid',
		attributions: [
			{
				type: 'image',
				text: 'By Tommie Hansen, CC BY 3.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=56487808',
			},
		],
	},
	{
		id: 'birmingham',
		name: 'Birmingham',
		stateCode: 'ENG',
		stateName: 'England',
		countryCode: 'GB',
		countryName: 'United Kingdom',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/birmingham.webp',
		lat: 52.48,
		lng: -1.9025,
		description:
			"Birmingham is a city and metropolitan borough in the metropolitan county of West Midlands in England. It is the second-largest city in Britain – commonly referred to as the second city of the United Kingdom. The Watt steam engine was invented in Birmingham. The resulting high level of social mobility also fostered a culture of political radicalism which, under leaders from Thomas Attwood to Joseph Chamberlain, was to give it a political influence unparalleled in Britain outside London and a pivotal role in the development of British democracy. The city is a major international commercial centre and an important transport, retail, events and conference hub. Birmingham's major cultural institutions – the City of Birmingham Symphony Orchestra, Birmingham Royal Ballet, Birmingham Repertory Theatre, Library of Birmingham and Barber Institute of Fine Arts – enjoy international reputations, and the city has vibrant and influential grassroots art, music, literary and culinary scenes.",
		timezone: 'Europe/London',
		attributions: [
			{
				type: 'image',
				text: 'By Roger Kidd, CC BY-SA 2.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=110276585',
			},
		],
	},
	{
		id: 'glasgow',
		name: 'Glasgow',
		stateCode: 'SCT',
		stateName: 'Scotland',
		countryCode: 'GB',
		countryName: 'United Kingdom',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/glasgow.webp',
		lat: 55.861111,
		lng: -4.25,
		description:
			"Glasgow is the most populous city in Scotland, located on the banks of the River Clyde in west central Scotland. The city is the third-most-populous city in the United Kingdom. Glasgow grew from a small rural settlement close to Glasgow Cathedral and descending to the River Clyde to become the largest seaport in Scotland, and tenth largest by tonnage in Britain. Glasgow's major cultural institutions enjoy international reputations including The Royal Conservatoire of Scotland, Burrell Collection, Kelvingrove Art Gallery and Museum, Royal Scottish National Orchestra, BBC Scottish Symphony Orchestra, Scottish Ballet and Scottish Opera. The city was the European Capital of Culture in 1990 and is notable for its architecture, culture, media, music scene, sports clubs and transport connections. It is the fifth-most-visited city in the United Kingdom. The city is also well known in the sporting world for football, particularly for the Old Firm rivalry.",
		timezone: 'Europe/London',
		attributions: [
			{
				type: 'image',
				text: 'By user:kilnburn, Attribution',
				link: 'https://commons.wikimedia.org/w/index.php?curid=6722024',
			},
		],
	},
	{
		id: 'manchester',
		name: 'Manchester',
		stateCode: 'ENG',
		stateName: 'England',
		countryCode: 'GB',
		countryName: 'United Kingdom',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/manchester.webp',
		lat: 53.479,
		lng: -2.2452,
		description:
			"Manchester is a city and metropolitan borough of Greater Manchester, England, which had an estimated population of 568,996 in 2022. The history of Manchester began with the civilian settlement associated with the Roman fort (castra) of Mamucium or Mancunium, established in about AD 79 on a sandstone bluff near the confluence of the rivers Medlock and Irwell. Manchester achieved city status in 1853. The city is notable for its architecture, culture, musical exports, media links, scientific and engineering output, social impact, sports clubs and transport connections. Manchester Liverpool Road railway station is the world's oldest surviving inter-city passenger railway station. At the University of Manchester, Ernest Rutherford first split the atom in 1917; Frederic C. Williams, Tom Kilburn and Geoff Tootill developed the world's first stored-program computer in 1948; and Andre Geim and Konstantin Novoselov first isolated graphene in 2004.",
		timezone: 'Europe/London',
		attributions: [
			{
				type: 'image',
				text: 'By David Dixon, CC BY-SA 2.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=130465966',
			},
		],
	},
	{
		id: 'sheffield',
		name: 'Sheffield',
		stateCode: 'ENG',
		stateName: 'England',
		countryCode: 'GB',
		countryName: 'United Kingdom',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/sheffield.webp',
		lat: 53.380833,
		lng: -1.470278,
		description:
			"Sheffield is a city in South Yorkshire, England, whose name derives from the River Sheaf which runs through it. The city serves as the administrative centre of the City of Sheffield. Sixty-one per cent of Sheffield's entire area is green space and a third of the city lies within the Peak District national park and is the fifth largest city in England. There are more than 250 parks, woodlands and gardens in the city, which is estimated to contain around 4.5 million trees. Sheffield played a crucial role in the Industrial Revolution with many significant inventions and technologies having developed in the city. The city has a long sporting heritage and is home both to the world's oldest football club, Sheffield F.C., and the world's oldest football ground, Sandygate. Matches between the two professional clubs are known as the Steel City derby. The city is also home to the World Snooker Championship and the Sheffield Steelers, the UK's first professional ice hockey team.",
		timezone: 'Europe/London',
		attributions: [
			{
				type: 'image',
				text: 'By Nbfreeh - Own work, CC BY-SA 4.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=123093660',
			},
		],
	},
	{
		id: 'edinburgh',
		name: 'Edinburgh',
		stateCode: 'SCT',
		stateName: 'Scotland',
		countryCode: 'GB',
		countryName: 'United Kingdom',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/edinburgh.webp',
		lat: 55.953333,
		lng: -3.189167,
		description:
			"Edinburgh is the capital city of Scotland. Recognised as the capital of Scotland since at least the 15th century, Edinburgh is the seat of the Scottish Government, the Scottish Parliament, the highest courts in Scotland, and the Palace of Holyroodhouse, the official residence of the British monarch in Scotland. It is also the annual venue of the General Assembly of the Church of Scotland. The city has long been a centre of education, particularly in the fields of medicine, Scottish law, literature, philosophy, the sciences and engineering. The University of Edinburgh, founded in 1582 and now one of three in the city, is considered one of the best research institutions in the world. The city is a cultural centre, and is the home of institutions including the National Museum of Scotland, the National Library of Scotland and the Scottish National Gallery. The city is also known for the Edinburgh International Festival and the Fringe, the latter being the world's largest annual international arts festival.",
		timezone: 'Europe/London',
		attributions: [
			{
				type: 'image',
				text: 'By Andrew Colin - https://www.flickr.com/photos/adcolin/27748883351/in/photolist-Jh5hgi-dT7Mrh-8YCp14-4gNCgZ-mpaoVZ-AM21HM-aX9KCX-dDpcak-qNitbk-p2m5H7-7cuyHA-ar2pTJ-pUGEWE-7UQdtd-7UQfpA-8YFrno-rhKQae-9ubdv8-dKq64P-pVjyw9-9AYUqJ-c4h5f1-oos2Xu-jqmbQH-qSjC3i-rS6vN5-njWKYN-cCqWj3-cgX8YA-jqwWXG-jqmPxn-r4guqK-hgJ8AT-e8ia6o-djgV1u-jqneMy-7iFwWs-qcPiVu-dzPDy1-7Uw519-o717Lv-qcPfqo-8Q7PC4-6vkKsm-bvukt3-atcJsz-aoAap3-qoTnTf-btAG8A-jqoi5W, CC BY 2.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=50351493',
			},
		],
	},
	{
		id: 'liverpool',
		name: 'Liverpool',
		stateCode: 'ENG',
		stateName: 'England',
		countryCode: 'GB',
		countryName: 'United Kingdom',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/liverpool.webp',
		lat: 53.407222,
		lng: -2.991667,
		description:
			"Liverpool is a cathedral city, port city, and metropolitan borough in Merseyside, England. The economy of Liverpool is diversified and encompasses tourism, culture, maritime, hospitality, healthcare, life sciences, advanced manufacturing, creative, and digital sectors. The city is home to the UK's second highest number of art galleries, national museums, listed buildings, and parks and open spaces. It is often used as a filming location due to its distinctive architecture. It is the only UNESCO City of Music in England and has produced countless musicians, most notably the Beatles, who are widely regarded as the most influential band of all time. It has also produced many academics, actors, artists, comedians, filmmakers, poets, scientists, sportspeople, and writers. In sports, it is known as the home of Premier League football teams Everton FC and Liverpool FC. The world's oldest still-operating mainline train station, Liverpool Lime Street, is in the city centre.",
		timezone: 'Europe/London',
		attributions: [
			{
				type: 'image',
				text: 'By Rodhullandemu - Own work, CC BY-SA 4.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=74214649',
			},
		],
	},
	{
		id: 'porto',
		name: 'Porto',
		stateCode: '13',
		stateName: 'Porto',
		countryCode: 'PT',
		countryName: 'Portugal',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/porto.webp',
		lat: 41.162142,
		lng: -8.621953,
		description:
			'Porto, is the second largest city in Portugal, after Lisbon. It is the capital of the Porto District and one of the Iberian Peninsula\'s major urban areas. Located along the Douro River estuary in northern Portugal, Porto is one of the oldest European centers and its core was proclaimed a World Heritage Site by UNESCO in 1996, as the "Historic Centre of Porto, Luiz I Bridge and Monastery of Serra do Pilar". The historic area is also a National Monument of Portugal. Its settlement dates back many centuries when it was an outpost of the Roman Empire. Its combined Celtic-Latin name, Portus Cale, has been referred to as the origin of the name Portugal, based on transliteration and oral evolution from Latin. Port wine, one of Portugal\'s most famous exports, is named after Porto. Porto is on the Portuguese Way path of the Camino de Santiago. In 2014 and 2017, Porto was elected The Best European Destination by the Best European Destinations Agency.',
		timezone: 'Europe/Lisbon',
		attributions: [
			{
				type: 'image',
				text: 'By Diego Delso, CC BY-SA 3.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=20128006',
			},
		],
	},
	{
		id: 'odense',
		name: 'Odense',
		stateCode: '83',
		stateName: 'Region of Southern Denmark',
		countryCode: 'DK',
		countryName: 'Denmark',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/odense.webp',
		lat: 55.395833,
		lng: 10.388611,
		description:
			"Odense is the third largest city in Denmark. Odense has close associations with Hans Christian Andersen who is remembered above all for his fairy tales. He was born in the city in 1805 and spent his childhood years there. There has been human settlement in the Odense area for over 4,000 years, although the name was not mentioned in writing until 988, and by 1070, it had already grown into a thriving city. The University of Southern Denmark was established in 1966. In the present day, Odense remains the commercial hub of Funen, and has a notable shopping district with a diversity of stores. Several major industries are located in the city including the Albani Brewery and GASA, Denmark's major dealer in vegetables, fruits and flowers. The city is home to Odense Palace, erected by King Frederik IV who died there in 1730, the Odense Theatre, the Odense Symphony Orchestra, and the Hans Christian Andersen Museum, situated in the house that was the birthplace of Hans Christian Andersen.",
		timezone: 'Europe/Copenhagen',
		attributions: [
			{
				type: 'image',
				text: 'By Kåre Thor Olsen - Own work, CC BY-SA 3.0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=186062',
			},
		],
	},
	{
		id: 'eskisehir',
		name: 'Eskisehir',
		stateCode: '26',
		stateName: 'Eskisehir',
		countryCode: 'TR',
		countryName: 'Turkey',
		image:
			'https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/cities/eskisehir.webp',
		lat: 39.783333,
		lng: 30.516667,
		description:
			'Eskişehir is a city in northwestern Turkey and the capital of the Eskişehir Province. The urban population of the city is 898,369 with a metropolitan population of 797,708. The city is located on the banks of the Porsuk River, 792 m above sea level, where it overlooks the fertile Phrygian Valley. In the nearby hills one can find hot springs. It is located in the vicinity of the ancient city of Dorylaeum. Known as a university town; Eskişehir Technical University, Eskişehir Osmangazi University, and Anadolu University are based in Eskişehir.',
		timezone: 'Europe/Istanbul',
		attributions: [
			{
				type: 'image',
				text: 'Hüseyin Şahbaz - https://www.flickr.com/photos/191534495@N02/50761240151/, CC0',
				link: 'https://commons.wikimedia.org/w/index.php?curid=116743554',
			},
		],
	},
];
