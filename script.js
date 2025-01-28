"use strict";

function showLoginForm() {
  changePage("registerForm", "loginForm");
  document.getElementById("loginTab").classList.add("active");
  document.getElementById("registerTab").classList.remove("active");
}

function showRegisterForm() {
  changePage("loginForm", "registerForm");
  document.getElementById("registerTab").classList.add("active");
  document.getElementById("loginTab").classList.remove("active");
}

function formatPhoneNumber(inputElement) {
  // Убираем все символы, кроме цифр
  let input = inputElement.value.replace(/\D/g, "");

  if (input.startsWith("9")) {
    input = "7" + input;
  }
  // Проверяем, что номер начинается с 7 или 8
  if (input.startsWith("7") || input.startsWith("8")) {
    // Заменяем первую цифру на 7, если это 8
    if (input.startsWith("8")) {
      input = "7" + input.slice(1);
    }
    let formatted = "+7 "; // Начало: +7
    if (input.length > 1) {
      formatted += "(" + input.slice(1, 4);
    }
    if (input.length > 4) {
      formatted += ") " + input.slice(4, 7);
    }
    if (input.length > 7) {
      formatted += "-" + input.slice(7, 9);
    }
    if (input.length > 9) {
      formatted += "-" + input.slice(9, 11);
    }
    inputElement.value = formatted;
  } else {
    // Если номер не начинается с 7,8 или 9, оставляем только цифры
    inputElement.value = input;
  }
}

function restrictInput(inputElement) {
  const cursorPosition = inputElement.selectionStart;

  let newValue = inputElement.value
    .replace(/[^A-Za-zА-Яа-я\s-]/g, "") // Оставляем только буквы, пробелы и тире
    .replace(/(\s)\s+/g, "$1") // Убираем лишние пробелы, оставляя только один
    .replace(/(\-)\-+/g, "$1"); // Убираем лишние тире, оставляя только одно

  if (newValue.startsWith(" ")) {
    newValue = newValue.trimStart(); // Убираем пробелы в начале
  }

  if (inputElement.value !== newValue) {
    inputElement.value = newValue;
    inputElement.setSelectionRange(cursorPosition, cursorPosition);
  }
}

function handleBlur(inputElement) {
  inputElement.value = inputElement.value.trimEnd(); // Убираем пробелы в конце
}

function formatDateInput(input) {
  // Убираем все символы, кроме цифр
  let value = input.value.replace(/\D/g, "");

  // Добавляем дефисы после первых двух и следующих двух цифр
  if (value.length > 2) {
    value = value.slice(0, 2) + "-" + value.slice(2);
  }
  if (value.length > 5) {
    value = value.slice(0, 5) + "-" + value.slice(5);
  }

  // Обрезаем значение, если оно превышает допустимую длину (10 символов)
  if (value.length > 10) {
    value = value.slice(0, 10);
  }

  // Обновляем значение в поле ввода
  input.value = value;

  // Проверяем валидность даты
  const isValid = validateDate(value);
  if (isValid) {
    input.style.borderColor = ""; // Сбрасываем подсветку, если дата валидна
  } else {
    input.style.borderColor = "red"; // Подсвечиваем поле красным, если дата невалидна
  }
}

function validateDate(dateString) {
  // Проверяем, что строка соответствует формату дд-мм-гггг
  if (!/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
    return false;
  }
  // Разбиваем строку на день, месяц и год
  const [day, month, year] = dateString.split("-").map(Number);
  // Проверяем, что день и месяц находятся в допустимых диапазонах
  if (day < 1 || day > 31 || month < 1 || month > 12) {
    return false;
  }
  // Проверяем, что год не в будущем и не слишком старый
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) {
    return false;
  }

  // Проверяем, что дата существует в календаре
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

// Ограничение ввода только цифрами
//   document.getElementById('s-dob').addEventListener('keydown', function (e) {
//     if (
//       e.key === 'Backspace' ||
//       e.key === 'Delete' ||
//       e.key === 'Tab' ||
//       e.key === 'ArrowLeft' ||
//       e.key === 'ArrowRight'
//     ) {
//       return;
//     }
//     if (/\D/.test(e.key)) {
//       e.preventDefault();
//     }
//   });

function checkPasswordMatch() {
  const passwordInput = document.getElementById("regPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const passwordMatch = document.getElementById("password-match");

  if (
    passwordInput.value === confirmPasswordInput.value &&
    passwordInput.value !== ""
  ) {
    passwordMatch.textContent = "Пароли совпадают";
    passwordMatch.style.color = "green";
    passwordMatch.style.display = "block";
  } else {
    passwordMatch.textContent = "Пароли не совпадают";
    passwordMatch.style.color = "red";
    passwordMatch.style.display = "block";
  }
  // Если поля пустые, скрываем текст
  if (passwordInput.value === "" && confirmPasswordInput.value === "") {
    passwordMatch.style.display = "none";
  }
}

async function handleRegistration(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const password = formData.get("regPassword");
  const confirmPassword = formData.get("confirmPassword");

  if (password !== confirmPassword) {
    alert("Пароли не совпадают!");
    return;
  }

  // Хэшируем пароль на клиенте
  const hashedPassword = await hashPassword(password);
  formData.set("regPassword", hashedPassword); // Заменяем пароль на хэш
  formData.delete("confirmPassword");

  formData.forEach((key, value) => {
    console.log(value, key);
  });
  showLoginForm();
  // Отправляем данные на сервер
  // fetch('api/registration', {
  //     method: 'POST',
  //     body: formData
  // })
  // .then(response => response.json())
  // .then(data => {
  //     if (data.success) {
  //         alert('Регистрация прошла успешно!');
  //         event.target.reset();
  //         document.getElementById('registerForm').style.display = 'none';
  //     } else {
  //         alert('Ошибка регистрации: ' + data.message);
  //     }
  // })
  // .catch(error => {
  //     console.error('Ошибка:', error);
  //     alert('Произошла ошибка при отправке данных.');
  // });
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

// Обработка логина
function handleLogin(event) {
  event.preventDefault();
  document.querySelector(".tabs").style.display = "none";
  changePage("loginForm", "participantsSection");
  //   document.getElementById("loginForm").style.display = "none";
  //   document.getElementById("participantsSection").style.display = "block";
}

function handleLogout() {
  // Скрываем раздел с участниками
  document.getElementById("participantsSection").style.display = "none";
  // Показываем вкладки "Вход" и "Регистрация"
  document.querySelector(".tabs").style.display = "block";
  // Показываем форму входа (по умолчанию)
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("registerForm").style.display = "none";
}

let isEditing = false; // Флаг для определения режима редактирования
let editingIndex = null; // Индекс редактируемого участника

// Обработка добавления участника
function handleAddParticipant(event) {
  event.preventDefault();

  let participant = {
    phone: document.getElementById("phone").value,
    lastName: document.getElementById("lastName").value,
    firstName: document.getElementById("firstName").value,
    middleName: document.getElementById("middleName").value,
    birthDate: document.getElementById("birthDate").value,
    gender: document.getElementById("gender").value,
    passportScan: document.getElementById("passportScan").files[0],
    device: document.getElementById("device").value,
  };

  if (isEditing) {
    participant = {
        phone: document.getElementById("edit-phone").value,
        lastName: document.getElementById("edit-lastName").value,
        firstName: document.getElementById("edit-firstName").value,
        middleName: document.getElementById("edit-middleName").value,
        birthDate: document.getElementById("edit-birthDate").value,
        gender: document.getElementById("edit-gender").value,
        passportScan: document.getElementById("edit-passportScan").files[0],
        device: document.getElementById("edit-device").value,
      };
    // Режим редактирования: обновляем существующего участника
    updateParticipantInList(editingIndex, participant);
    isEditing = false; // Сбрасываем флаг редактирования
    editingIndex = null; // Сбрасываем индекс
    changePage("participantInfo", "participantsSection");
  } else {
    // Режим добавления: добавляем нового участника
    addParticipantToList(participant);
  }
  const formData = new FormData(event.target);
  formData.forEach((value, key) => {
    console.log(key, value);
  });

  //   event.target.reset(); // потом убрать, эта строка будет после положительного ответа с сервера
  //   document.querySelector(".file-name-text").textContent = "Файл не выбран";
  changePage("addParticipantForm", "participantsSection");

  //   fetch("/api/addUser.php", {
  //     method: "POST",
  //     body: formData,
  //   })
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log("Данные отправлены на сервер:", data);
  //       event.target.reset();
  //       // После отправки формы открыть страницу
  //       document.getElementById('addParticipantForm').style.display = 'none';
  //       document.getElementById('participantsSection').style.display = 'block';
  //     })
  //     .catch((error) => {
  //       console.error("Ошибка:", error);
  //     });
}

function updateFileName(event, nameId) {
  const fileNameText = document.getElementById(nameId);
  const file = event.target.files[0];

  if (file) {
    fileNameText.textContent = file.name;
  } else {
    fileNameText.textContent = "Файл не выбран"; // Сбрасываем текст, если файл не выбран
  }
}

// Добавление/редактирование участника
function addParticipantToList(participant) {
    const participantItem = document.createElement("li");
    participantItem.textContent = `${participant.lastName} ${participant.firstName} ${participant.middleName}`;
  
    // Передаем индекс участника при клике
    participantItem.addEventListener("click", () => {
      const participantsList = document.getElementById("participantsList");
      const index = Array.from(participantsList.children).indexOf(participantItem);
      showParticipantInfo(participant, index);
    });
  
    document.getElementById("participantsList").appendChild(participantItem);
  }

  function updateParticipantInList(index, updatedParticipant) {
    const participantsList = document.getElementById("participantsList");
  
    if (index >= 0 && index < participantsList.children.length) {
      const participantItem = participantsList.children[index];
  
      // Проверка данных перед обновлением
      console.log("Данные перед обновлением textContent:", updatedParticipant);
  
      // Обновляем текст элемента списка
      participantItem.textContent = `${updatedParticipant.lastName} ${updatedParticipant.firstName} ${updatedParticipant.middleName}`;
  
      // Проверка данных перед добавлением обработчика
      console.log("Данные перед добавлением обработчика:", updatedParticipant);
  
      // Обновляем обработчик события для отображения информации
      participantItem.addEventListener("click", () =>
        showParticipantInfo(updatedParticipant, index)
      );
    } else {
      console.error("Элемент списка не найден по индексу:", index);
    }
  }

/**
 * ограничения для ввода номера устройства
 */
function formatDeviceInput(input) {
  const value = input.value.toUpperCase();
  const cleanedValue = value.replace(/[^A-Z0-9]/g, "");
  // Проверяем длину и формат
  if (cleanedValue.length <= 2) {
    // Первые два символа должны быть буквами
    input.value = cleanedValue.replace(/[^A-Z]/g, "");
  } else {
    // После двух букв должны идти цифры, но не более 5
    const letters = cleanedValue.slice(0, 2).replace(/[^A-Z]/g, "");
    const numbers = cleanedValue.slice(2).replace(/\D/g, "").slice(0, 5);
    input.value = letters + numbers;
  }
}

// Показать информацию о участнике
function showParticipantInfo(participant, index) {
    // Устанавливаем флаг редактирования и индекс
    isEditing = true;
    editingIndex = index;
  
    // Заполняем форму данными участника
    document.getElementById("edit-phone").value = participant.phone;
    document.getElementById("edit-lastName").value = participant.lastName;
    document.getElementById("edit-firstName").value = participant.firstName;
    document.getElementById("edit-middleName").value = participant.middleName || "";
    document.getElementById("edit-birthDate").value = participant.birthDate;
    document.getElementById("edit-gender").value = participant.gender;
    document.getElementById("edit-device").value = participant.device;
  
    // Обновляем текст для файла
    const fileNameText = document.getElementById("edit-file-name-text");
    fileNameText.textContent = participant.passportScan ? participant.passportScan.name : "Файл не выбран";
  
    // Показываем форму
    changePage("participantsSection", "participantInfo");
  }

function changePage(closeId, openId) {
  document.getElementById(openId).style.display = "block";
  document.getElementById(closeId).style.display = "none";
}
