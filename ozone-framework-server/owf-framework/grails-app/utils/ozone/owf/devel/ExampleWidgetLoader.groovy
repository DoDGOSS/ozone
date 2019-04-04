package ozone.owf.devel

import grails.compiler.GrailsCompileStatic

import org.hibernate.SessionFactory

import ozone.owf.grails.domain.Intent
import ozone.owf.grails.domain.IntentDataType
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.PersonWidgetDefinition
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.domain.WidgetDefinitionIntent
import ozone.owf.grails.domain.WidgetType


@GrailsCompileStatic
class ExampleWidgetLoader {

    SessionFactory sessionFactory

    String baseUrl

    private WidgetType standardWidgetType

    void loadAndAssignExamplesWidgets() {
        standardWidgetType = WidgetType.findByName('standard')

        List<WidgetDefinition> widgets = []

        widgets << createChannelShouter()
        widgets << createChannelListener()

        widgets << createColorServer()
        widgets << createColorClient()

        widgets << createWidgetSearch()

        widgets << createPreferences()

        assignWidgetsToAllPersons(widgets)

        flushAndClearSession()
    }

    private static void assignWidgetsToAllPersons(List<WidgetDefinition> widgets) {
        Person.findAll().each { person ->
            widgets.eachWithIndex { widget, i ->
                new PersonWidgetDefinition(
                        person: person,
                        widgetDefinition: widget,
                        visible: true,
                        pwdPosition: i).save(failOnError: true)
            }
        }
    }

    private WidgetDefinition createChannelShouter() {
        new WidgetDefinition(
                widgetGuid: "1c21142a-d50a-4bd9-a928-6f9d626fd3b7",
                universalName: 'org.owfgoss.owf.examples.ChannelShouter',
                displayName: 'Channel Shouter',
                description: 'Broadcast a message on a specified channel.',
                widgetUrl: "${baseUrl}/channel_shouter.html",
                imageUrlMedium: '/images/widget-icons/ChannelShouter.png',
                imageUrlSmall: '/images/widget-icons/ChannelShouter.png',
                widgetVersion: '1.0',
                widgetTypes: [standardWidgetType],
                width: 400,
                height: 400).save(flush: true, failOnError: true)
    }

    private WidgetDefinition createChannelListener() {
        new WidgetDefinition(
                widgetGuid: '23134b74-5cec-499e-aeba-189f9af25ad6',
                universalName: 'org.owfgoss.owf.examples.ChannelListener',
                displayName: 'Channel Listener',
                description: 'Receive a message on a specified channel.',
                widgetUrl: "${baseUrl}/channel_listener.html",
                imageUrlMedium: '/images/widget-icons/ChannelListener.png',
                imageUrlSmall: '/images/widget-icons/ChannelListener.png',
                widgetVersion: '1.0',
                widgetTypes: [standardWidgetType],
                width: 400,
                height: 400).save(flush: true, failOnError: true)
    }

    private WidgetDefinition createColorServer() {
        new WidgetDefinition(
                widgetGuid: '782d37fa-b9cc-4af6-a4da-98913aebdf0a',
                universalName: 'org.owfgoss.owf.examples.ColorServer',
                displayName: 'Color Server',
                description: 'Simple eventing example that works in tandem with Color Client.',
                widgetUrl: "${baseUrl}/color_server.html",
                imageUrlMedium: '/images/widget-icons/ColorServer.png',
                imageUrlSmall: '/images/widget-icons/ColorServer.png',
                widgetVersion: '1.0',
                widgetTypes: [standardWidgetType],
                width: 400,
                height: 400).save(flush: true, failOnError: true)
    }

    private WidgetDefinition createColorClient() {
        new WidgetDefinition(
                widgetGuid: '6bc58b1d-a771-40e7-932b-e3e23044cc85',
                universalName: 'org.owfgoss.owf.examples.ColorClient',
                displayName: 'Color Client',
                description: 'Simple eventing example that works in tandem with Color Server.',
                widgetUrl: "${baseUrl}/color_client.html",
                imageUrlMedium: '/images/widget-icons/ColorClient.png',
                imageUrlSmall: '/images/widget-icons/ColorClient.png',
                widgetVersion: '1.0',
                widgetTypes: [standardWidgetType],
                width: 400,
                height: 400).save(flush: true, failOnError: true)
    }

    private WidgetDefinition createWidgetSearch() {
        new WidgetDefinition(
                widgetGuid: '5b88ec62-e2ed-471e-a5d1-f3e1b843eeff',
                universalName: 'org.owfgoss.owf.examples.WidgetSearch',
                displayName: 'Widget Search',
                description: 'Display a list of the current widgets.',
                widgetUrl: "${baseUrl}/widget_search.html",
                imageUrlMedium: '/images/widget-icons/WidgetLog.png',
                imageUrlSmall: '/images/widget-icons/WidgetLog.png',
                widgetVersion: '1.0',
                widgetTypes: [standardWidgetType],
                width: 400,
                height: 400).save(flush: true, failOnError: true)
    }

    private WidgetDefinition createPreferences() {
        new WidgetDefinition(
                widgetGuid: '07be8ffb-03eb-4de5-bd50-101172d094c0',
                universalName: 'org.owfgoss.owf.examples.Preferences',
                displayName: 'Preferences',
                description: 'Example that utilizes the Preferences API',
                widgetUrl: "${baseUrl}/preferences.html",
                imageUrlMedium: '/images/widget-icons/Preferences.png',
                imageUrlSmall: '/images/widget-icons/Preferences.png',
                widgetVersion: '1.0',
                widgetTypes: [standardWidgetType],
                width: 400,
                height: 400).save(flush: true, failOnError: true)
    }

    private WidgetDefinition createEventMonitor() {
        new WidgetDefinition(
                widgetGuid: generateUUID(),
                universalName: 'org.owfgoss.owf.examples.EventMonitor',
                displayName: 'Event Monitor Widget',
                description: 'Example that utilizes the Eventing API.',
                widgetUrl: "${baseUrl}/event_monitor",
                imageUrlMedium: 'static/themes/common/images/widget-icons/EventMonitor.png',
                imageUrlSmall: 'static/themes/common/images/widget-icons/EventMonitor.png',
                widgetVersion: '1.0',
                widgetTypes: [standardWidgetType],
                width: 500,
                height: 600).save(flush: true, failOnError: true)
    }

    private WidgetDefinition createNyse(Intent graphIntent, Intent viewIntent) {
        def nyseWidget = new WidgetDefinition(
                widgetGuid: generateUUID(),
                universalName: 'org.owfgoss.owf.examples.NYSE',
                displayName: 'NYSE Widget',
                description: 'This app component displays the end of day report for the New York Stock Exchange.',
                widgetUrl: "${baseUrl}/nyse",
                imageUrlMedium: 'static/themes/common/images/widget-icons/NYSEStock.png',
                imageUrlSmall: 'static/themes/common/images/widget-icons/NYSEStock.png',
                widgetVersion: '1.0',
                widgetTypes: [standardWidgetType],
                width: 825,
                height: 437).save(flush: true, failOnError: true)

        createWidgetDefinitionIntent(nyseWidget, graphIntent, IntentFlow.SEND)
        createWidgetDefinitionIntent(nyseWidget, viewIntent, IntentFlow.SEND)

        nyseWidget.refresh()

        nyseWidget
    }

    private WidgetDefinition createStockChart(Intent graphIntent) {
        def stockChartWidget = new WidgetDefinition(
                widgetGuid: generateUUID(),
                universalName: 'org.owfgoss.owf.examples.StockChart',
                displayName: 'Stock Chart',
                description: 'This app component charts stock prices.',
                widgetUrl: "${baseUrl}/stock_chart",
                imageUrlMedium: 'static/themes/common/images/widget-icons/PriceChart.png',
                imageUrlSmall: 'static/themes/common/images/widget-icons/PriceChart.png',
                widgetVersion: '1.0',
                widgetTypes: [standardWidgetType],
                width: 800,
                height: 600).save(flush: true, failOnError: true)

        createWidgetDefinitionIntent(stockChartWidget, graphIntent, IntentFlow.RECEIVE)

        stockChartWidget.refresh()

        stockChartWidget
    }

    private WidgetDefinition createHtmlViewer(Intent viewIntent) {
        def htmlViewer = new WidgetDefinition(
                widgetGuid: generateUUID(),
                universalName: 'org.owfgoss.owf.examples.HTMLViewer',
                displayName: 'HTML Viewer',
                description: 'This app component displays HTML.',
                widgetUrl: "${baseUrl}/html_viewer",
                imageUrlMedium: 'static/themes/common/images/widget-icons/HTMLViewer.png',
                imageUrlSmall: 'static/themes/common/images/widget-icons/HTMLViewer.png',
                widgetVersion: '1.0',
                widgetTypes: [standardWidgetType],
                width: 400,
                height: 600).save(flush: true, failOnError: true)

        createWidgetDefinitionIntent(htmlViewer, viewIntent, IntentFlow.RECEIVE)

        htmlViewer.refresh()

        htmlViewer
    }

    private static Intent createIntent(String action, List<String> mimeTypes) {
        def dataTypes = mimeTypes.collect { getOrCreateIntentDataType(it) }

        new Intent(action: action, dataTypes: dataTypes).save(flush: true, failOnError: true)
    }

    private static WidgetDefinitionIntent createWidgetDefinitionIntent(WidgetDefinition widgetDef,
                                                                       Intent intent, IntentFlow flow)
    {
        new WidgetDefinitionIntent(
                [widgetDefinition: widgetDef,
                 intent          : intent,
                 dataTypes       : intent.dataTypes.collect(),
                 send            : flow.canSend(),
                 receive         : flow.canReceive()]).save(flush: true, failOnError: true)
    }

    private static IntentDataType getOrCreateIntentDataType(String type) {
        IntentDataType.findByDataType(type) ?: new IntentDataType(dataType: type).save(flush: true, failOnError: true)
    }

    private static String generateUUID() {
        return UUID.randomUUID().toString()
    }

    private void flushAndClearSession() {
        sessionFactory.currentSession.with {
            flush()
            clear()
        }
    }

    enum IntentFlow {

        SEND,
        RECEIVE,
        SEND_AND_RECEIVE

        boolean canSend() {
            this == SEND || this == SEND_AND_RECEIVE
        }

        boolean canReceive() {
            this == RECEIVE || this == SEND_AND_RECEIVE
        }

    }

}
