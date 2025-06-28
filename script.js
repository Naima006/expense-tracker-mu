$(document).ready(function () {
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  function updateValues() {
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
    const income = amounts.filter(val => val > 0).reduce((acc, val) => acc + val, 0).toFixed(2);
    const expense = (
      amounts.filter(val => val < 0).reduce((acc, val) => acc + val, 0) * -1
    ).toFixed(2);

    $("#balance").text(`$${total}`);
    $("#money-plus").text(`+$${income}`);
    $("#money-minus").text(`-$${expense}`);
  }

  function getSelectedTransactionType() {
    return $("input[name='transactionType']:checked").val() || "expense";
  }

  function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const typeClass = transaction.amount < 0 ? "minus" : "plus";

    const $li = $(`
      <li class="${typeClass}">
        <div>
          <strong>${transaction.text}</strong> <span class="category">(${transaction.category})</span>
        </div>
        <span>${sign}$${Math.abs(transaction.amount)}</span>
        <button class="delete-btn">x</button>
      </li>
    `);

    $li.find(".delete-btn").click(() => {
      removeTransaction(transaction.id);
    });

    $("#list").append($li);
  }

  function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    init();
  }

  function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }

  function init() {
    $("#list").empty();
    transactions.forEach(addTransactionDOM);
    updateValues();
  }

  $("#form").submit(function (e) {
    e.preventDefault();

    const text = $("#text").val().trim();
    const amountVal = $("#amount").val().trim();
    const category = $("#category").val().trim();

    if (!text || !amountVal || !category) {
      alert("Please enter text, amount, and category");
      return;
    }

    let amount = Math.abs(+amountVal);
    const type = getSelectedTransactionType();
    if (type === "expense") amount = -amount;

    const transaction = {
      id: Date.now(),
      text,
      amount,
      category,
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    // Clear form
    $("#text").val("");
    $("#amount").val("");
    $("#category").val("");
  });

  init();
});
