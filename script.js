const $ = require('jquery');
const { FloatingActionButton } = require('materialize-css');
const { ipcRenderer } = require('electron');

$(document).ready(function() {
  var elems = document.querySelectorAll('.fixed-action-btn');
  var instances = FloatingActionButton.init(elems);
});

$('#close-button').on('click', function(e) {
  e.preventDefault();
  ipcRenderer.send('close-window');
});
