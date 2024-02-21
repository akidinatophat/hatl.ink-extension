

  window.onload = function(){
    browser.storage.sync.get(["noalias"]).then((result) => {
        if (result.noalias == true){
            document.querySelector('#nocustomalias').checked = true;
        } else {document.querySelector('#nocustomalias').checked = false}
      });
  }

  document.querySelector("#nocustomalias").addEventListener("change", (event) => {
    let val;
    if (document.querySelector('#nocustomalias').checked){
        val = true
    } else {val = false}
    browser.storage.sync.set({ noalias: val }).then(() => {
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        document.querySelector("#saved").innerHTML = "Saved at " + h + ":" + m + ":" + s
      });
  });