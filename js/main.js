document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const expanded = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(!expanded));
      menuBtn.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
      nav.classList.toggle("show", !expanded);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Open navigation");
        nav.classList.remove("show");
        menuBtn.focus();
      }
    });
  }

  const card = post => `
    <article class="post-card">
      <div class="post-image">${post.image}</div>
      <div class="post-body">
        <span class="tag">${post.category}</span>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <div class="meta">${post.date} · ${post.readTime}</div>
        <a class="read-link" href="${post.link}">Read article →</a>
      </div>
    </article>`;

  const latest = document.querySelector("#latest-posts");
  if (latest) latest.innerHTML = posts.map(card).join("");

  const all = document.querySelector("#all-posts");
  const search = document.querySelector("#search");
  const filters = document.querySelector("#filters");
  let selected = "All";

  if (all) {
    const categories = ["All", ...new Set(posts.map(p => p.category))];
    filters.innerHTML = categories.map(c => `<button class="filter ${c === selected ? "selected" : ""}" data-category="${c}" aria-pressed="${c === selected}">${c}</button>`).join("");

    const params = new URLSearchParams(location.search);
    const topic = params.get("topic");
    if (topic && categories.includes(topic)) selected = topic;

    function render() {
      const term = (search.value || "").toLowerCase();
      const filtered = posts.filter(p =>
        (selected === "All" || p.category === selected) &&
        `${p.title} ${p.category} ${p.excerpt}`.toLowerCase().includes(term)
      );
      all.innerHTML = filtered.length ? filtered.map(card).join("") : '<p class="empty">No articles found.</p>';
    }

    filters.addEventListener("click", e => {
      if (!e.target.matches(".filter")) return;
      selected = e.target.dataset.category;
      document.querySelectorAll(".filter").forEach(button => {
        button.classList.remove("selected");
        button.setAttribute("aria-pressed", "false");
      });
      e.target.classList.add("selected");
      e.target.setAttribute("aria-pressed", "true");
      render();
    });

    search.addEventListener("input", render);
    document.querySelectorAll(".filter").forEach(b => b.classList.toggle("selected", b.dataset.category === selected));
    render();
  }
});
