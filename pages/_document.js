import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
          {/* Critical CSS for mobile navigation */}
          <style dangerouslySetInnerHTML={{ __html: `
            .mobile-menu {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              width: 100% !important;
              height: 100% !important;
              background-color: rgba(0, 0, 0, 0.85) !important;
              z-index: 1900 !important;
              visibility: hidden !important;
              opacity: 0 !important;
              transition: opacity 0.3s ease, visibility 0.3s ease !important;
              display: flex !important;
              flex-direction: column !important;
            }
            
            .mobile-menu.active {
              visibility: visible !important;
              opacity: 1 !important;
            }
            
            .hamburger {
              position: fixed !important;
              z-index: 2000 !important;
              display: none !important;
            }
            
            @media (max-width: 768px) {
              .hamburger {
                display: flex !important;
              }
            }
            
            body.mobile-menu-open {
              overflow: hidden !important;
              position: fixed !important;
              width: 100% !important;
            }

            /* Development Overlay Styles */
            #dev-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.7);
              backdrop-filter: blur(8px);
              z-index: 9999;
              display: flex;
              justify-content: center;
              align-items: center;
              transition: opacity 0.5s ease;
            }
            
            #password-modal {
              background-color: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
              width: 90%;
              max-width: 400px;
              text-align: center;
            }
            
            #password-modal h2 {
              color: #333;
              margin-top: 0;
              margin-bottom: 15px;
            }
            
            #password-modal p {
              color: #666;
              margin-bottom: 20px;
            }
            
            .password-form {
              display: flex;
              flex-direction: column;
              gap: 10px;
            }
            
            #access-password {
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 4px;
              font-size: 16px;
            }
            
            .password-form button {
              padding: 10px;
              background-color: #4a90e2;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 16px;
              transition: background-color 0.3s ease;
            }
            
            .password-form button:hover {
              background-color: #357ab8;
            }
            
            #wrong-password {
              margin-top: 10px;
              font-size: 14px;
              color: red;
            }
          `}} />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script dangerouslySetInnerHTML={{ __html: `
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
              
              // Enter key functionality
              input.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                  checkPassword();
                }
              });
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
          `}} />
        </body>
      </Html>
    );
  }
}

export default MyDocument; 