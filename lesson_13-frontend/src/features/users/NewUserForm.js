import { useState, useEffect } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";
import useTitle from "../../hooks/useTitle";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const NewUserForm = () => {
    useTitle("techNotes: New User");

    // unlike the query it gives us the addNewUser function..
    // we can now call when we need it .. inside the component ..
    // er pore ekta object pai.. jeta status deliver kore function call korar
    // pore
    const [addNewUser, { isLoading, isSuccess, isError, error }] =
        useAddNewUserMutation();
    // query immediately call holeo .. ei addNewUser mutation function kintu
    // immediately call hoy na ..

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [validUsername, setValidUsername] = useState(false);
    // amader regex standards meet korle validUsername ta true hobe ..
    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [roles, setRoles] = useState(["Employee"]);

    // userName and password validate korte kaj e lagbe ..
    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username]);
    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    // isSuccess hoile shob form ke empty kore dibo
    useEffect(() => {
        if (isSuccess) {
            setUsername("");
            setPassword("");
            setRoles([]);
            navigate("/dash/users"); // user list e navigate korbo
        }
    }, [isSuccess, navigate]);

    // handlers gula likhbo
    const onUsernameChanged = (e) => setUsername(e.target.value);
    const onPasswordChanged = (e) => setPassword(e.target.value);

    const onRolesChanged = (e) => {
        const values = Array.from(
            e.target.selectedOptions, //HTMLCollection
            (option) => option.value
        );
        setRoles(values);
    };

    const canSave =
        [roles.length, validUsername, validPassword].every(Boolean) &&
        !isLoading;
    // shob gulai jodi true hoy and not loading hoy ...

    const onSaveUserClicked = async (e) => {
        e.preventDefault();
        if (canSave) {
            await addNewUser({ username, password, roles });
            // addNewUser mutation ta call korbo ...
        }
    };

    // egula config file theke ashbe .. select korar option gula ..
    const options = Object.values(ROLES).map((role) => {
        return (
            <option key={role} value={role}>
                {" "}
                {role}
            </option>
        );
    });

    // condition / state er upor base kore css class add korbo ..
    // css class jegula amra apply korteo pari .. abar na o korte pari ..
    const errClass = isError ? "errmsg" : "offscreen";
    const validUserClass = !validUsername ? "form__input--incomplete" : "";
    const validPwdClass = !validPassword ? "form__input--incomplete" : "";
    const validRolesClass = !Boolean(roles.length)
        ? "form__input--incomplete"
        : "";

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="form__title-row">
                    <h2>New User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="username">
                    Username: <span className="nowrap">[3-20 letters]</span>
                </label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password:{" "}
                    <span className="nowrap">[4-12 chars incl. !@#$%]</span>
                </label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

                <label className="form__label" htmlFor="roles">
                    ASSIGNED ROLES:
                </label>
                <select
                    id="roles"
                    name="roles"
                    className={`form__select ${validRolesClass}`}
                    multiple={true} // multiple value select kora jabe
                    size="3" // dropdown charai 3 ta value dekhabo
                    value={roles}
                    onChange={onRolesChanged}
                >
                    {options}
                </select>
            </form>
        </>
    );

    return content;
};
export default NewUserForm;
