<?php
$xpdo_meta_map['GcCalendarCalsConnect']= array (
  'package' => 'gcCalendar',
  'version' => '1.1',
  'table' => 'gc_calendar_cals_connect',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'evid' => 0,
    'calid' => 0,
  ),
  'fieldMeta' => 
  array (
    'evid' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
      'default' => 0,
    ),
    'calid' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
      'default' => 0,
    ),
  ),
  'indexes' => 
  array (
    'PRIMARY' => 
    array (
      'alias' => 'PRIMARY',
      'primary' => true,
      'unique' => true,
      'columns' => 
      array (
        'id' => 
        array (
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
  ),
);
