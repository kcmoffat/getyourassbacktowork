// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


function click(e) {
  if (e.target.id == "topon") {
  	e.target.innerHTML = "OFF";
  	e.target.setAttribute("id", "topoff");
  	localStorage.isActivated = false;
  } else if (e.target.id == "topoff") {
  	e.target.innerHTML = "ON";
  	e.target.setAttribute("id", "topon");
  	localStorage.isActivated = true;
  } else if (e.target.id == "options") {
  	chrome.tabs.create({"url": "chrome-extension://cnaacakdeencbacmgaoajnekppgoiaob/options.html"});
  } else if (e.target.id == "feedback") {
  	chrome.tabs.create({"url": "http://goo.gl/forms/iFdDwcCYdE"});
  }
  window.close()
}

function onStorageEvent(storageEvent) {
  if (storageEvent.key == 'isActivated') {
  	var divs = document.querySelectorAll('div');
  	if (localStorage.isActivated) {
	  	divs[0].innerHTML = "ON";
	  	divs[0].setAttribute("id", "topon");
	} else {
	  	divs[0].innerHTML = "OFF";
	  	divs[0].setAttribute("id", "topoff");
  	}
  }
}

window.addEventListener('storage', onStorageEvent);

document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('div');
  if (JSON.parse(localStorage.isActivated)) {
  	divs[0].innerHTML = "ON";
  	divs[0].setAttribute("id", "topon");
  } else {
  	divs[0].innerHTML = "OFF";
  	divs[0].setAttribute("id", "topoff");
  }
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
});
