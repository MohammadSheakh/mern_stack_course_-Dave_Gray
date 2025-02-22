import { Routes, Route } from "react-router-dom"; // boom
// https://www.youtube.com/watch?v=CvCiNeLnZ00&list=PL0Zuz27SZ-6P4dQUsoDatjEGpmBpcOW8V&index=15
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditNote from "./features/notes/EditNote";
import NewNote from "./features/notes/NewNote";
import Prefetch from "./features/auth/Prefetch"; // eita important 🔴 dekhte hobe
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitle";

function App() {
    useTitle("Dan D. Repairs");

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* public routes */}
                <Route index element={<Public />} />
                <Route path="login" element={<Login />} />

                {/* Protected Routes */}
                <Route element={<PersistLogin />}>
                    <Route
                        element={
                            <RequireAuth
                                allowedRoles={[...Object.values(ROLES)]}
                            />
                        }
                    >
                        <Route element={<Prefetch />}>
                            <Route path="dash" element={<DashLayout />}>
                                <Route index element={<Welcome />} />

                                <Route
                                    element={
                                        <RequireAuth
                                            allowedRoles={[
                                                ROLES.Manager,
                                                ROLES.Admin,
                                            ]}
                                        />
                                    }
                                >
                                    <Route path="users">
                                        <Route index element={<UsersList />} />
                                        <Route
                                            path=":id"
                                            element={<EditUser />}
                                        />
                                        <Route
                                            path="new"
                                            element={<NewUserForm />}
                                        />
                                    </Route>
                                </Route>

                                <Route path="notes">
                                    <Route index element={<NotesList />} />
                                    <Route path=":id" element={<EditNote />} />
                                    <Route path="new" element={<NewNote />} />
                                </Route>
                            </Route>
                            {/* End Dash */}
                        </Route>
                    </Route>
                </Route>
                {/* End Protected Routes */}
            </Route>
        </Routes>
    );
}

export default App;
