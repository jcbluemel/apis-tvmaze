"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $episodeList = $('#episodesList');
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

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const response = await axios.get(`${TVMAZE_BASE_URL}/shows/${id}/episodes`);
  return response.data.map(episode => {
    return {
      "id": episode.id,
      "name": episode.name,
      "season": episode.season,
      "number": episode.number
    };
  });
}

/** takes in an array of episodes and adds them to episods area
 * in an unordered list
 */

function populateEpisodes(episodes) {
  $episodeList.empty();
  for (let episode of episodes) {
    const $episode = $(
      `<li data-episode-id=${episode.id}>
        ${episode.name} (season ${episode.season}, episode ${episode.number})
      </li>`
    );
    $episodeList.append($episode);
  }
}

/**uses get episode function and populate episode function
 * to get a show ID and display the episode on the bottom of the page
 */
async function searchForEpisodesAndDisplay(id) {
  const episodes = await getEpisodesOfShow(id);
  $episodesArea.show();
  populateEpisodes(episodes);
}

/** adds on to all episode buttons in show area, grabs show id from
 * target show and executes searchForEpisodesAndDisplay func */

$showsList.on('click', '.Show-getEpisodes', async function (evt) {
  const showID = $(evt.target).closest('.Show').attr('data-show-id');
  await searchForEpisodesAndDisplay(Number(showID));
});

