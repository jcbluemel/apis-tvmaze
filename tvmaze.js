"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const TVMAZE_BASE_URL = "http://api.tvmaze.com";
const NO_IMG_URL = 'https://tinyurl.com/tv-missing';

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  const response = await axios.get(`${TVMAZE_BASE_URL}/search/shows`,
    { params: { "q": term } });
  // console.log(response.data.map(show => show.show));
  return response.data.map(showAndScore => {
    const show = showAndScore.show;
    let image = show.image !== null ? show.image.medium : NO_IMG_URL;
    return {
      "id": show.id,
      "name": show.name,
      "summary": show.summary,
      "image": image
    };
  });
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt=${show.name}
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);
      console.log(show.name, show.id);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

//evt prevent default?
$showsList.on('click', '.Show-getEpisodes', function(evt){
  let showID = $(evt.target).closest('.Show').attr('data-show-id');
  console.log(showID);
  console.log(evt.target, 'clicked');
 // await getEpisodesOfShow(Number(showID))
})

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  //const response = await axios.get(`${TVMAZE_BASE_URL}/search/shows`,
    { params: { "q": term } });
 }



/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
