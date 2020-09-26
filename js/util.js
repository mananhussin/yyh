//This file relies on firebase, and jQuery

//Include this in any document needed above all script which use this, but below jQuery and firebase


//Allows us to create PostPreview() objects while staying consistent. This doesn't contain all of the posts data, just the data we need for the list. - xDest

function PostPreview() {
    this.title = "Post Title";
    this.author = "Post Author";
    this.date = "0101001100";
    this.replyCount = 0;
}

//Same thing as the previous, but this time to create a PostPreview() with all the data included
function PostPreview(title, author, date, replyCount) {
    this.title = title;
    this.author = author;
    this.date = date;
    this.replyCount = replyCount;
}


//Generates the html for a group item in sub forums
PostPreview.prototype.generateHTML = function() {
    var HTML = "";
    HTML+= "<div class=\"group-item\"><div class=\"post-list-title\"><a href=\"#\">" + this.title + "</a></div>";
    HTML+= "<div class=\"post-list-author\">" + this.author + "</div>";
    HTML+= "<div class=\"post-list-date\">" + convertDateToStr(this.date) + "</div>";
    HTML += "<div class=\"post-list-replies\"> Replies: " + this.replyCount + "</div></div>";
    return HTML;
}


//Generates the html for a group item in sub forums. Adds proper link
PostPreview.prototype.generateHTML = function(loc) {
    var HTML = "";
    HTML+= "<div class=\"group-item\"><div class=\"post-list-title\"><a href=\"../../../forum/general-post-index.html?loc=" +loc + "\">" + this.title + "</a></div>";
    HTML+= "<div class=\"post-list-author\">" + this.author + "</div>";
    HTML+= "<div class=\"post-list-date\">" + convertDateToStr(this.date) + "</div>";
    HTML += "<div class=\"post-list-replies\"> Replies: " + this.replyCount + "</div></div>";
    return HTML;
}

//Post reply as an object
function PostReply(author, body, date) {
    this.author = author;
    this.body = body;
    this.date = date;
}


PostReply.prototype.generateHTML = function (isLast) {
    var HTML = "";
    HTML+="<div class=\"post-reply-wrap" + ((isLast) ? " last-reply":"") + "\">";
    HTML+="<div class=\"post-reply-body\">";
    HTML+=this.body;
    HTML+="</div>";
    HTML+="<div class=\"post-reply-footer\">";
    HTML+="<div class=\"post-reply-author\">";
    HTML+=this.author;
    HTML+="</div>";
    HTML+="<div class=\"post-reply-date\">";
    HTML+=convertDateToStr(this.date);
    HTML+="</div>";
    HTML+="</div>";
    HTML+="</div>";
    return HTML;
}

//Full Post object containing the entire post and it's replies
function Post(title, author, date, replies, body) {
    this.title = title;
    this.author = author;
    this.date = date;
    this.replies = replies;
    this.body = body;
}

Post.prototype.generatePrimaryHTML = function() {
    var html = "";
    html+="<div class=\"post-header\">";
    html+="<div class=\"post-title\">";
    html+=this.title;
    html+="</div>";
    html+="<div class=\"post-author\">";
    html+=this.author;
    html+="</div>";
    html+="<div class=\"post-date\">";
    html+=convertDateToStr(this.date);
    html+="</div>";
    html+="</div>";
    html+="<div class=\"post-body\">";
    //Add thing here to convert short cuts into html
    html+=this.body;
    html+="</div>";
    return html;
}

Post.prototype.generateReplyHTML = function() {
    try {
        var a = this.replies;
    } catch (err) {
        //No replies
        return;
    }
    allReplies = "<div class=\"important\">Replies</div>";
    for (var i = 0; i < this.replies.length; i++) {
        allReplies+=this.replies[i].generateHTML(true);
    }
    return allReplies;
}

/* 
    Example post data
    title = "Hi - I'm xDest."
    author = "xDest"
    date = "0823171415"
    
    ===============
    
    The date is written as mmddyytttt where tttt is time in 24 hour time. 1415 is 2:15 pm
    
    - xDest
*/


//Function to convert dates like 0823171439 Into August 23, 2017 at 2:39 pm
//Does this using substring to split up the input
function convertDateToStr(str) {
    var nStr = "";
    var date = str;
    var monthN = Number(date.substr(0,2));
    var dayN = Number(date.substr(2,2));
    var yearN = Number(date.substr(4,2));
    var hourN = Number(date.substr(6,2));
    var minuteN = Number(date.substr(8,2));
    //alert(date.substr(0,2));
    var months = {"1":"January","2":"February","3":"March","4":"April","5":"May","6":"June","7":"July","8":"August","9":"September","10":"October","11":"November","12":"December"};
    //alert(months[Number(date.substr(0,2))]);
    var amPmStr = ((hourN > 11) ? "pm":"am");
    if(hourN > 12)
        hourN-=12;
    nStr+= months[monthN] + " " + dayN + ", 20" + yearN + " at " + hourN + ":" + ((minuteN < 10) ? "0"+minuteN:minuteN) + " " + amPmStr;
    return nStr;
}


/*
    A deferred function which calls the firebase database at the given location. 
    Retrieves the data from the location and returns it. It can be accessed through
    retrieveData..Location(loc).done(func (data) {}); where (data) is the data from the location.
    The data can either be an array, string, or anything else depending on the location
*/
function retriveDataPromiseAtLocation(location) {
    
    var $deferred = new $.Deferred();
    
    firebase.database().ref(location).once("value").then(function(data) {
        dataToReturn = data.val();
        $deferred.resolve(dataToReturn);
    });
    return $deferred.promise();
}


//This method *OVERRIDES* any previous written html in the element.
function insertHTMLToElement(newHTML, $location) {
    $location.html(newHTML);
}

//This function inserts the provided html to the given element, just before the specified child index. Untested.
function insertHTMLinElement(html, $location, childIndex) {
    if($location.length < childIndex) {
        childIndex = $location.length+1;
    }
    if(childIndex == 0) {
        $location.prepend(html);
    } else {
        $location.children().eq(childIndex-1).after(html);
    }
}

function createPostFromPostData(data) {
    var newPost = new Post(data.title, data.author, data.date, [], data.body);
    try {
        var postReplyData = data.replies;
        var postReplies = createRepliesFromPostReplyData(postReplyData);
        newPost.replies = postReplies;
        
    } catch (err) {
        //If no replies, end up here?
        console.log("No replies for this post.");
    }
    return newPost;
}

function createRepliesFromPostReplyData(data) {
    //Should be an array
    var dataAsReplies = [];
    for(var i = 0; i < data.length; i++) {
        dataAsReplies.push(new PostReply(data[i].author, data[i].body, data[i].date));
    }
    return dataAsReplies;
}



//Find illegal characters in string. This is mainly to be more safe when allowing uses to create posts. (Some users could add <input id="...".>> to fool people)
//This method returns the indicies of each illegal character.
function findIllegalChars(str) {
    var illegalChars = ['<','>'];
    var illegalIndicies = [];
    //As far as I can tell, these are the only illegal characters we need.
    for(var i = 0; i < str.length; i++) {
        for(var x = 0; x < illegalChars.length; x++) {
            if(str.charAt(i) === illegalChars[x]) {
                illegalIndicies.push(i);
            }
        }
    }
    return illegalIndicies;
}



function getIllegalReplacement(char) {
    var illegalChars = ['<','>'];
    var safeMatchups = ["&lt;","&gt;"];
    for(var i = 0; i < illegalChars.length; i++) {
        //This is so bad but i cant remember how to make keys / values
        if(char === illegalChars[i]) {
            return safeMatchups[i];
        }
    }
    return char;
}

function stringReplaceAt(str, index, replacement) {
    return str.substring(0,index) + replacement + str.substring(index+1, str.length);
}

function addLineBreaks(str) {
    var newLines = str.split("\n");
    if(newLines.length == 1)
        return str;
    var newStr = newLines[0]+"<br/>";
    for (var i = 1; i < newLines.length-1; i++) {
    newStr+=newLines[i];
    newStr+="<br/>";
    }
    newStr+=newLines[newLines.length-1];
    return newStr;
}

//This replaces illegal characters with the html short cuts and line breaks with <br>
function convertRawTextToSafeText(str) {
    var toChange = findIllegalChars(str);
    for(var i = toChange.length-1; i >= 0; i--) {
    		$("#t").append(i + "  " + toChange[i]);
        var badChar = str.charAt(toChange[i]);
        var newChar = getIllegalReplacement(badChar);
        str = stringReplaceAt(str, toChange[i], newChar);
    }
    str = addLineBreaks(str);
    return str;
}


function getCurrentDateFormatted() {
    var dateStr = "";
    var date = new Date();
    dateStr+=((date.getMonth()+1 < 10) ? "0"+(date.getMonth()+1):(date.getMonth()+1));
    dateStr+=((date.getDate()+1 < 10) ? "0"+date.getDate():date.getDate());
    dateStr+=(date.getFullYear()-2000);
    dateStr+=date.getHours();
    dateStr+=date.getMinutes();
    return dateStr;
}



function submitReplyToPost(postLocation, text, author) {
    text = convertRawTextToSafeText(text);
    retriveDataPromiseAtLocation(postLocation).done(function (x) {
        var tempPost = createPostFromPostData(x);
        var reply = new PostReply(author, text, getCurrentDateFormatted());
        tempPost.replies.push(reply);
        submitDataToLocation(postLocation+"/replies/"+(tempPost.replies.length-1), reply);
        location.reload(true);
        //Reload page
        //writePostToLocation(postLocation, tempPost);
    });
}

function submitDataToLocation(location, data) {
    firebase.database().ref(location).set(data);
}

//Careful, this will override.
function writePostToLocation(postLocation, post) {
    firebase.database().ref(postLocation).set(post);
}

