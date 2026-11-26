/* NestEgg main — hash routing, live state, and the add-transaction form.
   Transactions live in localStorage under "nestegg-tx-v1" so anything the
   household adds survives a reload; the sample data is the starting set. */

const STORAGE_KEY = "nestegg-tx-v1";

function loadTransactions() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (Array.isArray(saved) && saved.length) return saved;
  } catch (e) { /* corrupted storage: fall back to the sample set */ }
  return NESTEGG_DATA.transactions.slice();
}

function saveTransactions(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) { /* private mode: keep it in memory */ }
}

let transactions = loadTransactions();

function currentRoute() {
  const raw = location.hash.replace(/^#\/?/, "");
  const parts = raw.split("?");
  const name = parts[0] || "";
  const query = {};
  if (parts[1]) {
    for (const pair of parts[1].split("&")) {
      const kv = pair.split("=");
      query[decodeURIComponent(kv[0] || "")] = decodeURIComponent(kv[1] || "");
    }
  }
  return { name: name, query: query };
}

function render() {
  const route = currentRoute();
  const app = document.getElementById("app");
  let html = "";
  if (route.name === "transactions") {
    html = renderTransactions(transactions, route.query.cat || "All");
  } else if (route.name === "budgets") {
    html = renderBudgets(transactions);
  } else if (route.name === "goals") {
    html = renderGoals(transactions);
  } else if (route.name === "reports") {
    html = renderReports(transactions);
  } else {
    html = renderDashboard(transactions);
  }
  app.innerHTML = html;
  document.title = "NestEgg — " + (route.name ? route.name.charAt(0).toUpperCase() + route.name.slice(1) : "Dashboard");

  const links = document.querySelectorAll(".mainnav a");
  links.forEach((a) => a.classList.toggle("active", (a.getAttribute("data-route") || "") === route.name));

  const form = document.getElementById("add-tx");
  if (form) form.addEventListener("submit", onAddTransaction);
  window.scrollTo(0, 0);
}

function onAddTransaction(event) {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const direction = data.get("direction") === "in" ? 1 : -1;
  const amount = Math.round(parseFloat(data.get("amount")) * 100) / 100;
  if (!amount || amount <= 0) return;
  const nextId = transactions.reduce((m, t) => Math.max(m, t.id), 0) + 1;
  transactions = transactions.concat([{
    id: nextId,
    date: data.get("date") || "2026-11-26",
    payee: String(data.get("payee")).trim(),
    category: String(data.get("category")),
    amount: direction * amount,
    note: "Added by you",
  }]);
  saveTransactions(transactions);
  render();
  const note = document.getElementById("add-tx-note");
  if (note) note.textContent = "Added — " + money(direction * amount) + " for " + String(data.get("payee")).trim() + ". Saved in this browser.";
}

window.addEventListener("hashchange", render);
render();
