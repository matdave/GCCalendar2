Ext.onReady(function() {
    MODx.load({ xtype: 'gcCalendar-page-home'});
});
gcCalendar.page.Home = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        components: [{
            xtype: 'gcCalendar-panel-home'
            ,renderTo: 'gcCalendar-panel-home-div'
        }]
    });
    gcCalendar.page.Home.superclass.constructor.call(this,config);
};
Ext.extend(gcCalendar.page.Home,MODx.Component);
Ext.reg('gcCalendar-page-home',gcCalendar.page.Home);