<?php
$xpdo_meta_map['GcCalendarEvents']= array (
  'package' => 'gcCalendar',
  'version' => '1.1',
  'table' => 'gc_calendar_events',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'cid' => NULL,
    'start' => NULL,
    'end' => NULL,
    'title' => NULL,
    'loc' => NULL,
    'notes' => NULL,
    'ad' => NULL,
    'cat' => NULL,
    'link' => NULL,
    'previmage' => NULL,
    'locationcontact' => NULL,
    'locationphone' => NULL,
    'locationemail' => NULL,
    'locationname' => NULL,
    'locationaddr' => NULL,
    'locationcity' => NULL,
    'locationzip' => NULL,
    'locationstate' => NULL,
    'ov' => 0,
    'repeating' => 0,
    'repeattype' => NULL,
    'repeaton' => NULL,
    'repeatonmo' => NULL,
    'repeatfrequency' => NULL,
    'repeatenddate' => NULL,
    'repeatdates' => NULL,
  ),
  'fieldMeta' => 
  array (
    'cid' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '45',
      'phptype' => 'string',
      'null' => true,
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
    'title' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '100',
      'phptype' => 'string',
      'null' => true,
    ),
    'loc' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => true,
    ),
    'notes' => 
    array (
      'dbtype' => 'text',
      'phptype' => 'string',
      'null' => true,
    ),
    'ad' => 
    array (
      'dbtype' => 'boolean',
      'phptype' => 'boolean',
      'null' => false,
    ),
    'cat' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '45',
      'phptype' => 'string',
      'null' => true,
    ),
    'link' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '195',
      'phptype' => 'string',
      'null' => true,
    ),
    'previmage' => 
    array (
      'dbtype' => 'text',
      'phptype' => 'string',
      'null' => true,
    ),
    'locationcontact' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '45',
      'phptype' => 'string',
      'null' => true,
    ),
    'locationphone' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '45',
      'phptype' => 'string',
      'null' => true,
    ),
    'locationemail' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '150',
      'phptype' => 'string',
      'null' => true,
    ),
    'locationname' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '100',
      'phptype' => 'string',
      'null' => true,
    ),
    'locationaddr' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '150',
      'phptype' => 'string',
      'null' => true,
    ),
    'locationcity' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '45',
      'phptype' => 'string',
      'null' => true,
    ),
    'locationzip' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '45',
      'phptype' => 'string',
      'null' => true,
    ),
    'locationstate' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '45',
      'phptype' => 'string',
      'null' => true,
    ),
    'ov' =>
    array (
      'dbtype' => 'boolean',
      'phptype' => 'boolean',
      'null' => false,
      'default' => 0,
    ),
    'repeating' =>
    array (
      'dbtype' => 'boolean',
      'phptype' => 'boolean',
      'null' => false,
      'default' => 0,
    ),
    'repeattype' => 
    array (
      'dbtype' => 'int',
      'precision' => '1',
      'phptype' => 'integer',
      'null' => true,
    ),
      'repeaton' =>
      array (
        'dbtype' => 'varchar',
        'precision' => '15',
        'phptype' => 'string',
        'null' => true,
      ),
      'repeatonmo' =>
      array (
        'dbtype' => 'varchar',
        'precision' => '15',
        'phptype' => 'string',
        'null' => true,
      ),
    'repeatfrequency' => 
    array (
      'dbtype' => 'int',
      'precision' => '2',
      'phptype' => 'int',
      'null' => true,
    ),
    'repeatenddate' => 
    array (
      'dbtype' => 'int',
      'precision' => '20',
      'phptype' => 'int',
      'null' => true,
    ),
    'repeatdates' => 
    array (
      'dbtype' => 'text',
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
    'dates' => 
    array (
      'class' => 'GcCalendarDates',
      'local' => 'id',
      'foreign' => 'evid',
      'cardinality' => 'many',
      'owner' => 'local',
    ),
  ),
);
