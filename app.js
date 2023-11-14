// Llamar a esta función cuando quieras realizar la conversión
function convertirMoneda(amount, fromCurrency, toCurrency) {
  navigator.serviceWorker.controller.postMessage({
      type: 'convert',
      amount: amount,
      fromCurrency: fromCurrency,
      toCurrency: toCurrency
  });
}

// Escuchar el resultado de la conversión desde el Service Worker
navigator.serviceWorker.addEventListener('message', event => {
  if (event.data && event.data.type === 'conversionResult') {
      const result = event.data.result;
      // Hacer algo con el resultado, como mostrarlo en la interfaz de usuario
      console.log('Resultado de la conversión:', result);
  }
});
