var gcCalendar = function(config) {
    config = config || {};
    gcCalendar.superclass.constructor.call(this,config);
};
Ext.extend(gcCalendar,Ext.Component,{
    page:{},window:{},grid:{},tree:{},panel:{},combo:{},config: {}
});
Ext.reg('gcCalendar',gcCalendar);
gcCalendar = new gcCalendar();