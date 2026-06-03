const article_container = document.getElementById("main-article-container");
if (article_container != null) {
  mainPageFunctions();
}

function starSetup() {
  const starHollow = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-star" viewBox="0 0 16 19">
  <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
</svg>`;

  const starFilled = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 19">
  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
</svg>`;

  const starRating = 0;

  const oneStar = document.getElementById("one-star-rate");
  const twoStar = document.getElementById("two-star-rate");
  const threeStar = document.getElementById("three-star-rate");
  const fourStar = document.getElementById("four-star-rate");
  const fiveStar = document.getElementById("five-star-rate");

  oneStar.addEventListener("mouseover", () => {
    oneStar.innerHTML = starFilled;
  });

  twoStar.addEventListener("mouseover", () => {
    oneStar.innerHTML = starFilled;
    twoStar.innerHTML = starFilled;
  });

  threeStar.addEventListener("mouseover", () => {
    oneStar.innerHTML = starFilled;
    twoStar.innerHTML = starFilled;
    threeStar.innerHTML = starFilled;
  });

  fourStar.addEventListener("mouseover", () => {
    oneStar.innerHTML = starFilled;
    twoStar.innerHTML = starFilled;
    threeStar.innerHTML = starFilled;
    fourStar.innerHTML = starFilled;
  });

  fiveStar.addEventListener("mouseover", () => {
    oneStar.innerHTML = starFilled;
    twoStar.innerHTML = starFilled;
    threeStar.innerHTML = starFilled;
    fourStar.innerHTML = starFilled;
    fiveStar.innerHTML = starFilled;
  });

  oneStar.addEventListener("mouseleave", () => {
    oneStar.innerHTML = starHollow;
  });

  twoStar.addEventListener("mouseleave", () => {
    oneStar.innerHTML = starHollow;
    twoStar.innerHTML = starHollow;
  });

  threeStar.addEventListener("mouseleave", () => {
    oneStar.innerHTML = starHollow;
    twoStar.innerHTML = starHollow;
    threeStar.innerHTML = starHollow;
  });

  fourStar.addEventListener("mouseleave", () => {
    oneStar.innerHTML = starHollow;
    twoStar.innerHTML = starHollow;
    threeStar.innerHTML = starHollow;
    fourStar.innerHTML = starHollow;
  });

  fiveStar.addEventListener("mouseleave", () => {
    oneStar.innerHTML = starHollow;
    twoStar.innerHTML = starHollow;
    threeStar.innerHTML = starHollow;
    fourStar.innerHTML = starHollow;
    fiveStar.innerHTML = starHollow;
  });

  oneStar.innerHTML = starHollow;
  twoStar.innerHTML = starHollow;
  threeStar.innerHTML = starHollow;
  fourStar.innerHTML = starHollow;
  fiveStar.innerHTML = starHollow;
}

async function mainPageFunctions() {
  starSetup();
  const articleIframe = document.getElementById("article-display-iframe");
  const params = new URLSearchParams(window.location.search);
  const pageid = params.get("pageid");
  const article = await getArticleFromID(pageid);
  console.log(article);
  articleIframe.src = `https://en.wikipedia.org/wiki/${article.title}`;
  document.title = `${article.title} - Gravestone`;
  categoryContainer = document.getElementById("categorized-article-container");
  catList = article.categories;

  loadCategorizedArticles(catList, pageid);
}

async function loadCategorizedArticles(catList, originalPageId) {
  const placehold = document.getElementById("placehold-iframe-cat");
  for (let catID = 0; catID < catList.length; catID++) {
    const cat = catList[catID].title;
    const article_list = await getArticlesFromCategory(cat);
    console.log(article_list);

    for (let i = 0; i < article_list.length; i++) {
      article = article_list[i];
      thumbnail =
        article.original?.source ||
        `https://placehold.co/600x400?text=${encodeURIComponent(article.title)}`;

      if (originalPageId != article.pageid) {
        const card = await createArticleCard(
          article.title,
          article.description,
          thumbnail,
          article.pageid,
          cat.slice(9),
        );
        categoryContainer.appendChild(card);
      }
    }
  }

  categoryContainer.removeChild(placehold);
}
