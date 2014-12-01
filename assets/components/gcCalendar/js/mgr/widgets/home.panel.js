/**
 * Created with JetBrains PhpStorm.
 * User: Mat Jones
 * Date: 9/3/13
 * Time: 12:38 PM
 * To change this template use File | Settings | File Templates.
 */

gcCalendar.panel.Home = function(config) {
    config = config || {};
    Ext.apply(config,{
        border: false
        ,cls: 'container form-with-labels'
        ,items: [{
            html: '<h2>'+_('gcCalendar.management')+'</h2>'
            ,border: false
            ,cls: 'modx-page-header'
        },{
            xtype: 'modx-tabs'
            ,defaults: { border: false ,autoHeight: true }
            ,border: true
            ,items: [{
                title: _('gcCalendar.event_list')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('gcCalendar.event_management_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                 xtype: 'gcCalendar-grid-gcCalendar'
                 ,cls: 'main-wrapper'
                 ,preventRender: true
                }]
                ,listeners:{
                        activate : function(tabpanel){
                            Ext.getCmp('gcCalendar-grid-gcCalendar').refresh();
                        }
                    }

            },{
                title: _('gcCalendar.ensible')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('gcCalendar.ensible_management_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                 xtype: 'calendar-remote'
                 ,cls: 'main-wrapper'
                 ,preventRender: true
                 }]
                ,listeners:{
                    activate : function(tabpanel){
                        Ext.getCmp('calendar-remote-calendar').getActiveView().refresh(true);
                    }
                }
            },{
                title: _('gcCalendar.s')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('gcCalendar.cal_management_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                    xtype: 'gcCalendar-grid-gcCalendarCals'
                    ,cls: 'main-wrapper'
                    ,preventRender: true
                }]
            },{
                title: _('gcCalendar.categories')
                ,defaults: { autoHeight: true }
                ,items: [{
                    html: '<p>'+_('gcCalendar.cat_management_desc')+'</p>'
                    ,border: false
                    ,bodyCssClass: 'panel-desc'
                },{
                    xtype: 'gcCalendar-grid-gcCalendarCats'
                    ,cls: 'main-wrapper'
                    ,preventRender: true
                }]
            }
            ]
            // only to redo the grid layout after the content is rendered
            // to fix overflow components' panels, especially when scroll bar is shown up
            ,listeners: {
                'afterrender': function(tabPanel) {
                    tabPanel.doLayout();
                }
            }
        }]
    });
    gcCalendar.panel.Home.superclass.constructor.call(this,config);
};
Ext.extend(gcCalendar.panel.Home,MODx.Panel);
Ext.reg('gcCalendar-panel-home',gcCalendar.panel.Home);
