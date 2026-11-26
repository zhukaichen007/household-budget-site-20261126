/* NestEgg sample data — the Hart household, November 2026.
   All figures are invented sample data for this demo site. */

const NESTEGG_DATA = {
  household: "The Hart Household",
  month: "November 2026",
  members: [
    { name: "Maya Hart", role: "Teacher — salary" },
    { name: "Daniel Hart", role: "Freelance designer" },
    { name: "Leo Hart", role: "Age 9 — pocket money" },
  ],
  income: [
    { source: "Maya's salary", amount: 4200 },
    { source: "Daniel's freelance", amount: 1850 },
    { source: "Interest & cashback", amount: 86 },
  ],
  budgets: [
    { category: "Groceries", limit: 900, color: "#2f6b4f" },
    { category: "Housing", limit: 1450, color: "#7a9e7e" },
    { category: "Transport", limit: 420, color: "#c98f2d" },
    { category: "Dining out", limit: 320, color: "#b4552d" },
    { category: "Utilities", limit: 310, color: "#5b7d8a" },
    { category: "Kids & school", limit: 380, color: "#8a6d9e" },
    { category: "Fun & leisure", limit: 260, color: "#4d8a6f" },
    { category: "Health", limit: 200, color: "#a3703f" },
  ],
  goals: [
    { name: "Emergency fund", target: 12000, saved: 8450, note: "$350 a month until it is full" },
    { name: "Family holiday in Penang", target: 3200, saved: 1980, note: "Flights booked for March — keep saving" },
    { name: "Replace the old car", target: 9000, saved: 2350, note: "$400 a month from Daniel's freelance" },
    { name: "Kitchen refresh", target: 4500, saved: 1120, note: "New counters and paint, spring next year" },
  ],
  months: [
    { month: "Jun", income: 5980, spending: 5120 },
    { month: "Jul", income: 6240, spending: 5460 },
    { month: "Aug", income: 6010, spending: 5890 },
    { month: "Sep", income: 6410, spending: 5230 },
    { month: "Oct", income: 6090, spending: 5710 },
    { month: "Nov", income: 6136, spending: 2876 },
  ],
  transactions: [
    { id: 1, date: "2026-11-25", payee: "GreenMart supermarket", category: "Groceries", amount: -142.60, note: "Weekly shop" },
    { id: 2, date: "2026-11-25", payee: "Daniel Hart — invoice paid", category: "Income", amount: 640.00, note: "Logo project, client B" },
    { id: 3, date: "2026-11-24", payee: "City Power & Light", category: "Utilities", amount: -118.40, note: "Electricity, October" },
    { id: 4, date: "2026-11-23", payee: "Sunrise Bakery", category: "Dining out", amount: -18.90, note: "Sunday breakfast" },
    { id: 5, date: "2026-11-22", payee: "Maya Hart — salary", category: "Income", amount: 2100.00, note: "Second half of November" },
    { id: 6, date: "2026-11-22", payee: "Leo's school book fair", category: "Kids & school", amount: -46.50, note: "Three books" },
    { id: 7, date: "2026-11-21", payee: "FuelStop petrol", category: "Transport", amount: -58.20, note: "Full tank" },
    { id: 8, date: "2026-11-20", payee: "GreenMart supermarket", category: "Groceries", amount: -96.75, note: "Top-up shop" },
    { id: 9, date: "2026-11-19", payee: "StreamPlay subscription", category: "Fun & leisure", amount: -15.99, note: "Monthly" },
    { id: 10, date: "2026-11-18", payee: "Corner Pharmacy", category: "Health", amount: -34.80, note: "Vitamins and plasters" },
    { id: 11, date: "2026-11-17", payee: "Riverside Ramen", category: "Dining out", amount: -42.30, note: "Dinner with friends" },
    { id: 12, date: "2026-11-16", payee: "Bus & train top-up", category: "Transport", amount: -50.00, note: "Monthly pass" },
    { id: 13, date: "2026-11-15", payee: "Maya Hart — salary", category: "Income", amount: 2100.00, note: "First half of November" },
    { id: 14, date: "2026-11-15", payee: "Rent — Maple Court", category: "Housing", amount: -1250.00, note: "November rent" },
    { id: 15, date: "2026-11-14", payee: "GreenMart supermarket", category: "Groceries", amount: -128.40, note: "Weekly shop" },
    { id: 16, date: "2026-11-13", payee: "Kids' football club", category: "Kids & school", amount: -65.00, note: "Term fees" },
    { id: 17, date: "2026-11-12", payee: "Water bill", category: "Utilities", amount: -42.10, note: "October usage" },
    { id: 18, date: "2026-11-11", payee: "Daniel Hart — invoice paid", category: "Income", amount: 520.00, note: "Website refresh, client A" },
    { id: 19, date: "2026-11-10", payee: "Cinema — family night", category: "Fun & leisure", amount: -38.50, note: "Two adults, one child" },
    { id: 20, date: "2026-11-09", payee: "GreenMart supermarket", category: "Groceries", amount: -118.90, note: "Weekly shop" },
    { id: 21, date: "2026-11-08", payee: "FuelStop petrol", category: "Transport", amount: -54.60, note: "Full tank" },
    { id: 22, date: "2026-11-07", payee: "Dentist — Leo check-up", category: "Health", amount: -85.00, note: "Six-month check" },
    { id: 23, date: "2026-11-06", payee: "Internet & mobile", category: "Utilities", amount: -89.00, note: "Monthly plan" },
    { id: 24, date: "2026-11-05", payee: "Noodle House", category: "Dining out", amount: -36.75, note: "Lunch, Maya and Daniel" },
    { id: 25, date: "2026-11-04", payee: "GreenMart supermarket", category: "Groceries", amount: -131.20, note: "Weekly shop" },
    { id: 26, date: "2026-11-03", payee: "Daniel Hart — invoice paid", category: "Income", amount: 690.00, note: "Brand pack, client C" },
    { id: 27, date: "2026-11-02", payee: "School lunch money", category: "Kids & school", amount: -40.00, note: "Leo, November" },
    { id: 28, date: "2026-11-01", payee: "Cashback — bank rewards", category: "Income", amount: 86.00, note: "October cashback" },
    { id: 29, date: "2026-11-01", payee: "Building maintenance", category: "Housing", amount: -120.00, note: "Monthly fee" },
    { id: 30, date: "2026-11-01", payee: "Toy shop — birthday gift", category: "Kids & school", amount: -52.40, note: "Gift for Leo's friend" },
  ],
};

/* Money helpers shared by every view. */
function money(amount) {
  const sign = amount < 0 ? "−" : "";
  return sign + "$" + Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function moneyShort(amount) {
  return "$" + Math.round(Math.abs(amount)).toLocaleString("en-US");
}

function pct(part, whole) {
  if (!whole) return 0;
  return Math.round((part / whole) * 100);
}
