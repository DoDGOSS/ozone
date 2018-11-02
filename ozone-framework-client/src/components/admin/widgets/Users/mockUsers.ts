import { User } from "../../../../models";

export const users: User[] =
  // TODO - determine if we are using displayName over userRealname
  [
      {
        "totalStacks":2,
        "hasPWD":null,
        "totalGroups":0,
        "id":1,
        "displayName":"Test Administrator 1",
        "totalWidgets":0,
        "username":"testAdmin1",
        "email":"testAdmin1@ozone.test",
        "lastLogin":null,
        "totalDashboards":2
      },
      {
        "totalStacks":0,
        "hasPWD":null,
        "totalGroups":0,
        "id":2,
        "displayName":"Test User 4",
        "totalWidgets":0,
        "username":"testUser1",
        "email":"testUser1@ozone.test",
        "lastLogin":null,
        "totalDashboards":0
      },
      {
        "totalStacks":0,
        "hasPWD":null,
        "totalGroups":1,
        "id":3,
        "displayName":"test",
        "totalWidgets":0,
        "username":"test",
        "email":"test@gmail.com",
        "lastLogin":null,
        "totalDashboards":0
      }
  ];


//
// {
//     "success":true,
//     "data":[
//     {
//         "totalStacks":2,
//         "hasPWD":null,
//         "totalGroups":0,
//         "id":1,
//         "userRealName":"Test Administrator 1",
//         "totalWidgets":0,
//         "username":"testAdmin1",
//         "email":"testAdmin1@ozone.test",
//         "lastLogin":null,
//         "totalDashboards":2
//     },
//     {
//         "totalStacks":0,
//         "hasPWD":null,
//         "totalGroups":0,
//         "id":2,
//         "userRealName":"Test User 4",
//         "totalWidgets":0,
//         "username":"testUser1",
//         "email":"testUser1@ozone.test",
//         "lastLogin":null,
//         "totalDashboards":0
//     },
//     {
//         "totalStacks":0,
//         "hasPWD":null,
//         "totalGroups":1,
//         "id":3,
//         "userRealName":"test",
//         "totalWidgets":0,
//         "username":"test",
//         "email":"test@gmail.com",
//         "lastLogin":null,
//         "totalDashboards":0
//     }
// ],
//     "results":3
// }