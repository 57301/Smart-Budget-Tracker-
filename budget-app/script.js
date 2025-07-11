let categoryChart;
let savingsChart;
let savingsHistory = [];




let expenses = JSON.parse(localStorage.getItem("expenses")) || [];


function addExpense() {
  const category = document.getElementById("category").value;
  const amount = Number(document.getElementById("amount").value);
  const date = document.getElementById("date").value;
  const income = Number(document.getElementById("income").value);

  if (!category || !amount || !date || !income) {
    alert("Please fill all fields.");
    return;
  }

  expenses.push({ category, amount, date });

  updateSummary(income);
}

expenses.push({ category, amount, date });
localStorage.setItem("expenses", JSON.stringify(expenses));


function updateSummary(income) {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const savings = income - total;
  const yearlySavings = savings * 12;

  document.getElementById("total-expense").innerText = total;
  document.getElementById("monthly-savings").innerText = savings;
  document.getElementById("yearly-savings").innerText = yearlySavings;

  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  const byCategory = {};
  expenses.forEach(exp => {
    const li = document.createElement("li");
    li.innerText = `${exp.category} - ₹${exp.amount} (${exp.date})`;
    list.appendChild(li);

    if (!byCategory[exp.category]) byCategory[exp.category] = 0;
    byCategory[exp.category] += exp.amount;
  });

  generateReview(income, byCategory, total);
  updateCategoryChart(byCategory);
  updateSavingsChart(savings);
}


function generateReview(income, byCategory, total) {
  let review = "";
  const food = byCategory["Food"] || 0;
  const entertainment = byCategory["Entertainment"] || 0;
  document.getElementById("review-text").style.animation = "none";
void document.getElementById("review-text").offsetWidth; // force reflow
document.getElementById("review-text").style.animation = "";
document.getElementById("review-text").innerText = review;


  if (food > 0.3 * total) {
    review += "⚠️ High spending on Food. Try cooking more.\n";
  }

  if (entertainment > 0.25 * total) {
    review += "⚠️ Too much spent on Entertainment. Limit subscriptions.\n";
  }

  if ((income - total) < 0.2 * income) {
    review += "💡 Try to save at least 20% of your income.\n";
  }

  if (!review) {
    review = "✅ Great! Your spending looks balanced.";
  }

  document.getElementById("review-text").innerText = review;
}


function updateCategoryChart(byCategory) {
  const ctx = document.getElementById('categoryChart').getContext('2d');
  const labels = Object.keys(byCategory);
  const data = Object.values(byCategory);

  if (categoryChart) categoryChart.destroy();

  categoryChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Expenses by Category',
        data: data,
        backgroundColor: [
          '#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#7bdcb5', '#ffa07a'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true
    }
  });
}

function updateSavingsChart(currentSaving) {
  const ctx = document.getElementById('savingsChart').getContext('2d');

  const today = new Date().toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric"
  });

  savingsHistory.push({ label: today, value: currentSaving });

  if (savingsChart) savingsChart.destroy();

  savingsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: savingsHistory.map(d => d.label),
      datasets: [{
        label: 'Monthly Savings (₹)',
        data: savingsHistory.map(d => d.value),
        fill: true,
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  const mode = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", mode);
}
// Load saved theme
window.onload = () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
};

window.onload = () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  const income = Number(document.getElementById("income").value) || 0;
  updateSummary(income);
};

document.getElementById("income").value = localStorage.getItem("income") || "";


