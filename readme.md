## projet web


## Fonction `displayDataTable()`

Cette fonction lit les questions présentes dans le document XML, construit un tableau HTML avec leurs informations, puis affiche ce tableau dans la page.

### Récupérer les données et préparer le tableau

```js
function displayDataTable() {
```

Déclare la fonction `displayDataTable()`. Elle construit puis affiche un tableau HTML.

```js
let i;
```

Déclare la variable `i`, qui servira de compteur pour parcourir les questions.

```js
let xmlDoc = xmlhttp.responseXML;
```

Récupère le document XML et le stocke dans `xmlDoc`.

```js
let table = "<table><tr><th>ID</th><th>Thème</th><th>Question</th><th>Réponse 1</th><th>Réponse 2</th><th>Réponse 3</th><th>Réponse 4</th><th>Bonne réponse</th><th>Points</th></tr>";
```

Crée une chaîne de caractères contenant le début du tableau HTML :

- `<table>` ouvre le tableau ;
- `<tr>` ouvre une ligne ;
- chaque balise `<th>` crée une cellule d’en-tête ;
- `</tr>` ferme la ligne d’en-tête.

```js
let x = xmlDoc.getElementsByTagName("question");
```

Récupère tous les éléments `<question>` du document XML. La variable `x` contient la liste des questions.

### Parcourir les questions

```js
for (i = 0; i < x.length; i++) {
```

Démarre une boucle qui s’exécute une fois pour chaque question. `x.length` correspond au nombre de questions.

```js
table += "<tr>"
+ "<td>"
+ x[i].getElementsByTagName("id")[0].textContent
+ "</td>"
```

Ajoute une ligne HTML et une cellule contenant l’id de la question :

- `x[i]` désigne la question actuellement parcourue ;
- `getElementsByTagName("id")` cherche ses éléments `<id>` ;
- `[0]` sélectionne le premier élément trouvé ;
- `.textContent` récupère le texte contenu dans cet élément ;
- `<td>` et `</td>` ouvrent et ferment la cellule.

```js
+ "<td>"
+ x[i].getElementsByTagName("thematique")[0].textContent
+ "</td>"
```

Ajoute une cellule contenant le texte de l’élément `<thematique>`.

```js
+ "<td>"
+ x[i].getElementsByTagName("contenu")[0].textContent
+ "</td>";
```

Ajoute une cellule contenant le texte de l’élément `<contenu>` .

### Ajouter les quatre réponses

```js
for (let j = 1; j <= 4; j++) {
```

Démarre une boucle pour parcourir les quatre réponses.

```js
table += "<td>"
+ x[i].getElementsByTagName("r" + j)[0].textContent
+ "</td>";
```

Ajoute une cellule avec le texte de la réponse correspondant à la valeur de `j`.

```js
}
```

Termine la boucle des réponses.

### Ajouter la bonne réponse et les points

```js
table += "<td>"
+ x[i].getElementsByTagName("bonne_reponse")[0].textContent
+ "</td>"
```

Ajoute une cellule contenant le texte de l’élément `<bonne_reponse>`.

```js
+ "<td>"
+ x[i].getElementsByTagName("point")[0].textContent
+ "</td>"
```

Ajoute une cellule contenant le nombre de points, récupéré dans l’élément `<point>`.

```js
+ "</tr>";
```

Ferme la ligne HTML correspondant à la question actuelle.

```js
}
```

Termine la boucle qui parcourt toutes les questions du document XML.

### Afficher le tableau dans la page

```js
document.getElementById("data").innerHTML = table + "</table>";
```

Cherche dans la page l’élément dont l’attribut `id` vaut `data`, puis remplace son contenu par le tableau construit.

```js
}
```

Termine la fonction.
