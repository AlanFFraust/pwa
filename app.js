
import valoresPredeterminados from './valores';

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js", { scope: "./" });
}

function realizarConversion() {
  var amount = parseFloat(document.getElementById("amount").value);
  var fromCurrency = document.getElementById("from").value;
  var toCurrency = document.getElementById("to").value;

  convertirMoneda(amount, fromCurrency, toCurrency);
}

navigator.serviceWorker.addEventListener("message", (event) => {
  if (event.data && event.data.type === "conversionResult") {
    const result = event.data.result;

    // Mostrar el resultado
    document.getElementById("result").innerHTML =
      "Resultado: " + result + " " + document.getElementById("to").value;
  }
});

function convertirMoneda(amount, fromCurrency, toCurrency) {
  sendMessageToServiceWorker({
    type: "convert",
    amount: amount,
    fromCurrency: fromCurrency,
    toCurrency: toCurrency,
  });
}

// Función para enviar mensajes al Service Worker
function sendMessageToServiceWorker(message) {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  } else {
    console.error("Service Worker controller no disponible");
    const value = obtenerValoresPredeterminados(message.amount, message.fromCurrency, message.toCurrency);
    document.getElementById("result").innerHTML =
      "Resultado: " + value + " " + message.toCurrency;
  }
}

function obtenerValoresPredeterminados(amount, fromCurrency, toCurrency) {
  data = {
    conversion_rates: valoresPredeterminados[fromCurrency]
  };
  const rate = data.conversion_rates[toCurrency];
  return amount * rate;

}

