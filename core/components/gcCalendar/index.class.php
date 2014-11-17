<?php
require_once dirname(__FILE__) . '/model/gcCalendar/gccalendar.class.php';
abstract class gcCalendarManagerController extends modExtraManagerController {
    /** @var gcCalendar $gcCalendar */
    public $gcCalendar;
    public function initialize() {
        $this->gcCalendar = new gcCalendar($this->modx);
        $this->addCss($this->gcCalendar->config['cssUrl'].'mgr.css');
        $this->addJavascript($this->gcCalendar->config['jsUrl'].'mgr/gcCalendar.js');
        $this->addHtml('<script type="text/javascript">
        Ext.onReady(function() {
            gcCalendar.config = '.$this->modx->toJSON($this->gcCalendar->config).';
        });
        </script>');
        return parent::initialize();
    }
    public function getLanguageTopics() {
        return array('gcCalendar:default');
    }
    public function checkPermissions() { return true;}
}
class IndexManagerController extends gcCalendarManagerController {
    public static function getDefaultController() { return 'home'; }
}