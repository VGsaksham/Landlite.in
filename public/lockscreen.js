document.addEventListener('DOMContentLoaded', function() {
  // Create overlay elements
  const overlay = document.createElement('div');
  overlay.id = 'dev-overlay';
  
  const modal = document.createElement('div');
  modal.id = 'password-modal';
  
  const heading = document.createElement('h2');
  heading.textContent = 'Website Under Development';
  
  const message = document.createElement('p');
  message.textContent = 'This site is currently under development. Please enter the password to access.';
  
  const form = document.createElement('div');
  form.className = 'password-form';
  
  const input = document.createElement('input');
  input.type = 'password';
  input.placeholder = 'Enter password';
  input.id = 'access-password';
  
  const button = document.createElement('button');
  button.textContent = 'Submit';
  button.onclick = checkPassword;
  
  const wrongPass = document.createElement('p');
  wrongPass.id = 'wrong-password';
  wrongPass.textContent = 'Incorrect password';
  wrongPass.style.display = 'none';
  wrongPass.style.color = 'red';
  
  // Append elements
  form.appendChild(input);
  form.appendChild(button);
  form.appendChild(wrongPass);
  
  modal.appendChild(heading);
  modal.appendChild(message);
  modal.appendChild(form);
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Check if user has already entered correct password in this session
  const hasAccess = sessionStorage.getItem('landliteAccess');
  if (hasAccess === 'granted') {
    removeOverlay();
  }
  
  // Focus on the password input
  input.focus();
});

function checkPassword() {
  const password = document.getElementById('access-password').value;
  const correctPassword = 'saksham_landlite';
  
  if (password === correctPassword) {
    // Store access in session storage
    sessionStorage.setItem('landliteAccess', 'granted');
    removeOverlay();
  } else {
    document.getElementById('wrong-password').style.display = 'block';
  }
}

function removeOverlay() {
  const overlay = document.getElementById('dev-overlay');
  overlay.style.opacity = 0;
  setTimeout(() => {
    overlay.remove();
  }, 500);
} 