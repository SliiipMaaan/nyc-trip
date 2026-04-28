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
  groups: {
    title: string;
    items: {
      title: string;
      map: string;
      description: string;
    }[];
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
    id: 'w1',
    tabLabel: '5 mai',
    title: '5 mai — LAX → Las Vegas → Kanab',
    subtitle: 'Arrivée à LAX vers 12h, récupération voiture puis grosse route vers l’Utah.',
    hotel: 'Nuit à Kanab',
    hotelMap: maps('Kanab Utah hotels'),
    items: [
      {
        id: 'w1-1',
        title: '✈️ Arrivée à LAX',
        transport: 'Arrivée vers 12h + récupération voiture',
        map: maps('Los Angeles International Airport'),
        notes: 'Prévoir le temps d’immigration, bagages et location voiture.',
      },
      {
        id: 'w1-2',
        title: '🚗 LAX → Las Vegas',
        transport: 'Environ 4h30 à 5h30 selon trafic',
        map: route('Los Angeles International Airport', 'Las Vegas Strip', [
          'Seven Magic Mountains Nevada',
          'Barstow California',
        ]),
        notes: 'Points sympas sur la route : Barstow, désert de Mojave, Seven Magic Mountains.',
      },
      {
        id: 'w1-3',
        title: '📸 Seven Magic Mountains',
        transport: 'Stop photo rapide avant Las Vegas',
        map: maps('Seven Magic Mountains Nevada'),
        notes: 'Beau spot coloré dans le désert. Possible spot drone à vérifier selon règles locales.',
      },
      {
        id: 'w1-4',
        title: '🌃 Pause Las Vegas',
        transport: 'Pause repas / marche courte sur le Strip',
        map: maps('Las Vegas Strip'),
        notes: 'Ne pas rester trop longtemps pour éviter une arrivée très tardive à Kanab.',
      },
      {
        id: 'w1-5',
        title: '🚗 Las Vegas → Kanab',
        transport: 'Environ 3h à 3h30',
        map: route('Las Vegas Strip', 'Kanab Utah'),
        notes: '➡️ Fin de journée : direction Kanab pour dormir.',
      },
    ],
  },
  {
    id: 'w2',
    tabLabel: '6 mai',
    title: '6 mai — Page + Monument Valley → Bryce',
    subtitle: 'Lower Antelope Canyon à 8h30, Horseshoe Bend, Monument Valley et route vers Bryce.',
    hotel: 'Nuit vers Orderville / Glendale / Hatch / Bryce',
    hotelMap: maps('Orderville Glendale Hatch Utah hotels'),
    items: [
      {
        id: 'w2-1',
        title: '🚗 Kanab → Lower Antelope Canyon',
        transport: 'Environ 1h15',
        map: route('Kanab Utah', 'Lower Antelope Canyon'),
        notes: 'Partir tôt. Arriver en avance pour le check-in.',
      },
      {
        id: 'w2-2',
        title: '🏜️ 08h30 — Lower Antelope Canyon',
        transport: 'Billets déjà pris',
        map: maps('Lower Antelope Canyon'),
        notes: 'Visite guidée obligatoire. Prévoir marge parking/check-in.',
      },
      {
        id: 'w2-3',
        title: '📸 Horseshoe Bend',
        transport: 'Environ 15 min depuis Antelope Canyon',
        map: maps('Horseshoe Bend Arizona'),
        notes: 'Un des plus beaux points de vue du voyage.',
      },
      {
        id: 'w2-4',
        title: '🚗 Page → Forrest Gump Point',
        transport: 'Environ 2h15 à 2h45',
        map: route('Page Arizona', 'Forrest Gump Point Monument Valley'),
        notes: 'Route très photogénique vers Monument Valley.',
      },
      {
        id: 'w2-5',
        title: '📸 Forrest Gump Point',
        transport: 'Stop photo mythique sur l’US-163',
        map: maps('Forrest Gump Point Monument Valley'),
        notes: 'Attention circulation. Bon spot photo et possiblement drone selon règles locales.',
      },
      {
        id: 'w2-6',
        title: '🏜️ Monument Valley',
        transport: 'Visitor Center / vues principales',
        map: maps('Monument Valley Visitor Center'),
        notes: 'Territoire Navajo : vérifier horaires, accès et règles drone.',
      },
      {
        id: 'w2-7',
        title: '🚗 Monument Valley → zone Bryce',
        transport: 'Environ 4h30 à 5h30 selon ville de nuit',
        map: route('Monument Valley Visitor Center', 'Hatch Utah'),
        notes: '➡️ Fin de journée : direction Orderville / Glendale / Hatch / Bryce pour dormir.',
      },
    ],
  },
  {
    id: 'w3',
    tabLabel: '7 mai',
    title: '7 mai — Bryce Canyon journée complète',
    subtitle: 'Journée complète dans Bryce Canyon : hoodoos, points de vue et randonnée.',
    hotel: 'Nuit vers Bryce / Hatch / Glendale / Orderville',
    hotelMap: maps('Bryce Canyon Hatch Glendale Orderville hotels'),
    items: [
      {
        id: 'w3-1',
        title: '🌅 Sunrise Point',
        transport: 'Lever de soleil si possible',
        map: maps('Sunrise Point Bryce Canyon'),
        notes: 'Très beau au lever du soleil.',
      },
      {
        id: 'w3-2',
        title: '🥾 Navajo Loop + Queen’s Garden',
        transport: 'Randonnée incontournable',
        map: maps('Navajo Loop Queen Garden Trail Bryce Canyon'),
        notes: 'Le meilleur combo pour descendre au milieu des hoodoos.',
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
        transport: 'Vue large sur l’amphithéâtre',
        map: maps('Bryce Point Bryce Canyon'),
      },
      {
        id: 'w3-5',
        title: '🌄 Sunset Point',
        transport: 'Fin de journée',
        map: maps('Sunset Point Bryce Canyon'),
        notes: '➡️ Fin de journée : direction Zion / Springdale ou rester proche Bryce selon hôtel.',
      },
    ],
  },
  {
    id: 'w4',
    tabLabel: '8 mai',
    title: '8 mai — Zion journée complète puis route vers Yellowstone',
    subtitle: 'Zion tôt le matin, puis très longue route en direction de Yellowstone.',
    hotel: 'Nuit réservée : Mammoth Hot Springs Hotel',
    hotelMap: maps('Mammoth Hot Springs Hotel Yellowstone'),
    items: [
      {
        id: 'w4-1',
        title: '🚗 Bryce / Orderville → Zion',
        transport: 'Environ 1h30 à 2h30 selon ville de départ',
        map: route('Hatch Utah', 'Zion National Park Visitor Center'),
      },
      {
        id: 'w4-2',
        title: '🥾 Canyon Overlook Trail',
        transport: 'Petite randonnée avec grosse vue',
        map: maps('Canyon Overlook Trail Zion'),
        notes: 'Excellent rapport effort/vue.',
      },
      {
        id: 'w4-3',
        title: '🌿 Riverside Walk / Zion Canyon Scenic Drive',
        transport: 'Balade facile selon timing',
        map: maps('Riverside Walk Zion National Park'),
        notes: 'Utiliser la navette si nécessaire.',
      },
      {
        id: 'w4-4',
        title: '📸 Canyon Junction Bridge / The Watchman',
        transport: 'Spot photo classique',
        map: maps('Canyon Junction Bridge Zion'),
      },
      {
        id: 'w4-5',
        title: '🚗 Zion → Mammoth Hot Springs',
        transport: 'Très long trajet : environ 9h30 à 11h sans grosses pauses',
        map: route('Zion National Park Visitor Center', 'Mammoth Hot Springs Hotel Yellowstone', [
          'Salt Lake City Utah',
          'Idaho Falls Idaho',
        ]),
        notes: '➡️ Fin de journée : direction Yellowstone. Très grosse route, prévoir de partir dès que possible. Idaho Falls uniquement comme repère de temps/pause, pas comme nuit.',
      },
    ],
  },
  {
    id: 'w5',
    tabLabel: '9 mai',
    title: '9 mai — Yellowstone nord + route vers Old Faithful',
    subtitle: 'Mammoth, Lamar Valley, Canyon puis installation à Old Faithful Inn.',
    hotel: 'Nuit réservée : Old Faithful Inn',
    hotelMap: maps('Old Faithful Inn Yellowstone'),
    items: [
      {
        id: 'w5-1',
        title: '💦 Mammoth Hot Springs',
        transport: 'Matin, proche de l’hôtel',
        map: maps('Mammoth Hot Springs Yellowstone'),
      },
      {
        id: 'w5-2',
        title: '🐺 Lamar Valley',
        transport: 'Très tôt si possible pour les animaux',
        map: maps('Lamar Valley Yellowstone'),
        notes: 'Meilleure zone wildlife, surtout tôt ou en fin de journée.',
      },
      {
        id: 'w5-3',
        title: '🌊 Grand Canyon of the Yellowstone',
        transport: 'Artist Point + points de vue',
        map: maps('Grand Canyon of the Yellowstone Artist Point'),
      },
      {
        id: 'w5-4',
        title: '🚗 Canyon / Mammoth → Old Faithful Inn',
        transport: 'Environ 1h30 à 2h30 selon routes ouvertes',
        map: route('Mammoth Hot Springs Yellowstone', 'Old Faithful Inn Yellowstone'),
        notes: '➡️ Fin de journée : direction Old Faithful Inn pour dormir.',
      },
    ],
  },
  {
    id: 'w6',
    tabLabel: '10 mai',
    title: '10 mai — Yellowstone geysers + Grand Prismatic',
    subtitle: 'Journée optimisée autour de Old Faithful et Grand Prismatic.',
    hotel: 'Nuit réservée : Old Faithful Inn',
    hotelMap: maps('Old Faithful Inn Yellowstone'),
    items: [
      {
        id: 'w6-1',
        title: '🌋 Old Faithful',
        transport: 'À faire tôt ou selon horaire d’éruption',
        map: maps('Old Faithful Yellowstone'),
        notes: 'Regarder les horaires prévus sur place.',
      },
      {
        id: 'w6-2',
        title: '🥾 Upper Geyser Basin',
        transport: 'Balade autour de Old Faithful',
        map: maps('Upper Geyser Basin Yellowstone'),
      },
      {
        id: 'w6-3',
        title: '🎨 Grand Prismatic Spring',
        transport: 'Spot emblématique',
        map: maps('Grand Prismatic Spring Yellowstone'),
      },
      {
        id: 'w6-4',
        title: '📸 Fairy Falls Overlook',
        transport: 'Vue haute sur Grand Prismatic',
        map: maps('Grand Prismatic Overlook Trail Yellowstone'),
        notes: 'La vue en hauteur est souvent plus impressionnante que depuis le boardwalk.',
      },
      {
        id: 'w6-5',
        title: '🌋 Norris Geyser Basin si temps',
        transport: 'Option selon fatigue et routes',
        map: maps('Norris Geyser Basin Yellowstone'),
        notes: '➡️ Fin de journée : retour Old Faithful Inn.',
      },
    ],
  },
  {
    id: 'w7',
    tabLabel: '11 mai',
    title: '11 mai — Yellowstone puis route vers Yosemite après 17h',
    subtitle: 'Derniers spots Yellowstone puis départ après 17h pour couper la route.',
    hotel: 'Nuit étape sur la route vers Yosemite',
    hotelMap: maps('hotels between Yellowstone and Yosemite Nevada'),
    items: [
      {
        id: 'w7-1',
        title: '🌋 Derniers geysers autour de Old Faithful',
        transport: 'Matin tranquille autour de l’hôtel',
        map: maps('Old Faithful Yellowstone'),
      },
      {
        id: 'w7-2',
        title: '📸 West Thumb Geyser Basin si accessible',
        transport: 'Option très belle si route ouverte',
        map: maps('West Thumb Geyser Basin Yellowstone'),
      },
      {
        id: 'w7-3',
        title: '🚗 Départ après 17h vers le sud/ouest',
        transport: 'Première portion de route vers Yosemite',
        map: route('Old Faithful Inn Yellowstone', 'Twin Falls Idaho'),
        notes: '➡️ Fin de journée : dormir dans une ville étape selon fatigue. Le lendemain 12 mai sera surtout route.',
      },
    ],
  },
  {
    id: 'w8',
    tabLabel: '12 mai',
    title: '12 mai — Journée route vers Yosemite',
    subtitle: 'Journée presque uniquement route avec quelques stops wahou rapides.',
    hotel: 'Nuit vers Lee Vining / Mammoth Lakes / Mariposa selon accès',
    hotelMap: maps('Mammoth Lakes Lee Vining Mariposa hotels'),
    items: [
      {
        id: 'w8-1',
        title: '🚗 Route vers Yosemite',
        transport: 'Très longue journée : environ 10h à 12h selon ville de départ et arrivée',
        map: route('Twin Falls Idaho', 'Yosemite National Park'),
        notes: 'Choisir la ville d’arrivée selon ouverture Tioga Pass. En mai, l’accès est à vérifier.',
      },
      {
        id: 'w8-2',
        title: '📸 Shoshone Falls / Twin Falls',
        transport: 'Stop wahou rapide si vous passez proche',
        map: maps('Shoshone Falls Twin Falls Idaho'),
        notes: 'Très belle cascade, bon stop sans trop détourer.',
      },
      {
        id: 'w8-3',
        title: '📸 Bonneville Salt Flats / paysages désertiques',
        transport: 'Option selon route choisie',
        map: maps('Bonneville Salt Flats Utah'),
        notes: 'Grand espace blanc impressionnant, potentiellement intéressant pour drone selon règles locales.',
      },
      {
        id: 'w8-4',
        title: '🌄 Arrivée ville étape Yosemite',
        transport: 'Fin de grosse journée route',
        map: maps('Mammoth Lakes California hotels'),
        notes: '➡️ Fin de journée : dormir au plus proche de Yosemite selon route ouverte.',
      },
    ],
  },
  {
    id: 'w9',
    tabLabel: '13 mai',
    title: '13 mai — Yosemite journée complète',
    subtitle: 'Première vraie journée Yosemite : vallée, cascades et points de vue.',
    hotel: 'Nuit vers Yosemite / El Portal / Mariposa',
    hotelMap: maps('El Portal Mariposa Yosemite hotels'),
    items: [
      {
        id: 'w9-1',
        title: '🌄 Tunnel View',
        transport: 'Point de vue iconique',
        map: maps('Tunnel View Yosemite'),
      },
      {
        id: 'w9-2',
        title: '💦 Yosemite Falls',
        transport: 'Balade facile',
        map: maps('Yosemite Falls'),
      },
      {
        id: 'w9-3',
        title: '🥾 Mist Trail / Vernal Fall',
        transport: 'Randonnée selon niveau et conditions',
        map: maps('Mist Trail Yosemite'),
      },
      {
        id: 'w9-4',
        title: '📸 Valley View',
        transport: 'Spot photo fin de journée',
        map: maps('Valley View Yosemite'),
        notes: '➡️ Fin de journée : rester dormir proche Yosemite.',
      },
    ],
  },
  {
    id: 'w10',
    tabLabel: '14 mai',
    title: '14 mai — Yosemite puis arrivée San Francisco le soir',
    subtitle: 'Deuxième journée Yosemite puis route vers San Francisco.',
    hotel: 'Nuit à San Francisco',
    hotelMap: maps('San Francisco hotels Union Square Fishermans Wharf'),
    items: [
      {
        id: 'w10-1',
        title: '🌲 Mariposa Grove si accessible',
        transport: 'Séquoias géants',
        map: maps('Mariposa Grove Yosemite'),
      },
      {
        id: 'w10-2',
        title: '📸 Glacier Point si ouvert',
        transport: 'Vue monumentale sur Half Dome',
        map: maps('Glacier Point Yosemite'),
        notes: 'À vérifier selon ouverture saisonnière.',
      },
      {
        id: 'w10-3',
        title: '🚗 Yosemite → San Francisco',
        transport: 'Environ 4h à 5h',
        map: route('Yosemite Valley', 'San Francisco'),
        notes: '➡️ Fin de journée : arrivée San Francisco.',
      },
    ],
  },
  {
    id: 'w11',
    tabLabel: '15 mai',
    title: '15 mai — San Francisco journée complète',
    subtitle: 'Golden Gate, quartiers, vues et balade urbaine.',
    hotel: 'Nuit à San Francisco',
    hotelMap: maps('San Francisco hotels Union Square Fishermans Wharf'),
    items: [
      {
        id: 'w11-1',
        title: '🌉 Golden Gate Bridge + Battery Spencer',
        transport: 'Matin si météo dégagée',
        map: maps('Battery Spencer Golden Gate Bridge'),
      },
      {
        id: 'w11-2',
        title: '🏘️ Painted Ladies',
        transport: 'Spot photo classique',
        map: maps('Painted Ladies San Francisco'),
      },
      {
        id: 'w11-3',
        title: '🚋 Lombard Street',
        transport: 'Rue iconique',
        map: maps('Lombard Street San Francisco'),
      },
      {
        id: 'w11-4',
        title: '🌊 Fisherman’s Wharf / Pier 39',
        transport: 'Balade et repas',
        map: maps('Pier 39 San Francisco'),
        notes: '➡️ Fin de journée : nuit San Francisco.',
      },
    ],
  },
  {
    id: 'w12',
    tabLabel: '16 mai',
    title: '16 mai — San Francisco journée complète',
    subtitle: 'Alcatraz, quartiers et sunset.',
    hotel: 'Nuit à San Francisco',
    hotelMap: maps('San Francisco hotels Union Square Fishermans Wharf'),
    items: [
      {
        id: 'w12-1',
        title: '🚢 Alcatraz',
        transport: 'À réserver en avance',
        map: maps('Alcatraz Landing Pier 33'),
      },
      {
        id: 'w12-2',
        title: '🏮 Chinatown',
        transport: 'Balade rapide',
        map: maps('Chinatown San Francisco'),
      },
      {
        id: 'w12-3',
        title: '🌳 Mission Dolores Park',
        transport: 'Pause vue ville',
        map: maps('Mission Dolores Park San Francisco'),
      },
      {
        id: 'w12-4',
        title: '🌅 Twin Peaks',
        transport: 'Sunset si météo OK',
        map: maps('Twin Peaks San Francisco'),
        notes: '➡️ Fin de journée : nuit San Francisco.',
      },
    ],
  },
  {
    id: 'w13',
    tabLabel: '17 mai',
    title: '17 mai — Monterey, Carmel, Big Sur',
    subtitle: 'Début Highway 1 : Monterey, Carmel-by-the-Sea et Big Sur.',
    hotel: 'Nuit conseillée : Morro Bay / San Luis Obispo',
    hotelMap: maps('Morro Bay San Luis Obispo hotels'),
    items: [
      {
        id: 'w13-1',
        title: '🚗 San Francisco → Monterey',
        transport: 'Environ 2h à 2h30',
        map: route('San Francisco', 'Monterey California'),
      },
      {
        id: 'w13-2',
        title: '🐠 Monterey / Cannery Row',
        transport: 'Balade bord de mer',
        map: maps('Cannery Row Monterey'),
      },
      {
        id: 'w13-3',
        title: '🏡 Carmel-by-the-Sea',
        transport: 'Village très joli',
        map: maps('Carmel-by-the-Sea California'),
      },
      {
        id: 'w13-4',
        title: '🌊 17-Mile Drive',
        transport: 'Route panoramique',
        map: maps('17-Mile Drive California'),
      },
      {
        id: 'w13-5',
        title: '🌉 Bixby Creek Bridge',
        transport: 'Stop photo incontournable',
        map: maps('Bixby Creek Bridge'),
      },
      {
        id: 'w13-6',
        title: '🌅 Big Sur',
        transport: 'Falaises, océan, points de vue',
        map: maps('Big Sur California'),
        notes: '➡️ Fin de journée : dormir à Morro Bay ou San Luis Obispo pour couper la route.',
      },
    ],
  },
  {
    id: 'w14',
    tabLabel: '18 mai',
    title: '18 mai — Morro Bay → Santa Barbara → San Diego',
    subtitle: 'Longue journée côte + arrivée San Diego le soir.',
    hotel: 'Nuit à San Diego',
    hotelMap: maps('San Diego hotels Gaslamp Little Italy'),
    items: [
      {
        id: 'w14-1',
        title: '🌊 Morro Rock',
        transport: 'Stop matin rapide',
        map: maps('Morro Rock'),
      },
      {
        id: 'w14-2',
        title: '🚗 Morro Bay → Santa Barbara',
        transport: 'Environ 2h',
        map: route('Morro Bay California', 'Santa Barbara California'),
      },
      {
        id: 'w14-3',
        title: '🌴 Santa Barbara',
        transport: 'Balade + repas',
        map: maps('Santa Barbara California'),
      },
      {
        id: 'w14-4',
        title: '🚗 Santa Barbara → San Diego',
        transport: 'Environ 3h30 à 5h selon trafic LA',
        map: route('Santa Barbara California', 'San Diego California', ['Malibu California']),
        notes: '➡️ Fin de journée : arrivée San Diego le soir du 18 mai.',
      },
    ],
  },
  {
    id: 'w15',
    tabLabel: '19 mai',
    title: '19 mai — San Diego journée complète',
    subtitle: 'Balboa Park, La Jolla, Old Town et sunset.',
    hotel: 'Nuit à San Diego ou route vers Los Angeles le soir',
    hotelMap: maps('San Diego hotels Gaslamp Little Italy'),
    items: [
      {
        id: 'w15-1',
        title: '🌳 Balboa Park',
        transport: 'Matin',
        map: maps('Balboa Park San Diego'),
      },
      {
        id: 'w15-2',
        title: '🌊 La Jolla Cove',
        transport: 'Après-midi',
        map: maps('La Jolla Cove San Diego'),
      },
      {
        id: 'w15-3',
        title: '🏘️ Old Town San Diego',
        transport: 'Balade / repas',
        map: maps('Old Town San Diego'),
      },
      {
        id: 'w15-4',
        title: '🌅 Sunset Cliffs',
        transport: 'Coucher de soleil',
        map: maps('Sunset Cliffs San Diego'),
        notes: '➡️ Fin de journée : dormir San Diego ou remonter vers Los Angeles selon fatigue.',
      },
    ],
  },
  {
    id: 'w16',
    tabLabel: '20 mai',
    title: '20 mai — Los Angeles plages',
    subtitle: 'Venice, Santa Monica, Malibu.',
    hotel: 'Nuit Los Angeles / Santa Monica / LAX',
    hotelMap: maps('Los Angeles hotels Santa Monica LAX'),
    items: [
      {
        id: 'w16-1',
        title: '🚗 San Diego → Los Angeles',
        transport: 'Environ 2h30 à 4h selon trafic',
        map: route('San Diego California', 'Santa Monica Pier'),
      },
      {
        id: 'w16-2',
        title: '🏖️ Venice Beach',
        transport: 'Balade bord de mer',
        map: maps('Venice Beach Los Angeles'),
      },
      {
        id: 'w16-3',
        title: '🎡 Santa Monica Pier',
        transport: 'Classique LA',
        map: maps('Santa Monica Pier'),
      },
      {
        id: 'w16-4',
        title: '🌅 El Matador Beach / Malibu',
        transport: 'Sunset',
        map: maps('El Matador State Beach Malibu'),
        notes: '➡️ Fin de journée : nuit Los Angeles.',
      },
    ],
  },
  {
    id: 'w17',
    tabLabel: '21 mai',
    title: '21 mai — Los Angeles incontournables',
    subtitle: 'Hollywood, Griffith, Beverly Hills.',
    hotel: 'Nuit Los Angeles / Hollywood / LAX',
    hotelMap: maps('Los Angeles hotels Hollywood Beverly Hills LAX'),
    items: [
      {
        id: 'w17-1',
        title: '⭐ Hollywood Walk of Fame',
        transport: 'Balade rapide',
        map: maps('Hollywood Walk of Fame'),
      },
      {
        id: 'w17-2',
        title: '🎬 Hollywood Sign View',
        transport: 'Point de vue',
        map: maps('Hollywood Sign Viewpoint'),
      },
      {
        id: 'w17-3',
        title: '🌴 Beverly Hills / Rodeo Drive',
        transport: 'Balade',
        map: maps('Rodeo Drive Beverly Hills'),
      },
      {
        id: 'w17-4',
        title: '🌇 Griffith Observatory',
        transport: 'Sunset idéal',
        map: maps('Griffith Observatory'),
        notes: '➡️ Fin de journée : nuit Los Angeles.',
      },
    ],
  },
  {
    id: 'w18',
    tabLabel: '22 mai',
    title: '22 mai — Los Angeles dernier jour',
    subtitle: 'Derniers spots, valises et nuit proche LAX.',
    hotel: 'Nuit proche LAX conseillée',
    hotelMap: maps('LAX hotels'),
    items: [
      {
        id: 'w18-1',
        title: '🎢 Universal Studios ou Warner Bros Studio Tour',
        transport: 'Option selon envie',
        map: maps('Universal Studios Hollywood'),
      },
      {
        id: 'w18-2',
        title: '📚 The Last Bookstore',
        transport: 'Option Downtown LA',
        map: maps('The Last Bookstore Los Angeles'),
      },
      {
        id: 'w18-3',
        title: '🌮 Grand Central Market',
        transport: 'Repas rapide',
        map: maps('Grand Central Market Los Angeles'),
      },
      {
        id: 'w18-4',
        title: '🧳 Préparation départ',
        transport: 'Essence, valises, rangement voiture',
        map: maps('LAX car rental return'),
        notes: '➡️ Fin de journée : dormir proche LAX pour départ du 23 mai matin.',
      },
    ],
  },
  {
    id: 'w19',
    tabLabel: '23 mai',
    title: '23 mai — Départ LAX',
    subtitle: 'Rien prévoir : retour voiture et vol du matin.',
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
        transport: 'Prévoir grosse marge',
        map: maps('LAX car rental return'),
      },
      {
        id: 'w19-3',
        title: '✈️ Départ LAX',
        transport: 'Départ le matin : rien d’autre à prévoir',
        map: maps('Los Angeles International Airport'),
      },
    ],
  },
];

const extraSections: ExtraSection[] = [
  {
    id: 'city-highlights',
    title: '✅ À voir par grande zone',
    subtitle: 'Les essentiels pour organiser les journées sans perdre de temps',
    groups: [
      {
        title: '🏜️ Page / Monument Valley',
        items: [
          { title: 'Lower Antelope Canyon', map: maps('Lower Antelope Canyon'), description: 'Visite réservée le 6 mai à 8h30.' },
          { title: 'Horseshoe Bend', map: maps('Horseshoe Bend Arizona'), description: 'Vue spectaculaire sur le Colorado.' },
          { title: 'Forrest Gump Point', map: maps('Forrest Gump Point Monument Valley'), description: 'Photo mythique sur l’US-163.' },
          { title: 'Monument Valley Visitor Center', map: maps('Monument Valley Visitor Center'), description: 'Vue iconique sur les buttes.' },
        ],
      },
      {
        title: '🧡 Bryce / Zion',
        items: [
          { title: 'Sunrise Point', map: maps('Sunrise Point Bryce Canyon'), description: 'Parfait au lever du soleil.' },
          { title: 'Navajo Loop + Queen’s Garden', map: maps('Navajo Loop Queen Garden Trail Bryce Canyon'), description: 'Randonnée incontournable de Bryce.' },
          { title: 'Canyon Overlook Trail', map: maps('Canyon Overlook Trail Zion'), description: 'Petite rando, grosse vue.' },
          { title: 'The Watchman / Canyon Junction', map: maps('Canyon Junction Bridge Zion'), description: 'Spot photo classique de Zion.' },
        ],
      },
      {
        title: '🐻 Yellowstone',
        items: [
          { title: 'Mammoth Hot Springs', map: maps('Mammoth Hot Springs Yellowstone'), description: 'Terrasses calcaires proches de l’hôtel Mammoth.' },
          { title: 'Lamar Valley', map: maps('Lamar Valley Yellowstone'), description: 'Meilleure zone pour la faune.' },
          { title: 'Grand Canyon of the Yellowstone', map: maps('Grand Canyon of the Yellowstone'), description: 'Artist Point et cascades.' },
          { title: 'Old Faithful + Upper Geyser Basin', map: maps('Old Faithful Yellowstone'), description: 'Geyser mythique + bassins à côté de l’hôtel.' },
          { title: 'Grand Prismatic Spring', map: maps('Grand Prismatic Spring Yellowstone'), description: 'Un des plus beaux spots du parc.' },
        ],
      },
      {
        title: '🌲 Yosemite',
        items: [
          { title: 'Tunnel View', map: maps('Tunnel View Yosemite'), description: 'Vue mythique sur la vallée.' },
          { title: 'Yosemite Falls', map: maps('Yosemite Falls'), description: 'Cascade facile d’accès.' },
          { title: 'Mist Trail / Vernal Fall', map: maps('Mist Trail Yosemite'), description: 'Randonnée très connue.' },
          { title: 'Valley View', map: maps('Valley View Yosemite'), description: 'Spot photo calme en fin de journée.' },
        ],
      },
      {
        title: '🌉 San Francisco',
        items: [
          { title: 'Golden Gate / Battery Spencer', map: maps('Battery Spencer Golden Gate Bridge'), description: 'Meilleure vue sur le Golden Gate.' },
          { title: 'Alcatraz', map: maps('Alcatraz Landing Pier 33'), description: 'À réserver en avance.' },
          { title: 'Pier 39 / Fisherman’s Wharf', map: maps('Pier 39 San Francisco'), description: 'Balade facile et repas.' },
          { title: 'Twin Peaks', map: maps('Twin Peaks San Francisco'), description: 'Vue sur toute la ville.' },
        ],
      },
      {
        title: '🌊 Highway 1 / Côte',
        items: [
          { title: 'Monterey', map: maps('Monterey California'), description: 'Cannery Row, bord de mer.' },
          { title: 'Carmel-by-the-Sea', map: maps('Carmel-by-the-Sea California'), description: 'Village très joli.' },
          { title: 'Bixby Creek Bridge', map: maps('Bixby Creek Bridge'), description: 'Pont iconique Big Sur.' },
          { title: 'Santa Barbara', map: maps('Santa Barbara California'), description: 'Belle pause entre côte et San Diego.' },
        ],
      },
      {
        title: '🌴 San Diego / Los Angeles',
        items: [
          { title: 'La Jolla Cove', map: maps('La Jolla Cove San Diego'), description: 'Très beau bord de mer à San Diego.' },
          { title: 'Sunset Cliffs', map: maps('Sunset Cliffs San Diego'), description: 'Sunset parfait.' },
          { title: 'Griffith Observatory', map: maps('Griffith Observatory'), description: 'Vue sur LA et Hollywood Sign.' },
          { title: 'Santa Monica / Venice', map: maps('Santa Monica Pier Venice Beach'), description: 'Classiques bord de mer LA.' },
        ],
      },
    ],
  },
  {
    id: 'classic-viewpoints',
    title: '📸 Points de vue classiques',
    subtitle: 'Les beaux points de vue sans drone, même si certains sont déjà dans les journées',
    groups: [
      {
        title: '🌵 Grands paysages',
        items: [
          { title: 'Horseshoe Bend', map: maps('Horseshoe Bend Arizona'), description: 'Méandre spectaculaire du Colorado.' },
          { title: 'Forrest Gump Point', map: maps('Forrest Gump Point Monument Valley'), description: 'Route iconique avec Monument Valley au fond.' },
          { title: 'Bryce Point', map: maps('Bryce Point Bryce Canyon'), description: 'Vue large sur les hoodoos.' },
          { title: 'Inspiration Point', map: maps('Inspiration Point Bryce Canyon'), description: 'Panorama magnifique sur Bryce.' },
          { title: 'Canyon Overlook', map: maps('Canyon Overlook Trail Zion'), description: 'Vue impressionnante sur Zion.' },
          { title: 'Grand Prismatic Overlook', map: maps('Grand Prismatic Overlook Trail Yellowstone'), description: 'Meilleure vue sur Grand Prismatic.' },
          { title: 'Artist Point', map: maps('Artist Point Yellowstone'), description: 'Vue classique sur la cascade de Yellowstone.' },
          { title: 'Tunnel View', map: maps('Tunnel View Yosemite'), description: 'La carte postale de Yosemite.' },
          { title: 'Battery Spencer', map: maps('Battery Spencer Golden Gate Bridge'), description: 'Vue Golden Gate.' },
          { title: 'Bixby Creek Bridge', map: maps('Bixby Creek Bridge'), description: 'Vue Highway 1.' },
        ],
      },
    ],
  },
  {
    id: 'drone-spots',
    title: '🛸 Points de vue drone à part',
    subtitle: 'Toujours vérifier B4UFLY / AutoPylot / DJI FlySafe / règles locales avant chaque vol',
    groups: [
      {
        title: '✅ Zones à vérifier hors parcs nationaux',
        items: [
          { title: 'Seven Magic Mountains', map: maps('Seven Magic Mountains Nevada'), description: 'Désert ouvert, joli contraste couleurs/désert.' },
          { title: 'Route LA → Las Vegas / désert de Mojave', map: maps('Mojave Desert California'), description: 'Grands espaces, vérifier restrictions locales.' },
          { title: 'Forrest Gump Point / US-163', map: maps('Forrest Gump Point Monument Valley'), description: 'Très cinématique, attention route et règles Navajo.' },
          { title: 'Route Page → Monument Valley', map: maps('US 163 Arizona'), description: 'Paysages ouverts très beaux.' },
          { title: 'Shoshone Falls / Twin Falls', map: maps('Shoshone Falls Twin Falls Idaho'), description: 'Très beau stop route vers Yosemite.' },
          { title: 'Bonneville Salt Flats', map: maps('Bonneville Salt Flats Utah'), description: 'Grand espace blanc très graphique.' },
          { title: 'Morro Bay / Morro Rock', map: maps('Morro Rock'), description: 'Côte + rocher iconique, vérifier zones interdites.' },
          { title: 'Big Sur hors zones protégées', map: maps('Big Sur California'), description: 'Falaises et océan, beaucoup de zones peuvent être réglementées.' },
          { title: 'El Matador Beach Malibu', map: maps('El Matador State Beach Malibu'), description: 'Rochers + sunset, vérifier règles plage/ville.' },
          { title: 'Sunset Cliffs San Diego', map: maps('Sunset Cliffs San Diego'), description: 'Très beau coucher de soleil, vérifier restrictions locales.' },
        ],
      },
      {
        title: '🚫 Rappel important',
        items: [
          { title: 'Parcs nationaux', map: maps('National Park Service drone rules'), description: 'Drone interdit dans les parcs nationaux américains sauf autorisation spéciale.' },
          { title: 'Territoires Navajo', map: maps('Navajo Nation drone rules Monument Valley'), description: 'Règles spécifiques : vérifier avant de voler.' },
          { title: 'Villes / plages / ponts', map: maps('FAA B4UFLY'), description: 'Vérifier zones d’aéroport, restrictions temporaires et règles locales.' },
        ],
      },
    ],
  },
  {
    id: 'pauses',
    title: '☕ Pauses utiles sur longues routes',
    subtitle: 'Stops rapides pour couper les gros trajets',
    groups: [
      {
        title: '🚗 Stops pratiques',
        items: [
          { title: 'Barstow', map: maps('Barstow California'), description: 'Pause rapide LA → Vegas.' },
          { title: 'Seven Magic Mountains', map: maps('Seven Magic Mountains Nevada'), description: 'Stop photo avant Las Vegas.' },
          { title: 'Las Vegas', map: maps('Las Vegas Strip'), description: 'Pause repas avant Kanab.' },
          { title: 'Kanab', map: maps('Kanab Utah'), description: 'Ville stratégique entre Page, Bryce et Zion.' },
          { title: 'Salt Lake City', map: maps('Salt Lake City Utah'), description: 'Grosse pause sur la route Zion → Yellowstone.' },
          { title: 'Twin Falls', map: maps('Twin Falls Idaho'), description: 'Stop sympa possible avec Shoshone Falls.' },
          { title: 'Elko', map: maps('Elko Nevada'), description: 'Ville étape pratique vers Yosemite.' },
          { title: 'Monterey', map: maps('Monterey California'), description: 'Pause agréable avant Big Sur.' },
          { title: 'Santa Barbara', map: maps('Santa Barbara California'), description: 'Pause chill avant San Diego.' },
        ],
      },
    ],
  },
  {
    id: 'hotels',
    title: '🏨 Hôtels par zone',
    subtitle: 'Sous-catégories par endroit avec liens Maps',
    groups: [
      {
        title: '5 mai — Kanab',
        items: [
          { title: 'Hampton Inn Kanab', map: maps('Hampton Inn Kanab Utah'), description: 'Bien placé, pratique pour repartir vers Page.' },
          { title: 'La Quinta Inn & Suites Kanab', map: maps('La Quinta Inn Suites Kanab Utah'), description: 'Option simple et pratique.' },
          { title: 'Best Western Red Hills Kanab', map: maps('Best Western Red Hills Kanab Utah'), description: 'Central dans Kanab.' },
          { title: 'Comfort Suites Kanab', map: maps('Comfort Suites Kanab Utah'), description: 'Pratique pour une nuit étape.' },
        ],
      },
      {
        title: '6 au 8 mai — Bryce / Orderville / Glendale / Hatch',
        items: [
          { title: 'Best Western Plus Bryce Canyon Grand Hotel', map: maps('Best Western Plus Bryce Canyon Grand Hotel'), description: 'Très proche de Bryce, pratique mais souvent plus cher.' },
          { title: 'Bryce Canyon Inn', map: maps('Bryce Canyon Inn Tropic Utah'), description: 'Tropic, bon compromis proche Bryce.' },
          { title: 'Hatch Station Motel', map: maps('Hatch Station Motel Utah'), description: 'Hatch, pratique pour Bryce et route Zion.' },
          { title: 'Arrowhead Country Inn', map: maps('Arrowhead Country Inn Mount Carmel Utah'), description: 'Zone Mount Carmel / Orderville, bien placé vers Zion.' },
        ],
      },
      {
        title: '8 au 9 mai — Yellowstone Mammoth',
        items: [
          { title: 'Mammoth Hot Springs Hotel', map: maps('Mammoth Hot Springs Hotel Yellowstone'), description: 'Hôtel réservé pour la nuit du 8 au 9 mai.' },
        ],
      },
      {
        title: '9 au 11 mai — Yellowstone Old Faithful',
        items: [
          { title: 'Old Faithful Inn', map: maps('Old Faithful Inn Yellowstone'), description: 'Hôtel réservé pour les nuits du 9 au 11 mai.' },
        ],
      },
      {
        title: '12 / 13 mai — Route Yosemite / Yosemite',
        items: [
          { title: 'Yosemite View Lodge', map: maps('Yosemite View Lodge El Portal'), description: 'Très pratique à El Portal, proche entrée Yosemite.' },
          { title: 'Rush Creek Lodge', map: maps('Rush Creek Lodge Yosemite'), description: 'Très belle option proche Yosemite.' },
          { title: 'Mariposa Lodge', map: maps('Mariposa Lodge California'), description: 'Mariposa, souvent plus abordable.' },
          { title: 'Mammoth Mountain Inn', map: maps('Mammoth Mountain Inn'), description: 'Option côté Mammoth Lakes si Tioga Pass ouvert.' },
        ],
      },
      {
        title: '14 au 17 mai — San Francisco',
        items: [
          { title: 'Hotel Riu Plaza Fisherman’s Wharf', map: maps('Hotel Riu Plaza Fishermans Wharf San Francisco'), description: 'Très bien placé pour Pier 39 / Fisherman’s Wharf.' },
          { title: 'The Handlery Union Square', map: maps('Handlery Union Square Hotel San Francisco'), description: 'Union Square, pratique pour visiter.' },
          { title: 'Stanford Court San Francisco', map: maps('Stanford Court San Francisco'), description: 'Nob Hill, bon emplacement central.' },
          { title: 'Hotel Zephyr San Francisco', map: maps('Hotel Zephyr San Francisco'), description: 'Fisherman’s Wharf, ambiance moderne.' },
        ],
      },
      {
        title: '17 mai — Morro Bay / San Luis Obispo',
        items: [
          { title: '456 Embarcadero Inn & Suites', map: maps('456 Embarcadero Inn Suites Morro Bay'), description: 'Morro Bay, très bien placé.' },
          { title: 'Harbor House Inn Morro Bay', map: maps('Harbor House Inn Morro Bay'), description: 'Simple et central.' },
          { title: 'Apple Farm Inn San Luis Obispo', map: maps('Apple Farm Inn San Luis Obispo'), description: 'Option confortable à San Luis Obispo.' },
          { title: 'La Quinta Inn & Suites San Luis Obispo Downtown', map: maps('La Quinta Inn Suites San Luis Obispo Downtown'), description: 'Pratique et moderne.' },
        ],
      },
      {
        title: '18 / 19 mai — San Diego',
        items: [
          { title: 'The Guild Hotel San Diego', map: maps('The Guild Hotel San Diego'), description: 'Downtown, bon emplacement.' },
          { title: 'Staypineapple Hotel Z San Diego', map: maps('Staypineapple Hotel Z San Diego'), description: 'Gaslamp, pratique pour sortir.' },
          { title: 'Kings Inn San Diego', map: maps('Kings Inn San Diego'), description: 'Souvent bon rapport qualité/prix.' },
          { title: 'La Jolla Shores Hotel', map: maps('La Jolla Shores Hotel'), description: 'Plus plage, très agréable si budget OK.' },
        ],
      },
      {
        title: '20 au 23 mai — Los Angeles / LAX',
        items: [
          { title: 'The Garland', map: maps('The Garland Los Angeles'), description: 'Bien pour Universal / Hollywood.' },
          { title: 'Miyako Hotel Los Angeles', map: maps('Miyako Hotel Los Angeles'), description: 'Downtown / Little Tokyo.' },
          { title: 'Hilton Los Angeles Airport', map: maps('Hilton Los Angeles Airport'), description: 'Pratique pour la dernière nuit proche LAX.' },
          { title: 'Hyatt Regency Los Angeles International Airport', map: maps('Hyatt Regency Los Angeles International Airport'), description: 'Très pratique pour départ matin.' },
        ],
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

  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

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
            Du 5 au 23 mai — LAX, Las Vegas, Kanab, Page, Monument Valley, Bryce,
            Zion, Yellowstone, Yosemite, San Francisco, Highway 1, San Diego et Los Angeles.
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

        <select
          value={activeDayId}
          onChange={(e) => setActiveDayId(e.target.value)}
          className="mb-5 w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm font-bold text-stone-900 shadow-sm md:hidden"
        >
          {tripDays.map((day) => (
            <option key={day.id} value={day.id}>
              {day.tabLabel} — {day.title}
            </option>
          ))}
        </select>

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
                          checked ? 'text-green-800 line-through' : 'text-stone-900'
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

              <div className="mt-5 space-y-5">
                {section.groups.map((group) => (
                  <div key={group.title}>
                    <h3 className="mb-3 text-lg font-black text-orange-800">
                      {group.title}
                    </h3>

                    <div className="grid gap-3 md:grid-cols-2">
                      {group.items.map((item) => (
                        <article
                          key={`${section.id}-${group.title}-${item.title}`}
                          className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-4"
                        >
                          <h4 className="text-base font-black text-stone-900">
                            {item.title}
                          </h4>

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
                  </div>
                ))}
              </div>
            </details>
          ))}
        </section>
      </div>
    </main>
  );
}
