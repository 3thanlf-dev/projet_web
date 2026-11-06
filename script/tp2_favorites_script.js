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
        displayFavoriteBooks();         
    }
}

function displayFavoriteBooks(){    
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


