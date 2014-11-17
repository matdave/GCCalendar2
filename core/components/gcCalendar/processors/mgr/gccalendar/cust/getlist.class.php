<?php
class GcCalendarDatesGetListProcessor extends modObjectGetListProcessor {
    public $classKey = 'GcCalendarDates';
    public $languageTopics = array('gcCalendar:default');
    public $defaultSortField = 'start';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'gcCalendar.gcCalendar';

    public function prepareQueryBeforeCount(xPDOQuery $c) {
        $query = $this->getProperty('evid');
                //$qu = array();
        $stime = strtotime('-1 week');
                if (!empty($query)) {
                    $qu = array(
                        'evid' => $query,
                        'AND:ov:!='=> 0
                    );
                }

        $c->where($qu);
        return $c;
    }
    public function prepareRow(xPDOObject $object) {
        $object->set('startymd',((date('Y-m-d',$object->get('start')))));
        $object->set('starthis',((date('g:i A',$object->get('start')))));
        $object->set('endymd',((date('Y-m-d',$object->get('end')))));
        $object->set('endhis',((date('g:i A',$object->get('end')))));
        $object->set('startRAW',$object->get('start'));
        $object->set('start',(date('Y-m-d g:i A',$object->get('start'))));
        $object->set('end',(date('Y-m-d g:i A',$object->get('end'))));
        $object->set('ad',(($object->get('ad')==1)?true:false));
         return $object->toArray();
    }

}
return 'GcCalendarDatesGetListProcessor';
