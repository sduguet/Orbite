const VERSION = '1.1.0';
const TYPES = ['planet', 'lune', 'asteroid', 'star', 'ship'];
const ELEMENTS = ['feu', 'eau', 'air', 'terre'];
const NATURES = ['Tellurique', 'Gazeuse', 'Naine'];
const DEFAULT_DECK = ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012'];
const ALL_CARDS = [
    // Planets de base
    {
        'id': '001',
        'name': 'Pyrosia',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[0]],
        'mana': 1,
        'pwr': 2,
        'desc': ``,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '002',
        'name': 'Oceania',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[1]],
        'mana': 2,
        'pwr': 3,
        'desc': ``,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '003',
        'name': 'Ventosa',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[2]],
        'mana': 3,
        'pwr': 4,
        'desc': ``,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '004',
        'name': 'Stoneheart',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[3]],
        'mana': 4,
        'pwr': 6,
        'desc': ``,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '005',
        'name': 'Pyrocloudus',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[0]],
        'mana': 3,
        'pwr': 4,
        'desc': ``,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '006',
        'name': 'Vaporia',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[1]],
        'mana': 4,
        'pwr': 6,
        'desc': ``,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '007',
        'name': 'Windgiant',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[2]],
        'mana': 5,
        'pwr': 9,
        'desc': ``,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '008',
        'name': 'Naturamia',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[3]],
        'mana': 6,
        'pwr': 12,
        'desc': ``,
        'offrande': true,
        'playable': true,
    },
    // Lunes de base
    {
        'id': '009',
        'name': 'Igniluna',
        'type': TYPES[1],
        'mana': 4,
        'desc': `[Révélée] Donne +6 d'énergie cosmique aux planète d'élément feu situées à son orbite`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '010',
        'name': 'Aqualuna',
        'type': TYPES[1],
        'mana': 3,
        'desc': `[Révélée] Donne +4 d'énergie cosmique aux planète d'élément eau situées à son orbite`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '011',
        'name': 'Aeroluna',
        'type': TYPES[1],
        'mana': 2,
        'desc': `[Révélée] Donne +3 d'énergie cosmique aux planète d'élément air situées à son orbite`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '012',
        'name': 'Terraluna',
        'type': TYPES[1],
        'mana': 1,
        'desc': `[Révélée] Donne +2 d'énergie cosmique aux planète d'élément terre situées à son orbite`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '013',
        'name': 'Luna Tellus',
        'type': TYPES[1],
        'mana': 6,
        'desc': `[Révélée] Donne +7 d'énergie cosmique aux planète telluriques situées à son orbite`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '014',
        'name': 'Luna Vaporis',
        'type': TYPES[1],
        'mana': 5,
        'desc': `[Révélée] Donne +5 d'énergie cosmique aux planète gazeuse situées à son orbite`,
        'offrande': true,
        'playable': true,
    },
    // Système Solaire
    {
        'id': '015',
        'name': 'Mercure',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[0]],
        'mana': 2,
        'pwr': 2,
        'desc': `[Révélée] énergie cosmique +3 si posée en orbite de l'Étoile`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '016',
        'name': 'Vénus',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[1]],
        'mana': 3,
        'pwr': 0,
        'desc': `[Révélée] Ajoute +3 énergie cosmique à 2 autres planètes sur le terrain`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '017',
        'name': 'Terre',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[3]],
        'mana': 3,
        'pwr': 4,
        'desc': `[Révélée] Ajoute La Lune à votre deck`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '018',
        'name': 'La Lune',
        'type': TYPES[1],
        'mana': 0,
        'desc': `[Révélée] Donne +6 à La Terre si posée sur son orbite`,
        'offrande': false,
        'playable': false,
    },
    {
        'id': '019',
        'name': 'Mars',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[2]],
        'mana': 2,
        'pwr': 2,
        'desc': `Donne à votre prochiane carte posée, si c'est une planète énergie cosmique +2`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '020',
        'name': 'Jupiter',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[0]],
        'mana': 6,
        'pwr': 22,
        'desc': `Si vous avez jouer une carte au tour d'avant, vous ne pouvez pas jouer cette carte`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '021',
        'name': 'Saturne',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[3]],
        'mana': 4,
        'pwr': 7,
        'desc': `[Révélée] Pose entre 2 et 5 Astéroïde sur son orbite (si possible)`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '022',
        'name': 'Astéroïde',
        'type': TYPES[2],
        'mana': 1,
        'desc': `Un beau caillou`,
        'offrande': false,
        'playable': false,
    },
    {
        'id': '023',
        'name': 'Uranus',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[2]],
        'mana': 5,
        'pwr': 3,
        'desc': `[Continu] énergie cosmique +1 à toutes les autres planètes sur le terrain`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '024',
        'name': 'Neptune',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[1]],
        'mana': 4,
        'pwr': 4,
        'desc': `+4 énergie cosmique si rien n'est joué sur son orbite le tour suivant`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '025',
        'name': 'Pluton',
        'type': TYPES[0],
        'nature': NATURES[2],
        'element': [],
        'mana': 1,
        'pwr': 1,
        'desc': `+1 énergie cosmique pour chaque mana restant à la fin du tour`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '026',
        'name': 'Eris',
        'type': TYPES[0],
        'nature': NATURES[2],
        'element': [],
        'mana': 4,
        'pwr': 10,
        'desc': `[Révélée] Détruit une carte random sur le terrain`,
        'offrande': true,
        'playable': true,
    },
    // ---
    {
        'id': '027',
        'name': 'Pegasis B',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[2]],
        'mana': 5,
        'pwr': 0,
        'desc': `[Révélée] L'énergie cosmique de cette carte est égale à L'énergie cosmique actuelle de votre dernière carte jouée`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '028',
        'name': 'Kepler-22 B',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[1]],
        'mana': 4,
        'pwr': 3,
        'desc': `[Continu] +5 énergie cosmique si rien n'est sur son orbite`,
        'offrande': true,
        'playable': true,
    },
    // Proxima
    {
        'id': '029',
        'name': 'Proxima B',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[0]],
        'mana': 1,
        'pwr': 2,
        'desc': `Commence dans votre main de départ`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '030',
        'name': 'Proxima C',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[1]],
        'mana': 2,
        'pwr': 3,
        'desc': `Cette carte est toujours piochée au tour 2`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '031',
        'name': 'Proxima D',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[3]],
        'mana': 6,
        'pwr': 9,
        'desc': `Cette carte est toujours piochée au tour 6`,
        'offrande': true,
        'playable': true,
    },
    // TRAPPIST-1
    {
        'id': '032',
        'name': 'TRAPPIST-1 B',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[3]],
        'mana': 1,
        'pwr': 1,
        'desc': `énergie cosmique +3 si une lune est jouée sur son orbite au prochain tour`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '033',
        'name': 'TRAPPIST-1 C',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[1]],
        'mana': 2,
        'pwr': 1,
        'desc': `[Révélée] +2 énergie cosmique à toutes les planètes dans votre deck`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '034',
        'name': 'TRAPPIST-1 D',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[3]],
        'mana': 2,
        'pwr': 2,
        'desc': `Quand vous jouez une lune sur son orbite, énergie cosmique +2`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '035',
        'name': 'TRAPPIST-1 E',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[2]],
        'mana': 2,
        'pwr': -4,
        'desc': `[Révélée] Piochez 2 cartes`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '036',
        'name': 'TRAPPIST-1 F',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[2]],
        'mana': 2,
        'pwr': 3,
        'desc': `[Révélée] Une nouvelle TRAPPIST-1 F rejoint votre main à la fin du tour`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '037',
        'name': 'TRAPPIST-1 G',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[0]],
        'mana': 3,
        'pwr': 1,
        'desc': `Après que vous jouez une carte, cette carte gagne +1 d'énergie cosmique`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '038',
        'name': 'TRAPPIST-1 H',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[0]],
        'mana': 6,
        'pwr': 10,
        'desc': `Coûte 1 mana de moins pour chaque mana non utilisé au tour précédent`,
        'offrande': true,
        'playable': true,
    },
    // Mu Arae
    {
        'id': '039',
        'name': 'Mu Arae B',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[3]],
        'mana': 2,
        'pwr': 2,
        'desc': `[Révélée] +1 mana au prochain tour`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '040',
        'name': 'Mu Arae C',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[1]],
        'mana': 3,
        'pwr': 3,
        'desc': `[Révélée] Toutes les cartes de votre main coûtent maximum 4 mana au prochain tour`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '041',
        'name': 'Mu Arae D',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[2]],
        'mana': 2,
        'pwr': 2,
        'desc': `[Révélée] +1 mana max à partir du prochian tour. [Continu] Vous ne pouvez jouer qu'une seule carte par tour`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '042',
        'name': 'Mu Arae E',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[0]],
        'mana': 5,
        'pwr': 3,
        'desc': `[Continu] Vos carte coûtent 1 mana de moins (minimum 1 mana)`,
        'offrande': true,
        'playable': true,
    },
    // Cancri
    {
        'id': '043',
        'name': 'Cancri B',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[0]],
        'mana': 6,
        'pwr': 14,
        'desc': `[Révélée] Détruit tout ce qui se trouve sur son orbite`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '044',
        'name': 'Cancri C',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[1]],
        'mana': 4,
        'pwr': 10,
        'desc': `[Révélée] Ajoute Hécate sur un emplacement aléatoire`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '045',
        'name': 'Hécate',
        'type': TYPES[2],
        'mana': 0,
        'pwr': 0,
        'desc': `[Continu] -4 aux planètes situées à son orbite`,
        'offrande': false,
        'playable': false,
    },
    {
        'id': '046',
        'name': 'Cancri D',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[2]],
        'mana': 0,
        'pwr': 2,
        'desc': `[Continu] énergie cosmique -1 aux planètes à son orbite`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '047',
        'name': 'Cancri E',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[3]],
        'mana': 1,
        'pwr': -2,
        'desc': `[Révélée] Ajoute Titan à votre main`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '048',
        'name': 'Titan',
        'type': TYPES[1],
        'mana': 1,
        'desc': `[Continu] Donne +2 aux planètes situées à son orbite`,
        'offrande': false,
        'playable': false,
    },
    {
        'id': '049',
        'name': 'Cancri F',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[1]],
        'mana': 1,
        'pwr': 5,
        'desc': `Vous ne pouvez pas jouer cette carte après le tour 3. [Continu] Aucune carte ne peut être jouée sur son orbite`,
        'offrande': true,
        'playable': true,
    },
    // HR 8799
    {
        'id': '050',
        'name': 'HR 8799 B',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[1]],
        'mana': 5,
        'pwr': 10,
        'desc': `[Continu] -6 d'énergie cosmique si placée sur l'orbite de l'Étoile`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '051',
        'name': 'HR 8799 C',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[2]],
        'mana': 4,
        'pwr': 3,
        'desc': `Si votre prochaine carte jouée est une planète, double son énergie cosmique`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '052',
        'name': 'HR 8799 D',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[3]],
        'mana': 6,
        'pwr': 14,
        'desc': `[Révélée] Déplace une lune ou une planète sur son orbite`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '053',
        'name': 'HR 8799 E',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[0]],
        'mana': 4,
        'pwr': 5,
        'desc': `[Continu] Énergie cosmique +1 aux planètes de coût initial 1`,
        'offrande': true,
        'playable': true,
    },
    // ---
    {
        'id': '054',
        'name': 'Super Saturne',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[3]],
        'mana': 2,
        'pwr': 2,
        'desc': `[Continu] Si son orbite est rempli, énergie cosmique +6`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '055',
        'name': 'Ganymède',
        'type': TYPES[1],
        'mana': 4,
        'desc': `[Révélée] Énergie cosmique +3 aux planètes de votre main`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '056',
        'name': 'Io',
        'type': TYPES[1],
        'mana': 3,
        'desc': `[Révélée] Pioche une planète de votre deck et lui retire 1 d'énergie cosmique`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '057',
        'name': 'Callisto',
        'type': TYPES[1],
        'mana': 3,
        'desc': `[Continu] Énergie cosmique +1 aux planètes à son orbite`,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '058',
        'name': 'Phœbé',
        'type': TYPES[1],
        'mana': 4,
        'desc': `[Révélée] Si aucune carte n'est jouée le tour d'après sur son orbite, énergie cosmique +3 à chaque planètes à son orbite`,
        'offrande': true,
        'playable': true,
    },
    // Bi-éléments
    {
        'id': '059',
        'name': 'Pyrothalassa',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[0], ELEMENTS[1]],
        'mana': 1,
        'pwr': 0,
        'desc': ``,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '060',
        'name': 'Aquilonis',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[1], ELEMENTS[2]],
        'mana': 2,
        'pwr': 1,
        'desc': ``,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '061',
        'name': 'Ventorocka',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[2], ELEMENTS[3]],
        'mana': 3,
        'pwr': 2,
        'desc': ``,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '062',
        'name': 'Magmara',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[3], ELEMENTS[0]],
        'mana': 4,
        'pwr': 4,
        'desc': ``,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '063',
        'name': 'Ignivolant',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[0], ELEMENTS[2]],
        'mana': 5,
        'pwr': 7,
        'desc': ``,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '064',
        'name': 'Mudterra',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[3], ELEMENTS[1]],
        'mana': 6,
        'pwr': 9,
        'desc': ``,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '065',
        'name': 'Ignismare',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[0], ELEMENTS[1]],
        'mana': 6,
        'pwr': 9,
        'desc': ``,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '066',
        'name': 'Hydronimbus',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[1], ELEMENTS[2]],
        'mana': 5,
        'pwr': 7,
        'desc': ``,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '067',
        'name': 'Terraventis',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[2], ELEMENTS[3]],
        'mana': 4,
        'pwr': 4,
        'desc': ``,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '068',
        'name': 'Volcanis',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[3], ELEMENTS[0]],
        'mana': 3,
        'pwr': 2,
        'desc': ``,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '069',
        'name': 'Aetherflam',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[0], ELEMENTS[2]],
        'mana': 2,
        'pwr': 1,
        'desc': ``,
        'offrande': true,
        'playable': true,
    },
    {
        'id': '070',
        'name': 'Geohydra',
        'type': TYPES[0],
        'nature': NATURES[1],
        'element': [ELEMENTS[3], ELEMENTS[1]],
        'mana': 1,
        'pwr': 0,
        'desc': ``,
        'offrande': true,
        'playable': true,
    },
    // Negative
    {
        'id': '071',
        'name': 'Negative',
        'type': TYPES[0],
        'nature': NATURES[2],
        'element': [],
        'mana': 3,
        'pwr': -1,
        'desc': `[Révélée] Inverse l'énergie cosmisque et le coût en mana de chaques cartes planète dans votre deck`,
        'offrande': false,
        'playable': true,
        'challenge': `Atteindre au moins 49 points d'énergie cosmique sur une seule planète.`,
    },
    // Gaïamotto
    {
        'id': '072',
        'name': 'Gaïamotto',
        'type': TYPES[0],
        'nature': NATURES[0],
        'element': [ELEMENTS[3]],
        'mana': 5,
        'pwr': 10,
        'desc': `[Début de partie] Ajoute les 4 navettes à votre deck.`,
        'offrande': false,
        'playable': true,
        'challenge': `Marquer au moins 70 points d'énergie cosmique dans une manche.`,
    },
    {
        'id': '073',
        'name': 'Astérix',
        'type': TYPES[4],
        'mana': 1,
        'desc': `[Révélée] Énergie cosmisque +3 à Gaïamotto. La place dans votre main si elle n'est pas en jeu.`,
        'offrande': false,
        'playable': false,
    },
    {
        'id': '074',
        'name': 'Soyouz',
        'type': TYPES[4],
        'mana': 2,
        'desc': `[Révélée] Énergie cosmique +4 à une planète aléatoire posée sur le terrain et la déplace sur son orbite.`,
        'offrande': false,
        'playable': false,
    },
    {
        'id': '075',
        'name': 'Challenger',
        'type': TYPES[4],
        'mana': 3,
        'desc': `[Révélée] +4 mana au prochain tour.`,
        'offrande': false,
        'playable': false,
    },
    {
        'id': '076',
        'name': 'Starship',
        'type': TYPES[4],
        'mana': 4,
        'desc': `[Révélée] Ajuste l'énergie cosmisque des planètes situées à son orbite à celle ayant l'énergie cosmisque la plus élevée.`,
        'offrande': false,
        'playable': false,
    },
    // Athanasios
    {
        'id': '077',
        'name': 'Athanasios',
        'type': TYPES[0],
        'element': [ELEMENTS[0]],
        'nature': NATURES[1],
        'mana': 6,
        'pwr': 12,
        'desc': `[Début de partie] Ajoute les 6 Lunes Quantiques à votre deck.`,
        'offrande': false,
        'playable': true,
        'challenge': `Dépasser la manche 20.`,
    },
    {
        'id': '078',
        'name': 'Quantistica Rossa',
        'type': TYPES[1],
        'mana': 1,
        'desc': `[Révélée] Piochez une carte et +2 énergie quantique à une planètes aléatoire sur le terrain.`,
        'offrande': false,
        'playable': false,
    },
    {
        'id': '079',
        'name': 'Cuántica Verde',
        'type': TYPES[1],
        'mana': 1,
        'desc': `[Révélée] Coût -1 à Athanasios, +1 mana au prochain tour.`,
        'offrande': false,
        'playable': false,
    },
    {
        'id': '080',
        'name': 'Gelbe Quantenmond',
        'type': TYPES[1],
        'mana': 1,
        'desc': `[Révélée] Piochez 2 Lunes Quantiques.`,
        'offrande': false,
        'playable': false,
    },
    {
        'id': '081',
        'name': 'Purple Quantum',
        'type': TYPES[1],
        'mana': 1,
        'desc': `[Continu] Si vous avez joué les 6 lunes Quantiques, énergie quantique +10 à Athanasios. [Continu] Énergie quantique +1 aux planètes à son orbite.`,
        'offrande': false,
        'playable': false,
    },
    {
        'id': '082',
        'name': 'Quântica Laranja',
        'type': TYPES[1],
        'mana': 1,
        'desc': `[Révélée] Piochez une carte. [Continu] Énergie quantique -1 aux planètes à son orbite.`,
        'offrande': false,
        'playable': false,
    },
    {
        'id': '083',
        'name': 'Quantum Caeruleus',
        'type': TYPES[1],
        'mana': 1,
        'desc': `[Révélée] Piochez une carte et déplace une autre carte sur son orbite.`,
        'offrande': false,
        'playable': false,
    },
];

const STARS = [
    {
        'id': '001',
        'name': 'Star',
        'desc': ``,
        'difficulty': 0,
        'type': TYPES[3],
    },
    {
        'id': '002',
        'name': 'Ignis Solis',
        'desc': `+3 énergie cosmique à toutes les planètes d'élément feu`,
        'difficulty': 6,
        'type': TYPES[3],
    },
    {
        'id': '003',
        'name': 'Aquarion',
        'desc': `+3 énergie cosmique à toutes les planètes d'élément eau`,
        'difficulty': 6,
        'type': TYPES[3],
    },
    {
        'id': '004',
        'name': 'Aetheris',
        'desc': `+3 énergie cosmique à toutes les planètes d'élément air`,
        'difficulty': 6,
        'type': TYPES[3],
    },
    {
        'id': '005',
        'name': 'Terranova',
        'desc': `+3 énergie cosmique à toutes les planètes d'élément terre`,
        'difficulty': 6,
        'type': TYPES[3],
    },
    {
        'id': '006',
        'name': 'TRAPPIST-1 A',
        'desc': `+2 énergie cosmique à toutes les planètes telluriques`,
        'difficulty': 6,
        'type': TYPES[3],
    },
    {
        'id': '007',
        'name': 'Mu Arae A',
        'desc': `+2 énergie cosmique à toutes les planètes gazeuses`,
        'difficulty': 6,
        'type': TYPES[3],
    },
    {
        'id': '008',
        'name': 'TRAPPIST-1 A Negative',
        'desc': `-2 énergie cosmique à toutes les planètes telluriques`,
        'difficulty': -3,
        'type': TYPES[3],
    },
    {
        'id': '009',
        'name': 'Mu Arae A Negative',
        'desc': `-2 énergie cosmique à toutes les planètes gazeuses`,
        'difficulty': -3,
        'type': TYPES[3],
    },
    {
        'id': '010',
        'name': 'Ceinturion',
        'desc': `Bonus de +6 énergie cosmique si son orbite est rempli`,
        'pwr': 0,
        'difficulty': 6,
        'type': TYPES[3],
    },
    {
        'id': '011',
        'name': 'Astrum Solitarius',
        'desc': `Bonus de +6 énergie cosmique si son orbite est vide`,
        'pwr': 0,
        'difficulty': 6,
        'type': TYPES[3],
    },
    {
        'id': '012',
        'name': 'Acceleria',
        'desc': `Fini la manche après le tour 5`,
        'difficulty': -10,
        'type': TYPES[3],
    },
    {
        'id': '013',
        'name': 'Procrastina',
        'desc': `Fini la manche après le tour 7`,
        'difficulty': 16,
        'type': TYPES[3],
    },
    {
        'id': '014',
        'name': 'Astroruptor',
        'desc': `Fait apparaître 6 astéroïdes sur le terrain de façon aléatoire en début de partie`,
        'difficulty': -1,
        'type': TYPES[3],
    },
    {
        'id': '015',
        'name': 'Cosmokhaos',
        'desc': `Ajoute 2 cartes Astéroïde dans votre deck en début de partie`,
        'difficulty': -3,
        'type': TYPES[3],
    },
    {
        'id': '016',
        'name': 'Black hole',
        'desc': `Énergie cosmique -2 aux planètes à son orbite`,
        'difficulty': -1,
        'type': TYPES[3],
    },
    {
        'id': '017',
        'name': 'Soleil',
        'desc': `+3 énergie cosmique à toutes les planètes du système Solaire`,
        'difficulty': 4,
        'type': TYPES[3],
    },
    {
        'id': '018',
        'name': 'Soleil Negative',
        'desc': `-3 énergie cosmique à toutes les planètes du système Solaire`,
        'difficulty': -2,
        'type': TYPES[3],
    },
    {
        'id': '019',
        'name': 'Ignis Solis Negative',
        'desc': `-3 énergie cosmique à toutes les planètes d'élément feu`,
        'difficulty': -4,
        'type': TYPES[3],
    },
    {
        'id': '020',
        'name': 'Aquarion Negative',
        'desc': `-3 énergie cosmique à toutes les planètes d'élément eau`,
        'difficulty': -4,
        'type': TYPES[3],
    },
    {
        'id': '021',
        'name': 'Aetheris Negative',
        'desc': `-3 énergie cosmique à toutes les planètes d'élément air`,
        'difficulty': -4,
        'type': TYPES[3],
    },
    {
        'id': '022',
        'name': 'Terranova Negative',
        'desc': `-3 énergie cosmique à toutes les planètes d'élément terre`,
        'difficulty': -4,
        'type': TYPES[3],
    },
];