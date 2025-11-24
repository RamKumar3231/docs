// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="introduction.html">Introduction</a></li><li class="chapter-item expanded affix "><li class="part-title">Getting Started</li><li class="chapter-item expanded "><a href="getting-started/prerequisites.html"><strong aria-hidden="true">1.</strong> Prerequisites</a></li><li class="chapter-item expanded "><a href="getting-started/installation.html"><strong aria-hidden="true">2.</strong> Installation</a></li><li class="chapter-item expanded "><a href="getting-started/configuration.html"><strong aria-hidden="true">3.</strong> Configuration</a></li><li class="chapter-item expanded "><a href="getting-started/initial-setup.html"><strong aria-hidden="true">4.</strong> Initial Setup</a></li><li class="chapter-item expanded affix "><li class="part-title">Architecture Overview</li><li class="chapter-item expanded "><a href="architecture/project-structure.html"><strong aria-hidden="true">5.</strong> Project Structure</a></li><li class="chapter-item expanded "><a href="architecture/provider-configuration.html"><strong aria-hidden="true">6.</strong> Provider Configuration</a></li><li class="chapter-item expanded "><a href="architecture/module-architecture.html"><strong aria-hidden="true">7.</strong> Module Architecture</a></li><li class="chapter-item expanded affix "><li class="part-title">Modules</li><li class="chapter-item expanded "><a href="modules/roles-module.html"><strong aria-hidden="true">8.</strong> Roles Module</a></li><li class="chapter-item expanded "><a href="modules/users-module.html"><strong aria-hidden="true">9.</strong> Users Module</a></li><li class="chapter-item expanded "><a href="modules/warehouse-module.html"><strong aria-hidden="true">10.</strong> Warehouse Module</a></li><li class="chapter-item expanded affix "><li class="part-title">Resources</li><li class="chapter-item expanded "><a href="resources/databases.html"><strong aria-hidden="true">11.</strong> Databases</a></li><li class="chapter-item expanded "><a href="resources/schemas.html"><strong aria-hidden="true">12.</strong> Schemas</a></li><li class="chapter-item expanded "><a href="resources/tables.html"><strong aria-hidden="true">13.</strong> Tables</a></li><li class="chapter-item expanded "><a href="resources/views.html"><strong aria-hidden="true">14.</strong> Views</a></li><li class="chapter-item expanded "><a href="resources/grants.html"><strong aria-hidden="true">15.</strong> Grants and Privileges</a></li><li class="chapter-item expanded affix "><li class="part-title">Usage Guide</li><li class="chapter-item expanded "><a href="usage/basic-usage.html"><strong aria-hidden="true">16.</strong> Basic Usage</a></li><li class="chapter-item expanded "><a href="usage/customizing-configuration.html"><strong aria-hidden="true">17.</strong> Customizing Configuration</a></li><li class="chapter-item expanded "><a href="usage/adding-new-resources.html"><strong aria-hidden="true">18.</strong> Adding New Resources</a></li><li class="chapter-item expanded "><a href="usage/best-practices.html"><strong aria-hidden="true">19.</strong> Best Practices</a></li><li class="chapter-item expanded affix "><li class="part-title">Reference</li><li class="chapter-item expanded "><a href="reference/variables.html"><strong aria-hidden="true">20.</strong> Variables Reference</a></li><li class="chapter-item expanded "><a href="reference/outputs.html"><strong aria-hidden="true">21.</strong> Outputs Reference</a></li><li class="chapter-item expanded "><a href="reference/module-inputs.html"><strong aria-hidden="true">22.</strong> Module Inputs</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
