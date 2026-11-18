/* Interactive project browser for Eric's lasting portfolio.
   React components, props, state, conditional rendering and list keys. */
(function () {
  "use strict";

  const root = document.getElementById("react-projects-root");
  if (!root || !window.React || !window.ReactDOM || typeof ReactDOM.createRoot !== "function") {
    return; // Keep the original project links visible when the CDN is blocked.
  }

  const e = React.createElement;
  const useState = React.useState;

  const githubBase = "https://github.com/Eric2626/Web-programming-live-site/";
  const demoBase = "https://eric2626.github.io/Web-programming-live-site/";

  const projects = [
    {
      id: "memory-match",
      title: "Memory Match",
      category: "Team project",
      description: "A team-built browser game with timed challenges, practice, and a two-player mode.",
      technologies: ["JavaScript", "HTML", "CSS"],
      source: githubBase + "tree/main/teamproject",
      website: demoBase + "teamproject/index.html"
    },
    {
      id: "todo-list",
      title: "Interactive To-Do List",
      category: "JavaScript",
      description: "A JavaScript exercise in handling user actions and updating a task list.",
      technologies: ["JavaScript", "HTML", "CSS"],
      source: githubBase + "blob/main/week4/task3_interactive_todo_list.html",
      website: demoBase + "week4/task3_interactive_todo_list.html"
    },
    {
      id: "book-search",
      title: "Book Search",
      category: "Web APIs",
      description: "A search page that fetches book data and displays matching titles.",
      technologies: ["JavaScript", "HTML", "CSS"],
      source: githubBase + "blob/main/week7/book-search.html",
      website: demoBase + "week7/book-search.html"
    },
    {
      id: "student-directory",
      title: "Student Directory",
      category: "React components",
      description: "Three student profile cards built with reusable React components and props.",
      technologies: ["React", "JavaScript", "CSS"],
      source: githubBase + "tree/main/week11/task11",
      website: demoBase + "week11/task11/live/index.html"
    },
    {
      id: "course-catalog",
      title: "Course Catalog",
      category: "React practice",
      description: "A React course list using props, map(), and required or elective badges.",
      technologies: ["React", "JavaScript", "CSS"],
      source: githubBase + "tree/main/week11/course-catalog",
      website: demoBase + "week11/course-catalog/live/index.html"
    },
    {
      id: "counter-history",
      title: "Counter with History",
      category: "React state",
      description: "A counter with increment, decrement, reset, undo and the last five values.",
      technologies: ["React", "JavaScript", "CSS"],
      source: githubBase + "blob/main/week12/counter-with-history/index.html",
      website: demoBase + "week12/counter-with-history/index.html"
    },
    {
      id: "shopping-cart",
      title: "Shopping Cart",
      category: "React state",
      description: "An interactive product catalog with quantity controls, automatic totals and a demo checkout.",
      technologies: ["React", "JavaScript", "CSS"],
      source: githubBase + "blob/main/week12/shopping-cart.html",
      website: demoBase + "week12/shopping-cart.html"
    },
    {
      id: "word-counter",
      title: "Live Word Counter",
      category: "React state",
      description: "A live text editor that counts words, characters and sentences using React state.",
      technologies: ["React", "JavaScript", "CSS"],
      source: githubBase + "blob/main/week12/word-counter.html",
      website: demoBase + "week12/word-counter.html"
    }
  ];

  const categories = ["All", "React", "JavaScript", "Saved"];

  function ProjectCard({ project, number, saved, onToggle }) {
    return e("li", null,
      e("span", {className: "project-meta"}, String(number).padStart(2, "0") + " / " + project.category),
      e("h3", null, e("a", {href: project.website}, project.title)),
      e("p", null, project.description),
      e("div", {className: "project-tech", "aria-label": "Technologies"},
        project.technologies.map(technology => e("span", {key: technology}, technology))
      ),
      e("div", {className: "project-actions"},
        e("a", {href: project.website, target: "_blank", rel: "noopener noreferrer"}, "Open Website ↗"),
        e("a", {href: project.source, target: "_blank", rel: "noopener noreferrer"}, "GitHub Code ↗"),
        e("button", {type: "button", className: saved ? "react-filter-button selected" : "react-filter-button", "aria-pressed": saved, "aria-label": (saved ? "Unsave " : "Save ") + project.title, onClick: () => onToggle(project.id)}, saved ? "★ Saved" : "☆ Save")
      )
    );
  }

  function FilterBar({ selected, onSelect }) {
    return e("div", {className: "react-filter-bar", role: "group", "aria-label": "Filter projects by technology"},
      categories.map(category => e("button", {
        key: category,
        type: "button",
        className: selected === category ? "react-filter-button selected" : "react-filter-button",
        "aria-pressed": selected === category,
        onClick: () => onSelect(category)
      }, category))
    );
  }

  function ProjectBrowser() {
    const [selected, setSelected] = useState("All");
    const [search, setSearch] = useState("");
    const [saved, setSaved] = useState([]);
    function toggleSaved(id) {
      setSaved(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    }

    const visible = projects.filter(project => {
      const matchesFilter = selected === "Saved" ? saved.includes(project.id) : selected === "All" || project.technologies.includes(selected);
      const matchesSearch = (project.title + " " + project.description + " " +
        project.technologies.join(" ")).toLowerCase().includes(search.trim().toLowerCase());
      return matchesFilter && matchesSearch;
    });

    return e(React.Fragment, null,
      e("div", {className: "react-project-controls"},
        e(FilterBar, {selected, onSelect: setSelected}),
        e("label", {className: "react-search-label"},
          e("span", {className: "visually-hidden"}, "Search projects"),
          e("input", {
            className: "react-search-field",
            type: "search",
            placeholder: "Search projects",
            value: search,
            onChange: event => setSearch(event.target.value)
          })
        )
      ),
      e("p", {className: "react-project-count", "aria-live": "polite"},
        "Showing " + visible.length + " of " + projects.length + " projects"
      ),
      visible.length
        ? e("ul", {className: "projects", role: "list"},
            visible.map((project, i) => e(ProjectCard, {
              key: project.id,
              project: project,
              number: i + 1,
              saved: saved.includes(project.id),
              onToggle: toggleSaved
            }))
          )
        : e("p", {className: "react-no-results"}, selected === "Saved" && saved.length === 0 ? "No saved projects yet. Select All and save a project." : "No matching projects. Try another search or filter.")
    );
  }

  ReactDOM.createRoot(root).render(e(ProjectBrowser));
}());
