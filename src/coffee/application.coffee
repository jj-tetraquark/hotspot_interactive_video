#####################################
#    Check if console exists (IE)   #
#####################################
log = (message) ->
  if typeof console is 'object' then console.log(message) else return null

$(document).ready ->
  # Check gaq object exists then setup new analytics class
  gaEnabled = if typeof _gaq is 'object' then true else false
  window.HedgehogGAData = new HedgehogAnalyticsData gaEnabled

  # Link list function call from video.js
  link_list()
  link_trigger()

  $('.mappings').on 'click', activeMap.Element, ->
    mainVid = 1
    DV.start_section activeMap.Begin
    tracker_tag = $(activeMap.Element).attr 'data-tracking'
    HedgehogGAData.send ["mapping",tracker_tag]

  $('.play').click ->
      DV.play()
      $(@).parent().hide()

  # Debugging buttons #    
  $('.btn-danger').click ->
    DV.pause()
  $('.play2').click ->
    DV.play()
  # End #
  return