// import { createValidator } from "./validate";
// import {
//     STORE_SCHEMA,
// } from "./schemas/store.schema";
//
// export interface AMLStoreDTO {
//     // singleton: boolean,
//     // mobileReady: boolean,
//     // visible: boolean,
//     // background:boolean,
//     // displayName: string,
//     // widgetTypes: string[],
//     // imageUrlMedium: string,
//     // width: integer,
//     // widgetUrl: string,
//     // imageUrlSmall: string,
//     // height: integer
//
//     // {"status":200,
//     //     "data":{
//     //         "singleton":false,
//     //         "mobileReady":false,
//     //         "visible":true,
//     //         "background":false,
//     //         "displayName":"",
//     //         "widgetTypes":["marketplace"],
//     //         "imageUrlMedium":"https://localhost:8441/marketplace/public//static/themes/common/images/themes/default/market_64x64.png",
//     //         "width":200,
//     //         "widgetUrl":"https://localhost:8441/marketplace",
//     //         "imageUrlSmall":"https://localhost:8441/marketplace/public//static/themes/common/images/themes/default/market_64x64.png",
//     //         "height":200
//     //     }
//     // }
// /*
// {
//     "categories":[
//         {"id":1,"title":"Accessories","description":"Accessories Description"},
//         {"id":2,"title":"Books and Reference","description":"Things made of paper"},
//         {"id":3,"title":"Business","description":"For making money"},
//         {"id":4,"title":"Communication","description":"Moving info between people and things"},
//         {"id":5,"title":"Education","description":"Educational in nature"},
//         {"id":6,"title":"Entertainment","description":"For fun"},
//         {"id":7,"title":"Finance","description":"For managing money"},
//         {"id":9,"title":"Media and Video","description":"Videos and media stuff"},
//         {"id":10,"title":"Music and Audio","description":"Using your ears"},
//         {"id":13,"title":"Shopping","description":"For spending your money"},
//         {"id":14,"title":"Sports","description":"Score more points than your opponent"}
//     ],
//     "listing_types":[
//         {"title":"Code Library","description":"code library"},
//         {"title":"Desktop App","description":"desktop app"},
//         {"title":"Web Application","description":"web applications"},
//         {"title":"Web Services","description":"web services"},
//         {"title":"Widget","description":"widget things"},
//         {"title":"API","description":"external apis"}],
//     "contact_types":[
//         {"id":1,"name":"Civilian","required":false},
//         {"id":2,"name":"Government","required":false},
//         {"id":3,"name":"Military","required":false}],
//     "intents":[
//         {"action":"/application/json/view","media_type":"vnd.aml-intent-v1+json.json","label":"view","icon":"/TODO","id":1},
//         {"action":"/application/json/edit","media_type":"vnd.aml-intent-v1+json.json","label":"edit","icon":"/TODO","id":2}],
//     "work_roles":[
//         {"id":1,"name":"Developer"},
//         {"id":2,"name":"Contractor"},
//         {"id":3,"name":"Manager"},
//         {"id":4,"name":"CEO"}],
//     "agencies":[
//         {"id":3,"title":"Ministry of Love","short_name":"Miniluv","icon":4,"listing_count":45},
//         {"id":2,"title":"Ministry of Peace","short_name":"Minipax","icon":3,"listing_count":42},
//         {"id":4,"title":"Ministry of Plenty","short_name":"Miniplen","icon":5,"listing_count":34},
//         {"id":1,"title":"Ministry of Truth","short_name":"Minitrue","icon":2,"listing_count":40},
//         {"id":5,"title":"Test","short_name":"Test","icon":6,"listing_count":5},
//         {"id":6,"title":"Test 1","short_name":"Test 1","icon":7,"listing_count":4},
//         {"id":8,"title":"Test 3","short_name":"Test 3","icon":9,"listing_count":3},
//         {"id":9,"title":"Test 4","short_name":"Test 4","icon":10,"listing_count":2},
//         {"id":7,"title":"Test 2","short_name":"Test2","icon":8,"listing_count":2}
//     ]
//     */
// }
// export const validateStore = createValidator<AMLStoreDTO>(STORE_SCHEMA);
//
//
// export interface AMLStoreGetResponse {
//     results: number;
//     data: AMLStoreDTO[];
// }
// export const validateStoreGetResponse = createValidator<StoreGetResponse>(STORE_GET_RESPONSE_SCHEMA);
//
//
// export interface AMLWidget {
//
//     agency: {
//             shortName: string,
//             title: string
//     },
//     approvedDate: string,
//     bannerIcon:{
//         id: number,
//         securityMarking: string,
//         url: string
//     },
//     descriptionShort: string,
//     editedDate: string,
//     id: number,
//     isPrivate: boolean,
//     isBookmarked: boolean,
//     launchUrl: string,
//     listingType: string,
//     owners:[{
//         id: number,
//         user:{ username: string },
//         displayName: string,
//         avatar: string | null
//     }],
//     rating: number,
//     securityMarking: string,
//     systemRequirements: string,
//     title: string,
//     totalReviews: number,
//     uniqueName: string | null,
//     usageRequirements: string,
//     isEnabled: boolean,
//     feedback: number
// /*
//
// "agency": {"shortName": "Minitrue", "title": "Ministry of Truth"},
// "approvedDate": "2019-06-05T19:09:59.264624Z",
// "bannerIcon":{"id":1263,"securityMarking":"UNCLASSIFIED","url":"http://localhost:8001/api/image/1263/"},
// "descriptionShort":"e",
// "editedDate":"2019-06-05T19:10:06.507800Z",
// "id":190,
// "isPrivate":false,
// "isBookmarked":false,
// "launchUrl":"https://teams.microsoft.com",
// "listingType":"Web Application",
// "owners":[{"id":1,"user":{"username":"bigbrother"},"displayName":"Big Brother","avatar":null}],
// "rating":0,
// "securityMarking":"UNCLASSIFIED",
// "systemRequirements":"None",
// "title":"Test Web App",
// "totalReviews":0,
// "uniqueName":null,
// "usageRequirements":"None",
// "isEnabled":true,
// "feedback":0
// */
// }
//
// export interface AMLSaveWidgetResponse {
//     success: boolean;
//     data: StoreDTO[];
// }
// export const validateStoreCreateResponse = createValidator<StoreCreateResponse>(STORE_CREATE_RESPONSE_SCHEMA);
