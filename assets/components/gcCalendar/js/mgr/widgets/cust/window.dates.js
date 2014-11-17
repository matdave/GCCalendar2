gcCalendar.window.Dates = function(config) {
    config = config || {};
    //console.log(config);
    config.evid = config.evid || 0;
    Ext.applyIf(config,{
        title: ('Time Information'),
        url: gcCalendar.config.connectorUrl,
        closeAction: 'close',
        baseParams: {
            action: 'mgr/gcCalendar/cust/save'
        },
        fields: [{
            xtype: 'statictextfield',
            name: 'id',
            fieldLabel: _('id'),
            submitValue: true,
            hidden: true
        },{
            xtype: 'statictextfield',
            name: 'evid',
            fieldLabel: (config.evid),
            value: config.evid,
            submitValue: true,
            hidden: true
        },{
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
                    /*{
                xtype: 'checkbox'
                ,labelStyle:'float:left;'
                ,fieldLabel: _('gcCalendar.ad')
                ,name: 'adcontain'
                ,id: config.winId+'allday'
                ,checked: (config.isNew)?false:(config.d.ad=='true')?true:false
                ,listeners:{check:{fn:function(tht, value) {

                    var adFlag = Ext.getCmp(config.winId+'allday');
                    var adsub = Ext.getCmp(config.winId+'ad');
                    var ed = Ext.getCmp(config.winId+'timestart');
                    var sd = Ext.getCmp(config.winId+'timeend');

                    //Ext.getCmp('cstartdate_fields').label.update(('mxcalendars.startdate_col_label'));

                    if(adFlag.getValue() === true){
                        if(ed.getValue() !== sd.getValue()){
                            ed.setValue(sd.getValue());
                        }
                        adsub.setValue(true);
                        ed.hide();
                        sd.hide();
                    } else {
                        adsub.setValue(false);
                        sd.show();
                        ed.show();
                    }
                }
            }}},*/
                    {xtype:'hidden', name:'ad', id: config.winId+'ad', submitValue:true, value: (config.isNew)?false:(config.d.ad=='true')?true:false },
                    {fieldLabel: _('gcCalendar.start')},{
                        xtype:'container'
                        ,layout: 'column'
                        ,anchor:'100%'
                        ,items:[{
                                xtype: 'datefield'
                                ,anchor: '50%'
                                ,split: true
                                ,columnWidth:.5
                                ,name: 'startymd'
                                ,id: config.winId+'datestart'
                                ,value: (config.isNew)?'':config.d.startymd
                                ,listeners: {
                                    'change':{fn:function(e,nv,ov){
                                        var ed = Ext.getCmp(config.winId+'dateend');
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
                               // ,hidden: (config.isNew)?false:(config.d.ad)
                                ,name: 'starthis'
                                ,id: config.winId+'timestart'
                                ,value: (config.isNew)?'':config.d.starthis
                        }]
            },{fieldLabel: _('gcCalendar.end'),labelStyle:'margin-top:10px;display: block;margin-bottom: 0;'},{
                        xtype:'container'
                        ,layout: 'column'
                        ,anchor:'100%'
                        ,items:[{
                                xtype: 'datefield'
                                ,anchor: '50%'
                                ,split: true
                                ,columnWidth:.5
                                ,name: 'endymd'
                                ,id: config.winId+'dateend'
                                ,value: (config.isNew)?'':config.d.endymd
                            },{
                                xtype: 'timefield'
                                ,anchor: '50%'
                            ,width:'100%'
                                ,split: true
                                //,hidden: (config.isNew)?false:(config.d.ad)
                                ,columnWidth:.5
                                ,name: 'endhis'
                                ,id: config.winId+'timeend'
                                ,value: (config.isNew)?'':config.d.endhis
                        }]
                    }

            ]}
            ]}
            ],
        listeners: {
            success: function() {
                Ext.getCmp(config.winId).refresh();
            }
        }
    });
    gcCalendar.window.Dates.superclass.constructor.call(this,config);
};
Ext.extend(gcCalendar.window.Dates,MODx.Window);
Ext.reg('gcCalendar-window-images',gcCalendar.window.Dates);