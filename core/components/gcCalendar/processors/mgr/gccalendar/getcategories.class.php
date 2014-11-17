<?php
class gcCalendarGetCategoryProcessor extends modObjectGetListProcessor {
    public $classKey = 'GcCalendarCats';
    public $languageTopics = array('gcCalendar:default');
    public $defaultSortField = 'ctitle';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'gcCalendar.gcCalendar';

}
return 'gcCalendarGetCategoryProcessor';
