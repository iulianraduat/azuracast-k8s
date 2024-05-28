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
  var targets = document.getElementsByClassName("card-body");
  if (!targets || targets.length < 3) {
    return false;
  }
  targets = document.getElementsByClassName("card-body")[2];
  if (!targets) {
    return false;
  }
  targets = targets.getElementsByClassName("badges");
  return targets && targets.length > 0;
}

function startEpisode() {
  var targets = document
    .getElementsByClassName("card-body")[2]
    .getElementsByClassName("badges");
  if (!targets || !targets.length) {
    return;
  }

  var badgeTs = targets[0];
  badgeTs.style.cssText +=
    "display:flex; justify-content:space-between; align-items:baseline;";

  badgeTs.insertBefore(getAElement("⏴ PREV", "prev", -1), badgeTs.firstChild);
  badgeTs.appendChild(getAElement("NEXT ⏵", "next", 1));

  targets = document.getElementsByTagName("button");
  if (!targets || !targets.length) {
    return;
  }
  var playBtn = targets[0];

  targets = document.getElementsByClassName("album-art");
  if (targets && targets.length > 0) {
    targets[0].style.display = "none";
  }

  playBtn.addEventListener(
    "click",
    () => waitThenExec(step2, startPlaying),
    false
  );
  /* start playing */
  playBtn.click();
  playBtn.style.display = "none";
}

function step2() {
  var targets = document.getElementsByTagName("audio");
  return targets && targets.length > 0;
}

function startPlaying() {
  /* autoplay, but only after interacting with the player (click once on play) */
  var targets = document.getElementsByTagName("audio");
  if (!targets || !targets.length) {
    return;
  }
  var audio = targets[0];

  targets = document.getElementsByClassName("card-text");
  if (targets && targets.length) {
    targets[targets.length - 1].parentElement.appendChild(audio);
    audio.style.width = "100%";
  } else {
    audio.style.height = "2rem";
  }

  /* we display the default player to have 100% control */
  audio.setAttribute("controls", "");

  /* we remove the Azuracast player as it does not provide the pause button */
  var targets = document.getElementsByClassName("player-inline");
  if (targets && targets[0]) {
    targets[0].style.display = "none";
  }

  var podcastId = window.location.href.match(/\/episode\/([^\/]+)/)[1];
  var localStorageKey = "azuracast_podcast_" + podcastId;
  audio.onended = function () {
    localStorage.removeItem(localStorageKey);
    var href = getHref(1);
    window.location.href = href;
  };
  audio.onpause = function () {
    localStorage.setItem(localStorageKey, audio.currentTime);
  };
  audio.onplay = function () {
    localStorage.removeItem(localStorageKey);
  };
  var pauseTime = localStorage.getItem(localStorageKey);
  if (pauseTime) {
    audio.currentTime = pauseTime;
  }
}

function getAElement(label, title, hrefDir) {
  var href = getHref(hrefDir);
  if (href == null) {
    var span = document.createElement("span");
    return span;
  }

  var a = document.createElement("a");
  linkText = document.createTextNode(label);
  a.appendChild(linkText);
  a.title = title;
  a.href = href;
  a.className = "badge text-bg-secondary";
  return a;
}

function getHref(dir) {
  var parts = location.href.split("/");
  var episode = parts[parts.length - 1];
  var episodeParts = episode.split("-");
  var epNum = parseInt(episodeParts[0]) + dir;
  if (epNum == 0) {
    return null;
  }
  episodeParts[0] = epNum.toString().padStart(episodeParts[0].length, "0");
  return episodeParts.join("-");
}
