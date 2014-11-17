<?php
/* @var GcCalendarDates $object
 * @var modX $modx
 * @var array $scriptProperties
 */

$id = (int)$modx->getOption('id',$scriptProperties,0);


if ($id < 1) return $modx->error->failure($modx->lexicon('gcCalendar.error.object_nf'));

$object = $modx->getObject('GcCalendarDates',$id);
if (!($object instanceof GcCalendarDates)) return $modx->error->failure($modx->lexicon('gcCalendar.error.object_nf'));

if ($object->remove())
    return $modx->error->success();
return $modx->error->failure($modx->lexicon('gcCalendar.error.remove'));
?>
