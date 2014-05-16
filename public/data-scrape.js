$('.forumdisplay_regular').each(function () { 
    var div = $(this).children().first();
    
    if (div.is('div')) {
        var html = div.html();

        var tid = html.match(/showthread\.php\?tid=(\d+)\&/)[1];
        var pid = html.match(/uid=(\d+)/)[1];
        var pname = html.match(/uid=\d+\">(.+?)<\/a/)[1];
        var did = null;
        
        if (html.match(/tid_\d+.+?uid\s*[-=:]*\s*(\d+)/i)) {
            var did = RegExp.$1;
        }
        
        if (html.match(/\$(\d+)|(\d+)\$/)) {
            var sev = (RegExp.$1) ? RegExp.$1 : RegExp.$2;
        }

        if (did) {
            console.log("[\n\t\"thread_id\": " + tid + ",\n\t\"plaintiff_id\": " + pid + ",\n\t\"plaintiff_name\": \"" + pname + "\",\n\t\"defendant_id\": " + did + ",\n\t\"defendant_name\": \"\",\n\t\"severity\": " + sev + ",\n\t\"status\": \"Open\"\n],");
        }
    }
});