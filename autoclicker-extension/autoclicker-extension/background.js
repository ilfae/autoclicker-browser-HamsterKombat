// background.js 

let autoClickActive = false; 

// Слушатель сообщений
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleAutoClick') {
    autoClickActive = !autoClickActive;

    // Получаем активную вкладку
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Проверяем, что вкладка соответствует TWA Hamster Kombat
      if (tabs[0].url.includes('hamsterkombat.io')) {
        // Внедряем toggleAutoClicker 
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: toggleAutoClicker,
          args: [autoClickActive] 
        });
      }
    });
  } 
});

// Функция, которая будет внедрена на страницу игры
function toggleAutoClicker(isActive) { 
  let count = 0;
  const consoleYellow = 'font-weight: bold; color: yellow;';
  const consoleRed = 'font-weight: bold; color: red;';
  const consoleGreen = 'font-weight: bold; color: green;';
  const consolePrefix = '%c [AutoClicker] ';

  async function click() {
    if (!isActive) return;  // Проверяем isActive в начале click()
    try {
      const element = document.querySelector('button.user-tap-button'); 
      if (element) {
        const pointerUpEvent = new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerType: 'mouse'
        });
        element.dispatchEvent(pointerUpEvent);
        count++;
        const balance = document.querySelector('#__nuxt > div > main > div > div.user-balance-large > div > p').textContent;
        console.log(`${consolePrefix}Success clicked (${count})`, consoleGreen);
        console.log(`${consolePrefix}Balance: ${balance}`, consoleYellow);
      } else {
        console.log(`${consolePrefix}Button not found. Retrying...`, consoleRed);
      }
      // Задержка  147.7 мс и 251.2 мс
      setTimeout(click, Math.random() * (91.2 - 27.7) + 27.7); 
    } catch (e) {
      console.log(`${consolePrefix}Deactivated`, consoleRed);
      
      // Отправляем сообщение обратно в расширение для обновления кнопки
      chrome.runtime.sendMessage({ action: 'updateButton', isActive: false });  
    }
  }

  // Встраиваем waitForElement прямо в toggleAutoClicker
  function waitForElement(selector, callback) {
    if (document.querySelector(selector)) {
      callback();
    } else {
      setTimeout(() => waitForElement(selector, callback), 100);
    }
  }  

  if (isActive) {
    waitForElement('button.user-tap-button', click); 
  }
}
