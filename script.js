// Personal Finance Tracker  JS
// Global variables to store application state
let expenses = []; // Array to store all transactions
let isDarkMode = false; // Boolean for theme state
let totalIncome = 0; // Number for tracking income
let totalExpenses = 0; // Number for tracking expenses

/**
 * Basic budget calculation using conditionals and variables
 * Demonstrates: variables, data types, conditionals, user input
 */
function calculateBudget() {
  // Getting user input and convert to numbers (data type conversion)
  const monthlyIncome =
    parseFloat(document.getElementById("income").value) || 0;
  const monthlyExpenses =
    parseFloat(document.getElementById("expenses").value) || 0;

  // Variable to store the difference
  const difference = monthlyIncome - monthlyExpenses;
  const resultElement = document.getElementById("budgetResult");

  // Conditional logic to determine financial status
  if (monthlyIncome === 0 && monthlyExpenses === 0) {
    // Check for no input
    resultElement.innerHTML =
      "Please enter your income and expenses to calculate your budget.";
    resultElement.style.background = "#fff3cd";
  } else if (difference > 0) {
    // Positive budget
    resultElement.innerHTML = `
                    <h4> Great! You have a surplus of $${difference.toFixed(
                      2
                    )}</h4>
                    <p>You're spending ${(
                      (monthlyExpenses / monthlyIncome) *
                      100
                    ).toFixed(1)}% of your income.</p>
                    <p><strong>Recommendation:</strong> Consider saving or investing the extra money!</p>
                `;
    resultElement.style.background = "#d5f4e6";
  } else if (difference < 0) {
    // Negative budget (overspending)
    const overspend = Math.abs(difference);
    resultElement.innerHTML = `
                    <h4> Warning! You're overspending by $${overspend.toFixed(
                      2
                    )}</h4>
                    <p>You're spending ${(
                      (monthlyExpenses / monthlyIncome) *
                      100
                    ).toFixed(1)}% of your income.</p>
                    <p><strong>Recommendation:</strong> Review and reduce your expenses!</p>
                `;
    resultElement.style.background = "#fadbd8";
  } else {
    // Break even
    resultElement.innerHTML = `
                    <h4>You're breaking even!</h4>
                    <p>Your income exactly matches your expenses.</p>
                    <p><strong>Recommendation:</strong> Try to create a small buffer for savings!</p>
                `;
    resultElement.style.background = "#e2e3e5";
  }

  // Add fade-in animation
  resultElement.classList.add("fade-in");
}

/**
 * Adding expense/income transaction
 * Demonstrates: function parameters, return values, object manipulation
 */
function addExpense() {
  const description = document.getElementById("expenseDesc").value.trim();
  const amount = parseFloat(document.getElementById("expenseAmount").value);
  const type = document.getElementById("expenseType").value;

  // Input validation
  if (!description || !amount || amount <= 0) {
    alert("Please enter valid description and amount!");
    return; // Early return if invalid
  }

  // Create expense object
  const transaction = {
    id: Date.now(), // Unique ID using timestamp
    description: description,
    amount: amount,
    type: type,
    date: new Date().toLocaleDateString(),
  };

  // Add to expenses array
  expenses.push(transaction);

  // Clear inputs
  document.getElementById("expenseDesc").value = "";
  document.getElementById("expenseAmount").value = "";

  // Update displays
  displayExpenses();
  updateSummary();
}

/**
 * Function 2: Format currency display
 * Demonstrates: utility function, string manipulation, reusability
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Function 3: Calculate totals for summary
 * Demonstrates: array processing, mathematical operations
 */
function calculateTotals() {
  let income = 0;
  let expenseTotal = 0;

  // Process each transaction
  expenses.forEach((transaction) => {
    if (transaction.type === "income") {
      income += transaction.amount;
    } else {
      expenseTotal += transaction.amount;
    }
  });

  return {
    income: income,
    expenses: expenseTotal,
    balance: income - expenseTotal,
  };
}

/**
 * Displaying all expenses using forEach
 * Demonstrates: forEach loop, DOM creation, conditional styling
 */
function displayExpenses() {
  const container = document.getElementById("expenseList");
  container.innerHTML = "";

  if (expenses.length === 0) {
    container.innerHTML =
      "<p>No transactions yet. Add some income or expenses!</p>";
    return;
  }

  // forEach loop to create DOM elements for each expense
  expenses.forEach((transaction, index) => {
    const expenseDiv = document.createElement("div");
    expenseDiv.className = `expense-item ${transaction.type}`;
    expenseDiv.innerHTML = `
                    <div>
                        <strong>${transaction.description}</strong>
                        <small> - ${transaction.date}</small>
                    </div>
                    <div>
                        <span>${formatCurrency(transaction.amount)}</span>
                        <button class="delete-btn" onclick="deleteExpense(${
                          transaction.id
                        })">×</button>
                    </div>
                `;
    container.appendChild(expenseDiv);
  });
}

/**
=         * Demonstrates: for loop, mathematical progression, conditional logic
         */
function calculateSavingsGoal() {
  const goalAmount = parseFloat(document.getElementById("goalAmount").value);
  const monthlyContribution = parseFloat(
    document.getElementById("monthlyContribution").value
  );
  const resultElement = document.getElementById("savingsResult");

  if (
    !goalAmount ||
    !monthlyContribution ||
    goalAmount <= 0 ||
    monthlyContribution <= 0
  ) {
    resultElement.innerHTML =
      " Please enter valid goal amount and monthly contribution!";
    return;
  }

  let currentSavings = 0;
  let months = 0;
  let progressHTML =
    '<h4> Savings Timeline:</h4><div style="max-height: 200px; overflow-y: auto;">';

  // for loop to simulate savings progress
  for (months = 1; currentSavings < goalAmount; months++) {
    currentSavings += monthlyContribution;
    const progressPercent = Math.min((currentSavings / goalAmount) * 100, 100);

    // Show progress every few months or at the end
    if (months % 6 === 0 || currentSavings >= goalAmount) {
      progressHTML += `
                        <div style="margin: 10px 0; padding: 10px; background: white; border-radius: 5px;">
                            Month ${months}: ${formatCurrency(
        currentSavings
      )} (${progressPercent.toFixed(1)}%)
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progressPercent}%"></div>
                            </div>
                        </div>
                    `;
    }

    // Safety check to prevent infinite loop
    if (months > 1200) {
      // 100 years max
      progressHTML += "<p>Goal will take more than 100 years to achieve!</p>";
      break;
    }
  }

  progressHTML += "</div>";
  progressHTML += `<h4> Result: You'll reach your goal of ${formatCurrency(
    goalAmount
  )} in ${months - 1} months!</h4>`;

  resultElement.innerHTML = progressHTML;
}

//Demonstrates: while loop, array manipulation, random selection

function generateFinancialTips() {
  const tips = [
    " Create an emergency fund with 3-6 months of expenses",
    " Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings",
    " Start investing early to benefit from compound interest",
    " Track your expenses to identify spending patterns",
    " Automate your savings to make it effortless",
    " Pay off high-interest debt first",
    " Review and optimize your subscriptions regularly",
    " Set specific financial goals and deadlines",
    " Compare prices before making major purchases",
    " Invest in your education and skills development",
  ];

  const container = document.getElementById("tipsContainer");
  let tipsHTML = "<h4>Financial Tips for You:</h4>";
  let tipCount = 0;
  let usedIndexes = [];

  // while loop to generate 3 random unique tips
  while (tipCount < 3 && usedIndexes.length < tips.length) {
    const randomIndex = Math.floor(Math.random() * tips.length);

    if (!usedIndexes.includes(randomIndex)) {
      usedIndexes.push(randomIndex);
      tipsHTML += `<div style="padding: 10px; margin: 5px 0; background: white; border-radius: 5px; border-left: 3px solid #27ae60;">${tips[randomIndex]}</div>`;
      tipCount++;
    }
  }

  container.innerHTML = tipsHTML;
}

/**
 * Toggle theme (dark/light mode)
 * Demonstrates: DOM style manipulation, event handling, state management
 */
function toggleTheme() {
  const body = document.body;
  const button = document.getElementById("themeBtn");

  if (!isDarkMode) {
    // Switch to dark mode
    body.style.background = "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)";
    document.querySelector(".container").style.background = "#34495e";
    document.querySelector(".container").style.color = "white";

    // Update all sections
    const sections = document.querySelectorAll(".section");
    sections.forEach((section) => {
      section.style.background = "#2c3e50";
      section.style.color = "white";
    });

    // Update all outputs
    const outputs = document.querySelectorAll(".output");
    outputs.forEach((output) => {
      output.style.background = "#455a64";
      output.style.color = "white";
    });

    button.innerHTML = "☀️ Light Mode";
    isDarkMode = true;
  } else {
    // Switch to light mode
    body.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    document.querySelector(".container").style.background = "white";
    document.querySelector(".container").style.color = "#333";

    const sections = document.querySelectorAll(".section");
    sections.forEach((section) => {
      section.style.background = "#f8f9fa";
      section.style.color = "#333";
    });

    const outputs = document.querySelectorAll(".output");
    outputs.forEach((output) => {
      output.style.background = "white";
      output.style.color = "#333";
    });

    button.innerHTML = "🌙 Dark Mode";
    isDarkMode = false;
  }
}

/**
 * Dynamic content creation and removal
 * Demonstrates: createElement, appendChild, removeChild, event handling
 */
function deleteExpense(id) {
  // Remove from array
  expenses = expenses.filter((expense) => expense.id !== id);

  // Update display
  displayExpenses();
  updateSummary();

  // Show confirmation message
  const container = document.getElementById("expenseList");
  const message = document.createElement("div");
  message.style.background = "#d1ecf1";
  message.style.padding = "10px";
  message.style.borderRadius = "5px";
  message.style.marginTop = "10px";
  message.innerHTML = "✅ Transaction deleted successfully!";
  container.appendChild(message);

  // Remove message after 3 seconds
  setTimeout(() => {
    if (message.parentNode) {
      message.parentNode.removeChild(message);
    }
  }, 3000);
}

/**
 * DOM Interaction 3: Update summary cards dynamically
 * Demonstrates: innerHTML manipulation, conditional classes, real-time updates
 */
function updateSummary() {
  const totals = calculateTotals();
  const container = document.getElementById("summaryCards");

  container.innerHTML = `
                <div class="summary-card positive">
                    <h4>Income</h4>
                    <p>${formatCurrency(totals.income)}</p>
                </div>
                <div class="summary-card negative">
                    <h4>Expenses</h4>
                    <p>${formatCurrency(totals.expenses)}</p>
                </div>
                <div class="summary-card ${
                  totals.balance >= 0 ? "positive" : "negative"
                }">
                    <h4>Balance</h4>
                    <p>${formatCurrency(totals.balance)}</p>
                </div>
                <div class="summary-card">
                    <h4>Transactions</h4>
                    <p>${expenses.length} total</p>
                </div>
            `;
}

// Additional DOM manipulation functions

function clearAllData() {
  if (
    confirm("Are you sure you want to clear all data? This cannot be undone!")
  ) {
    expenses = [];
    displayExpenses();
    updateSummary();
    document.getElementById("budgetResult").innerHTML = "";
    document.getElementById("savingsResult").innerHTML = "";
    document.getElementById("tipsContainer").innerHTML = "";
  }
}

function exportData() {
  const totals = calculateTotals();
  const exportContainer = document.getElementById("exportResult");

  const summary = `
                <h4>📊 Financial Summary Export</h4>
                <div style="background: white; padding: 15px; border-radius: 5px; font-family: monospace;">
                    <strong>PERSONAL FINANCE SUMMARY</strong><br>
                    Generated: ${new Date().toLocaleString()}<br><br>
                    
                    Total Income: ${formatCurrency(totals.income)}<br>
                    Total Expenses: ${formatCurrency(totals.expenses)}<br>
                    Net Balance: ${formatCurrency(totals.balance)}<br>
                    Total Transactions: ${expenses.length}<br><br>
                    
                    Recent Transactions:<br>
                    ${expenses
                      .slice(-5)
                      .map(
                        (t) =>
                          `• ${t.description}: ${formatCurrency(t.amount)} (${
                            t.type
                          })`
                      )
                      .join("<br>")}
                    ${
                      expenses.length > 5
                        ? "<br>... and " + (expenses.length - 5) + " more"
                        : ""
                    }
                </div>
            `;

  exportContainer.innerHTML = summary;
}

function addRandomExpense() {
  const randomExpenses = [
    { desc: "Coffee Shop", amount: 4.5 },
    { desc: "Gas Station", amount: 45.0 },
    { desc: "Grocery Store", amount: 67.89 },
    { desc: "Streaming Service", amount: 12.99 },
    { desc: "Lunch Out", amount: 15.75 },
  ];

  const random =
    randomExpenses[Math.floor(Math.random() * randomExpenses.length)];

  expenses.push({
    id: Date.now(),
    description: random.desc,
    amount: random.amount,
    type: "expense",
    date: new Date().toLocaleDateString(),
  });

  displayExpenses();
  updateSummary();
}

function showHiddenFeature() {
  const hiddenDiv = document.getElementById("hiddenFeature");
  hiddenDiv.classList.remove("hidden");
  hiddenDiv.classList.add("fade-in");
}

function generateRandomQuote() {
  const quotes = [
    "The real measure of your wealth is how much you'd be worth if you lost all your money. - Bernard Meltzer",
    "It's not how much money you make, but how much money you keep. - Robert Kiyosaki",
    "A penny saved is a penny earned. - Benjamin Franklin",
    "The best investment you can make is in yourself. - Warren Buffett",
    "Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver. - Ayn Rand",
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById(
    "quoteDisplay"
  ).innerHTML = `<em>"${randomQuote}"</em>`;
}

// Initialize the application when page loads
document.addEventListener("DOMContentLoaded", function () {
  updateSummary();
  console.log("JavaScript Mastery Project Loaded Successfully!");
  console.log("Features: Variables, Functions, Loops, DOM Manipulation");
});
