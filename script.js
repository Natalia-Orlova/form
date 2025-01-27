"use strict";

function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginTab').classList.add('active');
    document.getElementById('registerTab').classList.remove('active');
}

function showRegisterForm() {
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerTab').classList.add('active');
    document.getElementById('loginTab').classList.remove('active');
}

function formatPhoneNumber(inputElement) {
    // Убираем все символы, кроме цифр
    let input = inputElement.value.replace(/\D/g, '');

    if (input.startsWith('9')) {
        input = '7' + input;
    }
    // Проверяем, что номер начинается с 7 или 8
    if (input.startsWith('7') || input.startsWith('8')) {
        // Заменяем первую цифру на 7, если это 8
        if (input.startsWith('8')) {
            input = '7' + input.slice(1);
        }
        let formatted = '+7 '; // Начало: +7
        if (input.length > 1) {
            formatted += '(' + input.slice(1, 4);
        }
        if (input.length > 4) {
            formatted += ') ' + input.slice(4, 7);
        }
        if (input.length > 7) {
            formatted += '-' + input.slice(7, 9);
        }
        if (input.length > 9) {
            formatted += '-' + input.slice(9, 11);
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
        .replace(/[^A-Za-zА-Яа-я\s-]/g, '') // Оставляем только буквы, пробелы и тире
        .replace(/(\s)\s+/g, '$1') // Убираем лишние пробелы, оставляя только один
        .replace(/(\-)\-+/g, '$1'); // Убираем лишние тире, оставляя только одно

    if (newValue.startsWith(' ')) {
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

function checkPasswordMatch() {
    const passwordInput = document.getElementById('regPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordMatch = document.getElementById('password-match');
  
    if (passwordInput.value === confirmPasswordInput.value && passwordInput.value !== '') {
      passwordMatch.textContent = 'Пароли совпадают';
      passwordMatch.style.color = 'green';
      passwordMatch.style.display = 'block';
    } else {
      passwordMatch.textContent = 'Пароли не совпадают';
      passwordMatch.style.color = 'red';
      passwordMatch.style.display = 'block';
    }
    // Если поля пустые, скрываем текст
    if (passwordInput.value === '' && confirmPasswordInput.value === '') {
      passwordMatch.style.display = 'none';
    }
  }

document.getElementById('register').addEventListener('submit', function(event) {
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Пароли не совпадают!');
        event.preventDefault();
    }
});