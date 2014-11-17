
gcCalendar.grid.Dates = function(config) {
    config = config || {};
    Ext.applyIf(config,{
        url: gcCalendar.config.connectorUrl,
        baseParams: {
            action: 'mgr/gcCalendar/cust/getlist',
            evid: config.evid
        },
        params: [],
        viewConfig: {
            forceFit: true,
            enableRowBody: true
        },
        tbar: [{
            xtype: 'button',
            text: ('Add Date'),
            handler: function() {
                win = new gcCalendar.window.Dates({winId: this.id,evid: config.evid, isNew: true});
                win.setValues({evid: config.evid});
                win.show();
            }
        }],
        paging: true,
        pageSize: 5,
        primaryKey: 'id',
        remoteSort: true,
        sortBy: 'order',
        fields: [
            {name: 'id', type: 'int'},
            {name: 'evid', type: 'int'},
            {name: 'start', type: 'string'},
            {name: 'startRAW', type: 'int'},
            {name: 'startymd', type: 'string'},
            {name: 'starthis', type: 'string'},
            {name: 'end', type: 'string'},
           // {name: 'endRAW', type: 'string'},
            {name: 'endymd', type: 'string'},
            {name: 'endhis', type: 'string'},
            {name: 'ad', type: 'string'}
        ],
        columns: [{
            header: ('ID'),
            dataIndex: 'id',
            sortable: true,
            width: 1,
            hidden: true
        },{
            header: ('Start Date')
            ,dataIndex: 'startymd'
            ,sortable: false
            ,width: 2
        },{
            header: ('Start Time')
            ,dataIndex: 'starthis'
            ,sortable: false
            ,width: 2
        },{
            header: ('End Date')
            ,dataIndex: 'endymd'
            ,sortable: false
            ,width: 2
            },{
            header: ('End Time')
            ,dataIndex: 'endhis'
            ,sortable: false
            ,width: 2
        }
            /*,{
            header: ('All Day')
            ,dataIndex: 'ad'
            ,width: 2
            ,sortable: false
        }*/]
    });
    gcCalendar.grid.Dates.superclass.constructor.call(this,config);
};
Ext.extend(gcCalendar.grid.Dates,MODx.grid.Grid,{
    getMenu: function() {
        var r = this.getSelectionModel().getSelected();
        var d = r.data;
        /* Prevent security error */
       // d['url'] = '';

        var m = [];
        m.push({
            text: ('Update'),
            handler: function () {
                win = new gcCalendar.window.Dates({winId: this.id, isNew: false, d:d});
                win.setValues(d);
                win.show();
            }
        },'-',{
            text: ('Remove'),
            handler: function () {
                console.log(d);
                MODx.msg.confirm({
                    title: _('gcCalendar.remove'),
                    text: _('confirm_remove'),
                    url: gcCalendar.config.connectorUrl,
                    params: {
                        action: 'mgr/gcCalendar/cust/remove',
                        id: d['id']
                    },
                    listeners: {
                        'success': { fn:function (r) {
                            this.refresh();
                        }, scope: this}
                    }
                });
            }
        });

        if (m.length > 0) {
            this.addContextMenuItem(m);
        }
    }
});
Ext.reg('gcCalendar-grid-images',gcCalendar.grid.Dates);