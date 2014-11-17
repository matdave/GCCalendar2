<?php
$xpdo_meta_map['GcCalendarDates']= array (
  'package' => 'gcCalendar',
  'version' => '1.1',
  'table' => 'gc_calendar_dates',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'evid' => 0,
    'start' => NULL,
    'end' => NULL,
    'pr' => NULL,
    'rep' => NULL,
    'ov' => NULL,
    'ad' => NULL,
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
    'start' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '20',
      'phptype' => 'string',
      'null' => true,
    ),
    'end' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '20',
      'phptype' => 'string',
      'null' => true,
    ),
    'pr' => 
    array (
      'dbtype' => 'boolean',
      'phptype' => 'boolean',
      'null' => false,
    ),
    'rep' => 
    array (
      'dbtype' => 'boolean',
      'phptype' => 'boolean',
      'null' => false,
    ),
    'ov' => 
    array (
      'dbtype' => 'boolean',
      'phptype' => 'boolean',
      'null' => false,
    ),
    'ad' =>
    array (
      'dbtype' => 'boolean',
      'phptype' => 'boolean',
      'null' => false,
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
  'composites' => 
  array (
    'dates' => 
    array (
      'class' => 'GcCalendarDates',
      'local' => 'evid',
      'foreign' => 'id',
      'cardinality' => 'one',
      'owner' => 'foreign',
    ),
  ),
);
