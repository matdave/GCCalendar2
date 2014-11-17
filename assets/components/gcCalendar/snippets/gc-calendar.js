/*
 * mxCalendar AJAX navigation
 * by http://charlesmx.com
 * for ModX Revo
 * Ulitized in gcCalendar
 */
jQuery.extend({
    getUrlVars: function(){
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function(name){
        return jQuery.getUrlVars()[name];
    }
});
function popup(t){
$(t).magnificPopup({
    type: "ajax",
    mainClass: "mfp-fade",
    overflowY: "scroll" // as we know that popup content is tall we set scroll overflow by default to avoid jump
});
}
popup(".gccalevent"); leftCol();
$(function() { 
    var mxcCalPreContent = '';
    var mxcCalNexContent = '';
    var todayContent = '';
    var listContent = '';
    var calFullContent = '';
    var mxcCalPrev;
    var mxcCalNext;
    var urlParams = {};
    var mxcHistory = [];
    (function () {
        var e,
            a = /\+/g,  // Regex for replacing addition symbol with a space
            r = /([^&=]+)=?([^&]*)/g,
            d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
            q = window.location.search.substring(1);

        while (e = r.exec(q))
           urlParams[d(e[1])] = d(e[2]);
    })();
    
    function ajaxmxc(){
        catid = '';
        if($('#calselect').length > 0 && $('#calselect').val() != null){
            catid = '&cid='+$('#calselect').val();
        }
        mxcCalNext = document.getElementById("mxcnextlnk");
        mxcCalPrev = document.getElementById("mxcprevlnk");
        $("#mxcnextlnk, #mxcprevlnk").addClass("loading");
        if(mxcCalNext) {
            ajaxObj = '';
            nidx = mxcCalNext.href.indexOf("dt=");
            if(nidx != -1){
                ajaxObj = mxcCalNext.href.substring((nidx + 3),(nidx + 10));
                if(!mxcHistory[ajaxObj]){
                    $.get(mxcCalNext.href+catid+"&imajax=1 #calbody", {},
                       function(data){
                         mxcCalNexContent = data;
                         $("#mxcnextlnk").removeClass("loading");
                           popup(".gccalevent"); leftCol();
                       });
                } else {
                    mxcCalNexContent = mxcHistory[ajaxObj];
                    $("#mxcnextlnk").removeClass("loading");
                    popup(".gccalevent"); leftCol();
                }     
            }
        }
        if(mxcCalPrev) {
            ajaxObjP = '';
            nidxp = mxcCalPrev.href.indexOf("dt=");
            if(nidxp != -1){
                ajaxObjP = mxcCalPrev.href.substring((nidxp + 3),(nidxp + 10));
                if(!mxcHistory[ajaxObjP]){
                    $.get(mxcCalPrev.href+catid+"&imajax=1 #calbody", {},
                       function(data){
                         mxcCalPreContent = data;
                         mxcHistory[ajaxObjP] = data;
                         $("#mxcprevlnk").removeClass("loading");
                           popup(".gccalevent"); leftCol();
                       });
                } else {
                    mxcCalPreContent = mxcHistory[ajaxObjP];
                    $("#mxcprevlnk").removeClass("loading");
                    popup(".gccalevent"); leftCol();
                }     
            }
        }

        /*if(modalActive){
            Shadowbox.teardown('.mxcmodal');
            Shadowbox.clearCache();
            Shadowbox.setup(".mxcmodal", sbOptions);
        }*/
        
        mxcBindEvents();

    }
    function addHistory(url){
        var stateObj = {};
        if(url)
        history.pushState(stateObj, "Calendar", url);
    }
    function mxcBindEvents(){
        catid = '';
        if($('#calselect').length > 0 && $('#calselect').val() != null){
            catid = '&cid='+$('#calselect').val();
        }
        $('#mxcnextlnk').on('click', function(event) { 
        event.preventDefault();
        if(!$("#mxcnextlnk, #mxcprevlnk").hasClass('loading')){
            $("#calbody").html(mxcCalNexContent);
            //addHistory(mxcCalNext);
            ajaxmxc();
        }
        });
        $('#mxcprevlnk').on('click', function(event) { 
            event.preventDefault();
            if(!$("#mxcnextlnk, #mxcprevlnk").hasClass('loading')){
                $("#calbody").html(mxcCalPreContent);
                //addHistory(mxcCalPrev);
                ajaxmxc();
            }
        });
        $('#mxctodaylnk').on('click', function(event) { 
            event.preventDefault();
            if(todayContent != ''){
                $("#calbody").html(todayContent);
                ajaxmxc();
            } else {
                $.get(this.href+catid+"&imajax=1", {},
                function(data){
                    todayContent = data;
                    $("#calbody").html(todayContent);
                    ajaxmxc();
                });
            }
        });
        $('#mxclistlnk').on('click', function(event) {
            event.preventDefault();
                if(listContent != ''){
                    $("#calbody").html(listContent);
                    ajaxmxc();
                    popup(".gccalevent"); leftCol();
                } else {
                    $.get(this.href+catid+"&imajax=1", {},
                    function(data){
                        listContent = data;
                        $("#calbody").html(listContent);
                        ajaxmxc();
                        popup(".gccalevent"); leftCol();
                    });
                }
            });
        $('#mxccallnk').on('click', function(event) {
            event.preventDefault();
                if(calFullContent != ''){
                    $("#calbody").html(calFullContent);
                    ajaxmxc();
                    popup(".gccalevent"); leftCol();
                } else {
                    $.get(this.href+catid+"&imajax=1", {},
                    function(data){
                        calFullContent = data;
                        $("#calbody").html(calFullContent);
                        ajaxmxc();
                        popup(".gccalevent"); leftCol();
                    });
                }

            });
    }

    //-- Get today's content
   if(document.getElementById("mxctodaylnk") != null && todayContent == ''){
       startcid = ($.getUrlVars()['cid'] != null)?'&cid='+$.getUrlVars()['cid']:'';
    $.get(document.getElementById("mxctodaylnk").href+startcid+"&imajax=1", {},
       function(data){
         todayContent = data;
           popup(".gccalevent"); leftCol();
       });
    ajaxmxc();
   }
    //-- Get List Content
   if(document.getElementById("mxccallnk") != null && calFullContent == ''){
       startcid = ($.getUrlVars()['cid'] != null)?'&cid='+$.getUrlVars()['cid']:'';
    $.get(document.getElementById("mxccallnk").href+startcid+"&imajax=1", {},
       function(data){
           calFullContent = data;
           popup(".gccalevent"); leftCol();
       });
    ajaxmxc();
   }
});

$(document).ready(function(){

    if($('#calselect').length > 0){
        var cats={
            select: 1,
            cid: $.getUrlVars()['cid']
        }
        var gcc = $('#calselect');
        $.ajax({
            type: "GET",
            url: gcc.attr('data-gcc'),
            data:cats,
            success: function(res) {
                if(res!=''){$("#calselect").prop('disabled',false).show().append(res);}
            },
            complete: function(){
               // $("#ddpricat").trigger("chosen:updated");
            }
        });
        gcc.change(function(){
            window.location.href = gcc.attr('data-loc')+'?cid='+gcc.val();
        });
    }
});
