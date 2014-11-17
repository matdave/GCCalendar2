/**
 * Created with JetBrains PhpStorm.
 * User: Mat Jones
 * Date: 9/3/13
 * Time: 12:48 PM
 * To change this template use File | Settings | File Templates.
 */
var NumList = [];
for (var i = 1; i <= 32; i++) {
    var nums = [];
    nums.push(i);
    NumList.push(nums);
}
gcCalendar.grid.gcCalendarCals = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'gcCalendar-grid-gcCalendarCals'
        ,url: gcCalendar.config.connectorUrl
        ,baseParams: { action: 'mgr/gcCalendar/getCalendar' }
        ,fields: ['id','title','color','key']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'name'
        ,save_action: 'mgr/gcCalendar/updateFromGridCals'
        ,autosave: true
        ,columns: [{
            header: _('id')
            ,dataIndex: 'id'
            ,sortable: true
            ,width: 60
            ,hidden: true
        },{
            header: _('gcCalendar.title')
            ,dataIndex: 'title'
            ,sortable: true
            ,width: 100
            ,editor: { xtype: 'textfield' }
        },{
            header: _('gcCalendar.color')
            ,dataIndex: 'color'
            ,sortable: false
            ,width: 80
        },{
            header: _('gcCalendar.context')
            ,dataIndex: 'key'
            ,sortable: false
            ,width: 80
            ,editor: { xtype: 'textfield' }
        }]
        ,tbar:[{
            text: _('gcCalendar.cal_create')
            ,handler: { xtype: 'gcCalendar-window-gcCalendar-createCals' ,blankValues: true }
        }]
        ,getMenu: function() {
            return [{
                text: _('gcCalendar.event_update')
                ,handler: this.updategcCalendarCals
                ,iconCls: 'extensible-cal-icon-evt-edit'
            },'-',{
                text: _('gcCalendar.event_remove')
                ,handler: this.removegcCalendarCals
                ,iconCls: 'extensible-cal-icon-evt-del'
            }];
        }
        ,updategcCalendarCals: function(btn,e) {
            if (this.updategcCalendarCalsWindow) {
                //this.updategcCalendarCalsWindow.destroy();
                this.updategcCalendarCalsWindow = null;
            }
            if (!this.updategcCalendarCalsWindow) {
                this.updategcCalendarCalsWindow = MODx.load({
                    xtype: 'gcCalendar-window-gcCalendar-updateCals'
                    ,record: this.menu.record
                    ,listeners: {
                        'success': {fn:this.refresh,scope:this}
                    }
                });
            }
            this.updategcCalendarCalsWindow.setValues(this.menu.record);
            this.updategcCalendarCalsWindow.show(e.target);
        }
        ,removegcCalendarCals: function() {
            MODx.msg.confirm({
                title: _('gcCalendar.event_remove')
                ,text: _('gcCalendar.event_remove_confirm')
                ,url: this.config.url
                ,params: {
                    action: 'mgr/gcCalendar/removeCals'
                    ,id: this.menu.record.id
                }
                ,listeners: {
                    'success': {fn:this.refresh,scope:this}
                }
            });
        }
    });
    gcCalendar.grid.gcCalendarCals.superclass.constructor.call(this,config)
};
Ext.extend(gcCalendar.grid.gcCalendarCals,MODx.grid.Grid);
Ext.reg('gcCalendar-grid-gcCalendarCals',gcCalendar.grid.gcCalendarCals);
gcCalendar.window.UpdategcCalendarCals = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('gcCalendar.gcCalendar_update')
        ,id: config.record.id+'-cal-update'
        ,url: gcCalendar.config.connectorUrl
        ,closeAction: 'close'
        ,baseParams: {
            action: 'mgr/gcCalendar/updateCals'
        }
        ,fields: [{
            xtype: 'hidden'
            ,name: 'id'
        },{
            xtype: 'textfield'
            ,fieldLabel: _('gcCalendar.title')
            ,name: 'title'
            ,anchor: '100%'
        },{
            fieldLabel: _('gcCalendar.color')
            ,xtype:'combo'
            ,mode: 'local'
            ,store: new Ext.data.ArrayStore({
                id: 0,
                fields: ['id'],
                data: NumList
            })
            ,id: config.record.id+'-colors'
            ,triggerAction: 'all'
            ,displayField: 'id'
            ,valueField: 'id'
            ,editable: true
            ,width: 150
            ,name: 'color'
            ,anchor: '100%'
            ,cls: 'x-cal-'+config.record.color
            ,value: config.record.color
            ,tpl: '<tpl for="."><div class="x-combo-list-item x-cal-{id}"><div class="ext-cal-picker-icon">&#160;</div>{id}</div></tpl>'
            ,listeners: {
                change: function(c,n,o){
                    this.removeClass('x-cal-'+o);
                },
                beforeselect: function( x, n){
                    if(!t){var t= n.id}
                    this.removeClass('x-cal-'+config.record.color);
                    this.removeClass('x-cal-'+t);
                    this.addClass('x-cal-'+ n.id);

                }
            }
        },{
            xtype: 'combo',
            displayField: 'key',
            valueField: 'key',
            forceSelection: true,
            store: new Ext.data.JsonStore({
                      root: 'results',
                      idProperty: 'key',
                      url: gcCalendar.config.connectorUrl,
                      baseParams: {
                            action: 'mgr/store/getKeys'
                      },
                      fields: [
                            'key'
                      ]
              }),
            mode: 'remote',
            triggerAction: 'all',
            fieldLabel: _('gcCalendar.context'),
            name: 'key',
            hiddenName: 'key',
            id: config.record.id+'-create_key',
            valueNotFoundText:('Select Site Context'),
            anchor:'100%',
            value: config.record.key}]
    });
    gcCalendar.window.UpdategcCalendarCals.superclass.constructor.call(this,config);
};
Ext.extend(gcCalendar.window.UpdategcCalendarCals,MODx.Window);
Ext.reg('gcCalendar-window-gcCalendar-updateCals',gcCalendar.window.UpdategcCalendarCals);

gcCalendar.window.CreategcCalendarCals = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('gcCalendar.gcCalendar_create')
        ,url: gcCalendar.config.connectorUrl
        ,baseParams: {
            action: 'mgr/gcCalendar/createCals'
        }
        ,fields: [{
            xtype: 'textfield'
            ,fieldLabel: _('gcCalendar.title')
            ,name: 'title'
            ,anchor: '100%'
        },{
            fieldLabel: _('gcCalendar.color')
            ,xtype:'combo'
            ,mode: 'local'
            ,store: new Ext.data.ArrayStore({
                id: 0,
                fields: ['id'],
                data: NumList
            })
            ,id: config.record.id+'-colors'
            ,triggerAction: 'all'
            ,displayField: 'id'
            ,valueField: 'id'
            ,editable: true
            ,width: 150
            ,name: 'color'
            ,anchor: '100%'
            ,tpl: '<tpl for="."><div class="x-combo-list-item x-cal-{id}"><div class="ext-cal-picker-icon">&#160;</div>{id}</div></tpl>'
        },{
            xtype: 'combo',
            displayField: 'key',
            valueField: 'key',
            forceSelection: true,
            store: new Ext.data.JsonStore({
                      root: 'results',
                      idProperty: 'key',
                      url: gcCalendar.config.connectorUrl,
                      baseParams: {
                            action: 'mgr/store/getKeys'
                      },
                      fields: [
                            'key'
                      ]
              }),
            mode: 'remote',
            triggerAction: 'all',
            fieldLabel: _('gcCalendar.context'),
            name: 'key',
            hiddenName: 'key',
            id: 'key',
            valueNotFoundText:('Select Site Context'),
            anchor:'100%'
        }]
    });
    gcCalendar.window.CreategcCalendarCals.superclass.constructor.call(this,config);
};
Ext.extend(gcCalendar.window.CreategcCalendarCals,MODx.Window);
Ext.reg('gcCalendar-window-gcCalendar-createCals',gcCalendar.window.CreategcCalendarCals);
