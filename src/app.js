// Here is the starting point for your application code.

// Small helpers you might want to keep
import './helpers/context_menu.js';
import './helpers/external_links.js';

// All stuff below is just to show you how it works. You can delete all of it.
import { remote } from 'electron';
import jetpack from 'fs-jetpack';
import { greet } from './hello_world/hello_world';
import env from './env';

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());
const imgDir = app.getAppPath() + "\\img";

var request = require('request');
var fs = require('fs');

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files form disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read('package.json', 'json');

const osMap = {
  win32: 'Windows',
  darwin: 'macOS',
  linux: 'Linux',
};

document.querySelector('#greet').innerHTML = greet();
document.querySelector('#os').innerHTML = osMap[process.platform];
document.querySelector('#author').innerHTML = manifest.author;
document.querySelector('#env').innerHTML = env.name;
document.querySelector('#electron-version').innerHTML = process.versions.electron;
document.querySelector('#rutaApp').innerHTML = app.getAppPath();

$(".container > div").hide();
$("#divTest").show();

$("#formInit").submit(function(e){
  e.preventDefault();
  return false;
});
$("#bQuitTest").click(function () {
  $("#divTest").hide();
  $("#divInit").show();
  $("#ltaGaleria").empty();
  jetpack.list(imgDir).forEach(function(element) {
    $('<li/>', {}).html(element).appendTo($('#ltaGaleria'));
  });
});
$("#bIniciar").click(function () {
  $("#divTest").show();
  $("#divInit").hide();
  return false;
});
$("#bDescargar").click(function () {
  $("#bDescargar").prop( "disabled", true );
  var url = $("#codigo").val();
  var f = getFilenameFromUrl(url);
  downloadFile(url, imgDir + "\\" + f);
  return false;
});
$("#bPlay").click(function () {
  $("#divTest").hide();
  $("#divVideo").show();
  $('#divVideo > video').get(0).play()
  return false;
});
function downloadFile(file_url , targetPath){
  //extraido de https://ourcodeworld.com/articles/read/228/how-to-download-a-webfile-with-electron-save-it-and-show-download-progress
  // Save variable to know progress
  var received_bytes = 0;
  var total_bytes = 0;

  var req = request({
      method: 'GET',
      uri: file_url
  });

  var out = fs.createWriteStream(targetPath);
  req.pipe(out);

  req.on('response', function ( data ) {
      // Change the total bytes value to get progress later.
      total_bytes = parseInt(data.headers['content-length' ]);
  });

  req.on('data', function(chunk) {
      // Update the received bytes
      received_bytes += chunk.length;

      //showProgress(received_bytes, total_bytes);
  });

  req.on('end', function() {
    //http://gestioo.com/video.mp4
    //finalizó la descarga => actualizar la BD    
    $("#bDescargar").prop( "disabled", false );
    var video = $('<video />', {      
      //id: 'video',
      width: 320,
      height: 240,
      src: imgDir + '/video.mp4',
      type: 'video/mp4',
      controls: true
    });
    video.appendTo($('#divVideo'));
  });
}
function getFilenameFromUrl(url){
  return url.substring(url.lastIndexOf('/') + 1);
}
function showProgress(received,total){
  var percentage = (received * 100) / total;
  console.log(percentage + "% | " + received + " bytes out of " + total + " bytes.");
}
