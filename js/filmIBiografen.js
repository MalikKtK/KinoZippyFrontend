let films = [
    {
        title: "The Godfather",
        director: "Francis Ford Coppola",
        year: 1972
    },
    {
        title: "The Shawshank Redemption",
        director: "Frank Darabont",
        year: 1994
    },
    {
        title: "The Dark Knight",
        director: "Christopher Nolan",
        year: 2008
    }
];

let filmList = document.getElementById("film-list");

for (let i = 0; i < films.length; i++) {
    let film = films[i];
    let listItem = document.createElement("li");
    listItem.textContent = film.title;
    filmList.appendChild(listItem);
}

