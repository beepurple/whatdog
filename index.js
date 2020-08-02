// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/K5kp2kt1p/";

let model, webcam, labelContainer, maxPredictions;

const breeds = {
  Bichon_Frise: "비숑 프리제",
  Pomeranian: "포메라니안",
  French_Bulldog: "프렌치 불독",
  Chihuahua: "치와와",
  Maltese: "말티즈",
  Toy_Poodle: "토이 푸들",
  welsh_corgi: "웰시코기",
};

const brd_epln = {
  Bichon_Frise: "비숑 프리제",
  Pomeranian: "포메라니안",
  French_Bulldog: "프렌치 불독",
  Chihuahua: "치와와",
  Maltese:
    "'말티즈'란 이름은 이 개가 지중해의 몰타(Malta) 섬이 원산지여서 붙여졌다는게 정설이지만 지중해의 멜리타 지역에서 유래되었다고 주장하는 학자들도 있다. 몸무게는 2~3kg이 평균이지만 큰 종의 경우 5kg까지 된다. 온몸이 순백색의 길고 부드러운 명주실 같은 털로 덮인 매우 아름다운 개로, 새까만 코끝과 어두운 색의 눈이 순백색의 털을 더욱 돋보이게 하고 있다. 지중해의 몰타 섬이 원산이라고 하여 이 이름이 붙여졌으나, 사실의 기록이나 전승은 전혀 없고 기원도 뚜렷하지 않다. 그러나 1800년 무렵 유럽·미국에 널리 알려졌으며 아름다운 모습과 온화하고 높은 지능을 지녀 애완용으로 널리 사육되었다. 그러나 몰티즈의 원산지는 이탈리아(이탈리아)로 되어 있다. 평균 수명이 15년 정도로 알려져 있다.",
  Toy_Poodle: "토이 푸들",
  welsh_corgi: "웰시코기",
};

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = 5; // model.getTotalClasses();

  // Convenience function to setup a webcam
  const flip = true; // whether to flip the webcam

  // append elements to the DOM
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    var element = document.createElement("div");
    element.classList.add("d-flex");
    labelContainer.appendChild(element);
  }
}

// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  var image = document.getElementById("dog-image");
  const prediction = await model.predict(image, false);

  prediction.sort(
    (a, b) => parseFloat(b.probability) - parseFloat(a.probability)
  );

  var predict_breed = prediction[0];

  var resultTitle = breeds[predict_breed.className];
  if (resultTitle === "") {
    resultTitle === "알수 없음";
  }

  var resultExplain = brd_epln[predict_breed.className];

  var title = "<div class=breeds-title>" + resultTitle + "</div>";
  var explain = "<div class='animal-explain pt-2'>" + resultExplain + "</div>";

  var resultMessage = title + explain;

  $(".result-message").html(resultMessage);

  var barWidth, probability;

  for (let i = 0; i < maxPredictions; i++) {
    probability = prediction[i].probability.toFixed(2);
    if (probability > 0.1) {
      barWidth = Math.round(probability * 100) + "%";
    } else if (probability >= 0.01) {
      barWidth = "4%";
    } else {
      barWidth = "2%";
    }

    var label =
      "<div class='breeds-label d-flex align-items-center'>" +
      breeds[prediction[i].className] +
      "</div>";

    var bar =
      "<div class='bar-container position-relative container'><div class=box-'" +
      i +
      "-style'></div><div class='d-flex justify-content-center align-items-center bar-" +
      i +
      "-style' style='width: " +
      barWidth +
      "'><span class='d-block percent-text'>" +
      Math.round(probability * 100) +
      "%</span></div></div>";

    labelContainer.childNodes[i].innerHTML = label + bar;
    console.log("HTML", label + bar);
  }
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $(".image-upload-wrap").hide();
      $("#loading").show();
      $(".file-upload-image").attr("src", e.target.result);
      $(".file-upload-content").show();
      $(".image-title").html(input.files[0].name);
    };
    reader.readAsDataURL(input.files[0]);
    init().then(() => {
      predict();
      $("#loading").hide();
    });
  } else {
    removeUpload();
  }
}

function removeUpload() {
  $(".file-upload-input").replaceWith($(".file-upload-input").clone());
  $(".file-upload-content").hide();
  $(".image-upload-wrap").show();
}
