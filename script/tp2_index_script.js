let xmlhttp = new XMLHttpRequest();

let sFav = new Set();

function loadXMLDoc() {    
    xmlhttp.onreadystatechange = loadData;
    xmlhttp.open("GET", "https://phobos.univ-brest.fr/media/edu/kx07kar7/book_bdd.xml", true);
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
        + x[i].getElementsByTagName("id")[0].textContent
        + "'>"            
        + "</td>"
        + "</tr>";
    }

    document.getElementById("data").innerHTML = table;
} 

//Etape 1
function setFavorite(ev){
    if (ev.currentTarget.checked) {
        console.log("Checked - id :" + ev.currentTarget.value);        
    } else {
        console.log("Unchecked - id :" + ev.currentTarget.value);          
    }
    console.log(sFav);
}

//Etape 2
function fetchFavoriteBooks(){
    
}

//Etape 3
function initSetFavoriteBooks(){
    
}


