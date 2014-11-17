<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Mat Jones
 * Date: 9/8/13
 * Time: 4:10 PM
 * To change this template use File | Settings | File Templates.
 */

$stime = strtotime($modx->getOption('start',$scriptProperties,'First day of this month'));
$etime = strtotime($modx->getOption('end',$scriptProperties,'Last day of this month'));

$dates = $modx->newQuery('GcCalendarDates');
$dates->select('*');
$dates->where(array('start:<= '=>$etime,'end:>='=>$stime));
$dateArr = $modx->getIterator('GcCalendarDates',$dates);

$evitems=array();
foreach($dateArr as $dArr){

                $evid = $dArr->get('evid');
                $repid = $dArr->get('id');
                $event = $modx->getObject('GcCalendarEvents',$evid);
            $repeaton =  $event->get('repeaton');
            $repeatmo = $event->get('repeatonmo');
            $repeatmo = explode(',',$repeatmo);
            $repeatmoArr = array();
            $repeatmoArr['type'] = (!empty($repeatmo))?$repeatmo[0]:null;
            $repeatmoArr['week'] = (count($repeatmo) > 1)?$repeatmo[1]:null;
                $eventDet['id'] = $evid;
                $eventDet['repId'] = $repid;
                $eventDet['cid'] = $event->get('cid');
                $eventDet['start'] = date('Y-m-d H:i:s',$dArr->get('start'));
                $eventDet['startymd'] = date('Y-m-d',$dArr->get('start'));
                $eventDet['starthis'] = date('g:i A',$dArr->get('start'));
                $eventDet['end'] =  date('Y-m-d H:i:s',$dArr->get('end'));
                $eventDet['endymd'] = date('Y-m-d',$dArr->get('end'));
                $eventDet['endhis'] = date('g:i A',$dArr->get('end'));
                $eventDet['ad'] = $event->get('ad');
                $eventDet['title'] = $event->get('title');
                $eventDet['notes'] = $event->get('notes');
                $eventDet['ad'] = $event->get('ad');
                $eventDet['cat'] = $event->get('cat');
                $eventDet['link'] = $event->get('link');
                $eventDet['previmage'] = $event->get('previmage');
                $eventDet['location'] = $event->get('location');
                $eventDet['locationphone'] = $event->get('locationphone');
                $eventDet['locationemail'] = $event->get('locationemail');
                $eventDet['locationname'] = $event->get('locationname');
                $eventDet['locationaddr'] = $event->get('locationaddr');
                $eventDet['locationcity'] = $event->get('locationcity');
                $eventDet['locationzip'] = $event->get('locationzip');
                $eventDet['locationstate'] = $event->get('locationstate');
                $eventDet['repeating'] = $event->get('repeating');
                $eventDet['repeattype'] = $event->get('repeattype');
                $eventDet['repeaton'] = $repeaton;
                $eventDet['repeatfrequency'] = $event->get('repeatfrequency');
                $eventDet['repeatenddate'] = date('Y-m-d',$event->get('repeatenddate'));
                $eventDet['repeatonmo'] = $repeatmoArr;
                $eventDet['repeatonc'] = ','.$repeaton.',';
                $eventDet['ov'] = $event->get('ov');
                $evitems[]= $eventDet;

            }

return $this->outputArray($evitems,sizeof($evitems));