document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const changeColorButton = document.createElement('button');
    changeColorButton.textContent = 'Cambiar Color';
    app.appendChild(changeColorButton);

    changeColorButton.addEventListener('click', () => {
        const randomColor = getRandomColor();
        app.style.backgroundColor = randomColor;
    });

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
});
