// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

chrome.runtime.onInstalled.addListener(function(installInfo) {
  if (installInfo.reason == "install") {
    showInstall();
  }
});


chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.query({'active': true, 'url': blockedSiteURLs()}, function (activeBlockedTabs) {
    // the active tab is a blocked site
    if (activeBlockedTabs.length > 0) {
      handleTabEvent(activeBlockedTabs[0].url, true);
    } else {
      handleTabEvent('', false);
    }
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, updatedTab) {
  chrome.tabs.query({'active': true, 'url': blockedSiteURLs()}, function(activeBlockedTabs) {
    // the active tab is a blocked site
    if (activeBlockedTabs.length > 0 && changeInfo.status == 'complete' && updatedTab.active) {
      handleTabEvent(activeBlockedTabs[0].url, true);
    } else {
      handleTabEvent('', false);
    }
  });
});

var timerId = 0;
function handleTabEvent(url, isBlocked) {
  if (window.Notification) {
    if (JSON.parse(localStorage.isActivated)) {
      if (isBlocked) {
        if (timerId > 0) {
          console.debug('on blocked site, timer already started');
          // do nothing, we've already got a timer going
        } else {
          // on a blocked site and did not come from
          // a blocked site.  Start a timer.
          console.debug('on blocked site, creating timer');
          timerId = setTimeout(function() {
            chrome.tabs.query({'active': true, 'url': blockedSiteURLs()}, function(activeBlockedTabs) {
              if (activeBlockedTabs.length > 0) {
                console.debug('still on blocked site, showing notification');
                show();
                closeBlockedTabs();
                console.debug('clearing timer');
                clearTimeout(timerId);
                timerId = 0;                  
              }
            });
          }, localStorage.frequency * 1000);
          console.debug('created timer');
        }
      } else {
        // not a blocked site, so clear any timers
        console.debug('not a blocked site');
        if (timerId > 0) {
          console.debug('found a timer, so clearing timer');
          clearTimeout(timerId);
          timerId = 0;
        } else {
          console.debug('no timers to clear');
        }
      }
    }
  }
}

/*
  Displays a notification with the current time. Requires "notifications"
  permission in the manifest file (or calling
  "Notification.requestPermission" beforehand).
*/
function show() {
  var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
  var hour = time[1] % 12 || 12;               // The prettyprinted hour.
  var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
  new Notification(hour + time[2] + ' ' + period, {
    icon: '128.png',
    body: getInsult()
  });
}

function showInstall() {
  var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
  var hour = time[1] % 12 || 12;               // The prettyprinted hour.
  var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
  new Notification(hour + time[2] + ' ' + period, {
    icon: '128.png',
    body: "Congratulations private, you've taken the first step toward productivity nirvana.  You can turn me on or off, change settings, and send feedback by clicking my icon.  I'm currently on.  Over!"
  });
}

/*
  Close tabs that are currently on a blockedSite.
*/
function closeBlockedTabs() {
  console.debug('closing blocked tabs');
  console.debug('querying for blocked tabs');
  chrome.tabs.query({'url': blockedSiteURLs()}, function(blockedTabs) {
    console.debug('found ' + blockedTabs.length + ' tabs');
    for (i = 0; i < blockedTabs.length; i++) {
      console.debug('found a blocked tab ' + blockedTabs[i].url);
      chrome.tabs.remove(blockedTabs[i].id);            
    }
  });
}

// Conditionally initialize the options.
if (!localStorage.isInitialized) {
  console.debug('initializing localStorage');
  localStorage.isActivated = true;   // The display activation.
  localStorage.isInitialized = true; // The option initialization.
  localStorage.frequency = 15; // Time in seconds.
  localStorage.blockedSites = JSON.stringify({
    'Amazon': [true, '*://*.amazon.com/*'],
    'BBC': [true, '*://*.bbc.com/*'],
    'Blogspot': [true, '*://*.blogspot.com/*'],
    'BoingBoing': [true, '*://*.boingboing.com/*'],
    'Break': [true, '*://*.break.com/*'],
    'BuzzFeed': [true, '*://*.buzzfeed.com/*'],
    'CNN': [true, '*://*.cnn.com/*'],
    'CollegeHumor': [true, '*://*.collegehumor.com/*'],
    'Delicious': [true, '*://*.delicious.com/*'],
    'Digg': [true, '*://*.digg.com/*'],
    'eBay': [true, '*://*.ebay.com/*'],
    'Engadget': [true, '*://*.engadget.com/*'],
    'ESPN': [true, '*://*.espn.com/*'],
    'Etsy': [true, '*://*.etsy.com/*'],
    'Facebook': [true, '*://*.facebook.com/*'],
    'Fark': [true, '*://*.fark.com/*'],
    'Feedly': [true, '*://*.feedly.com/*'],
    'Flickr': [true, '*://*.flickr.com/*'],
    'FunnyOrDie': [true, '*://*.funnyordie.com/*'],
    'Gizmodo': [true, '*://*.gizmodo.com/*'],
    'GoogleNews': [true, '*://*.news.google.com/*'],
    'HackerNews': [true, '*://*.news.ycombinator.com/*'],
    'HBOGO': [true, '*://*.hbogo.com/*'],
    'Hotmail': [true, '*://*.hotmail.com/*'],
    'HuffingtonPost': [true, '*://*.huffingtonpost.com/*'],
    'Hulu': [true, '*://*.hulu.com/*'],
    'Imgur': [true, '*://*.imgur.com/*'],
    'Instagram': [true, '*://*.instagram.com/*'],
    'Jezebel': [true, '*://*.jezebel.com/*'],
    'Medium': [true, '*://*.medium.com/*'],
    'MySpace': [true, '*://*.myspace.com/*'],
    'Netflix': [true, '*://*.netflix.com/*'],
    'NewYorkTimes': [true, '*://*.nytimes.com/*'],
    'Pinterest': [true, '*://*.pinterest.com/*'],
    'ProductHunt': [true, '*://*.producthunt.com/*'],
    'Quora': [true, '*://*.quora.com/*'],
    'Reddit': [true, '*://*.reddit.com/*'],
    'RenRen': [true, '*://*.renren.com/*'],
    'Slashdot': [true, '*://*.slashdot.com/*'],
    'StumbleUpon': [true, '*://*.stumbleupon.com/*'],
    'TechCrunch': [true, '*://*.techcrunch.com/*'],
    'TMZ': [true, '*://*.tmz.com/*'],
    'Tumblr': [true, '*://*.tumblr.com/*'],
    'Twitter': [true, '*://*.twitter.com/*'],
    'Vice': [true, '*://*.vice.com/*'],
    'Vimeo': [true, '*://*.vimeo.com/*'],
    'Weibo': [true, '*://*.weibo.com/*'],
    'Wikipedia': [true, '*://*.wikipedia.com/*'],
    'Yahoo': [true, '*://*.yahoo.com/*'],
    'YouTube': [true, '*://*.youtube.com/*']
  });
}

function blockedSiteURLs() {
  var results = [];
  var blockedSites = JSON.parse(localStorage.blockedSites);
  for (var key in blockedSites) {
    if (blockedSites[key][0]) {
      results.push(blockedSites[key][1]);  
    }
  }
  return results;
}

function getInsult() {
  return generalInsults[Math.floor(Math.random()*generalInsults.length)];
}

var generalInsults = [
  'Private, you’re balls deep in a pond of distraction - consider this your wake up call!',
  'Every journey begins with the first step.  And this first step involves me shoving your ass back to productivity town!',
  'Poor you, I’ll bet you’re exhausted.  You know who else was exhausted?  Nelson Mandela after 27 years in prison.',
  'You are a giant waste of my oxygen.  Stop jerkin around and get your ass back to work!',
  'I’m rippin’ the band-aid off your sorry unproductive ass.  Now go justify your existence!',
  'You look like a female llama who’s been surprised in the bath.  Snap out of it private!',
  'If I want nothing done, you’re my man!  Now go prove me wrong.',
  'I don’t give a tuppeny fuck about your desire to unwind, you shit sack.  Get back to work!',
  'I’ll explain and use small words so that you’ll be sure to understand, you warthog faced buffoon.  Get back to work!',
  'It looks to me like the best part of you ran down the crack of your momma’s ass and ended up as a brown stain on the mattress!',
  'Your mother was a hamster and your father smelt of elderberries! Get the f’ing holy grail you empty-headed animal food trough wiper!',
  'Hey you son of a motherless goat, get crackin!'
]