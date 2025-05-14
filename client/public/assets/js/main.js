/*
* Template Name: Arsha
* Template URL: https://bootstrapmade.com/arsha-free-bootstrap-html-template-corporate/
* Updated: Feb 22 2025 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  document.addEventListener('DOMContentLoaded', () => {
    /**
     * Apply .scrolled class to the body as the page is scrolled down
     */
    function toggleScrolled() {
      const selectBody = document.querySelector('body');
      const selectHeader = document.querySelector('#header');
      if (!selectHeader || (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top'))) return;
      window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
    }

    document.addEventListener('scroll', toggleScrolled);
    toggleScrolled();

    /**
     * Mobile nav toggle
     */
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

    function mobileNavToogle() {
      document.body.classList.toggle('mobile-nav-active');
      mobileNavToggleBtn?.classList.toggle('bi-list');
      mobileNavToggleBtn?.classList.toggle('bi-x');
    }

    mobileNavToggleBtn?.addEventListener('click', mobileNavToogle);

    /**
     * Hide mobile nav on same-page/hash links
     */
    document.querySelectorAll('#navmenu a').forEach(navmenu => {
      navmenu.addEventListener('click', () => {
        if (document.querySelector('.mobile-nav-active')) {
          mobileNavToogle();
        }
      });
    });

    /**
     * Toggle mobile nav dropdowns
     */
    document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
      navmenu.addEventListener('click', function(e) {
        e.preventDefault();
        this.parentNode.classList.toggle('active');
        this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
        e.stopImmediatePropagation();
      });
    });

    /**
     * Preloader
     */
    const preloader = document.querySelector('#preloader');
    preloader?.remove();

    /**
     * Scroll top button
     */
    const scrollTop = document.querySelector('.scroll-top');

    function toggleScrollTop() {
      if (scrollTop) {
        window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
      }
    }

    scrollTop?.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    toggleScrollTop();
    document.addEventListener('scroll', toggleScrollTop);

    /**
     * Animation on scroll function and init
     */
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });

    /**
     * Initiate glightbox
     */
    const glightbox = GLightbox({ selector: '.glightbox' });

    /**
     * Init swiper sliders
     */
    document.querySelectorAll('.init-swiper').forEach(swiperElement => {
      const config = JSON.parse(swiperElement.querySelector('.swiper-config')?.textContent?.trim() || '{}');
      new Swiper(swiperElement, config);
    });

    /**
     * Frequently Asked Questions Toggle
     */
    document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach(faqItem => {
      faqItem.addEventListener('click', () => {
        faqItem.parentNode.classList.toggle('faq-active');
      });
    });

    /**
     * Init isotope layout and filters
     */
    document.querySelectorAll('.isotope-layout').forEach(isotopeItem => {
      const layout = isotopeItem.getAttribute('data-layout') || 'masonry';
      const filter = isotopeItem.getAttribute('data-default-filter') || '*';
      const sort = isotopeItem.getAttribute('data-sort') || 'original-order';
      imagesLoaded(isotopeItem.querySelector('.isotope-container'), () => {
        const initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort
        });

        isotopeItem.querySelectorAll('.isotope-filters li').forEach(filterBtn => {
          filterBtn.addEventListener('click', () => {
            isotopeItem.querySelector('.filter-active')?.classList.remove('filter-active');
            filterBtn.classList.add('filter-active');
            initIsotope.arrange({ filter: filterBtn.getAttribute('data-filter') });
            AOS.refresh();
          });
        });
      });
    });

    /**
     * Navmenu Scrollspy
     */
    const navmenulinks = document.querySelectorAll('.navmenu a');

    function navmenuScrollspy() {
      const position = window.scrollY + 200;
      navmenulinks.forEach(link => {
        if (!link.hash) return;
        const section = document.querySelector(link.hash);
        if (!section) return;
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          document.querySelector('.navmenu a.active')?.classList.remove('active');
          link.classList.add('active');
        }
      });
    }

    navmenuScrollspy();
    document.addEventListener('scroll', navmenuScrollspy);
  });
})();
