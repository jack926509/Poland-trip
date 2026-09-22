import fs from 'node:fs';
import path from 'node:path';
import * as trip from '../data/trip.js';
import * as cities from '../data/cities.js';
import * as dining from '../data/dining.js';
import * as tickets from '../data/tickets.js';
import * as transit from '../data/transit.js';
import * as shopping from '../data/shopping.js';
import * as groceries from '../data/groceries.js';
import { renderGroceries } from '../templates/groceries.mjs';
import * as essentials from '../data/essentials.js';
import * as dayDining from '../data/day-dining.js';
import * as travelDatabase from '../data/travel-database.js';

import { renderHome } from '../templates/home.mjs';
import { renderDay } from '../templates/day.mjs';
import { renderToday } from '../templates/today.mjs';
import { renderCity } from '../templates/city.mjs';
import {
  renderBooking,
  renderTodos,
  renderDining,
  renderTickets,
  renderTransit,
  renderShopping,
  renderEssentials,
  renderNotes,
  renderOpsDashboard,
} from '../templates/practical.mjs';
import { renderDatabase } from '../templates/database.mjs';
import { makeDayMap } from '../lib/day-map.mjs';
import { cityRoutes } from '../lib/city-guide.mjs';

export function renderPages(distDir) {
  const writeHtml = (relativePath, html) => fs.writeFileSync(path.join(distDir, relativePath), html, 'utf8');
  writeHtml('index.html', renderHome({
    meta: trip.meta,
    days: trip.days,
    flights: trip.flights,
    cities: cities.cities,
    todoGroups: trip.todoGroups,
    databaseEntries: travelDatabase.databaseEntries,
    trains: trip.trains,
    deadlines: trip.deadlines,
  }));

  writeHtml('today.html', renderToday({
    meta: trip.meta,
    days: trip.days,
    stay: trip.stay,
    dayDining: dayDining.dayDining,
    daylight: essentials.daylight,
    safety: essentials.safety,
  }));

  for (const day of trip.days) {
    const photoSpotsForDay = cities.photoSpots.filter(spot => spot.day === day.n);
    const detailPhotoCity = [1, 2, 5, 6].includes(day.n)
      ? cities.cities.find(item => item.key === photoSpotsForDay[0]?.cityKey)
      : null;
    const journalCity = day.city
      .split('→')
      .reverse()
      .map(stop => cities.cities.find(city => stop.includes(city.name)))
      .find(Boolean) || cities.cities[0];
    const dayMap = makeDayMap(day);
    writeHtml(
      `day-${String(day.n).padStart(2, '0')}.html`,
      renderDay(day, photoSpotsForDay, travelDatabase.dayOperations[day.n], journalCity, detailPhotoCity, dayMap, dayMap.checks, cities.pinCategoryLegend, cities.cities.flatMap(city => city.gallery || []).filter(photo => photo.days?.includes(day.n)), essentials.daylight.find(item => item.day === day.n) || null),
    );
  }

  for (const { fileKey, key, mapKey } of cityRoutes) {
    const city = cities.cities.find(item => item.key === key);
    writeHtml(`city-${fileKey}.html`, renderCity({
      city,
      cityKey: mapKey,
      cityFile: fileKey,
      mapData: cities.mapPins[mapKey],
      mapChecks: cities.mapPinChecks[mapKey],
      legend: cities.pinCategoryLegend,
      attractionsForCity: cities.attractions[mapKey],
      dining: dining.cityDining[mapKey],
      cityFoodForCity: dining.cityFood.find(group => group.city === city.name),
      snacksAndCafesForCity: dining.snacksAndCafes[mapKey] || [],
      photoSpotsForCity: cities.photoSpots.filter(spot => spot.cityKey === key),
      fastFoodForCity: dining.fastFoodBranches[mapKey] || [],
      fastFoodHubForCity: dining.fastFoodHubs.find(hub => hub.cityKey === mapKey) || null,
      fastFoodChains: dining.fastFoodChains,
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
    railOfficialLinks: trip.railOfficialLinks,
    railPurchaseSteps: trip.railPurchaseSteps,
    auschwitzBus: trip.auschwitzBus,
    deadlines: trip.deadlines,
    databaseEntries: travelDatabase.databaseEntries,
  }));
  writeHtml('practical/todos.html', renderTodos({
    todoGroups: trip.todoGroups,
  }));
  writeHtml('practical/dining.html', renderDining({
    michelinSummary: dining.michelinSummary,
    michelinReservations: dining.michelinReservations,
    verifiedRestaurantHours: dining.verifiedRestaurantHours,
    fastFoodChains: dining.fastFoodChains,
    fastFoodBranches: dining.fastFoodBranches,
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
  writeHtml('practical/groceries.html', renderGroceries(groceries));
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
    sources: essentials.essentialSources,
  }));
  writeHtml('practical/notes.html', renderNotes({
    preDepartureNotes: essentials.preDepartureNotes,
    daylight: essentials.daylight,
  }));
  writeHtml('practical/ops-dashboard.html', renderOpsDashboard({
    entries: travelDatabase.databaseEntries,
    statusLabels: travelDatabase.statusLabels,
    syncRows: travelDatabase.syncRows,
    todoGroups: trip.todoGroups,
  }));
  writeHtml('practical/database.html', renderDatabase({
    entries: travelDatabase.databaseEntries,
    sections: travelDatabase.databaseSections,
    statusLabels: travelDatabase.statusLabels,
  }));

}
