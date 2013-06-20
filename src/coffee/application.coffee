$(document).ready ->
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

  $('.play').click ->
    DV.play()
    $(@).parent().hide()
  $('.map_4').click ->
    DV.play()
    return false


txtAnimation = ->
  return $('.scene_trigger').removeClass("fadeInDown").addClass("fadeOutUp").one "webkitAnimationEnd animationend", ->

removeDisabled = (obj) ->
  return $('.'+obj+'').removeClass "disabled"