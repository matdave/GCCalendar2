<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Mat Jones
 * Date: 9/29/13
 * Time: 10:30 PM
 * To change this template use File | Settings | File Templates.
 */

function getEventCalendarDateRange($activeMonthOnlyEvents=false){
    $startDate = $_REQUEST['dt'] ? $_REQUEST['dt'] :  strftime('%Y-%m');
    $mStartDate = strftime('%Y-%m',strtotime($startDate)) . '-01 00:00:01';
    $nextMonth = strftime('%Y-%m', strtotime('+1 month',strtotime($mStartDate)));
    $prevMonth = strftime('%Y-%m', strtotime('-1 month',strtotime($mStartDate)));
    $startDOW = strftime('%u', strtotime($mStartDate));
    $lastDayOfMonth = strftime('%Y-%m',strtotime($mStartDate)) . '-'.date('t',strtotime($mStartDate)) .' 23:59:59';
    $startMonthCalDate = $startDOW <= 6 ? strtotime('- '.$startDOW.' day', strtotime($mStartDate)) : strtotime($mStartDate)	;
    $endMonthCalDate = strtotime('+ 6 weeks', $startMonthCalDate);
    if($activeMonthOnlyEvents) return array('start'=>strtotime($mStartDate), 'end'=>strtotime($lastDayOfMonth)); else return array('start'=>$startMonthCalDate, 'end'=>$endMonthCalDate);
}


//**  STARTING DATA **//

//Call the Service
$gcCal = $modx->getService('gcCalendar','gcCalendar',$modx->getOption('gcCalendar.core_path',null,$modx->getOption('core_path').'components/gcCalendar/').'model/gcCalendar/',$scriptProperties);
$output = '';
$theme = $modx->getOption('theme',$scriptProperties,'default');
$modx->regClientCSS($gcCal->config['assetsUrl'].'themes/'.$theme.'/css/mxcalendar.css');
$modx->regClientStartupScript($gcCal->config['assetsUrl'].'snippets/gc-calendar.js?v=20130114');

/*$modx->regClientHTMLBlock('
<script type="text/javascript">
$(".gccalevent").magnificPopup({
		type: "ajax",
		mainClass: "mfp-fade",
		overflowY: "scroll" // as we know that popup content is tall we set scroll overflow by default to avoid jump
	});</script>');
*/
//limit conext key
$did =  $modx->resource->get('id');
$document = $modx->getObject('modResource',$did);
$key = $document->get('context_key');
$bcat = $modx->getOption('cat',$scriptProperties,null);
$cid = (isset($_GET['cid']) && is_numeric($_GET['cid']))?$_GET['cid']:$bcat;
$bcal = $modx->getOption('cal',$scriptProperties,null);
$cal = (isset($_GET['cal']) && is_numeric($_GET['cal']))?$_GET['cal']:$bcal;

$ajaxResourceId = $modx->getOption('ajaxResourceId', $scriptProperties, null);
$detail = (isset($_GET['detail']) && is_numeric($_GET['detail']))?$_GET['detail']:null;
$r = (isset($_GET['r']) && is_numeric($_GET['r']))?$_GET['r']:null;
$detailTpl = $modx->getOption('detailTpl',$scriptProperties,'gcCaldetail');
$selector = ($bcat == null)?'<select id="calselect" style="display:none;" data-gcc="/[[~'.$ajaxResourceId.']]" data-loc="/[[~'.$did.']]"></select>':'<div style="display:none; visibility:hidden;"><select id="calselect" style="display:none;" data-gcc="/[[~'.$ajaxResourceId.']]" data-loc="/[[~'.$did.']]"><option select="selected" value="'.$bcat.'"></select></div>';

if($detail != null && $r != null){

    $gcevent = $modx->getObject('GcCalendarEvents',$detail);
    $gctime = $modx->getObject('GcCalendarDates',$r);
    $gcevent->set('ical',$modx->makeUrl($ajaxResourceId,'',array('id' => $gcevent->get('id'), 'ics'=>1)));
    $gcevent->set('start',$gctime->get('start'));
    $gcevent->set('end',$gctime->get('end'));
    $gcevent->set('notes',preg_replace("~<a\s+href=[\'|\"]mailto:(.*?)[\'|\"].*?>.*?<\/a>~", "$1", $gcevent->get('notes')));
    $eDetails = $gcevent->toArray();
    $output.= $modx->getChunk($detailTpl,$eDetails);
}else{
//** Initial Time TPLS & Functions **//
    $mode = 'calendar';

$dayTpl = $modx->getOption('dayTpl',$scriptProperties,'gcCalday');
$weekTpl = $modx->getOption('weekTpl',$scriptProperties,'gcCalweek');
$monthTpl = $modx->getOption('monthTpl',$scriptProperties,'gcCalmonth');
$headingTpl = $modx->getOption('headingTpl',$scriptProperties,'gcCalheading');

$getList = (isset($_GET['list']) && is_numeric($_GET['list']))?$_GET['list']:0;
$list = $modx->getOption('list',$scriptProperties, $getList);
    if($list == 1 && !isset($_GET['dt'])){$mode = 'list';}

$getICS = (isset($_GET['ics']) && is_numeric($_GET['ics']))?$_GET['ics']:0;
$ical = $modx->getOption('ical',$scriptProperties, $getICS);
    if($ical == 1 && !isset($_GET['dt']) && isset($_GET['id'])){$mode = 'ical';}

$getSelect = (isset($_GET['select']) && is_numeric($_GET['select']))?1:0;
$select = $modx->getOption('select',$scriptProperties, $getSelect);
    if($select == 1){$mode = 'select';}
if(!isset($_GET['list']) && !isset($_GET['select']) && !isset($_GET['dt']) && !isset($_GET['ics'])){echo $selector;}

$modalView = $modx->getOption('modalView', $scriptProperties, false);
$activeMonthOnlyEvents = $modx->getOption('activeMonthOnlyEvents', $scriptProperties, 0);
$dr = getEventCalendarDateRange($activeMonthOnlyEvents);
$elStartDate = $dr['start'];
$elEndDate = $dr['end'];

//start Query
$hqueryOptions = array();
$equeryOptions = array();
$hqueryOptions[] = array('start:<='=>$elEndDate,'end:>='=>$elStartDate);


$time_start = microtime(true);

$startDate = $_GET['dt'] ? $_GET['dt'] : strftime('%Y-%m-%d');
$mStartDate = strftime('%Y-%m',strtotime($startDate)) . '-01 00:00:01';
$mCurMonth = strftime('%m', strtotime($mStartDate));
$nextMonth = strftime('%Y-%m', strtotime('+1 month',strtotime($mStartDate)));
$prevMonth = strftime('%Y-%m', strtotime('-1 month',strtotime($mStartDate)));
$startDOW = strftime('%u', strtotime($mStartDate));
$lastDayOfMonth = strftime('%Y-%m',strtotime($mStartDate)) . '-'.date('t',strtotime($mStartDate)) .' 23:59:59';
$endDOW = strftime('%u', strtotime($lastDayOfMonth));

$out = '';
$startMonthCalDate = $startDOW <= 6 ? strtotime('- '.$startDOW.' day', strtotime($mStartDate)) : strtotime($mStartDate)	;
$endMonthCalDate = strtotime('+ '.(6 - $endDOW).' day', strtotime($lastDayOfMonth));


$calFilter = isset($_GET['calf']) ? $_GET['calf'] : $modx->getOption('calendarFilter', $scriptProperties, null); //-- Defaults to show all calendars

$headingLabel = strtotime($mStartDate);
$globalParams = array('calf'=>$calFilter);
$todayLink = $modx->makeUrl($ajaxResourceId,'', array_merge($globalParams, array('dt' => strftime('%Y-%m'))));
$listLink = $modx->makeUrl($ajaxResourceId,'', array_merge($globalParams, array('list' => 1,'fc'=>1)));
$prevLink = $modx->makeUrl($ajaxResourceId,'', array_merge($globalParams, array('dt' => $prevMonth)));
$nextLink = $modx->makeUrl($ajaxResourceId,'', array_merge($globalParams, array('dt' => $nextMonth)));

$days = array('Sun','Mon','Tue','Wed','Thu','Fri','Sat');
$dayNum = array(7,1,2,3,4,5,6);
$heading = '';
function createDateRangeArray($strDateFrom,$strDateTo)
{
    // takes two dates formatted as YYYY-MM-DD and creates an
    // inclusive array of the dates between the from and to dates.

    // could test validity of dates here but I'm already doing
    // that in the main script

    $aryRange=array();

    $iDateFrom=mktime(1,0,0,substr($strDateFrom,5,2),     substr($strDateFrom,8,2),substr($strDateFrom,0,4));
    $iDateTo=mktime(1,0,0,substr($strDateTo,5,2),     substr($strDateTo,8,2),substr($strDateTo,0,4));

    if ($iDateTo>=$iDateFrom)
    {
        array_push($aryRange,date('Y-m-d',$iDateFrom)); // first entry
        while ($iDateFrom<$iDateTo)
        {
            $iDateFrom+=86400; // add 24 hours
            array_push($aryRange,date('Y-m-d',$iDateFrom));
        }
    }
    return $aryRange;
}
switch($mode){
    case 'calendar':
        if($cal == null){
        $cals = $modx->newQuery('GcCalendarCals');
        $cals->select(array('id'));
        $cals->where(array('key:='=>$key));
        $calsArr = $modx->getIterator('GcCalendarCals',$cals);
        }else{
            $calsArr = explode(",",$cal);
        }
        $arrEventDates=array();
        if(!empty($calsArr)){
            $calid = array();
            foreach($calsArr as $cArr){
                $calid[] =  ($cal == null)?$cArr->get('id'):$cArr;
            }

        //getEventId's in this Context

            $calevs = $modx->newQuery('GcCalendarCalsConnect');
            $calevs->select(array('evid'));
            $calevs->where(array('calid:IN'=>$calid));
            $calevsArr = $modx->getIterator('GcCalendarCalsConnect',$calevs);

            if(!empty($calevsArr)){
                $cevid = array();
                foreach($calevsArr as $ceArr){
                    $cevid[] = $ceArr->get('evid');
                }
                $hqueryOptions[] = array('evid:IN'=>$cevid);
                if($cid != null){
                    //$cqueryOptions[] = array('catsid'=>$cid);
                    $cats = $modx->newQuery('GcCalendarCatsConnect');
                    $cats->select('evid');
                    $cats->where(array('catsid'=>$cid));
                    $cats->distinct();
                    $catsItt = $modx->getIterator('GcCalendarCatsConnect',$cats);
                    if(!empty($catsItt)){
                        $ccevid = array();
                        foreach($catsItt as $cI){
                            $ccevid[] = $cI->get('evid');
                        }
                        $hqueryOptions[] = array('evid:IN'=>$ccevid);
                    }

                }

                $dates = $modx->newQuery('GcCalendarDates');
                $dates->where($hqueryOptions);
               // $dates->limit($limit,$offset);
                $dates->sortby('start','ASC');
                $dateArr = $modx->getIterator('GcCalendarDates',$dates);
                if(!empty($dateArr)){
                    $evitems = '';
                    $eo = 0;
                    $idx = 0;
                    $evitems=array();
                    foreach($dateArr as $dArr){

                        $evid = $dArr->get('evid');
                        $repid = $dArr->get('id');
                        $event = $modx->getObject('GcCalendarEvents',$evid);

                        $eventDet['id'] = $evid;
                        $eventDet['eo'] = $eo;
                        $eventDet['idx'] = $idx;
                        $eventDet['start'] = $dArr->get('start');
                        $eventDet['end'] =  $dArr->get('end');
                        $eventDet['ad'] = $event->get('ad');
                        $eventDet['title'] = $event->get('title');
                        $evitems[]= $eventDet;
                        $eo = ($eo == 0)?1:0;
                        $arrEventsDetail[$evid.'-'.$repid] = $eventDet;
                        $arrEventDates[$evid.'-'.$repid] = array('date'=>$eventDet['start'],'end'=>$eventDet['end'],'ad'=>$eventDet['ad'], 'eventId'=>$evid, 'eventRepId'=>$repid,'repeatId'=>0);
                        $idx++;

                    }

                }else{$output.='No upcoming events!';}

            }else{$output.='No items in this Calendar!';}


        }else{$output.='No Calendars assigned to this site!';}

        if($output == ''){
            for($i=0;$i<7;$i++){
                $thisDOW = str_replace($dayNum,$days,strtolower(strftime('%u', strtotime('+ '.$i.' day', $startMonthCalDate))));
                $heading.=$modx->getChunk($headingTpl, array('dayOfWeekId'=>'','dayOfWeekClass'=>'mxcdow', 'dayOfWeek'=> $thisDOW ));
            }
            //-- Set additional day placeholders for week
            $phHeading = array(
                'weekId'=>''
                ,'weekClass'=>''
                ,'days'=>$heading
            );
            $weeks = '';
            //-- Start the Date loop
            $var=0;
            foreach($arrEventDates AS $e){

                $oDetails = $arrEventsDetail[$e['eventId'].'-'.$e['eventRepId']]; //Get original event (parent) details
                $oDetails['startdate'] = $e['date'];
                $oDetails['enddate'] = $e['end'];
                if(( ( ($oDetails['startdate']>=$elStartDate || $oDetails['enddate'] >= $elStartDate) && $oDetails['enddate']<=$elEndDate) || $displayType=='detail' || $elDirectional ) ){

                    $oDetails['startdate_fstamp'] = $oDetails['startdate'];
                    $oDetails['enddate_fstamp'] = $oDetails['enddate'];

                    $oDetails['detailURL'] = $modx->makeUrl((!empty($ajaxResourceId) && (bool)$modalView === true ? $ajaxResourceId : $did),'',array('detail' => $e['eventId'], 'r'=>$e['eventRepId']));
                    if(strftime('%Y-%m-%d', $e['date']) == strftime('%Y-%m-%d', $e['end'])){
                    $events[strftime('%Y-%m-%d', $e['date'])][] = $oDetails;
                    }else{
                        $spandates = createDateRangeArray(strftime('%Y-%m-%d', $e['date']), strftime('%Y-%m-%d', $e['end']));
                        foreach($spandates as $spD){
                            $events[$spD][] = $oDetails;
                        }
                    }
                   // $output.= $e['date']. '<br/>';
                }
            }
            do{
                // Week Start date
                $iWeek = strtotime('+ '.$var.' week', $startMonthCalDate);
                $diw = 0;
                $days = '';
                do{
                    // Get the week's days
                    $iDay = strtotime('+ '.$diw.' day', $iWeek);
                    $thisMonth = strftime('%m', $iDay);

                    $eventList = '';
                    if(isset($events[strftime('%Y-%m-%d', $iDay)]) && count($events[strftime('%Y-%m-%d', $iDay)])){
                        //-- Echo each event item
                        $e = $events[strftime('%Y-%m-%d', $iDay)];

                        foreach($e AS $el){

                            //$eventList.=$chunkEvent->process($el);

                            // Check for images
                            /*$images = $modx->getCollection('mxCalendarEventImages', array('event_id' => $el['id'], 'active'=>1) );
                            $el['imagesTotal'] = $imgIdx = 0;
                           */
                            $el['start'] = ($el['ad'] != 1)?strftime('%l:%M %p', $el['start']):'All Day';
                            $event_html = '<div id="'.$el['id'].'" class="'.$el['eventClass'].'">'.$el['start'].'
                                                            <span class="title startdate "><a href="/'.$el['detailURL'].'" class="gccalevent" >'.$el['title'].'</a></span>
                                                        </div>';
                            $eventList.= $event_html;
                        }
                    }

                    //-- Set additional day placeholders for day
                    $isToday = (strftime('%m-%d') == strftime('%m-%d', $iDay) /*&& $highlightToday==true */? 'today ' : '');
                    $dayMonthName = strftime('%b',$iDay);
                    $dayMonthDay =  strftime('%d',$iDay);
                    $dayMonthDay = (strftime('%d',$iDay) == 1 ? strftime('%b ',$iDay).( substr($dayMonthDay,0,1) == '0' ? ' '.substr($dayMonthDay,1) : $dayMonthDay ) : ( substr($dayMonthDay,0,1) == '0' ? ' '.substr($dayMonthDay,1) : $dayMonthDay ));
                    $phDay = array(
                        //'dayOfMonth'=> str_replace('0', ' ', (strftime('%d',$iDay) == 1 ? strftime('%b %d',$iDay) : strftime('%d',$iDay)))
                        'dayOfMonth' => $dayMonthDay
                        ,'dayOfMonthID'=>'dom-'.strftime('%A%d',$iDay)
                        ,'events'=>$eventList
                        ,'fulldate'=>strftime('%m/%d/%Y', $iDay)
                        ,'tomorrow'=>strftime('%m/%d/%Y', strtotime('+1 day',  $iDay ))
                        ,'yesterday'=>strftime('%m/%d/%Y', strtotime('-1 day', $iDay ))
                        ,'class'=> $isToday/*.(array_key_exists(strftime('%Y-%m-%d', $iDay),$events) ? 'hasEvents' : 'noEvents')*/.($mCurMonth == $thisMonth ? '' : ' ncm')
                    );
                    //$days.=$chunkDay->process($phDay);
                    $days.=$modx->getChunk($dayTpl, $phDay);
                } while (++$diw < 7);


                //-- Set additional day placeholders for week
                $phWeek = array(
                    'weekId'=>'mxcWeek'.$var
                ,'weekClass'=>strftime('%A%d',$iDay)
                ,'days'=>$days
                );
                //$weeks.=$chunkWeek->process($phWeek);
                $weeks.=$modx->getChunk($weekTpl, $phWeek);

            } while (++$var < 6); //Only advance 5 weeks giving total of 6 weeks

            //
            $time_end = microtime(true);
            $time = $time_end - $time_start;
            //echo '<p>mxCalendar=>makeEventCalendar() processed in '.$time.'</p>';

            //-- Set additional day placeholders for month
            $phMonth = array(
                'containerID'=>strftime('%a',$iDay)
                ,'containerClass'=>strftime('%a%Y',$iDay)
                ,'weeks'=>$heading.$weeks
                ,'headingLabel'=>$headingLabel
                ,'todayLink'=>$todayLink
                ,'todayLabel'=> 'Today'
                ,'listLink'=> $listLink
                ,'prevLink'=>$prevLink
                ,'nextLink'=>$nextLink
            );
            //return $chunkMonth->process($phMonth);
            $output.= $modx->getChunk($monthTpl, $phMonth);
        }
        break;

    case 'list':
        $_GET['cid'] == $cid;
        $_GET['fc'] = 1;
        $xtrainfo = ($bcat != null)?'&cid='.$bcat:'';
        echo '<div id="calbody" style=""><div class="controls"><span class="mxcnav sm btn select"><i class="icon-list" style="font-style:normal;"></i></span><a href="'.$todayLink.$xtrainfo.'" class="mxcnav sm btn" id="mxccallnk" style="float:right"><i class="icon-th" style="font-style:normal;"></i></a></div>';
        include($modx->getOption('base_path') .'/assets/components/gcCalendar/snippets/gcCalList.php');
        break;

    case 'ical':
        include($modx->getOption('base_path') .'/assets/components/gcCalendar/snippets/gcCaliCal.php');
        break;

    case 'select':
        $_GET['cid'] == $cid;
        include($modx->getOption('base_path') .'/assets/components/gcCalendar/snippets/gcCalSelect.php');
        break;
    }
}
echo $output;
