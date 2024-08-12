const fileInput = document.querySelector(".file-input"),
  filterOptions = document.querySelectorAll(".filter button"),
  filterName = document.querySelector(".filter-info .name"),
  filterValue = document.querySelector(".filter-info .value"),
  filterSlider = document.querySelector(".slider input"),
  rotateOptions = document.querySelectorAll(".rotate button"),
  previewImg = document.querySelector(".preview-img img"),
  resetFilterBtn = document.querySelector(".reset-filter"),
  chooseImgBtn = document.querySelector(".choose-img"),
  saveImgBtn = document.querySelector(".save-img");
  const removeImgBtn = document.querySelector(".remove-img");

const widthInput = document.getElementById("width-input");
const heightInput = document.getElementById("height-input");
const lockAspectRatio = document.getElementById("lock-aspect-ratio");
const reduceQuality = document.getElementById("reduce-quality");

let aspectRatio = 1;
let isAspectRatioLocked = false;
let quality = 1;

previewImg.addEventListener("load", () => {
  resetFilterBtn.click();
  document.querySelector(".container").classList.remove("disable");
  widthInput.value = previewImg.naturalWidth;
  heightInput.value = previewImg.naturalHeight;
  aspectRatio = previewImg.naturalWidth / previewImg.naturalHeight;
});

const updateSize = (isWidthChanged) => {
  if (isAspectRatioLocked) {
    if (isWidthChanged) {
      heightInput.value = Math.round(widthInput.value / aspectRatio);
    } else {
      widthInput.value = Math.round(heightInput.value * aspectRatio);
    }
  }
};

widthInput.addEventListener("change", () => updateSize(true));
heightInput.addEventListener("change", () => updateSize(false));

lockAspectRatio.addEventListener("click", () => {
  isAspectRatioLocked = !isAspectRatioLocked;
  lockAspectRatio.classList.toggle("active");
});

reduceQuality.addEventListener("click", () => {
  quality = quality === 1 ? 0.7 : 1;
  reduceQuality.classList.toggle("active");
});

let brightness = "100",
  saturation = "100",
  inversion = "0",
  grayscale = "0";
let rotate = 0,
  flipHorizontal = 1,
  flipVertical = 1;

const loadImage = () => {
  let file = fileInput.files[0];
  if (!file) return;
  previewImg.src = URL.createObjectURL(file);
  previewImg.addEventListener("load", () => {
    resetFilterBtn.click();
    document.querySelector(".container").classList.remove("disable");
  });
};

const applyFilter = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal}, ${flipVertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
};

const removeImage = () => {
  previewImg.src = "placeholder.png";
  document.querySelector(".container").classList.add("disable");
  resetFilterBtn.click();
};

filterOptions.forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelector(".active").classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;

    if (option.id === "brightness") {
      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else {
      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
  });
});

const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`;
  const selectedFilter = document.querySelector(".filter .active");

  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value;
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else {
    grayscale = filterSlider.value;
  }
  applyFilter();
};

rotateOptions.forEach((option) => {
  option.addEventListener("click", () => {
    if (option.id === "left") {
      rotate -= 90;
    } else if (option.id === "right") {
      rotate += 90;
    } else if (option.id === "horizontal") {
      flipHorizontal = flipHorizontal === 1 ? -1 : 1;
    } else {
      flipVertical = flipVertical === 1 ? -1 : 1;
    }
    applyFilter();
  });
});

const resetFilter = () => {
  brightness = "100";
  saturation = "100";
  inversion = "0";
  grayscale = "0";
  rotate = 0;
  flipHorizontal = 1;
  flipVertical = 1;
  widthInput.value = previewImg.naturalWidth;
  heightInput.value = previewImg.naturalHeight;
  aspectRatio = previewImg.naturalWidth / previewImg.naturalHeight;
  isAspectRatioLocked = false;
  lockAspectRatio.classList.remove("active");
  quality = 1;
  reduceQuality.classList.remove("active");
  filterOptions[0].click();
  applyFilter();
};

const saveImage = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = widthInput.value;
  canvas.height = heightInput.value;

  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  if (rotate !== 0) {
    ctx.rotate((rotate * Math.PI) / 180);
  }
  ctx.scale(flipHorizontal, flipVertical);
  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );

  const link = document.createElement("a");
  link.download = "image.jpg";
  link.href = canvas.toDataURL("image/jpeg", quality);
  link.click();
};

filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
removeImgBtn.addEventListener("click", removeImage);
saveImgBtn.addEventListener("click", saveImage);
fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());
