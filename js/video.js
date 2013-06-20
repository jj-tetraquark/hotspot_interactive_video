var dysonPlayer;
var dysonVP;
var experienceModule;
var DV = {}
var mbegin = new Array(15,20);
var mend = new Array(19,24);
var lend = [];
DV.videoTemplateLoad = function(experienceID) {
    console.log("INTERACTIVE VIDEO: TEMPLATE_LOADED")
    DV.dysonPlayer = brightcove.getExperience(experienceID);
    DV.experienceModule = DV.dysonPlayer.getModule(APIModules.EXPERIENCE);
    DV.experienceModule.addEventListener(BCExperienceEvent.TEMPLATE_READY, DV.videoTemplateReady);
}
DV.videoTemplateReady = function(evt) {
    console.log("INTERACTIVE VIDEO: TEMPLATE_READY");
    DV.dysonVP = DV.dysonPlayer.getModule(APIModules.VIDEO_PLAYER)
    DV.dysonVP.setBackBufferCapacity(120);
    DV.dysonVP.setBufferCapacity(120);
    DV.dysonVP.addEventListener(BCMediaEvent.PLAY, DV.onPlay);
    DV.dysonVP.addEventListener(BCMediaEvent.PROGRESS, DV.onProgress);
    DV.dysonVP.addEventListener(BCMediaEvent.COMPLETE, DV.onComplete);
}
DV.onPlay = function(evt) {
   document.getElementById("eventLog").innerHTML += "MEDIA EVENT: " + evt.type + " fired at position: " + evt.position + "<BR>";
}
DV.onProgress = function (evt) {    
    var dur = evt.duration;
    var pos = evt.position;
    //MAPPING GENERATOR
    if (equal_to(mbegin, mend)) 
    {
        setTimeout(function() {
            for (var map=0; map < mbegin.length;map++)
            {
                var el = '.map_' + Math.floor(mbegin[map]);
                if (between(pos, mbegin[map], mend[map])) {
                    add_map(el);
                    map++;
                } else {
                    remove_map(el);
                }
            }
        }, 1000);
    } else {
        console.log("WARNING: You do not have equal mapping begin and end values!");
    }
}
DV.restart = function() {
    //Resets the scene variable back to 0 to trigger the first loop and sets the video position back to 0
    scene = 0;
    seek_vid(0);
    document.getElementById("eventLog").innerHTML += "USER EVENT: <b>Journey reset<b/><br/>";
    return false;
}
DV.play = function() {
    DV.dysonVP.play();
}
//HELPER FUNCTIONS
between = function(x, min, max) {
    return x >= min && x <= max;
}
greater_than = function(x,min) {
    return x >= min;
}
lesser_greater = function(x, min, max) {
    return x < min && x > max;
}
add_map = function(elem) {
    if ($('.mappings').children().length < 1) {
        $('.mappings').append('<area alt=\"Cleaner head\" class=\"map_15\" coords=\"265,53,398,143\" href=\"#\" shape=\"rect\">');
    } else {
        return false;
    }
}
remove_map = function(elem) {
    $('.mappings').children().remove();
    console.log("NOOOO");
}
for_loop = function(time_val, time, duration) {
    for (var i=0; i < time_val.length; i++)
    {   
        var obj = duration-time_val[i];
        time.push(obj);
    }
}
equal_to = function(z,y) {
    return z.length == y.length
}
seek_vid = function(time) {
    return DV.dysonVP.seek(time);
}