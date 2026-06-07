const prefix = window.subPagePrefix || "";

(function ($) {

  "use strict";

  var projectFiles = [
      "P010_Tifon.html",
      "P020_Lexus.html",
      "P030_Warhammer_40000_Inquisitor_Martyr.html",
      "P040_Titan_Quest_Atlantis.html",
      "P050_Iron_Throne.html",
      "P060_Kingdoms_of_Amalur_Re_Reckoning.html",
      "P070_Bullets_TVS.html",
      "P080_SuperPower_3.html",
      "P090_Post_Mortem.html",
      "P100_BrainLab.html",
      "P110_The_White_Wall.html",
      "P120_Lost_Survivors.html",
      "P130_After_The_Fall.html",
      "P140_The_Valiant.html",
      "P150_Pocats.html",
      "P160_Frostpunk.html",
      "P170_The_Alters.html",
      "P180_BONES.html",
      "P190_OTP.html",
      "P200_Halo.html",
      "P210_Ninja_Cats.html",
      "P220_Now_or_Never.html",
      "P230_Afterburn.html",
      "P240_NCIS.html",
      "P250_Semmelweis.html",
      "P260_Operation_Kabul.html",
      "P270_Delta_Force.html",
      "P280_War_Robots_Frontiers.html",
      "P290_Unannounced_Game.html",
      "P300_Unannounced_Movie.html"
    ];

  // Globális változó a Swiper példány eléréséhez az újraszámoláshoz
  var portfolioSwiperInstance = null;

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

    var banner_swiper = new Swiper(".swiper.banner-slider", {
      slidesPerView: 1,
      speed: 900,
      autoplay: {
        delay: 4000,
      },
      thumbs: {
        swiper: nav_swiper,
      },
    });
    
    var image_slider = new Swiper(".swiper.image-slider", {
      slidesPerView: 1,
      speed: 900,
    });
    
    function updatePagination() {
      image_slider.slideTo(banner_swiper.activeIndex);
    }
    
    banner_swiper.on('slideChange', updatePagination);

    var wrapper = document.getElementById("dynamic-portfolio-wrapper");
    if (wrapper) {
      loadDynamicPortfolio(wrapper);
    } else {
      initPortfolioSwiper();
    }
  }

  // Segédfunkció, ami megvárja a képek betöltődését a wrapperen belül, majd frissíti a komponenseket
  var waitForImagesAndRefresh = function(container) {
    var images = container.querySelectorAll('img');
    var loadedCount = 0;
    var totalImages = images.length;

    if (totalImages === 0) {
      refreshLayouts();
      return;
    }

    images.forEach(function(img) {
      if (img.complete) {
        onImageLoad();
      } else {
        img.addEventListener('load', onImageLoad);
        img.addEventListener('error', onImageLoad); // Hiba esetén is számolunk tovább
      }
    });

    function onImageLoad() {
      loadedCount++;
      if (loadedCount === totalImages) {
        refreshLayouts();
      }
    }

    function refreshLayouts() {
      // Ha a Swiper már létezik, kényszerítjük a frissítésre
      if (portfolioSwiperInstance) {
        portfolioSwiperInstance.update();
      }
      // AOS animációk újraszámolása
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
      // Ha Isotope-ot használsz ezen a részen is
      if ($('.grid').length) {
        $('.grid').isotope('layout');
      }
    }
  }

  var loadDynamicPortfolio = function(wrapper) {
    var basePath = prefix + "portfolio/pages/";
    var loadedCount = 0;
    var orderedSlides = new Array(projectFiles.length);

    projectFiles.forEach(function(fileName, index) {
      fetch(basePath + fileName)
        .then(function(response) {
          if (!response.ok) throw new Error("Fájl nem található: " + fileName);
          return response.text();
        })
        .then(function(htmlString) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(htmlString, "text/html");

          var title = doc.querySelector('meta[name="portfolio-title"]')?.getAttribute("content") || fileName.replace(".html", "");
          var image = doc.querySelector('meta[name="portfolio-image"]')?.getAttribute("content") || "images/port-item1.jpg";
          var format = doc.querySelector('meta[name="portfolio-format"]')?.getAttribute("content") || "project";
          var formatColor = doc.querySelector('meta[name="portfolio-format-color"]')?.getAttribute("content") || "";

          var finalImage = (image.indexOf('http') === 0) ? image : prefix + image;

          var slideHTML = `
            <div class="swiper-slide">
              <div class="title mb-2" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; text-align: left; font-weight: 500;">
                ${title}
              </div>
              <div class="image-holder">
                <a href="${basePath}${fileName}" title="${title} details">
                  <img src="${finalImage}" alt="${title}" class="img-fluid">
                </a>
              </div>
              <div class="caption d-flex justify-content-end align-items-center mt-2">
                <a href="${basePath}${fileName}" class="image-format ${formatColor}">${format}</a>
              </div>
            </div>
          `;

          orderedSlides[index] = slideHTML;
          loadedCount++;

          if (loadedCount === projectFiles.length) {
            orderedSlides.reverse().forEach(function(html) {
              if (html) wrapper.insertAdjacentHTML("beforeend", html);
            });
            initPortfolioSwiper();
            // FIGYELÉS INDÍTÁSA: Megvárjuk a képeket
            waitForImagesAndRefresh(wrapper);
          }
        })
        .catch(function(err) {
          console.error("Hiba a projekt betöltése közben:", err);
          loadedCount++;
          if (loadedCount === projectFiles.length) {
            orderedSlides.reverse().forEach(function(html) {
              if (html) wrapper.insertAdjacentHTML("beforeend", html);
            });
            initPortfolioSwiper();
            waitForImagesAndRefresh(wrapper);
          }
        });
    });
  }

  var loadMasonryPortfolio = function(masonryWrapper) {
    var basePath = prefix + "portfolio/pages/";
    var loadedCount = 0;
    var orderedCards = new Array(projectFiles.length);

    if (masonryWrapper) {
      masonryWrapper.className = "row row-cols-2 row-cols-lg-3 g-4 gy-4";
    }

    projectFiles.forEach(function(fileName, index) {
      fetch(basePath + fileName)
        .then(function(response) {
          if (!response.ok) throw new Error("Fájl nem található: " + fileName);
          return response.text();
        })
        .then(function(htmlString) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(htmlString, "text/html");

          var title = doc.querySelector('meta[name="portfolio-title"]')?.getAttribute("content") || fileName.replace(".html", "");
          var image = doc.querySelector('meta[name="portfolio-image"]')?.getAttribute("content") || "images/port-item1.jpg";
          var format = doc.querySelector('meta[name="portfolio-format"]')?.getAttribute("content") || "project";
          var formatColor = doc.querySelector('meta[name="portfolio-format-color"]')?.getAttribute("content") || "";
          
          var finalImage = (image.indexOf('http') === 0) ? image : prefix + image;

          var itemHTML = `
            <div class="col" style="padding: 12px;"> 
              <div class="portfolio-card" style="margin-bottom: 15px;">
                <div class="title mb-2" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; text-align: left; font-weight: 500; font-size: 0.95rem;">
                  ${title}
                </div>
                <a href="${basePath}${fileName}" title="${title}">
                  <img src="${finalImage}" class="img-fluid standard-portfolio-img" alt="${title}" draggable="false" ondragstart="return false;" style="width: 100%; display: block;">
                </a>
                <div class="caption d-flex justify-content-end align-items-center mt-2">
                  <a href="${basePath}${fileName}" class="image-format ${formatColor}">${format}</a>
                </div>
              </div>
            </div>
          `;

          orderedCards[index] = itemHTML;
          loadedCount++;
          
          if (loadedCount === projectFiles.length) {
            orderedCards.reverse().forEach(function(html) {
              if (html) masonryWrapper.insertAdjacentHTML("beforeend", html);
            });

            if (typeof initChocolat === 'function') {
              initChocolat();
            }
            // FIGYELÉS INDÍTÁSA a masonry elemekre is
            waitForImagesAndRefresh(masonryWrapper);
          }
        })
        .catch(function(err) {
          console.error("Hiba a masonry elem betöltésekor:", err);
          loadedCount++;
          if (loadedCount === projectFiles.length) {
            orderedCards.reverse().forEach(function(html) {
              if (html) masonryWrapper.insertAdjacentHTML("beforeend", html);
            });
            waitForImagesAndRefresh(masonryWrapper);
          }
        });
    });
  }

  var initPortfolioSwiper = function() {
    // Eltároljuk a példányt a globális változóba
    portfolioSwiperInstance = new Swiper(".portfolio-Swiper", {
      slidesPerView: 4,
      spaceBetween: 30,
      observer: true,         // Plusz védelem: figyelje a DOM változásokat
      observeParents: true,   // Figyelje a szülő elemek változását is
      mousewheel: {
        forceToAxis: true,
        sensitivity: 1,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 1,
      },
      breakpoints: {
        300: { slidesPerView: 2 },
        768: { slidesPerView: 2, spaceBetween: 20 },
        1200: { slidesPerView: 3, spaceBetween: 30 },
      },
    });
  }

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

  var initIsotope = function() {
    $('.grid').each(function(){
      var $buttonGroup = $( '.button-group' );
      var $checked = $buttonGroup.find('.is-checked');
      var filterValue = $checked.attr('data-filter');

      var $grid = $('.grid').isotope({
        itemSelector: '.portfolio-item',
        filter: filterValue
      });
  
      $('.button-group').on( 'click', 'a', function(e) {
        e.preventDefault();
        filterValue = $( this ).attr('data-filter');
        $grid.isotope({ filter: filterValue });
      });
  
      $('.button-group').each( function( i, buttonGroup ) {
        $buttonGroup.on( 'click', 'a', function() {
          $buttonGroup.find('.is-checked').removeClass('is-checked');
          $( this ).addClass('is-checked');
        });
      });
    });
  }

  var initChocolat = function() {
    Chocolat(document.querySelectorAll('.image-link'), {
      imageSize: 'contain',
      loop: true,
    })
  }

  $(document).ready(function () {
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

    $(document).on('click', '.menu-btn', function(e){
      $('body').toggleClass('nav-active');
    });

    AOS.init({
      duration: 1200,
    })
  });

  // JAVÍTVA: A modern jQuery-ben a $(window).load() hibát dobhat, az .on('load') a helyes!
  $(window).on('load', function() {
    $('body').addClass('loaded');
    initIsotope();
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  });

})(jQuery);