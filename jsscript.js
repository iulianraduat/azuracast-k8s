window.onload = (event) => {
  var targets = document.getElementsByClassName("card-header bg-primary");
  if (!targets || targets.length == 0) {
    return;
  }

  var target = targets[0];
  target.style.cssText += "display:flex; justify-content:space-between; align-items:baseline;";

  target.insertBefore(getAElement("<< PREV", "prev", -1), target.firstChild);
  target.appendChild(getAElement("NEXT >>", "next", 1));

  /* autoplay, but only after interacting with the player (click once on play) */
  targets = document.getElementsByTagName("audio");
  if (!targets || targets.length == 0) {
    return;
  }
  var target = targets[0];
  target.onended = function () {
    var href = getHref(1);
    window.location.href = href;
  };
  target.play();
};

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
  a.style.cssText = "color:white;"
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
  episodeParts[0] = epNum.toString().padStart(episodeParts[0].length, '0')
  return episodeParts.join("-");
}