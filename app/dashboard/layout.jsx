import React from "react";
import Footer from "./_components/Footer";
import Header from "./_components/Header";


function DashboardLayout({children}){
    return (
        <div>
            <Header />
            <div className='mx-5 md:mx-20 lg:mx-36'>
            {children}
            </div>
            <Footer />
            </div>
    )
}

export default DashboardLayout;