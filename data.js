document.addEventListener("DOMContentLoaded", () => {
  const day = document.querySelectorAll(".day");
  const modal = document.querySelector("#MyModal");
  const closeModal = document.querySelector("#close-modal");

  day.forEach((item) => {
    item.addEventListener("click", () => {
      modal.style.display = "block";
    });
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });











  
});
