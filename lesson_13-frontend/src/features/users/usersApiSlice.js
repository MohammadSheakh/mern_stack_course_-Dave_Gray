import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"; // jei apiSlice ta create korsilam

const usersAdapter = createEntityAdapter({}); // specific to our user slice here..
//we can get here .. some normalized state here ...so, we should  start then working
// with data that has an ID's array and then also has entities.. now the entities
// can not be iterated over but the IDs can .. so, we will use the ID's to get data
// from entities ..

const initialState = usersAdapter.getInitialState(); // initial state users adapter er
// moddhe exist korle .. amra shetao niye ashtesi ..

// ekhon amra users er jonno API banabo ..
export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => ({
                // baseQuery er moddhe baseUrl bola chilo .. ekhon just endpoint
                // bole dite hobe ...
                url: "/users",
                validateStatus: (response, result) => {
                    // documentation onujayi amra status validate korte pari ..
                    return response.status === 200 && !result.isError;
                    // amra ensure kortesi .. result e jeno error na thake .. ar
                    // amader jeno status code 200 thake ..
                },
            }),
            // keepUnusedDataFor : 5, // second .. // default 60 second
            transformResponse: (responseData) => {
                // eta onek important .. jehetu amra mongoDB niye kaj kortesi ..
                // we are getting data from our back-end .. so, here we get the
                // response from the query .. then we are defining loadedUsers
                // amra joto gula user pabo .. mongoDB te jehetu _id te id ta generate
                // hoisilo .. amra sheta ke amader kaj korar shubidha er jonno user.id
                // te niye ashlam ..
                const loadedUsers = responseData.map((user) => {
                    user.id = user._id;
                    return user;
                });
                return usersAdapter.setAll(initialState, loadedUsers);
                // responseData er moddhe id property hishebe new value add korlam ..
                // usersAdapter er maddhome initialState er shathe loadedUsers o add
                // kore dilam
            },
            // provide tag .. that can be invalidated ..
            providesTags: (result, error, arg) => {
                // you could possibly get a result here .. that does not have id .
                // now thats probably when an error has occurred or you have got
                // something you did not expect ..
                if (result?.ids) {
                    // jodi ids property thake ?
                    return [
                        { type: "User", id: "LIST" },
                        ...result.ids.map((id) => ({ type: "User", id })), // id gula push kore dilam 🔴 bujhte hobe jinish ta
                    ];
                } else return [{ type: "User", id: "LIST" }]; // fail safe
            },
        }),
        addNewUser: builder.mutation({
            query: (initialUserData) => ({
                url: "/users",
                method: "POST",
                body: {
                    ...initialUserData,
                },
            }),
            invalidatesTags: [{ type: "User", id: "LIST" }],
        }),
        updateUser: builder.mutation({
            query: (initialUserData) => ({
                url: "/users",
                method: "PATCH",
                body: {
                    ...initialUserData,
                },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "User", id: arg.id },
            ],
        }),
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: `/users`,
                method: "DELETE",
                body: { id },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: "User", id: arg.id },
            ],
        }),
    }),
});

// going to create a hook .. based on this endpoints for us .. automatically
export const {
    useGetUsersQuery,
    useAddNewUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
} = usersApiSlice;

// ekhon amra kichu selector banabo ..

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();
// this gets the query result ..

// creates memoized selector
const selectUsersData = createSelector(
    selectUsersResult,
    (usersResult) => usersResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds,
    // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(
    (state) => selectUsersData(state) ?? initialState
);

// optimization e kaj e lage ..
