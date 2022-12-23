"use strict";

// Variables
var bodyWith = document.getElementsByTagName('body')[0].clientWidth;

// Ejecutar funciones
window.addEventListener('load', function () {
  // headerScripts();
  // if ( bodyWith <= 568  ){

  //    footerScripts();

  // }
});

// Funciones
var headerScripts = function headerScripts() {
  // Variables

  var headerMain = document.querySelector('header');
  var mainNav = headerMain.querySelector('.mainNav--menu');
  var nav__levelTwo = document.querySelectorAll('header .mainNav--menu ol.level--two');
  var nav__levelThree = document.querySelectorAll('header .mainNav--menu ul.level--three');
  var li__Global = mainNav.querySelectorAll('ul.level--one li');
  var li__levelOne = mainNav.querySelectorAll('ul.level--one li a.actionDrop');
  var li__levelTwo = mainNav.querySelectorAll('ol.level--two li');
  var closeMenu = document.querySelector('.mobileActions--toggleMenu');
  closeMenu.addEventListener('click', function () {
    mainNav.classList.toggle('activeMenuMobile');
  });

  // Actions for desktop
  if (bodyWith > 768) {
    li__Global.forEach(function (m) {
      m.addEventListener('mouseover', openDropsLevelTwo);
    });
    li__levelTwo.forEach(function (m) {
      m.addEventListener('mouseover', openDropsLevelThree);
    });
  } else {
    // For mobile
    // Open drop level one
    li__levelOne.forEach(function (m, index) {
      m.addEventListener('click', function (event) {
        openDropsLevelTwo(m, index);
        event.stopPropagation();
      });
    });
    // Open drop level two
    li__levelTwo.forEach(function (m, index) {
      m.addEventListener('click', function (event) {
        m.classList.add('activeLinkDrop');
        openDropsLevelThree(m, index);
        event.stopPropagation();
      });
    });
  }

  // Accion para cerrar nav
  // Descomentar al final
  nav__levelTwo.forEach(function (m) {
    m.addEventListener('mouseleave', closeNav);
  });

  // Funciones

  // Interactuar con los enlaces
  function openDropsLevelTwo(e, pos) {
    // Desktop actions
    if (bodyWith > 768) {
      // Remover clase active a todos los ul
      nav__levelTwo.forEach(function (n) {
        if (n.classList.contains('activeMenu')) {
          n.classList.remove('activeMenu');
        }
      });
      // Si existe submenu agregar clase activa
      if (this.querySelector('ol') != null) {
        this.querySelector('ol').classList.add('activeMenu');
      }
    } else {
      // Mobile actions
      // Start for level two
      // clean class
      nav__levelTwo.forEach(function (m) {
        if (m.classList.contains('activeMenu')) {
          m.classList.remove('activeMenu');
        }
      });
      // Add class
      nav__levelTwo[pos].classList.add('activeMenu');
      // Create back btn
      var parr = document.createElement('div');
      parr.classList.add('link-back-menu');
      // Text brother elements
      parr.textContent = nav__levelTwo[pos].previousElementSibling.textContent;
      // Add div to ul
      nav__levelTwo[pos].insertBefore(parr, nav__levelTwo[pos].firstChild);
      // If exists action back btn
      if (document.getElementsByClassName('link-back-menu').length > 0) {
        document.getElementsByClassName('link-back-menu')[0].addEventListener('click', function (n) {
          n.currentTarget.remove();
          nav__levelTwo.forEach(function (m) {
            if (m.classList.contains('activeMenu')) {
              m.classList.remove('activeMenu');
            }
          });
        });
      }
      ;
      // End level two
    }
    // End
  }
  ;

  // Open ul level three
  function openDropsLevelThree(e, pos) {
    // Desktop actions
    if (bodyWith > 768) {
      // Limpiar clase
      document.querySelectorAll('.level--two--cta-link').forEach(function (m) {
        if (m.classList.contains('visible-cta')) {
          m.classList.remove('visible-cta');
        }
      });
      nav__levelThree.forEach(function (m) {
        if (m.classList.contains('activeMenu')) {
          m.classList.remove('activeMenu');
        }
      });

      // If cta exists
      if (this.querySelector('.level--two--cta-link') != null) {
        this.querySelector('.level--two--cta-link').classList.add('visible-cta');
      }
      // Si existe submenu agregar clase activa
      if (this.querySelector('ul') != null) {
        this.querySelector('ul').classList.add('activeMenu');
      }
    } else {
      document.querySelectorAll('.level--three').forEach(function (m) {
        if (m.classList.contains('activeDrop')) {
          m.classList.remove('activeDrop');
        }
      });
      if (e.querySelector('.level--three') != null) {
        e.querySelector('.level--three').classList.toggle('activeDrop');
      }
    }
    // End
  }

  // Close global menu
  function closeNav() {
    // Remover clase active a todos los ul
    nav__levelTwo.forEach(function (n) {
      if (n.classList.contains('activeMenu')) {
        n.classList.remove('activeMenu');
      }
    });
  }

  // Funcion cuando se haga scroll 
  window.addEventListener('scroll', function () {
    if (window.scrollY < headerMain.clientHeight) {
      if (headerMain.classList.contains('sticky-nav')) {
        headerMain.classList.remove('sticky-nav');
      }
      headerMain.classList.add('down-effect');
    } else {
      if (headerMain.classList.contains('down-effect')) {
        headerMain.classList.remove('down-effect');
      }
      headerMain.classList.add('sticky-nav');
    }
  });
};

// Funcion para accordeon sencillo
var accordeonSection = function accordeonSection(selector) {
  var accordeonBtn = Array.from(document.querySelector(selector + ' .accordeon-init').querySelectorAll('.accordeon-btn'));
  accordeonBtn.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      for (var i = 0; i < document.querySelectorAll("".concat(selector, " .accordeon-btn")).length; i++) {
        document.querySelectorAll("".concat(selector, " .accordeon-btn"))[i].parentNode.classList.contains('accordeon-active') && document.querySelectorAll("".concat(selector, " .accordeon-btn"))[i].parentNode.classList.remove('accordeon-active');
      }

      // Deshabilitar links en enlaces del head
      e.currentTarget.querySelectorAll('a').forEach(function (m) {
        m.addEventListener('click', function (e) {
          return e.preventDefault();
        });
      });

      // Toggle clase activa
      // e.parentNode.classList.contains('accordeon-active') && e.parentNode.classList.remove('accordeon-active');

      // Toggle clase activa
      e.currentTarget.parentNode.classList.toggle('accordeon-active');
      e.currentTarget.parentNode.parentNode.querySelector('.accordeon-box') != null && e.currentTarget.parentNode.parentNode.querySelector('.accordeon-box').classList.toggle('active');
    });
  });

  // console.log(accordeonBtn);
  // console.log(accordeonBox);
};