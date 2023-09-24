document.addEventListener('DOMContentLoaded', () => {
  const registrationForm = document.getElementById('registration-form');
  const registerButton = document.getElementById('register-button');
  
  const loginForm = document.getElementById('login-form');
  const loginButton = document.getElementById('login-button');

  // Check for WebAuthn support
  if (!window.PublicKeyCredential) {
      alert('WebAuthn is not supported in this browser.');
      return;
  }

  // Register a user
  registerButton.addEventListener('click', async () => {
      const username = document.getElementById('username').value;
      const displayName = document.getElementById('display_name').value;
      
      try {
          const registrationOptions = await fetch('/register', {
              method: 'POST',
              body: JSON.stringify({ username, displayName }),
              headers: { 'Content-Type': 'application/json' },
          }).then(response => response.json());

          const credential = await navigator.credentials.create(registrationOptions);

          await fetch('/verify-registration', {
              method: 'POST',
              body: JSON.stringify(credential),
              headers: { 'Content-Type': 'application/json' },
          });
          
          alert('Registration successful! You can now login.');
      } catch (error) {
          alert('Registration error:', error);
      }
  });

  // Login with WebAuthn
  loginButton.addEventListener('click', async () => {
      const loginUsername = document.getElementById('login_username').value;

      try {
          const loginOptions = await fetch('/login', {
              method: 'POST',
              body: JSON.stringify({ loginUsername }),
              headers: { 'Content-Type': 'application/json' },
          }).then(response => response.json());

          const assertion = await navigator.credentials.get(loginOptions);
          
          await fetch('/verify-login', {
              method: 'POST',
              body: JSON.stringify(assertion),
              headers: { 'Content-Type': 'application/json' },
          });

          alert('Login successful!');
      } catch (error) {
          alert('Login error:', error);
      }
  });
});
