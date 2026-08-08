(function(){

  var reviews = [
    {
      robloxId: "2231488905",
      username: "Legion",
      role: "Guest",
      anonymous: false,
      rating: 4.6,
      text: "Its very cool and realistic i wound play for 1 or 2 hours."
    },
    {
      robloxId: "",
      username: "",
      role: "Guest",
      anonymous: true,
      rating: 4,
      text: "Really impressive builds, staff were super friendly when I visited."
    }
  ];

  var SLIDE_DELAY = 6000;
  var GITHUB_USER = "matthew73326-dotcom";
  var GITHUB_REPO = "atrr-assets";
  var GITHUB_BRANCH = "main";
  var GITHUB_FOLDER = "reviews";
  var ANONYMOUS_IMAGE = "anonymouse.png";
  var baseUrl = "https://raw.githubusercontent.com/" + GITHUB_USER + "/" + GITHUB_REPO + "/" + GITHUB_BRANCH + "/" + GITHUB_FOLDER + "/";

  var wrap = document.getElementById('atrrReviews');
  var avatarEl = document.getElementById('r-avatar');
  var starsFgEl = document.getElementById('r-stars-fg');
  var ratingNumEl = document.getElementById('r-rating-num');
  var textEl = document.getElementById('r-text');
  var userEl = document.getElementById('r-user');
  var roleEl = document.getElementById('r-role');
  var dotsWrap = document.getElementById('r-dots');
  var index = 0;
  var timer;
  var avatarCache = {};

  reviews.forEach(function(_, i){
    var dot = document.createElement('button');
    dot.className = 'r-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', function(){ goTo(i); });
    dotsWrap.appendChild(dot);
  });

  function fetchRobloxAvatar(userId, callback){
    if (avatarCache[userId]){
      callback(avatarCache[userId]);
      return;
    }
    var url = "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" + userId + "&size=150x150&format=Png&isCircular=false";
    fetch(url)
      .then(function(res){ return res.json(); })
      .then(function(data){
        if (data && data.data && data.data[0] && data.data[0].imageUrl){
          avatarCache[userId] = data.data[0].imageUrl;
          callback(data.data[0].imageUrl);
        } else {
          callback(null);
        }
      })
      .catch(function(){
        callback(null);
      });
  }

  function render(){
    var r = reviews[index];
    var thisIndex = index;

    var pct = Math.max(0, Math.min(5, r.rating)) / 5 * 100;
    starsFgEl.style.width = pct + "%";
    ratingNumEl.textContent = r.rating.toFixed(1);

    textEl.textContent = '"' + r.text + '"';

    if (r.role && r.role.length > 0){
      roleEl.textContent = r.role;
      roleEl.style.display = "inline-block";
    } else {
      roleEl.style.display = "none";
    }

    var dots = dotsWrap.querySelectorAll('.r-dot');
    for (var i = 0; i < dots.length; i++){
      if (i === thisIndex) dots[i].classList.add('active');
      else dots[i].classList.remove('active');
    }

    if (r.anonymous){
      avatarEl.src = baseUrl + ANONYMOUS_IMAGE;
      userEl.textContent = "Anonymous guest";
    } else {
      userEl.textContent = "@" + r.username;
      avatarEl.src = baseUrl + ANONYMOUS_IMAGE;
      fetchRobloxAvatar(r.robloxId, function(imageUrl){
        if (index !== thisIndex) return;
        if (imageUrl){
          avatarEl.src = imageUrl;
        } else {
          avatarEl.src = baseUrl + ANONYMOUS_IMAGE;
        }
      });
    }
  }
  function goTo(i){
    index = (i + reviews.length) % reviews.length;
    render();
    resetTimer();
  }
  function next(){ goTo(index + 1); }
  function prev(){ goTo(index - 1); }
  function resetTimer(){
    clearInterval(timer);
    timer = setInterval(next, SLIDE_DELAY);
  }

  wrap.querySelector('.r-next').addEventListener('click', next);
  wrap.querySelector('.r-prev').addEventListener('click', prev);

  var startX = 0;
  wrap.addEventListener('touchstart', function(e){ startX = e.touches[0].clientX; });
  wrap.addEventListener('touchend', function(e){
    var diff = e.changedTouches[0].clientX - startX;
    if (diff > 40) prev();
    else if (diff < -40) next();
  });

  render();
  resetTimer();
})();
