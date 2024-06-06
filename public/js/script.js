document.querySelectorAll('.image-container img').forEach(image => {
    image.onclick = () => {
        document.querySelector('.pop-image').style.display = 'block';
        document.querySelector('.pop-image img').src = image.getAttribute('src');
    }
});

document.querySelector('.pop-image span').onclick = () => {
    document.querySelector('.pop-image').style.display = 'none';
}

// Add a click event listener to the chatbot icon
document.querySelector('.chatbot-icon').addEventListener('click', function() {
    document.querySelector('.chatbot').classList.toggle('show');
});

// Close the chatbot when clicking outside of it
document.addEventListener('click', function(event) {
    if (!event.target.closest('.chatbot-wrapper')) {
        document.querySelector('.chatbot').classList.remove('show');
    }
});

