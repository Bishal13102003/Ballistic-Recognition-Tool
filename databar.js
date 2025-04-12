document.getElementById('ballisticForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent page reload
  
    const bullet_type = document.getElementById('bullet_type').value;
    const caliber = document.getElementById('caliber').value;
    const velocity = document.getElementById('velocity').value;
  
    const formData = new FormData();
    formData.append('bullet_type', bullet_type);
    formData.append('caliber', caliber);
    formData.append('velocity', velocity);
  
    fetch('databar.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.text())
    .then(data => {
      document.getElementById('statusMsg').innerText = data;
      document.getElementById('ballisticForm').reset(); // Clear form
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('statusMsg').innerText = '❌ Submission failed.';
    });
  });
  