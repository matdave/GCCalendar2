<?php
/* Get the core config */
if (!file_exists(dirname(dirname(__FILE__)).'/config.core.php')) {
    die('ERROR: missing '.dirname(dirname(__FILE__)).'/config.core.php file defining the MODX core path.');
}

echo "<pre>";
/* Boot up MODX */
echo "Loading modX...\n";
require_once dirname(dirname(__FILE__)).'/config.core.php';
require_once MODX_CORE_PATH.'model/modx/modx.class.php';
$modx = new modX();
echo "Initializing manager...\n";
$modx->initialize('mgr');
$modx->getService('error','error.modError', '', '');

$componentPath = dirname(dirname(__FILE__));

$gcCalendar = $modx->getService('gcCalendar','gcCalendar', $componentPath.'/core/components/gcCalendar/model/gcCalendar/', array(
    'gcCalendar.core_path' => $componentPath.'/core/components/gcCalendar/',
));


/* Namespace */
if (!createObject('modNamespace',array(
    'name' => 'gcCalendar',
    'path' => $componentPath.'/core/components/gcCalendar/',
    'assets_path' => $componentPath.'/assets/components/gcCalendar/',
),'name', false)) {
    echo "Error creating namespace gcCalendar.\n";
}

/* Path settings */
if (!createObject('modSystemSetting', array(
    'key' => 'gcCalendar.core_path',
    'value' => $componentPath.'/core/components/gcCalendar/',
    'xtype' => 'textfield',
    'namespace' => 'gcCalendar',
    'area' => 'Paths',
    'editedon' => time(),
), 'key', false)) {
    echo "Error creating gcCalendar.core_path setting.\n";
}

if (!createObject('modSystemSetting', array(
    'key' => 'gcCalendar.assets_path',
    'value' => $componentPath.'/assets/components/gcCalendar/',
    'xtype' => 'textfield',
    'namespace' => 'gcCalendar',
    'area' => 'Paths',
    'editedon' => time(),
), 'key', false)) {
    echo "Error creating gcCalendar.assets_path setting.\n";
}

/* Fetch assets url */
$url = 'http';
if (isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] == 'on')) {
    $url .= 's';
}
$url .= '://'.$_SERVER["SERVER_NAME"];
if ($_SERVER['SERVER_PORT'] != '80') {
    $url .= ':'.$_SERVER['SERVER_PORT'];
}
$requestUri = $_SERVER['REQUEST_URI'];
$bootstrapPos = strpos($requestUri, '_bootstrap/');
$requestUri = rtrim(substr($requestUri, 0, $bootstrapPos), '/').'/';
$assetsUrl = "{$url}{$requestUri}assets/components/gcCalendar/";

if (!createObject('modSystemSetting', array(
    'key' => 'gcCalendar.assets_url',
    'value' => $assetsUrl,
    'xtype' => 'textfield',
    'namespace' => 'gcCalendar',
    'area' => 'Paths',
    'editedon' => time(),
), 'key', false)) {
    echo "Error creating gcCalendar.assets_url setting.\n";
}

// Snippets
if (!createObject('modSnippet', array(
    'name' => 'gcCal',
    'static' => true,
    'static_file' => $componentPath.'/assets/components/gcCalendar/snippets/gcCal.php',
), 'name', false)) {
    echo "Error creating gcCal snippet.\n";
}
if (!createObject('modSnippet', array(
    'name' => 'gcCaliCal',
    'static' => true,
    'static_file' => $componentPath.'/assets/components/gcCalendar/snippets/gcCaliCal.php',
), 'name', false)) {
    echo "Error creating gcCaliCal snippet.\n";
}
if (!createObject('modSnippet', array(
    'name' => 'gcCalList',
    'static' => true,
    'static_file' => $componentPath.'/assets/components/gcCalendar/snippets/gcCalList.php',
), 'name', false)) {
    echo "Error creating gcCalList snippet.\n";
}
if (!createObject('modSnippet', array(
    'name' => 'gcCalSelect',
    'static' => true,
    'static_file' => $componentPath.'/assets/components/gcCalendar/snippets/gcCalSelect.php',
), 'name', false)) {
    echo "Error creating gcCalSelect snippet.\n";
}
if (!createObject('modChunk', array(
    'name' => 'gcCalday',
    'snippet' => file_get_contents($componentPath.'/core/components/gcCalendar/elements/chunks/gcCalday.chunk.tpl'),
), 'name', false)) {
    echo "Error creating gcCalday chunk.\n";
}
if (!createObject('modChunk', array(
    'name' => 'gcCaldetail',
    'snippet' => file_get_contents($componentPath.'/core/components/gcCalendar/elements/chunks/gcCaldetail.chunk.tpl'),
), 'name', false)) {
    echo "Error creating gcCaldetail chunk.\n";
}
if (!createObject('modChunk', array(
    'name' => 'gcCalheading',
    'snippet' => file_get_contents($componentPath.'/core/components/gcCalendar/elements/chunks/gcCalheading.chunk.tpl'),
), 'name', false)) {
    echo "Error creating gcCalheading chunk.\n";
}
if (!createObject('modChunk', array(
    'name' => 'gcCalItem',
    'snippet' => file_get_contents($componentPath.'/core/components/gcCalendar/elements/chunks/gcCalItem.chunk.tpl'),
), 'name', false)) {
    echo "Error creating gcCalItem chunk.\n";
}
if (!createObject('modChunk', array(
    'name' => 'gcCalList',
    'snippet' => file_get_contents($componentPath.'/core/components/gcCalendar/elements/chunks/gcCalList.chunk.tpl'),
), 'name', false)) {
    echo "Error creating gcCalList chunk.\n";
}
if (!createObject('modChunk', array(
    'name' => 'gcCalmonth',
    'snippet' => file_get_contents($componentPath.'/core/components/gcCalendar/elements/chunks/gcCalmonth.chunk.tpl'),
), 'name', false)) {
    echo "Error creating gcCalmonth chunk.\n";
}
if (!createObject('modChunk', array(
    'name' => 'gcCalweek',
    'snippet' => file_get_contents($componentPath.'/core/components/gcCalendar/elements/chunks/gcCalweek.chunk.tpl'),
), 'name', false)) {
    echo "Error creating gcCalweek chunk.\n";
}

// Menu
if (!createObject('modAction', array(
    'namespace' => 'gcCalendar',
    'parent' => '0',
    'controller' => 'index',
    'haslayout' => '1',
    'lang_topics' => 'gcCalendar:default',
), 'namespace', false)) {
    echo "Error creating action.\n";
}
$action = $modx->getObject('modAction', array(
    'namespace' => 'gcCalendar'
));

if ($action) {
    if (!createObject('modMenu', array(
        'text' => 'gcCalendar.s',
        'parent' => 'components',
        'description' => 'gcCalendar.desc',
        'icon' => '',
        'menuindex' => '0',
        'action' => $action->get('id')
    ), 'text', false)) {
        echo "Error creating menu.\n";
    }
}

/*
$settings = include dirname(dirname(__FILE__)).'/_build/data/settings.php';
foreach ($settings as $key => $opts) {
    if (!createObject('modSystemSetting', array(
        'key' => 'gcCalendar.' . $key,
        'value' => $opts['value'],
        'xtype' => (isset($opts['xtype'])) ? $opts['xtype'] : 'textfield',
        'namespace' => 'gcCalendar',
        'area' => $opts['area'],
        'editedon' => time(),
    ), 'key', false)) {
        echo "Error creating gcCalendar.".$key." setting.\n";
    }
}




/* Create the tables */
$manager = $modx->getManager();
$objectContainers = array(
    'GcCalendarCals',
    'GcCalendarCats',
    'GcCalendarDates',
    'GcCalendarEvents',
    'GcCalendarCatsConnect',
    'GcCalendarCalsConnect',
);
echo "Creating tables...\n";

foreach ($objectContainers as $oC) {
    $manager->createObjectContainer($oC);
}

$modx->cacheManager->refresh();

echo "Done.";


/**
 * Creates an object.
 *
 * @param string $className
 * @param array $data
 * @param string $primaryField
 * @param bool $update
 * @return bool
 */
function createObject ($className = '', array $data = array(), $primaryField = '', $update = true) {
    global $modx;
    /* @var xPDOObject $object */
    $object = null;

    /* Attempt to get the existing object */
    if (!empty($primaryField)) {
        if (is_array($primaryField)) {
            $condition = array();
            foreach ($primaryField as $key) {
                $condition[$key] = $data[$key];
            }
        }
        else {
            $condition = array($primaryField => $data[$primaryField]);
        }
        $object = $modx->getObject($className, $condition);
        if ($object instanceof $className) {
            if ($update) {
                $object->fromArray($data);
                return $object->save();
            } else {
                $condition = $modx->toJSON($condition);
                echo "Skipping {$className} {$condition}: already exists.\n";
                return true;
            }
        }
    }

    /* Create new object if it doesn't exist */
    if (!$object) {
        $object = $modx->newObject($className);
        $object->fromArray($data, '', true);
        return $object->save();
    }

    return false;
}
