const prefix = window.subPagePrefix || "";

(function ($) {

  "use strict";

  var projectFiles = [
      "P01_The_Valiant.html",
      "P02_Alters.html",
      "P03_Frostpunk.html",
      // "P02_Masik_Projekt.html",
    ];


  var init_slider = function() {
    var nav_swiper = new Swiper(".swiper.banner-nav-slider", {
      slidesPerView: "auto",
      spaceBetween: 10,
      observer: true,
      observeParents: true,
      watchSlidesProgress: true,
      breakpoints: {
        300: { spaceBetween: 15 },
        768: { spaceBetween: 30 },
        1200: { spaceBetween: 40 }
      }
    });
    // banner swiper slide
    var banner_swiper = new Swiper(".swiper.banner-slider", {
      slidesPerView: 1,
      // loop: true,
      speed: 900,
      autoplay: {
        delay: 4000,
      },
      thumbs: {
        swiper: nav_swiper,
      },
    });
    
    // banner bg image swiper
    var image_slider = new Swiper(".swiper.image-slider", {
      slidesPerView: 1,
      speed: 900,
    });
    
    // Update bg image
    function updatePagination() {
      image_slider.slideTo(banner_swiper.activeIndex);
    }
    
    // Listen to slide changes from both sliders
    banner_swiper.on('slideChange', updatePagination);

    // Portfolio Slider
    var wrapper = document.getElementById("dynamic-portfolio-wrapper");
    if (wrapper) {
      loadDynamicPortfolio(wrapper);
    } else {
      // Ha nincs ilyen wrapper (mert pl. nem az index.html-en vagyunk), 
      // de a HTML-ben mégis ott lenne a fix struktúra, akkor simán elindítja.
      initPortfolioSwiper();
    }
  }

  // Funkció, ami felépíti a swiper tartalmát a metaadatokból
  var loadDynamicPortfolio = function(wrapper) {
    var basePath = prefix + "portfolio/pages/";
    var loadedCount = 0;

    projectFiles.forEach(function(fileName) {
      fetch(basePath + fileName)
        .then(function(response) {
          if (!response.ok) throw new Error("Fájl nem található: " + fileName);
          return response.text();
        })
        .then(function(htmlString) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(htmlString, "text/html");

          // Metaadatok kiszedése az aloldalak fejlécéből
          var title = doc.querySelector('meta[name="portfolio-title"]')?.getAttribute("content") || fileName.replace(".html", "");
          var image = doc.querySelector('meta[name="portfolio-image"]')?.getAttribute("content") || "images/port-item1.jpg";
          var format = doc.querySelector('meta[name="portfolio-format"]')?.getAttribute("content") || "project";
          var formatColor = doc.querySelector('meta[name="portfolio-format-color"]')?.getAttribute("content") || "";

          // Dinamikus kép-útvonal igazítás a prefix-szel (ha kell)
          var finalImage = (image.indexOf('http') === 0) ? image : prefix + image;

          var slideHTML = `
            <div class="swiper-slide">
              <div class="image-holder">
                <a href="${basePath}${fileName}" title="${title} details">
                  <img src="${finalImage}" alt="${title}" class="img-fluid">
                </a>
              </div>
              <div class="caption d-flex justify-content-between align-items-center">
                <div class="title">${title}</div>
                <a href="${basePath}${fileName}" class="image-format ${formatColor}">${format}</a>
              </div>
            </div>
          `;

          wrapper.insertAdjacentHTML("beforeend", slideHTML);
          
          loadedCount++;
          if (loadedCount === projectFiles.length) {
            initPortfolioSwiper();
          }
        })
        .catch(function(err) {
          console.error("Hiba a projekt betöltése közben:", err);
          loadedCount++;
          if (loadedCount === projectFiles.length) {
            initPortfolioSwiper();
          }
        });
    });
  }

  // VÉGLEGES, JAVÍTOTT FUNKCIÓ: Portfólió kártyák legenerálása, Isotope indítás és magasság-igazítás
  var loadMasonryPortfolio = function(masonryWrapper) {
    var basePath = prefix + "portfolio/pages/";
    var loadedCount = 0;

    projectFiles.forEach(function(fileName) {
      fetch(basePath + fileName)
        .then(function(response) {
          if (!response.ok) throw new Error("Fájl nem található: " + fileName);
          return response.text();
        })
        .then(function(htmlString) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(htmlString, "text/html");

          // Metaadatok kiszedése
          var title = doc.querySelector('meta[name="portfolio-title"]')?.getAttribute("content") || fileName.replace(".html", "");
          var image = doc.querySelector('meta[name="portfolio-image"]')?.getAttribute("content") || "images/port-item1.jpg";
          
          var finalImage = (image.indexOf('http') === 0) ? image : prefix + image;

          // Bootstrap 'col' struktúra
          var itemHTML = `
            <div class="col">
              <div class="portfolio-card" style="margin-bottom: 20px;">
                <a href="${basePath}${fileName}" class="image-link" title="${title}">
                  <img src="${finalImage}" class="img-fluid standard-portfolio-img" alt="${title}" draggable="false" ondragstart="return false;">
                </a>
              </div>
            </div>
          `;

          masonryWrapper.insertAdjacentHTML("beforeend", itemHTML);
          
          loadedCount++;
          
          // Ha az összes kártya bekerült a helyére
          if (loadedCount === projectFiles.length) {
            // Frissítjük a lightboxot, hogy lehessen kattintani a képekre
            if (typeof initChocolat === 'function') {
              initChocolat();
            }
            // Frissítjük az AOS-t, hogy láthatóvá váljanak a kártyák
            if (typeof AOS !== 'undefined') {
              AOS.refresh();
            }
          }
        })
        .catch(function(err) {
          console.error("Hiba a masonry elem betöltésekor:", err);
        });
    });
  }

  // A te pontos Swiper beállításaid külön funkcióba téve
  var initPortfolioSwiper = function() {
    new Swiper(".portfolio-Swiper", {
      slidesPerView: 4,
      spaceBetween: 30,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        300: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });
  }

  // Animate Texts
  var initTextFx = function () {
    $('.txt-fx').each(function () {
      var newstr = '';
      var count = 0;
      var delay = 300;
      var stagger = 10;
      var words = this.textContent.split(/\s/);
      var arrWords = new Array();
      
      $.each( words, function( key, value ) {
        newstr = '<span class="word">';

        for ( var i = 0, l = value.length; i < l; i++ ) {
          newstr += "<span class='letter' style='transition-delay:"+ ( delay + stagger * count ) +"ms;'>"+ value[ i ] +"</span>";
          count++;
        }
        newstr += '</span>';

        arrWords.push(newstr);
        count++;
      });

      this.innerHTML = arrWords.join("<span class='letter' style='transition-delay:"+ delay +"ms;'>&nbsp;</span>");
    });
  }

  // init Isotope
  var initIsotope = function() {
    
    $('.grid').each(function(){

      // $('.grid').imagesLoaded( function() {
        // images have loaded
        var $buttonGroup = $( '.button-group' );
        var $checked = $buttonGroup.find('.is-checked');
        var filterValue = $checked.attr('data-filter');
  
        var $grid = $('.grid').isotope({
          itemSelector: '.portfolio-item',
          // layoutMode: 'fitRows',
          filter: filterValue
        });
    
        // bind filter button click
        $('.button-group').on( 'click', 'a', function(e) {
          e.preventDefault();
          filterValue = $( this ).attr('data-filter');
          $grid.isotope({ filter: filterValue });
        });
    
        // change is-checked class on buttons
        $('.button-group').each( function( i, buttonGroup ) {
          $buttonGroup.on( 'click', 'a', function() {
            $buttonGroup.find('.is-checked').removeClass('is-checked');
            $( this ).addClass('is-checked');
          });
        });
      // });

    });
  }

  // init Chocolat light box
  var initChocolat = function() {
    Chocolat(document.querySelectorAll('.image-link'), {
      imageSize: 'contain',
      loop: true,
    })
  }

  $(document).ready(function () {
    // load shared nav and sidebar partials via fetch for consistency with head.html
    //fetch('nav.html').then(function(r){ return r.text(); }).then(function(html){ document.getElementById('nav-placeholder').innerHTML = html; }).catch(function(err){ console.error('nav load failed', err); });
    //fetch('sidebar.html').then(function(r){ return r.text(); }).then(function(html){ document.getElementById('sidebar-placeholder').innerHTML = html; }).catch(function(err){ console.error('sidebar load failed', err); });
    var navFetch = fetch(prefix + 'nav.html').then(function(r){ return r.text(); }).then(function(html){ document.getElementById('nav-placeholder').innerHTML = html; });
    var sidebarFetch = fetch(prefix + 'sidebar.html').then(function(r){ return r.text(); }).then(function(html){ document.getElementById('sidebar-placeholder').innerHTML = html; });
    
    Promise.all([navFetch, sidebarFetch]).then(function() {
      init_slider();

      var masonryWrapper = document.getElementById("masonry-portfolio-wrapper");
      if (masonryWrapper) {
        loadMasonryPortfolio(masonryWrapper);
      }
    }).catch(function(err){ 
      console.error('Fetch load failed, fallback slider init', err);
      init_slider();
    });

    initTextFx();
    initChocolat();
    initIsotope();

    // mobile menu (delegated so it works for dynamically loaded nav)
    $(document).on('click', '.menu-btn', function(e){
      $('body').toggleClass('nav-active');
    });

    AOS.init({
      duration: 1200,
      // once: true,
    })
  });

  // preloader
	$(window).load(function() {
		// $("#overlayer").fadeOut("slow");
		$('body').addClass('loaded');
    initIsotope();
	});

})(jQuery);