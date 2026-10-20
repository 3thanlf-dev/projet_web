document.addEventListener('DOMContentLoaded', () => {
    const navbarContainer = document.getElementById('navbar-container');

    if (!navbarContainer) {
        return;
    }

    navbarContainer.innerHTML = `
        <nav>
            <ul>
                <li><a href="index.html">accueil</a></li>
                <li><a href="apprendre.html">apprendre</a></li>
                <li><a href="jeu.html">jeu</a></li>
                <li><a href="statistique.html">statistique</a></li>
            </ul>
        </nav>
    `;
});