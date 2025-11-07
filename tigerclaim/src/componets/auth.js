// need to import css
// import this auth into frontpage.js or frontpage.tsx

// import {auth} from 'Tiger-Claim/tigerclaim/src/config/firebase.js'
// import {microsoft} from "firebase/auth";

// we can use microsoft single sign on or create an account

export const Auth = () => {
    const [email, setEmai] = useState("");
    const [password, setPassword] = useState("");

    const signIn = () => {

    };
    return (
            <div>
                <input placeholder="EMAIL..."/>
                <input placeholder="PASSWORD.."/>
                <button>Sign In</button>
            </div>
    );
};
