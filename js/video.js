var dysonPlayer;
var dysonVP;
var experienceModule;
var DV = {}
var scene = 0;
//text time array
var tbegin = new Array(31,54);
var tend = new Array(36,57);
//loop time array
var lbegin = new Array(6,14,24,44); //array of loop begin values
var lend_value = new Array(8,18,28,53); //array of loop lend values
var lend = [];
var vidReady = 0;
DV.videoTemplateLoad = function(experienceID) {
    console.log("INTERACTIVE VIDEO: TEMPLATE_LOADED")
    DV.dysonPlayer = brightcove.getExperience(experienceID);
    DV.experienceModule = DV.dysonPlayer.getModule(APIModules.EXPERIENCE);
    DV.experienceModule.addEventListener(BCExperienceEvent.TEMPLATE_READY, DV.videoTemplateReady);
}
DV.videoTemplateReady = function(evt) {
    console.log("INTERACTIVE VIDEO: TEMPLATE_READY");
    vidReady = 1;
    DV.dysonVP = DV.dysonPlayer.getModule(APIModules.VIDEO_PLAYER)
    DV.dysonVP.setBackBufferCapacity(120);
    DV.dysonVP.setBufferCapacity(120);
    DV.dysonVP.addEventListener(BCMediaEvent.PLAY, DV.onPlay);
    DV.dysonVP.addEventListener(BCMediaEvent.PROGRESS, DV.onProgress);
    DV.dysonVP.addEventListener(BCMediaEvent.COMPLETE, DV.onComplete);
}
DV.onProgress = function (evt) {    
    var dur = evt.duration;
    var pos = evt.position;
    // Creates new array and loops through the end loop values to calcuate the difference between the video duration and the end value of the loop. This then provides the value to subtract from the video duration to reach the desired end loop value, which is required in the video loop logic.
    for_loop(lend_value, lend, dur);
    //LOOP GENERATOR
    //checks there is an equal amount of begin and end values
    if (equal_to(lbegin, lend_value)) 
    {
        //iterates through the each begin value and creates the desired loop point
        for (var lp=0; lp < lbegin.length; lp++)
        {   
            if (greater_than(pos, dur - lend[lp]) && scene == lp) {
                //checks if text elements have the animate class, if not adds it to enable fade in it at the correct time
                var el = '.scene_' + Math.floor(lbegin[lp]);
                show_text(el);
                seek_vid(lbegin[lp]);
            }
        }
    } else {
        console.log("WARNING: You do not have equal loop begin and end values!");
    }
    //TEXT GENERATOR
    if (equal_to(tbegin, tend)) 
    {
        for (var txt=0; txt < tbegin.length; txt++)
        {
            var el = '.popover_' + Math.floor(tbegin[txt]);
            if (between(pos, tbegin[txt], tend[txt])) {
                show_text(el);
            } else {
                hide_text(el);
            }
        }
    } else {
        console.log("WARNING: You do not have equal text begin and end values!");
    }
}
//USER ACTIONS
DV.next = function() {
    //increases scene value by 1 upon clicking a CTA to remove current loop and trigger the next loop
    scene++;
    current_scene = scene+1;
    return false;
}
DV.restart = function() {
    //Resets the scene variable back to 0 to trigger the first loop and sets the video position back to 0
    scene = 0;
    seek_vid(0);
    return false;
}
DV.select_scene = function(location) {
    if (location > 0) {
        seek_vid(lend_value[location-1]);
    } else {        
        seek_vid(0);
    }
    scene = location;
    return false;
}
DV.play = function() {
    DV.dysonVP.play();
}
DV.prev_scene = function() {
    if (scene > 1) {
        scene--;
        previous_scene = lend_value[scene-1];
        seek_vid(previous_scene);
    } else {
        scene--;
        seek_vid(0);
    }
    return false;
}
DV.next_scene = function() {
    if (scene < lbegin.length) {
        seek_vid(lend_value[scene]);
        scene++;
    }
    return false;
}
//HELPER FUNCTIONS
between = function(x, min, max) {
    return x >= min && x <= max;
}
greater_than = function(x,min) {
    return x >= min;
}
show_text = function(elem) {
    if ($jq(elem).hasClass('fadeOutUp')) 
    {
        $jq(elem).removeClass('fadeOutUp').show().addClass('fadeInDown');
    }
}
hide_text = function(elem) {
    if ($jq(elem).hasClass('fadeInDown')) 
    {
        $jq(elem).removeClass('fadeInDown').addClass('fadeOutUp').one('webkitAnimationEnd animationend', function() { });
    }
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