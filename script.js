let history = [];
let selectedCalculation = null;
let exchangeRates = { 
  USD: 1, EUR: 0.85, GBP: 0.72, JPY: 110, AUD: 1.35, CAD: 1.25, CHF: 0.92, CNY: 6.45, INR: 83, BRL: 5.2 
  // Add more for top 100 countries via API or static list
};
const planetDistances = { // Avg distance from Sun in million km
  Mercury: 58, Venus: 108, Earth: 150, Mars: 228, Jupiter: 778, Saturn: 1430, Uranus: 2870, Neptune: 4500
};

function appendToDisplay(value) {
  document.getElementById('display').value += value;
}

function clearDisplay() {
  document.getElementById('display').value = '';
  document.getElementById('chosen-option').textContent = '';
}

function deleteLast() {
  document.getElementById('display').value = document.getElementById('display').value.slice(0, -1);
}

function handleEquals() {
  calculate();
}

function calculate() {
  let display = document.getElementById('display');
  try {
    const result = eval(display.value);
    history.push({ type: 'basic', input: display.value, result: result, date: new Date().toISOString().split('T')[0] });
    display.value = result;
    updateHistory();
  } catch (error) {
    display.value = 'Error';
  }
}

function toggleHistory() {
  document.getElementById('history').classList.toggle('show');
}

document.addEventListener('click', (event) => {
  const historyButton = document.querySelector('.menu-button');
  const historyContainer = document.getElementById('history');
  if (!historyButton.contains(event.target) && !historyContainer.contains(event.target)) {
    historyContainer.classList.remove('show');
  }
});

function toggleSubMenu() {
  const subMenu = document.getElementById('sub-menu');
  subMenu.classList.toggle('show');
}

function togglePopup(type) {
  const popups = ['profit-loss', 'date', 'currency', 'distance'];
  popups.forEach(p => {
    const popup = document.getElementById(`${p}-popup`);
    if (p === type) {
      popup.classList.toggle('show');
      if (!popup.classList.contains('show')) resetPopup(p);
    } else {
      popup.classList.remove('show');
    }
  });
  document.getElementById('sub-menu').classList.remove('show');
}

function resetPopup(type) {
  if (type === 'profit-loss') {
    document.getElementById('cp-input').value = '';
    document.getElementById('sp-input').value = '';
    document.getElementById('profit-loss-output').textContent = '';
  } else if (type === 'date') {
    document.getElementById('date-input').value = '';
    document.getElementById('speed-input').value = '';
    document.getElementById('duration-input').value = '';
    document.getElementById('date-output').textContent = '';
  } else if (type === 'currency') {
    document.getElementById('currency-input').value = '';
    document.getElementById('currency-output').textContent = '';
  } else if (type === 'distance') {
    document.getElementById('speed-distance').value = '';
    document.getElementById('distance-output').textContent = '';
  }
}

document.addEventListener('click', (event) => {
  const menuButton = document.querySelector('.main-menu-button');
  const subMenu = document.getElementById('sub-menu');
  const popups = document.querySelectorAll('.popup');
  if (!menuButton.contains(event.target) && !subMenu.contains(event.target)) {
    subMenu.classList.remove('show');
  }
  popups.forEach(popup => {
    const type = popup.id.split('-')[0];
    if (!popup.contains(event.target) && !subMenu.contains(event.target) && popup.classList.contains('show')) {
      togglePopup(type);
    }
  });
});

// Profit/Loss
function calculateProfitLossResult() {
  const mode = document.getElementById('profit-loss-mode').value;
  const cp = parseFloat(document.getElementById('cp-input').value);
  const sp = parseFloat(document.getElementById('sp-input').value);
  const output = document.getElementById('profit-loss-output');

  if (isNaN(cp) || isNaN(sp)) {
    output.textContent = "Analysis Error: Invalid Input";
    return;
  }

  let result, text;
  switch (mode) {
    case 'profit': result = sp - cp; text = result >= 0 ? `Profit: ${result}` : `Loss: ${Math.abs(result)}`; break;
    case 'loss': result = cp - sp; text = result >= 0 ? `Loss: ${result}` : `Profit: ${Math.abs(result)}`; break;
    case 'profitPercentage': result = ((sp - cp) / cp) * 100; text = result >= 0 ? `Profit %: ${result.toFixed(2)}%` : `Loss %: ${Math.abs(result).toFixed(2)}%`; break;
    case 'lossPercentage': result = ((cp - sp) / cp) * 100; text = result >= 0 ? `Loss %: ${result.toFixed(2)}%` : `Profit %: ${Math.abs(result).toFixed(2)}%`; break;
  }
  output.textContent = text;
  history.push({ type: 'profit-loss', mode: mode, cp: cp, sp: sp, result: text, date: new Date().toISOString().split('T')[0] });
  updateHistory();
}

// Date Calc
function calculateDateResult() {
  const inputDateStr = document.getElementById('date-input').value.trim();
  const speed = parseFloat(document.getElementById('speed-input').value) / 100;
  const duration = parseFloat(document.getElementById('duration-input').value);
  const output = document.getElementById('date-output');
  const inputDate = new Date(inputDateStr);
  const today = new Date("2025-03-21");

  if (isNaN(inputDate.getTime())) {
    output.textContent = "Temporal Anomaly: Invalid Date";
    return;
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = days[inputDate.getDay()];
  const diffTime = today - inputDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let result = `Scan: ${inputDateStr} was a ${dayOfWeek}, ${diffDays} solar cycles ago`;
  if (speed && duration) {
    const dilatedTime = duration / Math.sqrt(1 - Math.pow(speed, 2));
    result += `\nTime Dilation: Earth time ${duration} years, Your time ${dilatedTime.toFixed(2)} years`;
  }
  output.textContent = result;
  history.push({ type: 'date', input: inputDateStr, speed: speed, duration: duration, result: result, date: new Date().toISOString().split('T')[0] });
  updateHistory();
}

// Currency
function convertCurrency() {
  const from = document.getElementById('from-currency').value;
  const to = document.getElementById('to-currency').value;
  const amount = parseFloat(document.getElementById('currency-input').value);
  const output = document.getElementById('currency-output');

  if (isNaN(amount)) {
    output.textContent = "Exchange Error: Invalid Amount";
    return;
  }

  const result = (amount / exchangeRates[from]) * exchangeRates[to];
  output.textContent = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
  history.push({ type: 'currency', from: from, to: to, amount: amount, result: result.toFixed(2), date: new Date().toISOString().split('T')[0] });
  updateHistory();
}

function quantumFluctuation() {
  for (let key in exchangeRates) {
    exchangeRates[key] *= (1 + (Math.random() - 0.5) * 0.1);
  }
  convertCurrency();
}

// Distance
function calculateDistance() {
  const start = document.getElementById('start-point').value;
  const end = document.getElementById('end-point').value;
  const speed = parseFloat(document.getElementById('speed-distance').value);
  const output = document.getElementById('distance-output');

  if (start === end) {
    output.textContent = "Nav Error: Same Origin and Destination";
    return;
  }
  if (isNaN(speed) || speed <= 0) {
    output.textContent = "Nav Error: Invalid Speed";
    return;
  }

  const distance = Math.abs(planetDistances[start] - planetDistances[end]) * 1e6; // Convert to km
  const time = distance / speed / (60 * 60 * 24 * 365); // Years
  output.textContent = `Distance: ${distance.toExponential(2)} km\nTravel Time: ${time.toFixed(2)} years`;
  history.push({ type: 'distance', start: start, end: end, speed: speed, result: output.textContent, date: new Date().toISOString().split('T')[0] });
  updateHistory();
}

function hyperspaceJump() {
  const speed = parseFloat(document.getElementById('speed-distance').value);
  if (!speed) return;
  document.getElementById('speed-distance').value = speed * 1000;
  calculateDistance();
  document.getElementById('distance-output').textContent += `\nFuel Cost: ${(Math.random() * 100).toFixed(2)} GC`;
}

// History and Prediction
function updateHistory() {
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = '';
  history.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = item.result || `${item.input} = ${item.result}`;
    li.setAttribute('data-index', index);
    li.onclick = () => selectCalculation(index);
    historyList.appendChild(li);
  });
}

function selectCalculation(index) {
  selectedCalculation = history[index];
  document.querySelectorAll('#history-list li').forEach((li) => li.classList.remove('selected'));
  document.querySelector(`#history-list li[data-index="${index}"]`).classList.add('selected');
}

function loadSelectedCalculation() {
  if (selectedCalculation && selectedCalculation.type === 'basic') {
    document.getElementById('display').value = selectedCalculation.input;
  }
}

function predictFuture() {
  const profitLoss = history.filter(h => h.type === 'profit-loss' && h.mode.includes('Profit'));
  if (profitLoss.length < 2) {
    alert("AI Core: Insufficient data for prediction");
    return;
  }
  const avgProfit = profitLoss.reduce((sum, h) => sum + parseFloat(h.result), 0) / profitLoss.length;
  const futureDate = new Date("2025-06-01").toISOString().split('T')[0];
  const prediction = `AI Core Prediction: Expect ${avgProfit.toFixed(2)}% profit by ${futureDate}`;
  alert(prediction);
  history.push({ type: 'prediction', result: prediction, date: new Date().toISOString().split('T')[0] });
  updateHistory();
}

function clearHistory() {
  history = [];
  updateHistory();
}