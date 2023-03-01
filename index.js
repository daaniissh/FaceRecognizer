Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("models"),
  faceapi.nets.faceExpressionNet.loadFromUri("models"),
]).then((res) => {
  beginVideo();
});
const VIDEO = document.getElementById("video");
async function beginVideo() {
  let stream = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    VIDEO.srcObject = stream;
  } catch (er) {
    alert("error while", er);
    console.log(er);
  }
}

VIDEO.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(VIDEO);
  document.body.appendChild(canvas);
  const dim = { width: VIDEO.width, height: VIDEO.height };
  faceapi.matchDimensions(canvas, dim);
  setInterval(async () => {
   const result = await faceapi
      .detectAllFaces(VIDEO, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
      const det = faceapi.resizeResults(result,dim)

      canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height)

      faceapi.draw.drawDetections(canvas,det)
      faceapi.draw.drawFaceLandmarks(canvas,det)
      faceapi.draw.drawFaceExpressions(canvas,det)
  }, 100);
});
