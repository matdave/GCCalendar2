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
        },{
            header: ('Repeats')
            ,dataIndex: 'repeating'
            ,sortable: false
            ,width: 60
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
                /* id issue causing duplicate fields

                */
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
        if (this.creategcCalendarWindow) {
            //this.creategcCalendarWindow.destroy();
            this.creategcCalendarWindow = null;
        }
        if (!this.creategcCalendarWindow) {
            this.creategcCalendarWindow = MODx.load({
                xtype: 'gcCalendar-window-gcCalendar-create'
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


gcCalendar.window.UpdategcCalendar = function(config) {

    config = config || {};
    var modeTitle = (config.record.mode == 'duplicate')?'Duplicate':'Update';
    var i = 1;
    function addDates(c,n,i,v){
            var w = config.record.window;
            var tp = (n==1)?'new':'old';
            Ext.getCmp(c+'-time-holder').add({
                xtype:'container'
                ,layout: 'column'
                ,id: c+'-time-set-'+tp+i+'-'+w
                ,anchor:'100%'
                ,cls:'panel-desc'
                ,fieldLabel:('Date Set '+ i)
                ,style:{marginBottom:'15px'}
                ,defaults: {
                    // applied to each contained item
                    // nothing this time
                    anchor:'100%'
                    //,layout: 'form'
                    ,labelWidth: '100'
                    ,cellCls: 'valign-center'

                }
                ,items:[{
                    xtype:'hidden',
                    name:tp+'date['+i+'][ogid][]',
                    value:(v)?v.id:'',
                    id:c+'-date-id-'+tp+i+'-'+w
                },{
                    xtype: 'checkbox'
                    ,boxLabel: ('All Day')
                    ,name: tp+'date['+i+'][ad][]'
                    ,id: c+'allday'+tp+i+'-'+w
                    ,checked: (v)?v.ad:config.record.ad
                    ,listeners:{
                        check:{fn:function(tht, value) {

                            var adFlag = Ext.getCmp(c+'allday'+tp+i+'-'+w);
                            var sd = Ext.getCmp(c+'-date-start-his-'+tp+i+'-'+w);
                            var ed = Ext.getCmp(c+'-date-end-his-'+tp+i+'-'+w);

                            if(adFlag.getValue() === true){
                                if(ed.getValue() !== sd.getValue()){
                                    ed.setValue(sd.getValue());
                                }
                                ed.hide();
                                sd.hide();
                            } else {
                                sd.show();
                                ed.show();
                            }
                        }}
                    }
                },{
                    columnWidth:1,
                    style:{marginTop:'10px',background:'transparent'},
                    html: '<label for="'+c+'-date-start-ymd-'+tp+i+'-'+w+'" class="x-form-item-label">Start:</label>'
                },{
                    xtype: 'datefield'
                    ,anchor: '50%'
                    ,split: true
                    ,columnWidth:.5
                    ,name: tp+'date['+i+'][startymd][]'
                    ,id: c+'-date-start-ymd-'+tp+i+'-'+w
                    ,value: (v)?v.startymd:config.record.startymd
                },{
                    xtype: 'timefield'
                    ,anchor: '50%'
                    ,width:'100%'
                    ,split: true
                    ,columnWidth:.5
                    ,hidden: (v)?v.ad:false
                    ,name: tp+'date['+i+'][starthis][]'
                    ,id: c+'-date-start-his-'+tp+i+'-'+w
                    ,value: (v)?v.starthis:config.record.starthis

                },{
                    columnWidth:1,
                    style:{marginTop:'10px',background:'transparent'},
                    html: '<label for="'+c+'-date-end-ymd-'+tp+i+'-'+w+'" class="x-form-item-label">End:</label>'
                },{
                    xtype: 'datefield'
                    ,anchor: '50%'
                    ,split: true
                    ,columnWidth:.5
                    ,name: tp+'date['+i+'][endymd][]'
                    ,id: c+'-date-end-ymd-'+tp+i+'-'+w
                    ,value: (v)?v.endymd:config.record.endymd
                },{
                    xtype: 'timefield'
                    ,anchor: '50%'
                    ,width:'100%'
                    ,split: true
                    ,columnWidth:.5
                    ,hidden: (v)?v.ad:false
                    ,name: tp+'date['+i+'][endhis][]'
                    ,id: c+'-date-end-his-'+tp+i+'-'+w
                    ,value: (v)?v.endhis:config.record.endhis
                },{
                    xtype:'button'
                    ,text: ('Delete')
                    ,columnWidth:.15
                    ,cls: 'delete-button'
                    ,listeners:{click:{fn:function(tht, value) {
                        Ext.getCmp(c+'-date-id-'+tp+i+'-'+w).setValue('');
                        Ext.getCmp(c+'allday'+tp+i+'-'+w).setValue('');
                        Ext.getCmp(c+'-date-start-ymd-'+tp+i+'-'+w).setValue('');
                        Ext.getCmp(c+'-date-start-his-'+tp+i+'-'+w).setValue('');
                        Ext.getCmp(c+'-date-end-ymd-'+tp+i+'-'+w).setValue('');
                        Ext.getCmp(c+'-date-end-his-'+tp+i+'-'+w).setValue('');
                        Ext.getCmp(c+'-time-set-'+tp+i+'-'+w).destroy();
                    }}}
                }]
            });
        //Ext.getCmp(config.record.id+'-left-col').collapse(false);
        Ext.getCmp(config.record.id+'-left-col').toggleCollapse(false);
            Ext.getCmp(c+'-details-tab').show();
            (!v)?Ext.getCmp(c+'-repeat-tab').show():'';
        Ext.getCmp(config.record.id+'-left-col').toggleCollapse(false);
        }
    Ext.applyIf(config,{
        title: modeTitle+' '+config.record.title
        ,id: config.record.id+'-update-window'
        ,autoHeight: false
        ,height: Ext.getBody().getViewSize().height*.75
        ,width:Ext.getBody().getViewSize().width*.65
        ,autoScroll: false
        ,url: gcCalendar.config.connectorUrl
        ,closeAction:'close'
        ,baseParams: {
            action: (config.record.mode == 'duplicate')?'mgr/gcCalendar/create':'mgr/gcCalendar/update'
        }
        /*),defaults: {
            layout:'form',
            defaultType: 'textfield',
            labelAlign: 'left',
            anchor: '100%',
            labelStyle:'float:left;',
            labelWidth: '100'
        }*/
        ,fields: [{
            layout: 'column',
            defaults: {
                layout: 'form'
            },
            items: [{
                columnWidth: 0.3,
                title: 'Time Information',
                items: [{
                    xtype: 'hidden'
                    ,id: config.record.id+'upid'
                    ,name: 'id'
                    ,value: config.record.id
                },{
                    xtype: 'textfield'
                    ,fieldLabel: _('gcCalendar.title')
                    ,name: 'title'
                    ,anchor:'100%'
                    ,value: config.record.title
                },{
                    xtype: 'checkbox'
                    ,boxLabel: _('gcCalendar.ad')
                    ,name: 'ad'
                    ,id: config.record.id+'allday'
                    ,checked: config.record.ad ? true:false
                    ,listeners: {
                        check:{fn:function(tht, value) {
                            var adFlag = Ext.getCmp(config.record.id+'allday');
                            var ed = Ext.getCmp(config.record.id+'timestart');
                            var sd = Ext.getCmp(config.record.id+'timeend');

                            //Ext.getCmp('cstartdate_fields').label.update(('mxcalendars.startdate_col_label'));

                            if(adFlag.getValue() === true){
                                if(ed.getValue() !== sd.getValue()){
                                    ed.setValue(sd.getValue());
                                }
                                ed.hide();
                                sd.hide();
                            } else {
                                sd.show();
                                ed.show();
                            }
                        }, scope: this}
                    }
                },{
                    fieldLabel: _('gcCalendar.start')
                },{
                    xtype:'container'
                    ,layout: 'column'
                    ,anchor:'100%'
                    ,items:[{
                        xtype: 'datefield'
                        ,anchor: '50%'
                        ,split: true
                        ,columnWidth:.5
                        ,name: 'startymd'
                        ,id: config.record.id+'datestart'
                        ,value: config.record.startymd
                    },{
                        xtype: 'timefield'
                        ,anchor: '50%'
                        ,width:'100%'
                        ,split: true
                        ,columnWidth:.5
                        ,hidden: (config.record.ad)
                        ,name: 'starthis'
                        ,id: config.record.id+'timestart'
                        ,value: config.record.starthis
                    }]
                },{
                    fieldLabel: _('gcCalendar.end'),
                    labelStyle:'margin-top:10px;display: block;margin-bottom: 0;'
                },{
                    xtype:'container'
                    ,layout: 'column'
                    ,anchor:'100%'
                    ,items:[{
                        xtype: 'datefield'
                        ,anchor: '50%'
                        ,split: true
                        ,columnWidth:.5
                        ,name: 'endymd'
                        ,id: config.record.id+'dateend'
                        ,value: config.record.endymd
                    },{
                        xtype: 'timefield'
                        ,anchor: '50%'
                        ,width:'100%'
                        ,split: true
                        ,hidden: (config.record.ad)
                        ,columnWidth:.5
                        ,name: 'endhis'
                        ,id: config.record.id+'timeend'
                        ,value: config.record.endhis
                    }]
                },{
                    xtype: 'superboxselect',
                    displayField: 'title',
                    valueField: 'id',
                    forceSelection: true,labelStyle:'margin-top:10px;display: block;margin-bottom: 0;',
                    store: new Ext.data.JsonStore({
                        root: 'results',
                        idProperty: 'id',
                        url: gcCalendar.config.connectorUrl,
                        baseParams: {
                            action: 'mgr/store/getCals'
                        },
                        fields: [
                            'id', 'title'
                        ]
                    }),
                    mode: 'remote',
                    triggerAction: 'all',
                    fieldLabel: _('gcCalendar.calendar'),
                            hiddenName: 'cid[]',
                    name: 'cid[]',
                    id: config.record.id+'cid',
                    allowBlank: false,
                    typeAhead:true,
                    minChars:1,
                    emptyText:('Select Calendar'),
                    valueNotFoundText:('Calendar Not Found'),
                    anchor:'100%',
                    value: config.record.cid
                },{
                    xtype: 'superboxselect',
                    displayField: 'ctitle',
                    valueField: 'id',
                    forceSelection: true,
                    allowAddNewData: true,
                    addNewDataOnBlur : true,
                    store: new Ext.data.JsonStore({
                        root: 'results',
                        idProperty: 'id',
                        url: gcCalendar.config.connectorUrl,
                        baseParams: {
                            action: 'mgr/store/getCategories'
                        },
                        fields: [
                            {name:'id',type:'int'}, {name:'ctitle',type:'string'}
                        ]
                    }),
                    mode: 'remote',
                    triggerAction: 'all',
                    fieldLabel: _('gcCalendar.category'),
                    name: 'cat[]',
                    hiddenName:'cat[]',
                    id: config.record.id+'cat',
                    allowBlank: false,
                    typeAhead:true,
                    minChars:1,
                    emptyText:('Select Category'),
                    valueNotFoundText:('Category Not Found'),
                    anchor:'100%',
                    value: config.record.cat,
                    listeners: {
                        newitem: function(bs,v, f){
                            v = v +'';
                            v = v.slice(0,1).toUpperCase() + v.slice(1).toLowerCase();
                            var newObj = {
                                ctitle: v
                            };
                            bs.addNewItem(newObj);
                            //console.log(gcCalendar.config.connectorUrl + v);
                            var conurl = gcCalendar.config.connectorUrl;
                            var catData = {
                                ctitle: v
                                ,HTTP_MODAUTH: MODx.siteId
                                ,action: 'mgr/gcCalendar/createCats'
                            };


                            Ext.Ajax.request({
                                url: conurl,
                                params: catData,
                                scope: this,
                                success: function(response, opts){
                                    //console.log('Success.');
                                },
                                failure: function(response, opts) {
                                    //console.log('Failure.');
                                }
                            });
                        }
                    }
                }]
            },{
                columnWidth: 0.7,
                items: [{
                    xtype: 'modx-tabs',
                    defaults: {
                        border: false,
                        autoHeight: true ,
                        layout: 'form',
                    },
                    border: true,
                    autoHeight: true,
                    activeTab: 0,
                    items: [{
                        title: 'Details',
                        id: config.record.id+'-details-tab',
                        items:[{
                            xtype: 'hidden'
                            ,name: 'previmage'
                            ,id:config.record.id+'update-image'
                            ,value: config.record.previmage

                        },{
                            fieldLabel: ('Image')
                        },{
                            xtype:'box'
                            ,id: config.record.id+'photoPreview'
                            ,anchor: 0
                            ,hidden: (!config.record.previmage)
                            ,autoEl: {
                                tag: 'img', src: config.record.previmage, style:{height:'175px'}
                            }
                        },{
                            xtype:'container'
                            ,layout: 'column'
                            ,anchor:'95%'
                            ,items:[{
                                xtype:'button'
                                ,anchor: '50%'
                                ,id: config.record.id+'update-image-button'
                                ,columnWidth:.5
                                ,split:true
                                ,cls: 'x-btn-text bmenu'
                                ,style: { marginBottom: '15px'}
                                ,disabled: false
                                ,text: "Browse Images"
                                ,listeners: {
                                    'click':{
                                        fn: function(btn) {
                                            if (Ext.isEmpty(this.browser)) {
                                                this.browser = MODx.load({
                                                    xtype: 'modx-browser'
                                                    ,returnEl: null
                                                    ,id: config.record.id+'update-image-browser'+config.record.window
                                                    ,multiple: true
                                                    ,config: MODx.config
                                                    ,source: MODx.config.default_media_source || MODx.source
                                                    ,allowedFileTypes: 'gif,jpg,jpeg,png'
                                                    ,listeners: {
                                                        'select': {fn: function(data) {
                                                            Ext.getCmp(config.record.id+'update-image').setValue('/'+data.fullRelativeUrl);
                                                            Ext.getCmp(config.record.id+'photoPreview').el.dom.src= '/'+data.fullRelativeUrl;
                                                            Ext.getCmp(config.record.id+'photoPreview').show();
                                                            Ext.getCmp(config.record.id+'update-photo-remove').show();
                                                            Ext.getCmp(config.record.id+'-details-tab').show();
                                                            //alert(Ext.encode(data));
                                                        },scope:this}
                                                    }
                                                });
                                            }
                                            this.browser.show(btn);
                                            return true;
                                        }
                                        ,scope:this
                                    }
                                }
                            },{
                                xtype:'button'
                                ,anchor: '50%'
                                ,hidden: (!config.record.previmage)
                                ,columnWidth:.5
                                ,split:true
                                ,id: config.record.id+'update-photo-remove'
                                ,cls: 'x-btn-text bmenu'
                                ,style: { marginBottom: '15px'}
                                ,disabled: false
                                ,text: "Clear Image"
                                ,listeners: {
                                    'click':{
                                        fn: function(btn) {
                                            Ext.getCmp(config.record.id+'update-image').setValue('');
                                            Ext.getCmp(config.record.id+'photoPreview').el.dom.src= '';
                                            Ext.getCmp(config.record.id+'photoPreview').hide();
                                            Ext.getCmp(config.record.id+'update-photo-remove').hide();
                                            Ext.getCmp(config.record.id+'-details-tab').show();

                                            return true;
                                        }
                                        ,scope:this
                                    }
                                }
                            }]
                        },{
                            xtype: 'textfield'
                            ,fieldLabel: _('gcCalendar.url')
                            ,name: 'link'
                            ,anchor: '95%'
                            ,value: config.record.link
                        },{
                            fieldLabel: _('gcCalendar.notes')
                            ,xtype: 'textarea'
                            ,name: 'notes'
                            ,id: config.record.id+'-notes-'+config.record.window
                            ,anchor: '95%'
                            ,value: config.record.notes
                        }]
                    },{
                        title: 'Location',
                        id: config.record.id+'-location-tab',
                        items:[{
                            xtype: 'panel',
                            layout: 'form',
                            border: false,
                            defaults: {
                                // applied to each contained item
                                // nothing this time
                                anchor:'100%'
                                ,layout: 'form'
                                ,labelWidth: '100'
                                ,cellCls: 'valign-center'

                            },
                            anchor: '95%',
                            autoHeight: true,
                            items: [{
                                fieldLabel:('Contact Name'),
                                xtype:'textfield',
                                name:'locationcontact',
                                value:config.record.locationcontact
                            },{
                                fieldLabel:('Contact Phone'),
                                xtype:'textfield',
                                name:'locationphone',
                                value:config.record.locationphone
                            },{
                                fieldLabel:('Contact Email'),
                                xtype:'textfield',
                                name:'locationemail',
                                vtype:'email',
                                value:config.record.locationemail
                            },{
                                fieldLabel:('Location Name'),
                                xtype:'textfield',
                                name:'locationname',
                                value:config.record.locationname
                            },{
                                fieldLabel:('Address'),
                                xtype:'textfield',
                                name:'locationaddr',
                                value:config.record.locationaddr
                            },{
                                layout:'column',
                                border: false,
                                defaults: {
                                   // applied to each contained item
                                   // nothing this time
                                    anchor:'100%'
                                    ,layout: 'form'
                                    ,labelWidth: '100'
                                    ,cellCls: 'valign-left'
                                },
                                anchor: '100%',
                                autoHeight: true,
                                style:{marginTop:'15px'},
                                items:[{
                                    split:true,
                                    columnWidth:.5,
                                    html:'<label class="x-form-item-label">City</label>'
                                },{
                                    split:true,
                                    columnWidth:.2,
                                    html:'<label class="x-form-item-label">State</label>'
                                },{
                                    split:true,
                                    html:'<label class="x-form-item-label">Zip</label>'
                                },{
                                    split:true,
                                    columnWidth:.5,
                                    xtype:'textfield',
                                    name:'locationcity',
                                    value:config.record.locationcity
                                },{
                                    split:true,
                                    columnWidth:.2,
                                    xtype:'textfield',
                                    name:'locationstate',
                                    value:config.record.locationstate
                                },{
                                    split:true,
                                    columnWidth:.3,
                                    xtype:'textfield',
                                    name:'locationzip',
                                    value:config.record.locationzip
                                }]
                            }]
                        }]
                    },{
                        title: 'Repeating',
                        id: config.record.id+'-repeat-tab',
                        items:[{
                            xtype: 'panel',
                            layout: 'form',
                            border: false,
                            defaults: {
                                // applied to each contained item
                                // nothing this time
                                anchor:'100%'
                                ,layout: 'form'
                                ,labelWidth: '100'
                                ,cellCls: 'valign-center'

                            },
                            anchor: '95%',
                            autoHeight: true,
                            items: [{
                                xtype:'fieldset',
                                checkboxToggle:true,
                                title: ('Is a Repeating Event'),
                                defaultType: 'textfield',
                                collapsed: (config.record.repeating!=1),
                                autoHeight: true,
                                defaults: {
                                    layout:'fill'
                                },
                                listeners: {
                                    'beforecollapse' :  function(panel,ani) {
                                        // Hide all the form fields you need to hide
                                        Ext.getCmp('urepeating-'+config.record.id).setValue('false');
                                        return true; // this will avoid collapse of the field set
                                    },
                                    'beforeexpand' : function(panel,ani) {
                                        // Display all the fields
                                        Ext.getCmp('urepeating-'+config.record.id).setValue('true');
                                        return true; // this will avoid the default expand behaviour
                                    }
                                },
                                layout: 'form',
                                items :[
                                    {name: 'repeating',id: 'urepeating-'+config.record.id,xtype:'hidden',value:config.record.repeating},{
                                    fieldLabel: 'Occurs'
                                    ,name: 'repeattype'
                                    ,id: 'urepeattype-'+config.record.id
                                    ,xtype:'combo'
                                    ,mode: 'local'
                                    ,store: new Ext.data.ArrayStore({
                                        id: 0,
                                        fields: ['v', 'measure'],
                                        data: [[0, ('Daily')],[1, ('Weekly')],[2, ('Monthly')],[3, ('Yearly')]]
                                    })
                                    ,triggerAction: 'all'
                                    ,displayField: 'measure'
                                    ,valueField: 'v'
                                    ,editable: true
                                    ,width: 150
                                    ,layout:'anchor'
                                    ,anchor: '100%'
                                    ,value: config.record.repeattype
                                    ,listeners:{
                                            select:{fn:function( x, r, i ) {
                                                Ext.getCmp(config.record.id+'-urepeattype').setValue(r.id);
                                                var rt = Ext.getCmp('urepeattype-'+config.record.id);
                                                if(rt.getValue() === 1){
                                                    Ext.getCmp('urepeaton-'+config.record.id).show().setWidth('100%').syncSize();;
                                                    Ext.getCmp('urepeatonmo-'+config.record.id).hide();
                                                    Ext.getCmp(config.record.id+'-urepeatonmow').hide();
                                                } else if(rt.getValue() === 2){
                                                    Ext.getCmp('urepeatonmo-'+config.record.id).show().setWidth('100%').syncSize();
                                                    Ext.getCmp('urepeaton-'+config.record.id).hide();
                                                } else { Ext.getCmp('urepeaton-'+config.record.id).hide(); Ext.getCmp('urepeatonmo-'+config.record.id).hide(); Ext.getCmp(config.record.id+'-urepeatonmow').hide();}
                                    }}
                                    }
                                },{
                                    xtype: 'hidden',
                                    name: 'repeattype',
                                    id: config.record.id+'-urepeattype'
                                    ,value: config.record.repeattype
                                },{
                                    fieldLabel: ('Repeat On')
                                    ,name: 'repeaton'
                                    ,id: 'urepeaton-'+config.record.id
                                    ,xtype: 'checkboxgroup'
                                    ,anchor: '100%'
                                    ,width:  '100%'
                                    ,hidden: config.record.repeattype == 1 ? false : true // hide on load
                                    ,items: [
                                            {boxLabel: ('Sun'), name: 'cb-auto-1', value: 0, checked: (config.record.repeattype==1)?!!(config.record.repeatonc.indexOf(',0,')!=-1):false},
                                            {boxLabel: ('Mon'), name: 'cb-auto-2', value: 1, checked: (config.record.repeattype==1)?!!(config.record.repeatonc.indexOf(',1,')!=-1):false },
                                            {boxLabel: ('Tues'), name: 'cb-auto-3', value: 2, checked: (config.record.repeattype==1)?!!(config.record.repeatonc.indexOf(',2,')!=-1):false},
                                            {boxLabel: ('Wed'), name: 'cb-auto-4', value: 3, checked: (config.record.repeattype==1)?!!(config.record.repeatonc.indexOf(',3,')!=-1):false},
                                            {boxLabel: ('Thurs'), name: 'cb-auto-5', value: 4, checked: (config.record.repeattype==1)?!!(config.record.repeatonc.indexOf(',4,')!=-1):false},
                                            {boxLabel: ('Fri'), name: 'cb-auto-6', value: 5, checked: (config.record.repeattype==1)?!!(config.record.repeatonc.indexOf(',5,')!=-1):false},
                                            {boxLabel: ('Sat'), name: 'cb-auto-7', value: 6, checked: (config.record.repeattype==1)?!!(config.record.repeatonc.indexOf(',6,')!=-1):false}
                                    ]

                                    ,listeners: {
                                            change:{fn:function(t,c){
                                                val = new Array;
                                                for (var i in c) {
                                                    if(c[i]['value'] || c[i]['value']==0)
                                                        val.push(c[i]['value']);
                                                }
                                                var flat = val.join();
                                                Ext.getCmp(config.record.id+'-urepeaton').setValue(flat);
                                            }}
                                        }
                                },{
                                    xtype: 'hidden',
                                    name: 'repeaton',
                                    id: config.record.id+'-urepeaton',
                                    value: config.record.repeaton
                                },{

                                    xtype: 'combo',
                                    displayField: 'n',
                                    valueField: 't',
                                    mode: 'local',
                                    store: new Ext.data.ArrayStore({
                                        id: 0,
                                        fields: ['t','n'],
                                        data: [['dom','Day of Month'],['dow','Day of Week']]
                                    }),
                                    triggerAction: 'all',
                                    fieldLabel: ('Repeat On'),
                                    name: 'repeatonmo[type]',
                                    hiddenName: 'repeatonmo[type]',
                                    id: 'urepeatonmo-'+config.record.id,
                                    value: config.record.repeatonmo.type,
                                    typeAhead:true,
                                    minChars:1,
                                    hidden: config.record.repeattype == 2 ? false : true,
                                    emptyText:('Repeat On'),
                                    valueNotFoundText:('Repeat On'),
                                    anchor:'100%',
                                    width:  '100%',
                                    listeners: {
                                        'change': {fn:function(t,n,o){
                                            var dow = Ext.getCmp(config.record.id+'-urepeatonmow');
                                            if(n == 'dom'){dow.setValue('');dow.hide();}
                                            else{dow.show().setWidth('100%').syncSize();}
                                        }}
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

                                    xtype: 'combo',
                                    displayField: 'n',
                                    valueField: 't',
                                    mode: 'local',
                                    store: new Ext.data.ArrayStore({
                                        id: 0,
                                        fields: ['t','n'],
                                        data: [['first','First Week'],['second','Second Week'],['third','Third Week'],['fourth','Fourth Week'],['last','Last Week']]
                                    }),
                                    triggerAction: 'all',
                                    fieldLabel: ('Repeat Week'),
                                    name: 'repeatonmo[week]',
                                    hiddenName: 'repeatonmo[week]',
                                    id: config.record.id+'-urepeatonmow',
                                    value: config.record.repeatonmo.week,
                                    typeAhead:true,
                                    minChars:1,
                                    hidden: config.record.repeatonmo.type == 'dow' ? false : true,
                                    emptyText:('Repeat Week'),
                                    valueNotFoundText:('Repeat Week'),
                                    anchor:'100%',
                                    width:  '100%'
                                },{
                                    fieldLabel: ('Repeat Frequency')
                                    ,name: 'repeatfrequency'
                                    ,id: 'urepeatfrequency-'+config.record.id
                                    ,xtype: 'combo'
                                    ,mode: 'local'
                                    ,store: new Ext.data.ArrayStore({
                                        id: 0,
                                        fields: ['counter'],
                                        data: [[1],[2],[3],[4],[5],[6],[7],[8],[9],[10],[11],[12],[13],[14],[15],[16],[17],[18],[19],[20],[21],[22],[23],[24],[25],[26],[27],[28],[29],[30]]
                                    })
                                    ,displayField: 'counter'
                                    ,valueField: 'counter'
                                    ,editable: true
                                    ,width: 50
                                    ,layout:'anchor'
                                    ,anchor: '100%'
                                    ,value: config.record.repeatfrequency

                                },{
                                    fieldLabel: ('Last Occurance')
                                    ,name: 'repeatenddate'
                                    ,id: 'urepeatenddate-'+config.record.id
                                    ,width:120
                                    ,layout:'anchor'
                                    ,anchor: '100%'
                                    ,xtype: 'datefield'
                                    ,value: config.record.repeatenddate
                                    ,submitValue: true
                                }]
                            }]
                        }]
                    },{
                        title: 'Custom Dates',
                        id: config.record.id+'-custom-tab',
                        items:[{
                            xtype: 'panel',
                            layout: 'form',
                            border: false,
                            defaults: {
                                // applied to each contained item
                                // nothing this time
                                anchor:'100%'
                                ,layout: 'form'
                                ,labelWidth: '100'
                                ,cellCls: 'valign-center'

                            },
                            anchor: '95%',
                            autoHeight: true,
                            items: [{
                                name: 'ov'
                                ,id: 'ucustom-'+config.record.id
                                ,xtype:'hidden'
                                ,submitValue:true
                                ,value:config.record.ov
                            },{
                                xtype: 'gcCalendar-grid-images',
                                evid: config.record.id

                            }]
                        }]
                    }]
                }]
            }]
        }]
    });
    gcCalendar.window.UpdategcCalendar.superclass.constructor.call(this,config);
    this.on('afterrender',function() {
        MODx.loadRTE(config.record.id+'-notes-'+config.record.window);
        Ext.getCmp(config.record.id+'-location-tab').show();
        Ext.getCmp(config.record.id+'-repeat-tab').show();
        Ext.getCmp(config.record.id+'-custom-tab').show();
        Ext.getCmp(config.record.id+'-details-tab').show();
        var w = this.getWidth()+2; this.setWidth(w);
    });
    this.on('close',function() {

    });
};
Ext.extend(gcCalendar.window.UpdategcCalendar,MODx.Window);

Ext.reg('gcCalendar-window-gcCalendar-update',gcCalendar.window.UpdategcCalendar);

gcCalendar.window.CreategcCalendar = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        title: _('gcCalendar.gcCalendar_create')
        ,autoHeight: false
        ,height: Ext.getBody().getViewSize().height*.75
        ,width:Ext.getBody().getViewSize().width*.65
        ,autoScroll: false
        ,url: gcCalendar.config.connectorUrl
        ,xtype: 'form'
        ,layout: 'fit'
        ,closeAction:'close'
        ,anchor:'100%'
        ,plain: true
        ,baseParams: {
            action: 'mgr/gcCalendar/create'
        }
        ,defaults: {
            layout:'form',
            defaultType: 'textfield',
            labelAlign: 'left',
            anchor: '100%',
            labelStyle:'float:left;',
            labelWidth: '100'
        }
        ,fields: [{
            xtype: 'container',
            layout: 'border',
            plain: true,
            autoHeight: false,
            autoScroll:true,
            anchor:'100%',
            height: '100%',
            items: [{


                id: 'create-left-col',
                xtype:'panel',
                margins:'3 3 3 0',
                region: 'west',
                width: 350,
                split: false,
                collapsible: true,
                autoHeight: false,
                autoScroll: true,
                height:"100%",
                style:{borderRight:'1px solid #c3c3c3'},
                title: 'Time Information',
                items: [{
                    xtype:'container',
                    layout:'column',
                    border: false,
                    defaults: {
                        // applied to each contained item
                        // nothing this time
                        anchor:'100%'
                        ,layout: 'form'
                        ,labelWidth: '100'
                        ,cellCls: 'valign-center'

                    },
                    anchor: '95%',
                    autoHeight: true,
                    style:{marginTop:'15px',paddingLeft:'10px'},
                    items: [{
                        split:false,
                        columnWidth: 1,
                        items: [
                            {
                                xtype: 'textfield'
                                ,fieldLabel: _('gcCalendar.title')
                                ,name: 'title'
                                ,anchor:'100%'
                            },{
                                xtype: 'checkbox'
                                ,labelStyle:'float:left;'
                                ,fieldLabel: _('gcCalendar.ad')
                                ,name: 'ad'
                                ,id: 'createallday'
                                ,checked: false
                                ,listeners:{check:{fn:function(tht, value) {

                                    var adFlag = Ext.getCmp('createallday');
                                    var ed = Ext.getCmp('createtimestart');
                                    var sd = Ext.getCmp('createtimeend');

                                    //Ext.getCmp('cstartdate_fields').label.update(('mxcalendars.startdate_col_label'));

                                    if(adFlag.getValue() === true){
                                        if(ed.getValue() !== sd.getValue()){
                                            ed.setValue(sd.getValue());
                                        }
                                        ed.hide();
                                        sd.hide();
                                    } else {
                                        sd.show();
                                        ed.show();
                                    }
                                }
                                }}},{fieldLabel: _('gcCalendar.start')},{
                                xtype:'container'
                                ,layout: 'column'
                                ,anchor:'100%'
                                ,items:[{
                                    xtype: 'datefield'
                                    ,anchor: '50%'
                                    ,split: true
                                    ,minValue : (new Date()).clearTime()
                                    ,columnWidth:.5
                                    ,name: 'startymd'
                                    ,id: 'createdatestart'
                                    ,listeners: {
                                       'change':{fn:function(e,nv,ov){
                                            var ed = Ext.getCmp('createdateend');
                                            console.log('ED:'+ed.getValue());
                                            if(ed.getValue() == ""){
                                                ed.setValue(nv);
                                                }
                                            }
                                        }
                                    }
                                },{
                                    xtype: 'timefield'
                                    ,anchor: '50%'
                                    ,width:'100%'
                                    ,split: true
                                    ,columnWidth:.5
                                    ,hidden: false
                                    ,name: 'starthis'
                                    ,id: 'createtimestart'
                                }]
                            },{fieldLabel: _('gcCalendar.end'),labelStyle:'margin-top:10px;display: block;margin-bottom: 0;'},{
                                xtype:'container'
                                ,layout: 'column'
                                ,anchor:'100%'
                                ,items:[{
                                    xtype: 'datefield'
                                    ,minValue : (new Date()).clearTime()
                                    ,anchor: '50%'
                                    ,split: true
                                    ,columnWidth:.5
                                    ,name: 'endymd'
                                    ,id: 'createdateend'
                                },{
                                    xtype: 'timefield'
                                    ,anchor: '50%'
                                    ,width:'100%'
                                    ,split: true
                                    ,hidden: false
                                    ,columnWidth:.5
                                    ,name: 'endhis'
                                    ,id: 'createtimeend'
                                }]
                            },{
                                xtype: 'superboxselect',
                                displayField: 'title',
                                valueField: 'id',
                                forceSelection: true,labelStyle:'margin-top:10px;display: block;margin-bottom: 0;',
                                store: new Ext.data.JsonStore({
                                    root: 'results',
                                    idProperty: 'id',
                                    url: gcCalendar.config.connectorUrl,
                                    baseParams: {
                                        action: 'mgr/store/getCals'
                                    },
                                    fields: [
                                        'id', 'title'
                                    ]
                                }),
                                mode: 'remote',
                                triggerAction: 'all',
                                fieldLabel: _('gcCalendar.calendar'),
                                name: 'cid[]',
                                hiddenName:'cid[]',
                                id: 'createcid',
                                allowBlank: false,
                                typeAhead:true,
                                minChars:1,
                                emptyText:('Select Calendar'),
                                valueNotFoundText:('Calendar Not Found'),
                                anchor:'100%'

                            },{
                                xtype: 'superboxselect',
                                displayField: 'ctitle',
                                valueField: 'id',
                                forceSelection: true,
                                allowAddNewData: true,
                                addNewDataOnBlur : true,
                                store: new Ext.data.JsonStore({
                                    root: 'results',
                                    idProperty: 'id',
                                    url: gcCalendar.config.connectorUrl,
                                    baseParams: {
                                        action: 'mgr/store/getCategories'
                                    },
                                    fields: [
                                        {name:'id',type:'int'}, {name:'ctitle',type:'string'}
                                    ]
                                }),
                                mode: 'remote',
                                triggerAction: 'all',
                                fieldLabel: _('gcCalendar.category'),
                                name: 'cat[]',
                                hiddenName:'cat[]',
                                id: 'createcat',
                                allowBlank: false,
                                typeAhead:true,
                                minChars:1,
                                emptyText:('Select Category'),
                                valueNotFoundText:('Category Not Found'),
                                anchor:'100%',
                                listeners: {
                                    newitem: function(bs,v, f){
                                        v = v +'';
                                        v = v.slice(0,1).toUpperCase() + v.slice(1).toLowerCase();
                                        var newObj = {
                                            ctitle: v
                                        };
                                        bs.addNewItem(newObj);
                                        //console.log(gcCalendar.config.connectorUrl + v);
                                        var conurl = gcCalendar.config.connectorUrl;
                                        var catData = {
                                            ctitle: v
                                            ,HTTP_MODAUTH: MODx.siteId
                                            ,action: 'mgr/gcCalendar/createCats'
                                        };


                                        Ext.Ajax.request({
                                            url: conurl,
                                            params: catData,
                                            scope: this,
                                            success: function(response, opts){
                                                //console.log('Success.');
                                            },
                                            failure: function(response, opts) {
                                                //console.log('Failure.');
                                            }
                                        });
                                    }
                                }

                            }]
                    }]}]
            },{
                xtype: 'tabpanel',
                region: 'center',
                defaults: { border: false ,autoHeight: true },
                border: true,
                anchor: '95%',
                autoHeight: true,
                margins:'3 3 3 0',
                padding:'5px',
                activeTab: 0,
                items: [{

                    title: 'Details',
                    id: 'create-details-tab',
                    items:[{
                        xtype: 'panel',
                        layout: 'form',
                        border: false,
                        defaults: {
                            // applied to each contained item
                            // nothing this time
                            anchor:'100%'
                            ,layout: 'form'
                            ,labelWidth: '100'
                            ,cellCls: 'valign-center'

                        },
                        anchor: '95%',
                        autoHeight: true,
                        items: [{
                            xtype: 'hidden'
                            ,name: 'previmage'
                            ,id:'createupdate-image'

                        },{fieldLabel: ('Image')},{
                            xtype:'box'
                            ,id: 'createphotoPreview'
                            ,anchor: 0
                            ,hidden: true
                            ,autoEl: {
                                tag: 'img', src: '', style:{height:'175px'}
                            }
                        },{
                            xtype:'container'
                            ,layout: 'column'
                            ,anchor:'95%'
                            ,items:[{
                                xtype:'button'
                                ,anchor: '50%'
                                ,id: 'createupdate-image-button'
                                ,columnWidth:.5
                                ,split:true
                                ,cls: 'x-btn-text bmenu'
                                ,style: { marginBottom: '15px'}
                                ,disabled: false
                                ,text: "Browse Images"
                                ,listeners: {
                                    'click':{
                                        fn: function(btn) {
                                            if (Ext.isEmpty(this.browser)) {
                                                this.browser = MODx.load({
                                                    xtype: 'modx-browser'
                                                    ,returnEl: null
                                                    ,id: 'createupdate-image-browser'
                                                    ,multiple: true
                                                    ,config: MODx.config
                                                    ,source: MODx.config.default_media_source || MODx.source
                                                    ,allowedFileTypes: 'gif,jpg,jpeg,png'
                                                    ,listeners: {
                                                        'select': {fn: function(data) {
                                                            Ext.getCmp('createupdate-image').setValue('/'+data.fullRelativeUrl);
                                                            Ext.getCmp('createphotoPreview').el.dom.src= '/'+data.fullRelativeUrl;
                                                            Ext.getCmp('createphotoPreview').show();
                                                            Ext.getCmp('createupdate-photo-remove').show();
                                                            Ext.getCmp('create-details-tab').show();
                                                            //alert(Ext.encode(data));
                                                        },scope:this}
                                                    }
                                                });
                                            }
                                            this.browser.show(btn);
                                            return true;
                                        }
                                        ,scope:this
                                    }
                                }
                            },{
                                xtype:'button'
                                ,anchor: '50%'
                                ,hidden: true
                                ,columnWidth:.5
                                ,split:true
                                ,id: 'createupdate-photo-remove'
                                ,cls: 'x-btn-text bmenu'
                                ,style: { marginBottom: '15px'}
                                ,disabled: false
                                ,text: "Clear Image"
                                ,listeners: {
                                    'click':{
                                        fn: function(btn) {
                                            Ext.getCmp('createupdate-image').setValue('');
                                            Ext.getCmp('createphotoPreview').el.dom.src= '';
                                            Ext.getCmp('createphotoPreview').hide();
                                            Ext.getCmp('createupdate-photo-remove').hide();
                                            Ext.getCmp('create-details-tab').show();

                                            return true;
                                        }
                                        ,scope:this
                                    }
                                }
                            }]},{
                            xtype: 'textfield'

                            ,fieldLabel: _('gcCalendar.url')
                            ,name: 'link'
                            ,anchor: '95%'
                        },{
                            fieldLabel: _('gcCalendar.notes')
                            ,xtype: 'textarea'
                            ,name: 'notes'
                            ,id: 'create-notes'+config.record.window
                            ,anchor: '95%'
                        }]

                    }]
                },{ title: 'Location',
                    id: 'create-location-tab',
                    items:[{
                        xtype: 'panel',
                        layout: 'form',
                        border: false,
                        defaults: {
                            // applied to each contained item
                            // nothing this time
                            anchor:'100%'
                            ,layout: 'form'
                            ,labelWidth: '100'
                            ,cellCls: 'valign-center'

                        },
                        anchor: '95%',
                        autoHeight: true,
                        items: [{
                            fieldLabel:('Contact Name'),
                            xtype:'textfield',
                            name:'locationcontact'
                        },
                            {
                                fieldLabel:('Contact Phone'),
                                xtype:'textfield',
                                name:'locationphone'
                            },
                            {
                                fieldLabel:('Contact Email'),
                                xtype:'textfield',
                                name:'locationemail',
                                vtype:'email'
                            },
                            {
                                fieldLabel:('Location Name'),
                                xtype:'textfield',
                                name:'locationname'
                            },
                            {
                                fieldLabel:('Address'),
                                xtype:'textfield',
                                name:'locationaddr'
                            },
                            {xtype:'container',
                                layout:'column',
                                border: false,
                                defaults: {
                                    // applied to each contained item
                                    // nothing this time
                                    anchor:'100%'
                                    ,layout: 'form'
                                    ,labelWidth: '100'
                                    ,cellCls: 'valign-left'

                                },
                                anchor: '100%',
                                autoHeight: true,
                                style:{marginTop:'15px'},
                                items:[{
                                    split:true,
                                    columnWidth:.5,
                                    html:'<label class="x-form-item-label">City</label>'
                                },{
                                    split:true,
                                    columnWidth:.2,
                                    html:'<label class="x-form-item-label">State</label>'
                                },{
                                    split:true,
                                    html:'<label class="x-form-item-label">Zip</label>'
                                },{
                                    split:true,
                                    columnWidth:.5,
                                    xtype:'textfield',
                                    name:'locationcity'
                                },{
                                    split:true,
                                    columnWidth:.2,
                                    xtype:'textfield',
                                    name:'locationstate'
                                },{
                                    split:true,
                                    columnWidth:.3,
                                    xtype:'textfield',
                                    name:'locationzip'
                                }]
                            }]
                    }]

                }/*,{ title: 'Repeating',
                    id: 'create-repeat-tab',
                    items:[{
                        xtype: 'panel',
                        layout: 'form',
                        border: false,
                        defaults: {
                            // applied to each contained item
                            // nothing this time
                            anchor:'100%'
                            ,layout: 'form'
                            ,labelWidth: '100'
                            ,cellCls: 'valign-center'

                        },
                        anchor: '95%',
                        autoHeight: true,
                        items: [{
                            xtype:'fieldset',
                            checkboxToggle:true,
                            title: ('Is a Repeating Event'),
                            defaultType: 'textfield',
                            collapsed: true,
                            autoHeight: true,
                            defaults: {
                                layout:'fill'
                            },
                            listeners: {
                                'beforecollapse' :  function(panel,ani) {
                                    // Hide all the form fields you need to hide 
                                    Ext.getCmp('crepeating').setValue(0);
                                    return true; // this will avoid collapse of the field set
                                },
                                'beforeexpand' : function(panel,ani) {
                                    // Display all the fields
                                    Ext.getCmp('crepeating').setValue(1);
                                    return true; // this will avoid the default expand behaviour
                                }
                            },
                            layout: 'form',
                            items :[
                                {
                                    name: 'repeating',
                                    id: 'crepeating',
                                    xtype:'hidden'
                                },{
                                    fieldLabel: 'Occurs'
                                    ,name: 'repeattype'
                                    ,id: 'crepeattype'
                                    ,xtype:'combo'
                                    ,mode: 'local'
                                    ,store: new Ext.data.ArrayStore({
                                        id: 0,
                                        fields: ['v', 'measure'],
                                        data: [[0, ('Daily')],[1, ('Weekly')],[2, ('Monthly')],[3, ('Yearly')]]
                                    })
                                    ,triggerAction: 'all'
                                    ,displayField: 'measure'
                                    ,valueField: 'v'
                                    ,editable: true
                                    ,width: 150
                                    ,layout:'anchor'
                                    ,anchor: '100%'
                                    ,listeners:{select:{fn:function( x, r, i ) {
                                        Ext.getCmp('crepeattypev').setValue(r.id);
                                        console.log(r)
                                        if(r.id === 1){
                                            Ext.getCmp('crepeaton').show();
                                        } else { Ext.getCmp('crepeaton').hide(); }
                                    }}
                                    }
                                },{
                                    xtype: 'hidden',
                                    name: 'repeattype',
                                    id: 'crepeattypev'
                                },{
                                    fieldLabel: ('Repeat On')
                                    ,name: 'repeaton'
                                    ,id: 'crepeaton'
                                    ,xtype: 'checkboxgroup'
                                    ,hidden: true // hide on load
                                    ,items: [
                                        {boxLabel: ('Sun'), name: 'cb-auto-1', value: -1, checked: false },
                                        {boxLabel: ('Mon'), name: 'cb-auto-2', value: 0, checked: false },
                                        {boxLabel: ('Tues'), name: 'cb-auto-3', value: 1, checked: false },
                                        {boxLabel: ('Wed'), name: 'cb-auto-4', value: 2, checked: false },
                                        {boxLabel: ('Thurs'), name: 'cb-auto-5', value: 3, checked: false },
                                        {boxLabel: ('Fri'), name: 'cb-auto-6', value: 4, checked: false },
                                        {boxLabel: ('Sat'), name: 'cb-auto-7', value: 5, checked:false}
                                    ]

                                    ,listeners: {
                                        change:{fn:function(t,c){
                                            val = new Array;
                                            for (var i in c) {
                                                if(c[i]['value'] || c[i]['value']==0)
                                                    val.push(c[i]['value']);
                                            }
                                            var flat = val.join();
                                            Ext.getCmp('crepeaton').setValue(flat);
                                            console.log(flat)
                                        }}
                                    }
                                },{
                                    xtype: 'hidden',
                                    name: 'repeaton',
                                    id: 'crepeatonv'
                                },{
                                    fieldLabel: ('Repeat On')
                                    ,name: 'repeaton'
                                    ,id: 'crepeaton'
                                    ,xtype: 'checkboxgroup'
                                    ,hidden: true // hide on load
                                    ,items: [
                                            {boxLabel: ('Sun'), name: 'cb-auto-1', value: -1, checked: false},
                                            {boxLabel: ('Mon'), name: 'cb-auto-2', value: 0, checked:false },
                                            {boxLabel: ('Tues'), name: 'cb-auto-3', value: 1, checked:false},
                                            {boxLabel: ('Wed'), name: 'cb-auto-4', value: 2, checked:false},
                                            {boxLabel: ('Thurs'), name: 'cb-auto-5', value: 3, checked:false},
                                            {boxLabel: ('Fri'), name: 'cb-auto-6', value: 4, checked:false},
                                            {boxLabel: ('Sat'), name: 'cb-auto-7', value: 5, checked:false}
                                    ]

                                    ,listeners: {
                                            change:{fn:function(t,c){
                                                val = new Array;
                                                for (var i in c) {
                                                    if(c[i]['value'] || c[i]['value']==0)
                                                        val.push(c[i]['value']);
                                                }
                                                var flat = val.join();
                                                Ext.getCmp('crepeatonv').setValue(flat);
                                                console.log(flat)
                                            }}
                                        }
                                },{
                                    fieldLabel: ('Repeat Frequency')
                                    ,name: 'repeatfrequency'
                                    ,id: 'crepeatfrequency'
                                    ,xtype: 'combo'
                                    ,mode: 'local'
                                    ,store: new Ext.data.ArrayStore({
                                        id: 0,
                                        fields: ['counter'],
                                        data: [[1],[2],[3],[4],[5],[6],[7],[8],[9],[10],[11],[12],[13],[14],[15],[16],[17],[18],[19],[20],[21],[22],[23],[24],[25],[26],[27],[28],[29],[30]]
                                    })
                                    ,displayField: 'counter'
                                    ,valueField: 'counter'
                                    ,editable: true
                                    ,width: 50
                                    ,layout:'anchor'
                                    ,anchor: '100%'

                                },{
                                    fieldLabel: ('Last Occurance')
                                    ,name: 'repeatenddate'
                                    ,id: 'crepeatenddate'
                                    ,minValue : (new Date()).clearTime()
                                    ,width:120
                                    ,layout:'anchor'
                                    ,anchor: '100%'
                                    ,allowBlank:true
                                    ,xtype: 'datefield'
                                    ,submitValue: true
                                }]
                        }]
                    }]

                }*/]
            }]}]
    });
    gcCalendar.window.CreategcCalendar.superclass.constructor.call(this,config);
    this.on('afterrender',function() {
        MODx.loadRTE('create-notes'+config.record.window);
        //get rid of scroll bars
        var w = this.getWidth()+2;
        this.setWidth(w);
    });
};
Ext.extend(gcCalendar.window.CreategcCalendar,MODx.Window);
Ext.reg('gcCalendar-window-gcCalendar-create',gcCalendar.window.CreategcCalendar);

