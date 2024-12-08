import AuthForm from '../../components/auth_form/AuthForm';
import Footer from '~/components/Footer';
import NavBarLogin from '~/components/nav_bar_login/NavBarLogin';
export default function Login() {

    return (
        <main>
            <NavBarLogin />
            <AuthForm />
            <Footer />
        </main>
    );
}
