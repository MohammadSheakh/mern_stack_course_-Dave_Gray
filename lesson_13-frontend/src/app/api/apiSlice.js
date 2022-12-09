import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";

// fetchBaseQuery ta axios er moto kaj kore ...
const baseQuery = fetchBaseQuery({
    baseUrl: "https://technotes-api.onrender.com",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    // console.log(args) // request url, method, body
    // console.log(api) // signal, dispatch, getState()
    // console.log(extraOptions) //custom like {shout: true}

    let result = await baseQuery(args, api, extraOptions);

    // If you want, handle other status codes, too
    if (result?.error?.status === 403) {
        console.log("sending refresh token");

        // send refresh token to get new access token
        const refreshResult = await baseQuery(
            "/auth/refresh",
            api,
            extraOptions
        );

        if (refreshResult?.data) {
            // store the new token
            api.dispatch(setCredentials({ ...refreshResult.data }));

            // retry original query with new access token
            result = await baseQuery(args, api, extraOptions);
        } else {
            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Your login has expired.";
            }
            return refreshResult;
        }
    }

    return result;
};

// amra ekhane ekta API create kortesi ...
export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth, // amader baseQuery baseQueryWithReauth ke use korse
    tagTypes: ["Note", "User"], // for cached data, cache validation , invalidation ..
    endpoints: (builder) => ({}), // amra extended slices provide korbo ..
});

// export const apiSlice = createApi({
//     baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3500'}),
//     tagTypes: ["Note", "User"],
//     endpoints: (builder) => ({}),
// });

// ekhon amra usersApiSlice create korbo .. users folder er moddhe
