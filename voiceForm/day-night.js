const toggleBtn = document.getElementById('toggleBtn');
const body = document.body;

// Check saved mode in localStorage
if (localStorage.getItem('mode') === 'night') {
    body.classList.add('night-mode');
    toggleBtn.textContent = '☀️ Day Mode';
} else {
    body.classList.add('day-mode');
}

// Toggle function
toggleBtn.addEventListener('click', () => {
    if (body.classList.contains('day-mode')) {
        body.classList.replace('day-mode', 'night-mode');
        toggleBtn.textContent = '☀️ Day Mode';
        localStorage.setItem('mode', 'night');
    } else {
        body.classList.replace('night-mode', 'day-mode');
        toggleBtn.textContent = '🌙 Night Mode';
        localStorage.setItem('mode', 'day');
    }
});
