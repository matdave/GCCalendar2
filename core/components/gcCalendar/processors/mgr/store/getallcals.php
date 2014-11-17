<?php
/**
 * Created by JetBrains PhpStorm.
 * User: video2
 * Date: 9/5/13
 * Time: 2:30 PM
 * To change this template use File | Settings | File Templates.
 *//*


*/


/* build query */
$c = $modx->newQuery('GcCalendarCals');

$c->select(array(
    'id',
    'title'
));

$c->sortby('title','ASC');
$categories = $modx->getCollection('GcCalendarCals', $c);

/* iterate */
$clist = array();
foreach ($categories as $gccc) {
    $clist[] = $gccc->toArray();
}
return $this->outputArray($clist,sizeof($clist));