const ipcRenderer = require('electron').ipcRenderer;
let elMessage = {};

// Start on page load finish
window.addEventListener('load', () => {
  elMessage = document.getElementById('logoutput');

  // Event listener for messages
  ipcRenderer.on('ipc-to-renderer', (e, message) => {
    message.forEach((line) => {
      elMessage.innerHTML += `${line}</br>`;
    });    
  });

  ipcRenderer.send('ipc-to-main');
});
