interface QueryStation {
    format : string;
    lang? : string;
    input : string;
}

interface QueryDepatureBoard {
    format : string;
    lang? : string;
    id : string;
    date : string;
    time : string;
}

interface QueryArrivalBoard {
    format : string;
    lang? : string;
    ref : string;
}

interface LocationResult extends String {

}