$(document).ready ->
  $('.static_trigger').click ->
    $('.video_wrapper').removeClass('inactive').show().addClass 'activated'
    $('.static_wrapper').removeClass('activated').hide().addClass 'inactive'
    setInterval(playTab, 200);


  $('.scene').click ->
    if !$(@).hasClass "disabled"
      $(@).addClass "disabled"
      DV.next()
      hideArrows()
      removeDisabled("end_scene")
      txtAnimation()
      changePin(1)

  $('.reset').click ->
    DV.restart()
    hideArrows()
    $(@).addClass "disabled"
    removeDisabled("scene")
    txtAnimation()
    changePin(1)

  # Trigger the interactive video by clicking the tab
  current_tab = $('.tab_trigger').parent().parent().index()
  $('li.act-'+current_tab).click ->
    setInterval(playTab, 200);

  # Render the static introduction content again upon click the tab
  static_current_tab = $('.static_tab_trigger').parent().parent().index()
  $('li.act-'+static_current_tab).click ->
    $('.static_wrapper').removeClass('inactive').show().addClass 'activated'
    $('.video_wrapper').removeClass('activated').hide().addClass 'inactive'
    $('#pins').hide().addClass 'inactive'



  $(document).on "click", ".icon-chevron-left", ->
    DV.prev_scene()
    hideArrows()
    txtAnimation()
    removeDisabled("scene")
    changePin(0)
    

  $(document).on "click", ".icon-chevron-right", ->
    DV.next_scene()
    hideArrows()
    txtAnimation()
    removeDisabled("scene")
    changePin(1)

  $(document).on "click", ".icon-circle", ->
    pinNumber = $(@).index()
    $('.active-pill').removeClass 'active-pill'
    $(@).addClass 'active-pill'
    removeDisabled("scene")
    txtAnimation()
    DV.select_scene(pinNumber)
    hideArrows()

  if lbegin.length is lend_value.length
    i = 0
    # Creates the pins dynamically from the timing array
    while i < lbegin.length
      $('#pins').append '<i class="icon-circle"></i>'
      i++
    if lbegin.length > 1
      # Create and position the scene navigation
      $('.video_wrapper').prepend('<i class="icon-chevron-left"></i>').append '<i class="icon-chevron-right"></i>'
      vheight = $('.video_wrapper').height()
      iheight = vheight/2
      # Temporary: The +60 is for the buffer above the video in the prototype and the -15 is half the height of the chevron icons
      $('.video_wrapper i').css "top", iheight-15

  $('#pins').find('.icon-circle:first-child').addClass 'active-pill'

# HELPER FUNCTIONS
changePin = (direction) ->
  active = $(".active-pill").removeClass("active-pill")
  if direction is 1
    if active.next() and active.next().length
        active.next().addClass "active-pill"
    else
      active.siblings(":first").addClass "active-pill"
  else
    if active.prev() and active.prev().length
        active.prev().addClass "active-pill"
    else
      active.siblings(":first").addClass "active-pill"

hideArrows = ->
    if scene is 0
        $('.icon-chevron-left').hide()
        $('.icon-chevron-right').show()
    else if scene is 3
        $('.icon-chevron-right').hide()
        $('.icon-chevron-left').show()
    else 
      $('.icon-chevron-left').show()
      $('.icon-chevron-right').show()

playTab = ->
  if vidReady is 1
    DV.play()
    hideArrows()
    txtAnimation()
    $('#pins').removeClass('inactive').show().addClass 'activated'
    vidReady++
  else
    return false

txtAnimation = ->
  return $('.scene_trigger').removeClass("fadeInDown").addClass("fadeOutUp").one "webkitAnimationEnd animationend", ->

removeDisabled = (obj) ->
  return $('.'+obj+'').removeClass "disabled"