(function (root) {
  const CHAPTERS = ['overview', 'itinerary', 'logistics', 'bookings', 'cities', 'practical', 'about'];

  function routeFor(chapter, day) {
    if (chapter === 'itinerary') {
      const safeDay = Math.max(1, Math.min(8, Number(day) || 1));
      return { chapter, day: safeDay, canonicalHash: `#itinerary/day-${safeDay}` };
    }
    return { chapter, day: null, canonicalHash: `#${chapter}` };
  }

  function normalizeRoute(hash) {
    const value = String(hash || '').replace(/^#/, '');
    const itinerary = /^itinerary(?:\/day-(\d+))?$/.exec(value);
    if (itinerary) return routeFor('itinerary', itinerary[1] || 1);
    if (CHAPTERS.includes(value)) return routeFor(value);
    return routeFor('overview');
  }

  function nextRoute(route, direction) {
    if (!route || route.chapter !== 'itinerary') return null;
    return routeFor('itinerary', Number(route.day) + (direction < 0 ? -1 : 1));
  }

  function buildDayModel(trip, dayNumber) {
    return trip.days.find((day) => day.n === Math.max(1, Math.min(8, Number(dayNumber) || 1)));
  }

  function buildLogisticsModel(trip) {
    return { flights: trip.flights, trains: trip.trains, stay: trip.stay };
  }

  function buildBookingsModel(trip) {
    return { tickets: trip.tickets, reservations: trip.reservations };
  }

  function hasDuplicatedCoreTripData(source) {
    return /\b(?:dep|arr|price)\s*:|2026-10-(?:2[4-9]|3[0-1])/.test(String(source));
  }

  root.PolskaDesktop = {
    CHAPTERS,
    normalizeRoute,
    nextRoute,
    buildDayModel,
    buildLogisticsModel,
    buildBookingsModel,
    hasDuplicatedCoreTripData,
  };
}(typeof globalThis !== 'undefined' ? globalThis : window));
