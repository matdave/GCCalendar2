<?php

$gcCal = $modx->getService('gcCalendar','gcCalendar',$modx->getOption('gcCalendar.core_path',null,$modx->getOption('core_path').'components/gcCalendar/').'model/gcCalendar/',$scriptProperties);

/**
 * Created by JetBrains PhpStorm.
 * User: video2
 * Date: 10/9/13
 * Time: 2:44 PM
 * To change this template use File | Settings | File Templates.
 */

/* FUNCTIONS!!*/
// requires 24-hour time (see RFC 5545 section 3.3.12 for info).
function dateToCal($timestamp) {
  return date('Ymd\THis', $timestamp);
}

// Escapes a string of characters
function escapeString($string) {
  return preg_replace('/([\,;])/','\\\$1', $string);
}
/* Get ID*/
$evid = (isset($_GET['id']) && is_numeric($_GET['id']))?$_GET['id']:null;
if($evid != null){
/* PROCESS */
$dates = $modx->newQuery('GcCalendarDates');
// $dates->limit($limit,$offset);
$dates->where(array('evid:=' => $evid));
$dates->sortby('start','ASC');
$dateArr = $modx->getIterator('GcCalendarDates',$dates);
    $event = $modx->getObject('GcCalendarEvents',$evid);
    header('Content-type: text/calendar; charset=utf-8');
    header('Content-Disposition: attachment; filename=' . $event->get('title') .'.ics');
    $output='BEGIN:VCALENDAR'.PHP_EOL;
    $output.='VERSION:2.0'.PHP_EOL;
    $output.='PRODID:-//gcCalendar//IdeaBank Marketing//EN_US'.PHP_EOL;
    $output.='METHOD:PUBLISH'.PHP_EOL;
    $output.='CALSCALE:GREGORIA'.PHP_EOL;
foreach($dateArr as $dArr){
                $output.='BEGIN:VEVENT'.PHP_EOL;
                $output.='DTEND;TZID=America/Chicago:'.dateToCal($dArr->get('end')).PHP_EOL;
                $output.='UID:'.$dArr->get('id').PHP_EOL;
                $output.='DTSTAMP:'.dateToCal(time()).PHP_EOL;
                $output.='LOCATION:'.$event->get('locationname').' '.$event->get('locationaddr').' '.$event->get('locationcity').', '.$event->get('locationstate').' '.$event->get('locationzip').PHP_EOL;
                $output.='DESCRIPTION:'.strip_tags($event->get('notes')).PHP_EOL;
                $output.='URL;VALUE=URI:'.$event->get('link').PHP_EOL;
                $output.='SUMMARY:'.$event->get('title').PHP_EOL;
                $output.='DTSTART;TZID=America/Chicago:'.dateToCal($dArr->get('start')).PHP_EOL;
                $output.='END:VEVENT'.PHP_EOL;
            }
    $output.='END:VCALENDAR';

}else{echo "Please Enter a Valid ID";}