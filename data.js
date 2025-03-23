document.addEventListener("DOMContentLoaded", () => {
  //Get elements
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

  //variables for calendar

  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();

  function renderCalendar(month, year) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    document.querySelector(".date li:nth-child(4)").textContent = `${monthNames[month]}  ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let daysContainer = document.querySelector(".days");

    if (!daysContainer) {
      daysContainer = document.createElement("div");
      daysContainer.className = "days";
      calendar.appendChild(daysContainer);
    }

    daysContainer.innerHTML = "";

    for (let i = 0; i < firstDay; i++) {
      const emptyDay = document.createElement("div");
      emptyDay.classList = "day-empty";
      daysContainer.appendChild(emptyDay);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayElement = document.createElement("div");
      dayElement.classList.add("day");

      if (i === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear()) {
        dayElement.classList.add("today");
      }

      const dateNumber = document.createElement("span");
      dateNumber.textContent = i;
      dayElement.appendChild(dateNumber);

      daysContainer.appendChild(dayElement);
      document.querySelectorAll(".day").forEach((item) => {
        item.addEventListener("click", () => {
          const month = currentMonth;
          const year = currentYear;

          selectedDate = new Date(year, month, i);

          modal.style.display = "block";
        });
      });
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

  // functions modal
  function modalClose() {
    modal.style.display = "none";
    symbol.value = "";
    amount.value = "";
  }

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
      symbol.value = "";
      amount.value = "";
    }
  });

  // save trades to localstorage
  function saveTrades() {
    localStorage.setItem("trades", JSON.stringify(trades));
  }

  function addTrade() {
    const symbol = document.querySelector("#symbol").value.trim();
    const amountStr = document.querySelector("#amount").value.trim();

    const amount = parseFloat(amountStr);

    if (!symbol || !amountStr) {
      alert("Fill in all fields");
      return;
    }

    const day = selectedDate.getDate();
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    const dateKeys = `${year}-${month}-${day}`;

    if (!trades[dateKeys]) {
      trades[dateKeys] = [];
    }

    trades[dateKeys].push({
      symbol: symbol,
      amount: amount,
      timeStamp: new Date().toISOString(),
    });

    saveTrades();
    modalClose();
    renderCalendar(currentMonth, currentYear);
  }
  closeModal.addEventListener("click", modalClose);

  document.querySelector("#add-trade").addEventListener("click", addTrade);
});
