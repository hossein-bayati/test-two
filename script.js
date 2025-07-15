'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const dotContainer = document.querySelector('.dots');
const links = document.querySelectorAll('.nav__link');
const navimage = document.querySelector('.nav__logo');
const navigation = document.querySelector('.nav');
const signIn = document.querySelector('.sign-in');
const signInInputs = document.querySelectorAll('.isvalid');
const btnConfirm = document.querySelector('.btn-confirm');

//?sign in
btnsOpenModal.forEach(item =>
  item.addEventListener('click', () => {
    if (signIn.classList.contains('hidden')) {
      signIn.classList.remove('hidden');
      signIn.scrollIntoView();
    } else {
      signIn.classList.add('hidden');
    }
  })
);

//?sing in confirm
btnConfirm.addEventListener('click', e => {
  signInInputs.forEach(inp => {
    if (inp.value === '') {
      e.target.classList.add('disabled');
      inp.classList.add('wrong');
    } else {
      e.target.classList.remove('disabled');
      inp.classList.remove('wrong');
      signIn.classList.add('hidden');
    }
  });
});

//?طراحی اسکرول نرم

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //دریافت ایدی سکشن ها
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//?نمایش متون در باکس

const tabContent = document.querySelectorAll('.operations__content');
const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');

tabContainer.addEventListener('click', function (e) {
  //برای اینکه کلیک روی اسپن داخل باتن اتفاق نیوفته از کلوزست استفاده میکنیم
  const click = e.target.closest('.operations__tab');

  if (!click) return;

  //حذف کلاس ها  برای شروع
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabContent.forEach(c => c.classList.remove('operations__content--active'));

  // فعال کردن حرکت دکمه ها به بالا
  click.classList.add('operations__tab--active');

  //فعال کردن نمایش محتوا
  document
    .querySelector(`.operations__content--${click.dataset.tab}`)
    .classList.add('operations__content--active');
});

//?بلور کردن ناویگیشن

const blurnavF = function (ev, opacity) {
  navigation.addEventListener(ev, function (e) {
    if (e.target.classList.contains('nav__link')) {
      const link = e.target;

      links.forEach(e => {
        if (e !== link) {
          e.style.opacity = opacity;
        }
      });
    }
  });
};
blurnavF('mouseover', 0.5);
blurnavF('mouseout', 1);

// ?چسبندگی ناویگیشن
//چون میخاهیم وقتی هدر تمام شد ناویگیشن چسبنده شود
const header = document.querySelector('.header');

const headerObsorver = new IntersectionObserver(
  function (entries) {
    const [entry] = entries;
    !entry.isIntersecting
      ? nav.classList.add('sticky')
      : nav.classList.remove('sticky');
  },
  { root: null, threshold: 0.1 }
);
headerObsorver.observe(header);

//?پیدایش سطر ها

const sections = document.querySelectorAll('.section');

const sectionObs = new IntersectionObserver(
  function (entries, obsorver) {
    const [entry] = entries;

    entry.target.classList.add('section--hidden');

    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');

    //جلوگیری از ران شدن دوباره ایونت
    obsorver.unobserve(entry.target);
  },
  { root: null, threshold: 0.1 }
);

sections.forEach(section => {
  sectionObs.observe(section);
});

//?بلورینگ تصاویر

const imgTargets = document.querySelectorAll('img[data-src]');

const imgObs = new IntersectionObserver(
  function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', () => {
      entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
  },
  {
    root: null,
    threshold: 0,
  }
);

imgTargets.forEach(imgs => {
  imgObs.observe(imgs);
});

//? اسلایدر

const slide = document.querySelectorAll('.slide');
const rightBtn = document.querySelector('.slider__btn--right');
const leftBtn = document.querySelector('.slider__btn--left');
const dots = document.querySelector('.dots');

const maxSlide = slide.length;
let currSlide = 0;

//functions
const goTo = function (cslide) {
  slide.forEach(function (e, i) {
    e.style.transform = `translateX(${100 * (i - cslide)}%)`;
  });
};

const nextSlide = function () {
  currSlide === maxSlide - 1 ? (currSlide = 0) : currSlide++;
  goTo(currSlide);
  activeDots(currSlide);
};

const prevSlide = function () {
  currSlide === 0 ? (currSlide = maxSlide - 1) : currSlide--;
  goTo(currSlide);
  activeDots(currSlide);
};

const createDots = function () {
  slide.forEach((_, i) => {
    dots.insertAdjacentHTML(
      'beforeend',
      `
    <button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activeDots = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(e => {
    e.classList.remove('dots__dot--active');

    document
      .querySelector(`.dots__dot[data-slide ="${slide}"]`)
      .classList.add('dots__dot--active');
  });
};

//start
goTo(0);
createDots();
activeDots(0);

rightBtn.addEventListener('click', nextSlide);
leftBtn.addEventListener('click', prevSlide);

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});

//?نقطه های تعویض اسلاید

dots.addEventListener('click', e => {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goTo(slide);
    activeDots(slide);
  }
});
