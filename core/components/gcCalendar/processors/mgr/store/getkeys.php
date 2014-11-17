<?php
/**
 * Created by JetBrains PhpStorm.
 * User: matdave
 * Date: 9/5/13
 * Time: 11:36 AM
 */

//$modx->initialize('mgr');

    $list = array();
    $userWUG_arr = $modx->user->getUserGroupNames();
    $userid = $modx->user->get('id');
    $ug = $modx->newQuery('modUserGroup');
    $ug->where(array(
        'name:IN' => $userWUG_arr,
    ));
    $gc_groups = $modx->getIterator('modUserGroup', $ug);
    if(count($gc_groups)){
        foreach($gc_groups AS $mxg){

                $webContextAccess = $modx->newQuery('modAccessContext');
                $webContextAccess->where(array(
                    'principal' => $mxg->get('id'),
                    'AND:target:!=' => 'mgr',
                ));
                $gc_cntx = $modx->getIterator('modAccessContext', $webContextAccess);

                if(count($gc_cntx)){
                    foreach($gc_cntx AS $acl){
                        if(!in_array($acl->get('target'), $list))
                            $list[] = array('key'=>$acl->get('target'));
                    }
                }

        }
    }
    if($modx->user->isMember('Administrator')) { $list[] = array('key'=>''); }


    if(!count($list)){
        $contextKeys = array();
        $query = $modx->newQuery('modContext', array('key:NOT IN' => array('web', 'mgr')));
        $query->select($modx->getSelectColumns('modContext', 'modContext', '', array('key')));
        if ($query->prepare() && $query->stmt->execute()) {
            $contextKeys = $query->stmt->fetchAll(PDO::FETCH_COLUMN);
        }
        foreach ($contextKeys as $ctx) {
            $list[] = array('key'=>$ctx);
        }
    }
return $this->outputArray($list,sizeof($list));
