console.log('Client.js is loaded');

document.getElementById('startButton').addEventListener('click', startBot);
document.getElementById('stopButton').addEventListener('click', stopBot);
document.getElementById('changePlayerButton').addEventListener('click', changePlayer);
document.getElementById('command').addEventListener('keyup', handleCommandInput); // Добавим обработчик для события нажатия клавиши
const socket = io();



function handleCommandInput(event) {
  if (event.key === 'Enter') {
    const commandInput = document.getElementById('command');
    const command = commandInput.value.trim();
    
    if (command !== '') {
      // Отправляем введенную команду в бота
      sendMessageToBot(command);
      commandInput.value = ''; // Очищаем поле ввода после отправки команды
    }
  }
}

// Проверяем наличие инициализации бота при загрузке страницы

// Функция для отправки сообщения чата боту
function sendMessageToBot(message) {
  console.log(message);
  fetch('/sendMessageToBot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })
    .then(response => response.json())
    .then(data => {
      if (!data.success) {
        console.log(data.message);
      }
    })
    .catch(error => console.error('Error sending message to bot:', error));
  
}

google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);
// Функция для обновления количества онлайн-игроков
function updateOnlinePlayers() {
  fetch('/data')
    .then(response => response.json())
    .then(data => {
      // Обновление количества онлайн-игроков или выполнение других действий с данными
      const onlinePlayersCountElement = document.getElementById('onlinePlayersCount');
      if (onlinePlayersCountElement) {
        onlinePlayersCountElement.innerText = data.length - 1; // Вычитаем 1, чтобы исключить заголовок
      }
    })
    .catch(error => console.error('Ошибка получения данных:', error));
}

// Chart Global Color
Chart.defaults.color = "#6C7293";
Chart.defaults.borderColor = "#000000";

function drawChart() {
  fetch('/data')
    .then(response => response.json())
    .then(data => {
      const labels = data.map(entry => entry[0]); // Assuming time is in the first column
      const values = data.map(entry => entry[1]); // Assuming player count is in the second column

      var ctx = document.getElementById('ggg').getContext('2d');
      var chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Количество игроков',
            fill: false,
            backgroundColor: 'rgba(235, 22, 22, 0.7)',
            borderColor: 'rgba(0, 0, 0, 1)',
            data: values
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Время'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Игроки'
              }
            }
          }
        }
      });

      // Запуск первого обновления и установка интервала на каждые 10 секунд
      updateOnlinePlayers(); // Запускаем первый раз сразу
      setInterval(updateOnlinePlayers, 10000); // Устанавливаем интервал обновления каждые 10 секунд
    })
    .catch(error => console.error('Ошибка получения данных:', error));
}



function changePlayer() {
  const playerNameInput = document.getElementById('playerNameInput').value;
  const playerNumberInput = document.getElementById('playerNumberInput').value;

  if (!playerNameInput || !playerNumberInput) {
    alert('Введите ник и номер игрока');
    return;
  }

  console.log('Sending payload:', { playerName: playerNameInput, playerNumber: parseInt(playerNumberInput, 10) });

  const payload = {
    playerName: playerNameInput,
    playerNumber: parseInt(playerNumberInput, 10)
  };

  fetch('/changePlayer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
  })
  .catch(error => {
    console.error('Error changing player:', error);
  });
}


socket.on('chatMessage', (message) => {
  displayMessage(message);
});

async function displayMessage(message) {
  var messageElement = document.createElement('p');
  messageElement.textContent = getCurrentTime() + ' ' + message;

  var consoleBlock = document.getElementById('console_block');
  var consoleOutput = consoleBlock.querySelector('.console_box');
  consoleOutput.appendChild(messageElement);
}

// Функция для получения текущего времени в формате HH:mm:ss
function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

socket.on('botStarted', () => {
  // Обновление количества игроков онлайн
  printOnlinePlayers();

  // Устанавливаем интервал для обновления каждые 10 секунд
  setInterval(() => {
    printOnlinePlayers();
  }, 1000);
});



function startBot() {
  // Удаляем предыдущий обработчик, чтобы избежать повторного назначения
  document.getElementById('startButton').removeEventListener('click', startBot);

  fetch('/startBot')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to start bot: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      displayMessage(data.message);
    })
    .catch(error => {
      console.error('Error starting bot:', error.message);
    })
    .finally(() => {
      // После завершения запроса, снова назначаем обработчик
      document.getElementById('startButton').addEventListener('click', startBot);
    });
}

function stopBot() {
  // Удаляем предыдущий обработчик, чтобы избежать повторного назначения
  document.getElementById('stopButton').removeEventListener('click', stopBot);

  fetch('/stopBot')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to stop bot: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      displayMessage(data.message);
    })
    .catch(error => {
      console.error('Error stopping bot:', error.message);
    })
    .finally(() => {
      // После завершения запроса, снова назначаем обработчик
      document.getElementById('stopButton').addEventListener('click', stopBot);
    });
}
function printOnlinePlayers() {
  // Отправляем запрос на сервер для получения информации об онлайн-игроках
  fetch('/onlinePlayers')
    .then(response => response.json())
    .then(data => {
      const onlinePlayersCount = data.count;
      document.getElementById('onlinePlayersCount').textContent = onlinePlayersCount;
    })
    .catch(error => {
      console.error('Error fetching online players:', error);
    });
}
