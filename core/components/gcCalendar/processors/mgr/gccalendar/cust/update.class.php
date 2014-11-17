<?php
class directorydbUpdateProcessor extends modObjectUpdateProcessor {
    public $classKey = 'directoryDBbase';
    public $languageTopics = array('directorydb:default');
    public $objectType = 'directorydb.directorydb';
    public function beforeSet(){
        $thisid = $this->getProperty('id');
        $catArr=(is_array($this->getProperty('allcats')))?$this->getProperty('allcats'):explode(',',$this->getProperty('allcats'));
        if(!empty($catArr)){
                $rcats = array(
                'catid:NOT IN' => $catArr,
                'AND:baseid:=' => $thisid,
            );
            $this->modx->removeCollection('directoryDBcatsConnect', $rcats);

            foreach($catArr as $cat){
                $cats['baseid']= $thisid;
                $cats['catid'] = $cat;
                $check = $this->modx->newQuery('directoryDBcatsConnect');
                $check->where(array(
                    'catid:=' => $cats['catid'],
                    'AND:baseid:=' => $cats['baseid'],
                ));
                $chk_it = $this->modx->getCollection('directoryDBcatsConnect', $check);

                if(empty($chk_it) && !empty($cat) && $cat!=0){
                    $catsConnect = $this->modx->newObject('directoryDBcatsConnect');
                    $catsConnect->fromArray($cats);
                    $catsConnect->save();
                }

            }
        }
        $mbrArr=(is_array($this->getProperty('member')))?$this->getProperty('member'):explode(',',$this->getProperty('member'));
        if(!empty($mbrArr)){
                $rmbrs = array(
                'memid:NOT IN' => $mbrArr,
                'AND:baseid:=' => $thisid,
            );
            $this->modx->removeCollection('directoryDBmemberConnect', $rmbrs);

            foreach($mbrArr as $mbr){
                $mbrs['baseid']= $thisid;
                $mbrs['memid'] = $mbr;
                $check = $this->modx->newQuery('directoryDBmemberConnect');
                $check->where(array(
                    'memid:=' => $mbrs['memid'],
                    'AND:baseid:=' => $mbrs['baseid'],
                ));
                $chk_it = $this->modx->getCollection('directoryDBmemberConnect', $check);

                if(empty($chk_it) && !empty($mbr) && $mbr!=0){
                    $mbrsConnect = $this->modx->newObject('directoryDBmemberConnect');
                    $mbrsConnect->fromArray($mbrs);
                    $mbrsConnect->save();
                }

            }
        }
        $oldTime = $this->getProperty('olddate');
        if(is_array($oldTime) && !empty($oldTime)){
            $hourrm=array();

            foreach($oldTime as $ot){
                if(!empty($ot['ogid'])){
                $hid=implode(',',$ot['ogid']);

                $hourrm[]=$hid;
                $oldset = $this->modx->getObject('directoryDBhrsReg',$hid);
                if(!empty($ot['days'])){
                    if(is_array($ot['days'])){sort($ot['days']); $ot['days'] = implode(',',$ot['days']);}
                    $otdays = $ot['days'];
                    $oldset->set('daysData',$otdays);}
                if(!empty($ot['from'])){
                $otfrom = (is_array($ot['from']))? implode(',',$ot['from']):$ot['from'];
                    $oldset->set('hrsStart',$otfrom);}
                if(!empty($ot['to'])){
                $otto = (is_array($ot['to']))? implode(',',$ot['to']):$ot['to'];
                    $oldset->set('hrsEnd',$otto);}
                if($otdays != '' && $otdays != 'Select Days'){
                    $oldset->save();
                }
                }
            }
            $rmtime = array(
                            'id:NOT IN' => $hourrm,
                            'AND:baseid:=' => $thisid,
                        );
            $this->modx->removeCollection('directoryDBhrsReg', $rmtime);

        }

        $newTime = $this->getProperty('newdate');
        if(is_array($newTime) && !empty($newTime)){


            foreach($newTime as $nt){
                $hourset['daysData'] = '';
                $hourset = array();
                $hourset['baseid']=$thisid;
                if(!empty($nt['days'])){
                if(is_array($nt['days'])){sort($nt['days']); $nt['days'] = implode(',',$nt['days']);}
                  $hourset['daysData'] = $nt['days'];
                }
                $ntfrom = (is_array($nt['from']))? implode(',',$nt['from']):$nt['from'];
                $hourset['hrsStart'] = $ntfrom;
                $ntto = (is_array($nt['to']))? implode(',',$nt['to']):$nt['to'];
                $hourset['hrsEnd'] = $ntto;
                if($hourset['daysData'] != 'Select Days' && $hourset['daysData'] != ''){
                    $newset = $this->modx->newObject('directoryDBhrsReg');
                    $newset->fromArray($hourset);
                    $newset->save();
                }

            }

        }
        $a =($this->getProperty('address'));
        $po = (preg_match('/^\s*((P(OST)?.?\s*(O(FF(ICE)?)?)?.?\s+(B(IN|OX))?)|B(IN|OX))/i',$a))?true:false;
        $c =($this->getProperty('city'));
        $s =($this->getProperty('state'));
        $z =($this->getProperty('zip'));
        if(
            !empty($a) &&
            $po==false &&
            !empty($c) &&
            !empty($s) &&
            !empty($z)
        ){

                       $url = urlencode($a.', '.$c.', '.$s.' '.$z);

                       //$geocode=file_get_contents('http://maps.google.com/maps/api/geocode/json?address='.$url.'&sensor=false');
                       $geourl='http://maps.googleapis.com/maps/api/geocode/json?address='.$url.'&sensor=false&region=US';
                       $ch = curl_init();
                       curl_setopt($ch, CURLOPT_URL, $geourl);
                       curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                       curl_setopt($ch, CURLOPT_PROXYPORT, 3128);
                       curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
                       curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
                       $geocode = curl_exec($ch);
                       curl_close($ch);
                       if($geocode){
                        $output= json_decode($geocode, true);
                        $geostat = $output["status"];
                           if($geostat == 'OK'){
                               $this->setProperty('geoLng',($output["results"][0]["geometry"]["location"]["lng"]));
                               $this->setProperty('geoLat',($output["results"][0]["geometry"]["location"]["lat"]));
                           }else{
                              $this->modx->log(xPDO::LOG_LEVEL_ERROR,'[DirectoryDB] An error occurred while trying to Geocode: '.$geourl.' '.$geocode);
                              }
                       }else{
                           $this->modx->log(xPDO::LOG_LEVEL_ERROR,'[DirectoryDB] An error occurred while trying to Geocode: '.$geourl.' '.$geocode);

                       }
                   }

            $this->setProperty('editedby',($this->modx->user->get('id')));
            $this->setProperty('editedon',(date('Y-m-d H:i:s')));
            $this->setProperty('isbusiness',(($this->getProperty('isbusiness') == 'true') ? 1 : 0));
            $this->setProperty('isamenity',(($this->getProperty('isamenity') == 'true') ? 1 : 0));
            $this->setProperty('isattraction',(($this->getProperty('isattraction') == 'true') ? 1 : 0));
            return parent::beforeSet();
        }
}
return 'directorydbUpdateProcessor';