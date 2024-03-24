function timeSince(timeStamp) {
	// https://stackoverflow.com/questions/6108819/javascript-timestamp-to-relative-time/23352499#23352499
    var now = new Date(),
        secondsPast = Math.round((now.getTime() - timeStamp.getTime() ) / 1000);
    if(secondsPast < 60){
        if (secondsPast === 1) return secondsPast+' seconde'
        return secondsPast+' seconden';
    }
    if(secondsPast < 3600){
        const mins = parseInt(secondsPast/60)
        if (mins===1) return mins+' minuut';
        return mins+ ' minuten';
    }
    if(secondsPast <= 86400){
        const hours = parseInt(secondsPast/3600)
        if (hours === 1) return hours+' uur';
        return hours+ ' uur';
    }
    if(secondsPast <= 2628000){
        const days = parseInt(secondsPast/86400)
        if (days === 1) return days + ' dag';
        return days+ ' dagen';
    }
    if(secondsPast <= 31536000){
        const months = parseInt(secondsPast/2628000)
        if (months === 1) return months + ' maand';
        return months+ ' maanden';
    }
    if(secondsPast > 31536000){
        const years = parseInt(secondsPast/31536000)
        if (years === 1) return years + ' jaar';
        return years + ' jaar';
    }
}
