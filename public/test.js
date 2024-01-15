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
