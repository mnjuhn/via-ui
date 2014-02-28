/**
 * Controller to manage loading and rendering of map links and nodes.
 */
Ext.define('CC.controller.MainMapController', {

    extend: 'Ext.app.Controller',
    alias: 'widget.MainMapController',

    refs: [
      // Controller references, which query ExtJS for active component names
      // on selector.  Can then be accessed within controller by ref name.
      {
        // reference to MainMapPanel View
        ref: 'MainMapPanelView',
        selector: 'MainMapPanel'
      }
    ],

    init: function() {
      // Add event listeners here
      CC.util.EventManager.on('app:load-network', this.loadNetwork, this);

    },

    loadNetwork: function(networkId) {

      Ext.Ajax.request({
        scope: this,
        url: '/via-rest-api/project/1/scenario/1/network/'+networkId,
        method: 'GET',
        headers: {
          'Authorization': window.btoa('user:pass'),
          'DB': 'ccoradb.path.berkeley.edu'
        },
        success: function(responseObject){
            var text = responseObject.responseText;

            // convert response text to JSON
            var response = Ext.JSON.decode(text);

            // if request was successful, draw network
            if (response.success === true) {
              var network = response.resource;
              // Get map panel view, to draw network
              this.getMainMapPanelView().drawNetwork(network);
            } else {
              alert('Failed to load Network. ' + response.message);
            }

        }
      });
    }

});
