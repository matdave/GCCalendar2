gcCalendar.panel.gcCalendar = function(config){

    function convertToTime(date) {
        var timeString;
        var afternoon = false;

        if (date.getHours() >= 12)
            afternoon = true;

        timeString = afternoon ? date.getHours() - 12 : date.getHours();
        timeString = timeString == 0 ? 12 : timeString;
        timeString += ":";
        timeString += ( date.getMinutes() % 100 == 0 ) ? "0" + date.getMinutes() : date.getMinutes();
        timeString += " ";
        timeString += afternoon ? "PM" : "AM";
        return timeString;
    }
    config = config || {};
    Ext.ensible.cal.EventMappings = {
        // These are the same fields as defined in the standard EventRecord object but the
        // names and mappings have all been customized. Note that the name of each field
        // definition object (e.g., 'EventId') should NOT be changed for the default fields
        // as it is the key used to access the field data programmatically.

        EventId:     {name: 'repId', mapping:'repId', type:'int'},
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
        Id:     {name: 'id', mapping:'id', type:'int'},
        StartDay: {name:'startymd', mapping:'startymd', type: 'string'},
        StartTime: {name:'starthis', mapping:'starthis', type: 'string'},
        EndDay: {name:'endymd', mapping:'endymd', type: 'string'},
        EndTime: {name:'endhis', mapping:'endhis', type: 'string'},
        cat: {name:'cat', mapping:'cat', type: 'string'},
        previmage: {name:'previmage', mapping:'previmage', type: 'string'},
        locationcontact: {name:'locationcontact', mapping:'locationcontact', type: 'string'},
        locationphone: {name:'locationphone', mapping:'locationphone', type: 'string'},
        locationemail: {name:'locationemail', mapping:'locationemail', type: 'string'},
        locationname: {name:'locationname', mapping:'locationname', type: 'string'},
        locationaddr: {name:'locationaddr', mapping:'locationaddr', type: 'string'},
        locationcity: {name:'locationcity', mapping:'locationcity', type: 'string'},
        locationzip: {name:'locationzip', mapping:'locationzip', type: 'string'},
        locationstate: {name:'locationstate', mapping:'locationstate', type: 'string'},
        repeating: {name:'repeating', mapping:'repeating', type: 'boolean'},
        repeattype: {name:'repeattype', mapping:'repeattype', type: 'int'},
        repeaton: {name:'repeaton', mapping:'repeaton', type: 'string'},
        repeatonc: {name:'repeatonc', mapping:'repeatonc', type: 'string'},
        repeatonmo: {name:'repeatonmo', mapping:'repeatonmo'},
        repeatfrequency: {name:'repeatfrequency', mapping:'repeatfrequency', type: 'int'},
        repeatenddate: {name:'repeatenddate', mapping:'repeatenddate'},
        ov: {name:'ov', mapping:'ov', type: 'string'}

    };
    // Don't forget to reconfigure!
    Ext.ensible.cal.EventRecord.reconfigure();
    Ext.ensible.cal.EventEditWindow.override({
        enableEditDetails :true
    });
    Ext.ensible.cal.CalendarView.override({
        getEventEditor : function(){


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
                    text: this.editDetailsText,
                    iconCls: 'extensible-cal-icon-evt-edit',
                    scope: this,
                    handler: function(){
                        //this.fireEvent('eventdelete', this, this.rec, this.ctxEl);
                        this.rec.data.window = Math.floor((Math.random()*1000)+1);
                        this.rec.data.mode = 'update';
                        if (this.updategcCalendarWindow) {
                            //this.updategcCalendarWindow.destroy();
                            this.updategcCalendarWindow = null;
                        }
                        if (!this.updategcCalendarWindow) {
                            this.updategcCalendarWindow = MODx.load({
                                xtype: 'gcCalendar-window-gcCalendar-update'
                                ,record: this.rec.data
                                ,listeners: {
                                    'success': {fn:function(){Ext.getCmp('calendar-remote-calendar').getActiveView().refresh(true);},scope:this}
                                }
                            });
                        }
                        this.updategcCalendarWindow.setValues(this.rec.data);
                        this.updategcCalendarWindow.show();/* */
                    }
                },'-',{
                    text: this.deleteText,
                    iconCls: 'extensible-cal-icon-evt-del',
                    scope: this,
                    handler: function(){
                        MODx.msg.confirm({
                            title: _('gcCalendar.event_remove')
                            ,text: _('gcCalendar.event_remove_confirm')
                            ,url: gcCalendar.config.connectorUrl
                            ,params: {
                                action: 'mgr/gcCalendar/remove'
                                ,id: this.rec.data.id
                            }
                            ,listeners: {
                                'success': {fn:function(){Ext.getCmp('calendar-remote-calendar').getActiveView().refresh(true);},scope:this}
                            }
                        });
                    }
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

            },
            load: function(store, records, options) {

            },
            exception: function(misc) {
                console.log('exception:');
                console.log(misc);
            }
        }
    });
    this.eventStore.on('load',function(store,records,opts){

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
                enableEditDetails:true,
                readOnly: false,
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

                        },
                        load: function(myStore, records, options) {

                        },
                        exception: function(misc) {
                            console.log('exception:');
                            console.log(misc);
                        }
                    }
                }),
                title: '',
                listeners: {

                    'eventclick': {
                        fn: function(panel, rec, el){

                            //this.fireEvent('eventdelete', this, this.rec, this.ctxEl);
                            rec.data.window = Math.floor((Math.random()*1000)+1);
                            rec.data.mode = 'update';
                            if (this.updategcCalendarWindow) {
                                //this.updategcCalendarWindow.destroy();
                                this.updategcCalendarWindow = null;
                            }
                            if (!this.updategcCalendarWindow) {
                                this.updategcCalendarWindow = MODx.load({
                                    xtype: 'gcCalendar-window-gcCalendar-update'
                                    ,record: rec.data
                                    ,listeners: {
                                        'success': {fn:function(){Ext.getCmp('calendar-remote-calendar').getActiveView().refresh(true);},scope:this}
                                    }
                                });
                            }
                            this.updategcCalendarWindow.setValues(rec.data);
                            this.updategcCalendarWindow.show();/* */
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

                            return false;
                        },
                        scope: this

                    },
                    'rangeselect': {
                        fn: function(t,o,f){
                            var record = new Array;

                            var start = new Date(o.start);
                            var sm = start.getMonth() < 10 ? '0'+(start.getMonth() + 1) : (start.getMonth() + 1);
                            var sd = start.getDate() < 10 ? '0'+start.getDate() : start.getDate();
                            record.startymd = start.getFullYear() + '-' + sm + '-' + sd;
                            record.starthis = convertToTime(start);
                            record.start = record.startymd + ' ' + record.starthis;

                            var end = new Date(o.end);
                            var em = end.getMonth() < 10 ? '0'+(end.getMonth() + 1) : (end.getMonth() + 1);
                            var ed = end.getDate() < 10 ? '0'+end.getDate() : end.getDate();
                            record.endymd = end.getFullYear() + '-' + em + '-' + ed;
                            record.endhis = convertToTime(end);
                            record.end = record.endymd + ' ' + record.endhis;

                            record.ad = (record.starthis == "12:00 AM" && record.endhis == "11:30 PM")?1:0;

                            record.window = Math.floor((Math.random()*1000)+1);
                            record.mode = 'new';
                            console.log(record);
                            if (this.updategcCalendarWindow) {
                                this.updategcCalendarWindow = null;
                            }
                            if (!this.updategcCalendarWindow) {
                                this.updategcCalendarWindow = MODx.load({
                                    xtype: 'gcCalendar-window-gcCalendar-update'
                                    ,record: record
                                    ,listeners: {
                                        'success': {fn:function(){Ext.getCmp('calendar-remote-calendar').getActiveView().refresh(true);},scope:this}
                                    }
                                });
                            }
                            this.updategcCalendarWindow.setValues(record);
                            this.updategcCalendarWindow.show();


                            return false;
                        },
                        scope: this
                    },
                    'eventmove': {
                        fn: function(ctx,rec,date){
                            console.log(ctx);
                            var record = rec.data;
                            var start = new Date(rec.data.start);
                            var sm = start.getMonth() < 10 ? '0'+(start.getMonth() + 1) : (start.getMonth() + 1);
                            var sd = start.getDate() < 10 ? '0'+start.getDate() : start.getDate();
                            record.startymd = start.getFullYear() + '-' + sm + '-' + sd;
                            if(ctx.xtype != "extensible.monthview" && ctx.xtype != "extensible.multiweekview"){record.starthis = convertToTime(start);}
                            record.start = record.startymd + ' ' + record.starthis;
                            var end = new Date(rec.data.end);
                            var em = end.getMonth() < 10 ? '0'+(end.getMonth() + 1) : (end.getMonth() + 1);
                            var ed = end.getDate() < 10 ? '0'+end.getDate() : end.getDate();
                            record.endymd = end.getFullYear() + '-' + em + '-' + ed;
                            if(ctx.xtype != "extensible.monthview" && ctx.xtype != "extensible.multiweekview"){record.endhis = convertToTime(end);}
                            record.end = record.endymd + ' ' + record.endhis;
                            record.ad = (record.starthis == "12:00 AM" && (record.endhis == "11:30 PM" || record.endhis == "12:00 AM"))?1:0;
                            record.action = 'mgr/gcCalendar/update';
                            MODx.Ajax.request({
                                url:gcCalendar.config.connectorUrl
                                ,params: record
                                ,listeners: {
                                    'success':{
                                        fn: function(){
                                            Ext.getCmp('calendar-remote-calendar').getActiveView().refresh(true);
                                        }
                                        ,scope:this
                                    }
                                }
                            });
                            return false;
                        },
                        scope: this
                    },
                    'eventresize': {
                        fn: function(panel,record){
                            console.log(panel);
                            console.log(record);
                            return false;
                        },
                        scope: this
                    },
                    'initdrag': {
                        fn: function(){
                            return false;
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
        apply: function(){ },

        clearMsg: function(){
            Ext.fly('app-msg').update('').addClass('x-hidden');
        }});
    gcCalendar.panel.gcCalendar.superclass.constructor.call(this,config);
};
Ext.extend(gcCalendar.panel.gcCalendar,MODx.Panel);
Ext.reg('calendar-remote',gcCalendar.panel.gcCalendar);

