let xmlhttp = new XMLHttpRequest();

let sFav = new Set();

function loadXMLDoc() {    
    xmlhttp.onreadystatechange = loadData;
    xmlhttp.open("GET", "https://phobos.univ-brest.fr/media/edu/kx07kar7/book_bdd.xml", true);
    xmlhttp.send();
}

function loadData() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {  
        loadFavoritesFromStorage(); 
        displayDataTable();   
        fetchFavoriteBooks();     
    }
}


function displayDataTable() {
    let i;
    let xmlDoc = xmlhttp.responseXML;    
    let table = "<tr><th>ID</th><th>Book</th><th>Authors</th><th></th></tr>";    
    let x = xmlDoc.getElementsByTagName("book");
    
        for (i = 0; i < x.length; i++) {        
           
                table += "<tr>" 
                + "<td>" 
                + x[i].getElementsByTagName("id")[0].textContent 
                + "</td>"
                + "<td>" 
                + x[i].getElementsByTagName("title")[0].textContent 
                + "</td>" 
                + "<td>" 
                + x[i].getElementsByTagName("author")[0].textContent 
                + "</td>"
                + "<td>"
                + "<input type='checkbox' onclick='setFavorite(event)' value='"
                + x[i].getElementsByTagName("id")[0].textContent;

                if(sFav.has(x[i].getElementsByTagName("id")[0].textContent)){
                    table += "' checked>";    
                } 
                else { 
                    table += "'>"; 
                }

                table += "</td>"
                + "</tr>";            
        }

    document.getElementById("data").innerHTML = table;
}

//Etape 1
function setFavorite(ev){
    if (ev.currentTarget.checked) {
        console.log("Checked - id :" + ev.currentTarget.value);
        sFav.add(ev.currentTarget.value); 
        fetchFavoriteBooks();       
    } else {
        console.log("Unchecked - id :" + ev.currentTarget.value);     
        sFav.delete(ev.currentTarget.value);
        fetchFavoriteBooks();
    }
    initSetFavoriteBooks();   
    console.log(sFav);
}

//Etape 2
function fetchFavoriteBooks(){

    if (sFav.size === 0) {
        return;
    }

    let tblFavorite = "<tr><th>ID</th><th>Book</th><th>Authors</th></tr>";
    let xmlDoc = xmlhttp.responseXML;    
    let x = xmlDoc.getElementsByTagName("book");

    for (const id of sFav) {
        for (let i = 0; i < x.length; i++) {
            if (x[i].getElementsByTagName("id")[0].textContent === id) {
                tblFavorite += "<tr>" 
                            + "<td>" 
                            + x[i].getElementsByTagName("id")[0].textContent 
                            + "</td>" 
                            + "<td>" 
                            + x[i].getElementsByTagName("title")[0].textContent 
                            + "</td>" 
                            + "<td>" 
                            + x[i].getElementsByTagName("author")[0].textContent 
                            + "</td>" 
                            + "</tr>";
            }
        }
    }

    document.getElementById("tblFavorite").innerHTML = tblFavorite;
}

//Etape 3
function initSetFavoriteBooks(){
    let fchaine = Array.from(sFav).join(',');
    localStorage.setItem("favorites", fchaine);
}

function loadFavoritesFromStorage() {
    if (localStorage.getItem("favorites") != null) {
        let favs = localStorage.getItem("favorites");
        if (favs !== "") {
            let myArr = favs.split(",");
            for (let i = 0; i < myArr.length; i++) {
                if (myArr[i].trim() !== "") {
                    sFav.add(myArr[i]);
                    console.log("Chargé depuis localStorage : " + myArr[i]);
                }
            }    
        }
    }
}


