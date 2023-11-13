function convertir() {
    var amount = parseFloat(document.getElementById("amount").value);
    var fromCurrency = document.getElementById("from").value;
    var toCurrency = document.getElementById("to").value;

    var rate =
      fromCurrency === "peso" && toCurrency === "dolar" ? 0.049 : 20.41; // Tasa de cambio ficticia

    var result = amount * rate;

    document.getElementById("result").innerHTML =
      "Resultado: " + result.toFixed(2) + " " + toCurrency;
  }