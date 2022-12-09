import { useParams } from "react-router-dom";
// we are going to get that user ID parameter ..  out of the url
import EditUserForm from "./EditUserForm";
import { useGetUsersQuery } from "./usersApiSlice"; // hook ta niye ashlam
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

const EditUser = () => {
    useTitle("techNotes: Edit User");

    const { id } = useParams(); // id nam e ashbe .. user er id

    // selectUserById hocche ekta memoized query jeta amra age use korechilam
    // memoized selector ..amra create korsilam users API Slice er moddhe
    // return e amra user ta pai . jetar moddhe id ase ..
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[id],
        }),
    });

    // user na thakle loading dekhabo ..
    if (!user) return <PulseLoader color={"#FFF"} />;

    // thakle .. EditUserForm er ke call korbo .. tar moddhe user er info vore dibo
    const content = <EditUserForm user={user} />;

    return content;
};
export default EditUser;
