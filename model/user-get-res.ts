export interface UserPortRequest {
    UID:          number;
    fname:        string;
    lname:        string;
    email:        string;
    password:     string;
    profile:      string;
    type:         number;
    limit_upload: number;
}
