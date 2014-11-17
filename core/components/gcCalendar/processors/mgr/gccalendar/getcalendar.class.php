<?php
class gcCalendarGetCalendarProcessor extends modObjectGetListProcessor {
    public $classKey = 'GcCalendarCals';
    public $languageTopics = array('gcCalendar:default');
    public $defaultSortField = 'title';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'gcCalendar.gcCalendar';

}
return 'gcCalendarGetCalendarProcessor';
