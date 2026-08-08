import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as trip from './src/data/trip.js';
import * as cities from './src/data/cities.js';
import * as dining from './src/data/dining.js';
import * as tickets from './src/data/tickets.js';
import * as transit from './src/data/transit.js';
import * as shopping from './src/data/shopping.js';
import * as essentials from './src/data/essentials.js';

import { renderHome } from './src/templates/home.mjs';
import { renderDay } from './src/templates/day.mjs';
import { renderCity } from './src/templates/city.mjs';
import {
  renderBooking,
  renderDining,
  renderTickets,
  renderTransit,
  renderShopping,
  renderEssentials,
  renderNotes,
} from './src/templates/practical.mjs';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(projectRoot, 'dist');
const cityMap = {
  warszawa: { key: 'WAW', mapKey: 'warsaw' },
  krakow: { key: 'KRK', mapKey: 'krakow' },
  wroclaw: { key: 'WRO', mapKey: 'wroclaw' },
  poznan: { key: 'POZ', mapKey: 'poznan' },
};

function resetOutput() {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(distDir, 'practical'), { recursive: true });
  fs.mkdirSync(path.join(distDir, 'assets'), { recursive: true });
}

function writeHtml(relativePath, html) {
  fs.writeFileSync(path.join(distDir, relativePath), html, 'utf8');
}

function build() {
  resetOutput();
  fs.copyFileSync(path.join(projectRoot, 'src/styles/main.css'), path.join(distDir, 'assets/main.css'));

  writeHtml('index.html', renderHome({
    meta: trip.meta,
    days: trip.days,
    flights: trip.flights,
    cities: cities.cities,
  }));

  for (const day of trip.days) {
    const photoSpotsForDay = cities.photoSpots.filter(spot => spot.day === day.n);
    writeHtml(`day-${String(day.n).padStart(2, '0')}.html`, renderDay(day, photoSpotsForDay));
  }

  for (const [fileKey, { key, mapKey }] of Object.entries(cityMap)) {
    const city = cities.cities.find(item => item.key === key);
    writeHtml(`city-${fileKey}.html`, renderCity({
      city,
      cityKey: mapKey,
      mapData: cities.mapPins[mapKey],
      legend: cities.pinCategoryLegend,
      attractionsForCity: cities.attractions[mapKey],
      dining: dining.cityDining[mapKey],
      cityFoodForCity: dining.cityFood.find(group => group.city === city.name),
      foodBackupForCity: dining.foodBackup.find(group => group.city === city.name),
      photoSpotsForCity: cities.photoSpots.filter(spot => spot.cityKey === key),
      story: cities.cityStories.find(item => item.city === city.name),
      notices: cities.cityNotices[mapKey],
    }));
  }

  writeHtml('practical/booking.html', renderBooking({
    flights: trip.flights,
    trains: trip.trains,
    stay: trip.stay,
    bookingTiers: trip.bookingTiers,
    reservations: trip.reservations,
  }));
  writeHtml('practical/dining.html', renderDining({
    michelinSummary: dining.michelinSummary,
    michelinReservations: dining.michelinReservations,
  }));
  writeHtml('practical/tickets.html', renderTickets({
    fares: tickets.fares,
    ticketsByCity: tickets.ticketsByCity,
    notices: tickets.ticketNotices,
  }));
  writeHtml('practical/transit.html', renderTransit({
    transitFares: transit.transitFares,
    airportTransit: transit.airportTransit,
    recommendedApps: transit.recommendedApps,
    passChecklist: transit.passChecklist,
    usefulRoutes: transit.usefulRoutes,
    practical: transit.practical,
  }));
  writeHtml('practical/shopping.html', renderShopping({
    souvenirCards: shopping.souvenirCards,
    luxuryShopping: shopping.luxuryShopping,
    souvenirShops: shopping.souvenirShops,
    shopping: shopping.shopping,
    zabkaCards: shopping.zabkaCards,
  }));
  writeHtml('practical/essentials.html', renderEssentials({
    phrases: essentials.phrases,
    packingDefault: essentials.packingDefault,
    about: essentials.about,
    safety: essentials.safety,
  }));
  writeHtml('practical/notes.html', renderNotes({
    preDepartureNotes: essentials.preDepartureNotes,
  }));

  const htmlCount = fs.readdirSync(distDir).filter(name => name.endsWith('.html')).length
    + fs.readdirSync(path.join(distDir, 'practical')).filter(name => name.endsWith('.html')).length;
  if (htmlCount !== 20) throw new Error(`預期產生 20 頁，實際為 ${htmlCount} 頁`);
  console.log(`build 完成：${htmlCount} 頁已產生至 dist/`);
}

build();
