
function loadUserData()
{

	var sampleRow = "<tr><td><img src='§userIMG§' alt='avatar'/></td><td>§userName§</td> \
	<td>§count§</td><td>§profile§</td><td value='§dateTime§'>§date§</td><td>§actionlink§</td></tr>";

	var rows = "";
	for (var i = 0; i < userData.length; i++){
		var myRow = sampleRow;
		myRow = myRow.replace('§userIMG§', userData[i].imgURL);
		myRow = myRow.replace('§userName§', userData[i].userName);
		myRow = myRow.replace('§count§', userData[i].commentCount);
		if(userData[i].profileLink != '')
			myRow = myRow.replace('§profile§', "<a target='_BLANK' href='"+ 
				userData[i].profileLink + "''>Profile</a>");
		else
			myRow = myRow.replace('§profile§',"");
		myRow = myRow.replace('§date§', userData[i].lastPostString);

		if(userData[i].lastPost != "")
			myRow = myRow.replace('§dateTime§', new Date(userData[i].lastPost).getTime());
		myRow = myRow.replace('§actionlink§', "<span ax='user "+ userData[i].userName +"' onclick='doAction(this)' >Posts</span>");
		
		rows += myRow;
	}

	document.getElementById('users').innerHTML+= rows;
}

userData = JSON.parse(fixSafeJSON(document.getElementById('userData').innerHTML));
if(document.getElementById('users').getElementsByTagName('tr').length == 1)
	loadUserData();


var reversed = false;
var sortBy = "";


var downloadLink = document.getElementById('save');
var blob = new Blob([
	"<!DOCTYPE html><html><head>",
	document.head.innerHTML,
	"</head><body>",
	document.body.innerHTML,
	"</body></html>"], 
	{type: "octet/stream"});

var url = window.URL.createObjectURL(blob);

downloadLink.href = url;
downloadLink.download = "AboutYourThread.html";



function destroyOpenUsers()
{
	var userRows = document.getElementById('users').getElementsByTagName('tr');
	for (var i = 0; i < userRows.length; i++) 
	{
		var actionLink = userRows[i].getElementsByTagName('span')[0];
		if(actionLink != undefined && actionLink.getAttribute('ax').indexOf('destroy') != -1)
		{
			doAction(actionLink);
		}
	}
}

function restyleRows()
{
	//restyle rows
	var tableRows = document.getElementById('comments').getElementsByTagName('tr');
	var j = 0;
	for (var i = 0; i < tableRows.length; i++) 
	{
		if(tableRows[i].style.display != "none"){
			if(j%2){
				tableRows[i].classList.remove("even");
				tableRows[i].classList.add("odd");
			}
			else{
				tableRows[i].classList.remove("odd");
				tableRows[i].classList.add("even");
			}
				
			j++
		}
	}

	var tableRows = document.getElementById('users').getElementsByTagName('tr');
	var j = 0;
	for (var i = 0; i < tableRows.length; i++) 
	{
		if(tableRows[i].style.display != "none"){
			if(j%2){
				tableRows[i].classList.remove("even");
				tableRows[i].classList.add("odd");
			}
			else{
				tableRows[i].classList.remove("odd");
				tableRows[i].classList.add("even");
			}
				
			j++
		}
	}

}

//add action links
	document.getElementById("sortUser").onclick = function()
	{
		destroyOpenUsers();
		if(sortBy == "name")
			reversed = !reversed;
		else{
			reversed = false;
			sortBy = 'name';
		}
		
		var Users = document.getElementById('users').getElementsByTagName('tr');

		var UsersArray = [];
		for (var i = 1; i < Users.length; i++) {
			UsersArray.push(Users[i]);
		}

		UsersArray.sort(function(a,b){
			if(reversed) return (a.getElementsByTagName('td')[1].innerHTML.toLowerCase()
				 < b.getElementsByTagName('td')[1].innerHTML.toLowerCase())? 1 : -1;
			return (a.getElementsByTagName('td')[1].innerHTML.toLowerCase() 
				> b.getElementsByTagName('td')[1].innerHTML.toLowerCase())? 1 : -1;
		});

		for (var i = 0; i < UsersArray.length; i++) {
			var parent = UsersArray[i].parentNode;
			parent.removeChild(UsersArray[i]);

			parent.appendChild(UsersArray[i])
		}

		restyleRows();

		return false;
	};

	document.getElementById("sortComments").onclick = function()
	{
		destroyOpenUsers();
		if(sortBy == "comments")
			reversed = !reversed;
		else{
			reversed = false;
			sortBy = 'comments';
		}
		
		var Users = document.getElementById('users').getElementsByTagName('tr');

		var UsersArray = [];
		for (var i = 1; i < Users.length; i++) {
			UsersArray.push(Users[i]);
		}

		UsersArray.sort(function(a,b){
			if(reversed) return (Number(a.getElementsByTagName('td')[2].innerHTML) 
				> Number(b.getElementsByTagName('td')[2].innerHTML))? 1 : -1;
			return (Number(a.getElementsByTagName('td')[2].innerHTML) 
				< Number(b.getElementsByTagName('td')[2].innerHTML))? 1 : -1;
		});

		for (var i = 0; i < UsersArray.length; i++) {
			var parent = UsersArray[i].parentNode;
			parent.removeChild(UsersArray[i]);

			parent.appendChild(UsersArray[i])
		}

		restyleRows();
		return false;
	};

	document.getElementById("sortDate").onclick = function()
	{
		destroyOpenUsers();
		if(sortBy == "date")
			reversed = !reversed;
		else{
			reversed = false;
			sortBy = 'date';
		}
		
		var Users = document.getElementById('users').getElementsByTagName('tr');

		var UsersArray = [];
		for (var i = 1; i < Users.length; i++) {
			UsersArray.push(Users[i]);
		}

		UsersArray.sort(function(a,b){
			if(reversed) return (Number(a.getElementsByTagName('td')[4].getAttribute('value')) 
				> Number(b.getElementsByTagName('td')[4].getAttribute('value')))? 1 : -1;
			return (Number(a.getElementsByTagName('td')[4].getAttribute('value')) 
				< Number(b.getElementsByTagName('td')[4].getAttribute('value')))? 1 : -1;
		});

		for (var i = 0; i < UsersArray.length; i++) {
			var parent = UsersArray[i].parentNode;
			parent.removeChild(UsersArray[i]);

			parent.appendChild(UsersArray[i])
		}
		restyleRows();
		return false;
	};

	document.getElementById("action userData").onclick = function()
	{
		var data = document.getElementById('userData').innerHTML;

		var newString = data.replace(/\x24q|\x24d|\x24a|\x24l|\x24g/g, function swap(x)
		{
			if(x == '$q') return '"';
			else if (x =="$a") return "&amp;";
			else if (x =="$d") return "$";
			else if (x =="$g") return "&gt;";
			else if (x =="$l") return "&lt;";
		});

		var x = window.open();
		x.document.write("<div style='font-family: monospace;'>"+newString+"</div>");

		return false;
	}

document.getElementById("action postData").onclick = function()
{
	var data = document.getElementById('postData').innerHTML;

	var newString = data.replace(/\x24q|\x24d|\x24a|\x24l|\x24g/g, function swap(x)
	{
		if(x == '$q') return '"';
		else if (x =="$a") return "&amp;";
		else if (x =="$d") return "$";
		else if (x =="$g") return "&gt;";
		else if (x =="$l") return "&lt;";
	});

	var x = window.open();
	x.document.write("<div style='font-family: monospace;'>"+newString+"</div>");

	return false;
}

var postData = JSON.parse(fixSafeJSON(document.getElementById('postData').innerHTML));

function BoxComments(comments, includeReplies)
{
	if(includeReplies ==undefined)
		includeReplies = false;
	//A box has 4 things
	//  minTime - getTime() of smallest timestamp
	//  maxTime - getTime() of largest timestamp
	//  comments - the comments a box has (aim between 25 and 50)
	//  tier - the size of the box
	//     
	//     0: 1 min box
	//     1: 5 min box
	//     2: 15 min box
	//     3: 1 hour box
	//     4: 6 hour box
	//     5: 1 day box

	function countCommentsInBoxes(boxes)
	{
		var total = 0;
		for (var i = 0; i < boxes.length; i++) 
		{
			total += boxes[i].comments.length;
		}
		return total;
	}


	var commentBoxes = [];

	//put original comments into tier 0 boxes
	for (var i = 0; i < comments.length; i++) {

		if(comments[i].parent == "" || includeReplies)
		{
			comments[i].date = new Date(comments[i].date);

			var myBox = {};
			myBox.minTime = comments[i].date;
			myBox.maxTime = myBox.minTime;
			myBox.tier = 0;
			myBox.comments = [comments[i]];
			commentBoxes.push(myBox);
		}
	}

	//merge boxes into consolidated tier 0 boxes
	var newBoxes = [];
	myBox = commentBoxes[0];

	for (var i = 1; i < commentBoxes.length; i++) 
	{
		if(commentBoxes[i].minTime.getTime() == myBox.minTime.getTime())
		{
			myBox.comments = myBox.comments.concat(commentBoxes[i].comments);
		}
		else
		{
			newBoxes.push(myBox);
			myBox = commentBoxes[i];
		}
	}
	newBoxes.push(myBox);

	//return newBoxes;

	function boxLoop(commentBoxes, newTier)
	{
		var C = 1;
		var timeSlot = function(){};
		var isNew = false;
		if(newTier == 1)
			timeSlot = function(box)
			{
				var C = 1000*60*5;
				var slot = Math.floor(box.minTime.getTime()/C)*C;
				return slot;
			};
		if(newTier == 2)
			timeSlot = function(box)
			{
				var C = 1000*60*15;
				var slot = Math.floor(box.minTime.getTime()/C)*C;
				return slot;
			};
		if(newTier == 3)
			timeSlot = function(box)
			{
				var C = 1000*60*60;
				var slot = Math.floor(box.minTime.getTime()/C)*C;
				return slot;
			};
		if(newTier == 4)
			timeSlot = function(box)
			{
				var timeRel = box.minTime.getTime() - box.minTime.getTimezoneOffset()*1000*60;
				var C = 1000*60*60*6;
				var slot = Math.floor(timeRel/C)*C;
				return slot;
			};
		if(newTier == 5)
			timeSlot = function(box)
			{
				var timeRel = box.minTime.getTime() - box.minTime.getTimezoneOffset()*1000*60;
				var C = 1000*60*60*24;
				var slot = Math.floor(timeRel/C)*C;
				return slot;
			};

		newBoxes = [];
		var lastResult = "Zone End";
		for (var i = 0; i < commentBoxes.length; i+= 0) 
		{
			if(commentBoxes[i].tier == newTier-1)
			{
				var j = i;
				var commentsFromTime = 0;
				var result = "Expand";
				while(result == "Expand")
				{
					commentsFromTime += commentBoxes[j].comments.length;
					j++;

					if(j == commentBoxes.length)
						result = "EOF";
					else if(commentBoxes[i].tier != commentBoxes[j].tier )
						result = "Lower Tier"
					else if  (timeSlot(commentBoxes[i]) != timeSlot(commentBoxes[j]))
						result = "Zone End";
				}
				// upgrade box tier
				// if completely within a zone && comments < 50
				if((result == "Zone End" || result == "EOF" ) && commentsFromTime < 50 
					&& (i == 0 || timeSlot(commentBoxes[i]) != timeSlot(commentBoxes[i-1])))
				{
					var myBox = commentBoxes[i];
					i++;
					while(i < j){
						myBox.comments = myBox.comments.concat(commentBoxes[i].comments);
						i++;
					}
					myBox.maxTime = myBox.comments[myBox.comments.length-1].date;
					myBox.tier++;
					newBoxes.push(myBox);
					isNew = true;
				}
				// keep box sizes the same
				else 
				{
					while(i < j){
						newBoxes.push(commentBoxes[i]);
						i++
					}
				}
			}
			else
			{
				newBoxes.push(commentBoxes[i])
				i++;
			}
		}

		return {"boxes":newBoxes, "isNew":isNew};
	}

	//box into 5 minutes
	newBoxes = boxLoop(newBoxes,1);

	//box into 15 minutes
	if(newBoxes.isNew)
		newBoxes = boxLoop(newBoxes.boxes,2);
	
	//box into hours
	if(newBoxes.isNew)
		newBoxes = boxLoop(newBoxes.boxes,3);

	//box into morning/evening/night
	if(newBoxes.isNew)
		newBoxes = boxLoop(newBoxes.boxes,4);

	if(newBoxes.isNew)
		newBoxes = boxLoop(newBoxes.boxes,5);

	return newBoxes.boxes;
}

var boxes = BoxComments(postData);

function createCommentThread()
{
	var idMap = {};
	for (var i = 0; i < postData.length; i++) 
	{
		idMap[postData[i].id] = i;
	}

	for (var i = 0; i < postData.length; i++)
	{
		if(postData[i].parent != "" && idMap[postData[i].parent] != undefined)
		{
			postData[idMap[postData[i].parent]].replies.push(postData[i].id);
		}
	}

	for (var i = 0; i < postData.length; i++)
	{
		postData[i].replies.sort(function(a,b){
			return idMap[a] > idMap[b];
		});
	}

	function createComment(commentID)
	{
		var comment = postData[idMap[commentID]]
		var row = document.createElement('tr');
		row.id = comment.id;

		row.innerHTML = "<td><img src='§url§' alt='avatar'/></td><td>§userName§</td>\
		<td><a target='_BLANK' href='§disqusURL§'>§time§</a></td><td>§comment§</td><td>§replies§</td>";
		row.innerHTML = row.innerHTML.replace("§url§",comment.imgURL);
		row.innerHTML = row.innerHTML.replace("§userName§",comment.userName);
		row.innerHTML = row.innerHTML.replace("§time§",comment.dateString);
		row.innerHTML = row.innerHTML.replace("§comment§",comment.comment);

		var commentLink = document.getElementById('threadURL').href;
		commentLink = commentLink +"#"+commentID.replace("post","comment");
		row.innerHTML = row.innerHTML.replace("§disqusURL§",commentLink);

		if(comment.replies.length > 0)
			row.innerHTML = row.innerHTML.replace("§replies§",
				"<span ax='replies " +comment.id+"' onclick='doAction(this)'>Show Replies</span>");
		else
			row.innerHTML = row.innerHTML.replace("§replies§","");

		row.style.display = "none";

		document.getElementById('comments').appendChild(row);

		for (var i = 0; i < comment.replies.length; i++) {
			createComment(comment.replies[i]);
		}
	}

	for (var i = 0; i < boxes.length; i++) 
	{
		var row = document.createElement('tr');
		row.id ="box " + i;
		row.className = "box";
		
		row.innerHTML = "<td colspan='5'>" + timeSlotName(boxes[i].minTime, boxes[i].tier)  
			+'</br><span ax="open '+i+'" onclick="doAction(this)">View Comments</span></td>';

		row.style.height="inherit";
		document.getElementById('comments').appendChild(row);

		for (var j = 0; j < boxes[i].comments.length; j++)
		{
			createComment(boxes[i].comments[j].id);
		}

		row = document.createElement('tr');
		row.id = "boxend " + i;
		row.className = "box";
		row.style.height="inherit";
		row.style.display= "none";
		row.innerHTML = '<td colspan="5"><span ax="close '+i+'" onclick="doAction(this)">Hide Comments</span></td>';
		document.getElementById('comments').appendChild(row);
	}

	if(boxes.length == 1){
		var box = document.getElementById('box 0');
		var boxend = document.getElementById('boxend 0');
		doAction(box.getElementsByTagName('span')[0]);

		box.parentNode.removeChild(box);
		boxend.parentNode.removeChild(boxend);
	}

	restyleRows();
	return idMap;
}


var idMap = createCommentThread();



function doAction(item){

	var action =item.getAttribute('ax');
	
	action = action.split(" ");

	if(action[0] == "open")
	{
		var boxNum = Number(action[1]);

		if(action[2] != undefined)
		{
			action.shift();
			action.shift();
			var user = action.join(" ");

			for (var i = 0; i < boxes[user][boxNum].comments.length; i++)
			{
				document.getElementById(user+boxes[user][boxNum].comments[i].id).style.display = "table-row";
			}

			var end1 = document.getElementById("box "+ boxNum+" " +user);
			end1 = end1.getElementsByTagName('span')[0];
			end1.innerHTML = end1.innerHTML.replace("View","Hide");
			end1.setAttribute("ax","close " + boxNum +" " +user);

			var end2 = document.getElementById("boxend "+boxNum +" " +user);
			end2.style.display="table-row";
		}
		else
		{
			for (var i = 0; i < boxes[boxNum].comments.length; i++)
			{
				document.getElementById(boxes[boxNum].comments[i].id).style.display = "table-row";
			}

			var end1 = document.getElementById("box "+ boxNum);
			end1 = end1.getElementsByTagName('span')[0];
			end1.innerHTML = end1.innerHTML.replace("View","Hide");
			end1.setAttribute("ax","close " + boxNum);

			var end2 = document.getElementById("boxend "+boxNum);
			end2.style.display="table-row";
		}
	}

	if(action[0] == "close"){
		var boxNum = Number(action[1]);
		//alert(boxNum);
		//alert(boxes[boxNum].comments.length);
		if(action[2] != undefined)
		{
			action.shift();
			action.shift();
			var user = action.join(" ");
			for (var i = 0; i < boxes[user][boxNum].comments.length; i++)
			{
				document.getElementById(user+boxes[user][boxNum].comments[i].id).style.display = "none";
			}

			var end1 = document.getElementById("box "+ boxNum+" " +user);
			end1 = end1.getElementsByTagName('span')[0];
			end1.innerHTML = end1.innerHTML.replace("Hide","View");
			end1.setAttribute("ax","open " + boxNum +" " +user);

			var end2 = document.getElementById("boxend "+boxNum +" " +user);
			end2.style.display="none";
		}
		else
		{
			for (var i = 0; i < boxes[boxNum].comments.length; i++)
			{
				document.getElementById(boxes[boxNum].comments[i].id).style.display = "none";

				var child = document.getElementById(boxes[boxNum].comments[i].id).getElementsByTagName('span')[0];

				if(child != undefined && child.hasAttribute('ax') && child.getAttribute('ax').indexOf("hreplies") != -1)
				{
					doAction(child);
				}
			}

			var end1 = document.getElementById("box "+ boxNum);
			end1 = end1.getElementsByTagName('span')[0];
			//console.log(end1);
			end1.innerHTML = end1.innerHTML.replace("Hide","View");
			end1.setAttribute("ax","open " + boxNum);

			var end2 = document.getElementById("boxend "+boxNum);
			end2.style.display="none";
		}
	}

	if(action[0] == "replies")
	{
		var id = action[1];

		var replies = postData[idMap[id]].replies;

		for (var i = 0; i < replies.length; i++)
		{
			document.getElementById(replies[i]).style.display = "table-row";

			if(item.parentNode.parentNode.classList.contains("inner1"))
				document.getElementById(replies[i]).classList.add("inner2");
			else if(item.parentNode.parentNode.classList.contains("inner2"))
				document.getElementById(replies[i]).classList.add("inner3");
			else if(item.parentNode.parentNode.classList.contains("inner3"))
				document.getElementById(replies[i]).classList.add("inner4");
			else if(item.parentNode.parentNode.classList.contains("inner4"))
				document.getElementById(replies[i]).classList.add("inner5");
			/*else if(item.parentNode.parentNode.classList.contains("inner5"))
				document.getElementById(replies[i]).classList.add("inner1");*/
			else 
				document.getElementById(replies[i]).classList.add("inner1");
		}

		item.setAttribute('ax',"hreplies " + id);
		item.innerHTML = item.innerHTML.replace("Show","Hide");
	}

	if(action[0] == "hreplies")
	{
		var id = action[1];

		var replies = postData[idMap[id]].replies;

		for (var i = 0; i < replies.length; i++)
		{
			document.getElementById(replies[i]).style.display = "none";
			
			var child = document.getElementById(replies[i]).getElementsByTagName('span')[0];

			if(child != undefined && child.hasAttribute('ax') && child.getAttribute('ax').indexOf("hreplies") != -1)
			{
				doAction(child);
			}

		}

		item.setAttribute('ax',"replies " + id);	
		item.innerHTML = item.innerHTML.replace("Hide","Show");
	}

	if(action[0] == 'user')
	{
		action.shift();
		var user = action.join(" ");

		function insertAfter(newElement,targetElement) {
			//target is what you want it to go after. Look for this elements parent.
			var parent = targetElement.parentNode;

			//if the parents lastchild is the targetElement...
			if(parent.lastchild == targetElement) {
				//add the newElement after the target element.
				parent.appendChild(newElement);
				} else {
				// else the target has siblings, insert the new element between the target and it's next sibling.
				parent.insertBefore(newElement, targetElement.nextSibling);
				}
		}

		var allUserPosts = [];
		for (var i = 0; i < postData.length; i++) 
		{

			if(postData[i].userName == user)
				allUserPosts.push(postData[i]);
		}

		var postBoxes = BoxComments(allUserPosts, true);

		boxes[user] = postBoxes;

		var pointer = item.parentNode.parentNode;

		function createComment(commentID)
		{
			var comment = postData[idMap[commentID]]
			var row = document.createElement('tr');
			row.id = user + commentID;
			row.className = "comments inner5";


			row.innerHTML = "<td>§time§</td><td colspan='4'>§comment§</td><td>§view§</td>";
			row.innerHTML = row.innerHTML.replace("§time§",comment.dateString);
			row.innerHTML = row.innerHTML.replace("§comment§",comment.comment);
			row.innerHTML = row.innerHTML.replace("§view§", "<span onclick='doAction(this)' ax='jump "+commentID+"'>Context</span>");

			row.style.display = "none";
			insertAfter(row, pointer);
			pointer = row; 
		}

		for (var i = 0; i < postBoxes.length; i++) 
		{
			var row = document.createElement('tr');
			row.id ="box " + i + " " + user;
			row.className = "box inner5";
			
			row.innerHTML = "<td colspan='6'>" + timeSlotName(postBoxes[i].minTime, postBoxes[i].tier)  
				+'</br><span ax="open '+i+" "+ user+'" onclick="doAction(this)">View Comments</span></td>';

			row.style.height="inherit";
			insertAfter(row, pointer);
			pointer = row; 

			for (var j = 0; j < postBoxes[i].comments.length; j++)
			{
				createComment(postBoxes[i].comments[j].id);
			}

			row = document.createElement('tr');
			row.id = "boxend " + i + " " + user;
			row.className = "box inner5";
			row.style.height="inherit";
			row.style.display= "none";
			row.innerHTML = '<td colspan="6"><span ax="close '+i+" "+user+ '" onclick="doAction(this)">Hide Comments</span></td>';
			insertAfter(row, pointer);
			pointer = row;
		}

		item.setAttribute("ax","destroy " + user);
		item.innerHTML = "Close";

		if(postBoxes.length == 1){
			var box = document.getElementById('box 0 ' + user);
			var boxend = document.getElementById('boxend 0 '+user);
			doAction(box.getElementsByTagName('span')[0]);

			box.parentNode.removeChild(box);
			boxend.parentNode.removeChild(boxend);
		}
	}

	if(action[0] == 'destroy')
	{
		action.shift();
		var user = action.join(" ");

		for (var j = 0; j < boxes[user].length; j++) 
		{
			for (var i = 0; i < boxes[user][j].comments.length; i++)
			{
				var comment = document.getElementById(user+boxes[user][j].comments[i].id);
				comment.parentNode.removeChild(comment);
			}

			var end1 = document.getElementById("box "+j+" " +user);
			if(end1 != undefined)
				end1.parentNode.removeChild(end1);

			var end2 = document.getElementById("boxend "+j +" " +user);
			if(end2 != undefined)
				end2.parentNode.removeChild(end2);
		}

		item.innerHTML = "Posts";
		item.setAttribute('ax',"user " + user);
	}

	if(action[0] == "jump"){
		var postID = action[1];

		var parent = postData[idMap[postID]].parent;
		var highestComment = postID;
		var actionLinkStack = [];

		while(parent != "")
		{
			var actionLink = document.getElementById(parent).getElementsByTagName('span')[0];

			if(actionLink != undefined && actionLink.getAttribute('ax').indexOf('hreplies') == -1)
			{
				actionLinkStack.push(actionLink);
			}

			highestComment = parent;
			parent = postData[idMap[parent]].parent;
		}

		var boxCommentTime =  postData[idMap[highestComment]].date.getTime(); 
		
		for (var i = 0; i < boxes.length; i++) 
		{
			if(boxes.length > 1 && boxCommentTime >= boxes[i].minTime.getTime()
				&& boxCommentTime <= boxes[i].maxTime.getTime())
			{
				var actionLink = document.getElementById('box '+i).getElementsByTagName('span')[0];
				if(actionLink != undefined && actionLink.getAttribute('ax').indexOf('open') != -1)
				{
					doAction(actionLink);
				}
			}
		}

		while(actionLinkStack.length > 0)
			doAction(actionLinkStack.pop());

		document.getElementById(postID).classList.add('selected');

		window.setTimeout(function(){
			document.getElementById(postID).classList.remove('selected');
		}, 5000);
		document.location.href = "#" + postID;

	}

	restyleRows();
	
	return false;
}


function analyzeNetwork()
{
	var responseMatrix = {};
	responseMatrix.userList = [];
	responseMatrix.user = {};
	responseMatrix.data = [];

	responseMatrix.increment = function(p1,p2)
	{
		//p1 is owner of comment, p2 is owner of reply
		if(this.user[p1] == undefined)
		{
			this.user[p1] = this.userList.length;
			this.userList.push(p1);
		}
		if(this.user[p2] == undefined)
		{
			this.user[p2] = this.userList.length;
			this.userList.push(p2);
		}

		//both are in the matrix
		var index;
		if(this.user[p1] > this.user[p2])
		 	index = (this.user[p1]+1)*(this.user[p1]+1)-this.user[p2]-1;
		else
			index = this.user[p2]*this.user[p2]+this.user[p1];

		if(this.data[index] == undefined)
				this.data[index] = 1;
			else
				this.data[index]++;
	}

	responseMatrix.allInteractions = function()
	{
		var interactions = [];
		for (var i = 0; i < this.userList.length; i++)
		{
			for (var j = 0; j <= i; j++)
			{
				if(i==j && this.data[i*i+i] != undefined)
					interactions.push([this.userList[i],[this.userList[i]],this.data[i*i+i]]);
				else
				{
					var index = i*i+j;
					var index2 = i*i+i+i-j;
					var total = 0;
					if(this.data[index] != undefined)
						total+=this.data[index];
					if(this.data[index2] != undefined)
						total+=this.data[index2];
					if(total)
						interactions.push([this.userList[i],this.userList[j],total]);
				}
			}
		}
		return interactions;
	}


	var Comments = 0;
	var Replies = 0;
	for (var i = 0; i < postData.length; i++)
	{
		if(postData[i].parent != "")
		{
			var parent = postData[idMap[postData[i].parent]];
			if(parent == undefined)
				console.log(postData[i].parent);
			else
			{
				responseMatrix.increment(parent.userName,postData[i].userName);
			}
			Replies++;
		}
		else
		{
			Comments++;
		}
	}

	console.log("Comments: " + Comments);
	console.log("Replies: " + Replies);

	var newWindow = window.open();

	newWindow.document.write('<textarea style="display: none" id="userData">' + JSON.stringify(userData) + '</textarea>');
	newWindow.document.write('<textarea style="display: none" id="responseData">' 
		+ JSON.stringify(responseMatrix.allInteractions()) + '</textarea>');
	newWindow.document.write("<script>"+document.getElementById('mapJS').value+"</" + "script>");
	
}

document.getElementById('analyzeNetwork').onclick = analyzeNetwork;


function timeSlotName(time, tier)
{
	function formatTime(date)
	{
		var ampm = "AM";
		var hour = date.getHours();

		if(hour == 12)
			ampm = "PM";
		else if(hour == 0)
			hour = 12;
		else if(hour > 12)
		{
			hour -= 12;
			ampm = "PM";
		}

		var mm = date.getMinutes();
		if(mm < 10)
			mm =  "0"+ mm;

		return hour+":"+mm+" "+ampm;
		
	}

	function formatDate(date){
		var Months = ["January","February","March","April","May","June",
			"July","August","September","October","November","December"];
		return Months[date.getMonth()]+" " + date.getDate()+ ", " + date.getFullYear();
	}

	if(tier == 0)
	{
		var C = 1000*60;
		var slot = Math.floor(time.getTime()/C)*C;
		time = new Date(slot);

		return formatTime(time);
	}
	else if(tier == 1)
	{
		var C = 1000*60*5;
		var slot = Math.floor(time.getTime()/C)*C;
		time = new Date(slot);

		return formatTime(time);
	}
	else if(tier == 2)
	{
		var C = 1000*60*15;
		var slot = Math.floor(time.getTime()/C)*C;
		time = new Date(slot);

		return formatTime(time);
	}
	else if(tier == 3)
	{
		var C = 1000*60*60;
		var slot = Math.floor(time.getTime()/C)*C;
		time = new Date(slot);
		return formatDate(time) + " " + formatTime(time);
	}
	else if(tier == 4)	
	{
		var timeRel = time.getTime() - time.getTimezoneOffset()*1000*60;
		var C = 1000*60*60*6;
		var slot = Math.floor(timeRel/C)*C;
		time = new Date(slot + time.getTimezoneOffset()*1000*60);
		var partOfDay;
		if(time.getHours() == 0)
			partOfDay = "Early Morning";
		else if(time.getHours() ==6)
			partOfDay= "Morning";
		else if(time.getHours() ==12)
			partOfDay= "Afternoon";
		else if(time.getHours() ==18)
			partOfDay= "Evening";
		return partOfDay + " " + formatDate(time);
	}
	else if(tier == 5)	
	{
		var timeRel = time.getTime() - time.getTimezoneOffset()*1000*60;
		var C = 1000*60*60*24;
		var slot = Math.floor(timeRel/C)*C;
		time = new Date(slot + time.getTimezoneOffset()*1000*60);
		
		return formatDate(time);
	};
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

function fixSafeJSON(mystring)
{
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

function LoadResource(url,success)
{
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			success(xhr.responseText);
		}
	}
	xhr.open("GET", url, true);
	xhr.send();
}
