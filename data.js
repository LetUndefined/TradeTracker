document.addEventListener("DOMContentLoaded", () => {
  // Get elements
  const calendar = document.querySelector("#calendar");
  const prev = document.querySelector("#prev");
  const next = document.querySelector("#next");
  const today = document.querySelector("#today");
  const modal = document.querySelector("#MyModal");
  const closeModal = document.querySelector("#close-modal");
  const symbol = document.querySelector("#symbol");
  const amount = document.querySelector("#amount");
  let trades = {};
  let selectedDate = null;

  if (localStorage.getItem("trades")) {
    trades = JSON.parse(localStorage.getItem("trades"));
  }

  // Variables for calendar
  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  function renderCalendar(month, year) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    document.querySelector(".date li:nth-child(4)").textContent = `${monthNames[month]} ${year}`;

    // Find the first day in the month
    const firstDay = new Date(year, month, 1).getDay();
    // Get the amount of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Creating the days for the calendar
    let daysContainer = document.querySelector(".days");

    if (!daysContainer) {
      daysContainer = document.createElement("div");
      daysContainer.className = "days";
      calendar.appendChild(daysContainer);
    }

    daysContainer.innerHTML = "";

    // Create empty placeholders for non-existing days at the beginning of the month
    for (let i = 0; i < firstDay; i++) {
      const emptyDay = document.createElement("div");
      emptyDay.classList.add("day-empty");
      daysContainer.appendChild(emptyDay);
    }

    // Create a box for every day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayElement = document.createElement("div");
      dayElement.classList.add("day");

      const dateNumber = document.createElement("span");
      dateNumber.textContent = i;
      dayElement.appendChild(dateNumber);

      if (i === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
        dateNumber.classList.add("today");
      }

      // Create a date key to check for trades
      const dateKey = `${year}-${month + 1}-${i}`;
      if (trades[dateKey] && trades[dateKey].length > 0) {
        const dailyTotal = trades[dateKey].reduce((sum, trade) => sum + trade.amount, 0);
        const tradeIndicator = document.createElement("div");
        tradeIndicator.classList.add("trade-indicator");

        tradeIndicator.textContent = `${dailyTotal >= 0 ? "+" : "-"}$${Math.abs(dailyTotal).toFixed(2)}`;
        tradeIndicator.classList.add(dailyTotal >= 0 ? "profit" : "loss");

        dayElement.appendChild(tradeIndicator);
      }

      dayElement.addEventListener("click", () => {
        selectedDate = new Date(year, month, i);
        modal.style.display = "block";
      });

      daysContainer.appendChild(dayElement);
    }
  }

  function goToPrevious() {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  }

  function goToNext() {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  }

  function goToToday() {
    currentMonth = currentDate.getMonth();
    currentYear = currentDate.getFullYear();
    renderCalendar(currentMonth, currentYear);
  }

  prev.addEventListener("click", goToPrevious);
  next.addEventListener("click", goToNext);
  today.addEventListener("click", goToToday);

  renderCalendar(currentMonth, currentYear);

  // Functions for modal
  function modalClose() {
    modal.style.display = "none";
    symbol.value = "";
    amount.value = "";
  }

  closeModal.addEventListener("click", modalClose);

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modalClose();
    }
  });

  // Save trades to localStorage
  function saveTrades() {
    localStorage.setItem("trades", JSON.stringify(trades));
  }

  function addTrade() {
    const symbolValue = symbol.value.trim();
    const amountStr = amount.value.trim();
    const amountValue = parseFloat(amountStr);

    if (!symbolValue || !amountStr) {
      alert("Fill in all fields");
      return;
    }

    if (!selectedDate) {
      alert("No date selected");
      return;
    }

    const day = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    const dateKey = `${year}-${month}-${day}`;

    if (!trades[dateKey]) {
      trades[dateKey] = [];
    }

    trades[dateKey].push({
      symbol: symbolValue,
      amount: amountValue,
      timeStamp: new Date().toISOString(),
    });

    saveTrades();
    modalClose();
    renderCalendar(currentMonth, currentYear);
  }

  document.querySelector("#add-trade").addEventListener("click", addTrade);
});
