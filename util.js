function isInViewport(element) {
	// https://www.javascripttutorial.net/dom/css/check-if-an-element-is-visible-in-the-viewport/
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

function debounce(func, ms) {
  // https://javascript.info/task/debounce
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), ms);
  };
};

