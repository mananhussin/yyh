//Allows us to create Post() objects while staying consistent. This doesn't contain all of the posts data, just the data we need for the list. - xDest

function Post() {
    this.title = "Post Title";
    this.author = "Post Author";
    this.date = "0101001100";
    this.replyCount = 0;
}

//Same thing as the previous, but this time to create a Post() with all the data included
function Post(title, author, date, replyCount) {
    this.title = title;
    this.author = author;
    this.date = date;
    this.replyCount = replyCount;
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


//This function takes an array of posts, and arranges them based on last index to first index
//After the arrangement (up to the specified amount), it uses the insert location to insert the generated html.
function arrangePostsOnPageByMostRecent(posts, amount, $insertLocation) {
    var finIndex = posts.length-1;
    var loadedPosts = [];
    if (posts.length < amount) {
        amount = posts.length;
    }
    for(var i = 0; i < amount; i++) {
        var val = posts[finIndex-i];
        var post = new Post(val.title, val.author, val.date, val.replies.length);
        //Don't need to check date of posts because each post is added after the most recent (The largest index will be the most recent unless we change something)
        loadedPosts.push(post);
    }
    
    var newHTML = "";
    for (var i = 0; i < loadedPosts.length; i++) {
        newHTML+= "<div class=\"group-item\"><div class=\"post-list-title\"><a href=\"#\">" + loadedPosts[i].title + "</a></div>";
        newHTML+= "<div class=\"post-list-author\">" + loadedPosts[i].author + "</div>";
        newHTML+= "<div class=\"post-list-date\">" + convertDateToStr(loadedPosts[i].date) + "</div>";
        newHTML += "<div class=\"post-list-replies\"> Replies: " + loadedPosts[i].replyCount + "</div></div>";
    }
    //alert(newHTML);
    $insertLocation.html(newHTML);
}


$(document).ready(function () {
    
    //When the document has loaded, load posts by post date.
    //Call on the div with the id forumtitle, and get it's text to identify which sub forum to look at.
    var subForum = $("#forumtitle").text();
    retriveDataPromiseAtLocation("forums/server/introductions").done(function (data) {
        var posts = data;
        
        if(posts == null) {
            console.log("No posts found.");
            return;
        }
        //Show 10 most recent posts, insert in **ALL** divs (there should only be one) with the forum-group class.
        arrangePostsOnPageByMostRecent(posts, 10, $(".forum-group"));
    });
});