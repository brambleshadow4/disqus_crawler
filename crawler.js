//TODO
//time stamps
//comment references
//save file
//export userData as JSON
//export postData as JSON


//my code


var title = document.getElementsByTagName("title")[0].innerHTML;
if(title !="Disqus Comments"){
	var DISQUSiframe = document.getElementById("dsq-app2");

	if(DISQUSiframe == undefined)
		alert("No Disqus thread found");
	else{
		
		chrome.runtime.sendMessage({
			"task": "launch iFrame",
			"src": DISQUSiframe.src},
		function() {});
	}
}
else{
	loadMenu();	
}


//resourc loading
var ResultsHTML;
var ResultsJS;
var mapJS;

function LoadResource(url,success){
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			success(xhr.responseText);
		}
	}
	xhr.open("GET", url, true);
	xhr.send();
}


LoadResource(chrome.extension.getURL('results.js'),function(text){ResultsJS = text;});
LoadResource(chrome.extension.getURL('Results.html'),function(text){ResultsHTML = text;});
LoadResource(chrome.extension.getURL('map.js'),function(text){ mapJS = text;});
	
function loadMenu(){
	if(document.getElementsByClassName('post').length == 0){
		setTimeout(loadMenu,500);

		return false;
	}

	var Menu = document.createElement("div");
	Menu.id="appMenu";
	var myRequest = new XMLHttpRequest();
	var url = chrome.extension.getURL('Menu.html');
	myRequest.open("GET", url, true);
	myRequest.send();
	myRequest.onreadystatechange = function() {
		if (myRequest.readyState == 4) {

			Menu.innerHTML = myRequest.responseText;
			var bLoad = document.getElementById('bLoad');
			var bStop = document.getElementById('bStop');
			var bAnalyze = document.getElementById('bAnalyze');

			bLoad.addEventListener('click',toggleLoad);
			bStop.addEventListener('click',toggleLoad);
			bAnalyze.addEventListener('click',analyze);

			loadPosts();
		}
	}
	document.body.appendChild(Menu);
}

var isLoading = true;

function loadPosts(){
	//var listCount = document.getElementsByClassName('post-list').length;
	var postList = document.getElementById('post-list');
	var posts = postList.getElementsByClassName("post");

	//console.log(document.getElementsByClassName('post-list'));

	var index = 0; 
	while(posts.length > index)
	{
		console.log('trying');
		var imgURL = "/forums/";
		try{
			imgURL = posts[index].getElementsByClassName('avatar')[0].getElementsByTagName('img')[0].src}
		catch(e){alert("error")};

		posts[index].style.display = "initial";


		if(imgURL.indexOf("/forums/") == -1 || posts[index].getElementsByClassName("author")[0].getElementsByTagName('a').length == 0
			|| (posts[index].hasAttribute('load-next') && posts[index].getAttribute('load-next') == 5)) 
		{
			var children = posts[index].getElementsByClassName('children')[0].getElementsByClassName('post');

			while(children.length > 0){
				var child = children[0];
				child.parentNode.removeChild(child);
				postList.appendChild(child);
			}

			CommentBase.push(posts[index]);
			//console.log(posts[index]);
			posts[index].style.display="none";
			posts[index].className = "post-processed";
			document.getElementById('commentCount').innerHTML++;

		}
		else{
			if(!posts[index].hasAttribute('load-next') && index < 20)
				posts[index].setAttribute("load-next","1");
			else if (index<5)
				posts[index].setAttribute("load-next", Number(posts[index].getAttribute('load-next'))+1);
			
			index++;
		}
	}

	var loadMoreComments = document.getElementsByClassName("load-more")[0];

	if(loadMoreComments.style.display == "none" && document.getElementsByClassName('post').length == 0){
		toggleLoad();
	}
	else if(isLoading){
		if(loadMoreComments.style.display != "none" /*&& !loadMoreComments.classList.contains("busy")*/)
			loadMoreComments.getElementsByTagName("a")[0].click();
		setTimeout(loadPosts,200);
	}
	
}

var CommentBase = [];

function toggleLoad(){
	console.log("Toggling loading");
	isLoading = !isLoading;
	if(isLoading){
		
		document.getElementById('bStop').disabled = false;
		document.getElementById('bLoad').disabled = true;
		loadPosts();
	}
	else{
		document.getElementById('bStop').disabled = true;
		document.getElementById('bLoad').disabled = false;
	}
}

function analyze()
{
	console.log("Sorting Comments");
	var postData = getPostData(CommentBase);

	postData.sort(function(a,b){
		if(a.date == "")
			return 1;
		if(b.date == "")
			return 1;
		return (a.date.getTime() > b.date.getTime())? 1 : -1;
	});

	var userData = [];
	console.log("Gathering User Data")
	for (var i = 0; i < postData.length; i++) 
	{
		var userIndex = -1;
		for (var j = 0; j < userData.length && userIndex == -1; j++) {
			if(postData[i].userName == userData[j].userName)
				userIndex = j;
		}

		if(userIndex == -1){
			var newUser = {};
			newUser.lastPost = postData[i].date;
			newUser.lastPostString = postData[i].dateString;
			newUser.profileLink = postData[i].profileLink;
			newUser.userName = postData[i].userName;
			newUser.imgURL = postData[i].imgURL;
			newUser.commentCount = 1;

			userData.push(newUser);
		}
		else{
			userData[userIndex].commentCount++;

			if(userData[userIndex].lastPost.getTime() < postData[i].date.getTime()){
				userData[userIndex].lastPost = postData[i].date;
				userData[userIndex].lastPostString = postData[i].dateString;
			}
		}
	}

	console.log("Writing files");


	if(ResultsHTML == undefined){
		alert("File not loaded. Please try again");
		return false;
	}

	var code = ResultsHTML;


	var getParameters = location.search.substring(1);
	getParameters = getParameters.split('&');
	var parameters = {};

	for (var i = 0; i < getParameters.length; i++)
	{
		getParameters[i]

		getParameters[i] = getParameters[i].split("=");

		getParameters[i][0] = decodeURIComponent(getParameters[i][0]);
		getParameters[i][1] = decodeURIComponent(getParameters[i][1]);

		parameters[getParameters[i][0]] = getParameters[i][1];
	}

	code = code.replace("§threadURL§",parameters['t_u']);
	code = code.replace("§threadName§",parameters['t_d'])

	code = code.replace("§comments§", postData.length);
	code = code.replace("§users§", userData.length);

	code = code.replace("§postData§", makeJSONSafe(JSON.stringify(postData)));
	code = code.replace("§userData§", makeJSONSafe(JSON.stringify(userData)));

	console.log("JSON embeded");

	if(ResultsJS == undefined)
	{
		alert("File not loaded. Please try again");
		return false;
	}
	code = code.replace("§script§", "<script>" + ResultsJS + "</script>");
	code = code.replace("§mapJS§", "<textarea id='mapJS' style='display: none'>" + mapJS + "</textarea>");

	var results = window.open();
	results.document.write(code);
	console.log("Document opened");
}

function getPostData(comments){

	var data = [];

	for (var i = 0; i < comments.length; i++){

		var postFields = {};

		//postFields.imgURL
		try{
			postFields.imgURL = comments[i].getElementsByClassName('avatar')[0].getElementsByTagName('img')[0].src;
		}
		catch(e){ alert("no image"); postFields.imgURL = ""; }
		
		//postFields.userName
		try{
			var usernameLink = comments[i].getElementsByClassName("author")[0];

			if(usernameLink.getElementsByTagName('a').length == 0)
				postFields.userName = usernameLink.innerHTML;
			else
				postFields.userName = usernameLink.getElementsByTagName('a')[0].innerHTML;

		}
		catch(e){ postFields.userName = ""; }

		//postFields.profileLink
		try{
			postFields.profileLink = comments[i].getElementsByClassName('avatar')[0].getElementsByTagName('a')[0].href;
		}
		catch(e){ postFields.profileLink = ""; }

		//postFields.comment
		try{
			var paragraphs = comments[i].getElementsByClassName('post-message')[0].getElementsByTagName('p');
			postFields.comment = "";
			for (var j = 0; j < paragraphs.length; j++) {
				postFields.comment += "<p>" + paragraphs[j].innerHTML + "</p>";
			}
			
		}
		catch(e){ postFields.comment = ""; }

		//postFields.date
		try{
			postFields.dateString = comments[i].getElementsByClassName('post-meta')[0].getElementsByTagName('a')[0].title;
			postFields.date = new Date(comments[i].getElementsByClassName('post-meta')[0].getElementsByTagName('a')[0].title);
		}
		catch(e){ postFields.date = ""; }

		//postFields.id
		try{
			postFields.id = comments[i].id;
		}
		catch(e){ postFields.id = ""; }

		//postFields.parent
		try{
			var URL = comments[i].getElementsByClassName('parent-link')[0].href;
			postFields.parent = URL.substring(URL.indexOf("#")+1);
			postFields.parent = postFields.parent.replace('comment',"post");
			if(postFields.parent == postFields.id)
				postFields.parent = "";
		}catch(e){ postFields.parent = ""; }

		//postFields.parentName
		try{
			var stuff = comments[i].getElementsByClassName('parent-link')[0].innerHTML;
			postFields.parentName = stuff.substring(URL.indexOf("</i> ")+5);
		}catch(e){ postFields.parentName = false; }

		postFields.replies = [];

		if(postFields.userName != "")
			data.push(postFields);
		else
			console.log("found a deleted comment");
	}
	
	return data;
}

function makeJSONSafe(mystring){

	var newString = mystring.replace(/["$&<>]/g, function swap(x)
	{
		if(x == '"') return "$q";
		else if (x =="&") return "$a";
		else if (x =="$") return "$d";
		else if (x =="<") return "$l";
		else if (x ==">") return "$g";
	});
	
	return newString;
};

function fixSafeJSON(mystring){

	var newString = mystring.replace(/\x24q|\x24d|\x24a|\x24l|\x24g/g, function swap(x)
	{
		if(x == '$q') return '"';
		else if (x =="$a") return "&";
		else if (x =="$d") return "$";
		else if (x =="$g") return ">";
		else if (x =="$l") return "<";
	});

	return newString;
}
