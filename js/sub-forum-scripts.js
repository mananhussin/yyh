//This file relies on util.js, firebase, and jQuery

//This function takes an array of posts, and arranges them based on last index to first index
//After the arrangement (up to the specified amount), it uses the insert location to insert the generated html.
function arrangePostsOnPageByMostRecent(posts, amount, $insertLocation, postLoadLocation) {
    var finIndex = posts.length-1;
    var loadedPosts = [];
    if (posts.length < amount) {
        amount = posts.length;
    }
    for(var i = 0; i < amount; i++) {
        var val = posts[finIndex-i];
        var replyCount = 0;
        try {
            replyCount = val.replies.length;
        } catch (err) {
            //There are no replies, ok.
        }
        var post = new PostPreview(val.title, val.author, val.date, replyCount);
        //Don't need to check date of posts because each post is added after the most recent (The largest index will be the most recent unless we change something)
        loadedPosts.push(post);
    }
    
    var newHTML = "";
    for (var i = 0; i < loadedPosts.length; i++) {
        //Adds proper link to page
        newHTML+=loadedPosts[i].generateHTML(postLoadLocation+"/"+(loadedPosts.length-1-i));
    }
    //alert(newHTML);
    insertHTMLToElement(newHTML, $insertLocation);
}


$(document).ready(function () {
    
    //When the document has loaded, load posts by post date.
    //Call on the div with the id forumtitle, and get it's text to identify which sub forum to look at.
    var subForum = $("#forumtitle").text();
    var promiseLocation = "forums/"+subForum;
    retriveDataPromiseAtLocation(promiseLocation).done(function (data) {
        var posts = data;
        
        if(posts == null) {
            console.log("No posts found.");
            insertHTMLToElement("<center><span style=\"color:white\">No posts found.</span></center>", $(".forum-group"));
            return;
        }
        //Show 10 most recent posts, insert in **ALL** divs (there should only be one) with the forum-group class.
        arrangePostsOnPageByMostRecent(posts, 10, $(".forum-group"), promiseLocation);
    });
});