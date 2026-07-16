(function (root) {
  const dateKey = (date, timeZone) => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(date).reduce((out, part) => ({ ...out, [part.type]: part.value }), {});
    return {
      iso: `${parts.year}-${parts.month}-${parts.day}`,
      day: `${parts.month}/${parts.day}`,
      mins: Number(parts.hour) * 60 + Number(parts.minute),
    };
  };
  const dayKey = (day) => day.date.slice(0, 5);

  function projectTripMoment(days, now = new Date(), override = null, tripMeta) {
    const clock = dateKey(now, tripMeta.timeZone);
    const matched = days.find((day) => dayKey(day) === clock.day);
    const phase = clock.iso < tripMeta.tripStart ? 'before' : clock.iso > tripMeta.tripEnd ? 'after' : 'during';
    const d = override
      ? days.find((day) => day.n === override) || days[0]
      : matched || (phase === 'before' ? days[0] : days[days.length - 1]);
    const stepMins = d.steps.map((step) => {
      const [hour, minute] = step.t.split(':').map(Number);
      return hour * 60 + minute;
    });
    let idx = 0;
    stepMins.forEach((minutes, index) => { if (minutes <= clock.mins) idx = index; });
    return {
      d, idx, now: d.steps[idx], next: d.steps[idx + 1], mins: clock.mins, phase,
      beforeStart: clock.mins < stepMins[0],
      afterEnd: clock.mins > stepMins[stepMins.length - 1] + 60,
    };
  }

  function readNotes(storage) {
    try { return { notes: JSON.parse(storage.getItem('polska-notes') || '{}'), persistent: true }; }
    catch (_) { return { notes: {}, persistent: false }; }
  }

  function writeNotes(storage, notes) {
    try { storage.setItem('polska-notes', JSON.stringify(notes)); return true; }
    catch (_) { return false; }
  }

  root.PolskaPwaCore = { projectTripMoment, readNotes, writeNotes };
})(typeof window === 'undefined' ? globalThis : window);
