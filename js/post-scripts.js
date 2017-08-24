//This relies on util.js, firebase, and jQuery

$(document).ready(function() {
    //Load post
    //Find post location by splitting the url string at "?loc=", then looking at the right side of the split
    var postLocation = window.location.href.split("?loc=")[1];
   
    //Load post into webpage
    retriveDataPromiseAtLocation(postLocation).done(function(data) {
        var postData = data;
        if(postData == null) {
            alert("Post unable to be located.");
            return;
        }
        var post = createPostFromPostData(postData);
        insertHTMLToElement(post.generatePrimaryHTML(), $("#post-original"));
        insertHTMLToElement(post.generateReplyHTML(), $("#post-replies"));
    });
    
});