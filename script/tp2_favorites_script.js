let xmlhttp = new XMLHttpRequest();

let sFav = new Set();

function loadXMLDoc() {    
    xmlhttp.onreadystatechange = loadData;
    xmlhttp.open("GET", "https://phobos.univ-brest.fr/media/edu/kx07kar7/book_bdd.xml", true);
    xmlhttp.send();
}

function loadData() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {   
        displayFavoriteBooks();         
    }
}

function displayFavoriteBooks(){    
   console.log("Display Favorite Books");
}


