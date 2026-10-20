   let xmlhttp = new XMLHttpRequest();

    function loadXMLDoc() {
        xmlhttp.onreadystatechange = loadData;
        xmlhttp.open("GET", "data/bdd.xml", true);
        xmlhttp.send();
    }

    function loadData() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {   
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
            + x[i].getElementsByTagName("theme")[0].textContent 
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
