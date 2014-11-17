<?php
if(isset($scriptProperties)){
$cats['catsid'] = $scriptProperties['catsid'];
$cats['evid'] = preg_replace("/[^a-zA-Z0-9\s]/","",$scriptProperties['evid']);


$check = $modx->newQuery('GcCalendarCatsConnect');
$check->where(array(
                    'catsid:=' => $cats['catsid'],
                    'AND:evid:=' => $cats['evid'],
                ));
$chk_it = $modx->getObject('GcCalendarCatsConnect', $check);

if(empty($chk_it)){
  return $modx->error->failure('Nothing to Remove');
}else{
    if($chk_it->remove() == false){
        return $modx->error->failure('Error Removing');
    }else{return $modx->error->success('',$chk_it);}
}

}else{
    return $modx->error->failure('No Properties Found');
}