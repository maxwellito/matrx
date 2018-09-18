/**
 * File loader is the interface to
 * get the file from the drag and drop and
 * extract them as Int8Array
 */

// Interface
var fileLoader = {
  onDrop: function () {}
};

(function () {

  // Listen for drag and drop
  document.addEventListener('drop',      dropped,        false);
  document.addEventListener('dragover',  preventDefault, false);
  document.addEventListener('dragleave', preventDefault, false);

  // Listener for cancel
  function preventDefault (event) {
    event.preventDefault();
  }

  // Listener for file drop
  function dropped (event) {
    preventDefault(event);

    var data = event.dataTransfer;
    if (!data || !data.files || !data.files[0]) {
      return;
    }

    var file = new FileReader();
    file.addEventListener('load', function (e) {
    
      rawArray = new Uint8Array(e.target.result)
      hexArray = new Int8Array(rawArray.length * 2)

      for(let i = 0; i < rawArray.length; i++) {
        hexArray[i*2] = (Math.floor(rawArray[i]/16))
        hexArray[i*2 + 1] = (rawArray[i]%16)
      }

      fileLoader.onDrop(hexArray)
    }, false);

    file.readAsArrayBuffer(data.files[0]);
  }
})()