<?php
class gcCalendarHomeManagerController extends gcCalendarManagerController {
    public function process(array $scriptProperties = array()) {
    }
    public function getPageTitle() { return $this->modx->lexicon('gcCalendar'); }
    public function loadCustomCssJs() {
        $this->addJavascript($this->gcCalendar->config['managerPath'].'assets/modext/util/datetime.js');
        $this->addJavascript($this->gcCalendar->config['jsUrl'].'ensible/Extensible-config.js');
        /* If we want to use Tiny, we'll need some extra files. */
        
            $tinyCorePath = $this->modx->getOption('tiny.core_path',null,$this->modx->getOption('core_path').'components/tinymce/');
            if (file_exists($tinyCorePath.'tinymce.class.php')) {

                /* First fetch the gallery+tiny specific settings */
                $cb1 =  'undo,redo,selectall,separator,pastetext,separator,nonbreaking,separator,modxlink,unlink,separator,code,separator,cleanup,removeformat';
                $cb2 =  'bold,italic,underline,strikethrough,sub,sup,separator,bullist,numlist,outdent,indent,formatselect';
                $cb3 =  '';
                $cb4 =  '';
                $cb5 =  '';
                $plugins =  '';
                $theme =  '';
                $bfs =  '';
                $css =  '';

                /* If the settings are empty, override them with the generic tinymce settings. */
                $tinyProperties = array(
                    'height' => 200,
                    'width' => 362,
                    'tiny.custom_buttons1' => (!empty($cb1)) ? $cb1 : $this->modx->getOption('tiny.custom_buttons1'),
                    'tiny.custom_buttons2' => (!empty($cb2)) ? $cb2 : $this->modx->getOption('tiny.custom_buttons2'),
                    'tiny.custom_buttons3' => $cb3,
                    'tiny.custom_buttons4' => (!empty($cb4)) ? $cb4 : $this->modx->getOption('tiny.custom_buttons4'),
                    'tiny.custom_buttons5' => (!empty($cb5)) ? $cb5 : $this->modx->getOption('tiny.custom_buttons5'),
                    'tiny.custom_plugins' => (!empty($plugins)) ? $plugins : $this->modx->getOption('tiny.custom_plugins'),
                    'tiny.editor_theme' => (!empty($theme)) ? $theme : $this->modx->getOption('tiny.editor_theme'),
                    'tiny.theme_advanced_blockformats' => (!empty($bfs)) ? $bfs : $this->modx->getOption('tiny.theme_advanced_blockformats'),
                    'tiny.css_selectors' => (!empty($css)) ? $css : $this->modx->getOption('tiny.css_selectors'),
                );

                require_once $tinyCorePath.'tinymce.class.php';
                $tiny = new TinyMCE($this->modx,$tinyProperties);
                $tiny->setProperties($tinyProperties);
                $html = $tiny->initialize();
                $this->modx->regClientHTMLBlock($html);
            }
        $this->addJavascript($this->gcCalendar->config['jsUrl'].'mgr/widgets/CheckColumn.js');
        $this->addJavascript($this->gcCalendar->config['jsUrl'].'mgr/widgets/cust/window.dates.js');
        $this->addJavascript($this->gcCalendar->config['jsUrl'].'mgr/widgets/cust/grid.dates.js');
        $this->addJavascript($this->gcCalendar->config['jsUrl'].'mgr/widgets/gcCalendar.grid.js');
        $this->addJavascript($this->gcCalendar->config['jsUrl'].'mgr/widgets/gcCalendar.calendars.js');
        $this->addJavascript($this->gcCalendar->config['jsUrl'].'mgr/widgets/gcCalendar.categories.js');
        $this->addJavascript($this->gcCalendar->config['jsUrl'].'mgr/widgets/gcCalendar.ensible.js');
        $this->addJavascript($this->gcCalendar->config['jsUrl'].'mgr/widgets/home.panel.js');
        $this->addLastJavascript($this->gcCalendar->config['jsUrl'].'mgr/sections/index.js');
    }
    public function getTemplateFile() { return $this->gcCalendar->config['templatesPath'].'home.tpl'; }
}