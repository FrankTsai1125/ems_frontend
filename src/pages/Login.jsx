import Form from "../components/Form";
import "../styles/Login.css";
import logoLight from "../assets/images/logo/logo.png"; // 載入亮色 logo

function Login() {

    return (
        <div 
            className="container-fluid" >
            <div className="row m-0">
                <div className="col-12 p-0">
                    <div className="login-card login-dark">
                        <div>
                            <div style={{ textAlign: 'center' }}>
                                <a className="logo">
                                    <img 
                                        className="img-fluid for-light" 
                                        src={logoLight} 
                                        alt="loginpage" 
                                        style={{ maxWidth: '90%', height: 'auto' }} 
                                    />
                                </a>
                            </div>
                            <div className="login-main">
                                <Form route="/auth/token/" method="post" />
                                <p className="mt-4 mb-0 center-text">Don't have account?
                                    <a className="ms-2" href="/register">Create Account</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;