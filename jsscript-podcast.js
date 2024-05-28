window.onload = () => {
  waitThenExec(step1, startEpisode);
};

async function waitThenExec(condition, execute) {
  for (var i = 0; i < 30; i++) {
    if (condition()) {
      break;
    }
    await timer(100);
  }
  execute();
}

function timer(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function step1() {
  var targets = document.getElementsByClassName("buttons");
  return targets && targets.length;
}

function startEpisode() {
  var targets = document.getElementsByClassName("buttons");
  if (!targets || !targets.length) {
    return;
  }

  var buttons = targets[0];
  var podcastId = window.location.href.match(/\/podcast\/([^\/]+)/)[1];

  var lastViewedEpisode = "";
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (!key.startsWith("azuracast_podcast_") || !key.endsWith(podcastId)) {
      continue;
    }
    if (lastViewedEpisode < key) {
      lastViewedEpisode = key;
    }
  }

  if (!lastViewedEpisode) {
    return;
  }

  var episodeNumber = lastViewedEpisode.match(/azuracast_podcast_([0-9]+)/)[1];
  var span = document.createElement("span");
  span.innerHTML = `Last viewed episode: <a href="/public/radio/podcast/${podcastId}/episode/${episodeNumber}-${podcastId}">${episodeNumber}</a>`;
  span.className = "badge text-bg-secondary";
  buttons.appendChild(span);
}
