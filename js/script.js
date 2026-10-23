    let xmlhttp = new XMLHttpRequest();

    function loadXMLDoc() {
        xmlhttp.onreadystatechange = loadData;
        xmlhttp.open("GET", "data/bdd.xml", true);
        xmlhttp.send();
    }


    function loadData() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {  
            loadFilters();
            displayDataTable();
            
        }
    }



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


    function loadFilters(){
        const xmlDoc = xmlhttp.responseXML;
            const select = document.getElementById("thematique");
            if (select) {
                const themes = [...new Set([...xmlDoc.getElementsByTagName("thematique")].map(theme => theme.textContent))];
                themes.forEach(theme => select.add(new Option(theme, theme)));
            }
    }

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

        document.addEventListener("DOMContentLoaded", () => {
        const lots = document.getElementById("lots");
        if (!lots) return;

        const themes = ["Types","Pokédex",  "Régions et générations", "Dessin animé",  "Objets et combats","Évolutions"];

        fetch("data/bdd.xml").then(r => r.text()).then(xml => {
            const nbLots = Math.ceil((xml.match(/<question>/g) || []).length / 10);
            for (let i = 1; i <= nbLots; i++) {
                lots.innerHTML += `<a class="choix-partie" href="jeu.html?lot=${i}">Lot ${i}</a>`;
            }
        });

        themes.forEach(t => {
            document.getElementById("themes").innerHTML += `<a class="choix-partie" href="jeu.html?theme=${encodeURIComponent(t)}">${t}</a>`;
        });
    });




    document.addEventListener("DOMContentLoaded", () => {
        const cartes = document.getElementById("cartes");
        if (!cartes) return;

        fetch("data/bdd_cartes.xml").then(r => r.text()).then(texte => {
            const xml = new DOMParser().parseFromString(texte, "text/xml");
            for (const carte of xml.querySelectorAll("carte")) {
                // Raccourci : donne le texte d'une balise de la carte (ex : get("nom") -> "Bulbizarre")
                const get = balise => carte.querySelector(balise).textContent;
                cartes.innerHTML += `
                    <div class="carte type-${get("type")}">
                        <div class="entete"><span>${get("nom")}</span><span>PV ${get("pv")}</span></div>
                        <div class="image"><img src="${get("image")}" alt="${get("nom")}"></div>
                        <div class="attaque"><span>${get("attaque")}</span><span>${get("degats")}</span></div>
                        <div class="pied">Faiblesse : ${get("faiblesse")} | Retraite : ${get("retraite")}</div>
                        <div class="infos">N° ${get("numero")} - ${get("rarete")}</div>
                    </div>`;
            }
        });
    });