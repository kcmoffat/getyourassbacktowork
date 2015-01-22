// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/*
  Grays out or [whatever the opposite of graying out is called] the option
  field.
*/
function ghost(isDeactivated) {
  options.style.color = isDeactivated ? 'graytext' : 'black';
                                              // The label color.
  options.frequency.disabled = isDeactivated; // The control manipulability.
}

function onStorageEvent(storageEvent) {
  if (storageEvent.key == 'isActivated') {
    options.isActivated.checked = JSON.parse(localStorage.isActivated);
  }
}

window.addEventListener('storage', onStorageEvent);

window.addEventListener('load', function() {
  // Initialize the option controls.
  options.isActivated.checked = JSON.parse(localStorage.isActivated);
                                         // The display activation.
  options.frequency.value = localStorage.frequency;
                                         // The display frequency, in minutes.

  if (!options.isActivated.checked) { ghost(true); }

  // Set the display activation and frequency.
  options.isActivated.onchange = function() {
    localStorage.isActivated = options.isActivated.checked;
    ghost(!options.isActivated.checked);
  };

  options.frequency.onchange = function() {
    localStorage.frequency = options.frequency.value;
  };

  var blockedSitesDiv = document.getElementById('blockedSites');
  var blockedSites = JSON.parse(localStorage.blockedSites)
  for (var site in blockedSites) {
    // create html
    var para = document.createElement("p");
    var textNode = document.createTextNode(site);
    var checkbox = document.createElement("INPUT");
    checkbox.type = "checkbox";
    checkbox.name = site;
    checkbox.checked = blockedSites[site][0];
    checkbox.id = site;
    para.appendChild(checkbox);
    para.appendChild(textNode);
    blockedSitesDiv.appendChild(para);

    // add listener
    checkbox.onchange = function (elem) {
      return function () {
        blockedSites = JSON.parse(localStorage.blockedSites);
        blockedSites[elem.name][0] = elem.checked;
        localStorage.blockedSites = JSON.stringify(blockedSites);
      }
    }(checkbox);
  }
});
