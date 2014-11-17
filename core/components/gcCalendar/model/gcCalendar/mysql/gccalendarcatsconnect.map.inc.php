<?php
$xpdo_meta_map['GcCalendarCatsConnect']= array (
  'package' => 'gcCalendar',
  'version' => '1.1',
  'table' => 'gc_calendar_cats_connect',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'evid' => 0,
    'catsid' => 0,
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
    'catsid' => 
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
