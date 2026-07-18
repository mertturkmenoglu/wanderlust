import type { Types } from '@wanderlust/common';

type Insert = Types.Categories.$Insert.Category;

export const data: Insert[] = [
	{
		name: 'accommodation',
		displayName: 'Accommodations',
		description:
			'Find the perfect place to stay, from budget-friendly options to luxury retreats.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Vojtech Bruzek on Unsplash',
				link: 'https://unsplash.com/photos/white-bed-linen-with-throw-pillows-Yrxr3bsPdS0',
			},
		],
	},
	{
		name: 'accommodation.apartment',
		displayName: 'Apartments',
		description:
			'Fully equipped rental units offering the comforts of home, ideal for longer stays or independent travelers.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Naomi Hébert on Unsplash',
				link: 'https://unsplash.com/photos/gray-steel-3-door-refrigerator-near-modular-kitchen-MP0bgaS_d1c',
			},
		],
	},
	{
		name: 'accommodation.chalet',
		displayName: 'Chalets',
		description:
			'Cozy wooden lodges, often nestled in mountain settings, perfect for ski trips and alpine getaways.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Andrea Davis on Unsplash',
				link: 'https://unsplash.com/photos/white-sofa-set-near-window-IWfe63thJxk',
			},
		],
	},
	{
		name: 'accommodation.guest_house',
		displayName: 'Guest Houses',
		description:
			'Intimate, family-run accommodations offering a personal touch and local hospitality.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Zoshua Colah on Unsplash',
				link: 'https://unsplash.com/photos/a-white-house-with-palm-trees-in-front-of-it-3sSspN4s81M',
			},
		],
	},
	{
		name: 'accommodation.hostel',
		displayName: 'Hostels',
		description:
			'Affordable, social lodging with shared or private rooms, popular among backpackers and budget travelers.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Marcus Loke on Unsplash',
				link: 'https://unsplash.com/photos/black-metal-bunk-bed-WQJvWU_HZFo',
			},
		],
	},
	{
		name: 'accommodation.hotel',
		displayName: 'Hotels',
		description:
			'Professional accommodations ranging from simple comfort to full-service luxury, with amenities to suit every trip.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Frames For Your Heart on Unsplash',
				link: 'https://unsplash.com/photos/modern-hotel-lobby-with-designer-furniture-and-wood-walls-zSG-kd-L6vw',
			},
		],
	},
	{
		name: 'accommodation.motel',
		displayName: 'Motels',
		description:
			'Convenient roadside lodging with easy parking access, ideal for road trips and overnight stops.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Adrian Hernandez on Unsplash',
				link: 'https://unsplash.com/photos/a-large-white-building-with-blue-windows-and-balconies-SUxDinr4fgU',
			},
		],
	},
	{
		name: 'accommodation.resort',
		displayName: 'Resorts',
		description:
			'All-in-one destinations combining accommodation, dining, and recreation for a complete vacation experience.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Sara Dubler on Unsplash',
				link: 'https://unsplash.com/photos/photo-of-brown-bench-near-swimming-pool-Koei_7yYtIo',
			},
		],
	},
	{
		name: 'commercial',
		displayName: 'Commercial Places',
		description:
			'Shops, stores, and markets for browsing, buying, and discovering something new.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Albert Hyseni on Unsplash',
				link: 'https://unsplash.com/photos/spacious-modern-shopping-mall-interior-with-shops-and-people-4BXiwqSlVqQ',
			},
		],
	},
	{
		name: 'commercial.antique_shop',
		displayName: 'Antique Shops',
		description:
			'Treasure troves of vintage furniture, collectibles, and one-of-a-kind pieces with history.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Mick Haupt on Unsplash',
				link: 'https://unsplash.com/photos/items-on-shelf-8AQX9HCX9YA',
			},
		],
	},
	{
		name: 'commercial.bookstore',
		displayName: 'Bookstores',
		description:
			'Russian literature or French? Classics or newly released books?',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Pauline Loroy on Unsplash',
				link: 'https://unsplash.com/photos/people-inside-library-tv8PIPPY3rQ',
			},
		],
	},
	{
		name: 'commercial.clothing_store',
		displayName: 'Clothing Stores',
		description:
			'Fashion destinations offering apparel and accessories for every style and budget.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Laura Peruchi on Unsplash',
				link: 'https://unsplash.com/photos/a-clothing-store-with-clothes-and-hats-on-display-2gLL2ZgBlcU',
			},
		],
	},
	{
		name: 'commercial.art',
		displayName: 'Art',
		description:
			'Spaces celebrating creativity, from galleries and studios to shops selling original works.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Zalfa Imani on Unsplash',
				link: 'https://unsplash.com/photos/woman-in-black-coat-standing-in-front-of-paintings-1xp5VxvyKL0',
			},
		],
	},
	{
		name: 'commercial.gift_and_souvenir_shop',
		displayName: 'Gift & Souvenir Shops',
		description:
			'The perfect stop for keepsakes, local crafts, and memorable presents.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Samuel Isaacs on Unsplash',
				link: 'https://unsplash.com/photos/a-room-filled-with-lots-of-blue-and-white-plates-_GDHAgMgs7A',
			},
		],
	},
	{
		name: 'commercial.hobby',
		displayName: 'Hobby Shops',
		description:
			'Specialty stores for enthusiasts, stocking supplies for crafts, models, games, and collections.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Yazdan Mohammadi on Unsplash',
				link: 'https://unsplash.com/photos/people-browsing-music-and-merchandise-in-a-store-dWQok0Cq9aM',
			},
		],
	},
	{
		name: 'commercial.jewelry_store',
		displayName: 'Jewelry Stores',
		description:
			'Fine jewelry, watches, and precious pieces for special occasions or everyday elegance.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Xiangkun ZHU on Unsplash',
				link: 'https://unsplash.com/photos/a-row-of-white-chairs-sitting-in-front-of-a-window-G-8xZTir9jA',
			},
		],
	},
	{
		name: 'commercial.marketplace',
		displayName: 'Marketplaces',
		description:
			'Vibrant open markets where vendors sell fresh goods, crafts, and local specialties.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by hoch3fotografie on Unsplash',
				link: 'https://unsplash.com/photos/people-walking-on-street-near-buildings-during-daytime-rwGuOrj1_nY',
			},
		],
	},
	{
		name: 'commercial.shopping_mall',
		displayName: 'Shopping Malls',
		description:
			'One-stop retail destinations with stores, dining, and entertainment under one roof.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Heidi Fin on Unsplash',
				link: 'https://unsplash.com/photos/person-walking-inside-building-near-glass-2TLREZi7BUg',
			},
		],
	},
	{
		name: 'food_and_drink',
		displayName: 'Food & Drink',
		description:
			'From quick bites to memorable meals, discover places to eat and drink for every taste.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Jay Wennington on Unsplash',
				link: 'https://unsplash.com/photos/dish-on-white-ceramic-plate-N_Y88TWmGwA',
			},
		],
	},
	{
		name: 'food_and_drink.bar',
		displayName: 'Bars',
		description:
			'Lively spots to unwind with drinks, conversation, and good company.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Patrick Tomasso on Unsplash',
				link: 'https://unsplash.com/photos/brown-themed-bar-GXXYkSwndP4',
			},
		],
	},
	{
		name: 'food_and_drink.cafe',
		displayName: 'Cafes',
		description:
			'Relaxed spaces for coffee, light bites, and catching up — or getting work done.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Tony Lee on Unsplash',
				link: 'https://unsplash.com/photos/square-brown-wooden-table-8IKf54pc3qk',
			},
		],
	},
	{
		name: 'food_and_drink.restaurant',
		displayName: 'Restaurants',
		description:
			'Dining establishments serving everything from local favorites to international cuisine.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Jason Leung on Unsplash',
				link: 'https://unsplash.com/photos/photo-of-pub-set-in-room-during-daytime-poI7DelFiVA',
			},
		],
	},
	{
		name: 'food_and_drink.pub',
		displayName: 'Pubs',
		description:
			'Traditional drinking places offering hearty food, draft beer, and a welcoming atmosphere.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Eric Tompkins on Unsplash',
				link: 'https://unsplash.com/photos/people-inside-building-sitting-and-eating-aEQjSheM5lc',
			},
		],
	},
	{
		name: 'food_and_drink.brewery',
		displayName: 'Breweries',
		description:
			'Craft beer destinations where you can taste fresh brews right at the source.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Katherine Conrad on Unsplash',
				link: 'https://unsplash.com/photos/brown-wooden-barrels-on-rack-QL3SaEwio_k',
			},
		],
	},
	{
		name: 'food_and_drink.winery',
		displayName: 'Wineries',
		description:
			'Vineyards and tasting rooms offering tours, tastings, and scenic settings.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Kym Ellis on Unsplash',
				link: 'https://unsplash.com/photos/clear-wine-glass-overlooking-orchard-during-daytime-aF1NPSnDQLw',
			},
		],
	},
	{
		name: 'food_and_drink.fast_food',
		displayName: 'Fast Food',
		description:
			"Quick, convenient meals when you're on the go or short on time.",
		attributions: [
			{
				type: 'image',
				text: 'Photo by mafe estudio on Unsplash',
				link: 'https://unsplash.com/photos/burger-with-lettuce-and-tomato-LV2p9Utbkbw',
			},
		],
	},
	{
		name: 'food_and_drink.street_food',
		displayName: 'Street Food',
		description:
			'Authentic local flavors served fresh from stalls, carts, and food trucks.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Syed Ahmad on Unsplash',
				link: 'https://unsplash.com/photos/people-sitting-on-chair-in-restaurant-kgjQ1AGDwE0',
			},
		],
	},
	{
		name: 'food_and_drink.fine_dining',
		displayName: 'Fine Dining',
		description:
			'Elevated culinary experiences with refined menus, expert service, and elegant settings.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Igor Rand on Unsplash',
				link: 'https://unsplash.com/photos/restaurant-close-up-photography-wfM1Fi-kMaY',
			},
		],
	},
	{
		name: 'food_and_drink.ice_cream_shop',
		displayName: 'Ice Cream Shops',
		description:
			'Sweet spots serving scoops, sundaes, and frozen treats for all ages.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Erwan Hesry on Unsplash',
				link: 'https://unsplash.com/photos/ice-cream-on-black-tray-OlQ-NaEyVmQ',
			},
		],
	},
	{
		name: 'food_and_drink.bakery',
		displayName: 'Bakeries',
		description:
			'Fresh bread, pastries, and baked goods made daily, often from time-honored recipes.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Yeh Xintong on Unsplash',
				link: 'https://unsplash.com/photos/breads-in-display-shelf-go3DT3PpIw4',
			},
		],
	},
	{
		name: 'food_and_drink.tea_house',
		displayName: 'Tea Houses',
		description:
			'Tranquil settings for enjoying fine teas, light snacks, and quiet moments.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by 五玄土 ORIENTO on Unsplash',
				link: 'https://unsplash.com/photos/clear-drinking-glass-with-liquid-on-gray-surface-MCN7xTTeAkw',
			},
		],
	},
	{
		name: 'food_and_drink.cocktail_bar',
		displayName: 'Cocktail Bars',
		description:
			'Stylish venues where skilled bartenders craft creative and classic drinks.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Louis Hansel on Unsplash',
				link: 'https://unsplash.com/photos/person-pouring-liquor-in-clear-drinking-glass-yLUvnCFI500',
			},
		],
	},
	{
		name: 'food_and_drink.sports_bar',
		displayName: 'Sports Bars',
		description:
			'The place to catch the game, with big screens, cold drinks, and fellow fans.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Gary Walker-Jones on Unsplash',
				link: 'https://unsplash.com/photos/a-group-of-people-sitting-at-a-bar-watching-tvs-WPlgoc0YCVE',
			},
		],
	},
	{
		name: 'food_and_drink.deli',
		displayName: 'Delis',
		description:
			'Counters serving fresh sandwiches, cured meats, cheeses, and prepared specialties.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Nick Karvounis on Unsplash',
				link: 'https://unsplash.com/photos/hanging-meat-near-bar-counter-M1ww_Evl45w',
			},
		],
	},
	{
		name: 'food_and_drink.chocolatier',
		displayName: 'Chocolatiers',
		description:
			'Artisan shops crafting fine chocolates, truffles, and confections by hand.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by sooji min on Unsplash',
				link: 'https://unsplash.com/photos/a-box-of-assorted-chocolates-sitting-on-a-table-Kfdvn0cW9FE',
			},
		],
	},
	{
		name: 'entertainment',
		displayName: 'Entertainment',
		description:
			'Fun for everyone — movies, shows, games, and attractions to fill your free time.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Nainoa Shizuru on Unsplash',
				link: 'https://unsplash.com/photos/concert-photos-NcdG9mK3PBY',
			},
		],
	},
	{
		name: 'entertainment.cinema',
		displayName: 'Cinemas',
		description: 'Movie theaters screening the releases on the big screen.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Krists Luhaers on Unsplash',
				link: 'https://unsplash.com/photos/person-watching-movie-AtPWnYNDJnM',
			},
		],
	},
	{
		name: 'entertainment.library',
		displayName: 'Libraries',
		description:
			'Free public spaces for reading, research, studying, and community programs.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Giammarco Boscaro on Unsplash',
				link: 'https://unsplash.com/photos/book-lot-on-black-wooden-shelf-zeH-ljawHtg',
			},
		],
	},
	{
		name: 'entertainment.venue',
		displayName: 'Event Venues',
		description:
			'Versatile spaces for weddings, conferences, concerts, and celebrations of every size.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by CHUTTERSNAP on Unsplash',
				link: 'https://unsplash.com/photos/elegant-table-setting-with-floral-centerpiece-aEnH4hJ_Mrs',
			},
		],
	},
	{
		name: 'entertainment.theater',
		displayName: 'Theaters',
		description:
			'Stages for live performances, from plays and musicals to dance and comedy.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Liam McGarry on Unsplash',
				link: 'https://unsplash.com/photos/brown-wooden-chairs-inside-theater-ebsrin6WqxQ',
			},
		],
	},
	{
		name: 'entertainment.arcade',
		displayName: 'Arcades',
		description:
			'Game-filled venues packed with classic cabinets, modern machines, and prizes.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Mitchell Orr on Unsplash',
				link: 'https://unsplash.com/photos/a-row-of-pinball-machines-sitting-next-to-each-other-bYYtehpPaeE',
			},
		],
	},
	{
		name: 'entertainment.aquarium',
		displayName: 'Aquariums',
		description:
			'Underwater worlds showcasing marine life from local waters and distant oceans.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Pengxiao Xu on Unsplash',
				link: 'https://unsplash.com/photos/people-standing-in-front-of-fish-tank-vJZe1Z0fT1c',
			},
		],
	},
	{
		name: 'entertainment.amusement_park',
		displayName: 'Amusement Parks',
		description:
			'Thrill-filled destinations with rides, games, and attractions for all ages.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Thomas Stadler on Unsplash',
				link: 'https://unsplash.com/photos/red-and-yellow-crane-near-building-during-sunset-r6LQc9feEZQ',
			},
		],
	},
	{
		name: 'entertainment.zoo',
		displayName: 'Zoos',
		description:
			'Wildlife parks where you can see and learn about animals from around the globe.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Wilkins Morales on Unsplash',
				link: 'https://unsplash.com/photos/brown-bear-and-baby-bear-on-gray-concrete-wall-during-daytime-eLcPJeK_Unk',
			},
		],
	},
	{
		name: 'entertainment.bowling',
		displayName: 'Bowling Alleys',
		description:
			'Classic fun with friends — lanes, shoes, snacks, and friendly competition.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Michelle McEwen on Unsplash',
				link: 'https://unsplash.com/photos/bowling-ball-going-to-hit-bowling-pins-yk2VUa5vtA0',
			},
		],
	},
	{
		name: 'entertainment.museum',
		displayName: 'Museums',
		description:
			'Institutions preserving art, history, science, and culture through fascinating exhibits.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Claudio Testa on Unsplash',
				link: 'https://unsplash.com/photos/natural-history-museum-interior-arched-hall-iqeG5xA96M4',
			},
		],
	},
	{
		name: 'entertainment.art_gallery',
		displayName: 'Art Galleries',
		description:
			'Curated spaces showcasing paintings, sculptures, and works by established and emerging artists.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Juliet Furst on Unsplash',
				link: 'https://unsplash.com/photos/people-sitting-on-chair-inside-building-vjniDz-rmpY',
			},
		],
	},
	{
		name: 'entertainment.club',
		displayName: 'Clubs',
		description:
			'Nightlife venues with music, dancing, and energy that lasts until the early hours.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Long Truong on Unsplash',
				link: 'https://unsplash.com/photos/people-standing-on-stage-with-lights-turned-on-during-nighttime-Y5PXVs1LpY4',
			},
		],
	},
	{
		name: 'camping',
		displayName: 'Camping',
		description:
			'Outdoor sites for pitching tents or parking RVs, surrounded by nature.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Lesly Derksen on Unsplash',
				link: 'https://unsplash.com/photos/white-tent-on-lake-near-green-trees-and-mountain-under-blue-sky-during-daytime-F4fH5dAfZnE',
			},
		],
	},
	{
		name: 'sport',
		displayName: 'Sports Facilities',
		description:
			'Venues for playing, training, and watching sports of every kind.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Gabin Vallet on Unsplash',
				link: 'https://unsplash.com/photos/man-in-black-t-shirt-and-black-shorts-running-on-road-during-daytime-J154nEkpzlQ',
			},
		],
	},
	{
		name: 'sport.gym',
		displayName: 'Gyms',
		description:
			'Fitness facilities equipped with weights, machines, and space to work out.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Danielle Cerullo on Unsplash',
				link: 'https://unsplash.com/photos/woman-standing-surrounded-by-exercise-equipment-CQfNt66ttZM',
			},
		],
	},
	{
		name: 'sport.stadium',
		displayName: 'Stadiums',
		description:
			'Large arenas hosting major sporting events, concerts, and unforgettable moments.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Vienna Reyes on Unsplash',
				link: 'https://unsplash.com/photos/football-stadium-during-daytime-Zs_o1IjVPt4',
			},
		],
	},
	{
		name: 'sport.pool',
		displayName: 'Swimming Pools',
		description:
			'Indoor and outdoor pools for lap swimming, lessons, and family fun.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Gentrit Sylejmani on Unsplash',
				link: 'https://unsplash.com/photos/man-doing-butterfly-stroke-JjUyjE-oEbM',
			},
		],
	},
	{
		name: 'sport.dojo',
		displayName: 'Dojos',
		description:
			'Training halls for martial arts practice, discipline, and skill development.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Samuel Castro on Unsplash',
				link: 'https://unsplash.com/photos/two-men-dueling-inside-room-cwScwJy5HQE',
			},
		],
	},
	{
		name: 'sport.tennis_court',
		displayName: 'Tennis Courts',
		description:
			'Well-maintained courts for casual matches, lessons, and competitive play.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Lutfan Yazid on Unsplash',
				link: 'https://unsplash.com/photos/a-bright-yellow-tennis-ball-rests-on-a-blue-court-Fvi8pTLXPfU',
			},
		],
	},
	{
		name: 'sport.climbing_gym',
		displayName: 'Climbing Gyms',
		description:
			'Indoor walls and bouldering areas for climbers of all experience levels.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Yns Plt on Unsplash',
				link: 'https://unsplash.com/photos/woman-rock-climbing-inside-building-NY1D4Zni7fc',
			},
		],
	},
	{
		name: 'sport.football',
		displayName: 'Football Fields',
		description:
			'Open pitches for matches, training sessions, and pickup games.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Wesley Tingey on Unsplash',
				link: 'https://unsplash.com/photos/white-and-black-soccer-ball-on-grass-field-dKCKiC0BQtU',
			},
		],
	},
	{
		name: 'sport.basketball',
		displayName: 'Basketball Courts',
		description:
			'Indoor and outdoor courts for shooting hoops and competitive games.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Edgar Chaparro on Unsplash',
				link: 'https://unsplash.com/photos/nba-spalding-ball-kB5DnieBLtM',
			},
		],
	},
	{
		name: 'sport.skatepark',
		displayName: 'Skateparks',
		description:
			'Ramps, rails, and bowls built for skateboarding, BMX, and scooters.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Josh Hild on Unsplash',
				link: 'https://unsplash.com/photos/time-lapse-photo-of-man-riding-skateboard-at-skate-park-igLQW_yY9oo',
			},
		],
	},
	{
		name: 'nature',
		displayName: 'Nature',
		description:
			'Explore the great outdoors, from towering peaks to hidden waterfalls.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Zach Betten on Unsplash',
				link: 'https://unsplash.com/photos/woman-on-hammock-near-to-river-KYTT8L5JLDs',
			},
		],
	},
	{
		name: 'nature.park',
		displayName: 'Parks',
		description:
			'Green spaces for picnics, sports, and leisurely strolls in nature.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Ignacio Brosa on Unsplash',
				link: 'https://unsplash.com/photos/people-relaxing-and-biking-in-sunny-park-vJDbPuxUS_s',
			},
		],
	},
	{
		name: 'nature.national_park',
		displayName: 'National Parks',
		description:
			'Protected wilderness areas preserving stunning landscapes and diverse wildlife.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Hendrik Cornelissen on Unsplash',
				link: 'https://unsplash.com/photos/time-lapse-photography-of-river--qrcOR33ErA',
			},
		],
	},
	{
		name: 'nature.mountain',
		displayName: 'Mountains',
		description:
			'Majestic peaks offering hiking, climbing, skiing, and breathtaking views.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Daniel Leone on Unsplash',
				link: 'https://unsplash.com/photos/snowy-mountain-g30P1zcOzXo',
			},
		],
	},
	{
		name: 'nature.lake',
		displayName: 'Lakes',
		description:
			'Tranquil waters perfect for swimming, boating, fishing, and lakeside relaxation.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Adam Vradenburg on Unsplash',
				link: 'https://unsplash.com/photos/body-of-water-GA09PKfRIQY',
			},
		],
	},
	{
		name: 'nature.river',
		displayName: 'Rivers',
		description:
			'Flowing waterways ideal for rafting, kayaking, fishing, and scenic walks.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Jack Anstey on Unsplash',
				link: 'https://unsplash.com/photos/lake-between-trees-and-mountains-HtUBBdNDxpQ',
			},
		],
	},
	{
		name: 'nature.beach',
		displayName: 'Beaches',
		description:
			'Sandy shores for sunbathing, swimming, and seaside relaxation.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Sean Oulashin on Unsplash',
				link: 'https://unsplash.com/photos/seashore-during-golden-hour-KMn4VEeEPR8',
			},
		],
	},
	{
		name: 'tourism',
		displayName: 'Tourism',
		description: 'Must-see sights and iconic destinations that define a place.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Mesut Kaya on Unsplash',
				link: 'https://unsplash.com/photos/man-taking-photo-of-hot-air-balloons-eOcyhe5-9sQ',
			},
		],
	},
	{
		name: 'tourism.landmark',
		displayName: 'Landmarks',
		description:
			'Iconic sites and structures that every visitor should experience.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Kamilla Isalieva on Unsplash',
				link: 'https://unsplash.com/photos/eiffel-tower-with-people-walking-in-park-2-RqGgckAI8',
			},
		],
	},
	{
		name: 'tourism.monument',
		displayName: 'Monuments',
		description:
			'Memorials and structures honoring history, heroes, and important events.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Osama Madlom on Unsplash',
				link: 'https://unsplash.com/photos/a-group-of-people-standing-in-front-of-the-arc-de-trioe-xtRNd_imiDc',
			},
		],
	},
	{
		name: 'tourism.heritage',
		displayName: 'Heritage Sites',
		description:
			'Protected places of cultural and historical significance, often centuries old.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Mert Kahveci on Unsplash',
				link: 'https://unsplash.com/photos/people-walking-in-front-of-brown-concrete-building-during-daytime-Hk7rVLXGvbw',
			},
		],
	},
	{
		name: 'tourism.castle',
		displayName: 'Castles',
		description:
			'Historic fortresses and royal residences steeped in centuries of stories.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Rachel Davis on Unsplash',
				link: 'https://unsplash.com/photos/white-concrete-castle-in-green-field-tn2rBnvIl9I',
			},
		],
	},
	{
		name: 'tourism.palace',
		displayName: 'Palaces',
		description:
			'Grand residences showcasing opulent architecture and royal history.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Mert Kahveci on Unsplash',
				link: 'https://unsplash.com/photos/brown-and-white-concrete-staircase-DS8f4Gzj-Q8',
			},
		],
	},
	{
		name: 'tourism.place_of_worship',
		displayName: 'Places of Worship',
		description:
			'Churches, mosques, synagogues, and shrines welcoming visitors.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by CJ Dayrit on Unsplash',
				link: 'https://unsplash.com/photos/a-large-church-with-rows-of-chairs-KHi01Chnov8',
			},
		],
	},
	{
		name: 'tourism.mural',
		displayName: 'Murals',
		description:
			'Large-scale street art transforming walls into vibrant public canvases.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by ActionVance on Unsplash',
				link: 'https://unsplash.com/photos/brown-blue-and-yellow-abstract-painting-vjUokUWbFOs',
			},
		],
	},
	{
		name: 'tourism.sculpture',
		displayName: 'Sculptures',
		description:
			'Public artworks in stone, metal, and more, enriching streets and squares.',
		attributions: [
			{
				type: 'image',
				text: 'Photo by Michele Bitetto on Unsplash',
				link: 'https://unsplash.com/photos/water-fountain-in-front-of-building-2y6ojwauKJI',
			},
		],
	},
	{
		name: 'tourism.famous_filming_location',
		displayName: 'Famous Filming Locations',
		description:
			'Real-world settings from beloved movies and TV shows you can visit.',
		attributions: [
			{
				type: 'image',
				text: 'By Steven Lek - Own work, CC BY-SA 4.0, https://commons.wikimedia.org/w/index.php?curid=75908349',
				link: 'https://commons.wikimedia.org/wiki/File:Museo_de_las_Ciencias_Pr%C3%ADncipe_Felipe_Valencia_2019_2.jpg',
			},
		],
	},
].map((x) => ({
	id: generateId(x.name),
	attributions: x.attributions,
	description: x.description,
	name: x.name,
	displayName: x.displayName,
	image: `https://raw.githubusercontent.com/mertturkmenoglu/wl-media/refs/heads/main/categories/${x.name}.webp`,
}));

function generateId(name: string) {
	const id = name.replaceAll('.', '-').replaceAll('_', '-').toLowerCase();
	return id;
}
