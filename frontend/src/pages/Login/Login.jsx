import AuthForm from '../../components/auth_form/AuthForm';
import Footer from '~/components/Footer';
import Navbar from '~/components/navbar/Navbar';
import NavBarLogin from '~/components/nav_bar_login/NavBarLogin';
export default function Login() {

    return (
        <main>
            <Navbar />
            <AuthForm />
            <Footer />
        </main>
    );
}
