/* NestEgg views — one render function per hash route.
   Every view is built from NESTEGG_DATA plus the live transaction list
   main.js hands it, so added transactions show up everywhere at once. */

function esc(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function spentByCategory(transactions) {
  const spent = {};
  for (const t of transactions) {
    if (t.amount < 0 && t.category !== "Income") {
      spent[t.category] = (spent[t.category] || 0) + Math.abs(t.amount);
    }
  }
  return spent;
}

function totalIncome(transactions) {
  return transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
}

function totalSpending(transactions) {
  return transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
}

function categoryColor(name) {
  const found = NESTEGG_DATA.budgets.find((b) => b.category === name);
  return found ? found.color : "#8a6d9e";
}

function donutSVG(spent) {
  const total = Object.values(spent).reduce((s, v) => s + v, 0) || 1;
  const radius = 62;
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  let slices = "";
  for (const b of NESTEGG_DATA.budgets) {
    const value = spent[b.category] || 0;
    if (value <= 0) continue;
    const frac = value / total;
    slices += '<circle cx="80" cy="80" r="' + radius + '" fill="none" stroke="' + b.color +
      '" stroke-width="26" stroke-dasharray="' + (frac * circ).toFixed(1) + " " + circ.toFixed(1) +
      '" stroke-dashoffset="' + (-offset * circ).toFixed(1) + '" transform="rotate(-90 80 80)"/>';
    offset += frac;
  }
  return '<svg class="donut" viewBox="0 0 160 160" role="img" aria-label="Spending by category chart">' +
    '<circle cx="80" cy="80" r="' + radius + '" fill="none" stroke="#eee7d6" stroke-width="26"/>' +
    slices +
    '<text x="80" y="76" text-anchor="middle" class="donut-total">' + moneyShort(total) + '</text>' +
    '<text x="80" y="96" text-anchor="middle" class="donut-label">spent in Nov</text></svg>';
}

function txRow(t) {
  const cls = t.amount >= 0 ? "in" : "out";
  return '<li class="tx-row ' + cls + '">' +
    '<span class="tx-dot" style="background:' + categoryColor(t.category) + '"></span>' +
    '<span class="tx-main"><strong>' + esc(t.payee) + '</strong>' +
    '<small>' + esc(t.date) + ' · ' + esc(t.category) + (t.note ? " · " + esc(t.note) : "") + '</small></span>' +
    '<span class="tx-amount">' + money(t.amount) + '</span></li>';
}

function renderDashboard(transactions) {
  const income = totalIncome(transactions);
  const spending = totalSpending(transactions);
  const left = income - spending;
  const spent = spentByCategory(transactions);
  const recent = transactions.slice().sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, 6);
  const topCats = NESTEGG_DATA.budgets
    .map((b) => ({ name: b.category, value: spent[b.category] || 0, color: b.color }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  const maxTop = Math.max.apply(null, topCats.map((c) => c.value).concat([1]));

  let legend = "";
  for (const c of topCats) {
    legend += '<li><span class="swatch" style="background:' + c.color + '"></span>' + c.name +
      '<strong>' + money(c.value) + '</strong></li>';
  }

  let bars = "";
  for (const c of topCats) {
    bars += '<div class="bar-row"><span class="bar-label">' + c.name + '</span>' +
      '<div class="bar-track"><div class="bar-fill" style="width:' + pct(c.value, maxTop) + '%;background:' + c.color + '"></div></div>' +
      '<span class="bar-value">' + money(c.value) + '</span></div>';
  }

  let recentRows = "";
  for (const t of recent) recentRows += txRow(t);

  const goal = NESTEGG_DATA.goals[0];
  return '' +
    '<section class="hero"><div><p class="eyebrow">November 2026 · The Hart Household</p>' +
    '<h1>Good evening, Maya &amp; Daniel.<br>November is looking healthy.</h1>' +
    '<p class="lede">You have ' + money(left) + ' left after spending ' + money(spending) +
    ' of ' + money(income) + ' income this month. Every category is inside its budget.</p></div>' +
    '<div class="hero-card"><span class="hero-card-label">Emergency fund</span>' +
    '<strong class="hero-card-big">' + money(goal.saved) + ' <small>of ' + money(goal.target) + '</small></strong>' +
    '<div class="progress"><div class="progress-fill" style="width:' + pct(goal.saved, goal.target) + '%;background:#2f6b4f"></div></div>' +
    '<a class="btn" href="#/goals">See all goals →</a></div></section>' +
    '<section class="stat-grid">' +
    '<div class="stat"><span>Income</span><strong class="good">' + money(income) + '</strong><small>6 paydays &amp; invoices</small></div>' +
    '<div class="stat"><span>Spending</span><strong>' + money(spending) + '</strong><small>' + pct(spending, income) + '% of income</small></div>' +
    '<div class="stat"><span>Left to spend</span><strong class="good">' + money(left) + '</strong><small>' + money(left / 5) + ' a day to month end</small></div>' +
    '<div class="stat"><span>Saved this month</span><strong class="good">' + money(left) + '</strong><small>Goes to goals on the 30th</small></div>' +
    '</section>' +
    '<section class="two-col"><div class="card"><h2>Where the money went</h2>' +
    '<div class="donut-wrap">' + donutSVG(spent) + '<ul class="legend">' + legend + '</ul></div>' +
    bars + '<p class="card-link"><a href="#/budgets">Check every budget →</a></p></div>' +
    '<div class="card"><h2>Recent transactions</h2><ul class="tx-list">' + recentRows + '</ul>' +
    '<p class="card-link"><a href="#/transactions">See all ' + transactions.length + ' transactions →</a></p></div></section>';
}

function renderTransactions(transactions, filter) {
  const categories = ["All"].concat(NESTEGG_DATA.budgets.map((b) => b.category)).concat(["Income"]);
  let chips = "";
  for (const c of categories) {
    chips += '<a class="chip' + (filter === c ? " active" : "") + '" href="#/transactions' +
      (c === "All" ? "" : "?cat=" + encodeURIComponent(c)) + '">' + c + '</a>';
  }
  const shown = filter === "All" ? transactions : transactions.filter((t) => t.category === filter);
  const sorted = shown.slice().sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  let rows = "";
  for (const t of sorted) rows += txRow(t);
  const spentShown = sorted.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const inShown = sorted.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);

  return '' +
    '<section class="page-head"><div><p class="eyebrow">November 2026</p><h1>Transactions</h1>' +
    '<p class="lede">Every dollar in and out, newest first. Add one below and it is saved in this browser.</p></div>' +
    '<div class="stat mini"><span>Showing</span><strong>' + money(inShown) + ' in · ' + money(spentShown) + ' out</strong>' +
    '<small>' + sorted.length + ' transactions</small></div></section>' +
    '<section class="card"><h2>Add a transaction</h2>' +
    '<form id="add-tx" class="tx-form">' +
    '<label>Date<input type="date" name="date" value="2026-11-26" required></label>' +
    '<label>What was it?<input type="text" name="payee" placeholder="e.g. GreenMart supermarket" required maxlength="80"></label>' +
    '<label>Category<select name="category">' +
    NESTEGG_DATA.budgets.map((b) => '<option>' + b.category + '</option>').join("") + '<option>Income</option></select></label>' +
    '<label>Amount ($)<input type="number" name="amount" step="0.01" min="0.01" placeholder="42.50" required></label>' +
    '<label>Type<select name="direction"><option value="out">Spent</option><option value="in">Received</option></select></label>' +
    '<button class="btn" type="submit">Add transaction</button>' +
    '<p class="form-note" id="add-tx-note">Saved in this browser only — nothing leaves your device.</p>' +
    '</form></section>' +
    '<section class="card"><h2>Filter by category</h2><div class="chips">' + chips + '</div>' +
    '<ul class="tx-list">' + (rows || '<li class="empty">No transactions in this category yet.</li>') + '</ul></section>';
}

function renderBudgets(transactions) {
  const spent = spentByCategory(transactions);
  const totalLimit = NESTEGG_DATA.budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = Object.values(spent).reduce((s, v) => s + v, 0);
  let cards = "";
  for (const b of NESTEGG_DATA.budgets) {
    const value = spent[b.category] || 0;
    const over = value > b.limit;
    cards += '<article class="budget-card' + (over ? " over" : "") + '">' +
      '<div class="budget-top"><h3><span class="swatch" style="background:' + b.color + '"></span>' + b.category + '</h3>' +
      '<span class="budget-pct">' + pct(value, b.limit) + '%</span></div>' +
      '<p class="budget-amounts"><strong>' + money(value) + '</strong> of ' + money(b.limit) + '</p>' +
      '<div class="progress"><div class="progress-fill" style="width:' + Math.min(100, pct(value, b.limit)) + '%;background:' + b.color + '"></div></div>' +
      '<p class="budget-note">' + (over ? "Over budget by " + money(value - b.limit) + " — trim next week." :
        money(b.limit - value) + " left · about " + money((b.limit - value) / 5) + " a day") + '</p></article>';
  }
  return '' +
    '<section class="page-head"><div><p class="eyebrow">November 2026</p><h1>Budgets</h1>' +
    '<p class="lede">One monthly limit per category, set together at the start of the month. ' +
    'Nothing here is over budget — the Harts are on track.</p></div>' +
    '<div class="stat mini"><span>Total spent vs planned</span><strong>' + money(totalSpent) + ' of ' + money(totalLimit) + '</strong>' +
    '<small>' + pct(totalSpent, totalLimit) + '% of the month\u2019s plan used</small></div></section>' +
    '<section class="budget-grid">' + cards + '</section>' +
    '<section class="card tip"><h2>How the Harts set these limits</h2>' +
    '<p>Groceries and housing are fixed first, then fun money gets what is left. ' +
    'If a category runs over two months in a row, its limit gets a proper rethink instead of a quiet overspend — ' +
    'October\u2019s dining-out overshoot is why November\u2019s limit is $320, not $400.</p></section>';
}

function renderGoals(transactions) {
  const savedThisMonth = totalIncome(transactions) - totalSpending(transactions);
  let cards = "";
  for (const g of NESTEGG_DATA.goals) {
    const p = pct(g.saved, g.target);
    cards += '<article class="goal-card"><div class="goal-top"><h3>' + g.name + '</h3>' +
      '<span class="goal-pct">' + p + '%</span></div>' +
      '<p class="goal-amounts"><strong>' + money(g.saved) + '</strong> saved of ' + money(g.target) + '</p>' +
      '<div class="progress tall"><div class="progress-fill" style="width:' + p + '%;background:#2f6b4f"></div></div>' +
      '<p class="goal-note">' + g.note + ' · ' + money(g.target - g.saved) + ' to go</p></article>';
  }
  const totalSaved = NESTEGG_DATA.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = NESTEGG_DATA.goals.reduce((s, g) => s + g.target, 0);
  return '' +
    '<section class="page-head"><div><p class="eyebrow">Saving for what matters</p><h1>Goals</h1>' +
    '<p class="lede">Four things the household is saving for. November\u2019s surplus of ' + money(savedThisMonth) +
    ' is split between them on the 30th.</p></div>' +
    '<div class="stat mini"><span>Saved across all goals</span><strong>' + money(totalSaved) + ' of ' + money(totalTarget) + '</strong>' +
    '<small>' + pct(totalSaved, totalTarget) + '% of the way there</small></div></section>' +
    '<section class="goal-grid">' + cards + '</section>' +
    '<section class="card tip"><h2>The rule that keeps it working</h2>' +
    '<p>Money for goals moves out on payday, before spending starts — never from what happens to be left over. ' +
    'That is why the emergency fund is already at ' + money(NESTEGG_DATA.goals[0].saved) + ' after fourteen months.</p></section>';
}

function renderReports(transactions) {
  const maxMonth = Math.max.apply(null, NESTEGG_DATA.months.map((m) => Math.max(m.income, m.spending)));
  let bars = "";
  for (const m of NESTEGG_DATA.months) {
    bars += '<div class="month-col"><div class="month-bars">' +
      '<div class="month-bar in" style="height:' + pct(m.income, maxMonth) + '%" title="Income ' + money(m.income) + '"></div>' +
      '<div class="month-bar out" style="height:' + pct(m.spending, maxMonth) + '%" title="Spending ' + money(m.spending) + '"></div></div>' +
      '<span class="month-name">' + m.month + '</span>' +
      '<small>' + moneyShort(m.income) + ' / ' + moneyShort(m.spending) + '</small></div>';
  }
  const spent = spentByCategory(transactions);
  const top = NESTEGG_DATA.budgets
    .map((b) => ({ name: b.category, value: spent[b.category] || 0 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
  let topRows = "";
  top.forEach((c, i) => {
    topRows += '<li><span class="rank">' + (i + 1) + '</span>' + c.name + '<strong>' + money(c.value) + '</strong></li>';
  });
  const avgSpending = NESTEGG_DATA.months.reduce((s, m) => s + m.spending, 0) / NESTEGG_DATA.months.length;
  const avgIncome = NESTEGG_DATA.months.reduce((s, m) => s + m.income, 0) / NESTEGG_DATA.months.length;
  const nov = NESTEGG_DATA.months[NESTEGG_DATA.months.length - 1];
  const groceryBudget = NESTEGG_DATA.budgets.find((b) => b.category === "Groceries");
  const grocerySpent = spent.Groceries || 0;
  const groceryPct = pct(grocerySpent, groceryBudget.limit);
  return '' +
    '<section class="page-head"><div><p class="eyebrow">June – November 2026</p><h1>Reports</h1>' +
    '<p class="lede">Six months at a glance: income against spending, the biggest categories, and what to do about them.</p></div>' +
    '<div class="stat mini"><span>Average month</span><strong>' + money(avgIncome) + ' in · ' + money(avgSpending) + ' out</strong>' +
    '<small>Typical surplus ' + money(avgIncome - avgSpending) + '</small></div></section>' +
    '<section class="card"><h2>Income vs spending, last 6 months</h2>' +
    '<div class="month-chart">' + bars + '</div>' +
    '<p class="chart-legend"><span class="swatch" style="background:#2f6b4f"></span> Income &nbsp; <span class="swatch" style="background:#c98f2d"></span> Spending</p></section>' +
    '<section class="two-col"><div class="card"><h2>Top spending in November</h2><ol class="top-list">' + topRows + '</ol>' +
    '<p class="muted">Housing is rent plus the building fee — the one bill the Harts cannot shrink, so the other categories carry the savings.</p></div>' +
    '<div class="card"><h2>What the numbers say</h2><ul class="insights">' +
    '<li><strong>Best month yet:</strong> November spending (' + money(nov.spending) + ') is ' + money(avgSpending - nov.spending) + ' below the six-month average.</li>' +
    '<li><strong>Watch groceries:</strong> ' + money(grocerySpent) + ' so far is ' + groceryPct + '% of the ' + money(groceryBudget.limit) + ' limit with five days left — one more big shop and it tips over.</li>' +
    '<li><strong>Freelance is lumpy:</strong> Daniel\u2019s income ranged from $520 to $1,850 a month; the budget is built on Maya\u2019s salary alone.</li>' +
    '<li><strong>Next step:</strong> move November\u2019s ' + money(nov.income - nov.spending) + ' surplus to the emergency fund on the 30th.</li>' +
    '</ul></div></section>';
}
