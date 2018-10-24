
package org.ozoneplatform.messaging.payload

import org.jivesoftware.smack.packet.Message
import org.junit.Test

import static org.hamcrest.CoreMatchers.equalTo
import static org.hamcrest.CoreMatchers.is
import static org.junit.Assert.assertThat


class OzoneMessageTests {


    private static final MSG_TO = "send.to.unit.test"
    private static final MSG_FROM = "sent.from.unit.test"
    private static final MSG_BODY = "Message Body"
    private static final MSG_SUBJECT = "Message Subject"
    private static final MSG_SRC_URL = "https://www.lmgtfy.com"

    @Test
    public void testCopyInto() {

        OzoneMessage ozMessage = new OzoneMessage(MSG_FROM, MSG_BODY)
        ozMessage.subject = MSG_SUBJECT
        
        ozMessage.addRecipients(["testAdmin1"])
        ozMessage.addRecipients(["testAdmin2"])
        ozMessage.sourceURL = MSG_SRC_URL
        
        Message message = new Message()
        ozMessage.copyInto(message)

        assertThat(message.body, is(equalTo(ozMessage.body)))
        assertThat(message.subject, is(equalTo(ozMessage.subject)))
        assertThat(message.getProperty(OzoneMessage.MESSAGE_SENT_FROM), is(equalTo(ozMessage.sender)))
        assertThat(message.getProperty(OzoneMessage.MESSAGE_RECIPIENTS).size(), is(equalTo(2)))
        assertThat(message.getProperty(OzoneMessage.MESSAGE_SOURCE_URL), is(equalTo(ozMessage.sourceURL)))
    }


    @Test
    public void testCreate() {
        Message message = new Message()
        message.body = MSG_BODY
        message.to = MSG_TO
        message.subject = MSG_SUBJECT
        message.setProperty(OzoneMessage.MESSAGE_SENT_FROM, MSG_FROM)
        message.setProperty(OzoneMessage.MESSAGE_SOURCE_URL, MSG_SRC_URL)
        OzoneMessage ozMessage = OzoneMessage.create(message)

        assertThat(ozMessage.to, is(equalTo(message.to)))
        assertThat(ozMessage.body, is(equalTo(message.body)))
        assertThat(ozMessage.subject, is(equalTo(message.subject)))
        assertThat(ozMessage.sender, is(equalTo(message.getProperty(OzoneMessage.MESSAGE_SENT_FROM))))
        assertThat(ozMessage.sourceURL, is(equalTo(message.getProperty(OzoneMessage.MESSAGE_SOURCE_URL))))
    }

}
