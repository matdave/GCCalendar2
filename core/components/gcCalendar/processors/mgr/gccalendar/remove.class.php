<?php
class gcCalendarRemoveProcessor extends modObjectRemoveProcessor {
    public $classKey = 'GcCalendarEvents';
    public $languageTopics = array('gcCalendar:default');
    public $objectType = 'gcCalendar.gcCalendar';
    public function beforeRemove() {
        $thisid = $this->object->get('id');
        $rcals = array(
                    'evid:=' => $thisid,
                );
                $this->modx->removeCollection('GcCalendarCalsConnect', $rcals);
                $this->modx->removeCollection('GcCalendarCatsConnect', $rcals);
                $this->modx->removeCollection('GcCalendarDates', $rcals);
        return !$this->hasErrors();
    }
}
return 'gcCalendarRemoveProcessor';