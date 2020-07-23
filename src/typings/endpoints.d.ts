export interface LoginRequest {
    body: {
        username: string;
        password: string;
    };
    query: any;
    params: any;
}

export interface LoginReponse {
    token: string;
    refresh_token: string;
    expires_in: number;
}

export interface RefreshRequest {
    body: {
        refresh_token: string;
    };
    query: any;
    params: any;
}

export interface RefreshReponse {
    token: string;
    expires_in: number;
}
