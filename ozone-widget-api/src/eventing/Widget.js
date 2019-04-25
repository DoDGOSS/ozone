window.Ozone = window.Ozone || {};
var Ozone = window.Ozone;

/**
 * @ignore
 * @namespace
 */
Ozone.eventing = Ozone.eventing ? Ozone.eventing : {};

//-----------------------------------------------------------------
//Ozone Eventing Widget Object
//-----------------------------------------------------------------
/**
 * @deprecated Since OWF 3.7.0  You should use <a href="#.getInstance">Ozone.eventing.Widget.getInstance</a>
 * @constructor
 * @param {String} widgetRelay The URL for the widget relay file. The relay file must be specified with full location details, but without a fully
 * qualified path. In the case where the relay is residing @ http://server/path/relay.html, the path used must be from the context root of the local
 * widget. In this case, it would be /path/relay.html.  Do not include the protocol.
 * @param {Function} afterInit - callback to be executed after the widget is finished initializing.
 * @description The Ozone.eventing.Widget object manages the eventing for an individual widget (Deprecated).  This constructor is deprecated.
 *  You should use <a href="#.getInstance">Ozone.eventing.Widget.getInstance</a>
 * @example
 * this.widgetEventingController = new Ozone.eventing.Widget(
 * 'owf-sample-html/js/eventing/rpc_relay.uncompressed.html', function() {
 * 
 *  //put code here to execute after widget init - perhaps immediately publish to a channel
 * 
 * });
 * @throws {Error} throws an error with a message if widget initialization fails
 */
Ozone.eventing.Widget = function (widgetRelay, afterInit) {
    if (Ozone.eventing.Widget.instance == null) {
        Ozone.eventing.Widget.instance = this;
        this.isAfterInit = false;
        //connect passed in function to the internal callback function
        if (afterInit != null) {
            this.afterInitCallBack = afterInit.bind(this);
        }
        this.setWidgetRelay(widgetRelay);
        try {
            this.widgetInit();
        } catch (error) {
            throw 'Widget relay init failed. Relaying will not work. Inner Exception: ' + error.name + ": " + error.message;
        }
    } else {
        if (afterInit != null) {
            if (this.isAfterInit === false) {
                //connect passed in function to the internal callback function
                this.afterInitCallBack = afterInit.bind(this);
            } else {
                //already initialized just execute the supplied callback
                setTimeout(function () {
                    afterInit.call(Ozone.eventing.Widget.instance, Ozone.eventing.Widget.instance);
                }, 50);
            }
        }
    }
    return Ozone.eventing.Widget.instance;
};

/**
 * @description The location of the widget relay file.  The relay file should be defined
 *   globally for the entire widget by setting Ozone.eventing.Widget.widgetRelayURL to the relay file url, immediately after
 *   including the widget bundle javascript.  If the relay is not defined at all it is assumed to be at
 *   /[context]/js/eventing/rpc_relay.uncompressed.html. The relay file must be specified with full location details, but without a fully
 *   qualified path. In the case where the relay is residing @ http://server/path/relay.html, the path used must be from the context root of the local
 *   widget. In this case, it would be /path/relay.html.  Do not include the protocol.
 * @since OWF 3.7.0
 * @example
 * &lt;script type="text/javascript" src="../../js-min/owf-widget-min.js"&gt;&lt;/script&gt;
 * &lt;script&gt;
 *       //The location is assumed to be at /[context]/js/eventing/rpc_relay.uncompressed.html if it is not
 *       //set the path correctly below
 *       Ozone.eventing.Widget.widgetRelayURL = '/owf/js/eventing/rpc_relay.uncompressed.html';
 *       //...
 * &lt;/script&gt;
 *
 */
Ozone.eventing.Widget.widgetRelayURL = Ozone.eventing.Widget.widgetRelayURL ? Ozone.eventing.Widget.widgetRelayURL : null;

Ozone.eventing.Widget.prototype = {

    version: Ozone.version.owfversion + Ozone.version.eventing,

    /**
     * @ignore
     * @returns The URL for the widgetRelay
     * @description This should not be called from usercode.
     */
    getWidgetRelay : function() {
        return this.widgetRelay;
    },
    /**
     * @ignore
     * @param The relaypath to set.
     * @description This should not be called from usercode.
     */
    setWidgetRelay : function(relaypath) {
      //if null figure out path
      if (relaypath == null) {
        //check if global path variable was set
        if (Ozone.eventing.Widget.widgetRelayURL != null) {
          relaypath = Ozone.eventing.Widget.widgetRelayURL;
        }
        //else calculate a standard relative path
        else {
          //find root context - assume relay file is at /<context/js/eventing/rpc_relay.uncompressed.html
          var baseContextPath = window.location.pathname;
          var baseContextPathRegex = /^(\/[^\/]+\/).*$/i;
          var matches = baseContextPath.match(baseContextPathRegex);
          if (matches != null && matches[1] != null && matches[1].length > 0) {
            baseContextPath = matches[1];
            //remove final /
            baseContextPath = baseContextPath.substring(0,baseContextPath.length-1);
          }
          else {
            baseContextPath = '';
          }
          relaypath = baseContextPath + '/js/eventing/rpc_relay.uncompressed.html';
        }
      }
      this.widgetRelay = window.location.protocol + "//" + window.location.host + (relaypath.charAt(0) != '/'? ('/'+relaypath) : relaypath);
    },
    /**
     * @description Returns the Widget Id
     * @returns {String} The widgetId is a complex JSON encoded string which identifies a widget for Eventing.
     *   Embedded in this string is the widget's uniqueId as the 'id' attribute.  There is other data is in the string
     *   which is needed for Eventing and other APIs to function properly. This complex widgetId string may be used in
     *   the <a href="#publish">Ozone.eventing.Widget.publish</a> function to designate a specific recipient for a message.
     *   Additionally, once subscribed to a channel via <a href="#subscribe">Ozone.eventing.Widget.subscribe</a> during the
     *   receipt of a message, the sender's widgetId is made available as the first argument to the handler function.
     * @example
     * //decode and retrieve the widget's unique id
     * var complexIdString = this.eventingController.getWidgetId();
     * var complexIdObj = owfdojo.toJson(complexIdString);
     *
     * //complexIdObj will look like
     * // {
     * //  //widget's uniqueId
     * //  id:"49cd21f0-3110-8121-d905-18ffa81b442e"
     * // }
     *
     * //get Widget's uniqueId
     * alert('widget id = ' + complexIdObj.id);
     */
    getWidgetId : function() {
        return this.widgetId;
    },
    /**
     * @ignore
     * @returns The containerRelay
     * @description This should not be called from usercode.
     */
    getContainerRelay : function() {
        return this.containerRelay;
    },
    /**
     * @ignore
     * @description This method is called by the Widget's constructor. It should never be called from user code.
     */
    widgetInit : function() {
        var queryHash = {};
        var jsonString = null;

        //check for data in window.name
        var configParams = Ozone.util.parseWindowNameData();
        if (configParams != null) {

          //the id is the whole contents of the window.name
          this.widgetId = '{\"id\":\"' + configParams.id + '\"}';
          this.locked = configParams.locked;

          //embedded in the id is the relay
          this.containerRelay = configParams.relayUrl;
        }
        else {
          throw {
            name :'WidgetInitException',
            message :'The call to container_init failed. Inner Exception: '
          };
        }

        Ozone.internal.rpc.setParentTargetOrigin(this.containerRelay);
        Ozone.internal.rpc.setup();

        var onClickHandler;
        var onKeyDownHandler;

        var _this = this;

        function activateWidget() {
             var config = {
                 fn: "activateWidget",
                 params: {
                    guid: configParams.id,
                    focusIframe: document.activeElement === document.body
                 }
             };

             var stateChannel = '_WIDGET_STATE_CHANNEL_' + configParams.id;
             if (!_this.disableActivateWidget) {
               Ozone.internal.rpc.send(stateChannel, null, _this.widgetId, config);
             }
             else {
               _this.disableActivateWidget = false;
             }
        }

        //register for after_container_init
        Ozone.internal.rpc.register("after_container_init", function () {
            Ozone.internal.rpc.unregister("after_container_init");

            //attach mouse click and keydown listener to send activate calls for the widget
            if (!onClickHandler) {
                onClickHandler = activateWidget.bind(this);
                document.addEventListener("click", onClickHandler);
            }

            if (!onKeyDownHandler) {
                onKeyDownHandler = activateWidget.bind(this);
                document.addEventListener("keyup", onKeyDownHandler);
            }

            //execute callback
            _this.afterContainerInit();
        });

        Ozone.internal.rpc.register("_widget_activated", function () {
            if (onClickHandler) {
                document.removeEventListener("click", onClickHandler);
                onClickHandler = null;
            }

            if (onClickHandler) {
                document.removeEventListener("keyup", onKeyDownHandler);
                onKeyDownHandler = null;
            }
        });

        Ozone.internal.rpc.register("_widget_deactivated", function () {
            if (!onClickHandler) {
                onClickHandler = activateWidget.bind(this);
                document.addEventListener("click", onClickHandler);
            }

            if (!onKeyDownHandler) {
                onKeyDownHandler = activateWidget.bind(this);
                document.addEventListener("keyup", onKeyDownHandler);
            }
        });

        //register with container
        try {
            var idString = '{\"id\":\"' + configParams.id + '\"}';
            var data = {
              id: idString,
              version: this.version,
              useMultiPartMessagesForIFPC: true,
              relayUrl: this.widgetRelay
            };

            if (Ozone.util.pageLoad.loadTime != null && Ozone.util.pageLoad.autoSend) {
              data.loadTime = Ozone.util.pageLoad.loadTime;
            }

            jsonString = Ozone.util.toString(data);
            Ozone.internal.rpc.send('container_init', null, idString, jsonString);

        } catch (error) {
            throw {
                name :'WidgetInitException',
                message :'The call to container_init failed. Inner Exception: ' + error
            };
        }
    },

    isInitialized: function() {
      return this.isAfterInit;
    },

    /**
     * @ignore
     * default noop callback
     */
    afterInitCallBack: function(widgetEventingController) {

    },

    /**
     * @ignore
     * @description This method is called by the Widget's constructor. It should never be called from user code.
     */
     afterContainerInit: function() {
       this.isAfterInit = true;
       if (this.afterInitCallBack != null) {
         this.afterInitCallBack(this);
       }
     },

    /**
     * @ignore
     */
    registerHandler : function(handlerName, handlerObject) {
      //Simple wrapper for manager objects to register handler functions
      Ozone.internal.rpc.register(handlerName, handlerObject);
    },

    /**
     * @ignore
     * Wraps Ozone.internal.rpc.send.
     */
    send: function (targetId, serviceName, callback) {
        var varargs = Array.prototype.slice.call(arguments, 3);
        Ozone.internal.rpc.send(serviceName, callback, varargs);
    },

    /**
     * @description Subscribe to a named channel for a given function.
     * @param {String} channelName The channel to subscribe to.
     * @param {Function} handler The function you wish to subscribe.  This function will be called with three
     *   arguments: sender, msg, channel.
     * @param {String} [handler.sender] The first argument passed to the handler function is the id of the sender
     *   of the message.  See <a href="#getWidgetId">Ozone.eventing.Widget.getWidgetId</a>
     *   for a description of this id.
     * @param {Object} [handler.msg] The second argument passed to the handler function is the message itself.
     * @param {String} [handler.channel] The third argument passed to the handler function is the channel the message was
     *   published on.
     * @example
     * this.widgetEventingController = Ozone.eventing.Widget.getInstance();
     * this.widgetEventingController.subscribe("ClockChannel", this.update);
     *
     * var update = function(sender, msg, channel) {
     *     document.getElementById('currentTime').innerHTML = msg;
     * }
     *
     */
    subscribe : function(channelName, handler) {
        Ozone.internal.pubsub.subscribe(channelName, handler);
        return this;
    },
    /**
     * @description Unsubscribe to a named channel
     * @param {String} channelName The channel to unsubscribe to.
     * @example
     * this.widgetEventingController.unsubscribe("ClockChannel");
     */
    unsubscribe : function(channelName) {
        Ozone.internal.pubsub.unsubscribe(channelName);
        return this;
    },
    /**
     * @description Publish a message to a given channel
     * @param {String} channelName The name of the channel to publish to
     * @param {Object} message The message to publish to the channel.
     * @param {String} [dest] The id of a particular destination.  Defaults to null which sends to all
     *                 subscribers on the channel.  See <a href="#getWidgetId">Ozone.eventing.Widget.getWidgetId</a>
     *                 for a description of the id.
     * @param {String} accessLevel The minimum access level a widget must have to receive the message.
     * @example
     * this.widgetEventingController = Ozone.eventing.Widget.getInstance();
     * this.widgetEventingController.publish("ClockChannel", currentTimeString);
     */
    publish : function(channelName, message, dest, accessLevel) {
        Ozone.internal.pubsub.publish(channelName, message, dest, accessLevel);
        return this;
    }
};

/**
 * @description Retrieves Ozone.eventing.Widget Singleton instance
 * @param {Function} [afterInit] callback function to be executed after the Ozone.eventing.Widget singleton is initialized
 * @param {String} [widgetRelay] Optionally redefine the location of the relay file.  The relay file should be defined
 *   globally for the entire widget by setting Ozone.eventing.Widget.widgetRelayURL to the relay file url, immediately after
 *   including the widget bundle javascript.  If the relay is not defined at all it is assumed to be at
 *   /[context]/js/eventing/rpc_relay.uncompressed.html.  The relay file must be specified with full location details, but without a fully
 *   qualified path. In the case where the relay is residing @ http://server/path/relay.html, the path used must be from the context root of the local
 *   widget. In this case, it would be /path/relay.html.  Do not include the protocol.
 * @since OWF 3.7.0
 * @throws {Error} throws an error with a message if widget initialization fails
 * @example
 * &lt;script type="text/javascript" src="../../js-min/owf-widget-min.js"&gt;&lt;/script&gt;
 * &lt;script&gt;
 *       //The location is assumed to be at /[context]/js/eventing/rpc_relay.uncompressed.html if it is not
 *       //set the path correctly below
 *       Ozone.eventing.Widget.widgetRelayURL = '/owf/js/eventing/rpc_relay.uncompressed.html';
 *
 *       owfdojo.addOnLoad(function() {
 *         //get widget instance
 *         var widgetEventingController = Ozone.eventing.Widget.getInstance();
 *         //do something
 *         widgetEventingController.publish("FooChannel", 'message goes here');
 *       });
 * &lt;/script&gt;
 */
Ozone.eventing.Widget.getInstance = function (afterInit, widgetRelay) {
    if (Ozone.eventing.Widget.instance == null) {
        Ozone.eventing.Widget.instance = new Ozone.eventing.Widget(widgetRelay, afterInit);
    } else {
        var instance = Ozone.eventing.Widget.instance;
        if (afterInit != null) {
            if (!instance.isAfterInit) {
                instance.afterInitCallBack = afterInit.bind(instance);
            } else {
                // already initialized, execute the supplied callback
                setTimeout(function () {
                    afterInit.call(instance, instance);
                }, 50);
            }
        }
    }
    return Ozone.eventing.Widget.instance;
};
