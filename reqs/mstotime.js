module.exports = function msToTime(s, lang) {
	let ms = s % 1000
	s = (s - ms) / 1000
	let secs = s % 60
	s = (s - secs) / 60
	let mins = s % 60
	let hrs = (s - mins) / 60
	if (lang == 'ru') {
		let hrs_last_number = hrs.toString().split('').reverse()[0]
		let mins_last_number = mins.toString().split('').reverse()[0]
		let secs_last_number = secs.toString().split('').reverse()[0]
    	if (hrs_last_number == 1) {var hrs_string = ' час '} else if ((hrs_last_number > 1) && (hrs_last_number < 5)) {var hrs_string = ' часа '} else {var hrs_string = ' часов '}
    	if (mins_last_number == 1) {var mins_string = ' минута '} else if ((mins_last_number) > 1 && (mins_last_number < 5)) {var mins_string = ' минуты '} else {var mins_string = ' минут '}
		if (secs_last_number == 1) {var secs_string = ' секунда '} else if ((secs_last_number) > 1 && (secs_last_number < 5)) {var secs_string = ' секунды '} else {var secs_string = ' секунд '}
	}
	else {
		if (hrs == 1) {var hrs_string = ' hour '} else {var hrs_string = ' hours '}
    	if (mins == 1) {var mins_string = ' minute '} else {var mins_string = ' minutes '}
		if (secs == 1) {var secs_string = ' second '} else {var secs_string = ' seconds '}
	}
	let result = ''
	if ((hrs == 0) && (mins == 0) && (secs == 0)) {result = translation[lang].mstotime_less}
	if (hrs > 0) {result = result + hrs + hrs_string}
	if (mins > 0) {result = result + mins + mins_string}
	if (secs > 0) {result = result + secs + secs_string}
	return result
}