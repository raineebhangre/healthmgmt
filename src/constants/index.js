import {records, user, apps, screening} from "../assets";

export const navLinks=[
    {
        name: "dashboard",
        imageUrl: apps,
        link: "/",
    },
    {
        name: "records",
        imageUrl : records,
        link:"/medical-records",
    },
    {
        name:"screening",
        imageUrl: screening,
        link:"/screening-schedules",
    },
    {
        name: "profile",
        imageUrl: user,
        link: "/profile",
    },
];
