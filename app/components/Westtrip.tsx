'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

type TripItem = {
  id: string;
  title: string;
  transport: string;
  map?: string;
  notes?: string;
};

type TripDay = {
  id: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  hotel?: string;
  hotelMap?: string;
  items: TripItem[];
};

type ExtraSection = {
  id: string;
  title: string;
  subtitle: string;
  items: {
    title: string;
    location: string;
    map: string;
    description: string;
  }[];
};

const maps = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const route = (origin: string, destination: string, waypoints?: string[]) => {
  const base = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    origin
  )}&destination=${encodeURIComponent(destination)}&travelmode=driving`;

  return waypoints?.length
    ? `${base}&waypoints=${encodeURIComponent(waypoints.join('|'))}`
    : base;
};

const tripDays: TripDay[] = [
  {
    id: 'd1',
    tabLabel: '5 mai',
    title: '5 mai — LAX → Las Vegas → Kanab',
    subtitle: 'Arrivée à LAX vers 12h — récupération voiture + grosse route',
    hotel: 'Nuit à Kanab (Utah)',
    hotelMap: maps('Kanab Utah hotels'),
    items: [
      {
        id: 'w1-1',
        title: '✈️ Arrivée à LAX',
        transport: 'Arrivée vers 12h + récupération voiture',
        map: maps('Los Angeles International Airport'),
      },
      {
        id: 'w1-2',
        title: '🚗 LAX → Seven Magic Mountains',
        transport: 'Environ 4h à 4h30 selon trafic',
        map: route('Los Angeles International Airport', 'Seven Magic Mountains Nevada'),
        notes: 'Première grosse route. Prévoir eau, essence et snack.',
      },
      {
        id: 'w1-3',
        title: '📸 Seven Magic Mountains',
        transport: 'Stop photo rapide',
        map: maps('Seven Magic Mountains Nevada'),
        notes: 'Installation artistique colorée dans le désert.',
      },
      {
        id: 'w1-4',
        title: '🌃 Pause Las Vegas',
        transport: 'Repas rapide / marche courte sur le Strip',
        map: maps('Las Vegas Strip'),
        notes: 'Ne pas rester trop longtemps pour éviter une arrivée trop tardive à Kanab.',
      },
      {
        id: 'w1-5',
        title: '🚗 Las Vegas → Kanab',
        transport: 'Environ 3h à 3h30',
        map: route('Las Vegas Strip', 'Kanab Utah'),
      },
    ],
  },
  {
    id: 'd2',
    tabLabel: '6 mai',
    title: '6 mai — Page + Monument Valley → Bryce',
    subtitle: 'Antelope Canyon, Horseshoe Bend, Forrest Gump Point',
    hotel: 'Nuit vers Bryce / Tropic (Utah)',
    hotelMap: maps('Tropic Utah hotels'),
    items: [
      {
        id: 'w2-1',
        title: '🚗 Kanab → Lower Antelope Canyon',
        transport: 'Environ 1h15',
        map: route('Kanab Utah', 'Lower Antelope Canyon'),
      },
      {
        id: 'w2-2',
        title: '🏜️ 08:30 — Lower Antelope Canyon',
        transport: 'Billet déjà pris',
        map: maps('Lower Antelope Canyon'),
        notes: 'Arriver en avance pour le check-in.',
      },
      {
        id: 'w2-3',
        title: '📸 Horseshoe Bend',
        transport: 'Environ 15 min depuis Antelope',
        map: maps('Horseshoe Bend Arizona'),
        notes: 'Vue spectaculaire sur le Colorado.',
      },
      {
        id: 'w2-4',
        title: '📸 Forrest Gump Point',
        transport: 'Environ 2h30 depuis Page',
        map: maps('Forrest Gump Point Monument Valley'),
        notes: 'Spot mythique sur la route avec Monument Valley au fond.',
      },
      {
        id: 'w2-5',
        title: '🏜️ Monument Valley',
        transport: 'Scenic drive / points de vue',
        map: maps('Monument Valley Visitor Center'),
        notes: 'Vérifier les règles locales, territoire Navajo.',
      },
      {
        id: 'w2-6',
        title: '🚗 Monument Valley → Bryce / Tropic',
        transport: 'Environ 4h30 à 5h',
        map: route('Monument Valley Visitor Center', 'Tropic Utah'),
      },
    ],
  },
  {
    id: 'd3',
    tabLabel: '7 mai',
    title: '7 mai — Bryce Canyon',
    subtitle: 'Sunrise, hoodoos et randonnée',
    hotel: 'Nuit vers Bryce / Tropic (Utah)',
    hotelMap: maps('Tropic Utah hotels'),
    items: [
      {
        id: 'w3-1',
        title: '🌅 Sunrise Point',
        transport: 'Lever du soleil',
        map: maps('Sunrise Point Bryce Canyon'),
      },
      {
        id: 'w3-2',
        title: '🥾 Navajo Loop + Queen’s Garden',
        transport: 'Randonnée incontournable',
        map: maps('Navajo Loop Trail Bryce Canyon'),
      },
      {
        id: 'w3-3',
        title: '📸 Inspiration Point',
        transport: 'Point de vue panoramique',
        map: maps('Inspiration Point Bryce Canyon'),
      },
      {
        id: 'w3-4',
        title: '📸 Bryce Point',
        transport: 'Autre gros point de vue',
        map: maps('Bryce Point Bryce Canyon'),
      },
      {
        id: 'w3-5',
        title: '🌄 Sunset Point',
        transport: 'Fin de journée',
        map: maps('Sunset Point Bryce Canyon'),
      },
    ],
  },
  {
    id: 'd4',
    tabLabel: '8 mai',
    title: '8 mai — Bryce → Zion',
    subtitle: 'Route courte + première découverte de Zion',
    hotel: 'Nuit à Springdale / Hurricane (Zion)',
    hotelMap: maps('Springdale Utah hotels'),
    items: [
      {
        id: 'w4-1',
        title: '🚗 Bryce → Zion',
        transport: 'Environ 2h à 2h30',
        map: route('Bryce Canyon National Park', 'Springdale Utah'),
      },
      {
        id: 'w4-2',
        title: '🥾 Canyon Overlook Trail',
        transport: 'Petite randonnée avec grosse vue',
        map: maps('Canyon Overlook Trail Zion'),
      },
      {
        id: 'w4-3',
        title: '📸 Canyon Junction Bridge',
        transport: 'Spot photo classique',
        map: maps('Canyon Junction Bridge Zion'),
      },
      {
        id: 'w4-4',
        title: '🌄 Watchman Trail',
        transport: 'Option sunset si vous avez l’énergie',
        map: maps('Watchman Trail Zion'),
      },
    ],
  },
  {
    id: 'd5',
    tabLabel: '9 mai',
    title: '9 mai — Zion → Idaho Falls',
    subtitle: 'Matin à Zion puis route vers Yellowstone',
    hotel: 'Nuit à Idaho Falls (Idaho)',
    hotelMap: maps('Idaho Falls hotels'),
    items: [
      {
        id: 'w5-1',
        title: '🥾 Scout Lookout / Angels Landing',
        transport: 'Matin tôt',
        map: maps('Angels Landing Zion National Park'),
        notes: 'Angels Landing nécessite un permis. Scout Lookout est une bonne alternative.',
      },
      {
        id: 'w5-2',
        title: '🌿 Riverside Walk',
        transport: 'Balade facile',
        map: maps('Riverside Walk Zion'),
      },
      {
        id: 'w5-3',
        title: '🚗 Zion → Idaho Falls',
        transport: 'Longue route, environ 8h à 9h',
        map: route('Springdale Utah', 'Idaho Falls Idaho', ['Salt Lake City Utah']),
        notes: 'Journée très route. Salt Lake City peut servir de pause.',
      },
    ],
  },
  {
    id: 'd6',
    tabLabel: '10 mai',
    title: '10 mai — Idaho Falls → Yellowstone',
    subtitle: 'Entrée par West Yellowstone + premiers geysers',
    hotel: 'Nuit à West Yellowstone (Montana)',
    hotelMap: maps('West Yellowstone hotels'),
    items: [
      {
        id: 'w6-1',
        title: '🚗 Idaho Falls → West Yellowstone',
        transport: 'Environ 2h à 2h30',
        map: route('Idaho Falls Idaho', 'West Yellowstone Montana'),
      },
      {
        id: 'w6-2',
        title: '🏞️ West Entrance Yellowstone',
        transport: 'Entrée du parc',
        map: maps('West Entrance Yellowstone National Park'),
        notes: 'Vérifier l’ouverture des routes avant de partir.',
      },
      {
        id: 'w6-3',
        title: '🌋 Old Faithful',
        transport: 'Geyser incontournable',
        map: maps('Old Faithful Yellowstone'),
      },
      {
        id: 'w6-4',
        title: '🎨 Grand Prismatic Spring',
        transport: 'Point emblématique',
        map: maps('Grand Prismatic Spring Yellowstone'),
      },
      {
        id: 'w6-5',
        title: '🥾 Fairy Falls Overlook',
        transport: 'Vue haute sur Grand Prismatic',
        map: maps('Fairy Falls Trailhead Yellowstone'),
      },
    ],
  },
  {
    id: 'd7',
    tabLabel: '11 mai',
    title: '11 mai — Yellowstone',
    subtitle: 'Faune, canyon et sources chaudes',
    hotel: 'Nuit à West Yellowstone (Montana)',
    hotelMap: maps('West Yellowstone hotels'),
    items: [
      {
        id: 'w7-1',
        title: '🐺 Lamar Valley',
        transport: 'Très tôt le matin',
        map: maps('Lamar Valley Yellowstone'),
        notes: 'Meilleur secteur pour voir des animaux.',
      },
      {
        id: 'w7-2',
        title: '💦 Mammoth Hot Springs',
        transport: 'Terrasses calcaires',
        map: maps('Mammoth Hot Springs Yellowstone'),
      },
      {
        id: 'w7-3',
        title: '🌊 Grand Canyon of the Yellowstone',
        transport: 'Points de vue majeurs',
        map: maps('Grand Canyon of the Yellowstone'),
      },
      {
        id: 'w7-4',
        title: '📸 Artist Point',
        transport: 'Vue classique sur la cascade',
        map: maps('Artist Point Yellowstone'),
      },
    ],
  },
  {
    id: 'd8',
    tabLabel: '12 mai',
    title: '12 mai — Yellowstone → Elko / Reno',
    subtitle: 'Début de la grosse descente vers Yosemite',
    hotel: 'Nuit étape Nevada',
    hotelMap: maps('Elko Nevada hotels'),
    items: [
      {
        id: 'w8-1',
        title: '🚗 West Yellowstone → Elko',
        transport: 'Très longue route',
        map: route('West Yellowstone Montana', 'Elko Nevada'),
        notes: 'Journée principalement trajet. Ajuster selon fatigue.',
      },
      {
        id: 'w8-2',
        title: '⛽ Pauses essence / repas',
        transport: 'À prévoir régulièrement',
        map: maps('Elko Nevada'),
      },
      {
        id: 'w8-3',
        title: '🏨 Nuit étape',
        transport: 'Elko, Winnemucca ou Reno selon avancement',
        map: maps('Elko Nevada hotels'),
      },
    ],
  },
  {
    id: 'd9',
    tabLabel: '13 mai',
    title: '13 mai — Route vers Yosemite',
    subtitle: 'Arrivée proche Yosemite',
    hotel: 'Nuit vers Yosemite / Mariposa',
    hotelMap: maps('Mariposa California hotels'),
    items: [
      {
        id: 'w9-1',
        title: '🚗 Elko / Reno → Yosemite',
        transport: 'Longue route',
        map: route('Elko Nevada', 'Yosemite Valley'),
      },
      {
        id: 'w9-2',
        title: '📸 Tunnel View si arrivée assez tôt',
        transport: 'Premier aperçu mythique',
        map: maps('Tunnel View Yosemite'),
      },
      {
        id: 'w9-3',
        title: '🏨 Installation hôtel',
        transport: 'El Portal, Mariposa ou Yosemite West',
        map: maps('Yosemite hotels'),
      },
    ],
  },
  {
    id: 'd10',
    tabLabel: '14 mai',
    title: '14 mai — Yosemite',
    subtitle: 'Vallée, cascades et points de vue',
    hotel: 'Nuit vers Yosemite / Mariposa',
    hotelMap: maps('Mariposa California hotels'),
    items: [
      {
        id: 'w10-1',
        title: '🌄 Tunnel View',
        transport: 'Matin ou sunset',
        map: maps('Tunnel View Yosemite'),
      },
      {
        id: 'w10-2',
        title: '💦 Yosemite Falls',
        transport: 'Balade facile',
        map: maps('Yosemite Falls'),
      },
      {
        id: 'w10-3',
        title: '🥾 Mist Trail / Vernal Fall',
        transport: 'Randonnée selon niveau',
        map: maps('Mist Trail Yosemite'),
      },
      {
        id: 'w10-4',
        title: '📸 Valley View',
        transport: 'Spot photo calme',
        map: maps('Valley View Yosemite'),
      },
    ],
  },
  {
    id: 'd11',
    tabLabel: '15 mai',
    title: '15 mai — Yosemite → San Francisco',
    subtitle: 'Route vers SF + première soirée',
    hotel: 'Nuit à San Francisco',
    hotelMap: maps('San Francisco hotels'),
    items: [
      {
        id: 'w11-1',
        title: '🚗 Yosemite → San Francisco',
        transport: 'Environ 4h à 5h',
        map: route('Yosemite Valley', 'San Francisco'),
      },
      {
        id: 'w11-2',
        title: '🌉 Golden Gate Bridge',
        transport: 'Première vue si météo OK',
        map: maps('Golden Gate Bridge San Francisco'),
      },
      {
        id: 'w11-3',
        title: '🌊 Fisherman’s Wharf',
        transport: 'Balade / repas',
        map: maps('Fishermans Wharf San Francisco'),
      },
    ],
  },
  {
    id: 'd12',
    tabLabel: '16 mai',
    title: '16 mai — San Francisco',
    subtitle: 'Golden Gate, Alcatraz, quartiers',
    hotel: 'Nuit à San Francisco',
    hotelMap: maps('San Francisco hotels'),
    items: [
      {
        id: 'w12-1',
        title: '🌉 Battery Spencer',
        transport: 'Meilleure vue Golden Gate',
        map: maps('Battery Spencer Golden Gate Bridge'),
      },
      {
        id: 'w12-2',
        title: '🚢 Alcatraz',
        transport: 'À réserver en avance',
        map: maps('Alcatraz Landing Pier 33'),
      },
      {
        id: 'w12-3',
        title: '🏘️ Painted Ladies',
        transport: 'Spot photo',
        map: maps('Painted Ladies San Francisco'),
      },
      {
        id: 'w12-4',
        title: '🚋 Lombard Street',
        transport: 'Rue iconique',
        map: maps('Lombard Street San Francisco'),
      },
    ],
  },
  {
    id: 'd13',
    tabLabel: '17 mai',
    title: '17 mai — San Francisco → Big Sur → Morro Bay',
    subtitle: 'Pacific Coast Highway',
    hotel: 'Nuit à Morro Bay / San Luis Obispo',
    hotelMap: maps('Morro Bay hotels'),
    items: [
      {
        id: 'w13-1',
        title: '🚗 San Francisco → Monterey',
        transport: 'Début Highway 1',
        map: route('San Francisco', 'Monterey California'),
      },
      {
        id: 'w13-2',
        title: '🌊 17-Mile Drive',
        transport: 'Route panoramique',
        map: maps('17 Mile Drive California'),
      },
      {
        id: 'w13-3',
        title: '🌉 Bixby Creek Bridge',
        transport: 'Stop photo incontournable',
        map: maps('Bixby Creek Bridge'),
      },
      {
        id: 'w13-4',
        title: '🌅 Big Sur',
        transport: 'Falaises, océan et points de vue',
        map: maps('Big Sur California'),
      },
      {
        id: 'w13-5',
        title: '🚗 Big Sur → Morro Bay',
        transport: 'Route côtière',
        map: route('Big Sur California', 'Morro Bay California'),
      },
    ],
  },
  {
    id: 'd14',
    tabLabel: '18 mai',
    title: '18 mai — Morro Bay → Santa Barbara → Los Angeles',
    subtitle: 'Fin de la côte + arrivée LA',
    hotel: 'Nuit à Los Angeles',
    hotelMap: maps('Los Angeles hotels'),
    items: [
      {
        id: 'w14-1',
        title: '🌊 Morro Rock',
        transport: 'Petit stop matin',
        map: maps('Morro Rock'),
      },
      {
        id: 'w14-2',
        title: '🚗 Morro Bay → Santa Barbara',
        transport: 'Environ 2h',
        map: route('Morro Bay', 'Santa Barbara California'),
      },
      {
        id: 'w14-3',
        title: '🌴 Santa Barbara',
        transport: 'Pause repas / balade',
        map: maps('Santa Barbara California'),
      },
      {
        id: 'w14-4',
        title: '🌊 Malibu',
        transport: 'Route vers LA',
        map: maps('Malibu California'),
      },
      {
        id: 'w14-5',
        title: '🎡 Santa Monica Pier',
        transport: 'Fin de journée',
        map: maps('Santa Monica Pier'),
      },
    ],
  },
  {
    id: 'd15',
    tabLabel: '19 mai',
    title: '19 mai — Los Angeles',
    subtitle: 'Hollywood, Griffith, Beverly Hills',
    hotel: 'Nuit à Los Angeles',
    hotelMap: maps('Los Angeles hotels'),
    items: [
      {
        id: 'w15-1',
        title: '⭐ Hollywood Walk of Fame',
        transport: 'Balade rapide',
        map: maps('Hollywood Walk of Fame'),
      },
      {
        id: 'w15-2',
        title: '🎬 Hollywood Sign View',
        transport: 'Point de vue',
        map: maps('Hollywood Sign Viewpoint'),
      },
      {
        id: 'w15-3',
        title: '🌇 Griffith Observatory',
        transport: 'Sunset idéal',
        map: maps('Griffith Observatory'),
      },
      {
        id: 'w15-4',
        title: '🌴 Beverly Hills / Rodeo Drive',
        transport: 'Balade',
        map: maps('Rodeo Drive Beverly Hills'),
      },
    ],
  },
  {
    id: 'd16',
    tabLabel: '20 mai',
    title: '20 mai — Los Angeles plage',
    subtitle: 'Venice, Santa Monica, Malibu',
    hotel: 'Nuit à Los Angeles',
    hotelMap: maps('Los Angeles hotels'),
    items: [
      {
        id: 'w16-1',
        title: '🏖️ Venice Beach',
        transport: 'Balade bord de mer',
        map: maps('Venice Beach Los Angeles'),
      },
      {
        id: 'w16-2',
        title: '🏋️ Muscle Beach',
        transport: 'À côté de Venice',
        map: maps('Muscle Beach Venice'),
      },
      {
        id: 'w16-3',
        title: '🎡 Santa Monica Pier',
        transport: 'Classique LA',
        map: maps('Santa Monica Pier'),
      },
      {
        id: 'w16-4',
        title: '🌅 Malibu sunset',
        transport: 'Fin de journée',
        map: maps('El Matador State Beach Malibu'),
      },
    ],
  },
  {
    id: 'd17',
    tabLabel: '21 mai',
    title: '21 mai — Los Angeles option parc / studio',
    subtitle: 'Universal Studios ou Warner Bros',
    hotel: 'Nuit à Los Angeles',
    hotelMap: maps('Los Angeles hotels'),
    items: [
      {
        id: 'w17-1',
        title: '🎢 Universal Studios Hollywood',
        transport: 'Option journée complète',
        map: maps('Universal Studios Hollywood'),
      },
      {
        id: 'w17-2',
        title: '🎬 Warner Bros Studio Tour',
        transport: 'Alternative plus cinéma',
        map: maps('Warner Bros Studio Tour Hollywood'),
      },
      {
        id: 'w17-3',
        title: '🌃 Downtown LA / Arts District',
        transport: 'Soirée si énergie',
        map: maps('Arts District Los Angeles'),
      },
    ],
  },
  {
    id: 'd18',
    tabLabel: '22 mai',
    title: '22 mai — Los Angeles dernier jour',
    subtitle: 'Derniers spots + valises',
    hotel: 'Nuit proche LAX',
    hotelMap: maps('LAX hotels'),
    items: [
      {
        id: 'w18-1',
        title: '🏙️ Downtown LA',
        transport: 'Petit tour urbain',
        map: maps('Downtown Los Angeles'),
      },
      {
        id: 'w18-2',
        title: '📚 The Last Bookstore',
        transport: 'Spot photo sympa',
        map: maps('The Last Bookstore Los Angeles'),
      },
      {
        id: 'w18-3',
        title: '🌮 Grand Central Market',
        transport: 'Repas',
        map: maps('Grand Central Market Los Angeles'),
      },
      {
        id: 'w18-4',
        title: '🧳 Préparation départ',
        transport: 'Essence, valises, rangement voiture',
        map: maps('Los Angeles International Airport'),
      },
    ],
  },
  {
    id: 'd19',
    tabLabel: '23 mai',
    title: '23 mai — Retour voiture + départ LAX',
    subtitle: 'Fin du road trip',
    hotel: 'Départ',
    hotelMap: maps('Los Angeles International Airport'),
    items: [
      {
        id: 'w19-1',
        title: '⛽ Faire le plein',
        transport: 'Avant retour voiture',
        map: maps('gas station near LAX'),
      },
      {
        id: 'w19-2',
        title: '🚗 Retour voiture',
        transport: 'Prévoir marge',
        map: maps('LAX car rental return'),
      },
      {
        id: 'w19-3',
        title: '✈️ Départ LAX',
        transport: 'Arriver tôt à l’aéroport',
        map: maps('Los Angeles International Airport'),
      },
    ],
  },
];

const extraSections: ExtraSection[] = [
  {
    id: 'drone',
    title: '🛸 Spots vue & drone',
    subtitle: 'Points de vue magnifiques — vérifier les règles drone avant chaque vol',
    items: [
      {
        title: 'Seven Magic Mountains',
        location: 'Nevada',
        map: maps('Seven Magic Mountains Nevada'),
        description:
          'Installation artistique colorée en plein désert, parfaite pour photos larges.',
      },
      {
        title: 'Horseshoe Bend',
        location: 'Page, Arizona',
        map: maps('Horseshoe Bend Arizona'),
        description:
          'Méandre spectaculaire du Colorado. Très beau spot photo, drone à vérifier.',
      },
      {
        title: 'Forrest Gump Point',
        location: 'Monument Valley',
        map: maps('Forrest Gump Point Monument Valley'),
        description:
          'Route mythique avec Monument Valley en fond. Attention aux voitures.',
      },
      {
        title: 'Monument Valley',
        location: 'Navajo Nation',
        map: maps('Monument Valley Visitor Center'),
        description:
          'Paysage iconique de l’Ouest américain. Drone très réglementé.',
      },
      {
        title: 'Inspiration Point',
        location: 'Bryce Canyon',
        map: maps('Inspiration Point Bryce Canyon'),
        description:
          'Vue panoramique sur les hoodoos orange de Bryce.',
      },
      {
        title: 'Canyon Overlook',
        location: 'Zion',
        map: maps('Canyon Overlook Trail Zion'),
        description:
          'Petite randonnée avec vue impressionnante sur Zion. Drone interdit dans les parcs nationaux.',
      },
      {
        title: 'Battery Spencer',
        location: 'San Francisco',
        map: maps('Battery Spencer Golden Gate Bridge'),
        description:
          'Superbe vue sur le Golden Gate Bridge.',
      },
      {
        title: 'Bixby Creek Bridge',
        location: 'Big Sur',
        map: maps('Bixby Creek Bridge'),
        description:
          'Pont iconique sur la côte pacifique, très photogénique.',
      },
      {
        title: 'Griffith Observatory',
        location: 'Los Angeles',
        map: maps('Griffith Observatory'),
        description:
          'Vue sur Los Angeles et le Hollywood Sign, surtout au coucher du soleil.',
      },
      {
        title: 'El Matador Beach',
        location: 'Malibu',
        map: maps('El Matador State Beach Malibu'),
        description:
          'Plage avec rochers, arches naturelles et très belle lumière sunset.',
      },
    ],
  },
  {
    id: 'pauses',
    title: '☕ Pauses entre les trajets',
    subtitle: 'Stops pratiques pour couper les longues routes',
    items: [
      {
        title: 'Barstow',
        location: 'Californie',
        map: maps('Barstow California'),
        description: 'Pause essence / café pratique entre LA et Las Vegas.',
      },
      {
        title: 'Kingman Route 66',
        location: 'Arizona',
        map: maps('Kingman Route 66 Arizona'),
        description: 'Ambiance Route 66, bien pour une pause vintage.',
      },
      {
        title: 'Kanab',
        location: 'Utah',
        map: maps('Kanab Utah'),
        description: 'Ville étape centrale entre Page, Zion et Bryce.',
      },
      {
        title: 'Salt Lake City',
        location: 'Utah',
        map: maps('Salt Lake City Utah'),
        description: 'Bonne grosse pause entre Zion et Yellowstone.',
      },
      {
        title: 'Idaho Falls',
        location: 'Idaho',
        map: maps('Idaho Falls Idaho'),
        description: 'Étape pratique avant West Yellowstone.',
      },
      {
        title: 'Elko',
        location: 'Nevada',
        map: maps('Elko Nevada'),
        description: 'Ville étape utile entre Yellowstone et Yosemite.',
      },
      {
        title: 'Monterey',
        location: 'Californie',
        map: maps('Monterey California'),
        description: 'Pause agréable avant Big Sur.',
      },
      {
        title: 'Santa Barbara',
        location: 'Californie',
        map: maps('Santa Barbara California'),
        description: 'Belle pause entre Morro Bay et Los Angeles.',
      },
    ],
  },
  {
    id: 'hotels',
    title: '🏨 Hôtels / villes où dormir',
    subtitle: 'Villes pratiques selon l’itinéraire',
    items: [
      {
        title: 'Kanab',
        location: 'Utah',
        map: maps('Kanab Utah hotels'),
        description: 'Pratique après Vegas et avant Antelope Canyon.',
      },
      {
        title: 'Tropic / Bryce Canyon City',
        location: 'Bryce Canyon',
        map: maps('Tropic Utah hotels'),
        description: 'Idéal pour dormir proche de Bryce.',
      },
      {
        title: 'Springdale / Hurricane',
        location: 'Zion',
        map: maps('Springdale Utah hotels'),
        description: 'Springdale est idéal mais cher, Hurricane souvent moins cher.',
      },
      {
        title: 'Idaho Falls',
        location: 'Idaho',
        map: maps('Idaho Falls hotels'),
        description: 'Bonne étape avant Yellowstone.',
      },
      {
        title: 'West Yellowstone',
        location: 'Montana',
        map: maps('West Yellowstone hotels'),
        description: 'Très pratique pour entrer dans Yellowstone.',
      },
      {
        title: 'Elko / Reno',
        location: 'Nevada',
        map: maps('Elko Nevada hotels'),
        description: 'Étape pour couper la route vers Yosemite.',
      },
      {
        title: 'Mariposa / El Portal',
        location: 'Yosemite',
        map: maps('Mariposa California hotels'),
        description: 'Options pratiques autour de Yosemite.',
      },
      {
        title: 'San Francisco',
        location: 'Californie',
        map: maps('San Francisco hotels'),
        description: 'Base pour Golden Gate, Alcatraz et Highway 1.',
      },
      {
        title: 'Morro Bay / San Luis Obispo',
        location: 'Highway 1',
        map: maps('Morro Bay hotels'),
        description: 'Très bonne étape entre Big Sur et Los Angeles.',
      },
      {
        title: 'Los Angeles / LAX',
        location: 'Californie',
        map: maps('Los Angeles hotels'),
        description: 'Base finale avant le départ.',
      },
    ],
  },
];

export default function Westtrip() {
  const [activeDayId, setActiveDayId] = useState(tripDays[0].id);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const activeDay = useMemo(
    () => tripDays.find((day) => day.id === activeDayId) ?? tripDays[0],
    [activeDayId]
  );

  const totalItems = useMemo(
    () => tripDays.reduce((acc, day) => acc + day.items.length, 0),
    []
  );

  const checkedCount = useMemo(
    () => Object.values(checkedItems).filter(Boolean).length,
    [checkedItems]
  );

  const progress =
    totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  useEffect(() => {
    const loadChecks = async () => {
      const { data, error } = await supabase
        .from('trip_checks')
        .select('item_id, checked');

      if (!error && data) {
        const next: Record<string, boolean> = {};
        data.forEach((row: { item_id: string; checked: boolean }) => {
          next[row.item_id] = row.checked;
        });
        setCheckedItems(next);
      }

      setLoading(false);
    };

    loadChecks();

    const channel = supabase
      .channel('trip_checks_west_sync')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trip_checks',
        },
        (payload) => {
          const row = payload.new as { item_id?: string; checked?: boolean };

          if (row?.item_id) {
            setCheckedItems((prev) => ({
              ...prev,
              [row.item_id as string]: Boolean(row.checked),
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleItem = async (itemId: string) => {
    const nextChecked = !checkedItems[itemId];

    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: nextChecked,
    }));

    await supabase.from('trip_checks').upsert({
      item_id: itemId,
      checked: nextChecked,
      updated_at: new Date().toISOString(),
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-stone-100 text-stone-900">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <section className="mb-6 rounded-3xl bg-gradient-to-br from-orange-500 via-amber-600 to-stone-800 p-6 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-100">
            Road Trip Ouest USA
          </p>

          <h1 className="mt-2 text-3xl font-black leading-tight md:text-5xl">
            🌵 Ouest Américain
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-orange-50 md:text-base">
            Du 5 au 23 mai — LAX, Vegas, Kanab, Page, Monument Valley, Bryce,
            Zion, Yellowstone, Yosemite, San Francisco, Highway 1 et Los Angeles.
          </p>

          <div className="mt-5 rounded-2xl bg-white/15 p-4 backdrop-blur">
            <div className="mb-2 flex items-center justify-between text-sm font-semibold">
              <span>Progression checklist</span>
              <span>
                {checkedCount}/{totalItems} — {progress}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            {loading && (
              <p className="mt-2 text-xs text-orange-100">
                Synchronisation Supabase en cours...
              </p>
            )}
          </div>
        </section>

        <nav className="mb-5 flex gap-2 overflow-x-auto pb-2">
          {tripDays.map((day) => {
            const active = day.id === activeDayId;

            return (
              <button
                key={day.id}
                type="button"
                onClick={() => setActiveDayId(day.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold shadow-sm transition ${
                  active
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-700 hover:bg-orange-100'
                }`}
              >
                {day.tabLabel}
              </button>
            );
          })}
        </nav>

        <section className="rounded-3xl bg-white p-5 shadow-xl">
          <div className="mb-5">
            <h2 className="text-2xl font-black text-stone-900">
              {activeDay.title}
            </h2>

            <p className="mt-1 text-sm text-stone-600">
              {activeDay.subtitle}
            </p>

            {activeDay.hotel && (
              <a
                href={activeDay.hotelMap}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-800 hover:bg-orange-200"
              >
                🏨 {activeDay.hotel}
              </a>
            )}
          </div>

          <div className="space-y-3">
            {activeDay.items.map((item) => {
              const checked = Boolean(checkedItems[item.id]);

              return (
                <article
                  key={item.id}
                  className={`rounded-2xl border p-4 transition ${
                    checked
                      ? 'border-green-200 bg-green-50'
                      : 'border-orange-100 bg-gradient-to-br from-white to-orange-50'
                  }`}
                >
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm font-black transition ${
                        checked
                          ? 'border-green-600 bg-green-600 text-white'
                          : 'border-orange-400 bg-white text-orange-600'
                      }`}
                    >
                      {checked ? '✓' : ''}
                    </button>

                    <div className="min-w-0 flex-1">
                      <h3
                        className={`text-base font-black ${
                          checked
                            ? 'text-green-800 line-through'
                            : 'text-stone-900'
                        }`}
                      >
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm font-semibold text-stone-700">
                        {item.transport}
                      </p>

                      {item.notes && (
                        <p className="mt-2 rounded-xl bg-white/80 p-3 text-sm text-stone-600">
                          {item.notes}
                        </p>
                      )}

                      {item.map && (
                        <a
                          href={item.map}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex rounded-full bg-stone-900 px-4 py-2 text-sm font-bold text-white hover:bg-stone-700"
                        >
                          📍 Ouvrir Maps
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-6 space-y-4">
          {extraSections.map((section) => (
            <details
              key={section.id}
              className="group rounded-3xl bg-white p-5 shadow-xl"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-stone-900">
                    {section.title}
                  </h2>
                  <p className="mt-1 text-sm text-stone-600">
                    {section.subtitle}
                  </p>
                </div>

                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-black text-orange-800">
                  ▼
                </span>
              </summary>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {section.items.map((item) => (
                  <article
                    key={`${section.id}-${item.title}`}
                    className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-4"
                  >
                    <h3 className="text-base font-black text-stone-900">
                      {item.title}{' '}
                      <span className="text-sm font-semibold text-stone-500">
                        ({item.location})
                      </span>
                    </h3>

                    <p className="mt-2 text-sm text-stone-700">
                      {item.description}
                    </p>

                    <a
                      href={item.map}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex rounded-full bg-stone-900 px-4 py-2 text-sm font-bold text-white hover:bg-stone-700"
                    >
                      📍 Ouvrir Maps
                    </a>
                  </article>
                ))}
              </div>
            </details>
          ))}
        </section>
      </div>
    </main>
  );
}