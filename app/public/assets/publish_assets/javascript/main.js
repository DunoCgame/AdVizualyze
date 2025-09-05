var slides = document.querySelectorAll("p");
var currentSlide = 0;

function showSlide() {
  for (var i = 0; i < slides.length; i++) {
    //slides[i].style.display = "none";
   	slides[i].classList.replace("ShowDisplay","NotDisplay");
  }
 // slides[currentSlide].style.display = "block";
 	slides[i].classList.replace("ShowDisplay","NotDisplay");
}

function nextSlide() {
  currentSlide++;
  if (currentSlide >= slides.length) {
    currentSlide = 0;
  }
  showSlide();
}

//setInterval(nextSlide, 3000);
document.queryselector