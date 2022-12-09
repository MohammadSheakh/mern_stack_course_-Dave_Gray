import { useGetNotesQuery } from "./notesApiSlice"; // hook ta niye ashlam ..
import Note from "./Note";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";

const NotesList = () => {
    useTitle("techNotes: Notes List");

    const { username, isManager, isAdmin } = useAuth();

    // query hook ta use korlam...
    const {
        data: notes,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetNotesQuery("notesList", {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });
    // all of this will help us conditionally render some content , so underneath i'm
    // going to define some content ..
    let content;

    if (isLoading) content = <PulseLoader color={"#FFF"} />;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    }

    if (isSuccess) {
        const { ids, entities } = notes;

        let filteredIds;
        if (isManager || isAdmin) {
            filteredIds = [...ids];
        } else {
            filteredIds = ids.filter(
                (noteId) => entities[noteId].username === username
            );
        }

        const tableContent =
            ids?.length &&
            filteredIds.map((noteId) => <Note key={noteId} noteId={noteId} />);

        content = (
            <table className="table table--notes">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th note__status">
                            Username
                        </th>
                        <th scope="col" className="table__th note__created">
                            Created
                        </th>
                        <th scope="col" className="table__th note__updated">
                            Updated
                        </th>
                        <th scope="col" className="table__th note__title">
                            Title
                        </th>
                        <th scope="col" className="table__th note__username">
                            Owner
                        </th>
                        <th scope="col" className="table__th note__edit">
                            Edit
                        </th>
                    </tr>
                </thead>
                <tbody>{tableContent}</tbody>
            </table>
        );
    }

    return content;
};
export default NotesList;
