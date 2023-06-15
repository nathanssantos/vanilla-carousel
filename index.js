class VanillaCarousel {
  container;
  list;
  track;
  slides = [];
  dotList;
  dots = [];
  arrows = {
    left: null,
    right: null,
  };
  currentSlideIndex = 0;

  constructor(options) {
    this.init(options);
  }

  get listWidth() {
    return Number(window.getComputedStyle(this.list).width.split("px")[0]);
  }

  createElement = ({ classList, innerHTML, tagName = "div" } = {}) => {
    const element = document.createElement(tagName);

    if (Array.isArray(classList) && classList.length) {
      element.classList.add(...classList);
    }

    if (typeof innerHTML === "string") element.innerHTML = innerHTML;

    return element;
  };

  createSlides = (slides) => {
    slides.forEach((slide, index) => {
      const { classList, ...rest } = slide;

      let newSlideClassList = ["vanilla-carousel__slide", `slide-${index + 1}`];

      if (classList) newSlideClassList = [...newSlideClassList, ...classList];

      const newSlide = this.createElement({
        classList: newSlideClassList,
        ...rest,
      });

      this.slides.push(newSlide);
      this.track.append(newSlide);
    });
  };

  createDots = () => {
    this.dotList = this.createElement({
      classList: ["vanilla-carousel__dots"],
    });

    this.slides.forEach((slide, index) => {
      const newDot = this.createElement({
        classList: ["vanilla-carousel__dot", `dot-${index + 1}`],
        tagName: "button",
      });

      this.dots.push(newDot);

      this.dotList.append(newDot);
    });
  };

  createArrows = () => {
    this.arrows = {
      left: this.createElement({
        classList: ["vanilla-carousel__arrow", "arrow-left"],
        tagName: "button",
        innerHTML:
          '<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path></svg>',
      }),
      right: this.createElement({
        classList: ["vanilla-carousel__arrow", "arrow-right"],
        tagName: "button",
        innerHTML:
          '<svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path></svg>',
      }),
    };
  };

  setCurrentSlide = (index) => {
    let newIndex = index;

    if (index < 0) newIndex = 0;

    if (index > this.slides.length - 1) newIndex = this.slides.length - 1;

    this.currentSlideIndex = newIndex;

    this.track.style.left = `-${newIndex * this.listWidth}px`;

    this.dots.forEach((dot) => {
      dot.classList.remove("active");
    });

    this.dots[newIndex].classList.add("active");
  };

  handleSwipe = () => {
    let swipeXValue = 0;

    this.list.addEventListener("touchstart", (event) => {
      this.track.style.transition = "0s";
      swipeXValue =
        this.currentSlideIndex * this.listWidth +
        event.changedTouches[0].clientX;
    });

    this.list.addEventListener("touchmove", (event) => {
      const swipeXDifference =
        event.changedTouches[0].clientX -
        swipeXValue -
        this.currentSlideIndex * this.listWidth;

      const result = this.currentSlideIndex * this.listWidth + swipeXDifference;

      if (
        (this.currentSlideIndex < 1 && result > 0) ||
        result < -((this.slides.length - 1) * this.listWidth)
      ) {
        return;
      }

      this.track.style.left = `${result}px`;
    });

    this.list.addEventListener("touchend", (event) => {
      this.track.style.transition = "0.5s";

      const swipeXDifference = event.changedTouches[0].clientX - swipeXValue;

      if (
        swipeXDifference >
        -(this.currentSlideIndex * this.listWidth) - this.listWidth / 3
      ) {
        this.setCurrentSlide(this.currentSlideIndex - 1);
      }

      if (
        swipeXDifference <
        -(this.currentSlideIndex * this.listWidth) - this.listWidth / 3
      ) {
        this.setCurrentSlide(this.currentSlideIndex + 1);
      }

      swipeXValue = 0;
    });
  };

  update = () => {
    this.slides.forEach((slide) => {
      slide.style.width = `${this.listWidth}px`;
    });
    this.track.style.left = `-${this.currentSlideIndex * this.listWidth}px`;
  };

  bindEvents = () => {
    this.dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        this.setCurrentSlide(index);
      });
    });

    this.arrows.left.addEventListener("click", () => {
      this.setCurrentSlide(this.currentSlideIndex - 1);
    });

    this.arrows.right.addEventListener("click", () => {
      this.setCurrentSlide(this.currentSlideIndex + 1);
    });

    window.addEventListener("resize", () => {
      this.update();
    });

    this.handleSwipe();
  };

  init = ({ target, slides, height = "100%", initialSlideIndex = 0 }) => {
    if (
      !Array.isArray(slides) ||
      !slides.length ||
      !target instanceof HTMLElement
    ) {
      console.warn("Invalid VanillaCarousel constructor");
      return;
    }

    this.container = this.createElement({
      classList: ["vanilla-carousel"],
    });

    this.list = this.createElement({
      classList: ["vanilla-carousel__list"],
    });

    this.track = this.createElement({
      classList: ["vanilla-carousel__track"],
    });

    this.container.style.height = height;

    this.createSlides(slides);

    this.list.append(this.track);

    this.createDots();

    this.createArrows();

    this.container.append(
      this.list,
      this.arrows.left,
      this.arrows.right,
      this.dotList
    );

    target.append(this.container);

    this.setCurrentSlide(initialSlideIndex);

    this.bindEvents();

    this.update();
  };
}

new VanillaCarousel({
  height: "600px",
  target: document.body,
  slides: [
    {
      innerHTML: '<img src="https://picsum.photos/id/100/1280/720"/>',
    },
    {
      innerHTML: '<img src="https://picsum.photos/id/101/1280/720"/>',
    },
    {
      innerHTML: '<img src="https://picsum.photos/id/102/1280/720"/>',
    },
    {
      innerHTML: '<img src="https://picsum.photos/id/103/1280/720"/>',
    },
    {
      innerHTML: '<img src="https://picsum.photos/id/104/1280/720"/>',
    },
  ],
});
