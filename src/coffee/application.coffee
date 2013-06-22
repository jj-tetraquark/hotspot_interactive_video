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


#####################################
#   Google analytics integration    #
#####################################
class HedgehogAnalyticsData

  # Assemble the constructor, give gaEnabled paramter access to send method
  constructor: (@enabled) ->
    @send()

  # Build the analytics data array
  build: (hedgehogs_array) ->
    if hedgehogs_array isnt undefined
      @category = 'hedgehog-interactive-video-'+hedgehogs_array[0]
      @identifier = hedgehogs_array[1]

    return ['_trackEvent', @category, 'click', @identifier]

  # Send the data array to the gaq object
  send: (hedgehogs_array) ->
    # Check if gaq object is available beforehand
    if @enabled
      _gaq.push(@build(hedgehogs_array))
    return