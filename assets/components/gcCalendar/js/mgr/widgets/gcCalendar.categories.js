/**
 * Created with JetBrains PhpStorm.
 * User: Mat Jones
 * Date: 9/3/13
 * Time: 12:48 PM
 * To change this template use File | Settings | File Templates.
 */
gcCalendar.grid.gcCalendarCats = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'gcCalendar-grid-gcCalendarCats'
        ,url: gcCalendar.config.connectorUrl
        ,baseParams: { action: 'mgr/gcCalendar/getCategories' }
        ,fields: ['id','ctitle']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'ctitle'
        ,save_action: 'mgr/gcCalendar/updateFromGridCats'
        ,autosave: true
        ,columns: [{
            header: _('id')
            ,dataIndex: 'id'
            ,sortable: true
            ,width: 60
            ,hidden: true
        },{
            header: _('gcCalendar.title')
            ,dataIndex: 'ctitle'
            ,sortable: true
            ,width: 100
            ,editor: { xtype: 'textfield' }
        }]
        ,tbar:[{
            text: _('gcCalendar.cat_create')
            ,handler: { xtype: 'gcCalendar-window-gcCalendar-createCats' ,blankValues: true }
        }]
        ,getMenu: function() {
            return [{
                text: _('gcCalendar.event_update')
                ,handler: this.updategcCalendarCats
                ,iconCls: 'extensible-cal-icon-evt-edit'
            },'-',{
                text: _('gcCalendar.event_remove')
                ,handler: this.removegcCalendarCats
                ,iconCls: 'extensible-cal-icon-evt-del'
            }];
        }
        ,updategcCalendarCats: function(btn,e) {
            if (!this.updategcCategoryWindow) {
                this.updategcCategoryWindow = MODx.load({
                    xtype: 'gcCalendar-window-gcCalendar-updateCats'
                    ,record: this.menu.record
                    ,listeners: {
                        'success': {fn:this.refresh,scope:this}
                    }
                });
            }
            this.updategcCategoryWindow.setValues(this.menu.record);
            this.updategcCategoryWindow.show(e.target);
        }
        ,removegcCalendarCats: function() {
            MODx.msg.confirm({
                title: _('gcCalendar.event_remove')
                ,text: _('gcCalendar.event_remove_confirm')
                ,url: this.config.url
                ,params: {
                    action: 'mgr/gcCalendar/removeCats'
                    ,id: this.menu.record.id
                }
                ,listeners: {
                    'success': {fn:this.refresh,scope:this}
                }
            });
        }
    });
    gcCalendar.grid.gcCalendarCats.superclass.constructor.call(this,config)
};
Ext.extend(gcCalendar.grid.gcCalendarCats,MODx.grid.Grid);
Ext.reg('gcCalendar-grid-gcCalendarCats',gcCalendar.grid.gcCalendarCats);
gcCalendar.window.UpdategcCalendarCats = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('gcCalendar.gcCategory_update')
        ,id: config.record.id+'-cat-update'
        ,url: gcCalendar.config.connectorUrl
        ,baseParams: {
            action: 'mgr/gcCalendar/updateCats'
        }
        ,fields: [{
            xtype: 'hidden'
            ,name: 'id'
            ,id: config.record.id+'-cat-id'
        },{
            xtype: 'textfield'
            ,fieldLabel: _('gcCalendar.title')
            ,name: 'ctitle'
            ,anchor: '100%'
        }]
    });
    gcCalendar.window.UpdategcCalendarCats.superclass.constructor.call(this,config);
};
Ext.extend(gcCalendar.window.UpdategcCalendarCats,MODx.Window);
Ext.reg('gcCalendar-window-gcCalendar-updateCats',gcCalendar.window.UpdategcCalendarCats);

gcCalendar.window.CreategcCalendarCats = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('gcCalendar.gcCalendar_create')
        ,url: gcCalendar.config.connectorUrl
        ,baseParams: {
            action: 'mgr/gcCalendar/createCats'
        }
        ,fields: [{
            xtype: 'textfield'
            ,fieldLabel: _('gcCalendar.title')
            ,name: 'ctitle'
            ,anchor: '100%'
        }]
    });
    gcCalendar.window.CreategcCalendarCats.superclass.constructor.call(this,config);
};
Ext.extend(gcCalendar.window.CreategcCalendarCats,MODx.Window);
Ext.reg('gcCalendar-window-gcCalendar-createCats',gcCalendar.window.CreategcCalendarCats);
