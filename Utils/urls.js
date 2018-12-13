export const UrlsFull = {
    login: "https://www.planujsmeny.cz/index.php?o=login#",
    registration: "https://www.planujsmeny.cz/index.php?o=registration"
}

export const UrlsApi = {
    base_url: "https://www.planujsmeny.cz",
    login: "/index.php?o=ajax&ajax=appLogin&a=login",
    jobsAndWorkplaces: "/index.php?o=ajax&ajax=appLoadInfo&a=getWpsAndJobs",
    myShifts: "/index.php?o=ajax&ajax=appLoadInfo&a=loadMyShifts",
    shifts: "/index.php?o=ajax&ajax=appLoadShiftsForUser&a=loadShifts",
    relogin: "/index.php?o=ajax&ajax=appLogin&a=relogin",
    demoLogin:  "/index.php?o=ajax&ajax=appLogin&a=loginDemo&u=cinemaman",
    homepage: "/index.php?o=ajax&ajax=appLoadInfo&a=loadAllMainPageInfo",
    clockIn: "/index.php?o=ajax&ajax=appClockInR&a=clockIn",
    clockOut: "/index.php?o=ajax&ajax=appClockInR&a=clockOut",
    clockPause: "/index.php?o=ajax&ajax=appClockInR&a=pauseS",
    clockResume: "/index.php?o=ajax&ajax=appClockInR&a=pauseE",
    myTimes: "/index.php?o=ajax&ajax=appLoadAvailsForUser&a=loadAvails",
    myTimesAdd: "/index.php?o=ajax&ajax=appAvailability&a=addAvail",
    myTimesEdit: "/index.php?o=ajax&ajax=appAvailability&a=editAvail",
    users: "/index.php?o=ajax&ajax=appLoadInfo&a=loadActiveUsers",
    shiftsForWp: "/index.php?o=ajax&ajax=appLoadShifts&a=loadShifts",
    metadataShiftsForWp: "/index.php?o=ajax&ajax=appLoadInfo&a=getMetadataForPlanning",
    removeShift: "/index.php?o=ajax&ajax=appPlanShifts&a=removeShift",
    editShift: "/index.php?o=ajax&ajax=appPlanShifts&a=editShift",
    addShift: "/index.php?o=ajax&ajax=appPlanShifts&a=addShift",
    getShiftsUser: "/index.php?o=ajax&ajax=appPlanShifts&a=getUsers"
}