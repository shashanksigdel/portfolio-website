/**
 * SHASHANK SIGDEL — Riso Xerox Zine Portfolio
 * Interactions: cursor, scroll reveals, riso parallax, counters
 */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  const getScrollOffset = () => {
    const root = getComputedStyle(document.documentElement);
    const headerH = parseFloat(root.getPropertyValue("--header-h")) || 68;
    const fontSize = parseFloat(root.fontSize) || 16;
    return headerH + fontSize * 0.65;
  };

  const getSectionScrollAnchor = (section) => {
    if (!section || section.id === "hero") return null;
    return (
      section.querySelector(".section__header") ||
      section.querySelector(".contact__left") ||
      section
    );
  };

  const getSectionScrollTop = (section) => {
    if (!section || section.id === "hero") return 0;
    const anchor = getSectionScrollAnchor(section);
    const rect = anchor.getBoundingClientRect();
    return Math.max(0, rect.top + window.scrollY - getScrollOffset());
  };

  const getElementScrollTop = (element) => {
    if (!element || element.id === "hero") return 0;
    if (element.classList.contains("section")) {
      return getSectionScrollTop(element);
    }
    const rect = element.getBoundingClientRect();
    return Math.max(0, rect.top + window.scrollY - getScrollOffset());
  };

  /* ─── Live Clock (Melbourne) ─── */
  const timeEl = document.getElementById("live-time");
  if (timeEl) {
    const updateTime = () => {
      const now = new Date();
      const melb = now.toLocaleTimeString("en-AU", {
        timeZone: "Australia/Melbourne",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      timeEl.textContent = `MEL ${melb}`;
      timeEl.setAttribute("datetime", now.toISOString());
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  /* ─── Riso Layer Parallax ─── */
  if (!isTouch && !prefersReducedMotion) {
    const risoPink = document.getElementById("riso-pink");
    const risoBlue = document.getElementById("riso-blue");

    document.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * 6;
      if (risoPink) risoPink.style.transform = `translate(${2 + x}px, ${1 + y}px)`;
      if (risoBlue) risoBlue.style.transform = `translate(${-2 - x}px, ${-1 - y}px)`;
    });
  }

  /* ─── Custom Cursor ─── */
  if (!isTouch) {
    const cursor = document.getElementById("cursor");
    let cx = 0;
    let cy = 0;
    let tx = 0;
    let ty = 0;

    document.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });

    const animateCursor = () => {
      cx += (tx - cx) * 0.15;
      cy += (ty - cy) * 0.15;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const hoverables = document.querySelectorAll(
      "a, button, [data-magnetic], [data-cursor], .work__card, .skill-tag"
    );

    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("is-hovering");
        if (el.dataset.cursor) {
          cursor.classList.add(`is-${el.dataset.cursor}`);
          cursor.querySelector(".cursor__label").textContent =
            el.dataset.cursor.toUpperCase();
        }
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("is-hovering", "is-view");
      });
    });
  }

  /* ─── Magnetic Buttons (disabled in scatter mode — preserves rotation) ─── */
  const isScatter = document.body.classList.contains("zine-scatter");

  if (!isTouch && !isScatter) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ─── Mobile Menu ─── */
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuBtn && mobileMenu) {
    const toggleMenu = () => {
      const isOpen = mobileMenu.classList.toggle("is-open");
      menuBtn.classList.toggle("is-active", isOpen);
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      mobileMenu.setAttribute("aria-hidden", String(!isOpen));
      document.body.classList.toggle("menu-open", isOpen);
    };

    menuBtn.addEventListener("click", toggleMenu);

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (mobileMenu.classList.contains("is-open")) toggleMenu();
      });
    });
  }

  /* ─── Header Hide on Scroll ─── */
  const chrome = document.querySelector(".chrome");
  let lastScroll = 0;

  window.addEventListener(
    "scroll",
    () => {
      const current = window.scrollY;
      if (current > 100 && current > lastScroll) {
        chrome?.classList.add("is-hidden");
      } else {
        chrome?.classList.remove("is-hidden");
      }
      lastScroll = current;
    },
    { passive: true }
  );

  /* ─── Scroll Reveal ─── */
  const revealEls = document.querySelectorAll("[data-reveal]");
  const heroReveals = document.querySelectorAll(".hero [data-reveal]");

  const showEl = (el) => {
    el.classList.remove("reveal-pending");
    el.classList.add("is-visible");
  };

  if (!prefersReducedMotion && revealEls.length) {
    /* Staggered hero entrance on load — title always visible immediately */
  document.querySelectorAll(".hero__title [data-reveal], .hero__title-wrap [data-reveal]").forEach((el) => {
    showEl(el);
  });

  heroReveals.forEach((el, i) => {
    if (el.closest(".hero__title-wrap")) return;
    el.classList.add("reveal-pending");
    setTimeout(() => showEl(el), 120 + i * 100);
  });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            showEl(entry.target);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el) => {
      if (!el.closest(".hero")) revealObserver.observe(el);
    });
  } else {
    revealEls.forEach((el) => showEl(el));
  }

  /* ─── Counter Animation ─── */
  const counters = document.querySelectorAll("[data-count]");

  if (!prefersReducedMotion && counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const duration = 1500;
          const start = performance.now();

          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => counterObserver.observe(c));
  } else {
    counters.forEach((c) => {
      c.textContent = c.dataset.count;
    });
  }

  /* ─── Skill Tag Tilt ─── */
  if (!isTouch) {
    document.querySelectorAll("[data-tilt]").forEach((tag) => {
      const baseRot =
        getComputedStyle(tag).getPropertyValue("--rot").trim() || "0deg";

      tag.addEventListener("mousemove", (e) => {
        const rect = tag.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        tag.style.transform = `rotate(${baseRot}) perspective(400px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translate(-2px, -2px)`;
      });
      tag.addEventListener("mouseleave", () => {
        tag.style.transform = `rotate(${baseRot})`;
      });
    });
  }

  /* ─── Contact Form ─── */
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type='submit']");
      const original = btn.innerHTML;
      btn.innerHTML = `<span class="btn__text">Sent ✓</span>`;
      btn.style.background = "var(--acid)";
      btn.style.color = "var(--black)";
      form.reset();
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = "";
        btn.style.color = "";
      }, 3000);
    });
  }

  /* ─── Hero scroll wire cue ─── */
  const heroScroll = document.getElementById("hero-scroll");
  if (heroScroll) {
    const toggleScrollCue = () => {
      heroScroll.classList.toggle(
        "is-hidden",
        window.scrollY > window.innerHeight * 0.32
      );
    };
    toggleScrollCue();
    window.addEventListener("scroll", toggleScrollCue, { passive: true });
  }

  /* ─── Smooth anchor offset for fixed header ─── */
  const navSections = ["about", "skills", "work", "services", "blog", "contact"];
  const navLinks = document.querySelectorAll("[data-nav]");

  const scrollToTarget = (target) => {
    if (!target) return;

    chrome?.classList.remove("is-hidden");

    window.scrollTo({
      top: getElementScrollTop(target),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    if (target.id) {
      history.pushState(null, "", `#${target.id}`);
    }
  };

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
    });
  });

  const setActiveNav = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.nav === id);
    });
  };

  if (navSections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length) {
          setActiveNav(visible[0].target.id);
        }
      },
      {
        threshold: [0.2, 0.35, 0.5],
        rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"), 10) + 24}px 0px -45% 0px`,
      }
    );

    navSections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });

    window.addEventListener("scroll", () => {
      if (window.scrollY < 120) {
        navLinks.forEach((link) => link.classList.remove("is-active"));
      }
    }, { passive: true });
  }

  if (window.location.hash) {
    const initialTarget = document.querySelector(window.location.hash);
    if (initialTarget) {
      requestAnimationFrame(() => scrollToTarget(initialTarget));
    }
  }

  /* ─── Blog list pagination (3 per page) ─── */
  (function initBlogPagination() {
    const list = document.getElementById("blog-list");
    const pagination = document.getElementById("blog-pagination");
    const pageNumbers = document.getElementById("blog-page-numbers");
    if (!list || !pagination || !pageNumbers) return;

    const posts = [...list.querySelectorAll(".blog__post")];
    const perPage = 3;
    const totalPages = Math.ceil(posts.length / perPage);
    if (totalPages <= 1) return;

    pagination.hidden = false;

    const prevBtn = pagination.querySelector('[data-blog-nav="prev"]');
    const nextBtn = pagination.querySelector('[data-blog-nav="next"]');
    let currentPage = 1;

    const getPageFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const page = parseInt(params.get("blog-page"), 10);
      return Number.isFinite(page) && page >= 1 && page <= totalPages ? page : 1;
    };

    const updateUrl = (page) => {
      const url = new URL(window.location.href);
      const hash = url.hash;
      if (page <= 1) {
        url.searchParams.delete("blog-page");
      } else {
        url.searchParams.set("blog-page", String(page));
      }
      url.hash = hash;
      history.replaceState(null, "", url);
    };

    const renderPageButtons = () => {
      pageNumbers.innerHTML = "";
      for (let i = 1; i <= totalPages; i += 1) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "blog__page-btn blog__page-btn--num";
        btn.textContent = String(i);
        btn.dataset.blogPage = String(i);
        btn.setAttribute("aria-label", `Page ${i}`);
        if (i === currentPage) {
          btn.setAttribute("aria-current", "page");
        }
        pageNumbers.appendChild(btn);
      }
    };

    const showPage = (page, scrollToBlog) => {
      currentPage = page;
      posts.forEach((post, index) => {
        const postPage = Math.floor(index / perPage) + 1;
        post.hidden = postPage !== currentPage;
      });

      prevBtn.disabled = currentPage <= 1;
      nextBtn.disabled = currentPage >= totalPages;

      pageNumbers.querySelectorAll(".blog__page-btn--num").forEach((btn) => {
        const isActive = Number(btn.dataset.blogPage) === currentPage;
        btn.toggleAttribute("aria-current", isActive);
        btn.classList.toggle("is-active", isActive);
      });

      updateUrl(currentPage);

      if (scrollToBlog) {
        const blogSection = document.getElementById("blog");
        if (blogSection) scrollToTarget(blogSection);
      }
    };

    renderPageButtons();
    currentPage = getPageFromUrl();
    showPage(currentPage, false);

    pagination.addEventListener("click", (e) => {
      const target = e.target.closest("button");
      if (!target) return;

      if (target.dataset.blogNav === "prev" && currentPage > 1) {
        showPage(currentPage - 1, true);
        return;
      }

      if (target.dataset.blogNav === "next" && currentPage < totalPages) {
        showPage(currentPage + 1, true);
        return;
      }

      const page = parseInt(target.dataset.blogPage, 10);
      if (Number.isFinite(page) && page !== currentPage) {
        showPage(page, true);
      }
    });
  })();
})();
