/* Murdock's Butchery & Goods */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Opening animation ---- */
  var intro = document.getElementById("intro");
  if (intro) {
    var close = function () { intro.classList.add("done"); };
    if (reduced) {
      close();
    } else {
      window.setTimeout(close, 1250);
    }
    window.setTimeout(function () {
      if (intro && intro.parentNode) { intro.parentNode.removeChild(intro); }
    }, 2600);
  }

  /* ---- Current year ---- */
  var year = document.getElementById("year");
  if (year) { year.textContent = String(new Date().getFullYear()); }

  /* ---- Gmail compose links (built in JS so the address is never in the HTML) ---- */
  document.querySelectorAll("a[data-gmail]").forEach(function (a) {
    var to = a.getAttribute("data-user") + "@" + a.getAttribute("data-domain");
    a.href = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(to) +
      "&su=" + (a.getAttribute("data-su") || "") +
      "&body=" + (a.getAttribute("data-body") || "");
    a.target = "_blank";
    a.rel = "noopener";
  });

  document.querySelectorAll("[data-email-text]").forEach(function (el) {
    el.textContent = el.getAttribute("data-user") + "@" + el.getAttribute("data-domain");
  });

  /* ---- Mobile menu ---- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobileMenu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        burger.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* ---- Rolling hero images ---- */
  var slidesWrap = document.getElementById("heroSlides");
  if (slidesWrap && !reduced) {
    var slides = slidesWrap.querySelectorAll(".hero-slide");
    if (slides.length > 1) {
      var i = 0;
      window.setInterval(function () {
        slides[i].classList.remove("active");
        i = (i + 1) % slides.length;
        slides[i].classList.add("active");
      }, 5600);
    }
  }

  /* ---- Reviews: one source for the hero widget and the cards ---- */
  var REVIEWS = [
    {
      name: "Rangi T.",
      where: "Ahipara",
      date: "3 weeks ago",
      text: "Went in for a couple of steaks and came out with the week sorted. Cut them exactly how I asked and it still came in under what the supermarket wanted.",
      short: "Went in for a couple of steaks and came out with the week sorted. Cut exactly how I asked."
    },
    {
      name: "Marama H.",
      where: "Awanui",
      date: "1 month ago",
      text: "Ordered a big pack for a whanau get together. It was ready when they said it would be, packed and labelled so we knew what was what on the day.",
      short: "Ordered a big pack for a whanau get together. Ready when they said, packed and labelled."
    },
    {
      name: "Dave W.",
      where: "Kaitaia",
      date: "2 months ago",
      text: "Their sausages are the reason I stopped buying them at the supermarket. The kids demolish a pack in one sitting and I get no complaints about dinner.",
      short: "Their sausages are the reason I stopped buying them at the supermarket."
    },
    {
      name: "Hinemoa P.",
      where: "Taipa",
      date: "2 months ago",
      text: "Rang ahead on a Friday afternoon and they put it aside for me. Friendly every single time, and the bacon is proper bacon, not water in a packet.",
      short: "Rang ahead on a Friday and they put it aside for me. The bacon is proper bacon."
    }
  ];

  var STAR = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3 6.6 7 .8-5.2 4.8 1.4 7L12 17.8 5.8 21.2l1.4-7L2 9.4l7-.8z"/></svg>';
  var STARS = '<span class="stars" aria-label="Five out of five stars">' + STAR + STAR + STAR + STAR + STAR + "</span>";

  var cards = document.getElementById("reviewCards");
  if (cards) {
    var html = "";
    REVIEWS.forEach(function (r, n) {
      html +=
        '<article class="review reveal d' + Math.min(n, 3) + '">' +
        STARS +
        "<p>" + r.text + "</p>" +
        '<div class="review-foot">' +
        '<span class="review-who">' + r.name + ' <span class="review-where">' + r.where + "</span></span>" +
        '<span class="review-date">' + r.date + "</span>" +
        "</div></article>";
    });
    cards.innerHTML = html;
  }

  var quotes = document.getElementById("heroQuotes");
  if (quotes) {
    var qhtml = "";
    REVIEWS.forEach(function (r, n) {
      qhtml +=
        '<div class="hq-slide' + (n === 0 ? " active" : "") + '">' +
        '<p class="hq-text">&ldquo;' + r.short + '&rdquo;</p>' +
        '<span class="hq-name">' + r.name + ", " + r.where + "</span>" +
        "</div>";
    });
    quotes.innerHTML = qhtml;

    if (!reduced) {
      var qs = quotes.querySelectorAll(".hq-slide");
      var q = 0;
      window.setInterval(function () {
        qs[q].classList.remove("active");
        q = (q + 1) % qs.length;
        qs[q].classList.add("active");
      }, 6200);
    }
  }

  /* ---- Reveal on scroll ---- */
  var revealables = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || reduced) {
    revealables.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  }
})();
