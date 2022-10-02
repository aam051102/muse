type IProps = {
    children?: React.ReactNode;
};

const Layout: React.FC<IProps> = ({ children }) => {
    return (
        <div className="bg-back min-h-screen">
            <header className="absolute top-0 left-0 p-5 w-full">
                <a href="/">
                    <img src="/logo.svg" alt="MUSE Logo" className="inline" />
                </a>
            </header>

            {children}
        </div>
    );
};

export default Layout;
