<?php
/**
 * Created by PhpStorm.
 * User: Mat Jones
 * Date: 1/14/14
 * Time: 5:59 AM
 */

//**  STARTING DATA **//

//Call the Service
$gcCal = $modx->getService('gcCalendar','gcCalendar',$modx->getOption('gcCalendar.core_path',null,$modx->getOption('core_path').'components/gcCalendar/').'model/gcCalendar/',$scriptProperties);
$output = '';
//limit conext key
$did =  $modx->resource->get('id');
$document = $modx->getObject('modResource',$did);
$key = $document->get('context_key');

$bcat = $modx->getOption('cat',$scriptProperties,null);
$cid = (isset($_GET['cid']) && is_numeric($_GET['cid']))?$_GET['cid']:$bcat;
$bcal = $modx->getOption('cal',$scriptProperties,null);
$cal = (isset($_GET['cal']) && is_numeric($_GET['cal']))?$_GET['cal']:$bcal;


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
        $calid[] = ($cal == null)?$cArr->get('id'):$cArr;
    }

    //getEventId's in this Context

    $calevs = $modx->newQuery('GcCalendarCalsConnect');
    $calevs->select(array('evid'));
    $calevs->where(array('calid:IN'=>$calid));
    $calevsArr = $modx->getIterator('GcCalendarCalsConnect',$calevs);
    $yesterday = strtotime('Today 12:01:00AM');

    if(!empty($calevsArr)){
        $cevid = array();
        foreach($calevsArr as $ceArr){
            $cevid[] = $ceArr->get('evid');
        }
        //$hqueryOptions[] = array('evid:IN'=>$cevid);

            //Category options
            $catOptsJoin = $modx->newQuery('GcCalendarCatsConnect');
            $catOptsJoin->select('cats.ctitle,cats.id');
            $catOptsJoin->leftJoin('GcCalendarCats','cats', array('GcCalendarCatsConnect.catsid = cats.id'));
            $catOptsJoin->leftJoin('GcCalendarEvents','base', array('GcCalendarCatsConnect.evid = base.id'));
            //$catOptsJoin->sortby('cats.parentid','ASC');
            $catOptsJoin->sortby('cats.ctitle','ASC');
            if(!empty($bcat)){
                $catOptsJoin->where(array('cats.id:='=>$bcat));
            }
            $catOptsJoin->where(array('GcCalendarCatsConnect.evid:IN'=>$cevid));
            $catOptsJoin->where(array('base.end:>'=>$yesterday,'OR:base.repeatenddate:>'=> $yesterday));
            $catOptsJoin->distinct();
            $cOItt = $modx->getIterator('GcCalendarCatsConnect',$catOptsJoin);
            $catOptArr=array();
            foreach($cOItt as $cO){
                $pid = 0;
                $id = $cO->get('id');
                $title = $cO->get('ctitle');
                if($pid== 0){
                    $catOptArr[$id] = array('title'=>$title, 'id'=>$id);
                }else{$catOptArr[$pid]['sub'][$id] = array('title'=>$title, 'id'=>$id); }
            }
            $selectGroup = '<option>All Categories</option>';
            $catTitle = '';
            foreach($catOptArr as $cOArr){
                $selected = '';
                if($cid == $cOArr['id']){$selected =' selected="selected"'; $catTitle= $cOArr['title'];}
                if(!empty($cOArr['sub'])){
                    $selectGroup .= '<optgroup label="'.$cOArr['title'].'">';
                    $selectGroup .= '<option value="'.$cOArr['id'].'" '.$selected.'>All Departments</option>';
                    foreach($cOArr['sub'] as $cOS){
                        $selected = '';
                        if($cid == $cOS['id'] && $bcat != $cOArr['id']){$selected =' selected="selected"'; $catTitle= $cOS['title'];}
                        $selectGroup .= '<option value="'.$cOS['id'].'" '.$selected.'>'.$cOS['title'].'</option>';
                    }
                    $selectGroup .= '</optgroup>';
                }else{
            
                    $selectGroup .= '<option value="'.$cOArr['id'].'" '.$selected.'>'.$cOArr['title'].'</option>';
                }
            
            }
        $output = $selectGroup;
    }
}
return $output;