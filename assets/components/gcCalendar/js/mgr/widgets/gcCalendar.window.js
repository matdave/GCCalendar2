/**
 * Created by video2 on 8/20/15.
 */
gcCalendar.window.UpdategcCalendar = function(config) {

    config = config || {};
    var modeTitle = (config.record.mode == 'duplicate')?'Duplicate '+config.record.title:(config.record.mode == 'update')?'Update '+config.record.title:'New Calendar Event';
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
                anchor:'100%'
                ,labelWidth: '100'
                ,cellCls: 'valign-center'

            }
            ,items:[{
                xtype:'hidden'
                ,name:tp+'date['+i+'][ogid][]'
                ,value:(v)?v.id:''
                ,id:c+'-date-id-'+tp+i+'-'+w
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
                columnWidth:1
                ,style:{marginTop:'10px',background:'transparent'}
                ,html: '<label for="'+c+'-date-start-ymd-'+tp+i+'-'+w+'" class="x-form-item-label">Start:</label>'
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
                columnWidth:1
                ,style:{marginTop:'10px',background:'transparent'}
                ,html: '<label for="'+c+'-date-end-ymd-'+tp+i+'-'+w+'" class="x-form-item-label">End:</label>'
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
        //Ext.getCmp(config.record.window+'-left-col').collapse(false);
        Ext.getCmp(config.record.window+'-left-col').toggleCollapse(false);
        Ext.getCmp(c+'-details-tab').show();
        (!v)?Ext.getCmp(c+'-repeat-tab').show():'';
        Ext.getCmp(config.record.window+'-left-col').toggleCollapse(false);
    }
    Ext.applyIf(config,{
        title: modeTitle
        ,id: config.record.window+'-update-window'
        ,autoHeight: false
        ,height: Ext.getBody().getViewSize().height*.75
        ,width:Ext.getBody().getViewSize().width*.65
        ,autoScroll: false
        ,url: gcCalendar.config.connectorUrl
        ,closeAction:'close'
        ,baseParams: {
            action: (config.record.mode == 'update')?'mgr/gcCalendar/update':'mgr/gcCalendar/create'
        }
        ,fields: [{
            layout: 'column'
            ,defaults: {
                layout: 'form'
            }
            ,items: [{
                columnWidth: 0.3
                ,title: 'Time Information'
                ,items: [{
                    xtype: 'hidden'
                    ,id: config.record.window+'upid'
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
                    ,id: config.record.window+'allday'
                    ,checked: config.record.ad ? true:false
                    ,listeners: {
                        check:{fn:function(tht, value) {
                            var adFlag = Ext.getCmp(config.record.window+'allday');
                            var ed = Ext.getCmp(config.record.window+'timestart');
                            var sd = Ext.getCmp(config.record.window+'timeend');

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
                        ,id: config.record.window+'datestart'
                        ,value: config.record.startymd
                    },{
                        xtype: 'timefield'
                        ,anchor: '50%'
                        ,width:'100%'
                        ,split: true
                        ,columnWidth:.5
                        ,hidden: (config.record.ad)
                        ,name: 'starthis'
                        ,id: config.record.window+'timestart'
                        ,value: config.record.starthis
                    }]
                },{
                    fieldLabel: _('gcCalendar.end')
                    ,labelStyle:'margin-top:10px;display: block;margin-bottom: 0;'
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
                        ,id: config.record.window+'dateend'
                        ,value: config.record.endymd
                    },{
                        xtype: 'timefield'
                        ,anchor: '50%'
                        ,width:'100%'
                        ,split: true
                        ,hidden: (config.record.ad)
                        ,columnWidth:.5
                        ,name: 'endhis'
                        ,id: config.record.window+'timeend'
                        ,value: config.record.endhis
                    }]
                },{
                    xtype: 'superboxselect'
                    ,displayField: 'title'
                    ,valueField: 'id'
                    ,forceSelection: true
                    ,labelStyle:'margin-top:10px;display: block;margin-bottom: 0;'
                    ,store: new Ext.data.JsonStore({
                        root: 'results'
                        ,idProperty: 'id'
                        ,url: gcCalendar.config.connectorUrl
                        ,baseParams: {
                            action: 'mgr/store/getCals'
                        }
                        ,fields: [
                            'id', 'title'
                        ]
                    })
                    ,mode: 'remote'
                    ,triggerAction: 'all'
                    ,fieldLabel: _('gcCalendar.calendar')
                    ,hiddenName: 'cid[]'
                    ,name: 'cid[]'
                    ,id: config.record.window+'cid'
                    ,allowBlank: false
                    ,typeAhead:true
                    ,minChars:1
                    ,emptyText:('Select Calendar')
                    ,valueNotFoundText:('Calendar Not Found')
                    ,anchor:'100%'
                    ,value: config.record.cid
                },{
                    xtype: 'superboxselect'
                    ,displayField: 'ctitle'
                    ,valueField: 'id'
                    ,forceSelection: true
                    ,allowAddNewData: true
                    ,addNewDataOnBlur : true
                    ,store: new Ext.data.JsonStore({
                        root: 'results'
                        ,idProperty: 'id'
                        ,url: gcCalendar.config.connectorUrl
                        ,baseParams: {
                            action: 'mgr/store/getCategories'
                        }
                        ,fields: [
                            {name:'id',type:'int'}, {name:'ctitle',type:'string'}
                        ]
                    })
                    ,mode: 'remote'
                    ,triggerAction: 'all'
                    ,fieldLabel: _('gcCalendar.category')
                    ,name: 'cat[]'
                    ,hiddenName:'cat[]'
                    ,id: config.record.window+'cat'
                    ,allowBlank: false
                    ,typeAhead:true
                    ,minChars:1
                    ,emptyText:('Select Category')
                    ,valueNotFoundText:('Category Not Found')
                    ,anchor:'100%'
                    ,value: config.record.cat
                    ,listeners: {
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
                                url: conurl
                                ,params: catData
                                ,scope: this
                                ,success: function(response, opts){
                                    //console.log('Success.');
                                }
                                ,failure: function(response, opts) {
                                    //console.log('Failure.');
                                }
                            });
                        }
                    }
                }]
            },{
                columnWidth: 0.7
                ,items: [{
                    xtype: 'modx-tabs'
                    ,defaults: {
                        border: false
                        ,autoHeight: true
                        ,layout: 'form'
                    }
                    ,deferredRender: false
                    ,border: true
                    ,autoHeight: true
                    ,activeTab: 0
                    ,items: [{
                        title: 'Details'
                        ,id: config.record.window+'-details-tab'
                        ,items:[{
                            xtype: 'hidden'
                            ,name: 'previmage'
                            ,id:config.record.window+'update-image'
                            ,value: config.record.previmage

                        },{
                            fieldLabel: ('Image')
                        },{
                            xtype:'box'
                            ,id: config.record.window+'photoPreview'
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
                                ,id: config.record.window+'update-image-button'
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
                                                    ,id: config.record.window+'update-image-browser'+config.record.window
                                                    ,multiple: true
                                                    ,config: MODx.config
                                                    ,source: MODx.config.default_media_source || MODx.source
                                                    ,allowedFileTypes: 'gif,jpg,jpeg,png'
                                                    ,listeners: {
                                                        'select': {fn: function(data) {
                                                            Ext.getCmp(config.record.window+'update-image').setValue('/'+data.fullRelativeUrl);
                                                            Ext.getCmp(config.record.window+'photoPreview').el.dom.src= '/'+data.fullRelativeUrl;
                                                            Ext.getCmp(config.record.window+'photoPreview').show();
                                                            Ext.getCmp(config.record.window+'update-photo-remove').show();
                                                            Ext.getCmp(config.record.window+'-details-tab').show();
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
                                ,id: config.record.window+'update-photo-remove'
                                ,cls: 'x-btn-text bmenu'
                                ,style: { marginBottom: '15px'}
                                ,disabled: false
                                ,text: "Clear Image"
                                ,listeners: {
                                    'click':{
                                        fn: function(btn) {
                                            Ext.getCmp(config.record.window+'update-image').setValue('');
                                            Ext.getCmp(config.record.window+'photoPreview').el.dom.src= '';
                                            Ext.getCmp(config.record.window+'photoPreview').hide();
                                            Ext.getCmp(config.record.window+'update-photo-remove').hide();
                                            Ext.getCmp(config.record.window+'-details-tab').show();

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
                            ,id: config.record.window+'-notes'
                            ,anchor: '95%'
                            ,value: config.record.notes
                        }]
                    },{
                        title: 'Location'
                        ,id: config.record.window+'-location-tab'
                        ,items:[{
                            xtype: 'panel'
                            ,layout: 'form'
                            ,border: false
                            ,defaults: {
                                // applied to each contained item
                                // nothing this time
                                anchor:'100%'
                                ,layout: 'form'
                                ,labelWidth: '100'
                                ,cellCls: 'valign-center'

                            }
                            ,anchor: '95%'
                            ,autoHeight: true
                            ,items: [{
                                fieldLabel:('Contact Name')
                                ,xtype:'textfield'
                                ,name:'locationcontact'
                                ,value:config.record.locationcontact
                            },{
                                fieldLabel:('Contact Phone')
                                ,xtype:'textfield'
                                ,name:'locationphone'
                                ,value:config.record.locationphone
                            },{
                                fieldLabel:('Contact Email')
                                ,xtype:'textfield'
                                ,name:'locationemail'
                                ,vtype:'email'
                                ,value:config.record.locationemail
                            },{
                                fieldLabel:('Location Name')
                                ,xtype:'textfield'
                                ,name:'locationname'
                                ,value:config.record.locationname
                            },{
                                fieldLabel:('Address')
                                ,xtype:'textfield'
                                ,name:'locationaddr'
                                ,value:config.record.locationaddr
                            },{
                                layout:'column'
                                ,border: false
                                ,defaults: {
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
                                    split:true
                                    ,columnWidth:.5
                                    ,html:'<label class="x-form-item-label">City</label>'
                                },{
                                    split:true
                                    ,columnWidth:.2
                                    ,html:'<label class="x-form-item-label">State</label>'
                                },{
                                    split:true
                                    ,html:'<label class="x-form-item-label">Zip</label>'
                                },{
                                    split:true
                                    ,columnWidth:.5
                                    ,xtype:'textfield'
                                    ,name:'locationcity'
                                    ,value:config.record.locationcity
                                },{
                                    split:true
                                    ,columnWidth:.2
                                    ,xtype:'textfield'
                                    ,name:'locationstate'
                                    ,value:config.record.locationstate
                                },{
                                    split:true
                                    ,columnWidth:.3
                                    ,xtype:'textfield'
                                    ,name:'locationzip'
                                    ,value:config.record.locationzip
                                }]
                            }]
                        }]
                    },{
                        title: 'Repeating'
                        ,id: config.record.window+'-repeat-tab'
                        ,disabled: (config.record.mode == 'new')
                        ,items:[{
                            xtype: 'panel'
                            ,layout: 'form'
                            ,border: false
                            ,defaults: {
                                // applied to each contained item
                                // nothing this time
                                anchor:'100%'
                                ,layout: 'form'
                                ,labelWidth: '100'
                                ,cellCls: 'valign-center'

                            }
                            ,anchor: '95%'
                            ,autoHeight: true
                            ,items: [{
                                xtype:'fieldset'
                                ,checkboxToggle:true
                                ,title: ('Is a Repeating Event')
                                ,defaultType: 'textfield'
                                ,collapsed: (config.record.repeating!=1)
                                ,autoHeight: true
                                ,defaults: {
                                    layout:'fill'
                                }
                                ,listeners: {
                                    'beforecollapse' :  function(panel,ani) {
                                        // Hide all the form fields you need to hide
                                        Ext.getCmp('urepeating-'+config.record.window).setValue('false');
                                        return true; // this will avoid collapse of the field set
                                    },
                                    'beforeexpand' : function(panel,ani) {
                                        // Display all the fields
                                        Ext.getCmp('urepeating-'+config.record.window).setValue('true');
                                        return true; // this will avoid the default expand behaviour
                                    }
                                }
                                ,layout: 'form'
                                ,items :[
                                    {
                                        name: 'repeating'
                                        ,id: 'urepeating-'+config.record.window
                                        ,xtype:'hidden'
                                        ,value:config.record.repeating
                                    },{
                                        fieldLabel: 'Occurs'
                                        ,name: 'repeattype'
                                        ,id: 'urepeattype-'+config.record.window
                                        ,xtype:'combo'
                                        ,mode: 'local'
                                        ,store: new Ext.data.ArrayStore({
                                            id: 0
                                            ,fields: ['v', 'measure']
                                            ,data: [[0, ('Daily')],[1, ('Weekly')],[2, ('Monthly')],[3, ('Yearly')]]
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
                                                Ext.getCmp(config.record.window+'-urepeattype').setValue(r.id);
                                                var rt = Ext.getCmp('urepeattype-'+config.record.window);
                                                if(rt.getValue() === 1){
                                                    Ext.getCmp('urepeaton-'+config.record.window).show().setWidth('100%').syncSize();
                                                    Ext.getCmp('urepeatonmo-'+config.record.window).hide();
                                                    Ext.getCmp(config.record.window+'-urepeatonmow').hide();
                                                } else if(rt.getValue() === 2){
                                                    Ext.getCmp('urepeatonmo-'+config.record.window).show().setWidth('100%').syncSize();
                                                    Ext.getCmp('urepeaton-'+config.record.window).hide();
                                                } else { Ext.getCmp('urepeaton-'+config.record.window).hide(); Ext.getCmp('urepeatonmo-'+config.record.window).hide(); Ext.getCmp(config.record.window+'-urepeatonmow').hide();}
                                            }}
                                        }
                                    },{
                                        xtype: 'hidden'
                                        ,name: 'repeattype'
                                        ,id: config.record.window+'-urepeattype'
                                        ,value: config.record.repeattype
                                    },{
                                        fieldLabel: ('Repeat On')
                                        ,name: 'repeaton'
                                        ,id: 'urepeaton-'+config.record.window
                                        ,xtype: 'checkboxgroup'
                                        ,anchor: '100%'
                                        ,width:  '100%'
                                        ,hidden: config.record.repeattype == 1 ? false : true // hide on load
                                        ,items: [
                                            {boxLabel: ('Sun'), name: 'cb-auto-1', value: 0, checked: (config.record.repeattype==1)?!!(config.record.repeatonc.indexOf(',0,')!=-1):false}
                                            ,{boxLabel: ('Mon'), name: 'cb-auto-2', value: 1, checked: (config.record.repeattype==1)?!!(config.record.repeatonc.indexOf(',1,')!=-1):false }
                                            ,{boxLabel: ('Tues'), name: 'cb-auto-3', value: 2, checked: (config.record.repeattype==1)?!!(config.record.repeatonc.indexOf(',2,')!=-1):false}
                                            ,{boxLabel: ('Wed'), name: 'cb-auto-4', value: 3, checked: (config.record.repeattype==1)?!!(config.record.repeatonc.indexOf(',3,')!=-1):false}
                                            ,{boxLabel: ('Thurs'), name: 'cb-auto-5', value: 4, checked: (config.record.repeattype==1)?!!(config.record.repeatonc.indexOf(',4,')!=-1):false}
                                            ,{boxLabel: ('Fri'), name: 'cb-auto-6', value: 5, checked: (config.record.repeattype==1)?!!(config.record.repeatonc.indexOf(',5,')!=-1):false}
                                            ,{boxLabel: ('Sat'), name: 'cb-auto-7', value: 6, checked: (config.record.repeattype==1)?!!(config.record.repeatonc.indexOf(',6,')!=-1):false}
                                        ]

                                        ,listeners: {
                                            change:{fn:function(t,c){
                                                val = new Array;
                                                for (var i in c) {
                                                    if(c[i]['value'] || c[i]['value']==0)
                                                        val.push(c[i]['value']);
                                                }
                                                var flat = val.join();
                                                Ext.getCmp(config.record.window+'-urepeaton').setValue(flat);
                                            }}
                                        }
                                    },{
                                        xtype: 'hidden'
                                        ,name: 'repeaton'
                                        ,id: config.record.window+'-urepeaton'
                                        ,value: config.record.repeaton
                                    },{

                                        xtype: 'combo'
                                        ,displayField: 'n'
                                        ,valueField: 't'
                                        ,mode: 'local'
                                        ,store: new Ext.data.ArrayStore({
                                            id: 0
                                            ,fields: ['t','n']
                                            ,data: [['dom','Day of Month'],['dow','Day of Week']]
                                        })
                                        ,triggerAction: 'all'
                                        ,fieldLabel: ('Repeat On')
                                        ,name: 'repeatonmo[type]'
                                        ,hiddenName: 'repeatonmo[type]'
                                        ,id: 'urepeatonmo-'+config.record.window
                                        ,value: (config.record.repeatonmo)?config.record.repeatonmo.type:null
                                        ,typeAhead:true
                                        ,minChars:1
                                        ,hidden: config.record.repeattype == 2 ? false : true
                                        ,emptyText:('Repeat On')
                                        ,valueNotFoundText:('Repeat On')
                                        ,anchor:'100%'
                                        ,width:  '100%'
                                        ,listeners: {
                                            'change': {fn:function(t,n,o){
                                                var dow = Ext.getCmp(config.record.window+'-urepeatonmow');
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

                                        xtype: 'combo'
                                        ,displayField: 'n'
                                        ,valueField: 't'
                                        ,mode: 'local'
                                        ,store: new Ext.data.ArrayStore({
                                            id: 0
                                            ,fields: ['t','n']
                                            ,data: [['first','First Week'],['second','Second Week'],['third','Third Week'],['fourth','Fourth Week'],['last','Last Week']]
                                        })
                                        ,triggerAction: 'all'
                                        ,fieldLabel: ('Repeat Week')
                                        ,name: 'repeatonmo[week]'
                                        ,hiddenName: 'repeatonmo[week]'
                                        ,id: config.record.window+'-urepeatonmow'
                                        ,value: (config.record.repeatonmo)?config.record.repeatonmo.week:null
                                        ,typeAhead:true
                                        ,minChars:1
                                        ,hidden: (config.record.repeatonmo && config.record.repeatonmo.type == 'dow') ? false : true
                                        ,emptyText:('Repeat Week')
                                        ,valueNotFoundText:('Repeat Week')
                                        ,anchor:'100%'
                                        ,width:  '100%'
                                    },{
                                        fieldLabel: ('Repeat Frequency')
                                        ,name: 'repeatfrequency'
                                        ,id: 'urepeatfrequency-'+config.record.window
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
                                        ,id: 'urepeatenddate-'+config.record.window
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
                        title: 'Custom Dates'
                        ,id: config.record.window+'-custom-tab'
                        ,disabled: (config.record.mode == 'new')
                        ,items:[{
                            xtype: 'panel'
                            ,layout: 'form'
                            ,border: false
                            ,defaults: {
                                // applied to each contained item
                                // nothing this time
                                anchor:'100%'
                                ,layout: 'form'
                                ,labelWidth: '100'
                                ,cellCls: 'valign-center'

                            }
                            ,anchor: '95%'
                            ,autoHeight: true
                            ,items: [{
                                name: 'ov'
                                ,id: 'ucustom-'+config.record.window
                                ,xtype:'hidden'
                                ,submitValue:true
                                ,value:config.record.ov
                            },{
                                xtype: 'gcCalendar-grid-images'
                                ,evid: config.record.id

                            }]
                        }]
                    }]
                }]
            }]
        }]
    });
    gcCalendar.window.UpdategcCalendar.superclass.constructor.call(this,config);
    this.on('afterrender',function() {
        MODx.loadRTE(config.record.window+'-notes');
        Ext.getCmp(config.record.window+'-location-tab').show();
        Ext.getCmp(config.record.window+'-repeat-tab').show();
        Ext.getCmp(config.record.window+'-custom-tab').show();
        Ext.getCmp(config.record.window+'-details-tab').show();
        var w = this.getWidth()+2; this.setWidth(w);
    });
    this.on('close',function() {

    });
};
Ext.extend(gcCalendar.window.UpdategcCalendar,MODx.Window);

Ext.reg('gcCalendar-window-gcCalendar-update',gcCalendar.window.UpdategcCalendar);