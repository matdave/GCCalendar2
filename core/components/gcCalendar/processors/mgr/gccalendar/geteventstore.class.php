<?php
class gcCalendarGetEventsProcessor extends modObjectGetListProcessor {
    public $classKey = 'GcCalendarEvents';
    public $languageTopics = array('gcCalendar:default');
    public $defaultSortField = 'start';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'gcCalendar.gcCalendar';
    public $limit = 9999;

}
return 'gcCalendarGetEventsProcessor';
