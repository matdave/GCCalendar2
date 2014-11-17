<?php
include('RepeatDateHelper.php');

class gcCalendarCreateProcessor extends modObjectCreateProcessor {
    public $classKey = 'GcCalendarEvents';
    public $languageTopics = array('gcCalendar:default');
    public $objectType = 'gcCalendar.gcCalendar';

    public function beforeSet(){

        $this->setProperty('cid',(implode(',',$this->getProperty('cid'))));
        $this->setProperty('cat',(implode(',',$this->getProperty('cat'))));

        $startymd = $this->getProperty('startymd');
        $starthis = $this->getProperty('starthis');
        $endymd = $this->getProperty('endymd');
        $endhis = $this->getProperty('endhis');
        $ad = $this->getProperty('ad');
            if (strpos($startymd, 'T') !== false) {
                $start = substr($startymd,0,strpos($startymd, 'T'));
            }else{
                $start = $startymd;
            }
            $start .= ' ';
            $start .= ($ad=='true'||$ad=='1')?'12:15 AM':$starthis;
            $this->setProperty('start',strtotime($start));

            if (strpos($endymd, 'T') !== false) {
                $end = substr($endymd,0,strpos($endymd, 'T'));
            }else{
                $end = $endymd;
            }
            $end .= ' ';
            $end .= ($ad=='true'||$ad=='1')?'11:45 AM':$endhis;
            $this->setProperty('end',strtotime($end));

        //account for browser checkbox behaviour
        if(!empty($ad)){$this->setProperty('ad',(($this->getProperty('ad')==true || $this->getProperty('ad')==1 || $this->getProperty('ad')=='on' || $this->getProperty('ad')=='true')?1:0));}
        $repeatenddate = $this->getProperty('repeatenddate');
        $repeatenddate = (!empty($repeatenddate))?strtotime($this->getProperty('repeatenddate').' '.$endhis):null;
        //$this->setProperty('repeatenddate',$repeatenddate);
        //-- Check if we have all the data to create the repeating field information
        $repeating = $this->getProperty('repeating');
        $repeating = ($repeating=='true' || $repeating == 1)?1:0;

        $repeattype = $this->getProperty('repeattype');

        $repeatfrequency = $this->getProperty('repeatfrequency');

        $repeaton =$this->getProperty('repeaton');
        $repeaton = ($repeattype==1)?$repeaton:'';
        if($repeating==1 && $repeattype !== null && $repeatfrequency !== null && $repeatenddate !== null && $start !== null){
            $repeatDates = _getRepeatDates(
                $repeattype
                , $repeatfrequency
                ,365
                , strtotime($start)
                , $repeatenddate
                , explode(',', $this->getProperty('repeaton'))
            );
            //$this->setProperty('locationaddr',$repeatenddate.' '.$start);
            if(!empty($repeatDates)){
                $this->setProperty('repeaton',$repeaton);
                $this->setProperty('repeating',$repeating);
                $this->setProperty('repeatdates',$repeatDates);
                $this->setProperty('repeatenddate', end(explode(',', $repeatDates)));

            } else {
                $this->setProperty('repeating',0);
                $this->setProperty('repeaton',null);
                $this->setProperty('repeattype',null);
                $this->setProperty('repeatdates',null);
                $this->setProperty('repeatfrequency',null);
                $this->setProperty('repeatenddate',null);
            }
        } else {
            $this->setProperty('repeating',0);
            $this->setProperty('repeaton',null);
            $this->setProperty('repeattype',null);
            $this->setProperty('repeatdates',null);
            $this->setProperty('repeatfrequency',null);
            $this->setProperty('repeatenddate',null);
        }

        return parent::beforeSet();
    }
    public function afterSave(){
        $thisid = $this->object->get('id');

        $catArr=explode(',',$this->object->get('cat'));
        foreach($catArr as $cat){
            $cats['evid']=$thisid;
            $cats['catsid'] = $cat;
            $catsConnect = $this->modx->newObject('GcCalendarCatsConnect');
            $catsConnect->fromArray($cats);
            $catsConnect->save();
        }

        $cidArr=explode(',',$this->object->get('cid'));
        foreach($cidArr as $cal){
            $cals['evid']=$thisid;
            $cals['calid'] = $cal;
            $calsConnect = $this->modx->newObject('GcCalendarCalsConnect');
            $calsConnect->fromArray($cals);
            $calsConnect->save();
        }

        $start = $this->object->get('start');
        $end = $this->object->get('end');
        $prArr = array('start'=> $start, 'end'=> $end, 'evid'=>$thisid, 'pr'=>1);
        $prConnect = $this->modx->newObject('GcCalendarDates');
        $prConnect->fromArray($prArr);
        $prConnect->save();


        $repeatDates =  $this->object->get('repeatDates');
        $repeatDatesArr = explode(',',$repeatDates);
        $timediff = ($end - $start);
        if(!empty($repeatDatesArr)){
            foreach($repeatDatesArr as $rd){
                if($rd != 0){
                $rend = ($rd + $timediff);
                $rArr = array('start'=>$rd,'end'=>$rend, 'rep'=>1,'evid'=> $thisid);
                $rdConnect = $this->modx->newObject('GcCalendarDates');
                $rdConnect->fromArray($rArr);
                $rdConnect->save();
                }
            }
        }
        return parent::afterSave();
    }
}
return 'gcCalendarCreateProcessor';