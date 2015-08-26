/**
 * Created with JetBrains PhpStorm.
 * User: Mat Jones
 * Date: 9/3/13
 * Time: 12:48 PM
 * To change this template use File | Settings | File Templates.
 */

MODx.Window.override({
    loadDropZones: function() {
    }
});

gcCalendar.grid.gcCalendar = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        id: 'gcCalendar-grid-gcCalendar'
        ,url: gcCalendar.config.connectorUrl
        ,baseParams: { action: 'mgr/gcCalendar/getList' }
        ,fields: ['id','cid','start','startymd','starthis','startRAW','endymd','endhis','end','title','loc','notes','ad','cat','link','previmage','locationcontact','locationphone','locationemail','locationname','locationaddr','locationcity','locationzip','locationstate','repeating','repeattype','repeaton','repeatonc','repeatonmo','repeatfrequency','repeatenddate','repeatdates','ov']
        ,paging: true
        ,remoteSort: true
        ,anchor: '97%'
        ,autoExpandColumn: 'name'
        ,save_action: 'mgr/gcCalendar/updateFromGrid'
        ,autosave: true
        ,columns: [{
            header: _('id')
            ,dataIndex: 'id'
            ,sortable: false
            ,width: 60
            ,hidden: true
        },{
            header: _('gcCalendar.title')
            ,dataIndex: 'title'
            ,sortable: false
            ,width: 100
            ,editor: { xtype: 'textfield' }
        },{
            header: ('Start Date')
            ,dataIndex: 'startymd'
            ,sortable: false
            ,width: 80
            ,editor: { xtype: 'textfield' }
        },{
            header: ('Start Time')
            ,dataIndex: 'starthis'
            ,sortable: false
            ,width: 80
            ,editor: { xtype: 'timefield' }
        },{
            header: ('End Date')
            ,dataIndex: 'endymd'
            ,sortable: false
            ,width: 80
            ,editor: { xtype: 'textfield'}
        },{
            header: ('End Time')
            ,dataIndex: 'endhis'
            ,sortable: false
            ,width: 80
            ,editor: { xtype: 'timefield' }
        },{
            header: ('All Day')
            ,dataIndex: 'ad'
            ,width: 80
            ,sortable: false
            ,renderer: function(value, metaData, record, row, col, store, gridView){
                var check = (value)?'<i class="icon icon-check-circle true"></i>':'';
                return check;
            }
        },{
            header: ('Repeats')
            ,dataIndex: 'repeating'
            ,sortable: false
            ,width: 60
            ,renderer: function(value, metaData, record, row, col, store, gridView){
                var check = (value)?'<i class="icon icon-check-circle true"></i>':'';
                return check;
            }
        }]
        ,tbar:[{
            text: _('gcCalendar.event_create')
            //,handler: { xtype: 'gcCalendar-window-gcCalendar-create', blankValues: true }
            ,listeners: {'click': {fn: this.creategcCalendar, scope:this}}
        },{
            xtype: 'textfield'
            ,id: 'grid-searchbox'
            ,name: 'searchbox'
            ,hiddenName: 'searchbox'
            ,style:{marginLeft:'10px'}
            ,emptyText: _('gcCalendar.search...')
            ,listeners: {
                'change': {fn:this.search,scope:this}
                ,'render': {fn: function(cmp) {
                    new Ext.KeyMap(cmp.getEl(), {
                        key: Ext.EventObject.ENTER
                        ,fn: function() {
                            this.fireEvent('change',this);
                            this.blur();
                            return true;
                        }
                        ,scope: cmp
                    });
                },scope:this}
            }
        },'->',{
            xtype: 'combo',
            displayField: 'title',
            valueField: 'id',
            forceSelection: true,
            store: new Ext.data.JsonStore({
                root: 'results',
                idProperty: 'id',
                url: gcCalendar.config.connectorUrl,
                baseParams: {
                    action: 'mgr/store/getcals'
                },
                fields: [
                    'id', 'title'
                ]
            }),
            mode: 'remote',
            triggerAction: 'all',
            fieldLabel: ('Select Calendar'),
            name: 'comboparent',
            id: 'search-grid-Cals',
            allowBlank: false,
            typeAhead:true,
            minChars:1,
            emptyText:('Select Calendar'),
            valueNotFoundText:('Select Calendar'),
            anchor:'100%',
            listeners: {
                'change': {fn:this.combosearch,scope:this}
                ,'render': {fn: function(cmp) {
                    new Ext.KeyMap(cmp.getEl(), {
                        key: Ext.EventObject.ENTER
                        ,fn: function() {
                            this.fireEvent('change',this);
                            this.blur();
                            return true;
                        }
                        ,scope: cmp
                    });
                },scope:this}
            }
        },{
            text:('Past Events')
            ,id:'pastbnt'
            ,visible:true
            ,handler: function(){
                var s = this.getStore();
                s.baseParams.historical = 1;
                this.getBottomToolbar().changePage(1);
                this.refresh();
                Ext.getCmp('pastbnt').hide();
                Ext.getCmp('futurebnt').show();
            }
        },{
            text:('Upcoming Events')
            ,id:'futurebnt'
            ,hidden:true
            ,handler: function(){
                var s = this.getStore();
                s.baseParams.historical = 0;
                this.getBottomToolbar().changePage(1);
                this.refresh();
                Ext.getCmp('futurebnt').hide();
                Ext.getCmp('pastbnt').show();
            }
        },{
            xtype: 'button'
            ,id: 'filter-clear-bus'
            ,text: ('Clear')
            ,style:{marginLeft:'10px'}
            ,listeners: {
                'click': {fn: this.clearFilter, scope: this}
            }}]
        ,getMenu: function() {
            return [{
                text: _('gcCalendar.event_update')
                ,iconCls: 'extensible-cal-icon-evt-edit'
                ,handler: this.updategcCalendar
            },'-',{
                text: _('gcCalendar.duplicate')
                ,handler: this.duplicateEvent
            },'-',{
                text: _('gcCalendar.event_remove')
                ,iconCls: 'extensible-cal-icon-evt-del'
                ,handler: this.removegcCalendar
            } /*,'-',{
             text: ('Log Data')
             ,handler: this.loggcCalendar
             }*/
            ];
        }
        ,updategcCalendar: function(btn,e) {

            this.menu.record.window = Math.floor((Math.random()*1000)+1);
            this.menu.record.mode = 'update';
            if (this.updategcCalendarWindow) {
                //this.updategcCalendarWindow.destroy();
                this.updategcCalendarWindow = null;
            }
            if (!this.updategcCalendarWindow) {
                this.updategcCalendarWindow = MODx.load({
                    xtype: 'gcCalendar-window-gcCalendar-update'
                    ,record: this.menu.record
                    ,listeners: {
                        'success': {fn:this.refresh,scope:this}
                    }
                });
            }
            this.updategcCalendarWindow.setValues(this.menu.record);
            this.updategcCalendarWindow.show(e.target);
        }
        ,removegcCalendar: function() {
            MODx.msg.confirm({
                title: _('gcCalendar.event_remove')
                ,text: _('gcCalendar.event_remove_confirm')
                ,url: this.config.url
                ,params: {
                    action: 'mgr/gcCalendar/remove'
                    ,id: this.menu.record.id
                }
                ,listeners: {
                    'success': {fn:this.refresh,scope:this}
                }
            });
        },loggcCalendar: function() {
            console.log(this.menu.record);
        },duplicateEvent:function(btn,e){
            this.menu.record.window = Math.floor((Math.random()*1000)+1);
            this.menu.record.mode = 'duplicate';
            if (this.dupCalWindow) {
                this.dupCalWindow.close();
                this.dupCalWindow = null;
            }
            cloneRec = this.menu.record;
            //cloneRec.title = '('+_('gcCalendar.duplicated')+') '+cloneRec.title;
            this.dupCalWindow = MODx.load({
                xtype: 'gcCalendar-window-gcCalendar-update'
                ,record: cloneRec
            });
            this.dupCalWindow.show(e.target);
        }
    });
    gcCalendar.grid.gcCalendar.superclass.constructor.call(this,config)
};
Ext.extend(gcCalendar.grid.gcCalendar,MODx.grid.Grid,{
    search: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.searchbox = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    },
    combosearch: function(tf,nv,ov) {
        var s = this.getStore();
        s.baseParams.combobox = tf.getValue();
        // console.log('ComboSearch:'+tf.getValue());
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,clearFilter: function() {
        this.getStore().baseParams = {
            action: 'mgr/gcCalendar/getList'
        };
        Ext.getCmp('grid-searchbox').reset();
        Ext.getCmp('search-grid-Cals').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    ,creategcCalendar: function() {
        var record = new Array;
        record.window = Math.floor((Math.random()*1000)+1);
        record.mode = 'new';
        if (this.creategcCalendarWindow) {
            //this.creategcCalendarWindow.destroy();
            this.creategcCalendarWindow = null;
        }
        if (!this.creategcCalendarWindow) {
            this.creategcCalendarWindow = MODx.load({
                xtype: 'gcCalendar-window-gcCalendar-update'
                ,record: record
                ,listeners: {
                    'success': {fn:this.refresh,scope:this}
                }
            });
        }
        this.creategcCalendarWindow.setValues(record);
        this.creategcCalendarWindow.show();
    }
});
Ext.reg('gcCalendar-grid-gcCalendar',gcCalendar.grid.gcCalendar);
