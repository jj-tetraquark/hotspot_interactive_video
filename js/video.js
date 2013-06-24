var dysonPlayer;
var dysonVP;
var experienceModule;
var DV = {};
// Main video end parameter
var endParamater = 13; 
// JSON object of mapping data
var mappings = [
    {
        Begin: 2,
        Coords: "265,53,398,143",
        Tracker: "cleaner head",
        Vidstart: 14,
        Vidend: 18,
        End: 6,
        Linkname: "Dyson Cleaner head"
    },
    {
        Begin: 8,
        Coords: "162,228,278, 305",
        Tracker: "DDM",
        Vidstart: 20,
        Vidend: 24,
        End: 12,
        Linkname: "Dyson Digital Motor"
    }
];
// Object to contain current mapping environment variables
var activeMap = new Object();
activeMap.Return = 0;
activeMap.Element = undefined;
activeMap.Begin = 0;
activeMap.End = 0;
activeMap.Mapper = 0;
// Variable to trigger to the loop on the main video. Before a mapping link is evaluated and directed to a new piece of video content, the mainVid variable is updated to 1, in order to stop the video loop backing to the beginning (0) of the video
var mainVid = 0;
var current_map = 0;

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
    // Set current video position as global so the start_section function can access it, preventing it from running in the DV.onProgress function
    window.pos = evt.position;
    // If mainVid variable is set to 0 and current video position is equal to or more of the main video end timestamp parameter, seek video back to beginning ()
    if (window.pos >= endParamater && mainVid == 0) {
        seek_vid(0);
    }
    // Reset the current_map variable when the main video loops
    if (between(window.pos, 0, 0.5)) {
        activeMap.Mapper = 0;
        current_map = 0;
    }
    //MAPPING GENERATOR
    for (var map=0; map < mappings.length;map++)
    {
        // Add external current_map variable to prevent the if statement looping through all the values in the for loop
        mapData = mappings[current_map];
        if (between(window.pos, mapData.Begin, mapData.End)) {
            add_map(mapData.Begin, mapData.Tracker, mapData.Coords, mapData.Vidstart, mapData.Vidend);
        // Once the current video position is greater than the current array end value, increment the current_map variable
        } else if (greater(window.pos, mapData.End)) {
             current_map++;
             remove_map();
        } else {
            remove_map();
        }
    }
}
// Logic for starting a new video section after clicking a mapping
DV.start_section = function(start) {
    mainVid = 1;
    // Store the previous video position
    activeMap.Return = window.pos;
    // Point to the new video
    seek_vid(start);
    document.getElementById("eventLog").innerHTML += "USER EVENT: <b>"+activeMap.Element+"<b/> triggered<br/>";
    // Check every 100 millisecond and then return to the previous position value
    var position=setInterval(function() {
        if (window.pos >= activeMap.End) {
            current_map = activeMap.Mapper;
            seek_vid(activeMap.Return);
            document.getElementById("eventLog").innerHTML += "APPLICATION EVENT: Return to original location: <b>"+activeMap.Return+"<b/><br/>";
            mainVid = 0;
            clearInterval(position);
        }
    }, 100);
}
// Generate the list of links for each mapping
link_list = function() {
    for(var map=0; map < mappings.length;map++) {
        mapData = mappings[map];
        $('.map_links').append('<li class=\"map_' + mapData.Begin + '\" data-tracking=\"'+mapData.Tracker+'" data-id="'+mapData.Begin+'"><a href="#">'+mapData.Linkname+'</a><i class="icon-chevron-right"></i></li>');
    }
}
// Update the activeMap object and trigger the section of video. Then send to the analytics data class
link_trigger = function () {
    $('.map_links').on('click', 'li', function() {
        var target_map = $(this).attr('data-id');
        for(var map=0; map < mappings.length;map++) {
            mapData = mappings[map]
            if (target_map == mapData.Begin) {
                mainVid = 1;
                activeMap.Element = '.map_'+mapData.Begin;
                activeMap.Begin = mapData.Vidstart;
                activeMap.End = mapData.Vidend;
                DV.start_section(activeMap.Begin);
                tracker_tag = $(this).attr('data-tracking');
                HedgehogGAData.send(['link-list', tracker_tag]);
            }
        }

    });
}
DV.play = function() {
    DV.dysonVP.play();
}
DV.pause = function() {
    DV.dysonVP.pause(true);
}
//HELPER FUNCTIONS
between = function(x, min, max) {
    return x >= min && x <= max;
}
greater = function(x, max) {
    return x >= max;
}
add_map = function(element, tracker, coords, start, end) {
    // Remove spaces and replace with hyphens for the tracking data
    trim_tracker = tracker.split(' ').join('-');
    // Remove spaces from the coords string
    trim_coords = coords.replace(/\s/g, '');
    // Possible need to tighten this declaration down, to prevent it being so open
    if ($('area').length < 1) {
        $('.mappings').append('<area data-tracking="'+trim_tracker+'" class=\"map_'+element+'\" coords=\"'+trim_coords+'\" href=\"#\" shape=\"rect\">');
        activeMap.Element = '.map_'+element;
        activeMap.Begin = start;
        activeMap.End = end;
        activeMap.Mapper = current_map;
    } else {
        return false;
    }
}
remove_map = function() {
    // Remove all area tags
    $('.mappings').children().remove();
}
seek_vid = function(time) {
    return DV.dysonVP.seek(time);
}
