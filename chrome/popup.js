var forceshowalias = false
function shownewurl(link){
    document.querySelector("#linktxt").innerHTML = link;
    document.querySelector("#statustxt").innerHTML = "Here's your shortened link:";
    $( ".link" ).show();
    $( "#copybtn" ).show();
}


function requestlink(){
    $( "#alias" ).hide();
    $( "#noshowagain" ).hide();
    $( ".link" ).hide();
    $( "#copybtn" ).hide();
    document.querySelector("#statustxt").innerHTML = "Getting link...";
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        let url = tabs[0].url;
        let alias;
        if (document.querySelector("#alias").value && document.querySelector("#alias").value.trim() != '') {
            alias = document.querySelector("#alias").value;
        }
        $.post("https://hatl.ink/api/create",
        {
          link: url,
          alias: alias
        },
        function(data){
          if (data.split("||")[0] == "SUCCESS") {
            shownewurl(data.split("||")[1])
          }
        })
        .fail(function(xhr, status, error) {
        document.querySelector("#statustxt").innerHTML = "Oh no! An error occured.<br><br>" + xhr.responseText.split(":")[1];
        });
    });
}

document.querySelector("#optionsbtn").onclick = function(){
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL('options.html'));
      }
}

window.onload = function(){ 
    $( "#alias" ).hide();
    $( "#noshowagain" ).hide();
    $( ".link" ).hide();
    $( "#copybtn" ).hide();
    chrome.storage.sync.get(["noalias"]).then((result) => {
        if (result.noalias !== false && result.noalias !== true) {
            chrome.storage.sync.set({ noalias: false }).then(() => {
              console.log("created noalias");
            });
        }
      });
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
       let url = tabs[0].url;
       if (url.indexOf("http") == 0 || url.indexOf("https") == 0){
        chrome.storage.sync.get(["noalias"]).then((result) => {
            if (result.noalias == false || forceshowalias == true) {
                document.querySelector("#statustxt").innerHTML = "Custom alias? (leave blank for none, press Enter when done)";
                $( "#alias" ).show();
                $( "#noshowagain" ).show();
                document.querySelector("#alias").focus();
            } else {requestlink();}
          });
       } else {
        document.querySelector("#statustxt").innerHTML = "This is not a webpage...";
       }
    });
}

$("#alias").on('keyup', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        requestlink()
    }
});

document.querySelector("#noshowagain").onclick = function(){
    chrome.storage.sync.set({ noalias: true }).then(() => {
        requestlink()
      });
    }

    document.querySelector("#copybtn").onclick = function(){
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(document.querySelector("#linktxt"));
      selection.removeAllRanges();
      selection.addRange(range);

      navigator.clipboard.writeText(document.querySelector("#linktxt").innerHTML);
      }

    