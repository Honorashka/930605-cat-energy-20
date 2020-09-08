
  var navHeader = document.querySelector('.nav');
  var navToggle = document.querySelector('.nav__toggle');

  navHeader.classList.remove('nav--nojs');

  navToggle.addEventListener('click', function() {
    if (navHeader.classList.contains('nav--closed')) {
      navHeader.classList.remove('nav--closed');
      navHeader.classList.add('nav--opened');
    } else {
      navHeader.classList.add('nav--closed');
      navHeader.classList.remove('nav--opened');
    }
  });
