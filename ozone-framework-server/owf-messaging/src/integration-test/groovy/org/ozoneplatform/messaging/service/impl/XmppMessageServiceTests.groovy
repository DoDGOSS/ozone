package org.ozoneplatform.messaging.service.impl

import grails.testing.mixin.integration.Integration
import org.ozoneplatform.messaging.payload.OzoneMessage
import org.ozoneplatform.messaging.service.XmppAgent

// NOTE: The tests below require an actual XMPP server that persists
// messages. The test authentication information must be entered in
// Config.groovy.
// TODO: Host local XMPP server during test instead of using real system. 
@Integration
class XmppMessageServiceTests {

    XmppMessageService messageService

    XmppAgent xmppAgent

    private static Date YESTERDAY

    void setup() {
        def calendar = new GregorianCalendar()
        calendar.add(GregorianCalendar.DAY_OF_MONTH, -1)
        YESTERDAY = calendar.getTime()
    }

    void testGroupSendAndReceive() {
        [1, 2, 3].each {
            Thread.sleep(1000)
            OzoneMessage message = new OzoneMessage(xmppAgent.xmppConfigurationService.userName, "Test Listing Modified by TestAdmin. " + it)
            message.subject  = "TEST Group Message Subject"
            message.href = "http://localhost:8080/marketplace/serviceItem/search?queryString="
            message.sourceURL = "http://ozoneplatform.org"
            message.classification = "U"

            messageService.sendGroupMessage(message)
        }

        Thread.sleep(1000)

        List messages = xmppAgent.getMessages(xmppAgent.xmppConfigurationService.room, YESTERDAY)

        println "Received messages..."
        messages.eachWithIndex {item, idx ->
            println "${idx}: ${item}"
        }

        println "Got ${messages.size} messages"

        assert messages.size >= 3
    }
}
