<?php
if(isset($scriptProperties)){
$cats['catsid'] = $scriptProperties['catsid'];
$cats['evid'] = preg_replace("/[^a-zA-Z0-9\s]/","",$scriptProperties['evid']);


$check = $modx->newQuery('GcCalendarCatsConnect');
$check->where(array(
                    'catsid:=' => $cats['catsid'],
                    'AND:evid:=' => $cats['evid'],
                ));
$chk_it = $modx->getCollection('GcCalendarCatsConnect', $check);

if(empty($chk_it)){
    $catsConnect = $modx->newObject('GcCalendarCatsConnect');
    $catsConnect->fromArray($cats);
    if ($catsConnect->save() == false) {
        return $modx->error->failure('Error Saving');
    }
    return $modx->error->success('',$catsConnect);
}else{return $modx->error->failure('Connection Exists');}

}else{
    return $modx->error->failure('No Properties Found');
}