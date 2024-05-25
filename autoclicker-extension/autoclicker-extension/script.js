document.getElementById('toggleButton').addEventListener('click', () => {
  // Отправляем сообщение в background.js
  chrome.runtime.sendMessage({ action: 'toggleAutoClick' }); 

  // Меняем текст кнопки
  const button = document.getElementById('toggleButton');
  button.innerText = button.innerText === 'Вкл' ? 'Выкл' : 'Вкл'; 
});

// Слушатель сообщений от background.js
chrome.runtime.onMessage.addListener(request => {
  if (request.action === 'updateButton') {
    // Обновляем кнопку
    document.getElementById('toggleButton').innerText = request.isActive ? 'Выкл' : 'Вкл';
  }
});
