<?php
/**
 * gcCalendar
 *
 * gcCalendar Connector
 *
 * @package gcCalendar
 */
require_once dirname(dirname(dirname(dirname(__FILE__)))) . '/config.core.php';
require_once MODX_CORE_PATH . 'config/' . MODX_CONFIG_KEY . '.inc.php';
require_once MODX_CONNECTORS_PATH . 'index.php';
//$modx = new modX();
//$modx->initialize('mgr');

$corePath = $modx->getOption('gcCalendar.core_path', null, $modx->getOption('core_path') . 'components/gcCalendar/');
require_once $corePath . 'model/gcCalendar/gccalendar.class.php';
$modx->gcCalendar = new gcCalendar($modx);

$modx->lexicon->load('gcCalendar:default');

/* handle request */
$path = $modx->getOption('processorsPath', $modx->gcCalendar->config, $corePath . 'processors/');
$modx->request->handleRequest(array(
    'processors_path' => $path,
    'location' => '',
));
