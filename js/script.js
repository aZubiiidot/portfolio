const prefix = window.subPagePrefix || "";

(function ($) {

  "use strict";

  // List of project HTML files to fetch dynamically
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

  var blogPages = [
    "BL010_Tool.html",
    "BL020_Tool.html",
    "BL030_Tool.html",
    "BL040_Tool.html",
    "BL050_Tool.html",
    "BL060_Tool.html",
    "BL070_Tool.html",
    "BL080_Tool.html",
    "BL090_Tool.html"

  ];

  // Initialize main banners and slider modules
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

  // Fetch and build portfolio slider items for the index page
  var loadDynamicPortfolio = function(wrapper) {
    var basePath = prefix + "portfolio/pages/";
    var loadedCount = 0;
    var orderedSlides = new Array(projectFiles.length);

    projectFiles.forEach(function(fileName, index) {
      fetch(basePath + fileName)
        .then(function(response) {
          if (!response.ok) throw new Error("File not found: " + fileName);
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
          }
        })
        .catch(function(err) {
          console.error("Error loading project:", err);
          loadedCount++;
          if (loadedCount === projectFiles.length) {
            orderedSlides.reverse().forEach(function(html) {
              if (html) wrapper.insertAdjacentHTML("beforeend", html);
            });
            initPortfolioSwiper();
          }
        });
    });
  }

  // Fetch and build 3-column grid items for the portfolio subpage
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
          if (!response.ok) throw new Error("File not found: " + fileName);
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
            if (typeof AOS !== 'undefined') {
              AOS.refresh();
            }
          }
        })
        .catch(function(err) {
          console.error("Error loading masonry item:", err);
          loadedCount++;
          if (loadedCount === projectFiles.length) {
            orderedCards.reverse().forEach(function(html) {
              if (html) masonryWrapper.insertAdjacentHTML("beforeend", html);
            });
          }
        });
    });
  }

  var loadDynamicBlog = function(blogWrapper) {
    var basePath = prefix + "blog/pages/";
    var loadedCount = 0;
    
    // Biztonságos másolat készítése és precíz szám-alapú csökkenő rendezés (Regex segítségével)
    var sortedPages = [...blogPages].sort(function(a, b) {
      var getNum = function(str) {
        var match = str.match(/\d+/); // Kimásolja a számjegyeket (pl. "BL090"-ből "090"-et)
        return match ? parseInt(match[0], 10) : 0;
      };
      return getNum(b) - getNum(a);
    });

    var orderedPosts = new Array(sortedPages.length);

    sortedPages.forEach(function(fileName, index) {
      fetch(basePath + fileName)
        .then(function(response) {
          if (!response.ok) throw new Error("File not found: " + fileName);
          return response.text();
        })
        .then(function(htmlString) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(htmlString, "text/html");

          var title = doc.querySelector('meta[name="blog-title"]')?.getAttribute("content") || fileName.replace(".html", "");
          var image = doc.querySelector('meta[name="blog-image"]')?.getAttribute("content") || "images/post-image1.jpg";
          var category = doc.querySelector('meta[name="blog-category"]')?.getAttribute("content") || "Uncategorized";
          var date = doc.querySelector('meta[name="blog-date"]')?.getAttribute("content") || "DD-MM-YYYY";
          var description = doc.querySelector('meta[name="blog-description"]')?.getAttribute("content") || "";

          var finalImage = (image.indexOf('http') === 0) ? image : prefix + image;

          var postHTML = `
            <div class="col-lg-6">
              <article class="post-item pb-5">
                <div class="post-meta d-flex gap-3 my-4">
                  <span class="post-category">
                    <i class="fa-regular fa-folder me-1"></i> ${category}
                  </span>
                  <span class="meta-day">
                    <i class="fa-regular fa-clock me-1"></i> ${date}
                  </span>
                </div>
                <div class="post-image overflow-hidden" style="position: relative;">
                  <a href="${basePath}${fileName}">
                    <img src="${finalImage}" alt="${title}" class="post-grid-image img-fluid" style="transition: transform 0.5s ease; display: block; width: 100%;">
                  </a>
                </div>
                <div class="post-content">
                  <h3 class="post-title my-4">
                    <a href="${basePath}${fileName}" class="text-decoration-none">${title}</a>
                  </h3>
                  <p class="fillingText">${description}</p>
                </div>
                <a href="${basePath}${fileName}" class="text-decoration-underline">Read More</a>
              </article>
            </div>
          `;

          orderedPosts[index] = postHTML;
          loadedCount++;

          if (loadedCount === sortedPages.length) {
            orderedPosts.forEach(function(html) {
              if (html) blogWrapper.insertAdjacentHTML("beforeend", html);
            });

            if (typeof AOS !== 'undefined') {
              AOS.init();
            }
          }
        })
        .catch(function(err) {
          console.error("Error loading blog post:", err);
          loadedCount++;
          if (loadedCount === sortedPages.length) {
            orderedPosts.forEach(function(html) {
              if (html) blogWrapper.insertAdjacentHTML("beforeend", html);
            });
          }
        });
    });
  }

  var loadRecentBlog = function(wrapper) {
    var basePath = prefix + "blog/pages/";
    var loadedCount = 0;
    var maxRecent = 3;
    
    // Biztonságos másolat készítése és precíz szám-alapú csökkenő rendezés (Regex segítségével)
    var sortedPages = [...blogPages].sort(function(a, b) {
      var getNum = function(str) {
        var match = str.match(/\d+/); // Kimásolja a számjegyeket (pl. "BL090"-ből "090"-et)
        return match ? parseInt(match[0], 10) : 0;
      };
      return getNum(b) - getNum(a);
    });

    // Csak az első 3 legfrissebb poszt kivágása
    var recentPages = sortedPages.slice(0, maxRecent);
    var orderedPosts = new Array(recentPages.length);

    recentPages.forEach(function(fileName, index) {
      fetch(basePath + fileName)
        .then(function(response) {
          if (!response.ok) throw new Error("File not found: " + fileName);
          return response.text();
        })
        .then(function(htmlString) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(htmlString, "text/html");

          var title = doc.querySelector('meta[name="blog-title"]')?.getAttribute("content") || fileName.replace(".html", "");
          var image = doc.querySelector('meta[name="blog-image"]')?.getAttribute("content") || "images/post-image1.jpg";
          var category = doc.querySelector('meta[name="blog-category"]')?.getAttribute("content") || "Uncategorized";
          var date = doc.querySelector('meta[name="blog-date"]')?.getAttribute("content") || "DD-MM-YYYY";
          var description = doc.querySelector('meta[name="blog-description"]')?.getAttribute("content") || "";

          var finalImage = (image.indexOf('http') === 0) ? image : prefix + image;

          var postHTML = `
            <div class="recent-post-card row g-0 align-items-center mb-4 pb-4 border-bottom">
              <div class="col-4 col-sm-3 col-md-2 overflow-hidden" style="aspect-ratio: 1/1; border-radius: 0px;">
                <a href="${basePath}${fileName}">
                  <img src="${finalImage}" alt="${title}" class="img-fluid w-100 h-100" style="object-fit: cover; transition: transform 0.4s ease; display: block;">
                </a>
              </div>
              <div class="col-8 col-sm-9 col-md-10 ps-3 ps-sm-4">
                <div class="post-meta d-flex gap-2 gap-sm-3 mb-1" style="font-size: 0.8rem; color: var(--text-muted);">
                  <span><i class="fa-regular fa-folder me-1"></i> ${category}</span>
                  <span><i class="fa-regular fa-clock me-1"></i> ${date}</span>
                </div>
                <h4 class="mb-1" style="font-family: 'Oswald', sans-serif; font-size: 1.35rem; line-height: 1.2;">
                  <a href="${basePath}${fileName}" class="text-decoration-none text-white hover-red-title">${title}</a>
                </h4>
                <p class="fillingText mb-0 d-none d-md-block" style="font-size: 0.9rem; line-height: 1.3;">
                  ${description}
                </p>
              </div>
            </div>
          `;

          orderedPosts[index] = postHTML;
          loadedCount++;

          if (loadedCount === recentPages.length) {
            orderedPosts.forEach(function(html) {
              if (html) wrapper.insertAdjacentHTML("beforeend", html);
            });
            if (typeof AOS !== 'undefined') {
              AOS.init();
            }
          }
        })
        .catch(function(err) {
          console.error("Error loading recent post:", err);
          loadedCount++;
          if (loadedCount === recentPages.length) {
            orderedPosts.forEach(function(html) {
              if (html) wrapper.insertAdjacentHTML("beforeend", html);
            });
          }
        });
    });
  }

  // Initialize the main portfolio Swiper instance with DOM mutation tracking
  var initPortfolioSwiper = function() {
    new Swiper(".portfolio-Swiper", {
      slidesPerView: 4,
      spaceBetween: 30,
      observer: true,         // Re-init Swiper when slides are added via fetch
      observeParents: true,   // Re-init Swiper when container styles change
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
        300: { slidesPerView: 3 },
        768: { slidesPerView: 3, spaceBetween: 20 },
        992: { slidesPerView: 3, spaceBetween: 30 }
      }
    });
  }

  // Split text into individual letters for CSS delay animations
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

  // Initialize Isotope filtering grid
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

  // Initialize Chocolat light box gallery
  var initChocolat = function() {
    Chocolat(document.querySelectorAll('.image-link'), {
      imageSize: 'contain',
      loop: true,
    })
  }

  // Document Ready trigger
  $(document).ready(function () {
    var navFetch = fetch(prefix + 'nav.html').then(function(r){ return r.text(); }).then(function(html){ document.getElementById('nav-placeholder').innerHTML = html; });
    var sidebarFetch = fetch(prefix + 'sidebar.html').then(function(r){ return r.text(); }).then(function(html){ document.getElementById('sidebar-placeholder').innerHTML = html; });
    
    Promise.all([navFetch, sidebarFetch]).then(function() {
      init_slider();

      var masonryWrapper = document.getElementById("masonry-portfolio-wrapper");
      if (masonryWrapper) {
        loadMasonryPortfolio(masonryWrapper);
      }
      var blogWrapper = document.getElementById("dynamic-blog-wrapper");
      if (blogWrapper) {
        /*console.log("1. Megvan a blog konténer a HTML-ben, indítom a betöltést.");*/
        loadDynamicBlog(blogWrapper);
      }
      var recentBlogWrapper = document.getElementById("recent-blog-wrapper");
      if (recentBlogWrapper) {
        loadRecentBlog(recentBlogWrapper);
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

  // Window Load trigger to handle final asset positioning
  $(window).on('load', function() {
    $('body').addClass('loaded');
    initIsotope();
    
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  });

})(jQuery);