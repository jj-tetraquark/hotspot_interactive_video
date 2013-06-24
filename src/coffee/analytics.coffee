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
    if @enabled
      _gaq.push(@build(hedgehogs_array))
    return