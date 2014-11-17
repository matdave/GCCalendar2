<?php

include('RepeatDateHelper.php');

class gcCalendarUpdateProcessor extends modObjectUpdateProcessor {
    public $classKey = 'GcCalendarEvents';
    public $languageTopics = array('gcCalendar:default');
    public $objectType = 'gcCalendar.gcCalendar';


    public function beforeSet(){
        $thisid = $this->getProperty('id');
        $catArr=(is_array($this->getProperty('cat')))?$this->getProperty('cat'):explode(',',$this->getProperty('cat'));
        $rcats = array(
            'catsid:NOT IN' => $catArr,
            'AND:evid:=' => $thisid,
        );
        $this->modx->removeCollection('GcCalendarCatsConnect', $rcats);

        foreach($catArr as $cat){
            $cats['evid']=$thisid;
            $cats['catsid'] = $cat;
            $check = $this->modx->newQuery('GcCalendarCatsConnect');
            $check->where(array(
                'catsid:=' => $cats['catsid'],
                'AND:evid:=' => $cats['evid'],
            ));
            $chk_it = $this->modx->getCollection('GcCalendarCatsConnect', $check);

            if(empty($chk_it)){
                $catsConnect = $this->modx->newObject('GcCalendarCatsConnect');
                $catsConnect->fromArray($cats);
                $catsConnect->save();
            }

        }
        $cidArr=(is_array($this->getProperty('cid')))?$this->getProperty('cid'):explode(',',$this->getProperty('cid'));
        $cancidArr = $this->getCals();
        $rcals = array(
            'calid:NOT IN' => $cidArr,
            'calid:IN' => $cancidArr,
            'AND:evid:=' => $thisid,
        );
        $this->modx->removeCollection('GcCalendarCalsConnect', $rcals);

        foreach($cidArr as $cal){
            $cals['evid']=$thisid;
            $cals['calid'] = $cal;
            $check = $this->modx->newQuery('GcCalendarCalsConnect');
            $check->where(array(
                'calid:=' => $cals['calid'],
                'AND:evid:=' => $cals['evid'],
            ));
            $chk_it = $this->modx->getCollection('GcCalendarCalsConnect', $check);

            if(empty($chk_it)){
                $calsConnect = $this->modx->newObject('GcCalendarCalsConnect');
                $calsConnect->fromArray($cals);
                $calsConnect->save();
            }

        }
        $og = $this->modx->getObject('GcCalendarEvents',$thisid);
        $ogstart = $og->get('start');
        $ogstarthis = date('g:i A',$ogstart);
        $ogstartymd = date('Y-m-d',$ogstart);
        $ogend= $og->get('end');
        $ogad= $og->get('ad');
        $ogendhis = date('g:i A',$ogend);
        $ogendymd = date('Y-m-d',$ogend);
        $ogad=($ogad==1)?'true':'false';
        $startymd = $this->getProperty('startymd');
        $startymd = (empty($startymd))? $ogstartymd:$startymd;
        $starthis = $this->getProperty('starthis');
        $starthis = (empty($starthis))? $ogstarthis:$starthis;
        $endymd = $this->getProperty('endymd');
        $endymd = (empty($endymd))? $ogendhis:$endymd;

        $endhis = $this->getProperty('endhis');
        $endhis = (empty($endhis))? $ogendymd:$endhis;

        $ad = $this->getProperty('ad');
        $ad = (empty($ad))?$ogad:$ad;
        if(!empty($startymd) && !empty($starthis) && !empty($ad)){
        if (strpos($startymd, 'T') !== false) { 
            $start = substr($startymd,0,strpos($startymd, 'T'));
        }else{
            $start = $startymd;
        }
        $start .= ' ';
        $start .= ($ad=='true'||$ad=='1')?'12:00 AM':$starthis;
        $this->setProperty('start',strtotime($start));
        }
        if(!empty($endymd) && !empty($endhis) && !empty($ad)){
        if (strpos($endymd, 'T') !== false) {
            $end = substr($endymd,0,strpos($endymd, 'T'));
        }else{
            $end = $endymd;
        }
        $end .= ' ';
        $end .= ($ad=='true'||$ad=='1')?'12:00 AM':$endhis;
        $this->setProperty('end',strtotime($end));

        }
        if(!empty($cidArr)){$this->setProperty('cid',(implode(',',$cidArr)));}
        if(!empty($catArr)){$this->setProperty('cat',(implode(',',$catArr)));}
        if(!empty($ad)){$this->setProperty('ad',(($this->getProperty('ad')==true)?1:0));}
        
        $timediff = (strtotime($end) - strtotime($start));
        //*repeating Events*//
        $ogrepeatenddate = $og->get('repeatenddate');
        $ogrepeaton= $og->get('repeaton');
        $ogrepeatonmo= $og->get('repeatonmo');
        $ogrepeatonmo= explode(',',$ogrepeatonmo);
        $ogrepeatonmoArr = array();
        $ogrepeatonmoArr['type'] = (!empty($ogrepeatonmo))?$ogrepeatonmo[0]:null;
        $ogrepeatonmoArr['week'] = (count($ogrepeatonmo) > 1)?$ogrepeatonmo[1]:null;
        $ogrepeating= $og->get('repeating');
        $ogrepeattype = $og->get('repeattype');
        $ogrepeatfrequency = $og->get('repeatfrequency');

        $repeatenddate = $this->getProperty('repeatenddate');
        $repeatenddate = (empty($repeatenddate))?date('Y-m-d',$ogrepeatenddate):$repeatenddate;
        $repeatenddate = (!empty($repeatenddate))?strtotime($this->getProperty('repeatenddate').' '.$endhis):null;
        //$this->setProperty('repeatenddate',$repeatenddate);
        //-- Check if we have all the data to create the repeating field information
        $repeating = $this->getProperty('repeating');
        $repeating = (empty($repeating))?$ogrepeating:$repeating;
        $repeating = ($repeating=='true' || $repeating == 1)?1:0;

        $repeattype = $this->getProperty('repeattype');
        $repeattype = (empty($repeattype))?$ogrepeattype:$repeattype;

        $repeatfrequency = $this->getProperty('repeatfrequency');
        $repeatfrequency = (empty($repeatfrequency))?$ogrepeatfrequency:$repeatfrequency;
        $prtQ =  $this->modx->newQuery('GcCalendarDates');
        $prtQ->where(array('evid:=' => $thisid, 'AND:pr:='=> 1));
        $prtime = $this->modx->getObject('GcCalendarDates',$prtQ);
        $prArr = array('start'=>strtotime($start), 'end'=>strtotime($end), 'evid'=>$thisid, 'pr'=>1);
        if(empty($prtime)){
            $prConnect = $this->modx->newObject('GcCalendarDates');
            $prConnect->fromArray($prArr);
            $prConnect->save();
        }else{
            $prtime->fromArray($prArr);
            $prtime->save();
        }
        $repeaton =$this->getProperty('repeaton');
        $repeaton = (empty($repeaton))?$ogrepeaton:$repeaton;
        $repeaton = ($repeattype==1)?$repeaton:'';

        $repeatonmo =$this->getProperty('repeatonmo');
        $repeatonmo = (empty($repeatonmo))?$ogrepeatonmoArr:$repeatonmo;
        $repeatonmo = (empty($repeatonmo))?array("type"=>"dom"):$repeatonmo;
        $repeatonmo = ($repeattype==2)?$repeatonmo:'';

        $oldrep = array(
            'ov:!=' => 1,
            'AND:pr:!=' => 1,
            'AND:evid:=' => $thisid,
        );
        $this->modx->removeCollection('GcCalendarDates', $oldrep);
        if($repeating==1 && $repeattype !== null && $repeatfrequency !== null && $repeatenddate !== null && $start !== null){
            $repeatDates = _getRepeatDates(
                   $repeattype
                 , $repeatfrequency
                 ,365
                 , strtotime($start)
                 , $repeatenddate
                 , explode(',', $this->getProperty('repeaton'))
                 ,'UNIX'
                 , json_encode($repeatonmo)
                 );
            //$this->setProperty('locationaddr',$repeatenddate.' '.$start);
            if(!empty($repeatDates)){
                $repeatonmovals = array();
                if(!empty($repeatonmo)){
                    foreach($repeatonmo as $k=>$repmo){
                        $repeatonmovals[] = $repmo;
                    }
                }
                $this->setProperty('repeaton',$repeaton);
                $this->setProperty('repeatonmo',implode(',',$repeatonmovals));
                $this->setProperty('repeating',$repeating);
                $this->setProperty('repeatdates',null);
                $repeatDatesArr = explode(',',$repeatDates);
                foreach($repeatDatesArr as $rd){
                    $rend = ($rd + $timediff);
                    if($rd != $start && $rend != $end){
                    $rArr = array('start'=>$rd,'end'=>$rend, 'rep'=>1,'evid'=> $thisid);
                    $rdConnect = $this->modx->newObject('GcCalendarDates');
                    $rdConnect->fromArray($rArr);
                    $rdConnect->save();
                    }
                }


            } else {
                $this->setProperty('repeating',0);
                $this->setProperty('repeaton',null);
                $this->setProperty('repeattype',null);
                $this->setProperty('repeatdates',null);
                $this->setProperty('repeatfrequency',null);
            }
        } else {
            $this->setProperty('repeating',0);
            $this->setProperty('repeaton',null);
            $this->setProperty('repeattype',null);
            $this->setProperty('repeatdates',null);
            $this->setProperty('repeatfrequency',null);
        }
        $this->setProperty('repeatenddate',null);
        $fedate = $this->modx->newQuery('GcCalendarDates');
        $fedate->where(array('evid'=>$thisid));
        $fedate->limit(1);
        $fedate->sortby('end','DESC');
        $feItt = $this->modx->getIterator('GcCalendarDates',$fedate);
        if(!empty($feItt)){
            foreach($feItt as $fI){
                $this->setProperty('repeatenddate',$fI->get('end'));
            }
        }
        return parent::beforeSet();
    }
    public function getCals(){

        $list = array();
        $userWUG_arr = $this->modx->user->getUserGroupNames();
        $userid = $this->modx->user->get('id');
        $ug = $this->modx->newQuery('modUserGroup');
        $ug->where(array(
            'name:IN' => $userWUG_arr,
            'AND:name:NOT LIKE' => 'Cloud%',
        ));
        $gc_groups = $this->modx->getIterator('modUserGroup', $ug);
        if(count($gc_groups)){
            foreach($gc_groups AS $mxg){
                $webContextAccess = $this->modx->newQuery('modAccessContext');
                $webContextAccess->where(array(
                    'principal' => $mxg->get('id'),
                    'AND:target:!=' => 'mgr',
                ));
                $gc_cntx = $this->modx->getIterator('modAccessContext', $webContextAccess);
                if(count($gc_cntx)){
                    foreach($gc_cntx AS $acl){
                        if(!in_array($acl->get('target'), $list))
                            $list[] =$acl->get('target');
                    }
                }
            }
        }
        if($this->modx->user->isMember('Administrator')) { $list[] = array('key'=>''); }

        /* build query */
        $c = $this->modx->newQuery('GcCalendarCals');

        $c->select(array(
            'id'
        ));
        if($this->modx->user->isMember('Administrator')) {}else{$c->where(array('key:IN'=>$list));}

        $categories = $this->modx->getCollection('GcCalendarCals', $c);

        /* iterate */
        $clist = array();
        foreach ($categories as $gccc) {
            $clist[] = $gccc->get('id');
        }
        return $clist;
    }
}
return 'gcCalendarUpdateProcessor';