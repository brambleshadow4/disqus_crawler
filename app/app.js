chrome.browserAction.onClicked.addListener(function(tab) {

	chrome.tabs.executeScript({
		"file":"crawler.js"
	});
	//Results = window.open();
	//Results.document.write(htmlLOG);
});

chrome.runtime.onMessage.addListener(function(request,sender,sendResponse){

	if(request.task == "launch iFrame"){

		chrome.tabs.create({
			"url": request.src,
			"active": true
		}, function(tab){

			chrome.tabs.executeScript(tab.id,{
				"file": "crawler.js"
			},function(){})
		});
	}

});