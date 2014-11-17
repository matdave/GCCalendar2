gcCalendar.panel.gcCalendar = function(config){
    config = config || {};
    Ext.ensible.cal.EventMappings = {
        // These are the same fields as defined in the standard EventRecord object but the
        // names and mappings have all been customized. Note that the name of each field
        // definition object (e.g., 'EventId') should NOT be changed for the default fields
        // as it is the key used to access the field data programmatically.
        EventId:     {name: 'id', mapping:'id', type:'int'},
        CalendarId:  {name: 'cid', mapping: 'cid', type: 'string'},
        Title:       {name: 'title', mapping: 'title'},
        StartDate:   {name: 'start', mapping: 'start', type: 'date', dateFormat: 'c'},
        EndDate:     {name: 'end', mapping: 'end', type: 'date', dateFormat: 'c'},
        Location:    {name: 'loc', mapping: 'loc'},
        Notes:       {name: 'notes', mapping: 'notes'},
        Url:         {name: 'link', mapping: 'link'},
        IsAllDay:    {name: 'ad', mapping: 'ad', type: 'boolean'},
        RRule:       {name: 'recur_rule', mapping: 'recur_rule'},
        Reminder:    {name: 'reminder', mapping: 'reminder'},
        
        //Custom Data
        StartDay: {name:'startymd', mapping:'startymd', type: 'string'},
        StartTime: {name:'starthis', mapping:'starthis', type: 'string'},
        EndDay: {name:'endymd', mapping:'endymd', type: 'string'},
        EndTime: {name:'endhis', mapping:'endhis', type: 'string'},
        cat: {name:'cat', mapping:'cat', type: 'string'},
        previmage: {name:'previmage', mapping:'previmage', type: 'string'}

    };
    // Don't forget to reconfigure!
    Ext.ensible.cal.EventRecord.reconfigure();
    Ext.ensible.cal.EventEditWindow.override({
        enableEditDetails : false
    });
    Ext.ensible.cal.CalendarView.override({
        getEventEditor : function(){

            // only create one instance of the edit window, even if there are multiple CalendarPanels
            /*this.editWin = this.editWin || Ext.WindowMgr.get('gcCalendar-window-gcCalendar-create');

            if(!this.editWin){
                this.editWin = new gcCalendar.window.CreategcCalendar({
                    id: 'gcCalendar-window-gcCalendar-create',
                    listeners: {
                        'eventadd': {
                            fn: function(win, rec, animTarget){
                                //win.hide(animTarget);
                                win.currentView.onEventAdd(null, rec);
                            },
                            scope: this
                        },
                        'eventdelete': {
                            fn: function(win, rec, animTarget){
                                MODx.msg.confirm({
                                    title: _('gcCalendar.event_remove')
                                    ,text: _('gcCalendar.event_remove_confirm')
                                    ,url: gcCalendar.config.connectorUrl
                                    ,params: {
                                        action: 'mgr/gcCalendar/remove'
                                        ,id: rec.id
                                    }
                                });
                            },
                            scope: this
                        }
                    }
                });
            }*/

            // allows the window to reference the current scope in its callbacks
            this.editWin.currentView = this;
            return this.editWin;
        }
    });
    Ext.ensible.cal.EventContextMenu.override({
        buildMenu: function(){
            if(this.rendered){
                return;
            }
            this.dateMenu = new Ext.menu.DateMenu({
                scope: this,
                handler: function(dp, dt){
                    dt = Ext.ensible.Date.copyTime(this.rec.data[Ext.ensible.cal.EventMappings.StartDate.name], dt);
                    this.fireEvent('eventmove', this, this.rec, dt);
                }
            });

            Ext.apply(this, {
                items: [{
                    text: this.deleteText,
                    iconCls: 'extensible-cal-icon-evt-del',
                    scope: this,
                    handler: function(){
                        this.fireEvent('eventdelete', this, this.rec, this.ctxEl);
                    }
                },'-',{
                    text: this.moveToText,
                    iconCls: 'extensible-cal-icon-evt-move',
                    menu: this.dateMenu
                }]
            });
        }});
    this.eventStore = new Ext.ensible.cal.EventStore({
        id: 'event-store',
        restful: true,
        proxy: new Ext.data.HttpProxy({
            disableCaching: false, // no need for cache busting when loading via Ajax
            api: {
                read:    {url:gcCalendar.config.connectorUrl, params:{HTTP_MODAUTH: MODx.siteId,action:'mgr/store/getList'}},
                create:  {url:gcCalendar.config.connectorUrl, params:{HTTP_MODAUTH: MODx.siteId,action:'mgr/gcCalendar/create'}},
                update:  {url:gcCalendar.config.connectorUrl, params:{HTTP_MODAUTH: MODx.siteId,action:'mgr/gcCalendar/update'}},
                destroy: {url:gcCalendar.config.connectorUrl, params:{HTTP_MODAUTH: MODx.siteId,action:'mgr/gcCalendar/remove'}}
            },
            listeners: {
                exception: function(proxy, type, action, o, res, arg){
                    var msg = res.message ? res.message : Ext.decode(res.responseText).message;
                    // ideally an app would provide a less intrusive message display
                    Ext.Msg.alert('Server Error', msg);
                }
            }
        }),
        reader: new Ext.data.JsonReader({
            totalProperty: 'total',
            successProperty: 'success',
            idProperty: 'id',
            root: 'results',
            messageProperty: 'message',
            fields: Ext.ensible.cal.EventRecord.prototype.fields.getRange()
        }),
        writer: writer = new Ext.data.JsonWriter({
            encode: true,
            writeAllFields: false
        }),
        // the view will automatically set start / end date params for you. You can
        // also pass a valid config object as specified by Ext.data.Store.load()
        // and the start / end params will be appended to it.
        autoLoad: true,

        listeners: {
            load: function(sender, node, records) {
                Ext.each(records, function(record, index){
                    this.logRecord(record);
                }, this);
            },
            write: function(store, action, data, resp, rec){
                var title = Ext.value(rec.data[Ext.ensible.cal.EventMappings.Title.name], '(No title)');
                switch(action){
                    case 'create':
                        Ext.ensible.sample.msg('Add', 'Added "' + title + '"');
                        break;
                    case 'update':
                        Ext.ensible.sample.msg('Update', 'Updated "' + title + '"');
                        break;
                    case 'destroy':
                        Ext.ensible.sample.msg('Delete', 'Deleted "' + title + '"');
                        break;
                }
            }
        },

        logRecord: function(r, depth) {
            if (!depth) { depth = ''; }
            console.log(depth + Ext.encode(r.data));

            Ext.each(r.childNodes, function(record, index){
                this.logRecord(record, depth + '    ');
            }, this);
        }
    });
    this.eventStoreJSON = new Ext.data.JsonStore({
        storeId: 'eventStore',
        url: gcCalendar.config.connectorUrl,
        baseParams: {
            action: 'mgr/store/getList'
        },
        root: 'results',
        idProperty: Ext.ensible.cal.EventMappings.EventId.mapping || 'id',
        fields: Ext.ensible.cal.EventRecord.prototype.fields.getRange(),
        remoteSort: true,
        autoLoad: true,
        sortInfo: {
            field: 'title',
            direction: 'ASC'
        },
        listeners: {
            beforeload: function(store, options) {
                console.log('beforeload: myStore.count = ' + store.getCount());
                console.log(options);
            },
            load: function(store, records, options) {
                console.log('load: ' + store.getCount());
                console.log(records);
                console.log(options);
            },
            exception: function(misc) {
                console.log('exception:');
                console.log(misc);
            }
        }
    });
    this.eventStore.on('load',function(store,records,opts){

        console.log('Records:'+records);
        console.log('opts:'+opts);
    });
    Ext.applyIf(config,{
    id: 'calendar-remote',
    items: [{

        region: 'west',
        border: false,
        items: [{
            id:'calendar-remote-calendar',
        xtype: 'extensible.calendarpanel',
        region: 'center',
        enableEditDetails:false,
        readOnly: true,
        activeItem: 3,
        monthViewCfg: {
            showHeader: true,
            showWeekLinks: true,
            showWeekNumbers: true
        },
        eventStore: this.eventStoreJSON,
        calendarStore: new Ext.data.JsonStore({
            storeId: 'calendarStore',
            url: gcCalendar.config.connectorUrl,
            baseParams: {
                action: 'mgr/store/getAllCals'
            },
            root: 'results',
            idProperty: Ext.ensible.cal.CalendarMappings.CalendarId.mapping || 'id',
            fields: Ext.ensible.cal.CalendarRecord.prototype.fields.getRange(),
            remoteSort: true,
            autoLoad: true,
            sortInfo: {
                field: 'title',
                direction: 'ASC'
            },
            listeners: {
                beforeload: function(myStore, options) {
                    console.log('beforeload: myStore.count = ' + myStore.getCount());
                    console.log(options);
                },
                load: function(myStore, records, options) {
                    console.log('load: ' + myStore.getCount());
                    console.log(records);
                    console.log(options);
                },
                exception: function(misc) {
                    console.log('exception:');
                    console.log(misc);
                }
            }
        }),
            title: 'Cloud Calendar',
            listeners: {

                'eventclick': {
                    fn: function(panel, rec, el){
                        //console.log(panel, rec, el);
                        // override the default edit handling
                        //Ext.Msg.alert('App Click', 'Editing: ' + rec.data.Title);

                        // return false to tell the CalendarPanel that we've handled the click and it
                        // should ignore it (e.g., do not show the default edit window)
                        //return false;


                        rec.data.window = Math.floor((Math.random()*1000)+1);
                        if (this.updategcCalendarWindow) {
                            //this.updategcCalendarWindow.destroy();
                            this.updategcCalendarWindow = null;
                        }
                        if (!this.updategcCalendarWindow) {
                            this.updategcCalendarWindow = MODx.load({
                                xtype: 'gcCalendar-window-gcCalendar-update'
                                ,record: rec.data
                                ,listeners: {
                                    'success': {fn:this.refresh,scope:this}
                                }
                            });
                        }
                        this.updategcCalendarWindow.setValues(rec.data);
                        this.updategcCalendarWindow.show(el.target);
                        //console.log(rec.data);
                    },
                    scope: this
                },
            'eventover': function(vw, rec, el){
                //console.log('Entered evt rec='+rec.data[Ext.ensible.cal.EventMappings.Title.name]', view='+ vw.id +', el='+el.id);
            },
            'eventout': function(vw, rec, el){
                //console.log('Leaving evt rec='+rec.data[Ext.ensible.cal.EventMappings.Title.name]+', view='+ vw.id +', el='+el.id);
            },
            'eventadd': {
                fn: function(cp, rec){
                    this.showMsg('Event '+ rec.data[Ext.ensible.cal.EventMappings.Title.name] +' was added');
                },
                scope: this
            },
            'eventupdate': {
                fn: function(cp, rec){
                    this.showMsg('Event '+ rec.data[Ext.ensible.cal.EventMappings.Title.name] +' was updated');
                },
                scope: this
            },
            'eventdelete': {
                fn: function(cp, rec){
                    //this.eventStore.remove(rec);
                    this.showMsg('Event '+ rec.data[Ext.ensible.cal.EventMappings.Title.name] +' was deleted');
                },
                scope: this
            },
            'eventcancel': {
                fn: function(cp, rec){
                    // edit canceled
                },
                scope: this
            },
            'viewchange': {
                fn: function(p, vw, dateInfo){
                    if(this.editWin){
                        this.editWin.hide();
                    };

                },
                scope: this
            },
            'dayclick': {
                fn: function(vw, dt, ad, el){
                    this.clearMsg();
                },
                scope: this
            },
            'rangeselect': {
                fn: function(vw, dates, onComplete){
                    this.clearMsg();
                },
                scope: this
            },
            'eventmove': {
                fn: function(vw, rec){
                    rec.commit();
                    var time = rec.data[Ext.ensible.cal.EventMappings.IsAllDay.name] ? '' : ' \\a\\t g:i a';
                    this.showMsg('Event '+ rec.data[Ext.ensible.cal.EventMappings.Title.name] +' was moved to '+
                        rec.data[Ext.ensible.cal.EventMappings.StartDate.name].format('F jS'+time));
                },
                scope: this
            },
            'eventresize': {
                fn: function(vw, rec){
                    rec.commit();
                    this.showMsg('Event '+ rec.data[Ext.ensible.cal.EventMappings.Title.name] +' was updated');
                },
                scope: this
            },
            'initdrag': {
                fn: function(vw){
                    if(this.editWin && this.editWin.isVisible()){
                        this.editWin.hide();
                    }
                },
                scope: this
            }
        },
        anchor:'100%',
        height: Ext.getBody().getViewSize().height *.65


        }]

    }],
        showMsg: function(msg){
            Ext.fly('app-msg').update(msg).removeClass('x-hidden');
        },
        apply: function(){ Ext.getCmp('calendar-remote-calendar').getActiveView().refresh(true);},

        clearMsg: function(){
            Ext.fly('app-msg').update('').addClass('x-hidden');
        }});
    gcCalendar.panel.gcCalendar.superclass.constructor.call(this,config);
};
Ext.extend(gcCalendar.panel.gcCalendar,MODx.Panel);
Ext.reg('calendar-remote',gcCalendar.panel.gcCalendar);

