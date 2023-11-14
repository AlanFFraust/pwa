const valoresPredeterminados = {
  MXN: {
    USD: 0.06,
    MXN: 1,
    EUR: 0.05,
    JPY: 8.60,
    GBP: 0.05
  },
  USD: {
    MXN: 16.67,
    USD: 1,
    EUR: 0.85,
    JPY: 114.58,
    GBP: 0.74
  },
  EUR: {
    MXN: 20.00,
    USD: 1.18,
    EUR: 1,
    JPY: 135.29,
    GBP: 0.88
  },
  JPY: {
    MXN: 0.12,
    USD: 0.009,
    EUR: 0.0074,
    JPY: 1,
    GBP: 0.0065
  },
  GBP: {
    MXN: 20.00,
    USD: 1.35,
    EUR: 1.14,
    JPY: 154.00,
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

