document.getElementById('changePlayerButton').addEventListener('click', changePlayer);

function changePlayer() {
  const playerNameInput = document.getElementById('playerNameInput').value;
  const playerNumberInput = document.getElementById('playerNumberInput').value;

  if (!playerNameInput || !playerNumberInput) {
    showAlert('Введите ник и номер игрока', 'alert-danger');
    return;
  }

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
    showAlert(data.message, 'alert-success');
  })
  .catch(error => {
    showAlert('Ошибка изменения игрока', 'alert-danger');
    console.error('Error changing player:', error);
  });
}

function showAlert(message, alertClass) {
  const notificationsDiv = document.getElementById('notifications');

  const alertDiv = document.createElement('div');
  alertDiv.classList.add('alert', alertClass, 'alert-dismissible', 'fade', 'show');
  alertDiv.setAttribute('role', 'alert');
  
  const icon = document.createElement('i');
  icon.classList.add('fa', 'fa-exclamation-circle', 'me-2');
  alertDiv.appendChild(icon);
  
  alertDiv.appendChild(document.createTextNode(message));
  
  const closeButton = document.createElement('button');
  closeButton.setAttribute('type', 'button');
  closeButton.classList.add('btn-close');
  closeButton.setAttribute('data-bs-dismiss', 'alert');
  closeButton.setAttribute('aria-label', 'Close');
  alertDiv.appendChild(closeButton);

  notificationsDiv.appendChild(alertDiv);

  // Закрыть уведомление через 3 секунды
  setTimeout(function() {
    alertDiv.classList.remove('show');
    alertDiv.classList.add('fade');
    setTimeout(function() {
      alertDiv.remove();
    }, 1000); // Продолжаем анимацию fade перед удалением
  }, 3000);
}


document.getElementById('goButton').addEventListener('click', function() {
    const X = document.getElementById('X').value;
    const Y = document.getElementById('Y').value;
    const Z = document.getElementById('Z').value;

    // Проверка на пустые поля координат
    if (X.trim() === '' || Y.trim() === '' || Z.trim() === '') {
        showAlert('Бот без координат не поедет', 'alert-warning');
        return;
    }

    // Отправляем данные на сервер
    fetch('/go', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ X, Y, Z }),
    })
    .then(response => response.json())
    .then(data => {
        // После успешного ответа от сервера, вызываем showAlert с сообщением
        showAlert(data.message, 'alert-success');
    })
    .catch(error => {
        // В случае ошибки, вызываем showAlert с сообщением об ошибке
        showAlert('Ошибка при отправке координат', 'alert-danger');
        console.error('Error:', error);
    });
});

document.getElementById('stopButton').addEventListener('click', function() {
    // Отправляем запрос на сервер для остановки бота
    fetch('/stop', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        // После успешного ответа от сервера, вызываем showAlert с сообщением
        showAlert(data.message, 'alert-warning');
    })
    .catch(error => {
        // В случае ошибки, вызываем showAlert с сообщением об ошибке
        showAlert('Ошибка при отправке запроса на остановку', 'alert-danger');
        console.error('Error:', error);
    });
});


document.getElementById('GotoPlayerButton').addEventListener('click', function() {
    const playerToFollow = document.getElementById('GotoPlayer').value;

    // Проверка на пустое поле имени игрока
    if (playerToFollow.trim() === '') {
        showAlert('Введите имя игрока', 'alert-warning');
        return;
    }

    // Отправляем данные на сервер
    fetch('/goto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerToFollow }),
    })
    .then(response => response.json())
    .then(data => {
        // После успешного ответа от сервера, вызываем showAlert с сообщением
        showAlert(data.message, 'alert-success');
    })
    .catch(error => {
        // В случае ошибки, вызываем showAlert с сообщением об ошибке
        showAlert('Ошибка при отправке запроса на следование за игроком', 'alert-danger');
        console.error('Error:', error);
    });
});


document.getElementById('stopButton2').addEventListener('click', function() {
    // Отправляем запрос на сервер для остановки бота
    fetch('/stopgoto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        // После успешного ответа от сервера, вызываем showAlert с сообщением
        showAlert(data.message, 'alert-warning');
    })
    .catch(error => {
        // В случае ошибки, вызываем showAlert с сообщением об ошибке
        showAlert('Ошибка при отправке запроса на остановку', 'alert-danger');
        console.error('Error:', error);
    });
});


document.getElementById('startAttack').addEventListener('click', function() {
    const playerName = document.getElementById('NamePlayerAttack').value;

    // Проверка, что введено имя игрока
    if (!playerName) {
        showAlert('Введите имя игрока', 'alert-danger');
        return;
    }

    // Отправляем запрос на сервер для начала атаки на игрока
    fetch('/attack', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetPlayer: playerName }),
    })
    .then(response => response.json())
    .then(data => {
        showAlert(data.message, 'alert-success');
    })
    .catch(error => {
        showAlert('Ошибка при отправке запроса на атаку игрока', 'alert-danger');
        console.error('Error:', error);
    });
});

document.getElementById('stopAttack').addEventListener('click', function() {
    // Отправляем запрос на сервер для остановки атаки
    fetch('/stopAttack', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        showAlert(data.message, 'alert-success');
    })
    .catch(error => {
        showAlert('Ошибка при отправке запроса на остановку атаки', 'alert-danger');
        console.error('Error:', error);
    });
});
