
const valoresPredeterminados = {
  MXN: {
      USD: 0.057,
      MXN: 1,
      EUR: 0.053,
      JPY: 8.61,
      GBP: 0.046
  },
  USD: {
      MXN: 17.62,
      USD: 1,
      EUR: 0.93,
      JPY: 151.75,
      GBP: 0.81
  },
  EUR: {
      MXN: 18.84,
      USD: 1.07,
      EUR: 1,
      JPY: 128.79,
      GBP: 0.87
  },
  JPY: {
      MXN: 0.12,
      USD: 0.007,
      EUR: 0.008,
      JPY: 1,
      GBP: 0.005
  },
  GBP: {
      MXN: 21.74,
      USD: 1.23,
      EUR: 1.15,
      JPY: 186.15,
      GBP: 1
  }
};
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

