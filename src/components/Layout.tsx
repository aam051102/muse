import { Link } from "react-router-dom";

type IProps = {
    children?: React.ReactNode;
};

const Layout: React.FC<IProps> = ({ children }) => {
    return (
        <div className="bg-back min-h-screen">
            <header className="p-5 w-full">
                <Link to="/search">
                    <img
                        src={`${process.env.PUBLIC_URL}/logo.svg`}
                        alt="MUSE Logo"
                        className="inline"
                    />
                </Link>
            </header>

            <main className="px-10 py-5">{children}</main>
        </div>
    );
};

export default Layout;
