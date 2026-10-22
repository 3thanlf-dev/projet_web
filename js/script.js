    // Objet unique qui sert à charger data/bdd.xml et garde le document XML reçu (xmlhttp.responseXML).
    let xmlhttp = new XMLHttpRequest();

    // Appelée par le bouton "Afficher les questions" (index.html, apprendre.html).
    // Lance le téléchargement de bdd.xml ; quand il est prêt, loadData() est exécutée.
    function loadXMLDoc() {
        xmlhttp.onreadystatechange = loadData;
        xmlhttp.open("GET", "data/bdd.xml", true);
        xmlhttp.send();
    }

    

    // Appelée automatiquement par xmlhttp à chaque changement d'état du téléchargement.
    // Quand le fichier est entièrement reçu (readyState 4, status 200), elle remplit les filtres puis le tableau.
    function loadData() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {  
            loadFilters();
            displayDataTable();
            
        }
    }

    // Appelée par loadData(). Ajoute dans la liste déroulante #thematique (apprendre.html)
    // une option par thématique trouvée dans le XML, sans doublon.
    function loadFilters(){
        const xmlDoc = xmlhttp.responseXML;
            const select = document.getElementById("thematique");
            if (select) {
                const themes = [...new Set([...xmlDoc.getElementsByTagName("thematique")].map(theme => theme.textContent))];
                themes.forEach(theme => select.add(new Option(theme, theme)));
            }
    }

    // Appelée par loadData(). Construit un tableau HTML avec toutes les questions du XML
    // (ID, thème, question, 4 réponses, bonne réponse, points) et l'affiche dans #data.
    function displayDataTable() {
        let i;
        let xmlDoc = xmlhttp.responseXML;    
        let table = "<table><tr><th>ID</th><th>Thème</th><th>Question</th><th>Réponse 1</th><th>Réponse 2</th><th>Réponse 3</th><th>Réponse 4</th><th>Bonne réponse</th><th>Points</th></tr>";    
        let x = xmlDoc.getElementsByTagName("question");
        
        for (i = 0; i < x.length; i++) {        
            table += "<tr>" 
            + "<td>" 
            + x[i].getElementsByTagName("id")[0].textContent 
            + "</td>" 
            + "<td>" 
            + x[i].getElementsByTagName("thematique")[0].textContent 
            + "</td>" 
            + "<td>" 
            + x[i].getElementsByTagName("contenu")[0].textContent 
            + "</td>";

            for (let j = 1; j <= 4; j++) {
                table += "<td>"
                + x[i].getElementsByTagName("r" + j)[0].textContent
                + "</td>";
            }

            table += "<td>"
            + x[i].getElementsByTagName("bonne_reponse")[0].textContent
            + "</td>"
            + "<td>"
            + x[i].getElementsByTagName("point")[0].textContent
            + "</td>" 
            + "</tr>";
        }
        
        document.getElementById("data").innerHTML = table + "</table>";
    }

    // Appelée par le bouton "Filtrer" (apprendre.html). Reconstruit le tableau en ne gardant
    // que les questions de la thématique choisie dans #thematique ("Tout" affiche tout).
    function filterDataTable() {
        
        const xmlDoc = xmlhttp.responseXML;
        const selectedTheme = document.getElementById("thematique")?.value;
        let table = "<tr><th>ID</th><th>Thème</th><th>Question</th><th>Réponse 1</th><th>Réponse 2</th><th>Réponse 3</th><th>Réponse 4</th><th>Bonne réponse</th><th>Points</th></tr>";
        const questions = [...xmlDoc.getElementsByTagName("question")];
        
        for (const question of questions) {
            if (selectedTheme && selectedTheme !== "Tout" && selectedTheme !== question.getElementsByTagName("thematique")[0].textContent) continue;
            table += "<tr>"
            + "<td>"
            + question.getElementsByTagName("id")[0].textContent
            + "</td>"
            + "<td>"
            + question.getElementsByTagName("thematique")[0].textContent
            + "</td>"
            + "<td>"
            + question.getElementsByTagName("contenu")[0].textContent
            + "</td>";

            for (let j = 1; j <= 4; j++) {
                table += "<td>"
                + question.getElementsByTagName("r" + j)[0].textContent
                + "</td>";
            }

            table += "<td>"
            + question.getElementsByTagName("bonne_reponse")[0].textContent
            + "</td>"
            + "<td>"
            + question.getElementsByTagName("point")[0].textContent
            + "</td>" 
            + "</tr>";
        }
        
        document.getElementById("data").innerHTML = table;
    
    }

    /*********************************************************
     * EXO3
     *********************************************************/

    // Exécutée au chargement de index.html (seulement si #lots existe).
    // Crée un bouton "Lot N" par tranche de 10 questions (calculé depuis bdd.xml) et un bouton par thématique,
    // chacun menant à jeu.html avec ?lot=N ou ?theme=...
    document.addEventListener("DOMContentLoaded", () => {
        const lots = document.getElementById("lots");
        if (!lots) return;

        const themes = ["Types", "Évolutions", "Régions et générations", "Pokédex", "Objets et combats", "Dessin animé"];

        fetch("data/bdd.xml").then(r => r.text()).then(xml => {
            const nbLots = Math.ceil((xml.match(/<question>/g) || []).length / 10);
            for (let i = 1; i <= nbLots; i++) {
                lots.innerHTML += `<div class="border rounded p-2 m-1 text-nowrap"><a href="jeu.html?lot=${i}">Lot ${i}</a></div>`;
            }
        });

        themes.forEach(t => {
            document.getElementById("themes").innerHTML += `<div class="border rounded p-2 m-1 text-nowrap"><a href="jeu.html?theme=${encodeURIComponent(t)}">${t}</a></div>`;
        });
    });

    // Exécutée au chargement de jeu.html (seulement si #choix existe).
    // Lit le paramètre ?lot= ou ?theme= de l'URL et affiche le choix de l'utilisateur.
    document.addEventListener("DOMContentLoaded", () => {
        const choix = document.getElementById("choix");
        if (!choix) return;

        const params = new URLSearchParams(window.location.search);
        choix.textContent = params.has("lot")
            ? "Partie lancée : lot " + params.get("lot")
            : "Partie lancée : thématique " + params.get("theme");
    });
    /*********************************************************
     * FIN EXO3
     *********************************************************/
