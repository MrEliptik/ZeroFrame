let uploadProgress = []
const progressBar = document.getElementById('progress-bar');
const buttonUpload = document.querySelector('.button-upload');
const uploadHistory = document.getElementById('upload-history');
const trash = document.querySelector('.trash-transparent');
var itemPreviewProcessed = 0;
var numberOfFiles = 0;
var filesToBeUploaded = [];
var currentFilesUploaded = false;
var images = [];

// ************************ Drag and drop ***************** //
let dropArea = document.getElementById("drop-area");

// Prevent default drag behaviors
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);  
  document.body.addEventListener(eventName, preventDefaults, false);
})

// Highlight drop area when item is dragged over it
;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
})

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

function preventDefaults (e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) {
  dropArea.classList.add('highlight');
}

function unhighlight(e) {
  dropArea.classList.remove('highlight');
}

function handleDrop(e) {
  if(currentFilesUploaded === true){
    currentFilesUploaded = false;
    progressBar.style.display = "none";
    buttonUpload.style.display = "none";
    let gallery = document.getElementById('gallery');
    while (gallery.firstChild) {
      gallery.removeChild(gallery.firstChild);
    }
    filesToBeUploaded = [];
    itemPreviewProcessed = 0;
    console.log(filesToBeUploaded);
  }
  var dt = e.dataTransfer;
  var files = dt.files;

  handleFiles(files);
}

// **************************** Drag and drop ************************ //

function initializeProgress(numFiles) {
  
  progressBar.value = 0;
  uploadProgress = [];

  for(let i = numFiles; i > 0; i--) {
    uploadProgress.push(0);
  }
}

function updateProgress(fileNumber, percent) { 
  uploadProgress[fileNumber] = percent;
  let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length;
  console.debug('update', fileNumber, percent, total);
  progressBar.value = total;
  if(total === 100){
    uploadHistory.style.display = "block";
    filesToBeUploaded.forEach(function(value, i){
      var currentdate = new Date();
      var time = currentdate.getHours()+':'+currentdate.getMinutes()+':'+currentdate.getSeconds();
      ul = document.createElement('li');
      ul.innerHTML = `${time} - ${value.name}`;
      uploadHistory.appendChild(ul);
    })
    
    
    currentFilesUploaded = true;
    progressBar.style.display=('none');

    progressBar.style.display = "none";
    buttonUpload.style.display = "none";
    let gallery = document.getElementById('gallery');
    while (gallery.firstChild) {
      gallery.removeChild(gallery.firstChild);
    }
    filesToBeUploaded = [];
    itemPreviewProcessed = 0;
  }
}

function handleFiles(files) {
  files = [...files];
  filesToBeUploaded = filesToBeUploaded.concat(files);
  numberOfFiles = filesToBeUploaded.length;
  console.log(filesToBeUploaded);
  initializeProgress(files.length);
  files.forEach(previewFile);
}

function previewFile(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function() {
    let img = document.createElement('img');
    images.push(img);
    images.forEach(image => image.addEventListener('click', function(image){
      console.log("click");
      images.forEach(image => {
        image.classList.toggle('selected');
      });
    }));

    images.forEach(image => image.addEventListener('mouseup', function(){
      clearTimeout(pressTimer);
      // Clear timeout
      return false;
    }));

    images.forEach(image => image.addEventListener('mousedown', function(){
      // Set timeout
      pressTimer = window.setTimeout(function() {
        console.log("long press");
      },1000);
      return false; 
    }));


    img.src = reader.result;
    document.getElementById('gallery').appendChild(img);
    itemPreviewProcessed++;
    if(itemPreviewProcessed === numberOfFiles){
      buttonUpload.style.display = "inline-block";
      trash.style.display = "inline-block";
    }
  }
}

// NOT USED FOR NOW
function displayDeleteChoice(){
  console.log("test");
}


function uploadFiles(){ 
  progressBar.style.display = "inline-block";

  var url = 'http://192.168.0.16:8081/upload'
  var xhr = new XMLHttpRequest();
  
  // First request to tell server how many files we're going to send
  xhr.open('POST', url, true);
  xhr.setRequestHeader("NumberOfFiles", filesToBeUploaded.length)
  xhr.send();

  filesToBeUploaded.forEach(uploadFile);
}

function uploadFile(file, i) {
  var url = 'http://192.168.0.16:8081/upload'
  //var url = 'http://localhost:8081/upload';
  var xh = new XMLHttpRequest();
  
  // Second request with the files
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  
  var formData = new FormData();
  // Update progress (can be used to show progress indicator)
  xhr.upload.addEventListener("progress", function(e) {
    updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
  })

  xhr.addEventListener('readystatechange', function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      updateProgress(i, 100) // <- Add this
    }
    else if (xhr.readyState == 4 && xhr.status != 200) {
      // Error. Inform the user
    }
  })

  formData.append('file', file);
  xhr.send(formData);
}

// NOT USED FOR NOW
function deleteStart(){
  images.forEach((image) => {
    //image.style.border = "solid 1px";
    image.classList.add('deleteMode');
  });
}