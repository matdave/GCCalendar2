<?php
$xpdo_meta_map['GcCalendarCals']= array (
  'package' => 'gcCalendar',
  'version' => '1.1',
  'table' => 'gc_calendar_cals',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'title' => NULL,
    'color' => NULL,
    'key' => NULL,
  ),
  'fieldMeta' => 
  array (
    'title' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '45',
      'phptype' => 'string',
      'null' => true,
    ),
    'color' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '45',
      'phptype' => 'string',
      'null' => true,
    ),
    'key' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '45',
      'phptype' => 'string',
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
    'cals' => 
    array (
      'class' => 'GcCalendarCalsConnect',
      'local' => 'id',
      'foreign' => 'catid',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
  ),
);
