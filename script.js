let hasClickedNext = false;
let coordinates = {};

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const messageElement = document.getElementById('message');
    const nextButton = document.getElementById('nextButton');
    const goBackButton = document.getElementById('goBackButton');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewImage = document.getElementById('previewImage');
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
            nextButton.classList.remove('hidden');
            goBackButton.classList.add('hidden');
            messageElement.textContent = '';
            hasClickedNext = false;
        }
        reader.readAsDataURL(file);
    } else {
        messageElement.textContent = 'No file selected.';
        messageElement.style.color = 'red';
    }
});

document.getElementById('nextButton').addEventListener('click', function() {
    const messageElement = document.getElementById('message');
    const nextButton = document.getElementById('nextButton');
    const goBackButton = document.getElementById('goBackButton');
    const previewImage = document.getElementById('previewImage');

    if (!hasClickedNext) {
        messageElement.textContent = 'Click on the bottom of the pool';
        messageElement.style.color = 'green';
        previewImage.classList.add('clickable');
        nextButton.classList.remove('hidden');
        goBackButton.classList.remove('hidden');
        hasClickedNext = true;
    } else {
        // Post the data to the backend
        if (!coordinates.x || !coordinates.y) {
            messageElement.textContent = 'Please click on the image to select coordinates.';
            messageElement.style.color = 'red';
            return;
        }

        const formData = new FormData();
        const file = document.getElementById('fileInput').files[0];
        formData.append('image', file);
        formData.append('x', coordinates.x);
        formData.append('y', coordinates.y);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            messageElement.textContent = 'Response: ' + data.message;
        })
        .catch(error => {
            messageElement.textContent = 'Error: ' + error.message;
            console.error('Error:', error);
        });

        messageElement.textContent = 'Please wait for response';
    }
});

document.getElementById('goBackButton').addEventListener('click', function() {
    const messageElement = document.getElementById('message');
    const previewImage = document.getElementById('previewImage');
    const nextButton = document.getElementById('nextButton');
    const goBackButton = document.getElementById('goBackButton');
    const coordinatesElement = document.getElementById('coordinates');

    messageElement.textContent = '';
    previewImage.style.display = 'none';
    previewImage.classList.remove('clickable');
    nextButton.classList.add('hidden');
    goBackButton.classList.add('hidden');
    coordinatesElement.textContent = '';
    document.getElementById('fileInput').value = ''; // Reset the file input
    hasClickedNext = false;
});

document.getElementById('previewImage').addEventListener('click', function(event) {
    if (this.classList.contains('clickable')) {
        const rect = this.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const coordinatesElement = document.getElementById('coordinates');
        const messageElement = document.getElementById('message');

        coordinates = { x: x, y: y };
        coordinatesElement.textContent = `Coordinates: (${x}px, ${y}px)`;
        messageElement.textContent = 'Click Next to submit';
        messageElement.style.color = 'green';
    }
});
