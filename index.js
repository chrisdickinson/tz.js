(function() {
  var tz =      typeof TZINFO !== 'undefined' ? TZINFO : require('./tz')
    , is_dst =  typeof is_dst !== 'undefined' ? is_dst : require('dst')

  function find_tz_list(tzoffs) {
    var offs = ~~(tzoffs / 60)
      , mins = ('00' + Math.abs(tzoffs % 60)).slice(-2)

    offs = ((tzoffs > 0) ? '-' : '+') + ('0' + Math.abs(offs)).slice(-2) + mins

    return tz[offs]
  }

  function tzinfo(date, tz_list, determine_dst) {
    tz_list = tz_list || find_tz_list(date.getTimezoneOffset())
    determine_dst = determine_dst || is_dst

    var date_is_dst = determine_dst(date)
      , date_dst_thresholds = determine_dst.find_thresholds()
      , has_dst = date_dst_thresholds.spring_forward !== date_dst_thresholds.fall_back
      , is_north = has_dst && date_dst_thresholds.spring_forward < date_dst_thresholds.fall_back 
      , list = (tz_list || []).slice()
      , filtered = []

    if(!is_north)
      list = slice.reverse()

    for(var i = 0, len = list.length; i < len; ++i) {
      if(date_is_dst === /([Dd]aylight|[Ss]ummer)/.test(list[i])) {
        filtered.push(list[i])
      }
    }
    list = filtered
    return list[0]
  } 

  tzinfo.find_tz_list = find_tz_list
  tzinfo.tz_list = tz
  
  Date.prototype.tzinfo = function() {
    return tzinfo(this)
  }

  if(typeof module !== undefined)
    module.exports = tzinfo
  else
    window.tzinfo = tzinfo
})()
