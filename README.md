# Compte rendu - TP2 : Développement Web Côté Client
**Module :** KX07KAR7  
**Sujet :** Gestion des favoris avec la structure `Set` et l'API `localStorage`

---

## Vue d'ensemble du projet

Ce TP consiste à mettre en place un système de gestion de livres favoris sur une application Web sans rechargement de page. 
Les objectifs principaux sont :
1. Manipuler la structure de données **`Set`** en JavaScript pour gérer des éléments uniques.
2. Mettre à jour dynamiquement le DOM (tableaux HTML) en réponse à des événements utilisateur (`click` sur des cases à cocher).
3. Persister l'état des favoris d'une session à l'autre grâce à l'API **`localStorage`**.
4. Partager ces données entre plusieurs pages Web (`tp2_index.html` et `tp2_favorites.html`).

---

## Démarche et Modifications par Exercice

---

### Exercice 1 : Manipulation de la structure `Set`

#### **Objectif**
Mettre à jour le jeu de données des favoris `sFav` en fonction de l'état (coché / décoché) des cases à cocher dans le tableau principal.

#### **Modifications apportées (`tp2_index_script.js`)**
Dans la fonction `setFavorite(ev)` :
- Récupération de l'état de la case à cocher via `ev.currentTarget.checked`.
- Récupération de l'identifiant du livre via `ev.currentTarget.value`.
- **Ajout** : Si la case est cochée, l'ID est ajouté à `sFav` avec `sFav.add(...)`.
- **Suppression** : Si la case est décochée, l'ID est retiré de `sFav` avec `sFav.delete(...)`.

```javascript
function setFavorite(ev){
    if (ev.currentTarget.checked) {
        console.log("Checked - id :" + ev.currentTarget.value);
        sFav.add(ev.currentTarget.value); 
    } else {
        console.log("Unchecked - id :" + ev.currentTarget.value);     
        sFav.delete(ev.currentTarget.value);
    }
    console.log(sFav);
}
```

---

### Exercice 2 : Affichage dynamique dans le tableau "My favorite books"

#### **Objectif**
Reconstruire le tableau HTML `tblFavorite` en parcourant les données XML et en affichant uniquement les livres présent dans `sFav`.

#### **Modifications apportées (`tp2_index_script.js`)**
1. **Mise à jour de `fetchFavoriteBooks()`** :
   - Parcours des identifiants présents dans `sFav`.
   - Pour chaque identifiant, recherche du livre correspondant dans le XML (`xmlDoc.getElementsByTagName("book")`).
   - Construction des lignes du tableau HTML (`<tr>`, `<td>`).
   - Injection du HTML généré dans l'élément `#tblFavorite`.
2. **Appel de la fonction** :
   - La fonction `fetchFavoriteBooks()` est exécutée à l'intérieur de `setFavorite(ev)` dès qu'une case est cochée ou décochée.

```javascript
function fetchFavoriteBooks(){
    if (sFav.size === 0) {
        document.getElementById("tblFavorite").innerHTML = "";
        return;
    }

    let tblFavorite = "<tr><th>ID</th><th>Book</th><th>Authors</th></tr>";
    let xmlDoc = xmlhttp.responseXML;    
    let x = xmlDoc.getElementsByTagName("book");

    for (const id of sFav) {
        for (let i = 0; i < x.length; i++) {
            if (x[i].getElementsByTagName("id")[0].textContent === id) {
                tblFavorite += "<tr>" 
                            + "<td>" + x[i].getElementsByTagName("id")[0].textContent + "</td>" 
                            + "<td>" + x[i].getElementsByTagName("title")[0].textContent + "</td>" 
                            + "<td>" + x[i].getElementsByTagName("author")[0].textContent + "</td>" 
                            + "</tr>";
            }
        }
    }

    document.getElementById("tblFavorite").innerHTML = tblFavorite;
}
```

---

### Exercice 3 : Sauvegarde et Restauration via Web Storage API (`localStorage`)

#### **Objectif**
Rendre la liste des favoris persistante lors du rafraîchissement ou du réengagement de la session.

#### **Modifications apportées (`tp2_index_script.js`)**

1. **Sauvegarde (`initSetFavoriteBooks`)** :
   - Conversion du `Set` `sFav` en chaîne de caractères séparée par des virgules via `Array.from(sFav).join(',')`.
   - Sauvegarde dans le storage avec `localStorage.setItem("favorites", fchaine)`.
   - Appelé dans `setFavorite(ev)` à chaque changement.

2. **Restauration (`loadFavoritesFromStorage`)** :
   - À l'initialisation, lecture de `localStorage.getItem("favorites")`.
   - Conversion de la chaîne en tableau via `.split(',')`.
   - Réinsertion de chaque identifiant dans le `Set` `sFav` via `sFav.add(...)`.

3. **Restitution visuelle au chargement (`loadData` & `displayDataTable`)** :
   - Dans `loadData()`, la méthode `loadFavoritesFromStorage()` est appelée en premier.
   - Lors du rendu de la table principale dans `displayDataTable()`, vérification si `sFav.has(id)` est vrai pour pré-cocher la case (`checked`).
   - Appels successifs à `fetchFavoriteBooks()` pour pré-remplir le tableau des favoris dès le chargement de la page.

---

### Exercice 4 : Partage du Web Storage entre différentes pages

#### **Objectif**
Afficher la liste des livres favoris sur une deuxième page dédiée (`tp2_favorites.html`) en exploitant la portée globale du `localStorage` sur un même domaine.

#### **Modifications apportées (`tp2_favorites_script.js`)**

1. **Chargement des données stockées** :
   - Définition de la fonction `loadFavoritesFromStorage()` à l'identique de la page principale pour alimenter le `Set` `sFav` à partir du `localStorage`.
2. **Affichage dédié** :
   - Implémentation de `displayFavoriteBooks()` qui parcourt le fichier XML filtré par les éléments contenus dans `sFav`.
3. **Flux de chargement (`loadData`)** :
   - Dès la réception du fichier XML, la fonction restaure les données du `localStorage` puis génère l'affichage du tableau.

---

## Résumé du flux de données

```text
[ Action Utilisateur : Cocher/Décocher ]
                 │
                 ▼
     setFavorite(event)
                 │
       ├─► Met à jour sFav (Set)
       ├─► Met à jour le localStorage (favorites)
       └─► Exécute fetchFavoriteBooks() (MAJ du DOM)

[ Rechargement de page / Ouverture tp2_favorites.html ]
                 │
                 ▼
     loadFavoritesFromStorage()
                 │
       ├─► Lit localStorage ("favorites")
       └─► Reconstruit sFav
                 │
                 ▼
     Rendu des composants HTML avec les favoris cochés/affichés
```