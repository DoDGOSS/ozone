<!DOCTYPE html>
<html>
    <head>
        <title>Channel Shouter</title>

        <g:if test="${params.themeName != null && params.themeName != ''}">
            <owf:themeStylesheet themeName="${params.themeName}"/>
        </g:if>
        <g:else>
            <owf:stylesheet src="static/vendor/ext-4.0.7/resources/css/ext-all.css"/>
            <owf:stylesheet src="static/css/dragAndDrop.css"/>
        </g:else>

        <owf:vendorJs src="ext-4.0.7/ext-all-debug.js"/>

        <owf:frameworkJs src="owf-widget.js"/>

        <script type="text/javascript">

             //The location is assumed to be at /<context>/js/eventing/rpc_relay.uncompressed.html if it is not set
             //OWF.relayFile = Ozone.util.contextPath() + '/js/eventing/rpc_relay.uncompressed.html';

            owfdojo.config.dojoBlankHtmlUrl = '${request.contextPath}/static/vendor/dojo-1.5.0-windowname-only/dojo/resources/blank.html';

            var scope = this;
            shoutInit = owfdojo.hitch(this, function () {

/***************** UNCOMMENT TO AUTO-LAUNCH CHANNEL LISTENER ************************
                OWF.Preferences.findWidgets({
                    searchParams: {
                        widgetName: 'Channel Listener'
                    },
                    onSuccess:function(result) {
                        scope.guid = result[0].id;
                    },
                    onFailure:function(err) {
                    }
                });
*************************************************************************************/

                //add handler to text field for dragging
                owfdojo.connect(document.getElementById('dragSource'), 'onmousedown', this, function(e) {
                    e.preventDefault();
                    var data = document.getElementById('InputChannel').value;
                    if (data != null && data != '') {
                        OWF.DragAndDrop.startDrag({
                            dragDropLabel: Ext.String.htmlEncode(data),
                            dragDropData: data
                        });
                    }
                });

            });

            shout = owfdojo.hitch(this, function () {
                var channel = document.getElementById('InputChannel').value;
                var message = document.getElementById('InputMessage').value;

                if (channel != null && channel != '') {

                    OWF.Eventing.publish(channel, message);

                    if (scope.guid != null && typeof scope.guid == 'string') {
                        var data = {
                            channel: channel,
                            message: message
                        };
                        var dataString = OWF.Util.toString(data);
/***************** UNCOMMENT TO AUTO-LAUNCH CHANNEL LISTENER ************************
                        OWF.Launcher.launch({
                            guid: scope.guid,
                            launchOnlyIfClosed: true,
                            title: 'Channel Listener Launched',
                            data: dataString
                        }, function(response) {

                            //check if the widgetLaunch call failed
                            if (response.error) {
                                //display error message
                            }
                        });
*************************************************************************************/
                    }
                }
            });

            ShouterStrings = {
                channel: 'Channel: ',
                message: 'Message: ',
                broadcast: 'Broadcast'
            };

            var lang = Ozone.lang.getLanguage();

            if (lang == 'es') {
                ShouterStrings.channel = 'Canal: ';
                ShouterStrings.message = 'Mensaje';
                ShouterStrings.broadcast = 'Difusion';
            }

            owfdojo.ready(function() {
                OWF.ready(shoutInit);
            });
        </script>
     </head>
    <body class="x-panel-body-default">
        <!-- begin changed jee -->
        <div class="innerContent">
            <div class="chanName">
                <script>
                    document.write(ShouterStrings.channel);
                </script>
                <input type="text" id="InputChannel" class="widgetFormInput" size="16"/>
                <span id="dragSource">
                  <img src="${request.contextPath}/static/themes/common/images/widget-icons/ChannelShouter.png"  height="16" width="16" style="vertical-align:middle" alt="Enter a Channel Name and then Drag me"/>
                </span>
            </div>
            <br/>
            <br/>
            <div class="msgName">
                <script>
                    document.write(ShouterStrings.message);
                </script>
                <textarea rows="5" id="InputMessage" class="widgetFormInput"></textarea>
            </div>
            <br/>
            <input type="submit" id='submitButton' value="" class="x-btn-default-small x-panel-body-default" onClick="shout();" style="float:left;"/>
            <script>
                document.getElementById('submitButton').value = ShouterStrings.broadcast;
            </script>
        </div>
        <!-- end changed jee -->
    </body>
</html>
