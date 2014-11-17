<?php
/**
 * Created by JetBrains PhpStorm.
 * User: video2
 * Date: 9/5/13
 * Time: 2:21 PM
 * To change this template use File | Settings | File Templates.
 */
$query = $modx->getOption('query',$scriptProperties,'');

/* build query */
$c = $modx->newQuery('GcCalendarCats');

$c->select(array(
	'id',
	'ctitle'
));
if(isset($query)){
    $ids = preg_replace("/[^a-zA-Z0-9\s]/","",$query);
    if(!is_numeric($ids)){
    $c->where(array('ctitle:LIKE' => '%'.preg_replace('/[^a-rtzA-Z0-9]/', '%',$query).'%'));
    }
}
$c->sortby('ctitle','ASC');
$categories = $modx->getCollection('GcCalendarCats', $c);

/* iterate */
$clist = array();
foreach ($categories as $gccc) {
    $clist[] = $gccc->toArray();
}
return $this->outputArray($clist,sizeof($clist));