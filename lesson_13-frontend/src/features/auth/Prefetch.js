import { store } from "../../app/store";
import { notesApiSlice } from "../notes/notesApiSlice";
import { usersApiSlice } from "../users/usersApiSlice";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
/**
 * we need to create an active subscription that remains active even though new user / edit user
 * form .. in edit user .. we got the data and it is just using useSelector so, its not querying that
 * data again .. and thats why we dont have a subscription but we have queried that data .. we dont
 * wanna to send another query, when we have it . so, we are not using rtk query . although rtk query
 * would know we aleary had that data and create that subscription.. we are using a useSelector .. so
 *
 *
 * so we create a subscription that lasts for the duration of our protected pages
 * when we refresh the page and we still have that state including pre-filling our forms
 */
const Prefetch = () => {
    useEffect(() => {
        // may be manual subscription korlam
        store.dispatch(
            notesApiSlice.util.prefetch("getNotes", "notesList", {
                force: true,
            })
        );
        store.dispatch(
            usersApiSlice.util.prefetch("getUsers", "usersList", {
                force: true,
            })
        );
    }, []);

    return <Outlet />;
};
export default Prefetch;
