<?php
$xpdo_meta_map['GcCalendarCats']= array (
  'package' => 'gcCalendar',
  'version' => '1.1',
  'table' => 'gc_calendar_cats',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'ctitle' => NULL,
    'ccid' => NULL,
  ),
  'fieldMeta' => 
  array (
    'ctitle' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '45',
      'phptype' => 'string',
      'null' => true,
    ),
    'ccid' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '45',
      'phptype' => 'string',
      'null' => true,
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
    'cats' => 
    array (
      'class' => 'GcCalendarCatsConnect',
      'local' => 'id',
      'foreign' => 'catsid',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
  ),
);
