<?php
class gcCalendar {
    public $modx;
    public $config = array();
    function __construct(modX &$modx,array $config = array()) {
        $this->modx =& $modx;

        $basePath = $this->modx->getOption('gcCalendar.core_path',$config,$this->modx->getOption('core_path').'components/gcCalendar/');
        $assetsUrl = $this->modx->getOption('gcCalendar.assets_url',$config,$this->modx->getOption('assets_url').'components/gcCalendar/');
        $managerURL = $this->modx->getOption('manager_url');
        $this->config = array_merge(array(
            'basePath' => $basePath,
            'corePath' => $basePath,
            'managerPath' => $managerURL,
            'modelPath' => $basePath.'model/',
            'processorsPath' => $basePath.'processors/',
            'templatesPath' => $basePath.'templates/',
            'chunksPath' => $basePath.'elements/chunks/',
            'jsUrl' => $assetsUrl.'js/',
            'cssUrl' => $assetsUrl.'css/',
            'assetsUrl' => $assetsUrl,
            'connectorUrl' => $assetsUrl.'connector.php',
        ),$config);
        $this->modx->addPackage('gcCalendar',$this->config['modelPath']);

        $this->modx->addPackage('gcCalendar',$this->config['modelPath']);

    }
}
