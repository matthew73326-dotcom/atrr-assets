<style>
.atrr-reviews{
position:relative;
max-width:600px;
margin:40px auto;
background:#1a1a1a;
border-radius:10px;
padding:32px 60px;
text-align:center;
min-height:220px;
display:flex;
flex-direction:column;
justify-content:center;
}
.atrr-reviews .r-avatar{
width:64px;
height:64px;
border-radius:50%;
object-fit:cover;
margin:0 auto 14px;
border:2px solid #663D8D;
background:#333;
}
.atrr-reviews .r-stars{
position:relative;
display:inline-block;
font-size:18px;
letter-spacing:3px;
margin-bottom:12px;
line-height:1;
}
.atrr-reviews .r-stars-bg{
color:rgba(255,255,255,0.2);
white-space:nowrap;
}
.atrr-reviews .r-stars-fg{
position:absolute;
top:0;
left:0;
color:#9838F2;
white-space:nowrap;
overflow:hidden;
}
.atrr-reviews .r-rating-num{
color:#9838F2;
font-size:0.8rem;
margin-left:6px;
vertical-align:middle;
font-family:inherit;
letter-spacing:normal;
}
.atrr-reviews .r-text{
color:#fff;
font-size:1rem;
line-height:1.5;
margin-bottom:14px;
min-height:60px;
}
.atrr-reviews .r-user-row{
display:flex;
align-items:center;
justify-content:center;
gap:8px;
flex-wrap:wrap;
}
.atrr-reviews .r-user{
color:#9838F2;
font-size:0.85rem;
font-weight:bold;
}
.atrr-reviews .r-role{
background:rgba(102,61,141,0.35);
color:#e0c9ff;
font-size:0.68rem;
font-weight:bold;
letter-spacing:0.03em;
text-transform:uppercase;
padding:3px 9px;
border-radius:999px;
border:1px solid rgba(152,56,242,0.5);
}
.atrr-reviews .r-arrow{
position:absolute;
top:50%;
transform:translateY(-50%);
background:rgba(102,61,141,0.7);
color:#fff;
border:none;
width:38px;
height:38px;
border-radius:50%;
font-size:18px;
cursor:pointer;
}
.atrr-reviews .r-arrow:hover{ background:rgba(152,56,242,0.85); }
.atrr-reviews .r-prev{ left:12px; }
.atrr-reviews .r-next{ right:12px; }
.atrr-reviews .r-dots{
display:flex;
justify-content:center;
gap:8px;
margin-top:6px;
}
.atrr-reviews .r-dot{
width:8px; height:8px;
border-radius:50%;
background:rgba(102,61,141,0.5);
border:none;
cursor:pointer;
padding:0;
}
.atrr-reviews .r-dot:hover{ background:#9838F2; }
.atrr-reviews .r-dot.active{ background:#663D8D; }
</style>

<div class="atrr-reviews" id="atrrReviews">
<img class="r-avatar" id="r-avatar" src="" alt="">
<div class="r-stars-wrap">
  <span class="r-stars">
    <span class="r-stars-bg">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
    <span class="r-stars-fg" id="r-stars-fg">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
  </span>
  <span class="r-rating-num" id="r-rating-num"></span>
</div>
<div class="r-text" id="r-text"></div>
<div class="r-user-row">
  <span class="r-user" id="r-user"></span>
  <span class="r-role" id="r-role"></span>
</div>
<button class="r-arrow r-prev">&#10094;</button>
<button class="r-arrow r-next">&#10095;</button>
<div class="r-dots" id="r-dots"></div>
</div>

<script>
(function(){

  // ====================================================================
  // EDIT ME: add or remove reviews here.
  // role = whatever label you want shown, e.g. "Guest", "Staff Member",
  //        "Builder", "Ride Operator". Leave as "" to hide the badge.
  // ====================================================================
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
</script>