let history = [];
let selectedCalculation = null;
let currentMode = null; // Tracks the current mode (Profit, Loss, Profit %, Loss %)
let cp = null; // Cost Price
let sp = null; // Selling Price

function appendToDisplay(value) {
  document.getElementById('display').value += value;
}

function clearDisplay() {
  document.getElementById('display').value = '';
}

function deleteLast() {
  let display = document.getElementById('display');
  display.value = display.value.slice(0, -1);
}

function handleEquals() {
  if (currentMode) {
    calculateResult();
  } else {
    calculate();
  }
}

function calculate() {
  let display = document.getElementById('display');
  try {
    const result = eval(display.value);
    history.push(`${display.value} = ${result}`);
    display.value = result;
    updateHistory();
  } catch (error) {
    display.value = 'Error';
  }
}

// Toggle History menu with animation
function toggleHistory() {
  const historyContainer = document.getElementById('history');
  historyContainer.classList.toggle('show');
}

// Close History menu when clicking outside
document.addEventListener('click', (event) => {
  const historyButton = document.querySelector('.menu-button');
  const historyContainer = document.getElementById('history');
  const isClickInsideHistory = historyButton.contains(event.target) || historyContainer.contains(event.target);

  if (!isClickInsideHistory) {
    historyContainer.classList.remove('show');
  }
});

// Toggle Profit/Loss menu with animation
function toggleProfitLossMenu() {
  const options = document.getElementById('profit-loss-options');
  options.classList.toggle('show');
}

// Close Profit/Loss menu when clicking outside
document.addEventListener('click', (event) => {
  const menuButton = document.querySelector('.profit-loss-menu button');
  const menuOptions = document.getElementById('profit-loss-options');
  const isClickInsideMenu = menuButton.contains(event.target) || menuOptions.contains(event.target);

  if (!isClickInsideMenu) {
    menuOptions.classList.remove('show');
  }
});

function handleProfit() {
  currentMode = 'profit';
  document.getElementById('chosen-option').textContent = 'Profit';
  document.getElementById('display').value = 'CP:';
  toggleProfitLossMenu();
}

function handleLoss() {
  currentMode = 'loss';
  document.getElementById('chosen-option').textContent = 'Loss';
  document.getElementById('display').value = 'CP:';
  toggleProfitLossMenu();
}

function handleProfitPercentage() {
  currentMode = 'profitPercentage';
  document.getElementById('chosen-option').textContent = 'Profit %';
  document.getElementById('display').value = 'CP:';
  toggleProfitLossMenu();
}

function handleLossPercentage() {
  currentMode = 'lossPercentage';
  document.getElementById('chosen-option').textContent = 'Loss %';
  document.getElementById('display').value = 'CP:';
  toggleProfitLossMenu();
}

function calculateResult() {
  const display = document.getElementById('display');
  const input = display.value.split(':')[1].trim();

  if (cp === null) {
    cp = parseFloat(input);
    display.value = 'SP:';
  } else {
    sp = parseFloat(input);
    let result;
    switch (currentMode) {
      case 'profit':
        result = sp - cp;
        if (result >= 0) {
          display.value = `Profit: ${result}`;
        } else {
          display.value = `Loss: ${Math.abs(result)}`;
        }
        break;
      case 'loss':
        result = cp - sp;
        if (result >= 0) {
          display.value = `Loss: ${result}`;
        } else {
          display.value = `Profit: ${Math.abs(result)}`;
        }
        break;
      case 'profitPercentage':
        result = ((sp - cp) / cp) * 100;
        if (result >= 0) {
          display.value = `Profit %: ${result.toFixed(2)}%`;
        } else {
          display.value = `Loss %: ${Math.abs(result).toFixed(2)}%`;
        }
        break;
      case 'lossPercentage':
        result = ((cp - sp) / cp) * 100;
        if (result >= 0) {
          display.value = `Loss %: ${result.toFixed(2)}%`;
        } else {
          display.value = `Profit %: ${Math.abs(result).toFixed(2)}%`;
        }
        break;
    }
    history.push(display.value);
    updateHistory();
    cp = null;
    sp = null;
    currentMode = null;
    document.getElementById('chosen-option').textContent = ''; // Clear chosen option
  }
}

function updateHistory() {
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = '';
  history.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = item;
    li.setAttribute('data-index', index);
    li.onclick = () => selectCalculation(index);
    historyList.appendChild(li);
  });
}

function selectCalculation(index) {
  selectedCalculation = history[index].split(' = ')[0];
  document.querySelectorAll('#history-list li').forEach((li) => {
    li.classList.remove('selected');
  });
  document.querySelector(`#history-list li[data-index="${index}"]`).classList.add('selected');
}

function loadSelectedCalculation() {
  if (selectedCalculation !== null) {
    document.getElementById('display').value = selectedCalculation;
  }
}

function clearHistory() {
  history = [];
  updateHistory();
}