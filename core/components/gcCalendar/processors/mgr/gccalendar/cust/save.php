<?php
/* @var modX $modx
 * @var array $scriptProperties
 * @var GcCalendarDates $object
 */

$id = (int)$modx->getOption('id',$scriptProperties,null);

if ($id > 0) {
    $object = $modx->getObject('GcCalendarDates',$id);
    if (!($object instanceof GcCalendarDates))
        return $modx->error->failure($modx->lexicon('gcCalendar.error.object_nf'));
} else {
    $object = $modx->newObject('GcCalendarDates');
}

$d = $scriptProperties;

$object->fromArray($d);
$object->set('ov',1);
$evid = $object->get('evid');
$startymd = $object->get('startymd');
$starthis = $object->get('starthis');
$endymd = $object->get('endymd');
$endhis = $object->get('endhis');
$ad = $object->get('ad');
   if (strpos($startymd, 'T') !== false) {
       $start = substr($startymd,0,strpos($startymd, 'T'));
   }else{
       $start = $startymd;
   }
   $start .= ' ';
   $start .= $starthis;
   $object->set('start',strtotime($start));

   if (strpos($endymd, 'T') !== false) {
       $end = substr($endymd,0,strpos($endymd, 'T'));
   }else{
       $end = $endymd;
   }
   $end .= ' ';
   $end .= $endhis;
   $object->set('end',strtotime($end));


if(!empty($ad)){$object->set('ad',(($starthis == '12:00 AM' && $endhis == '12:00 AM' )?1:0));}

$result = $object->save();

if (!$result) {
    return $modx->error->failure($modx->lexicon('gcCalendar.error.save'));
}
$ev = $modx->getObject('GcCalendarEvents', $evid);
$ev->set('ov',1);
$ev->save();

return $modx->error->success();

?>