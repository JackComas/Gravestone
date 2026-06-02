function getMultipleRandomArticle() {
  url =
    "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=description%7Cpageimages%7Ccategories&list=&generator=random&formatversion=2&piprop=original&grnnamespace=0&grnfilterredir=nonredirects&grnlimit=20";
  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data.query.pages;
    });
}

function getFeaturedArticles() {
  const url =
    "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=categorymembers&gcmtitle=Category:Featured_articles&gcmlimit=20&prop=description%7Cpageimages%7Ccategories&piprop=original&formatversion=2";
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data.query.pages;
    });
}

function getTodayArticles() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${month}/${day}?origin=*`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data.events;
    });
}

function getArticleFromID(id) {
  url =
    "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=categories%7Cdescription&origin=*&formatversion=2&pageids=" +
    id.toString();
  console.log(url);
  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      pagedata = data.query.pages[0];
      return pagedata;
    });
}

function getArticlesFromCategory(cat) {
  catURI = encodeURIComponent(cat);
  url =
    "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=description%7Cpageimages&generator=categorymembers&formatversion=2&piprop=original&gcmtitle=" +
    catURI;
  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data.query.pages;
    });
}

function searchFunction(query) {
  const queryURI = encodeURIComponent(query);
  url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=&list=search&formatversion=2&srsearch=${queryURI}&srlimit=50`;
  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      pages = data.query.search;
      console.log(pages);
      return pages;
    });
}

async function createArticleCard(title, desc, thumbnail, pageid, note = "") {
  titleURI = encodeURIComponent(title);
  card = document.createElement("div");
  card.classList.add("card");
  card.classList.add("article");
  if (note == "") {
    card.innerHTML = `<img
            src="${thumbnail}"
            class="card-img-top"
            alt="${title}"
          />
          <div class="card-body">
            <h5 class="card-title article-title">${title}</h5>
            <p class="card-text article-desc">
              ${desc}
            </p>
            <a href="${getCurrentLink()}/page.html?pageid=${pageid}" class="btn btn-primary read-btn">Read!</a>
          </div>`;
  } else {
    card.innerHTML = `<img
            src="${thumbnail}"
            class="card-img-top"
            alt="${title}"
          />
          <div class="card-body">
            <h5 class="card-title article-title">${title}</h5>
            <p class="card-text article-note">
              ${note}
            </p>
            <p class="card-text article-desc">
              ${desc}
            </p>
            <a href="${getCurrentLink()}?pageid=${pageid}" class="btn btn-primary read-btn">Read!</a>
          </div>`;
  }

  return card;
}

async function loadRandomArticles() {
  const article_list = await getMultipleRandomArticle();
  console.log(article_list);
  const placehold = document.getElementById("placehold-iframe-random");
  for (let i = 0; i < 20; i++) {
    article = article_list[i];
    thumbnail =
      article.original?.source ||
      `https://placehold.co/600x400?text=${encodeURIComponent(article.title)}`;

    const card = await createArticleCard(
      article.title,
      article.description,
      thumbnail,
      article.pageid,
    );
    randomArticlesContainer.appendChild(card);
  }
  randomArticlesContainer.removeChild(placehold);
}

async function loadFeaturedArticles() {
  const article_list = await getFeaturedArticles();
  console.log(article_list);
  const placehold = document.getElementById("placehold-iframe-featured");
  for (let i = 0; i < 20; i++) {
    article = article_list[i];
    thumbnail =
      article.original?.source ||
      `https://placehold.co/600x400?text=${encodeURIComponent(article.title)}`;

    const card = await createArticleCard(
      article.title,
      article.description,
      thumbnail,
      article.pageid,
    );
    featuredArticlesContainer.appendChild(card);
  }
  featuredArticlesContainer.removeChild(placehold);
}

async function loadTodayArticles() {
  const event_list = await getTodayArticles();
  console.log(event_list);
  const placehold = document.getElementById("placehold-iframe-today");
  for (let i = 0; i < event_list.length; i++) {
    event = event_list[i];
    thumbnail =
      event.pages[0].originalimage?.source ||
      `https://placehold.co/600x400?text=${encodeURIComponent(event.pages[0].titles.normalized)}`;

    const card = await createArticleCard(
      event.pages[0].titles.normalized,
      event.text,
      thumbnail,
      event.pages[0].pageid,
    );
    todayArticlesContainer.appendChild(card);
  }
  todayArticlesContainer.removeChild(placehold);
}

async function loadQueryArticles() {
  const params = await new URLSearchParams(window.location.search);
  const query = await params.get("query");
  const article_list = await searchFunction(query);
  console.log(article_list);
  const placehold = document.getElementById("placehold-iframe");
  searchResultContainer.innerHTML = "";
  for (let i = 0; i < 20; i++) {
    article = article_list[i];
    thumbnail =
      article.original?.source ||
      `https://placehold.co/600x400?text=${encodeURIComponent(article.title)}`;

    const card = await createArticleCard(
      article.title,
      article.snippet,
      thumbnail,
      article.pageid,
    );
    searchResultContainer.appendChild(card);
  }
  searchResultContainer.removeChild(placehold);
}

const randomArticlesContainer = document.getElementById(
  "random-articles-container",
);
if (randomArticlesContainer != null) {
  loadRandomArticles();
}

const todayArticlesContainer = document.getElementById(
  "today-articles-container",
);
if (todayArticlesContainer != null) {
  loadTodayArticles();
}

const featuredArticlesContainer = document.getElementById(
  "featured-articles-container",
);
if (featuredArticlesContainer != null) {
  loadFeaturedArticles();
}

const searchForm = document.getElementById("search");
if (searchForm != null) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchquery = searchForm.searchInput;
    window.location.href = `./search.html?query=${searchquery.value}`;
  });
}

const searchResultContainer = document.getElementById(
  "search-results-container",
);
if (searchResultContainer != null) {
  loadQueryArticles();
}

function getCurrentLink() {
  text = window.location.href;
  const URLParts = text.split("/");
  const isHTML = URLParts[URLParts.length - 1].includes(".html");

  if (isHTML) {
    returnVar = URLParts.slice(0, URLParts.length - 1).join("/");
  } else {
    returnVar = URLParts.join("/");
  }
  console.log(returnVar[returnVar.length - 1] == "/");
  if (returnVar[returnVar.length - 1] == "/") {
    return returnVar.slice(0, returnVar.length - 1);
  } else {
    return returnVar;
  }
}
